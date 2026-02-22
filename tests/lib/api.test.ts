import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { apiFetch, api, API_BASE } from '@/app/lib/api';

const AUTH_TOKEN_KEY = 'auth_token';

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  });
}

describe('apiFetch', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('includes Authorization header when token is set', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'test-token');
    const fetchMock = mockFetch(200, { data: 'ok' });
    vi.stubGlobal('fetch', fetchMock);

    await apiFetch('players');
    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer test-token');
  });

  it('omits Authorization header when no token', async () => {
    const fetchMock = mockFetch(200, { data: 'ok' });
    vi.stubGlobal('fetch', fetchMock);

    await apiFetch('players');
    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers['Authorization']).toBeUndefined();
  });

  it('throws on non-ok response (500)', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { error: 'Server error' }));
    await expect(apiFetch('players')).rejects.toThrow('Server error');
  });

  it('inserts .php before query string', async () => {
    const fetchMock = mockFetch(200, []);
    vi.stubGlobal('fetch', fetchMock);
    await apiFetch('stats?player_id=1');
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('stats.php?player_id=1');
    expect(url).toContain(API_BASE);
  });

  it('appends .php for endpoint without query string', async () => {
    const fetchMock = mockFetch(200, []);
    vi.stubGlobal('fetch', fetchMock);
    await apiFetch('players');
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('players.php');
    expect(url).toContain(API_BASE);
  });

  it('clears localStorage token on 401 and throws', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'old-token');
    vi.stubGlobal('fetch', mockFetch(401, { error: 'Unauthorized' }));
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      href: 'http://localhost:3001',
    } as Location);

    await expect(apiFetch('players')).rejects.toThrow('Authentication required');
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
  });

  it('falls back to "Request failed" when error body has no error field', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { message: 'oops' }));
    await expect(apiFetch('players')).rejects.toThrow('Request failed');
  });
});

describe('api methods', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('api.getPlayers() calls correct endpoint', async () => {
    const fetchMock = mockFetch(200, []);
    vi.stubGlobal('fetch', fetchMock);
    await api.getPlayers();
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('players.php');
  });

  it('api.getDecks() calls correct endpoint', async () => {
    const fetchMock = mockFetch(200, []);
    vi.stubGlobal('fetch', fetchMock);
    await api.getDecks();
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('decks.php');
  });

  it('api.createGame(data) POSTs with correct JSON body', async () => {
    const fetchMock = mockFetch(200, { id: 1 });
    vi.stubGlobal('fetch', fetchMock);
    const data = {
      played_at: '2026-02-22',
      winning_turn: 8,
      notes: null,
      game_type: 'standard' as const,
      results: [],
    };
    await api.createGame(data);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain('games.php');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual(data);
  });

  it('api.getPlayerStats(id) includes player_id in query string', async () => {
    const fetchMock = mockFetch(200, {});
    vi.stubGlobal('fetch', fetchMock);
    await api.getPlayerStats(5);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('stats.php?player_id=5');
  });

  it('api.getHeadToHead(p1, p2) includes both player params', async () => {
    const fetchMock = mockFetch(200, {});
    vi.stubGlobal('fetch', fetchMock);
    await api.getHeadToHead(1, 2);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('player1=1');
    expect(url).toContain('player2=2');
  });

  it('api.getHeadToHead() with no args calls endpoint without params', async () => {
    const fetchMock = mockFetch(200, {});
    vi.stubGlobal('fetch', fetchMock);
    await api.getHeadToHead();
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('head-to-head.php');
    expect(url).not.toContain('player1');
  });
});
