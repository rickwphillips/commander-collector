import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockBulkLookupCards = vi.fn();

// ManaCost renders mana pip SVGs — stub it to avoid errors in jsdom
vi.mock('@/components/ManaCost', () => ({
  ManaCost: ({ cost }: { cost: string }) => <span data-testid="mana-cost">{cost}</span>,
}));

// jsdom doesn't implement scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

vi.mock('@/lib/api', () => ({
  api: {
    bulkLookupCards: (...args: unknown[]) => mockBulkLookupCards(...args),
  },
}));

// Mock global fetch for Scryfall autocomplete and query endpoints
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// ── Import after mocks ─────────────────────────────────────────────────────────

import { CardLookupField } from '@/components/cards/CardLookupField';
import type { Card } from '@/lib/cards/types';
import type { ScryfallCachedCard } from '@/lib/types';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeCachedCard(name: string, overrides: Partial<ScryfallCachedCard> = {}): ScryfallCachedCard {
  return {
    id: `sf-${name}`,
    name,
    scryfall_id: `sf-${name}`,
    image_uri: `/img/${name}.jpg`,
    type_line: 'Artifact',
    mana_cost: '{1}',
    color_identity: '',
    colors: '',
    ...overrides,
  } as ScryfallCachedCard;
}

function autocompleteResponse(names: string[]) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: names }),
  });
}

function bulkSuccess(names: string[]) {
  mockBulkLookupCards.mockResolvedValue({
    results: names.map((n) => makeCachedCard(n)),
  });
}

describe('CardLookupField', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('renders the search input', () => {
    render(<CardLookupField />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('debounces lookup and shows results after typing', async () => {
    const user = userEvent.setup();
    mockFetch.mockReturnValue(autocompleteResponse(['Sol Ring']));
    bulkSuccess(['Sol Ring']);

    render(<CardLookupField />);
    await user.type(screen.getByRole('combobox'), 'Sol');

    await waitFor(() => {
      expect(screen.getByText('Sol Ring')).toBeInTheDocument();
    });
    expect(mockBulkLookupCards).toHaveBeenCalledWith(['Sol Ring']);
  });

  it('activates query mode when input contains ":"', async () => {
    const user = userEvent.setup();
    // Query mode calls Scryfall /cards/search
    mockFetch.mockReturnValue(
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ data: [{ name: 'Lightning Bolt' }], has_more: false }),
      })
    );
    bulkSuccess(['Lightning Bolt']);

    render(<CardLookupField />);
    await user.type(screen.getByRole('combobox'), 't:instant');

    await waitFor(() => {
      expect(screen.getByText('Query mode')).toBeInTheDocument();
    });
  });

  it('activates query mode when input starts with "!"', async () => {
    const user = userEvent.setup();
    mockFetch.mockReturnValue(
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ data: [{ name: 'Sol Ring' }], has_more: false }),
      })
    );
    bulkSuccess(['Sol Ring']);

    render(<CardLookupField />);
    await user.type(screen.getByRole('combobox'), '!Sol Ring');

    await waitFor(() => {
      expect(screen.getByText('Query mode')).toBeInTheDocument();
    });
  });

  it('calls onAdd with Card[] when Add button is clicked', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    mockFetch.mockReturnValue(autocompleteResponse(['Sol Ring']));
    bulkSuccess(['Sol Ring']);

    render(<CardLookupField onAdd={onAdd} />);
    await user.type(screen.getByRole('combobox'), 'Sol');

    await waitFor(() => {
      expect(screen.getByLabelText('Add Sol Ring')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Add Sol Ring'));
    expect(onAdd).toHaveBeenCalledOnce();
    const [cards] = onAdd.mock.calls[0] as [Card[]];
    expect(cards).toHaveLength(1);
    expect(cards[0].card_name).toBe('Sol Ring');
  });

  it('hides qty stepper in singletonMode', async () => {
    const user = userEvent.setup();
    mockFetch.mockReturnValue(autocompleteResponse(['Sol Ring']));
    bulkSuccess(['Sol Ring']);

    render(<CardLookupField singletonMode />);
    await user.type(screen.getByRole('combobox'), 'Sol');

    await waitFor(() => {
      expect(screen.getByText('Sol Ring')).toBeInTheDocument();
    });

    expect(screen.queryByLabelText('Increase quantity of Sol Ring')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Decrease quantity of Sol Ring')).not.toBeInTheDocument();
  });

  it('shows qty stepper in non-singleton mode', async () => {
    const user = userEvent.setup();
    mockFetch.mockReturnValue(autocompleteResponse(['Sol Ring']));
    bulkSuccess(['Sol Ring']);

    render(<CardLookupField singletonMode={false} />);
    await user.type(screen.getByRole('combobox'), 'Sol');

    await waitFor(() => {
      expect(screen.getByLabelText('Increase quantity of Sol Ring')).toBeInTheDocument();
    });
  });

  it('clears results on Escape', async () => {
    const user = userEvent.setup();
    mockFetch.mockReturnValue(autocompleteResponse(['Sol Ring']));
    bulkSuccess(['Sol Ring']);

    render(<CardLookupField />);
    await user.type(screen.getByRole('combobox'), 'Sol');

    await waitFor(() => {
      expect(screen.getByText('Sol Ring')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Sol Ring')).not.toBeInTheDocument();
  });

  it('shows the (?) help button', () => {
    render(<CardLookupField />);
    expect(screen.getByLabelText('Scryfall search syntax help')).toBeInTheDocument();
  });
});
