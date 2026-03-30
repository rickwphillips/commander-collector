'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  Checkbox,
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
import ChatIcon from '@mui/icons-material/Chat';
import MinimizeIcon from '@mui/icons-material/Minimize';
import Badge from '@mui/material/Badge';
import type { PlayerState, CommanderDamageMap } from '../types';

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
  highlightMode: boolean;
  onToggleHighlightMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  commanderDamage: CommanderDamageMap;
  settingsLoaded?: boolean;
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
  highlightMode,
  onToggleHighlightMode,
  soundEnabled,
  onToggleSound,
  commanderDamage,
  settingsLoaded = true,
}: CenterZoneProps) {
  type RollEntry = { label: string; rolls: (number | string)[]; total: number | null; color: string };
  const [history, setHistory] = useState<RollEntry[]>([]);
  const [resultKey, setResultKey] = useState(0);
  const [diceCount, setDiceCount] = useState(1);
  type RollingEntry = { label: string; color: string; finalRolls: (number|string)[]; revealed: boolean[]; total: number|null; sides: number|null; labels?: string[]; done?: boolean; activeSlots?: boolean[]; lockedSlots?: boolean[] };
  type RollOffState = { phase: 'idle' } | { phase: 'rolling'; activeIndices: number[]; originalIndices: number[] } | { phase: 'result'; winnerIdx: number; winnerName: string; originalIndices: number[] } | { phase: 'tie'; tiedIndices: number[]; originalIndices: number[]; noLonersRule?: boolean; lockedInTie?: number[] };
  const [rollingEntry, setRollingEntry] = useState<RollingEntry | null>(null);
  const animTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [diceOpen, setDiceOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [chatHasNewContent, setChatHasNewContent] = useState(false);
  const [chatSearching, setChatSearching] = useState(false);
  const [prevTurnTooltip, setPrevTurnTooltip] = useState(false);
  const [choosingFirst, setChoosingFirst] = useState(false);
  const [rollOffState, setRollOffState] = useState<RollOffState>({ phase: 'idle' });
  const [acesHigh, setAcesHigh] = useState(true);
  const [elevenBeatsAces, setElevenBeatsAces] = useState(true);
  const [adamsRule, setAdamsRule] = useState(false);
  const [noLoners, setNoLoners] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const lastTimerRef = useRef(turnTimerSeconds > 0 ? turnTimerSeconds : 300);
  const lpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired = useRef(false);
  const diceAudio = useRef<{ d20: HTMLAudioElement | null; d6: HTMLAudioElement | null }>({ d20: null, d6: null });
  const lastRoundScores = useRef<Record<string, number>>({});
  const chatUrlRef = useRef<string | null>(null);
  const chatIframeRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    const basePath = process.env.NODE_ENV === 'production' ? '/app/projects/commander' : '';
    const d20 = new Audio(`${basePath}/audio/d-20.mp3`);
    const d6  = new Audio(`${basePath}/audio/d-6.mp3`);
    d20.preload = 'auto';
    d6.preload  = 'auto';
    diceAudio.current = { d20, d6 };
  }, []);

  // Push real-time timer state to the iframe every second while chat is open
  useEffect(() => {
    if (!(chatOpen || chatMinimized) || !turnTimerSeconds) return;
    const iframeWin = chatIframeRef.current?.contentWindow;
    if (!iframeWin) return;
    iframeWin.postMessage({
      type: 'rules_timer_update',
      timerSeconds: turnTimerSeconds,
      elapsedSeconds,
      remaining: Math.max(0, turnTimerSeconds - elapsedSeconds),
      currentPlayer: firstPlayerSet ? (players[currentPlayerIdx]?.playerName ?? null) : null,
      turnNumber: firstPlayerSet ? turnNumber : null,
    }, '*');
  }, [elapsedSeconds, chatOpen, chatMinimized, turnTimerSeconds, firstPlayerSet, players, currentPlayerIdx, turnNumber]);

  // Listen for save-to-notes and new-content messages from the embedded Rules Guru iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'rules_save_notes' && typeof event.data.content === 'string') {
        const incoming = event.data.content as string;
        onNotesChange(notes ? `${notes}\n\n---\n\n${incoming}` : incoming);
      }
      if (event.data?.type === 'rules_new_content') {
        if (chatMinimized) setChatHasNewContent(true);
      }
      if (event.data?.type === 'rules_loading') {
        setChatSearching(!!event.data.value);
        if (!event.data.value && chatMinimized) setChatHasNewContent(true);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [notes, onNotesChange, chatMinimized]);

  const addRoll = (label: string, sides: number | null) => {
    animTimers.current.forEach(clearTimeout);
    animTimers.current = [];

    if (soundEnabled) {
      const audio = sides === 20 ? diceAudio.current.d20 : sides === 6 ? diceAudio.current.d6 : null;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }

    let finalRolls: (number | string)[];
    let total: number | null;
    let color: string;
    if (sides === null) {
      finalRolls = Array.from({ length: diceCount }, () => Math.random() < 0.5 ? 'Heads' : 'Tails');
      total = null;
      color = 'primary.main';
    } else {
      finalRolls = Array.from({ length: diceCount }, () => rollDie(sides));
      const sum = finalRolls.reduce((a, b) => (a as number) + (b as number), 0) as number;
      total = diceCount > 1 ? sum : null;
      color = sides === 20 && diceCount === 1 ? (finalRolls[0] === 20 ? '#DAA520' : finalRolls[0] === 1 ? 'error.main' : 'primary.main') : 'primary.main';
    }
    const histLabel = sides === null ? (diceCount === 1 ? 'Coin Flip' : `${diceCount}× Coin`) : `d${sides}`;

    setRollingEntry({ label: histLabel, color, finalRolls, revealed: finalRolls.map(() => false), total, sides });

    const revealDelay = 600;
    const stagger = 230;
    finalRolls.forEach((_, i) => {
      const t = setTimeout(() => {
        setRollingEntry(prev => prev ? { ...prev, revealed: prev.revealed.map((v, j) => j === i ? true : v) } : null);
      }, revealDelay + i * stagger);
      animTimers.current.push(t);
    });
    const doneT = setTimeout(() => {
      setHistory(prev => [...prev, { label: histLabel, rolls: finalRolls, total, color }]);
      setRollingEntry(null);
      setResultKey(k => k + 1);
    }, revealDelay + (finalRolls.length - 1) * stagger + 350);
    animTimers.current.push(doneT);
  };

  const getRollScore = (roll: number, allRolls: number[]): number => {
    if (acesHigh && elevenBeatsAces && allRolls.includes(1)) {
      if (roll === 11) return 21;   // 11 beats the ace
      if (roll === 1)  return 20.5; // ace still beats 20
      return roll;
    }
    if (acesHigh) return roll === 1 ? 21 : roll;
    return roll;
  };

  const startRollOff = (playerIndices: number[], originalIndices?: number[], lockedPlayers?: { playerIdx: number; roll: number }[]) => {
    const locked = lockedPlayers ?? [];
    const lockedIdxSet = new Set(locked.map(l => l.playerIdx));
    const origIndices = originalIndices ?? playerIndices;
    const isTiebreak = originalIndices !== undefined && (originalIndices.length > playerIndices.length || locked.length > 0);

    animTimers.current.forEach(clearTimeout);
    animTimers.current = [];
    if (soundEnabled && diceAudio.current.d20) {
      diceAudio.current.d20.currentTime = 0;
      diceAudio.current.d20.play().catch(() => {});
    }

    const displayIndices = isTiebreak ? origIndices : playerIndices;
    const activeSlots = displayIndices.map(idx => playerIndices.includes(idx));
    const lockedSlots = displayIndices.map(idx => lockedIdxSet.has(idx));
    const newRolls = playerIndices.map(() => rollDie(20));
    const lockedRollMap: Record<number, number> = {};
    locked.forEach(l => { lockedRollMap[l.playerIdx] = l.roll; });
    let activeRollIdx = 0;
    const allFinalRolls: number[] = displayIndices.map((idx, i) => {
      if (activeSlots[i]) return newRolls[activeRollIdx++];
      if (lockedSlots[i]) return lockedRollMap[idx];
      return lastRoundScores.current[players[idx].playerName] ?? 0;
    });
    const labels = displayIndices.map(idx => players[idx].playerName);
    const initialRevealed = displayIndices.map((_, i) => !activeSlots[i]);

    setRollOffState({ phase: 'rolling', activeIndices: playerIndices, originalIndices: origIndices });
    setDiceOpen(true);
    setRollingEntry({ label: 'Roll Off', color: 'primary.main', finalRolls: allFinalRolls, revealed: initialRevealed, total: null, sides: 20, labels, activeSlots, lockedSlots });

    const revealDelay = 600;
    const stagger = 230;
    let activeAnimIdx = 0;
    displayIndices.forEach((_, i) => {
      if (!activeSlots[i]) return;
      const delay = revealDelay + activeAnimIdx * stagger;
      const t = setTimeout(() => {
        setRollingEntry(prev => prev ? { ...prev, revealed: prev.revealed.map((v, j) => j === i ? true : v) } : null);
      }, delay);
      animTimers.current.push(t);
      activeAnimIdx++;
    });

    const lastActiveCount = activeSlots.filter(Boolean).length;
    const doneT = setTimeout(() => {
      setRollingEntry(prev => prev ? { ...prev, revealed: prev.revealed.map(() => true), done: true } : null);
      playerIndices.forEach((idx, i) => { lastRoundScores.current[players[idx].playerName] = newRolls[i]; });

      // Combine locked scores with new rolls for full comparison
      const allRolls = [...locked.map(l => l.roll), ...newRolls];
      const allPlayerIdx = [...locked.map(l => l.playerIdx), ...playerIndices];
      const allScores = allRolls.map(r => getRollScore(r, allRolls));
      const maxScore = Math.max(...allScores);

      if (noLoners) {
        // No Loners: dupes re-roll, unique highest stays locked, unique non-highest eliminated
        const rollCounts: Record<number, number> = {};
        allRolls.forEach(r => { rollCounts[r] = (rollCounts[r] ?? 0) + 1; });
        const anyDupes = allRolls.some(r => rollCounts[r] > 1);

        if (!anyDupes) {
          // No dupes → unique highest wins
          const winnerPos = allScores.indexOf(maxScore);
          const winnerIdx = allPlayerIdx[winnerPos];
          setRollOffState({ phase: 'result', winnerIdx, winnerName: players[winnerIdx].playerName, originalIndices: origIndices });
        } else {
          const uniqueHighestCount = allScores.filter(s => s === maxScore).length;
          const nextActive: number[] = [];
          const nextLocked: { playerIdx: number; roll: number }[] = [];
          allRolls.forEach((r, pos) => {
            const isDupe = rollCounts[r] > 1;
            const isUniqueHighest = allScores[pos] === maxScore && uniqueHighestCount === 1;
            if (isUniqueHighest) nextLocked.push({ playerIdx: allPlayerIdx[pos], roll: r });
            else if (isDupe) nextActive.push(allPlayerIdx[pos]);
            // unique non-highest → eliminated (not added to either)
          });
          const lockedInTie = nextLocked.map(l => l.playerIdx);
          const tiedIndices = [...nextActive, ...lockedInTie];
          setRollOffState({ phase: 'tie', tiedIndices, originalIndices: origIndices, noLonersRule: true, lockedInTie });
          const tieT = setTimeout(() => startRollOff(nextActive, origIndices, nextLocked), 2500);
          animTimers.current.push(tieT);
        }
      } else {
        const highestPositions = allScores.map((s, pos) => ({ s, pos })).filter(({ s }) => s === maxScore).map(({ pos }) => pos);
        if (highestPositions.length === 1) {
          const winnerIdx = allPlayerIdx[highestPositions[0]];
          setRollOffState({ phase: 'result', winnerIdx, winnerName: players[winnerIdx].playerName, originalIndices: origIndices });
        } else {
          const tiedIndices = highestPositions.map(pos => allPlayerIdx[pos]);
          setRollOffState({ phase: 'tie', tiedIndices, originalIndices: origIndices, noLonersRule: false });
          const tieT = setTimeout(() => startRollOff(tiedIndices, origIndices), 2500);
          animTimers.current.push(tieT);
        }
      }
    }, revealDelay + (lastActiveCount - 1) * stagger + 800);
    animTimers.current.push(doneT);
  };

  const cancelRollOff = () => {
    animTimers.current.forEach(clearTimeout);
    animTimers.current = [];
    setRollingEntry(null);
    setRollOffState({ phase: 'idle' });
  };

  const lastEntry = history.length > 0 ? history[history.length - 1] : null;
  const lastRolledType = useMemo<'d6' | 'd20' | 'coin' | null>(() => {
    if (!lastEntry) return null;
    if (lastEntry.label === 'd6') return 'd6';
    if (lastEntry.label === 'd20') return 'd20';
    if (lastEntry.label.includes('Coin')) return 'coin';
    return null;
  }, [lastEntry]);
  // Value to show inside the highlighted button: total for multi-dice, roll for single, H/T for coin
  const lastRolledDisplay = useMemo<string | null>(() => {
    if (!lastEntry) return null;
    if (lastEntry.total !== null) return String(lastEntry.total);
    if (lastEntry.rolls.length === 1)
      return lastEntry.label.includes('Coin')
        ? (lastEntry.rolls[0] === 'Heads' ? 'H' : 'T')
        : String(lastEntry.rolls[0]);
    return null;
  }, [lastEntry]);
  // dvh/dvw-based fluid sizing — scales smoothly across all layouts and DPIs
  const btnMainSize   = 'clamp(80px, min(15dvh, 13dvw), 175px)';
  const btnRollSize   = 'clamp(58px, min(12dvh, 10dvw), 135px)';
  const btnChooseSize = 'clamp(44px, min(8.5dvh, 7.5dvw), 100px)';
  const fsTurnNum     = 'clamp(18px, 4.5dvh, 46px)';
  const fsCmdName     = 'clamp(10px, 1.85dvh, 20px)';
  const fsPlayerName  = 'clamp(8px, 1.65dvh, 17px)';
  const fsBigName     = 'clamp(12px, 2.75dvh, 28px)';
  const fsGoesFirst   = 'clamp(10px, 2.25dvh, 22px)';
  const rotatedBoxMaxWidth = 'clamp(70px, 14dvh, 120px)';

  const remaining = turnTimerSeconds > 0 ? Math.max(0, turnTimerSeconds - elapsedSeconds) : null;
  const pulseSpeed = remaining !== null && remaining <= 30
    ? remaining <= 10 ? 0.5 : remaining <= 20 ? 1 : 1.8
    : null;

  const currentPlayer = players[currentPlayerIdx];

  const renderDiceGrid = (
    rolls: (number | string)[],
    labels: string[] | undefined,
    separator: React.ReactNode,
    getSlotContent: (r: number | string, i: number) => { nameColor: string; scoreNode: React.ReactNode }
  ) => (
    <Stack direction="row" flexWrap="wrap" justifyContent="center" alignItems="center" gap={0.5}>
      {rolls.map((r, i) => {
        const { nameColor, scoreNode } = getSlotContent(r, i);
        return (
          <React.Fragment key={i}>
            {i > 0 && separator}
            <Box sx={{ textAlign: 'center', height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography sx={{ fontSize: 'clamp(7px, 1.3dvh, 11px)', color: nameColor, lineHeight: 1, mb: 0.25 }}>{labels ? labels[i] : i + 1}</Typography>
              {scoreNode}
            </Box>
          </React.Fragment>
        );
      })}
    </Stack>
  );

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
                  sx={{ width: btnMainSize, height: btnMainSize, fontSize: 'clamp(12px, 3dvh, 32px)', fontWeight: 700, borderRadius: 2, lineHeight: 1.2, flexShrink: 0, ...(pulseSpeed !== null && { animation: `nextTurnPulse ${pulseSpeed}s ease-in-out infinite`, '@keyframes nextTurnPulse': { '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,100,50,0)', borderColor: 'primary.main' }, '50%': { boxShadow: `0 0 12px 4px rgba(255,80,30,${remaining! <= 10 ? 0.9 : 0.5})`, borderColor: 'error.main' } } }) }}
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
          {!firstPlayerSet && <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
            <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="flex-end">
              <Button
                variant="contained"
                onClick={() => {
                  const activeIndices = players.map((_, i) => i).filter(i => !players[i].isEliminated);
                  startRollOff(activeIndices);
                }}
                disabled={rollOffState.phase === 'rolling' || rollOffState.phase === 'tie'}
                sx={{ width: btnRollSize, height: btnRollSize, flexDirection: 'column', gap: 0, fontSize: fsPlayerName, fontWeight: 700, borderRadius: 2, flexShrink: 0 }}
              >
                <Box sx={{ display: 'inline-flex' }}><D20Icon size={40} /></Box>
                Roll
              </Button>
              <Button
                variant="outlined"
                onClick={() => setChoosingFirst(true)}
                disabled={rollOffState.phase === 'rolling' || rollOffState.phase === 'tie'}
                sx={{ width: btnChooseSize, height: btnChooseSize, flexDirection: 'column', fontSize: fsCmdName, fontWeight: 600, borderRadius: 2, flexShrink: 0 }}
              >
                Pick
              </Button>
            </Stack>
            <Stack direction="column" spacing={0} sx={{ alignItems: 'flex-start' }}>
              <FormControlLabel
                control={<Checkbox size="small" checked={acesHigh} onChange={e => { setAcesHigh(e.target.checked); setElevenBeatsAces(e.target.checked); if (e.target.checked) setAdamsRule(false); }} sx={{ p: 0.25 }} />}
                label={<Typography sx={{ fontSize: 10 }}>Aces High</Typography>}
                sx={{ mr: 0 }}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={elevenBeatsAces} disabled={!acesHigh} onChange={e => { setElevenBeatsAces(e.target.checked); if (e.target.checked) setAdamsRule(false); }} sx={{ p: 0.25 }} />}
                label={<Typography sx={{ fontSize: 10, color: acesHigh ? 'text.primary' : 'text.disabled' }}>Eleven Beats Aces</Typography>}
                sx={{ mr: 0 }}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={noLoners} onChange={e => { setNoLoners(e.target.checked); if (e.target.checked) setAdamsRule(false); }} sx={{ p: 0.25 }} />}
                label={<Typography sx={{ fontSize: 10 }}>No Loners</Typography>}
                sx={{ mr: 0 }}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={adamsRule} onChange={e => { setAdamsRule(e.target.checked); if (e.target.checked) { setAcesHigh(false); setElevenBeatsAces(false); setNoLoners(false); } }} sx={{ p: 0.25 }} />}
                label={<Typography sx={{ fontSize: 10 }}>{"Adam's House Rules"}</Typography>}
                sx={{ mr: 0 }}
              />
            </Stack>
          </Stack>}

          {/* Pick first player overlay */}
          {choosingFirst && (
            <Box sx={{
              position: 'absolute', inset: 0, zIndex: 10,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1A1410EE' : '#FFF8F0EE',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 1, p: 1,
            }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Who goes first?
                </Typography>
                <IconButton size="small" onClick={() => setChoosingFirst(false)} sx={{ p: 0.25 }}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Stack>
              <Box sx={{ flex: 1, width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0.5 }}>
                {players.map((p, idx) => (
                  <Button key={idx} variant="outlined" onClick={() => { onChooseFirstPlayer(idx); setChoosingFirst(false); }} sx={{ fontSize: fsCmdName, height: '100%', minHeight: 0 }}>
                    {p.playerName}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* Fullscreen toggle */}
          <IconButton
            onClick={onToggleFullscreen}
            sx={{ position: 'absolute', top: 6, left: 6, color: 'text.secondary' }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <FullscreenExitIcon sx={{ fontSize: 20 }} /> : <FullscreenIcon sx={{ fontSize: 20 }} />}
          </IconButton>

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

          {/* Rules Guru chat toggle */}
          <IconButton
            onClick={() => {
              if (chatMinimized) {
                setChatMinimized(false);
                setChatHasNewContent(false);
              } else {
                // Build and freeze the URL once when opening fresh
                const ctx = {
                  players: players.map((p, idx) => {
                    const entry: Record<string, unknown> = {
                      playerName: p.playerName,
                      deckName: p.deckName,
                      commander: p.commander?.name ?? null,
                      partner: p.partner?.name ?? null,
                      deckId: p.deckId,
                      life: p.life,
                      isEliminated: p.isEliminated,
                    };
                    if (p.poison > 0) entry.poison = p.poison;
                    if (p.energy > 0) entry.energy = p.energy;
                    if (p.experience > 0) entry.experience = p.experience;
                    if (p.commanderTax > 0) entry.commanderTax = p.commanderTax;
                    if (p.isMonarch) entry.isMonarch = true;
                    if (p.hasInitiative) entry.hasInitiative = true;
                    if (p.hasCitysBlessing) entry.hasCitysBlessing = true;
                    const dmgReceived = commanderDamage[idx];
                    if (dmgReceived) {
                      const dmg: Record<string, number[]> = {};
                      for (const [srcIdx, vals] of Object.entries(dmgReceived)) {
                        const [regular, partner] = vals as [number, number];
                        if (regular > 0 || partner > 0) {
                          dmg[players[Number(srcIdx)]?.playerName ?? srcIdx] = partner > 0 ? [regular, partner] : [regular];
                        }
                      }
                      if (Object.keys(dmg).length > 0) entry.commanderDamage = dmg;
                    }
                    return entry;
                  }),
                  turnNumber: firstPlayerSet ? turnNumber : null,
                  currentPlayer: firstPlayerSet ? (players[currentPlayerIdx]?.playerName ?? null) : null,
                  timerSeconds: turnTimerSeconds > 0 ? turnTimerSeconds : null,
                  elapsedSeconds: turnTimerSeconds > 0 ? elapsedSeconds : null,
                };
                const ctxParam = encodeURIComponent(btoa(JSON.stringify(ctx)));
                const base = typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
                  ? 'http://localhost:3003'
                  : '/app/projects/commander/rules';
                chatUrlRef.current = `${base}/chat?ctx=${ctxParam}`;
                setChatOpen(true);
              }
            }}
            sx={{
              position: 'absolute', bottom: 6, left: 6, color: 'text.secondary',
              ...(chatSearching && {
                animation: 'chatGlow 1.5s ease-in-out infinite',
                '@keyframes chatGlow': {
                  '0%, 100%': { opacity: 0.5, filter: 'drop-shadow(0 0 2px currentColor)' },
                  '50%':      { opacity: 1,   filter: 'drop-shadow(0 0 8px currentColor)' },
                },
              }),
              ...(!chatSearching && chatMinimized && {
                animation: 'chatPulse 1.5s ease-in-out infinite',
                '@keyframes chatPulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%':      { opacity: 0.5 },
                },
              }),
            }}
            title={chatMinimized ? 'Restore Rules Guru' : 'Ask Rules Guru'}
          >
            <Badge
              variant="dot"
              color="error"
              invisible={!chatHasNewContent}
            >
              <ChatIcon sx={{ fontSize: 24 }} />
            </Badge>
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

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '85%' }}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    disabled={!settingsLoaded}
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
                control={<Switch size="small" disabled={!settingsLoaded} checked={highlightMode} onChange={onToggleHighlightMode} />}
                label={<Typography sx={{ fontSize: 12 }}>Highlight</Typography>}
                sx={{ mx: 0 }}
              />
              <FormControlLabel
                control={<Switch size="small" disabled={!settingsLoaded} checked={soundEnabled} onChange={onToggleSound} />}
                label={<Typography sx={{ fontSize: 12 }}>Sound</Typography>}
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

        {/* Rules Guru chat Dialog */}
        <Dialog
          open={chatOpen && !chatMinimized}
          keepMounted
          onClose={() => { setChatOpen(false); setChatMinimized(false); setChatHasNewContent(false); setChatSearching(false); chatUrlRef.current = null; }}
          fullWidth
          maxWidth="md"
          PaperProps={{ sx: { height: '85vh', display: 'flex', flexDirection: 'column' } }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, fontWeight: 600, fontSize: '1rem' }}>
            Rules Guru — Game Context
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton size="small" onClick={() => { setChatMinimized(true); setChatHasNewContent(false); }} title="Minimize">
                <MinimizeIcon />
              </IconButton>
              <IconButton size="small" onClick={() => { setChatOpen(false); setChatMinimized(false); setChatHasNewContent(false); setChatSearching(false); chatUrlRef.current = null; }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0, flex: 1, overflow: 'hidden' }}>
            {(chatOpen || chatMinimized) && chatUrlRef.current && (
              <iframe
                ref={chatIframeRef}
                src={chatUrlRef.current}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Rules Guru"
              />
            )}
          </DialogContent>
        </Dialog>


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
                {rollOffState.phase !== 'idle' ? 'Roll-Off' : 'Dice / Flips'}
              </Typography>
              <IconButton size="small" onClick={() => { if (rollOffState.phase !== 'idle') cancelRollOff(); setDiceOpen(false); }} sx={{ p: 0.25 }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>

            {/* Latest result */}
            <Box sx={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {rollingEntry && !rollingEntry.done ? (() => {
                const isCoin = rollingEntry.sides === null;
                const isD6 = rollingEntry.sides === 6;
                const spinSx = {
                  display: 'inline-flex',
                  animation: isCoin ? 'coinFlip 0.18s linear infinite' : 'dieRoll 0.25s linear infinite',
                  '@keyframes dieRoll': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
                  '@keyframes coinFlip': { '0%': { transform: 'rotateY(0deg)' }, '100%': { transform: 'rotateY(360deg)' } },
                  perspective: '120px',
                };
                const popSx = {
                  animation: 'rollPop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  '@keyframes rollPop': {
                    '0%': { opacity: 0, transform: 'scale(0.3)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                  },
                };
                const RollingIcon = ({ large }: { large?: boolean }) => isCoin
                  ? <TollIcon sx={{ fontSize: large ? 52 : 32, color: 'text.disabled' }} />
                  : isD6
                  ? <CasinoIcon sx={{ fontSize: large ? 52 : 32, color: 'text.disabled' }} />
                  : <Box sx={{ display: 'inline-flex', opacity: 0.5 }}><D20Icon size={large ? 52 : 32} /></Box>;
                if (rollingEntry.finalRolls.length === 1) {
                  return rollingEntry.revealed[0] ? (
                    <Typography key="r0" sx={{ fontWeight: 900, fontSize: 52, lineHeight: 1, color: rollingEntry.color, ...popSx }}>
                      {rollingEntry.finalRolls[0]}
                    </Typography>
                  ) : (
                    <Box sx={spinSx}><RollingIcon large /></Box>
                  );
                }
                const animSeparator = isCoin
                  ? <TollIcon sx={{ fontSize: 10, color: 'text.disabled', alignSelf: 'flex-end', mb: '10px' }} />
                  : isD6
                  ? <CasinoIcon sx={{ fontSize: 10, color: 'text.disabled', alignSelf: 'flex-end', mb: '10px' }} />
                  : <Box sx={{ alignSelf: 'flex-end', mb: '10px', display: 'inline-flex' }}><D20Icon size={10} /></Box>;
                return renderDiceGrid(
                  rollingEntry.finalRolls,
                  rollingEntry.labels,
                  animSeparator,
                  (r, i) => ({
                    nameColor: 'text.disabled' as const,
                    scoreNode: rollingEntry.activeSlots && !rollingEntry.activeSlots[i] ? (
                      <Typography sx={{ fontWeight: 900, fontSize: 32, lineHeight: 1, color: rollingEntry.lockedSlots?.[i] ? 'primary.main' : 'text.disabled' }}>{r}</Typography>
                    ) : rollingEntry.revealed[i] ? (
                      <Typography key={`rv${i}`} sx={{ fontWeight: 900, fontSize: 32, lineHeight: 1, color: rollingEntry.color, ...popSx }}>{r}</Typography>
                    ) : (
                      <Box sx={{ ...spinSx, fontSize: 32, lineHeight: 1 }}><RollingIcon /></Box>
                    ),
                  })
                );
              })() : rollingEntry && rollingEntry.done ? (
                <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {renderDiceGrid(
                    rollingEntry.finalRolls,
                    rollingEntry.labels,
                    <Box sx={{ alignSelf: 'flex-end', mb: '10px', display: 'inline-flex' }}><D20Icon size={10} /></Box>,
                    (r, i) => {
                      const isActive = !rollingEntry.activeSlots || rollingEntry.activeSlots[i];
                      const isLocked = rollingEntry.lockedSlots?.[i] ?? false;
                      const isWinner = rollOffState.phase === 'result' && rollingEntry.labels?.[i] === rollOffState.winnerName;
                      const lockedInTieNames = rollOffState.phase === 'tie' ? (rollOffState.lockedInTie ?? []).map(j => players[j].playerName) : [];
                      const isLockedHighest = isLocked && rollOffState.phase === 'tie' && lockedInTieNames.includes(rollingEntry.labels?.[i] ?? '');
                      const tiedNames = rollOffState.phase === 'tie' ? rollOffState.tiedIndices.map(j => players[j].playerName) : [];
                      const isTied = rollOffState.phase === 'tie' && (isActive || isLocked) && tiedNames.includes(rollingEntry.labels?.[i] ?? '') && !isLockedHighest;
                      const nameColor = isWinner ? '#DAA520' : isLockedHighest ? 'primary.main' : isTied ? '#DAA520' : 'text.disabled';
                      const scoreColor = isWinner ? rollingEntry.color : isLockedHighest ? 'primary.main' : isTied ? '#DAA520' : 'text.disabled';
                      return {
                        nameColor,
                        scoreNode: <Typography sx={{ fontWeight: 900, fontSize: 32, lineHeight: 1, color: scoreColor, ...(isWinner && { animation: 'rollPop 0.3s cubic-bezier(0.34,1.56,0.64,1)', '@keyframes rollPop': { '0%': { opacity: 0, transform: 'scale(0.3)' }, '100%': { opacity: 1, transform: 'scale(1)' } } }) }}>{r}</Typography>,
                      };
                    }
                  )}
                  {rollOffState.phase === 'tie' && (
                    <Typography sx={{
                      position: 'absolute', pointerEvents: 'none',
                      fontWeight: 900, fontSize: rollOffState.noLonersRule ? 28 : 52, color: '#DAA520', opacity: 0.65,
                      transform: 'rotate(-18deg)', letterSpacing: 6,
                      textShadow: '0 0 24px rgba(255,215,0,0.9)',
                    }}>
                      {rollOffState.noLonersRule ? 'NO LONERS' : 'TIE'}
                    </Typography>
                  )}
                </Box>
              ) : rollOffState.phase === 'result' ? (
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Typography sx={{
                    fontWeight: 900, fontSize: fsBigName, color: '#DAA520',
                    animation: 'nameSizzle 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                    '@keyframes nameSizzle': {
                      '0%':   { opacity: 0, transform: 'scale(1.5)', textShadow: '0 0 32px rgba(255,215,0,1)' },
                      '70%':  { transform: 'scale(0.95)',             textShadow: '0 0 8px rgba(255,215,0,0.6)' },
                      '100%': { opacity: 1, transform: 'scale(1)',    textShadow: '0 0 14px rgba(255,215,0,0.8)' },
                    },
                  }}>
                    {rollOffState.winnerName}
                  </Typography>
                  <Typography sx={{ fontSize: fsGoesFirst, color: 'text.primary' }}>goes first!</Typography>
                </Box>
              ) : rollOffState.phase === 'tie' ? (
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 900, fontSize: fsBigName, color: 'error.main' }}>Tie!</Typography>
                  <Typography sx={{ fontSize: 10, color: 'text.disabled', mt: 0.5 }}>
                    Re-rolling: {rollOffState.tiedIndices.map(i => players[i].playerName).join(' vs ')}
                  </Typography>
                </Box>
              ) : lastEntry ? (
                <Box key={resultKey} sx={{
                  width: '100%', textAlign: 'center',
                  animation: 'diceResultPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  '@keyframes diceResultPop': {
                    '0%':   { opacity: 0, transform: 'scale(0.4) translateY(8px)' },
                    '100%': { opacity: 1, transform: 'scale(1)   translateY(0)'   },
                  },
                }}>
                  {lastEntry.rolls.length === 1 ? (
                    <Typography sx={{ fontWeight: 900, fontSize: 52, lineHeight: 1, color: lastEntry.color }}>
                      {lastEntry.rolls[0]}
                    </Typography>
                  ) : (
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" alignItems="center" gap={0.5}>
                      {lastEntry.rolls.map((r, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && (
                            lastEntry.label === 'd6'
                              ? <CasinoIcon sx={{ fontSize: 10, color: 'text.disabled', flexShrink: 0, alignSelf: 'flex-end', mb: '10px' }} />
                              : lastEntry.label.startsWith('d')
                              ? <Box sx={{ alignSelf: 'flex-end', mb: '10px', display: 'inline-flex' }}><D20Icon size={10} /></Box>
                              : <TollIcon sx={{ fontSize: 10, color: 'text.disabled', flexShrink: 0, alignSelf: 'flex-end', mb: '10px' }} />
                          )}
                          <Box sx={{ textAlign: 'center', height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography sx={{ fontSize: 9, color: 'text.disabled', lineHeight: 1, mb: 0.25 }}>{i + 1}</Typography>
                            <Typography sx={{ fontWeight: 900, fontSize: 32, lineHeight: 1, color: lastEntry.color }}>{r}</Typography>
                          </Box>
                        </React.Fragment>
                      ))}
                    </Stack>
                  )}
                </Box>
              ) : (
                <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>—</Typography>
              )}
            </Box>

            {/* Buttons */}
            {rollOffState.phase !== 'idle' ? (
              <Stack direction="row" spacing={0.5} sx={{ width: '100%' }}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={rollOffState.phase === 'rolling' || rollOffState.phase === 'tie'}
                  onClick={() => {
                    if (rollOffState.phase === 'result') {
                      onChooseFirstPlayer(rollOffState.winnerIdx);
                      setRollingEntry(null);
                      setRollOffState({ phase: 'idle' });
                      setDiceOpen(false);
                    }
                  }}
                  sx={{ fontSize: 12, py: 'clamp(3px, 0.7dvh, 7px)' }}
                >
                  {rollOffState.phase === 'result' ? `${rollOffState.winnerName} goes first` : 'Accept'}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  disabled={rollOffState.phase === 'rolling' || rollOffState.phase === 'tie'}
                  onClick={() => {
                    if (rollOffState.phase === 'result') {
                      startRollOff(rollOffState.originalIndices);
                    }
                  }}
                  sx={{ fontSize: 12, py: 'clamp(3px, 0.7dvh, 7px)' }}
                >
                  Roll Again
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: '100%' }}>
                <Button variant="outlined" onClick={() => setDiceCount((c) => Math.max(1, c - 1))} sx={{ minWidth: 28, px: 0, fontSize: 16, py: 'clamp(5px, 1.2dvh, 11px)', flexShrink: 0 }}>−</Button>
                <Typography sx={{ fontWeight: 700, fontSize: 14, minWidth: 18, textAlign: 'center', flexShrink: 0 }}>{diceCount}</Typography>
                <Button variant="outlined" onClick={() => setDiceCount((c) => Math.min(20, c + 1))} sx={{ minWidth: 28, px: 0, fontSize: 16, py: 'clamp(5px, 1.2dvh, 11px)', flexShrink: 0 }}>+</Button>
                <Button variant="outlined" fullWidth onClick={() => addRoll('d6', 6)} startIcon={lastRolledType === 'd6' ? null : <CasinoIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: 11, fontWeight: lastRolledType === 'd6' ? 900 : 400, py: 'clamp(5px, 1.2dvh, 11px)', minWidth: 0, ...(lastRolledType === 'd6' && { color: 'warning.main', borderColor: 'warning.main' }) }}>{lastRolledType === 'd6' && lastRolledDisplay ? `total ${lastRolledDisplay}` : 'd6'}</Button>
                <Button variant="outlined" fullWidth onClick={() => addRoll('d20', 20)} startIcon={lastRolledType === 'd20' ? null : <D20Icon size={14} />} sx={{ fontSize: 11, fontWeight: lastRolledType === 'd20' ? 900 : 400, py: 'clamp(5px, 1.2dvh, 11px)', minWidth: 0, ...(lastRolledType === 'd20' && { color: 'warning.main', borderColor: 'warning.main' }) }}>{lastRolledType === 'd20' && lastRolledDisplay ? `total ${lastRolledDisplay}` : 'd20'}</Button>
                <Button variant="outlined" fullWidth onClick={() => addRoll('coin', null)} startIcon={lastRolledType === 'coin' ? null : <TollIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: 11, fontWeight: lastRolledType === 'coin' ? 900 : 400, py: 'clamp(5px, 1.2dvh, 11px)', minWidth: 0, ...(lastRolledType === 'coin' && { color: 'warning.main', borderColor: 'warning.main' }) }}>{lastRolledType === 'coin' && lastRolledDisplay ? lastRolledDisplay : 'Flip'}</Button>
                {history.length > 0 && (
                  <Button variant="text" size="small" onClick={() => setHistory([])} sx={{ fontSize: 10, px: 0.5, color: 'text.disabled', flexShrink: 0 }}>Clear</Button>
                )}
              </Stack>
            )}
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
