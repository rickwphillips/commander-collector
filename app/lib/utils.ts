import type { MtgColor } from './types';

export const MTG_COLORS = ['W', 'U', 'B', 'R', 'G'] as const satisfies readonly MtgColor[];
export const MTG_COLORS_WITH_C = ['W', 'U', 'B', 'R', 'G', 'C'] as const;

export function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
