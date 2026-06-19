'use client';

/**
 * useLocalStorageBool — boolean state backed by localStorage, keyed per caller.
 *
 * The pattern in PlayerPanel ("cmdDmgShowPlayer:<id>" and friends) was a useState
 * with a try/catch lazy initializer plus a setter that mirrored to localStorage.
 * Pulled out here so per-seat toggles don't each carry that boilerplate, and so
 * SSR-safe access (try/catch around `localStorage`) lives in one place.
 *
 * Returns the React-style [value, toggle] tuple. The toggle accepts a boolean
 * to set explicitly, or no argument to flip the current value.
 */
import { useCallback, useState } from 'react';

export function useLocalStorageBool(
  key: string,
  defaultValue: boolean = false,
): [boolean, (next?: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return raw === '1';
    } catch {
      return defaultValue;
    }
  });

  const set = useCallback(
    (next?: boolean) => {
      setValue((prev) => {
        const resolved = typeof next === 'boolean' ? next : !prev;
        try {
          localStorage.setItem(key, resolved ? '1' : '0');
        } catch {
          /* private mode / quota — keep the in-memory value */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set];
}
