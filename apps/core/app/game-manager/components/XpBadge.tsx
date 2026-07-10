'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useXpKeyframes } from './PlayerCard.keyframes';
import { xpGlowFor } from './counterEffects';
import { XP_ICON_SRC } from './CounterGlyph';

/**
 * useXpFlash — detect a transient XP increase to drive the celebration burst.
 * Shared by the standard panel (PlayerPanel) and each 2HG teammate, so the
 * flash detection lives in one place instead of being re-implemented per panel.
 */
export function useXpFlash(experience: number): { xpFlashing: boolean; xpRippleKey: number } {
  const [xpFlashing, setXpFlashing] = useState(false);
  const [xpRippleKey, setXpRippleKey] = useState(0);
  const prev = useRef(experience);
  useEffect(() => {
    if (experience > prev.current) {
      setXpFlashing(true);
      setXpRippleKey((k) => k + 1);
      const t = setTimeout(() => setXpFlashing(false), 700);
      prev.current = experience;
      return () => clearTimeout(t);
    }
    prev.current = experience;
  }, [experience]);
  return { xpFlashing, xpRippleKey };
}

/**
 * XpBadge — the XP celebration badge: a gold diamond with the XP number, steady
 * ember + rune glow + shimmer while experience > 0, and a level-up flash +
 * ripple on each increment. Lifted verbatim from PlayerCard's header badge so
 * BOTH panels render the identical celebration (the 2HG panel renders it as its
 * XP counter value). Self-gates: returns null at 0 XP.
 */
export function XpBadge({ experience, flashing, rippleKey }: {
  experience: number;
  flashing: boolean;
  rippleKey: number;
}) {
  const { intensity, glow } = xpGlowFor(experience);
  const { xpFlashAnim, xpRippleAnim, xpLevelUpAnim, xpShimmerSweepAnim, xpEmberAnim, xpRuneGlowAnim } =
    useXpKeyframes(experience, glow, intensity);
  if (experience <= 0) return null;
  return (
    <Box sx={{
      position: 'relative', flexShrink: 0, width: 34, height: 34,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'visible',
      ...(xpRuneGlowAnim && { animation: `${xpRuneGlowAnim} 2.5s ease-in-out infinite${flashing ? `, ${xpLevelUpAnim} 0.7s ease-out` : ''}` }),
    }}>
      {/* Ember particles drifting upward */}
      {xpEmberAnim && [0, 1, 2, 3].map((i) => (
        <Box key={i} sx={{
          position: 'absolute',
          width: i % 2 === 0 ? 3 : 2, height: i % 2 === 0 ? 3 : 2,
          borderRadius: '50%',
          bgcolor: i % 2 === 0 ? '#FFD700' : '#FFA040',
          bottom: '55%',
          left: `${15 + i * 20}%`,
          pointerEvents: 'none',
          animation: `${xpEmberAnim} ${1.1 + i * 0.35}s ease-out ${i * 0.38}s infinite`,
        }} />
      ))}
      {/* Diamond shape with shimmer sweep inside */}
      <Box sx={{
        position: 'absolute',
        width: 26, height: 26,
        transform: 'rotate(45deg)',
        background: 'linear-gradient(135deg, #FFD700, #8B6914)',
        border: '1.5px solid rgba(255,215,0,0.85)',
        boxShadow: '0 2px 8px rgba(218,165,32,0.55)',
        overflow: 'hidden',
        ...(flashing && { animation: `${xpFlashAnim} 0.7s ease-out` }),
      }}>
        {xpShimmerSweepAnim && (
          <Box sx={{
            position: 'absolute', top: '-20%', left: 0,
            width: '28%', height: '140%',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.72), transparent)',
            pointerEvents: 'none',
            animation: `${xpShimmerSweepAnim} 7.5s linear infinite`,
          }} />
        )}
      </Box>
      {/* Ripple — also diamond */}
      <Box key={rippleKey} sx={{
        position: 'absolute', top: '50%', left: '50%',
        width: 26, height: 26,
        border: '2px solid rgba(255,215,0,0.8)',
        pointerEvents: 'none',
        animation: `${xpRippleAnim} 0.7s ease-out forwards`,
      }} />
      {/* Text — unrotated, on top */}
      <Stack direction="column" alignItems="center" spacing={0} sx={{ position: 'relative' }}>
        <Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: 10, height: 10, objectFit: 'contain', mixBlendMode: 'multiply' }} />
        <Typography sx={{ fontSize: 9, fontWeight: 900, color: '#111', lineHeight: 1, userSelect: 'none' }}>{experience}</Typography>
      </Stack>
    </Box>
  );
}
