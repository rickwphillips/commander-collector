/**
 * Seed setup — runs after auth, before the test suite.
 *
 * Creates dedicated, clearly-marked fixtures (a player and a list with cards)
 * so data-dependent tests stop relying on whatever happens to be in prod at
 * run time. Paired with seed.teardown.ts, which removes them after the run.
 *
 * All fixtures are prefixed `__pw_seed` so teardown (and the idempotent cleanup
 * below) can find and remove them, and they never collide with real data.
 */
import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { goto, apiCall, purgeTestFixtures } from './helpers';

const SEED_FILE = path.join(__dirname, '.auth/seed.json');
const PREFIX = '__pw_seed';

setup('seed fixtures', async ({ page }) => {
  // Navigate first so storageState's auth_token is live in localStorage for apiCall.
  await goto(page, '/players/');

  // Idempotent: hard-delete leftovers from any previous or interrupted run.
  await purgeTestFixtures(page);

  // Seed a player (gives the player-detail tests a card to click).
  const player = await apiCall(page, 'POST', '/players.php', { name: `${PREFIX}_player` });

  // Seed a list with real commander staples (gives list-detail / CSV-export /
  // image-resolve tests content to work with).
  const list = await apiCall(page, 'POST', '/lists.php', {
    name: `${PREFIX}_list`,
    format: 'commander',
    cards: [
      { card_name: 'Sol Ring', quantity: 1 },
      { card_name: 'Arcane Signet', quantity: 1 },
      { card_name: 'Command Tower', quantity: 1 },
    ],
  });

  fs.mkdirSync(path.dirname(SEED_FILE), { recursive: true });
  fs.writeFileSync(
    SEED_FILE,
    JSON.stringify(
      { playerId: (player as { id?: string })?.id ?? null, listId: (list as { list_id?: string })?.list_id ?? null },
      null,
      2
    )
  );
});
