'use client';

import { keyframes } from '@emotion/react';
import { Box, Typography } from '@mui/material';
import { useProxiedArtUrl } from './CommanderArt';
import type { ThreatSource } from '@/game-manager/threatSource';

/**
 * City's Blessing decoration suite — lifted verbatim from PlayerCard, shared
 * with TeamPanel. God rays, castle + houses, hills, skyline, cathedral,
 * fireworks, clouds and marching flags, all gated on `visible` / `exiting`.
 * Scoped to the nearest positioned ancestor via each block's inset/absolute.
 */

// ─── keyframes ───
// Inlined here rather than extracted to a sibling module: all of these animate
// a single cohesive decorative block (god rays, castle, cathedral, fireworks,
// clouds, marching flags) and have no consumer outside Block C.
const fwRocket = keyframes`
  0%,60%   { transform:translate(-50%, 500px); opacity:0; }
  61%      { transform:translate(-50%, 500px); opacity:0.55; }
  82%      { transform:translate(-50%, -8px);  opacity:0.3; }
  83%,100% { transform:translate(-50%, -8px);  opacity:0; }
`;
const cloudDrift = keyframes`
  0%   { transform: translateX(500px); opacity: 0;    }
  8%   { opacity: 0.30; }
  88%  { opacity: 0.25; }
  100% { transform: translateX(-280px); opacity: 0;  }
`;
const castleSlideIn = keyframes`
  from { transform: translateX(-280px); opacity: 0; }
  to   { transform: translateX(0);      opacity: 1; }
`;
const castleSlideOut = keyframes`
  from { transform: translateX(0);      opacity: 1; }
  to   { transform: translateX(-280px); opacity: 0; }
`;
const castleSlideInRight = keyframes`
  from { transform: translateX(240px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
`;
const castleSlideOutRight = keyframes`
  from { transform: translateX(0);     opacity: 1; }
  to   { transform: translateX(240px); opacity: 0; }
`;
const skylineFadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const skylineFadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;
const godRaysFadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const godRaysFadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;
const fwFadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;
const godRaysPulse = keyframes`
  0%   { opacity: 0.8; }
  40%  { opacity: 1.0; }
  70%  { opacity: 0.7; }
  100% { opacity: 0.8; }
`;
const fwFlash = keyframes`
  0%,82%  { transform:translate(-50%,-50%) scale(0); opacity:0; }
  83%     { transform:translate(-50%,-50%) scale(2.2); opacity:0.55; }
  88%     { transform:translate(-50%,-50%) scale(0.9); opacity:0.25; }
  93%,100%{ transform:translate(-50%,-50%) scale(0); opacity:0; }
`;
const flagRise = keyframes`
  0%   { transform: translateY(220px); opacity: 0; }
  60%  { opacity: 1; }
  100% { transform: translateY(0);     opacity: 1; }
`;
const flagShape = keyframes`
  /* ── Gust 1 ── */
  0%   { clip-path: polygon(0px 0px, 58px  0px, 58px 42px, 0px 42px); }
  4%   { clip-path: polygon(0px 0px, 59px  0px, 59px 42px, 0px 42px); }
  8%   { clip-path: polygon(0px 0px, 62px -2px, 60px 45px, 0px 42px); }
  12%  { clip-path: polygon(0px 0px, 56px  2px, 56px 39px, 0px 42px); }
  16%  { clip-path: polygon(0px 0px, 61px -1px, 59px 44px, 0px 42px); }
  20%  { clip-path: polygon(0px 0px, 56px  2px, 57px 40px, 0px 42px); }
  24%  { clip-path: polygon(0px 0px, 60px -1px, 58px 43px, 0px 42px); }
  27%  { clip-path: polygon(0px 0px, 57px  1px, 57px 41px, 0px 42px); }
  30%  { clip-path: polygon(0px 0px, 59px  0px, 58px 43px, 0px 42px); }
  32%  { clip-path: polygon(0px 0px, 58px  0px, 58px 42px, 0px 42px); }
  /* ── Calm 1 ── */
  40%  { clip-path: polygon(0px 0px, 57px  3px, 61px 46px, 0px 42px); }
  50%  { clip-path: polygon(0px 0px, 56px  5px, 63px 48px, 0px 42px); }
  56%  { clip-path: polygon(0px 0px, 57px  2px, 60px 45px, 0px 42px); }
  58%  { clip-path: polygon(0px 0px, 58px  0px, 58px 42px, 0px 42px); }
  /* ── Gust 2 ── */
  63%  { clip-path: polygon(0px 0px, 61px -2px, 60px 44px, 0px 42px); }
  67%  { clip-path: polygon(0px 0px, 56px  2px, 56px 40px, 0px 42px); }
  71%  { clip-path: polygon(0px 0px, 60px -1px, 59px 43px, 0px 42px); }
  75%  { clip-path: polygon(0px 0px, 57px  1px, 57px 41px, 0px 42px); }
  79%  { clip-path: polygon(0px 0px, 59px -1px, 58px 43px, 0px 42px); }
  83%  { clip-path: polygon(0px 0px, 59px  0px, 58px 42px, 0px 42px); }
  86%  { clip-path: polygon(0px 0px, 58px  0px, 58px 42px, 0px 42px); }
  /* ── Calm 2 ── */
  94%  { clip-path: polygon(0px 0px, 57px  3px, 61px 46px, 0px 42px); }
  100% { clip-path: polygon(0px 0px, 56px  5px, 63px 48px, 0px 42px); }
`;
const flagImageSkew = keyframes`
  0%   { transform: skewX( 0deg); }
  4%   { transform: skewX( 0deg); }
  8%   { transform: skewX(-3deg); }
  12%  { transform: skewX( 0deg); }
  16%  { transform: skewX(-3deg); }
  20%  { transform: skewX( 1deg); }
  24%  { transform: skewX(-2deg); }
  27%  { transform: skewX( 0deg); }
  30%  { transform: skewX(-1deg); }
  32%  { transform: skewX( 0deg); }
  40%  { transform: skewX( 5deg); }
  50%  { transform: skewX( 7deg); }
  56%  { transform: skewX( 4deg); }
  58%  { transform: skewX( 0deg); }
  63%  { transform: skewX(-2deg); }
  67%  { transform: skewX( 0deg); }
  71%  { transform: skewX(-2deg); }
  75%  { transform: skewX( 0deg); }
  79%  { transform: skewX(-1deg); }
  83%  { transform: skewX(-1deg); }
  86%  { transform: skewX( 0deg); }
  94%  { transform: skewX( 5deg); }
  100% { transform: skewX( 7deg); }
`;
const poleWiggle = keyframes`
  0%   { transform: rotate(13deg); }
  18%  { transform: rotate(27deg); }
  36%  { transform: rotate(9deg);  }
  54%  { transform: rotate(25deg); }
  72%  { transform: rotate(11deg); }
  88%  { transform: rotate(24deg); }
  100% { transform: rotate(13deg); }
`;
const flagRipple = keyframes`
  0%   { background-position: 200% 0;   opacity: 0; }
  2%   { background-position: 170% 0;   opacity: 1; }
  18%  { background-position: -80% 0;   opacity: 1; }
  26%  { background-position: -170% 0;  opacity: 0.3; }
  28%  { background-position: -200% 0;  opacity: 0; }
  53%  { background-position: 200% 0;   opacity: 0; }
  55%  { background-position: 170% 0;   opacity: 1; }
  71%  { background-position: -80% 0;   opacity: 1; }
  79%  { background-position: -170% 0;  opacity: 0.3; }
  81%  { background-position: -200% 0;  opacity: 0; }
  100% { background-position: 200% 0;   opacity: 0; }
`;
const flagMarch = keyframes`
  from { transform: translateX(-80%); }
  to   { transform: translateX(80%);  }
`;
const flagDrift = keyframes`
  0%   { transform: translateX(0px);   }
  22%  { transform: translateX(18px);  }
  45%  { transform: translateX(-10px); }
  68%  { transform: translateX(24px);  }
  85%  { transform: translateX(-6px);  }
  100% { transform: translateX(0px);   }
`;


