import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AUTH_TOKEN_KEY, clearToken, getValidToken, isTokenExpired, storeToken, userFromToken } from '@commander/shared/lib/auth';

function b64url(obj: object): string {
  return btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const token = (payload: object) => `${b64url({ alg: 'HS256' })}.${b64url(payload)}.sig`;
const future = Math.floor(Date.now() / 1000) + 3600;

beforeEach(() => localStorage.clear());

describe('shared auth', () => {
  it('decodes base64url payloads that plain atob rejects', () => {
    const t = token({ sub: '1', username: 'u', display_name: '??>', role: 'user', exp: future });
    expect(t.split('.')[1]).toMatch(/[-_]/);
    expect(isTokenExpired(t)).toBe(false);
    expect(userFromToken(t)?.display_name).toBe('??>');
  });

  it('treats malformed, expired and exp-less tokens as expired', () => {
    expect(isTokenExpired('nope')).toBe(true);
    expect(isTokenExpired(token({ exp: Math.floor(Date.now() / 1000) - 5 }))).toBe(true);
    expect(isTokenExpired(token({ sub: '1' }))).toBe(true);
  });

  it('getValidToken returns only an unexpired stored token', () => {
    const t = token({ exp: future });
    localStorage.setItem(AUTH_TOKEN_KEY, t);
    expect(getValidToken()).toBe(t);
    localStorage.setItem(AUTH_TOKEN_KEY, token({ exp: 1 }));
    expect(getValidToken()).toBeNull();
  });

  it('storeToken and clearToken notify subscribers', () => {
    const listener = vi.fn();
    window.addEventListener('auth-token-change', listener);
    storeToken(token({ exp: future }));
    clearToken();
    window.removeEventListener('auth-token-change', listener);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
