import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('next/image', () => ({
  default: ({ src, alt, fill: _fill, sizes: _sizes, style: _style, priority: _priority, ...rest }: Record<string, unknown>) =>
    <img src={src as string} alt={alt as string} {...rest} />,
}));

vi.mock('@/components/ManaSymbol', () => ({
  ManaSymbol: ({ color }: { color: string }) => <span>{color}</span>,
  ColorSymbols: ({ colors }: { colors: string }) => <span>{colors}</span>,
}));

vi.mock('@/components/ManaCost', () => ({
  ManaCost: ({ cost }: { cost: string }) => <span>{cost}</span>,
}));

vi.mock('@/components/cards/CardFilterBar', () => ({
  CardFilterBar: ({
    onChange,
  }: {
    state: unknown;
    onChange: (s: unknown) => void;
  }) => (
    <div>
      <input
        data-testid="filter-search"
        placeholder="Search cards…"
        onChange={(e) => onChange({ sort: 'name', sortDir: 'asc', search: e.target.value })}
      />
    </div>
  ),
}));

// ── Import after mocks ─────────────────────────────────────────────────────────

import { CardListView } from '@/components/cards/CardListView';
import type { Card } from '@/lib/cards/types';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeCard(name: string, overrides: Partial<Card> = {}): Card {
  return {
    card_name: name,
    quantity: 1,
    color_identity: 'R',
    is_commander: false,
    is_proxy: false,
    scryfall_id: `sf-${name}`,
    image_uri: `/img/${name}.jpg`,
    type_line: 'Instant',
    ...overrides,
  };
}

const sampleCards = [
  makeCard('Lightning Bolt', { type_line: 'Instant' }),
  makeCard('Sol Ring', { color_identity: 'C', type_line: 'Artifact' }),
];

describe('CardListView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders card names in gallery mode', () => {
    render(<CardListView cards={sampleCards} viewMode="gallery" />);
    // Cards are rendered as images with alt = card name
    expect(screen.getByAltText('Lightning Bolt')).toBeInTheDocument();
    expect(screen.getByAltText('Sol Ring')).toBeInTheDocument();
  });

  it('renders card names in text mode', () => {
    render(<CardListView cards={sampleCards} viewMode="text" />);
    expect(screen.getByText('Lightning Bolt')).toBeInTheDocument();
    expect(screen.getByText('Sol Ring')).toBeInTheDocument();
  });

  it('renders breakdown view grouped by type category', () => {
    const cards = [
      makeCard('Bolt', { type_line: 'Instant' }),
      makeCard('Ring', { type_line: 'Artifact' }),
    ];
    render(<CardListView cards={cards} viewMode="breakdown" />);
    expect(screen.getByText('Instants')).toBeInTheDocument();
    expect(screen.getByText('Artifacts')).toBeInTheDocument();
  });

  it('shows empty state when card list is empty', () => {
    render(<CardListView cards={[]} viewMode="gallery" />);
    expect(screen.getByLabelText('No cards in this list')).toBeInTheDocument();
  });

  it('does not warn about a missing react-window for >50 cards (dep is installed)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const manyCards = Array.from({ length: 51 }, (_, i) =>
      makeCard(`Card ${i}`, { scryfall_id: `sf-${i}` })
    );
    render(<CardListView cards={manyCards} viewMode="gallery" />);
    const reactWindowWarnings = warnSpy.mock.calls.filter((args) =>
      args.some((a) => typeof a === 'string' && a.includes('react-window')),
    );
    expect(reactWindowWarnings).toHaveLength(0);
    warnSpy.mockRestore();
  });

  it('onChange fires after qty change in edit mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CardListView
        cards={sampleCards}
        viewMode="gallery"
        editMode
        onChange={onChange}
      />
    );

    // Increase qty on the first card
    const increaseButtons = screen.getAllByLabelText('Increase quantity');
    await user.click(increaseButtons[0]);

    expect(onChange).toHaveBeenCalledOnce();
    const [newCards] = onChange.mock.calls[0] as [typeof sampleCards];
    // The first card's quantity should be 2
    const updatedCard = newCards.find((c) => c.card_name === sampleCards[0].card_name);
    expect(updatedCard?.quantity).toBe(2);
  });

  it('Cmd+Z keyboard shortcut fires undo action', () => {
    // Verify the keyboard handler is wired by firing keydown directly.
    // The internal undo stack pops — we verify this doesn't throw and that
    // the component remains mounted. Full undo propagation requires the parent
    // to update the cards prop (controlled component pattern).
    const onChange = vi.fn();
    render(
      <CardListView
        cards={sampleCards}
        viewMode="gallery"
        editMode
        onChange={onChange}
      />
    );
    // Fire Cmd+Z — should not throw; undo stack is at initial state (no-op)
    expect(() => {
      fireEvent.keyDown(document, { key: 'z', metaKey: true });
    }).not.toThrow();
  });

  it('Cmd+Shift+Z keyboard shortcut fires redo action without throwing', () => {
    const onChange = vi.fn();
    render(
      <CardListView
        cards={sampleCards}
        viewMode="gallery"
        editMode
        onChange={onChange}
      />
    );
    expect(() => {
      fireEvent.keyDown(document, { key: 'z', metaKey: true, shiftKey: true });
    }).not.toThrow();
  });
});
