import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/lib/api', () => ({
  api: {
    getCardPrints: vi.fn(),
    getCardImage: vi.fn(),
  },
  ASSET_BASE: '',
}));

import { api } from '@/lib/api';
import { VersionPickerDialog } from '@/decks/scan/components/VersionPickerDialog';
import type { ScannedCard, CardPrint } from '@/lib/types';

function makeCard(overrides: Partial<ScannedCard> = {}): ScannedCard {
  return {
    id: 'card-1', card_name: 'Lightning Bolt', scryfall_id: 'abc',
    image_uri: 'https://example.com/img.jpg', back_image_uri: null,
    color_identity: 'R', type_line: 'Instant', mana_cost: '{R}',
    quantity: 1, is_commander: false, is_proxy: false, notFound: false,
    ...overrides,
  };
}

function makePrint(overrides: Partial<CardPrint> = {}): CardPrint {
  return {
    scryfall_id: 'print-1', name: 'Lightning Bolt', set_name: 'Alpha',
    set_code: 'LEA', collector_number: '161', image_uri: 'https://example.com/alpha-bolt.jpg',
    released_at: '1993-08-05', image_cached: false,
    ...overrides,
  } as CardPrint;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('VersionPickerDialog', () => {
  it('does not render when card is null', () => {
    render(<VersionPickerDialog card={null} onClose={() => {}} onSelect={() => {}} />);
    expect(screen.queryByText(/Choose Version/)).not.toBeInTheDocument();
  });

  it('shows loading state then prints', async () => {
    const prints = [
      makePrint({ scryfall_id: 'p1', set_name: 'Alpha', collector_number: '161', released_at: '1993-08-05' }),
      makePrint({ scryfall_id: 'p2', set_name: 'Beta', collector_number: '162', released_at: '1993-10-04' }),
    ];
    (api.getCardPrints as ReturnType<typeof vi.fn>).mockResolvedValue({ prints });

    render(<VersionPickerDialog card={makeCard()} onClose={() => {}} onSelect={() => {}} />);

    expect(screen.getByText('Loading printings...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Alpha')).toBeInTheDocument();
      expect(screen.getByText('Beta')).toBeInTheDocument();
    });
  });

  it('shows title with card name', async () => {
    (api.getCardPrints as ReturnType<typeof vi.fn>).mockResolvedValue({ prints: [] });
    render(<VersionPickerDialog card={makeCard()} onClose={() => {}} onSelect={() => {}} />);
    expect(screen.getByText(/Choose Version — Lightning Bolt/)).toBeInTheDocument();
  });

  it('shows empty state when no prints', async () => {
    (api.getCardPrints as ReturnType<typeof vi.fn>).mockResolvedValue({ prints: [] });
    render(<VersionPickerDialog card={makeCard()} onClose={() => {}} onSelect={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('No printings found.')).toBeInTheDocument();
    });
  });

  it('calls onSelect when a print is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const print = makePrint({ scryfall_id: 'p1', set_name: 'Alpha' });
    (api.getCardPrints as ReturnType<typeof vi.fn>).mockResolvedValue({ prints: [print] });
    (api.getCardImage as ReturnType<typeof vi.fn>).mockResolvedValue({});

    render(<VersionPickerDialog card={makeCard()} onClose={() => {}} onSelect={onSelect} />);

    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
    await user.click(screen.getByText('Alpha'));

    expect(onSelect).toHaveBeenCalledWith('card-1', print);
  });

  it('pre-caches image when selecting a print with image_uri', async () => {
    const user = userEvent.setup();
    const print = makePrint({ image_uri: 'https://example.com/img.jpg' });
    (api.getCardPrints as ReturnType<typeof vi.fn>).mockResolvedValue({ prints: [print] });
    (api.getCardImage as ReturnType<typeof vi.fn>).mockResolvedValue({});

    render(<VersionPickerDialog card={makeCard()} onClose={() => {}} onSelect={() => {}} />);

    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
    await user.click(screen.getByText('Alpha'));

    expect(api.getCardImage).toHaveBeenCalledWith('print-1', 'https://example.com/img.jpg');
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    (api.getCardPrints as ReturnType<typeof vi.fn>).mockResolvedValue({ prints: [] });

    render(<VersionPickerDialog card={makeCard()} onClose={onClose} onSelect={() => {}} />);

    await waitFor(() => expect(screen.getByText('Cancel')).toBeInTheDocument());
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('shows collector number and year', async () => {
    const print = makePrint({ collector_number: '42', released_at: '2020-01-01' });
    (api.getCardPrints as ReturnType<typeof vi.fn>).mockResolvedValue({ prints: [print] });

    render(<VersionPickerDialog card={makeCard()} onClose={() => {}} onSelect={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/#42 · 2020/)).toBeInTheDocument();
    });
  });
});
