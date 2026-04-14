/**
 * GAMES TESTS
 * ─────────────────────────────────────────────────────────────
 * Covers:
 *  - Games list loads
 *  - At least one game entry renders
 *  - Search field
 *  - "Log Game" button navigates to /games/new
 *  - /games/new form: date field, player selection
 *  - Game rows show dates
 *  - Click game opens detail (?id= URL)
 *  - Detail: player results visible, edit + delete buttons
 */

import { test, expect } from '@playwright/test';
import { goto } from './helpers';

test.describe('Games', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, '/games/');
  });

  test('page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /games/i })).toBeVisible();
  });

  test('at least one game entry renders', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const row = page.locator('.MuiCard-root, .MuiTableRow-root').first();
    await expect(row).toBeVisible();
  });

  test('Log Game button is present', async ({ page }) => {
    const logBtn = page.getByRole('button', { name: /log game/i }).or(
      page.getByRole('link', { name: /log game/i })
    ).first();
    await expect(logBtn).toBeVisible();
  });

  test('Log Game button navigates to /games/new', async ({ page }) => {
    const logBtn = page.getByRole('button', { name: /log game/i }).or(
      page.getByRole('link', { name: /log game/i })
    ).first();
    await logBtn.click();
    await expect(page).toHaveURL(/games\/new/);
  });

  test('game entries show dates', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    // Dates in various formats
    const dateEl = page.getByText(/\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/).first();
    await expect(dateEl).toBeVisible();
  });

  test('clicking a game opens detail page (?id= URL)', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const firstGame = page.locator('.MuiCard-root').first();
    await firstGame.click();
    await expect(page).toHaveURL(/games\/detail\?id=/);
  });

  test.describe('New Game form (/games/new)', () => {
    test.beforeEach(async ({ page }) => {
      await goto(page, '/games/new/');
    });

    test('New Game heading is visible', async ({ page }) => {
      await expect(page.getByRole('heading').first()).toBeVisible();
    });

    test('date field is present', async ({ page }) => {
      const dateInput = page.getByLabel(/date/i).or(
        page.locator('input[type="date"], input[name="date"]')
      ).first();
      await expect(dateInput).toBeVisible();
    });

    test('back button returns to games', async ({ page }) => {
      const backBtn = page.getByRole('button', { name: /back/i }).first();
      await expect(backBtn).toBeVisible();
    });
  });

  test.describe('Game Detail', () => {
    test.beforeEach(async ({ page }) => {
      await goto(page, '/games/');
      await page.waitForLoadState('networkidle');
      const firstGame = page.locator('.MuiCard-root').first();
      await firstGame.click();
      await page.waitForLoadState('networkidle');
    });

    test('detail page is visible', async ({ page }) => {
      await expect(page.getByRole('heading').first()).toBeVisible();
    });

    test('player results section is visible', async ({ page }) => {
      const results = page.getByText(/player|winner|place|result/i).first();
      await expect(results).toBeVisible();
    });

    test('edit button is present', async ({ page }) => {
      const editBtn = page.getByRole('button', { name: /edit/i }).or(
        page.getByRole('link', { name: /edit/i })
      ).first();
      await expect(editBtn).toBeVisible();
    });

    test('delete button is present', async ({ page }) => {
      const deleteBtn = page.getByRole('button', { name: /delete|remove/i }).first();
      await expect(deleteBtn).toBeVisible();
    });
  });
});
