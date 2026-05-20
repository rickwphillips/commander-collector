/**
 * Shared helpers for Commander Collector e2e tests.
 */

import { Page, expect } from '@playwright/test';

export const BASE = 'https://rickwphillips.com/app/projects/commander';
export const API  = 'https://rickwphillips.com/php-api';

/** Navigate relative to the commander base path */
export async function goto(page: Page, path: string) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
}

/** Call the PHP API directly from the test (with auth from storage state) */
export async function apiCall(page: Page, method: string, path: string, body?: object) {
  return page.evaluate(
    async ([m, p, b]) => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`https://rickwphillips.com/php-api${p}`, {
        method: m as string,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: b ? JSON.stringify(b) : undefined,
      });
      return res.json();
    },
    [method, path, body ?? null] as [string, string, object | null]
  );
}

/** Wait for a toast / alert to appear with given text */
export async function expectToast(page: Page, text: string | RegExp) {
  await expect(page.getByRole('alert')).toContainText(text);
}

/** Dismiss any open confirm/beforeunload dialog */
export async function dismissDialog(page: Page) {
  page.once('dialog', (d) => d.dismiss());
}
