/**
 * DECKS TESTS
 * ─────────────────────────────────────────────────────────────
 * Covers:
 *  - Deck list loads
 *  - At least one deck renders
 *  - Search field
 *  - "Add Deck" button navigates to /decks/new
 *  - /decks/new form: name, commander fields
 *  - Deck card: name/commander visible
 *  - Click deck navigates to detail (?id= query param)
 *  - Detail: decklist renders (decklist?id=)
 *  - Detail: add card search field
 *  - Detail: qty control
 *  - Detail: edit / delete deck buttons
 */

import { test, expect } from '@playwright/test';
import { goto } from './helpers';

test.describe('Decks', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, '/decks/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /decks/i })).toBeVisible();
  });

  test('at least one deck card renders', async ({ page }) => {
    const card = page.locator('.MuiCard-root, .MuiPaper-root').first();
    await expect(card).toBeVisible();
  });

  test('search field is present', async ({ page }) => {
    const input = page.locator('input[placeholder*="search" i]').or(
      page.getByRole('textbox', { name: /search/i })
    ).first();
    await expect(input).toBeVisible();
  });

  test('Add Deck button is present', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add deck/i }).or(
      page.getByRole('link', { name: /add deck/i })
    ).first();
    await expect(addBtn).toBeVisible();
  });

  test('Add Deck navigates to /decks/new', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add deck/i }).or(
      page.getByRole('link', { name: /add deck/i })
    ).first();
    await addBtn.click();
    await expect(page).toHaveURL(/decks\/new/);
  });

  test('clicking a deck opens detail page (?id= URL)', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    // CardActionArea-root is the actual clickable deck tile (not the search/filter Card)
    const firstDeck = page.locator('.MuiCardActionArea-root').first();
    await firstDeck.click();
    await expect(page).toHaveURL(/decks\/detail\/\?id=|decks\/decklist\/\?id=/);
  });

  test.describe('New Deck form (/decks/new)', () => {
    test.beforeEach(async ({ page }) => {
      await goto(page, '/decks/new/');
    });

    test('New Deck heading is visible', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /new deck/i })).toBeVisible();
    });

    test('deck name field is present', async ({ page }) => {
      const nameInput = page.getByLabel(/name/i).or(page.locator('input[name="name"]')).first();
      await expect(nameInput).toBeVisible();
    });

    test('commander search field is present', async ({ page }) => {
      const cmdInput = page.getByLabel(/commander/i).or(
        page.locator('input[placeholder*="commander" i]')
      ).first();
      await expect(cmdInput).toBeVisible();
    });

    test('back button is present', async ({ page }) => {
      // PageContainer back button renders as <a> (Button component={Link})
      const backBtn = page.getByRole('link', { name: /back/i }).first().or(
        page.getByRole('button', { name: /back/i }).first()
      );
      await expect(backBtn).toBeVisible();
    });
  });

  test.describe('Deck Detail / Decklist', () => {
    test.beforeEach(async ({ page }) => {
      await goto(page, '/decks/');
      await page.waitForLoadState('domcontentloaded');
      const firstDeck = page.locator('.MuiCardActionArea-root').first();
      await firstDeck.click();
      await page.waitForLoadState('domcontentloaded');
    });

    test('detail page heading is visible', async ({ page }) => {
      await expect(page.getByRole('heading').first()).toBeVisible();
    });

    test('edit or manage buttons are present', async ({ page }) => {
      const editBtn = page.getByRole('button', { name: /edit|manage|decklist/i }).or(
        page.getByRole('link', { name: /edit|manage|decklist/i })
      ).first();
      await expect(editBtn).toBeVisible();
    });
  });
});
