import { test, expect, AxeBuilder } from '../../src/Site.Web/browser-harness';
import { dark } from '../../src/Site.Web/app/features/themes/palettes';

test('viewport canvas, top About and gear dialogs preserve keyboard and mobile access', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/gallery/times-tables-animated');
  const canvas = page.locator('canvas');
  const bounds = await canvas.boundingBox();
  expect(bounds?.width).toBe(1280); expect(bounds?.height).toBe(852);
  expect(await page.getByRole('slider').count()).toBe(0);
  const gear = page.getByRole('button', { name: 'Settings', exact: true });
  await gear.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close settings' })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(gear).toBeFocused();
  const about = page.getByRole('button', { name: 'About', exact: true });
  expect((await about.boundingBox())!.y).toBe(48);
  await about.click(); await expect(page.getByRole('link', { name: 'Mathologer' })).toHaveAttribute('href', /youtube/);
  await page.keyboard.press('Escape'); await expect(about).toBeFocused();
  await page.setViewportSize({ width: 320, height: 850 }); await gear.click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
});

test('Times Tables options survive navigation and large radii affect actual output', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/gallery/times-tables-animated');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  const rate = page.getByRole('slider', { name: /^Multiplier change rate/ });
  await rate.focus(); await page.keyboard.press('Home');
  const radius = page.getByRole('slider', { name: /^Radius/ });
  const setRadius = async (value: number) => radius.evaluate((input: HTMLInputElement, value) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, String(value));
    input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
  await setRadius(500);
  const before = await page.locator('canvas').evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await setRadius(600);
  expect(await page.locator('canvas').evaluate((c: HTMLCanvasElement) => c.toDataURL())).not.toBe(before);
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Gallery', exact: true }).click();
  await page.getByRole('link', { name: 'Times Tables · Animated preview', exact: true }).click();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(rate).toHaveValue('0'); await expect(radius).toHaveValue('600');
});

test('sine circles can exceed eight, extend values, delete any circle and reset', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/gallery/sine-sums-mixed');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('group', { name: /^Function/ })).toHaveCount(3);
  await page.getByRole('spinbutton', { name: 'Frequency 2 value', exact: true }).fill('123.5');
  await page.getByRole('spinbutton', { name: 'Amplitude 2 value', exact: true }).fill('2.25');
  for (let i = 0; i < 7; i++) await page.getByRole('button', { name: 'Add circle', exact: true }).click();
  await expect(page.getByRole('group', { name: /^Function/ })).toHaveCount(10);
  await page.getByRole('button', { name: 'Delete circle 1', exact: true }).click();
  await expect(page.getByRole('spinbutton', { name: 'Frequency 1 value', exact: true })).toHaveValue('123.5');
  await expect(page.getByRole('spinbutton', { name: 'Amplitude 1 value', exact: true })).toHaveValue('2.25');
  for (let i = 0; i < 9; i++) await page.getByRole('button', { name: 'Delete circle 1', exact: true }).click();
  await expect(page.getByRole('group', { name: /^Function/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset options', exact: true }).click();
  await expect(page.getByRole('group', { name: /^Function/ })).toHaveCount(3);
  await expect(page.locator('canvas')).not.toHaveAttribute('data-state', 'error');
});

test('saved custom colors load and remain active after reload', async ({ page }) => {
  const theme = structuredClone(dark); theme.backgroundColor.primary = '#123456';
  await page.addInitScript(({ theme }) => {
    if (!localStorage.getItem('aw.gallery.preferences.v1')) localStorage.setItem('aw.gallery.preferences.v1', JSON.stringify({ schemaVersion: 1, themeMode: 'custom', customTheme: theme, motion: 'system' }));
  }, { theme });
  await page.goto('/colors');
  await expect(page.locator('html')).toHaveCSS('--color-background-primary', '#123456');
  await page.reload(); await expect(page.locator('html')).toHaveCSS('--color-background-primary', '#123456');
});

test('Euler calculates all original answers and terminates completed and cancelled workers', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeWorker = window.Worker;
    Object.assign(window, { activeWorkers: 0, delayWorkers: false, failWorkers: false });
    window.Worker = class extends NativeWorker {
      private ended = false;
      constructor(url: string | URL, options?: WorkerOptions) { super(url, options); Object.assign(window, { activeWorkers: (window as unknown as { activeWorkers: number }).activeWorkers + 1 }); }
      postMessage(message: unknown) {
        if ((window as unknown as { failWorkers: boolean }).failWorkers) { queueMicrotask(() => this.dispatchEvent(new ErrorEvent('error', { message: 'Test failure' }))); return; }
        if (!(window as unknown as { delayWorkers: boolean }).delayWorkers) super.postMessage(message);
      }
      terminate() { if (!this.ended) { this.ended = true; Object.assign(window, { activeWorkers: (window as unknown as { activeWorkers: number }).activeWorkers - 1 }); } super.terminate(); }
    };
  });
  await page.goto('/projecteuler');
  const answers = [233168, 4613732, 6857, 906609, 232792560, 25164150, 104743, 23514624000, 31875000, 142913828922];
  for (let i = 0; i < 10; i++) await expect(page.getByRole('status', { name: `Problem ${i + 1} answer`, exact: true })).toHaveText(`Answer: ${answers[i]}`);
  const active = () => page.evaluate(() => (window as unknown as { activeWorkers: number }).activeWorkers);
  await expect.poll(active).toBe(0);
  await page.evaluate(() => Object.assign(window, { failWorkers: true }));
  await page.getByRole('button', { name: 'Recalculate answers' }).click();
  await expect(page.getByRole('status', { name: 'Problem 1 answer', exact: true })).toHaveText('Answer: Unable to calculate answer.');
  await expect.poll(active).toBe(0);
  await page.evaluate(() => Object.assign(window, { failWorkers: false }));
  await page.evaluate(() => Object.assign(window, { delayWorkers: true }));
  await page.getByRole('button', { name: 'Recalculate answers' }).click(); await expect.poll(active).toBe(1);
  await page.getByRole('button', { name: 'Cancel calculation' }).click(); await expect.poll(active).toBe(0);
  await expect(page.getByRole('status', { name: 'Problem 1 answer', exact: true })).toHaveText('Answer: Cancelled.');
  await page.getByRole('button', { name: 'Recalculate answers' }).click(); await expect.poll(active).toBe(1);
  await page.getByRole('navigation').getByRole('link', { name: 'Colors', exact: true }).click(); await expect.poll(active).toBe(0);
});

