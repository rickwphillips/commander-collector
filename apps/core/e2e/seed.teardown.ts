/**
 * Seed teardown — runs after the suite (wired as the `seed` project's teardown).
 * Removes every fixture created by seed.setup.ts so prod doesn't accumulate
 * test data. Lists soft-delete (deleted_at), players hard-delete.
 */
import { test as teardown } from '@playwright/test';
import { goto, apiCall } from './helpers';

const PREFIX = '__pw_seed';

teardown('remove seed fixtures', async ({ page }) => {
  await goto(page, '/players/');

  const players = await apiCall(page, 'GET', '/players.php');
  for (const p of (Array.isArray(players) ? players : []).filter(
    (x: { name?: string }) => x?.name?.startsWith(PREFIX)
  )) {
    await apiCall(page, 'DELETE', `/players.php?id=${(p as { id: string }).id}`);
  }

  const lists = await apiCall(page, 'GET', '/lists.php');
  for (const l of (Array.isArray(lists) ? lists : []).filter(
    (x: { name?: string }) => x?.name?.startsWith(PREFIX)
  )) {
    await apiCall(page, 'DELETE', `/lists.php?id=${(l as { id: string }).id}`);
  }
});
