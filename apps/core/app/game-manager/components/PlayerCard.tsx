'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { keyframes } from '@emotion/react';
import { Box, Button, CircularProgress, IconButton, Stack, SvgIcon, TextField, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChatIcon from '@mui/icons-material/Chat';
import InitiativeIcon from '@mui/icons-material/Castle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ElimIcon from '@mui/icons-material/PersonOff';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { QRCodeSVG } from 'qrcode.react';
import { getCardImageByName } from '@commander/shared/lib/cardImageCache';
import { ASSET_BASE } from '@/lib/api';
import { ControlFocusModal } from './ControlFocusModal';
import { useXpKeyframes, useEnergyKeyframes, useDamageFlashKeyframe, usePoisonBoilKeyframe } from './PlayerCard.keyframes';
import { useLocalStorageBool } from '@/game-manager/hooks/useLocalStorageBool';

const XP_ICON_SRC = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPxc2Yz21vbnc5VP3Muxnx5VtQGAynItuNWg&s';

// Local glyphs duplicated from PlayerPanel. Phase 3 will fold both into a
// shared icons module along with the keyframes.
const CrownIcon = (props: React.ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M5 16l-3-10 5.5 4L12 2l4.5 8L22 6l-3 10H5zm0 2h14v2H5v-2z" />
  </SvgIcon>
);
const CityIcon = ({ active, ...props }: React.ComponentProps<typeof SvgIcon> & { active?: boolean }) => (
  <SvgIcon {...props} viewBox="0 0 1024 1024">
    {active && (
      <defs>
        <linearGradient id="cityGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E040FB" />
          <stop offset="50%" stopColor="#7851A9" />
          <stop offset="100%" stopColor="#311B92" />
        </linearGradient>
      </defs>
    )}
    <path fill={active ? 'url(#cityGradCard)' : 'currentColor'} d="M503.612.522c5.954-.16 11.908-.32 17.862-.522 11.304 64.93 18.666 130.504 28.924 195.596 51.816 6.276 101.46 25.586 144.826 54.55 37.576-10.66 75.028-21.764 112.604-32.504-10.42 36.206-21.362 72.332-31.702 108.578-2.052 5.03 2.656 9.334 4.626 13.558 26.754 40.51 42.524 87.498 48.84 135.492 64.688 9.374 129.336 18.908 194.026 28.402.04 5.994.12 12.03.242 18.104-64.77 10.822-130.062 18.344-194.912 28.684-6.156 51.896-26.35 101.256-55.316 144.544 10.982 37.896 22.488 75.632 33.068 113.648-38.58-10.742-76.758-22.93-115.378-33.592-42.402 28.724-91.642 45.782-142.17 52.742-9.454 65.252-18.828 130.544-28.402 195.796-6.074.12-12.15.242-18.184.402-9.936-62.316-18.022-124.952-27.154-187.428-1.086-3.862-.846-10.862-6.598-10.622-48.638-6.436-94.66-25.666-135.694-52.178-39.144 11.426-78.206 23.174-117.43 34.276 10.58-38.096 22.528-75.792 33.23-113.848 2.252-5.432-2.736-10.098-4.868-14.604-24.702-38.982-40.27-83.638-45.7-129.458-65.736-11.104-131.994-19.27-197.89-29.368-.12-6.074-.2-12.19-.322-18.224 65.896-10.822 132.356-18.144 198.17-29.328 5.352-50.206 24.622-97.958 51.656-140.28-10.984-38.902-22.488-77.642-33.632-116.464 38.7 11.144 77.2 23.052 116.022 33.712 42.482-29.448 91.964-47.148 142.854-54.912 9.212-64.97 18.908-129.82 28.402-194.752zm-47.914 270.302c-33.47 8.006-65.13 23.294-92.526 44.132-5.432 3.742-10.54 10.018-8.852 17.058 1.852 7.844 9.696 11.706 15.448 16.494 23.494 16.776 46.064 34.878 69.798 51.332 8.69 5.994 21.644-.724 22.128-11.184 5.51-33.712 10.136-67.584 15.004-101.378 2.576-11.546-10.458-21.12-21-16.454zm104.074-1.488c-8.448 1.81-13.678 10.782-11.424 19.068 4.344 32.224 9.05 64.408 13.718 96.552.442 7.442 4.546 16.01 12.832 16.896 7.806 1.528 13.718-4.708 19.672-8.57 23.576-18.022 47.994-34.878 71.328-53.222 8.81-5.794 7.282-19.714-1.61-24.662-30.412-23.132-66.458-41.034-104.516-46.062zM326.28 354.22c-7.602 2.736-11.586 10.298-16.172 16.374-17.862 26.43-31.66 56.04-37.936 87.418-2.976 9.696 6.478 20.074 16.374 17.982 33.39-4.506 66.82-9.01 100.09-14.322 12.23-.32 17.782-16.332 9.656-24.86-17.38-24.138-35.362-47.834-52.862-71.85-4.304-6.156-10.822-12.954-19.15-10.742zm362.468.08c-19.472 21.242-34.718 46.184-52.74 68.712-5.714 8.972-16.816 17.58-13.156 29.448 3.54 9.334 14.442 9.616 22.77 11.104 31.178 4.224 62.276 9.414 93.494 13.436 10.138 1.892 19.31-9.132 15.97-18.868-7.644-35.722-23.694-69.838-46.344-98.48-4.264-6.598-12.994-8.892-19.994-5.352zM282.672 547.604c-7.604 2.574-12.834 10.66-10.218 18.666 7.482 34.798 23.212 67.988 45.178 95.986 5.108 8.088 17.982 9.214 23.654 1.168 17.782-22.57 34.236-46.144 51.736-68.914 4.706-6.678 11.948-14.28 8.126-23.092-3.34-10.902-17.018-9.412-25.988-11.626-30.856-3.46-61.512-10.378-92.488-12.188zm422.168 5.028c-24.178 3.902-48.598 6.154-72.614 10.902-10.5 2.052-13.84 16.414-6.84 23.936 18.586 25.626 37.534 51.012 56.564 76.356 5.47 10.138 20.758 10.098 26.35.08 23.252-30.454 42.24-66.458 46.786-104.758-8.368-20.556-34.074-6.476-50.246-6.516zm-265.434 71.086c-23.936 16.372-46.546 34.556-70.16 51.372-6.316 5.07-15.488 10.098-15.046 19.43.724 8.168 8.448 12.834 14.282 17.42 26.752 18.948 57.044 33.43 89.148 40.35 9.976 3.38 20.638-6.638 18.424-16.736-4.626-33.55-9.132-67.142-14.442-100.572-.28-10.54-13.596-17.46-22.206-11.264zm129.016.562c-6.356 3.258-5.994 11.788-7.604 17.822-4.384 31.016-9.052 62.034-13.396 93.09-2.976 10.622 7.926 21.806 18.626 18.024 35.322-7.524 68.994-23.092 97.556-45.138 8.288-4.948 9.938-17.66 1.892-23.614-24.782-19.512-50.568-37.776-75.712-56.844-5.794-5.07-14.402-8.046-21.362-3.34z" />
  </SvgIcon>
);
import type { PlayerState, CommanderDamageMap } from '../types';
import type { MonarchAnim } from '@/game-manager/hooks/useMonarchTransition';

// ─── Local keyframes / constants used by migrated render blocks ────────────
// Phase 3 will sweep cross-component keyframes into a shared module. For now
// each block owns whatever it needs.
// ─── City's Blessing decoration keyframes (Block C) ────────────────────────
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
  riseDelay: number;
  wiggleDuration: number;
  wiggleOffset: number;
  driftDuration: number;
  driftOffset: number;
  artCropUrl?: string;
  commanderName: string;
}

