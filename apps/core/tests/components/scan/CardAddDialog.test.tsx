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
import { CardAddDialog } from '@/decks/scan/components/CardAddDialog';

beforeEach(() => {
  vi.clearAllMocks();
  (scryfallAutocomplete as ReturnType<typeof vi.fn>).mockResolvedValue([]);
});

describe('CardAddDialog', () => {
  it('does not render when closed', () => {
    render(<CardAddDialog open={false} onClose={() => {}} onAdd={() => {}} />);
    expect(screen.queryByText('Add Card')).not.toBeInTheDocument();
  });

  it('renders empty input when open', () => {
    render(<CardAddDialog open={true} onClose={() => {}} onAdd={() => {}} />);
    expect(screen.getByText('Add Card')).toBeInTheDocument();
    expect(screen.getByLabelText('Card Name')).toHaveValue('');
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CardAddDialog open={true} onClose={onClose} onAdd={() => {}} />);
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('Add button is disabled when input is empty', () => {
    render(<CardAddDialog open={true} onClose={() => {}} onAdd={() => {}} />);
    expect(screen.getByText('Add')).toBeDisabled();
  });

  it('shows autocomplete suggestions', async () => {
    const user = userEvent.setup();
    (scryfallAutocomplete as ReturnType<typeof vi.fn>).mockResolvedValue(['Sol Ring', 'Solemn Simulacrum']);
    render(<CardAddDialog open={true} onClose={() => {}} onAdd={() => {}} />);

    await user.type(screen.getByLabelText('Card Name'), 'Sol');

    await waitFor(() => {
      expect(screen.getByText('Sol Ring')).toBeInTheDocument();
      expect(screen.getByText('Solemn Simulacrum')).toBeInTheDocument();
    });
  });

  it('calls onAdd with new card on confirm', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    (api.lookupCard as ReturnType<typeof vi.fn>).mockResolvedValue({
      name: 'Sol Ring', scryfall_id: 'sr-1', image_uri: 'https://example.com/sol.jpg',
      back_image_uri: null, color_identity: '', type_line: 'Artifact', mana_cost: '{1}',
    });

    render(<CardAddDialog open={true} onClose={() => {}} onAdd={onAdd} />);

    await user.type(screen.getByLabelText('Card Name'), 'Sol Ring');
    await user.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({
        card_name: 'Sol Ring',
        scryfall_id: 'sr-1',
        quantity: 1,
        is_commander: false,
        is_proxy: false,
      }));
    });
  });

  it('clicking a suggestion confirms immediately', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onClose = vi.fn();
    (scryfallAutocomplete as ReturnType<typeof vi.fn>).mockResolvedValue(['Mana Crypt']);
    (api.lookupCard as ReturnType<typeof vi.fn>).mockResolvedValue({
      name: 'Mana Crypt', scryfall_id: 'mc-1', image_uri: null,
      back_image_uri: null, color_identity: '', type_line: 'Artifact', mana_cost: '{0}',
    });

    render(<CardAddDialog open={true} onClose={onClose} onAdd={onAdd} />);
    await user.type(screen.getByLabelText('Card Name'), 'Ma');

    await waitFor(() => expect(screen.getByText('Mana Crypt')).toBeInTheDocument());
    await user.click(screen.getByText('Mana Crypt'));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});
