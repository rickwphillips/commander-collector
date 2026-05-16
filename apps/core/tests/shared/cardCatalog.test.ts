import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { isKnownCardName, loadCardCatalog, catalogSize } from '@commander/shared/lib/cardCatalog';

const NAMES = ["teferi's protection", "sol ring", "braids, cabal minion", "lightning bolt"];

function mockFetch(names: string[]) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(names),
  }));
}

describe('cardCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module-level catalog state between tests
    vi.resetModules();
  });
  afterEach(() => { vi.restoreAllMocks(); });

  it('returns false before catalog is loaded', () => {
    expect(isKnownCardName('Sol Ring')).toBe(false);
  });

  it('returns false when catalog fails to load', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await loadCardCatalog('/card-names.json');
    expect(isKnownCardName('Sol Ring')).toBe(false);
  });

  it('returns true for an exact match after loading', async () => {
    mockFetch(NAMES);
    await loadCardCatalog('/card-names.json');
    expect(isKnownCardName('Sol Ring')).toBe(true);
  });

  it('is case-insensitive', async () => {
    mockFetch(NAMES);
    await loadCardCatalog('/card-names.json');
    expect(isKnownCardName('SOL RING')).toBe(true);
    expect(isKnownCardName('sol ring')).toBe(true);
  });

  it('trims whitespace before lookup', async () => {
    mockFetch(NAMES);
    await loadCardCatalog('/card-names.json');
    expect(isKnownCardName('  Sol Ring  ')).toBe(true);
  });

  it('returns false for non-card text', async () => {
    mockFetch(NAMES);
    await loadCardCatalog('/card-names.json');
    expect(isKnownCardName('Card advantage')).toBe(false);
    expect(isKnownCardName('Proliferate is multiplicative')).toBe(false);
  });

  // Regression: LLM output uses curly apostrophes (U+2019) but catalog uses straight (U+0027)
  it('matches card names with curly right apostrophe (U+2019)', async () => {
    mockFetch(NAMES);
    await loadCardCatalog('/card-names.json');
    expect(isKnownCardName('Teferi’s Protection')).toBe(true);
  });

  it('matches card names with modifier letter apostrophe (U+02BC)', async () => {
    mockFetch(NAMES);
    await loadCardCatalog('/card-names.json');
    expect(isKnownCardName('Teferiʼs Protection')).toBe(true);
  });

  it('still matches card names with straight apostrophe (U+0027)', async () => {
    mockFetch(NAMES);
    await loadCardCatalog('/card-names.json');
    expect(isKnownCardName("Teferi's Protection")).toBe(true);
  });

  it('reports catalogSize after load', async () => {
    mockFetch(NAMES);
    await loadCardCatalog('/card-names.json');
    expect(catalogSize()).toBe(NAMES.length);
  });
});
