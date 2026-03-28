export interface ScryfallCard {
  id: string;
  name: string;
  image_uris?: { art_crop: string; normal: string; small: string };
  card_faces?: Array<{ name: string; image_uris?: { art_crop: string; normal: string; small: string } }>;
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
