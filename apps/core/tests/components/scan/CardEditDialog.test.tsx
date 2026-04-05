import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

vi.mock('@/lib/api', () => ({
  api: { lookupCard: vi.fn() },
  ASSET_BASE: '',
}));

vi.mock('@/lib/scryfall', () => ({
  scryfallAutocomplete: vi.fn(),
}));

import { api } from '@/lib/api';
import { scryfallAutocomplete } from '@/lib/scryfall';
import { CardEditDialog } from '@/decks/scan/components/CardEditDialog';
import type { ScannedCard } from '@/lib/types';

function makeCard(overrides: Partial<ScannedCard> = {}): ScannedCard {
  return {
    id: 'card-1', card_name: 'Lightning Bolt', scryfall_id: 'abc',
    image_uri: 'https://example.com/img.jpg', back_image_uri: null,
    color_identity: 'R', type_line: 'Instant', mana_cost: '{R}',
    quantity: 2, is_commander: true, is_proxy: false, notFound: false,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  (scryfallAutocomplete as ReturnType<typeof vi.fn>).mockResolvedValue([]);
});

describe('CardEditDialog', () => {
  it('does not render when card is null', () => {
    render(<CardEditDialog card={null} onClose={() => {}} onUpdate={() => {}} />);
    expect(screen.queryByText('Edit Card')).not.toBeInTheDocument();
  });

  it('renders with card name pre-filled', () => {
    render(<CardEditDialog card={makeCard()} onClose={() => {}} onUpdate={() => {}} />);
    expect(screen.getByText('Edit Card')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Lightning Bolt')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CardEditDialog card={makeCard()} onClose={onClose} onUpdate={() => {}} />);
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('shows autocomplete suggestions', async () => {
    const user = userEvent.setup();
    (scryfallAutocomplete as ReturnType<typeof vi.fn>).mockResolvedValue(['Bolt of Lightning', 'Bolt Bend']);
    render(<CardEditDialog card={makeCard()} onClose={() => {}} onUpdate={() => {}} />);

    const input = screen.getByDisplayValue('Lightning Bolt');
    await user.clear(input);
    await user.type(input, 'Bolt');

    await waitFor(() => {
      expect(screen.getByText('Bolt of Lightning')).toBeInTheDocument();
      expect(screen.getByText('Bolt Bend')).toBeInTheDocument();
    });
  });

  it('calls onUpdate with updated card on confirm', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    (api.lookupCard as ReturnType<typeof vi.fn>).mockResolvedValue({
      name: 'Shock', scryfall_id: 'shock-1', image_uri: 'https://example.com/shock.jpg',
      back_image_uri: null, color_identity: 'R', type_line: 'Instant', mana_cost: '{R}',
    });

    render(<CardEditDialog card={makeCard()} onClose={() => {}} onUpdate={onUpdate} />);

    const input = screen.getByDisplayValue('Lightning Bolt');
    await user.clear(input);
    await user.type(input, 'Shock');
    await user.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith('card-1', expect.objectContaining({
        id: 'card-1',
        card_name: 'Shock',
        quantity: 2,
        is_commander: true,
      }));
    });
  });

  it('preserves quantity and commander status from original card', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    (api.lookupCard as ReturnType<typeof vi.fn>).mockResolvedValue({
      name: 'Shock', scryfall_id: 'shock-1', image_uri: null,
      back_image_uri: null, color_identity: 'R', type_line: 'Instant', mana_cost: '{R}',
    });

    const card = makeCard({ quantity: 4, is_commander: true });
    render(<CardEditDialog card={card} onClose={() => {}} onUpdate={onUpdate} />);
    await user.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith('card-1', expect.objectContaining({
        quantity: 4,
        is_commander: true,
      }));
    });
  });

  it('clicking a suggestion confirms immediately', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const onClose = vi.fn();
    (scryfallAutocomplete as ReturnType<typeof vi.fn>).mockResolvedValue(['Counterspell']);
    (api.lookupCard as ReturnType<typeof vi.fn>).mockResolvedValue({
      name: 'Counterspell', scryfall_id: 'cs-1', image_uri: null,
      back_image_uri: null, color_identity: 'U', type_line: 'Instant', mana_cost: '{U}{U}',
    });

    render(<CardEditDialog card={makeCard()} onClose={onClose} onUpdate={onUpdate} />);

    const input = screen.getByDisplayValue('Lightning Bolt');
    await user.clear(input);
    await user.type(input, 'Co');

    await waitFor(() => expect(screen.getByText('Counterspell')).toBeInTheDocument());
    await user.click(screen.getByText('Counterspell'));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});
