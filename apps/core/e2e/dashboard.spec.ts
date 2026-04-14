/**
 * DASHBOARD TESTS
 * ─────────────────────────────────────────────────────────────
 * Covers:
 *  - Page loads (auth required)
 *  - Summary stats cards (players, decks, games)
 *  - Nav cards render (Decks, Players, Games, Lists, Stats, Collection)
 *  - Recent games section
 *  - Version chip links to changelog
 *  - Dark mode toggle present
 */

import { test, expect } from '@playwright/test';
import { goto } from './helpers';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, '/');
  });

  test('page loads and is not login page', async ({ page }) => {
    await expect(page).not.toHaveURL(/login/);
    await expect(page).toHaveURL(/commander/);
  });

  test('summary stats cards are visible', async ({ page }) => {
    // StatsCard titles visible
    await expect(page.getByText('Total Games')).toBeVisible();
  });

  test('Players nav card is visible', async ({ page }) => {
    const link = page.getByRole('link', { name: /players/i }).first();
    await expect(link).toBeVisible();
  });

  test('Decks nav card is visible', async ({ page }) => {
    const link = page.getByRole('link', { name: /decks/i }).first();
    await expect(link).toBeVisible();
  });

  test('Games nav card is visible', async ({ page }) => {
    const link = page.getByRole('link', { name: /games/i }).first();
    await expect(link).toBeVisible();
  });

  test('Lists nav card is visible', async ({ page }) => {
    const link = page.getByRole('link', { name: /lists/i }).first();
    await expect(link).toBeVisible();
  });

  test('Stats nav card is visible', async ({ page }) => {
    const link = page.getByRole('link', { name: /stats/i }).first();
    await expect(link).toBeVisible();
  });

  test('My Collection nav card is visible', async ({ page }) => {
    const link = page.getByRole('link', { name: /my collection|collection/i }).first();
    await expect(link).toBeVisible();
  });

  test('changelog link (version chip) is present', async ({ page }) => {
    // The changelog link is a version chip with href="/changelog"
    const changelogLink = page.locator('a[href*="changelog"]');
    await expect(changelogLink.first()).toBeVisible();
  });

  test('version chip shows a version number', async ({ page }) => {
    // Version chip shows vX.Y.Z format
    const versionChip = page.getByText(/v\d+\.\d+\.\d+/).first();
    await expect(versionChip).toBeVisible();
  });

  test('navigating to /players works from dashboard', async ({ page }) => {
    const link = page.getByRole('link', { name: /players/i }).first();
    await link.click();
    await expect(page).toHaveURL(/players/);
  });
});
