import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { rulesApi } from '@/lib/api';

const TOKEN = 'test-jwt';

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  });
}

function makeStream(chunks: string[]) {
  let i = 0;
  const encoder = new TextEncoder();
  return new ReadableStream({
    pull(controller) {
      if (i < chunks.length) {
        controller.enqueue(encoder.encode(chunks[i++]));
      } else {
        controller.close();
      }
    },
  });
}

describe('rulesApi — feedback methods', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('auth_token', TOKEN);
    vi.clearAllMocks();
  });
  afterEach(() => { vi.restoreAllMocks(); });

  it('submitMessageFeedback POSTs to message-feedback.php', async () => {
    const mock = mockFetch(200, { id: 'abc', success: true });
    vi.stubGlobal('fetch', mock);
    await rulesApi.submitMessageFeedback({
      conversation_id: 1,
      rating: 'down',
      wrong_conclusion: true,
      notes: 'The ruling was backwards',
    });
    const [url, opts] = mock.mock.calls[0];
    expect(url).toContain('message-feedback.php');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.rating).toBe('down');
    expect(body.wrong_conclusion).toBe(true);
    expect(body.notes).toBe('The ruling was backwards');
  });

  it('submitMessageFeedback includes card_feedback when provided', async () => {
    const mock = mockFetch(200, { id: 'abc', success: true });
    vi.stubGlobal('fetch', mock);
    await rulesApi.submitMessageFeedback({
      conversation_id: 1,
      rating: 'up',
      card_feedback: { 'Sol Ring': 'good', 'Brainstorm': 'bad' },
    });
    const body = JSON.parse(mock.mock.calls[0][1].body);
    expect(body.card_feedback).toEqual({ 'Sol Ring': 'good', 'Brainstorm': 'bad' });
  });

  it('submitSessionFeedback POSTs to session-feedback.php with rating and indices', async () => {
    const mock = mockFetch(200, { id: 'xyz', success: true });
    vi.stubGlobal('fetch', mock);
    await rulesApi.submitSessionFeedback({
      conversation_id: 5,
      rating: 4,
      helpful_indices: [0, 2],
      notes: 'Good session',
    });
    const [url, opts] = mock.mock.calls[0];
    expect(url).toContain('session-feedback.php');
    const body = JSON.parse(opts.body);
    expect(body.rating).toBe(4);
    expect(body.helpful_indices).toEqual([0, 2]);
  });

  it('getFeedbackReview GETs feedback-review.php with no params by default', async () => {
    const mock = mockFetch(200, { items: [], total: 0, limit: 50, offset: 0 });
    vi.stubGlobal('fetch', mock);
    await rulesApi.getFeedbackReview();
    const [url] = mock.mock.calls[0];
    expect(url).toContain('feedback-review.php');
  });

  it('getFeedbackReview appends flagged and rating params', async () => {
    const mock = mockFetch(200, { items: [], total: 0, limit: 50, offset: 0 });
    vi.stubGlobal('fetch', mock);
    await rulesApi.getFeedbackReview({ flagged: true, rating: 'down' });
    const [url] = mock.mock.calls[0];
    expect(url).toContain('flagged=1');
    expect(url).toContain('rating=down');
  });

  it('getFeedbackReview appends limit and offset params', async () => {
    const mock = mockFetch(200, { items: [], total: 0, limit: 10, offset: 20 });
    vi.stubGlobal('fetch', mock);
    await rulesApi.getFeedbackReview({ limit: 10, offset: 20 });
    const [url] = mock.mock.calls[0];
    expect(url).toContain('limit=10');
    expect(url).toContain('offset=20');
  });
});

