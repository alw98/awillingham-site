import { test, expect, AxeBuilder } from '../../src/Site.Web/browser-harness';
import inventory from '../../docs/contracts/legacy-gallery.json';
const fingerprint = (canvas: HTMLCanvasElement) => {
  const data = canvas.toDataURL(); let hash = 2166136261;
  for (let i = 0; i < data.length; i++) hash = Math.imul(hash ^ data.charCodeAt(i), 16777619);
  return hash >>> 0;
};

test('Tetris reference supports focused input, pause, resizing and disposal', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/gallery/tetris');
  const canvas = page.getByRole('img', { name: 'Tetris canvas' });
  await expect(canvas).toHaveAttribute('data-state', 'running');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  const before = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.keyboard.press('w');
  expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL())).toBe(before);
  await canvas.focus(); await page.keyboard.press('w');
  expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL())).not.toBe(before);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Drop', exact: true }).click();
  await page.setViewportSize({ width: 375, height: 800 });
  await expect.poll(() => canvas.evaluate(c => c.getBoundingClientRect().width)).toBeLessThanOrEqual(375);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Resume' }).click();
  await expect(canvas).toHaveAttribute('data-state', 'running');
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.screenshot({ path: testInfo.outputPath('tetris-mobile.png'), fullPage: true });
  const old = await canvas.elementHandle();
  await page.getByRole('navigation').getByRole('link', { name: 'Colors', exact: true }).click();
  await expect(page.locator('#page-title')).toHaveText('Colors');
  const frame = await old!.getAttribute('data-frames');
  await page.waitForTimeout(150);
  expect(await old!.getAttribute('data-frames')).toBe(frame);
  await page.goto('/gallery/tetris'); await expect(page.locator('canvas')).toHaveAttribute('data-state', 'running');
  expect(errors).toEqual([]);
});

test('reduced motion renders a static reference until explicitly played', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/gallery/tetris');
  const canvas = page.locator('canvas');
  await expect(canvas).toHaveAttribute('data-state', 'paused');
  const frames = await canvas.getAttribute('data-frames');
  await page.waitForTimeout(150); expect(await canvas.getAttribute('data-frames')).toBe(frames);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await expect(canvas).toHaveAttribute('data-state', 'running');
  await page.goto('/gallery');
  await expect(page.locator('canvas[data-state="paused"]')).toHaveCount(15);
  const initialFrames = await page.locator('canvas').evaluateAll(canvases => canvases.map(element => element.getAttribute('data-frames')));
  await page.waitForTimeout(150);
  expect(await page.locator('canvas').evaluateAll(canvases => canvases.map(element => element.getAttribute('data-frames')))).toEqual(initialFrames);
});

test('all 15 gallery presets render real seeded canvases with accessible controls', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1000 });
  for (const preset of inventory.presets) {
    await page.goto('/gallery/' + preset.slug);
    const canvas = page.locator('canvas');
    await expect(canvas).toHaveAttribute('data-state', 'paused');
    // Every implementation draws more than its flat background, including static images.
    const colors = await canvas.evaluate((element: HTMLCanvasElement) => {
      const pixels = element.getContext('2d')!.getImageData(0, 0, element.width, element.height).data;
      const colors = new Set<number>();
      for (let i = 0; i < pixels.length; i += 16) colors.add(pixels[i] * 65536 + pixels[i + 1] * 256 + pixels[i + 2]);
      return colors.size;
    });
    expect(colors, preset.slug).toBeGreaterThan(5);
    await expect(page.getByText('Not yet available', { exact: false })).toHaveCount(0);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations, preset.slug).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`gallery-${preset.slug}.png`), fullPage: true });
    const initial = await canvas.evaluate(fingerprint);
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations, `${preset.slug} settings`).toEqual([]);
    const sliders = page.getByRole('slider');
    if (await sliders.count()) {
      const value = await sliders.first().inputValue();
      const max = await sliders.first().getAttribute('max');
      await sliders.first().focus(); await page.keyboard.press(Number(value) >= Number(max) ? 'ArrowLeft' : 'ArrowRight');
      await expect(sliders.first()).not.toHaveValue(value);
      await page.getByRole('button', { name: 'Reset options' }).click();
      await expect.poll(() => canvas.evaluate(fingerprint)).toBe(initial);
    }
  }
  expect(errors).toEqual([]);
});

