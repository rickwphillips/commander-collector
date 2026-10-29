/**
 * Shared helpers for Commander Collector e2e tests.
 */

import { Page, expect } from '@playwright/test';

// Prod by default; point at the local stack with
//   E2E_BASE=http://localhost:3001 E2E_API=http://localhost:8081/php-api
export const BASE = process.env.E2E_BASE ?? 'https://rickwphillips.com/app/projects/commander';
export const API  = process.env.E2E_API  ?? 'https://rickwphillips.com/php-api';

/** Navigate relative to the commander base path */
export async function goto(page: Page, path: string) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
}

/** Call the PHP API directly from the test (with auth from storage state) */
export async function apiCall(page: Page, method: string, path: string, body?: object) {
  return page.evaluate(
    async ([m, p, b, apiBase]) => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${apiBase}${p}`, {
        method: m as string,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: b ? JSON.stringify(b) : undefined,
      });
      return res.json();
    },
    [method, path, body ?? null, API] as [string, string, object | null, string]
  );
}

/**
 * Hard-delete every `__pw_` fixture on the server (players, lists, list cards,
 * list history), including stragglers from earlier or interrupted runs.
 * Backed by DELETE /test-fixtures.php, which only ever matches that prefix.
 */
export async function purgeTestFixtures(page: Page) {
  return apiCall(page, 'DELETE', '/test-fixtures.php');
}

/** Wait for a toast / alert to appear with given text */
export async function expectToast(page: Page, text: string | RegExp) {
  await expect(page.getByRole('alert')).toContainText(text);
}

/** Dismiss any open confirm/beforeunload dialog */
export async function dismissDialog(page: Page) {
  page.once('dialog', (d) => d.dismiss());
}
