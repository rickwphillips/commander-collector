/**
 * Regression tests for ScanDeckPage after decomposition into sub-components.
 *
 * Verifies:
 *  1. Page renders in new-deck mode (step 0 capture UI)
 *  2. Page renders in edit mode (loads existing deck, shows step 1)
 *  3. Step 1 → Step 2 transition via "Continue to Save"
 *  4. Card state callbacks wire correctly (add, remove, edit, quantity, commander, proxy)
 *  5. Discard dialog opens and resets state
 *  6. Save form renders correct mode toggles
 *  7. Draft restore on mount (new deck mode)
 *  8. Edit mode skips step 0 and shows cards directly
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock('@/components/PageContainer', () => ({
  PageContainer: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="page-container" data-title={title}>{children}</div>
  ),
}));

vi.mock('@/components/ManaSymbol', () => ({
  ManaSymbol: ({ color, active, onClick }: { color: string; active?: boolean; onClick?: () => void }) => (
    <button data-testid={`mana-${color}`} data-active={active} onClick={onClick}>{color}</button>
  ),
}));

vi.mock('@/components/DeckBreakdown', () => ({
  DeckBreakdown: ({ cards }: { cards: unknown[] }) => (
    <div data-testid="deck-breakdown">{cards.length} cards</div>
  ),
}));

// Mock the extracted sub-components to verify they receive correct props
let capturedCardReviewGridProps: Record<string, unknown> = {};
vi.mock('@/decks/scan/components/CardReviewGrid', () => ({
  CardReviewGrid: (props: Record<string, unknown>) => {
    capturedCardReviewGridProps = props;
    return <div data-testid="card-review-grid" />;
  },
}));

let capturedEditDialogProps: Record<string, unknown> = {};
vi.mock('@/decks/scan/components/CardEditDialog', () => ({
  CardEditDialog: (props: Record<string, unknown>) => {
    capturedEditDialogProps = props;
    return <div data-testid="card-edit-dialog" />;
  },
}));

let capturedAddDialogProps: Record<string, unknown> = {};
vi.mock('@/decks/scan/components/CardAddDialog', () => ({
  CardAddDialog: (props: Record<string, unknown>) => {
    capturedAddDialogProps = props;
    return <div data-testid="card-add-dialog" />;
  },
}));

let capturedVersionPickerProps: Record<string, unknown> = {};
vi.mock('@/decks/scan/components/VersionPickerDialog', () => ({
  VersionPickerDialog: (props: Record<string, unknown>) => {
    capturedVersionPickerProps = props;
    return <div data-testid="version-picker" />;
  },
}));

let capturedImageEditorProps: Record<string, unknown> = {};
vi.mock('@/decks/scan/components/ImageEditorDialog', () => ({
  ImageEditorDialog: (props: Record<string, unknown>) => {
    capturedImageEditorProps = props;
    return <div data-testid="image-editor" />;
  },
}));

let capturedProgressProps: Record<string, unknown> = {};
vi.mock('@/decks/scan/components/ScanProgressDialog', () => ({
  ScanProgressDialog: (props: Record<string, unknown>) => {
    capturedProgressProps = props;
    return <div data-testid="scan-progress" />;
  },
}));

let capturedResultsProps: Record<string, unknown> = {};
vi.mock('@/decks/scan/components/ScanResultsDialog', () => ({
  ScanResultsDialog: (props: Record<string, unknown>) => {
    capturedResultsProps = props;
    return <div data-testid="scan-results" />;
  },
}));

vi.mock('@/lib/api', () => ({
  api: {
    getScanDraft: vi.fn().mockResolvedValue({ state: null }),
    saveScanDraft: vi.fn().mockResolvedValue({}),
    clearScanDraft: vi.fn().mockResolvedValue({}),
    getDeck: vi.fn(),
    getDeckCards: vi.fn(),
    getPlayers: vi.fn().mockResolvedValue([]),
    getDecks: vi.fn().mockResolvedValue([]),
    scanDeck: vi.fn(),
    bulkLookupCards: vi.fn(),
    lookupCard: vi.fn(),
    findCardCrop: vi.fn(),
    saveDeckCards: vi.fn(),
    createDeck: vi.fn(),
    updateDeck: vi.fn(),
    createList: vi.fn(),
    getCardPrints: vi.fn(),
    getCardImage: vi.fn(),
  },
  API_BASE: '',
  ASSET_BASE: '',
}));

vi.mock('@/lib/scryfall', () => ({
  scryfallAutocomplete: vi.fn().mockResolvedValue([]),
}));

// ─── Imports (after mocks) ──────────────────────────────────────────────────

import { api } from '@/lib/api';
import type { ScannedCard } from '@/lib/types';
import ScanDeckPage from '@/decks/scan/page';

// ─── Helpers ────────────────────────────────────────────────────────────────

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

// ─── Setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  capturedCardReviewGridProps = {};
  capturedEditDialogProps = {};
  capturedAddDialogProps = {};
  capturedVersionPickerProps = {};
  capturedImageEditorProps = {};
  capturedProgressProps = {};
  capturedResultsProps = {};
  // Reset search params to new-deck mode
  mockSearchParams.delete('edit');
  (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({ state: null });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('ScanDeckPage — new deck mode', () => {
  it('renders step 0 capture UI on mount', async () => {
    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(screen.getByText('Photograph your deck layout')).toBeInTheDocument();
    });
  });

  it('shows stepper with 3 steps', async () => {
    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(screen.getByText('Capture Photo')).toBeInTheDocument();
      expect(screen.getByText('Review Cards')).toBeInTheDocument();
      expect(screen.getByText('Save Deck')).toBeInTheDocument();
    });
  });

  it('shows Upload Image button', async () => {
    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(screen.getByText('Upload Image')).toBeInTheDocument();
    });
  });

  it('restores draft state on mount if available', async () => {
    const draftCards = [makeCard({ id: 'draft-1', card_name: 'Sol Ring' })];
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: draftCards, deckName: 'Test Deck', playerId: 5, colors: ['W', 'U'] },
    });

    render(<ScanDeckPage />);

    // Should restore to step 1 (review), showing card review grid
    await waitFor(() => {
      expect(screen.getByTestId('card-review-grid')).toBeInTheDocument();
    });
  });
});

describe('ScanDeckPage — edit mode', () => {
  beforeEach(() => {
    mockSearchParams.set('edit', '42');
    (api.getDeck as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 42, name: 'Test Deck', commander: 'Atraxa', colors: 'WUG', player_id: 1,
    });
    (api.getDeckCards as ReturnType<typeof vi.fn>).mockResolvedValue([
      { card_name: 'Sol Ring', scryfall_id: 'sol-1', quantity: 1, is_commander: false, is_proxy: false },
      { card_name: 'Command Tower', scryfall_id: 'ct-1', quantity: 1, is_commander: false, is_proxy: false },
    ]);
  });

  it('loads existing deck and shows step 1 directly', async () => {
    render(<ScanDeckPage />);
    // Should show loading first, then card review
    await waitFor(() => {
      expect(screen.getByTestId('card-review-grid')).toBeInTheDocument();
    });
  });

  it('does not show stepper in edit mode', async () => {
    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(screen.getByTestId('card-review-grid')).toBeInTheDocument();
    });
    expect(screen.queryByText('Capture Photo')).not.toBeInTheDocument();
  });

  it('sets page title to Edit Cards', async () => {
    render(<ScanDeckPage />);
    await waitFor(() => {
      const container = screen.getByTestId('page-container');
      expect(container.getAttribute('data-title')).toBe('Edit Cards');
    });
  });

  it('does not call getScanDraft in edit mode', async () => {
    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(screen.getByTestId('card-review-grid')).toBeInTheDocument();
    });
    expect(api.getScanDraft).not.toHaveBeenCalled();
  });
});

describe('ScanDeckPage — component wiring', () => {
  it('passes cards to CardReviewGrid', async () => {
    const draftCards = [makeCard({ id: 'c1' }), makeCard({ id: 'c2', card_name: 'Counterspell' })];
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: draftCards, deckName: '', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(capturedCardReviewGridProps.cards).toEqual(draftCards);
    });
  });

  it('wires onRemove callback to remove card from state', async () => {
    const draftCards = [
      makeCard({ id: 'keep' }),
      makeCard({ id: 'remove', card_name: 'Bad Card' }),
    ];
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: draftCards, deckName: '', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => expect(capturedCardReviewGridProps.onRemove).toBeDefined());

    // Trigger remove callback
    act(() => {
      (capturedCardReviewGridProps.onRemove as (id: string) => void)('remove');
    });

    // Cards should now only contain 'keep'
    await waitFor(() => {
      const cards = capturedCardReviewGridProps.cards as ScannedCard[];
      expect(cards).toHaveLength(1);
      expect(cards[0].id).toBe('keep');
    });
  });

  it('wires onChangeQuantity callback', async () => {
    const draftCards = [makeCard({ id: 'q1', quantity: 2 })];
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: draftCards, deckName: '', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => expect(capturedCardReviewGridProps.onChangeQuantity).toBeDefined());

    act(() => {
      (capturedCardReviewGridProps.onChangeQuantity as (id: string, d: number) => void)('q1', 1);
    });

    await waitFor(() => {
      const cards = capturedCardReviewGridProps.cards as ScannedCard[];
      expect(cards[0].quantity).toBe(3);
    });
  });

  it('wires onToggleCommander callback', async () => {
    const draftCards = [makeCard({ id: 'cmd', is_commander: false })];
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: draftCards, deckName: '', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => expect(capturedCardReviewGridProps.onToggleCommander).toBeDefined());

    act(() => {
      (capturedCardReviewGridProps.onToggleCommander as (id: string) => void)('cmd');
    });

    await waitFor(() => {
      const cards = capturedCardReviewGridProps.cards as ScannedCard[];
      expect(cards[0].is_commander).toBe(true);
    });
  });

  it('wires onToggleProxy callback', async () => {
    const draftCards = [makeCard({ id: 'prx', is_proxy: false })];
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: draftCards, deckName: '', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => expect(capturedCardReviewGridProps.onToggleProxy).toBeDefined());

    act(() => {
      (capturedCardReviewGridProps.onToggleProxy as (id: string) => void)('prx');
    });

    await waitFor(() => {
      const cards = capturedCardReviewGridProps.cards as ScannedCard[];
      expect(cards[0].is_proxy).toBe(true);
    });
  });

  it('wires onOpenEdit to set editCard in CardEditDialog', async () => {
    const card = makeCard({ id: 'ed1' });
    const draftCards = [card];
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: draftCards, deckName: '', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => expect(capturedCardReviewGridProps.onOpenEdit).toBeDefined());

    act(() => {
      (capturedCardReviewGridProps.onOpenEdit as (c: ScannedCard) => void)(card);
    });

    await waitFor(() => {
      expect(capturedEditDialogProps.card).toEqual(card);
    });
  });

  it('wires onOpenVersionPicker to set versionCard', async () => {
    const card = makeCard({ id: 'ver1' });
    const draftCards = [card];
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: draftCards, deckName: '', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => expect(capturedCardReviewGridProps.onOpenVersionPicker).toBeDefined());

    act(() => {
      (capturedCardReviewGridProps.onOpenVersionPicker as (c: ScannedCard) => void)(card);
    });

    await waitFor(() => {
      expect(capturedVersionPickerProps.card).toEqual(card);
    });
  });

  it('wires CardAddDialog onAdd to append card to state', async () => {
    const draftCards = [makeCard({ id: 'existing' })];
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: draftCards, deckName: '', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => expect(capturedAddDialogProps.onAdd).toBeDefined());

    const newCard = makeCard({ id: 'new-card', card_name: 'New Card' });
    act(() => {
      (capturedAddDialogProps.onAdd as (c: ScannedCard) => void)(newCard);
    });

    await waitFor(() => {
      const cards = capturedCardReviewGridProps.cards as ScannedCard[];
      expect(cards).toHaveLength(2);
      expect(cards[1].card_name).toBe('New Card');
    });
  });
});

describe('ScanDeckPage — step transitions', () => {
  it('transitions from step 1 to step 2 when Continue is clicked', async () => {
    const user = userEvent.setup();
    const draftCards = [makeCard({ id: 'c1', is_commander: true })];
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: draftCards, deckName: '', playerId: '', colors: [] },
    });
    (api.getPlayers as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: 1, name: 'Alice' }]);
    (api.getDecks as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(screen.getByText('Continue to Save')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Continue to Save'));

    await waitFor(() => {
      expect(screen.getByText('Save Cards')).toBeInTheDocument();
    });
  });

  it('shows discard dialog and resets on confirm', async () => {
    const user = userEvent.setup();
    const draftCards = [makeCard({ id: 'c1' })];
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: draftCards, deckName: 'My Deck', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(screen.getByText('Discard Deck')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Discard Deck'));

    await waitFor(() => {
      expect(screen.getByText(/will be lost/)).toBeInTheDocument();
    });

    await user.click(screen.getByText('Discard'));

    // Should reset to step 0
    await waitFor(() => {
      expect(screen.getByText('Photograph your deck layout')).toBeInTheDocument();
    });

    expect(api.clearScanDraft).toHaveBeenCalled();
  });
});

describe('ScanDeckPage — sub-component initial props', () => {
  it('passes open=false to CardAddDialog initially', async () => {
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: [makeCard()], deckName: '', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(capturedAddDialogProps.open).toBe(false);
    });
  });

  it('passes card=null to CardEditDialog initially', async () => {
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: [makeCard()], deckName: '', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(capturedEditDialogProps.card).toBeNull();
    });
  });

  it('passes card=null to VersionPickerDialog initially', async () => {
    (api.getScanDraft as ReturnType<typeof vi.fn>).mockResolvedValue({
      state: { step: 1, cards: [makeCard()], deckName: '', playerId: '', colors: [] },
    });

    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(capturedVersionPickerProps.card).toBeNull();
    });
  });

  it('passes scanning=false to ScanProgressDialog initially', async () => {
    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(capturedProgressProps.open).toBe(false);
    });
  });

  it('passes results=null to ScanResultsDialog initially', async () => {
    render(<ScanDeckPage />);
    await waitFor(() => {
      expect(capturedResultsProps.results).toBeNull();
    });
  });
});
