/**
 * Unified Scryfall client — all Scryfall access routes through the PHP cache layer.
 *
 * DO NOT call api.scryfall.com directly from the browser. All methods here go through
 * php-api/scryfall-cache.php or php-api/card-prints.php.
 *
 * Name-level search (autocomplete, commander/partner typeahead, full-syntax query)
 * routes through scryfall-cache.php?action=search. Two methods remain unimplemented
 * stubs with no caller: lookupById (no ?id= branch) and the full-card search (use
 * queryNames instead). getPrints takes a card name, since card-prints.php keys on
 * ?name= not ?oracle_id=.
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
 * Not implemented: the cache is keyed by name, and scryfall-cache.php has no ?id=
 * branch. No caller needs id lookup today.
 *
 * @throws Always — not implemented.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function lookupById(_scryfallId: string): Promise<ScryfallCachedCard | null> {
  throw new Error('scryfall.lookupById is not implemented; scryfall-cache.php has no ?id= branch.');
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
 * Full-card Scryfall search with pagination (resolves whole cards, not just names).
 * Not implemented: no caller needs it. For name-level search use `queryNames`, which
 * powers CardLookupField's query mode through scryfall-cache.php.
 *
 * @throws Always — not implemented.
 */
export async function search(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _query: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _opts?: ScryfallSearchOptions
): Promise<ScryfallSearchResult> {
  throw new Error('scryfall.search is not implemented; use queryNames for name-level search.');
}

// ── Typeahead search (commander / partner / autocomplete) ───────────────────────

export interface CommanderSearchResult {
  name: string;
  mana_cost?: string | null;
}

export interface ScryfallSearchOpts {
  signal?: AbortSignal;
}

// Aborted requests must propagate so a caller can distinguish a superseded
// search from a genuine empty result; all other failures degrade to empty.
function rethrowAbort(err: unknown): void {
  if (err instanceof DOMException && err.name === 'AbortError') throw err;
}

/**
 * Card name prefix autocomplete.
 * Routes through: GET scryfall-cache.php?action=search&mode=autocomplete&q=<query>
 * Returns [] for queries under 2 chars or on any non-abort error.
 */
export async function autocomplete(query: string, opts?: ScryfallSearchOpts): Promise<string[]> {
  if (query.length < 2) return [];
  try {
    const res = await apiFetch<{ names: string[] }>(
      `scryfall-cache?action=search&mode=autocomplete&q=${encodeURIComponent(query)}`,
      { signal: opts?.signal }
    );
    return res.names ?? [];
  } catch (err) {
    rethrowAbort(err);
    return [];
  }
}

/**
 * Search for valid commanders (legendary with power/toughness, or "can be your commander").
 * Routes through: GET scryfall-cache.php?action=search&mode=commander&q=<query>
 */
export async function commanderSearch(query: string): Promise<CommanderSearchResult[]> {
  if (query.length < 2) return [];
  try {
    const res = await apiFetch<{ results: CommanderSearchResult[] }>(
      `scryfall-cache?action=search&mode=commander&q=${encodeURIComponent(query)}`
    );
    return res.results ?? [];
  } catch {
    return [];
  }
}

/**
 * Search for valid partner commanders. When backgroundEligible is true, also
 * includes Background enchantments.
 * Routes through: GET scryfall-cache.php?action=search&mode=partner&q=<query>&bg=<0|1>
 */
export async function partnerSearch(
  query: string,
  backgroundEligible: boolean
): Promise<CommanderSearchResult[]> {
  if (query.length < 2) return [];
  try {
    const bg = backgroundEligible ? '&bg=1' : '';
    const res = await apiFetch<{ results: CommanderSearchResult[] }>(
      `scryfall-cache?action=search&mode=partner&q=${encodeURIComponent(query)}${bg}`
    );
    return res.results ?? [];
  } catch {
    return [];
  }
}

// ── Full Scryfall-syntax name search (paginated) ────────────────────────────────

export interface QueryNamesFilter {
  commander?: boolean;
  partner?: boolean;
  /** Color-identity letters, e.g. "WUB". Applied as id<= on the server. */
  identity?: string;
}

export interface QueryNamesResult {
  names: string[];
  hasMore: boolean;
}

/**
 * Full Scryfall-syntax search returning matching card names + a hasMore flag.
 * Result filters are applied server-side (the browser never assembles Scryfall
 * filter terms).
 * Routes through: GET scryfall-cache.php?action=search&mode=query&q=<query>&page=<n>
 */
export async function queryNames(
  query: string,
  page: number,
  filter?: QueryNamesFilter,
  opts?: ScryfallSearchOpts
): Promise<QueryNamesResult> {
  try {
    const params = new URLSearchParams({
      action: 'search',
      mode: 'query',
      q: query,
      page: String(page),
    });
    if (filter?.commander) params.set('commander', '1');
    if (filter?.partner) params.set('partner', '1');
    if (filter?.identity) params.set('identity', filter.identity);

    const res = await apiFetch<QueryNamesResult>(`scryfall-cache?${params.toString()}`, {
      signal: opts?.signal,
    });
    return { names: res.names ?? [], hasMore: res.hasMore ?? false };
  } catch (err) {
    rethrowAbort(err);
    return { names: [], hasMore: false };
  }
}

// ── Single-card live detail (fields the cache row does not store) ───────────────

export interface ScryfallCardDetail {
  name: string;
  oracle_text: string;
  color_identity: string[];
  art_crop: string | null;
  image_uri: string | null;
}

/**
 * Live card detail carrying oracle_text and art_crop, which the cache row omits.
 * Routes through: GET scryfall-cache.php?action=card&name=<name>
 * Returns null if not found or on error.
 */
export async function getCardDetail(name: string): Promise<ScryfallCardDetail | null> {
  try {
    return await apiFetch<ScryfallCardDetail | null>(
      `scryfall-cache?action=card&name=${encodeURIComponent(name)}`
    );
  } catch {
    return null;
  }
}
