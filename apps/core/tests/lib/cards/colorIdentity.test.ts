import { describe, it, expect } from 'vitest';
import {
  computeColorIdentity,
  isSubsetOf,
  type ColorIdentitySymbol,
} from '@/lib/cards/colorIdentity';

describe('computeColorIdentity', () => {
  it('{G/W} yields both G and W (two-color hybrid)', () => {
    expect(computeColorIdentity('{G/W}')).toEqual(['W', 'G']);
  });

  it('{2/W} yields W only — not colorless (twobrid fix)', () => {
    const result = computeColorIdentity('{2/W}');
    expect(result).toEqual(['W']);
    expect(result).not.toContain('C');
  });

  it('{W/P} yields W only — P is Phyrexian, not a color', () => {
    const result = computeColorIdentity('{W/P}');
    expect(result).toEqual(['W']);
  });

  it('{2} only → colorless marker C', () => {
    expect(computeColorIdentity('{2}')).toEqual(['C']);
  });

  it('undefined mana cost → colorless marker C', () => {
    expect(computeColorIdentity(undefined)).toEqual(['C']);
  });

  it('empty string mana cost → colorless marker C', () => {
    expect(computeColorIdentity('')).toEqual(['C']);
  });

  it('C never appears in a colored card identity', () => {
    const colored = computeColorIdentity('{W}{U}');
    expect(colored).not.toContain('C');
  });

  it('WUBRG ordering is preserved for multi-color cost', () => {
    // {R}{G}{W} should come out in WUBRG order: W, R, G
    const result = computeColorIdentity('{R}{G}{W}');
    expect(result).toEqual(['W', 'R', 'G']);
  });

  it('oracleColors supplements mana cost colors', () => {
    // No mana cost but oracle colors from Scryfall
    const result = computeColorIdentity(undefined, ['U', 'G']);
    expect(result).toContain('U');
    expect(result).toContain('G');
    expect(result).not.toContain('C');
  });

  it('oracleColors with colored card — C still excluded', () => {
    const result = computeColorIdentity('{W}', ['W']);
    expect(result).toEqual(['W']);
    expect(result).not.toContain('C');
  });

  it('{C} pip does not add colorless to a colored card', () => {
    // {C} is a colorless pip symbol, NOT the color identity marker
    const result = computeColorIdentity('{W}{C}');
    expect(result).toEqual(['W']);
    expect(result).not.toContain('C');
  });

  it('{X} is ignored — colorless result for X-only cost', () => {
    expect(computeColorIdentity('{X}')).toEqual(['C']);
  });
});

describe('assertAxiom (via computeColorIdentity)', () => {
  it('does not throw for a colored identity', () => {
    // Should produce ['W'] without throwing
    expect(() => computeColorIdentity('{W}')).not.toThrow();
  });

  it('does not throw for a colorless identity', () => {
    expect(() => computeColorIdentity('{2}')).not.toThrow();
  });

  // The axiom is enforced internally; we can test it by patching oracleColors
  // to try to smuggle in C alongside a color. But the implementation filters
  // oracleColors through the COLORED set (W/U/B/R/G), so 'C' in oracleColors
  // is silently ignored — the axiom is structurally unreachable from valid input.
  // The direct assertAxiom path is tested via the internal logic above.
});

describe('isSubsetOf', () => {
  it('colorless card (C) is legal in any commander identity', () => {
    expect(isSubsetOf(['C'], ['W', 'U'])).toBe(true);
  });

  it('colorless card (C) is legal in a colorless identity', () => {
    expect(isSubsetOf(['C'], ['C'])).toBe(true);
  });

  it('[G, W] is NOT a subset of [W] alone', () => {
    expect(isSubsetOf(['G', 'W'], ['W'])).toBe(false);
  });

  it('[W] is a subset of [W, U, B]', () => {
    expect(isSubsetOf(['W'], ['W', 'U', 'B'])).toBe(true);
  });

  it('identical sets are subsets of each other', () => {
    const ci: ColorIdentitySymbol[] = ['W', 'U', 'B', 'R', 'G'];
    expect(isSubsetOf(ci, ci)).toBe(true);
  });

  it('empty subset is always legal', () => {
    expect(isSubsetOf([], ['W'])).toBe(true);
  });

  it('[U, G] is not a subset of [W, U]', () => {
    expect(isSubsetOf(['U', 'G'], ['W', 'U'])).toBe(false);
  });
});
