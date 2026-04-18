/**
 * Auth setup — runs once before all tests.
 * Mints a JWT locally using the known secret + Rick's user UUID,
 * injects it into localStorage, verifies auth works, saves storage state.
 *
 * NO SSH, NO PHP CLI — all local Python, no shell escaping issues.
 */

import { test as setup, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '.auth/state.json');
const JWT_SECRET = 'f47cdbbb8075ebef8761f89baefb7dc42908bb9f489a0f905cf8c8063f774258';
const USER_ID    = 'b0059aba-0dd1-11f1-92ad-a0981cc1760c';
const USERNAME   = 'rick';
const BASE       = 'https://rickwphillips.com/app/projects/commander';

function mintJWT(): string {
  return execSync(
    `python3 -c "
import hmac, hashlib, base64, json, time
def b(d):
    if isinstance(d, str): d = d.encode()
    return base64.urlsafe_b64encode(d).rstrip(b'=').decode()
s='${JWT_SECRET}'
h=b(json.dumps({'alg':'HS256','typ':'JWT'},separators=(',',':')))
p=b(json.dumps({'sub':'${USER_ID}','username':'${USERNAME}','iat':int(time.time()),'exp':int(time.time())+86400},separators=(',',':')))
sig=b(hmac.new(s.encode(),f'{h}.{p}'.encode(),hashlib.sha256).digest())
print(f'{h}.{p}.{sig}')
"`
  ).toString().trim();
}

setup('authenticate', async ({ page }) => {
  const token = mintJWT();

  // Inject token before page load so the app sees it on first render
  await page.addInitScript((t) => localStorage.setItem('auth_token', t), token);
  await page.goto(BASE + '/');
  await page.waitForLoadState('networkidle');

  // Confirm not redirected to login
  await expect(page).not.toHaveURL(/login/);

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
