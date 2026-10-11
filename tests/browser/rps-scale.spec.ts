import { test, expect } from '../../src/Site.Web/browser-harness';

test('100-million-cell hardware simulation advances at full and close zoom', async ({ page }, testInfo) => {
  test.skip(process.env.SITE_HARDWARE_GPU !== '1', 'Opt in with SITE_HARDWARE_GPU=1 on Windows with hardware graphics.');
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.addInitScript(() => {
    const probe = { steps: 0, generation: 0, allocations: [] as number[][], uploads: 0, gpuTimes: [] as number[], renderer: '', maxTexture: 0 };
    Object.assign(window, { rpsScale: probe });
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof get>) {
      const context = get.apply(this, args);
      if (args[0] === 'webgl2' && context) Object.assign(window, { rpsScaleGl: context });
      return context;
    } as typeof get;
    const storage = WebGL2RenderingContext.prototype.texStorage2D;
    WebGL2RenderingContext.prototype.texStorage2D = function (this: WebGL2RenderingContext, ...args: Parameters<typeof storage>) {
      probe.allocations.push([args[2], args[3], args[4]]);
      return storage.apply(this, args);
    };
    const upload = WebGL2RenderingContext.prototype.texSubImage2D;
    WebGL2RenderingContext.prototype.texSubImage2D = function (this: WebGL2RenderingContext, ...args: Parameters<typeof upload>) {
      probe.uploads++; return upload.apply(this, args);
    } as typeof upload;
    const draw = WebGL2RenderingContext.prototype.drawArrays;
    const programs = new WeakMap<WebGLProgram, { size: WebGLUniformLocation | null; generation: WebGLUniformLocation | null }>();
    const pending: WebGLQuery[] = [];
    WebGL2RenderingContext.prototype.drawArrays = function (this: WebGL2RenderingContext, ...args: Parameters<typeof draw>) {
      const program = this.getParameter(this.CURRENT_PROGRAM) as WebGLProgram;
      let uniforms = programs.get(program);
      if (!uniforms) { uniforms = { size: this.getUniformLocation(program, 'uSize'), generation: this.getUniformLocation(program, 'uGeneration') }; programs.set(program, uniforms); }
      const simulation = uniforms.generation && this.getUniform(program, uniforms.size!) === 10000;
      if (!simulation) { draw.apply(this, args); return; }
      const debug = this.getExtension('WEBGL_debug_renderer_info');
      probe.renderer = debug ? this.getParameter(debug.UNMASKED_RENDERER_WEBGL) as string : '';
      probe.maxTexture = this.getParameter(this.MAX_TEXTURE_SIZE) as number;
      const timer = this.getExtension('EXT_disjoint_timer_query_webgl2') as { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number } | null;
      while (timer && pending.length && this.getQueryParameter(pending[0], this.QUERY_RESULT_AVAILABLE)) {
        const query = pending.shift()!;
        if (!this.getParameter(timer.GPU_DISJOINT_EXT)) probe.gpuTimes.push(Number(this.getQueryParameter(query, this.QUERY_RESULT)) / 1e6);
        this.deleteQuery(query);
      }
      const query = timer ? this.createQuery() : null;
      if (query) this.beginQuery(timer!.TIME_ELAPSED_EXT, query);
      draw.apply(this, args);
      if (query) { this.endQuery(timer!.TIME_ELAPSED_EXT); pending.push(query); }
      probe.steps++; probe.generation = Number(this.getUniform(program, uniforms.generation!));
    };
  });
  await page.goto('/gallery/rock-paper-scissors');
  const canvas = page.getByRole('img', { name: 'Rock Paper Scissors canvas' });
  await expect(canvas).toHaveAttribute('data-state', 'running');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Use 10,000 × 10,000 board' }).click();
  await expect(page.getByRole('status', { name: 'Rock Paper Scissors status' })).toContainText('10000 × 10000');
  await page.getByRole('button', { name: 'Fill board', exact: true }).click();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.waitForTimeout(1500);
  const sample = () => page.evaluate(() => {
    const state = window as unknown as { rpsScale: { steps: number; generation: number; allocations: number[][]; uploads: number; gpuTimes: number[]; renderer: string; maxTexture: number }; rpsScaleGl: WebGL2RenderingContext };
    state.rpsScaleGl.finish();
    const canvas = document.querySelector('canvas')!;
    const pixels = canvas.getContext('2d')!.getImageData(canvas.width / 2 - 32, canvas.height / 2 - 32, 64, 64).data;
    let checksum = 0;
    for (const value of pixels) checksum = (Math.imul(checksum, 31) + value) >>> 0;
    return { ...state.rpsScale, frames: Number(canvas.dataset.frames), time: performance.now(), checksum, error: state.rpsScaleGl.getError() };
  });
  const results = [];
  for (const zoom of ['1x', '26x']) {
    if (zoom === '26x') for (let i = 0; i < 8; i++) await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
    const before = await sample();
    await page.waitForTimeout(15000);
    const after = await sample(), seconds = (after.time - before.time) / 1000;
    const timings = after.gpuTimes.slice(before.gpuTimes.length);
    const result = { zoom, seconds, simulationHz: (after.steps - before.steps) / seconds, renderFps: (after.frames - before.frames) / seconds, averageGpuStepMs: timings.length ? timings.reduce((a, b) => a + b, 0) / timings.length : null, renderer: after.renderer, maxTexture: after.maxTexture };
    results.push(result);
    expect(after.error).toBe(0);
    expect(after.uploads).toBe(0);
    expect(after.allocations.filter(([format, width, height]) => format === 0x8232 && width === 10000 && height === 10000)).toHaveLength(2);
    expect(after.checksum).not.toBe(before.checksum);
    expect(result.simulationHz).toBeGreaterThan(20);
    expect(result.renderFps).toBeGreaterThan(20);
    await page.screenshot({ path: testInfo.outputPath(`rps-10000-${zoom}.png`) });
  }
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const paused = await sample(); await page.waitForTimeout(300);
  expect((await sample()).steps).toBe(paused.steps);
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  await testInfo.attach('rps-scale-results.json', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
  console.log(JSON.stringify(results));
});
