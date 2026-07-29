import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { apiFetch, api, API_BASE, getDeviceId } from '@/lib/api';

const AUTH_TOKEN_KEY = 'auth_token';

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  });
}

// Build a fetch mock that returns a queued sequence of responses (for methods
// that make multiple apiFetch calls, e.g. saveDeckCards).
function mockFetchSeq(...responses: { status?: number; body: unknown }[]) {
  const f = vi.fn();
  for (const r of responses) {
    const status = r.status ?? 200;
    f.mockResolvedValueOnce({
      status,
      ok: status >= 200 && status < 300,
      json: () => Promise.resolve(r.body),
    });
  }
  return f;
}

function lastCalls() {
  return (fetch as ReturnType<typeof vi.fn>).mock.calls;
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
    const fetchMock = mockFetch(200, { id: '00000000-0000-0000-0000-000000000001' });
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
    await api.getPlayerStats('5');
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('stats.php?player_id=5');
  });

  it('api.getHeadToHead(p1, p2) includes both player params', async () => {
    const fetchMock = mockFetch(200, {});
    vi.stubGlobal('fetch', fetchMock);
    await api.getHeadToHead('1', '2');
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
    await api.getPlayer('3');
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
    await api.updatePlayer('2', { name: 'Bob' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('players.php?id=2');
    expect(opts.method).toBe('PUT');
  });

  it('api.deletePlayer(id) DELETEs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.deletePlayer('4');
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
    await api.getDeck('7');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('decks.php?id=7');
  });

  it('api.getDecksByPlayer(playerId) includes player_id param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, []));
    await api.getDecksByPlayer('2');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('decks.php?player_id=2');
  });

  it('api.createDeck(data) POSTs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.createDeck({ player_id: '1', name: 'My Deck', commander: 'Atraxa', colors: 'WUBG' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('decks.php');
    expect(opts.method).toBe('POST');
  });

  it('api.updateDeck(id, data) PUTs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.updateDeck('3', { name: 'Updated' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('decks.php?id=3');
    expect(opts.method).toBe('PUT');
  });

  it('api.deleteDeck(id) DELETEs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.deleteDeck('5');
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
    await api.getGame('10');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('games.php?id=10');
  });

  it('api.updateGame(id, data) PUTs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.updateGame('5', { played_at: '2026-01-01' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('games.php?id=5');
    expect(opts.method).toBe('PUT');
  });

  it('api.deleteGame(id) DELETEs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.deleteGame('6');
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
    await api.getDeckStats('9');
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
    await api.getStatPanel('2');
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
    await api.updateStatPanel('1', { name: 'Updated' });
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('stat-panels.php?id=1');
    expect(opts.method).toBe('PUT');
  });

  it('api.deleteStatPanel(id) DELETEs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.deleteStatPanel('3');
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
        required_player_ids: ['1', '2'],
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
        player_ids: ['3'],
        deck_ids: ['5', '6'],
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

describe('api — commander-mcp brain', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  const envelope = { band: 'certain', data: null, sources: [], caveats: [] };

  it('api.lookupCRRule(n) hits rules/cr-rule.php with no double extension', async () => {
    vi.stubGlobal('fetch', mockFetch(200, envelope));
    await api.lookupCRRule('116.1');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('rules/cr-rule.php');
    expect(url).not.toContain('cr-rule.php.php');
    expect(url).toContain('n=116.1');
  });

  it('api.getPattern(id) hits rules/pattern.php with no double extension', async () => {
    vi.stubGlobal('fetch', mockFetch(200, envelope));
    await api.getPattern('P001');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('rules/pattern.php');
    expect(url).not.toContain('pattern.php.php');
    expect(url).toContain('id=P001');
  });

  it('api.lookupInteraction(a, b) hits rules/interaction.php with no double extension', async () => {
    vi.stubGlobal('fetch', mockFetch(200, envelope));
    await api.lookupInteraction('Sol Ring', 'Atraxa');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('rules/interaction.php');
    expect(url).not.toContain('interaction.php.php');
    expect(url).toContain('a=Sol+Ring');
    expect(url).toContain('b=Atraxa');
  });

  it('api.lookupInteraction(a, b, context) includes context param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, envelope));
    await api.lookupInteraction('Sol Ring', 'Atraxa', 'combat');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('context=combat');
  });

  it('api.scoreDeck(list) POSTs to rules/score-deck.php with no double extension', async () => {
    vi.stubGlobal('fetch', mockFetch(200, envelope));
    await api.scoreDeck(['Sol Ring', 'Lightning Bolt'], 'Atraxa');
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('rules/score-deck.php');
    expect(url).not.toContain('score-deck.php.php');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.decklist).toEqual(['Sol Ring', 'Lightning Bolt']);
    expect(body.commander).toBe('Atraxa');
  });

  it('api.getCardNote(name) hits rules/card-note.php with no double extension', async () => {
    vi.stubGlobal('fetch', mockFetch(200, envelope));
    await api.getCardNote('Sol Ring');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('rules/card-note.php');
    expect(url).not.toContain('card-note.php.php');
    expect(url).toContain('name=Sol+Ring');
  });

  it('api.getCardNote(name, format) includes format param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, envelope));
    await api.getCardNote('Brainstorm', 'legacy');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('format=legacy');
  });

  it('api.discussStrength(list) POSTs to rules/discuss-strength.php with no double extension', async () => {
    vi.stubGlobal('fetch', mockFetch(200, envelope));
    await api.discussStrength(['Sol Ring']);
    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('rules/discuss-strength.php');
    expect(url).not.toContain('discuss-strength.php.php');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body).decklist).toEqual(['Sol Ring']);
  });
});

