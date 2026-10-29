/**
 * SSE reconnect backoff — regression for the 2026-10-27 lockout.
 *
 * The browser's native EventSource retried every 100 ms after a server error,
 * so one 502 turned every open game page into a request storm that tripped the
 * host's per-account limit. The client now owns reconnects (app/lib/sseReconnect.ts):
 * exponential delay with jitter, 1 s base, 30 s cap, reset on the first message.
 *
 * The outage is simulated INSIDE the browser. The test answers the first stream
 * request itself with the server's real `retry: 100` hint plus one state frame
 * and then ends the response, exactly the state a client was in when the PHP
 * tier hung. Every later connection is dropped locally and counted; none of the
 * intercepted requests reaches the server.
 * Session create/delete and the one recovery write are the only real calls.
 */

import { test, expect, type Page } from '@playwright/test';
import { goto, apiCall } from './helpers';

const STREAM = /live-game-stream\.php/;
const OUTAGE_MS = 8_000;
// Jittered attempts land at ~0.5–1 s, 1–2 s, 2–4 s, 4–8 s: at most 5 reconnects
// in 8 s. The old 100 ms retry produced about 80.
const MAX_ATTEMPTS_DURING_OUTAGE = 6;
const MIN_ATTEMPTS_DURING_OUTAGE = 2;

const player = (id: string, name: string, position: string) => ({
  playerId: id, deckId: `${id}-deck`, playerName: name, deckName: `${name} Deck`,
  commander: { name: 'Backoff Commander' }, position, life: 40, poison: 0,
  commanderTax: 0, isMonarch: false, hasInitiative: false, hasCitysBlessing: false,
  energy: 0, experience: 0, isEliminated: false, isConceded: false, eliminatedTurn: null,
});

const STATE = {
  players: [player('bk-a', 'Backoff Test A', 'bottom'), player('bk-b', 'Backoff Test B', 'top')],
  commanderDamage: { 0: { 1: [0, 0] }, 1: { 0: [0, 0] } },
  currentPlayerIdx: 0, turnNumber: 1, startingLife: 40, phase: 'playing',
  turnTimerSeconds: 300, turnStartTime: Date.now(), notes: '',
};

async function sseReadyState(page: Page): Promise<number> {
  return page.evaluate(() => (window as unknown as { _sseReadyState?: number })._sseReadyState ?? -1);
}

test.describe('SSE — reconnect backoff', () => {
  let code: string | null = null;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await goto(page, '/');
    const session = await apiCall(page, 'POST', '/live-game.php', { seats: ['bottom', 'top'], state: STATE });
    code = session?.seats?.bottom ?? null;
    await page.close();
  });

  test.afterAll(async ({ browser }) => {
    if (!code) return;
    const page = await browser.newPage();
    await goto(page, '/');
    await apiCall(page, 'DELETE', `/live-game.php?code=${code}`);
    await page.close();
  });

  test('backs off during an outage and recovers when the stream returns', async ({ page }) => {
    test.setTimeout(90_000);
    expect(code, 'live session was created').toBeTruthy();

    const attempts: number[] = [];
    let served = false;
    await page.route(STREAM, (route) => {
      attempts.push(Date.now());
      if (!served) {
        served = true;
        return route.fulfill({
          status: 200,
          headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' },
          body: `retry: 100\n\ndata: ${JSON.stringify({ type: 'state', state: STATE })}\n\n`,
        });
      }
      return route.abort('connectionfailed');
    });

    await goto(page, `/game-manager/remote/?code=${code}`);
    await expect(page.getByText(/Backoff Test A/i).first()).toBeVisible({ timeout: 15_000 });
    await expect.poll(() => attempts.length, { timeout: 15_000 }).toBeGreaterThanOrEqual(1);
    const outageStart = Date.now();

    await page.waitForTimeout(OUTAGE_MS);
    const reconnects = attempts.filter((t) => t >= outageStart);
    const during = reconnects.length;
    expect(during, `reconnect attempts in ${OUTAGE_MS} ms`).toBeGreaterThanOrEqual(MIN_ATTEMPTS_DURING_OUTAGE);
    expect(during, `reconnect attempts in ${OUTAGE_MS} ms`).toBeLessThanOrEqual(MAX_ATTEMPTS_DURING_OUTAGE);

    // Gaps must grow: the last wait is longer than the first.
    if (reconnects.length >= 3) {
      const gaps = reconnects.slice(1).map((t, i) => t - reconnects[i]);
      expect(gaps[gaps.length - 1]).toBeGreaterThan(gaps[0]);
    }

    // --- recovery: lift the block, the next backoff attempt must succeed ---
    await page.unroute(STREAM);
    await expect.poll(() => sseReadyState(page), { timeout: 40_000 }).toBe(1);

    // Prove the recovered stream carries data: a host write reaches the remote.
    await apiCall(page, 'PUT', `/live-game.php?code=${code}`, {
      state: { ...STATE, players: [{ ...STATE.players[0], life: 33 }, STATE.players[1]] },
    });
    await expect(page.getByText('33').first()).toBeVisible({ timeout: 15_000 });
  });
});
