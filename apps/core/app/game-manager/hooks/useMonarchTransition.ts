'use client';

import { useEffect, useRef, useState } from 'react';

export type MonarchAnim = 'hidden' | 'entering' | 'exiting' | 'idle';

interface UseMonarchTransitionResult {
  monarchAnim: MonarchAnim;
  monarchEnterIsTransfer: boolean;
}

/**
 * Animates the crown as `isMonarch` flips. When the player becomes monarch:
 * - if `monarchTransfer.fromPos` and `toPos` are both set, the crown plays
 *   the longer "transfer" entry animation (~1.8s)
 * - otherwise the crown plays the shorter ascent (~0.7s)
 *
 * When the player loses monarch, the crown plays an exit animation (~0.6s)
 * before hiding.
 *
 * The transfer prop is read via ref so an interim change (e.g. host clears the
 * transfer hint between mount and the isMonarch flip) doesn't cancel the
 * animation. Effect deps intentionally exclude the transfer prop.
 */
export function useMonarchTransition(
  isMonarch: boolean,
  monarchTransfer: { fromPos: string | null; toPos: string | null },
): UseMonarchTransitionResult {
  const [monarchAnim, setMonarchAnim] = useState<MonarchAnim>(
    isMonarch ? 'idle' : 'hidden',
  );
  const [monarchEnterIsTransfer, setMonarchEnterIsTransfer] = useState(false);
  const monarchTransferRef = useRef(monarchTransfer);
  monarchTransferRef.current = monarchTransfer;
  const prevIsMonarchRef = useRef(isMonarch);

  useEffect(() => {
    const was = prevIsMonarchRef.current;
    const is = isMonarch;
    prevIsMonarchRef.current = is;
    if (!was && is) {
      const isXfer =
        monarchTransferRef.current.fromPos !== null &&
        monarchTransferRef.current.toPos !== null;
      setMonarchEnterIsTransfer(isXfer);
      setMonarchAnim('entering');
      const t = setTimeout(() => setMonarchAnim('idle'), isXfer ? 1800 : 700);
      return () => clearTimeout(t);
    } else if (was && !is) {
      setMonarchAnim('exiting');
      const t = setTimeout(() => setMonarchAnim('hidden'), 600);
      return () => clearTimeout(t);
    }
  }, [isMonarch]);

  return { monarchAnim, monarchEnterIsTransfer };
}
