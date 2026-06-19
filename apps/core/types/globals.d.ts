// Ambient globals augmenting Window for app-level instrumentation.
// Add new fields here instead of `(window as any)` / `(window as unknown as ...)` casts.

export {};

declare global {
  interface Window {
    /** Last seen SSE EventSource readyState (0 connecting, 1 open, 2 closed). Used by e2e tests to gate on stream readiness. */
    _sseReadyState?: number;
  }
}
