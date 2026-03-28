import type { ChatResponse, RulesConversation, RulesMessage, RulesPattern } from './types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  (process.env.NODE_ENV === 'production'
    ? '/app/php-api'
    : '/php-api');

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
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

  // Chat
  sendMessage: (payload: {
    message: string;
    conversation_id?: number;
    new_conversation_title?: string;
  }) =>
    apiFetch<ChatResponse>('/rules/chat.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
