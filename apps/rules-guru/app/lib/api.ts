import type { ActiveGameContext, ChatResponse, RulesConversation, RulesMessage, RulesPattern } from './types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  (process.env.NODE_ENV === 'production'
    ? '/app/php-api'
    : '/php-api');

const LOGIN_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/app/login/' : '/app/login/';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  const currentUrl = window.location.href;
  window.location.href = `${LOGIN_URL}?redirect=${encodeURIComponent(currentUrl)}`;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options?.headers ?? {}),
    },
  });
  if (res.status === 401) {
    redirectToLogin();
    throw new Error('Authentication required');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const rulesApi = {
  // Patterns
  getPatterns: () =>
    apiFetch<{ patterns: RulesPattern[] }>('/rules/patterns.php'),

  savePattern: (pattern: Omit<RulesPattern, 'id' | 'updated_at'>) =>
    apiFetch<{ pattern: RulesPattern }>('/rules/patterns.php', {
      method: 'POST',
      body: JSON.stringify(pattern),
    }),

  // Conversations
  getConversations: () =>
    apiFetch<{ conversations: RulesConversation[] }>('/rules/conversations.php'),

  getConversation: (id: number) =>
    apiFetch<{ conversation: RulesConversation; messages: RulesMessage[] }>(
      `/rules/conversations.php?id=${id}`
    ),

  deleteConversation: (id: number) =>
    apiFetch<{ deleted: number }>(`/rules/conversations.php?id=${id}`, {
      method: 'DELETE',
    }),

  // Active game context
  getActiveGame: () =>
    apiFetch<{ game: ActiveGameContext | null }>('/rules/active-game.php'),

  // Chat
  sendMessage: (payload: {
    message: string;
    conversation_id?: number;
    new_conversation_title?: string;
    game_context?: ActiveGameContext | null;
  }) =>
    apiFetch<ChatResponse>('/rules/chat.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
