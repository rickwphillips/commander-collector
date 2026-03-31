import type { ActiveGameContext, ChatResponse, ChatProcessingResponse, ChatPollResponse, RulesConversation, RulesMessage, RulesPattern } from './types';

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

  rateQaLog: (payload: { qa_log_id: number; correctness: number; rating_notes: string }) =>
    apiFetch<{ success: boolean }>('/rules/qa-log-rate.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Chat — async: POST returns immediately with user_message_id, then poll for result
  sendMessage: async (payload: {
    message: string;
    conversation_id?: number;
    new_conversation_title?: string;
    game_context?: ActiveGameContext | null;
  }): Promise<ChatResponse> => {
    // Step 1: submit — returns { status: 'processing', conversation_id, user_message_id }
    const submit = await apiFetch<ChatProcessingResponse>('/rules/chat.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // Step 2: poll until assistant response is ready (max ~5 min)
    const maxAttempts = 100; // 100 × 3s = 5 min
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const poll = await apiFetch<ChatPollResponse>(
        `/rules/chat.php?poll=${submit.user_message_id}`
      );
      if (poll.status === 'complete') {
        return {
          conversation_id: poll.conversation_id!,
          message_id: poll.message_id!,
          qa_log_id: poll.qa_log_id ?? null,
          response: poll.response!,
          pending_pattern: poll.pending_pattern ?? null,
        };
      }
    }
    throw new Error('Chat response timed out');
  },
};
