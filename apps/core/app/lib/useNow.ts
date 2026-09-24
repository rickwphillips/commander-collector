'use client';

import { useSyncExternalStore } from 'react';

// The clock as an external store: a 1s interval notifies subscribers, and the
// snapshot is the current second (in ms) so repeated reads within a second are
// equal, as useSyncExternalStore requires.
function subscribe(onTick: () => void): () => void {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

function currentSecondMs(): number {
  return Math.floor(Date.now() / 1000) * 1000;
}

/**
 * Wall-clock time in ms, re-rendering once a second. Returns 0 during server
 * rendering and hydration; callers treat 0 as "not known yet".
 */
export function useNow(): number {
  return useSyncExternalStore(subscribe, currentSecondMs, () => 0);
}