// ── Helpers for SSE stream mocking ────────────────────────────────────────────

/**
 * Encode a sequence of SSE event blocks into Uint8Array chunks.
 * Each event becomes one chunk so the reader loop processes them one at a time.
 */
function sseChunks(events: { event: string; data: unknown }[]): Uint8Array[] {
  return events.map(({ event, data }) => {
    const text = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    return new TextEncoder().encode(text);
  });
}

/**
 * Build a ReadableStream from an array of Uint8Array chunks.
 */
function makeReadableStream(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  let i = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (i < chunks.length) {
        controller.enqueue(chunks[i++]);
      } else {
        controller.close();
      }
    },
  });
}

/**
 * Mock global fetch to return an SSE response with the given events.
 */
function mockSseFetch(events: { event: string; data: unknown }[], status = 200) {
  const chunks = sseChunks(events);
  const stream = makeReadableStream(chunks);
  const fetchMock = vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    body: stream,
    json: () => Promise.resolve({}),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

// ── sendCoachMessage (SSE) ────────────────────────────────────────────────────

describe('api.sendCoachMessage — SSE stream', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('happy path: resolves with response and toolsUsed from done event', async () => {
    mockSseFetch([
      { event: 'tool_start', data: { tool: 'lookup_card' } },
      { event: 'tool_result', data: { result: 'ok' } },
      { event: 'done', data: { response: 'Here is my answer', tools_used: [{ name: 'lookup_card', input: {} }] } },
    ]);

    const result = await api.sendCoachMessage('What is Sol Ring?', []);
    expect(result.response).toBe('Here is my answer');
    expect(result.toolsUsed).toHaveLength(1);
    expect(result.toolsUsed[0].name).toBe('lookup_card');
  });

  it('calls onPartial with tool name when tool_start event is received', async () => {
    mockSseFetch([
      { event: 'tool_start', data: { tool: 'lookup_card' } },
      { event: 'done', data: { response: 'Done', tools_used: [] } },
    ]);

    const onPartial = vi.fn();
    await api.sendCoachMessage('Hello', [], undefined, undefined, onPartial);
    expect(onPartial).toHaveBeenCalledWith('Looking up lookup_card...');
  });

  it('throws with the error message when an error event is received in the stream', async () => {
    mockSseFetch([
      { event: 'error', data: { error: 'Coach is unavailable' } },
    ]);

    await expect(api.sendCoachMessage('Hello', [])).rejects.toThrow('Coach is unavailable');
  });

  it('throws "No response body from coach stream" when res.body is null', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      body: null,
      json: () => Promise.resolve({}),
    }));

    await expect(api.sendCoachMessage('Hello', [])).rejects.toThrow(
      'No response body from coach stream'
    );
  });

  it('propagates AbortError when signal is aborted', async () => {
    const controller = new AbortController();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(
      Object.assign(new Error('The operation was aborted'), { name: 'AbortError' })
    ));

    await expect(
      api.sendCoachMessage('Hello', [], undefined, undefined, undefined, controller.signal)
    ).rejects.toThrow('The operation was aborted');
  });

  it('warns and continues on malformed JSON in SSE data (does not throw)', async () => {
    // Construct a stream with one bad chunk followed by a valid done event
    const badChunk = new TextEncoder().encode('event: partial\ndata: NOT_VALID_JSON\n\n');
    const goodChunk = new TextEncoder().encode(
      `event: done\ndata: ${JSON.stringify({ response: 'ok', tools_used: [] })}\n\n`
    );
    const stream = makeReadableStream([badChunk, goodChunk]);

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      body: stream,
      json: () => Promise.resolve({}),
    }));

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await api.sendCoachMessage('Hello', []);
    expect(result.response).toBe('ok');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[coach] malformed SSE event:'),
      expect.any(String),
      expect.any(String),
    );
    warnSpy.mockRestore();
  });

  it('throws when stream ends without a done event', async () => {
    mockSseFetch([
      { event: 'tool_start', data: { tool: 'something' } },
      // No done event — stream just ends
    ]);

    await expect(api.sendCoachMessage('Hello', [])).rejects.toThrow(
      'Coach stream ended without done event'
    );
  });

  it('POSTs to coach-chat.php with message and history in body', async () => {
    const fetchMock = mockSseFetch([
      { event: 'done', data: { response: 'reply', tools_used: [] } },
    ]);

    const history = [{ role: 'user' as const, content: 'hi' }];
    await api.sendCoachMessage('My question', history);

    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain('coach-chat.php');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.message).toBe('My question');
    expect(body.history).toEqual(history);
  });

  it('includes active_deck in POST body when provided', async () => {
    const fetchMock = mockSseFetch([
      { event: 'done', data: { response: 'reply', tools_used: [] } },
    ]);

    await api.sendCoachMessage('Hello', [], {
      deckId: 'deck-1',
      deckName: 'My Deck',
      commander: 'Atraxa',
      cardCount: 99,
      colors: 'WUBG',
    });

    const [, opts] = fetchMock.mock.calls[0];
    const body = JSON.parse(opts.body);
    expect(body.active_deck.id).toBe('deck-1');
    expect(body.active_deck.commander).toBe('Atraxa');
  });

  it('includes active_list in POST body when provided', async () => {
    const fetchMock = mockSseFetch([{ event: 'done', data: { response: 'r', tools_used: [] } }]);
    await api.sendCoachMessage('Hi', [], undefined, {
      listId: 'l-1',
      listName: 'My List',
      cardCount: 10,
    });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.active_list.id).toBe('l-1');
    expect(body.active_list.card_count).toBe(10);
  });

  it('throws a status-based coach error when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      status: 500,
      ok: false,
      json: () => Promise.resolve({}),
    }));
    await expect(api.sendCoachMessage('Hi', [])).rejects.toThrow('Coach error 500');
  });
});

