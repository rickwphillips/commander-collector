/**
 * cardCount — THE card counter.
 *
 * A row is not a card. One `list_cards` row can hold many copies (Island x13),
 * so counting rows under-reports the deck: a 102-card deck stored in 82 rows
 * reads as 82. Every surface that answers "how many cards" — the deck-page
 * counter, the type breakdown, the format legality check, the coach/guru deck
 * context — must use this, so none of them can disagree with each other.
 *
 * Lives in @commander/shared because both apps/core and the shared
 * DeckBreakdown need it. Mirrored in PHP by cardQuantityTotal()
 * (apps/core/app/php-api/lib/card-count.php) for the agent tool responses.
 */

/** Anything with a quantity: a Card, an API row, a coach profile entry. */
export interface Countable {
  /** Copies of this card. Absent is treated as 1, matching the DB default. */
  quantity?: number | null;
}

/** Total cards, summing copies rather than counting rows. */
export function totalCardCount(cards: readonly Countable[]): number {
  return cards.reduce((sum, c) => sum + (c.quantity ?? 1), 0);
}
