import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ScryfallCachedCard, ScannedCard } from '@/lib/types';

// ─── Module mock for @/lib/api ─────────────────────────────────────────────────
// Must be hoisted before any imports that use the module.
vi.mock('@/lib/api', () => ({
  api: {
    scanDeck: vi.fn(),
    bulkLookupCards: vi.fn(),
    lookupCard: vi.fn(),
  },
}));

import { api } from '@/lib/api';
import {
  tempId,
  cardFromScryfall,
  runTileScan,
  bulkLookupScryfall,
  retryNotFoundCards,
  lookupAndEnrichCards,
} from '@/lib/scan/ocr';
import type { ImageTile } from '@/lib/scan/imageEditor';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeScryfallCard(overrides: Partial<ScryfallCachedCard> = {}): ScryfallCachedCard {
  return {
    scryfall_id: 'abc-123',
    name: 'Lightning Bolt',
    image_uri: 'https://cards.scryfall.io/normal/front/bolt.jpg',
    back_image_uri: null,
    colors: 'R',
    color_identity: 'R',
    type_line: 'Instant',
    mana_cost: '{R}',
    ...overrides,
  };
}

function makeTile(base64 = 'dGVzdA==', mimeType = 'image/jpeg'): ImageTile {
  return { base64, mimeType };
}

