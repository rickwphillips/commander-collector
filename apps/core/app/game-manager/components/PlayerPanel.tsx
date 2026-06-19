'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { usePoisonSound } from '@/game-manager/hooks/usePoisonSound';
import { useSounds } from '@/game-manager/hooks/useSounds';
import { keyframes } from '@emotion/react';
import { Box, CircularProgress, Stack, Typography, IconButton, Button, TextField, Tooltip, SvgIcon } from '@mui/material';
import { getCardImageByName } from '@commander/shared/lib/cardImageCache';
import { ControlFocusModal } from './ControlFocusModal';
import { QRCodeSVG } from 'qrcode.react';
import { ASSET_BASE } from '@/lib/api';
const CrownIcon = (props: React.ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M5 16l-3-10 5.5 4L12 2l4.5 8L22 6l-3 10H5zm0 2h14v2H5v-2z" />
  </SvgIcon>
);
import InitiativeIcon from '@mui/icons-material/Castle';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ChatIcon from '@mui/icons-material/Chat';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Module-level art preload cache — prevents commander images from re-fetching
// when PlayerPanel re-renders due to state changes (life totals, counters, etc.)
const _artPreloadCache = new Map<string, HTMLImageElement>();
function preloadArt(url: string | undefined) {
  if (!url || _artPreloadCache.has(url)) return;
  const img = new Image();
  img.src = url;
  _artPreloadCache.set(url, img);
}

const FW_DIRS: [number, number][] = [
  [0, -58], [41, -41], [58, 0], [41, 41], [0, 58], [-41, 41], [-58, 0], [-41, -41],
];
const FW_SPARK_COLORS = ['#FFD700', '#FF4444', '#4FC3F7', '#81C784', '#CE93D8', '#FF8A65', '#F06292', '#80DEEA'];
const fwRocket = keyframes`
  0%,60%   { transform:translate(-50%, 500px); opacity:0; }
  61%      { transform:translate(-50%, 500px); opacity:0.55; }
  82%      { transform:translate(-50%, -8px);  opacity:0.3; }
  83%,100% { transform:translate(-50%, -8px);  opacity:0; }
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
const flagRise = keyframes`
  0%   { transform: translateY(220px); opacity: 0; }
  60%  { opacity: 1; }
  100% { transform: translateY(0);     opacity: 1; }
`;
// Clip-path polygon animation — left corners (0 0) and (0 42px) are always fixed to the pole.
// Only the right 3 vertices move: top-right, mid-right, bottom-right.
// Gust = S-wave oscillation (4 diminishing cycles); calm = gravity droop.
// 4-point polygon — no mid-right vertex, so the right edge is always a straight line.
// The free edge tilts (top and bottom shift together) rather than bending.
const flagShape = keyframes`
  /* ── Gust 1 ── */
  0%   { clip-path: polygon(0px 0px, 58px  0px, 58px 42px, 0px 42px); } /* flat */
  4%   { clip-path: polygon(0px 0px, 59px  0px, 59px 42px, 0px 42px); } /* first flutter */
  8%   { clip-path: polygon(0px 0px, 62px -2px, 60px 45px, 0px 42px); } /* peak 1 */
  12%  { clip-path: polygon(0px 0px, 56px  2px, 56px 39px, 0px 42px); } /* reversal 1 */
  16%  { clip-path: polygon(0px 0px, 61px -1px, 59px 44px, 0px 42px); } /* peak 2 */
  20%  { clip-path: polygon(0px 0px, 56px  2px, 57px 40px, 0px 42px); } /* reversal 2 */
  24%  { clip-path: polygon(0px 0px, 60px -1px, 58px 43px, 0px 42px); } /* small peak */
  27%  { clip-path: polygon(0px 0px, 57px  1px, 57px 41px, 0px 42px); } /* small reversal */
  30%  { clip-path: polygon(0px 0px, 59px  0px, 58px 43px, 0px 42px); } /* dying */
  32%  { clip-path: polygon(0px 0px, 58px  0px, 58px 42px, 0px 42px); } /* flat */
  /* ── Calm 1 ── */
  40%  { clip-path: polygon(0px 0px, 57px  3px, 61px 46px, 0px 42px); } /* droop start */
  50%  { clip-path: polygon(0px 0px, 56px  5px, 63px 48px, 0px 42px); } /* full droop */
  56%  { clip-path: polygon(0px 0px, 57px  2px, 60px 45px, 0px 42px); } /* un-drooping */
  58%  { clip-path: polygon(0px 0px, 58px  0px, 58px 42px, 0px 42px); } /* flat */
  /* ── Gust 2 ── */
  63%  { clip-path: polygon(0px 0px, 61px -2px, 60px 44px, 0px 42px); } /* peak 1 */
  67%  { clip-path: polygon(0px 0px, 56px  2px, 56px 40px, 0px 42px); } /* reversal */
  71%  { clip-path: polygon(0px 0px, 60px -1px, 59px 43px, 0px 42px); } /* peak 2 */
  75%  { clip-path: polygon(0px 0px, 57px  1px, 57px 41px, 0px 42px); } /* reversal */
  79%  { clip-path: polygon(0px 0px, 59px -1px, 58px 43px, 0px 42px); } /* small */
  83%  { clip-path: polygon(0px 0px, 59px  0px, 58px 42px, 0px 42px); } /* dying */
  86%  { clip-path: polygon(0px 0px, 58px  0px, 58px 42px, 0px 42px); } /* flat */
  /* ── Calm 2 ── */
  94%  { clip-path: polygon(0px 0px, 57px  3px, 61px 46px, 0px 42px); } /* droop */
  100% { clip-path: polygon(0px 0px, 56px  5px, 63px 48px, 0px 42px); } /* full droop */
`;
// skewX from top-left pivot — matches the horizontal offset between the clip-path's
// top-right and bottom-right vertices (BR_x - TR_x):
//   negative = bottom leans left  (wave peak: BR_x < TR_x)
//   positive = bottom leans right (droop:     BR_x > TR_x)
const flagImageSkew = keyframes`
  0%   { transform: skewX( 0deg); }
  4%   { transform: skewX( 0deg); }
  8%   { transform: skewX(-3deg); } /* peak1:  60-62 = -2px → -3° */
  12%  { transform: skewX( 0deg); } /* rev1:   56-56 =  0px */
  16%  { transform: skewX(-3deg); } /* peak2:  59-61 = -2px */
  20%  { transform: skewX( 1deg); } /* rev2:   57-56 = +1px */
  24%  { transform: skewX(-2deg); } /* small:  58-60 = -2px */
  27%  { transform: skewX( 0deg); } /* rev:    57-57 =  0px */
  30%  { transform: skewX(-1deg); } /* dying */
  32%  { transform: skewX( 0deg); }
  40%  { transform: skewX( 5deg); } /* droop start: 61-57 = +4px → +5° */
  50%  { transform: skewX( 7deg); } /* full droop:  63-56 = +7px → +7° */
  56%  { transform: skewX( 4deg); } /* un-droop:    60-57 = +3px */
  58%  { transform: skewX( 0deg); }
  63%  { transform: skewX(-2deg); } /* peak1:  60-61 = -1px */
  67%  { transform: skewX( 0deg); } /* rev:    56-56 =  0px */
  71%  { transform: skewX(-2deg); } /* peak2:  59-60 = -1px */
  75%  { transform: skewX( 0deg); } /* rev:    57-57 =  0px */
  79%  { transform: skewX(-1deg); } /* small */
  83%  { transform: skewX(-1deg); }
  86%  { transform: skewX( 0deg); }
  94%  { transform: skewX( 5deg); } /* droop:  61-57 = +4px */
  100% { transform: skewX( 7deg); } /* full:   63-56 = +7px */
`;
// Pole wiggle — enthusiastic hand-held waving, ±7–12° from a ~17° base.
// Runs fast (1–2s per cycle) with each flag on its own offset for a crowd feel.
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
  /* Gust 1: fade in, travel, slow and fade out as wind dies */
  0%   { background-position: 200% 0;   opacity: 0; }
  2%   { background-position: 170% 0;   opacity: 1; }
  18%  { background-position: -80% 0;   opacity: 1; }
  26%  { background-position: -170% 0;  opacity: 0.3; }
  28%  { background-position: -200% 0;  opacity: 0; }
  /* Reset invisibly during calm 1 */
  53%  { background-position: 200% 0;   opacity: 0; }
  /* Gust 2: same pattern */
  55%  { background-position: 170% 0;   opacity: 1; }
  71%  { background-position: -80% 0;   opacity: 1; }
  79%  { background-position: -170% 0;  opacity: 0.3; }
  81%  { background-position: -200% 0;  opacity: 0; }
  /* Reset invisibly during calm 2 */
  100% { background-position: 200% 0;   opacity: 0; }
`;
// Group marches left→right across the full panel width, looping.
const flagMarch = keyframes`
  from { transform: translateX(-80%); }
  to   { transform: translateX(80%);  }
`;
// Per-flag horizontal drift — each flag wanders slightly so the crowd splits and regroups.
const flagDrift = keyframes`
  0%   { transform: translateX(0px);   }
  22%  { transform: translateX(18px);  }
  45%  { transform: translateX(-10px); }
  68%  { transform: translateX(24px);  }
  85%  { transform: translateX(-6px);  }
  100% { transform: translateX(0px);   }
`;
const godRaysPulse = keyframes`
  0%   { opacity: 0.8; }
  40%  { opacity: 1.0; }
  70%  { opacity: 0.7; }
  100% { opacity: 0.8; }
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
const fwFlash = keyframes`
  0%,82%  { transform:translate(-50%,-50%) scale(0); opacity:0; }
  83%     { transform:translate(-50%,-50%) scale(2.2); opacity:0.55; }
  88%     { transform:translate(-50%,-50%) scale(0.9); opacity:0.25; }
  93%,100%{ transform:translate(-50%,-50%) scale(0); opacity:0; }
`;
const fwSparks = FW_DIRS.map(([dx, dy]) => keyframes`
  0%,82%  { transform:translate(-50%,-50%) scale(0); opacity:0; }
  83%     { transform:translate(-50%,-50%) scale(1.3); opacity:0.65; }
  94%     { transform:translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0.5); opacity:0.45; }
  100%    { transform:translate(calc(-50% + ${dx * 1.55}px),calc(-50% + ${dy * 1.55}px)) scale(0); opacity:0; }
