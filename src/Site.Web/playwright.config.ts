import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../../tests/browser', outputDir: '../../.agent-artifacts/M1/browser/results',
  fullyParallel: true, workers: 2, forbidOnly: !!process.env.CI, retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: '../../.agent-artifacts/M1/browser/report', open: 'never' }]],
  use: { baseURL: process.env.SITE_BASE_URL ?? 'http://127.0.0.1:5400', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