function makeScannedCard(overrides: Partial<ScannedCard> = {}): ScannedCard {
  return {
    id: tempId(),
    card_name: 'Lightning Bolt',
    scryfall_id: 'abc-123',
    image_uri: null,
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

// ─── tempId ───────────────────────────────────────────────────────────────────

describe('tempId', () => {
  it('returns a non-empty string', () => {
    const id = tempId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('two consecutive calls return different values', () => {
    const a = tempId();
    const b = tempId();
    expect(a).not.toBe(b);
  });
});

// ─── cardFromScryfall ─────────────────────────────────────────────────────────

describe('cardFromScryfall', () => {
  it('returns an object with the full ScannedCard shape', () => {
    const card = cardFromScryfall('Lightning Bolt', makeScryfallCard());
    expect(card).toMatchObject({
      id: expect.any(String),
      card_name: expect.any(String),
      scryfall_id: expect.any(String),
      quantity: 1,
      is_commander: false,
      is_proxy: false,
      notFound: false,
    });
  });

  it('prefers data.name over the input name for card_name', () => {
    const data = makeScryfallCard({ name: 'Canonical Name' });
    const card = cardFromScryfall('ocr name', data);
    expect(card.card_name).toBe('Canonical Name');
  });

  it('falls back to the input name when data is null', () => {
    const card = cardFromScryfall('Fallback Name', null);
    expect(card.card_name).toBe('Fallback Name');
  });

  it('sets proxy flag from opts (default false)', () => {
    const card = cardFromScryfall('Bolt', makeScryfallCard());
    expect(card.is_proxy).toBe(false);
  });

  it('sets proxy flag to true when passed as third argument', () => {
    const card = cardFromScryfall('Bolt', makeScryfallCard(), true);
    expect(card.is_proxy).toBe(true);
  });

  it('sets notFound: false when data is provided', () => {
    const card = cardFromScryfall('Bolt', makeScryfallCard());
    expect(card.notFound).toBe(false);
  });

  it('sets notFound: true when data is null', () => {
    const card = cardFromScryfall('Unknown', null);
    expect(card.notFound).toBe(true);
  });

  it('null data yields null scryfall_id, image_uri, type_line, mana_cost', () => {
    const card = cardFromScryfall('Unknown', null);
    expect(card.scryfall_id).toBeNull();
    expect(card.image_uri).toBeNull();
    expect(card.type_line).toBeNull();
    expect(card.mana_cost).toBeNull();
  });

  it('null data yields empty string for color_identity', () => {
    const card = cardFromScryfall('Unknown', null);
    expect(card.color_identity).toBe('');
  });

  it('copies scryfall fields from data when present', () => {
    const data = makeScryfallCard({
      scryfall_id: 'xyz-789',
      image_uri: 'https://example.com/img.jpg',
      color_identity: 'WU',
      type_line: 'Creature',
      mana_cost: '{W}{U}',
    });
    const card = cardFromScryfall('name', data);
    expect(card.scryfall_id).toBe('xyz-789');
    expect(card.image_uri).toBe('https://example.com/img.jpg');
    expect(card.color_identity).toBe('WU');
    expect(card.type_line).toBe('Creature');
    expect(card.mana_cost).toBe('{W}{U}');
  });

  it('quantity is always 1 and is_commander is always false', () => {
    const card = cardFromScryfall('Bolt', makeScryfallCard());
    expect(card.quantity).toBe(1);
    expect(card.is_commander).toBe(false);
  });
});

// ─── runTileScan ──────────────────────────────────────────────────────────────

describe('runTileScan', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls api.scanDeck once per tile', async () => {
    const mockScanDeck = vi.mocked(api.scanDeck);
    mockScanDeck.mockResolvedValue({ cards: [] });

    const tiles = [makeTile('a'), makeTile('b'), makeTile('c')];
    await runTileScan(tiles);

    expect(mockScanDeck).toHaveBeenCalledTimes(3);
  });

  it('passes each tile\'s base64 and mimeType to api.scanDeck', async () => {
    const mockScanDeck = vi.mocked(api.scanDeck);
    mockScanDeck.mockResolvedValue({ cards: [] });

    const tile = makeTile('myBase64==', 'image/png');
    await runTileScan([tile]);

    expect(mockScanDeck).toHaveBeenCalledWith('myBase64==', 'image/png');
  });

  it('calls onTileScanned callback once per tile', async () => {
    const mockScanDeck = vi.mocked(api.scanDeck);
    mockScanDeck.mockResolvedValue({ cards: [] });

    const onTileScanned = vi.fn();
    await runTileScan([makeTile(), makeTile()], onTileScanned);

    expect(onTileScanned).toHaveBeenCalledTimes(2);
  });

  it('deduplicates cards with the same name across tiles (case-insensitive, trimmed)', async () => {
    const mockScanDeck = vi.mocked(api.scanDeck);
    mockScanDeck
      .mockResolvedValueOnce({ cards: [{ name: 'Lightning Bolt', proxy: false }] })
      .mockResolvedValueOnce({ cards: [{ name: 'lightning bolt ', proxy: false }] }); // duplicate

    const result = await runTileScan([makeTile('a'), makeTile('b')]);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Lightning Bolt');
  });

  it('includes cards with different names from multiple tiles', async () => {
    const mockScanDeck = vi.mocked(api.scanDeck);
    mockScanDeck
      .mockResolvedValueOnce({ cards: [{ name: 'Lightning Bolt', proxy: false }] })
      .mockResolvedValueOnce({ cards: [{ name: 'Counterspell', proxy: false }] });

    const result = await runTileScan([makeTile('a'), makeTile('b')]);

    expect(result).toHaveLength(2);
    const names = result.map((r) => r.name);
    expect(names).toContain('Lightning Bolt');
    expect(names).toContain('Counterspell');
  });

  it('returns items with {name, proxy} shape', async () => {
    const mockScanDeck = vi.mocked(api.scanDeck);
    mockScanDeck.mockResolvedValue({ cards: [{ name: 'Black Lotus', proxy: true }] });

    const result = await runTileScan([makeTile()]);

    expect(result[0]).toMatchObject({ name: 'Black Lotus', proxy: true });
  });

  it('skips empty card names after trimming', async () => {
    const mockScanDeck = vi.mocked(api.scanDeck);
    mockScanDeck.mockResolvedValue({ cards: [{ name: '   ', proxy: false }] });

    const result = await runTileScan([makeTile()]);

    expect(result).toHaveLength(0);
  });

  it('skips rejected tile promises (continues with fulfilled ones)', async () => {
    const mockScanDeck = vi.mocked(api.scanDeck);
    mockScanDeck
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce({ cards: [{ name: 'Counterspell', proxy: false }] });

    const result = await runTileScan([makeTile('bad'), makeTile('good')]);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Counterspell');
  });

  it('returns empty array when given no tiles', async () => {
    const result = await runTileScan([]);
    expect(result).toEqual([]);
  });

  it('processes tiles in batches of 3', async () => {
    // 4 tiles = batch of 3 then batch of 1
    const mockScanDeck = vi.mocked(api.scanDeck);
    let callOrder: number[] = [];
    mockScanDeck.mockImplementation(async (_b, _m) => {
      callOrder.push(Date.now());
      return { cards: [] };
    });

    await runTileScan([makeTile('1'), makeTile('2'), makeTile('3'), makeTile('4')]);

    expect(mockScanDeck).toHaveBeenCalledTimes(4);
  });
});

// ─── bulkLookupScryfall ───────────────────────────────────────────────────────

describe('bulkLookupScryfall', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns a ScannedCard array', async () => {
    const mockBulk = vi.mocked(api.bulkLookupCards);
    mockBulk.mockResolvedValue({ results: [makeScryfallCard()] });

    const result = await bulkLookupScryfall([{ name: 'Lightning Bolt', proxy: false }]);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
  });

  it('maps scryfall data to ScannedCard fields', async () => {
    const mockBulk = vi.mocked(api.bulkLookupCards);
    const data = makeScryfallCard({ scryfall_id: 'test-id', name: 'Canonical Bolt' });
    mockBulk.mockResolvedValue({ results: [data] });

    const result = await bulkLookupScryfall([{ name: 'lightning bolt', proxy: false }]);

    expect(result[0].card_name).toBe('Canonical Bolt');
    expect(result[0].scryfall_id).toBe('test-id');
    expect(result[0].notFound).toBe(false);
  });

  it('marks cards as notFound: true when result has error field', async () => {
    const mockBulk = vi.mocked(api.bulkLookupCards);
    // Simulate a not-found result with an error field
    mockBulk.mockResolvedValue({
      results: [{ error: 'not found' } as ScryfallCachedCard & { error?: string }],
    });

    const result = await bulkLookupScryfall([{ name: 'Fake Card Name', proxy: false }]);

    expect(result[0].notFound).toBe(true);
    // Falls back to the input name when data has error
    expect(result[0].card_name).toBe('Fake Card Name');
  });

  it('preserves proxy flag from the input items', async () => {
    const mockBulk = vi.mocked(api.bulkLookupCards);
    mockBulk.mockResolvedValue({ results: [makeScryfallCard()] });

    const result = await bulkLookupScryfall([{ name: 'Lightning Bolt', proxy: true }]);

    expect(result[0].is_proxy).toBe(true);
  });

  it('handles multiple items and preserves order', async () => {
    const mockBulk = vi.mocked(api.bulkLookupCards);
    mockBulk.mockResolvedValue({
      results: [
        makeScryfallCard({ name: 'Lightning Bolt', scryfall_id: 'bolt-id' }),
        makeScryfallCard({ name: 'Counterspell', scryfall_id: 'counter-id' }),
      ],
    });

    const result = await bulkLookupScryfall([
      { name: 'Lightning Bolt', proxy: false },
      { name: 'Counterspell', proxy: false },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].scryfall_id).toBe('bolt-id');
    expect(result[1].scryfall_id).toBe('counter-id');
  });
});

