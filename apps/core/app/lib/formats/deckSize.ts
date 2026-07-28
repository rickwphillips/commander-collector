/**
 * lib/formats/deckSize.ts — how many cards a LIST must hold.
 *
 * Distinct from the format's deck size. CR 903.5a: a Commander deck is exactly
 * 100 cards *including* its commander. But commanders are deck-native — they
 * live on `decks.commander` / `decks.partner`, not in `list_cards` — so the list
 * itself holds the remainder:
 *
 *   1 commander                                    -> 99
 *   2 commanders (partner / background / Doctor's) -> 98
 *
 * When the commanders instead live IN the list (list_cards.role), they already
 * count toward the 100 and the list target is the full 100.
 */

import type { Card } from '../cards/types';
import type { DeckContext } from './types';

/** CR 903.5a — minimum and maximum deck size are both 100, commander included. */
export const COMMANDER_DECK_SIZE = 100;

/**
 * Cards this list should contain, or null when the format has no fixed size
 * (or the list is standalone, with no deck to supply commanders).
 */
export function requiredListSize(
  format: string,
  cards: Card[],
  deck?: DeckContext | null,
): number | null {
  if (format !== 'commander') return null;
  if (!deck) return null;

  // Commanders stored in the list already occupy slots inside the 100.
  const inList = cards.reduce(
    (n, c) => n + (c.role === 'commander' || c.role === 'partner' ? c.quantity : 0),
    0,
  );
  if (inList > 0) return COMMANDER_DECK_SIZE;

  // Otherwise each deck-native commander is a slot the list does not hold.
  const onDeck = (deck.commander ? 1 : 0) + (deck.partner ? 1 : 0);
  return COMMANDER_DECK_SIZE - onDeck;
}
