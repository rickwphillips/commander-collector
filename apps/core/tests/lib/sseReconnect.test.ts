import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BACKOFF, backoffDelay, openReconnectingEventSource } from '../../app/lib/sseReconnect';

class MockEventSource {
  static instances: MockEventSource[] = [];
  url: string;
  readyState = 0;
  onopen: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  closed = false;
  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }
  close() { this.closed = true; this.readyState = 2; }
}

const last = () => MockEventSource.instances[MockEventSource.instances.length - 1];

describe('backoffDelay', () => {
  it('doubles per attempt, with jitter in [exp/2, exp]', () => {
    expect(backoffDelay(0, () => 0)).toBe(BACKOFF.baseMs / 2);
    expect(backoffDelay(0, () => 1)).toBe(BACKOFF.baseMs);
    expect(backoffDelay(3, () => 0)).toBe((BACKOFF.baseMs * 8) / 2);
    expect(backoffDelay(3, () => 1)).toBe(BACKOFF.baseMs * 8);
  });

  it('caps at maxMs', () => {
    expect(backoffDelay(20, () => 1)).toBe(BACKOFF.maxMs);
    expect(backoffDelay(20, () => 0)).toBe(BACKOFF.maxMs / 2);
  });

  it('treats negative attempts as the first attempt', () => {
    expect(backoffDelay(-5, () => 1)).toBe(BACKOFF.baseMs);
  });

  it('uses Math.random by default and stays inside the band', () => {
    const d = backoffDelay(2);
    expect(d).toBeGreaterThanOrEqual(BACKOFF.baseMs * 2);
    expect(d).toBeLessThanOrEqual(BACKOFF.baseMs * 4);
  });
});

describe('openReconnectingEventSource', () => {
  beforeEach(() => {
    MockEventSource.instances = [];
    vi.stubGlobal('EventSource', MockEventSource as unknown as typeof EventSource);
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('forwards open and messages', () => {
    const onMessage = vi.fn();
    const onOpen = vi.fn();
    openReconnectingEventSource('u', { onMessage, onOpen });
    const es = last();
    es.onopen!();
    expect(onOpen).toHaveBeenCalledWith(es);
    es.onmessage!({ data: '{"type":"state"}' });
    expect(onMessage).toHaveBeenCalledWith('{"type":"state"}');
    expect(es.closed).toBe(false);
  });

  it('reconnects quickly after a planned close without forwarding it', () => {
    const onMessage = vi.fn();
    openReconnectingEventSource('u', { onMessage });
    const first = last();
    first.onmessage!({ data: ' {"type":"close"} ' });
    expect(onMessage).not.toHaveBeenCalled();
    expect(first.closed).toBe(true);
    expect(MockEventSource.instances).toHaveLength(1);
    vi.advanceTimersByTime(BACKOFF.plannedMs);
    expect(MockEventSource.instances).toHaveLength(2);
  });

  it('backs off exponentially with jitter on repeated errors', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1); // top of the band => deterministic
    const onError = vi.fn();
    openReconnectingEventSource('u', { onMessage: vi.fn(), onError });

    last().onerror!();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(last().closed).toBe(true);
    vi.advanceTimersByTime(BACKOFF.baseMs - 1);
    expect(MockEventSource.instances).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(MockEventSource.instances).toHaveLength(2);

    last().onerror!();
    vi.advanceTimersByTime(BACKOFF.baseMs * 2 - 1);
    expect(MockEventSource.instances).toHaveLength(2);
    vi.advanceTimersByTime(1);
    expect(MockEventSource.instances).toHaveLength(3);

    last().onerror!();
    vi.advanceTimersByTime(BACKOFF.baseMs * 4);
    expect(MockEventSource.instances).toHaveLength(4);
  });

  it('never exceeds the cap no matter how many errors', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    openReconnectingEventSource('u', { onMessage: vi.fn() });
    for (let i = 0; i < 12; i++) {
      last().onerror!();
      vi.advanceTimersByTime(BACKOFF.maxMs);
    }
    expect(MockEventSource.instances).toHaveLength(13);
  });

  it('resets the backoff once a real message arrives', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    openReconnectingEventSource('u', { onMessage: vi.fn() });
    last().onerror!();
    vi.advanceTimersByTime(BACKOFF.baseMs);
    last().onerror!();
    vi.advanceTimersByTime(BACKOFF.baseMs * 2);
    expect(MockEventSource.instances).toHaveLength(3);

    last().onmessage!({ data: '{"type":"events","events":[]}' });
    last().onerror!();
    // Back to the first-attempt delay, not the fourth.
    vi.advanceTimersByTime(BACKOFF.baseMs);
    expect(MockEventSource.instances).toHaveLength(4);
  });

  it('malformed data is forwarded, not treated as a planned close', () => {
    const onMessage = vi.fn();
    openReconnectingEventSource('u', { onMessage });
    last().onmessage!({ data: 'not json' });
    expect(onMessage).toHaveBeenCalledWith('not json');
    expect(last().closed).toBe(false);
  });

  it('cleanup closes the socket and cancels a pending reconnect', () => {
    const close = openReconnectingEventSource('u', { onMessage: vi.fn() });
    last().onerror!();
    close();
    vi.advanceTimersByTime(BACKOFF.maxMs * 2);
    expect(MockEventSource.instances).toHaveLength(1);
    expect(last().closed).toBe(true);
  });

  it('cleanup during an open stream closes it and ignores later planned closes', () => {
    const close = openReconnectingEventSource('u', { onMessage: vi.fn() });
    const es = last();
    close();
    expect(es.closed).toBe(true);
    es.onmessage!({ data: '{"type":"close"}' });
    vi.advanceTimersByTime(BACKOFF.plannedMs * 10);
    expect(MockEventSource.instances).toHaveLength(1);
  });
});
