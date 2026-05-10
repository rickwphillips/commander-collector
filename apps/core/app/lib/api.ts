// API base URL - works for both dev (proxied via Next.js rewrites) and production
export const API_BASE = '/php-api/';

import { fromApiCard } from './cards/types';
import type { ApiCardRow } from './cards/types';

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

// Stable per-device identifier stored in localStorage.
// Used as part of the composite key for buffer_drafts so that drafts are
// scoped to the originating device even when the same user is logged in elsewhere.
const DEVICE_ID_KEY = 'commander_device_id';

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// Helper for API calls
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Handle query strings properly - insert .php before the query string
  const isGet = !options?.method || options.method === 'GET';
  // Append _cb timestamp to every GET to prevent stale reads; intentional for this real-time app.
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
  getPlayer: (id: string) => apiFetch<import('./types').Player>(`/players?id=${id}`),
  createPlayer: (data: import('./types').CreatePlayerInput) =>
    apiFetch<import('./types').Player>('/players', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePlayer: (
    id: string,
    data: Partial<import('./types').CreatePlayerInput> & { user_id?: string | null }
  ) =>
    apiFetch<{ success: boolean }>(`/players?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deletePlayer: (id: string) =>
    apiFetch<{ success: boolean }>(`/players?id=${id}`, { method: 'DELETE' }),

  // Decks
  getDecks: () => apiFetch<import('./types').DeckWithPlayer[]>('/decks'),
  getDeck: (id: string) => apiFetch<import('./types').DeckDetail>(`/decks?id=${id}`),
  getDecksByPlayer: (playerId: string) =>
    apiFetch<import('./types').Deck[]>(`/decks?player_id=${playerId}`),
  createDeck: (data: import('./types').CreateDeckInput) =>
    apiFetch<import('./types').Deck>('/decks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateDeck: (id: string, data: Partial<import('./types').CreateDeckInput>) =>
    apiFetch<{ success: boolean }>(`/decks?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteDeck: (id: string) =>
    apiFetch<{ success: boolean }>(`/decks?id=${id}`, { method: 'DELETE' }),

  // Games
  getGames: () => apiFetch<import('./types').GameWithResults[]>('/games'),
  getGame: (id: string) => apiFetch<import('./types').GameWithResults>(`/games?id=${id}`),
  createGame: (data: import('./types').CreateGameInput) =>
    apiFetch<{ id: string }>('/games', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateGame: (
    id: string,
    data: Partial<import('./types').CreateGameInput> & {
      played_at?: string;
      notes?: string | null;
    }
  ) =>
    apiFetch<{ success: boolean }>(`/games?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteGame: (id: string) =>
    apiFetch<{ success: boolean }>(`/games?id=${id}`, { method: 'DELETE' }),

  // Stats
  getStats: () => apiFetch<import('./types').StatsResponse>('/stats'),
  getPlayerStats: (id: string) => apiFetch<import('./types').PlayerStats>(`/stats?player_id=${id}`),
  getDeckStats: (id: string) => apiFetch<import('./types').DeckStats>(`/stats?deck_id=${id}`),
  getHeadToHead: (player1Id?: string, player2Id?: string) => {
    const params = player1Id && player2Id ? `?player1=${player1Id}&player2=${player2Id}` : '';
    return apiFetch<import('./types').HeadToHeadResponse>(`/head-to-head${params}`);
  },

  // Advanced Stats
  getAdvancedStats: () => apiFetch<import('./types').AdvancedStatsResponse>('/advanced-stats'),

  // Stat Panels
  getStatPanels: () => apiFetch<import('./types').StatPanelsResponse>('/stat-panels'),
  getStatPanel: (id: string) => apiFetch<import('./types').StatPanel>(`/stat-panels?id=${id}`),
  getStatPanelByCode: (code: string) =>
    apiFetch<import('./types').StatPanel>(`/stat-panels?share_code=${code}`),
  createStatPanel: (data: import('./types').CreateStatPanelInput) =>
    apiFetch<import('./types').StatPanel>('/stat-panels', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatPanel: (id: string, data: import('./types').UpdateStatPanelInput) =>
    apiFetch<import('./types').StatPanel>(`/stat-panels?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteStatPanel: (id: string) =>
    apiFetch<{ success: boolean }>(`/stat-panels?id=${id}`, { method: 'DELETE' }),

  // Live Game Sessions (no auth — seat code is the credential)
  createLiveGame: (state: import('./types').GameManagerState, seats: string[], userId?: string) =>
    apiFetch<import('./types').LiveGameSession>('/live-game', {
      method: 'POST',
      body: JSON.stringify({ state, seats, user_id: userId }),
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

  // Get user's active game session (requires auth)
  getActiveGame: () =>
    apiFetch<{
      is_active: boolean;
      state: import('./types').GameManagerState | null;
      session_code: string | null;
      session_seats: Record<string, string> | null;
    }>('/active-game'),

  // Deck Cards (card list for a deck)
  // Phase 5: deck-cards.php is now a 410 Gone shim. This wrapper routes through
  // lists.php?deck_id=&role=main, which returns the deck's main list with cards.
  // The shape is adapted back to DeckCard[] for backwards compat with legacy callers.
  getDeckCards: async (deckId: string): Promise<import('./types').DeckCard[]> => {
    try {
      const detail = await apiFetch<{ id: string; cards: ApiCardRow[] }>(
        `/lists?deck_id=${encodeURIComponent(deckId)}&role=main`
      );
      const rows = detail.cards ?? [];
      // Stamp deck_id onto each card so legacy callers that read row.deck_id still work.
      return rows.map((r) => ({ ...fromApiCard(r), deck_id: deckId })) as unknown as import('./types').DeckCard[];
    } catch (err) {
      // 404 = deck has no main list yet (valid empty state). Return [].
      if (err instanceof Error && /not found|no list found/i.test(err.message)) return [];
      throw err;
    }
  },
  getDeckProfile: (deckId: string) =>
    apiFetch<import('./types').DeckProfile>(`/deck-profile?id=${deckId}`),
  // Phase 5 reroute: deck-cards.php is a 410 Gone shim. saveDeckCards finds the
  // deck's role='main' list and replaces its cards. If the deck has no main list
  // (e.g., a freshly-created deck from the new-deck save flow), creates one and
  // attaches it to the deck before saving. This preserves the legacy contract
  // where saveDeckCards "just works" against any deck id.
  saveDeckCards: async (deckId: string, cards: import('./types').CreateDeckCardInput[]): Promise<{ success: boolean; deck_id: string }> => {
    let listId: string;
    try {
      const list = await apiFetch<{ id: string }>(`/lists?deck_id=${encodeURIComponent(deckId)}&role=main`);
      listId = list.id;
    } catch (err) {
      if (!(err instanceof Error && err.message.toLowerCase().includes('not found'))) throw err;
      const created = await apiFetch<{ success: boolean; list_id: string }>('/lists', {
        method: 'POST',
        body: JSON.stringify({ name: 'Main', format: 'commander', role: 'main' }),
      });
      listId = created.list_id;
      await apiFetch<{ success: boolean }>('/lists?action=attach_deck', {
        method: 'POST',
        body: JSON.stringify({ list_id: listId, deck_id: deckId }),
      });
    }
    await apiFetch<{ success: boolean }>(`/lists?id=${encodeURIComponent(listId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ cards }),
    });
    return { success: true, deck_id: deckId };
  },
  // Phase 5 reroute: deck-cards.php is a 410 Gone shim. deleteDeckCards now:
  //   Finds the deck's role='main' list and clears its cards via PATCH /lists?id={ cards: [] }.
  //   The list stays attached to the deck — clearing cards in the deck context should
  //   leave the deck empty without spawning an orphan list in /lists.
  //   If the deck has no main list, the call is a no-op.
  deleteDeckCards: async (deckId: string): Promise<{ success: boolean }> => {
    let listId: string;
    try {
      const list = await apiFetch<{ id: string }>(`/lists?deck_id=${encodeURIComponent(deckId)}&role=main`);
      listId = list.id;
    } catch (err) {
      if (err instanceof Error && err.message.toLowerCase().includes('not found')) {
        return { success: true };
      }
      throw err;
    }
    return apiFetch<{ success: boolean }>(`/lists?id=${encodeURIComponent(listId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ cards: [] }),
    });
  },

  // Card Lists
  getLists: () => apiFetch<import('./types').CardList[]>('/lists'),
  getList: async (id: string): Promise<import('./types').CardListDetail> => {
    // TODO Phase 1: return a Card[]-based detail type and remove the cast once call sites migrate.
    // ListCard.is_commander is number; Card.is_commander is boolean — structurally incompatible.
    // fromApiCard is the one place where 0|1 → boolean conversion happens for list cards.
    const detail = await apiFetch<import('./types').CardListDetail & { cards: ApiCardRow[] }>(`/lists?id=${id}`);
    return {
      ...detail,
      cards: detail.cards.map(fromApiCard) as unknown as import('./types').ListCard[],
    };
  },
  createList: (name: string, description?: string, cards?: import('./types').CreateDeckCardInput[]) =>
    apiFetch<{ success: boolean; list_id: string }>('/lists', {
      method: 'POST',
      body: JSON.stringify({ name, description, cards }),
    }),
  updateList: (id: string, patch: { name?: string; description?: string; cards?: import('./types').CreateDeckCardInput[] }) =>
    apiFetch<{ success: boolean }>(`/lists?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),
  deleteList: (id: string) =>
    apiFetch<{ success: boolean }>(`/lists?id=${id}`, { method: 'DELETE' }),
  detachDeckToList: (deckId: string, name: string) =>
    apiFetch<{ success: boolean; list_id: string }>('/lists?action=detach_deck', {
      method: 'POST',
      body: JSON.stringify({ deck_id: deckId, name }),
    }),
  attachListToDeck: (listId: string, deckId: string) =>
    apiFetch<{ success: boolean }>('/lists?action=attach_deck', {
      method: 'POST',
      body: JSON.stringify({ list_id: listId, deck_id: deckId }),
    }),

  // Lists v2 — deck-aware (UUID-keyed, post-v4.7.0 schema)
  // These methods complement the existing integer-keyed list methods above and
  // are used by the useList hook introduced in Phase 2.2 Step 3.

  /**
   * Load the deck's role='main' list with its cards.
   * Returns a CardListDetail-shaped object with Card[] (boolean flags already converted).
   * If the endpoint doesn't support the deck_id+role query, the caller (useList) falls
   * back to /decks?id=<uuid> to get the main_list_id, then calls getList.
   */
  getListByDeckId: async (deckId: string): Promise<import('./types').CardListDetail & { deck_id: string | null; role: string | null; version: number }> => {
    const detail = await apiFetch<import('./types').CardListDetail & { deck_id: string | null; role: string | null; version: number; cards: ApiCardRow[] }>(
      `/lists?deck_id=${encodeURIComponent(deckId)}&role=main`
    );
    return {
      ...detail,
      cards: detail.cards.map(fromApiCard) as unknown as import('./types').ListCard[],
    };
  },

  /**
   * Atomically replace a list's cards (POST /lists?id=<uuid>).
   * Passes `version` for optimistic concurrency control — server returns 409 on mismatch.
   * Returns the new server-assigned version number on success.
   */
  saveListCards: (listId: string, cards: import('./types').CreateListCardInput[], version: number): Promise<{ success: boolean; version: number }> =>
    apiFetch<{ success: boolean; version: number }>(`/lists?id=${encodeURIComponent(listId)}`, {
      method: 'POST',
      body: JSON.stringify({ cards, version }),
    }),

  /**
   * Attach a list to a deck (UUID-keyed).
   * TODO(Step 6): No-op shim until Step 6 makes the underlying SQL functional.
   * Call refresh() after this to pick up the updated deck_id once Step 6 lands.
   */
  attachListToDeckV2: (listId: string, deckId: string): Promise<{ success: boolean }> =>
    apiFetch<{ success: boolean }>(`/lists?id=${encodeURIComponent(listId)}&action=attach_deck`, {
      method: 'POST',
      body: JSON.stringify({ deck_id: deckId }),
    }),

  /**
   * Detach a list from its deck (UUID-keyed).
   * TODO(Step 6): No-op shim until Step 6 makes the underlying SQL functional.
   * Call refresh() after this to pick up the cleared deck_id once Step 6 lands.
   */
  detachListFromDeck: (listId: string): Promise<{ success: boolean }> =>
    apiFetch<{ success: boolean }>(`/lists?id=${encodeURIComponent(listId)}&action=detach_deck`, {
      method: 'POST',
    }),

  resolveListImages: async (listId: string): Promise<{ updated: import('./types').ListCard[] }> => {
    // TODO Phase 1: return Card[] in the updated array once call sites migrate off ListCard.
    // ListCard.is_commander is number; Card.is_commander is boolean — structurally incompatible.
    const result = await apiFetch<{ updated: ApiCardRow[] }>('/list-image-resolve', {
      method: 'POST',
      body: JSON.stringify({ list_id: listId }),
    });
    return { updated: result.updated.map(fromApiCard) as unknown as import('./types').ListCard[] };
  },

  // Scryfall card cache
  lookupCard: (name: string) =>
    apiFetch<import('./types').ScryfallCachedCard | null>(
      `/scryfall-cache?name=${encodeURIComponent(name)}`
    ),
  bulkLookupCards: (names: string[]) =>
    apiFetch<{ results: (import('./types').ScryfallCachedCard & { error?: string })[] }>(
      '/scryfall-cache',
      { method: 'POST', body: JSON.stringify({ names }) }
    ),

  // Deck Scanner (Claude Vision)
  scanDeck: (imageBase64: string, mimeType: string) =>
    apiFetch<{ cards: { name: string; proxy: boolean }[] }>('/scan', {
      method: 'POST',
      body: JSON.stringify({ image: imageBase64, mime_type: mimeType }),
    }),
  findCardCrop: (imageBase64: string, mimeType: string, cardName: string) =>
    apiFetch<{ crop: { x: number; y: number; w: number; h: number } | null }>('/scan', {
      method: 'POST',
      body: JSON.stringify({ image: imageBase64, mime_type: mimeType, find_card: cardName }),
    }),

  // Card image caching (on-demand fetch + store as base64)
  getCardImage: (scryfallId: string, url?: string) =>
    apiFetch<{ data_uri: string; cached: boolean }>(
      `/card-image?scryfall_id=${encodeURIComponent(scryfallId)}${url ? `&url=${encodeURIComponent(url)}` : ''}`
    ),

  // All printings of a card from Scryfall
  getCardPrints: (name: string) =>
    apiFetch<{ prints: import('./types').CardPrint[] }>(
      `/card-prints?name=${encodeURIComponent(name)}`
    ),

  // Users (admin)
  getUsers: () =>
    apiFetch<{ id: string; username: string; display_name: string; role: string }[]>('/auth/users'),

  // Buffer draft (cross-device pre-save card buffer, keyed by device+context)
  getBufferDraft: (deviceId: string, contextType: string, contextRef = '') =>
    apiFetch<{ state: import('./types').ScanDraft | null }>(
      `/buffer-draft?device_id=${encodeURIComponent(deviceId)}&context_type=${encodeURIComponent(contextType)}&context_ref=${encodeURIComponent(contextRef)}`
    ),
  saveBufferDraft: (deviceId: string, contextType: string, contextRef: string, state: import('./types').ScanDraft) =>
    apiFetch<{ success: boolean }>('/buffer-draft', {
      method: 'POST',
      body: JSON.stringify({ device_id: deviceId, context_type: contextType, context_ref: contextRef, state }),
    }),
  clearBufferDraft: (deviceId: string, contextType: string, contextRef = '') =>
    apiFetch<{ success: boolean }>(
      `/buffer-draft?device_id=${encodeURIComponent(deviceId)}&context_type=${encodeURIComponent(contextType)}&context_ref=${encodeURIComponent(contextRef)}`,
      { method: 'DELETE' }
    ),

  // Comparison Builder
  getComparison: (config: import('./types').ComparisonConfig) => {
    const params = buildComparisonParams(config);
    return apiFetch<import('./types').ComparisonResult>(`/comparison?${params}`);
  },

  // Game Settings (user preferences)
  getGameSettings: () =>
    apiFetch<{
      sound_enabled: boolean;
      highlight_mode: boolean;
      turn_timer_enabled: boolean;
      turn_timer_seconds: number;
    }>('/game-settings'),
  updateGameSettings: (settings: {
    sound_enabled?: boolean;
    highlight_mode?: boolean;
    turn_timer_enabled?: boolean;
    turn_timer_seconds?: number;
  }) =>
    apiFetch<{ success: boolean; sound_enabled: boolean; highlight_mode: boolean; turn_timer_enabled: boolean; turn_timer_seconds: number }>(
      '/game-settings',
      { method: 'POST', body: JSON.stringify(settings) }
    ),

  // TTS Export — generates sprite-sheet JSON for Tabletop Simulator
  exportTTS: (params: { deckId?: string; listId?: string }) => {
    const q = params.deckId ? `deck_id=${params.deckId}` : `list_id=${params.listId}`;
    return apiFetch<Record<string, unknown>>(`/tts-export?${q}`);
  },

  // Changelog
  getChangelog: () =>
    apiFetch<Array<{ version: string; date: string; title: string; changes: Array<{ type: string; text: string }> }>>('/changelog'),

  // My Collection
  getMyCollection: () =>
    apiFetch<import('./types').MyCollectionResponse>('/my-collection'),
  getCoachNotes: () =>
    apiFetch<import('./types').CoachNote[]>('/coach-notes'),
  getAllCoachNotes: () =>
    apiFetch<(import('./types').CoachNote & { player_id: string; player_name: string })[]>('/coach-notes?all=1'),
  updateCoachNote: (id: string, data: { topic?: string; observation?: string; reasoning?: string }) =>
    apiFetch<{ success: boolean }>(`/coach-notes?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCoachNote: (id: string) =>
    apiFetch<{ success: boolean }>(`/coach-notes?id=${id}`, { method: 'DELETE' }),

  // Coach Chat (polling-based)
  sendCoachMessage: async (
    message: string,
    history: import('./types').CoachMessage[],
    activeDeck?: { deckId: string; deckName: string; commander: string; cardCount: number; colors: string },
    activeList?: { listId: string; listName: string; cardCount: number },
    onPartial?: (text: string) => void,
    signal?: AbortSignal,
  ): Promise<{ response: string; toolsUsed: { name: string; input: Record<string, unknown> }[] }> => {
    const body: Record<string, unknown> = { message, history };
    if (activeDeck) {
      body.active_deck = {
        id: activeDeck.deckId,
        name: activeDeck.deckName,
        commander: activeDeck.commander,
        card_count: activeDeck.cardCount,
        colors: activeDeck.colors,
      };
    }
    if (activeList) {
      body.active_list = {
        id: activeList.listId,
        name: activeList.listName,
        card_count: activeList.cardCount,
      };
    }
    // Step 1: POST to submit message — returns request_id
    const submit = await apiFetch<{ status: string; request_id: string }>('/coach-chat', {
      method: 'POST',
      body: JSON.stringify(body),
      signal,
    });

    // Abort-aware delay
    const wait = (ms: number) => new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, ms);
      signal?.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')); }, { once: true });
    });

    // Step 2: Poll with progressive backoff: 1s, 1.5s, 2s, 2.5s, 3s (cap at 3s)
    const pollDelay = (attempt: number) => Math.min(1000 + attempt * 500, 3000);
    for (let i = 0; i < 120; i++) {
      await wait(pollDelay(i));
      const poll = await apiFetch<{ status: string; response?: string; partial?: string; tools_used?: { name: string; input: Record<string, unknown> }[]; _debug?: Record<string, unknown>; _php_output?: string }>(
        `/coach-chat?poll=${submit.request_id}`, { signal }
      );
      if (poll.status === 'complete') {
        if (poll._debug) console.log('[coach] complete debug:', poll._debug);
        return { response: poll.response ?? '', toolsUsed: poll.tools_used ?? [] };
      }
      if (poll._php_output) console.warn('[coach] PHP output leaked:', poll._php_output);
      if (poll.partial && onPartial) onPartial(poll.partial);
    }
    console.error('[coach] timed out after 120 polls');
    throw new Error('Coach chat response timed out');
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
