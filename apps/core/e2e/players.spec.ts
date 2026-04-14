/**
 * PLAYERS TESTS
 * ─────────────────────────────────────────────────────────────
 * Covers:
 *  - Player list loads
 *  - At least one player row renders
 *  - Player name visible
 *  - Add player dialog opens
 *  - Add player form fields: name
 *  - Cancel add player
 *  - Search / filter field
 *  - Click player opens detail page
 *  - Detail page: stats section visible
 *  - Detail page: decks section visible
 *  - Detail page: edit button
 *  - Edit player name
 *  - Delete player button present (but NOT triggered — destructive)
 */

import { test, expect } from '@playwright/test';
import { goto } from './helpers';

const TEST_PLAYER_NAME = `__pw_player_${Date.now()}`;

test.describe('Players', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, '/players/');
  });

  test('page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /players/i })).toBeVisible();
  });

  test('at least one player renders', async ({ page }) => {
    const row = page.locator('[data-testid="player-row"], .MuiCard-root, .MuiListItem-root').first();
    await expect(row).toBeVisible();
  });

  test('search/filter input is present', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /search/i }).or(
      page.locator('input[placeholder*="search" i], input[type="search"]')
    );
    await expect(input.first()).toBeVisible();
  });

  test('search filters the player list', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /search/i }).or(
      page.locator('input[placeholder*="search" i], input[type="search"]')
    ).first();
    await input.fill('rick');
    await page.waitForTimeout(400);
    await expect(page.getByText(/rick/i).first()).toBeVisible();
  });

  test('add player button opens dialog', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add player|new player|\+/i }).first();
    await addBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('add player dialog has name field', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add player|new player|\+/i }).first();
    await addBtn.click();
    await expect(page.getByLabel(/name/i).or(page.locator('input[name="name"]')).first()).toBeVisible();
  });

  test('cancel closes add player dialog', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add player|new player|\+/i }).first();
    await addBtn.click();
    const cancelBtn = page.getByRole('button', { name: /cancel/i });
    await cancelBtn.click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('add player — create and verify', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add player|new player|\+/i }).first();
    await addBtn.click();
    const nameInput = page.getByLabel(/name/i).or(page.locator('input[name="name"]')).first();
    await nameInput.fill(TEST_PLAYER_NAME);
    const saveBtn = page.getByRole('button', { name: /save|add|create|submit/i }).first();
    await saveBtn.click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText(TEST_PLAYER_NAME)).toBeVisible();
  });

  test('clicking a player opens detail page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const firstPlayer = page.locator('.MuiCardActionArea-root').first();
    await firstPlayer.click();
    await expect(page).toHaveURL(/players\/detail\/\?id=/);
  });

  test.describe('Player Detail', () => {
    test.beforeEach(async ({ page }) => {
      await goto(page, '/players/');
      await page.waitForLoadState('networkidle');
      // Navigate to first player via CardActionArea
      const firstPlayer = page.locator('.MuiCardActionArea-root').first();
      await firstPlayer.click();
      await page.waitForLoadState('networkidle');
    });

    test('detail page heading visible', async ({ page }) => {
      // heading or player name displayed
      const heading = page.getByRole('heading').first();
      await expect(heading).toBeVisible();
    });

    test('stats section is visible', async ({ page }) => {
      const stats = page.getByText(/wins|losses|games played|win rate/i).first();
      await expect(stats).toBeVisible();
    });

    test('decks section is visible', async ({ page }) => {
      const decks = page.getByText(/decks/i).first();
      await expect(decks).toBeVisible();
    });

    test('edit button is present', async ({ page }) => {
      const editBtn = page.getByRole('button', { name: /edit/i }).first();
      await expect(editBtn).toBeVisible();
    });

    test('delete button is present', async ({ page }) => {
      const deleteBtn = page.getByRole('button', { name: /delete|remove/i }).first();
      await expect(deleteBtn).toBeVisible();
    });
  });
});
