import { describe, it, expect, beforeEach, vi } from 'vitest';

const apiFetch = vi.fn();
vi.mock('@/lib/api', () => ({
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}));

import {
  autocomplete,
  commanderSearch,
  partnerSearch,
  getCardDetail,
} from '@/lib/scryfall';

describe('scryfall typeahead search', () => {
  beforeEach(() => apiFetch.mockReset());

  it('autocomplete returns [] for short queries without calling the API', async () => {
    expect(await autocomplete('a')).toEqual([]);
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('autocomplete returns the names array', async () => {
    apiFetch.mockResolvedValue({ names: ['Sol Ring', 'Brainstorm'] });
    expect(await autocomplete('sol')).toEqual(['Sol Ring', 'Brainstorm']);
    expect(apiFetch.mock.calls[0][0]).toContain('action=search&mode=autocomplete');
  });

  it('autocomplete returns [] when the API throws', async () => {
    apiFetch.mockImplementationOnce(() => { throw new Error('network'); });
    expect(await autocomplete('sol')).toEqual([]);
  });

  it('commanderSearch returns [] for short queries', async () => {
    expect(await commanderSearch('a')).toEqual([]);
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('commanderSearch returns the results array and hits the commander mode', async () => {
    apiFetch.mockResolvedValue({ results: [{ name: 'Atraxa', mana_cost: '{G}{W}{U}{B}' }] });
    expect(await commanderSearch('atr')).toEqual([
      { name: 'Atraxa', mana_cost: '{G}{W}{U}{B}' },
    ]);
    expect(apiFetch.mock.calls[0][0]).toContain('mode=commander');
  });

  it('commanderSearch returns [] when the API throws', async () => {
    apiFetch.mockImplementationOnce(() => { throw new Error('x'); });
    expect(await commanderSearch('atr')).toEqual([]);
  });

  it('partnerSearch adds bg=1 when eligible, omits it otherwise', async () => {
    apiFetch.mockResolvedValue({ results: [] });
    await partnerSearch('face', true);
    expect(apiFetch.mock.calls[0][0]).toContain('bg=1');

    apiFetch.mockReset();
    apiFetch.mockResolvedValue({ results: [] });
    await partnerSearch('face', false);
    expect(apiFetch.mock.calls[0][0]).not.toContain('bg=1');
  });

  it('partnerSearch returns [] for short queries and on error', async () => {
    expect(await partnerSearch('a', true)).toEqual([]);
    apiFetch.mockImplementationOnce(() => { throw new Error('x'); });
    expect(await partnerSearch('face', true)).toEqual([]);
  });
});

describe('scryfall card detail', () => {
  beforeEach(() => apiFetch.mockReset());

  it('getCardDetail returns the detail and hits the card action', async () => {
    apiFetch.mockResolvedValue({
      name: 'Sol Ring',
      oracle_text: '{T}: Add {C}{C}.',
      color_identity: [],
      art_crop: 'https://img/art',
      image_uri: 'https://img/normal',
    });
    const card = await getCardDetail('Sol Ring');
    expect(card?.name).toBe('Sol Ring');
    expect(card?.art_crop).toBe('https://img/art');
    expect(apiFetch.mock.calls[0][0]).toContain('action=card');
  });

  it('getCardDetail returns null when the API throws', async () => {
    apiFetch.mockImplementationOnce(() => { throw new Error('x'); });
    expect(await getCardDetail('Nope')).toBeNull();
  });
});
