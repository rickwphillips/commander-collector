import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

import { ListEditor } from '@/components/cards/ListEditor';
import type { Card } from '@/lib/cards/types';

// ── Mocks ────────────────────────────────────────────────────────────
// Capture what ListEditor hands to DeckFilters; the counter is rendered
// there from resultCount / totalCount.

const filterProps: { resultCount?: number; totalCount?: number; overBy?: number }[] = [];

vi.mock('@/components/DeckFilters', () => ({
  DeckFilters: (props: { resultCount?: number; totalCount?: number; overBy?: number }) => {
    filterProps.push({
      resultCount: props.resultCount,
      totalCount: props.totalCount,
      overBy: props.overBy,
    });
    return <div data-testid="deck-filters" />;
  },
  EMPTY_FILTERS: {},
  matchesFilters: () => true,
  sortCards: (cards: Card[]) => cards,
}));

vi.mock('@/components/CardListDisplay', () => ({
  CardListDisplay: () => <div data-testid="card-list-display" />,
}));

vi.mock('@/components/cards/ListGallery', () => ({
  ListGallery: () => <div data-testid="list-gallery" />,
}));

vi.mock('@/components/cards/CardListToolbar', () => ({
  CardListToolbar: () => <div data-testid="card-list-toolbar" />,
}));

// ── Helpers ──────────────────────────────────────────────────────────

function card(card_name: string, quantity: number): Card {
  return { card_name, quantity, color_identity: '', is_commander: false, is_proxy: false };
}

function renderWith(
  cards: Card[],
  deckContext?: { id: string; name: string; commander?: string | null; partner?: string | null } | null,
) {
  filterProps.length = 0;
  render(
    <ListEditor
      list={{ id: 'list-1', format: 'commander', name: 'Main', deck_id: 'deck-1' }}
      cards={cards}
      save={vi.fn()}
      conflict={false}
      refresh={vi.fn()}
      deckContext={deckContext ?? null}
    />,
  );
  return filterProps.at(-1)!;
}

const DECK = { id: 'deck-1', name: 'Stella Lee', commander: 'Stella Lee, Wild Card' };

// ── Tests ────────────────────────────────────────────────────────────

describe('ListEditor card counter', () => {
  it('counts copies, not rows, when a row holds multiple basics', () => {
    // Regression: the counter read buffer.length, so a 102-card deck stored in
    // 82 rows (Island x13, Mountain x9) displayed as "82 / 82".
    const { resultCount } = renderWith(
      [card('Island', 13), card('Mountain', 9), card('Brainstorm', 1)],
      DECK,
    );

    expect(resultCount).toBe(23);
  });

  it('counts singleton rows as one card each', () => {
    const { resultCount } = renderWith(
      [card('Brainstorm', 1), card('Ponder', 1), card('Preordain', 1)],
      DECK,
    );

    expect(resultCount).toBe(3);
  });

  it('reports zero cards for an empty deck', () => {
    const { resultCount } = renderWith([], DECK);

    expect(resultCount).toBe(0);
  });

  it('uses the deck-size target as the denominator, not the buffer total', () => {
    // A 99-card deck reads "x / 99" regardless of how many cards are in it.
    const { totalCount } = renderWith([card('Island', 13)], DECK);

    expect(totalCount).toBe(99);
  });

  it('drops the target to 98 for a two-commander deck', () => {
    const { totalCount } = renderWith([card('Island', 13)], {
      id: 'deck-1',
      name: 'Partners',
      commander: 'Thrasios, Triton Hero',
      partner: 'Tymna the Weaver',
    });

    expect(totalCount).toBe(98);
  });

  it('falls back to the buffer total for a standalone list', () => {
    // No deck means no commander and no fixed size, so x / x is still correct.
    const { resultCount, totalCount, overBy } = renderWith(
      [card('Island', 13), card('Mountain', 9)],
      null,
    );

    expect(resultCount).toBe(22);
    expect(totalCount).toBe(22);
    expect(overBy).toBe(0);
  });

  it('reports the overage when the deck is over its target', () => {
    // 102 cards against a 99 target: the Stella Lee case.
    const { overBy } = renderWith([card('Filler', 100), card('Island', 2)], DECK);

    expect(overBy).toBe(3);
  });

  it('reports no overage when the deck is under or exactly at target', () => {
    expect(renderWith([card('Filler', 99)], DECK).overBy).toBe(0);
    expect(renderWith([card('Filler', 40)], DECK).overBy).toBe(0);
  });
});