test('all visible animated previews run and offscreen, hidden and unmounted previews pause', async ({ page }) => {
  const visibleAnimatedCount = () => page.locator('canvas').evaluateAll(elements => elements.filter(canvas => {
    const bounds = canvas.getBoundingClientRect();
    const slug = canvas.closest('a')!.pathname.split('/').at(-1)!;
    return bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth && !slug.startsWith('edge-detection') && slug !== 'times-tables-static';
  }).length);
  await page.setViewportSize({ width: 1280, height: 1300 });
  await page.goto('/gallery');
  await expect(page.locator('canvas')).toHaveCount(15);
  await expect(page.locator('canvas[data-state="running"], canvas[data-state="paused"]')).toHaveCount(15);
  const visible = await visibleAnimatedCount();
  expect(visible).toBeGreaterThan(4);
  await expect(page.locator('canvas[data-state="running"]')).toHaveCount(visible);
  const moving = await page.locator('canvas[data-state="running"]').elementHandles();
  const initialFrames = await Promise.all(moving.map(canvas => canvas.getAttribute('data-frames')));
  await expect.poll(async () => (await Promise.all(moving.map(canvas => canvas.getAttribute('data-frames')))).every((frame, index) => Number(frame) > Number(initialFrames[index]))).toBe(true);
  const first = page.locator('canvas').first();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(first).toHaveAttribute('data-state', 'paused');
  const frame = await first.getAttribute('data-frames');
  await page.waitForTimeout(150); expect(await first.getAttribute('data-frames')).toBe(frame);
  await expect(page.locator('canvas[data-state="running"]')).toHaveCount(await visibleAnimatedCount());
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(page.locator('canvas[data-state="running"]')).toHaveCount(0);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect.poll(() => page.locator('canvas[data-state="running"]').count()).toBeGreaterThan(0);
  const handles = await page.locator('canvas').elementHandles();
  await page.getByRole('navigation').getByRole('link', { name: 'Colors', exact: true }).click();
  await expect(page.locator('#page-title')).toHaveText('Colors');
  const oldFrames = await Promise.all(handles.map(c => c.getAttribute('data-frames')));
  await page.waitForTimeout(150);
  expect(await Promise.all(handles.map(c => c.getAttribute('data-frames')))).toEqual(oldFrames);
});

test('pointer actions, theme inputs, resizing and instance isolation work', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/gallery/particle-field');
  await expect(page.locator('canvas')).toHaveAttribute('data-state', 'paused');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Particle Field status' })).toContainText('20 particles');
  await page.getByRole('button', { name: 'Add particle' }).click();
  await expect(page.getByRole('status', { name: 'Particle Field status' })).toContainText('21 particles');
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.locator('canvas').click({ position: { x: 100, y: 100 } });
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Particle Field status' })).toContainText('22 particles');
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Gallery', exact: true }).click();
  await expect(page.locator('#page-title')).toHaveText('Gallery');
  await page.getByRole('link', { name: /Particle Field preview/ }).click();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Particle Field status' })).toContainText('20 particles');
  await page.getByRole('button', { name: 'Close settings' }).click();
  const before = await page.locator('canvas').evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect.poll(() => page.locator('canvas').evaluate((c: HTMLCanvasElement) => c.toDataURL())).not.toBe(before);
  for (const slug of ['snow-globe', 'fireworks', 'sine-sums', 'edge-detection-agate', 'bouncy-dvd']) {
    await page.goto('/gallery/' + slug); await expect(page.locator('canvas')).toHaveAttribute('data-state', 'paused');
    await page.setViewportSize({ width: 320, height: 850 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('canvas')).toHaveAttribute('data-state', 'paused');
    await page.screenshot({ path: testInfo.outputPath(`gallery-${slug}-mobile.png`), fullPage: true });
    await page.setViewportSize({ width: 1280, height: 900 });
  }
});

test('image jobs terminate on completion and on navigation before results arrive', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeWorker = window.Worker;
    Object.assign(window, { activeImageWorkers: 0 });
    window.Worker = class extends NativeWorker {
      private pending: number | undefined;
      private ended = false;
      constructor(url: string | URL, options?: WorkerOptions) { super(url, options); Object.assign(window, { activeImageWorkers: (window as unknown as { activeImageWorkers: number }).activeImageWorkers + 1 }); }
      postMessage(message: unknown, transferOrOptions?: Transferable[] | StructuredSerializeOptions) {
        this.pending = window.setTimeout(() => {
          if (Array.isArray(transferOrOptions)) super.postMessage(message, transferOrOptions);
          else super.postMessage(message, transferOrOptions);
        }, 400);
      }
      terminate() { if (!this.ended) { this.ended = true; clearTimeout(this.pending); Object.assign(window, { activeImageWorkers: (window as unknown as { activeImageWorkers: number }).activeImageWorkers - 1 }); } super.terminate(); }
    };
  });
  await page.goto('/gallery/edge-detection-agate');
  await expect.poll(() => page.evaluate(() => (window as unknown as { activeImageWorkers: number }).activeImageWorkers)).toBe(1);
  await page.getByRole('navigation').getByRole('link', { name: 'Colors', exact: true }).click();
  await expect(page.locator('#page-title')).toHaveText('Colors');
  expect(await page.evaluate(() => (window as unknown as { activeImageWorkers: number }).activeImageWorkers)).toBe(0);
  await page.getByRole('navigation').getByRole('link', { name: 'Gallery', exact: true }).click();
  await expect(page.locator('#page-title')).toHaveText('Gallery');
  await expect.poll(() => page.evaluate(() => (window as unknown as { activeImageWorkers: number }).activeImageWorkers)).toBe(0);
});
