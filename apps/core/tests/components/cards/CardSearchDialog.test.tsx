import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('next/image', () => ({
  default: ({ src, alt, fill: _fill, sizes: _sizes, style: _style, priority: _priority, ...rest }: Record<string, unknown>) =>
    <img src={src as string} alt={alt as string} {...rest} />,
}));

// Stub CardLookupField to keep the test focused on dialog shell behavior.
// It exposes a simple "Add Result" button that calls onAdd with a mock card.
vi.mock('@/components/cards/CardLookupField', () => ({
  CardLookupField: ({ onAdd, defaultValue }: { onAdd?: (cards: import('@/lib/cards/types').Card[]) => void; defaultValue?: string }) => (
    <div>
      <input
        data-testid="lookup-input"
        defaultValue={defaultValue}
        readOnly
        aria-label="Card lookup field"
      />
      <button
        onClick={() =>
          onAdd?.([
            {
              card_name: 'Lightning Bolt',
              quantity: 1,
              color_identity: 'R',
              is_commander: false,
              is_proxy: false,
              scryfall_id: 'lb-001',
            },
          ])
        }
      >
        Add Result
      </button>
    </div>
  ),
}));

// ── Import after mocks ─────────────────────────────────────────────────────────

import { CardSearchDialog } from '@/components/cards/CardSearchDialog';
import type { Card } from '@/lib/cards/types';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    card_name:      'Sol Ring',
    quantity:       1,
    color_identity: 'C',
    is_commander:   false,
    is_proxy:       false,
    scryfall_id:    'sr-001',
    image_uri:      null,
    ...overrides,
  };
}

describe('CardSearchDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when open is false', () => {
    render(
      <CardSearchDialog
        open={false}
        mode="add"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.queryByText('Add card')).not.toBeInTheDocument();
  });

  it('renders "Add card" title in add mode', () => {
    render(
      <CardSearchDialog
        open
        mode="add"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByText('Add card')).toBeInTheDocument();
  });

  it('renders "Edit card" title in edit mode', () => {
    render(
      <CardSearchDialog
        open
        mode="edit"
        initialCard={makeCard()}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByText('Edit card')).toBeInTheDocument();
  });

  it('shows current card panel in edit mode', () => {
    render(
      <CardSearchDialog
        open
        mode="edit"
        initialCard={makeCard()}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Current card')).toBeInTheDocument();
    expect(screen.getByText('Sol Ring')).toBeInTheDocument();
  });

  it('calls onConfirm with result card when Add Result is clicked in add mode', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <CardSearchDialog
        open
        mode="add"
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />
    );
    await user.click(screen.getByText('Add Result'));
    expect(onConfirm).toHaveBeenCalledOnce();
    const [cards] = onConfirm.mock.calls[0] as [Card[]];
    expect(cards[0].card_name).toBe('Lightning Bolt');
  });

  it('calls onCancel when close button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <CardSearchDialog
        open
        mode="add"
        onCancel={onCancel}
        onConfirm={vi.fn()}
      />
    );
    await user.click(screen.getByLabelText('Close dialog'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('accepts a custom title override', () => {
    render(
      <CardSearchDialog
        open
        mode="add"
        title="Find a Replacement"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByText('Find a Replacement')).toBeInTheDocument();
  });
});
