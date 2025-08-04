import {defineConfig, devices} from '@playwright/test'

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0, // Experimental settings, update it if necessary for the CI
  workers: process.env.CI ? 1 : 1, // We put 1 worker even for dev mode to save computer resources
  reporter: [['list', {printSteps: true}]],
  timeout: 120000, // 2min per test
  use: {
    baseURL: process.env.SERVER_BASE_URL || 'https://gally.local',
    trace: 'on',
    headless: true,
    ignoreHTTPSErrors: true,
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  expect: {
    timeout: 20000, // 20s per expect
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
  ],
})
