/**
 * Pure filter and sort functions for Card arrays.
 *
 * Extracted from `components/DeckFilters.tsx`. Call sites are NOT modified
 * in Phase 0; this module is additive. Phase 1 will migrate call sites.
 *
 * Color filtering uses `computeColorIdentity` so the {2/W} twobrid fix
 * propagates automatically to all consumers.
 *
 * NOTE: `Card` and `TypeCategory` will be provided by sibling modules
 * (`./types` and `./categorize`) written in parallel. Imports are
 * written against their expected final shapes.
 */

import { computeColorIdentity, type ColorIdentitySymbol } from './colorIdentity';
import { categorizeByType, type TypeCategory } from './categorize';
import { matchKey } from './matchKey';
import type { Card } from './types';

// Re-export TypeCategory so callers only need one import
export type { TypeCategory };

// ── State shape ───────────────────────────────────────────────────────────────

/**
 * CMC (converted mana cost / mana value) filter shape.
 *
 * Two modes — use one or both:
 *   - `values`: explicit set of MV integers selected via chips (primary UI).
 *   - `min` / `max`: inclusive range bounds (future range-slider UI).
 *
 * If both `values` and `min`/`max` are set, `values` takes precedence.
 */
export interface CmcFilter {
  /** Explicit MV values to match (chip selection). */
  values?: number[];
  /** Inclusive lower bound for range mode. */
  min?: number;
  /** Inclusive upper bound for range mode. */
  max?: number;
}

export interface FilterSortState {
  search?: string;
  /** Basic color / colorless pips to filter by */
  colors?: ColorIdentitySymbol[];
  /** 'and' = card must have ALL selected colors; 'or' = any; 'exact' = exactly these */
  colorMode?: 'and' | 'or' | 'exact';
  types?: TypeCategory[];
  /**
   * CMC / mana value filter.
   * Chip mode: `values` is set; range mode: `min`/`max` set (future).
   * When absent or empty, no CMC filtering is applied.
   */
  cmcFilter?: CmcFilter;
  /**
   * "Contains card" filter — when set, only cards matching this card by
   * scryfall_id (or normalized name fallback) pass through.
   * Used by list/deck "contains" facet to restrict results.
   */
  contains?: Card | null;
  /** 'cmc' maps to mana value (converted mana cost) */
  sort: 'name' | 'cmc' | 'color' | 'type' | 'qty';
  sortDir: 'asc' | 'desc';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Compute the converted mana cost (mana value) from a mana cost string.
 * Each symbol contributes 1; numeric generics contribute their value; X = 0.
 */
function parseManaValue(manaCost: string | null | undefined): number {
  if (!manaCost) return 0;
  let mv = 0;
  for (const m of manaCost.matchAll(/\{([^}]+)\}/g)) {
    const inner = m[1];
    const n = Number(inner);
    if (!isNaN(n)) {
      mv += n;
    } else if (inner !== 'X') {
      mv += 1;
    }
  }
  return mv;
}

const COLOR_SORT_ORDER: Record<string, number> = { W: 0, U: 1, B: 2, R: 3, G: 4, C: 5 };

function firstColorSortKey(card: Card): number {
  // Use stored color_identity string if available for sort (no recompute needed)
  const ci = card.color_identity ?? '';
  if (!ci) return COLOR_SORT_ORDER['C'];
  for (const ch of ci) {
    if (ch in COLOR_SORT_ORDER) return COLOR_SORT_ORDER[ch];
  }
  return COLOR_SORT_ORDER['C'];
}

const TYPE_SORT_ORDER: Record<TypeCategory, number> = {
  creature:     1,
  planeswalker: 2,
  battle:       3,
  instant:      4,
  sorcery:      5,
  enchantment:  6,
  artifact:     7,
  land:         8,
  other:        9,
};

// ── Color predicate ───────────────────────────────────────────────────────────

/**
 * Compute the effective color identity for filter matching.
 *
 * Lands always use color_identity (their `colors` field is always empty).
 * All other cards use their stored color_identity if available; falls back
 * to computing from mana_cost so the {2/W} fix is always applied.
 */
function cardColorSet(card: Card): Set<ColorIdentitySymbol> {
  const isLand = card.type_line?.includes('Land') ?? false;

  let raw: ColorIdentitySymbol[];

  if (isLand || card.color_identity) {
    // Use stored color_identity string — parse it as individual chars
    const ci = card.color_identity ?? '';
    const chars = [...ci].filter(ch => 'WUBRG'.includes(ch)) as ColorIdentitySymbol[];
    raw = chars.length > 0 ? chars : ['C'];
  } else {
    // Fall back to computing from mana cost — this applies the twobrid fix
    raw = computeColorIdentity(card.mana_cost ?? undefined);
  }

  return new Set(raw);
}

