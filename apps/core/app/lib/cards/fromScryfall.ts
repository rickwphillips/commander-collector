/**
 * lib/cards/fromScryfall.ts — canonical Scryfall → Card adapter.
 *
 * Previously duplicated in three places:
 *   - apps/core/app/decks/scan/page.tsx           (cardFromScryfall, with proxy param)
 *   - apps/core/app/decks/scan/components/CardEditDialog.tsx (no proxy param)
 *   - apps/core/app/decks/scan/components/CardAddDialog.tsx  (no proxy param)
 *
 * This is the single canonical implementation. It preserves the `proxy` option
 * from the scan page (the only call site that passes it).
 *
 * INPUT: ScryfallCachedCard — the shape PHP returns from the Scryfall cache endpoint.
 * OUTPUT: Card — the canonical TS card type, with a fresh tempId and notFound set.
 */

import type { ScryfallCachedCard } from '@/lib/types';
import type { Card } from './types';
import { tempId } from './tempId';

export interface CardFromScryfallOpts {
  /** When true, sets is_proxy = true on the resulting Card. Default false. */
  proxy?: boolean;
}

/**
 * cardFromScryfall — build a canonical Card from a Scryfall cache response.
 *
 * @param name  The name the user searched for (used as fallback when data is null).
 * @param data  The cached Scryfall row returned by the PHP API, or null if not found.
 * @param opts  Optional overrides (currently only `proxy`).
 */
export function cardFromScryfall(
  name: string,
  data: ScryfallCachedCard | null,
  opts?: CardFromScryfallOpts
): Card {
  return {
    tempId:         tempId(),
    card_name:      data?.name ?? name,
    scryfall_id:    data?.scryfall_id ?? null,
    image_uri:      data?.image_uri      ?? null,
    back_image_uri: data?.back_image_uri ?? null,
    color_identity: data?.color_identity ?? '',
    colors:         data?.colors,
    type_line:      data?.type_line      ?? null,
    mana_cost:      data?.mana_cost      ?? null,
    quantity:       1,
    is_commander:   false,
    is_proxy:       opts?.proxy ?? false,
    notFound:       !data,
  };
}