describe('rulesApi.sendMessage — SSE stream', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('auth_token', TOKEN);
    vi.clearAllMocks();
  });
  afterEach(() => { vi.restoreAllMocks(); });

  const SUBMIT_RESPONSE = { status: 'processing', conversation_id: 1, user_message_id: 42 };
  const COMPLETE_PAYLOAD = {
    status: 'complete',
    conversation_id: 1,
    message_id: 99,
    qa_log_id: null,
    response: 'Deathtouch kills anything it touches.',
    pending_pattern: null,
  };

  it('resolves with assistant response on complete event', async () => {
    const postMock = vi.fn().mockResolvedValueOnce({
      ok: true, json: () => Promise.resolve(SUBMIT_RESPONSE),
    });
    const streamMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      body: makeStream([
        ': keepalive\n\n',
        `event: complete\ndata: ${JSON.stringify(COMPLETE_PAYLOAD)}\n\n`,
      ]),
    });
    vi.stubGlobal('fetch', vi.fn()
      .mockImplementationOnce(postMock)
      .mockImplementationOnce(streamMock));

    const result = await rulesApi.sendMessage({ message: 'Does deathtouch kill anything?' });
    expect(result.response).toBe('Deathtouch kills anything it touches.');
    expect(result.conversation_id).toBe(1);
    expect(result.message_id).toBe(99);
  });

  it('rejects on error event', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(SUBMIT_RESPONSE) })
      .mockResolvedValueOnce({
        ok: true,
        body: makeStream(['event: error\ndata: {"error":"timeout"}\n\n']),
      }));

    await expect(rulesApi.sendMessage({ message: 'test' })).rejects.toThrow('timeout');
  });

  it('rejects when stream response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(SUBMIT_RESPONSE) })
      .mockResolvedValueOnce({ ok: false, status: 500, body: null }));

    await expect(rulesApi.sendMessage({ message: 'test' })).rejects.toThrow('Stream error 500');
  });

  it('sends auth header to stream endpoint', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(SUBMIT_RESPONSE) })
      .mockResolvedValueOnce({
        ok: true,
        body: makeStream([`event: complete\ndata: ${JSON.stringify(COMPLETE_PAYLOAD)}\n\n`]),
      });
    vi.stubGlobal('fetch', fetchMock);

    await rulesApi.sendMessage({ message: 'test' });
    const [, streamOpts] = fetchMock.mock.calls[1];
    expect(streamOpts.headers.Authorization).toBe(`Bearer ${TOKEN}`);
  });

  it('passes user_message_id as id param to stream endpoint', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(SUBMIT_RESPONSE) })
      .mockResolvedValueOnce({
        ok: true,
        body: makeStream([`event: complete\ndata: ${JSON.stringify(COMPLETE_PAYLOAD)}\n\n`]),
      });
    vi.stubGlobal('fetch', fetchMock);

    await rulesApi.sendMessage({ message: 'test' });
    const [streamUrl] = fetchMock.mock.calls[1];
    expect(streamUrl).toContain('chat-stream.php?id=42');
  });

  it('handles complete event split across two chunks', async () => {
    const payload = JSON.stringify(COMPLETE_PAYLOAD);
    const full = `event: complete\ndata: ${payload}\n\n`;
    const mid = Math.floor(full.length / 2);

    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(SUBMIT_RESPONSE) })
      .mockResolvedValueOnce({
        ok: true,
        body: makeStream([full.slice(0, mid), full.slice(mid)]),
      }));

    const result = await rulesApi.sendMessage({ message: 'test' });
    expect(result.response).toBe(COMPLETE_PAYLOAD.response);
  });

  it('rejects when the stream ends without a complete or error event', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(SUBMIT_RESPONSE) })
      .mockResolvedValueOnce({ ok: true, body: makeStream([': keepalive\n\n']) }));

    await expect(rulesApi.sendMessage({ message: 'test' })).rejects.toThrow(
      'Stream ended without a response'
    );
  });

  it('rejects immediately when the signal is already aborted after submit', async () => {
    const controller = new AbortController();
    controller.abort();
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(SUBMIT_RESPONSE) }));

    await expect(
      rulesApi.sendMessage({ message: 'test' }, controller.signal)
    ).rejects.toThrow();
  });

  it('uses a generic message when an error event omits the error field', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(SUBMIT_RESPONSE) })
      .mockResolvedValueOnce({ ok: true, body: makeStream(['event: error\ndata: {"foo":1}\n\n']) }));

    await expect(rulesApi.sendMessage({ message: 'test' })).rejects.toThrow('Stream error');
  });
});

