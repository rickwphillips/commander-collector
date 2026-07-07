import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimerTokens } from '@/game-manager/hooks/useTimerTokens';

// The hook drives both the standard PlayerCard border/header and the 2HG
// TeamPanel active-team treatment, so this locks the color ramp + expiry math.

describe('useTimerTokens', () => {
  it('reads as "off" (calm blue) when the timer is disabled', () => {
    const { result } = renderHook(() => useTimerTokens(0, 0, true));
    expect(result.current.timerOff).toBe(true);
    expect(result.current.timerProgress).toBe(0);
    expect(result.current.isTimerExpired).toBe(false);
    expect(result.current.timerColor).toBe('rgb(66,165,245)');
  });

  it('is green when fresh and ramps to red as the clock runs out', () => {
    // progress 0 → green
    expect(renderHook(() => useTimerTokens(0, 100, true)).result.current.timerColor)
      .toBe('rgb(102,187,106)');
    // progress 0.5 → amber
    expect(renderHook(() => useTimerTokens(50, 100, true)).result.current.timerColor)
      .toBe('rgb(255,167,38)');
    // progress 1 → red
    expect(renderHook(() => useTimerTokens(100, 100, true)).result.current.timerColor)
      .toBe('rgb(229,57,53)');
  });

  it('clamps progress to 1 past the limit and marks the subject expired', () => {
    const { result } = renderHook(() => useTimerTokens(200, 100, true));
    expect(result.current.timerProgress).toBe(1);
    expect(result.current.isTimerExpired).toBe(true);
  });

  it('only an active subject gets a border, shadow, and expiry', () => {
    const active = renderHook(() => useTimerTokens(50, 100, true)).result.current;
    expect(active.currentPlayerBorder).toBe('3px solid rgb(255,167,38)');
    expect(active.currentPlayerShadow).toBe('0 0 16px 4px rgb(255,167,38)88');

    const inactive = renderHook(() => useTimerTokens(200, 100, false)).result.current;
    expect(inactive.currentPlayerBorder).toBeUndefined();
    expect(inactive.currentPlayerShadow).toBeUndefined();
    // expired only applies to the active subject
    expect(inactive.isTimerExpired).toBe(false);
  });

  it('never reports expired while the timer is off', () => {
    const { result } = renderHook(() => useTimerTokens(9999, 0, true));
    expect(result.current.isTimerExpired).toBe(false);
  });

  it('timerColorRgba mirrors the solid color channels at a given alpha', () => {
    const { result } = renderHook(() => useTimerTokens(50, 100, true));
    expect(result.current.timerColorRgba(0.3)).toBe('rgba(255,167,38,0.3)');
  });
});
