/**
 * LISTS TESTS
 * ─────────────────────────────────────────────────────────────
 * Covers:
 *  - Lists page loads
 *  - At least one list card renders
 *  - Search field
 *  - "New List" dialog opens (lists use a Dialog, not a page nav)
 *  - Dialog: name field
 *  - Cancel dialog
 *  - Click list opens detail (?id= URL)
 *  - List detail: editor heading, add-card search, qty control, save button, delete
 */

import { test, expect } from '@playwright/test';
import { goto } from './helpers';

test.describe('Lists', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, '/lists/');
  });

  test('page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /card lists|lists/i })).toBeVisible();
  });

  test('at least one list card renders', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const card = page.locator('.MuiCard-root').first();
    await expect(card).toBeVisible();
  });

  test('search field is present', async ({ page }) => {
    const input = page.locator('input[placeholder*="search" i]').or(
      page.getByRole('textbox', { name: /search/i })
    ).first();
    await expect(input).toBeVisible();
  });

  test('New List button opens a dialog', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /new list/i }).first();
    await addBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('New List dialog has a name field', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /new list/i }).first();
    await addBtn.click();
    const nameInput = page.getByLabel(/name/i).or(page.locator('input[name="name"]')).first();
    await expect(nameInput).toBeVisible();
  });

  test('cancel closes the New List dialog', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /new list/i }).first();
    await addBtn.click();
    const cancelBtn = page.getByRole('button', { name: /cancel/i });
    await cancelBtn.click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('clicking a list opens detail page (?id= URL)', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const firstList = page.locator('.MuiCardActionArea-root').first();
    await firstList.click();
    await expect(page).toHaveURL(/lists\/detail\/\?id=/);
  });

  test.describe('List Detail / Editor', () => {
    test.beforeEach(async ({ page }) => {
      await goto(page, '/lists/');
      await page.waitForLoadState('networkidle');
      const firstList = page.locator('.MuiCardActionArea-root').first();
      await firstList.click();
      await page.waitForLoadState('networkidle');
    });

    test('editor heading is visible', async ({ page }) => {
      await expect(page.getByRole('heading').first()).toBeVisible();
    });

    test('add card search field is present', async ({ page }) => {
      const input = page.locator('input[placeholder*="search" i], input[placeholder*="card" i], input[placeholder*="add" i]').first();
      await expect(input).toBeVisible();
    });

    test('save button is present', async ({ page }) => {
      // Save button has aria-label="Save cards" or "Save unsaved changes"
      const saveBtn = page.getByRole('button', { name: /save/i }).first();
      await expect(saveBtn).toBeVisible({ timeout: 8000 });
    });

    test('delete list button is present', async ({ page }) => {
      const deleteBtn = page.getByRole('button', { name: /delete/i }).first();
      await expect(deleteBtn).toBeVisible();
    });

    test.describe('Export Panel', () => {
      test.beforeEach(async ({ page }) => {
        // Open the export popover
        const exportBtn = page.getByRole('button', { name: /export cards/i }).first();
        await expect(exportBtn).toBeVisible();
        await exportBtn.click();
        await page.waitForTimeout(300);
      });

      test('export popover opens', async ({ page }) => {
        await expect(page.getByText(/export/i).first()).toBeVisible();
      });

      test('TCGPlayer copy button is present', async ({ page }) => {
        const btn = page.getByRole('button', { name: /copy tcgplayer text to clipboard/i });
        await expect(btn).toBeVisible();
      });

      test('TCGPlayer download .txt button is present', async ({ page }) => {
        const btn = page.getByRole('button', { name: /download tcgplayer text file/i });
        await expect(btn).toBeVisible();
      });

      test('CSV copy button is present', async ({ page }) => {
        const btn = page.getByRole('button', { name: /copy csv to clipboard/i });
        await expect(btn).toBeVisible();
      });

      test('CSV download .csv button is present', async ({ page }) => {
        const btn = page.getByRole('button', { name: /download csv file/i });
        await expect(btn).toBeVisible();
      });

      test('TTS download button is present', async ({ page }) => {
        const btn = page.getByRole('button', { name: /download tabletop simulator json/i });
        await expect(btn).toBeVisible();
      });

      test('TCGPlayer download triggers a file download', async ({ page }) => {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          page.getByRole('button', { name: /download tcgplayer text file/i }).click(),
        ]);
        expect(download.suggestedFilename()).toBe('decklist.txt');
      });

      test('CSV download triggers a file download', async ({ page }) => {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          page.getByRole('button', { name: /download csv file/i }).click(),
        ]);
        expect(download.suggestedFilename()).toBe('decklist.csv');
      });
    });
  });
});
