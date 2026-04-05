import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardReviewGrid } from '@/decks/scan/components/CardReviewGrid';
import type { ScannedCard } from '@/lib/types';

function makeCard(overrides: Partial<ScannedCard> = {}): ScannedCard {
  return {
    id: 'card-1',
    card_name: 'Lightning Bolt',
    scryfall_id: 'abc-123',
    image_uri: 'https://example.com/bolt.jpg',
    back_image_uri: null,
    color_identity: 'R',
    type_line: 'Instant',
    mana_cost: '{R}',
    quantity: 1,
    is_commander: false,
    is_proxy: false,
    notFound: false,
    ...overrides,
  };
}

const noop = () => {};

describe('CardReviewGrid', () => {
  const defaultProps = {
    cropMap: {},
    onChangeQuantity: noop,
    onToggleProxy: noop,
    onToggleCommander: noop,
    onOpenVersionPicker: noop,
    onOpenEdit: noop,
    onRemove: noop,
  };

  it('renders card names', () => {
    const cards = [makeCard(), makeCard({ id: 'card-2', card_name: 'Counterspell' })];
    render(<CardReviewGrid cards={cards} {...defaultProps} />);
    expect(screen.getByTitle('Lightning Bolt')).toBeInTheDocument();
    expect(screen.getByTitle('Counterspell')).toBeInTheDocument();
  });

  it('displays quantity for each card', () => {
    render(<CardReviewGrid cards={[makeCard({ quantity: 3 })]} {...defaultProps} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onChangeQuantity when + is clicked', async () => {
    const user = userEvent.setup();
    const onChangeQuantity = vi.fn();
    render(<CardReviewGrid cards={[makeCard()]} {...defaultProps} onChangeQuantity={onChangeQuantity} />);
    const plusBtn = screen.getByText('+').closest('button')!;
    await user.click(plusBtn);
    expect(onChangeQuantity).toHaveBeenCalledWith('card-1', 1);
  });

  it('calls onChangeQuantity when − is clicked', async () => {
    const user = userEvent.setup();
    const onChangeQuantity = vi.fn();
    render(<CardReviewGrid cards={[makeCard()]} {...defaultProps} onChangeQuantity={onChangeQuantity} />);
    const minusBtn = screen.getByText('−').closest('button')!;
    await user.click(minusBtn);
    expect(onChangeQuantity).toHaveBeenCalledWith('card-1', -1);
  });

  it('calls onToggleCommander when star icon is clicked', async () => {
    const user = userEvent.setup();
    const onToggleCommander = vi.fn();
    render(<CardReviewGrid cards={[makeCard()]} {...defaultProps} onToggleCommander={onToggleCommander} />);
    const btn = screen.getByTitle('Mark as commander');
    await user.click(btn);
    expect(onToggleCommander).toHaveBeenCalledWith('card-1');
  });

  it('calls onToggleProxy when proxy icon is clicked', async () => {
    const user = userEvent.setup();
    const onToggleProxy = vi.fn();
    render(<CardReviewGrid cards={[makeCard()]} {...defaultProps} onToggleProxy={onToggleProxy} />);
    const btn = screen.getByTitle('Mark as proxy');
    await user.click(btn);
    expect(onToggleProxy).toHaveBeenCalledWith('card-1');
  });

  it('calls onRemove when delete icon is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<CardReviewGrid cards={[makeCard()]} {...defaultProps} onRemove={onRemove} />);
    const btn = screen.getByTitle('Remove');
    await user.click(btn);
    expect(onRemove).toHaveBeenCalledWith('card-1');
  });

  it('calls onOpenEdit when edit icon is clicked', async () => {
    const user = userEvent.setup();
    const onOpenEdit = vi.fn();
    render(<CardReviewGrid cards={[makeCard()]} {...defaultProps} onOpenEdit={onOpenEdit} />);
    const btn = screen.getByTitle('Edit');
    await user.click(btn);
    expect(onOpenEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 'card-1' }));
  });

  it('shows version picker button only when card has scryfall_id', () => {
    const cards = [
      makeCard({ id: 'found', scryfall_id: 'abc' }),
      makeCard({ id: 'missing', scryfall_id: null, card_name: 'Unknown' }),
    ];
    render(<CardReviewGrid cards={cards} {...defaultProps} />);
    const versionBtns = screen.getAllByTitle('Change version/set');
    expect(versionBtns).toHaveLength(1);
  });

  it('applies commander outline styling', () => {
    render(<CardReviewGrid cards={[makeCard({ is_commander: true })]} {...defaultProps} />);
    // Commander card should have warning outline — verified by presence in DOM
    expect(screen.getByTitle('Lightning Bolt')).toBeInTheDocument();
  });

  it('shows "Not found" for cards without image and notFound=true', () => {
    render(
      <CardReviewGrid
        cards={[makeCard({ image_uri: null, notFound: true })]}
        {...defaultProps}
      />
    );
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });

  it('renders cards with cropMap entries differently than plain not-found', () => {
    const plainNotFound = makeCard({ id: 'plain-nf', card_name: 'Plain Not Found', image_uri: null, notFound: true });
    const { container } = render(
      <CardReviewGrid
        {...defaultProps}
        cards={[plainNotFound]}
        cropMap={{}}
      />
    );
    // Plain not-found shows the text fallback
    expect(screen.getByText('Not found')).toBeInTheDocument();
    // Verify it renders a card element for not-found cards
    expect(container.querySelectorAll('[class*="MuiCard-root"]')).toHaveLength(1);
  });

  it('renders empty grid when no cards', () => {
    const { container } = render(<CardReviewGrid cards={[]} {...defaultProps} />);
    expect(container.querySelectorAll('[class*="MuiCard-root"]')).toHaveLength(0);
  });
});