`);
const crownShimmerBig = keyframes`
  0%, 100% { filter: drop-shadow(0 0 3px #DAA520) brightness(1); }
  50%       { filter: drop-shadow(0 0 10px #FFD700) brightness(1.6); }
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
const crownEnterFromTop = keyframes`
  from { transform: translateY(-80px) rotate(-25deg); opacity: 0; }
  to   { transform: translateY(0) rotate(-25deg); opacity: 1; }
`;
const crownExitToTop = keyframes`
  from { transform: translateY(0) rotate(-25deg); opacity: 1; }
  to   { transform: translateY(-80px) rotate(-25deg); opacity: 0; }
`;

const CityIcon = ({ active, ...props }: React.ComponentProps<typeof SvgIcon> & { active?: boolean }) => (
  <SvgIcon {...props} viewBox="0 0 1024 1024">
    {active && (
      <defs>
        <linearGradient id="cityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E040FB" />
          <stop offset="50%" stopColor="#7851A9" />
          <stop offset="100%" stopColor="#311B92" />
        </linearGradient>
      </defs>
    )}
    <path fill={active ? 'url(#cityGrad)' : 'currentColor'} d="M503.612.522c5.954-.16 11.908-.32 17.862-.522 11.304 64.93 18.666 130.504 28.924 195.596 51.816 6.276 101.46 25.586 144.826 54.55 37.576-10.66 75.028-21.764 112.604-32.504-10.42 36.206-21.362 72.332-31.702 108.578-2.052 5.03 2.656 9.334 4.626 13.558 26.754 40.51 42.524 87.498 48.84 135.492 64.688 9.374 129.336 18.908 194.026 28.402.04 5.994.12 12.03.242 18.104-64.77 10.822-130.062 18.344-194.912 28.684-6.156 51.896-26.35 101.256-55.316 144.544 10.982 37.896 22.488 75.632 33.068 113.648-38.58-10.742-76.758-22.93-115.378-33.592-42.402 28.724-91.642 45.782-142.17 52.742-9.454 65.252-18.828 130.544-28.402 195.796-6.074.12-12.15.242-18.184.402-9.936-62.316-18.022-124.952-27.154-187.428-1.086-3.862-.846-10.862-6.598-10.622-48.638-6.436-94.66-25.666-135.694-52.178-39.144 11.426-78.206 23.174-117.43 34.276 10.58-38.096 22.528-75.792 33.23-113.848 2.252-5.432-2.736-10.098-4.868-14.604-24.702-38.982-40.27-83.638-45.7-129.458-65.736-11.104-131.994-19.27-197.89-29.368-.12-6.074-.2-12.19-.322-18.224 65.896-10.822 132.356-18.144 198.17-29.328 5.352-50.206 24.622-97.958 51.656-140.28-10.984-38.902-22.488-77.642-33.632-116.464 38.7 11.144 77.2 23.052 116.022 33.712 42.482-29.448 91.964-47.148 142.854-54.912 9.212-64.97 18.908-129.82 28.402-194.752zm-47.914 270.302c-33.47 8.006-65.13 23.294-92.526 44.132-5.432 3.742-10.54 10.018-8.852 17.058 1.852 7.844 9.696 11.706 15.448 16.494 23.494 16.776 46.064 34.878 69.798 51.332 8.69 5.994 21.644-.724 22.128-11.184 5.51-33.712 10.136-67.584 15.004-101.378 2.576-11.546-10.458-21.12-21-16.454zm104.074-1.488c-8.448 1.81-13.678 10.782-11.424 19.068 4.344 32.224 9.05 64.408 13.718 96.552.442 7.442 4.546 16.01 12.832 16.896 7.806 1.528 13.718-4.708 19.672-8.57 23.576-18.022 47.994-34.878 71.328-53.222 8.81-5.794 7.282-19.714-1.61-24.662-30.412-23.132-66.458-41.034-104.516-46.062zM326.28 354.22c-7.602 2.736-11.586 10.298-16.172 16.374-17.862 26.43-31.66 56.04-37.936 87.418-2.976 9.696 6.478 20.074 16.374 17.982 33.39-4.506 66.82-9.01 100.09-14.322 12.23-.32 17.782-16.332 9.656-24.86-17.38-24.138-35.362-47.834-52.862-71.85-4.304-6.156-10.822-12.954-19.15-10.742zm362.468.08c-19.472 21.242-34.718 46.184-52.74 68.712-5.714 8.972-16.816 17.58-13.156 29.448 3.54 9.334 14.442 9.616 22.77 11.104 31.178 4.224 62.276 9.414 93.494 13.436 10.138 1.892 19.31-9.132 15.97-18.868-7.644-35.722-23.694-69.838-46.344-98.48-4.264-6.598-12.994-8.892-19.994-5.352zM282.672 547.604c-7.604 2.574-12.834 10.66-10.218 18.666 7.482 34.798 23.212 67.988 45.178 95.986 5.108 8.088 17.982 9.214 23.654 1.168 17.782-22.57 34.236-46.144 51.736-68.914 4.706-6.678 11.948-14.28 8.126-23.092-3.34-10.902-17.018-9.412-25.988-11.626-30.856-3.46-61.512-10.378-92.488-12.188zm422.168 5.028c-24.178 3.902-48.598 6.154-72.614 10.902-10.5 2.052-13.84 16.414-6.84 23.936 18.586 25.626 37.534 51.012 56.564 76.356 5.47 10.138 20.758 10.098 26.35.08 23.252-30.454 42.24-66.458 46.786-104.758-8.368-20.556-34.074-6.476-50.246-6.516zm-265.434 71.086c-23.936 16.372-46.546 34.556-70.16 51.372-6.316 5.07-15.488 10.098-15.046 19.43.724 8.168 8.448 12.834 14.282 17.42 26.752 18.948 57.044 33.43 89.148 40.35 9.976 3.38 20.638-6.638 18.424-16.736-4.626-33.55-9.132-67.142-14.442-100.572-.28-10.54-13.596-17.46-22.206-11.264zm129.016.562c-6.356 3.258-5.994 11.788-7.604 17.822-4.384 31.016-9.052 62.034-13.396 93.09-2.976 10.622 7.926 21.806 18.626 18.024 35.322-7.524 68.994-23.092 97.556-45.138 8.288-4.948 9.938-17.66 1.892-23.614-24.782-19.512-50.568-37.776-75.712-56.844-5.794-5.07-14.402-8.046-21.362-3.34z" />
  </SvgIcon>
);
import ElimIcon from '@mui/icons-material/PersonOff';
const XP_ICON_SRC = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPxc2Yz21vbnc5VP3Muxnx5VtQGAynItuNWg&s';
import type { PlayerState, CommanderDamageMap } from '../types';


interface PlayerPanelProps {
  player: PlayerState;
  playerIdx: number;
  allPlayers: PlayerState[];
  commanderDamage: CommanderDamageMap;
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
  lifeKillOpponents?: { name: string; idx: number }[];
  onLifeKillSelect?: (sourceIdx: number | null) => void;
  poisonKillOpponents?: { name: string; idx: number }[];
  onPoisonKillSelect?: (sourceIdx: number | null) => void;
  isHighlighted?: boolean;
  isCurrentPlayer?: boolean;
  elapsedSeconds?: number;
  turnTimerSeconds?: number;
  startingLife?: number;
  monarchTransfer?: { fromPos: string | null; toPos: string | null };
  highlightMode?: boolean;
  remoteMode?: boolean;
  seatCode?: string;
  activePlayerIdx?: number;
  remoteConnected?: boolean;
  soundEnabled?: boolean;
  onSwitchToPlayer?: (targetIdx: number) => void;
  isBeingViewed?: boolean;
  viewerPlayerNames?: string[];
  onToggleTheme?: () => void;
  themeMode?: 'light' | 'dark';
  onToggleSound?: () => void;
  onOpenChat?: (playerName: string) => void;
  /** Seating phase: when true, panel renders an empty CTA (or summary + edit icon if filled). */
  seatingMode?: boolean;
  /** Called when the user taps the seating-mode CTA or edit affordance. */
  onOpenSeatPicker?: () => void;
}

// ── City Flag ─────────────────────────────────────────────────────────────────
// Reusable single flag: position, staggered rise delay, and wave phase offset
// are all injected so 12 instances look independent.

interface CityFlagProps {
  left: string;
  bottom?: number;        // bottom offset in px (default -25)
  riseDelay: number;      // seconds before the flag starts rising
  wiggleDuration: number; // seconds per wiggle cycle
  wiggleOffset: number;   // seconds phase offset so each flag is desynchronized
  driftDuration: number;  // seconds per drift cycle (split/regroup)
  driftOffset: number;    // seconds phase offset for drift
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
      {/* Per-flag horizontal drift for split/regroup effect */}
      <Box sx={{ animation: `${flagDrift} ${driftDuration}s ${driftOffset}s ease-in-out infinite` }}>
      {/* Separate non-animated wrapper for the flip so animation doesn't override the transform */}
      <Box sx={{ transform: 'scaleX(-1)' }}>
      <Box sx={{
        position: 'relative',
        transformOrigin: 'bottom left',
        animation: `${poleWiggle} ${dur} ${off} ease-in-out infinite`,
      }}>
        {/* Flag cloth */}
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
              {/* Ripple layers — second offset by half a cycle for counter-shimmer */}
              <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 18%, transparent 36%)', backgroundSize: '300% 100%', animation: `${flagRipple} ${dur} ${off} linear infinite` }} />
              <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.10) 18%, transparent 36%)', backgroundSize: '300% 100%', animation: `${flagRipple} ${dur} linear infinite`, animationDelay: `${wiggleOffset - wiggleDuration / 2}s` }} />
            </Box>
          </Box>
        </Box>
        {/* Finial */}
        <Box sx={{ position: 'absolute', left: -2, top: -7, width: 7, height: 7, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFE066, #DAA520 55%, #8B6914)', boxShadow: '0 0 5px rgba(218,165,32,0.9)' }} />
        {/* Pole */}
        <Box sx={{ width: 3, height: 140, background: 'linear-gradient(to right, #DAA520, #8B6914)' }} />
      </Box>
      </Box>{/* end flip wrapper */}
      </Box>{/* end drift wrapper */}
    </Box>
  );
}

// Order in which threat commander flags steal positions — spread across the crowd
// so the takeover feels like infiltration rather than a sweep from one side.
const THREAT_STEAL_ORDER = [6, 1, 10, 3, 8, 0, 11, 4, 7, 2, 9, 5];

// Flags clustered in the center like a crowd marching left→right.
// Varied bottom creates front/back depth. driftDuration/driftOffset make individuals
// wander so the group splits and regroups as it moves.
const CITY_FLAG_CONFIGS = [
  { left: '30%', bottom: -28, riseDelay: 4.00, wiggleDuration: 3.2, wiggleOffset:  0.0, driftDuration: 11.0, driftOffset:  0.0  },
  { left: '35%', bottom: -24, riseDelay: 4.12, wiggleDuration: 2.7, wiggleOffset: -0.9, driftDuration:  8.5, driftOffset: -2.3  },
  { left: '40%', bottom: -30, riseDelay: 4.25, wiggleDuration: 3.6, wiggleOffset: -1.8, driftDuration: 13.0, driftOffset: -5.1  },
  { left: '45%', bottom: -22, riseDelay: 4.06, wiggleDuration: 3.0, wiggleOffset: -2.4, driftDuration:  9.5, driftOffset: -1.4  },
  { left: '50%', bottom: -26, riseDelay: 4.38, wiggleDuration: 2.5, wiggleOffset: -0.6, driftDuration: 12.0, driftOffset: -3.8  },
  { left: '55%', bottom: -20, riseDelay: 4.18, wiggleDuration: 3.9, wiggleOffset: -1.5, driftDuration:  8.0, driftOffset: -6.5  },
  { left: '60%', bottom: -28, riseDelay: 4.44, wiggleDuration: 2.8, wiggleOffset: -2.1, driftDuration: 10.5, driftOffset: -0.7  },
  { left: '65%', bottom: -24, riseDelay: 4.08, wiggleDuration: 3.4, wiggleOffset: -1.2, driftDuration: 14.0, driftOffset: -4.2  },
  // back-row flags (higher bottom = further back)
  { left: '37%', bottom: -18, riseDelay: 4.30, wiggleDuration: 2.6, wiggleOffset: -1.7, driftDuration:  9.0, driftOffset: -7.0  },
  { left: '48%', bottom: -16, riseDelay: 4.52, wiggleDuration: 3.7, wiggleOffset: -2.7, driftDuration: 11.5, driftOffset: -2.9  },
  { left: '57%', bottom: -18, riseDelay: 4.20, wiggleDuration: 3.1, wiggleOffset: -0.4, driftDuration:  7.5, driftOffset: -5.5  },
  { left: '63%', bottom: -15, riseDelay: 4.40, wiggleDuration: 2.9, wiggleOffset: -2.0, driftDuration: 12.5, driftOffset: -1.8  },
];

const BTN = { p: 0, minWidth: 26, minHeight: 26 } as const;

export function PlayerPanel({
  player,
  playerIdx,
  allPlayers,
  commanderDamage,
  onLifeChange,
  onPoisonChange,
  onCommanderTaxChange,
  onEnergyChange,
  onExperienceChange,
  onToggleMonarch,
  onToggleInitiative,
  onToggleCitysBlessing,
  onCommanderDamageChange,
  onEliminate,
  onUndoEliminate,
  onPassTurn,
  lifeKillOpponents,
  onLifeKillSelect,
  poisonKillOpponents,
  onPoisonKillSelect,
  isHighlighted = false,
  isCurrentPlayer = false,
  elapsedSeconds = 0,
  turnTimerSeconds = 300,
  startingLife = 40,
  monarchTransfer = { fromPos: null, toPos: null },
  highlightMode = false,
  remoteMode = false,
  seatCode,
  activePlayerIdx,
  remoteConnected = false,
  soundEnabled = true,
  onSwitchToPlayer,
  isBeingViewed = false,
  viewerPlayerNames = [],
  onToggleTheme,
  themeMode,
  onToggleSound,
  onOpenChat,
  seatingMode = false,
  onOpenSeatPicker,
}: PlayerPanelProps) {
  usePoisonSound(player.poison, player.isEliminated, soundEnabled);
  const { playCitysBlessing } = useSounds(soundEnabled, player.hasCitysBlessing);

  // ── Fluid size tokens ─────────────────────────────────────────────────────
  // All text and icon sizes scale with viewport height (dvh) so panels read
  // correctly at 2-player (large panels), 4-player (small panels), and remote.
  // Remote mode uses dvmax (longer viewport dimension) so landscape doesn't hit dvh minimums.
  // Board mode uses dvh because panels are rotated 90° and share the viewport.
  const fsPlayerName   = remoteMode ? 'clamp(13px, 2.0dvmax, 26px)'  : 'clamp(9px,  1.8dvh, 15px)';
  const fsDeckName     = remoteMode ? 'clamp(10px, 1.5dvmax, 20px)'  : 'clamp(7px,  1.3dvh, 11px)';
  const fsPassBtn      = remoteMode ? 'clamp(13px, 1.8dvmax, 22px)'  : 'clamp(9px,  1.6dvh, 13px)';
  const fsHeaderIcon   = remoteMode ? 'clamp(24px, 3.8dvmax, 48px)'  : 'clamp(16px, 3.0dvh, 26px)';
  const fsSmallIcon    = remoteMode ? 'clamp(16px, 2.4dvmax, 30px)'  : 'clamp(11px, 2.0dvh, 16px)';
  const fsMenuTrigger  = remoteMode ? 'clamp(20px, 2.8dvmax, 36px)'  : 'clamp(14px, 2.2dvh, 20px)';
  const fsSectionLabel = remoteMode ? 'clamp(12px, 1.8dvmax, 24px)'  : 'clamp(8px,  1.4dvh, 13px)';
  const fsSourceName   = remoteMode ? 'clamp(13px, 2.0dvmax, 28px)'  : 'clamp(10px, 1.9dvh, 18px)';
  const fsStatBadge    = remoteMode ? 'clamp(10px, 1.4dvmax, 18px)'  : 'clamp(8px,  1.4dvh, 12px)';
  const fsCounterLabel = remoteMode ? 'clamp(14px, 2.4dvmax, 32px)'  : 'clamp(10px, 1.9dvh, 18px)';
  const fsCounterValue = remoteMode ? 'clamp(20px, 3.5dvmax, 44px)'  : 'clamp(14px, 2.8dvh, 24px)';
  const fsCounterBtn   = remoteMode ? 'clamp(26px, 4.2dvmax, 52px)'  : 'clamp(17px, 3.2dvh, 26px)';
  const fsLifeBtn      = remoteMode ? 'clamp(40px, 8.5dvmax, 90px)'  : 'clamp(28px, 7.0dvh, 56px)';
  const fsKillPrompt   = remoteMode ? 'clamp(15px, 2.4dvmax, 28px)'  : 'clamp(11px, 2.0dvh, 15px)';
  const artHeight      = remoteMode ? 'clamp(40px, 7.5dvmax, 80px)'  : 'clamp(24px, 4.5dvh, 42px)';
  const cmdBtnWidth    = remoteMode ? 'clamp(44px, 6.0dvmax, 70px)'  : 'clamp(28px, 5.0dvh, 38px)';
  const cmdBtnHeight   = remoteMode ? 'clamp(40px, 5.5dvmax, 64px)'  : 'clamp(26px, 4.5dvh, 36px)';
  const valColWidth    = remoteMode ? 'clamp(32px, 6.0dvmax, 58px)'  : 'clamp(24px, 4.5dvh, 36px)';
  // ──────────────────────────────────────────────────────────────────────────
  const POSITION_ROTATION = { top: '180deg', left: '90deg', right: '270deg', bottom: '0deg' } as const;
  const POSITION_HEADER_PLACEMENT = { top: 'top', left: 'left', right: 'left', bottom: 'bottom' } as const;
  const POSITION_SNAPSHOT_PLACEMENT = { bottom: 'top', top: 'bottom', left: 'right', right: 'left' } as const;
  const ttRotate = POSITION_ROTATION[player.position];
  const ttSlotProps = { tooltip: { sx: { rotate: ttRotate } } };
  const ttHeaderPlacement = POSITION_HEADER_PLACEMENT[player.position];
  const snapshotPlacement = POSITION_SNAPSHOT_PLACEMENT[player.position];
  const ttHeaderSlotProps = {
    tooltip: { sx: { rotate: ttRotate } },
    popper: { modifiers: [{ name: 'flip', enabled: false }] },
  };
  const [eliminateTurnInput, setEliminateTurnInput] = useState('');
  const [showEliminateConfirm, setShowEliminateConfirm] = useState(false);
  const [stateMenuOpen, setStateMenuOpen] = useState(false);
  const [rulesOpenLabel, setRulesOpenLabel] = useState<string | null>(null);
  const toggleRules = (label: string) => setRulesOpenLabel(l => l === label ? null : label);
  useEffect(() => {
    if (!rulesOpenLabel) return;
    const close = () => setRulesOpenLabel(null);
    const id = setTimeout(() => document.addEventListener('mousedown', close), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', close); };
  }, [rulesOpenLabel]);
  const cmdDmgKey = `cmdDmgShowPlayer:${player.playerId}`;
  const [cmdDmgShowPlayer, setCmdDmgShowPlayer] = useState(() => {
    try { return localStorage.getItem(cmdDmgKey) === '1'; } catch { return false; }
  });
  const toggleCmdDmgShowPlayer = () => setCmdDmgShowPlayer(p => {
    const next = !p;
    try { localStorage.setItem(cmdDmgKey, next ? '1' : '0'); } catch {}
    return next;
  });
  const [cityBlessingVisible, setCityBlessingVisible] = useState(player.hasCitysBlessing);
  const [cityBlessingExiting, setCityBlessingExiting] = useState(false);
  const prevHasCitysBlessing = useRef(player.hasCitysBlessing);
  useEffect(() => {
    if (player.hasCitysBlessing) {
      if (!prevHasCitysBlessing.current) playCitysBlessing();
      prevHasCitysBlessing.current = true;
      setCityBlessingVisible(true);
      setCityBlessingExiting(false);
    } else {
      prevHasCitysBlessing.current = false;
      if (cityBlessingVisible) {
        setCityBlessingExiting(true);
        const t = setTimeout(() => { setCityBlessingVisible(false); setCityBlessingExiting(false); }, 3800);
        return () => clearTimeout(t);
      }
    }
  }, [player.hasCitysBlessing, playCitysBlessing]);
  const [xpFlashing, setXpFlashing] = useState(false);
  const [xpRippleKey, setXpRippleKey] = useState(0);
  const prevExperience = useRef(player.experience);

  useEffect(() => {
    if (player.experience > prevExperience.current) {
      setXpFlashing(true);
      setXpRippleKey(k => k + 1);
      setTimeout(() => setXpFlashing(false), 700);
    }
    prevExperience.current = player.experience;
  }, [player.experience]);

  const [damageFlash, setDamageFlash] = useState(0);
  const [lastCmdDmgSourceIdx, setLastCmdDmgSourceIdx] = useState<number | null>(null);
  const [openSnapshotKey, setOpenSnapshotKey] = useState<string | null>(null);
  type FocusedControl = {
    type: 'life' | 'poison' | 'energy' | 'experience' | 'commanderTax' | 'commanderDamage';
    sourceIdx?: number;
    isPartner?: boolean;
  } | null;
  const [focusedControl, setFocusedControl] = useState<FocusedControl>(null);
  const prevLife = useRef(player.life);
  useEffect(() => {
    if (player.life < prevLife.current) {
      const delta = prevLife.current - player.life;
      setDamageFlash(delta);
      setTimeout(() => setDamageFlash(0), 1000);
    }
    prevLife.current = player.life;
  }, [player.life]);

  const [monarchAnim, setMonarchAnim] = useState<'hidden' | 'entering' | 'exiting' | 'idle'>(
    player.isMonarch ? 'idle' : 'hidden'
  );
  const [monarchEnterIsTransfer, setMonarchEnterIsTransfer] = useState(false);
  // Keep a ref in sync with the prop so the effect can read the latest value
  const monarchTransferRef = useRef(monarchTransfer);
  monarchTransferRef.current = monarchTransfer;
  const prevIsMonarchRef = useRef(player.isMonarch);
  useEffect(() => {
    const was = prevIsMonarchRef.current;
    const is = player.isMonarch;
    prevIsMonarchRef.current = is;
    if (!was && is) {
      const isXfer = monarchTransferRef.current.fromPos !== null && monarchTransferRef.current.toPos !== null;
      setMonarchEnterIsTransfer(isXfer);
      setMonarchAnim('entering');
      const t = setTimeout(() => setMonarchAnim('idle'), isXfer ? 1800 : 700);
      return () => clearTimeout(t);
    } else if (was && !is) {
      setMonarchAnim('exiting');
      const t = setTimeout(() => setMonarchAnim('hidden'), 600);
      return () => clearTimeout(t);
    }
  }, [player.isMonarch]);
  const showCrown = player.isMonarch || monarchAnim === 'exiting';
  const monarchAnimStr =
    monarchAnim === 'exiting'  ? `${crownExitToTop} 0.5s ease-in forwards` :
    monarchAnim === 'entering' ? `${crownEnterFromTop} ${monarchEnterIsTransfer ? '1s' : '0.5s'} ${monarchEnterIsTransfer ? '0.5s' : '0s'} ease-out both, ${crownShimmerBig} 2s ease-in-out infinite` :
    `${crownShimmerBig} 2s ease-in-out infinite`;

  const isBeingViewedByAnyone = isBeingViewed || viewerPlayerNames.length > 0;
  const viewerTooltipText = (() => {
    if (viewerPlayerNames.length === 1) return `${viewerPlayerNames[0]} is viewing your panel`;
    if (viewerPlayerNames.length === 2) return `${viewerPlayerNames[0]} and ${viewerPlayerNames[1]} are viewing your panel`;
    if (viewerPlayerNames.length > 2) return `${viewerPlayerNames.slice(0, 2).join(', ')} and ${viewerPlayerNames.length - 2} other${viewerPlayerNames.length - 2 > 1 ? 's' : ''} are viewing your panel`;
    return 'Someone is viewing your panel';
  })();
  // Banner auto-hides 2.5s after each trigger. Triggers are: a change in
  // viewing state (isBeingViewedByAnyone / viewer-list length), or an explicit
  // manual ping via showViewerBanner() (called from the eye-icon click below).
  // Modeled declaratively: the effect re-keys on the trigger inputs, cleans up
  // its own timer on re-run / unmount, so no ref-stored timer is needed.
  const [viewerBannerVisible, setViewerBannerVisible] = useState(false);
  const [viewerBannerNonce, setViewerBannerNonce] = useState(0);
  const showViewerBanner = () => setViewerBannerNonce((n) => n + 1);

  useEffect(() => {
    // Skip the initial mount when not actively viewed.
    if (!isBeingViewedByAnyone && viewerBannerNonce === 0) return;
    setViewerBannerVisible(true);
    const t = setTimeout(() => setViewerBannerVisible(false), 2500);
    return () => clearTimeout(t);
  }, [isBeingViewedByAnyone, viewerPlayerNames.length, viewerBannerNonce]);

  // Preload all commander art on mount so images stay cached across state changes
  useEffect(() => {
    allPlayers.forEach(p => {
      preloadArt(p.commander.artCropUrl);
      preloadArt(p.partner?.artCropUrl);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [lpKey, setLpKey] = useState<string | null>(null);
  const lpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired = useRef(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [countersOpen, setCountersOpen] = useState(true);
  const [cmdPreviewName, setCmdPreviewName] = useState<string | null>(null);
  const [cmdPreviewUrl, setCmdPreviewUrl] = useState<string | null>(null);
  const [cmdPreviewZoom, setCmdPreviewZoom] = useState(1);
  const [cmdPreviewBase, setCmdPreviewBase] = useState<{ w: number; h: number } | null>(null);
  const cmdScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cmdPreviewName) { setCmdPreviewUrl(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); return; }
    setCmdPreviewUrl(null);
    setCmdPreviewZoom(1);
    setCmdPreviewBase(null);
    getCardImageByName(cmdPreviewName).then(url => setCmdPreviewUrl(url));
  }, [cmdPreviewName]);

  // Scroll to bottom when zoom changes so the card bottom (player name/mana cost) stays in view
  useEffect(() => {
    if (cmdPreviewZoom > 1 && cmdScrollRef.current) {
      cmdScrollRef.current.scrollTop = cmdScrollRef.current.scrollHeight;
    }
  }, [cmdPreviewZoom]);

  // Auto-close QR when remote player connects
  useEffect(() => { if (remoteConnected && qrOpen) setQrOpen(false); }, [remoteConnected, qrOpen]);

  const startLongPress = (key: string, cb: () => void) => {
    lpFired.current = false;
    lpTimer.current = setTimeout(() => {
      lpFired.current = true;
      cb();
      setLpKey(key);
      setTimeout(() => setLpKey(prev => prev === key ? null : prev), 700);
    }, 500);
  };
  const cancelLongPress = () => {
    if (lpTimer.current) clearTimeout(lpTimer.current);
    lpTimer.current = null;
  };
  const guardClick = (cb: () => void) => () => {
    if (lpFired.current) { lpFired.current = false; return; }
    cb();
  };

  const timerOff = turnTimerSeconds === 0;
  const timerProgress = timerOff ? 0 : Math.min(elapsedSeconds / turnTimerSeconds, 1);
  const isTimerExpired = isCurrentPlayer && !timerOff && elapsedSeconds >= turnTimerSeconds;

  function timerColorChannels(): [number, number, number] {
    if (timerOff) return [66, 165, 245];
    if (timerProgress <= 0.5) {
      const p = timerProgress * 2;
      return [Math.round(102 + 153 * p), Math.round(187 - 20 * p), Math.round(106 - 68 * p)];
    }
    const p = (timerProgress - 0.5) * 2;
    return [Math.round(255 - 26 * p), Math.round(167 - 110 * p), Math.round(38 + 15 * p)];
  }
  function timerColor(): string {
    const [r, g, b] = timerColorChannels();
    return `rgb(${r},${g},${b})`;
  }
  function timerColorRgba(alpha: number): string {
    const [r, g, b] = timerColorChannels();
    return `rgba(${r},${g},${b},${alpha})`;
  }

  const currentPlayerBorder = isCurrentPlayer ? `3px solid ${timerColor()}` : undefined;
  const currentPlayerShadow = isCurrentPlayer
    ? `0 0 16px 4px ${timerColor()}88`
    : undefined;

  const poisonProgress = Math.min(player.poison / 10, 1);

  const energyGlowIntensity = player.energy > 0 ? Math.min(player.energy / 8, 1) : 0;
  const energyGlow = energyGlowIntensity > 0
    ? `0 0 ${4 + energyGlowIntensity * 18}px rgba(80,200,255,${(0.5 + energyGlowIntensity * 0.45).toFixed(2)}), 0 0 ${10 + energyGlowIntensity * 36}px rgba(80,200,255,${(0.2 + energyGlowIntensity * 0.3).toFixed(2)})`
    : undefined;
  const energyGlowPeak = energyGlowIntensity > 0
    ? `0 0 ${8 + player.energy * 6}px rgba(80,200,255,${Math.min(1, 0.7 + energyGlowIntensity * 0.3).toFixed(2)}), 0 0 ${20 + player.energy * 12}px rgba(80,200,255,${Math.min(0.6, 0.3 + energyGlowIntensity * 0.3).toFixed(2)})`
    : undefined;
  const energyPulseDuration = player.energy > 5 ? Math.max(0.8, 2.5 - (player.energy - 5) * 0.09) : 2.5;
  const xpGlowIntensity = player.experience > 0 ? Math.min(player.experience / 10, 1) : 0;
  const xpGlow = xpGlowIntensity > 0
    ? `0 0 ${4 + xpGlowIntensity * 12}px rgba(218,165,32,${(0.5 + xpGlowIntensity * 0.5).toFixed(2)}), 0 0 ${10 + xpGlowIntensity * 24}px rgba(218,165,32,${(0.2 + xpGlowIntensity * 0.3).toFixed(2)})`
    : undefined;
  const xpShimmerAnim = useMemo(() => player.experience > 0 ? keyframes`
    0%,100% { text-shadow: ${xpGlow}; filter: brightness(1); }
    45%, 55% { text-shadow: 0 0 ${6 + xpGlowIntensity * 16}px rgba(255,223,0,0.95), 0 0 ${18 + xpGlowIntensity * 28}px rgba(218,165,32,0.7); filter: brightness(1.5); }
  ` : null, [player.experience]);
  const xpFlashAnim = useMemo(() => keyframes`
    0%   { box-shadow: 0 2px 8px rgba(218,165,32,0.5); transform: rotate(45deg) scale(1); }
    25%  { box-shadow: 0 2px 28px rgba(255,215,0,1), 0 0 48px rgba(255,215,0,0.5); transform: rotate(45deg) scale(1.3); }
    100% { box-shadow: 0 2px 8px rgba(218,165,32,0.5); transform: rotate(45deg) scale(1); }
  `, []);
  const xpRippleAnim = useMemo(() => keyframes`
    0%   { transform: translate(-50%,-50%) rotate(45deg) scale(0.4); opacity: 0.9; }
    100% { transform: translate(-50%,-50%) rotate(45deg) scale(4);   opacity: 0; }
  `, []);
  const xpLevelUpAnim = useMemo(() => keyframes`
    0%   { transform: scale(1); }
    25%  { transform: scale(1.3); }
    60%  { transform: scale(0.93); }
    100% { transform: scale(1); }
  `, []);
  const xpShimmerSweepAnim = useMemo(() => player.experience > 0 ? keyframes`
    0%   { transform: translateX(-120%); opacity: 0; }
    6%   { transform: translateX(-120%); opacity: 0; }
    7%   { opacity: 0.8; }
    17%  { transform: translateX(180%); opacity: 0.8; }
    21%  { transform: translateX(300%); opacity: 0; }
    22%  { transform: translateX(-120%); opacity: 0; }
    57%  { transform: translateX(-120%); opacity: 0; }
    58%  { opacity: 0.5; }
    65%  { transform: translateX(160%); opacity: 0.5; }
    69%  { transform: translateX(300%); opacity: 0; }
    70%  { transform: translateX(-120%); opacity: 0; }
    100% { transform: translateX(-120%); opacity: 0; }
  ` : null, [player.experience]);
  const xpEmberAnim = useMemo(() => player.experience > 0 ? keyframes`
    0%   { transform: translateY(0) scale(1); opacity: 0.9; }
    100% { transform: translateY(-26px) scale(0.2); opacity: 0; }
  ` : null, [player.experience]);
  const xpRuneGlowAnim = useMemo(() => player.experience > 0 ? keyframes`
    0%, 100% { filter: drop-shadow(0 0 2px rgba(218,165,32,0.35)); }
    50%       { filter: drop-shadow(0 0 9px rgba(255,215,0,0.85)); }
  ` : null, [player.experience]);

  const energyStaticShadow = player.energy > 5
    ? `0 0 18px rgba(30,100,210,0.55), 0 0 36px rgba(20,70,180,0.3)`
    : undefined;
  const energyPulseAnim = useMemo(() => player.energy > 5 ? keyframes`
    0%   { text-shadow: ${energyStaticShadow}, 0 0 4px rgba(80,200,255,0.95), 0 0 8px rgba(80,200,255,0.8); }
    100% { text-shadow: ${energyStaticShadow}, 0 0 ${30 + player.energy * 5}px rgba(80,200,255,0), 0 0 ${60 + player.energy * 10}px rgba(80,200,255,0); }
  ` : null, [player.energy]);
  const sizzleAmp = Math.min(player.energy - 5, 10) * 0.2;
  const energySizzleAnim = useMemo(() => player.energy > 5 ? keyframes`
    0%   { transform: translate(0, 0); }
    10%  { transform: translate(${-sizzleAmp}px, ${sizzleAmp * 0.5}px); }
    20%  { transform: translate(${sizzleAmp}px, ${-sizzleAmp}px); }
    30%  { transform: translate(${-sizzleAmp * 0.5}px, ${sizzleAmp}px); }
    40%  { transform: translate(${sizzleAmp}px, ${sizzleAmp * 0.5}px); }
    50%  { transform: translate(${-sizzleAmp}px, ${-sizzleAmp * 0.5}px); }
    60%  { transform: translate(${sizzleAmp * 0.5}px, ${sizzleAmp}px); }
    70%  { transform: translate(${-sizzleAmp}px, ${sizzleAmp * 0.5}px); }
    80%  { transform: translate(${sizzleAmp}px, ${-sizzleAmp * 0.5}px); }
    90%  { transform: translate(${-sizzleAmp * 0.5}px, ${-sizzleAmp}px); }
    100% { transform: translate(0, 0); }
  ` : null, [player.energy]);

  const damageFlashAnim = useMemo(() => keyframes`
    0%   { text-shadow: 0 0 0px rgba(180,0,0,0); filter: brightness(1); }
    20%  { text-shadow: 0 0 32px rgba(220,0,0,1), 0 0 64px rgba(180,0,0,0.7); filter: brightness(1.8); }
    100% { text-shadow: 0 0 0px rgba(180,0,0,0); filter: brightness(1); }
  `, []);

  // Poison boil — life total drifts like it's floating in churning water (starts at 8 poison)
  const poisonBoilAmp = player.poison >= 10 ? 5 : player.poison === 9 ? 3.8 : player.poison === 8 ? 1.5 : 0;
  const poisonBoilSkew = Math.min(poisonBoilAmp * 0.6, 2.5);
  const poisonBoilAnim = useMemo(() => player.poison >= 8 ? keyframes`
    0%   { transform: translate(0, 0) skew(0deg, 0deg); }
    20%  { transform: translate(${poisonBoilAmp * 0.5}px, ${-poisonBoilAmp}px) skew(${poisonBoilSkew}deg, ${-poisonBoilSkew * 0.4}deg); }
    45%  { transform: translate(${-poisonBoilAmp}px, ${poisonBoilAmp * 0.6}px) skew(${-poisonBoilSkew * 0.7}deg, ${poisonBoilSkew * 0.5}deg); }
    70%  { transform: translate(${poisonBoilAmp * 0.7}px, ${poisonBoilAmp * 0.4}px) skew(${poisonBoilSkew * 0.5}deg, ${-poisonBoilSkew * 0.3}deg); }
    100% { transform: translate(0, 0) skew(0deg, 0deg); }
  ` : null, [player.poison, poisonBoilAmp, poisonBoilSkew]);
  const poisonBoilDuration = player.poison >= 10 ? 2.0 : player.poison >= 9 ? 2.5 : 5.0;

  const lostRatio = player.life <= 0 ? 1 : Math.max(0, Math.min((startingLife - player.life) / startingLife, 1));

  // life color: green above startingLife, blood red below, primary at starting
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
  const computedLifeColor = lifeColor(player.life);

  const handleCmdDmgChange = useCallback((targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => {
    setLastCmdDmgSourceIdx(sourceIdx);
    onCommanderDamageChange(targetIdx, sourceIdx, isPartner, delta);
  }, [onCommanderDamageChange]);

  // Determine the biggest commander damage threat against this player
  const threatSource = useMemo(() => {
    if (player.isEliminated) return null;
    const myDmg = commanderDamage[playerIdx] ?? {};
    type Candidate = { srcIdx: number; isPartner: boolean; dmg: number; hasArt: boolean };
    const candidates: Candidate[] = [];
    for (const [sidxStr, dmgTuple] of Object.entries(myDmg)) {
      const sidx = Number(sidxStr);
      const srcPlayer = allPlayers[sidx];
      if (!srcPlayer) continue;
      const [main, partner] = dmgTuple;
      if (main > 0) candidates.push({ srcIdx: sidx, isPartner: false, dmg: main, hasArt: !!srcPlayer.commander.artCropUrl });
      if (partner > 0) candidates.push({ srcIdx: sidx, isPartner: true, dmg: partner, hasArt: !!(srcPlayer.partner?.artCropUrl) });
    }
    if (candidates.length === 0) return null;
    // Highest damage first, then prefer art, then prefer last-tapped source
    candidates.sort((a, b) => {
      if (b.dmg !== a.dmg) return b.dmg - a.dmg;
      if (a.hasArt !== b.hasArt) return a.hasArt ? -1 : 1;
      if (a.srcIdx === lastCmdDmgSourceIdx) return -1;
      if (b.srcIdx === lastCmdDmgSourceIdx) return 1;
      return 0;
    });
    const best = candidates[0];
    const srcPlayer = allPlayers[best.srcIdx];
    const artUrl = best.isPartner ? srcPlayer.partner?.artCropUrl : srcPlayer.commander.artCropUrl;
    const cmdName = best.isPartner ? (srcPlayer.partner?.name ?? '') : srcPlayer.commander.name;
    const intensity = Math.max(0, Math.min((best.dmg - 7) / 14, 1));
    return { artUrl, cmdName, intensity, dmg: best.dmg };
  }, [commanderDamage, playerIdx, allPlayers, player.isEliminated, lastCmdDmgSourceIdx]);

  const crackAlpha = (from: number) => Math.min(Math.max((lostRatio - from) / 0.15, 0), 1);

  // Mini snapshot card shown on hover of a source player's name in the CMD damage section
  const renderSourceSnapshot = (src: PlayerState, srcIdx: number) => {
    const dealtRows = allPlayers.flatMap((tgt, tgtIdx) => {
      if (tgtIdx === srcIdx) return [];
      const d = commanderDamage[tgtIdx]?.[srcIdx] ?? [0, 0];
      if (d[0] === 0 && d[1] === 0) return [];
      return [{ tgt, d }];
    });
    const srcLifeColor = lifeColor(src.life);
    return (
      <Box sx={{ width: 190, position: 'relative', overflow: 'hidden' }}>
        {src.commander.artCropUrl && (
          <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${src.commander.artCropUrl})`, backgroundSize: 'cover', backgroundPosition: 'center top', opacity: 0.12, pointerEvents: 'none' }} />
        )}
        <Stack direction="row" alignItems="flex-start" spacing={0.75} sx={{ position: 'relative', p: 1, pb: 0.5 }}>
          {src.commander.artCropUrl && (
            <Box component="img" src={src.commander.artCropUrl} alt="" sx={{ height: 36, width: 'auto', borderRadius: 0.5, flexShrink: 0 }} />
          )}
          <Box sx={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography sx={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{src.playerName}</Typography>
              {src.isMonarch && <CrownIcon sx={{ fontSize: 12, color: '#DAA520', flexShrink: 0 }} />}
              {src.hasInitiative && <InitiativeIcon sx={{ fontSize: 12, color: '#4FC3F7', flexShrink: 0 }} />}
              {src.hasCitysBlessing && <CityIcon active sx={{ fontSize: 12, flexShrink: 0 }} />}
            </Stack>
            <Typography sx={{ fontSize: 10, color: 'text.secondary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.commander.name}</Typography>
            {src.partner && <Typography sx={{ fontSize: 10, color: 'text.secondary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.partner.name}</Typography>}
          </Box>
        </Stack>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mx: 1 }} />
        <Stack direction="row" alignItems="center" sx={{ position: 'relative', px: 1, py: 0.5 }}>
          <Typography sx={{ fontSize: 40, fontWeight: 900, lineHeight: 1, flex: 1, textAlign: 'center', color: srcLifeColor || 'primary.main', textDecoration: src.isEliminated ? 'line-through' : 'none' }}>{src.life}</Typography>
          <Stack spacing={0.25} sx={{ minWidth: 60 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: src.poison >= 10 ? 'error.main' : src.poison > 0 ? '#66BB6A' : 'text.disabled' }}>☠ {src.poison}</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: src.energy > 0 ? '#4FC8FF' : 'text.disabled' }}>⚡ {src.energy}</Typography>
            <Stack direction="row" alignItems="center" spacing={0.25}>
              <Box sx={{ bgcolor: 'background.paper', display: 'inline-flex' }}><Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: 11, height: 11, objectFit: 'contain', mixBlendMode: 'multiply' }} /></Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: src.experience > 0 ? '#DAA520' : 'text.disabled' }}>{src.experience}</Typography>
            </Stack>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: src.commanderTax > 0 ? 'text.secondary' : 'text.disabled' }}>Tax +{src.commanderTax * 2}</Typography>
          </Stack>
        </Stack>
        {dealtRows.length > 0 && (
          <>
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mx: 1 }} />
            <Box sx={{ position: 'relative', px: 1, pt: 0.5, pb: 0.75 }}>
              <Typography sx={{ fontSize: 9, fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.25 }}>CMD Damage Dealt</Typography>
              {dealtRows.map(({ tgt, d }) => (
                <Stack key={tgt.playerName} direction="row" alignItems="center" justifyContent="space-between">
                  <Typography sx={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: 'text.secondary' }}>{tgt.playerName}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: (d[0] >= 21 || d[1] >= 21) ? 'error.main' : 'text.primary', ml: 1 }}>
                    {src.partner ? `${d[0]} / ${d[1]}` : d[0]}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </>
        )}
      </Box>
    );
  };

  // Fixed per player — does not depend on player.life so the pattern never shifts
  const ox = 38 + (playerIdx % 7);
  const oy = 32 + (playerIdx % 5);
  const cp = (d: string, w: number, op: number) =>
    `<path d="${d}" stroke="rgba(10,0,0,${op})" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const crackSvg = (paths: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${paths}</svg>`;

  // Each layer is a separate absolutely-positioned Box with its own CSS opacity transition.
  // Because backgroundImage never changes (ox/oy are fixed), only opacity animates — smooth.
  const crackLayers: Array<{ from: number; svg: string }> = [
    { from: 0.2, svg: crackSvg(
      // primary cracks radiating from impact point
      cp(`M${ox},${oy} L${ox-14},${oy-18} L${ox-22},${oy-32}`, 1.6, 0.95) +
      cp(`M${ox},${oy} L${ox+8},${oy-22} L${ox+5},0`, 1.5, 0.92) +
      cp(`M${ox},${oy} L${ox+28},${oy-14} L${ox+48},${oy-26} L100,${oy-18}`, 1.4, 0.9) +
      cp(`M${ox},${oy} L${ox+22},${oy+18} L${ox+38},${oy+42} L100,${oy+60}`, 1.3, 0.88) +
      cp(`M${ox},${oy} L${ox+4},${oy+28} L${ox-2},${oy+52} L${ox+6},100`, 1.3, 0.87) +
      cp(`M${ox},${oy} L${ox-18},${oy+22} L${ox-34},${oy+48} L0,${oy+62}`, 1.2, 0.85) +
      cp(`M${ox},${oy} L${ox-28},${oy+6} L0,${oy+14}`, 1.2, 0.84)
    )},
    { from: 0.35, svg: crackSvg(
      // secondary branches off the primaries
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
      // tertiary splinters
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
      // fine hairline web connecting the main cracks
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
      // micro-cracks near impact
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

  const isLifeLow = player.life <= 0;
  const isPoisoned = player.poison >= 10;
  const isCmdDmgHigh = Object.values(commanderDamage[playerIdx] ?? {}).some(
    (dmg) => dmg[0] >= 21 || dmg[1] >= 21
  );
  const isWarning = isLifeLow || isPoisoned || isCmdDmgHigh;

  const opponents = allPlayers
    .map((p, i) => ({ player: p, idx: i }))
    .filter(({ idx }) => idx !== playerIdx);

  // ── Seating-phase early-return ─────────────────────────────────────────────
  // Must come AFTER every hook above so hook order is stable across renders.
  // In seating mode, render either an empty CTA or a compact summary with an
  // edit affordance. Tapping either opens the SeatPickerModal owned by GameBoard.
  if (seatingMode) {
    const isFilled = !!(player.playerId && player.deckId && player.commander?.name);
    const positionLabel = player.position.charAt(0).toUpperCase() + player.position.slice(1);
    return (
      <Box
        onClick={onOpenSeatPicker}
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 0.5,
          cursor: onOpenSeatPicker ? 'pointer' : 'default',
          border: 2,
          borderStyle: 'dashed',
          borderColor: isFilled ? 'primary.main' : 'divider',
          borderRadius: 2,
          bgcolor: isFilled ? 'action.selected' : 'transparent',
          transition: 'background-color 120ms, border-color 120ms',
          textAlign: 'center',
          p: 1,
          '&:hover': onOpenSeatPicker ? { bgcolor: 'action.hover', borderColor: 'primary.main' } : {},
        }}
      >
        {isFilled ? (
          <>
            <Box sx={{ fontSize: 'clamp(11px, 1.2dvh, 14px)', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>
              {positionLabel}
            </Box>
            <Box sx={{ fontSize: 'clamp(16px, 2.4dvh, 24px)', fontWeight: 700, lineHeight: 1.1 }}>
              {player.playerName}
            </Box>
            <Box sx={{ fontSize: 'clamp(12px, 1.5dvh, 16px)', opacity: 0.85 }}>
              {player.commander.name}{player.partner ? ` / ${player.partner.name}` : ''}
            </Box>
            <Box sx={{ fontSize: 'clamp(10px, 1.1dvh, 12px)', opacity: 0.6, mt: 0.5 }}>
              Tap to edit
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ fontSize: 'clamp(11px, 1.2dvh, 14px)', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>
              {positionLabel}
            </Box>
            <Box sx={{ fontSize: 'clamp(14px, 2.2dvh, 20px)', fontWeight: 600, opacity: 0.85 }}>
              Tap to choose player & deck
            </Box>
          </>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: (theme) =>
          isWarning
            ? theme.palette.mode === 'dark' ? 'rgba(180,40,40,0.18)' : 'rgba(220,80,80,0.08)'
            : theme.palette.mode === 'dark' ? '#2A1F14' : '#FFF8F0',
        border: showEliminateConfirm
          ? '3px solid #DAA520'
          : isHighlighted
          ? '3px solid #DAA520'
          : (!highlightMode ? currentPlayerBorder : undefined)
          ?? (isWarning ? '2px solid #e53935' : undefined)
          ?? ((theme: import('@mui/material').Theme) => `1px solid ${theme.palette.divider}`),
        boxShadow: showEliminateConfirm
          ? '0 0 24px 6px rgba(218,165,32,0.6)'
          : isHighlighted
          ? '0 0 24px 6px rgba(218,165,32,0.6)'
          : (!highlightMode ? currentPlayerShadow : null) ?? 'none',
        ...(!highlightMode && isTimerExpired && {
          animation: 'timerBlink 0.5s step-end infinite',
          '@keyframes timerBlink': {
            '0%, 100%': { borderColor: '#e53935', boxShadow: '0 0 24px 6px rgba(229,57,53,0.6)' },
            '50%': { borderColor: 'transparent', boxShadow: 'none' },
          },
        }),
        transition: 'box-shadow 0.1s ease, border 0.1s ease, filter 1s ease',
        '& .MuiTypography-root': { textShadow: energyGlow, transition: 'font-size 0.2s ease, margin 0.2s ease, text-shadow 0.4s ease' },
        filter: poisonProgress > 0 ? `saturate(${1 + poisonProgress * 0.5})` : 'none',
        borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 },
        overflow: 'hidden',
        position: 'relative',
        opacity: player.isEliminated ? 0.5 : 1,
      }}
    >
      {/* ── Faded background art ── */}
      {player.commander.artCropUrl && (
        <Box
          component="img"
          src={player.commander.artCropUrl}
          alt=""
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.12,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── Viewer notification banner ── */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 12,
        background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}00 0%, ${theme.palette.primary.main}aa 44%, ${theme.palette.primary.main}ff 50%, ${theme.palette.primary.main}aa 56%, ${theme.palette.primary.main}00 100%)`,
        color: '#fff',
        px: 1, py: 0.4,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, textAlign: 'center',
        pointerEvents: 'none',
        opacity: viewerBannerVisible ? 1 : 0,
        transition: viewerBannerVisible ? 'opacity 0.2s ease' : 'opacity 0.6s ease',
      }}>
        <VisibilityIcon sx={{ fontSize: 13 }} />
        <Typography sx={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>{viewerTooltipText}</Typography>
      </Box>

      {/* ── City's Blessing god rays ── */}
      {cityBlessingVisible && (
        <Box component="svg" preserveAspectRatio="none" viewBox="0 0 100 100"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0,
            animation: cityBlessingExiting
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
          {/* Each triangle: apex at (0,0), spreads to far edge */}
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


      {/* ── City's Blessing: castle + house row — single connected SVG, no overlap ── */}
      {cityBlessingVisible && (
        <Box component="svg" viewBox="0 0 640 240" preserveAspectRatio="none" sx={{
          position: 'absolute', bottom: -55, left: -80,
          width: 'calc(100% + 80px)', height: 200,
          fill: 'rgba(0,0,0,0.52)', stroke: 'rgba(0,0,0,0.78)', strokeWidth: 1.2,
          zIndex: 0, pointerEvents: 'none',
          animation: cityBlessingExiting
            ? `${castleSlideOut} 1.8s 2s ease-in forwards`
            : `${castleSlideIn} 1.8s ease-out forwards`,
        }}>
          {/* Castle flowing into houses — one connected path, no seams */}
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
          {/* Castle: arrow slits */}
          <rect x="28"  y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="48"  y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="248" y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="268" y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="147" y="112" width="6" height="24" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          {/* Castle: stringcourses */}
          <line x1="2"   y1="130" x2="78"  y2="130" stroke="rgba(0,0,0,0.5)"  strokeWidth="1.5"/>
          <line x1="222" y1="130" x2="298" y2="130" stroke="rgba(0,0,0,0.5)"  strokeWidth="1.5"/>
          <line x1="80"  y1="160" x2="220" y2="160" stroke="rgba(0,0,0,0.4)"  strokeWidth="1.5"/>
          <line x1="2"   y1="170" x2="78"  y2="170" stroke="rgba(0,0,0,0.3)"  strokeWidth="1"/>
          <line x1="2"   y1="200" x2="78"  y2="200" stroke="rgba(0,0,0,0.3)"  strokeWidth="1"/>
          <line x1="222" y1="170" x2="298" y2="170" stroke="rgba(0,0,0,0.3)"  strokeWidth="1"/>
          <line x1="222" y1="200" x2="298" y2="200" stroke="rgba(0,0,0,0.3)"  strokeWidth="1"/>
          {/* Houses: chimneys */}
          <rect x="326" y="136" width="5" height="22" rx="1"/>
          <rect x="400" y="102" width="5" height="18" rx="1"/>
          <rect x="460" y="116" width="5" height="20" rx="1"/>
          <rect x="556" y="100" width="5" height="18" rx="1"/>
          <rect x="616" y="124" width="4" height="16" rx="1"/>
          {/* Houses: windows */}
          <rect x="305" y="130" width="8" height="11" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="363" y="138" width="8" height="10" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="416" y="148" width="8" height="11" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="436" y="148" width="8" height="11" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="496" y="150" width="8" height="11" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="516" y="148" width="8" height="11" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="572" y="146" width="7" height="10" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="592" y="148" width="7" height="10" rx="1" fill="rgba(0,0,0,0.7)" stroke="none"/>
          {/* Houses: party walls */}
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

      {/* ── City's Blessing: rolling hills behind the skyline ── */}
      {cityBlessingVisible && (
        <Box component="svg" viewBox="0 0 600 100" preserveAspectRatio="none" sx={{
          position: 'absolute', bottom: 55, left: 0, right: 0,
          width: '100%', height: 80,
          zIndex: 0, pointerEvents: 'none', opacity: 0,
          animation: cityBlessingExiting
            ? `${skylineFadeOut} 0.8s 2s ease-in forwards`
            : `${skylineFadeIn} 4s 0.5s ease-out forwards`,
        }}>
          <path d="M0,100 C90,10 200,55 310,22 C430,-5 510,42 600,16 L600,100 Z" fill="rgba(0,0,0,0.09)"/>
          <path d="M0,100 C75,25 175,60 295,38 C405,16 505,55 600,36 L600,100 Z" fill="rgba(0,0,0,0.11)"/>
          <path d="M0,100 C60,45 160,70 275,54 C382,38 480,66 600,50 L600,100 Z" fill="rgba(0,0,0,0.14)"/>
        </Box>
      )}

      {/* ── City's Blessing: distant skyline strip ── */}
      {cityBlessingVisible && (
        <Box component="svg" viewBox="0 0 800 80" preserveAspectRatio="none" sx={{
          position: 'absolute', bottom: 38, left: 0, right: 0,
          width: '100%', height: 55,
          fill: 'rgba(0,0,0,0.22)', stroke: 'none',
          zIndex: 0, pointerEvents: 'none', opacity: 0,
          animation: cityBlessingExiting
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

      {/* ── City's Blessing: cathedral (right side) ── */}
      {cityBlessingVisible && (
        <Box component="svg" viewBox="0 0 200 220" sx={{
          position: 'absolute', bottom: -35, right: -40,
          width: 200, height: 220,
          fill: 'rgba(0,0,0,0.52)', stroke: 'rgba(0,0,0,0.78)', strokeWidth: 1.2,
          zIndex: 0, pointerEvents: 'none',
          animation: cityBlessingExiting
            ? `${castleSlideOutRight} 1.8s 2s ease-in forwards`
            : `${castleSlideInRight} 1.8s 0.3s ease-out forwards`,
        }}>
          {/* Twin spires + nave */}
          <path d="
            M0,220
            L0,148 L8,148 L8,100 L4,100 L24,12 L44,100 L40,100 L40,148
            L52,148 L52,132 L100,96 L148,132 L148,148
            L160,148 L160,100 L156,100 L176,12 L196,100 L192,100 L192,148
            L200,148 L200,220 Z
          " />
          {/* Left spire window */}
          <rect x="17" y="122" width="5" height="18" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          {/* Right spire window */}
          <rect x="178" y="122" width="5" height="18" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          {/* Rose window */}
          <circle cx="100" cy="120" r="11" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="2.5"/>
          <circle cx="100" cy="120" r="5" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5"/>
          {/* Nave stringcourse */}
          <line x1="52" y1="156" x2="148" y2="156" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5"/>
          {/* Spire stringcourses */}
          <line x1="2" y1="164" x2="48" y2="164" stroke="rgba(0,0,0,0.45)" strokeWidth="1.2"/>
          <line x1="152" y1="164" x2="198" y2="164" stroke="rgba(0,0,0,0.45)" strokeWidth="1.2"/>
          {/* Door arch */}
          <path d="M85,220 L85,192 Q100,175 115,192 L115,220" fill="rgba(0,0,0,0.7)" stroke="none"/>
        </Box>
      )}


      {/* ── City's Blessing fireworks ── */}
      {cityBlessingVisible && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden',
          ...(cityBlessingExiting && { animation: `${fwFadeOut} 0.5s ease-out forwards` }),
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
      {cityBlessingVisible && !cityBlessingExiting && ([
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

      {/* ── City's Blessing — crowd of flags marching left→right ── */}
      {cityBlessingVisible && !cityBlessingExiting && (() => {
        // Threat commander steals flags one per damage point, reaching all 12 at 20 dmg.
        // Only activates when the attacker has art (no text-only threat flags).
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

      {/* ── Initiative torch flicker overlay ── */}
      {player.hasInitiative && (
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
            {/* Glow — large radial centered on torch flame */}
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

      {/* ── Phyrexian poison overlay ── */}
      {poisonProgress > 0 && (
        <>
          {/* Green tint wash */}
          <Box sx={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', bgcolor: `rgba(0,${Math.round(80 + poisonProgress * 60)},0,${Math.pow(poisonProgress, 2) * 0.45})` }} />

          {/* Poison drips — SVG curvy */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3, pointerEvents: 'none', overflow: 'visible' }} viewBox="0 0 600 220" preserveAspectRatio="none">
            <defs>
              {[
                { id: 'tg0', g: 'black', t: '#00c853' }, { id: 'tg1', g: '#003300', t: '#00ff44' },
                { id: 'tg2', g: 'black',  t: '#004d00' }, { id: 'tg3', g: '#001a00', t: '#00e040' },
                { id: 'tg4', g: '#002200', t: 'black'  }, { id: 'tg5', g: '#00c853', t: 'black'  },
                { id: 'bg0', g: 'black', t: '#00c853' }, { id: 'bg1', g: '#003300', t: '#00ff44' },
                { id: 'bg2', g: 'black',  t: '#004d00' }, { id: 'bg3', g: '#001a00', t: '#00e040' },
                { id: 'bg4', g: '#002200', t: 'black'  }, { id: 'bg5', g: '#00c853', t: 'black'  },
              ].map(({ id, g, t }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={g} stopOpacity={poisonProgress * 0.9} />
                  <stop offset="100%" stopColor={t} stopOpacity={poisonProgress * 0.4} />
                </linearGradient>
              ))}
            </defs>

            {/* Top drips */}
            <g style={{ transformOrigin: '0 0', transform: `scaleY(${poisonProgress})`, transition: 'transform 4s ease' }}>
              {[
                { x: 18,  len: 140, w: 8,  cx1: 22,  grad: 'tg0' },
                { x: 55,  len: 60,  w: 3,  cx1: -5,  grad: 'tg1' },
                { x: 95,  len: 190, w: 10, cx1: -18, grad: 'tg2' },
                { x: 148, len: 75,  w: 4,  cx1: 28,  grad: 'tg3' },
                { x: 190, len: 160, w: 7,  cx1: 8,   grad: 'tg4' },
                { x: 235, len: 45,  w: 2,  cx1: -24, grad: 'tg5' },
                { x: 272, len: 175, w: 9,  cx1: 14,  grad: 'tg0' },
                { x: 318, len: 85,  w: 4,  cx1: 30,  grad: 'tg2' },
                { x: 360, len: 200, w: 11, cx1: -6,  grad: 'tg3' },
                { x: 410, len: 55,  w: 3,  cx1: -26, grad: 'tg1' },
                { x: 448, len: 150, w: 7,  cx1: 18,  grad: 'tg4' },
                { x: 490, len: 70,  w: 4,  cx1: -32, grad: 'tg5' },
                { x: 535, len: 120, w: 6,  cx1: 10,  grad: 'tg2' },
              ].map((d, i) => {
                const h = d.len; const hw = d.w / 2; const tipX = d.x + d.cx1 * 0.3;
                return <path key={`td-${i}`} d={`M ${d.x-hw} 0 C ${d.x-hw+d.cx1*0.9} ${h*0.45} ${tipX-1} ${h*0.88} ${tipX} ${h} C ${tipX+1} ${h*0.88} ${d.x+hw+d.cx1*0.9} ${h*0.45} ${d.x+hw} 0 Z`} fill={`url(#${d.grad})`} />;
              })}
            </g>

            {/* Bottom drips */}
            <g style={{ transformOrigin: '0 220px', transform: `scaleY(${poisonProgress})`, transition: 'transform 4s ease' }}>
              {[
                { x: 38,  len: 110, w: 7,  cx1: 20,  grad: 'bg0' },
                { x: 80,  len: 50,  w: 3,  cx1: -28, grad: 'bg1' },
                { x: 128, len: 170, w: 9,  cx1: 10,  grad: 'bg2' },
                { x: 175, len: 65,  w: 4,  cx1: -8,  grad: 'bg3' },
                { x: 220, len: 130, w: 6,  cx1: 26,  grad: 'bg4' },
                { x: 260, len: 40,  w: 2,  cx1: -14, grad: 'bg5' },
                { x: 290, len: 155, w: 8,  cx1: -30, grad: 'bg0' },
                { x: 335, len: 90,  w: 5,  cx1: 6,   grad: 'bg2' },
                { x: 378, len: 185, w: 10, cx1: 24,  grad: 'bg3' },
                { x: 425, len: 60,  w: 3,  cx1: -18, grad: 'bg1' },
                { x: 462, len: 140, w: 7,  cx1: 32,  grad: 'bg4' },
                { x: 505, len: 75,  w: 4,  cx1: -10, grad: 'bg5' },
              ].map((d, i) => {
                const h = d.len; const hw = d.w / 2; const tipX = d.x + d.cx1 * 0.3; const tipY = 220 - h;
                return <path key={`bd-${i}`} d={`M ${d.x-hw} 220 C ${d.x-hw+d.cx1*0.9} ${220-h*0.45} ${tipX-1} ${220-h*0.88} ${tipX} ${tipY} C ${tipX+1} ${220-h*0.88} ${d.x+hw+d.cx1*0.9} ${220-h*0.45} ${d.x+hw} 220 Z`} fill={`url(#${d.grad})`} />;
              })}
            </g>
          </svg>

          {/* Poison bubbles — only above 5 counters */}
          {player.poison >= 5 && [
            { left: '12%', size: 8,  delay: '0s',    dur: '3.2s', dark: false },
            { left: '28%', size: 5,  delay: '0.7s',  dur: '2.6s', dark: true  },
            { left: '42%', size: 10, delay: '1.4s',  dur: '3.8s', dark: false },
            { left: '55%', size: 6,  delay: '0.3s',  dur: '2.9s', dark: true  },
            { left: '68%', size: 9,  delay: '1.1s',  dur: '3.4s', dark: false },
            { left: '80%', size: 5,  delay: '0.5s',  dur: '2.4s', dark: true  },
            { left: '20%', size: 7,  delay: '2.0s',  dur: '3.1s', dark: true  },
            { left: '90%', size: 6,  delay: '1.8s',  dur: '2.7s', dark: false },
          ].map((b, i) => {
            const intensity = Math.max(0, (player.poison - 4) / 6) * (player.poison >= 9 ? 1.0 : 0.6);
            const durBase = parseFloat(b.dur);
            const dur = player.poison >= 9 ? `${(durBase * 0.15).toFixed(2)}s` : player.poison >= 8 ? `${(durBase * 0.3).toFixed(1)}s` : b.dur;
            const delay = player.poison >= 9 ? '0s' : b.delay;
            return (
            <Box key={i} sx={{
              position: 'absolute',
              bottom: '-12px',
              left: b.left,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              bgcolor: b.dark ? `rgba(0, 0, 0, ${intensity})` : `rgba(0, ${Math.round(180 + poisonProgress * 75)}, 0, ${intensity})`,
              border: b.dark ? `1px solid rgba(0, 200, 60, ${intensity * 0.6})` : `1px solid rgba(0, 255, 80, ${intensity * 0.8})`,
              zIndex: 4,
              pointerEvents: 'none',
              animation: `poisonBubble ${dur} ${delay} ease-in infinite`,
              '@keyframes poisonBubble': {
                '0%':   { transform: 'translateY(0) scale(1)',    opacity: player.poison >= 9 ? 1 : 0.8 },
                '60%':  { transform: 'translateY(-60px) scale(1.1)', opacity: player.poison >= 9 ? 0.85 : 0.6 },
                '100%': { transform: 'translateY(-110px) scale(0.6)', opacity: 0 },
              },
            }} />
          );})}

          {/* Extra boiling bubbles at 9+ */}
          {player.poison >= 9 && [
            { left: '5%',  size: 22, delay: '0s',    dur: '0.45s' },
            { left: '15%', size: 8,  delay: '0.05s', dur: '0.38s' },
            { left: '24%', size: 30, delay: '0.1s',  dur: '0.52s' },
            { left: '33%', size: 12, delay: '0.02s', dur: '0.41s' },
            { left: '40%', size: 5,  delay: '0.08s', dur: '0.35s' },
            { left: '48%', size: 26, delay: '0.15s', dur: '0.48s' },
            { left: '57%', size: 9,  delay: '0.03s', dur: '0.39s' },
            { left: '63%', size: 18, delay: '0.12s', dur: '0.44s' },
            { left: '72%', size: 35, delay: '0s',    dur: '0.55s' },
            { left: '79%', size: 7,  delay: '0.07s', dur: '0.36s' },
            { left: '86%', size: 14, delay: '0.09s', dur: '0.42s' },
            { left: '94%', size: 28, delay: '0.04s', dur: '0.50s' },
          ].map((b, i) => (
            <Box key={`boil-${i}`} sx={{
              position: 'absolute',
              bottom: '-12px',
              left: b.left,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              bgcolor: i % 3 === 0 ? `rgba(0,0,0,0.85)` : `rgba(0,200,60,0.75)`,
              border: `1px solid rgba(0,255,80,0.6)`,
              zIndex: 4,
              pointerEvents: 'none',
              animation: `poisonBubbleFast ${b.dur} ${b.delay} ease-in infinite`,
              '@keyframes poisonBubbleFast': {
                '0%':   { transform: 'translateY(0) scale(1)',     opacity: 1   },
                '50%':  { transform: 'translateY(-50px) scale(1.05)', opacity: 0.8 },
                '100%': { transform: 'translateY(-120px) scale(0.5)', opacity: 0   },
              },
            }} />
          ))}

          {/* Phyrexian symbol — left side */}
          <Box sx={{
            position: 'absolute',
            left: `-${Math.round(30 + poisonProgress * 20)}px`,
            top: '30%',
            transform: `translateY(-50%) rotate(-${poisonProgress * 12}deg)`,
            zIndex: 3,
            pointerEvents: 'none',
            transition: 'all 0.8s ease',
            ...(player.poison >= 9 && {
              animation: 'phyrexianOrbitL 20s linear infinite',
              '@keyframes phyrexianOrbitL': {
                '0%':   { transform: 'translateY(-50%) rotate(-12deg) scale(1)'    },
                '25%':  { transform: 'translateY(-60%) rotate(8deg)   scale(1.35)' },
                '50%':  { transform: 'translateY(-40%) rotate(-20deg) scale(0.75)' },
                '75%':  { transform: 'translateY(-58%) rotate(4deg)   scale(1.2)'  },
                '100%': { transform: 'translateY(-50%) rotate(-12deg) scale(1)'    },
              },
            }),
          }}>
            <Box
              component="img"
              src="https://cdn.jsdelivr.net/gh/Investigamer/mtg-vectors@main/svg/watermark/phyrexian.svg"
              alt=""
              sx={{
                width: `${140 + poisonProgress * 200}px`,
                height: `${140 + poisonProgress * 200}px`,
                opacity: poisonProgress * 0.7,
                transition: 'all 0.8s ease',
                userSelect: 'none',
                display: 'block',
                filter: 'brightness(0)',
              }}
            />
          </Box>

          {/* Phyrexian symbol — right side */}
          <Box sx={{
            position: 'absolute',
            right: `-${Math.round(30 + poisonProgress * 20)}px`,
            top: '65%',
            transform: `translateY(-50%) rotate(${poisonProgress * 12}deg)`,
            zIndex: 3,
            pointerEvents: 'none',
            transition: 'all 0.8s ease',
            ...(player.poison >= 9 && {
              animation: 'phyrexianOrbitR 27s linear infinite',
              '@keyframes phyrexianOrbitR': {
                '0%':   { transform: 'translateY(-50%) rotate(12deg)  scale(1)'    },
                '30%':  { transform: 'translateY(-42%) rotate(-6deg)  scale(0.7)'  },
                '60%':  { transform: 'translateY(-62%) rotate(22deg)  scale(1.4)'  },
                '80%':  { transform: 'translateY(-44%) rotate(-2deg)  scale(0.85)' },
                '100%': { transform: 'translateY(-50%) rotate(12deg)  scale(1)'    },
              },
            }),
          }}>
            <Box
              component="img"
              src="https://cdn.jsdelivr.net/gh/Investigamer/mtg-vectors@main/svg/watermark/phyrexian.svg"
              alt=""
              sx={{
                width: `${140 + poisonProgress * 200}px`,
                height: `${140 + poisonProgress * 200}px`,
                opacity: poisonProgress * 0.7,
                transition: 'all 0.8s ease',
                userSelect: 'none',
                display: 'block',
                filter: 'brightness(0)',
              }}
            />
          </Box>

          {/* Floating rising symbols at 9+ */}
          {player.poison >= 9 && [
            { left: '42%', size: 120, dur: '18s', delay: '0s',   rotate: -15 },
            { left: '54%', size: 90,  dur: '22s', delay: '9s',   rotate: 20  },
            { left: '35%', size: 140, dur: '25s', delay: '14s',  rotate: -8  },
          ].map((s, i) => (
            <Box key={`rise-${i}`} sx={{
              position: 'absolute',
              left: s.left,
              bottom: 0,
              zIndex: 3,
              pointerEvents: 'none',
              animation: `phyrexianRise${i} ${s.dur} ${s.delay} ease-in-out infinite both`,
              [`@keyframes phyrexianRise${i}`]: {
                '0%':   { transform: `translate(0px,           ${s.size + 40}px) rotate(${s.rotate}deg)     scale(0.7)`, opacity: 0    },
                '10%':  { transform: `translate(${i%2?8:-6}px, ${s.size}px)      rotate(${s.rotate - 3}deg) scale(0.9)`, opacity: 0.4  },
                '45%':  { transform: `translate(${i%2?-10:12}px, -100px)  rotate(${s.rotate + 8}deg)  scale(1.1)`,  opacity: 0.65 },
                '75%':  { transform: `translate(${i%2?6:-8}px,  -260px)   rotate(${s.rotate - 5}deg)  scale(0.9)`,  opacity: 0.3  },
                '88%':  { transform: `translate(${i%2?-4:10}px, -400px)   rotate(${s.rotate + 12}deg) scale(0.6)`,  opacity: 0    },
                '100%': { transform: `translate(0px,           ${s.size + 40}px) rotate(${s.rotate}deg)     scale(0.7)`, opacity: 0    },
              },
            }}>
              <Box
                component="img"
                src="https://cdn.jsdelivr.net/gh/Investigamer/mtg-vectors@main/svg/watermark/phyrexian.svg"
                alt=""
                sx={{ width: s.size, height: s.size, display: 'block', filter: 'brightness(0)', userSelect: 'none' }}
              />
            </Box>
          ))}
        </>
      )}

      {/* Concede confirm overlay */}
      {showEliminateConfirm && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none', bgcolor: 'rgba(218,165,32,0.12)' }}>
          <Typography sx={{ fontWeight: 900, color: '#DAA520', fontSize: 22, letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.5)', transform: 'rotate(-10deg)' }}>
            CONCEDE?
          </Typography>
        </Box>
      )}

      {/* Eliminated overlay */}
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

      {/* Life kill attribution overlay */}
      {lifeKillOpponents && onLifeKillSelect && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: 'rgba(0,0,0,0.72)', px: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: fsKillPrompt, color: '#fff', mb: 0.5, textAlign: 'center' }}>
            Who brought {player.playerName} to 0?
          </Typography>
          {lifeKillOpponents.map((opp) => (
            <Button key={opp.idx} variant="outlined" fullWidth onClick={() => onLifeKillSelect(opp.idx)}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              {opp.name}
            </Button>
          ))}
          <Button onClick={() => onLifeKillSelect(null)} sx={{ color: 'rgba(255,255,255,0.5)', fontSize: fsKillPrompt, mt: 0.5 }}>
            Skip
          </Button>
        </Box>
      )}

      {/* Poison kill attribution overlay */}
      {poisonKillOpponents && onPoisonKillSelect && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: 'rgba(0,40,0,0.78)', px: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: fsKillPrompt, color: '#7fff7f', mb: 0.5, textAlign: 'center' }}>
            Who poisoned {player.playerName}?
          </Typography>
          {poisonKillOpponents.map((opp) => (
            <Button key={opp.idx} variant="outlined" fullWidth onClick={() => onPoisonKillSelect(opp.idx)}
              sx={{ color: '#7fff7f', borderColor: 'rgba(100,255,100,0.4)', '&:hover': { borderColor: '#7fff7f', bgcolor: 'rgba(100,255,100,0.1)' } }}>
              {opp.name}
            </Button>
          ))}
          <Button onClick={() => onPoisonKillSelect(null)} sx={{ color: 'rgba(100,255,100,0.4)', fontSize: fsKillPrompt, mt: 0.5 }}>
            Skip
          </Button>
        </Box>
      )}

      {/* ── Header ── */}
      <Box
        sx={{
        px: 1, py: 0.5, flexShrink: 0, filter: 'none', position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center',
        background: isCurrentPlayer && highlightMode
          ? `linear-gradient(90deg, ${timerColorRgba(0.3)} 0%, ${timerColorRgba(0.7)} 50%, ${timerColorRgba(0.3)} 100%)`
          : 'rgba(0,0,0,0.08)',
        transition: 'background-color 0.3s ease',
        ...(isTimerExpired && highlightMode && {
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
              sx={{ height: artHeight, width: 'auto', borderRadius: 0.5, flexShrink: 0, cursor: 'zoom-in' }} />
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
              ...(xpRuneGlowAnim && { animation: `${xpRuneGlowAnim} 2.5s ease-in-out infinite${xpFlashing ? `, ${xpLevelUpAnim} 0.7s ease-out` : ''}` }),
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
                ...(xpFlashing && { animation: `${xpFlashAnim} 0.7s ease-out` }),
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
              <Box key={xpRippleKey} sx={{
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
              <Typography sx={{ fontSize: fsPassBtn, fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
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
            sx={{ fontWeight: 700, fontSize: fsPlayerName, lineHeight: 1.2, pointerEvents: seatCode ? 'auto' : 'none', cursor: seatCode ? 'pointer' : 'default' }}
          >
            {player.playerName}
          </Typography>
          <Typography noWrap sx={{ fontSize: fsDeckName, lineHeight: 1.2, color: 'text.secondary', pointerEvents: 'none' }}>
            {player.deckName} · {player.commander.name}{player.partner ? ` / ${player.partner.name}` : ''}
          </Typography>
        </Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto', zIndex: 1 }}>
            {/* Being viewed indicator */}
            {isBeingViewedByAnyone && (
              <VisibilityIcon onClick={(e) => { e.stopPropagation(); showViewerBanner(); }} sx={{ fontSize: fsHeaderIcon, color: 'primary.main', cursor: 'pointer', animation: 'eyePulse 1.5s ease-in-out infinite', '@keyframes eyePulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
            )}
            {/* Active game state indicators */}
            <>
              {player.isMonarch && (
                <Tooltip open={rulesOpenLabel === 'h:Monarch'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.</Typography>} placement={ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={ttHeaderSlotProps}>
                  <CrownIcon
                    onClick={guardClick(() => toggleRules('h:Monarch'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('off-monarch', () => onToggleMonarch(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: fsHeaderIcon, color: '#DAA520', cursor: 'pointer', animation: 'crownShimmer 2s ease-in-out infinite', '@keyframes crownShimmer': { '0%, 100%': { filter: 'drop-shadow(0 0 2px #DAA520) brightness(1)' }, '50%': { filter: 'drop-shadow(0 0 7px #FFD700) brightness(1.5)' } } }}
                  />
                </Tooltip>
              )}
              {!player.isMonarch && allPlayers.some(p => p.isMonarch) && (
                <Tooltip open={rulesOpenLabel === 'h:Monarch'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.</Typography>} placement={ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={ttHeaderSlotProps}>
                  <CrownIcon
                    onClick={guardClick(() => toggleRules('h:Monarch'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('take-monarch', () => onToggleMonarch(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: fsHeaderIcon, color: 'text.disabled', cursor: 'pointer', opacity: 0.4 }}
                  />
                </Tooltip>
              )}
              {player.hasInitiative && (
                <Tooltip open={rulesOpenLabel === 'h:Initiative'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative.</Typography>} placement={ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={ttHeaderSlotProps}>
                  <InitiativeIcon
                    onClick={guardClick(() => toggleRules('h:Initiative'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('off-initiative', () => onToggleInitiative(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: fsHeaderIcon, color: '#4FC3F7', cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
              {!player.hasInitiative && allPlayers.some(p => p.hasInitiative) && (
                <Tooltip open={rulesOpenLabel === 'h:Initiative'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative.</Typography>} placement={ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={ttHeaderSlotProps}>
                  <InitiativeIcon
                    onClick={guardClick(() => toggleRules('h:Initiative'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('take-initiative', () => onToggleInitiative(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: fsHeaderIcon, color: 'text.disabled', cursor: 'pointer', opacity: 0.4 }}
                  />
                </Tooltip>
              )}
              {player.hasCitysBlessing && (
                <Tooltip open={rulesOpenLabel === "h:City's Blessing"} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>You have the city&apos;s blessing for the rest of the game. Gained when you control ten or more permanents — it persists even if that number later drops below ten.</Typography>} placement={ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={ttHeaderSlotProps}>
                  <CityIcon
                    active
                    onClick={guardClick(() => toggleRules("h:City's Blessing"))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress("off-citys-blessing", () => onToggleCitysBlessing(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: fsHeaderIcon, cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
              {/* Remote connected indicator */}
              {remoteConnected && (
                <SmartphoneIcon sx={{ fontSize: fsSmallIcon, color: 'success.main', animation: 'remotePulse 2s ease-in-out infinite', '@keyframes remotePulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } }, flexShrink: 0 }} />
              )}
              {/* Submenu trigger */}
              <IconButton size="small" onClick={() => setStateMenuOpen(o => !o)} onPointerDown={(e) => e.stopPropagation()} sx={{ p: 0.5, color: stateMenuOpen ? 'primary.main' : 'text.secondary' }}>
                <AddIcon sx={{ fontSize: fsMenuTrigger, transition: 'transform 0.2s ease', transform: stateMenuOpen ? 'rotate(45deg)' : 'none' }} />
              </IconButton>
            </>
          </Stack>
      </Box>

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
                  slotProps={{ tooltip: { sx: { rotate: ttRotate } } }}
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

      {/* ── Main: Commander Damage (left) + Life (right) ── */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, borderTop: (theme) => `1px solid ${theme.palette.divider}`, filter: 'none', position: 'relative', zIndex: 3 }}>

        {/* Commander Damage box */}
        <Box sx={{
          ...(remoteMode ? { width: '33dvw', flexShrink: 0 } : { flex: 1, minWidth: 0 }),
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          px: remoteMode ? 1 : 0.5,
          py: remoteMode ? 1 : 0.25,
          display: 'grid',
          gridTemplateColumns: `1fr ${cmdBtnWidth} ${valColWidth} ${cmdBtnWidth}`,
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
          {/* Title row — spans full width, same pattern as Counters */}
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ gridColumn: '1 / -1', mb: 0.25 }}>
            <Typography sx={{ fontSize: fsSectionLabel, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 }}>
              CMD Damage{isCmdDmgHigh && <Typography component="span" sx={{ fontSize: fsSectionLabel, color: 'error.main', ml: 0.5 }}>⚠</Typography>}
            </Typography>
            <Button size="small" variant={cmdDmgShowPlayer ? 'contained' : 'outlined'} onClick={toggleCmdDmgShowPlayer} sx={{ minWidth: 0, px: remoteMode ? 1.25 : 0.75, py: remoteMode ? 0.5 : 0, fontSize: remoteMode ? fsSectionLabel : 'clamp(7px, 1.2dvh, 11px)', lineHeight: 1.4, flexShrink: 0 }}>
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
                  <Typography sx={{ fontSize: fsSourceName, color: sourceEliminated ? 'text.disabled' : activePlayerIdx === sourceIdx ? 'primary.main' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: sourceEliminated ? 'line-through' : 'none', fontWeight: activePlayerIdx === sourceIdx ? 700 : 400, flex: 1, minWidth: 0 }}>
                    {cmdDmgShowPlayer ? source.playerName : source.commander.name}
                  </Typography>
                  <Tooltip title={`Dealt ${source.partner ? `${dealt[0]}/${dealt[1]}` : dealtTotal} commander damage to ${source.playerName}`} placement="top" slotProps={ttSlotProps} arrow><Typography sx={{ fontSize: fsSourceName, fontWeight: 900, color: dealtTotal >= 21 ? 'error.main' : dealtTotal > 0 ? '#e67e22' : 'text.disabled', lineHeight: 1, flexShrink: 0 }}>⚔{source.partner ? `${dealt[0]}/${dealt[1]}` : dealtTotal}</Typography></Tooltip>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ mt: 0.15, flexWrap: 'wrap', alignItems: 'center' }}>
                  {source.isMonarch && <Tooltip title="Monarch" placement="top" slotProps={ttSlotProps} arrow><CrownIcon sx={{
                    fontSize: fsStatBadge,
                    color: '#DAA520',
                    animation: 'crownShimmer 2s ease-in-out infinite',
                    '@keyframes crownShimmer': {
                      '0%, 100%': { filter: 'drop-shadow(0 0 2px #DAA520) brightness(1)' },
                      '50%': { filter: 'drop-shadow(0 0 7px #FFD700) brightness(1.5)' },
                    },
                  }} /></Tooltip>}
                  {source.hasCitysBlessing && <Tooltip title="City's Blessing" placement="top" slotProps={ttSlotProps} arrow><span><CityIcon active sx={{ fontSize: fsStatBadge }} /></span></Tooltip>}
                  {source.hasInitiative && <Tooltip title="Initiative" placement="top" slotProps={ttSlotProps} arrow><InitiativeIcon sx={{ fontSize: fsStatBadge, color: '#4FC3F7' }} /></Tooltip>}
                  <Tooltip title={`Life: ${source.life}`} placement="top" slotProps={ttSlotProps} arrow><Typography sx={{ fontSize: fsStatBadge, fontWeight: 800, color: lifeColor(source.life) || 'primary.main', lineHeight: 1 }}>♥{source.life}</Typography></Tooltip>
                  {source.poison > 0 && <Tooltip title={`Poison: ${source.poison}`} placement="top" slotProps={ttSlotProps} arrow><Typography sx={{ fontSize: fsStatBadge, fontWeight: 800, color: source.poison >= 10 ? '#e53935' : '#66BB6A', lineHeight: 1 }}>☠{source.poison}</Typography></Tooltip>}
                  {source.energy > 0 && <Tooltip title={`Energy: ${source.energy}`} placement="top" slotProps={ttSlotProps} arrow><Typography sx={{ fontSize: fsStatBadge, fontWeight: 800, color: '#4FC8FF', lineHeight: 1 }}>⚡{source.energy}</Typography></Tooltip>}
                  {source.experience > 0 && <Tooltip title={`XP: ${source.experience}`} placement="top" slotProps={ttSlotProps} arrow><Stack direction="row" alignItems="center" spacing={0.25}><Box sx={{ bgcolor: 'background.paper', display: 'inline-flex' }}><Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: fsStatBadge, height: fsStatBadge, objectFit: 'contain', mixBlendMode: 'multiply', transition: 'width 0.2s ease, height 0.2s ease' }} /></Box><Typography sx={{ fontSize: fsStatBadge, fontWeight: 800, color: '#DAA520', lineHeight: 1 }}>{source.experience}</Typography></Stack></Tooltip>}
                </Stack>
              </Box>,
              <Tooltip key={`${sourceIdx}-dec`} open={lpKey === `${sourceIdx}-dec`} title="-5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => handleCmdDmgChange(playerIdx, sourceIdx, false, -1))} onPointerDown={() => startLongPress(`${sourceIdx}-dec`, () => handleCmdDmgChange(playerIdx, sourceIdx, false, -5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: cmdBtnWidth, minHeight: cmdBtnHeight }}>
                  <Typography sx={{ fontSize: fsCounterBtn, fontWeight: 700, lineHeight: 1 }}>−</Typography>
                </IconButton></span>
              </Tooltip>,
              <Typography key={`${sourceIdx}-val`} onClick={() => setFocusedControl({ type: 'commanderDamage', sourceIdx, isPartner: false })} sx={{ fontSize: fsCounterValue, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', cursor: 'pointer', color: dmg[0] >= 21 ? 'error.main' : sourceEliminated ? 'text.disabled' : 'text.primary' }}>
                {dmg[0]}
              </Typography>,
              <Tooltip key={`${sourceIdx}-inc`} open={lpKey === `${sourceIdx}-inc`} title="+5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => handleCmdDmgChange(playerIdx, sourceIdx, false, 1))} onPointerDown={() => startLongPress(`${sourceIdx}-inc`, () => handleCmdDmgChange(playerIdx, sourceIdx, false, 5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: cmdBtnWidth, minHeight: cmdBtnHeight }}>
                  <Typography sx={{ fontSize: fsCounterBtn, fontWeight: 700, lineHeight: 1 }}>+</Typography>
                </IconButton></span>
              </Tooltip>,
            ];
            if (source.partner) {
              rows.push(
                <Typography key={`${sourceIdx}-pname`} onClick={(e) => { e.stopPropagation(); setOpenSnapshotKey(k => k === `${sourceIdx}-psnap` ? null : `${sourceIdx}-psnap`); }} sx={{ fontSize: fsSourceName, color: sourceEliminated ? 'text.disabled' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: sourceEliminated ? 'line-through' : 'none', cursor: 'pointer' }}>
                  {source.partner.name}
                </Typography>,
                <Tooltip key={`${sourceIdx}-pdec`} open={lpKey === `${sourceIdx}-pdec`} title="-5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => handleCmdDmgChange(playerIdx, sourceIdx, true, -1))} onPointerDown={() => startLongPress(`${sourceIdx}-pdec`, () => handleCmdDmgChange(playerIdx, sourceIdx, true, -5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: cmdBtnWidth, minHeight: cmdBtnHeight }}>
                    <Typography sx={{ fontSize: fsCounterBtn, fontWeight: 700, lineHeight: 1 }}>−</Typography>
                  </IconButton></span>
                </Tooltip>,
                <Typography key={`${sourceIdx}-pval`} onClick={() => setFocusedControl({ type: 'commanderDamage', sourceIdx, isPartner: true })} sx={{ fontSize: fsCounterValue, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', cursor: 'pointer', color: dmg[1] >= 21 ? 'error.main' : sourceEliminated ? 'text.disabled' : 'text.primary' }}>
                  {dmg[1]}
                </Typography>,
                <Tooltip key={`${sourceIdx}-pinc`} open={lpKey === `${sourceIdx}-pinc`} title="+5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => handleCmdDmgChange(playerIdx, sourceIdx, true, 1))} onPointerDown={() => startLongPress(`${sourceIdx}-pinc`, () => handleCmdDmgChange(playerIdx, sourceIdx, true, 5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: cmdBtnWidth, minHeight: cmdBtnHeight }}>
                    <Typography sx={{ fontSize: fsCounterBtn, fontWeight: 700, lineHeight: 1 }}>+</Typography>
                  </IconButton></span>
                </Tooltip>,
              );
            }
            return rows;
          })}

          {/* Commander snapshot overlay — covers full CMD DAMAGE panel */}
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
                  {/* Header row — name + life total + close */}
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    {/* Commander art removed from snapshot header — art still shown as background overlay */}
                    <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography sx={{ fontSize: fsSourceName, fontWeight: 800, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{src.playerName}</Typography>
                        {src.isMonarch && <CrownIcon sx={{ fontSize: fsStatBadge, color: '#DAA520', flexShrink: 0 }} />}
                        {src.hasInitiative && <InitiativeIcon sx={{ fontSize: fsStatBadge, color: '#4FC3F7', flexShrink: 0 }} />}
                      </Stack>
                      <Typography onClick={(e) => { e.stopPropagation(); setCmdPreviewName(src.commander.name); }} sx={{ fontSize: fsSectionLabel, color: 'text.secondary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{src.commander.name}</Typography>
                      {src.partner && <Typography onClick={(e) => { e.stopPropagation(); setCmdPreviewName(src.partner!.name); }} sx={{ fontSize: fsSectionLabel, color: 'text.secondary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{src.partner.name}</Typography>}
                    </Box>
                    <Typography sx={{ fontSize: 'clamp(28px, 8dvmax, 56px)', fontWeight: 900, lineHeight: 1, color: srcLifeColor || 'primary.main', textDecoration: src.isEliminated ? 'line-through' : 'none', flexShrink: 0 }}>{src.life}</Typography>
                    <Stack direction="column" alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
                      <IconButton size="small" onClick={() => setOpenSnapshotKey(null)} sx={{ p: 0.25 }}>
                        <CloseIcon sx={{ fontSize: fsSourceName }} />
                      </IconButton>
                      {onSwitchToPlayer && !src.isEliminated && srcIdx !== playerIdx && (
                        <Tooltip title="View panel" placement="left" slotProps={ttSlotProps} arrow>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setOpenSnapshotKey(null); onSwitchToPlayer(srcIdx); }} sx={{ p: 0.25 }}>
                            <OpenInFullIcon sx={{ fontSize: fsSectionLabel }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Stack>

                  <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />

                  {/* Counters row — horizontal */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="space-between" sx={{
                    px: 1, py: 0.5, borderRadius: 1,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)'
                      : 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)',
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  }}>
                    <Typography sx={{ fontSize: fsSourceName, fontWeight: 700, color: src.poison >= 10 ? 'error.main' : src.poison > 0 ? '#66BB6A' : 'text.disabled' }}>☠ {src.poison}</Typography>
                    <Typography sx={{ fontSize: fsSourceName, fontWeight: 700, color: src.energy > 0 ? '#4FC8FF' : 'text.disabled' }}>⚡ {src.energy}</Typography>
                    <Typography sx={{ fontSize: fsSourceName, fontWeight: 700, color: src.experience > 0 ? '#DAA520' : 'text.disabled' }}>XP {src.experience}</Typography>
                    <Typography sx={{ fontSize: fsSourceName, fontWeight: 700, color: src.commanderTax > 0 ? 'text.secondary' : 'text.disabled' }}>Tax +{src.commanderTax * 2}</Typography>
                  </Stack>

                  {/* CMD damage dealt */}
                  <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.25}>
                    <Typography sx={{ fontSize: fsSectionLabel, fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 0.5 }}>CMD Dealt</Typography>
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
                          <Typography sx={{ fontSize: fsSectionLabel, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: isMe ? 'primary.main' : 'text.secondary', fontWeight: isMe ? 700 : 400 }}>{tgt.playerName}</Typography>
                          <Typography sx={{ fontSize: fsSourceName, fontWeight: 700, color: (d[0] >= 21 || d[1] >= 21) ? 'error.main' : isMe ? 'primary.main' : 'text.primary', flexShrink: 0 }}>
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
            {/* Overflow-hidden wrapper keeps the swipe clipped to the number */}
            <Box sx={{ position: 'relative', overflow: 'hidden', lineHeight: 1, width: '100%', flex: remoteMode ? undefined : 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {/* Crack layers — each fades in independently as life drops, expanding from centre */}
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
              {/* Scattered commander name — ghost text warning as damage builds */}
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
                ...(damageFlash > 0 && { animation: `${damageFlashAnim} 0.6s ease-out forwards` }),
                ...(damageFlash === 0 && energyPulseAnim && { animation: `${energyPulseAnim} ${energyPulseDuration.toFixed(2)}s ease-out infinite, ${energySizzleAnim} 0.12s linear infinite` }),
                ...(damageFlash === 0 && !energyPulseAnim && poisonBoilAnim && { animation: `${poisonBoilAnim} ${poisonBoilDuration}s ease-in-out infinite` }),
              }}>
                {player.life}
              </Typography>
              {/* Swipe 1 — left → right, angled down ~22deg */}
              {damageFlash > 0 && (
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
              {/* Swipe 2 — right → left, angled up ~-16deg (asymmetric X) */}
              {damageFlash > 0 && (
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
              {/* Swipe 3 — -5 only, right→left descending */}
              {damageFlash >= 5 && (
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
              {/* Swipe 4 — -5 only, right→left ascending */}
              {damageFlash >= 5 && (
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
              {/* Swipe 5 — -5 only, left→right, steeper angle */}
              {damageFlash >= 5 && (
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
                <Tooltip open={lpKey === 'life-dec'} title="-5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <IconButton
                    onClick={guardClick(() => onLifeChange(playerIdx, -1))}
                    onPointerDown={() => startLongPress('life-dec', () => onLifeChange(playerIdx, -5))}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ px: remoteMode ? 4 : 0.5, py: 0.5, minWidth: remoteMode ? 100 : 52, minHeight: 52, borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 } }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: fsLifeBtn }}>−</Typography>
                  </IconButton>
                </Tooltip>
                <Tooltip open={lpKey === 'life-inc'} title="+5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <IconButton
                    onClick={guardClick(() => onLifeChange(playerIdx, 1))}
                    onPointerDown={() => startLongPress('life-inc', () => onLifeChange(playerIdx, 5))}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ px: remoteMode ? 4 : 0.5, py: 0.5, minWidth: remoteMode ? 100 : 52, minHeight: 52, borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 } }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: fsLifeBtn }}>+</Typography>
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
          {/* Chevron strip — fixed 18px, always same position/size */}
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
            {/* Chevron — always vertically centered regardless of icons */}
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
              <ChevronRightIcon sx={{ fontSize: 22, color: 'text.secondary', transform: countersOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease', display: 'block' }} />
            </Box>
          </Box>
          {/* Counter grid */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', opacity: countersOpen ? 1 : 0, transition: 'opacity 0.15s ease' }}>
            <Typography sx={{ fontSize: fsSectionLabel, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, px: 0.75, pt: 0.5, pb: 0.25, flexShrink: 0 }}>Counters</Typography>
            <Box sx={{
              flex: 1,
              minWidth: 0,
              px: remoteMode ? 0.75 : 0.25,
              pb: remoteMode ? 1 : 0.25,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: `1fr ${cmdBtnWidth} ${valColWidth} ${cmdBtnWidth}`,
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
                {label === 'Poison'     && <Typography component="span" sx={{ fontSize: fsSourceName, color: player.poison >= 10 ? '#e53935' : '#66BB6A', lineHeight: 1, flexShrink: 0 }}>☠</Typography>}
                {label === 'Energy'     && <Typography component="span" sx={{ fontSize: fsSourceName, color: '#4FC8FF', lineHeight: 1, flexShrink: 0 }}>⚡</Typography>}
                {label === 'XP' && <Box sx={{ bgcolor: 'background.paper', display: 'inline-flex', flexShrink: 0 }}><Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: fsSourceName, height: fsSourceName, objectFit: 'contain', mixBlendMode: 'multiply' }} /></Box>}
                {label === 'Tax'        && <Box sx={{ width: fsSourceName, height: fsSourceName, borderRadius: '50%', flexShrink: 0, background: 'radial-gradient(circle at 38% 35%, #d0d0d0, #7a7a7a)', border: '1px solid #3a3a3a', boxShadow: '0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography sx={{ fontSize: 7, fontWeight: 800, color: '#111', lineHeight: 1, userSelect: 'none' }}>+{player.commanderTax * 2}</Typography></Box>}
                <Typography component="span" sx={{ fontSize: fsSourceName, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</Typography>
              </Stack>,
              <Tooltip key={`${label}-dec`} open={lpKey === `${label}-dec`} title="-5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                <IconButton onClick={guardClick(onDec)} onPointerDown={() => startLongPress(`${label}-dec`, onDec5)} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: cmdBtnWidth, minHeight: cmdBtnHeight }}><Typography sx={{ fontSize: fsCounterBtn, fontWeight: 700 }}>−</Typography></IconButton>
              </Tooltip>,
              <Typography key={`${label}-val`} onClick={() => { const t = { 'Poison': 'poison', 'Energy': 'energy', 'XP': 'experience', 'Tax': 'commanderTax' }[label] as 'poison' | 'energy' | 'experience' | 'commanderTax' | undefined; if (t) setFocusedControl({ type: t }); }} sx={{ fontSize: fsCounterValue, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', cursor: 'pointer', color, filter: poisonProgress > 0 ? `blur(${Math.pow(poisonProgress, 2.5) * 1.5}px)` : 'none', ...(label === 'Poison' && value === 9 && { animation: 'poisonPulse 2.5s ease-in-out infinite', '@keyframes poisonPulse': { '0%, 100%': { opacity: 1, transform: 'scale(1)', textShadow: '0 0 8px rgba(0,200,60,0.9), 0 0 20px rgba(0,200,60,0.5)' }, '50%': { opacity: 0.3, transform: 'scale(0.85)', textShadow: '0 0 2px rgba(0,200,60,0.2)' } } }), ...(label === 'XP' && xpGlow && { textShadow: xpGlow, ...(xpShimmerAnim && { animation: `${xpShimmerAnim} 3s ease-in-out infinite` }) }) }}>{value}</Typography>,
              <Tooltip key={`${label}-inc`} open={lpKey === `${label}-inc`} title="+5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                <IconButton onClick={guardClick(onInc)} onPointerDown={() => startLongPress(`${label}-inc`, onInc5)} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: cmdBtnWidth, minHeight: cmdBtnHeight }}><Typography sx={{ fontSize: fsCounterBtn, fontWeight: 700 }}>+</Typography></IconButton>
              </Tooltip>,
            ])}
          </Box>
        </Box>
      </Box>
      </Box>

      {/* Focused control modal — enlarged single counter/damage control */}
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

      {/* Commander card preview overlay */}
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
              /* Zoomed: scrollable container fills the overlay */
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
              /* Fit: centered, click to zoom in */
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

      {/* QR overlay — in-panel, does not take over the board */}
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
