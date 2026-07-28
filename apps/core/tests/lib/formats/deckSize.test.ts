import { describe, it, expect } from 'vitest';

import { requiredListSize, COMMANDER_DECK_SIZE } from '@/lib/formats/deckSize';
import type { Card } from '@/lib/cards/types';

function card(card_name: string, quantity = 1, role?: 'commander' | 'partner'): Card {
  return { card_name, quantity, is_commander: false, is_proxy: false, role: role ?? null };
}

describe('requiredListSize', () => {
  it('is 99 for a deck with a single commander', () => {
    // CR 903.5a: 100 including the commander; the commander is deck-native, so
    // the list holds the other 99.
    expect(requiredListSize('commander', [card('Island', 13)], { commander: 'Stella Lee, Wild Card' })).toBe(99);
  });

  it('is 98 when a second commander eats another slot', () => {
    // Partner / background / Doctor's companion.
    expect(
      requiredListSize('commander', [card('Island', 13)], {
        commander: 'Thrasios, Triton Hero',
        partner: 'Tymna the Weaver',
      }),
    ).toBe(98);
  });

  it('is the full 100 when the commander lives in the list', () => {
    // role='commander' rows already occupy slots inside the 100.
    const cards = [card('Stella Lee, Wild Card', 1, 'commander'), card('Island', 13)];
    expect(requiredListSize('commander', cards, { commander: 'Stella Lee, Wild Card' })).toBe(
      COMMANDER_DECK_SIZE,
    );
  });

  it('counts both commander and partner rows held in the list', () => {
    const cards = [
      card('Thrasios, Triton Hero', 1, 'commander'),
      card('Tymna the Weaver', 1, 'partner'),
    ];
    expect(requiredListSize('commander', cards, { commander: 'Thrasios, Triton Hero', partner: 'Tymna the Weaver' })).toBe(100);
  });

  it('has no target for a standalone list with no deck', () => {
    expect(requiredListSize('commander', [card('Island', 13)], null)).toBeNull();
    expect(requiredListSize('commander', [card('Island', 13)], undefined)).toBeNull();
  });

  it('has no target for a non-commander format', () => {
    expect(requiredListSize('modern', [card('Island', 13)], { commander: 'x' })).toBeNull();
  });

  it('treats an unset commander as occupying no slot', () => {
    // The decklist page seeds commander as '' before the deck loads.
    expect(requiredListSize('commander', [], { commander: '', partner: null })).toBe(100);
  });
});
