import { defineConfig, devices } from '@playwright/test'

const reporters: Array<[string, Record<string, unknown>]> = [
  ['list', {printSteps: true}],
]

if (process.env.CI) {
  reporters.push(['html', {outputFolder: 'playwright-report', open: 'never'}])
}

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0, // Experimental settings, update it if necessary for the CI
  workers: process.env.CI ? 1 : 1, // We put 1 worker even for dev mode to save computer resources
  reporter: reporters,
  timeout: process.env.CI ? 180000 : 120000, // 3min in CI per test, 2min in local
  use: {
    baseURL: process.env.SERVER_BASE_URL || 'https://gally.local',
    // In CI trace is kept only on failure to avoid huge artifacts
    trace: process.env.CI ? 'retain-on-failure' : 'on',
    headless: true,
    ignoreHTTPSErrors: true,
    permissions: ['clipboard-read', 'clipboard-write'],
    // Capture screenshot and video on test failure in CI env for easier debugging.
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
    // Record videos at lower size than the viewport to save space
    video: process.env.CI
      ? { mode: 'retain-on-failure', size: { width: 960, height: 540 } }
      : 'off',
  },
  expect: {
    timeout: process.env.CI ? 30000 : 20000, // 30s in CI per expect, 20s in local,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Increase viewport resolution for easier visual debugging
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
})
