import { describe, it, expect } from 'vitest';
import {
  getOrdinalSuffix,
  sortColors,
  getColorNickname,
  COLOR_NAMES,
  COLOR_NAMES_LOWER,
} from '@/lib/utils';

describe('getOrdinalSuffix', () => {
  it('returns st/nd/rd/th for 1–4', () => {
    expect(getOrdinalSuffix(1)).toBe('st');
    expect(getOrdinalSuffix(2)).toBe('nd');
    expect(getOrdinalSuffix(3)).toBe('rd');
    expect(getOrdinalSuffix(4)).toBe('th');
  });

  it('returns th for the 11–13 exceptions', () => {
    expect(getOrdinalSuffix(11)).toBe('th');
    expect(getOrdinalSuffix(12)).toBe('th');
    expect(getOrdinalSuffix(13)).toBe('th');
  });

  it('handles larger numbers by last digit', () => {
    expect(getOrdinalSuffix(21)).toBe('st');
    expect(getOrdinalSuffix(102)).toBe('nd');
  });
});

describe('sortColors', () => {
  it('sorts colors into WUBRG order', () => {
    expect(sortColors(['G', 'W', 'U'])).toBe('WUG');
    expect(sortColors(['R', 'B'])).toBe('BR');
  });
});

describe('getColorNickname', () => {
  it('returns guild names for two colors', () => {
    expect(getColorNickname(['W', 'U'])).toBe('Azorius');
    expect(getColorNickname(['R', 'G'])).toBe('Gruul');
  });

  it('returns shard/wedge names for three colors', () => {
    expect(getColorNickname(['W', 'U', 'G'])).toBe('Bant');
    expect(getColorNickname(['W', 'B', 'G'])).toBe('Abzan');
  });

  it('returns Five-Color for five colors', () => {
    expect(getColorNickname(['W', 'U', 'B', 'R', 'G'])).toBe('Five-Color');
  });

  it('returns undefined for colorless, single color, or four colors', () => {
    expect(getColorNickname(['C'])).toBeUndefined();
    expect(getColorNickname(['W'])).toBeUndefined();
    expect(getColorNickname(['W', 'U', 'B', 'R'])).toBeUndefined();
  });
});

describe('color name maps', () => {
  it('map single letters to names', () => {
    expect(COLOR_NAMES.W).toBe('White');
    expect(COLOR_NAMES_LOWER.G).toBe('green');
  });
});
