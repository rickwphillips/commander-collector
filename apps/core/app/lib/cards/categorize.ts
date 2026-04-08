/**
 * Canonical type categorization for MTG cards.
 *
 * This is the single source of truth that collapses three near-identical
 * implementations across the codebase:
 *   - `components/DeckFilters.tsx`   → `getTypeCategory()`
 *   - `components/DeckBreakdown.tsx` → local `getCategory()`
 *   - `components/CardListDisplay.tsx` → imported from DeckFilters
 *
 * Phase 1 will update call sites to import from here instead.
 * Do not modify call sites yet.
 */

export const TYPE_CATEGORIES = [
  'creature',
  'planeswalker',
  'instant',
  'sorcery',
  'enchantment',
  'artifact',
  'land',
  'battle',
  'other',
] as const;

export type TypeCategory = typeof TYPE_CATEGORIES[number];

/**
 * Map a card's type line to a canonical TypeCategory.
 *
 * Priority order matches the existing `getTypeCategory()` in DeckFilters.tsx.
 * Creature is first because many cards are "Artifact Creature" — we want
 * those classified as creatures, consistent with the current behavior.
 *
 * 'Battle' was added in March of the Machine and sits between Planeswalker
 * and Land in the priority order (same as DeckFilters.tsx).
 *
 * Returns 'other' for anything that doesn't match (tokens, emblems, etc.).
 */
export function categorizeByType(typeLine: string | null | undefined): TypeCategory {
  const tl = typeLine ?? '';
  if (tl.includes('Creature'))     return 'creature';
  if (tl.includes('Planeswalker')) return 'planeswalker';
  if (tl.includes('Battle'))       return 'battle';
  if (tl.includes('Land'))         return 'land';
  if (tl.includes('Instant'))      return 'instant';
  if (tl.includes('Sorcery'))      return 'sorcery';
  if (tl.includes('Enchantment'))  return 'enchantment';
  if (tl.includes('Artifact'))     return 'artifact';
  return 'other';
}
