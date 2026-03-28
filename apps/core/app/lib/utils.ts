import type { MtgColor } from './types';

export const MTG_COLORS = ['W', 'U', 'B', 'R', 'G'] as const satisfies readonly MtgColor[];
export const MTG_COLORS_WITH_C = ['W', 'U', 'B', 'R', 'G', 'C'] as const;

export function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ── MTG color combination names ───────────────────────────────────

const COLOR_ORDER = 'WUBRG';

export function sortColors(colors: string[]): string {
  return [...colors].sort((a, b) => COLOR_ORDER.indexOf(a) - COLOR_ORDER.indexOf(b)).join('');
}

export const GUILD_NAMES: Record<string, string> = {
  WU: 'Azorius', WB: 'Orzhov', WR: 'Boros', WG: 'Selesnya',
  UB: 'Dimir', UR: 'Izzet', UG: 'Simic', BR: 'Rakdos', BG: 'Golgari', RG: 'Gruul',
};

export const SHARD_NAMES: Record<string, string> = {
  WUG: 'Bant', WUB: 'Esper', UBR: 'Grixis', BRG: 'Jund', WRG: 'Naya',
};

export const WEDGE_NAMES: Record<string, string> = {
  WBG: 'Abzan', WUR: 'Jeskai', UBG: 'Sultai', WBR: 'Mardu', URG: 'Temur',
};

export const FIVE_COLOR_NAME = 'Five-Color';
export const FOUR_COLOR_NAMES: Record<string, string> = {
  WUBR: 'Non-Green', WUBG: 'Non-Red', WURR: 'Non-Black',
  WBRG: 'Non-Blue', UBRG: 'Non-White',
};

/** Returns the guild/shard/wedge name for a color combination, or undefined if none. */
export function getColorNickname(colors: string[]): string | undefined {
  if (colors.includes('C')) return undefined;
  const key = sortColors(colors);
  if (colors.length === 2) return GUILD_NAMES[key];
  if (colors.length === 3) return SHARD_NAMES[key] ?? WEDGE_NAMES[key];
  if (colors.length === 5) return FIVE_COLOR_NAME;
  return undefined;
}
