import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { DeckFilters, EMPTY_FILTERS } from '@/components/DeckFilters';

// ── Helpers ──────────────────────────────────────────────────────────

function renderCounter(props: { resultCount: number; totalCount: number; overBy?: number }) {
  render(
    <DeckFilters
      filters={EMPTY_FILTERS}
      onChange={vi.fn()}
      cards={[{ card_name: 'Island' }]}
      {...props}
    />,
  );
  return screen.getByTestId('deck-card-count');
}

// ── Tests ────────────────────────────────────────────────────────────

describe('DeckFilters card counter', () => {
  it('renders count over target', () => {
    expect(renderCounter({ resultCount: 102, totalCount: 99, overBy: 3 })).toHaveTextContent(
      '102 / 99',
    );
  });

  it('turns red and bold when the deck is over target', () => {
    const el = renderCounter({ resultCount: 102, totalCount: 99, overBy: 3 });
    const { color, fontWeight } = getComputedStyle(el);

    // Assert the hue is red-dominant rather than pinning the palette's exact
    // hex, so retheming the error color does not break this test.
    const [r, g, b] = color.match(/\d+/g)!.map(Number);
    expect(r).toBeGreaterThan(g);
    expect(r).toBeGreaterThan(b);
    expect(fontWeight).toBe('600');
  });

  it('is muted and not bold when the deck is at target', () => {
    const el = renderCounter({ resultCount: 99, totalCount: 99, overBy: 0 });
    const { color, fontWeight } = getComputedStyle(el);

    const [r, g, b] = color.match(/\d+/g)!.map(Number);
    expect(r === g && g === b).toBe(true); // neutral grey, no hue
    expect(fontWeight).not.toBe('600');
  });

  it('defaults to not-over when overBy is omitted', () => {
    const el = renderCounter({ resultCount: 50, totalCount: 99 });

    expect(getComputedStyle(el).fontWeight).not.toBe('600');
  });
});
