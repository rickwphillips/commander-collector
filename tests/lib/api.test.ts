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

describe('api — players CRUD', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('api.getPlayer(id) includes id param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getPlayer(3);
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('players.php?id=3');
  });

  it('api.createPlayer(data) POSTs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.createPlayer({ name: 'Alice' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('players.php');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toEqual({ name: 'Alice' });
  });

  it('api.updatePlayer(id, data) PUTs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.updatePlayer(2, { name: 'Bob' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('players.php?id=2');
    expect(opts.method).toBe('PUT');
  });

  it('api.deletePlayer(id) DELETEs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.deletePlayer(4);
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('players.php?id=4');
    expect(opts.method).toBe('DELETE');
  });
});

describe('api — decks CRUD', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('api.getDeck(id) includes id param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getDeck(7);
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('decks.php?id=7');
  });

  it('api.getDecksByPlayer(playerId) includes player_id param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, []));
    await api.getDecksByPlayer(2);
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('decks.php?player_id=2');
  });

  it('api.createDeck(data) POSTs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.createDeck({ player_id: 1, name: 'My Deck', commander: 'Atraxa', colors: 'WUBG' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('decks.php');
    expect(opts.method).toBe('POST');
  });

  it('api.updateDeck(id, data) PUTs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.updateDeck(3, { name: 'Updated' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('decks.php?id=3');
    expect(opts.method).toBe('PUT');
  });

  it('api.deleteDeck(id) DELETEs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.deleteDeck(5);
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('decks.php?id=5');
    expect(opts.method).toBe('DELETE');
  });
});

describe('api — games CRUD', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('api.getGames() calls games endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch(200, []));
    await api.getGames();
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('games.php');
  });

  it('api.getGame(id) includes id param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getGame(10);
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('games.php?id=10');
  });

  it('api.updateGame(id, data) PUTs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.updateGame(5, { played_at: '2026-01-01' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('games.php?id=5');
    expect(opts.method).toBe('PUT');
  });

  it('api.deleteGame(id) DELETEs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.deleteGame(6);
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('games.php?id=6');
    expect(opts.method).toBe('DELETE');
  });
});

describe('api — stats', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('api.getStats() calls stats endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getStats();
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('stats.php');
  });

  it('api.getDeckStats(id) includes deck_id param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getDeckStats(9);
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('stats.php?deck_id=9');
  });

  it('api.getAdvancedStats() calls advanced-stats endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getAdvancedStats();
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('advanced-stats.php');
  });
});

describe('api — stat panels', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('api.getStatPanels() calls stat-panels endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { own: [], shared: [] }));
    await api.getStatPanels();
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('stat-panels.php');
  });

  it('api.getStatPanel(id) includes id param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getStatPanel(2);
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('stat-panels.php?id=2');
  });

  it('api.getStatPanelByCode(code) includes share_code param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getStatPanelByCode('abc123');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('stat-panels.php?share_code=abc123');
  });

  it('api.createStatPanel(data) POSTs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.createStatPanel({ name: 'My Panel', panel_type: 'predefined' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('stat-panels.php');
    expect(opts.method).toBe('POST');
  });

  it('api.updateStatPanel(id, data) PUTs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.updateStatPanel(1, { name: 'Updated' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('stat-panels.php?id=1');
    expect(opts.method).toBe('PUT');
  });

  it('api.deleteStatPanel(id) DELETEs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.deleteStatPanel(3);
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('stat-panels.php?id=3');
    expect(opts.method).toBe('DELETE');
  });

  it('api.getUsers() calls auth/users endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch(200, []));
    await api.getUsers();
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('auth/users.php');
  });
});

describe('buildComparisonParams via api.getComparison', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('encodes groupBy and metrics', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getComparison({ groupBy: 'player', metrics: ['win_rate', 'total_games'], conditions: {} });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('group_by=player');
    expect(url).toContain('metrics=win_rate%2Ctotal_games');
  });

  it('includes game_type when not "all"', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getComparison({ groupBy: 'deck', metrics: ['wins'], conditions: { game_type: 'standard' } });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('game_type=standard');
  });

  it('omits game_type when "all"', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getComparison({ groupBy: 'deck', metrics: ['wins'], conditions: { game_type: 'all' } });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).not.toContain('game_type');
  });

  it('includes numeric conditions', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getComparison({
      groupBy: 'player',
      metrics: ['win_rate'],
      conditions: {
        pod_size: 4,
        min_winning_turn: 5,
        max_winning_turn: 12,
        min_finish_position: 2,
        min_games: 3,
      },
    });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('pod_size=4');
    expect(url).toContain('min_winning_turn=5');
    expect(url).toContain('max_winning_turn=12');
    expect(url).toContain('min_finish_position=2');
    expect(url).toContain('min_games=3');
  });

  it('includes date_from and date_to', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getComparison({
      groupBy: 'month',
      metrics: ['wins'],
      conditions: { date_from: '2025-01-01', date_to: '2025-12-31' },
    });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('date_from=2025-01-01');
    expect(url).toContain('date_to=2025-12-31');
  });

  it('includes required_player_ids, required_commanders, must_include_colors', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getComparison({
      groupBy: 'player',
      metrics: ['win_rate'],
      conditions: {
        required_player_ids: [1, 2],
        required_commanders: ['Atraxa'],
        must_include_colors: ['W', 'U'],
      },
    });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('required_player_ids[]=1');
    expect(url).toContain('required_player_ids[]=2');
    expect(url).toContain('required_commanders[]=Atraxa');
    expect(url).toContain('must_include_colors[]=W');
    expect(url).toContain('must_include_colors[]=U');
  });

  it('includes entityFilter player_ids, deck_ids, commanders, colors', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getComparison({
      groupBy: 'deck',
      metrics: ['win_rate'],
      conditions: {},
      entityFilter: {
        player_ids: [3],
        deck_ids: [5, 6],
        commanders: ['Ur-Dragon'],
        colors: ['R'],
      },
    });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('filter_player_ids[]=3');
    expect(url).toContain('filter_deck_ids[]=5');
    expect(url).toContain('filter_deck_ids[]=6');
    expect(url).toContain('filter_commanders[]=Ur-Dragon');
    expect(url).toContain('filter_colors[]=R');
  });

  it('omits empty entityFilter arrays', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getComparison({
      groupBy: 'player',
      metrics: ['win_rate'],
      conditions: {},
      entityFilter: { player_ids: [], deck_ids: [], commanders: [], colors: [] },
    });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).not.toContain('filter_player_ids');
    expect(url).not.toContain('filter_deck_ids');
  });
});
