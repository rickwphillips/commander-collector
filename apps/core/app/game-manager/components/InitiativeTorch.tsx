'use client';

import { keyframes } from '@emotion/react';
import { Box } from '@mui/material';
import { ASSET_BASE } from '@/lib/api';

/**
 * Initiative torch overlay — lifted verbatim from PlayerCard, shared with
 * TeamPanel. Dungeon wall + drifting flickering torch, gated on `visible`.
 */

// cohesive render concern across two files without any reuse upside.
const initiativeFadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const torchDrift = keyframes`
  0%   { transform: translateX(-600%) rotate(12deg);  }
  7%   { transform: translateX(-80%)  rotate(11deg);  }
  14%  { transform: translateX(30%)   rotate(12deg);  }
  19%  { transform: translateX(-20%)  rotate(10deg);  }
  24%  { transform: translateX(-90%)  rotate(10deg);  }
  31%  { transform: translateX(10%)   rotate(12deg);  }
  39%  { transform: translateX(150%)  rotate(13deg);  }
  44%  { transform: translateX(70%)   rotate(11deg);  }
  50%  { transform: translateX(600%)  rotate(14deg);  }
  57%  { transform: translateX(120%)  rotate(-12deg); }
  63%  { transform: translateX(-30%)  rotate(-11deg); }
  68%  { transform: translateX(50%)   rotate(-12deg); }
  73%  { transform: translateX(20%)   rotate(-10deg); }
  79%  { transform: translateX(-110%) rotate(-11deg); }
  85%  { transform: translateX(-600%) rotate(-13deg); }
  91%  { transform: translateX(-140%) rotate(11deg);  }
  96%  { transform: translateX(-600%) rotate(12deg);  }
  100% { transform: translateX(-600%) rotate(12deg);  }
`;
const torchFlicker = keyframes`
  0%   { opacity: 0.17; }
  3%   { opacity: 0.13; }
  5%   { opacity: 0.18; }
  14%  { opacity: 0.16; }
  16%  { opacity: 0.12; }
  17%  { opacity: 0.18; }
  28%  { opacity: 0.17; }
  31%  { opacity: 0.11; }
  33%  { opacity: 0.16; }
  34%  { opacity: 0.19; }
  48%  { opacity: 0.15; }
  51%  { opacity: 0.13; }
  53%  { opacity: 0.18; }
  62%  { opacity: 0.17; }
  64%  { opacity: 0.11; }
  65%  { opacity: 0.17; }
  79%  { opacity: 0.14; }
  82%  { opacity: 0.18; }
  83%  { opacity: 0.12; }
  85%  { opacity: 0.17; }
  94%  { opacity: 0.15; }
  97%  { opacity: 0.13; }
  100% { opacity: 0.17; }
`;
const flameAnim = keyframes`
  0%   { transform: scaleX(1)    scaleY(1)    skewX(0deg);   }
  10%  { transform: scaleX(0.82) scaleY(1.06) skewX(-4deg);  }
  22%  { transform: scaleX(1.12) scaleY(0.93) skewX(3deg);   }
  35%  { transform: scaleX(0.88) scaleY(1.10) skewX(-2deg);  }
  48%  { transform: scaleX(1.06) scaleY(0.90) skewX(5deg);   }
  60%  { transform: scaleX(0.79) scaleY(1.07) skewX(-5deg);  }
  72%  { transform: scaleX(1.10) scaleY(0.96) skewX(2deg);   }
  85%  { transform: scaleX(0.91) scaleY(1.04) skewX(-3deg);  }
  100% { transform: scaleX(1)    scaleY(1)    skewX(0deg);   }
`;

export function InitiativeTorch({ visible }: { visible: boolean }) {
  return (
    <>
      {/* ── Initiative torch flicker overlay ── */}
      {visible && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', animation: `${initiativeFadeIn} 3s ease-in forwards` }}>
          {/* Stone wall texture */}
          <Box sx={{
            position: 'absolute', inset: 0, opacity: 0.3,
            backgroundImage: `url(${ASSET_BASE}/dungeon.jpg)`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          {/* Torch + glow (drift together) */}
          <Box sx={{
            position: 'absolute', bottom: -90, left: '50%',
            animation: `${torchDrift} 42s ease-in-out infinite`,
          }}>
            {/* Glow */}
            <Box sx={{
              position: 'absolute',
              width: 500, height: 500,
              top: -220, left: -205,
              background: 'radial-gradient(ellipse at center, #FF8C00 0%, #FF4500 20%, transparent 65%)',
              animation: `${torchFlicker} 8s ease-in-out infinite`,
              pointerEvents: 'none',
            }} />
            {/* Torch silhouette */}
            <Box component="svg" viewBox="0 0 60 180" sx={{
              width: 90, height: 270, opacity: 0.35, fill: '#0A0400', display: 'block',
            }}>
              <Box component="g" sx={{ transformOrigin: '30px 70px', animation: `${flameAnim} 0.45s ease-in-out infinite` }}>
                <path d="M30 2 C20 18, 12 32, 14 48 C15 58, 20 66, 30 70 C40 66, 45 58, 46 48 C48 32, 40 18, 30 2Z" />
                <path d="M30 14 C25 24, 21 34, 23 44 C24 52, 27 58, 30 60 C33 58, 36 52, 37 44 C39 34, 35 24, 30 14Z" style={{ fill: '#2A1000' }} />
              </Box>
              <rect x="18" y="66" width="24" height="18" rx="3" />
              <rect x="24" y="84" width="12" height="88" rx="3" />
              <rect x="21" y="100" width="18" height="4" rx="2" />
              <rect x="21" y="114" width="18" height="4" rx="2" />
              <rect x="21" y="128" width="18" height="4" rx="2" />
              <ellipse cx="30" cy="172" rx="8" ry="4" />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
