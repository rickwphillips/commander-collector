import { api } from './api';

const cache = new Map<string, string | null>();
const inFlight = new Map<string, Promise<string | null>>();
const backCache = new Map<string, string | null>();

/**
 * Resolves a card name to a cached image data URI.
 *
 * Flow:
 *   1. In-memory cache hit → return immediately
 *   2. scryfall-cache.php (DB first, Scryfall fallback) → get scryfall_id + image_uri
 *   3. card-image.php → fetch image bytes, store as base64 in scryfall_card_cache, return data URI
 *
 * Subsequent calls for the same name (anywhere in the app) return from memory.
 */
export async function getCardImageByName(name: string): Promise<string | null> {
  if (cache.has(name)) return cache.get(name)!;
  if (inFlight.has(name)) return inFlight.get(name)!;

  const promise = api
    .lookupCard(name)
    .then(async (meta) => {
      backCache.set(name, meta?.back_image_uri ?? null);
      if (!meta?.scryfall_id) return null;
      const img = await api.getCardImage(meta.scryfall_id, meta.image_uri ?? undefined);
      return img?.data_uri ?? meta.image_uri ?? null;
    })
    .then((url) => {
      cache.set(name, url);
      inFlight.delete(name);
      return url;
    })
    .catch(() => {
      cache.set(name, null);
      backCache.set(name, null);
      inFlight.delete(name);
      return null;
    });

  inFlight.set(name, promise);
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
