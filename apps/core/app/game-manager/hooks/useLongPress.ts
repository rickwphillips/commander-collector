'use client';

import { useCallback, useRef, useState } from 'react';

interface UseLongPressResult {
  /**
   * Key of the control whose long-press tooltip is currently showing, or null.
   * Consumers compare against their own per-control key for `Tooltip open=`.
   */
  lpKey: string | null;
  /** Start a long-press timer keyed on `key`. Fires `cb()` after ~500ms. */
  startLongPress: (key: string, cb: () => void) => void;
  /** Cancel the pending long-press (call on pointer up/leave). */
  cancelLongPress: () => void;
  /**
   * Wrap a normal click handler so it no-ops if the long-press already fired
   * during this press. Avoids double-firing (long-press +5 followed by
   * single-tap +1 on the same release).
   */
  guardClick: (cb: () => void) => () => void;
}

/**
 * Generic long-press detector with a shared "which control is long-pressing"
 * key, used to show a transient "-5/+5" tooltip while the gesture is active.
 *
 * Defaults: 500ms hold to fire, 700ms tooltip visibility after fire.
 */
export function useLongPress(holdMs = 500, tooltipMs = 700): UseLongPressResult {
  const [lpKey, setLpKey] = useState<string | null>(null);
  const lpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired = useRef(false);

  const startLongPress = useCallback(
    (key: string, cb: () => void) => {
      lpFired.current = false;
      lpTimer.current = setTimeout(() => {
        lpFired.current = true;
        cb();
        setLpKey(key);
        setTimeout(
          () => setLpKey((prev) => (prev === key ? null : prev)),
          tooltipMs,
        );
      }, holdMs);
    },
    [holdMs, tooltipMs],
  );

  const cancelLongPress = useCallback(() => {
    if (lpTimer.current) clearTimeout(lpTimer.current);
    lpTimer.current = null;
  }, []);

  const guardClick = useCallback(
    (cb: () => void) => () => {
      if (lpFired.current) {
        lpFired.current = false;
        return;
      }
      cb();
    },
    [],
  );

  return { lpKey, startLongPress, cancelLongPress, guardClick };
}
