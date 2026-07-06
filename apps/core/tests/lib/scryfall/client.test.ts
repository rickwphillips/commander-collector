import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '@/lib/api';
import {
  lookupByName,
  lookupById,
  bulkLookupByName,
  getPrints,
  search,
} from '@/lib/scryfall/client';

const mockedFetch = vi.mocked(apiFetch);

describe('scryfall/client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lookupByName routes through the cache with an encoded name', async () => {
    mockedFetch.mockResolvedValue({ name: 'Sol Ring' } as never);
    const card = await lookupByName('Sol Ring');
    expect(mockedFetch).toHaveBeenCalledWith('scryfall-cache?name=Sol%20Ring');
    expect(card).toEqual({ name: 'Sol Ring' });
  });

  it('bulkLookupByName POSTs names and returns the results array', async () => {
    mockedFetch.mockResolvedValue({ results: [{ name: 'A' }, { name: 'B', error: 'x' }] } as never);
    const results = await bulkLookupByName(['A', 'B']);
    const [path, opts] = mockedFetch.mock.calls[0];
    expect(path).toBe('scryfall-cache');
    expect((opts as RequestInit).method).toBe('POST');
    expect(JSON.parse((opts as RequestInit).body as string)).toEqual({ names: ['A', 'B'] });
    expect(results).toHaveLength(2);
  });

  it('getPrints returns the prints array for a card name', async () => {
    mockedFetch.mockResolvedValue({ prints: [{ set_code: 'CMR' }] } as never);
    const prints = await getPrints('Sol Ring');
    expect(mockedFetch).toHaveBeenCalledWith('card-prints?name=Sol%20Ring');
    expect(prints).toEqual([{ set_code: 'CMR' }]);
  });

  it('lookupById throws — not yet implemented', async () => {
    await expect(lookupById('abc')).rejects.toThrow('not yet implemented');
  });

  it('search throws — not yet implemented', async () => {
    await expect(search('t:legendary')).rejects.toThrow('not yet implemented');
  });
});
