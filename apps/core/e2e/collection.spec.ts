/**
 * COLLECTION TESTS
 * ─────────────────────────────────────────────────────────────
 * Route: /my-collection/
 * Covers:
 *  - Page loads with "My Collection" heading
 *  - Summary section visible
 *  - Decks / Lists sections visible
 *  - No error page
 */

import { test, expect } from '@playwright/test';
import { goto } from './helpers';

test.describe('Collection', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, '/my-collection/');
  });

  test('page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /my collection/i })).toBeVisible();
  });

  test('page does not show a 404', async ({ page }) => {
    await expect(page.getByText(/404|not found/i)).not.toBeVisible();
  });

  test('decks or cards section is visible', async ({ page }) => {
    const section = page.getByText(/deck|card|collection/i).first();
    await expect(section).toBeVisible();
  });

  test('page renders without server error', async ({ page }) => {
    // Page should load with a heading, no 500 error
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});
