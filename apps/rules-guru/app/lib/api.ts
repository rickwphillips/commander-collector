import type { ActiveGameContext, ChatResponse, ChatProcessingResponse, ChatPollResponse, RulesConversation, RulesMessage, RulesPattern } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/php-api';

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

  submitMessageFeedback: (payload: {
    conversation_id: number;
    message_id?: number;
    message_snippet?: string;
    rating: 'up' | 'down';
    wrong_conclusion?: boolean;
    wrong_cr_cite?: boolean;
    missing_cr_rules?: boolean;
    off_topic?: boolean;
    hard_to_apply?: boolean;
    cards_not_relevant?: boolean;
    card_feedback?: Record<string, 'good' | 'not_relevant' | 'bad'>;
    notes?: string;
    flag_pattern?: boolean;
  }) =>
    apiFetch<{ id: string; success: boolean }>('/rules/message-feedback.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitSessionFeedback: (payload: {
    conversation_id: number;
    rating: number;
    helpful_indices?: number[];
    notes?: string;
  }) =>
    apiFetch<{ id: string; success: boolean }>('/rules/session-feedback.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getFeedbackReview: (params?: { flagged?: boolean; rating?: 'up' | 'down'; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params?.flagged) qs.set('flagged', '1');
    if (params?.rating) qs.set('rating', params.rating);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    const q = qs.toString();
    return apiFetch<{
      items: Array<{
        id: string;
        conversation_id: number;
        message_id: number | null;
        message_snippet: string | null;
        rating: 'up' | 'down';
        wrong_ruling: number;
        wrong_cr_cite: number;
        incomplete: number;
        unclear: number;
        notes: string | null;
        flag_pattern: number;
        created_at: string;
      }>;
      total: number;
      limit: number;
      offset: number;
    }>(`/rules/feedback-review.php${q ? `?${q}` : ''}`);
  },

  // Chat — async: POST submits, then SSE stream delivers the result
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

    // Step 2: open SSE stream — server pushes one 'complete' event when ready
    return new Promise<ChatResponse>((resolve, reject) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const url = `${API_BASE}/rules/chat-stream.php?id=${submit.user_message_id}`;

      fetch(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }).then(async (res) => {
        if (!res.ok || !res.body) {
          reject(new Error(`Stream error ${res.status}`));
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const blocks = buffer.split('\n\n');
          buffer = blocks.pop() ?? '';

          for (const block of blocks) {
            const lines = block.split('\n');
            let eventName = 'message';
            let dataLine = '';

            for (const line of lines) {
              if (line.startsWith('event:')) eventName = line.slice(6).trim();
              else if (line.startsWith('data:')) dataLine = line.slice(5).trim();
            }

            if (eventName === 'complete' && dataLine) {
              const data = JSON.parse(dataLine) as ChatPollResponse;
              reader.cancel();
              resolve({
                conversation_id: data.conversation_id!,
                message_id: data.message_id!,
                qa_log_id: data.qa_log_id ?? null,
                response: data.response!,
                pending_pattern: data.pending_pattern ?? null,
              });
              return;
            }

            if (eventName === 'error' && dataLine) {
              reader.cancel();
              reject(new Error(JSON.parse(dataLine).error ?? 'Stream error'));
              return;
            }
          }
        }

        reject(new Error('Stream ended without a response'));
      }).catch(reject);
    });
  },
};
