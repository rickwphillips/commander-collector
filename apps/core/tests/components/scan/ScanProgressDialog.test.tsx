import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScanProgressDialog } from '@/decks/scan/components/ScanProgressDialog';
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

describe('ScanProgressDialog', () => {
  it('does not render when closed', () => {
    render(
      <ScanProgressDialog open={false} progress={null} newCards={[]} previewUrl={null} />
    );
    expect(screen.queryByText(/Tile/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Preparing/)).not.toBeInTheDocument();
  });

  it('shows preparing message when no progress', () => {
    render(
      <ScanProgressDialog open={true} progress={null} newCards={[]} previewUrl={null} />
    );
    expect(screen.getByText(/Preparing image/)).toBeInTheDocument();
  });

  it('shows tile progress with quip', () => {
    render(
      <ScanProgressDialog
        open={true}
        progress={{ current: 3, total: 10 }}
        newCards={[]}
        previewUrl={null}
      />
    );
    expect(screen.getByText(/Tile 3 of 10/)).toBeInTheDocument();
  });

  it('shows card names when results arrive', () => {
    const cards = [makeCard('Lightning Bolt'), makeCard('Counterspell')];
    render(
      <ScanProgressDialog
        open={true}
        progress={{ current: 5, total: 10 }}
        newCards={cards}
        previewUrl={null}
      />
    );
    expect(screen.getByText('Lightning Bolt')).toBeInTheDocument();
    expect(screen.getByText('Counterspell')).toBeInTheDocument();
  });

  it('shows ? indicator for not-found cards', () => {
    const cards = [makeCard('Unknown Card', true)];
    render(
      <ScanProgressDialog
        open={true}
        progress={{ current: 5, total: 10 }}
        newCards={cards}
        previewUrl={null}
      />
    );
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('shows preview image when no results yet', () => {
    render(
      <ScanProgressDialog
        open={true}
        progress={{ current: 1, total: 10 }}
        newCards={[]}
        previewUrl="https://example.com/preview.jpg"
      />
    );
    const img = screen.getByAltText('Deck photo');
    expect(img).toHaveAttribute('src', 'https://example.com/preview.jpg');
  });
});