// ─── constants + flag banner ───
const FW_DIRS: [number, number][] = [
  [0, -58], [41, -41], [58, 0], [41, 41], [0, 58], [-41, 41], [-58, 0], [-41, -41],
];
const FW_SPARK_COLORS = ['#FFD700', '#FF4444', '#4FC3F7', '#81C784', '#CE93D8', '#FF8A65', '#F06292', '#80DEEA'];
const fwSparks = FW_DIRS.map(([dx, dy]) => keyframes`
  0%,82%  { transform:translate(-50%,-50%) scale(0); opacity:0; }
  83%     { transform:translate(-50%,-50%) scale(1.3); opacity:0.65; }
  94%     { transform:translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0.5); opacity:0.45; }
  100%    { transform:translate(calc(-50% + ${dx * 1.55}px),calc(-50% + ${dy * 1.55}px)) scale(0); opacity:0; }
`);
const THREAT_STEAL_ORDER = [6, 1, 10, 3, 8, 0, 11, 4, 7, 2, 9, 5];
const CITY_FLAG_CONFIGS = [
  { left: '30%', bottom: -28, riseDelay: 4.00, wiggleDuration: 3.2, wiggleOffset:  0.0, driftDuration: 11.0, driftOffset:  0.0  },
  { left: '35%', bottom: -24, riseDelay: 4.12, wiggleDuration: 2.7, wiggleOffset: -0.9, driftDuration:  8.5, driftOffset: -2.3  },
  { left: '40%', bottom: -30, riseDelay: 4.25, wiggleDuration: 3.6, wiggleOffset: -1.8, driftDuration: 13.0, driftOffset: -5.1  },
  { left: '45%', bottom: -22, riseDelay: 4.06, wiggleDuration: 3.0, wiggleOffset: -2.4, driftDuration:  9.5, driftOffset: -1.4  },
  { left: '50%', bottom: -26, riseDelay: 4.38, wiggleDuration: 2.5, wiggleOffset: -0.6, driftDuration: 12.0, driftOffset: -3.8  },
  { left: '55%', bottom: -20, riseDelay: 4.18, wiggleDuration: 3.9, wiggleOffset: -1.5, driftDuration:  8.0, driftOffset: -6.5  },
  { left: '60%', bottom: -28, riseDelay: 4.44, wiggleDuration: 2.8, wiggleOffset: -2.1, driftDuration: 10.5, driftOffset: -0.7  },
  { left: '65%', bottom: -24, riseDelay: 4.08, wiggleDuration: 3.4, wiggleOffset: -1.2, driftDuration: 14.0, driftOffset: -4.2  },
  { left: '37%', bottom: -18, riseDelay: 4.30, wiggleDuration: 2.6, wiggleOffset: -1.7, driftDuration:  9.0, driftOffset: -7.0  },
  { left: '48%', bottom: -16, riseDelay: 4.52, wiggleDuration: 3.7, wiggleOffset: -2.7, driftDuration: 11.5, driftOffset: -2.9  },
  { left: '57%', bottom: -18, riseDelay: 4.20, wiggleDuration: 3.1, wiggleOffset: -0.4, driftDuration:  7.5, driftOffset: -5.5  },
  { left: '63%', bottom: -15, riseDelay: 4.40, wiggleDuration: 2.9, wiggleOffset: -2.0, driftDuration: 12.5, driftOffset: -1.8  },
];

