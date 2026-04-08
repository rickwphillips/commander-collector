/**
 * Match-key and normalization utilities for card dedup logic.
 *
 * `matchKey` returns a stable identifier for a card that can be used to
 * detect duplicates when merging card lists (e.g. scan buffer vs saved list).
 *
 * Strategy:
 *   - If the card has a `scryfall_id`, use it directly — it is globally unique
 *     and handles alternate printings correctly.
 *   - Otherwise, fall back to `'name:' + normalize(card_name)` — handles
 *     hand-typed cards that haven't been resolved against Scryfall yet.
 *
 * `normalize` is also exported for callers that need to compare arbitrary
 * card name strings without constructing a full Card object.
 */

import type { Card } from './types';

/**
 * Normalize a card name for fuzzy-safe comparison.
 *
 * Transformations applied in order:
 *   1. Unicode NFD decomposition + diacritic strip (e.g. "Llorwyn" variants)
 *   2. Lowercase
 *   3. Leading/trailing whitespace trim
 *   4. Internal whitespace collapse (multiple spaces → single space)
 *   5. Punctuation removal (apostrophes, commas, hyphens, etc.)
 *
 * The result is suitable for string equality checks only — do not store it
 * in the database or display it to users.
 */
export function normalize(name: string): string {
  return name
    .normalize('NFD')                  // decompose diacritics
    .replace(/[\u0300-\u036f]/g, '')   // strip combining diacritical marks
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')             // collapse internal whitespace
    .replace(/[^\w\s]/g, '');         // remove punctuation (non-word, non-space)
}

/**
 * Return a stable match key for dedup logic.
 *
 * Two cards with the same key are considered the same card for the purposes
 * of deduplication. The key is intentionally opaque — do not parse it.
 */
export function matchKey(card: Card): string {
  if (card.scryfall_id) {
    return card.scryfall_id;
  }
  return 'name:' + normalize(card.card_name);
}