describe('rulesApi — CRUD methods + apiFetch behavior', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('auth_token', TOKEN);
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('getPatterns GETs the patterns endpoint', async () => {
    const mock = mockFetch(200, { patterns: [] });
    vi.stubGlobal('fetch', mock);
    await rulesApi.getPatterns();
    expect(mock.mock.calls[0][0]).toContain('/rules/patterns.php');
  });

  it('savePattern POSTs the pattern body', async () => {
    const mock = mockFetch(200, { pattern: {} });
    vi.stubGlobal('fetch', mock);
    await rulesApi.savePattern({ title: 'T', body: 'B' } as never);
    const [url, opts] = mock.mock.calls[0];
    expect(url).toContain('/rules/patterns.php');
    expect(opts.method).toBe('POST');
  });

  it('getConversations GETs the conversations endpoint', async () => {
    const mock = mockFetch(200, { conversations: [] });
    vi.stubGlobal('fetch', mock);
    await rulesApi.getConversations();
    expect(mock.mock.calls[0][0]).toContain('/rules/conversations.php');
  });

  it('getConversation includes the id query', async () => {
    const mock = mockFetch(200, { conversation: {}, messages: [] });
    vi.stubGlobal('fetch', mock);
    await rulesApi.getConversation(7);
    expect(mock.mock.calls[0][0]).toContain('conversations.php?id=7');
  });

  it('deleteConversation DELETEs by id', async () => {
    const mock = mockFetch(200, { deleted: 1 });
    vi.stubGlobal('fetch', mock);
    await rulesApi.deleteConversation(7);
    const [url, opts] = mock.mock.calls[0];
    expect(url).toContain('conversations.php?id=7');
    expect(opts.method).toBe('DELETE');
  });

  it('getActiveGame GETs the active-game endpoint', async () => {
    const mock = mockFetch(200, { game: null });
    vi.stubGlobal('fetch', mock);
    await rulesApi.getActiveGame();
    expect(mock.mock.calls[0][0]).toContain('/rules/active-game.php');
  });

  it('rateQaLog POSTs the rating payload', async () => {
    const mock = mockFetch(200, { success: true });
    vi.stubGlobal('fetch', mock);
    await rulesApi.rateQaLog({ qa_log_id: 1, correctness: 5, rating_notes: 'good' });
    const [url, opts] = mock.mock.calls[0];
    expect(url).toContain('/rules/qa-log-rate.php');
    expect(opts.method).toBe('POST');
  });

  it('omits the auth header when no token is stored', async () => {
    localStorage.removeItem('auth_token');
    const mock = mockFetch(200, { patterns: [] });
    vi.stubGlobal('fetch', mock);
    await rulesApi.getPatterns();
    expect(mock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('omits the auth header server-side (no window)', async () => {
    const mock = mockFetch(200, { patterns: [] });
    vi.stubGlobal('fetch', mock);
    vi.stubGlobal('window', undefined);
    await rulesApi.getPatterns();
    expect(mock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('redirects and throws on a 401 response', async () => {
    vi.stubGlobal('fetch', mockFetch(401, { error: 'Unauthorized' }));
    const locationSpy = vi
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ ...window.location, href: 'http://localhost:3003' } as Location);

    await expect(rulesApi.getPatterns()).rejects.toThrow('Authentication required');
    locationSpy.mockRestore();
  });

  it('throws the server-provided error message on a failed request', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { error: 'boom' }));
    await expect(rulesApi.getPatterns()).rejects.toThrow('boom');
  });

  it('falls back to a status-based message when the error body lacks an error field', async () => {
    vi.stubGlobal('fetch', mockFetch(500, {}));
    await expect(rulesApi.getPatterns()).rejects.toThrow('API error 500');
  });
});