interface CityFlagProps {
  left: string;
  bottom?: number;
  scale?: number;
  riseDelay: number;
  wiggleDuration: number;
  wiggleOffset: number;
  driftDuration: number;
  driftOffset: number;
  artCropUrl?: string;
  commanderName: string;
}

function CityFlag({ left, bottom = -25, scale = 1, riseDelay, wiggleDuration, wiggleOffset, driftDuration, driftOffset, artCropUrl, commanderName }: CityFlagProps) {
  const dur = `${wiggleDuration}s`;
  const off = `${wiggleOffset}s`;
  return (
    <Box sx={{
      position: 'absolute', left, bottom,
      pointerEvents: 'none', zIndex: 3,
      animation: `${flagRise} 1.4s ${riseDelay}s ease-out both`,
    }}>
      <Box sx={{ animation: `${flagDrift} ${driftDuration}s ${driftOffset}s ease-in-out infinite` }}>
      <Box sx={{ transform: `scaleX(-1) scale(${scale})`, transformOrigin: 'bottom center' }}>
      <Box sx={{
        position: 'relative',
        transformOrigin: 'bottom left',
        animation: `${poleWiggle} ${dur} ${off} ease-in-out infinite`,
      }}>
        <Box sx={{
          position: 'absolute', left: 3, top: 0,
          filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.65)) drop-shadow(0 0 2px rgba(218,165,32,0.55))',
          pointerEvents: 'none',
        }}>
          <Box sx={{ width: 72, height: 50, overflow: 'visible', animation: `${flagShape} ${dur} ${off} ease-in-out infinite` }}>
            <Box sx={{ position: 'relative', width: 72, height: 50, overflow: 'hidden' }}>
              {artCropUrl ? (
                <svg width="72" height="50" viewBox="0 0 72 50" style={{ display: 'block' }}>
                  <Box component="g" sx={{ transformBox: 'fill-box', transformOrigin: 'left top', animation: `${flagImageSkew} ${dur} ${off} ease-in-out infinite` }}>
                    <image href={artCropUrl} x="0" y="0" width="72" height="50" preserveAspectRatio="xMidYMin slice" />
                  </Box>
                </svg>
              ) : (
                <Box sx={{ width: '100%', height: '100%', bgcolor: 'rgba(20,12,4,0.90)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0.5, transform: 'scaleX(-1)', transformOrigin: 'left top', animation: `${flagImageSkew} ${dur} ${off} ease-in-out infinite` }}>
                  <Typography sx={{ fontSize: 7, fontWeight: 800, color: '#DAA520', textAlign: 'center', lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {commanderName}
                  </Typography>
                </Box>
              )}
              <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 18%, transparent 36%)', backgroundSize: '300% 100%', animation: `${flagRipple} ${dur} ${off} linear infinite` }} />
              <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.10) 18%, transparent 36%)', backgroundSize: '300% 100%', animation: `${flagRipple} ${dur} linear infinite`, animationDelay: `${wiggleOffset - wiggleDuration / 2}s` }} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ position: 'absolute', left: -2, top: -7, width: 7, height: 7, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFE066, #DAA520 55%, #8B6914)', boxShadow: '0 0 5px rgba(218,165,32,0.9)' }} />
        <Box sx={{ width: 3, height: 140, background: 'linear-gradient(to right, #DAA520, #8B6914)' }} />
      </Box>
      </Box>
      </Box>
    </Box>
  );
}


