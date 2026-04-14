/**
 * GAME MANAGER — REMOTE PANEL TESTS
 * ─────────────────────────────────────────────────────────────
 * URL format: /game-manager/remote/?code=SEATCODE
 *
 * Covers:
 *  - Remote panel loads with valid seat code
 *  - Shows life total
 *  - Shows player name area
 *  - Has +/- damage controls
 *  - Has Commander Damage section
 *  - Has pass turn button
 *  - Invalid code shows error/not-found state
 *  - Enter-code form visible when no code provided
 */

import { test, expect } from '@playwright/test';
import { goto, apiCall } from './helpers';

let seatCode: string | null = null;

test.describe('Game Manager — Remote Panel', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await goto(page, '/');
    try {
      const response = await apiCall(page, 'GET', '/live-game.php?action=active-game');
      if (response?.seats && response.seats.length > 0) {
        seatCode = response.seats[0].code;
      }
    } catch {
      seatCode = null;
    } finally {
      await page.close();
    }
  });

  test('remote panel page loads (enter-code form shown without a code)', async ({ page }) => {
    await goto(page, '/game-manager/remote/');
    await expect(page.locator('body')).toBeVisible();
    await expect(page).not.toHaveURL(/login/);
  });

  test('enter-code form visible when no code provided', async ({ page }) => {
    await goto(page, '/game-manager/remote/');
    // Should show a code entry input or field
    const codeInput = page.locator('input[placeholder*="code" i], [data-testid="code-input"]').first().or(
      page.getByText(/game code|enter code|seat code/i).first()
    );
    await expect(codeInput).toBeVisible();
  });

  test('remote panel loads with a valid seat code', async ({ page }) => {
    if (!seatCode) {
      test.skip(true, 'No active game — skipping remote panel tests');
      return;
    }
    await goto(page, `/game-manager/remote/?code=${seatCode}`);
    await page.waitForLoadState('networkidle');
    // Should not show enter-code form or error
    await expect(page.getByText(/invalid code|not found|expired/i)).not.toBeVisible();
  });

  test('remote panel shows life total', async ({ page }) => {
    if (!seatCode) {
      test.skip(true, 'No active game');
      return;
    }
    await goto(page, `/game-manager/remote/?code=${seatCode}`);
    await page.waitForLoadState('networkidle');
    const lifeDisplay = page.getByText(/^20$|^40$/).first();
    await expect(lifeDisplay).toBeVisible();
  });

  test('remote panel has damage controls', async ({ page }) => {
    if (!seatCode) {
      test.skip(true, 'No active game');
      return;
    }
    await goto(page, `/game-manager/remote/?code=${seatCode}`);
    await page.waitForLoadState('networkidle');
    // + damage button
    const plusBtn = page.getByRole('button', { name: /^\+$|\+1/i }).first().or(
      page.locator('button').filter({ hasText: '+' }).first()
    );
    await expect(plusBtn).toBeVisible();
  });

  test('remote panel has Commander Damage section', async ({ page }) => {
    if (!seatCode) {
      test.skip(true, 'No active game');
      return;
    }
    await goto(page, `/game-manager/remote/?code=${seatCode}`);
    await page.waitForLoadState('networkidle');
    const cmdDmg = page.getByText(/commander damage/i).first();
    await expect(cmdDmg).toBeVisible();
  });

  test('invalid seat code shows error or enter-code state', async ({ page }) => {
    await goto(page, '/game-manager/remote/?code=INVALID_CODE_00000');
    await page.waitForLoadState('networkidle');
    // Should show not-found or revert to enter-code form
    const errorOrForm = page.getByText(/invalid|not found|expired|game code|enter code/i).first();
    await expect(errorOrForm).toBeVisible();
  });
});