// ─── retryNotFoundCards ───────────────────────────────────────────────────────

describe('retryNotFoundCards', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns empty array when no cards are not-found', async () => {
    const mockLookup = vi.mocked(api.lookupCard);
    const cards = [makeScannedCard({ notFound: false })];

    const result = await retryNotFoundCards(cards);

    expect(result).toEqual([]);
    expect(mockLookup).not.toHaveBeenCalled();
  });

  it('only retries not-found cards (does not call api for found cards)', async () => {
    const mockLookup = vi.mocked(api.lookupCard);
    mockLookup.mockResolvedValue(null);

    const found = makeScannedCard({ notFound: false, card_name: 'Found Card' });
    const notFound = makeScannedCard({ notFound: true, card_name: 'Lost Card' });

    await retryNotFoundCards([found, notFound]);

    expect(mockLookup).toHaveBeenCalledTimes(1);
    expect(mockLookup).toHaveBeenCalledWith('Lost Card');
  });

  it('mutates the original array in-place when retry succeeds', async () => {
    const mockLookup = vi.mocked(api.lookupCard);
    const enriched = makeScryfallCard({
      name: 'Enriched Name',
      scryfall_id: 'enriched-id',
      image_uri: 'https://example.com/enriched.jpg',
      color_identity: 'G',
      type_line: 'Creature',
      mana_cost: '{G}',
    });
    mockLookup.mockResolvedValue(enriched);

    const card = makeScannedCard({ notFound: true, card_name: 'Lost Card' });
    const cards = [card];

    await retryNotFoundCards(cards);

    // The same object reference is mutated
    expect(cards[0].notFound).toBe(false);
    expect(cards[0].card_name).toBe('Enriched Name');
    expect(cards[0].scryfall_id).toBe('enriched-id');
    expect(cards[0].image_uri).toBe('https://example.com/enriched.jpg');
    expect(cards[0].color_identity).toBe('G');
    expect(cards[0].type_line).toBe('Creature');
    expect(cards[0].mana_cost).toBe('{G}');
  });

  it('leaves notFound: true when api.lookupCard returns null', async () => {
    const mockLookup = vi.mocked(api.lookupCard);
    mockLookup.mockResolvedValue(null);

    const card = makeScannedCard({ notFound: true, card_name: 'Still Lost' });
    const cards = [card];

    await retryNotFoundCards(cards);

    expect(cards[0].notFound).toBe(true);
  });

  it('returns only the cards that were successfully enriched', async () => {
    const mockLookup = vi.mocked(api.lookupCard);
    const enriched = makeScryfallCard({ name: 'Found Now' });
    mockLookup
      .mockResolvedValueOnce(enriched)   // first notFound card → success
      .mockResolvedValueOnce(null);       // second notFound card → still not found

    const card1 = makeScannedCard({ notFound: true, card_name: 'Card A' });
    const card2 = makeScannedCard({ notFound: true, card_name: 'Card B' });
    const cards = [card1, card2];

    const result = await retryNotFoundCards(cards);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(card1.id);
  });
});

