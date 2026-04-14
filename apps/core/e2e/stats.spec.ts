/**
 * STATS TESTS
 * ─────────────────────────────────────────────────────────────
 * Covers:
 *  - Stats page loads with "Statistics" heading
 *  - Summary stat cards visible (Total Games, Players, Decks)
 *  - Win rate / analytics content visible
 *  - Customize panels icon-link navigates to /stats/customize
 *  - /stats/customize: panel list, add panel button, edit/delete
 */

import { test, expect } from '@playwright/test';
import { goto } from './helpers';

test.describe('Stats', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, '/stats/');
  });

  test('page loads with Statistics heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /statistics/i })).toBeVisible();
  });

  test('Total Games stat card is visible', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Total Games')).toBeVisible();
  });

  test('Players stat is visible', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Players')).toBeVisible();
  });

  test('Decks stat is visible', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Decks')).toBeVisible();
  });

  test('Avg. Game Length stat is visible', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Avg. Game Length')).toBeVisible();
  });

  test('customize panels link navigates to /stats/customize', async ({ page }) => {
    // The customize button is an IconButton linking to /stats/customize
    const customizeLink = page.locator('a[href*="stats/customize"]');
    await expect(customizeLink.first()).toBeVisible();
    await customizeLink.first().click();
    await expect(page).toHaveURL(/stats\/customize/);
  });

  test.describe('Stats Customize', () => {
    test.beforeEach(async ({ page }) => {
      await goto(page, '/stats/customize/');
    });

    test('customize page loads with heading', async ({ page }) => {
      await expect(page.getByRole('heading').first()).toBeVisible();
    });

    test('add panel button is present', async ({ page }) => {
      const addBtn = page.getByRole('button', { name: /add panel|new panel|\+/i }).first();
      await expect(addBtn).toBeVisible();
    });

    test('add panel dialog opens', async ({ page }) => {
      const addBtn = page.getByRole('button', { name: /add panel|new panel|\+/i }).first();
      await addBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('cancel add panel dialog', async ({ page }) => {
      const addBtn = page.getByRole('button', { name: /add panel|new panel|\+/i }).first();
      await addBtn.click();
      const cancelBtn = page.getByRole('button', { name: /cancel/i });
      await cancelBtn.click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('at least one panel has an edit button', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      const editBtn = page.getByRole('button', { name: /edit/i }).first();
      await expect(editBtn).toBeVisible();
    });

    test('at least one panel has a delete button', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      const deleteBtn = page.getByRole('button', { name: /delete/i }).first();
      await expect(deleteBtn).toBeVisible();
    });
  });
});