describe('getDeviceId', () => {
  const DEVICE_ID_KEY = 'commander_device_id';
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('generates and persists a stable id', () => {
    const first = getDeviceId();
    expect(first).toBeTruthy();
    expect(localStorage.getItem(DEVICE_ID_KEY)).toBe(first);
    expect(getDeviceId()).toBe(first);
  });

  it('returns "ssr" when there is no window', () => {
    vi.stubGlobal('window', undefined);
    expect(getDeviceId()).toBe('ssr');
  });
});

describe('api — live game + game log', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('createLiveGame POSTs state, seats and user_id', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.createLiveGame({ foo: 'bar' } as never, ['A', 'B'], 'u1');
    const [url, opts] = lastCalls()[0];
    expect(url).toContain('live-game.php');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.seats).toEqual(['A', 'B']);
    expect(body.user_id).toBe('u1');
  });

  it('getLiveGame adds consume=1 when requested and omits it otherwise', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getLiveGame('CODE', true);
    expect(lastCalls()[0][0]).toContain('consume=1');
  });

  it('getLiveGame omits consume when not requested', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getLiveGame('CODE');
    expect(lastCalls()[0][0]).not.toContain('consume');
  });

  it('updateLiveGame PUTs state by code', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.updateLiveGame('CODE', { x: 1 } as never);
    const [url, opts] = lastCalls()[0];
    expect(url).toContain('live-game.php?code=CODE');
    expect(opts.method).toBe('PUT');
  });

  it('sendLiveGameEvent POSTs an event with action=event', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.sendLiveGameEvent('CODE', { type: 'life' } as never);
    const [url, opts] = lastCalls()[0];
    expect(url).toContain('action=event');
    expect(opts.method).toBe('POST');
  });

  it('deleteLiveGame DELETEs by code', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { success: true }));
    await api.deleteLiveGame('CODE');
    const [url, opts] = lastCalls()[0];
    expect(url).toContain('live-game.php?code=CODE');
    expect(opts.method).toBe('DELETE');
  });

  it('gameLog.start/append/cancel POST with the right action, read GETs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { ok: true }));
    await api.gameLog.start('CODE', []);
    await api.gameLog.append('CODE', []);
    await api.gameLog.cancel('CODE');
    await api.gameLog.read('CODE');
    const calls = lastCalls();
    expect(calls[0][0]).toContain('action=start');
    expect(calls[1][0]).toContain('action=append');
    expect(calls[2][0]).toContain('action=cancel');
    expect(calls[3][0]).toContain('game-log.php?code=CODE');
  });

  it('getActiveGame GETs the active-game endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getActiveGame();
    expect(lastCalls()[0][0]).toContain('active-game.php');
  });
});

