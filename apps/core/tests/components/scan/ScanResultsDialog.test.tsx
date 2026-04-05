import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScanResultsDialog } from '@/decks/scan/components/ScanResultsDialog';
import type { ScannedCard } from '@/lib/types';

function makeCard(name: string, notFound = false): ScannedCard {
  return {
    id: `id-${name}`,
    card_name: name,
    scryfall_id: notFound ? null : 'abc',
    image_uri: notFound ? null : 'https://example.com/img.jpg',
    back_image_uri: null,
    color_identity: 'R',
    type_line: 'Instant',
    mana_cost: '{R}',
    quantity: 1,
    is_commander: false,
    is_proxy: false,
    notFound,
  };
}

describe('ScanResultsDialog', () => {
  it('does not render when results is null', () => {
    render(<ScanResultsDialog results={null} cropMap={{}} onClose={() => {}} />);
    expect(screen.queryByText('Scan Results')).not.toBeInTheDocument();
  });

  it('shows empty message when results is empty array', () => {
    render(<ScanResultsDialog results={[]} cropMap={{}} onClose={() => {}} />);
    expect(screen.getByText('No new cards were identified.')).toBeInTheDocument();
  });

  it('shows card count and names', () => {
    const results = [makeCard('Sol Ring'), makeCard('Mana Crypt')];
    render(<ScanResultsDialog results={results} cropMap={{}} onClose={() => {}} />);
    expect(screen.getByText(/2 cards added/)).toBeInTheDocument();
    expect(screen.getByText('Sol Ring')).toBeInTheDocument();
    expect(screen.getByText('Mana Crypt')).toBeInTheDocument();
  });

  it('shows singular "card" for single result', () => {
    render(<ScanResultsDialog results={[makeCard('Sol Ring')]} cropMap={{}} onClose={() => {}} />);
    expect(screen.getByText(/1 card added/)).toBeInTheDocument();
  });

  it('shows not-found indicator for missing cards', () => {
    render(
      <ScanResultsDialog results={[makeCard('Mystery', true)]} cropMap={{}} onClose={() => {}} />
    );
    expect(screen.getByText('Not found on Scryfall')).toBeInTheDocument();
  });

  it('shows crop image when available for not-found cards', () => {
    const card = makeCard('Mystery', true);
    render(
      <ScanResultsDialog
        results={[card]}
        cropMap={{ [card.id]: 'data:image/jpeg;base64,crop' }}
        onClose={() => {}}
      />
    );
    const img = screen.getByAltText('Mystery');
    expect(img).toHaveAttribute('src', 'data:image/jpeg;base64,crop');
  });

  it('calls onClose when Done is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ScanResultsDialog results={[makeCard('Sol Ring')]} cropMap={{}} onClose={onClose} />);
    await user.click(screen.getByText('Done'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
