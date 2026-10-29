// Reconnecting EventSource with incremental random backoff.
//
// The browser's native EventSource reconnects after a fixed `retry:` interval
// (the server sent 100 ms) regardless of WHY the connection dropped. On
// 2026-10-27 a single 502 from the PHP tier turned every open game page into a
// 10-reconnects-per-second client, which tripped the host's per-account request
// limit and locked out every PHP endpoint on the account for 40 minutes.
//
// This wrapper owns the EventSource lifecycle instead:
//  - a planned server close (`{"type":"close"}` after SSE_MAX_SECONDS) reconnects
//    quickly, since the server is healthy and asked for it;
//  - an error closes the socket (so the browser cannot auto-retry) and reconnects
//    after an exponential delay with jitter, capped at BACKOFF.maxMs;
//  - the attempt counter resets as soon as a real message arrives.

export const BACKOFF = {
  baseMs: 1000,
  maxMs: 30_000,
  plannedMs: 100,
} as const;

// Exponential delay with "half jitter": uniform in [exp/2, exp] so a fleet of
// clients that failed together does not reconnect together.
export function backoffDelay(attempt: number, random: () => number = Math.random): number {
  const exp = Math.min(BACKOFF.maxMs, BACKOFF.baseMs * 2 ** Math.max(0, attempt));
  return Math.round(exp / 2 + random() * (exp / 2));
}

export interface ReconnectingSourceHandlers {
  onMessage: (data: string) => void;
  onOpen?: (es: EventSource) => void;
  onError?: (es: EventSource) => void;
}

function isPlannedClose(data: string): boolean {
  try {
    return (JSON.parse(data.trim()) as { type?: string }).type === 'close';
  } catch {
    return false;
  }
}

// Returns a cleanup that closes the socket and cancels any pending reconnect.
export function openReconnectingEventSource(
  url: string,
  handlers: ReconnectingSourceHandlers,
): () => void {
  let es: EventSource | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let attempt = 0;
  let stopped = false;

  const schedule = (delayMs: number) => {
    if (stopped) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { timer = null; connect(); }, delayMs);
  };

  const connect = () => {
    if (stopped) return;
    es = new EventSource(url);
    const current = es;

    current.onopen = () => { handlers.onOpen?.(current); };

    current.onmessage = (e: MessageEvent<string>) => {
      if (isPlannedClose(e.data)) {
        current.close();
        schedule(BACKOFF.plannedMs);
        return;
      }
      attempt = 0;
      handlers.onMessage(e.data);
    };

    current.onerror = () => {
      // Close first so the browser's own fixed-interval retry never fires.
      current.close();
      handlers.onError?.(current);
      schedule(backoffDelay(attempt));
      attempt += 1;
    };
  };

  connect();

  return () => {
    stopped = true;
    if (timer) { clearTimeout(timer); timer = null; }
    es?.close();
  };
}
