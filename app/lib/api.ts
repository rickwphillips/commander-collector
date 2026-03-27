// API base URL - works for both dev (proxied via Next.js rewrites) and production
export const API_BASE = '/php-api/';

// Asset base path — Next.js basePath is NOT auto-prepended to src="" attributes
// Must be prepended manually for any public/ assets referenced in code
const isDev = process.env.NODE_ENV === 'development';
export const ASSET_BASE = isDev ? '' : '/app/projects/commander';

// Auth token key (shared with portfolio login page)
const AUTH_TOKEN_KEY = 'auth_token';

// Login page URL (lives in the portfolio site)
const LOGIN_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/app/login/' : '/app/login/';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  const currentUrl = window.location.href;
  window.location.href = `${LOGIN_URL}?redirect=${encodeURIComponent(currentUrl)}`;
}

// Helper for API calls
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Handle query strings properly - insert .php before the query string
  const isGet = !options?.method || options.method === 'GET';
  const cb = isGet ? `_cb=${Date.now()}` : null;
  let url: string;
  if (endpoint.includes('?')) {
    const [path, query] = endpoint.split('?');
    url = `${API_BASE}${path}.php?${query}${cb ? `&${cb}` : ''}`;
  } else {
    url = `${API_BASE}${endpoint}.php${cb ? `?${cb}` : ''}`;
  }

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options?.headers,
    },
    cache: 'no-store',
    ...options,
  });

  if (res.status === 401) {
    redirectToLogin();
    throw new Error('Authentication required');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return res.json();
}

