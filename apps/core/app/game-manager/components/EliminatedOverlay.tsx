'use client';

import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

/**
 * Eliminated / Conceded / Poisoned overlay — lifted verbatim from PlayerCard,
 * shared with TeamPanel. Shows the outcome word across the surface; a conceded
 * (non-poison) loss also cries a row of falling tears. `poisoned` is passed by
 * the caller so each surface uses its own lethal threshold (10 singles / 15 2HG).
 */
const tearFall = keyframes`
  0%   { transform: translateY(-12px) translateX(0px) scaleY(1);    opacity: 0; }
  8%   { opacity: 0.85; }
  40%  { transform: translateY(40%)  translateX(4px)  scaleY(1.1);  opacity: 0.75; }
  75%  { transform: translateY(80%)  translateX(-3px) scaleY(0.95); opacity: 0.4; }
  100% { transform: translateY(110%) translateX(1px)  scaleY(1);    opacity: 0; }
`;
const TEARS = [
  { left: '12%', delay: '0s',    dur: '2.9s' },
  { left: '28%', delay: '1.1s',  dur: '3.2s' },
  { left: '45%', delay: '0.4s',  dur: '2.6s' },
  { left: '60%', delay: '1.7s',  dur: '3.4s' },
  { left: '76%', delay: '0.7s',  dur: '2.8s' },
  { left: '88%', delay: '2.0s',  dur: '3.1s' },
];

export function EliminatedOverlay({ eliminated, conceded, poisoned }: { eliminated: boolean; conceded: boolean; poisoned: boolean }) {
  if (!eliminated) return null;
  return (
    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11, pointerEvents: 'none', bgcolor: conceded && !poisoned ? 'rgba(218,165,32,0.12)' : 'transparent', overflow: 'hidden' }}>
      {conceded && !poisoned && TEARS.map((t, i) => (
        <Box key={i} sx={{
          position: 'absolute', top: 0, left: t.left,
          width: 7, height: 11,
          borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
          bgcolor: 'rgba(120, 190, 255, 0.8)',
          boxShadow: '0 0 5px rgba(120,190,255,0.5)',
          animation: `${tearFall} ${t.dur} ${t.delay} ease-in infinite`,
        }} />
      ))}
      <Typography
        sx={{ fontWeight: 900, letterSpacing: 4, fontSize: 48, transform: 'rotate(-15deg)', color: poisoned ? undefined : conceded ? '#DAA520' : 'error.main' }}
        style={poisoned ? { color: '#00c853', WebkitTextFillColor: '#00c853', WebkitTextStroke: '2px black' } : conceded ? { WebkitTextStroke: '2px black' } : undefined}
      >
        {poisoned ? 'POISONED' : conceded ? 'CONCEDED' : 'ELIMINATED'}
      </Typography>
    </Box>
  );
}