function matchesColorFilter(card: Card, colors: ColorIdentitySymbol[], mode: 'and' | 'or' | 'exact'): boolean {
  if (colors.length === 0) return true;
  const cardColors = cardColorSet(card);

  switch (mode) {
    case 'or':
      return colors.some(c => cardColors.has(c));
    case 'and':
      return colors.every(c => cardColors.has(c));
    case 'exact':
      return colors.length === cardColors.size && colors.every(c => cardColors.has(c));
  }
}

// ── Filter ────────────────────────────────────────────────────────────────────

/**
 * Filter a card array by the given state.
 * Returns a new array; does not mutate the input.
 */
export function filterCards(cards: Card[], state: FilterSortState): Card[] {
  const { search, colors, colorMode = 'or', types, cmcFilter, contains } = state;

  return cards.filter(card => {
    // Name search (case-insensitive substring)
    if (search && search.trim() !== '') {
      if (!card.card_name.toLowerCase().includes(search.toLowerCase())) return false;
    }

    // Type filter
    if (types && types.length > 0) {
      const cat = categorizeByType(card.type_line);
      if (!types.includes(cat)) return false;
    }

    // Color filter — uses computeColorIdentity so {2/W} is treated correctly
    if (colors && colors.length > 0) {
      if (!matchesColorFilter(card, colors, colorMode)) return false;
    }

    // CMC filter — values mode takes precedence over min/max range mode
    if (cmcFilter) {
      const mv = parseManaValue(card.mana_cost);
      if (cmcFilter.values && cmcFilter.values.length > 0) {
        if (!cmcFilter.values.includes(mv)) return false;
      } else {
        if (cmcFilter.min !== undefined && mv < cmcFilter.min) return false;
        if (cmcFilter.max !== undefined && mv > cmcFilter.max) return false;
      }
    }

    // Contains filter — match by scryfall_id first, fall back to matchKey
    if (contains != null) {
      if (!matchesContains(card, contains)) return false;
    }

    return true;
  });
}

/**
 * Return true when `card` matches `target` for the "contains" predicate.
 *
 * Matching strategy (in priority order):
 *   1. Both cards have a scryfall_id → compare directly.
 *   2. Otherwise fall back to `matchKey()` which normalises the name.
 */
function matchesContains(card: Card, target: Card): boolean {
  if (card.scryfall_id && target.scryfall_id) {
    return card.scryfall_id === target.scryfall_id;
  }
  return matchKey(card) === matchKey(target);
}

// ── Sort ──────────────────────────────────────────────────────────────────────

/**
 * Sort a card array by the given state.
 * Returns a new array; does not mutate the input.
 * Default (when sort='name', sortDir='asc') is alphabetical by card_name ascending.
 */
export function sortCards(cards: Card[], state: FilterSortState): Card[] {
  const { sort, sortDir } = state;
  const arr = [...cards];
  const dir = sortDir === 'desc' ? -1 : 1;

  const byName = (a: Card, b: Card) => dir * a.card_name.localeCompare(b.card_name);

  switch (sort) {
    case 'name':
      return arr.sort(byName);

    case 'cmc':
      return arr.sort((a, b) => {
        const diff = parseManaValue(a.mana_cost) - parseManaValue(b.mana_cost);
        return diff !== 0 ? dir * diff : a.card_name.localeCompare(b.card_name);
      });

    case 'color':
      return arr.sort((a, b) => {
        const diff = firstColorSortKey(a) - firstColorSortKey(b);
        return diff !== 0 ? dir * diff : a.card_name.localeCompare(b.card_name);
      });

    case 'type':
      return arr.sort((a, b) => {
        const ta = TYPE_SORT_ORDER[categorizeByType(a.type_line)] ?? 9;
        const tb = TYPE_SORT_ORDER[categorizeByType(b.type_line)] ?? 9;
        return ta !== tb ? dir * (ta - tb) : a.card_name.localeCompare(b.card_name);
      });

    case 'qty':
      return arr.sort((a, b) => {
        const diff = (a.quantity ?? 1) - (b.quantity ?? 1);
        return diff !== 0 ? dir * diff : a.card_name.localeCompare(b.card_name);
      });

    default:
      return arr.sort(byName);
  }
}
