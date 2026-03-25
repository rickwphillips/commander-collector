'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import TollIcon from '@mui/icons-material/Toll';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ReplayIcon from '@mui/icons-material/Replay';
import SettingsIcon from '@mui/icons-material/Settings';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import type { PlayerState } from '../types';

function D20Icon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* Outer hexagon (pointy-top) */}
      <path d="M12 1 L21 6.5 L21 17.5 L12 23 L3 17.5 L3 6.5 Z" />
      {/* Triangle pointing up: top vertex → lower-right → lower-left */}
      <path d="M12 1 L21 17.5 L3 17.5 Z" />
      {/* Triangle pointing down: upper-left → upper-right → bottom vertex */}
      <path d="M3 6.5 L21 6.5 L12 23 Z" />
    </svg>
  );
}

type RollPhase = 'idle' | 'rolling' | 'done';

interface CenterZoneProps {
  turnNumber: number;
  currentPlayerIdx: number;
  players: PlayerState[];
  rollPhase: RollPhase;
  rolledPlayerName?: string;
  firstPlayerSet: boolean;
  onNextTurn: () => void;
  onPrevTurn: () => void;
  onEndGame: () => void;
  onRollForFirst: () => void;
  onAcceptFirstPlayer: () => void;
  onChooseFirstPlayer: (idx: number) => void;
  onRollAgain: () => void;
  onRestartGame: () => void;
  elapsedSeconds: number;
  turnTimerSeconds: number;
  onTimerChange: (seconds: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  textSizeMode: 0 | 1 | 2;
  onCycleTextSizeMode: () => void;
  highlightMode: boolean;
  onToggleHighlightMode: () => void;
}

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function CenterZone({
  turnNumber,
  currentPlayerIdx,
  players,
  rollPhase,
  rolledPlayerName,
  firstPlayerSet,
  onNextTurn,
  onPrevTurn,
  onEndGame,
  onRollForFirst,
  onAcceptFirstPlayer,
  onChooseFirstPlayer,
  onRollAgain,
  onRestartGame,
  turnTimerSeconds,
  onTimerChange,
  elapsedSeconds,
  isFullscreen,
  onToggleFullscreen,
  notes,
  onNotesChange,
  textSizeMode,
  onCycleTextSizeMode,
  highlightMode,
  onToggleHighlightMode,
}: CenterZoneProps) {
  type RollEntry = { label: string; rolls: (number | string)[]; total: number | null; color: string };
  const [history, setHistory] = useState<RollEntry[]>([]);
  const [resultKey, setResultKey] = useState(0);
  const [diceCount, setDiceCount] = useState(1);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [diceOpen, setDiceOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [prevTurnTooltip, setPrevTurnTooltip] = useState(false);
  const [choosingFirst, setChoosingFirst] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const lastTimerRef = useRef(turnTimerSeconds > 0 ? turnTimerSeconds : 300);
  const lpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired = useRef(false);

  const addRoll = (label: string, sides: number | null) => {
    if (sides === null) {
      const rolls = Array.from({ length: diceCount }, () => Math.random() < 0.5 ? 'Heads' : 'Tails');
      setHistory((prev) => [...prev, { label: diceCount === 1 ? 'Coin Flip' : `${diceCount}× Coin`, rolls, total: null, color: 'primary.main' }]);
    } else {
      const rolls = Array.from({ length: diceCount }, () => rollDie(sides));
      const total = rolls.reduce((a, b) => (a as number) + (b as number), 0) as number;
      const color = sides === 20 && diceCount === 1 ? (rolls[0] === 20 ? '#DAA520' : rolls[0] === 1 ? 'error.main' : 'primary.main') : 'primary.main';
      setHistory((prev) => [...prev, { label: `d${sides}`, rolls, total: diceCount > 1 ? total : null, color }]);
    }
    setResultKey((k) => k + 1);
  };

  const lastEntry = history.length > 0 ? history[history.length - 1] : null;
  const lastRolledType: 'd6' | 'd20' | 'coin' | null = lastEntry
    ? lastEntry.label === 'd6' ? 'd6'
      : lastEntry.label === 'd20' ? 'd20'
      : lastEntry.label.includes('Coin') ? 'coin'
      : null
    : null;
  // Value to show inside the highlighted button: total for multi-dice, roll for single, H/T for coin
  const lastRolledDisplay: string | null = lastEntry
    ? lastEntry.total !== null
      ? String(lastEntry.total)
      : lastEntry.rolls.length === 1
        ? lastEntry.label.includes('Coin')
          ? (lastEntry.rolls[0] === 'Heads' ? 'H' : 'T')
          : String(lastEntry.rolls[0])
        : null
    : null;
  const ts = textSizeMode;

  // dvh/dvw-based sizing so the center tile scales across phone, tablet, and desktop
  const btnMainSize = ts === 2 ? 'clamp(90px, min(16dvh, 14dvw), 175px)' : ts === 1 ? 'clamp(84px, min(15dvh, 13dvw), 160px)' : 'clamp(80px, min(14dvh, 12dvw), 150px)';
  const btnRollSize = ts === 2 ? 'clamp(68px, min(13dvh, 11dvw), 135px)' : ts === 1 ? 'clamp(62px, min(12dvh, 10dvw), 120px)' : 'clamp(58px, min(11dvh, 9dvw), 110px)';
  const btnChooseSize = ts === 2 ? 'clamp(52px, min(9dvh, 8dvw), 100px)' : ts === 1 ? 'clamp(48px, min(8.5dvh, 7.5dvw), 90px)' : 'clamp(44px, min(8dvh, 7dvw), 80px)';
  const fsTurnNum = ts === 2 ? 'clamp(22px, 5dvh, 46px)' : ts === 1 ? 'clamp(20px, 4.5dvh, 40px)' : 'clamp(18px, 4dvh, 36px)';
  const fsCmdName = ts === 2 ? 'clamp(12px, 2dvh, 20px)' : ts === 1 ? 'clamp(11px, 1.8dvh, 18px)' : 'clamp(10px, 1.7dvh, 16px)';
  const fsPlayerName = ts === 2 ? 'clamp(10px, 1.8dvh, 17px)' : ts === 1 ? 'clamp(9px, 1.6dvh, 15px)' : 'clamp(8px, 1.5dvh, 13px)';
  const fsBigName = ts === 2 ? 'clamp(14px, 3dvh, 28px)' : ts === 1 ? 'clamp(13px, 2.7dvh, 25px)' : 'clamp(12px, 2.5dvh, 22px)';
  const fsGoesFirst = ts === 2 ? 'clamp(12px, 2.5dvh, 22px)' : ts === 1 ? 'clamp(11px, 2.2dvh, 20px)' : 'clamp(10px, 2dvh, 18px)';
  const rotatedBoxMaxWidth = 'clamp(70px, 14dvh, 120px)';

  const remaining = turnTimerSeconds > 0 ? Math.max(0, turnTimerSeconds - elapsedSeconds) : null;
  const pulseSpeed = remaining !== null && remaining <= 30
    ? remaining <= 10 ? 0.5 : remaining <= 20 ? 1 : 1.8
    : null;

  const currentPlayer = players[currentPlayerIdx];

  return (
    <>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A1410' : '#FFF8F0',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          transition: 'none',
          '&:hover': { transform: 'none', boxShadow: 'none' },
        }}
      >
        {/* Main content */}
        <CardContent sx={{ flex: 1, p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>

          {/* Turn tracker */}
          {firstPlayerSet && (
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '80%', px: 1 }}>
              <Box sx={{ transform: 'rotate(90deg)', maxWidth: rotatedBoxMaxWidth, flexShrink: 0, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 900, fontSize: fsTurnNum, color: 'primary.main', lineHeight: 1 }}>
                  Turn {turnNumber}
                </Typography>
                <Typography sx={{ fontSize: fsCmdName, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                  {currentPlayer?.commander.name ?? '—'}
                </Typography>
                <Typography sx={{ fontSize: fsPlayerName, color: 'text.secondary', lineHeight: 1.3 }}>
                  {currentPlayer?.playerName ?? '—'}
                </Typography>
              </Box>

              <Tooltip open={prevTurnTooltip} title="Previous Turn" placement="top" disableFocusListener disableHoverListener disableTouchListener>
                <Button
                  variant="outlined"
                  onClick={() => { if (lpFired.current) { lpFired.current = false; return; } onNextTurn(); }}
                  onPointerDown={() => {
                    lpFired.current = false;
                    lpTimer.current = setTimeout(() => {
                      lpFired.current = true;
                      onPrevTurn();
                      setPrevTurnTooltip(true);
                      setTimeout(() => setPrevTurnTooltip(false), 700);
                    }, 500);
                  }}
                  onPointerUp={() => { if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; } }}
                  onPointerLeave={() => { if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; } }}
                  onPointerCancel={() => { if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; } }}
                  sx={{ width: btnMainSize, height: btnMainSize, fontSize: ts === 2 ? 'clamp(16px, 3.5dvh, 32px)' : ts === 1 ? 'clamp(14px, 3dvh, 28px)' : 'clamp(12px, 2.7dvh, 24px)', fontWeight: 700, borderRadius: 2, lineHeight: 1.2, flexShrink: 0, ...(pulseSpeed !== null && { animation: `nextTurnPulse ${pulseSpeed}s ease-in-out infinite`, '@keyframes nextTurnPulse': { '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,100,50,0)', borderColor: 'primary.main' }, '50%': { boxShadow: `0 0 12px 4px rgba(255,80,30,${remaining! <= 10 ? 0.9 : 0.5})`, borderColor: 'error.main' } } }) }}
                >
                  Next<br />Turn
                </Button>
              </Tooltip>

              <Box sx={{ transform: 'rotate(-90deg)', maxWidth: rotatedBoxMaxWidth, flexShrink: 0, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 900, fontSize: fsTurnNum, color: 'primary.main', lineHeight: 1 }}>
                  Turn {turnNumber}
                </Typography>
                <Typography sx={{ fontSize: fsCmdName, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                  {currentPlayer?.commander.name ?? '—'}
                </Typography>
                <Typography sx={{ fontSize: fsPlayerName, color: 'text.secondary', lineHeight: 1.3 }}>
                  {currentPlayer?.playerName ?? '—'}
                </Typography>
              </Box>
            </Stack>
          )}

          {/* Roll for first player */}
          {!firstPlayerSet && <Box sx={{ textAlign: 'center', width: '100%' }}>
            {(rollPhase === 'rolling') && rolledPlayerName && (
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#DAA520', display: 'block', mb: 0.75, fontSize: fsPlayerName }}>
                <Box key={rolledPlayerName} component="span" sx={{ display: 'inline-block', fontSize: fsBigName, fontWeight: 900, fontStyle: 'italic', letterSpacing: 0.5, animation: 'nameFlash 0.18s cubic-bezier(0.34,1.56,0.64,1)', '@keyframes nameFlash': { '0%': { opacity: 0, transform: 'scale(0.7) translateY(-6px)' }, '100%': { opacity: 1, transform: 'scale(1) translateY(0)' } } }}>
                  {rolledPlayerName}
                </Box>
                <Box component="span" sx={{ color: 'text.primary', fontStyle: 'normal', fontWeight: 300, fontSize: fsGoesFirst }}>{' goes first!'}</Box>
              </Typography>
            )}
            {(rollPhase === 'idle' || rollPhase === 'rolling') && !choosingFirst && (
              <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="flex-end">
                <Button
                  variant="contained"
                  onClick={onRollForFirst}
                  disabled={rollPhase === 'rolling'}
                  sx={{ width: btnRollSize, height: btnRollSize, flexDirection: 'column', gap: 0.75, fontSize: fsPlayerName, fontWeight: 700, borderRadius: 2, flexShrink: 0 }}
                >
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                    <path d="M12 2L2 19h20L12 2zm0 4l7 13H5l7-13zm-1 5v4h2v-4h-2zm0 5v2h2v-2h-2z" />
                  </svg>
                  {rollPhase === 'rolling' ? 'Rolling…' : 'Roll'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setChoosingFirst(true)}
                  disabled={rollPhase === 'rolling'}
                  sx={{ width: btnChooseSize, height: btnChooseSize, flexDirection: 'column', fontSize: fsCmdName, fontWeight: 600, borderRadius: 2, flexShrink: 0 }}
                >
                  Choose
                </Button>
              </Stack>
            )}
            {(rollPhase === 'idle' || rollPhase === 'rolling') && choosingFirst && (
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>
                  Who goes first?
                </Typography>
                <Stack spacing={0.5}>
                  {players.map((p, idx) => (
                    <Button key={idx} variant="outlined" onClick={() => { onChooseFirstPlayer(idx); setChoosingFirst(false); }} sx={{ fontSize: fsCmdName, py: 0.75 }}>
                      {p.playerName}
                    </Button>
                  ))}
                </Stack>
                <Button size="small" onClick={() => setChoosingFirst(false)} sx={{ mt: 1, fontSize: 10, color: 'text.disabled' }}>
                  Cancel
                </Button>
              </Box>
            )}
            {rollPhase === 'done' && (
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#DAA520', display: 'block', mb: 0.75, fontSize: fsPlayerName }}>
                  <Box component="span" sx={{
                    display: 'inline-block',
                    fontSize: fsBigName, fontWeight: 900, fontStyle: 'italic', letterSpacing: 0.5,
                    animation: 'nameSizzle 0.5s cubic-bezier(0.34,1.56,0.64,1), nameGlow 2s ease-in-out 0.5s infinite alternate',
                    '@keyframes nameSizzle': {
                      '0%':   { opacity: 0, transform: 'scale(1.5)', textShadow: '0 0 32px rgba(255,215,0,1)' },
                      '70%':  { transform: 'scale(0.95)',             textShadow: '0 0 8px rgba(255,215,0,0.6)' },
                      '100%': { opacity: 1, transform: 'scale(1)',    textShadow: '0 0 14px rgba(255,215,0,0.8)' },
                    },
                    '@keyframes nameGlow': {
                      '0%':   { textShadow: '0 0 6px rgba(255,215,0,0.5)' },
                      '100%': { textShadow: '0 0 18px rgba(255,215,0,1), 0 0 32px rgba(255,165,0,0.6)' },
                    },
                  }}>
                    {rolledPlayerName}
                  </Box>
                  <Box component="span" sx={{ color: 'text.primary', fontStyle: 'normal', fontWeight: 300, fontSize: fsGoesFirst }}>{' goes first!'}</Box>
                </Typography>
                <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="flex-end">
                  <Button variant="contained" onClick={onAcceptFirstPlayer} sx={{ width: btnRollSize, height: btnRollSize, fontSize: fsPlayerName, fontWeight: 700, borderRadius: 2 }}>Accept</Button>
                  <Button variant="outlined" onClick={onRollAgain} sx={{ width: btnChooseSize, height: btnChooseSize, fontSize: fsCmdName, fontWeight: 600, borderRadius: 2 }}>Roll Again</Button>
                </Stack>
              </Box>
            )}
          </Box>}

          {/* Fullscreen toggle */}
          <IconButton
            onClick={onToggleFullscreen}
            sx={{ position: 'absolute', top: 6, left: 6, color: 'text.secondary' }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <FullscreenExitIcon sx={{ fontSize: 20 }} /> : <FullscreenIcon sx={{ fontSize: 20 }} />}
          </IconButton>

          {/* Text size cycle toggle (0=normal, 1=large, 2=xl) */}
          <Tooltip title={textSizeMode === 0 ? 'Normal Text' : textSizeMode === 1 ? 'Large Text' : 'Extra-Large Text'} placement="top">
            <IconButton
              onClick={onCycleTextSizeMode}
              sx={{
                position: 'absolute', bottom: 6, left: 6,
                color: textSizeMode === 2 ? 'warning.main' : textSizeMode === 1 ? 'primary.main' : 'text.secondary',
              }}
            >
              <TextFieldsIcon sx={{ fontSize: textSizeMode === 2 ? 24 : textSizeMode === 1 ? 22 : 20 }} />
            </IconButton>
          </Tooltip>

          {/* Settings toggle */}
          <IconButton
            onClick={() => setSettingsOpen(true)}
            sx={{ position: 'absolute', top: 6, right: 6, color: 'text.secondary' }}
            title="Settings"
          >
            <SettingsIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Dice & More toggle */}
          <IconButton
            onClick={() => setDiceOpen(true)}
            sx={{ position: 'absolute', bottom: 6, right: 6, color: 'text.secondary' }}
            title="Dice & More"
          >
            <CasinoIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </CardContent>

