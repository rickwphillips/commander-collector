/**
 * Seed teardown — runs after the suite (wired as the `seed` project's teardown).
 * Hard-deletes every `__pw_` fixture on the server so prod doesn't accumulate
 * test data: the seed player and list, the players spec's `__pw_player_*`
 * rows, and any stragglers an earlier or interrupted run left behind.
 */
import { test as teardown, expect } from '@playwright/test';
import { goto, purgeTestFixtures } from './helpers';

teardown('remove test fixtures', async ({ page }) => {
  await goto(page, '/players/');
  const result = (await purgeTestFixtures(page)) as { success?: boolean };
  expect(result?.success).toBe(true);
});