test('the original timer Add Item affordance opens its prototype panel', async ({ page }) => {
  await page.goto('/timer'); await page.getByRole('button', { name: 'Add Item' }).click();
  await expect(page.getByRole('dialog', { name: 'Add Item' })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('button', { name: 'Add Item' })).toBeFocused();
});

test('Tetris repeats a held key without OS repeat and releases it when canvas focus leaves', async ({ page }) => {
  await page.goto('/gallery/tetris');
  const canvas = page.locator('canvas'); await expect(canvas).toHaveAttribute('data-state', 'running');
  const center = () => canvas.evaluate((c: HTMLCanvasElement) => {
    const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    let sum = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) if (Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]) > 50) { sum += i / 4 % c.width; count++; }
    return sum / count;
  });
  const initial = await center(); const width = (await canvas.boundingBox())!.width;
  const cell = Math.min((width - 40) / 10, ((await canvas.boundingBox())!.height - 40) / 20);
  await canvas.focus(); await page.keyboard.down('a');
  await expect.poll(center).toBeLessThan(initial - cell * 1.5);
  await page.getByRole('button', { name: 'About', exact: true }).focus();
  const released = await center(); await page.waitForTimeout(250);
  expect(await center()).toBeCloseTo(released); await page.keyboard.up('a');
});

test('Drawn Field keeps old translucent strokes while new strokes accumulate', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/gallery/drawn-field');
  const canvas = page.locator('canvas'); await expect(canvas).toHaveAttribute('data-state', 'paused');
  const positions = await canvas.evaluate((c: HTMLCanvasElement) => {
    const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data, result: number[] = [];
    for (let i = 0; i < data.length; i += 4) if (Math.abs(data[i] - 6) + Math.abs(data[i + 1] - 18) + Math.abs(data[i + 2] - 26) > 15) result.push(i);
    return result;
  });
  expect(positions.length).toBeGreaterThan(20);
  const frames = Number(await canvas.getAttribute('data-frames'));
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect.poll(async () => Number(await canvas.getAttribute('data-frames'))).toBeGreaterThan(frames + 30);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const retained = await canvas.evaluate((c: HTMLCanvasElement, positions) => {
    const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    return positions.filter(i => Math.abs(data[i] - 6) + Math.abs(data[i + 1] - 18) + Math.abs(data[i + 2] - 26) > 15).length;
  }, positions);
  expect(retained / positions.length).toBeGreaterThan(.95);
});
