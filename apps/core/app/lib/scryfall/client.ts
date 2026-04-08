/**
 * Unified Scryfall client — all Scryfall access routes through the PHP cache layer.
 *
 * DO NOT call api.scryfall.com directly from the browser. All methods here go through
 * php-api/scryfall-cache.php or php-api/card-prints.php.
 *
 * Cache layer gap notes (see individual methods for details):
 *  - lookupById: scryfall-cache.php has no ?id= param. Surfaces as thrown error.
 *  - search:     scryfall-cache.php has no search action. Surfaces as thrown error.
 *  - getPrints:  card-prints.php accepts ?name= not ?oracle_id=. Method signature
 *                uses cardName for this reason (see JSDoc).
 */

import { apiFetch } from '@/lib/api';
import type { ScryfallCachedCard, CardPrint } from '@/lib/types';

// ── Public type exports ────────────────────────────────────────────────────────

export type { ScryfallCachedCard };

export interface ScryfallSearchOptions {
  page?: number;
  unique?: 'cards' | 'art' | 'prints';
  order?: 'name' | 'released' | 'set' | 'rarity' | 'color' | 'cmc' | 'edhrec';
}

export interface ScryfallSearchResult {
  cards: ScryfallCachedCard[];
  hasMore: boolean;
  totalCards: number;
}

// ── Internal response shapes ───────────────────────────────────────────────────

interface BulkLookupResponse {
  results: (ScryfallCachedCard & { error?: string })[];
}

interface CardPrintsResponse {
  prints: CardPrint[];
}

// ── Methods ───────────────────────────────────────────────────────────────────

/**
 * Look up a single card by exact name. Returns null if not found.
 *
 * Routes through: GET php-api/scryfall-cache.php?name=<name>
 *
 * The cache layer does a case-insensitive exact match first, then falls back to a
 * Scryfall fuzzy lookup and caches the result.
 */
export async function lookupByName(name: string): Promise<ScryfallCachedCard | null> {
  return apiFetch<ScryfallCachedCard | null>(
    `scryfall-cache?name=${encodeURIComponent(name)}`
  );
}

/**
 * Look up a card by its Scryfall UUID.
 *
 * NOTE: php-api/scryfall-cache.php does NOT currently support a ?id= query parameter.
 * The cache is keyed by card name, not scryfall_id. This method is not implementable
 * without a cache layer change.
 *
 * Phase 6 should add ?id=<scryfall_id> support to scryfall-cache.php, querying
 * `SELECT * FROM scryfall_card_cache WHERE scryfall_id = ?` and fetching from Scryfall
 * via `https://api.scryfall.com/cards/<id>` on cache miss.
 *
 * @throws Always — not yet implemented.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function lookupById(_scryfallId: string): Promise<ScryfallCachedCard | null> {
  // TODO: php-api/scryfall-cache.php does not support ?id= lookup.
  // Add a GET ?id=<scryfall_id> branch to the cache layer, then implement here as:
  //   return apiFetch<ScryfallCachedCard | null>(`scryfall-cache?id=${encodeURIComponent(_scryfallId)}`);
  throw new Error(
    'scryfall.lookupById is not yet implemented — scryfall-cache.php has no ?id= branch. ' +
    'See Phase 6 for the cache layer addition.'
  );
}

/**
 * Bulk-lookup cards by name. More efficient than N individual lookups.
 *
 * Routes through: POST php-api/scryfall-cache.php { names: [...] }
 *
 * Returns results in the same order as the input names array.
 * Items that could not be found will have an `error` string field set.
 * The cache layer uses Scryfall's /cards/collection endpoint (max 75 per batch)
 * and caches all found cards.
 */
export async function bulkLookupByName(
  names: string[]
): Promise<Array<ScryfallCachedCard & { error?: string }>> {
  const response = await apiFetch<BulkLookupResponse>('scryfall-cache', {
    method: 'POST',
    body: JSON.stringify({ names }),
  });
  return response.results;
}

/**
 * Get all printings of a card.
 *
 * Routes through: GET php-api/card-prints.php?name=<cardName>
 *
 * NOTE: The brief specified `oracleId` as the parameter, but card-prints.php accepts
 * `?name=` (card name), not `?oracle_id=`. The method signature uses `cardName` to
 * match the actual cache layer API. Callers expecting to pass an oracle_id will need
 * to resolve the oracle_id → name mapping before calling this method, or wait for
 * Phase 6 to add oracle_id support to card-prints.php.
 *
 * Returns an array of CardPrint objects (includes set_name, set_code, collector_number,
 * released_at, and image_cached flag). Unlike ScryfallCachedCard, CardPrint rows
 * are not persisted to the local cache — they are fetched live from Scryfall each call.
 */
export async function getPrints(cardName: string): Promise<CardPrint[]> {
  const response = await apiFetch<CardPrintsResponse>(
    `card-prints?name=${encodeURIComponent(cardName)}`
  );
  return response.prints;
}

/**
 * Search by Scryfall syntax.
 *
 * NOTE: php-api/scryfall-cache.php does not support a search action. CardLookupField
 * currently bypasses this client and calls api.scryfall.com/cards/search directly.
 *
 * Phase 6 should add ?action=search&q=<query> support to scryfall-cache.php, proxying
 * Scryfall's /cards/search endpoint with optional server-side result caching, then
 * implement this method.
 *
 * @throws Always — not yet implemented.
 */
export async function search(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _query: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _opts?: ScryfallSearchOptions
): Promise<ScryfallSearchResult> {
  // TODO: php-api/scryfall-cache.php does not yet support a search action.
  // CardLookupField currently bypasses this client and calls api.scryfall.com directly.
  // Phase 6 should add a search action to scryfall-cache.php and migrate callers.
  throw new Error(
    'scryfall.search is not yet implemented — use the cache layer search action when it exists. ' +
    'CardLookupField is a known caller that must be migrated in Phase 6.'
  );
}
