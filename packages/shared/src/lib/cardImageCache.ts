import { api } from './api';

// Only stores successful image URLs — nulls are never written here
const cache = new Map<string, string>();
const inFlight = new Map<string, Promise<string | null>>();
const backCache = new Map<string, string | null>();

/** Concurrency limiter — prevents overwhelming the server with parallel requests */
const MAX_CONCURRENT = 4;
let activeCount = 0;
const queue: Array<() => void> = [];

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = () => {
      activeCount++;
      fn()
        .then(resolve, reject)
        .finally(() => {
          activeCount--;
          if (queue.length > 0) queue.shift()!();
        });
    };
    if (activeCount < MAX_CONCURRENT) run();
    else queue.push(run);
  });
}

/**
 * Resolves a card name to a cached image data URI.
 *
 * Flow:
 *   1. In-memory cache hit → return immediately
 *   2. scryfall-cache.php (DB first, Scryfall fallback) → get scryfall_id + image_uri
 *   3. card-image.php → fetch image bytes, store as base64 in scryfall_card_cache, return data URI
 *
 * Nulls are NEVER written to cache — failed or missing lookups always retry on next call.
 */
export async function getCardImageByName(name: string): Promise<string | null> {
  const cached = cache.get(name);
  if (cached !== undefined) return cached;
  if (inFlight.has(name)) return inFlight.get(name)!;

  const promise = enqueue(() => api.lookupCard(name))
    .then(async (meta) => {
      backCache.set(name, meta?.back_image_uri ?? null);
      if (!meta?.scryfall_id) {
        // Don't cache — could be a transient Scryfall error, not genuinely missing
        return null;
      }
      const img = await enqueue(() => api.getCardImage(meta.scryfall_id, meta.image_uri ?? undefined));
      return img?.data_uri ?? meta.image_uri ?? null;
    })
    .then((url) => {
      if (url !== null) cache.set(name, url);
      inFlight.delete(name);
      return url;
    })
    .catch(() => {
      // Don't cache failures — allow retry on next request
      backCache.delete(name);
      inFlight.delete(name);
      return null;
    });

  inFlight.set(name, promise);
  return promise;
}

// Art crops are cached separately from full-card images (different Scryfall
// variant, different consumer: panel background art vs. card previews).
const artCache = new Map<string, string>();
const artInFlight = new Map<string, Promise<string | null>>();

/**
 * Resolves a scryfall_id to a host-proxied art_crop data URI (phone-safe). The
 * host derives the crop URL from the card's cached image_uri (no URL is sent in
 * the query — prod mod_security 406s URL-valued params). Deduped/cached per id.
 * Returns null on failure so callers can fall back to the raw CDN URL.
 */
export async function getArtCropByScryfallId(scryfallId: string): Promise<string | null> {
  const cached = artCache.get(scryfallId);
  if (cached !== undefined) return cached;
  if (artInFlight.has(scryfallId)) return artInFlight.get(scryfallId)!;

  const promise = enqueue(() => api.getCardArtCrop(scryfallId))
    .then((img) => {
      const uri = img?.data_uri ?? null;
      if (uri !== null) artCache.set(scryfallId, uri);
      artInFlight.delete(scryfallId);
      return uri;
    })
    .catch(() => {
      artInFlight.delete(scryfallId);
      return null;
    });

  artInFlight.set(scryfallId, promise);
  return promise;
}

const artNameCache = new Map<string, string>();
const artNameInFlight = new Map<string, Promise<string | null>>();

/**
 * Resolves a card NAME to a host-proxied art_crop data URI (phone-safe). Works
 * even when the game state never persisted an artCropUrl (older games store
 * null): it looks the card up, derives the art_crop URL from the cached 'normal'
 * image_uri (same Scryfall path — only the size segment differs), and proxies
 * that crop. Falls back to the raw art_crop URL where the CDN is reachable.
 * Serves the ART CROP, not the full card.
 */
export async function getArtCropByName(name: string): Promise<string | null> {
  const cached = artNameCache.get(name);
  if (cached !== undefined) return cached;
  if (artNameInFlight.has(name)) return artNameInFlight.get(name)!;

  const promise = enqueue(() => api.lookupCard(name))
    .then(async (meta) => {
      const id = meta?.scryfall_id;
      const normal = meta?.image_uri;
      if (!id || !normal || !normal.includes('/normal/')) return null;
      const fallbackUrl = normal.replace('/normal/', '/art_crop/');
      const proxied = await getArtCropByScryfallId(id);
      // Cache ONLY the proxied data URI. A raw-URL fallback (proxy transiently
      // down) must not be cached — a CDN-blocked phone would otherwise be stuck
      // with a non-loading URL for the whole session. Returning it uncached lets
      // the next mount retry the proxy (getArtCropByScryfallId caches only successes).
      if (proxied) artNameCache.set(name, proxied);
      return proxied ?? fallbackUrl;
    })
    .then((uri) => {
      artNameInFlight.delete(name);
      return uri;
    })
    .catch(() => {
      artNameInFlight.delete(name);
      return null;
    });

  artNameInFlight.set(name, promise);
  return promise;
}

/**
 * Returns the back face image URL for a DFC card, or null for single-faced cards.
 * Piggybacks on the same lookupCard call as getCardImageByName — no extra request if front already fetched.
 */
export async function getCardBackImageByName(name: string): Promise<string | null> {
  if (backCache.has(name)) return backCache.get(name)!;
  // Trigger the front lookup (which also populates backCache)
  await getCardImageByName(name);
  return backCache.get(name) ?? null;
}

/** Fire-and-forget pre-warm for a known list of card names. */
export function prewarmCardImages(names: string[]): void {
  for (const name of names) {
    if (!cache.has(name) && !inFlight.has(name)) {
      getCardImageByName(name);
    }
  }
}
