/**
 * Auth setup — runs once before all tests.
 * Mints a JWT locally with the signing secret + Rick's user UUID,
 * injects it into localStorage, verifies auth works, saves storage state.
 *
 * The secret comes from E2E_JWT_SECRET (local stack runs) or, when unset,
 * from the macOS keychain entry the mcp-skills Playwright targets use
 * (prod runs). It is never written into this public repo.
 *
 * NO SSH, NO PHP CLI — all local Python, no shell escaping issues.
 */

import { test as setup, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '.auth/state.json');
const KEYCHAIN_SERVICE = 'freddyrhetorick-prod-secrets';
const KEYCHAIN_ACCOUNT = 'JWT_SECRET';

function resolveSecret(): string {
  const fromEnv = process.env.E2E_JWT_SECRET;
  if (fromEnv) return fromEnv;
  const fromKeychain = execSync(
    `security find-generic-password -w -s ${KEYCHAIN_SERVICE} -a ${KEYCHAIN_ACCOUNT}`,
    { stdio: ['ignore', 'pipe', 'ignore'] },
  ).toString().trim();
  if (!fromKeychain) {
    throw new Error(
      `E2E_JWT_SECRET is not set and keychain entry ${KEYCHAIN_SERVICE}/${KEYCHAIN_ACCOUNT} is empty`,
    );
  }
  return fromKeychain;
}

const JWT_SECRET = resolveSecret();
const USER_ID    = 'b0059aba-0dd1-11f1-92ad-a0981cc1760c';
const USERNAME   = 'rick';
const BASE       = process.env.E2E_BASE ?? 'https://rickwphillips.com/app/projects/commander';

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
  await page.waitForLoadState('load');

  // Confirm not redirected to login
  await expect(page).not.toHaveURL(/login/);

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
