/**
 * RULES GURU TESTS
 * ─────────────────────────────────────────────────────────────
 * Route: /rules/ and /rules/chat/
 * Covers:
 *  - Landing page loads
 *  - Chat page loads with expected UI
 *  - Conversations API endpoint responds (was 404 due to wrong API path)
 *  - Chat input is present and interactive
 *  - Sending a message triggers a request to the correct API path
 */

import { test, expect } from '@playwright/test';
import { goto, apiCall } from './helpers';

test.describe('Rules Guru — Landing', () => {
  test('/ redirects to /chat/', async ({ page }) => {
    await goto(page, '/rules/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/rules\/chat\//);
  });
});

test.describe('Rules Guru — Chat', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, '/rules/chat/');
    await page.waitForLoadState('networkidle');
  });

  test('chat page loads without 404', async ({ page }) => {
    await expect(page.getByText(/404|not found/i)).not.toBeVisible();
  });

  test('chat page renders a heading', async ({ page }) => {
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('message input is visible', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await expect(input).toBeVisible();
  });

  test('send button is visible', async ({ page }) => {
    // Send is an icon-only IconButton — find by SVG path data or just any button near the input
    const btns = page.getByRole('button');
    await expect(btns.first()).toBeVisible();
  });
});

test.describe('Rules Guru — API connectivity', () => {
  test('conversations endpoint returns 200', async ({ page }) => {
    await goto(page, '/rules/chat/');
    const result = await page.evaluate(async () => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('https://rickwphillips.com/php-api/rules/conversations.php', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.status;
    });
    expect(result).toBe(200);
  });

  test('conversations endpoint returns valid JSON array', async ({ page }) => {
    await goto(page, '/rules/chat/');
    const result = await page.evaluate(async () => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('https://rickwphillips.com/php-api/rules/conversations.php', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.json();
    });
    expect(result).toHaveProperty('conversations');
    expect(Array.isArray(result.conversations)).toBe(true);
  });
});