describe('api — SSE EventSource streams', () => {
  class MockEventSource {
    static last: MockEventSource | null = null;
    url: string;
    readyState = 0;
    onopen: (() => void) | null = null;
    onmessage: ((e: { data: string }) => void) | null = null;
    onerror: (() => void) | null = null;
    closed = false;
    constructor(url: string) {
      this.url = url;
      MockEventSource.last = this;
    }
    close() { this.closed = true; }
  }

  beforeEach(() => {
    MockEventSource.last = null;
    vi.stubGlobal('EventSource', MockEventSource as unknown as typeof EventSource);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('openLiveGameStream delivers state, handles inactive, malformed, open and error', () => {
    const onState = vi.fn();
    const onInactive = vi.fn();
    const onError = vi.fn();
    const cleanup = api.openLiveGameStream('CODE', onState, onInactive, onError);
    const es = MockEventSource.last!;
    expect(es.url).toContain('live-game-stream.php?code=CODE');

    es.onopen!();
    expect(window._sseReadyState).toBe(1);

    es.onmessage!({ data: JSON.stringify({ type: 'state', state: { hp: 40 } }) });
    expect(onState).toHaveBeenCalledWith({ hp: 40 });

    es.onmessage!({ data: 'not json' });
    es.onmessage!({ data: JSON.stringify({ type: 'inactive' }) });
    expect(onInactive).toHaveBeenCalled();
    // The stream must stay OPEN on 'inactive'. The remote panel ends the
    // session only after 3 consecutive 'inactive' messages, and the server
    // sends one per connection before exiting, so closing here made the 2nd and
    // 3rd unreachable and the remote never showed "Game Over". Reconnects
    // deliver the rest; the consumer closes via the returned cleanup.
    expect(es.closed).toBe(false);

    // Three in a row is what the remote actually needs to see.
    es.onmessage!({ data: JSON.stringify({ type: 'inactive' }) });
    es.onmessage!({ data: JSON.stringify({ type: 'inactive' }) });
    expect(onInactive).toHaveBeenCalledTimes(3);
    expect(es.closed).toBe(false);

    es.onerror!();
    expect(onError).toHaveBeenCalled();

    cleanup();
    expect(es.closed).toBe(true);
  });

  it('openLiveGameHostStream delivers events and handles inactive/error', () => {
    const onEvents = vi.fn();
    const onInactive = vi.fn();
    const onError = vi.fn();
    const cleanup = api.openLiveGameHostStream('CODE', onEvents, onInactive, onError);
    const es = MockEventSource.last!;
    expect(es.url).toContain('role=host');

    es.onmessage!({ data: JSON.stringify({ type: 'events', events: [{ type: 'life' }] }) });
    expect(onEvents).toHaveBeenCalledWith([{ type: 'life' }]);

    es.onmessage!({ data: 'garbage' });
    es.onmessage!({ data: JSON.stringify({ type: 'inactive' }) });
    expect(onInactive).toHaveBeenCalled();

    es.onerror!();
    expect(onError).toHaveBeenCalled();

    cleanup();
    expect(es.closed).toBe(true);
  });

  it('stream onmessage without a handler for the type is a no-op', () => {
    const onEvents = vi.fn();
    api.openLiveGameHostStream('CODE', onEvents, vi.fn());
    const es = MockEventSource.last!;
    es.onmessage!({ data: JSON.stringify({ type: 'events', events: [] }) });
    expect(onEvents).not.toHaveBeenCalled();
  });
});

describe('api — deck cards + lists', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('getDeckCards maps the main list cards', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { id: 'L1', cards: [] }));
    const cards = await api.getDeckCards('deck-1');
    expect(cards).toEqual([]);
    expect(lastCalls()[0][0]).toContain('lists.php?deck_id=deck-1&role=main');
  });

  it('getDeckCards returns [] when the deck has no main list (not found)', async () => {
    vi.stubGlobal('fetch', mockFetch(404, { error: 'List not found' }));
    expect(await api.getDeckCards('deck-1')).toEqual([]);
  });

  it('getDeckCards rethrows non-404 errors', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { error: 'boom' }));
    await expect(api.getDeckCards('deck-1')).rejects.toThrow('boom');
  });

  it('getDeckProfile includes id param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getDeckProfile('deck-1');
    expect(lastCalls()[0][0]).toContain('deck-profile.php?id=deck-1');
  });

  it('saveDeckCards PATCHes the existing main list', async () => {
    vi.stubGlobal('fetch', mockFetchSeq(
      { body: { id: 'L1' } },
      { body: { success: true } },
    ));
    const res = await api.saveDeckCards('deck-1', []);
    expect(res).toEqual({ success: true, deck_id: 'deck-1' });
    const calls = lastCalls();
    expect(calls[1][1].method).toBe('PATCH');
  });

  it('saveDeckCards creates and attaches a list when none exists', async () => {
    vi.stubGlobal('fetch', mockFetchSeq(
      { status: 404, body: { error: 'List not found' } },
      { body: { success: true, list_id: 'L2' } },
      { body: { success: true } },
      { body: { success: true } },
    ));
    const res = await api.saveDeckCards('deck-1', []);
    expect(res.success).toBe(true);
    expect(lastCalls()).toHaveLength(4);
  });

  it('saveDeckCards rethrows non-not-found lookup errors', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { error: 'boom' }));
    await expect(api.saveDeckCards('deck-1', [])).rejects.toThrow('boom');
  });

  it('deleteDeckCards clears the existing main list', async () => {
    vi.stubGlobal('fetch', mockFetchSeq(
      { body: { id: 'L1' } },
      { body: { success: true } },
    ));
    const res = await api.deleteDeckCards('deck-1');
    expect(res.success).toBe(true);
    expect(lastCalls()[1][1].method).toBe('PATCH');
  });

  it('deleteDeckCards is a no-op when there is no main list', async () => {
    vi.stubGlobal('fetch', mockFetch(404, { error: 'List not found' }));
    expect(await api.deleteDeckCards('deck-1')).toEqual({ success: true });
  });

  it('deleteDeckCards rethrows non-not-found errors', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { error: 'boom' }));
    await expect(api.deleteDeckCards('deck-1')).rejects.toThrow('boom');
  });

  it('list CRUD wrappers hit the lists endpoint with correct verbs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { cards: [] }));
    await api.getLists();
    await api.getList('L1');
    await api.createList('Name', 'desc', []);
    await api.updateList('L1', { name: 'x' });
    await api.deleteList('L1');
    await api.detachDeckToList('deck-1', 'Copy');
    await api.attachListToDeck('L1', 'deck-1');
    const calls = lastCalls();
    expect(calls[0][0]).toContain('lists.php');
    expect(calls[1][0]).toContain('lists.php?id=L1');
    expect(calls[2][1].method).toBe('POST');
    expect(calls[3][1].method).toBe('PATCH');
    expect(calls[4][1].method).toBe('DELETE');
    expect(calls[5][0]).toContain('action=detach_deck');
    expect(calls[6][0]).toContain('action=attach_deck');
  });

  it('lists v2 wrappers hit the lists endpoint with correct verbs/params', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { cards: [], updated: [] }));
    await api.getListByDeckId('deck-1');
    await api.saveListCards('L1', [], 3);
    await api.attachListToDeckV2('L1', 'deck-1');
    await api.detachListFromDeck('L1');
    await api.resolveListImages('L1');
    const calls = lastCalls();
    expect(calls[0][0]).toContain('deck_id=deck-1&role=main');
    expect(calls[1][0]).toContain('lists.php?id=L1');
    expect(JSON.parse(calls[1][1].body).version).toBe(3);
    expect(calls[2][0]).toContain('action=attach_deck');
    expect(calls[3][0]).toContain('action=detach_deck');
    expect(calls[4][0]).toContain('list-image-resolve.php');
  });
});

