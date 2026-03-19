'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import { Box, Stack, Typography, IconButton, Button, TextField, Tooltip, SvgIcon } from '@mui/material';
const CrownIcon = (props: React.ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M5 16l-3-10 5.5 4L12 2l4.5 8L22 6l-3 10H5zm0 2h14v2H5v-2z" />
  </SvgIcon>
);
import InitiativeIcon from '@mui/icons-material/Shield';
import CityIcon from '@mui/icons-material/AccountBalance';
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
  isHighlighted?: boolean;
  isCurrentPlayer?: boolean;
  elapsedSeconds?: number;
  turnTimerSeconds?: number;
  textSizeMode?: 0 | 1 | 2;
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
  isHighlighted = false,
  isCurrentPlayer = false,
  elapsedSeconds = 0,
  turnTimerSeconds = 300,
  textSizeMode = 0,
}: PlayerPanelProps) {
  const ts = textSizeMode;
  const [eliminateTurnInput, setEliminateTurnInput] = useState('');
  const [showEliminateConfirm, setShowEliminateConfirm] = useState(false);
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

  const [lpKey, setLpKey] = useState<string | null>(null);
  const lpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired = useRef(false);

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

  const timerProgress = Math.min(elapsedSeconds / Math.max(turnTimerSeconds, 1), 1);
  const isTimerExpired = isCurrentPlayer && elapsedSeconds >= turnTimerSeconds;

  function timerColor(): string {
    if (timerProgress <= 0.5) {
      const p = timerProgress * 2;
      return `rgb(${Math.round(102 + 153 * p)},${Math.round(187 - 20 * p)},${Math.round(106 - 68 * p)})`;
    } else {
      const p = (timerProgress - 0.5) * 2;
      return `rgb(${Math.round(255 - 26 * p)},${Math.round(167 - 110 * p)},${Math.round(38 + 15 * p)})`;
    }
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

  const energyPulseAnim = useMemo(() => player.energy > 5 ? keyframes`
    0%   { text-shadow: ${energyGlow}; }
    35%  { text-shadow: ${energyGlowPeak}; }
    65%  { text-shadow: ${energyGlowPeak}; }
    100% { text-shadow: ${energyGlow}; }
  ` : null, [player.energy]);

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
          ? '3px solid #e53935'
          : isHighlighted
          ? '3px solid #DAA520'
          : currentPlayerBorder
          ?? (isWarning ? '2px solid #e53935' : undefined)
          ?? ((theme: import('@mui/material').Theme) => `1px solid ${theme.palette.divider}`),
        boxShadow: showEliminateConfirm
          ? '0 0 24px 6px rgba(229,57,53,0.6)'
          : isHighlighted
          ? '0 0 24px 6px rgba(218,165,32,0.6)'
          : currentPlayerShadow ?? 'none',
        ...(isTimerExpired && {
          animation: 'timerBlink 0.5s step-end infinite',
          '@keyframes timerBlink': {
            '0%, 100%': { borderColor: '#e53935', boxShadow: '0 0 24px 6px rgba(229,57,53,0.6)' },
            '50%': { borderColor: 'transparent', boxShadow: 'none' },
          },
        }),
        transition: 'box-shadow 0.1s ease, border 0.1s ease, filter 1s ease',
        '& .MuiTypography-root': { textShadow: energyGlow, transition: 'font-size 0.2s ease, margin 0.2s ease, text-shadow 0.4s ease' },
        filter: poisonProgress > 0 ? `saturate(${1 + poisonProgress * 0.5})` : 'none',
        borderRadius: 2,
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

      {/* Eliminate confirm overlay */}
      {showEliminateConfirm && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none', bgcolor: 'rgba(180,0,0,0.12)' }}>
          <Typography sx={{ fontWeight: 900, color: 'error.main', fontSize: 22, letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.5)', transform: 'rotate(-10deg)' }}>
            ELIMINATE?
          </Typography>
        </Box>
      )}

      {/* Eliminated overlay */}
      {player.isEliminated && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11, pointerEvents: 'none' }}>
          <Typography sx={{ fontWeight: 900, letterSpacing: 4, fontSize: 48, transform: 'rotate(-15deg)', color: isPoisoned ? undefined : 'error.main' }} style={{ color: isPoisoned ? '#00c853' : undefined, WebkitTextFillColor: isPoisoned ? '#00c853' : undefined, WebkitTextStroke: isPoisoned ? '2px black' : undefined }}>
            {isPoisoned ? 'POISONED' : 'ELIMINATED'}
          </Typography>
        </Box>
      )}

      {/* ── Header ── */}
      <Box sx={{ px: 1, py: 0.5, bgcolor: 'rgba(0,0,0,0.08)', flexShrink: 0, filter: 'none', position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Left: commander art + tax */}
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexShrink: 0, zIndex: 1 }}>
          {player.commander.artCropUrl && (
            <Box component="img" src={player.commander.artCropUrl} alt={player.commander.name}
              sx={{ height: 32, width: 'auto', borderRadius: 0.5, flexShrink: 0 }} />
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
            <Box sx={{ position: 'relative', flexShrink: 0, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Diamond shape */}
              <Box sx={{
                position: 'absolute',
                width: 26, height: 26,
                transform: 'rotate(45deg)',
                background: 'linear-gradient(135deg, #FFD700, #8B6914)',
                border: '1.5px solid rgba(255,215,0,0.85)',
                boxShadow: '0 2px 8px rgba(218,165,32,0.55)',
                ...(xpFlashing && { animation: `${xpFlashAnim} 0.7s ease-out` }),
              }} />
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
        </Stack>

        {/* Center: absolutely positioned so it's always centered relative to the full header */}
        <Box sx={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', px: 6 }}>
          <Typography noWrap sx={{ fontWeight: 700, fontSize: 12, lineHeight: 1.2 }}>
            {player.playerName}
          </Typography>
          <Typography noWrap sx={{ fontSize: 9, lineHeight: 1.2, color: 'text.secondary' }}>
            {player.deckName} · {player.commander.name}{player.partner ? ` / ${player.partner.name}` : ''}
          </Typography>
        </Box>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 'auto', zIndex: 1 }}>
            <Tooltip title="Monarch" placement="bottom" arrow>
              <IconButton size="small" onClick={() => onToggleMonarch(playerIdx)} sx={{ p: 0.5, color: player.isMonarch ? '#DAA520' : 'text.disabled' }}>
                <CrownIcon sx={{
                  fontSize: player.isMonarch ? 26 : 18,
                  transition: 'font-size 0.25s ease',
                  ...(player.isMonarch && {
                    animation: 'crownShimmer 2s ease-in-out infinite',
                    '@keyframes crownShimmer': {
                      '0%, 100%': { filter: 'drop-shadow(0 0 2px #DAA520) brightness(1)', },
                      '50%': { filter: 'drop-shadow(0 0 7px #FFD700) brightness(1.5)', },
                    },
                  }),
                }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Initiative" placement="bottom" arrow>
              <IconButton size="small" onClick={() => onToggleInitiative(playerIdx)} sx={{ p: 0.5, color: player.hasInitiative ? '#4FC3F7' : 'text.disabled' }}>
                <InitiativeIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="City's Blessing" placement="bottom" arrow>
              <IconButton size="small" onClick={() => onToggleCitysBlessing(playerIdx)} sx={{ p: 0.5, color: player.hasCitysBlessing ? '#81C784' : 'text.disabled' }}>
                <CityIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            {player.isEliminated ? (
              <Tooltip title="Undo Eliminate" placement="bottom" arrow>
                <IconButton size="small" onClick={() => onUndoEliminate(playerIdx)} sx={{ p: 0.5, color: 'error.main' }}>
                  <ElimIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            ) : showEliminateConfirm ? (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 0.5 }}>
                <TextField size="small" label="Eliminated Turn" type="number" value={eliminateTurnInput}
                  onChange={(e) => setEliminateTurnInput(e.target.value)}
                  inputProps={{ min: 1 }} sx={{ width: 80 }} />
                <Button size="small" variant="contained" color="error"
                  onClick={() => { onEliminate(playerIdx); setShowEliminateConfirm(false); setEliminateTurnInput(''); }}
                  sx={{ fontSize: 9, py: 0, px: 0.5 }}>✓</Button>
                <Button size="small" variant="outlined"
                  onClick={() => setShowEliminateConfirm(false)}
                  sx={{ fontSize: 9, py: 0, px: 0.5 }}>✕</Button>
              </Stack>
            ) : (
              <Tooltip title="Eliminate" placement="bottom" arrow>
                <IconButton size="small" onClick={() => setShowEliminateConfirm(true)} sx={{ p: 0.5, color: 'text.disabled' }}>
                  <ElimIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
      </Box>

      {/* ── Main: Commander Damage (left) + Life (right) ── */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, borderTop: (theme) => `1px solid ${theme.palette.divider}`, filter: 'none' }}>

        {/* Commander Damage box */}
        <Box sx={{
          width: '33%',
          flexShrink: 0,
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          px: ts === 2 ? 0.1 : ts === 1 ? 0.25 : 0.5,
          py: ts === 2 ? 0 : ts === 1 ? 0.1 : 0.25,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          transition: 'padding 0.2s ease',
        }}>
          <Typography sx={{ fontSize: ts === 2 ? 15 : ts === 1 ? 13 : 11, fontWeight: 600, color: 'text.secondary', mb: ts === 2 ? 0 : ts === 1 ? 0.1 : 0.25, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Commander Damage{isCmdDmgHigh && <Typography component="span" sx={{ fontSize: ts === 2 ? 15 : ts === 1 ? 13 : 11, color: 'error.main', ml: 0.5 }}>⚠</Typography>}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 32px 30px 32px', alignItems: 'start', rowGap: ts > 0 ? 0 : 0.1, transition: 'row-gap 0.2s ease' }}>
            {opponents.flatMap(({ player: source, idx: sourceIdx }) => {
              const dmg = commanderDamage[playerIdx]?.[sourceIdx] ?? [0, 0];
              const sourceEliminated = source.isEliminated;
              const rows = [
                <Box key={`${sourceIdx}-name`} sx={{ overflow: 'hidden', pt: 0 }}>
                  <Typography sx={{ fontSize: ts === 2 ? 19 : ts === 1 ? 16 : 14, color: sourceEliminated ? 'text.disabled' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: sourceEliminated ? 'line-through' : 'none' }}>
                    {source.commander.name}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mt: ts > 0 ? 0 : 0.15, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10, fontWeight: 800, color: source.life <= 0 ? 'error.main' : 'primary.main', lineHeight: 1 }}>♥{source.life}</Typography>
                    {source.poison > 0 && <Typography sx={{ fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10, fontWeight: 800, color: source.poison >= 10 ? '#e53935' : '#66BB6A', lineHeight: 1 }}>☠{source.poison}</Typography>}
                    {source.energy > 0 && <Typography sx={{ fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10, fontWeight: 800, color: '#4FC8FF', lineHeight: 1 }}>⚡{source.energy}</Typography>}
                    {source.experience > 0 && <Stack direction="row" alignItems="center" spacing={0.25}><Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: ts === 2 ? 14 : ts === 1 ? 12 : 10, height: ts === 2 ? 14 : ts === 1 ? 12 : 10, objectFit: 'contain', mixBlendMode: 'multiply', transition: 'width 0.2s ease, height 0.2s ease' }} /><Typography sx={{ fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10, fontWeight: 800, color: '#DAA520', lineHeight: 1 }}>{source.experience}</Typography></Stack>}
                    {source.isMonarch && <CrownIcon sx={{
                      fontSize: ts === 2 ? 14 : ts === 1 ? 12 : 10,
                      color: '#DAA520',
                      animation: 'crownShimmer 2s ease-in-out infinite',
                      '@keyframes crownShimmer': {
                        '0%, 100%': { filter: 'drop-shadow(0 0 2px #DAA520) brightness(1)' },
                        '50%': { filter: 'drop-shadow(0 0 7px #FFD700) brightness(1.5)' },
                      },
                    }} />}
                  </Stack>
                </Box>,
                <Tooltip key={`${sourceIdx}-dec`} open={lpKey === `${sourceIdx}-dec`} title="-5" placement="top" disableFocusListener disableHoverListener disableTouchListener>
                  <span style={{ alignSelf: 'start' }}><IconButton disabled={sourceEliminated} onClick={guardClick(() => onCommanderDamageChange(playerIdx, sourceIdx, false, -1))} onPointerDown={() => startLongPress(`${sourceIdx}-dec`, () => onCommanderDamageChange(playerIdx, sourceIdx, false, -5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}>
                    <Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700, lineHeight: 1 }}>−</Typography>
                  </IconButton></span>
                </Tooltip>,
                <Typography key={`${sourceIdx}-val`} sx={{ fontSize: ts === 2 ? 26 : ts === 1 ? 22 : 20, fontWeight: 700, textAlign: 'center', alignSelf: 'start', pt: 0, color: dmg[0] >= 21 ? 'error.main' : sourceEliminated ? 'text.disabled' : 'text.primary' }}>
                  {dmg[0]}
                </Typography>,
                <Tooltip key={`${sourceIdx}-inc`} open={lpKey === `${sourceIdx}-inc`} title="+5" placement="top" disableFocusListener disableHoverListener disableTouchListener>
                  <span style={{ alignSelf: 'start' }}><IconButton disabled={sourceEliminated} onClick={guardClick(() => onCommanderDamageChange(playerIdx, sourceIdx, false, 1))} onPointerDown={() => startLongPress(`${sourceIdx}-inc`, () => onCommanderDamageChange(playerIdx, sourceIdx, false, 5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}>
                    <Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700, lineHeight: 1 }}>+</Typography>
                  </IconButton></span>
                </Tooltip>,
              ];
              if (source.partner) {
                rows.push(
                  <Typography key={`${sourceIdx}-pname`} sx={{ fontSize: ts === 2 ? 19 : ts === 1 ? 16 : 14, color: sourceEliminated ? 'text.disabled' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: sourceEliminated ? 'line-through' : 'none' }}>
                    {source.partner.name}
                  </Typography>,
                  <Tooltip key={`${sourceIdx}-pdec`} open={lpKey === `${sourceIdx}-pdec`} title="-5" placement="top" disableFocusListener disableHoverListener disableTouchListener>
                    <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => onCommanderDamageChange(playerIdx, sourceIdx, true, -1))} onPointerDown={() => startLongPress(`${sourceIdx}-pdec`, () => onCommanderDamageChange(playerIdx, sourceIdx, true, -5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}>
                      <Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700, lineHeight: 1 }}>−</Typography>
                    </IconButton></span>
                  </Tooltip>,
                  <Typography key={`${sourceIdx}-pval`} sx={{ fontSize: ts === 2 ? 26 : ts === 1 ? 22 : 20, fontWeight: 700, textAlign: 'center', color: dmg[1] >= 21 ? 'error.main' : sourceEliminated ? 'text.disabled' : 'text.primary' }}>
                    {dmg[1]}
                  </Typography>,
                  <Tooltip key={`${sourceIdx}-pinc`} open={lpKey === `${sourceIdx}-pinc`} title="+5" placement="top" disableFocusListener disableHoverListener disableTouchListener>
                    <span><IconButton disabled={sourceEliminated} onClick={guardClick(() => onCommanderDamageChange(playerIdx, sourceIdx, true, 1))} onPointerDown={() => startLongPress(`${sourceIdx}-pinc`, () => onCommanderDamageChange(playerIdx, sourceIdx, true, 5))} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}>
                      <Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700, lineHeight: 1 }}>+</Typography>
                    </IconButton></span>
                  </Tooltip>,
                );
              }
              return rows;
            })}
          </Box>
        </Box>

        {/* Life total + controls */}
        <Box sx={{ width: '33%', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 0.5 }}>
          <Typography sx={{ fontWeight: 900, fontSize: ts === 2 ? 128 : ts === 1 ? 96 : 80, lineHeight: 1, color: isLifeLow ? 'error.main' : 'primary.main', transition: 'font-size 0.2s ease', ...(energyPulseAnim && { animation: `${energyPulseAnim} ${energyPulseDuration.toFixed(2)}s ease-in-out infinite` }) }}>
            {player.life}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={ts === 2 ? 3 : ts === 1 ? 1.5 : 0} sx={{ mt: ts === 2 ? -1.5 : ts === 1 ? -0.5 : 0.5, transition: 'gap 0.2s ease, margin-top 0.2s ease' }}>
            <Tooltip open={lpKey === 'life-dec'} title="-5" placement="top" disableFocusListener disableHoverListener disableTouchListener>
              <IconButton
                onClick={guardClick(() => onLifeChange(playerIdx, -1))}
                onPointerDown={() => startLongPress('life-dec', () => onLifeChange(playerIdx, -5))}
                onPointerUp={cancelLongPress}
                onPointerLeave={cancelLongPress}
                onPointerCancel={cancelLongPress}
                sx={{ p: ts === 2 ? 0 : ts === 1 ? 0.25 : 0.5, minWidth: 52, minHeight: 52, transition: 'padding 0.2s ease' }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: ts === 2 ? 60 : ts === 1 ? 48 : 36 }}>−</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip open={lpKey === 'life-inc'} title="+5" placement="top" disableFocusListener disableHoverListener disableTouchListener>
              <IconButton
                onClick={guardClick(() => onLifeChange(playerIdx, 1))}
                onPointerDown={() => startLongPress('life-inc', () => onLifeChange(playerIdx, 5))}
                onPointerUp={cancelLongPress}
                onPointerLeave={cancelLongPress}
                onPointerCancel={cancelLongPress}
                sx={{ p: ts === 2 ? 0 : ts === 1 ? 0.25 : 0.5, minWidth: 52, minHeight: 52, transition: 'padding 0.2s ease' }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: ts === 2 ? 60 : ts === 1 ? 48 : 36 }}>+</Typography>
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Counters — right column */}
        <Box sx={{
          flex: 1,
          minWidth: 0,
          borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
          px: ts === 2 ? 0.1 : ts === 1 ? 0.25 : 0.5,
          py: ts === 2 ? 0 : ts === 1 ? 0.1 : 0.25,
          display: 'grid',
          gridTemplateColumns: '1fr 32px 30px 32px',
          alignContent: 'center',
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
            <Tooltip key={`${label}-dec`} open={lpKey === `${label}-dec`} title="-5" placement="top" disableFocusListener disableHoverListener disableTouchListener>
              <IconButton onClick={guardClick(onDec)} onPointerDown={() => startLongPress(`${label}-dec`, onDec5)} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}><Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700 }}>−</Typography></IconButton>
            </Tooltip>,
            <Typography key={`${label}-val`} sx={{ fontSize: ts === 2 ? 26 : ts === 1 ? 22 : 20, fontWeight: 700, textAlign: 'center', color, filter: poisonProgress > 0 ? `blur(${Math.pow(poisonProgress, 2.5) * 1.5}px)` : 'none', ...(label === 'Poison' && value === 9 && { animation: 'poisonPulse 2.5s ease-in-out infinite', '@keyframes poisonPulse': { '0%, 100%': { opacity: 1, transform: 'scale(1)', textShadow: '0 0 8px rgba(0,200,60,0.9), 0 0 20px rgba(0,200,60,0.5)' }, '50%': { opacity: 0.3, transform: 'scale(0.85)', textShadow: '0 0 2px rgba(0,200,60,0.2)' } } }), ...(label === 'Experience' && xpGlow && { textShadow: xpGlow, ...(xpShimmerAnim && { animation: `${xpShimmerAnim} 3s ease-in-out infinite` }) }) }}>{value}</Typography>,
            <Tooltip key={`${label}-inc`} open={lpKey === `${label}-inc`} title="+5" placement="top" disableFocusListener disableHoverListener disableTouchListener>
              <IconButton onClick={guardClick(onInc)} onPointerDown={() => startLongPress(`${label}-inc`, onInc5)} onPointerUp={cancelLongPress} onPointerLeave={cancelLongPress} onPointerCancel={cancelLongPress} sx={{ p: 0, minWidth: 32, minHeight: ts === 2 ? 24 : ts === 1 ? 28 : 32, transition: 'min-height 0.2s ease' }}><Typography sx={{ fontSize: ts === 2 ? 28 : ts === 1 ? 24 : 22, fontWeight: 700 }}>+</Typography></IconButton>
            </Tooltip>,
          ])}
        </Box>
      </Box>

    </Box>
  );
}
