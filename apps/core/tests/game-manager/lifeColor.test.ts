import { describe, it, expect } from 'vitest';
import { lifeColor } from '@/game-manager/lifeColor';

// Locks the shared life-total ramp (used by PlayerPanel and the 2HG TeamPanel).

describe('lifeColor', () => {
  it('is dark red at or below 0', () => {
    expect(lifeColor(0, 40)).toBe('#6B0000');
    expect(lifeColor(-3, 40)).toBe('#6B0000');
  });

  it("returns '' at exactly starting life so callers fall back to the theme default", () => {
    expect(lifeColor(40, 40)).toBe('');
    expect(lifeColor(30, 30)).toBe('');
  });

  it('greens as life climbs above starting life, capping at 2x', () => {
    // gain 0.5 (life 60 / start 40)
    expect(lifeColor(60, 40)).toBe('rgb(110,171,42)');
    // gain clamped to 1 at/above 2x
    expect(lifeColor(80, 40)).toBe('rgb(40,222,24)');
    expect(lifeColor(200, 40)).toBe('rgb(40,222,24)');
  });

  it('reds out as life drops below starting life', () => {
    // ratio 0.5 (life 20 / start 40)
    expect(lifeColor(20, 40)).toBe('rgb(216,60,30)');
  });
});