// Typed API methods
export const api = {
  // Players
  getPlayers: () => apiFetch<import('./types').Player[]>('/players'),
  getPlayer: (id: number) => apiFetch<import('./types').Player>(`/players?id=${id}`),
  createPlayer: (data: import('./types').CreatePlayerInput) =>
    apiFetch<import('./types').Player>('/players', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePlayer: (
    id: number,
    data: Partial<import('./types').CreatePlayerInput> & { user_id?: number | null }
  ) =>
    apiFetch<{ success: boolean }>(`/players?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deletePlayer: (id: number) =>
    apiFetch<{ success: boolean }>(`/players?id=${id}`, { method: 'DELETE' }),

  // Decks
  getDecks: () => apiFetch<import('./types').DeckWithPlayer[]>('/decks'),
  getDeck: (id: number) => apiFetch<import('./types').DeckDetail>(`/decks?id=${id}`),
  getDecksByPlayer: (playerId: number) =>
    apiFetch<import('./types').Deck[]>(`/decks?player_id=${playerId}`),
  createDeck: (data: import('./types').CreateDeckInput) =>
    apiFetch<import('./types').Deck>('/decks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateDeck: (id: number, data: Partial<import('./types').CreateDeckInput>) =>
    apiFetch<{ success: boolean }>(`/decks?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteDeck: (id: number) =>
    apiFetch<{ success: boolean }>(`/decks?id=${id}`, { method: 'DELETE' }),

  // Games
  getGames: () => apiFetch<import('./types').GameWithResults[]>('/games'),
  getGame: (id: number) => apiFetch<import('./types').GameWithResults>(`/games?id=${id}`),
  createGame: (data: import('./types').CreateGameInput) =>
    apiFetch<{ id: number }>('/games', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateGame: (
    id: number,
    data: Partial<import('./types').CreateGameInput> & {
      played_at?: string;
      notes?: string | null;
    }
  ) =>
    apiFetch<{ success: boolean }>(`/games?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteGame: (id: number) =>
    apiFetch<{ success: boolean }>(`/games?id=${id}`, { method: 'DELETE' }),

  // Stats
  getStats: () => apiFetch<import('./types').StatsResponse>('/stats'),
  getPlayerStats: (id: number) => apiFetch<import('./types').PlayerStats>(`/stats?player_id=${id}`),
  getDeckStats: (id: number) => apiFetch<import('./types').DeckStats>(`/stats?deck_id=${id}`),
  getHeadToHead: (player1Id?: number, player2Id?: number) => {
    const params = player1Id && player2Id ? `?player1=${player1Id}&player2=${player2Id}` : '';
    return apiFetch<import('./types').HeadToHeadResponse>(`/head-to-head${params}`);
  },

  // Advanced Stats
  getAdvancedStats: () => apiFetch<import('./types').AdvancedStatsResponse>('/advanced-stats'),

  // Stat Panels
  getStatPanels: () => apiFetch<import('./types').StatPanelsResponse>('/stat-panels'),
  getStatPanel: (id: number) => apiFetch<import('./types').StatPanel>(`/stat-panels?id=${id}`),
  getStatPanelByCode: (code: string) =>
    apiFetch<import('./types').StatPanel>(`/stat-panels?share_code=${code}`),
  createStatPanel: (data: import('./types').CreateStatPanelInput) =>
    apiFetch<import('./types').StatPanel>('/stat-panels', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatPanel: (id: number, data: import('./types').UpdateStatPanelInput) =>
    apiFetch<import('./types').StatPanel>(`/stat-panels?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteStatPanel: (id: number) =>
    apiFetch<{ success: boolean }>(`/stat-panels?id=${id}`, { method: 'DELETE' }),

  // Live Game Sessions (no auth — seat code is the credential)
  createLiveGame: (state: import('./types').GameManagerState, seats: string[]) =>
    apiFetch<import('./types').LiveGameSession>('/live-game', {
      method: 'POST',
      body: JSON.stringify({ state, seats }),
    }),
  // consume=true: host only — atomically returns AND clears the remote_events queue
  getLiveGame: (code: string, consume?: boolean) =>
    apiFetch<import('./types').LiveGameSeatResponse>(
      `/live-game?code=${code}${consume ? '&consume=1' : ''}`
    ),
  updateLiveGame: (code: string, state: import('./types').GameManagerState) =>
    apiFetch<{ updated_at: string }>(`/live-game?code=${code}`, {
      method: 'PUT',
      body: JSON.stringify({ state }),
    }),
  // Remote panels call this instead of writing full state — appends a typed event
  // to the queue; the host picks it up on next poll and applies it atomically.
  sendLiveGameEvent: (code: string, event: import('./types').LiveGameEvent) =>
    apiFetch<{ ok: boolean }>(`/live-game?code=${code}&action=event`, {
      method: 'POST',
      body: JSON.stringify({ event }),
    }),
  deleteLiveGame: (code: string) =>
    apiFetch<{ success: boolean }>(`/live-game?code=${code}`, { method: 'DELETE' }),

  // Users (admin)
  getUsers: () =>
    apiFetch<{ id: number; username: string; display_name: string; role: string }[]>('/auth/users'),

  // Comparison Builder
  getComparison: (config: import('./types').ComparisonConfig) => {
    const params = buildComparisonParams(config);
    return apiFetch<import('./types').ComparisonResult>(`/comparison?${params}`);
  },
};

function buildComparisonParams(config: import('./types').ComparisonConfig): string {
  const parts: string[] = [];
  parts.push(`group_by=${encodeURIComponent(config.groupBy)}`);
  parts.push(`metrics=${encodeURIComponent(config.metrics.join(','))}`);

  const c = config.conditions;
  if (c.game_type && c.game_type !== 'all')
    parts.push(`game_type=${encodeURIComponent(c.game_type)}`);
  if (c.pod_size != null) parts.push(`pod_size=${c.pod_size}`);
  if (c.min_winning_turn != null) parts.push(`min_winning_turn=${c.min_winning_turn}`);
  if (c.max_winning_turn != null) parts.push(`max_winning_turn=${c.max_winning_turn}`);
  if (c.min_finish_position != null) parts.push(`min_finish_position=${c.min_finish_position}`);
  if (c.date_from) parts.push(`date_from=${encodeURIComponent(c.date_from)}`);
  if (c.date_to) parts.push(`date_to=${encodeURIComponent(c.date_to)}`);
  if (c.min_games != null) parts.push(`min_games=${c.min_games}`);

  if (c.required_player_ids?.length) {
    c.required_player_ids.forEach((id) => parts.push(`required_player_ids[]=${id}`));
  }
  if (c.required_commanders?.length) {
    c.required_commanders.forEach((cmd) =>
      parts.push(`required_commanders[]=${encodeURIComponent(cmd)}`)
    );
  }
  if (c.must_include_colors?.length) {
    c.must_include_colors.forEach((color) =>
      parts.push(`must_include_colors[]=${encodeURIComponent(color)}`)
    );
    if (c.color_mode && c.color_mode !== 'and') {
      parts.push(`color_mode=${c.color_mode}`);
    }
  }

  const ef = config.entityFilter;
  if (ef?.player_ids?.length)
    ef.player_ids.forEach((id) => parts.push(`filter_player_ids[]=${id}`));
  if (ef?.deck_ids?.length) ef.deck_ids.forEach((id) => parts.push(`filter_deck_ids[]=${id}`));
  if (ef?.commanders?.length)
    ef.commanders.forEach((cmd) => parts.push(`filter_commanders[]=${encodeURIComponent(cmd)}`));
  if (ef?.colors?.length) {
    ef.colors.forEach((c) => parts.push(`filter_colors[]=${encodeURIComponent(c)}`));
    if (ef.color_mode && ef.color_mode !== 'and') {
      parts.push(`filter_color_mode=${ef.color_mode}`);
    }
  }

  if (c.my_games_only) parts.push('my_games_only=1');
  if (c.my_decks_only) parts.push('my_decks_only=1');
  if (c.opponent_player_ids?.length) {
    c.opponent_player_ids.forEach((id) => parts.push(`opponent_player_ids[]=${id}`));
  }
  if (c.opponent_commanders?.length) {
    c.opponent_commanders.forEach((cmd) =>
      parts.push(`opponent_commanders[]=${encodeURIComponent(cmd)}`)
    );
  }
  if (c.opponent_colors?.length) {
    c.opponent_colors.forEach((color) =>
      parts.push(`opponent_colors[]=${encodeURIComponent(color)}`)
    );
    if (c.opponent_color_mode && c.opponent_color_mode !== 'and') {
      parts.push(`opponent_color_mode=${c.opponent_color_mode}`);
    }
  }
  if (c.exclude_player_ids?.length) {
    c.exclude_player_ids.forEach((id) => parts.push(`exclude_player_ids[]=${id}`));
  }
  if (config.top_n != null) parts.push(`top_n=${config.top_n}`);

  return parts.join('&');
}
