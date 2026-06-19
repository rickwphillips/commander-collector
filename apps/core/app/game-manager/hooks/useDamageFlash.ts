'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Watches a player's life total and emits a transient "flash" magnitude when
 * life drops. The returned number is the amount lost on the most recent
 * decrease, and resets to 0 after ~1s. Callers gate the damage-flash animation
 * (and its accompanying smoke/blood/skull layers) on this value.
 *
 * Takes the raw `life` primitive (not the player object) so the effect's
 * dep array is precise and consumers don't trigger updates on unrelated
 * player fields.
 */
export function useDamageFlash(life: number): number {
  const [damageFlash, setDamageFlash] = useState(0);
  const prevLife = useRef(life);
  useEffect(() => {
    if (life < prevLife.current) {
      const delta = prevLife.current - life;
      setDamageFlash(delta);
      const t = setTimeout(() => setDamageFlash(0), 1000);
      prevLife.current = life;
      return () => clearTimeout(t);
    }
    prevLife.current = life;
  }, [life]);
  return damageFlash;
}
