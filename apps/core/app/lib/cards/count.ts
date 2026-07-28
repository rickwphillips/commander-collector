/**
 * lib/cards/count.ts — re-export of THE card counter.
 *
 * The implementation lives in @commander/shared/lib/cardCount so that the
 * shared DeckBreakdown counts identically; this barrel keeps the `@/lib/cards`
 * import path stable for app code. Do not add a second implementation here.
 */

export { totalCardCount, type Countable } from '@commander/shared/lib/cardCount';
