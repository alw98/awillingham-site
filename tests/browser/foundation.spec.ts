import { test, expect, AxeBuilder } from '../../src/Site.Web/browser-harness';
import inventory from '../../docs/contracts/legacy-gallery.json';

test('navigation, focus, filtering, themes and reload work without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Armond Willingham');
  await page.getByRole('navigation').getByRole('link', { name: 'Gallery', exact: true }).click();
  await expect(page.locator('#page-title')).toBeFocused();
  await expect(page).toHaveTitle('Gallery — Armond Willingham');
  await page.getByText('Filter gallery', { exact: true }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(page.getByRole('link', { name: /Bouncy DVD/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Times Tables/ })).toHaveCount(0);
  await page.getByRole('searchbox').fill('no match');
  await expect(page.getByRole('heading', { name: 'No sketches found.' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByRole('link', { name: /Times Tables · Still/ }).click();
  await expect(page).toHaveURL(/\/gallery\/times-tables-static$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Times Tables · Still');
  await page.getByRole('navigation').getByRole('link', { name: 'Colors', exact: true }).click();
  await page.locator('summary').filter({ hasText: /^Appearance$/ }).click();
  await page.getByRole('radio', { name: /Light/ }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('checkbox', { name: 'Reduce motion' }).check();
  await page.reload();
  await page.locator('summary').filter({ hasText: /^Appearance$/ }).click();
  await expect(page.getByRole('radio', { name: /Light/ })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Reduce motion' })).toBeChecked();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  expect(errors).toEqual([]);
});

test('all canonical pages and legacy aliases open directly', async ({ page, request }) => {
  for (const path of ['/', '/gallery', '/colors', '/projecteuler', '/timer', ...inventory.presets.map(preset => '/gallery/' + preset.slug)]) {
    await page.goto(path);
    await expect(page.locator('#page-title')).toBeAttached();
    await expect(page.getByRole('navigation')).toBeVisible();
    const section = path === '/' ? 'Home' : path.startsWith('/gallery') ? 'Gallery' : path === '/colors' ? 'Colors' : path === '/projecteuler' ? 'Euler' : 'Timer';
    await expect(page.getByRole('navigation').locator('a[aria-current="page"]')).toHaveText(section);
  }
  const seen = new Set<string>();
  for (const preset of inventory.presets) {
    if (seen.has(preset.legacyName)) continue;
    seen.add(preset.legacyName);
    const response = await request.get('/gallery/' + preset.legacyName + '?source=old', { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe('/gallery/' + preset.slug + '?source=old');
  }
  await page.goto('/gallery/TimesTables');
  await expect(page).toHaveURL(/times-tables-animated$/);
  await page.goto('/somewhere-unknown');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await page.goto('/gallery/unknown-study');
  await expect(page.getByRole('main').getByRole('link', { name: 'Gallery', exact: true })).toBeVisible();
});

test('malformed preferences and legacy storage are preserved until an explicit reset', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('aw.gallery.preferences.v1', '{broken');
    localStorage.setItem('ThemeStore', 'legacy-theme'); localStorage.setItem('TimerStore', 'legacy-timer');
  });
  await page.goto('/colors');
  await expect(page.getByText('Saved preferences could not be read.', { exact: false })).toBeVisible();
  await page.locator('summary').filter({ hasText: /^Appearance$/ }).click();
  await page.getByRole('radio', { name: /Light/ }).check();
  expect(await page.evaluate(() => localStorage.getItem('aw.gallery.preferences.v1'))).toBe('{broken');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download saved data' }).click();
  expect((await download).suggestedFilename()).toBe('gallery-preferences.json');
  await page.getByRole('button', { name: 'Reset saved preferences to defaults' }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('aw.gallery.preferences.v1')!).themeMode)).toBe('dark');
  expect(await page.evaluate(() => [localStorage.getItem('ThemeStore'), localStorage.getItem('TimerStore')])).toEqual(['legacy-theme', 'legacy-timer']);
});

test('system theme changes follow the device and blocked storage remains usable', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/colors');
  await page.locator('summary').filter({ hasText: /^Appearance$/ }).click();
  await page.getByRole('radio', { name: /System/ }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.locator('html').evaluate(element => parseFloat(getComputedStyle(element).getPropertyValue('--motion-duration')))).toBe(0);
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get: () => { throw new DOMException('Blocked', 'SecurityError'); } }));
  await page.reload();
  await expect(page.getByText('Browser storage is unavailable.', { exact: false })).toBeVisible();
  await page.locator('summary').filter({ hasText: /^Appearance$/ }).click();
  await page.getByRole('radio', { name: /Light/ }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('keyboard, responsive layout and default themes pass accessibility checks', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/gallery', '/colors', '/projecteuler', '/timer', '/gallery/tetris', '/missing-page']) {
      await page.goto(path);
      await expect(page.locator('#page-title')).toBeAttached();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    }
  }
  await page.goto('/colors');
  await page.locator('summary').filter({ hasText: /^Appearance$/ }).click();
  await page.getByRole('radio', { name: /Light/ }).check();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
});

test('production HTTP, caching and missing assets follow the contract', async ({ request }) => {
  for (const path of ['/health/live', '/health/ready']) {
    const response = await request.get(path); expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ status: 'healthy' }); expect(response.headers()['cache-control']).toBe('no-store');
  }
  const api = await request.get('/api/missing?private=value', { headers: { Accept: 'text/html' } });
  expect(api.status()).toBe(404); expect(api.headers()['content-type']).toContain('application/problem+json');
  expect((await api.json()).instance).toBe('/api/missing');
  const asset = await request.get('/assets/missing.js'); expect(asset.status()).toBe(404); expect(await asset.text()).toBe('');
  const html = await request.get('/'); expect(html.headers()['cache-control']).toBe('no-cache');
  const text = await html.text(); const source = text.match(/(?:src|href)="(\/assets\/[^" ]+\.js)"/)?.[1];
  expect(source).toBeTruthy();
  const hashed = await request.get(source!); expect(hashed.status()).toBe(200); expect(hashed.headers()['cache-control']).toContain('immutable');
  const head = await request.head('/colors'); expect(head.status()).toBe(200); expect(await head.body()).toHaveLength(0);
});

test('capture the release at desktop and mobile sizes', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.screenshot({ path: testInfo.outputPath('home-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.screenshot({ path: testInfo.outputPath('home-mobile.png'), fullPage: true });
});
