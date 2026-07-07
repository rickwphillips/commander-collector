'use client';

import { useMemo } from 'react';

/**
 * Timer presentation tokens derived from elapsed vs total turn seconds. Shared
 * by the standard-game PlayerCard (via PlayerPanel) and the 2HG TeamPanel so the
 * countdown color ramp, active border/shadow, and expiry blink behave
 * identically across both layouts instead of being reimplemented per view.
 */
export interface TimerTokens {
  timerOff: boolean;
  timerProgress: number;
  isTimerExpired: boolean;
  timerColor: string;
  timerColorRgba: (alpha: number) => string;
  /** Border for the active subject (current player / active team); undefined when inactive. */
  currentPlayerBorder?: string;
  /** Shadow for the active subject; undefined when inactive. */
  currentPlayerShadow?: string;
}

/**
 * Green (fresh) -> amber (midway) -> red (nearly out) ramp. When the timer is
 * off the subject reads as a calm blue. Returns rounded [r, g, b] channels so
 * the solid color and its rgba() variants stay pixel-identical.
 */
function timerColorChannels(timerOff: boolean, timerProgress: number): [number, number, number] {
  if (timerOff) return [66, 165, 245];
  if (timerProgress <= 0.5) {
    const p = timerProgress * 2;
    return [Math.round(102 + 153 * p), Math.round(187 - 20 * p), Math.round(106 - 68 * p)];
  }
  const p = (timerProgress - 0.5) * 2;
  return [Math.round(255 - 26 * p), Math.round(167 - 110 * p), Math.round(38 + 15 * p)];
}

/**
 * useTimerTokens — derive the turn-timer tokens from elapsed / total seconds.
 * `isActive` marks the subject whose turn it is (the standard game's current
 * player, or the 2HG active team); only an active subject gets a border,
 * shadow, and expiry state.
 */
export function useTimerTokens(
  elapsedSeconds: number,
  turnTimerSeconds: number,
  isActive: boolean,
): TimerTokens {
  return useMemo(() => {
    const timerOff = turnTimerSeconds === 0;
    const timerProgress = timerOff ? 0 : Math.min(elapsedSeconds / turnTimerSeconds, 1);
    const isTimerExpired = isActive && !timerOff && elapsedSeconds >= turnTimerSeconds;
    const [r, g, b] = timerColorChannels(timerOff, timerProgress);
    const timerColor = `rgb(${r},${g},${b})`;
    return {
      timerOff,
      timerProgress,
      isTimerExpired,
      timerColor,
      timerColorRgba: (alpha: number) => `rgba(${r},${g},${b},${alpha})`,
      currentPlayerBorder: isActive ? `3px solid ${timerColor}` : undefined,
      currentPlayerShadow: isActive ? `0 0 16px 4px ${timerColor}88` : undefined,
    };
  }, [elapsedSeconds, turnTimerSeconds, isActive]);
}

/**
 * Spreadable sx fragment: blinks a subject's border/shadow red when its turn
 * timer has expired. Used where the timer color drives the border (Highlight
 * mode OFF).
 */
export const TIMER_EXPIRED_BORDER_BLINK = {
  animation: 'timerBlink 0.5s step-end infinite',
  '@keyframes timerBlink': {
    '0%, 100%': { borderColor: '#e53935', boxShadow: '0 0 24px 6px rgba(229,57,53,0.6)' },
    '50%': { borderColor: 'transparent', boxShadow: 'none' },
  },
} as const;

/**
 * Spreadable sx fragment: blinks a subject's header background red when its turn
 * timer has expired. Used where the timer color drives the header gradient
 * (Highlight mode ON).
 */
export const TIMER_EXPIRED_HEADER_BLINK = {
  animation: 'headerBlink 0.5s step-end infinite',
  '@keyframes headerBlink': {
    '0%, 100%': { background: '#e9353540' },
    '50%': { background: 'rgba(0,0,0,0.08)' },
  },
} as const;