describe('api — scryfall / scan / image / buffer / settings / misc', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('lookupCard and bulkLookupCards hit scryfall-cache', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { results: [] }));
    await api.lookupCard('Sol Ring');
    await api.bulkLookupCards(['Sol Ring']);
    const calls = lastCalls();
    expect(calls[0][0]).toContain('scryfall-cache.php?name=Sol+Ring');
    expect(calls[1][1].method).toBe('POST');
  });

  it('scanDeck and findCardCrop POST to scan', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { cards: [] }));
    await api.scanDeck('base64', 'image/png');
    await api.findCardCrop('base64', 'image/png', 'Sol Ring');
    const calls = lastCalls();
    expect(calls[0][1].method).toBe('POST');
    expect(JSON.parse(calls[1][1].body).find_card).toBe('Sol Ring');
  });

  it('getCardImage includes url param only when provided', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getCardImage('sid');
    await api.getCardImage('sid', 'http://img');
    const calls = lastCalls();
    expect(calls[0][0]).not.toContain('url=');
    expect(calls[1][0]).toContain('url=http');
  });

  it('getCardPrints includes name param', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { prints: [] }));
    await api.getCardPrints('Sol Ring');
    expect(lastCalls()[0][0]).toContain('card-prints.php?name=Sol+Ring');
  });

  it('buffer draft methods hit buffer-draft with correct verbs', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { state: null }));
    await api.getBufferDraft('dev', 'scan');
    await api.saveBufferDraft('dev', 'scan', 'ref', {} as never);
    await api.clearBufferDraft('dev', 'scan');
    const calls = lastCalls();
    expect(calls[0][0]).toContain('buffer-draft.php');
    expect(calls[1][1].method).toBe('POST');
    expect(calls[2][1].method).toBe('DELETE');
  });

  it('game settings get/update hit game-settings', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getGameSettings();
    await api.updateGameSettings({ sound_enabled: false });
    const calls = lastCalls();
    expect(calls[0][0]).toContain('game-settings.php');
    expect(calls[1][1].method).toBe('POST');
  });

  it('exportTTS uses deck_id or list_id depending on the arg', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.exportTTS({ deckId: 'deck-1' });
    await api.exportTTS({ listId: 'L1' });
    const calls = lastCalls();
    expect(calls[0][0]).toContain('deck_id=deck-1');
    expect(calls[1][0]).toContain('list_id=L1');
  });

  it('changelog / collection / coach-notes wrappers', async () => {
    vi.stubGlobal('fetch', mockFetch(200, []));
    await api.getChangelog();
    await api.getMyCollection();
    await api.getCoachNotes();
    await api.getAllCoachNotes();
    await api.updateCoachNote('N1', { topic: 't' });
    await api.deleteCoachNote('N1');
    const calls = lastCalls();
    expect(calls[0][0]).toContain('changelog.php');
    expect(calls[1][0]).toContain('my-collection.php');
    expect(calls[2][0]).toContain('coach-notes.php');
    expect(calls[3][0]).toContain('all=1');
    expect(calls[4][1].method).toBe('PUT');
    expect(calls[5][1].method).toBe('DELETE');
  });

  it('submitChatFeedback POSTs a snake_cased body to chat-feedback', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.submitChatFeedback({
      surface: 'coach',
      messageUuid: 'm-1',
      kind: 'card',
      targetId: 'Sol Ring',
      rating: 'good',
    });
    const [url, opts] = lastCalls()[0];
    expect(url).toContain('chat-feedback.php');
    const body = JSON.parse(opts.body);
    expect(body.message_uuid).toBe('m-1');
    expect(body.target_id).toBe('Sol Ring');
  });

  it('getCardNote adds the archetype param when provided', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { band: 'certain', data: {}, sources: [], caveats: [] }));
    await api.getCardNote('Sol Ring', 'commander', 'aggro');
    expect(lastCalls()[0][0]).toContain('archetype=aggro');
  });
});

describe('api — comparison color modes + opponent/exclude filters', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('emits color-mode flags, opponent filters, exclusions and toggles', async () => {
    vi.stubGlobal('fetch', mockFetch(200, {}));
    await api.getComparison({
      groupBy: 'player',
      metrics: ['win_rate'],
      top_n: 5,
      conditions: {
        must_include_colors: ['W'],
        color_mode: 'or',
        opponent_colors: ['U'],
        opponent_color_mode: 'or',
        opponent_player_ids: ['9'],
        opponent_commanders: ['Kenrith'],
        exclude_player_ids: ['3'],
        my_games_only: true,
        my_decks_only: true,
      },
      entityFilter: { colors: ['R'], color_mode: 'or' },
    });
    const [url] = lastCalls()[0];
    expect(url).toContain('color_mode=or');
    expect(url).toContain('filter_color_mode=or');
    expect(url).toContain('opponent_color_mode=or');
    expect(url).toContain('opponent_player_ids[]=9');
    expect(url).toContain('opponent_commanders[]=Kenrith');
    expect(url).toContain('exclude_player_ids[]=3');
    expect(url).toContain('my_games_only=1');
    expect(url).toContain('my_decks_only=1');
    expect(url).toContain('top_n=5');
  });
});
