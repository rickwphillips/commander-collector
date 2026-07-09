'use client';

import type { Keyframes } from '@emotion/react';
import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Shared counter-value animation logic for the game-manager panels.
 *
 * PlayerCard and TeamPanel both render energy / XP / poison counters that react
 * to their value: XP glows gold and shimmers, energy glows cyan, and every
 * counter blurs as poison closes in on lethal. These formulas lived only in
 * PlayerCard; this module is the single source both panels consume so the look
 * stays identical (and isn't re-derived per panel).
 *
 * The XP *shimmer* keyframe still comes from `useXpKeyframes` (an emotion hook
 * the caller already holds); these helpers cover the static glow strings and
 * the per-value sx assembly.
 */

/** Gold XP glow: intensity ramps to 1 at 10 XP; `glow` is the text-shadow. */
export function xpGlowFor(experience: number): { intensity: number; glow: string | undefined } {
  const intensity = experience > 0 ? Math.min(experience / 10, 1) : 0;
  const glow = intensity > 0
    ? `0 0 ${4 + intensity * 12}px rgba(218,165,32,${(0.5 + intensity * 0.5).toFixed(2)}), 0 0 ${10 + intensity * 24}px rgba(218,165,32,${(0.2 + intensity * 0.3).toFixed(2)})`
    : undefined;
  return { intensity, glow };
}

/** Cyan energy glow text-shadow (intensity ramps to 1 at 8 energy). */
export function energyGlowFor(energy: number): string | undefined {
  const intensity = energy > 0 ? Math.min(energy / 8, 1) : 0;
  return intensity > 0
    ? `0 0 ${4 + intensity * 18}px rgba(80,200,255,${(0.5 + intensity * 0.45).toFixed(2)}), 0 0 ${10 + intensity * 36}px rgba(80,200,255,${(0.2 + intensity * 0.3).toFixed(2)})`
    : undefined;
}

/** Poison "one below lethal" danger pulse (green flare in/out). */
const POISON_PULSE = {
  animation: 'poisonPulse 2.5s ease-in-out infinite',
  '@keyframes poisonPulse': {
    '0%, 100%': { opacity: 1, transform: 'scale(1)', textShadow: '0 0 8px rgba(0,200,60,0.9), 0 0 20px rgba(0,200,60,0.5)' },
    '50%': { opacity: 0.3, transform: 'scale(0.85)', textShadow: '0 0 2px rgba(0,200,60,0.2)' },
  },
} as const;

export interface CounterGlow {
  xpGlow?: string;
  xpShimmerAnim?: Keyframes | null;
  energyGlow?: string;
}

/** Blur that ramps as poison (0..1 progress toward lethal) closes in. */
export function poisonBlur(poisonProgress: number): { filter?: string } {
  return poisonProgress > 0 ? { filter: `blur(${Math.pow(poisonProgress, 2.5) * 1.5}px)` } : {};
}

/**
 * Value-cell sx for a counter, matching PlayerCard's per-value effects:
 *   - every counter blurs as `poisonProgress` (0..1) rises,
 *   - poison pulses when its value is exactly one below lethal,
 *   - XP carries the gold glow + shimmer sweep.
 * Energy's glow is applied at the container level (card / pilot column), not
 * here, so this stays identical to PlayerCard's grid behavior.
 */
export function counterValueSx(
  kind: 'poison' | 'energy' | 'xp' | 'other',
  value: number,
  poisonProgress: number,
  glow: CounterGlow,
  poisonDangerValue: number,
): SxProps<Theme> {
  const blur = poisonBlur(poisonProgress);
  if (kind === 'poison') {
    return { ...blur, ...(value === poisonDangerValue ? POISON_PULSE : {}) };
  }
  if (kind === 'xp') {
    return {
      ...blur,
      ...(glow.xpGlow
        ? { textShadow: glow.xpGlow, ...(glow.xpShimmerAnim ? { animation: `${glow.xpShimmerAnim} 3s ease-in-out infinite` } : {}) }
        : {}),
    };
  }
  return { ...blur };
}
