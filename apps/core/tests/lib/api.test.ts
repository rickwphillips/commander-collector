import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { apiFetch, api, API_BASE } from '@/lib/api';

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
});
