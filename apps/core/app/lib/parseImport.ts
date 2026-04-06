/**
 * Card list import parser.
 * Supports: TCGPlayer, Moxfield, Archidekt, Arena, MTGO, Tappedout text formats + TTS JSON.
 */

export interface ParsedCard {
  card_name: string;
  quantity: number;
  is_commander: boolean;
  is_proxy: boolean;
}

export function parseImport(raw: string): { cards: ParsedCard[]; deckName: string | null } {
  const text = raw.trim();

  // TTS saved-object JSON
  try {
    const json = JSON.parse(text);
    const state   = json?.ObjectStates?.[0];
    const objects = state?.ContainedObjects;
    if (Array.isArray(objects)) {
      const counts = new Map<string, number>();
      for (const obj of objects) {
        const name = (obj?.Nickname as string | undefined)?.trim();
        if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
      }
      return {
        deckName: (state?.Nickname as string | undefined) || null,
        cards: Array.from(counts, ([card_name, quantity]) => ({
          card_name, quantity, is_commander: false, is_proxy: false,
        })),
      };
    }
  } catch { /* not JSON */ }

  // Text formats: TCGPlayer · Moxfield · Archidekt · Arena · MTGO · Tappedout
  const cards: ParsedCard[] = [];
  let inCommander = false;
  let inSideboard = false;

  for (const rawLine of text.split('\n')) {
    const line    = rawLine.trim();
    if (!line) continue;

    const stripped = line.replace(/^\/\/\s*/, '').trim().toLowerCase();

    // Section markers
    if (['sideboard', 'sb:'].includes(stripped))         { inSideboard = true;  inCommander = false; continue; }
    if (['deck', 'main', 'maindeck'].includes(stripped)) { inSideboard = false; inCommander = false; continue; }
    if (stripped === 'commander')                         { inCommander = true;  inSideboard = false; continue; }

    if (line.startsWith('//') || line.startsWith('#')) {
      if (stripped.includes('sideboard'))  { inSideboard = true;  inCommander = false; }
      else if (stripped.includes('commander')) { inCommander = true;  inSideboard = false; }
      else                                 { inCommander = false; }
      continue;
    }

    if (inSideboard) continue;

    // <qty>[x] <name> [optional set code / *tags*]
    const m = line.match(/^(\d+)[xX]?\s+(.+)$/);
    if (!m) continue;

    const qty         = parseInt(m[1], 10);
    let   name        = m[2].trim();
    const hasCmdrTag  = /\*CMDR\*/i.test(name);

    // Strip "(SET) 123", "[SET]", "*TAG*"
    name = name.replace(/\s+\([A-Za-z0-9-]{2,6}\)\s*\d*\s*$/, '').trim();
    name = name.replace(/\s+\[[^\]]+\]\s*$/,                   '').trim();
    name = name.replace(/(\s+\*\w+\*)+\s*$/gi,                 '').trim();

    if (!name || qty < 1) continue;

    cards.push({ card_name: name, quantity: qty, is_commander: inCommander || hasCmdrTag, is_proxy: false });
  }

  return { cards, deckName: null };
}
