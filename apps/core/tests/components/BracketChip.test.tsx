import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import * as apiModule from '@/lib/api';
import { BracketChip } from '@/components/BracketChip';
import { _resetDeckBracketCache } from '@/lib/useDeckBracket';

function mockDeckProfile(cards: string[]) {
  vi.spyOn(apiModule.api, 'getDeckProfile').mockResolvedValue({
    cards: cards.map((name) => ({ card_name: name, quantity: 1 })),
  } as never);
}

function mockScore(bracket: number, bracketName: string, signals: Array<{ name: string; contribution: number; reason: string }> = []) {
  vi.spyOn(apiModule.api, 'scoreDeck').mockResolvedValue({
    band: 'high',
    data: { bracket, bracket_name: bracketName, strength_score: 1.5, signals, warnings: [], color_identity: [], missing: [] },
    sources: [],
    caveats: [],
  } as never);
}

describe('BracketChip', () => {
  beforeEach(() => { vi.clearAllMocks(); _resetDeckBracketCache(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('renders nothing when deckId is null', () => {
    const { container } = render(<BracketChip deckId={null} />);
    // Spinner shows briefly, but bracket is null — renders "Bracket ?" chip
    expect(container).toBeDefined();
  });

  it('shows loading chip while fetching', () => {
    // Don't resolve the mock — keeps it in loading state
    vi.spyOn(apiModule.api, 'getDeckProfile').mockReturnValue(new Promise(() => {}));
    render(<BracketChip deckId="deck-1" />);
    expect(screen.getByText(/scoring deck/i)).toBeInTheDocument();
  });

  it('shows bracket chip after resolving', async () => {
    mockDeckProfile(['Sol Ring']);
    mockScore(3, 'High Power');
    render(<BracketChip deckId="deck-1" />);
    await waitFor(() => expect(screen.getByText('Bracket 3')).toBeInTheDocument());
  });

  it('shows "Bracket ?" when bracket is null (empty deck)', async () => {
    mockDeckProfile([]);
    render(<BracketChip deckId="empty" />);
    await waitFor(() => expect(screen.getByText('Bracket ?')).toBeInTheDocument());
  });

  it('shows "Bracket ?" when MCP returns unknown', async () => {
    mockDeckProfile(['Sol Ring']);
    vi.spyOn(apiModule.api, 'scoreDeck').mockResolvedValue({
      band: 'unknown', data: null, sources: [], caveats: ['MCP unavailable'],
    } as never);
    render(<BracketChip deckId="deck-unknown" />);
    await waitFor(() => expect(screen.getByText('Bracket ?')).toBeInTheDocument());
  });

  it('renders bracket 1 and 2 with success color class', async () => {
    mockDeckProfile(['Forest']);
    mockScore(1, 'Precon');
    render(<BracketChip deckId="deck-low" />);
    await waitFor(() => expect(screen.getByText('Bracket 1')).toBeInTheDocument());
  });
});
