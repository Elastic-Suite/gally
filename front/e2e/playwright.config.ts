import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'line',
  timeout: 60000,
  use: {
    baseURL: process.env.SERVER_BASE_URL || 'https://gally.local',
    trace: 'on',
    headless: true,
    ignoreHTTPSErrors: true,
  },
  expect: {
    timeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
