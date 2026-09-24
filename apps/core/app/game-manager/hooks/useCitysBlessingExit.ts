'use client';

import { useEffect, useRef, useState } from 'react';

interface UseCitysBlessingExitResult {
  cityBlessingVisible: boolean;
  cityBlessingExiting: boolean;
}

/**
 * Drives the City's Blessing celebration overlay's visibility, including the
 * 3.8s fade-out tail after the flag goes false. Also fires `onEnter` exactly
 * once each time the blessing transitions false → true (used for the intro
 * fanfare audio).
 *
 * `hasCitysBlessing` is the primitive from `player`; `onEnter` should be a
 * stable reference (e.g. memoized via useCallback in the parent).
 */
export function useCitysBlessingExit(
  hasCitysBlessing: boolean,
  onEnter: () => void,
): UseCitysBlessingExitResult {
  const [cityBlessingVisible, setCityBlessingVisible] = useState(hasCitysBlessing);
  const [cityBlessingExiting, setCityBlessingExiting] = useState(false);
  const prevHasCitysBlessing = useRef(hasCitysBlessing);

  // Show immediately on true; start the fade-out tail on true → false.
  const [prevHas, setPrevHas] = useState(hasCitysBlessing);
  if (hasCitysBlessing !== prevHas) {
    setPrevHas(hasCitysBlessing);
    if (hasCitysBlessing) {
      setCityBlessingVisible(true);
      setCityBlessingExiting(false);
    } else if (cityBlessingVisible) {
      setCityBlessingExiting(true);
    }
  }

  useEffect(() => {
    if (hasCitysBlessing) {
      if (!prevHasCitysBlessing.current) onEnter();
      prevHasCitysBlessing.current = true;
    } else {
      prevHasCitysBlessing.current = false;
      if (cityBlessingVisible) {
        const t = setTimeout(() => {
          setCityBlessingVisible(false);
          setCityBlessingExiting(false);
        }, 3800);
        return () => clearTimeout(t);
      }
    }
  }, [hasCitysBlessing, onEnter]);

  return { cityBlessingVisible, cityBlessingExiting };
}
