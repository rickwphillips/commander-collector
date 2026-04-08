import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardTile } from '@/components/cards/CardTile';
import type { Card } from '@/lib/cards/types';

// next/image → plain <img> so jsdom can render it
vi.mock('next/image', () => ({
  default: ({ src, alt, fill: _fill, sizes: _sizes, style: _style, priority: _priority, ...rest }: Record<string, unknown>) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt as string} {...rest} />,
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    card_name:      'Sol Ring',
    quantity:       1,
    color_identity: 'C',
    is_commander:   false,
    is_proxy:       false,
    scryfall_id:    'abc-123',
    image_uri:      '/sol-ring.jpg',
    ...overrides,
  };
}

describe('CardTile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders card image when lookupState is resolved', () => {
    const card = makeCard();
    render(<CardTile card={card} lookupState="resolved" />);
    expect(screen.getByRole('img', { name: 'Sol Ring' })).toBeInTheDocument();
  });

  it('renders placeholder and not-found badge when lookupState is not_found', () => {
    const card = makeCard({ scryfall_id: null, image_uri: null });
    render(<CardTile card={card} lookupState="not_found" />);
    expect(screen.getByAltText('Card not found')).toBeInTheDocument();
    expect(screen.getByLabelText('Card not found — click to repair')).toBeInTheDocument();
  });

  it('renders pending spinner overlay when lookupState is pending', () => {
    const card = makeCard({ scryfall_id: null, image_uri: null });
    render(<CardTile card={card} lookupState="pending" />);
    expect(screen.getByLabelText('Looking up…')).toBeInTheDocument();
  });

  it('renders transient_error warning badge', () => {
    const card = makeCard({ scryfall_id: null });
    render(<CardTile card={card} lookupState="transient_error" />);
    expect(screen.getByLabelText('Lookup failed — retrying')).toBeInTheDocument();
  });

  it('renders custom badge when lookupState is custom', () => {
    const card = makeCard();
    render(<CardTile card={card} lookupState="custom" />);
    expect(screen.getByLabelText('Custom card')).toBeInTheDocument();
  });

  it('shows commander star when is_commander === true', () => {
    const card = makeCard({ is_commander: true });
    render(<CardTile card={card} lookupState="resolved" />);
    expect(screen.getByLabelText('Commander')).toBeInTheDocument();
  });

  it('shows commander star when role === "commander"', () => {
    const card = makeCard({ role: 'commander' });
    render(<CardTile card={card} lookupState="resolved" />);
    expect(screen.getByLabelText('Commander')).toBeInTheDocument();
  });

  it('shows partner badge when role === "partner"', () => {
    const card = makeCard({ role: 'partner' });
    render(<CardTile card={card} lookupState="resolved" />);
    expect(screen.getByLabelText('Partner')).toBeInTheDocument();
  });

  it('does not show partner badge when role is commander (commander takes priority)', () => {
    const card = makeCard({ role: 'commander', is_commander: true });
    render(<CardTile card={card} lookupState="resolved" />);
    expect(screen.getByLabelText('Commander')).toBeInTheDocument();
    expect(screen.queryByLabelText('Partner')).not.toBeInTheDocument();
  });

  it('calls onQtyChange when stepper is used in edit mode', async () => {
    const user = userEvent.setup();
    const onQtyChange = vi.fn();
    const card = makeCard({ quantity: 2 });
    render(<CardTile card={card} editMode onQtyChange={onQtyChange} lookupState="resolved" />);

    await user.click(screen.getByLabelText('Increase quantity'));
    expect(onQtyChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByLabelText('Decrease quantity'));
    expect(onQtyChange).toHaveBeenCalledWith(1);
  });

  it('decrease quantity button is disabled at qty === 1', () => {
    const card = makeCard({ quantity: 1 });
    render(<CardTile card={card} editMode onQtyChange={vi.fn()} lookupState="resolved" />);
    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
  });

  it('calls onDelete when delete button is clicked in edit mode', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const card = makeCard();
    render(<CardTile card={card} editMode onDelete={onDelete} lookupState="resolved" />);
    await user.click(screen.getByLabelText('Delete Sol Ring'));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('qty stepper and delete button are not shown outside edit mode', () => {
    const card = makeCard();
    render(<CardTile card={card} lookupState="resolved" />);
    expect(screen.queryByLabelText('Increase quantity')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete Sol Ring')).not.toBeInTheDocument();
  });
});