        {/* Settings overlay */}
        {settingsOpen && (
          <Box sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1A1410EE' : '#FFF8F0EE',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            p: 1,
          }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Settings
              </Typography>
              <IconButton size="small" onClick={() => setSettingsOpen(false)} sx={{ p: 0.25 }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={turnTimerSeconds > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onTimerChange(lastTimerRef.current);
                      } else {
                        lastTimerRef.current = turnTimerSeconds;
                        onTimerChange(0);
                      }
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: 12 }}>Timer</Typography>}
                sx={{ mx: 0 }}
              />
              <FormControlLabel
                control={<Switch size="small" checked={highlightMode} onChange={onToggleHighlightMode} />}
                label={<Typography sx={{ fontSize: 12 }}>Highlight</Typography>}
                sx={{ mx: 0 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => { setSettingsOpen(false); setNotesDraft(notes); setNotesOpen(true); }}
                startIcon={<TextFieldsIcon sx={{ fontSize: 14 }} />}
                sx={{ fontSize: 11, py: 0.5, color: notes.trim() ? 'primary.main' : undefined, borderColor: notes.trim() ? 'primary.main' : undefined }}
              >
                Notes
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => { setSettingsOpen(false); setConfirmRestart(true); }}
                startIcon={<ReplayIcon sx={{ fontSize: 14 }} />}
                fullWidth
                sx={{ fontSize: 11, py: 0.5 }}
              >
                Restart
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => { setSettingsOpen(false); setConfirmEnd(true); }}
                startIcon={<FlagIcon sx={{ fontSize: 14 }} />}
                fullWidth
                sx={{ fontSize: 11, py: 0.5 }}
              >
                End Game
              </Button>
            </Stack>
          </Box>
        )}

        {/* Dice & More overlay */}
        {diceOpen && (
          <Box sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1A1410EE' : '#FFF8F0EE',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            p: 1,
          }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Dice / Flips
              </Typography>
              <IconButton size="small" onClick={() => setDiceOpen(false)} sx={{ p: 0.25 }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>

            {/* Latest result */}
            <Box sx={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {lastEntry ? (
                <Box key={resultKey} sx={{
                  width: '100%', textAlign: 'center',
                  animation: 'diceResultPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  '@keyframes diceResultPop': {
                    '0%':   { opacity: 0, transform: 'scale(0.4) translateY(8px)' },
                    '100%': { opacity: 1, transform: 'scale(1)   translateY(0)'   },
                  },
                }}>
                  {lastEntry.rolls.length === 1 ? (
                    <Typography sx={{ fontWeight: 900, fontSize: 40, lineHeight: 1, color: lastEntry.color }}>
                      {lastEntry.rolls[0]}
                    </Typography>
                  ) : (
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={0.5}>
                      {lastEntry.rolls.map((r, i) => (
                        <Box key={i} sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontSize: 9, color: 'text.disabled' }}>{i + 1}</Typography>
                          <Typography sx={{ fontWeight: 900, fontSize: 26, lineHeight: 1, color: lastEntry.color }}>{r}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              ) : (
                <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>—</Typography>
              )}
            </Box>

            {/* Buttons */}
            <Stack spacing={0.75} sx={{ width: '100%' }}>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" fullWidth onClick={() => addRoll('d6', 6)} startIcon={lastRolledType === 'd6' ? null : <CasinoIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: 11, fontWeight: lastRolledType === 'd6' ? 900 : 400, py: 0.5, ...(lastRolledType === 'd6' && { color: 'warning.main', borderColor: 'warning.main' }) }}>{lastRolledType === 'd6' && lastRolledDisplay ? `total ${lastRolledDisplay}` : 'd6'}</Button>
                <Button variant="outlined" fullWidth onClick={() => addRoll('d20', 20)} startIcon={lastRolledType === 'd20' ? null : <D20Icon size={14} />} sx={{ fontSize: 11, fontWeight: lastRolledType === 'd20' ? 900 : 400, py: 0.5, ...(lastRolledType === 'd20' && { color: 'warning.main', borderColor: 'warning.main' }) }}>{lastRolledType === 'd20' && lastRolledDisplay ? `total ${lastRolledDisplay}` : 'd20'}</Button>
                <Button variant="outlined" fullWidth onClick={() => addRoll('coin', null)} startIcon={lastRolledType === 'coin' ? null : <TollIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: 11, fontWeight: lastRolledType === 'coin' ? 900 : 400, py: 0.5, ...(lastRolledType === 'coin' && { color: 'warning.main', borderColor: 'warning.main' }) }}>{lastRolledType === 'coin' && lastRolledDisplay ? lastRolledDisplay : 'Flip'}</Button>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Button variant="outlined" onClick={() => setDiceCount((c) => Math.max(1, c - 1))} sx={{ minWidth: 32, px: 0, fontSize: 16, py: 0.5 }}>−</Button>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, minWidth: 20, textAlign: 'center' }}>{diceCount}</Typography>
                  <Button variant="outlined" onClick={() => setDiceCount((c) => Math.min(20, c + 1))} sx={{ minWidth: 32, px: 0, fontSize: 16, py: 0.5 }}>+</Button>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>dice</Typography>
                </Stack>
                {history.length > 0 && (
                  <Button variant="text" size="small" onClick={() => setHistory([])} sx={{ fontSize: 10, px: 0.5, color: 'text.disabled' }}>Clear</Button>
                )}
              </Stack>
            </Stack>
          </Box>
        )}
      </Card>

      <Dialog open={confirmRestart} onClose={() => setConfirmRestart(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Restart Game?</DialogTitle>
        <DialogContent>
          <Typography>This will clear the current game and return to setup.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRestart(false)}>Cancel</Button>
          <Button onClick={() => { setConfirmRestart(false); onRestartGame(); }} variant="contained">
            Restart
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmEnd} onClose={() => setConfirmEnd(false)} maxWidth="xs" fullWidth>
        <DialogTitle>End Game?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to end the current game?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmEnd(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setConfirmEnd(false);
              onEndGame();
            }}
            color="error"
            variant="contained"
          >
            End Game
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={notesOpen} onClose={() => setNotesOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Game Notes</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            minRows={5}
            maxRows={12}
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Add notes about this game..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { onNotesChange(notesDraft); setNotesOpen(false); }}>Save</Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
