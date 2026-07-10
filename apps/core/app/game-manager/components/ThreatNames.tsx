'use client';

import { Typography } from '@mui/material';
import type { ThreatSource } from '@/game-manager/threatSource';

const POSITIONS = [
  { top: '10%', left: '6%',  rotate: -18 },
  { top: '74%', left: '55%', rotate:  11 },
  { top: '42%', left: '62%', rotate:  -6 },
  { top: '84%', left: '8%',  rotate:  20 },
  { top: '22%', left: '48%', rotate:  -9 },
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
