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

  /** Attach a list to a deck (UUID-keyed). */
  attachListToDeckV2: (listId: string, deckId: string): Promise<{ success: boolean }> =>
    apiFetch<{ success: boolean }>(`/lists?id=${encodeURIComponent(listId)}&action=attach_deck`, {
      method: 'POST',
      body: JSON.stringify({ deck_id: deckId }),
    }),

  /** Detach a list from its deck (UUID-keyed). */
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
    activeDeck?: { deckId: string; deckName: string; commander: string; cardCount: number; colors: string; listId?: string },
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
        ...(activeDeck.listId ? { list_id: activeDeck.listId } : {}),
      };
    }
    if (activeList) {
      body.active_list = {
        id: activeList.listId,
        name: activeList.listName,
        card_count: activeList.cardCount,
      };
    }

    const url = `${API_BASE}coach-chat.php`;
    const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({})) as Record<string, unknown>;
      throw new Error((errData.error as string) ?? `Coach error ${res.status}`);
    }

    if (!res.body) throw new Error('No response body from coach stream');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // Parse complete SSE event blocks separated by blank lines
    const readEvents = (chunk: string): { event: string; data: string }[] => {
      buffer += chunk;
      const events: { event: string; data: string }[] = [];
      const blocks = buffer.split('\n\n');
      buffer = blocks.pop()!;
      for (const block of blocks) {
        let event = '', data = '';
        for (const line of block.split('\n')) {
          if (line.startsWith('event: ')) event = line.slice(7).trim();
          else if (line.startsWith('data: ')) data = line.slice(6).trim();
        }
        if (event && data) events.push({ event, data });
      }
      return events;
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const { event, data } of readEvents(decoder.decode(value, { stream: true }))) {
        let parsed: Record<string, unknown>;
        try { parsed = JSON.parse(data); } catch { console.warn('[coach] malformed SSE event:', event, data); continue; }
        if (event === 'tool_start' && onPartial) {
          onPartial(`Looking up ${parsed.tool}...`);
        } else if (event === 'done') {
          if (parsed._debug) console.log('[coach] done:', parsed._debug);
          return {
            response: (parsed.response as string) ?? '',
            toolsUsed: (parsed.tools_used as { name: string; input: Record<string, unknown> }[]) ?? [],
          };
        } else if (event === 'error') {
          throw new Error((parsed.error as string) ?? 'Coach error');
        }
      }
    }
    throw new Error('Coach stream ended without done event');
  },

  // Chat feedback (rateable chip toggle) — proxies to commander-mcp.
  submitChatFeedback: (payload: {
    surface:      'rules_guru' | 'coach';
    messageUuid:  string;
    kind:         'card' | 'cr_rule' | 'pattern' | 'claim';
    targetId:     string;
    rating:       'good' | 'not_relevant' | 'bad';
    contentText?: string;
    notes?:       string;
    deckId?:      string;
    listId?:      string;
    format?:      string;
  }) =>
    apiFetch<{
      band: 'certain' | 'unknown';
      data: { id: number; kind: string; target_id: string; rating: string; content_hash: string | null } | null;
      sources: string[];
      caveats: string[];
    }>('/chat-feedback', {
      method: 'POST',
      body: JSON.stringify({
        surface:       payload.surface,
        message_uuid:  payload.messageUuid,
        kind:          payload.kind,
        target_id:     payload.targetId,
        rating:        payload.rating,
        content_text:  payload.contentText,
        notes:         payload.notes,
        deck_id:       payload.deckId,
        list_id:       payload.listId,
        format:        payload.format,
      }),
    }),

  // ── commander-mcp brain (proxied through /rules/*.php) ──────────────────
  // Each method returns the MCP Confidence envelope:
  //   { band: 'certain' | 'unknown', data, sources, caveats }
  // Callers should check band before trusting data.

  lookupCRRule: (number: string) =>
    apiFetch<{
      band: 'certain' | 'unknown';
      data: { rule_number: string; body: string; examples: string[] } | null;
      sources: string[];
      caveats: string[];
    }>(`/rules/cr-rule?n=${encodeURIComponent(number)}`),

  getPattern: (patternId: string) =>
    apiFetch<{
      band: 'certain' | 'unknown';
      data: { pattern_id: string; name: string; abstract?: string; cr_refs?: string[]; tags?: string[] } | null;
      sources: string[];
      caveats: string[];
    }>(`/rules/pattern?id=${encodeURIComponent(patternId)}`),

  lookupInteraction: (cardA: string, cardB: string, context?: string) => {
    const params = new URLSearchParams({ a: cardA, b: cardB });
    if (context) params.set('context', context);
    return apiFetch<{
      band: 'certain' | 'unknown';
      data: {
        card_a: string;
        card_b: string;
        patterns: Array<{ pattern_id: string; name: string; abstract?: string }>;
        cr_refs_cited: string[];
        learned_weight: { weight: number; sample_size: number } | null;
      } | null;
      sources: string[];
      caveats: string[];
    }>(`/rules/interaction?${params.toString()}`);
  },

  scoreDeck: (decklist: string[], commander?: string) =>
    apiFetch<{
      band: 'high' | 'moderate' | 'unknown';
      data: {
        bracket: 1 | 2 | 3 | 4 | 5;
        bracket_name: string;
        strength_score: number;
        signals: Array<{ name: string; contribution: number; reason: string; data?: Record<string, unknown> }>;
        warnings: string[];
        color_identity: string[];
        missing: string[];
      } | null;
      sources: string[];
      caveats: string[];
    }>('/rules/score-deck', {
      method: 'POST',
      body: JSON.stringify({ decklist, commander }),
    }),

  getCardNote: (name: string, format = 'commander', archetype?: string) => {
    const params = new URLSearchParams({ name, format });
    if (archetype) params.set('archetype', archetype);
    return apiFetch<{
      band: 'certain' | 'unknown';
      data: {
        name: string;
        format: string;
        kind: 'banned' | 'trap' | 'staple' | 'situational' | 'requirement' | null;
        weight: number | null;
        reason: string | null;
        short_circuit: boolean;
        source: string | null;
      };
      sources: string[];
      caveats: string[];
    }>(`/rules/card-note?${params.toString()}`);
  },

  discussStrength: (decklist: string[], commander?: string) =>
    apiFetch<{
      band: 'high' | 'moderate' | 'unknown';
      data: {
        bracket: 1 | 2 | 3 | 4 | 5;
        bracket_name: string;
        strength_score: number;
        signals: Array<{ name: string; contribution: number; reason: string; data?: Record<string, unknown> }>;
        warnings: string[];
        color_identity: string[];
        missing: string[];
        narrative: string;
      } | null;
      sources: string[];
      caveats: string[];
    }>('/rules/discuss-strength', {
      method: 'POST',
      body: JSON.stringify({ decklist, commander }),
    }),
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
