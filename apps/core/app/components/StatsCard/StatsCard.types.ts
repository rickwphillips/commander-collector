import type { ReactNode } from 'react';

/**
 * Named accent profiles. These are the keys of the `$accents` map in
 * app/styles/_palette.scss; each one resolves to a build-time set of border,
 * wash, glow, and text colours. Adding a profile means adding it there, not
 * passing a new hex from a call site.
 */
export type StatsCardAccent = 'primary' | 'secondary' | 'gold' | 'sand';

/** Accent used when a caller does not pick one (burnt orange, the theme primary). */
export const DEFAULT_STATS_CARD_ACCENT: StatsCardAccent = 'primary';

/** Props for {@link StatsCard}. */
export interface StatsCardProps {
  /** Label above the value, e.g. "Total Games". */
  title: string;
  /** The headline figure. Pre-formatted by the caller (percentages, fixed decimals). */
  value: string | number;
  /** Optional line under the value, e.g. "Last 30 days". */
  subtitle?: string;
  /** Optional glyph rendered left of the title, tinted to match the accent. */
  icon?: ReactNode;
  /** Which accent profile to wear. Defaults to {@link DEFAULT_STATS_CARD_ACCENT}. */
  accent?: StatsCardAccent;
  /** When set, the value becomes a next/link to this route. */
  href?: string;
}
