import { test, expect, AxeBuilder } from '../../src/Site.Web/browser-harness';
import { stepReference } from '../../src/Site.Web/app/features/gallery/sketches/rps-rules';

// Readback exists only in this test probe; the application never downloads its grid.
function installGpuProbe() {
  const steps: { input: number[]; output: number[]; size: number; generation: number; seed: number }[] = [];
  Object.assign(window, { rpsSteps: steps });
  const draw = WebGL2RenderingContext.prototype.drawArrays;
  WebGL2RenderingContext.prototype.drawArrays = function (this: WebGL2RenderingContext, ...args: Parameters<typeof draw>) {
    const program = this.getParameter(this.CURRENT_PROGRAM) as WebGLProgram;
    const sizeLocation = this.getUniformLocation(program, 'uSize');
    const size = sizeLocation ? this.getUniform(program, sizeLocation) as number : 0;
    const generationLocation = this.getUniformLocation(program, 'uGeneration');
    const framebuffer = this.getParameter(this.DRAW_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
    const texture = this.getParameter(this.TEXTURE_BINDING_2D) as WebGLTexture;
    const read = (output: boolean) => {
      const previous = this.getParameter(this.READ_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
      const temporary = this.createFramebuffer();
      this.bindFramebuffer(this.READ_FRAMEBUFFER, output && framebuffer ? framebuffer : temporary);
      if (!output || !framebuffer) this.framebufferTexture2D(this.READ_FRAMEBUFFER, this.COLOR_ATTACHMENT0, this.TEXTURE_2D, texture, 0);
      const pixels = new Uint8Array(size * size);
      this.readPixels(0, 0, size, size, this.RED_INTEGER, this.UNSIGNED_BYTE, pixels);
      this.bindFramebuffer(this.READ_FRAMEBUFFER, previous); this.deleteFramebuffer(temporary);
      return pixels;
    };
    const capture = size === 200 && !!generationLocation && steps.length < 12;
    const input = capture ? read(false) : undefined;
    draw.apply(this, args);
    if (size !== 200) return;
    const output = read(true);
    Object.assign(window, { rpsBoard: output, rpsSize: size });
    if (capture) steps.push({ input: Array.from(input!), output: Array.from(output), size, generation: this.getUniform(program, generationLocation!), seed: this.getUniform(program, this.getUniformLocation(program, 'uSeed')!) });
  } as typeof draw;
}

test('full board starts empty, paint has level four and lone-color growth stays bounded', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(installGpuProbe);
  await page.goto('/gallery/rock-paper-scissors');
  const canvas = page.getByRole('img', { name: 'Rock Paper Scissors canvas' });
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  const board = () => page.evaluate(() => {
    const { rpsBoard: pixels, rpsSize: size } = window as unknown as { rpsBoard: Uint8Array; rpsSize: number };
    let count = 0, extent = 0, zeroLevel = false;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (pixels[y * size + x]) {
      count++; extent = Math.max(extent, Math.abs(x - 100), Math.abs(y - 100));
      zeroLevel ||= pixels[y * size + x] >>> 2 === 0;
    }
    const center = pixels[100 * size + 100];
    return { size, count, extent, zeroLevel, center: [center & 3, center >>> 2] };
  });
  expect(await board()).toMatchObject({ size: 200, count: 0 });
  await canvas.focus(); await page.keyboard.press('Space');
  expect(await board()).toMatchObject({ count: 1, center: [1, 4] });
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByLabel('Neighbors needed to convert')).toHaveCount(0);
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await expect.poll(async () => (await board()).zeroLevel).toBe(true);
  await page.waitForTimeout(500);
  const grown = await board();
  expect(grown.count).toBeGreaterThan(1); expect(grown.extent).toBeLessThanOrEqual(4);
  expect(grown.center).toEqual([1, 4]);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await expect.poll(async () => (await board()).count).toBe(0);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('slider', { name: 'Brush radius (cells)' }).focus();
  await page.keyboard.press('End');
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Paint blue' }).click();
  await canvas.focus(); await page.keyboard.press('Space');
  expect(await board()).toMatchObject({ count: 40000, center: [3, 4] });
});

