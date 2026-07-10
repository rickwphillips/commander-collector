'use client';

import { Typography } from '@mui/material';
import type { ThreatSource } from '@/game-manager/threatSource';

// Lefts kept left-weighted (0-45%) so the long, nowrap names fill a wide
// container (2HG shared life) without leaving a gap on the left, while still
// covering PlayerCard's taller container (extra length just runs off, clipped).
const POSITIONS = [
  { top: '10%', left: '2%',  rotate: -18 },
  { top: '74%', left: '20%', rotate:  11 },
  { top: '42%', left: '44%', rotate:  -6 },
  { top: '84%', left: '6%',  rotate:  20 },
  { top: '22%', left: '30%', rotate:  -9 },
];

/**
 * Floating threatening-commander names over the life number, lifted verbatim
 * from PlayerCard and shared with TeamPanel. Fades/pulses in as the biggest
 * commander-damage threat (threatSource) approaches lethal. `fingerprint` (the
 * seat / team number) just varies the rotation. Render inside the same
 * position:relative container as the life number.
 */
export function ThreatNames({ threatSource, fingerprint }: { threatSource?: ThreatSource | null; fingerprint: number }) {
  if (!threatSource?.cmdName || !(threatSource.intensity > 0)) return null;
  const { cmdName, intensity } = threatSource;
  return (
    <>
      {POSITIONS.map(({ top, left, rotate }, i) => (
        <Typography key={`threat-${i}`} sx={{
          position: 'absolute', top, left,
          fontSize: 18 + (i % 3) * 4,
          fontWeight: 900,
          fontFamily: '"Georgia", "Palatino Linotype", serif',
          fontStyle: 'italic',
          color: 'error.main',
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0,
          transition: 'opacity 0.6s ease',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          lineHeight: 1,
          textShadow: `0 0 8px rgba(180,0,0,${(intensity * 0.4).toFixed(2)})`,
          animation: `threatNamePulse ${1.8 + i * 0.3}s ease-in-out infinite`,
          '@keyframes threatNamePulse': {
            '0%, 100%': { opacity: intensity * (0.09 + i * 0.02), transform: `rotate(${rotate + (fingerprint % 3) * 5}deg) scale(1)` },
            '50%': { opacity: intensity * (0.18 + i * 0.04), transform: `rotate(${rotate + (fingerprint % 3) * 5}deg) scale(1.06)` },
          },
        }}>
          {cmdName}
        </Typography>
      ))}
    </>
  );
}
