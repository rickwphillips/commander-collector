'use client';

import { Box, Stack } from '@mui/material';
import { ManaSymbol } from '@/components/ManaSymbol';
import { ASSET_BASE } from '@/lib/api';

/**
 * Basic single-color symbols — use ManaSymbol (styled local SVG with
 * active-ring and interaction support).
 */
const COLORED = new Set(['W', 'U', 'B', 'R', 'G', 'C']);

/**
 * All symbol codes we have cached in public/mana/.
 * Any token whose derived code is in this set gets a local <img>.
 * Everything else falls back to the generic colorless badge.
 */
const CACHED_CODES = new Set([
  // Hybrid two-color
  'WU','WB','UB','UR','BR','BG','RG','RW','GW','GU',
  // Phyrexian single-color
  'WP','UP','BP','RP','GP','CP',
  // Phyrexian hybrid
  'WUP','WBP','UBP','URP','BRP','BGP','RGP','RWP','GUP','GWP',
  // Colorless hybrid (generic + color)
  '2W','2U','2B','2R','2G',
  // Colorless identity hybrid
  'CW','CU','CB','CR','CG',
  // Generic / variable
  'X','Y','Z',
  // Numbers 0–20, plus large values
  '0','1','2','3','4','5','6','7','8','9',
  '10','11','12','13','14','15','16','17','18','19','20',
  '100','1000000',
  // Special
  'S',   // snow
  'E',   // energy
  'T',   // tap
  'Q',   // untap
  'P',   // Phyrexian generic
  'A',   // acorn
  'H',   // half (colorless)
  'HW',  // half white
  'HR',  // half red
  'PW',  // planeswalker
  'TK',  // ticket
  'L',   // legacy
  'D',   // doom
  'CHAOS',
]);

interface Props {
  cost: string;
  /**
   * Size of each symbol in rem. Local SVG images and colorless badges use rem
   * directly; ManaSymbol pips convert at 16 px/rem. Defaults to 0.75.
   */
  size?: number;
}

/**
 * Parses an MTG mana cost string like "{2}{W/U}{W}" and renders each token:
 * - Basic colors (W U B R G C)  → ManaSymbol (styled local SVG)
 * - Any other cached code        → <img> from local public/mana/{code}.svg
 * - Unknown token                → colorless circular text badge (fallback)
 */
export function ManaCost({ cost, size = 0.75 }: Props) {
  const tokens = [...cost.matchAll(/\{([^}]+)\}/g)].map(m => m[1]);
  if (!tokens.length) return null;

  const px = Math.round(size * 16);

  return (
    <Stack
      component="span"
      direction="row"
      spacing={0.25}
      alignItems="center"
      sx={{ display: 'inline-flex', verticalAlign: 'middle', flexShrink: 0, lineHeight: 1 }}
    >
      {tokens.map((token, i) => {
        // ── Basic colored pip ────────────────────────────────────────────────
        if (COLORED.has(token)) {
          return <ManaSymbol key={i} color={token} size={px} tooltip={false} />;
        }

        // ── Cached local SVG ─────────────────────────────────────────────────
        const code = token.replace('/', '');
        if (CACHED_CODES.has(code)) {
          return (
            <Box
              key={i}
              component="img"
              src={`${ASSET_BASE}/mana/${code}.svg`}
              alt={token}
              sx={{
                width: `${size}rem`,
                height: `${size}rem`,
                display: 'inline-block',
                flexShrink: 0,
                verticalAlign: 'middle',
              }}
            />
          );
        }

        // ── Unknown token — colorless text badge ─────────────────────────────
        return (
          <Box
            key={i}
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${size}rem`,
              height: `${size}rem`,
              borderRadius: '50%',
              bgcolor: 'grey.500',
              color: 'common.white',
              fontSize: `${size * 0.62}rem`,
              fontWeight: 800,
              lineHeight: 1,
              flexShrink: 0,
              letterSpacing: '-0.03em',
            }}
          >
            {token}
          </Box>
        );
      })}
    </Stack>
  );
}
