import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AUTH_TOKEN_KEY, clearToken, consumeUrlToken, getValidToken, isTokenExpired, storeToken, userFromToken } from '@commander/shared/lib/auth';

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

  describe('consumeUrlToken', () => {
    const at = (search: string) => window.history.replaceState({}, '', `/decks${search}`);

    it('stores a valid ?token= and strips it from the URL', () => {
      const t = token({ exp: future });
      at(`?token=${t}&view=grid`);
      consumeUrlToken();
      expect(getValidToken()).toBe(t);
      expect(window.location.search).toBe('?view=grid');
    });

    it('drops a malformed or expired ?token= instead of overwriting a good one', () => {
      const good = token({ exp: future });
      for (const bad of ['garbage', token({ exp: 1 }), token({ sub: '1' })]) {
        storeToken(good);
        at(`?token=${bad}`);
        consumeUrlToken();
        // The bad token is still stripped from the URL, but never stored.
        expect(window.location.search).toBe('');
        expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(good);
      }
    });

    it('leaves the stored token alone when there is no ?token=', () => {
      const t = token({ exp: future });
      storeToken(t);
      at('?view=grid');
      consumeUrlToken();
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(t);
      expect(window.location.search).toBe('?view=grid');
    });
  });
});
