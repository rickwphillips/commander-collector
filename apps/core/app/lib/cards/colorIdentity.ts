/**
 * Canonical color-identity computation for the Commander Collector.
 *
 * AXIOM: a card is colored OR colorless, never both.
 * `C` is mutually exclusive with W/U/B/R/G.
 * If any colored mana symbol is in the identity, `C` must not appear.
 *
 * Symbol parsing rules:
 *   {G/W}  → both G and W   (two-color hybrid)
 *   {2/W}  → W only         (twobrid — NOT colorless; the `2` is generic cost, not a color)
 *   {W/P}  → W only         (Phyrexian — P is not a color)
 *   {2}    → no color added  (generic)
 *   {X}    → no color added
 *   {C}    → no color added  (colorless pip is NOT the C identity marker)
 *
 * If the final set is empty after scanning mana cost, the card is colorless → ['C'].
 * oracleColors (Scryfall's `color_identity` array) may supplement when passed.
 */

export type MtgColorSymbol = 'W' | 'U' | 'B' | 'R' | 'G';
export type ColorIdentitySymbol = MtgColorSymbol | 'C';

const COLORED = new Set<string>(['W', 'U', 'B', 'R', 'G']);

/**
 * Extract colored pips from a single mana symbol's inner text (the part inside `{...}`).
 *
 * Examples:
 *   'W'    → ['W']
 *   'G/W'  → ['G', 'W']   (two-color hybrid)
 *   '2/W'  → ['W']        (twobrid — '2' is generic, not a color)
 *   'W/P'  → ['W']        (Phyrexian — 'P' is not a color)
 *   'C'    → []           (colorless pip)
 *   '2'    → []           (generic)
 *   'X'    → []           (variable)
 */
function colorsFromSymbol(inner: string): MtgColorSymbol[] {
  const parts = inner.split('/');
  const result: MtgColorSymbol[] = [];
  for (const part of parts) {
    if (COLORED.has(part)) {
      result.push(part as MtgColorSymbol);
    }
    // '2', 'P', 'C', 'X', numeric strings → ignored
  }
  return result;
}

/**
 * Assert the color-identity axiom: colored and colorless are mutually exclusive.
 * Throws in development; no-ops in production to keep perf overhead zero.
 */
function assertAxiom(identity: ColorIdentitySymbol[]): void {
  const hasColor = identity.some(c => COLORED.has(c));
  const hasColorless = identity.includes('C');
  if (hasColor && hasColorless) {
    throw new Error(
      `[colorIdentity] AXIOM VIOLATION: identity contains both colored symbols and C. Got: [${identity.join(', ')}]`
    );
  }
}

/**
 * Compute the canonical color identity for a card.
 *
 * @param manaCost    The card's mana cost string, e.g. `"{2}{W}"` or `"{G/W}{G/W}"`.
 *                    Pass `undefined` or empty string for lands and token stubs.
 * @param oracleColors Optional supplemental color array from Scryfall's `color_identity` field.
 *                    These are plain letter strings like `['W', 'G']`.
 *                    Used to pick up reminder-text and activated-ability colors not in the cost.
 * @returns Sorted WUBRG array, or `['C']` for colorless cards. Never a mixed array.
 */
export function computeColorIdentity(
  manaCost: string | undefined,
  oracleColors?: string[],
): ColorIdentitySymbol[] {
  const found = new Set<MtgColorSymbol>();

  // Parse mana cost symbols
  if (manaCost) {
    for (const match of manaCost.matchAll(/\{([^}]+)\}/g)) {
      for (const color of colorsFromSymbol(match[1])) {
        found.add(color);
      }
    }
  }

  // Supplement with Scryfall oracle colors (handles reminder text, ability costs, etc.)
  if (oracleColors) {
    for (const c of oracleColors) {
      if (COLORED.has(c)) found.add(c as MtgColorSymbol);
    }
  }

  const WUBRG_ORDER: MtgColorSymbol[] = ['W', 'U', 'B', 'R', 'G'];

  let identity: ColorIdentitySymbol[];
  if (found.size === 0) {
    identity = ['C'];
  } else {
    identity = WUBRG_ORDER.filter(c => found.has(c));
  }

  assertAxiom(identity);
  return identity;
}

/**
 * Returns true if every element of `subset` is also in `superset`.
 *
 * Used by the format validator: "card identity ⊆ commander identity".
 *
 * Colorless (C) handling:
 *   - A colorless card (subset = ['C']) fits in any commander identity.
 *   - A colored commander identity does NOT contain 'C' (axiom), so a
 *     colorless card trivially passes (no colored constraint to violate).
 */
export function isSubsetOf(
  subset: ColorIdentitySymbol[],
  superset: ColorIdentitySymbol[],
): boolean {
  const superSet = new Set<ColorIdentitySymbol>(superset);
  // Colorless cards are legal in any commander color identity
  if (subset.length === 1 && subset[0] === 'C') return true;
  return subset.every(c => superSet.has(c));
}
