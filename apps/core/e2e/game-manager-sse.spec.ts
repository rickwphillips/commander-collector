/**
 * SSE Integration — Live Game State Streaming
 *
 * Creates a controlled session via API (no UI dependency), opens the remote
 * page, and verifies that state changes written via PUT arrive on the remote
 * display within the expected SSE delivery window.
 *
 * These tests run against prod (same as the rest of the e2e suite).
 * The session is created and deleted within the spec — no side effects.
 */

import { test, expect } from '@playwright/test';
import { goto, apiCall } from './helpers';

const MINIMAL_STATE = {
  players: [
    {
      playerId:       'test-player-a',
      deckId:         'test-deck-a',
      playerName:     'SSE Test A',
      deckName:       'Test Deck A',
      commander:      { name: 'Test Commander' },
      position:       'bottom',
      life:           40,
      poison:         0,
      commanderTax:   0,
      isMonarch:      false,
      hasInitiative:  false,
      hasCitysBlessing: false,
      energy:         0,
      experience:     0,
      isEliminated:   false,
      isConceded:     false,
      eliminatedTurn: null,
    },
    {
      playerId:       'test-player-b',
      deckId:         'test-deck-b',
      playerName:     'SSE Test B',
      deckName:       'Test Deck B',
      commander:      { name: 'Test Commander 2' },
      position:       'top',
      life:           40,
      poison:         0,
      commanderTax:   0,
      isMonarch:      false,
      hasInitiative:  false,
      hasCitysBlessing: false,
      energy:         0,
      experience:     0,
      isEliminated:   false,
      isConceded:     false,
      eliminatedTurn: null,
    },
  ],
  commanderDamage:  { 0: { 1: [0, 0] }, 1: { 0: [0, 0] } },
  currentPlayerIdx: 0,
  turnNumber:       1,
  startingLife:     40,
  phase:            'playing',
  turnTimerSeconds: 300,
  turnStartTime:    Date.now(),
  notes:            '',
};

test.describe('SSE — Live Game State Streaming', () => {
  let sessionCode: string | null = null;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await goto(page, '/');
    const session = await apiCall(page, 'POST', '/live-game.php', {
      seats: ['bottom', 'top'],
      state: MINIMAL_STATE,
    });
    sessionCode = session?.seats?.bottom ?? null;
    await page.close();
  });

  test.afterAll(async ({ browser }) => {
    if (!sessionCode) return;
    const page = await browser.newPage();
    await goto(page, '/');
    await apiCall(page, 'DELETE', `/live-game.php?code=${sessionCode}`);
    await page.close();
  });

  /**
   * Block until the remote is genuinely subscribed: EventSource OPEN and the
   * initial state painted.
   *
   * The tests below used a fixed 1500ms sleep. When connecting took longer, the
   * host write landed before the client was listening, so the push never
   * arrived and the assertion timed out. Gating on the real readyState keeps
   * the delivery-window assertions meaningful (they still measure push latency,
   * not connection setup) while removing the race.
   */
  async function waitForSseReady(page: import('@playwright/test').Page): Promise<void> {
    await expect
      .poll(
        () => page.evaluate(() => (window as unknown as { _sseReadyState?: number })._sseReadyState ?? -1),
        { timeout: 20_000 },
      )
      .toBe(1); // 1 = OPEN
    // Confirm a message was actually handled by waiting for painted state. Key
    // on the player name, not a life total: these tests share one session and
    // the preceding test writes life 35, so waiting for the initial 40 would
    // hang forever in whichever test runs second.
    await expect(page.getByText(/SSE Test A/i).first()).toBeVisible({ timeout: 15_000 });
  }

  test('remote receives initial state via SSE', async ({ page }) => {
    if (!sessionCode) { test.skip(true, 'Session setup failed'); return; }
    await goto(page, `/game-manager/remote/?code=${sessionCode}`);
    await page.waitForLoadState('domcontentloaded');
    // Life total from initial state (40) should be visible within 5s
    await expect(page.getByText(/^40$/).first()).toBeVisible({ timeout: 5000 });
  });

  test('SSE EventSource reaches OPEN state', async ({ page }) => {
    if (!sessionCode) { test.skip(true, 'Session setup failed'); return; }
    await goto(page, `/game-manager/remote/?code=${sessionCode}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const readyState = await page.evaluate(() => window._sseReadyState ?? -1);
    expect(readyState).toBe(1); // 1 = OPEN
  });

  test('remote reflects host state update within 3 seconds', async ({ page }) => {
    if (!sessionCode) { test.skip(true, 'Session setup failed'); return; }
    await goto(page, `/game-manager/remote/?code=${sessionCode}`);
    await page.waitForLoadState('domcontentloaded');
    await waitForSseReady(page);

    // Simulate host writing updated state: SSE Test A life drops to 35
    const updatedState = {
      ...MINIMAL_STATE,
      players: [
        { ...MINIMAL_STATE.players[0], life: 35 },
        { ...MINIMAL_STATE.players[1] },
      ],
    };
    await apiCall(page, 'PUT', `/live-game.php?code=${sessionCode}`, {
      state: updatedState,
    });

    // SSE should push the update — 35 should appear within 3s
    await expect(page.getByText(/^35$/).first()).toBeVisible({ timeout: 3000 });
  });

  test('remote transitions to ended when session is deactivated', async ({ page }) => {
    if (!sessionCode) { test.skip(true, 'Session setup failed'); return; }
    await goto(page, `/game-manager/remote/?code=${sessionCode}`);
    await page.waitForLoadState('domcontentloaded');
    await waitForSseReady(page);

    // Delete the session (simulates host ending game)
    await apiCall(page, 'DELETE', `/live-game.php?code=${sessionCode}`);
    sessionCode = null; // already cleaned up — skip afterAll delete

    // SSE should push inactive within ~2s (500ms poll + reconnect cycle)
    await expect(page.getByText(/game over|ended/i).first()).toBeVisible({ timeout: 5000 });
  });
});
