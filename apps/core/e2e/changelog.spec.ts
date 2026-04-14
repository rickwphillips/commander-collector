/**
 * CHANGELOG TESTS
 * ─────────────────────────────────────────────────────────────
 * Covers:
 *  - Page loads without auth (public endpoint)
 *  - Heading visible
 *  - At least one release card renders
 *  - Each card has: version chip, title, date
 *  - v5.1.0 release is present (latest bump)
 *  - Change types render (added / fixed / improved / changed)
 *  - Change text visible under each type
 */

import { test, expect } from '@playwright/test';
import { goto } from './helpers';

test.describe('Changelog', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, '/changelog/');
  });

  test('page loads and heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /changelog/i })).toBeVisible();
  });

  test('at least one release card renders', async ({ page }) => {
    const cards = page.locator('[data-testid="release-card"], .MuiCard-root').first();
    await expect(cards).toBeVisible();
  });

  test('v5.1.0 release is present with correct title', async ({ page }) => {
    await expect(page.getByText('5.1.0')).toBeVisible();
    await expect(page.getByText(/Remote QR Codes/i)).toBeVisible();
  });

  test('v5.1.0 has fixed change entry for QR codes', async ({ page }) => {
    await expect(page.getByText(/Remote panel QR codes/i)).toBeVisible();
  });

  test('v5.1.0 has improved entry for Pass Turn', async ({ page }) => {
    await expect(page.getByText(/Pass Turn button/i)).toBeVisible();
  });

  test('v5.1.0 has improved entry for panel sizing', async ({ page }) => {
    await expect(page.getByText(/player panels are wider/i)).toBeVisible();
  });

  test('release dates are displayed', async ({ page }) => {
    // Dates in YYYY-MM-DD format
    await expect(page.getByText(/2026-04-14/)).toBeVisible();
  });

  test('change type labels are visible (added/fixed/improved/changed)', async ({ page }) => {
    // At least one of these types should be visible across all releases
    const types = ['added', 'fixed', 'improved', 'changed'];
    let found = 0;
    for (const type of types) {
      const els = page.getByText(new RegExp(type, 'i'));
      if (await els.count() > 0) found++;
    }
    expect(found).toBeGreaterThan(0);
  });
});
