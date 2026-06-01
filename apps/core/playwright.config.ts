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
      // Seeds dedicated fixtures (player + list with cards) so data-dependent
      // tests don't rely on ambient prod data. `teardown` removes them after.
      name: 'seed',
      testMatch: '**/seed.setup.ts',
      dependencies: ['setup'],
      teardown: 'cleanup',
      use: { storageState: './e2e/.auth/state.json' },
    },
    {
      name: 'cleanup',
      testMatch: '**/seed.teardown.ts',
      use: { storageState: './e2e/.auth/state.json' },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: './e2e/.auth/state.json' },
      dependencies: ['seed'],
    },
  ],
});
