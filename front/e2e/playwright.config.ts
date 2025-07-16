import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'line',
  timeout: 60000, // 60s par tests
  use: {
    baseURL: process.env.SERVER_BASE_URL || 'https://gally.local',
    trace: 'on',
    headless: true,
    ignoreHTTPSErrors: true,
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  expect: {
    timeout: 30000, // 30s par expect
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
