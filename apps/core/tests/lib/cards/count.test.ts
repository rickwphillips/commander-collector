import { describe, it, expect } from 'vitest';

import { totalCardCount } from '@/lib/cards/count';

describe('totalCardCount', () => {
  it('sums copies rather than counting rows', () => {
    // The Stella Lee case: 102 cards stored in 82 rows.
    expect(totalCardCount([{ quantity: 13 }, { quantity: 9 }, { quantity: 1 }])).toBe(23);
  });

  it('equals the row count when every row is a singleton', () => {
    expect(totalCardCount([{ quantity: 1 }, { quantity: 1 }, { quantity: 1 }])).toBe(3);
  });

  it('is 0 for an empty list', () => {
    expect(totalCardCount([])).toBe(0);
  });

  it('accepts any object carrying a quantity', () => {
    // Cards, API rows and coach profile entries all flow through this.
    const row = { card_name: 'Island', quantity: 13 };
    expect(totalCardCount([row])).toBe(13);
  });
});
