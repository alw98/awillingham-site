import { test, expect, AxeBuilder } from '../../src/Site.Web/browser-harness';

test('all colors preview as drafts, validate, save and survive reload', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/colors');
  await expect(page.getByRole('heading', { name: 'Colors', exact: true })).toHaveCount(1);
  await page.locator('summary').filter({ hasText: /^Appearance$/ }).click();
  await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeVisible();
  await expect(page.getByTestId('bubble-background')).toHaveCount(1);
  await expect(page.locator('form details')).toHaveCount(26);
  const original = await page.locator('html').evaluate(element => getComputedStyle(element).getPropertyValue('--color-accent-primary'));
  const accent = page.locator('details').filter({ has: page.locator('summary[aria-label="Primary Accent"]') });
  await accent.locator('summary').click();
  const field = accent.getByRole('textbox', { name: 'Primary Accent', exact: true });
  await field.fill('url(unsafe)');
  await page.getByRole('button', { name: 'Save colors', exact: true }).click();
  await expect(field).toBeFocused();
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  expect(await page.evaluate(() => localStorage.getItem('aw.gallery.preferences.v1'))).toBeNull();
  await field.fill('#c531dd');
  await expect(field).toBeFocused();
  expect(await page.locator('html').evaluate(element => getComputedStyle(element).getPropertyValue('--color-accent-primary'))).toBe(original);
  await page.getByRole('button', { name: 'Discard changes' }).click();
  await accent.locator('summary').click();
  await expect(accent.getByRole('textbox', { name: 'Primary Accent', exact: true })).toHaveValue(original.trim());
  await accent.getByRole('button', { name: 'purple palette', exact: true }).click();
  await accent.getByRole('button', { name: 'Choose #de72f4 for Primary Accent', exact: true }).click();
  const secondaryPress = page.locator('details').filter({ has: page.locator('summary[aria-label="Secondary Button Press Text"]') });
  await secondaryPress.locator('summary').click();
  await secondaryPress.getByRole('textbox', { name: 'Secondary Button Press Text', exact: true }).fill('#caf9ff');
  await page.getByRole('button', { name: 'Save colors', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Custom', exact: true })).toBeChecked();
  await expect(page.locator('html')).toHaveCSS('--color-accent-primary', '#de72f4');
  await expect(page.locator('html')).toHaveCSS('--color-button-press-text-secondary', '#caf9ff');
  await page.getByRole('navigation').getByRole('link', { name: 'Gallery', exact: true }).click();
  await expect(page.getByTestId('bubble-background')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('html')).toHaveCSS('--color-accent-primary', '#de72f4');
  expect(errors).toEqual([]);
});

test('bubble canvas respects reduced motion, repaints colors, resizes and disposes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/colors');
  const canvas = page.getByTestId('bubble-background');
  await expect(canvas).toHaveJSProperty('width', 1280);
  const snapshot = await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL());
  await page.waitForTimeout(200);
  expect(await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL())).toBe(snapshot);
  const background = page.locator('details').filter({ has: page.locator('summary[aria-label="Primary Background"]') });
  await background.locator('summary').click();
  await background.getByRole('textbox', { name: 'Primary Background', exact: true }).fill('#102030');
  await expect.poll(() => canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL())).not.toBe(snapshot);
  await page.setViewportSize({ width: 320, height: 900 });
  await expect(canvas).toHaveJSProperty('width', 320);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('navigation').getByRole('link', { name: 'Home', exact: true }).click();
  await expect(canvas).toHaveCount(0);
  await page.getByRole('navigation').getByRole('link', { name: 'Colors', exact: true }).click();
  await expect(canvas).toHaveCount(1);
  // Device motion is allowed again; the animation should advance.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const moving = await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL());
  await expect.poll(() => canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL())).not.toBe(moving);
});

test('original style and color controls remain accessible at desktop and mobile sizes', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/colors');
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.locator('form details').first().locator('summary').click();
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`colors-${width}.png`), fullPage: true });
    await page.locator('form details').first().locator('summary').click();
  }
});
