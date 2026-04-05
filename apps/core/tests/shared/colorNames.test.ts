import { describe, it, expect } from 'vitest';
import { COLOR_NAMES, COLOR_NAMES_LOWER } from '../../../../packages/shared/src/lib/utils';

describe('COLOR_NAMES', () => {
  it('has all 6 entries (WUBRGC)', () => {
    expect(Object.keys(COLOR_NAMES)).toHaveLength(6);
  });

  it('maps W to White', () => {
    expect(COLOR_NAMES['W']).toBe('White');
  });

  it('maps U to Blue', () => {
    expect(COLOR_NAMES['U']).toBe('Blue');
  });

  it('maps B to Black', () => {
    expect(COLOR_NAMES['B']).toBe('Black');
  });

  it('maps R to Red', () => {
    expect(COLOR_NAMES['R']).toBe('Red');
  });

  it('maps G to Green', () => {
    expect(COLOR_NAMES['G']).toBe('Green');
  });

  it('maps C to Colorless', () => {
    expect(COLOR_NAMES['C']).toBe('Colorless');
  });

  it('returns undefined for unknown keys', () => {
    expect(COLOR_NAMES['X']).toBeUndefined();
  });

  it('all values are capitalized', () => {
    for (const [, name] of Object.entries(COLOR_NAMES)) {
      expect(name[0]).toBe(name[0].toUpperCase());
    }
  });
});

describe('COLOR_NAMES_LOWER', () => {
  it('has all 6 entries (WUBRGC)', () => {
    expect(Object.keys(COLOR_NAMES_LOWER)).toHaveLength(6);
  });

  it('maps W to white (lowercase)', () => {
    expect(COLOR_NAMES_LOWER['W']).toBe('white');
  });

  it('maps U to blue (lowercase)', () => {
    expect(COLOR_NAMES_LOWER['U']).toBe('blue');
  });

  it('all values are lowercase', () => {
    for (const [, name] of Object.entries(COLOR_NAMES_LOWER)) {
      expect(name).toBe(name.toLowerCase());
    }
  });

  it('has same keys as COLOR_NAMES', () => {
    expect(Object.keys(COLOR_NAMES_LOWER).sort()).toEqual(Object.keys(COLOR_NAMES).sort());
  });

  it('values match COLOR_NAMES lowercased', () => {
    for (const [key, name] of Object.entries(COLOR_NAMES_LOWER)) {
      expect(name).toBe(COLOR_NAMES[key].toLowerCase());
    }
  });
});
