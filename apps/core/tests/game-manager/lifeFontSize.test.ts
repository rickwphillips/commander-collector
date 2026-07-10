import { describe, it, expect } from 'vitest';
import { remoteLifeFontSize } from '@/game-manager/lifeFontSize';

// Locks the remote hero-life sizing: fill the container along the orientation's
// free axis (cqh landscape / cqw portrait), shrinking the WIDTH cap for extra
// digits so a 3+ digit total fits the panel width instead of overflowing.

const widthCap = (s: string) => Number(/(\d+)cqw/.exec(s)![1]);

describe('remoteLifeFontSize', () => {
  it('always caps height at 84cqh regardless of digits', () => {
    for (const life of [8, 40, 120, -5]) {
      expect(remoteLifeFontSize(life)).toContain('min(84cqh,');
    }
  });

  it('uses the same width cap for 1 and 2 digit totals (min 2 digits)', () => {
    expect(widthCap(remoteLifeFontSize(8))).toBe(widthCap(remoteLifeFontSize(40)));
  });

  it('shrinks the width cap as digit count grows so wide totals fit', () => {
    const two = widthCap(remoteLifeFontSize(40));
    const three = widthCap(remoteLifeFontSize(120));
    const four = widthCap(remoteLifeFontSize(1000));
    expect(three).toBeLessThan(two);
    expect(four).toBeLessThan(three);
  });

  it('counts the sign as a slot for negative totals', () => {
    // "-5" is two characters, same cap as a 2-digit total.
    expect(widthCap(remoteLifeFontSize(-5))).toBe(widthCap(remoteLifeFontSize(40)));
    // "-40" is three characters, so it shrinks like a 3-digit total.
    expect(widthCap(remoteLifeFontSize(-40))).toBe(widthCap(remoteLifeFontSize(120)));
  });
});