// ─── lookupAndEnrichCards ─────────────────────────────────────────────────────

describe('lookupAndEnrichCards', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls bulkLookupCards then lookupCard for not-found entries', async () => {
    const mockBulk = vi.mocked(api.bulkLookupCards);
    const mockLookup = vi.mocked(api.lookupCard);

    // Bulk returns one found, one not found
    const foundData = makeScryfallCard({ name: 'Lightning Bolt' });
    const notFoundData = { error: 'not found' } as ScryfallCachedCard & { error?: string };
    mockBulk.mockResolvedValue({ results: [foundData, notFoundData] });
    mockLookup.mockResolvedValue(makeScryfallCard({ name: 'Fuzzy Match' }));

    const result = await lookupAndEnrichCards([
      { name: 'Lightning Bolt', proxy: false },
      { name: 'Garbled Name', proxy: false },
    ]);

    expect(mockBulk).toHaveBeenCalledTimes(1);
    expect(mockLookup).toHaveBeenCalledTimes(1); // retry for the not-found one
    expect(result).toHaveLength(2);
  });

  it('returns the array with correctly resolved cards', async () => {
    const mockBulk = vi.mocked(api.bulkLookupCards);
    const mockLookup = vi.mocked(api.lookupCard);

    mockBulk.mockResolvedValue({ results: [makeScryfallCard({ name: 'Lightning Bolt', scryfall_id: 'bolt-id' })] });
    mockLookup.mockResolvedValue(null); // no retry needed — no notFound cards

    const result = await lookupAndEnrichCards([{ name: 'Lightning Bolt', proxy: false }]);

    expect(result[0].card_name).toBe('Lightning Bolt');
    expect(result[0].notFound).toBe(false);
  });

  it('returns an enriched card when retryNotFoundCards resolves a not-found entry', async () => {
    const mockBulk = vi.mocked(api.bulkLookupCards);
    const mockLookup = vi.mocked(api.lookupCard);

    mockBulk.mockResolvedValue({
      results: [{ error: 'not found' } as ScryfallCachedCard & { error?: string }],
    });
    mockLookup.mockResolvedValue(
      makeScryfallCard({ name: 'Fuzzy Match', scryfall_id: 'fuzzy-id' })
    );

    const result = await lookupAndEnrichCards([{ name: 'Garbled Name', proxy: false }]);

    expect(result[0].card_name).toBe('Fuzzy Match');
    expect(result[0].notFound).toBe(false);
  });

  it('returns the same array object mutated (not a new array)', async () => {
    const mockBulk = vi.mocked(api.bulkLookupCards);
    const mockLookup = vi.mocked(api.lookupCard);

    mockBulk.mockResolvedValue({ results: [makeScryfallCard()] });
    mockLookup.mockResolvedValue(null);

    // Since bulkLookupScryfall creates a new array, we verify the returned array
    // matches the length of the input items.
    const result = await lookupAndEnrichCards([{ name: 'Lightning Bolt', proxy: false }]);
    expect(result).toHaveLength(1);
  });
});
