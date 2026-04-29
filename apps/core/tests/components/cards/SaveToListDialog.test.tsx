import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('next/image', () => ({
  default: ({ src, alt, fill: _fill, sizes: _sizes, style: _style, ...rest }: Record<string, unknown>) =>
    <img src={src as string} alt={alt as string} {...rest} />,
}));

// Stub CardLookupField to emit a mock card on onChange
vi.mock('@/components/cards/CardLookupField', () => ({
  CardLookupField: ({
    onChange,
    label,
  }: {
    onChange?: (card: import('@/lib/cards/types').Card | null) => void;
    label?: string;
    placeholder?: string;
    singletonMode?: boolean;
    resultFilter?: unknown;
  }) => (
    <div>
      <label>{label ?? 'Card lookup'}</label>
      <button
        aria-label={`Pick commander via ${label ?? 'Card lookup'}`}
        onClick={() =>
          onChange?.({
            card_name: 'Atraxa',
            quantity: 1,
            color_identity: 'WUBG',
            is_commander: false,
            is_proxy: false,
            scryfall_id: 'atraxa-001',
          })
        }
      >
        Pick Card
      </button>
    </div>
  ),
}));

// ── Import after mocks ─────────────────────────────────────────────────────────

import { SaveToListDialog } from '@/components/cards/SaveToListDialog';
import type { Card } from '@/lib/cards/types';
import type { SaveDestination } from '@/components/cards/SaveToListDialog';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeCard(name: string, overrides: Partial<Card> = {}): Card {
  return {
    card_name: name,
    quantity: 1,
    color_identity: 'C',
    is_commander: false,
    is_proxy: false,
    scryfall_id: `sf-${name}`,
    ...overrides,
  };
}

const defaultProps = {
  open: true,
  buffer: [makeCard('Sol Ring')],
  decks: [{ id: 'test-deck-1', name: 'Elves' }],
  lists: [{ id: 'test-list-10', name: 'My Sideboard' }],
  onCancel: vi.fn(),
  onConfirm: vi.fn(),
};

describe('SaveToListDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders visible destination tabs (into-deck hidden without deckContext)', () => {
    render(<SaveToListDialog {...defaultProps} />);
    expect(screen.getByText('New list')).toBeInTheDocument();
    expect(screen.getByText('New deck')).toBeInTheDocument();
    expect(screen.getByText('Attach to deck')).toBeInTheDocument();
    expect(screen.getByText('Append to list')).toBeInTheDocument();
    // into-deck tab is hidden when no deckContext
    expect(screen.queryByText('Into deck')).not.toBeInTheDocument();
  });

  it('renders Into deck tab when deckContext is provided', () => {
    render(<SaveToListDialog {...defaultProps} deckContext={{ id: 'deck-1', name: 'Test Deck' }} />);
    expect(screen.getByText('Into deck')).toBeInTheDocument();
  });

  it('confirm button emits new-list destination when New list tab is active', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<SaveToListDialog {...defaultProps} onConfirm={onConfirm} />);

    // New list tab is default — confirm button should be enabled (has auto-name)
    await user.click(screen.getByText('Save as new list'));
    expect(onConfirm).toHaveBeenCalledOnce();
    const [dest] = onConfirm.mock.calls[0] as [SaveDestination];
    expect(dest.kind).toBe('new-list');
  });

  it('confirm button is disabled on new-deck tab until commander is picked', async () => {
    const user = userEvent.setup();
    render(<SaveToListDialog {...defaultProps} />);

    await user.click(screen.getByRole('tab', { name: /New deck/i }));

    // Create deck button should be disabled before commander is picked
    expect(screen.getByText('Create deck')).toBeDisabled();
  });

  it('confirm button enables after picking a commander on new-deck tab', async () => {
    const user = userEvent.setup();
    render(<SaveToListDialog {...defaultProps} />);

    await user.click(screen.getByRole('tab', { name: /New deck/i }));
    // Pick a commander via the stubbed CardLookupField
    await user.click(screen.getByLabelText(/Pick commander via Search for a commander/));

    expect(screen.getByText('Create deck')).not.toBeDisabled();
  });

  it('into-deck tab is hidden when no deckContext', () => {
    render(
      <SaveToListDialog
        {...defaultProps}
        deckContext={null}
      />
    );
    // Tab is filtered out entirely, not rendered as disabled
    expect(screen.queryByText('Into deck')).not.toBeInTheDocument();
  });

  it('auto-names list using commander row from buffer', () => {
    const commanderCard = makeCard('Atraxa', { role: 'commander' });
    render(
      <SaveToListDialog
        {...defaultProps}
        buffer={[commanderCard, makeCard('Sol Ring')]}
      />
    );
    // The auto-name should include the commander's name
    expect(screen.getByDisplayValue('Atraxa list')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<SaveToListDialog {...defaultProps} onCancel={onCancel} />);

    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