test('GPU generations match scalar rules for every color, strength and wrapped partition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(installGpuProbe);
  await page.goto('/gallery/rock-paper-scissors');
  await expect(page.getByRole('img', { name: 'Rock Paper Scissors canvas' })).toHaveAttribute('data-state', 'paused');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Fill board', exact: true }).click();
  // Discard empty warm-up steps, then compare real shader outputs over all four shifts.
  await page.evaluate(() => { (window as unknown as { rpsSteps: unknown[] }).rpsSteps.length = 0; });
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { rpsSteps: unknown[] }).rpsSteps.length)).toBe(12);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const steps = await page.evaluate(() => (window as unknown as { rpsSteps: { input: number[]; output: number[]; size: number; generation: number; seed: number }[] }).rpsSteps);
  for (const { input, output, size, generation, seed } of steps)
    expect(output).toEqual(Array.from(stepReference(Uint8Array.from(input), size, generation, seed)));
  expect(steps.some(step => step.input.some((value, i) => value !== step.output[i]))).toBe(true);
  const states = steps.flatMap(step => step.output).filter(Boolean);
  expect(new Set(states.map(value => value >>> 2))).toEqual(new Set([0, 1, 2, 3, 4]));
  expect(new Set(states.map(value => value & 3))).toEqual(new Set([1, 2, 3]));
});

test('board size clears on change and survives navigation independently of previews', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/gallery/rock-paper-scissors');
  const canvas = page.getByRole('img', { name: 'Rock Paper Scissors canvas' });
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  await canvas.focus(); await page.keyboard.press('Space');
  const painted = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('slider', { name: 'Board size (cells per side)' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('status', { name: 'Rock Paper Scissors status' })).toContainText('400 × 400');
  await page.getByRole('button', { name: 'Close settings' }).click();
  expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL())).not.toBe(painted);
  await page.getByRole('navigation').getByRole('link', { name: 'Gallery', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Rock Paper Scissors preview' })).toHaveAttribute('data-state', 'paused');
  await page.getByRole('link', { name: 'Rock Paper Scissors preview', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('slider', { name: 'Board size (cells per side)' })).toHaveValue('400');
});

test('unsupported board size explains the device limit and smaller settings recover', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const get = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function (this: WebGL2RenderingContext, parameter: number) {
      return parameter === this.MAX_TEXTURE_SIZE ? 4096 : get.call(this, parameter);
    };
  });
  await page.goto('/gallery/rock-paper-scissors');
  const canvas = page.getByRole('img', { name: 'Rock Paper Scissors canvas' });
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Use 10,000 × 10,000 board' }).click();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await expect(page.getByRole('alert')).toContainText('4096 × 4096');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Reset options', exact: true }).click();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('color painting, continuous strokes, zoom, pan, resize and GPU disposal work', async ({ page }, testInfo) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize({ width: 1000, height: 800 });
  await page.addInitScript(() => {
    const contexts: WebGL2RenderingContext[] = [];
    Object.assign(window, { rpsContexts: contexts });
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof get>) {
      const result = get.apply(this, args);
      if (args[0] === 'webgl2' && result) contexts.push(result as WebGL2RenderingContext);
      return result;
    } as typeof get;
  });
  await page.goto('/gallery/rock-paper-scissors');
  const canvas = page.getByRole('img', { name: 'Rock Paper Scissors canvas' });
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Clear board' }).click();
  await page.getByRole('button', { name: 'Close settings' }).click();
  const sample = (x: number, y: number) => canvas.evaluate((c: HTMLCanvasElement, p) => Array.from(c.getContext('2d')!.getImageData(p.x, p.y, 1, 1).data).slice(0, 3), { x, y });
  for (const [index, name] of ['red', 'green', 'blue'].entries()) {
    await page.getByRole('button', { name: `Paint ${name}` }).click();
    await expect(page.getByRole('button', { name: `Paint ${name}` })).toHaveAttribute('aria-pressed', 'true');
    await page.mouse.move(250 + index * 130, 350); await page.mouse.down();
    await page.mouse.move(330 + index * 130, 350, { steps: 4 }); await page.mouse.up();
    expect(await sample(290 + index * 130, 302)).toEqual([index === 0 ? 255 : 0, index === 1 ? 255 : 0, index === 2 ? 255 : 0]);
  }
  const snapshot = () => canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  const original = await snapshot();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click(); expect(await snapshot()).not.toBe(original);
  await page.getByRole('button', { name: 'Zoom out', exact: true }).click(); expect(await snapshot()).toBe(original);
  await page.mouse.move(400, 350); await page.mouse.wheel(0, -100);
  await expect.poll(snapshot).not.toBe(original);
  await page.getByRole('button', { name: 'Reset view', exact: true }).click(); expect(await snapshot()).toBe(original);
  await page.keyboard.down('Shift'); await page.mouse.move(400, 350); await page.mouse.down();
  await page.mouse.move(460, 380, { steps: 3 }); await page.mouse.up(); await page.keyboard.up('Shift');
  expect(await snapshot()).not.toBe(original);
  await page.getByRole('button', { name: 'Reset view', exact: true }).click(); expect(await snapshot()).toBe(original);
  await canvas.focus(); await page.keyboard.press('+'); expect(await snapshot()).not.toBe(original);
  await page.keyboard.press('0'); expect(await snapshot()).toBe(original);
  await page.setViewportSize({ width: 320, height: 850 });
  await expect.poll(() => canvas.evaluate(c => c.getBoundingClientRect().width)).toBe(320);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('rps-mobile.png'), fullPage: true });
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.getByRole('button', { name: 'About', exact: true })).toHaveCSS('color', 'rgb(239, 240, 254)');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('rps-mobile-light.png'), fullPage: true });
  await page.getByRole('navigation').getByRole('link', { name: 'Gallery', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { rpsContexts: WebGL2RenderingContext[] }).rpsContexts[0].isContextLost())).toBe(true);
  await expect(page.getByRole('img', { name: 'Rock Paper Scissors preview' })).toHaveAttribute('data-state', 'paused');
  await page.getByRole('link', { name: 'Rock Paper Scissors preview', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  await expect(page.getByRole('button', { name: 'Paint blue' })).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
});

