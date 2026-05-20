import { defineConfig, devices } from '@playwright/test';

const BASE = 'https://rickwphillips.com/app/projects/commander';

export default defineConfig({
  testDir: './e2e',
  testIgnore: ['**/scratch/**'],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: BASE,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: './e2e/.auth/state.json' },
      dependencies: ['setup'],
    },
  ],
});