export function CityBlessing({ visible, exiting, threatSource, commander, commander2, scale = 1 }: {
  visible: boolean;
  exiting: boolean;
  threatSource?: ThreatSource | null;
  commander: { artCropUrl?: string; name: string };
  commander2?: { artCropUrl?: string; name: string };
  scale?: number;
}) {
  // Resolve the flag art by NAME through the phone-safe proxy (same path as
  // CommanderArt). The stored artCropUrl is often null (older games / after a
  // name edit), which is why the 2HG flags were falling back to the name text.
  const commanderArtSrc = useProxiedArtUrl(commander.name) ?? commander.artCropUrl;
  const commander2ArtSrc = useProxiedArtUrl(commander2?.name ?? undefined) ?? commander2?.artCropUrl;
  const homeFlags = commander2
    ? [{ name: commander.name, art: commanderArtSrc }, { name: commander2.name, art: commander2ArtSrc }]
    : [{ name: commander.name, art: commanderArtSrc }];
  // Resolve the threatening commander's art the same way, so the flag-steal fires
  // even when its stored crop is null (the common case, which was gating it off).
  const threatArtSrc = useProxiedArtUrl(threatSource?.cmdName ?? undefined) ?? threatSource?.artUrl ?? null;
  return (
    <>
      {/* ── City's Blessing god rays ── */}
      {visible && (
        <Box component="svg" preserveAspectRatio="none" viewBox="0 0 100 100"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0,
            // Blur so the ray edges blend softly instead of reading as
            // hard-edged polygons.
            filter: 'blur(4px)',
            animation: exiting
              ? `${godRaysFadeOut} 1.4s 0.3s ease-in forwards`
              : `${godRaysFadeIn} 2s 2s ease-out forwards, ${godRaysPulse} 6s 4s ease-in-out infinite`,
          }}>
          <defs>
            <linearGradient id="rayFade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#FFE050" stopOpacity="0.6"/>
              <stop offset="60%"  stopColor="#FFE050" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#FFE050" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <polygon points="0,0  4,100  22,100"  fill="url(#rayFade)" opacity="0.7"/>
          <polygon points="0,0  26,100 44,100"  fill="url(#rayFade)" opacity="0.5"/>
          <polygon points="0,0  48,100 66,100"  fill="url(#rayFade)" opacity="0.6"/>
          <polygon points="0,0  70,100 88,100"  fill="url(#rayFade)" opacity="0.4"/>
          <polygon points="0,0  92,100 100,84"  fill="url(#rayFade)" opacity="0.55"/>
          <polygon points="0,0  100,8 100,16"  fill="url(#rayFade)" opacity="0.45"/>
          <polygon points="0,0  100,38 100,46" fill="url(#rayFade)" opacity="0.35"/>
          <polygon points="0,0  100,65 100,73" fill="url(#rayFade)" opacity="0.45"/>
        </Box>
      )}

      {/* ── City's Blessing: castle + house row ── */}
      {visible && (
        <Box component="svg" viewBox="0 0 640 240" preserveAspectRatio="none" sx={{
          position: 'absolute', bottom: -55, left: -80,
          width: 'calc(100% + 80px)', height: 150 * scale,
          fill: (theme) => theme.palette.mode === 'dark' ? '#1a1510' : '#bcb4a9',
          stroke: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(95,85,72,0.45)',
          strokeWidth: 1.2,
          zIndex: 1, pointerEvents: 'none',
          animation: exiting
            ? `${castleSlideOut} 1.6s 1.6s ease-in forwards`
            : `${castleSlideIn} 1.8s ease-out forwards`,
        }}>
          <path d="
            M0,240
            L0,62 L40,26 L80,62
            L80,92 L86,92 L86,80 L94,80 L94,92 L102,92 L102,80 L110,80 L110,92
            L118,92 L118,80 L126,80 L126,92
            L126,68 L150,42 L174,68
            L174,92 L182,92 L182,80 L190,80 L190,92 L198,92 L198,80 L206,80 L206,92
            L214,92 L214,80 L222,80 L222,92
            L220,62 L260,30 L300,62
            L300,148
            L320,118 L340,148
            L360,130 L380,148
            L380,138 L396,84 L412,138
            L432,112 L452,138
            L452,142 L472,96 L492,142
            L512,120 L532,142
            L532,136 L550,82 L568,136
            L588,116 L608,138
            L608,142 L624,106 L640,132
            L640,240 Z
          " />
          <rect x="28"  y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="48"  y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="248" y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="268" y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="147" y="112" width="6" height="24" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <line x1="2"   y1="130" x2="78"  y2="130" stroke="rgba(0,0,0,0.5)"  strokeWidth="1.5"/>
          <line x1="222" y1="130" x2="298" y2="130" stroke="rgba(0,0,0,0.5)"  strokeWidth="1.5"/>
          <line x1="80"  y1="160" x2="220" y2="160" stroke="rgba(0,0,0,0.4)"  strokeWidth="1.5"/>
          <line x1="2"   y1="170" x2="78"  y2="170" stroke="rgba(0,0,0,0.3)"  strokeWidth="1"/>
          <line x1="2"   y1="200" x2="78"  y2="200" stroke="rgba(0,0,0,0.3)"  strokeWidth="1"/>
          <line x1="222" y1="170" x2="298" y2="170" stroke="rgba(0,0,0,0.3)"  strokeWidth="1"/>
          <line x1="222" y1="200" x2="298" y2="200" stroke="rgba(0,0,0,0.3)"  strokeWidth="1"/>
          <rect x="326" y="154" width="5" height="18" rx="1"/>
          <rect x="400" y="150" width="5" height="18" rx="1"/>
          <rect x="460" y="150" width="5" height="18" rx="1"/>
          <rect x="556" y="150" width="5" height="18" rx="1"/>
          <rect x="616" y="150" width="4" height="16" rx="1"/>
          <rect x="305" y="130" width="8" height="11" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="363" y="138" width="8" height="10" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="416" y="148" width="8" height="11" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="436" y="148" width="8" height="11" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="496" y="150" width="8" height="11" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="516" y="148" width="8" height="11" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="572" y="146" width="7" height="10" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="592" y="148" width="7" height="10" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <line x1="340" y1="148" x2="340" y2="240" stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
          <line x1="380" y1="138" x2="380" y2="240" stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
          <line x1="412" y1="138" x2="412" y2="240" stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
          <line x1="452" y1="138" x2="452" y2="240" stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
          <line x1="492" y1="142" x2="492" y2="240" stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
          <line x1="532" y1="136" x2="532" y2="240" stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
          <line x1="568" y1="136" x2="568" y2="240" stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
          <line x1="608" y1="138" x2="608" y2="240" stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
        </Box>
      )}

      {/* ── City's Blessing: rolling hills ── */}
      {visible && (
        <Box component="svg" viewBox="0 0 600 100" preserveAspectRatio="none" sx={{
          position: 'absolute', bottom: 55, left: 0, right: 0,
          width: '100%', height: 80,
          // Distinct cool blue-gray (atmospheric distance) so the mountains read
          // as their own layer instead of blending with the warm tan buildings.
          fill: (theme) => theme.palette.mode === 'dark' ? '#3b4a63' : '#8f9bb3',
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
          zIndex: 0, pointerEvents: 'none', opacity: 0,
          animation: exiting
            ? `${skylineFadeOut} 0.8s 1.2s ease-in forwards`
            : `${skylineFadeIn} 4s 0.5s ease-out forwards`,
        }}>
          <path d="M0,100 C90,10 200,55 310,22 C430,-5 510,42 600,16 L600,100 Z" fillOpacity="0.35"/>
          <path d="M0,100 C75,25 175,60 295,38 C405,16 505,55 600,36 L600,100 Z" fillOpacity="0.5"/>
          <path d="M0,100 C60,45 160,70 275,54 C382,38 480,66 600,50 L600,100 Z" fillOpacity="0.68"/>
        </Box>
      )}

      {/* ── City's Blessing: distant castle on a mountain (left) ── */}
      {visible && (
        <Box component="svg" viewBox="0 0 160 200" sx={{
          position: 'absolute', bottom: 48, left: '3%',
          width: 112 * scale, height: 128 * scale,
          // Distant castle silhouette perched on a mountain, a touch darker than
          // the hills so the three pointed spires read as an obvious castle.
          // Behind the skyline (z0, drawn before it) so its base tucks behind the
          // buildings and only the spires rise above. Kept narrow so it doesn't
          // dominate the scene.
          fill: (theme) => theme.palette.mode === 'dark' ? '#2c3750' : '#79849e',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          zIndex: 0, pointerEvents: 'none', overflow: 'visible', opacity: 0,
          animation: exiting
            ? `${skylineFadeOut} 0.8s 1.4s ease-in forwards`
            : `${skylineFadeIn} 3.5s 0.9s ease-out forwards`,
        }}>
          {/* Mountain + castle silhouette: left tower, tall central keep spire,
              right tower, all with pointed spires, connected by crenellated walls. */}
          <path d="
            M0,200
            L46,110 L46,80 L41,80 L56,46 L71,80 L66,80 L66,98
            L82,98 L82,62 L76,62 L92,26 L108,62 L102,62 L102,98
            L118,98 L118,80 L113,80 L128,46 L143,80 L138,80 L138,110
            L160,200 Z
          " />
          {/* Pennants on the spire tips (gold) so it reads unmistakably as a castle. */}
          <path d="M92,26 L104,29 L92,32 Z"  fill="rgba(200,162,60,0.8)"/>
          <path d="M56,46 L66,48.5 L56,51 Z" fill="rgba(200,162,60,0.8)"/>
          <path d="M128,46 L138,48.5 L128,51 Z" fill="rgba(200,162,60,0.8)"/>
        </Box>
      )}

      {/* ── City's Blessing: distant skyline ── */}
      {visible && (
        <Box component="svg" viewBox="0 0 800 80" preserveAspectRatio="none" sx={{
          position: 'absolute', bottom: 10, left: 0, right: 0,
          width: '100%', height: 83,
          // Opaque + lighter (more distant reads hazier) so the hills don't
          // bleed through the distant skyline either. Base stretched further
          // down (bottom 10 / height 83) so it fills behind the foreground row.
          fill: (theme) => theme.palette.mode === 'dark' ? '#251e15' : '#cbc4b9',
          stroke: 'none',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          zIndex: 0, pointerEvents: 'none', opacity: 0,
          animation: exiting
            ? `${skylineFadeOut} 0.8s 1.6s ease-in forwards`
            : `${skylineFadeIn} 3s 1.2s ease-out forwards`,
        }}>
          <path d="
            M0,80 L0,55 L8,40 L4,40 L14,8 L24,40 L20,40 L22,55
            L40,55 L40,62 L55,62 L55,42 L65,14 L75,42 L75,62
            L92,62 L92,55 L102,40 L102,26 L106,6 L110,26 L110,40 L120,55
            L120,62 L138,62 L138,55 L150,18 L162,55 L162,62 L176,62
            L176,55 L186,38 L186,24 L190,5 L194,24 L194,38 L204,55
            L204,62 L222,62 L222,55 L235,42 L248,55 L248,62 L262,62
            L262,55 L274,40 L274,26 L278,6 L282,26 L282,40 L294,55
            L294,62 L312,62 L312,55 L325,42 L338,55 L338,62 L352,62
            L352,55 L364,38 L364,24 L368,5 L372,24 L372,38 L384,55
            L384,62 L400,62 L400,55 L413,42 L426,55 L426,62 L440,62
            L440,55 L450,40 L450,26 L454,6 L458,26 L458,40 L468,55
            L468,62 L485,62 L485,55 L498,42 L511,55 L511,62 L525,62
            L525,55 L537,38 L537,24 L541,5 L545,24 L545,38 L557,55
            L557,62 L574,62 L574,55 L587,42 L600,55 L600,62 L615,62
            L615,55 L625,40 L625,26 L629,6 L633,26 L633,40 L643,55
            L643,62 L660,62 L660,55 L675,42 L690,55 L690,62 L705,62
            L705,55 L717,38 L717,24 L721,5 L725,24 L725,38 L737,55
            L737,62 L755,62 L800,62 L800,80 Z
          " />
        </Box>
      )}

      {/* ── City's Blessing: cathedral ── */}
      {visible && (
        <Box component="svg" viewBox="0 0 200 220" sx={{
          position: 'absolute', bottom: -35, right: -40,
          width: 200 * scale, height: 220 * scale,
          fill: (theme) => theme.palette.mode === 'dark' ? '#1a1510' : '#bcb4a9',
          stroke: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(95,85,72,0.45)',
          strokeWidth: 1.2,
          zIndex: 1, pointerEvents: 'none',
          animation: exiting
            ? `${castleSlideOutRight} 1.6s 1.8s ease-in forwards`
            : `${castleSlideInRight} 1.8s 0.3s ease-out forwards`,
        }}>
          <path d="
            M0,220
            L0,148 L8,148 L8,100 L4,100 L24,12 L44,100 L40,100 L40,148
            L52,148 L52,132 L100,96 L148,132 L148,148
            L160,148 L160,100 L156,100 L176,12 L196,100 L192,100 L192,148
            L200,148 L200,220 Z
          " />
          <rect x="17" y="122" width="5" height="18" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="178" y="122" width="5" height="18" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <circle cx="100" cy="120" r="11" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="2.5"/>
          <circle cx="100" cy="120" r="5" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5"/>
          <line x1="52" y1="156" x2="148" y2="156" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5"/>
          <line x1="2" y1="164" x2="48" y2="164" stroke="rgba(0,0,0,0.45)" strokeWidth="1.2"/>
          <line x1="152" y1="164" x2="198" y2="164" stroke="rgba(0,0,0,0.45)" strokeWidth="1.2"/>
          <path d="M85,220 L85,192 Q100,175 115,192 L115,220" fill="rgba(0,0,0,0.7)" stroke="none"/>
        </Box>
      )}

      {/* ── City's Blessing fireworks ── */}
      {visible && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden',
          ...(exiting && { animation: `${fwFadeOut} 0.5s ease-out forwards` }),
        }}>
          {([
            { left: '28%', top: '38%', delay: '5.5s',  dur: '6s',   color: '#81C784', angle:  -12, scale: 0.7 },
            { left: '68%', top: '25%', delay: '7.7s',  dur: '7s',   color: '#4FC3F7', angle:   18, scale: 1.4 },
            { left: '50%', top: '58%', delay: '10.0s', dur: '6.5s', color: '#FFD700', angle:   -5, scale: 1.0 },
            { left: '18%', top: '62%', delay: '6.6s',  dur: '8s',   color: '#FF8A65', angle:   25, scale: 1.7 },
            { left: '80%', top: '48%', delay: '8.8s',  dur: '7.5s', color: '#CE93D8', angle:  -20, scale: 0.5 },
          ] as { left: string; top: string; delay: string; dur: string; color: string; angle: number; scale: number }[]).map((fw, fi) => (
            <Box key={fi} sx={{ position: 'absolute', left: fw.left, top: fw.top }}>
              <Box sx={{ position: 'absolute', left: '50%', transform: `rotate(${fw.angle}deg)`, transformOrigin: 'bottom center' }}>
                <Box sx={{ position: 'absolute', left: '50%', width: 3, height: 24, borderRadius: 1, bgcolor: fw.color, opacity: 0, animation: `${fwRocket} ${fw.dur} ${fw.delay} linear infinite` }} />
              </Box>
              <Box sx={{ position: 'absolute', top: 0, left: 0, transform: `scale(${fw.scale})`, transformOrigin: '0 0' }}>
                <Box sx={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', bgcolor: '#FFFFFF', opacity: 0, animation: `${fwFlash} ${fw.dur} ${fw.delay} ease-out infinite` }} />
                {fwSparks.map((anim, si) => (
                  <Box key={si} sx={{ position: 'absolute', width: 4, height: 4, borderRadius: '50%', bgcolor: FW_SPARK_COLORS[si % FW_SPARK_COLORS.length], opacity: 0, animation: `${anim} ${fw.dur} ${fw.delay} ease-out infinite` }} />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* ── City's Blessing clouds ── */}
      {visible && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden',
          ...(exiting && { animation: `${fwFadeOut} 1s ease-out forwards` }),
        }}>
          {([
            { top: '4%',  scale: 1.0,  delay: '4.5s',  dur: '28s' },
            { top: '12%', scale: 0.65, delay: '13.5s', dur: '34s' },
            { top: '2%',  scale: 1.3,  delay: '23.5s', dur: '22s' },
          ]).map((c, i) => (
            <Box key={i} component="svg" viewBox="0 0 100 40" sx={{
              position: 'absolute', top: c.top, left: 0,
              width: `${100 * c.scale * scale}px`, height: `${40 * c.scale * scale}px`,
              fill: 'rgba(255,245,220,0.18)', pointerEvents: 'none', overflow: 'visible',
              opacity: 0,
              animation: `${cloudDrift} ${c.dur} ${c.delay} linear infinite`,
            }}>
              <ellipse cx="28" cy="28" rx="22" ry="14"/>
              <ellipse cx="50" cy="18" rx="20" ry="18"/>
              <ellipse cx="74" cy="26" rx="18" ry="15"/>
              <rect x="6" y="28" width="86" height="12"/>
            </Box>
          ))}
        </Box>
      )}

      {/* ── City's Blessing: marching flags ── */}
      {visible && (() => {
        const threatArtUrl = threatArtSrc;
        const threatCount = !threatArtUrl
          ? 0
          : Math.min(Math.floor(threatSource!.dmg * 12 / 20), 12);
        const stolenIndices: ReadonlySet<number> = new Set(THREAT_STEAL_ORDER.slice(0, threatCount));
        return (
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          ...(exiting && { animation: `${fwFadeOut} 1.1s ease-out forwards` }),
        }}>
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', animation: `${flagMarch} 38s linear infinite` }}>
          {CITY_FLAG_CONFIGS.map((cfg, i) => {
            const isThreat = stolenIndices.has(i);
            const home = homeFlags[i % homeFlags.length];
            return (
            <CityFlag
              key={i}
              left={cfg.left}
              bottom={cfg.bottom}
              scale={scale}
              riseDelay={cfg.riseDelay}
              wiggleDuration={cfg.wiggleDuration}
              wiggleOffset={cfg.wiggleOffset}
              driftDuration={cfg.driftDuration}
              driftOffset={cfg.driftOffset}
              artCropUrl={isThreat ? threatArtUrl! : home.art}
              commanderName={isThreat ? (threatSource?.cmdName ?? commander.name) : home.name}
            />
            );
          })}
        </Box>
        </Box>
        );
      })()}
    </>
  );
}
