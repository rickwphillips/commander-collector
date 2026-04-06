/**
 * Unit & regression tests for cardImageCache.
 *
 * Regression: prior to fix, failed lookups were permanently cached as null,
 * meaning ~half the cards on a list page would never show images.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock the API module ───────────────────────────────────────────────────────
const mockLookupCard = vi.fn();
const mockGetCardImage = vi.fn();

vi.mock('../../../../packages/shared/src/lib/api', () => ({
  api: {
    lookupCard: (...args: unknown[]) => mockLookupCard(...args),
    getCardImage: (...args: unknown[]) => mockGetCardImage(...args),
  },
}));

// Import AFTER mocks are set up
import {
  getCardImageByName,
  getCardBackImageByName,
  prewarmCardImages,
} from '../../../../packages/shared/src/lib/cardImageCache';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function makeMeta(name: string, opts?: { backFace?: string }) {
  return {
    scryfall_id: `sf-${name}`,
    image_uri: `https://scryfall.com/${name}.jpg`,
    back_image_uri: opts?.backFace ?? null,
  };
}

// Between tests we need to reset the module-level caches.
// Since they're private Maps we can't access them directly,
// but we CAN reset the module by clearing the mock state
// and using unique card names per test to avoid cross-test cache hits.
let testId = 0;
function uniqueName(base: string) {
  return `${base}_${++testId}`;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockLookupCard.mockReset();
  mockGetCardImage.mockReset();
});

// ─── Unit Tests ────────────────────────────────────────────────────────────────

describe('getCardImageByName', () => {
  it('returns data_uri from card-image endpoint', async () => {
    const name = uniqueName('Sol Ring');
    mockLookupCard.mockResolvedValue(makeMeta(name));
    mockGetCardImage.mockResolvedValue({ data_uri: 'data:image/png;base64,abc', cached: false });

    const result = await getCardImageByName(name);

    expect(result).toBe('data:image/png;base64,abc');
    expect(mockLookupCard).toHaveBeenCalledWith(name);
    expect(mockGetCardImage).toHaveBeenCalledWith(`sf-${name}`, `https://scryfall.com/${name}.jpg`);
  });

  it('falls back to image_uri when data_uri is missing', async () => {
    const name = uniqueName('Lightning Bolt');
    mockLookupCard.mockResolvedValue(makeMeta(name));
    mockGetCardImage.mockResolvedValue({ data_uri: null, cached: false });

    const result = await getCardImageByName(name);

    expect(result).toBe(`https://scryfall.com/${name}.jpg`);
  });

  it('returns null when card has no scryfall_id', async () => {
    const name = uniqueName('Unknown Card');
    mockLookupCard.mockResolvedValue({ scryfall_id: null, image_uri: null, back_image_uri: null });

    const result = await getCardImageByName(name);

    expect(result).toBeNull();
    expect(mockGetCardImage).not.toHaveBeenCalled();
  });

  it('returns null when lookupCard returns null', async () => {
    const name = uniqueName('Nonexistent');
    mockLookupCard.mockResolvedValue(null);

    const result = await getCardImageByName(name);

    expect(result).toBeNull();
  });

  it('caches successful lookups — second call does not hit API', async () => {
    const name = uniqueName('Cached Card');
    mockLookupCard.mockResolvedValue(makeMeta(name));
    mockGetCardImage.mockResolvedValue({ data_uri: 'data:image/png;base64,xyz', cached: true });

    const first = await getCardImageByName(name);
    const second = await getCardImageByName(name);

    expect(first).toBe('data:image/png;base64,xyz');
    expect(second).toBe('data:image/png;base64,xyz');
    expect(mockLookupCard).toHaveBeenCalledTimes(1);
  });

  it('deduplicates concurrent calls for the same card', async () => {
    const name = uniqueName('Dedup Card');
    mockLookupCard.mockResolvedValue(makeMeta(name));
    mockGetCardImage.mockResolvedValue({ data_uri: 'data:image/png;base64,dedup', cached: false });

    const [a, b, c] = await Promise.all([
      getCardImageByName(name),
      getCardImageByName(name),
      getCardImageByName(name),
    ]);

    expect(a).toBe('data:image/png;base64,dedup');
    expect(b).toBe('data:image/png;base64,dedup');
    expect(c).toBe('data:image/png;base64,dedup');
    expect(mockLookupCard).toHaveBeenCalledTimes(1);
  });
});

describe('getCardBackImageByName', () => {
  it('returns back face URL for DFC cards', async () => {
    const name = uniqueName('Delver of Secrets');
    mockLookupCard.mockResolvedValue(makeMeta(name, { backFace: 'https://scryfall.com/delver-back.jpg' }));
    mockGetCardImage.mockResolvedValue({ data_uri: 'data:image/png;base64,front', cached: false });

    const back = await getCardBackImageByName(name);

    expect(back).toBe('https://scryfall.com/delver-back.jpg');
  });

  it('returns null for single-faced cards', async () => {
    const name = uniqueName('Island');
    mockLookupCard.mockResolvedValue(makeMeta(name));
    mockGetCardImage.mockResolvedValue({ data_uri: 'data:image/png;base64,island', cached: false });

    const back = await getCardBackImageByName(name);

    expect(back).toBeNull();
  });

  it('does not make extra API call if front was already fetched', async () => {
    const name = uniqueName('Transform Card');
    mockLookupCard.mockResolvedValue(makeMeta(name, { backFace: 'https://back.jpg' }));
    mockGetCardImage.mockResolvedValue({ data_uri: 'data:image/png;base64,t', cached: false });

    await getCardImageByName(name);
    mockLookupCard.mockClear();
    mockGetCardImage.mockClear();

    const back = await getCardBackImageByName(name);

    expect(back).toBe('https://back.jpg');
    expect(mockLookupCard).not.toHaveBeenCalled();
  });
});

describe('prewarmCardImages', () => {
  it('fires lookups for uncached cards', async () => {
    const names = [uniqueName('Prewarm A'), uniqueName('Prewarm B')];
    mockLookupCard.mockResolvedValue(makeMeta('x'));
    mockGetCardImage.mockResolvedValue({ data_uri: 'data:image/png;base64,pw', cached: false });

    prewarmCardImages(names);

    // Let promises settle
    await new Promise((r) => setTimeout(r, 50));

    expect(mockLookupCard).toHaveBeenCalledTimes(2);
  });

  it('skips already-cached cards', async () => {
    const cached = uniqueName('Already Cached');
    const fresh = uniqueName('Not Cached');

    // Prime the cache
    mockLookupCard.mockResolvedValue(makeMeta(cached));
    mockGetCardImage.mockResolvedValue({ data_uri: 'data:image/png;base64,c', cached: true });
    await getCardImageByName(cached);

    mockLookupCard.mockClear();
    mockGetCardImage.mockClear();
    mockLookupCard.mockResolvedValue(makeMeta(fresh));
    mockGetCardImage.mockResolvedValue({ data_uri: 'data:image/png;base64,f', cached: false });

    prewarmCardImages([cached, fresh]);
    await new Promise((r) => setTimeout(r, 50));

    // Only the fresh card should trigger a lookup
    expect(mockLookupCard).toHaveBeenCalledTimes(1);
    expect(mockLookupCard).toHaveBeenCalledWith(fresh);
  });
});

// ─── Concurrency Tests ─────────────────────────────────────────────────────────

describe('concurrency limiter', () => {
  it('limits concurrent API calls to 4', async () => {
    let activeCalls = 0;
    let peakConcurrency = 0;

    mockLookupCard.mockImplementation(() => {
      activeCalls++;
      peakConcurrency = Math.max(peakConcurrency, activeCalls);
      return new Promise((resolve) => {
        setTimeout(() => {
          activeCalls--;
          resolve(makeMeta('x'));
        }, 10);
      });
    });
    mockGetCardImage.mockImplementation(() => {
      activeCalls++;
      peakConcurrency = Math.max(peakConcurrency, activeCalls);
      return new Promise((resolve) => {
        setTimeout(() => {
          activeCalls--;
          resolve({ data_uri: 'data:image/png;base64,q', cached: false });
        }, 10);
      });
    });

    const names = Array.from({ length: 10 }, (_, i) => uniqueName(`Conc${i}`));
    const promises = names.map((n) => getCardImageByName(n));
    await Promise.all(promises);

    // Should never exceed MAX_CONCURRENT (4)
    expect(peakConcurrency).toBeLessThanOrEqual(4);
    // But should use concurrency (more than 1)
    expect(peakConcurrency).toBeGreaterThan(1);
  });
});

// ─── Regression Tests ──────────────────────────────────────────────────────────

describe('REGRESSION: failed lookups must not be permanently cached', () => {
  it('does NOT cache network failures — retry succeeds', async () => {
    const name = uniqueName('Flaky Card');

    // First call: network error
    mockLookupCard.mockRejectedValueOnce(new Error('Network error'));

    const first = await getCardImageByName(name);
    expect(first).toBeNull();

    // Second call: succeeds
    mockLookupCard.mockResolvedValueOnce(makeMeta(name));
    mockGetCardImage.mockResolvedValueOnce({ data_uri: 'data:image/png;base64,retry', cached: false });

    const second = await getCardImageByName(name);
    expect(second).toBe('data:image/png;base64,retry');

    // Must have called the API again (not served from cache)
    expect(mockLookupCard).toHaveBeenCalledTimes(2);
  });

  it('does NOT cache getCardImage failures — retry succeeds', async () => {
    const name = uniqueName('Image Fail Card');

    // First call: lookup succeeds but image fetch fails
    mockLookupCard.mockResolvedValueOnce(makeMeta(name));
    mockGetCardImage.mockRejectedValueOnce(new Error('Image fetch failed'));

    const first = await getCardImageByName(name);
    expect(first).toBeNull();

    // Second call: both succeed
    mockLookupCard.mockResolvedValueOnce(makeMeta(name));
    mockGetCardImage.mockResolvedValueOnce({ data_uri: 'data:image/png;base64,fixed', cached: false });

    const second = await getCardImageByName(name);
    expect(second).toBe('data:image/png;base64,fixed');
  });

  it('DOES cache genuinely-not-found cards (no scryfall_id)', async () => {
    const name = uniqueName('Truly Missing');

    mockLookupCard.mockResolvedValue({ scryfall_id: null, image_uri: null, back_image_uri: null });

    const first = await getCardImageByName(name);
    expect(first).toBeNull();

    const second = await getCardImageByName(name);
    expect(second).toBeNull();

    // Only one API call — the null was legitimately cached
    expect(mockLookupCard).toHaveBeenCalledTimes(1);
  });

  it('burst of 20 cards does not permanently lose any (simulates list page)', async () => {
    const names = Array.from({ length: 20 }, (_, i) => uniqueName(`Burst${i}`));

    // All lookups succeed
    mockLookupCard.mockImplementation((n: string) =>
      Promise.resolve(makeMeta(n))
    );
    mockGetCardImage.mockImplementation(() =>
      Promise.resolve({ data_uri: 'data:image/png;base64,ok', cached: false })
    );

    const results = await Promise.all(names.map((n) => getCardImageByName(n)));

    // Every single card should have resolved to a valid image
    for (let i = 0; i < results.length; i++) {
      expect(results[i]).not.toBeNull();
    }
  });

  it('back face cache is cleared on failure — retry populates it', async () => {
    const name = uniqueName('DFC Fail');

    // First call: fails
    mockLookupCard.mockRejectedValueOnce(new Error('fail'));
    await getCardImageByName(name);

    const backFirst = await getCardBackImageByName(name);
    // After failure + retry with no cached data, back should attempt re-fetch
    // backFirst will be null since the retry in getCardBackImageByName
    // calls getCardImageByName which also fails (no mock set yet)

    // Now set up success
    mockLookupCard.mockResolvedValueOnce(makeMeta(name, { backFace: 'https://back-dfc.jpg' }));
    mockGetCardImage.mockResolvedValueOnce({ data_uri: 'data:image/png;base64,dfc', cached: false });

    const front = await getCardImageByName(name);
    const backSecond = await getCardBackImageByName(name);

    expect(front).toBe('data:image/png;base64,dfc');
    expect(backSecond).toBe('https://back-dfc.jpg');
  });
});
