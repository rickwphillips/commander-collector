'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import { Box, Stack, Typography, IconButton, Button, TextField, Tooltip, SvgIcon } from '@mui/material';
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
import SmartphoneIcon from '@mui/icons-material/Smartphone';

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
  textSizeMode?: 0 | 1 | 2;
  monarchTransfer?: { fromPos: string | null; toPos: string | null };
  highlightMode?: boolean;
  remoteMode?: boolean;
  seatCode?: string;
  activePlayerIdx?: number;
  remoteConnected?: boolean;
}

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
  textSizeMode = 0,
  monarchTransfer = { fromPos: null, toPos: null },
  highlightMode = false,
  remoteMode = false,
  seatCode,
  activePlayerIdx,
  remoteConnected = false,
}: PlayerPanelProps) {
  const ts = textSizeMode;
  const ttRotate = player.position === 'top' ? '180deg' : player.position === 'left' ? '90deg' : player.position === 'right' ? '270deg' : '0deg';
  const ttSlotProps = { tooltip: { sx: { rotate: ttRotate } } };
  const ttHeaderPlacement = player.position === 'top' ? 'top' as const : player.position === 'left' ? 'left' as const : player.position === 'right' ? 'left' as const : 'bottom' as const;
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
  const [cmdDmgShowPlayer, setCmdDmgShowPlayer] = useState(false);
  const [cityBlessingVisible, setCityBlessingVisible] = useState(player.hasCitysBlessing);
  const [cityBlessingExiting, setCityBlessingExiting] = useState(false);
  useEffect(() => {
    if (player.hasCitysBlessing) {
      setCityBlessingVisible(true);
      setCityBlessingExiting(false);
    } else if (cityBlessingVisible) {
      setCityBlessingExiting(true);
      const t = setTimeout(() => { setCityBlessingVisible(false); setCityBlessingExiting(false); }, 3800);
      return () => clearTimeout(t);
    }
  }, [player.hasCitysBlessing]);
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

  const [lpKey, setLpKey] = useState<string | null>(null);
  const lpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired = useRef(false);
  const [qrOpen, setQrOpen] = useState(false);
  const headerLpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerLpFired = useRef(false);
  const [passTurnHolding, setPassTurnHolding] = useState(false);
  const passTurnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPassTurnHold = () => {
    if (!onPassTurn || !isCurrentPlayer) return;
    setPassTurnHolding(true);
    passTurnTimer.current = setTimeout(() => {
      setPassTurnHolding(false);
      onPassTurn();
    }, 700);
  };
  const cancelPassTurnHold = () => {
    setPassTurnHolding(false);
    if (passTurnTimer.current) { clearTimeout(passTurnTimer.current); passTurnTimer.current = null; }
  };

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

  const crackAlpha = (from: number) => Math.min(Math.max((lostRatio - from) / 0.15, 0), 1);

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
          : (highlightMode ? undefined : currentPlayerBorder)
          ?? (isWarning ? '2px solid #e53935' : undefined)
          ?? ((theme: import('@mui/material').Theme) => `1px solid ${theme.palette.divider}`),
        boxShadow: showEliminateConfirm
          ? '0 0 24px 6px rgba(218,165,32,0.6)'
          : isHighlighted
          ? '0 0 24px 6px rgba(218,165,32,0.6)'
          : (highlightMode ? null : currentPlayerShadow) ?? 'none',
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

      {/* ── City's Blessing castle silhouette ── */}
      {cityBlessingVisible && (
        <Box component="svg" viewBox="0 0 300 240" sx={{
          position: 'absolute', bottom: -60, left: -120,
          width: 320, height: 256, fill: 'rgba(0,0,0,0.55)', stroke: 'rgba(0,0,0,0.80)', strokeWidth: 1.2,
          zIndex: 0, pointerEvents: 'none',
          animation: cityBlessingExiting
            ? `${castleSlideOut} 1.8s 2s ease-in forwards`
            : `${castleSlideIn} 1.8s ease-out forwards`,
        }}>
          {/* Main silhouette */}
          <path d="
            M0,240
            L0,62 L40,0 L80,62
            L80,92 L86,92 L86,80 L94,80 L94,92 L102,92 L102,80 L110,80 L110,92 L118,92 L118,80 L126,80 L126,92
            L126,68 L150,42 L174,68
            L174,92 L182,92 L182,80 L190,80 L190,92 L198,92 L198,80 L206,80 L206,92 L214,92 L214,80 L222,80 L222,92
            L220,62 L260,0 L300,62
            L300,240 Z
          " />
          {/* Left tower arrow slits */}
          <rect x="28" y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="48" y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          {/* Left tower stringcourse */}
          <line x1="2" y1="130" x2="78" y2="130" strokeWidth="1.5" stroke="rgba(0,0,0,0.5)"/>
          {/* Right tower arrow slits */}
          <rect x="248" y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          <rect x="268" y="100" width="5" height="20" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          {/* Right tower stringcourse */}
          <line x1="222" y1="130" x2="298" y2="130" strokeWidth="1.5" stroke="rgba(0,0,0,0.5)"/>
          {/* Central turret arrow slit */}
          <rect x="147" y="115" width="6" height="24" rx="2" fill="rgba(0,0,0,0.7)" stroke="none"/>
          {/* Wall stringcourse */}
          <line x1="80" y1="160" x2="220" y2="160" strokeWidth="1.5" stroke="rgba(0,0,0,0.4)"/>
          {/* Stone block hints - horizontal lines on towers */}
          <line x1="2" y1="170" x2="78" y2="170" strokeWidth="1" stroke="rgba(0,0,0,0.3)"/>
          <line x1="2" y1="200" x2="78" y2="200" strokeWidth="1" stroke="rgba(0,0,0,0.3)"/>
          <line x1="222" y1="170" x2="298" y2="170" strokeWidth="1" stroke="rgba(0,0,0,0.3)"/>
          <line x1="222" y1="200" x2="298" y2="200" strokeWidth="1" stroke="rgba(0,0,0,0.3)"/>
        </Box>
      )}

      {/* ── City's Blessing fireworks ── */}
      {cityBlessingVisible && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden',
          ...(cityBlessingExiting && { animation: `${fwFadeOut} 0.5s ease-out forwards` }),
        }}>
          {([
            { left: '28%', top: '38%', delay: '4.5s',  dur: '6s',   color: '#81C784', angle:  -12, scale: 0.7 },
            { left: '68%', top: '25%', delay: '6.7s',  dur: '7s',   color: '#4FC3F7', angle:   18, scale: 1.4 },
            { left: '50%', top: '58%', delay: '9.0s',  dur: '6.5s', color: '#FFD700', angle:   -5, scale: 1.0 },
            { left: '18%', top: '62%', delay: '5.6s',  dur: '8s',   color: '#FF8A65', angle:   25, scale: 1.7 },
            { left: '80%', top: '48%', delay: '7.8s',  dur: '7.5s', color: '#CE93D8', angle:  -20, scale: 0.5 },
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
          <Typography sx={{ fontWeight: 700, fontSize: ts === 2 ? 15 : 13, color: '#fff', mb: 0.5, textAlign: 'center' }}>
            Who brought {player.playerName} to 0?
          </Typography>
          {lifeKillOpponents.map((opp) => (
            <Button key={opp.idx} variant="outlined" fullWidth onClick={() => onLifeKillSelect(opp.idx)}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              {opp.name}
            </Button>
          ))}
          <Button onClick={() => onLifeKillSelect(null)} sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, mt: 0.5 }}>
            Skip
          </Button>
        </Box>
      )}

      {/* Poison kill attribution overlay */}
      {poisonKillOpponents && onPoisonKillSelect && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: 'rgba(0,40,0,0.78)', px: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: ts === 2 ? 15 : 13, color: '#7fff7f', mb: 0.5, textAlign: 'center' }}>
            Who poisoned {player.playerName}?
          </Typography>
          {poisonKillOpponents.map((opp) => (
            <Button key={opp.idx} variant="outlined" fullWidth onClick={() => onPoisonKillSelect(opp.idx)}
              sx={{ color: '#7fff7f', borderColor: 'rgba(100,255,100,0.4)', '&:hover': { borderColor: '#7fff7f', bgcolor: 'rgba(100,255,100,0.1)' } }}>
              {opp.name}
            </Button>
          ))}
          <Button onClick={() => onPoisonKillSelect(null)} sx={{ color: 'rgba(100,255,100,0.4)', fontSize: 12, mt: 0.5 }}>
            Skip
          </Button>
        </Box>
      )}

      {/* ── Header ── */}
      <Box
        onPointerDown={seatCode ? () => {
          headerLpFired.current = false;
          headerLpTimer.current = setTimeout(() => {
            headerLpFired.current = true;
            setQrOpen(true);
          }, 600);
        } : undefined}
        onPointerUp={seatCode ? () => { if (headerLpTimer.current) { clearTimeout(headerLpTimer.current); headerLpTimer.current = null; } } : undefined}
        onPointerLeave={seatCode ? () => { if (headerLpTimer.current) { clearTimeout(headerLpTimer.current); headerLpTimer.current = null; } } : undefined}
        onPointerCancel={seatCode ? () => { if (headerLpTimer.current) { clearTimeout(headerLpTimer.current); headerLpTimer.current = null; } } : undefined}
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
              sx={{ height: ts === 2 ? 42 : ts === 1 ? 36 : 32, width: 'auto', borderRadius: 0.5, flexShrink: 0 }} />
          )}
          {player.commanderTax > 0 && (
            <Tooltip title={`Commander Tax: cast ${player.commanderTax}× (+${player.commanderTax * 2} generic mana)`} placement="bottom" arrow>
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
          {/* Pass Turn — long press, remote panel only */}
          {remoteMode && isCurrentPlayer && onPassTurn && !player.isEliminated && (
            <Box
              onPointerDown={startPassTurnHold}
              onPointerUp={cancelPassTurnHold}
              onPointerLeave={cancelPassTurnHold}
              onPointerCancel={cancelPassTurnHold}
              sx={{
                position: 'relative', overflow: 'hidden',
                px: 1.5, py: 0.5,
                borderRadius: 1.5,
                border: '2px solid',
                borderColor: 'primary.main',
                cursor: 'pointer',
                userSelect: 'none',
                ...(passTurnHolding && {
                  '&::after': {
                    content: '""',
                    position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
                    bgcolor: 'primary.main',
                    transformOrigin: 'left center',
                    animation: 'passFill 0.7s linear forwards',
                    '@keyframes passFill': {
                      '0%': { transform: 'scaleX(0)' },
                      '100%': { transform: 'scaleX(1)' },
                    },
                  },
                }),
              }}
            >
              <Typography sx={{ fontSize: ts === 2 ? 14 : ts === 1 ? 13 : 12, fontWeight: 700, position: 'relative', zIndex: 1, color: 'primary.main', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
                PASS
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Center: absolutely positioned so it's always centered relative to the full header */}
        <Box
          onPointerDown={seatCode ? () => { headerLpFired.current = false; headerLpTimer.current = setTimeout(() => { headerLpFired.current = true; setQrOpen(true); }, 600); } : undefined}
          onPointerUp={seatCode ? () => { if (headerLpTimer.current) { clearTimeout(headerLpTimer.current); headerLpTimer.current = null; } } : undefined}
          onPointerLeave={seatCode ? () => { if (headerLpTimer.current) { clearTimeout(headerLpTimer.current); headerLpTimer.current = null; } } : undefined}
          onPointerCancel={seatCode ? () => { if (headerLpTimer.current) { clearTimeout(headerLpTimer.current); headerLpTimer.current = null; } } : undefined}
          sx={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', px: 6, cursor: seatCode ? 'pointer' : 'default' }}
        >
          <Typography noWrap sx={{ fontWeight: 700, fontSize: ts === 2 ? 16 : ts === 1 ? 14 : 12, lineHeight: 1.2 }}>
            {player.playerName}
          </Typography>
          <Typography noWrap sx={{ fontSize: ts === 2 ? 13 : ts === 1 ? 11 : 9, lineHeight: 1.2, color: 'text.secondary' }}>
            {player.deckName} · {player.commander.name}{player.partner ? ` / ${player.partner.name}` : ''}
          </Typography>
        </Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto', zIndex: 1 }}>
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
                    sx={{ fontSize: ts === 2 ? 26 : ts === 1 ? 24 : 22, color: '#DAA520', cursor: 'pointer', animation: 'crownShimmer 2s ease-in-out infinite', '@keyframes crownShimmer': { '0%, 100%': { filter: 'drop-shadow(0 0 2px #DAA520) brightness(1)' }, '50%': { filter: 'drop-shadow(0 0 7px #FFD700) brightness(1.5)' } } }}
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
                    sx={{ fontSize: ts === 2 ? 26 : ts === 1 ? 24 : 22, color: 'text.disabled', cursor: 'pointer', opacity: 0.4 }}
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
                    sx={{ fontSize: ts === 2 ? 26 : ts === 1 ? 24 : 22, color: '#4FC3F7', cursor: 'pointer' }}
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
                    sx={{ fontSize: ts === 2 ? 26 : ts === 1 ? 24 : 22, color: 'text.disabled', cursor: 'pointer', opacity: 0.4 }}
                  />
                </Tooltip>
              )}
              {player.hasCitysBlessing && (
                <Tooltip open={rulesOpenLabel === "h:City's Blessing"} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>You have the city's blessing for the rest of the game. Gained when you control ten or more permanents — it persists even if that number later drops below ten.</Typography>} placement={ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={ttHeaderSlotProps}>
                  <CityIcon
                    active
                    onClick={guardClick(() => toggleRules("h:City's Blessing"))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress("off-citys-blessing", () => onToggleCitysBlessing(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: ts === 2 ? 26 : ts === 1 ? 24 : 22, cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
              {/* Remote connected indicator */}
              {remoteConnected && (
                <SmartphoneIcon sx={{ fontSize: ts === 2 ? 16 : 14, color: 'success.main', animation: 'remotePulse 2s ease-in-out infinite', '@keyframes remotePulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } }, flexShrink: 0 }} />
              )}
              {/* Submenu trigger */}
              <IconButton size="small" onClick={() => setStateMenuOpen(o => !o)} onPointerDown={(e) => e.stopPropagation()} sx={{ p: 0.5, color: stateMenuOpen ? 'primary.main' : 'text.secondary' }}>
                <AddIcon sx={{ fontSize: ts === 2 ? 20 : 18, transition: 'transform 0.2s ease', transform: stateMenuOpen ? 'rotate(45deg)' : 'none' }} />
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
              width: '90%', maxWidth: 220,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1E1510' : '#FFFAF5',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 },
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {([
              { label: 'Monarch', icon: <CrownIcon sx={{ fontSize: 18, color: player.isMonarch ? '#DAA520' : 'inherit' }} />, active: player.isMonarch, color: '#DAA520', toggle: () => { onToggleMonarch(playerIdx); setStateMenuOpen(false); }, rulesText: 'Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.' },
              { label: 'Initiative', icon: <InitiativeIcon sx={{ fontSize: 18 }} />, active: player.hasInitiative, color: '#4FC3F7', toggle: () => { onToggleInitiative(playerIdx); setStateMenuOpen(false); }, rulesText: "When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative." },
              { label: "City's Blessing", icon: <CityIcon active={player.hasCitysBlessing} sx={{ fontSize: 18 }} />, active: player.hasCitysBlessing, color: '#7851A9', toggle: () => { onToggleCitysBlessing(playerIdx); setStateMenuOpen(false); }, rulesText: "You have the city's blessing for the rest of the game. Gained when you control ten or more permanents — it persists even if that number later drops below ten." },
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
          </Box>
          <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1.5 }}>tap outside to close</Typography>
        </Box>
      )}

      {/* ── Main: Commander Damage (left) + Life (right) ── */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, borderTop: (theme) => `1px solid ${theme.palette.divider}`, filter: 'none', position: 'relative', zIndex: 3 }}>

        {/* Commander Damage box */}
        <Box sx={{
          width: '33%',
          flexShrink: 0,
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          px: ts === 2 ? 0.1 : ts === 1 ? 0.25 : 0.5,
          py: ts === 2 ? 0 : ts === 1 ? 0.1 : 0.25,
          display: 'grid',
          gridTemplateColumns: `1fr ${ts === 2 ? 38 : 32}px ${ts === 2 ? 38 : 30}px ${ts === 2 ? 38 : 32}px`,
          alignContent: 'center',
          alignItems: 'center',
          rowGap: ts > 0 ? 0 : 0.1,
          overflowY: 'auto',
          overflow: 'hidden',
          transition: 'padding 0.2s ease, row-gap 0.2s ease',
        }}>
          {/* Title row — spans full width, same pattern as Counters */}
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ gridColumn: '1 / -1', mb: ts === 2 ? 0 : ts === 1 ? 0.1 : 0.25 }}>
            <Typography sx={{ fontSize: ts === 2 ? 15 : ts === 1 ? 13 : 11, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 }}>
              CMD Damage{isCmdDmgHigh && <Typography component="span" sx={{ fontSize: ts === 2 ? 15 : ts === 1 ? 13 : 11, color: 'error.main', ml: 0.5 }}>⚠</Typography>}
            </Typography>
            <Button size="small" variant={cmdDmgShowPlayer ? 'contained' : 'outlined'} onClick={() => setCmdDmgShowPlayer(p => !p)} sx={{ minWidth: 0, px: 0.75, py: 0, fontSize: ts === 2 ? 11 : 9, lineHeight: 1.4, flexShrink: 0 }}>
              {cmdDmgShowPlayer ? 'Player' : 'CMD'}
            </Button>
          </Stack>
          {opponents.flatMap(({ player: source, idx: sourceIdx }) => {
            const dmg = commanderDamage[playerIdx]?.[sourceIdx] ?? [0, 0];
            const sourceEliminated = source.isEliminated;
            const rows = [
              <Box key={`${sourceIdx}-name`} sx={{ overflow: 'hidden', pt: 0 }}>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ overflow: 'hidden' }}>
                  {activePlayerIdx === sourceIdx && (
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, boxShadow: '0 0 4px 1px rgba(var(--mui-palette-primary-mainChannel) / 0.7)' }} />
                  )}
                  <Typography sx={{ fontSize: ts === 2 ? 19 : ts === 1 ? 16 : 14, color: sourceEliminated ? 'text.disabled' : activePlayerIdx === sourceIdx ? 'primary.main' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: sourceEliminated ? 'line-through' : 'none', fontWeight: activePlayerIdx === sourceIdx ? 700 : 400 }}>
                    {cmdDmgShowPlayer ? source.playerName : source.commander.name}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ mt: ts > 0 ? 0 : 0.15, flexWrap: 'wrap', alignItems: 'center' }}>
                  {source.isMonarch && <Tooltip title="Monarch" placement="top" slotProps={ttSlotProps} arrow><CrownIcon sx={{
                    fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10,
                    color: '#DAA520',
                    animation: 'crownShimmer 2s ease-in-out infinite',
                    '@keyframes crownShimmer': {
                      '0%, 100%': { filter: 'drop-shadow(0 0 2px #DAA520) brightness(1)' },
                      '50%': { filter: 'drop-shadow(0 0 7px #FFD700) brightness(1.5)' },
                    },
                  }} /></Tooltip>}
                  {source.hasCitysBlessing && <Tooltip title="City's Blessing" placement="top" slotProps={ttSlotProps} arrow><span><CityIcon active sx={{ fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10 }} /></span></Tooltip>}
                  {source.hasInitiative && <Tooltip title="Initiative" placement="top" slotProps={ttSlotProps} arrow><InitiativeIcon sx={{ fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10, color: '#4FC3F7' }} /></Tooltip>}
                  <Tooltip title={`Life: ${source.life}`} placement="top" slotProps={ttSlotProps} arrow><Typography sx={{ fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10, fontWeight: 800, color: lifeColor(source.life) || 'primary.main', lineHeight: 1 }}>♥{source.life}</Typography></Tooltip>
                  {source.poison > 0 && <Tooltip title={`Poison: ${source.poison}`} placement="top" slotProps={ttSlotProps} arrow><Typography sx={{ fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10, fontWeight: 800, color: source.poison >= 10 ? '#e53935' : '#66BB6A', lineHeight: 1 }}>☠{source.poison}</Typography></Tooltip>}
                  {source.energy > 0 && <Tooltip title={`Energy: ${source.energy}`} placement="top" slotProps={ttSlotProps} arrow><Typography sx={{ fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10, fontWeight: 800, color: '#4FC8FF', lineHeight: 1 }}>⚡{source.energy}</Typography></Tooltip>}
                  {source.experience > 0 && <Tooltip title={`Experience: ${source.experience}`} placement="top" slotProps={ttSlotProps} arrow><Stack direction="row" alignItems="center" spacing={0.25}><Box sx={{ bgcolor: 'background.paper', display: 'inline-flex' }}><Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: ts === 2 ? 14 : ts === 1 ? 12 : 10, height: ts === 2 ? 14 : ts === 1 ? 12 : 10, objectFit: 'contain', mixBlendMode: 'multiply', transition: 'width 0.2s ease, height 0.2s ease' }} /></Box><Typography sx={{ fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10, fontWeight: 800, color: '#DAA520', lineHeight: 1 }}>{source.experience}</Typography></Stack></Tooltip>}
                </Stack>
              </Box>,
              <Tooltip key={`${sourceIdx}-dec`} open={lpKey === `${sourceIdx}-dec`} title="-5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => onCommanderDamageChange(playerIdx, sourceIdx, false, -1))} onPointerDown={() => startLongPress(`${sourceIdx}-dec`, () => onCommanderDamageChange(playerIdx, sourceIdx, false, -5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: ts === 2 ? 38 : 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}>
                  <Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700, lineHeight: 1 }}>−</Typography>
                </IconButton></span>
              </Tooltip>,
              <Typography key={`${sourceIdx}-val`} sx={{ fontSize: ts === 2 ? 26 : ts === 1 ? 22 : 20, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', color: dmg[0] >= 21 ? 'error.main' : sourceEliminated ? 'text.disabled' : 'text.primary' }}>
                {dmg[0]}
              </Typography>,
              <Tooltip key={`${sourceIdx}-inc`} open={lpKey === `${sourceIdx}-inc`} title="+5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => onCommanderDamageChange(playerIdx, sourceIdx, false, 1))} onPointerDown={() => startLongPress(`${sourceIdx}-inc`, () => onCommanderDamageChange(playerIdx, sourceIdx, false, 5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: ts === 2 ? 38 : 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}>
                  <Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700, lineHeight: 1 }}>+</Typography>
                </IconButton></span>
              </Tooltip>,
            ];
            if (source.partner) {
              rows.push(
                <Typography key={`${sourceIdx}-pname`} sx={{ fontSize: ts === 2 ? 19 : ts === 1 ? 16 : 14, color: sourceEliminated ? 'text.disabled' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: sourceEliminated ? 'line-through' : 'none' }}>
                  {source.partner.name}
                </Typography>,
                <Tooltip key={`${sourceIdx}-pdec`} open={lpKey === `${sourceIdx}-pdec`} title="-5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => onCommanderDamageChange(playerIdx, sourceIdx, true, -1))} onPointerDown={() => startLongPress(`${sourceIdx}-pdec`, () => onCommanderDamageChange(playerIdx, sourceIdx, true, -5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: ts === 2 ? 38 : 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}>
                    <Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700, lineHeight: 1 }}>−</Typography>
                  </IconButton></span>
                </Tooltip>,
                <Typography key={`${sourceIdx}-pval`} sx={{ fontSize: ts === 2 ? 26 : ts === 1 ? 22 : 20, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', color: dmg[1] >= 21 ? 'error.main' : sourceEliminated ? 'text.disabled' : 'text.primary' }}>
                  {dmg[1]}
                </Typography>,
                <Tooltip key={`${sourceIdx}-pinc`} open={lpKey === `${sourceIdx}-pinc`} title="+5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => onCommanderDamageChange(playerIdx, sourceIdx, true, 1))} onPointerDown={() => startLongPress(`${sourceIdx}-pinc`, () => onCommanderDamageChange(playerIdx, sourceIdx, true, 5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: ts === 2 ? 38 : 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}>
                    <Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700, lineHeight: 1 }}>+</Typography>
                  </IconButton></span>
                </Tooltip>,
              );
            }
            return rows;
          })}
        </Box>

        {/* Life total + controls */}
        <Box sx={{ width: '33%', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 0.5, alignSelf: 'stretch' }}>
          <Box sx={{ position: 'relative', lineHeight: 1, overflow: 'visible', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {showCrown && (
              <CrownIcon sx={{
                fontSize: ts === 2 ? 72 : ts === 1 ? 60 : 48,
                color: '#DAA520',
                transform: 'rotate(-25deg)',
                transition: 'font-size 0.25s ease',
                position: 'absolute',
                top: ts === 2 ? -36 : ts === 1 ? -30 : -24,
                left: ts === 2 ? -44 : ts === 1 ? -36 : -28,
                animation: monarchAnimStr,
              }} />
            )}
            {/* Overflow-hidden wrapper keeps the swipe clipped to the number */}
            <Box sx={{ position: 'relative', overflow: 'hidden', lineHeight: 1, width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
              <Typography sx={{
                position: 'relative', zIndex: 1,
                fontWeight: 900,
                fontSize: remoteMode
                  ? (ts === 2 ? 'clamp(100px, 26dvh, 220px)' : ts === 1 ? 'clamp(85px, 22dvh, 190px)' : 'clamp(72px, 18dvh, 160px)')
                  : (ts === 2 ? 'clamp(50px, 14dvh, 128px)' : ts === 1 ? 'clamp(40px, 11dvh, 96px)' : 'clamp(34px, 9dvh, 80px)'),
                lineHeight: 1,
                color: computedLifeColor || ((theme: import('@mui/material').Theme) => theme.palette.primary.main),
                transition: 'color 0.4s ease, font-size 0.2s ease',
                ...(damageFlash > 0 && { animation: `${damageFlashAnim} 0.6s ease-out forwards` }),
                ...(damageFlash === 0 && energyPulseAnim && { animation: `${energyPulseAnim} ${energyPulseDuration.toFixed(2)}s ease-out infinite, ${energySizzleAnim} 0.12s linear infinite` }),
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
              <Stack direction="row" alignItems="center" spacing={ts === 2 ? 1 : 0.5} sx={{ mt: 0.5, zIndex: 1, transition: 'gap 0.2s ease' }}>
                <Tooltip open={lpKey === 'life-dec'} title="-5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <IconButton
                    onClick={guardClick(() => onLifeChange(playerIdx, -1))}
                    onPointerDown={() => startLongPress('life-dec', () => onLifeChange(playerIdx, -5))}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ p: ts === 2 ? 0 : ts === 1 ? 0.25 : 0.5, minWidth: 52, minHeight: 52, borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 }, transition: 'padding 0.2s ease' }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: ts === 2 ? 60 : ts === 1 ? 48 : 36 }}>−</Typography>
                  </IconButton>
                </Tooltip>
                <Tooltip open={lpKey === 'life-inc'} title="+5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <IconButton
                    onClick={guardClick(() => onLifeChange(playerIdx, 1))}
                    onPointerDown={() => startLongPress('life-inc', () => onLifeChange(playerIdx, 5))}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ p: ts === 2 ? 0 : ts === 1 ? 0.25 : 0.5, minWidth: 52, minHeight: 52, borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 }, transition: 'padding 0.2s ease' }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: ts === 2 ? 60 : ts === 1 ? 48 : 36 }}>+</Typography>
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Counters — right column */}
        <Box sx={{
          flex: 1,
          minWidth: 0,
          borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
          px: ts === 2 ? 0.1 : ts === 1 ? 0.25 : 0.5,
          py: ts === 2 ? 0 : ts === 1 ? 0.1 : 0.25,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: `1fr ${ts === 2 ? 38 : 32}px ${ts === 2 ? 38 : 30}px ${ts === 2 ? 38 : 32}px`,
          alignContent: 'safe center',
          alignItems: 'center',
          rowGap: ts > 0 ? 0 : 0.1,
          transition: 'padding 0.2s ease, row-gap 0.2s ease',
        }}>
          <Typography sx={{ fontSize: ts === 2 ? 15 : ts === 1 ? 13 : 11, fontWeight: 600, color: 'text.secondary', mb: ts === 2 ? 0 : ts === 1 ? 0.1 : 0.25, textTransform: 'uppercase', letterSpacing: 0.5, gridColumn: '1 / -1' }}>
            Counters
          </Typography>
          {([
            ['Poison', player.poison, () => onPoisonChange(playerIdx, -1), () => onPoisonChange(playerIdx, 1), () => onPoisonChange(playerIdx, -5), () => onPoisonChange(playerIdx, 5), player.poison >= 10 ? 'error.main' : player.poison > 0 ? 'warning.main' : 'text.disabled'],
            ['Energy', player.energy, () => onEnergyChange(playerIdx, -1), () => onEnergyChange(playerIdx, 1), () => onEnergyChange(playerIdx, -5), () => onEnergyChange(playerIdx, 5), player.energy > 0 ? 'primary.main' : 'text.disabled'],
            ['Experience', player.experience, () => onExperienceChange(playerIdx, -1), () => onExperienceChange(playerIdx, 1), () => onExperienceChange(playerIdx, -5), () => onExperienceChange(playerIdx, 5), player.experience > 0 ? 'primary.main' : 'text.disabled'],
            ['Commander Tax', player.commanderTax, () => onCommanderTaxChange(playerIdx, -1), () => onCommanderTaxChange(playerIdx, 1), () => onCommanderTaxChange(playerIdx, -5), () => onCommanderTaxChange(playerIdx, 5), player.commanderTax > 0 ? 'warning.main' : 'text.disabled'],
          ] as [string, number, () => void, () => void, () => void, () => void, string][]).flatMap(([label, value, onDec, onInc, onDec5, onInc5, color]) => [
            <Typography key={`${label}-lbl`} sx={{ fontSize: ts === 2 ? 19 : ts === 1 ? 16 : 14, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', filter: poisonProgress > 0 ? `blur(${Math.pow(poisonProgress, 2.5) * 1.5}px)` : 'none' }}>{label}</Typography>,
            <Tooltip key={`${label}-dec`} open={lpKey === `${label}-dec`} title="-5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
              <IconButton onClick={guardClick(onDec)} onPointerDown={() => startLongPress(`${label}-dec`, onDec5)} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: ts === 2 ? 38 : 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}><Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700 }}>−</Typography></IconButton>
            </Tooltip>,
            <Typography key={`${label}-val`} sx={{ fontSize: ts === 2 ? 26 : ts === 1 ? 22 : 20, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', color, filter: poisonProgress > 0 ? `blur(${Math.pow(poisonProgress, 2.5) * 1.5}px)` : 'none', ...(label === 'Poison' && value === 9 && { animation: 'poisonPulse 2.5s ease-in-out infinite', '@keyframes poisonPulse': { '0%, 100%': { opacity: 1, transform: 'scale(1)', textShadow: '0 0 8px rgba(0,200,60,0.9), 0 0 20px rgba(0,200,60,0.5)' }, '50%': { opacity: 0.3, transform: 'scale(0.85)', textShadow: '0 0 2px rgba(0,200,60,0.2)' } } }), ...(label === 'Experience' && xpGlow && { textShadow: xpGlow, ...(xpShimmerAnim && { animation: `${xpShimmerAnim} 3s ease-in-out infinite` }) }) }}>{value}</Typography>,
            <Tooltip key={`${label}-inc`} open={lpKey === `${label}-inc`} title="+5" placement="top" slotProps={ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
              <IconButton onClick={guardClick(onInc)} onPointerDown={() => startLongPress(`${label}-inc`, onInc5)} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: ts === 2 ? 38 : 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}><Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700 }}>+</Typography></IconButton>
            </Tooltip>,
          ])}
        </Box>
      </Box>

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
