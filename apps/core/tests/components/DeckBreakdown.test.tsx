import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeckBreakdown, type BreakdownCard } from '@/components/DeckBreakdown';

// ── Mocks ────────────────────────────────────────────────────────────

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

vi.mock('@/components/ManaSymbol', () => ({
  ManaSymbol: ({ color }: { color: string }) => (
    <span data-testid={`mana-${color}`}>{color}</span>
  ),
}));

vi.mock('@/components/CardListDisplay', () => ({
  CardListDisplay: () => <div data-testid="card-list-display" />,
}));

// ── Helpers ──────────────────────────────────────────────────────────

function card(overrides: Partial<BreakdownCard> & { card_name: string }): BreakdownCard {
  return {
    quantity: 1,
    is_commander: 0,
    is_proxy: 0,
    type_line: null,
    color_identity: null,
    mana_cost: null,
    image_uri: null,
    back_image_uri: null,
    scryfall_id: null,
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────────

describe('DeckBreakdown', () => {
  it('renders total card count', () => {
    const cards: BreakdownCard[] = [
      card({ card_name: 'Sol Ring', type_line: 'Artifact', quantity: 1 }),
      card({ card_name: 'Forest', type_line: 'Basic Land — Forest', quantity: 3 }),
    ];
    render(<DeckBreakdown cards={cards} />);
    expect(screen.getByText('4 cards')).toBeInTheDocument();
  });

  it('categorises cards into Creature, Instant, Sorcery, Enchantment, Artifact, Land', () => {
    const cards: BreakdownCard[] = [
      card({ card_name: 'Llanowar Elves', type_line: 'Creature — Elf Druid', quantity: 1 }),
      card({ card_name: 'Counterspell', type_line: 'Instant', quantity: 1 }),
      card({ card_name: 'Demonic Tutor', type_line: 'Sorcery', quantity: 1 }),
      card({ card_name: 'Rhystic Study', type_line: 'Enchantment', quantity: 1 }),
      card({ card_name: 'Sol Ring', type_line: 'Artifact', quantity: 1 }),
      card({ card_name: 'Command Tower', type_line: 'Land', quantity: 1 }),
    ];
    render(<DeckBreakdown cards={cards} />);

    // Categories may appear in both the summary grid and pie chart legend
    expect(screen.getAllByText('Creature').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Instant').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Sorcery').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Enchantment').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Artifact').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Land').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('6 cards')).toBeInTheDocument();
  });

  it('shows Commander category for commander cards', () => {
    const cards: BreakdownCard[] = [
      card({
        card_name: 'Atraxa, Praetors\' Voice',
        type_line: 'Legendary Creature — Phyrexian Angel Horror',
        is_commander: 1,
        quantity: 1,
      }),
      card({ card_name: 'Forest', type_line: 'Basic Land — Forest', quantity: 1 }),
    ];
    render(<DeckBreakdown cards={cards} />);
    expect(screen.getByText('Commander')).toBeInTheDocument();
  });

  it('shows proxy count chip when proxies exist', () => {
    const cards: BreakdownCard[] = [
      card({ card_name: 'Black Lotus', type_line: 'Artifact', is_proxy: 1, quantity: 1 }),
      card({ card_name: 'Sol Ring', type_line: 'Artifact', is_proxy: 0, quantity: 1 }),
    ];
    render(<DeckBreakdown cards={cards} />);
    expect(screen.getByText('1 proxies')).toBeInTheDocument();
  });

  it('does not show proxy chip when no proxies exist', () => {
    const cards: BreakdownCard[] = [
      card({ card_name: 'Sol Ring', type_line: 'Artifact', quantity: 1 }),
    ];
    render(<DeckBreakdown cards={cards} />);
    expect(screen.queryByText(/proxies/)).not.toBeInTheDocument();
  });

  it('renders color distribution mana symbols', () => {
    const cards: BreakdownCard[] = [
      card({ card_name: 'Llanowar Elves', type_line: 'Creature', color_identity: 'G', quantity: 2 }),
      card({ card_name: 'Counterspell', type_line: 'Instant', color_identity: 'U', quantity: 1 }),
    ];
    render(<DeckBreakdown cards={cards} />);

    // ManaSymbol is mocked to render a span with data-testid;
    // symbols appear in both the summary row and the collapsible pie chart
    expect(screen.getAllByTestId('mana-U').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId('mana-G').length).toBeGreaterThanOrEqual(1);
  });

  it('counts colorless cards under C', () => {
    const cards: BreakdownCard[] = [
      card({ card_name: 'Sol Ring', type_line: 'Artifact', color_identity: '', quantity: 1 }),
      card({ card_name: 'Mana Crypt', type_line: 'Artifact', color_identity: '', quantity: 1 }),
    ];
    render(<DeckBreakdown cards={cards} />);
    expect(screen.getByTestId('mana-C')).toBeInTheDocument();
  });

  it('handles an empty cards array', () => {
    render(<DeckBreakdown cards={[]} />);
    expect(screen.getByText('0 cards')).toBeInTheDocument();
    expect(screen.queryByText(/proxies/)).not.toBeInTheDocument();
  });

  it('sums quantities per category', () => {
    const cards: BreakdownCard[] = [
      card({ card_name: 'Llanowar Elves', type_line: 'Creature', quantity: 4 }),
      card({ card_name: 'Birds of Paradise', type_line: 'Creature', quantity: 2 }),
      card({ card_name: 'Sol Ring', type_line: 'Artifact', quantity: 1 }),
    ];
    render(<DeckBreakdown cards={cards} />);
    expect(screen.getByText('7 cards')).toBeInTheDocument();
    // Creature count = 6
    expect(screen.getByText('6')).toBeInTheDocument();
  });
});
