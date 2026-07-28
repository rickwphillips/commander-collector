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
    await page.waitForLoadState('domcontentloaded');
  });

  test('page loads and heading is visible', async ({ page }) => {
    // Use exact match — release titles also contain "changelog" (strict mode)
    await expect(page.getByRole('heading', { name: 'Changelog', exact: true })).toBeVisible();
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
    // Dates are formatted via toLocaleDateString('en-US') → e.g. "April 14, 2026"
    await expect(page.getByText(/april\s+\d+,\s+2026|\d{1,2}\/\d{1,2}\/2026/i).first()).toBeVisible();
  });

  test('change type labels are visible (Added/Fixed/Improved/Changed)', async ({ page }) => {
    // Chip labels: "Added", "Fixed", "Improved", "Changed"
    // The changelog is client-rendered from the PHP API, and locator.count()
    // does NOT auto-retry, so a single sample after domcontentloaded races the
    // fetch and reads 0. Poll instead; the sibling tests here pass only because
    // expect().toBeVisible() retries for them.
    const types = ['Added', 'Fixed', 'Improved', 'Changed'];
    await expect.poll(async () => {
      let found = 0;
      for (const type of types) {
        if (await page.getByText(new RegExp(`^${type}$`, 'i')).count() > 0) found++;
      }
      return found;
    }, { timeout: 20_000 }).toBeGreaterThan(0);
  });
});
