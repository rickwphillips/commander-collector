export interface ScryfallCard {
  id: string;
  name: string;
  oracle_text?: string;
  color_identity?: string[];
  image_uris?: { art_crop: string; normal: string; small: string };
  card_faces?: Array<{
    name: string;
    oracle_text?: string;
    image_uris?: { art_crop: string; normal: string; small: string };
  }>;
}

export async function scryfallAutocomplete(query: string): Promise<string[]> {
  if (query.length < 2) return [];
  try {
    const res = await fetch(
      `https://api.scryfall.com/cards/search?q=name:${encodeURIComponent(query)}&unique=names&order=name&page=1`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return ((data.data as { name: string }[]) ?? []).map((c) => c.name);
  } catch {
    return [];
  }
}

/**
 * Searches for valid commanders matching the query.
 * Includes:
 *  - Legendary permanents with power/toughness (creatures, vehicles, etc.)
 *  - Any card with "can be your commander" in its oracle text
 */
export interface ScryfallSearchResult {
  name: string;
  mana_cost?: string;
}

export async function scryfallCommanderSearch(query: string): Promise<ScryfallSearchResult[]> {
  if (query.length < 2) return [];
  try {
    const q = `name:${query} (t:legendary pow>=0 OR o:"can be your commander")`;
    const res = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}&unique=names&order=name&page=1`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return ((data.data as { name: string; mana_cost?: string }[]) ?? []).map((c) => ({
      name: c.name,
      mana_cost: c.mana_cost,
    }));
  } catch {
    return [];
  }
}

/**
 * Searches for valid partner commanders matching the query.
 * Includes cards with Partner, Friends Forever, Doctor's Companion keywords,
 * and "can be your commander" oracle text.
 * When backgroundEligible is true, also includes Background enchantments
 * (for commanders with "Choose a Background").
 */
export async function scryfallPartnerSearch(query: string, backgroundEligible: boolean): Promise<ScryfallSearchResult[]> {
  if (query.length < 2) return [];
  try {
    const bgClause = backgroundEligible ? ' OR t:background' : '';
    const q = `name:${query} (t:legendary (kw:partner OR kw:friends-forever OR kw:doctor's-companion) OR o:"can be your commander"${bgClause})`;
    const res = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}&unique=names&order=name&page=1`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return ((data.data as { name: string; mana_cost?: string }[]) ?? []).map((c) => ({
      name: c.name,
      mana_cost: c.mana_cost,
    }));
  } catch {
    return [];
  }
}

/** Returns the oracle text for a card (handles DFCs). */
export function getOracleText(card: ScryfallCard): string {
  return card.oracle_text ?? card.card_faces?.[0]?.oracle_text ?? '';
}

export async function scryfallGetCard(name: string): Promise<ScryfallCard | null> {
  try {
    const res = await fetch(
      `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`
    );
    if (!res.ok) return null;
    return (await res.json()) as ScryfallCard;
  } catch {
    return null;
  }
}

export function getCardArtCrop(card: ScryfallCard): string | null {
  if (card.image_uris?.art_crop) return card.image_uris.art_crop;
  if (card.card_faces?.[0]?.image_uris?.art_crop) return card.card_faces[0].image_uris.art_crop;
  return null;
}