function CityFlag({ left, bottom = -25, riseDelay, wiggleDuration, wiggleOffset, driftDuration, driftOffset, artCropUrl, commanderName }: CityFlagProps) {
  const dur = `${wiggleDuration}s`;
  const off = `${wiggleOffset}s`;
  return (
    <Box sx={{
      position: 'absolute', left, bottom,
      pointerEvents: 'none', zIndex: 3,
      animation: `${flagRise} 1.4s ${riseDelay}s ease-out both`,
    }}>
      <Box sx={{ animation: `${flagDrift} ${driftDuration}s ${driftOffset}s ease-in-out infinite` }}>
      <Box sx={{ transform: 'scaleX(-1)' }}>
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

const crownShimmerBig = keyframes`
  0%, 100% { filter: drop-shadow(0 0 3px #DAA520) brightness(1); }
  50%       { filter: drop-shadow(0 0 10px #FFD700) brightness(1.6); }
`;
const crownEnterFromTop = keyframes`
  from { transform: translateY(-80px) rotate(-25deg); opacity: 0; }
  to   { transform: translateY(0) rotate(-25deg); opacity: 1; }
`;
const crownExitToTop = keyframes`
  from { transform: translateY(0) rotate(-25deg); opacity: 1; }
  to   { transform: translateY(-80px) rotate(-25deg); opacity: 0; }
`;
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

/**
 * Presentational counterpart of PlayerPanel. All behavior hooks live in the
 * orchestrator (PlayerPanel.tsx); this component receives fully-computed props
 * and renders JSX. Wrapped in React.memo with a custom comparator so a life
 * change in one seat re-renders only that seat's card, not all four.
 *
 * Phase 2 migration in progress: render JSX is moving here from PlayerPanel one
 * logical block at a time. PlayerCard is not yet imported anywhere — PlayerPanel
 * still owns the real render. The card is being built in parallel; the wire-up
 * happens in Phase 4.
 *
 * Card-local UI state (qrOpen, countersOpen, eliminateTurnInput, etc.) lives
 * inside the card via useState — the orchestrator never reads it. Refs to
 * card-rendered DOM (cmdScrollRef) live here too. Derived values that follow a
 * pure function of props (showCrown, monarchAnimStr) are computed in render.
 */

// ─── Discriminated unions used by callbacks ────────────────────────────────
export type FocusedControl = {
  type: 'life' | 'poison' | 'energy' | 'experience' | 'commanderTax' | 'commanderDamage';
  sourceIdx?: number;
  isPartner?: boolean;
} | null;

export interface KillOpponent {
  name: string;
  idx: number;
}

// ─── Fluid size tokens (computed in orchestrator from remoteMode) ──────────
export interface SizeTokens {
  fsPlayerName: string;
  fsDeckName: string;
  fsPassBtn: string;
  fsHeaderIcon: string;
  fsSmallIcon: string;
  fsMenuTrigger: string;
  fsSectionLabel: string;
  fsSourceName: string;
  fsStatBadge: string;
  fsCounterLabel: string;
  fsCounterValue: string;
  fsCounterBtn: string;
  fsLifeBtn: string;
  fsKillPrompt: string;
  artHeight: string;
  cmdBtnWidth: string;
  cmdBtnHeight: string;
  valColWidth: string;
}

// ─── Position-derived rotation/placement values ────────────────────────────
export interface PositionTokens {
  ttRotate: string;
  ttHeaderPlacement: 'top' | 'bottom' | 'left' | 'right';
  snapshotPlacement: 'top' | 'bottom' | 'left' | 'right';
  ttSlotProps: { tooltip: { sx: { rotate: string } } };
  ttHeaderSlotProps: {
    tooltip: { sx: { rotate: string } };
    popper: { modifiers: { name: string; enabled: boolean }[] };
  };
}

// ─── Timer presentation (derived in orchestrator from elapsed/total) ───────
export interface TimerTokens {
  timerOff: boolean;
  timerProgress: number;
  isTimerExpired: boolean;
  timerColor: string;
  timerColorRgba: (alpha: number) => string;
  currentPlayerBorder?: string;
  currentPlayerShadow?: string;
}

// ─── Animation flags surfaced from extracted hooks ─────────────────────────
export interface AnimationFlags {
  /** Damage-flash counter (changes trigger flash). 0 = no flash. */
  damageFlash: number;
  /**
   * Monarch crown lifecycle from `useMonarchTransition`. The card derives
   * `showCrown` and the crown animation CSS from this value.
   */
  monarchAnim: MonarchAnim;
  monarchEnterIsTransfer: boolean;
  /** Citys-blessing render gate (visible includes exit animation tail). */
  cityBlessingVisible: boolean;
  cityBlessingExiting: boolean;
  /** XP +1 transient flash + ripple key. */
  xpFlashing: boolean;
  xpRippleKey: number;
}

// ─── Viewer/eye-icon presentation ──────────────────────────────────────────
export interface ViewerProps {
  isBeingViewedByAnyone: boolean;
  viewerTooltipText: string;
  viewerBannerVisible: boolean;
  /** Click handler for the eye icon — triggers banner ping in orchestrator. */
  onEyeIconClick: () => void;
}

// ─── Long-press hook surfaces (handlers + render key) ──────────────────────
// Signatures mirror `useLongPress` exactly so consumers can pass the bundle
// straight through without adapter shims.
export interface LongPressHandlers {
  lpKey: string | null;
  startLongPress: (key: string, onTrigger: () => void) => void;
  cancelLongPress: () => void;
  guardClick: (cb: () => void) => () => void;
}

// ─── Threat-source derivation (computed in orchestrator from cmd damage) ───
export interface ThreatSource {
  artUrl: string | undefined;
  cmdName: string;
  intensity: number;
  dmg: number;
}

// ─── Full prop surface ─────────────────────────────────────────────────────
export interface PlayerCardProps {
  // Identity / core state
  player: PlayerState;
  playerIdx: number;
  allPlayers: PlayerState[];
  commanderDamage: CommanderDamageMap;
  startingLife: number;
  activePlayerIdx?: number;

  // Mode flags
  remoteMode: boolean;
  seatCode?: string;
  remoteConnected: boolean;
  soundEnabled: boolean;
  highlightMode: boolean;
  isHighlighted: boolean;
  isCurrentPlayer: boolean;
  themeMode?: 'light' | 'dark';

  // Kill prompts (passed through from orchestrator)
  lifeKillOpponents?: KillOpponent[];
  poisonKillOpponents?: KillOpponent[];

  // Counter / state mutation handlers
  onLifeChange: (idx: number, delta: number) => void;
  onPoisonChange: (idx: number, delta: number) => void;
  onCommanderTaxChange: (idx: number, delta: number) => void;
  onEnergyChange: (idx: number, delta: number) => void;
  onExperienceChange: (idx: number, delta: number) => void;
  onToggleMonarch: (idx: number) => void;
  onToggleInitiative: (idx: number) => void;
  onToggleCitysBlessing: (idx: number) => void;
  onCommanderDamageChange: (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => void;
  onEliminate: (idx: number) => void;
  onUndoEliminate: (idx: number) => void;
  onPassTurn?: () => void;
  onLifeKillSelect?: (sourceIdx: number | null) => void;
  onPoisonKillSelect?: (sourceIdx: number | null) => void;
  onSwitchToPlayer?: (targetIdx: number) => void;
  onToggleTheme?: () => void;
  onToggleSound?: () => void;
  onOpenChat?: (playerName: string) => void;

  // Derived value bundles
  sizes: SizeTokens;
  position: PositionTokens;
  timer: TimerTokens;
  animations: AnimationFlags;
  viewer: ViewerProps;
  longPress: LongPressHandlers;

  // Other orchestrator-derived values
  threatSource: ThreatSource | null;
  computedLifeColor: string;
  lostRatio: number;
  crackAlpha: (from: number) => number;
  isWarning: boolean;

  // CMD damage source-snapshot renderer (orchestrator closure over allPlayers / cmd damage)
  renderSourceSnapshot: (src: PlayerState, srcIdx: number) => React.ReactNode;

  // Commander damage change wrapper (orchestrator memoizes; includes setLastCmdDmgSourceIdx)
  handleCmdDmgChange: (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => void;
}

// ─── Custom memo comparator ────────────────────────────────────────────────
// Strategy: rely on the orchestrator to pass stable references for arrays,
// objects, and handlers. Compare scalars by value, references by identity.
// Bundles (sizes/position/timer/animations/viewer/longPress) are expected to
// be stable references unless their contents actually change — the orchestrator
// will memoize each bundle so this comparator can rely on reference equality.
function arePlayerCardPropsEqual(prev: PlayerCardProps, next: PlayerCardProps): boolean {
  return (
    prev.player === next.player &&
    prev.allPlayers === next.allPlayers &&
    prev.commanderDamage === next.commanderDamage &&
    prev.playerIdx === next.playerIdx &&
    prev.startingLife === next.startingLife &&
    prev.activePlayerIdx === next.activePlayerIdx &&
    prev.remoteMode === next.remoteMode &&
    prev.seatCode === next.seatCode &&
    prev.remoteConnected === next.remoteConnected &&
    prev.soundEnabled === next.soundEnabled &&
    prev.highlightMode === next.highlightMode &&
    prev.isHighlighted === next.isHighlighted &&
    prev.isCurrentPlayer === next.isCurrentPlayer &&
    prev.themeMode === next.themeMode &&
    prev.lifeKillOpponents === next.lifeKillOpponents &&
    prev.poisonKillOpponents === next.poisonKillOpponents &&
    prev.sizes === next.sizes &&
    prev.position === next.position &&
    prev.timer === next.timer &&
    prev.animations === next.animations &&
    prev.viewer === next.viewer &&
    prev.longPress === next.longPress &&
    prev.threatSource === next.threatSource &&
    prev.computedLifeColor === next.computedLifeColor &&
    prev.lostRatio === next.lostRatio &&
    prev.crackAlpha === next.crackAlpha &&
    prev.isWarning === next.isWarning &&
    prev.renderSourceSnapshot === next.renderSourceSnapshot &&
    prev.handleCmdDmgChange === next.handleCmdDmgChange &&
    // handlers — identity check (orchestrator must memoize)
    prev.onLifeChange === next.onLifeChange &&
    prev.onPoisonChange === next.onPoisonChange &&
    prev.onCommanderTaxChange === next.onCommanderTaxChange &&
    prev.onEnergyChange === next.onEnergyChange &&
    prev.onExperienceChange === next.onExperienceChange &&
    prev.onToggleMonarch === next.onToggleMonarch &&
    prev.onToggleInitiative === next.onToggleInitiative &&
    prev.onToggleCitysBlessing === next.onToggleCitysBlessing &&
    prev.onCommanderDamageChange === next.onCommanderDamageChange &&
    prev.onEliminate === next.onEliminate &&
    prev.onUndoEliminate === next.onUndoEliminate &&
    prev.onPassTurn === next.onPassTurn &&
    prev.onLifeKillSelect === next.onLifeKillSelect &&
    prev.onPoisonKillSelect === next.onPoisonKillSelect &&
    prev.onSwitchToPlayer === next.onSwitchToPlayer &&
    prev.onToggleTheme === next.onToggleTheme &&
    prev.onToggleSound === next.onToggleSound &&
    prev.onOpenChat === next.onOpenChat
  );
}

function PlayerCardImpl(props: PlayerCardProps) {
  const {
    viewer, sizes, position, timer, animations, longPress,
    player, playerIdx, allPlayers, commanderDamage, computedLifeColor,
    isCurrentPlayer, highlightMode,
    seatCode, remoteConnected, remoteMode, soundEnabled, themeMode,
    lifeKillOpponents, onLifeKillSelect, poisonKillOpponents, onPoisonKillSelect,
    onLifeChange, onPoisonChange, onEnergyChange, onExperienceChange, onCommanderTaxChange,
    handleCmdDmgChange,
    onToggleMonarch, onToggleInitiative, onToggleCitysBlessing,
    onEliminate, onUndoEliminate, onPassTurn,
    onSwitchToPlayer,
    onToggleSound, onToggleTheme, onOpenChat,
    threatSource, crackAlpha,
  } = props;
  const { lpKey, startLongPress, cancelLongPress, guardClick } = longPress;
  const isPoisoned = player.poison >= 10;

  // ─── Card-local UI state ────────────────────────────────────────────────
  // None of this state is read by the orchestrator or any sibling. Lifting it
  // would just add prop noise and break memoization. It stays here.
  const [eliminateTurnInput, setEliminateTurnInput] = useState('');
  const [showEliminateConfirm, setShowEliminateConfirm] = useState(false);
  const [stateMenuOpen, setStateMenuOpen] = useState(false);
  const [rulesOpenLabel, setRulesOpenLabel] = useState<string | null>(null);
  const toggleRules = (label: string) => setRulesOpenLabel(l => l === label ? null : label);

  // Auto-close the rules tooltip on next outside mousedown.
  useEffect(() => {
    if (!rulesOpenLabel) return;
    const close = () => setRulesOpenLabel(null);
    const id = setTimeout(() => document.addEventListener('mousedown', close), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', close); };
  }, [rulesOpenLabel]);

  const [openSnapshotKey, setOpenSnapshotKey] = useState<string | null>(null);
  const [focusedControl, setFocusedControl] = useState<FocusedControl>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [countersOpen, setCountersOpen] = useState(true);
  const [cmdDmgShowPlayer, setCmdDmgShowPlayer] = useLocalStorageBool(
    `cmdDmgShowPlayer:${player.playerId}`,
  );
  const toggleCmdDmgShowPlayer = () => setCmdDmgShowPlayer();
  const [cmdPreviewName, setCmdPreviewName] = useState<string | null>(null);
  const [cmdPreviewUrl, setCmdPreviewUrl] = useState<string | null>(null);
  const [cmdPreviewZoom, setCmdPreviewZoom] = useState(1);
  const [cmdPreviewBase, setCmdPreviewBase] = useState<{ w: number; h: number } | null>(null);
  const cmdScrollRef = useRef<HTMLDivElement>(null);

  // Resolve preview URL when name changes; reset zoom/base.
  // All inputs/outputs are card-local; no orchestrator hook reads cmdPreviewUrl.
  useEffect(() => {
    if (!cmdPreviewName) { setCmdPreviewUrl(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); return; }
    setCmdPreviewUrl(null);
    setCmdPreviewZoom(1);
    setCmdPreviewBase(null);
    getCardImageByName(cmdPreviewName).then(url => setCmdPreviewUrl(url));
  }, [cmdPreviewName]);

  // Scroll to bottom when zoom changes so the card bottom (player name / mana cost)
  // stays in view.
  useEffect(() => {
    if (cmdPreviewZoom > 1 && cmdScrollRef.current) {
      cmdScrollRef.current.scrollTop = cmdScrollRef.current.scrollHeight;
    }
  }, [cmdPreviewZoom]);

  // Auto-close QR when remote player connects.
  useEffect(() => { if (remoteConnected && qrOpen) setQrOpen(false); }, [remoteConnected, qrOpen]);

  // ─── Derived from animations bundle (cheap, recompute every render) ─────
  // showCrown / monarchAnimStr were lifted as props in Phase 1; the card owns
  // them now because they're pure functions of `monarchAnim`.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { monarchAnim } = animations;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showCrown = player.isMonarch || monarchAnim === 'exiting';

  // ─── XP keyframes (pure functions of player.experience) ─────────────────
  // These are derived from player.experience only — calling the shared hook
  // locally keeps invalidation tight and avoids threading 7 keyframe objects
  // through props.
  const xpGlowIntensity = player.experience > 0 ? Math.min(player.experience / 10, 1) : 0;
  const xpGlow = xpGlowIntensity > 0
    ? `0 0 ${4 + xpGlowIntensity * 12}px rgba(218,165,32,${(0.5 + xpGlowIntensity * 0.5).toFixed(2)}), 0 0 ${10 + xpGlowIntensity * 24}px rgba(218,165,32,${(0.2 + xpGlowIntensity * 0.3).toFixed(2)})`
    : undefined;
  const {
    xpShimmerAnim,
    xpFlashAnim,
    xpRippleAnim,
    xpLevelUpAnim,
    xpShimmerSweepAnim,
    xpEmberAnim,
    xpRuneGlowAnim,
  } = useXpKeyframes(player.experience, xpGlow, xpGlowIntensity);

  // ─── Energy / damage / poison keyframes ─────────────────────────────────
  const energyGlowIntensity = player.energy > 0 ? Math.min(player.energy / 8, 1) : 0;
  const energyGlow = energyGlowIntensity > 0
    ? `0 0 ${4 + energyGlowIntensity * 18}px rgba(80,200,255,${(0.5 + energyGlowIntensity * 0.45).toFixed(2)}), 0 0 ${10 + energyGlowIntensity * 36}px rgba(80,200,255,${(0.2 + energyGlowIntensity * 0.3).toFixed(2)})`
    : undefined;
  // energyGlow is used in the outer container; reserved here for Phase 4 wiring.
  void energyGlow;
  const energyStaticShadow = player.energy > 5
    ? `0 0 18px rgba(30,100,210,0.55), 0 0 36px rgba(20,70,180,0.3)`
    : undefined;
  const sizzleAmp = Math.min(player.energy - 5, 10) * 0.2;
  const { energyPulseAnim, energySizzleAnim } = useEnergyKeyframes(
    player.energy,
    energyStaticShadow,
    sizzleAmp,
  );
  const energyPulseDuration = player.energy > 5 ? Math.max(0.8, 2.5 - (player.energy - 5) * 0.09) : 2.5;
  const damageFlashAnim = useDamageFlashKeyframe();
  const poisonProgress = Math.min(player.poison / 10, 1);
  const poisonBoilAmp = player.poison >= 10 ? 5 : player.poison === 9 ? 3.8 : player.poison === 8 ? 1.5 : 0;
  const poisonBoilSkew = Math.min(poisonBoilAmp * 0.6, 2.5);
  const poisonBoilAnim = usePoisonBoilKeyframe(player.poison, poisonBoilAmp, poisonBoilSkew);
  const poisonBoilDuration = player.poison >= 10 ? 2.0 : player.poison >= 9 ? 2.5 : 5.0;

  // ─── Monarch crown anim string ──────────────────────────────────────────
  const { monarchEnterIsTransfer } = animations;
  const monarchAnimStr =
    monarchAnim === 'exiting'  ? `${crownExitToTop} 0.5s ease-in forwards` :
    monarchAnim === 'entering' ? `${crownEnterFromTop} ${monarchEnterIsTransfer ? '1s' : '0.5s'} ${monarchEnterIsTransfer ? '0.5s' : '0s'} ease-out both, ${crownShimmerBig} 2s ease-in-out infinite` :
    `${crownShimmerBig} 2s ease-in-out infinite`;

  // ─── Derived helpers used in Block B ────────────────────────────────────
  const { startingLife, activePlayerIdx } = props;
  const isCmdDmgHigh = Object.values(commanderDamage[playerIdx] ?? {}).some(
    (dmg) => dmg[0] >= 21 || dmg[1] >= 21
  );
  const opponents = allPlayers
    .map((p, i) => ({ player: p, idx: i }))
    .filter(({ idx }) => idx !== playerIdx);
  function lifeColor(life: number): string {
    if (life <= 0) return '#6B0000';
    if (life > startingLife) {
      const gain = Math.min((life - startingLife) / startingLife, 1);
      const r = Math.round(180 - 140 * gain);
      const g = Math.round(120 + 102 * gain);
      const b = Math.round(60 - 36 * gain);
      return `rgb(${r},${g},${b})`;
    }
    const ratio = Math.max(0, Math.min((startingLife - life) / startingLife, 1));
    if (ratio <= 0) return '';
    const r = Math.round(180 + 71 * ratio);
    const g = Math.round(120 - 120 * ratio);
    const b = Math.round(60 - 60 * ratio);
    return `rgb(${r},${g},${b})`;
  }

  // ─── Crack layers (per-player fingerprint, fixed in render lifetime) ───
  const ox = 38 + (playerIdx % 7);
  const oy = 32 + (playerIdx % 5);
  const cp = (d: string, w: number, op: number) =>
    `<path d="${d}" stroke="rgba(10,0,0,${op})" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const crackSvg = (paths: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${paths}</svg>`;
  const crackLayers: Array<{ from: number; svg: string }> = [
    { from: 0.2, svg: crackSvg(
      cp(`M${ox},${oy} L${ox-14},${oy-18} L${ox-22},${oy-32}`, 1.6, 0.95) +
      cp(`M${ox},${oy} L${ox+8},${oy-22} L${ox+5},0`, 1.5, 0.92) +
      cp(`M${ox},${oy} L${ox+28},${oy-14} L${ox+48},${oy-26} L100,${oy-18}`, 1.4, 0.9) +
      cp(`M${ox},${oy} L${ox+22},${oy+18} L${ox+38},${oy+42} L100,${oy+60}`, 1.3, 0.88) +
      cp(`M${ox},${oy} L${ox+4},${oy+28} L${ox-2},${oy+52} L${ox+6},100`, 1.3, 0.87) +
      cp(`M${ox},${oy} L${ox-18},${oy+22} L${ox-34},${oy+48} L0,${oy+62}`, 1.2, 0.85) +
      cp(`M${ox},${oy} L${ox-28},${oy+6} L0,${oy+14}`, 1.2, 0.84)
    )},
    { from: 0.35, svg: crackSvg(
      cp(`M${ox-14},${oy-18} L${ox-30},${oy-12} L0,${oy-8}`, 1.0, 0.88) +
      cp(`M${ox-14},${oy-18} L${ox-8},${oy-34} L0,${oy-48}`, 0.9, 0.85) +
      cp(`M${ox+8},${oy-22} L${ox+22},${oy-14} L${ox+40},${oy-20} L100,${oy-30}`, 0.9, 0.85) +
      cp(`M${ox+28},${oy-14} L${ox+22},${oy+6} L${ox+36},${oy+18}`, 0.85, 0.82) +
      cp(`M${ox+22},${oy+18} L${ox+10},${oy+32} L${ox+16},${oy+50}`, 0.85, 0.82) +
      cp(`M${ox+4},${oy+28} L${ox+18},${oy+36} L${ox+28},${oy+58} L${ox+18},100`, 0.8, 0.8) +
      cp(`M${ox-18},${oy+22} L${ox-6},${oy+34} L${ox-12},${oy+52}`, 0.8, 0.8) +
      cp(`M${ox-28},${oy+6} L${ox-18},${oy-6} L${ox-10},${oy-20}`, 0.8, 0.8)
    )},
    { from: 0.5, svg: crackSvg(
      cp(`M${ox-30},${oy-12} L${ox-42},${oy-24} L${ox-36},${oy-40} L0,${oy-52}`, 0.75, 0.82) +
      cp(`M${ox-8},${oy-34} L${ox+4},${oy-48} L${ox-2},${oy-62} L${ox+10},${oy-80}`, 0.72, 0.8) +
      cp(`M${ox+40},${oy-20} L${ox+50},${oy-8} L${ox+62},${oy-16}`, 0.7, 0.78) +
      cp(`M${ox+36},${oy+18} L${ox+52},${oy+28} L${ox+68},${oy+20} L100,${oy+32}`, 0.7, 0.78) +
      cp(`M${ox+16},${oy+50} L${ox+30},${oy+62} L${ox+22},${oy+78} L${ox+36},100`, 0.68, 0.76) +
      cp(`M${ox-12},${oy+52} L${ox-24},${oy+64} L${ox-14},${oy+80} L0,${oy+90}`, 0.68, 0.76) +
      cp(`M${ox-42},${oy-24} L${ox-52},${oy-10} L0,${oy-4}`, 0.65, 0.74) +
      cp(`M${ox+10},${oy-80} L${ox+22},${oy-72} L${ox+36},${oy-82}`, 0.62, 0.72)
    )},
    { from: 0.7, svg: crackSvg(
      cp(`M${ox-22},${oy-32} L${ox-6},${oy-22} L${ox+4},${oy-38}`, 0.6, 0.8) +
      cp(`M${ox+5},0 L${ox-10},${oy-44} L${ox-20},${oy-58}`, 0.55, 0.78) +
      cp(`M${ox+48},${oy-26} L${ox+58},${oy-14} L${ox+72},${oy-22}`, 0.55, 0.76) +
      cp(`M${ox+62},${oy-16} L${ox+76},${oy-6} L${ox+84},${oy+8}`, 0.52, 0.74) +
      cp(`M${ox+28},${oy+58} L${ox+44},${oy+68} L${ox+38},${oy+84}`, 0.52, 0.74) +
      cp(`M${ox-24},${oy+64} L${ox-38},${oy+72} L${ox-28},${oy+86}`, 0.5, 0.72) +
      cp(`M${ox-52},${oy-10} L${ox-62},${oy+4} L${ox-50},${oy+18}`, 0.5, 0.72) +
      cp(`M${ox+22},${oy+6} L${ox+14},${oy+18} L${ox+24},${oy+30}`, 0.48, 0.7)
    )},
    { from: 0.85, svg: crackSvg(
      cp(`M${ox-6},${oy+8} L${ox+4},${oy+14} L${ox-2},${oy+22}`, 0.45, 0.8) +
      cp(`M${ox+10},${oy+4} L${ox+18},${oy+12} L${ox+12},${oy+22}`, 0.42, 0.78) +
      cp(`M${ox+6},${oy-10} L${ox+14},${oy-4} L${ox+8},${oy+6}`, 0.42, 0.76) +
      cp(`M${ox-10},${oy-6} L${ox-4},${oy+4} L${ox-12},${oy+12}`, 0.4, 0.74) +
      cp(`M${ox-36},${oy-40} L${ox-28},${oy-30} L${ox-38},${oy-22}`, 0.4, 0.72) +
      cp(`M${ox+36},${oy-82} L${ox+48},${oy-76} L${ox+42},${oy-64}`, 0.38, 0.7) +
      cp(`M${ox+84},${oy+8} L${ox+90},${oy+22} L${ox+80},${oy+34}`, 0.38, 0.7) +
      cp(`M${ox+44},${oy+68} L${ox+54},${oy+80} L${ox+44},${oy+92}`, 0.36, 0.68) +
      cp(`M${ox-62},${oy+4} L${ox-72},${oy+16} L${ox-62},${oy+28}`, 0.36, 0.68)
    )},
  ];
  // monarchAnimStr is intentionally not derived here yet — it depends on the
  // crown keyframes which are migrated in Phase 3. The render block that needs
  // it will compute it locally when it lands.

  // ─── Render: outer container + per-block sections ──────────────────────
  // The outer container styling (warning border, timer-expired blink, poison
  // saturation, etc.) is migrated with the header/main blocks. For now the
  // card mounts a bare positioning shell so isolated render blocks have a
  // parent to anchor against.
  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <Box
        sx={{
        px: 1, py: 0.5, flexShrink: 0, filter: 'none', position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center',
        background: isCurrentPlayer && highlightMode
          ? `linear-gradient(90deg, ${timer.timerColorRgba(0.3)} 0%, ${timer.timerColorRgba(0.7)} 50%, ${timer.timerColorRgba(0.3)} 100%)`
          : 'rgba(0,0,0,0.08)',
        transition: 'background-color 0.3s ease',
        ...(timer.isTimerExpired && highlightMode && {
          animation: 'headerBlink 0.5s step-end infinite',
          '@keyframes headerBlink': {
            '0%, 100%': { background: '#e9353540' },
            '50%': { background: 'rgba(0,0,0,0.08)' },
          },
        }),
      }}>
        {/* Left: commander art + tax */}
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexShrink: 0, zIndex: 1 }}>
          {player.commander.artCropUrl && (
            <Box component="img" src={player.commander.artCropUrl} alt={player.commander.name}
              onClick={(e) => { e.stopPropagation(); setCmdPreviewName(player.commander.name); }}
              sx={{ height: sizes.artHeight, width: 'auto', borderRadius: 0.5, flexShrink: 0, cursor: 'zoom-in' }} />
          )}
          {player.commanderTax > 0 && (
            <Tooltip title={`Tax: cast ${player.commanderTax}× (+${player.commanderTax * 2} generic mana)`} placement="bottom" arrow>
              <Stack direction="row" alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', lineHeight: 1, userSelect: 'none' }}>+</Typography>
                <Box sx={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: 'radial-gradient(circle at 38% 35%, #d0d0d0, #7a7a7a)',
                  border: '1.5px solid #3a3a3a',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#111', lineHeight: 1, userSelect: 'none' }}>
                    {player.commanderTax * 2}
                  </Typography>
                </Box>
              </Stack>
            </Tooltip>
          )}
          {player.experience > 0 && (
            <Box sx={{
              position: 'relative', flexShrink: 0, width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'visible',
              ...(xpRuneGlowAnim && { animation: `${xpRuneGlowAnim} 2.5s ease-in-out infinite${animations.xpFlashing ? `, ${xpLevelUpAnim} 0.7s ease-out` : ''}` }),
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
                ...(animations.xpFlashing && { animation: `${xpFlashAnim} 0.7s ease-out` }),
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
              <Box key={animations.xpRippleKey} sx={{
                position: 'absolute', top: '50%', left: '50%',
                width: 26, height: 26,
                border: '2px solid rgba(255,215,0,0.8)',
                pointerEvents: 'none',
                animation: `${xpRippleAnim} 0.7s ease-out forwards`,
              }} />
              {/* Text — unrotated, on top */}
              <Stack direction="column" alignItems="center" spacing={0} sx={{ position: 'relative' }}>
                <Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: 10, height: 10, objectFit: 'contain', mixBlendMode: 'multiply' }} />
                <Typography sx={{ fontSize: 9, fontWeight: 900, color: '#111', lineHeight: 1, userSelect: 'none' }}>{player.experience}</Typography>
              </Stack>
            </Box>
          )}
          {/* Pass Turn */}
          {isCurrentPlayer && onPassTurn && (
            <Box
              onClick={onPassTurn}
              sx={{
                px: 1.5, py: 0.5,
                borderRadius: 1.5,
                border: '2px solid',
                borderColor: 'primary.main',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <Typography sx={{ fontSize: sizes.fsPassBtn, fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
                PASS
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Center: absolutely positioned so it's always centered relative to the full header */}
        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 'max-content', maxWidth: 'calc(100% - 96px)', textAlign: 'center', pointerEvents: 'none' }}>
          <Typography
            noWrap
            onClick={seatCode ? () => setQrOpen(true) : undefined}
            sx={{ fontWeight: 700, fontSize: sizes.fsPlayerName, lineHeight: 1.2, pointerEvents: seatCode ? 'auto' : 'none', cursor: seatCode ? 'pointer' : 'default' }}
          >
            {player.playerName}
          </Typography>
          <Typography noWrap sx={{ fontSize: sizes.fsDeckName, lineHeight: 1.2, color: 'text.secondary', pointerEvents: 'none' }}>
            {player.deckName} · {player.commander.name}{player.partner ? ` / ${player.partner.name}` : ''}
          </Typography>
        </Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto', zIndex: 1 }}>
            {/* Being viewed indicator */}
            {viewer.isBeingViewedByAnyone && (
              <VisibilityIcon onClick={(e) => { e.stopPropagation(); viewer.onEyeIconClick(); }} sx={{ fontSize: sizes.fsHeaderIcon, color: 'primary.main', cursor: 'pointer', animation: 'eyePulse 1.5s ease-in-out infinite', '@keyframes eyePulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
            )}
            {/* Active game state indicators */}
            <>
              {player.isMonarch && (
                <Tooltip open={rulesOpenLabel === 'h:Monarch'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <CrownIcon
                    onClick={guardClick(() => toggleRules('h:Monarch'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('off-monarch', () => onToggleMonarch(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: '#DAA520', cursor: 'pointer', animation: 'crownShimmer 2s ease-in-out infinite', '@keyframes crownShimmer': { '0%, 100%': { filter: 'drop-shadow(0 0 2px #DAA520) brightness(1)' }, '50%': { filter: 'drop-shadow(0 0 7px #FFD700) brightness(1.5)' } } }}
                  />
                </Tooltip>
              )}
              {!player.isMonarch && allPlayers.some(p => p.isMonarch) && (
                <Tooltip open={rulesOpenLabel === 'h:Monarch'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <CrownIcon
                    onClick={guardClick(() => toggleRules('h:Monarch'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('take-monarch', () => onToggleMonarch(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: 'text.disabled', cursor: 'pointer', opacity: 0.4 }}
                  />
                </Tooltip>
              )}
              {player.hasInitiative && (
                <Tooltip open={rulesOpenLabel === 'h:Initiative'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <InitiativeIcon
                    onClick={guardClick(() => toggleRules('h:Initiative'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('off-initiative', () => onToggleInitiative(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: '#4FC3F7', cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
              {!player.hasInitiative && allPlayers.some(p => p.hasInitiative) && (
                <Tooltip open={rulesOpenLabel === 'h:Initiative'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <InitiativeIcon
                    onClick={guardClick(() => toggleRules('h:Initiative'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('take-initiative', () => onToggleInitiative(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: 'text.disabled', cursor: 'pointer', opacity: 0.4 }}
                  />
                </Tooltip>
              )}
              {player.hasCitysBlessing && (
                <Tooltip open={rulesOpenLabel === "h:City's Blessing"} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>You have the city&apos;s blessing for the rest of the game. Gained when you control ten or more permanents — it persists even if that number later drops below ten.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <CityIcon
                    active
                    onClick={guardClick(() => toggleRules("h:City's Blessing"))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress("off-citys-blessing", () => onToggleCitysBlessing(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
              {/* Remote connected indicator */}
              {remoteConnected && (
                <SmartphoneIcon sx={{ fontSize: sizes.fsSmallIcon, color: 'success.main', animation: 'remotePulse 2s ease-in-out infinite', '@keyframes remotePulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } }, flexShrink: 0 }} />
              )}
              {/* Submenu trigger */}
              <IconButton size="small" onClick={() => setStateMenuOpen(o => !o)} onPointerDown={(e) => e.stopPropagation()} sx={{ p: 0.5, color: stateMenuOpen ? 'primary.main' : 'text.secondary' }}>
                <AddIcon sx={{ fontSize: sizes.fsMenuTrigger, transition: 'transform 0.2s ease', transform: stateMenuOpen ? 'rotate(45deg)' : 'none' }} />
              </IconButton>
            </>
          </Stack>
      </Box>

      {/* ── Main: Commander Damage (left) + Life (right) ── */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, borderTop: (theme) => `1px solid ${theme.palette.divider}`, filter: 'none', position: 'relative', zIndex: 3 }}>

        {/* Commander Damage box */}
        <Box sx={{
          ...(remoteMode ? { width: '33dvw', flexShrink: 0 } : { flex: 1, minWidth: 0 }),
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          px: remoteMode ? 1 : 0.5,
          py: remoteMode ? 1 : 0.25,
          display: 'grid',
          gridTemplateColumns: `1fr ${sizes.cmdBtnWidth} ${sizes.valColWidth} ${sizes.cmdBtnWidth}`,
          alignContent: remoteMode ? 'start' : 'center',
          alignItems: 'center',
          rowGap: remoteMode ? 0.5 : 0.1,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          transition: 'padding 0.2s ease, row-gap 0.2s ease',
        }}>
          {/* Threat vignette — commander art fades in as damage approaches 21 */}
          {threatSource?.artUrl && threatSource.intensity > 0 && (
            <Box sx={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url(${threatSource.artUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              opacity: threatSource.intensity * 0.28,
              transition: 'opacity 0.6s ease',
              pointerEvents: 'none',
            }} />
          )}
          {(threatSource?.intensity ?? 0) > 0 && (
            <Box sx={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              boxShadow: `inset 0 0 24px rgba(160,0,0,${((threatSource?.intensity ?? 0) * 0.65).toFixed(2)})`,
              transition: 'box-shadow 0.6s ease',
              pointerEvents: 'none',
            }} />
          )}
          {/* Title row */}
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ gridColumn: '1 / -1', mb: 0.25 }}>
            <Typography sx={{ fontSize: sizes.fsSectionLabel, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 }}>
              CMD Damage{isCmdDmgHigh && <Typography component="span" sx={{ fontSize: sizes.fsSectionLabel, color: 'error.main', ml: 0.5 }}>⚠</Typography>}
            </Typography>
            <Button size="small" variant={cmdDmgShowPlayer ? 'contained' : 'outlined'} onClick={toggleCmdDmgShowPlayer} sx={{ minWidth: 0, px: remoteMode ? 1.25 : 0.75, py: remoteMode ? 0.5 : 0, fontSize: remoteMode ? sizes.fsSectionLabel : 'clamp(7px, 1.2dvh, 11px)', lineHeight: 1.4, flexShrink: 0 }}>
              {cmdDmgShowPlayer ? 'Player' : 'CMD'}
            </Button>
          </Stack>
          {opponents.flatMap(({ player: source, idx: sourceIdx }) => {
            const dmg = commanderDamage[playerIdx]?.[sourceIdx] ?? [0, 0];
            const dealt = commanderDamage[sourceIdx]?.[playerIdx] ?? [0, 0];
            const dealtTotal = dealt[0] + dealt[1];
            const sourceEliminated = source.isEliminated;
            const rows = [
              <Box key={`${sourceIdx}-name`} sx={{ minWidth: 0, pt: 0 }}>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ cursor: 'pointer', minWidth: 0 }} onClick={(e) => { e.stopPropagation(); setOpenSnapshotKey(k => k === `${sourceIdx}-snap` ? null : `${sourceIdx}-snap`); }}>
                  {activePlayerIdx === sourceIdx && (
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, boxShadow: '0 0 4px 1px rgba(var(--mui-palette-primary-mainChannel) / 0.7)' }} />
                  )}
                  <Typography sx={{ fontSize: sizes.fsSourceName, color: sourceEliminated ? 'text.disabled' : activePlayerIdx === sourceIdx ? 'primary.main' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: sourceEliminated ? 'line-through' : 'none', fontWeight: activePlayerIdx === sourceIdx ? 700 : 400, flex: 1, minWidth: 0 }}>
                    {cmdDmgShowPlayer ? source.playerName : source.commander.name}
                  </Typography>
                  <Tooltip title={`Dealt ${source.partner ? `${dealt[0]}/${dealt[1]}` : dealtTotal} commander damage to ${source.playerName}`} placement="top" slotProps={position.ttSlotProps} arrow><Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 900, color: dealtTotal >= 21 ? 'error.main' : dealtTotal > 0 ? '#e67e22' : 'text.disabled', lineHeight: 1, flexShrink: 0 }}>⚔{source.partner ? `${dealt[0]}/${dealt[1]}` : dealtTotal}</Typography></Tooltip>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ mt: 0.15, flexWrap: 'wrap', alignItems: 'center' }}>
                  {source.isMonarch && <Tooltip title="Monarch" placement="top" slotProps={position.ttSlotProps} arrow><CrownIcon sx={{
                    fontSize: sizes.fsStatBadge,
                    color: '#DAA520',
                    animation: 'crownShimmer 2s ease-in-out infinite',
                    '@keyframes crownShimmer': {
                      '0%, 100%': { filter: 'drop-shadow(0 0 2px #DAA520) brightness(1)' },
                      '50%': { filter: 'drop-shadow(0 0 7px #FFD700) brightness(1.5)' },
                    },
                  }} /></Tooltip>}
                  {source.hasCitysBlessing && <Tooltip title="City's Blessing" placement="top" slotProps={position.ttSlotProps} arrow><span><CityIcon active sx={{ fontSize: sizes.fsStatBadge }} /></span></Tooltip>}
                  {source.hasInitiative && <Tooltip title="Initiative" placement="top" slotProps={position.ttSlotProps} arrow><InitiativeIcon sx={{ fontSize: sizes.fsStatBadge, color: '#4FC3F7' }} /></Tooltip>}
                  <Tooltip title={`Life: ${source.life}`} placement="top" slotProps={position.ttSlotProps} arrow><Typography sx={{ fontSize: sizes.fsStatBadge, fontWeight: 800, color: lifeColor(source.life) || 'primary.main', lineHeight: 1 }}>♥{source.life}</Typography></Tooltip>
                  {source.poison > 0 && <Tooltip title={`Poison: ${source.poison}`} placement="top" slotProps={position.ttSlotProps} arrow><Typography sx={{ fontSize: sizes.fsStatBadge, fontWeight: 800, color: source.poison >= 10 ? '#e53935' : '#66BB6A', lineHeight: 1 }}>☠{source.poison}</Typography></Tooltip>}
                  {source.energy > 0 && <Tooltip title={`Energy: ${source.energy}`} placement="top" slotProps={position.ttSlotProps} arrow><Typography sx={{ fontSize: sizes.fsStatBadge, fontWeight: 800, color: '#4FC8FF', lineHeight: 1 }}>⚡{source.energy}</Typography></Tooltip>}
                  {source.experience > 0 && <Tooltip title={`XP: ${source.experience}`} placement="top" slotProps={position.ttSlotProps} arrow><Stack direction="row" alignItems="center" spacing={0.25}><Box sx={{ bgcolor: 'background.paper', display: 'inline-flex' }}><Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: sizes.fsStatBadge, height: sizes.fsStatBadge, objectFit: 'contain', mixBlendMode: 'multiply', transition: 'width 0.2s ease, height 0.2s ease' }} /></Box><Typography sx={{ fontSize: sizes.fsStatBadge, fontWeight: 800, color: '#DAA520', lineHeight: 1 }}>{source.experience}</Typography></Stack></Tooltip>}
                </Stack>
              </Box>,
              <Tooltip key={`${sourceIdx}-dec`} open={lpKey === `${sourceIdx}-dec`} title="-5" placement="top" slotProps={position.ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => handleCmdDmgChange(playerIdx, sourceIdx, false, -1))} onPointerDown={() => startLongPress(`${sourceIdx}-dec`, () => handleCmdDmgChange(playerIdx, sourceIdx, false, -5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: sizes.cmdBtnWidth, minHeight: sizes.cmdBtnHeight }}>
                  <Typography sx={{ fontSize: sizes.fsCounterBtn, fontWeight: 700, lineHeight: 1 }}>−</Typography>
                </IconButton></span>
              </Tooltip>,
              <Typography key={`${sourceIdx}-val`} onClick={() => setFocusedControl({ type: 'commanderDamage', sourceIdx, isPartner: false })} sx={{ fontSize: sizes.fsCounterValue, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', cursor: 'pointer', color: dmg[0] >= 21 ? 'error.main' : sourceEliminated ? 'text.disabled' : 'text.primary' }}>
                {dmg[0]}
              </Typography>,
              <Tooltip key={`${sourceIdx}-inc`} open={lpKey === `${sourceIdx}-inc`} title="+5" placement="top" slotProps={position.ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => handleCmdDmgChange(playerIdx, sourceIdx, false, 1))} onPointerDown={() => startLongPress(`${sourceIdx}-inc`, () => handleCmdDmgChange(playerIdx, sourceIdx, false, 5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: sizes.cmdBtnWidth, minHeight: sizes.cmdBtnHeight }}>
                  <Typography sx={{ fontSize: sizes.fsCounterBtn, fontWeight: 700, lineHeight: 1 }}>+</Typography>
                </IconButton></span>
              </Tooltip>,
            ];
            if (source.partner) {
              rows.push(
                <Typography key={`${sourceIdx}-pname`} onClick={(e) => { e.stopPropagation(); setOpenSnapshotKey(k => k === `${sourceIdx}-psnap` ? null : `${sourceIdx}-psnap`); }} sx={{ fontSize: sizes.fsSourceName, color: sourceEliminated ? 'text.disabled' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: sourceEliminated ? 'line-through' : 'none', cursor: 'pointer' }}>
                  {source.partner.name}
                </Typography>,
                <Tooltip key={`${sourceIdx}-pdec`} open={lpKey === `${sourceIdx}-pdec`} title="-5" placement="top" slotProps={position.ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => handleCmdDmgChange(playerIdx, sourceIdx, true, -1))} onPointerDown={() => startLongPress(`${sourceIdx}-pdec`, () => handleCmdDmgChange(playerIdx, sourceIdx, true, -5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: sizes.cmdBtnWidth, minHeight: sizes.cmdBtnHeight }}>
                    <Typography sx={{ fontSize: sizes.fsCounterBtn, fontWeight: 700, lineHeight: 1 }}>−</Typography>
                  </IconButton></span>
                </Tooltip>,
                <Typography key={`${sourceIdx}-pval`} onClick={() => setFocusedControl({ type: 'commanderDamage', sourceIdx, isPartner: true })} sx={{ fontSize: sizes.fsCounterValue, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', cursor: 'pointer', color: dmg[1] >= 21 ? 'error.main' : sourceEliminated ? 'text.disabled' : 'text.primary' }}>
                  {dmg[1]}
                </Typography>,
                <Tooltip key={`${sourceIdx}-pinc`} open={lpKey === `${sourceIdx}-pinc`} title="+5" placement="top" slotProps={position.ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => handleCmdDmgChange(playerIdx, sourceIdx, true, 1))} onPointerDown={() => startLongPress(`${sourceIdx}-pinc`, () => handleCmdDmgChange(playerIdx, sourceIdx, true, 5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: sizes.cmdBtnWidth, minHeight: sizes.cmdBtnHeight }}>
                    <Typography sx={{ fontSize: sizes.fsCounterBtn, fontWeight: 700, lineHeight: 1 }}>+</Typography>
                  </IconButton></span>
                </Tooltip>,
              );
            }
            return rows;
          })}

          {/* Commander snapshot overlay */}
          {openSnapshotKey !== null && (() => {
            const match = openSnapshotKey.match(/^(\d+)-(p?snap)$/);
            if (!match) return null;
            const srcIdx = parseInt(match[1]);
            const src = opponents.find(o => o.idx === srcIdx)?.player;
            if (!src) return null;
            const dealtRows = allPlayers
              .flatMap((tgt, tgtIdx) => {
                if (tgtIdx === srcIdx) return [];
                const d = commanderDamage[tgtIdx]?.[srcIdx] ?? [0, 0];
                return [{ tgt, d, tgtIdx }];
              })
              .sort((a, b) => {
                if (a.tgtIdx === playerIdx) return -1;
                if (b.tgtIdx === playerIdx) return 1;
                return 0;
              });
            const srcLifeColor = lifeColor(src.life);
            return (
              <Box
                key="snapshot-overlay"
                onClick={() => setOpenSnapshotKey(null)}
                sx={{
                  position: 'absolute', inset: 0, zIndex: 20,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(20,12,4,0.96)' : 'rgba(255,248,240,0.97)',
                  overflow: 'auto',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                {src.commander.artCropUrl && (
                  <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${src.commander.artCropUrl})`, backgroundSize: 'cover', backgroundPosition: 'center top', opacity: 0.15, pointerEvents: 'none' }} />
                )}
                <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', p: 1, gap: 0.5, overflowY: 'auto' }}>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 800, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{src.playerName}</Typography>
                        {src.isMonarch && <CrownIcon sx={{ fontSize: sizes.fsStatBadge, color: '#DAA520', flexShrink: 0 }} />}
                        {src.hasInitiative && <InitiativeIcon sx={{ fontSize: sizes.fsStatBadge, color: '#4FC3F7', flexShrink: 0 }} />}
                      </Stack>
                      <Typography onClick={(e) => { e.stopPropagation(); setCmdPreviewName(src.commander.name); }} sx={{ fontSize: sizes.fsSectionLabel, color: 'text.secondary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{src.commander.name}</Typography>
                      {src.partner && <Typography onClick={(e) => { e.stopPropagation(); setCmdPreviewName(src.partner!.name); }} sx={{ fontSize: sizes.fsSectionLabel, color: 'text.secondary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{src.partner.name}</Typography>}
                    </Box>
                    <Typography sx={{ fontSize: 'clamp(28px, 8dvmax, 56px)', fontWeight: 900, lineHeight: 1, color: srcLifeColor || 'primary.main', textDecoration: src.isEliminated ? 'line-through' : 'none', flexShrink: 0 }}>{src.life}</Typography>
                    <Stack direction="column" alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
                      <IconButton size="small" onClick={() => setOpenSnapshotKey(null)} sx={{ p: 0.25 }}>
                        <CloseIcon sx={{ fontSize: sizes.fsSourceName }} />
                      </IconButton>
                      {onSwitchToPlayer && !src.isEliminated && srcIdx !== playerIdx && (
                        <Tooltip title="View panel" placement="left" slotProps={position.ttSlotProps} arrow>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setOpenSnapshotKey(null); onSwitchToPlayer(srcIdx); }} sx={{ p: 0.25 }}>
                            <OpenInFullIcon sx={{ fontSize: sizes.fsSectionLabel }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Stack>

                  <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />

                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="space-between" sx={{
                    px: 1, py: 0.5, borderRadius: 1,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)'
                      : 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)',
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  }}>
                    <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 700, color: src.poison >= 10 ? 'error.main' : src.poison > 0 ? '#66BB6A' : 'text.disabled' }}>☠ {src.poison}</Typography>
                    <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 700, color: src.energy > 0 ? '#4FC8FF' : 'text.disabled' }}>⚡ {src.energy}</Typography>
                    <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 700, color: src.experience > 0 ? '#DAA520' : 'text.disabled' }}>XP {src.experience}</Typography>
                    <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 700, color: src.commanderTax > 0 ? 'text.secondary' : 'text.disabled' }}>Tax +{src.commanderTax * 2}</Typography>
                  </Stack>

                  <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.25}>
                    <Typography sx={{ fontSize: sizes.fsSectionLabel, fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 0.5 }}>CMD Dealt</Typography>
                    {dealtRows.map(({ tgt, d, tgtIdx }) => {
                      const isMe = tgtIdx === playerIdx;
                      return (
                        <Stack key={tgt.playerName} direction="row" alignItems="center" justifyContent="space-between" spacing={0.5}
                          onClick={!isMe ? (e) => { e.stopPropagation(); setOpenSnapshotKey(`${tgtIdx}-snap`); } : undefined}
                          sx={{ cursor: isMe ? 'default' : 'pointer', borderRadius: 0.5, '&:hover': !isMe ? { bgcolor: 'action.hover' } : undefined, px: 0.25 }}
                        >
                          {tgt.commander?.artCropUrl
                            ? <Box component="img" src={tgt.commander.artCropUrl} alt="" onClick={(e) => { e.stopPropagation(); setCmdPreviewName(tgt.commander!.name); }} sx={{ height: 'clamp(16px, 2.5dvmax, 28px)', width: 'auto', borderRadius: 0.25, flexShrink: 0, opacity: isMe ? 1 : 0.75, cursor: 'pointer', '&:hover': { opacity: 1 } }} />
                            : <Box sx={{ height: 'clamp(16px, 2.5dvmax, 28px)', width: 'clamp(11px, 1.8dvmax, 20px)', borderRadius: 0.25, flexShrink: 0, bgcolor: 'action.hover' }} />
                          }
                          <Typography sx={{ fontSize: sizes.fsSectionLabel, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: isMe ? 'primary.main' : 'text.secondary', fontWeight: isMe ? 700 : 400 }}>{tgt.playerName}</Typography>
                          <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 700, color: (d[0] >= 21 || d[1] >= 21) ? 'error.main' : isMe ? 'primary.main' : 'text.primary', flexShrink: 0 }}>
                            {src.partner ? `${d[0]}/${d[1]}` : d[0]}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Box>
              </Box>
            );
          })()}
        </Box>

        {/* Life total + controls */}
        <Box sx={{ ...(remoteMode ? { width: '33dvw', flexShrink: 0 } : { flex: 1, minWidth: 0 }), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 0.5, alignSelf: 'stretch', pt: remoteMode ? 2 : 0 }}>
          <Box sx={{ position: 'relative', lineHeight: 1, overflow: 'visible', width: '100%', flex: remoteMode ? undefined : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {showCrown && (
              <CrownIcon sx={{
                fontSize: 'clamp(40px, 9dvh, 72px)',
                color: '#DAA520',
                transform: 'rotate(-25deg)',
                position: 'absolute',
                top: '-3dvh',
                left: '-4dvh',
                animation: monarchAnimStr,
              }} />
            )}
            <Box sx={{ position: 'relative', overflow: 'hidden', lineHeight: 1, width: '100%', flex: remoteMode ? undefined : 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {crackLayers.map(({ from, svg }) => (
                <Box key={from} sx={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
                  backgroundSize: '100% 100%',
                  mixBlendMode: 'multiply',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  opacity: crackAlpha(from),
                  transition: 'opacity 0.5s ease',
                }} />
              ))}
              {threatSource?.cmdName && threatSource.intensity > 0 && (
                [
                  { top: '10%',  left: '6%',  rotate: -18 },
                  { top: '74%',  left: '55%', rotate:  11 },
                  { top: '42%',  left: '62%', rotate:  -6 },
                  { top: '84%',  left: '8%',  rotate:  20 },
                  { top: '22%',  left: '48%', rotate:  -9 },
                ].map(({ top, left, rotate }, i) => (
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
                    textShadow: `0 0 8px rgba(180,0,0,${(threatSource.intensity * 0.4).toFixed(2)})`,
                    animation: `threatNamePulse ${1.8 + i * 0.3}s ease-in-out infinite`,
                    '@keyframes threatNamePulse': {
                      '0%, 100%': { opacity: threatSource.intensity * (0.09 + i * 0.02), transform: `rotate(${rotate + (playerIdx % 3) * 5}deg) scale(1)` },
                      '50%': { opacity: threatSource.intensity * (0.18 + i * 0.04), transform: `rotate(${rotate + (playerIdx % 3) * 5}deg) scale(1.06)` },
                    },
                  }}>
                    {threatSource.cmdName}
                  </Typography>
                ))
              )}
              <Typography onClick={() => setFocusedControl({ type: 'life' })} sx={{
                position: 'relative', zIndex: 1,
                fontWeight: 900,
                fontSize: remoteMode ? 'clamp(80px, 22dvmax, 260px)' : (countersOpen ? 'clamp(34px, 10dvh, 112px)' : 'clamp(60px, 20dvh, 240px)'),
                lineHeight: 1,
                cursor: 'pointer',
                color: computedLifeColor || ((theme: import('@mui/material').Theme) => theme.palette.primary.main),
                transition: 'color 0.4s ease, font-size 0.2s ease',
                ...(animations.damageFlash > 0 && { animation: `${damageFlashAnim} 0.6s ease-out forwards` }),
                ...(animations.damageFlash === 0 && energyPulseAnim && { animation: `${energyPulseAnim} ${energyPulseDuration.toFixed(2)}s ease-out infinite, ${energySizzleAnim} 0.12s linear infinite` }),
                ...(animations.damageFlash === 0 && !energyPulseAnim && poisonBoilAnim && { animation: `${poisonBoilAnim} ${poisonBoilDuration}s ease-in-out infinite` }),
              }}>
                {player.life}
              </Typography>
              {animations.damageFlash > 0 && (
                <Box sx={{
                  position: 'absolute', top: '44%', left: 0,
                  width: '70%', height: '10%',
                  background: 'linear-gradient(to right, transparent, rgba(200,0,0,0.5) 35%, rgba(235,0,0,0.88) 50%, rgba(200,0,0,0.5) 65%, transparent)',
                  pointerEvents: 'none',
                  animation: 'lifeSwipe1 0.6s ease-in forwards',
                  '@keyframes lifeSwipe1': {
                    '0%':   { transform: 'translate(-170%, -300%) rotate(22deg)' },
                    '100%': { transform: 'translate(370%, 300%) rotate(22deg)' },
                  },
                }} />
              )}
              {animations.damageFlash > 0 && (
                <Box sx={{
                  position: 'absolute', top: '44%', left: 0,
                  width: '70%', height: '10%',
                  background: 'linear-gradient(to left, transparent, rgba(180,0,0,0.45) 35%, rgba(215,0,0,0.78) 50%, rgba(180,0,0,0.45) 65%, transparent)',
                  pointerEvents: 'none',
                  opacity: 0,
                  animation: 'lifeSwipe2 0.6s ease-in 0.12s forwards',
                  '@keyframes lifeSwipe2': {
                    '0%':   { transform: 'translate(-170%, 300%) rotate(-16deg)', opacity: 1 },
                    '100%': { transform: 'translate(370%, -300%) rotate(-16deg)', opacity: 1 },
                  },
                }} />
              )}
              {animations.damageFlash >= 5 && (
                <Box sx={{
                  position: 'absolute', top: '44%', left: 0,
                  width: '70%', height: '10%',
                  background: 'linear-gradient(to left, transparent, rgba(220,0,0,0.4) 35%, rgba(255,20,20,0.68) 50%, rgba(220,0,0,0.4) 65%, transparent)',
                  pointerEvents: 'none', opacity: 0,
                  animation: 'lifeSwipe3 0.58s ease-in 0.28s forwards',
                  '@keyframes lifeSwipe3': {
                    '0%':   { transform: 'translate(370%, -300%) rotate(30deg)', opacity: 1 },
                    '100%': { transform: 'translate(-170%, 300%) rotate(30deg)', opacity: 1 },
                  },
                }} />
              )}
              {animations.damageFlash >= 5 && (
                <Box sx={{
                  position: 'absolute', top: '44%', left: 0,
                  width: '70%', height: '10%',
                  background: 'linear-gradient(to left, transparent, rgba(200,0,0,0.38) 35%, rgba(235,10,10,0.62) 50%, rgba(200,0,0,0.38) 65%, transparent)',
                  pointerEvents: 'none', opacity: 0,
                  animation: 'lifeSwipe4 0.6s ease-in 0.4s forwards',
                  '@keyframes lifeSwipe4': {
                    '0%':   { transform: 'translate(370%, 300%) rotate(-22deg)', opacity: 1 },
                    '100%': { transform: 'translate(-170%, -300%) rotate(-22deg)', opacity: 1 },
                  },
                }} />
              )}
              {animations.damageFlash >= 5 && (
                <Box sx={{
                  position: 'absolute', top: '44%', left: 0,
                  width: '70%', height: '10%',
                  background: 'linear-gradient(to right, transparent, rgba(180,0,0,0.35) 35%, rgba(220,10,10,0.58) 50%, rgba(180,0,0,0.35) 65%, transparent)',
                  pointerEvents: 'none', opacity: 0,
                  animation: 'lifeSwipe5 0.58s ease-in 0.54s forwards',
                  '@keyframes lifeSwipe5': {
                    '0%':   { transform: 'translate(-170%, -350%) rotate(38deg)', opacity: 1 },
                    '100%': { transform: 'translate(370%, 350%) rotate(38deg)', opacity: 1 },
                  },
                }} />
              )}
              <Stack direction="row" alignItems="center" spacing={remoteMode ? 0 : 0.5} sx={{ mt: remoteMode ? 1 : 'clamp(0px, 0.6dvh, 4px)', flexShrink: 0, zIndex: 1, ...(remoteMode && { width: '100%', justifyContent: 'space-evenly' }) }}>
                <Tooltip open={lpKey === 'life-dec'} title="-5" placement="top" slotProps={position.ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <IconButton
                    onClick={guardClick(() => onLifeChange(playerIdx, -1))}
                    onPointerDown={() => startLongPress('life-dec', () => onLifeChange(playerIdx, -5))}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ px: remoteMode ? 4 : 0.5, py: 0.5, minWidth: remoteMode ? 100 : 52, minHeight: 52, borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 } }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: sizes.fsLifeBtn }}>−</Typography>
                  </IconButton>
                </Tooltip>
                <Tooltip open={lpKey === 'life-inc'} title="+5" placement="top" slotProps={position.ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <IconButton
                    onClick={guardClick(() => onLifeChange(playerIdx, 1))}
                    onPointerDown={() => startLongPress('life-inc', () => onLifeChange(playerIdx, 5))}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ px: remoteMode ? 4 : 0.5, py: 0.5, minWidth: remoteMode ? 100 : 52, minHeight: 52, borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 } }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: sizes.fsLifeBtn }}>+</Typography>
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Counters — right column, collapsible */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          ...(countersOpen ? { flex: 1 } : { flex: 'none', width: 24 }),
          minWidth: 0,
          overflow: 'hidden',
          borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
        }}>
          <Box
            onClick={() => setCountersOpen(o => !o)}
            sx={{ width: 24, flexShrink: 0, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', pt: 0.5, gap: 0.5, cursor: 'pointer' }}
          >
            {!countersOpen && <>
              {player.poison > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 14, color: player.poison >= 10 ? '#e53935' : '#66BB6A', lineHeight: 1 }}>☠</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: player.poison >= 10 ? '#e53935' : '#66BB6A', fontWeight: 700, lineHeight: 1 }}>{player.poison}</Typography>
                </Box>
              )}
              {player.energy > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 14, color: '#4FC8FF', lineHeight: 1 }}>⚡</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: '#4FC8FF', fontWeight: 700, lineHeight: 1 }}>{player.energy}</Typography>
                </Box>
              )}
              {player.experience > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: 14, height: 14, objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: '#DAA520', fontWeight: 700, lineHeight: 1 }}>{player.experience}</Typography>
                </Box>
              )}
              {player.commanderTax > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, background: 'radial-gradient(circle at 38% 35%, #d0d0d0, #7a7a7a)', border: '1.5px solid #3a3a3a', boxShadow: '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: 7, fontWeight: 800, color: '#111', lineHeight: 1, userSelect: 'none' }}>+{player.commanderTax * 2}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 700, lineHeight: 1 }}>{player.commanderTax}</Typography>
                </Box>
              )}
            </>}
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
              <ChevronRightIcon sx={{ fontSize: 22, color: 'text.secondary', transform: countersOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease', display: 'block' }} />
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', opacity: countersOpen ? 1 : 0, transition: 'opacity 0.15s ease' }}>
            <Typography sx={{ fontSize: sizes.fsSectionLabel, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, px: 0.75, pt: 0.5, pb: 0.25, flexShrink: 0 }}>Counters</Typography>
            <Box sx={{
              flex: 1,
              minWidth: 0,
              px: remoteMode ? 0.75 : 0.25,
              pb: remoteMode ? 1 : 0.25,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: `1fr ${sizes.cmdBtnWidth} ${sizes.valColWidth} ${sizes.cmdBtnWidth}`,
              alignContent: remoteMode ? 'start' : 'safe center',
              alignItems: 'center',
              rowGap: remoteMode ? 0.5 : 0.1,
            }}>
            {([
              ['Poison', player.poison, () => onPoisonChange(playerIdx, -1), () => onPoisonChange(playerIdx, 1), () => onPoisonChange(playerIdx, -5), () => onPoisonChange(playerIdx, 5), player.poison >= 10 ? 'error.main' : player.poison > 0 ? 'warning.main' : 'text.disabled'],
              ['Energy', player.energy, () => onEnergyChange(playerIdx, -1), () => onEnergyChange(playerIdx, 1), () => onEnergyChange(playerIdx, -5), () => onEnergyChange(playerIdx, 5), player.energy > 0 ? 'primary.main' : 'text.disabled'],
              ['XP', player.experience, () => onExperienceChange(playerIdx, -1), () => onExperienceChange(playerIdx, 1), () => onExperienceChange(playerIdx, -5), () => onExperienceChange(playerIdx, 5), player.experience > 0 ? 'primary.main' : 'text.disabled'],
              ['Tax', player.commanderTax, () => onCommanderTaxChange(playerIdx, -1), () => onCommanderTaxChange(playerIdx, 1), () => onCommanderTaxChange(playerIdx, -5), () => onCommanderTaxChange(playerIdx, 5), player.commanderTax > 0 ? 'warning.main' : 'text.disabled'],
            ] as [string, number, () => void, () => void, () => void, () => void, string][]).flatMap(([label, value, onDec, onInc, onDec5, onInc5, color]) => [
              <Stack key={`${label}-lbl`} direction="row" alignItems="center" spacing={0.4} sx={{ overflow: 'hidden', filter: poisonProgress > 0 ? `blur(${Math.pow(poisonProgress, 2.5) * 1.5}px)` : 'none', minWidth: 0 }}>
                {label === 'Poison'     && <Typography component="span" sx={{ fontSize: sizes.fsSourceName, color: player.poison >= 10 ? '#e53935' : '#66BB6A', lineHeight: 1, flexShrink: 0 }}>☠</Typography>}
                {label === 'Energy'     && <Typography component="span" sx={{ fontSize: sizes.fsSourceName, color: '#4FC8FF', lineHeight: 1, flexShrink: 0 }}>⚡</Typography>}
                {label === 'XP' && <Box sx={{ bgcolor: 'background.paper', display: 'inline-flex', flexShrink: 0 }}><Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: sizes.fsSourceName, height: sizes.fsSourceName, objectFit: 'contain', mixBlendMode: 'multiply' }} /></Box>}
                {label === 'Tax'        && <Box sx={{ width: sizes.fsSourceName, height: sizes.fsSourceName, borderRadius: '50%', flexShrink: 0, background: 'radial-gradient(circle at 38% 35%, #d0d0d0, #7a7a7a)', border: '1px solid #3a3a3a', boxShadow: '0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography sx={{ fontSize: 7, fontWeight: 800, color: '#111', lineHeight: 1, userSelect: 'none' }}>+{player.commanderTax * 2}</Typography></Box>}
                <Typography component="span" sx={{ fontSize: sizes.fsSourceName, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</Typography>
              </Stack>,
              <Tooltip key={`${label}-dec`} open={lpKey === `${label}-dec`} title="-5" placement="top" slotProps={position.ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                <IconButton onClick={guardClick(onDec)} onPointerDown={() => startLongPress(`${label}-dec`, onDec5)} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: sizes.cmdBtnWidth, minHeight: sizes.cmdBtnHeight }}><Typography sx={{ fontSize: sizes.fsCounterBtn, fontWeight: 700 }}>−</Typography></IconButton>
              </Tooltip>,
              <Typography key={`${label}-val`} onClick={() => { const t = { 'Poison': 'poison', 'Energy': 'energy', 'XP': 'experience', 'Tax': 'commanderTax' }[label] as 'poison' | 'energy' | 'experience' | 'commanderTax' | undefined; if (t) setFocusedControl({ type: t }); }} sx={{ fontSize: sizes.fsCounterValue, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', cursor: 'pointer', color, filter: poisonProgress > 0 ? `blur(${Math.pow(poisonProgress, 2.5) * 1.5}px)` : 'none', ...(label === 'Poison' && value === 9 && { animation: 'poisonPulse 2.5s ease-in-out infinite', '@keyframes poisonPulse': { '0%, 100%': { opacity: 1, transform: 'scale(1)', textShadow: '0 0 8px rgba(0,200,60,0.9), 0 0 20px rgba(0,200,60,0.5)' }, '50%': { opacity: 0.3, transform: 'scale(0.85)', textShadow: '0 0 2px rgba(0,200,60,0.2)' } } }), ...(label === 'XP' && xpGlow && { textShadow: xpGlow, ...(xpShimmerAnim && { animation: `${xpShimmerAnim} 3s ease-in-out infinite` }) }) }}>{value}</Typography>,
              <Tooltip key={`${label}-inc`} open={lpKey === `${label}-inc`} title="+5" placement="top" slotProps={position.ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                <IconButton onClick={guardClick(onInc)} onPointerDown={() => startLongPress(`${label}-inc`, onInc5)} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: sizes.cmdBtnWidth, minHeight: sizes.cmdBtnHeight }}><Typography sx={{ fontSize: sizes.fsCounterBtn, fontWeight: 700 }}>+</Typography></IconButton>
              </Tooltip>,
            ])}
          </Box>
        </Box>
      </Box>
      </Box>

      {/* ── Faded background art ── */}
      {player.commander.artCropUrl && (
        <Box
          component="img"
          src={player.commander.artCropUrl}
          alt=""
          sx={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            opacity: 0.12, zIndex: 0, pointerEvents: 'none',
          }}
        />
      )}

      {/* ── City's Blessing god rays ── */}
      {animations.cityBlessingVisible && (
        <Box component="svg" preserveAspectRatio="none" viewBox="0 0 100 100"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0,
            animation: animations.cityBlessingExiting
              ? `${godRaysFadeOut} 1.5s ease-in forwards`
              : `${godRaysFadeIn} 2s 2s ease-out forwards, ${godRaysPulse} 6s 4s ease-in-out infinite`,
          }}>
          <defs>
            <linearGradient id="rayFade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#FFE050" stopOpacity="0.6"/>
              <stop offset="60%"  stopColor="#FFE050" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#FFE050" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <polygon points="0,0  4,0   14,100" fill="url(#rayFade)" opacity="0.7"/>
          <polygon points="0,0  20,0  30,100" fill="url(#rayFade)" opacity="0.5"/>
          <polygon points="0,0  38,0  46,100" fill="url(#rayFade)" opacity="0.6"/>
          <polygon points="0,0  58,0  65,100" fill="url(#rayFade)" opacity="0.4"/>
          <polygon points="0,0  78,0  83,100" fill="url(#rayFade)" opacity="0.55"/>
          <polygon points="0,0  100,8 100,16"  fill="url(#rayFade)" opacity="0.45"/>
          <polygon points="0,0  100,38 100,46" fill="url(#rayFade)" opacity="0.35"/>
          <polygon points="0,0  100,65 100,73" fill="url(#rayFade)" opacity="0.45"/>
        </Box>
      )}

      {/* ── City's Blessing: castle + house row ── */}
      {animations.cityBlessingVisible && (
        <Box component="svg" viewBox="0 0 640 240" preserveAspectRatio="none" sx={{
          position: 'absolute', bottom: -55, left: -80,
          width: 'calc(100% + 80px)', height: 200,
          fill: 'rgba(0,0,0,0.52)', stroke: 'rgba(0,0,0,0.78)', strokeWidth: 1.2,
          zIndex: 0, pointerEvents: 'none',
          animation: animations.cityBlessingExiting
            ? `${castleSlideOut} 1.8s 2s ease-in forwards`
            : `${castleSlideIn} 1.8s ease-out forwards`,
        }}>
          <path d="
            M0,240
            L0,62 L40,0 L80,62
            L80,92 L86,92 L86,80 L94,80 L94,92 L102,92 L102,80 L110,80 L110,92
            L118,92 L118,80 L126,80 L126,92
            L126,68 L150,42 L174,68
            L174,92 L182,92 L182,80 L190,80 L190,92 L198,92 L198,80 L206,80 L206,92
            L214,92 L214,80 L222,80 L222,92
            L220,62 L260,0 L300,62
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
          <rect x="326" y="136" width="5" height="22" rx="1"/>
          <rect x="400" y="102" width="5" height="18" rx="1"/>
          <rect x="460" y="116" width="5" height="20" rx="1"/>
          <rect x="556" y="100" width="5" height="18" rx="1"/>
          <rect x="616" y="124" width="4" height="16" rx="1"/>
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
      {animations.cityBlessingVisible && (
        <Box component="svg" viewBox="0 0 600 100" preserveAspectRatio="none" sx={{
          position: 'absolute', bottom: 55, left: 0, right: 0,
          width: '100%', height: 80,
          zIndex: 0, pointerEvents: 'none', opacity: 0,
          animation: animations.cityBlessingExiting
            ? `${skylineFadeOut} 0.8s 2s ease-in forwards`
            : `${skylineFadeIn} 4s 0.5s ease-out forwards`,
        }}>
          <path d="M0,100 C90,10 200,55 310,22 C430,-5 510,42 600,16 L600,100 Z" fill="rgba(0,0,0,0.09)"/>
          <path d="M0,100 C75,25 175,60 295,38 C405,16 505,55 600,36 L600,100 Z" fill="rgba(0,0,0,0.11)"/>
          <path d="M0,100 C60,45 160,70 275,54 C382,38 480,66 600,50 L600,100 Z" fill="rgba(0,0,0,0.14)"/>
        </Box>
      )}

      {/* ── City's Blessing: distant skyline ── */}
      {animations.cityBlessingVisible && (
        <Box component="svg" viewBox="0 0 800 80" preserveAspectRatio="none" sx={{
          position: 'absolute', bottom: 38, left: 0, right: 0,
          width: '100%', height: 55,
          fill: 'rgba(0,0,0,0.22)', stroke: 'none',
          zIndex: 0, pointerEvents: 'none', opacity: 0,
          animation: animations.cityBlessingExiting
            ? `${skylineFadeOut} 0.8s 2s ease-in forwards`
            : `${skylineFadeIn} 3s 1.2s ease-out forwards`,
        }}>
          <path d="
            M0,80 L0,55 L8,40 L4,40 L14,8 L24,40 L20,40 L22,55
            L40,55 L40,62 L55,62 L55,50 L65,36 L75,50 L75,62
            L92,62 L92,55 L102,40 L102,26 L106,6 L110,26 L110,40 L120,55
            L120,62 L138,62 L138,55 L150,40 L162,55 L162,62 L176,62
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
      {animations.cityBlessingVisible && (
        <Box component="svg" viewBox="0 0 200 220" sx={{
          position: 'absolute', bottom: -35, right: -40,
          width: 200, height: 220,
          fill: 'rgba(0,0,0,0.52)', stroke: 'rgba(0,0,0,0.78)', strokeWidth: 1.2,
          zIndex: 0, pointerEvents: 'none',
          animation: animations.cityBlessingExiting
            ? `${castleSlideOutRight} 1.8s 2s ease-in forwards`
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
      {animations.cityBlessingVisible && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden',
          ...(animations.cityBlessingExiting && { animation: `${fwFadeOut} 0.5s ease-out forwards` }),
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
      {animations.cityBlessingVisible && !animations.cityBlessingExiting && ([
        { top: '4%',  scale: 1.0,  delay: '4.5s',  dur: '28s' },
        { top: '12%', scale: 0.65, delay: '13.5s', dur: '34s' },
        { top: '2%',  scale: 1.3,  delay: '23.5s', dur: '22s' },
      ]).map((c, i) => (
        <Box key={i} component="svg" viewBox="0 0 100 40" sx={{
          position: 'absolute', top: c.top, left: 0, zIndex: 2,
          width: `${100 * c.scale}px`, height: `${40 * c.scale}px`,
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

      {/* ── City's Blessing: marching flags ── */}
      {animations.cityBlessingVisible && !animations.cityBlessingExiting && (() => {
        const threatArtUrl = (threatSource?.artUrl) ?? null;
        const threatCount = !threatArtUrl
          ? 0
          : Math.min(Math.floor(threatSource!.dmg * 12 / 20), 12);
        const stolenIndices: ReadonlySet<number> = new Set(THREAT_STEAL_ORDER.slice(0, threatCount));
        return (
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', animation: `${flagMarch} 38s linear infinite` }}>
          {CITY_FLAG_CONFIGS.map((cfg, i) => {
            const isThreat = stolenIndices.has(i);
            return (
            <CityFlag
              key={i}
              left={cfg.left}
              bottom={cfg.bottom}
              riseDelay={cfg.riseDelay}
              wiggleDuration={cfg.wiggleDuration}
              wiggleOffset={cfg.wiggleOffset}
              driftDuration={cfg.driftDuration}
              driftOffset={cfg.driftOffset}
              artCropUrl={isThreat ? threatArtUrl! : player.commander.artCropUrl}
              commanderName={player.commander.name}
            />
            );
          })}
        </Box>
        );
      })()}

      {/* ── Concede confirm overlay ── */}
      {showEliminateConfirm && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none', bgcolor: 'rgba(218,165,32,0.12)' }}>
          <Typography sx={{ fontWeight: 900, color: '#DAA520', fontSize: 22, letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.5)', transform: 'rotate(-10deg)' }}>
            CONCEDE?
          </Typography>
        </Box>
      )}

      {/* ── Eliminated overlay ── */}
      {player.isEliminated && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11, pointerEvents: 'none', bgcolor: player.isConceded && !isPoisoned ? 'rgba(218,165,32,0.12)' : 'transparent', overflow: 'hidden' }}>
          {player.isConceded && !isPoisoned && TEARS.map((t, i) => (
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
            sx={{ fontWeight: 900, letterSpacing: 4, fontSize: 48, transform: 'rotate(-15deg)', color: isPoisoned ? undefined : player.isConceded ? '#DAA520' : 'error.main' }}
            style={isPoisoned ? { color: '#00c853', WebkitTextFillColor: '#00c853', WebkitTextStroke: '2px black' } : player.isConceded ? { WebkitTextStroke: '2px black' } : undefined}
          >
            {isPoisoned ? 'POISONED' : player.isConceded ? 'CONCEDED' : 'ELIMINATED'}
          </Typography>
        </Box>
      )}

      {/* ── Life kill attribution overlay ── */}
      {lifeKillOpponents && onLifeKillSelect && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: 'rgba(0,0,0,0.72)', px: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: sizes.fsKillPrompt, color: '#fff', mb: 0.5, textAlign: 'center' }}>
            Who brought {player.playerName} to 0?
          </Typography>
          {lifeKillOpponents.map((opp) => (
            <Button key={opp.idx} variant="outlined" fullWidth onClick={() => onLifeKillSelect(opp.idx)}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              {opp.name}
            </Button>
          ))}
          <Button onClick={() => onLifeKillSelect(null)} sx={{ color: 'rgba(255,255,255,0.5)', fontSize: sizes.fsKillPrompt, mt: 0.5 }}>
            Skip
          </Button>
        </Box>
      )}

      {/* ── Poison kill attribution overlay ── */}
      {poisonKillOpponents && onPoisonKillSelect && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: 'rgba(0,40,0,0.78)', px: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: sizes.fsKillPrompt, color: '#7fff7f', mb: 0.5, textAlign: 'center' }}>
            Who poisoned {player.playerName}?
          </Typography>
          {poisonKillOpponents.map((opp) => (
            <Button key={opp.idx} variant="outlined" fullWidth onClick={() => onPoisonKillSelect(opp.idx)}
              sx={{ color: '#7fff7f', borderColor: 'rgba(100,255,100,0.4)', '&:hover': { borderColor: '#7fff7f', bgcolor: 'rgba(100,255,100,0.1)' } }}>
              {opp.name}
            </Button>
          ))}
          <Button onClick={() => onPoisonKillSelect(null)} sx={{ color: 'rgba(100,255,100,0.4)', fontSize: sizes.fsKillPrompt, mt: 0.5 }}>
            Skip
          </Button>
        </Box>
      )}

      {/* ── Game state submenu ── */}
      {stateMenuOpen && (
        <Box
          sx={{
            position: 'absolute', inset: 0, zIndex: 20,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(20,12,6,0.93)' : 'rgba(255,248,240,0.95)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
            overflowY: 'auto', py: 2, gap: 0,
            animation: 'stateMenuFadeIn 0.15s ease-out both',
            '@keyframes stateMenuFadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
          }}
          onClick={() => { setStateMenuOpen(false); setShowEliminateConfirm(false); }}
        >
          <Box
            sx={{
              width: '90%', maxWidth: 220, maxHeight: '80%',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1E1510' : '#FFFAF5',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 },
              overflowY: 'auto', overflowX: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {([
              { label: 'Monarch', icon: <CrownIcon sx={{ fontSize: 18, color: player.isMonarch ? '#DAA520' : 'inherit' }} />, active: player.isMonarch, color: '#DAA520', toggle: () => { onToggleMonarch(playerIdx); setStateMenuOpen(false); }, rulesText: 'Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.' },
              { label: 'Initiative', icon: <InitiativeIcon sx={{ fontSize: 18 }} />, active: player.hasInitiative, color: '#4FC3F7', toggle: () => { onToggleInitiative(playerIdx); setStateMenuOpen(false); }, rulesText: "When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative." },
              { label: "City's Blessing", icon: <CityIcon active={player.hasCitysBlessing} sx={{ fontSize: 18 }} />, active: player.hasCitysBlessing, color: '#7851A9', toggle: () => { onToggleCitysBlessing(playerIdx); setStateMenuOpen(false); }, rulesText: "You have the city&apos;s blessing for the rest of the game. Gained when you control ten or more permanents — it persists even if that number later drops below ten." },
            ] as { label: string; icon: React.ReactNode; active: boolean; color: string; toggle: () => void; rulesText: string }[]).map(({ label, icon, active, color, toggle, rulesText }) => (
              <Box key={label} onClick={toggle} sx={{
                display: 'flex', alignItems: 'center', gap: 1.25,
                px: 1.5, py: 1,
                cursor: 'pointer',
                color: active ? color : 'text.disabled',
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                '&:hover': { bgcolor: 'action.hover' },
                transition: 'background-color 0.15s ease',
              }}>
                {icon}
                <Typography sx={{ fontSize: 13, fontWeight: active ? 700 : 400, lineHeight: 1 }}>{label}</Typography>
                <Tooltip
                  open={rulesOpenLabel === `m:${label}`}
                  onClose={() => setRulesOpenLabel(null)}
                  title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>{rulesText}</Typography>}
                  placement="left"
                  arrow
                  disableHoverListener
                  disableFocusListener
                  disableTouchListener
                  slotProps={{ tooltip: { sx: { rotate: position.ttRotate } } }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); toggleRules(`m:${label}`); }}
                    sx={{ p: 0.25, ml: 'auto', color: rulesOpenLabel === `m:${label}` ? 'primary.main' : 'text.disabled' }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
                {active && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />}
              </Box>
            ))}
            {/* Eliminate row */}
            {player.isEliminated ? (
              <Box onClick={() => { onUndoEliminate(playerIdx); setStateMenuOpen(false); }} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', color: 'error.main', borderTop: (theme) => `1px solid ${theme.palette.divider}`, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                <ElimIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>Undo Concede</Typography>
              </Box>
            ) : showEliminateConfirm ? (
              <Stack spacing={0.75} sx={{ px: 1.5, py: 1, bgcolor: 'rgba(218,165,32,0.12)', borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#DAA520', lineHeight: 1.3 }}>Are you sure you want to quit?</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TextField size="small" label="Turn #" type="number" value={eliminateTurnInput}
                    onChange={(e) => setEliminateTurnInput(e.target.value)}
                    slotProps={{ htmlInput: { min: 1 } }} sx={{ width: 72 }} />
                  <Button size="small" variant="contained"
                    onClick={() => { onEliminate(playerIdx); setShowEliminateConfirm(false); setEliminateTurnInput(''); setStateMenuOpen(false); }}
                    sx={{ fontSize: 9, py: 0, px: 0.5, minWidth: 0, bgcolor: '#DAA520', '&:hover': { bgcolor: '#c49a18' } }}>✓</Button>
                  <Button size="small" variant="outlined"
                    onClick={() => setShowEliminateConfirm(false)}
                    sx={{ fontSize: 9, py: 0, px: 0.5, minWidth: 0, borderColor: '#DAA520', color: '#DAA520' }}>✕</Button>
                </Stack>
              </Stack>
            ) : (
              <Box onClick={() => setShowEliminateConfirm(true)} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', color: 'text.disabled', borderTop: (theme) => `1px solid ${theme.palette.divider}`, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                <ElimIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, lineHeight: 1 }}>Concede</Typography>
              </Box>
            )}
            {/* Seat code row */}
            {seatCode && (
              <Box
                onClick={(e) => { e.stopPropagation(); setQrOpen(true); setStateMenuOpen(false); }}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', borderTop: (theme) => `1px solid ${theme.palette.divider}`, color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}
              >
                <Typography sx={{ fontSize: 12, fontFamily: 'monospace', letterSpacing: 1.5, fontWeight: 700, flex: 1 }}>
                  {seatCode}
                </Typography>
                <QrCodeIcon sx={{ fontSize: 16 }} />
              </Box>
            )}
            {/* Rules Guru chat — remote only */}
            {remoteMode && onOpenChat && (
              <Box
                onClick={(e) => { e.stopPropagation(); onOpenChat(player.playerName); setStateMenuOpen(false); }}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', borderTop: (theme) => `1px solid ${theme.palette.divider}`, color: 'primary.main', '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}
              >
                <ChatIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, lineHeight: 1 }}>Ask Rules</Typography>
              </Box>
            )}
            {/* Remote-only: sound + theme toggles */}
            {remoteMode && (
              <Box sx={{ display: 'flex', borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Box onClick={(e) => { e.stopPropagation(); onToggleSound?.(); setStateMenuOpen(false); }} sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, py: 1, cursor: 'pointer', color: soundEnabled ? 'primary.main' : 'text.disabled', '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                  {soundEnabled ? <VolumeUpIcon sx={{ fontSize: 18 }} /> : <VolumeOffIcon sx={{ fontSize: 18 }} />}
                  <Typography sx={{ fontSize: 13, lineHeight: 1 }}>Sound</Typography>
                </Box>
                {onToggleTheme && (
                  <Box onClick={(e) => { e.stopPropagation(); onToggleTheme(); setStateMenuOpen(false); }} sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, py: 1, cursor: 'pointer', color: 'text.secondary', borderLeft: (theme) => `1px solid ${theme.palette.divider}`, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                    {themeMode === 'light' ? <Brightness4Icon sx={{ fontSize: 18 }} /> : <Brightness7Icon sx={{ fontSize: 18 }} />}
                    <Typography sx={{ fontSize: 13, lineHeight: 1 }}>{themeMode === 'light' ? 'Dark' : 'Light'}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1.5 }}>tap outside to close</Typography>
        </Box>
      )}

      {/* ── Viewer notification banner ── */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 12,
        background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}00 0%, ${theme.palette.primary.main}aa 44%, ${theme.palette.primary.main}ff 50%, ${theme.palette.primary.main}aa 56%, ${theme.palette.primary.main}00 100%)`,
        color: '#fff',
        px: 1, py: 0.4,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, textAlign: 'center',
        pointerEvents: 'none',
        opacity: viewer.viewerBannerVisible ? 1 : 0,
        transition: viewer.viewerBannerVisible ? 'opacity 0.2s ease' : 'opacity 0.6s ease',
      }}>
        <VisibilityIcon sx={{ fontSize: 13 }} />
        <Typography sx={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>{viewer.viewerTooltipText}</Typography>
      </Box>

      {/* ── Focused control modal — enlarged single counter/damage control ── */}
      {(() => {
        if (!focusedControl) return null;
        const fc = focusedControl;
        let label = '';
        let value = 0;
        let onDec: () => void = () => {};
        let onInc: () => void = () => {};
        let onDec5: (() => void) | undefined;
        let onInc5: (() => void) | undefined;
        let valueColor: string = 'text.primary';
        if (fc.type === 'life') {
          label = 'Life Total';
          value = player.life;
          onDec = () => onLifeChange(playerIdx, -1);
          onInc = () => onLifeChange(playerIdx, 1);
          onDec5 = () => onLifeChange(playerIdx, -5);
          onInc5 = () => onLifeChange(playerIdx, 5);
          valueColor = computedLifeColor || 'primary.main';
        } else if (fc.type === 'poison') {
          label = 'Poison';
          value = player.poison;
          onDec = () => onPoisonChange(playerIdx, -1);
          onInc = () => onPoisonChange(playerIdx, 1);
          onDec5 = () => onPoisonChange(playerIdx, -5);
          onInc5 = () => onPoisonChange(playerIdx, 5);
          valueColor = player.poison >= 10 ? 'error.main' : player.poison > 0 ? 'warning.main' : 'text.disabled';
        } else if (fc.type === 'energy') {
          label = 'Energy';
          value = player.energy;
          onDec = () => onEnergyChange(playerIdx, -1);
          onInc = () => onEnergyChange(playerIdx, 1);
          onDec5 = () => onEnergyChange(playerIdx, -5);
          onInc5 = () => onEnergyChange(playerIdx, 5);
          valueColor = player.energy > 0 ? 'primary.main' : 'text.disabled';
        } else if (fc.type === 'experience') {
          label = 'XP';
          value = player.experience;
          onDec = () => onExperienceChange(playerIdx, -1);
          onInc = () => onExperienceChange(playerIdx, 1);
          onDec5 = () => onExperienceChange(playerIdx, -5);
          onInc5 = () => onExperienceChange(playerIdx, 5);
          valueColor = player.experience > 0 ? 'primary.main' : 'text.disabled';
        } else if (fc.type === 'commanderTax') {
          label = 'Tax';
          value = player.commanderTax;
          onDec = () => onCommanderTaxChange(playerIdx, -1);
          onInc = () => onCommanderTaxChange(playerIdx, 1);
          onDec5 = () => onCommanderTaxChange(playerIdx, -5);
          onInc5 = () => onCommanderTaxChange(playerIdx, 5);
          valueColor = player.commanderTax > 0 ? 'warning.main' : 'text.disabled';
        } else if (fc.type === 'commanderDamage' && fc.sourceIdx !== undefined) {
          const src = allPlayers[fc.sourceIdx];
          const dmg = commanderDamage[playerIdx]?.[fc.sourceIdx] ?? [0, 0];
          const isPartner = fc.isPartner ?? false;
          const srcName = isPartner ? (src?.partner?.name ?? 'Partner') : (src?.commander?.name ?? src?.playerName ?? `Player ${fc.sourceIdx + 1}`);
          label = `CMD Dmg — ${srcName}`;
          value = isPartner ? dmg[1] : dmg[0];
          onDec = () => handleCmdDmgChange(playerIdx, fc.sourceIdx!, isPartner, -1);
          onInc = () => handleCmdDmgChange(playerIdx, fc.sourceIdx!, isPartner, 1);
          onDec5 = () => handleCmdDmgChange(playerIdx, fc.sourceIdx!, isPartner, -5);
          onInc5 = () => handleCmdDmgChange(playerIdx, fc.sourceIdx!, isPartner, 5);
          valueColor = value >= 21 ? 'error.main' : 'text.primary';
        }
        return (
          <ControlFocusModal
            open
            onClose={() => setFocusedControl(null)}
            label={label}
            value={value}
            color={valueColor}
            onDec={onDec}
            onInc={onInc}
            onDec5={onDec5}
            onInc5={onInc5}
          />
        );
      })()}

      {/* ── Commander card preview overlay ── */}
      {cmdPreviewName && (
        <Box
          onClick={() => { setCmdPreviewName(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); }}
          sx={{ position: 'absolute', inset: 0, zIndex: 35, bgcolor: 'rgba(0,0,0,0.88)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}
        >
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); setCmdPreviewName(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); }}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: 'rgba(255,255,255,0.85)', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' } }}
          >
            <CloseIcon sx={{ fontSize: 28 }} />
          </IconButton>
          {cmdPreviewUrl ? (
            cmdPreviewZoom > 1 ? (
              <Box
                ref={cmdScrollRef}
                onClick={() => { setCmdPreviewName(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); }}
                sx={{ position: 'absolute', inset: 8, overflow: 'auto', cursor: 'zoom-out', background: 'transparent !important' }}
              >
                <Box sx={{ minWidth: '100%', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent !important' }}>
                  <Box
                    component="img"
                    src={cmdPreviewUrl}
                    alt={cmdPreviewName ?? ''}
                    draggable={false}
                    onClick={(e) => { e.stopPropagation(); setCmdPreviewZoom(1); }}
                    sx={{ display: 'block', width: cmdPreviewBase ? cmdPreviewBase.w * cmdPreviewZoom : 'auto', height: 'auto', borderRadius: '4.7%', userSelect: 'none', flexShrink: 0 }}
                  />
                </Box>
              </Box>
            ) : (
              <Box
                component="img"
                src={cmdPreviewUrl}
                alt={cmdPreviewName ?? ''}
                draggable={false}
                onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => setCmdPreviewBase({ w: e.currentTarget.clientWidth, h: e.currentTarget.clientHeight })}
                onClick={(e) => { e.stopPropagation(); setCmdPreviewZoom(2.5); }}
                sx={{ maxHeight: '88%', maxWidth: '88%', borderRadius: '4.7%', display: 'block', cursor: 'zoom-in', userSelect: 'none' }}
              />
            )
          ) : (
            <CircularProgress size={36} thickness={4} sx={{ color: 'rgba(255,255,255,0.45)' }} />
          )}
        </Box>
      )}

      {/* ── QR overlay — in-panel, does not take over the board ── */}
      {seatCode && qrOpen && (
        <Box
          onClick={() => { navigator.clipboard?.writeText(seatCode).catch(() => {}); setQrOpen(false); }}
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(20,12,6,0.93)' : 'rgba(255,248,240,0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            cursor: 'pointer',
          }}
        >
          <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: 1 }}>
            <QRCodeSVG
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}${ASSET_BASE}/game-manager/remote/?code=${seatCode}`}
              size={140}
            />
          </Box>
          <Typography sx={{ fontFamily: 'monospace', fontSize: 15, letterSpacing: 3, fontWeight: 700 }}>
            {seatCode}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            tap to copy &amp; close
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export const PlayerCard = memo(PlayerCardImpl, arePlayerCardPropsEqual);
