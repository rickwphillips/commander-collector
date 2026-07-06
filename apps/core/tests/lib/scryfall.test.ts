import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  scryfallAutocomplete,
  scryfallCommanderSearch,
  scryfallPartnerSearch,
  scryfallGetCard,
  getOracleText,
  getCardArtCrop,
  type ScryfallCard,
} from '@/lib/scryfall';

function okJson(body: unknown) {
  return vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(body) });
}

describe('scryfall search helpers', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('scryfallAutocomplete returns [] for short queries', async () => {
    expect(await scryfallAutocomplete('a')).toEqual([]);
  });

  it('scryfallAutocomplete maps result names', async () => {
    vi.stubGlobal('fetch', okJson({ data: [{ name: 'Sol Ring' }, { name: 'Brainstorm' }] }));
    expect(await scryfallAutocomplete('sol')).toEqual(['Sol Ring', 'Brainstorm']);
  });

  it('scryfallAutocomplete returns [] on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    expect(await scryfallAutocomplete('sol')).toEqual([]);
  });

  it('scryfallAutocomplete returns [] when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    expect(await scryfallAutocomplete('sol')).toEqual([]);
  });

  it('scryfallCommanderSearch maps name and mana_cost', async () => {
    vi.stubGlobal('fetch', okJson({ data: [{ name: 'Atraxa', mana_cost: '{G}{W}{U}{B}' }] }));
    expect(await scryfallCommanderSearch('atr')).toEqual([
      { name: 'Atraxa', mana_cost: '{G}{W}{U}{B}' },
    ]);
  });

  it('scryfallCommanderSearch short-circuits and handles errors', async () => {
    expect(await scryfallCommanderSearch('a')).toEqual([]);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    expect(await scryfallCommanderSearch('atr')).toEqual([]);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    expect(await scryfallCommanderSearch('atr')).toEqual([]);
  });

  it('scryfallPartnerSearch adds the background clause when eligible', async () => {
    const fetchMock = okJson({ data: [{ name: 'Faceless One' }] });
    vi.stubGlobal('fetch', fetchMock);
    await scryfallPartnerSearch('face', true);
    expect(decodeURIComponent(fetchMock.mock.calls[0][0])).toContain('t:background');
  });

  it('scryfallPartnerSearch omits the background clause when not eligible', async () => {
    const fetchMock = okJson({ data: [] });
    vi.stubGlobal('fetch', fetchMock);
    await scryfallPartnerSearch('face', false);
    expect(decodeURIComponent(fetchMock.mock.calls[0][0])).not.toContain('t:background');
  });

  it('scryfallPartnerSearch short-circuits and handles errors', async () => {
    expect(await scryfallPartnerSearch('a', true)).toEqual([]);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('x')));
    expect(await scryfallPartnerSearch('face', true)).toEqual([]);
  });

  it('scryfallGetCard returns the card, or null on failure', async () => {
    vi.stubGlobal('fetch', okJson({ id: '1', name: 'Sol Ring' }));
    expect((await scryfallGetCard('Sol Ring'))?.name).toBe('Sol Ring');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    expect(await scryfallGetCard('Nope')).toBeNull();

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('x')));
    expect(await scryfallGetCard('Nope')).toBeNull();
  });
});

describe('scryfall card accessors', () => {
  it('getOracleText prefers top-level, then the first face', () => {
    expect(getOracleText({ id: '1', name: 'A', oracle_text: 'top' })).toBe('top');
    expect(
      getOracleText({
        id: '1',
        name: 'A',
        card_faces: [{ name: 'front', oracle_text: 'face' }],
      } as ScryfallCard)
    ).toBe('face');
    expect(getOracleText({ id: '1', name: 'A' })).toBe('');
  });

  it('getCardArtCrop prefers top-level, then first face, else null', () => {
    expect(
      getCardArtCrop({
        id: '1',
        name: 'A',
        image_uris: { art_crop: 'top', normal: '', small: '' },
      })
    ).toBe('top');
    expect(
      getCardArtCrop({
        id: '1',
        name: 'A',
        card_faces: [{ name: 'f', image_uris: { art_crop: 'face', normal: '', small: '' } }],
      } as ScryfallCard)
    ).toBe('face');
    expect(getCardArtCrop({ id: '1', name: 'A' })).toBeNull();
  });
});
