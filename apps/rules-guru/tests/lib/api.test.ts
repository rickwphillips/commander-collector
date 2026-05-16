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
      card_feedback: { 'Sol Ring': true, 'Brainstorm': false },
    });
    const body = JSON.parse(mock.mock.calls[0][1].body);
    expect(body.card_feedback).toEqual({ 'Sol Ring': true, 'Brainstorm': false });
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
});
