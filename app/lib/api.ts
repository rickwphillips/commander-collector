// API base URL - change this for production
// In production on Bluehost, this will be relative to /projects/commander/api
const isDev = process.env.NODE_ENV === 'development';

export const API_BASE = isDev
  ? '/app/php-api/'
  : '/php-api/';

// Helper for API calls
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Handle query strings properly - insert .php before the query string
  let url: string;
  if (endpoint.includes('?')) {
    const [path, query] = endpoint.split('?');
    url = `${API_BASE}${path}.php?${query}`;
  } else {
    url = `${API_BASE}${endpoint}.php`;
  }

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

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
  updatePlayer: (id: number, data: Partial<import('./types').CreatePlayerInput>) =>
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
  updateGame: (id: number, data: { played_at?: string; winning_turn?: number | null; notes?: string | null }) =>
    apiFetch<{ success: boolean }>(`/games?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteGame: (id: number) =>
    apiFetch<{ success: boolean }>(`/games?id=${id}`, { method: 'DELETE' }),

  // Stats
  getStats: () => apiFetch<import('./types').StatsResponse>('/stats'),
  getPlayerStats: (id: number) =>
    apiFetch<import('./types').PlayerStats>(`/stats?player_id=${id}`),
  getDeckStats: (id: number) =>
    apiFetch<import('./types').DeckStats>(`/stats?deck_id=${id}`),
  getHeadToHead: (player1Id?: number, player2Id?: number) => {
    const params = player1Id && player2Id
      ? `?player1=${player1Id}&player2=${player2Id}`
      : '';
    return apiFetch<import('./types').HeadToHeadRecord[]>(`/head-to-head${params}`);
  },
};
