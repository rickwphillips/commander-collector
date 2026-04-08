/**
 * Pure OCR helpers for the deck scan pipeline.
 * No React, no DOM manipulation beyond what's needed to call the API.
 * Callers manage their own state; these functions take inputs and return results.
 */

import { api } from '@/lib/api';
import type { ScryfallCachedCard, ScannedCard } from '@/lib/types';
import type { ImageTile } from './imageEditor';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A raw card name + proxy flag as returned by the OCR endpoint. */
export interface OcrCardResult {
  name: string;
  proxy: boolean;
}

/** A deduplicated list of card names found across all tiles in one scan pass. */
export type DeduplicatedOcrResults = OcrCardResult[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generates a short random temporary ID for a scanned card. */
export function tempId(): string {
  return Math.random().toString(36).slice(2);
}

/**
 * Constructs a ScannedCard from a Scryfall lookup result.
 * Pass `null` for `data` when the card was not found on Scryfall.
 */
export function cardFromScryfall(name: string, data: ScryfallCachedCard | null, proxy = false): ScannedCard {
  return {
    id: tempId(),
    card_name: data?.name ?? name,
    scryfall_id: data?.scryfall_id ?? null,
    image_uri: data?.image_uri ?? null,
    back_image_uri: data?.back_image_uri ?? null,
    color_identity: data?.color_identity ?? '',
    type_line: data?.type_line ?? null,
    mana_cost: data?.mana_cost ?? null,
    quantity: 1,
    is_commander: false,
    is_proxy: proxy,
    notFound: !data,
  };
}

// ─── Core OCR ─────────────────────────────────────────────────────────────────

/**
 * Scans a batch of image tiles through the OCR endpoint and returns a
 * deduplicated list of card names found across all tiles.
 *
 * @param tiles        Array of base64-encoded tiles to scan (full image + grid tiles).
 * @param onTileScanned  Called after each tile completes (for progress reporting).
 * @returns Deduplicated list of {name, proxy} results across all tiles.
 */
export async function runTileScan(
  tiles: ImageTile[],
  onTileScanned?: () => void,
): Promise<DeduplicatedOcrResults> {
  const BATCH_SIZE = 3;
  const seen = new Set<string>();
  const allNewCards: OcrCardResult[] = [];

  for (let i = 0; i < tiles.length; i += BATCH_SIZE) {
    const batch = tiles.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (tile) => {
        const result = await api.scanDeck(tile.base64, tile.mimeType);
        onTileScanned?.();
        return result.cards;
      })
    );

    for (const result of batchResults) {
      if (result.status !== 'fulfilled') continue;
      for (const card of result.value) {
        const key = card.name.toLowerCase().trim();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        allNewCards.push(card);
      }
    }
  }

  return allNewCards;
}

// ─── Scryfall Lookup + Retry ───────────────────────────────────────────────────

/**
 * Bulk-looks up card names on Scryfall via the cache endpoint.
 * Returns ScannedCard objects; not-found cards have `notFound: true`.
 * Call `retryNotFoundCards` afterward to do fuzzy per-card retries.
 */
export async function bulkLookupScryfall(items: OcrCardResult[]): Promise<ScannedCard[]> {
  const names = items.map((i) => i.name);
  const { results } = await api.bulkLookupCards(names);
  return results.map((r, i) =>
    cardFromScryfall(
      items[i]?.name ?? (r as ScryfallCachedCard).name ?? '',
      'error' in r ? null : (r as ScryfallCachedCard),
      items[i]?.proxy ?? false,
    )
  );
}

/**
 * Retries not-found cards individually with fuzzy matching.
 * Mutates the `scanned` array in-place and returns the array of cards that
 * were successfully enriched (so the caller can update state).
 */
export async function retryNotFoundCards(scanned: ScannedCard[]): Promise<ScannedCard[]> {
  const notFound = scanned.filter((c) => c.notFound);
  if (notFound.length === 0) return [];

  const retries = await Promise.all(
    notFound.map(async (c) => {
      const data = await api.lookupCard(c.card_name);
      if (!data) return null;
      return { id: c.id, data };
    })
  );
  const hits = retries.filter((r): r is { id: string; data: ScryfallCachedCard } => r !== null);

  hits.forEach((hit) => {
    const card = scanned.find((c) => c.id === hit.id);
    if (card) {
      card.card_name = hit.data.name ?? card.card_name;
      card.scryfall_id = hit.data.scryfall_id;
      card.image_uri = hit.data.image_uri ?? null;
      card.back_image_uri = hit.data.back_image_uri ?? null;
      card.color_identity = hit.data.color_identity ?? '';
      card.type_line = hit.data.type_line ?? null;
      card.mana_cost = hit.data.mana_cost ?? null;
      card.notFound = false;
    }
  });

  return scanned.filter((c) => hits.some((h) => h.id === c.id));
}

/**
 * Convenience wrapper: bulk-looks up cards and retries not-found ones with
 * fuzzy matching in a single call. Returns the fully-enriched list.
 * Does NOT touch React state — caller is responsible for updating state.
 */
export async function lookupAndEnrichCards(items: OcrCardResult[]): Promise<ScannedCard[]> {
  const scanned = await bulkLookupScryfall(items);
  await retryNotFoundCards(scanned);
  return scanned;
}
