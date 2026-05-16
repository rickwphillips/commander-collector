import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import * as apiModule from '@/lib/api';
import { BracketMismatchBanner } from '@/components/BracketMismatchBanner';
import { _resetDeckBracketCache } from '@/lib/useDeckBracket';

function mockSlot(bracket: number | null) {
  if (bracket === null) {
    vi.spyOn(apiModule.api, 'getDeckProfile').mockResolvedValue({ cards: [] } as never);
  } else {
    vi.spyOn(apiModule.api, 'getDeckProfile').mockResolvedValue({
      cards: [{ card_name: 'Sol Ring', quantity: 1 }],
    } as never);
    vi.spyOn(apiModule.api, 'scoreDeck').mockResolvedValue({
      band: 'high',
      data: {
        bracket,
        bracket_name: `Bracket ${bracket}`,
        strength_score: 1.0,
        signals: [],
        warnings: [],
        color_identity: [],
        missing: [],
      },
      sources: [],
      caveats: [],
    } as never);
  }
}

function mockSlots(brackets: (number | null)[]) {
  const profileMock = vi.spyOn(apiModule.api, 'getDeckProfile');
  const scoreMock = vi.spyOn(apiModule.api, 'scoreDeck');

  brackets.forEach((b, i) => {
    profileMock.mockResolvedValueOnce({
      cards: b === null ? [] : [{ card_name: `Card${i}`, quantity: 1 }],
    } as never);
    if (b !== null) {
      scoreMock.mockResolvedValueOnce({
        band: 'high',
        data: { bracket: b, bracket_name: `Bracket ${b}`, strength_score: 1.0, signals: [], warnings: [], color_identity: [], missing: [] },
        sources: [],
        caveats: [],
      } as never);
    }
  });
}

const SLOTS_2 = (b1: number, b2: number) => [
  { deckId: 'a', commander: 'Atraxa', playerName: 'Alice' },
  { deckId: 'b', commander: 'Ur-Dragon', playerName: 'Bob' },
  { deckId: undefined },
  { deckId: undefined },
].slice(0, 2).map((s, i) => ({ ...s, deckId: ['a', 'b'][i] }));

describe('BracketMismatchBanner', () => {
  beforeEach(() => { vi.clearAllMocks(); _resetDeckBracketCache(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('renders nothing when fewer than 2 slots have deckIds', () => {
    const { container } = render(
      <BracketMismatchBanner slots={[{ deckId: null }, { deckId: null }]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when spread is below threshold', async () => {
    mockSlots([2, 3]);
    const { container } = render(
      <BracketMismatchBanner
        slots={[
          { deckId: 'a', playerName: 'Alice' },
          { deckId: 'b', playerName: 'Bob' },
          { deckId: undefined },
          { deckId: undefined },
        ]}
      />
    );
    await waitFor(() => {}, { timeout: 500 });
    // spread = 1, threshold = 2 — no banner
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows warning when spread meets threshold', async () => {
    mockSlots([1, 3]);
    render(
      <BracketMismatchBanner
        slots={[
          { deckId: 'a', playerName: 'Alice' },
          { deckId: 'b', playerName: 'Bob' },
          { deckId: undefined },
          { deckId: undefined },
        ]}
      />
    );
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByText(/bracket spread is large/i)).toBeInTheDocument();
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    expect(screen.getByText(/bob/i)).toBeInTheDocument();
  });

  it('excludes slots with no deckId from spread calculation', async () => {
    mockSlots([1]);
    render(
      <BracketMismatchBanner
        slots={[
          { deckId: 'a', playerName: 'Alice' },
          { deckId: null },
          { deckId: undefined },
          { deckId: undefined },
        ]}
      />
    );
    await waitFor(() => {}, { timeout: 300 });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('respects custom thresholdSpread', async () => {
    mockSlots([1, 2]);
    render(
      <BracketMismatchBanner
        thresholdSpread={1}
        slots={[
          { deckId: 'a', playerName: 'Alice' },
          { deckId: 'b', playerName: 'Bob' },
          { deckId: undefined },
          { deckId: undefined },
        ]}
      />
    );
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  });
});