test('touch paints and two-finger zoom avoids accidental brush marks', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); await page.emulateMedia({ reducedMotion: 'reduce' });
  const touch = await page.context().newCDPSession(page);
  await touch.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 });
  await page.goto('/gallery/rock-paper-scissors');
  const canvas = page.getByRole('img', { name: 'Rock Paper Scissors canvas' });
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Clear board' }).click();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Paint green' }).click();
  await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 250, y: 400, id: 1 }] });
  await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  expect(await canvas.evaluate((c: HTMLCanvasElement) => Array.from(c.getContext('2d')!.getImageData(250, 352, 1, 1).data))).toEqual([0, 255, 0, 255]);
  const snapshot = () => canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL()), original = await snapshot();
  await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 100, y: 300, id: 1 }, { x: 200, y: 300, id: 2 }] });
  await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 80, y: 300, id: 1 }, { x: 220, y: 300, id: 2 }] });
  await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  expect(await snapshot()).not.toBe(original);
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  expect(await snapshot()).toBe(original);
  await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 100, y: 500, id: 1 }] });
  await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y: 500, id: 1 }] });
  await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  expect(await canvas.evaluate((c: HTMLCanvasElement) => Array.from(c.getContext('2d')!.getImageData(150, 452, 1, 1).data))).toEqual([0, 255, 0, 255]);
  await touch.detach();
});

test('simulation advances, pauses, resumes and recovers after a lost graphics context', async ({ page }) => {
  await page.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof get>) {
      const result = get.apply(this, args);
      if (args[0] === 'webgl2' && result) Object.assign(window, { rpsContext: result });
      return result;
    } as typeof get;
  });
  await page.goto('/gallery/rock-paper-scissors');
  const canvas = page.getByRole('img', { name: 'Rock Paper Scissors canvas' });
  await expect(canvas).toHaveAttribute('data-state', 'running');
  await canvas.focus(); await page.keyboard.press('Space');
  const snapshot = () => canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL()), first = await snapshot();
  await expect.poll(snapshot).not.toBe(first);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const status = page.getByRole('status', { name: 'Rock Paper Scissors status' });
  const pausedGeneration = await status.textContent();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  const stopped = await snapshot(), frames = await canvas.getAttribute('data-frames');
  await page.waitForTimeout(350); expect(await snapshot()).toBe(stopped);
  expect(await canvas.getAttribute('data-frames')).toBe(frames);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(status).toHaveText(pausedGeneration!);
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  // A lone color can finish growing before pause; advancing generations still proves resume works.
  await expect(status).not.toHaveText(pausedGeneration!);
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.evaluate(() => (window as unknown as { rpsContext: WebGL2RenderingContext }).rpsContext.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(page.getByRole('alert')).toContainText('Graphics unavailable');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await expect(canvas).toHaveAttribute('data-state', 'running');
});

test('unavailable graphics fails locally and the rest of the gallery remains usable', async ({ page }) => {
  await page.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof get>) {
      return args[0] === 'webgl2' ? null : get.apply(this, args);
    } as typeof get;
  });
  await page.goto('/gallery/rock-paper-scissors');
  await expect(page.getByRole('alert')).toContainText('WebGL 2');
  await page.getByRole('navigation').getByRole('link', { name: 'Gallery', exact: true }).click();
  await page.getByRole('link', { name: 'Tetris preview', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Tetris canvas' })).toHaveAttribute('data-state', 'running');
});
