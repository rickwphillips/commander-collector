'use client';

import { Box, Typography } from '@mui/material';
import { ASSET_BASE } from '@/lib/api';

/**
 * Shared counter icons (poison / energy / XP / tax), lifted from PlayerCard so
 * the standard panel and the 2HG TeamPanel render the SAME glyphs instead of
 * each hand-rolling its own (the 2HG panel used bare ⚡ / ✦ chars before).
 */

// Local copies only — no external image links. Files live in public/symbols/.
export const XP_ICON_SRC = `${ASSET_BASE}/symbols/xp.png`;
// Phyrexian vector (also used by PoisonOverlay); masked so we can tint it green.
export const PHYREXIAN_SRC = `${ASSET_BASE}/symbols/phyrexian.svg`;
// The experience-counter symbol is the Commander emblem. Transparent SVG,
// masked + gold-tinted, so there is no baked-in white background.
export const COMMANDER_SRC = `${ASSET_BASE}/symbols/commander.svg`;
// The energy-counter symbol {E}, masked + cyan-tinted.
export const ENERGY_SRC = `${ASSET_BASE}/symbols/energy.svg`;

export type CounterKind = 'poison' | 'energy' | 'xp' | 'tax';

export function CounterGlyph({
  kind,
  size,
  poison = 0,
  poisonDanger = 10,
  taxValue = 0,
}: {
  kind: CounterKind;
  /** Icon box size (px or css length), e.g. sizes.fsSourceName. */
  size: number | string;
  /** Current poison, for the skull color ramp (poison kind only). */
  poison?: number;
  /** Poison at/above which the skull turns red (poison kind only). */
  poisonDanger?: number;
  /** Current tax, shown in the medallion as +{taxValue*2} (tax kind only). */
  taxValue?: number;
}) {
  switch (kind) {
    case 'poison': {
      // Green Phyrexian symbol (ramps to red at lethal poison), tinted via a CSS
      // mask. Rendered larger (1.4x) than the other glyphs per design.
      const big = typeof size === 'number' ? size * 1.4 : `calc(${size} * 1.4)`;
      return (
        <Box sx={{
          width: big, height: big, display: 'inline-block', flexShrink: 0,
          bgcolor: poison >= poisonDanger ? '#e53935' : '#66BB6A',
          maskImage: `url(${PHYREXIAN_SRC})`, WebkitMaskImage: `url(${PHYREXIAN_SRC})`,
          maskSize: 'contain', WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center', WebkitMaskPosition: 'center',
        }} />
      );
    }
    case 'energy':
      // Energy {E} symbol, masked + cyan-tinted.
      return (
        <Box sx={{
          width: size, height: size, display: 'inline-block', flexShrink: 0,
          bgcolor: '#4FC8FF',
          maskImage: `url(${ENERGY_SRC})`, WebkitMaskImage: `url(${ENERGY_SRC})`,
          maskSize: 'contain', WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center', WebkitMaskPosition: 'center',
        }} />
      );
    case 'xp':
      // Commander emblem (the experience-counter symbol), masked + gold-tinted.
      return (
        <Box sx={{
          width: size, height: size, display: 'inline-block', flexShrink: 0,
          bgcolor: '#DAA520',
          maskImage: `url(${COMMANDER_SRC})`, WebkitMaskImage: `url(${COMMANDER_SRC})`,
          maskSize: 'contain', WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center', WebkitMaskPosition: 'center',
        }} />
      );
    case 'tax': {
      // Larger containing circle (1.6x) with proportional inner text.
      const big = typeof size === 'number' ? size * 1.6 : `calc(${size} * 1.6)`;
      const inner = typeof size === 'number' ? size * 0.72 : `calc(${size} * 0.72)`;
      return (
        <Box sx={{ width: big, height: big, flexShrink: 0, borderRadius: '50%', background: 'radial-gradient(circle at 38% 35%, #d0d0d0, #7a7a7a)', border: '1px solid #3a3a3a', boxShadow: '0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: inner, fontWeight: 800, color: '#111', lineHeight: 1, userSelect: 'none' }}>+{taxValue * 2}</Typography>
        </Box>
      );
    }
  }
}
