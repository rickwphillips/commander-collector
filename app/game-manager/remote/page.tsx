'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, TextField, Button, Stack, CircularProgress, IconButton, Chip } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { PlayerPanel } from '../components/PlayerPanel';
import { api } from '@/lib/api';
import { debugLog } from '@/lib/debugLog';
import type { GameManagerState, PlayerState, LiveGameEvent } from '@/lib/types';
import { applyEvent } from '../remoteTransforms';
import { useThemeMode } from '@/components/ThemeProvider';

const POLL_INTERVAL_MS = 1000;
// After sending an event, suppress polls for this long to avoid flickering
// back to a DB state that hasn't reflected the event yet. By 2s the host
// will have processed and written the merged state.
// Heartbeat interval — sends a checkin event so the host knows we're still here
const CHECKIN_INTERVAL_MS = 9000;

type RemotePhase = 'enter-code' | 'loading' | 'connected' | 'not-found' | 'ended';

// ─── Inner component (uses useSearchParams, needs Suspense) ───────────────────

function RemotePageInner() {
  const searchParams = useSearchParams();
  const urlCode = searchParams.get('code') ?? '';

  const [phase, setPhase] = useState<RemotePhase>('enter-code');
  const [codeInput, setCodeInput] = useState('');
  const [code, setCode] = useState('');
  const [seat, setSeat] = useState('');
  const [state, setState] = useState<GameManagerState | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [textSizeMode, setTextSizeMode] = useState<0 | 1 | 2>(0);
  const [lifeKillPending, setLifeKillPending] = useState(false);
  const [poisonKillPending, setPoisonKillPending] = useState(false);
  const { mode, toggleTheme } = useThemeMode();

  const lastSuccessfulPollRef = useRef<number>(Date.now());
  const pollFailCountRef = useRef(0);
  const inactiveCountRef = useRef(0);
  const [showReconnect, setShowReconnect] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick elapsed seconds every second, reset on turn change
  useEffect(() => {
    if (tickTimer.current) clearInterval(tickTimer.current);
    if (phase !== 'connected' || !state) { setElapsedSeconds(0); return; }
    setElapsedSeconds(Math.round((Date.now() - state.turnStartTime) / 1000));
    tickTimer.current = setInterval(() => {
      setElapsedSeconds(Math.round((Date.now() - (state?.turnStartTime ?? Date.now())) / 1000));
    }, 1000);
    return () => { if (tickTimer.current) clearInterval(tickTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.currentPlayerIdx, phase]);

  // ── Auto-connect from URL param ───────────────────────────────────────────
  useEffect(() => {
    if (urlCode) {
      setCodeInput(urlCode);
      connect(urlCode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Connect by code ───────────────────────────────────────────────────────
  const connect = useCallback(async (raw: string) => {
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed) return;
    setPhase('loading');
    setErrorMsg('');
    try {
      const res = await api.getLiveGame(trimmed);
      if (!res.is_active) {
        setPhase('ended');
        return;
      }
      setCode(trimmed);
      setSeat(res.seat);
      setState(res.state);
      // Send checkin event so host sees us immediately
      api.sendLiveGameEvent(trimmed, { type: 'checkin', seat: res.seat, ts: Date.now() }).catch(() => {});
      setPhase('connected');
    } catch {
      setPhase('enter-code');
      setErrorMsg('Code not found or session expired.');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = codeInput.trim().toLowerCase();
    if (trimmed) {
      const url = new URL(window.location.href);
      url.searchParams.set('code', trimmed);
      window.history.replaceState(null, '', url.toString());
    }
    connect(codeInput);
  };

  // ── Polling ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'connected' || !code) return;

    const poll = async () => {
      // Grace period after sending an event — wait for host to process it
      // before updating local state from DB, to avoid flickering
      try {
        const res = await api.getLiveGame(code); // remote never passes consume=true
        if (!res.is_active) {
          // Require 3 consecutive inactive responses before ending — guards against
          // transient bad responses during server deploys or PHP file uploads
          inactiveCountRef.current++;
          debugLog('REMOTE poll', 'is_active=false', { count: inactiveCountRef.current }, 'warn');
          if (inactiveCountRef.current >= 3) setPhase('ended');
          return;
        }
        inactiveCountRef.current = 0;
        pollFailCountRef.current = 0;
        lastSuccessfulPollRef.current = Date.now();
        if (showReconnect) setShowReconnect(false);
        setState((prev) => {
          const dbLives = res.state?.players?.map((p: { playerName: string; life: number }) => `${p.playerName}:${p.life}`);
          if (!prev) { debugLog('REMOTE poll', 'initial state from DB', { dbLives }); return res.state; }
          if (JSON.stringify(prev) === JSON.stringify(res.state)) return prev;
          const prevLives = prev.players.map((p) => `${p.playerName}:${p.life}`);
          debugLog('REMOTE poll', 'state updated from DB', { prevLives, dbLives });
          return res.state;
        });
      } catch (err) {
        pollFailCountRef.current++;
        debugLog('REMOTE poll', 'error', { err: String(err), failCount: pollFailCountRef.current }, 'error');
        if (pollFailCountRef.current >= 8) setShowReconnect(true);
      }
    };

    // Periodic checkin so host's "connected" indicator stays alive
    const checkin = setInterval(() => {
      if (!seat) return;
      api.sendLiveGameEvent(code, { type: 'checkin', seat, ts: Date.now() }).catch(() => {});
    }, CHECKIN_INTERVAL_MS);

    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => { clearInterval(id); clearInterval(checkin); };
  }, [phase, code, seat]);

  // ── Reconnect on phone visibility restore ────────────────────────────────
  // Mobile browsers throttle/pause setInterval when backgrounded. On return,
  // if it's been >10s since the last successful poll, do a full reconnect.
  useEffect(() => {
    if (phase !== 'connected' || !code) return;
    const handler = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastSuccessfulPollRef.current > 10000) {
        connect(code);
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [phase, code, connect]);

  // ── Send event helper ─────────────────────────────────────────────────────
  // Applies the event optimistically to local state for instant UX, then
  // posts it to the DB event queue. The host picks it up on its next 1s poll,
  // applies it to the authoritative state, and writes the merged result.
  const sendEvent = useCallback((eventData: Omit<LiveGameEvent, 'seat' | 'ts'>) => {
    const event: LiveGameEvent = { ...eventData, seat, ts: Date.now() };
    debugLog('REMOTE send', event.type, eventData);
    // Fire and forget — DB is source of truth; remote re-syncs on next poll
    api.sendLiveGameEvent(code, event)
      .then(() => debugLog('REMOTE send', `OK: ${event.type}`))
      .catch((err) => debugLog('REMOTE send', `FAILED: ${event.type}`, { err: String(err) }, 'error'));
  }, [code, seat]);

  // ── Action handlers ───────────────────────────────────────────────────────

  const handleLifeChange = useCallback((idx: number, delta: number) => {
    if (state) {
      const target = state.players[idx];
      if (target.life > 0 && target.life + delta <= 0 && !target.isEliminated) {
        setLifeKillPending(true);
      }
    }
    sendEvent({ type: 'life_change', playerIdx: idx, delta });
  }, [sendEvent, state]);

  const handlePoisonChange = useCallback((idx: number, delta: number) => {
    if (state) {
      const target = state.players[idx];
      if (!target.isEliminated && Math.max(0, target.poison + delta) >= 10 && target.poison < 10) {
        setPoisonKillPending(true);
      }
    }
    sendEvent({ type: 'poison_change', playerIdx: idx, delta });
  }, [sendEvent, state]);

  const handleCommanderTaxChange = useCallback((idx: number, delta: number) => {
    sendEvent({ type: 'commander_tax_change', playerIdx: idx, delta });
  }, [sendEvent]);

  const handleEnergyChange = useCallback((idx: number, delta: number) => {
    sendEvent({ type: 'energy_change', playerIdx: idx, delta });
  }, [sendEvent]);

  const handleExperienceChange = useCallback((idx: number, delta: number) => {
    sendEvent({ type: 'experience_change', playerIdx: idx, delta });
  }, [sendEvent]);

  const handleToggleMonarch = useCallback((idx: number) => {
    sendEvent({ type: 'toggle_monarch', playerIdx: idx });
  }, [sendEvent]);

  const handleToggleInitiative = useCallback((idx: number) => {
    sendEvent({ type: 'toggle_initiative', playerIdx: idx });
  }, [sendEvent]);

  const handleToggleCitysBlessing = useCallback((idx: number) => {
    sendEvent({ type: 'toggle_citys_blessing', playerIdx: idx });
  }, [sendEvent]);

  const handleCommanderDamageChange = useCallback((
    targetIdx: number,
    sourceIdx: number,
    isPartner: boolean,
    delta: number,
  ) => {
    sendEvent({ type: 'commander_damage_change', targetIdx, sourceIdx, isPartner, delta });
  }, [sendEvent]);

  const handleEliminate = useCallback((idx: number) => {
    sendEvent({ type: 'eliminate', playerIdx: idx });
  }, [sendEvent]);

  const handleUndoEliminate = useCallback((idx: number) => {
    sendEvent({ type: 'undo_eliminate', playerIdx: idx });
  }, [sendEvent]);

  const handlePassTurn = useCallback(() => {
    sendEvent({ type: 'pass_turn' });
  }, [sendEvent]);

  // ── Derived values ────────────────────────────────────────────────────────
  const playerIdx = state?.players.findIndex((p) => p.position === seat) ?? -1;
  const player = playerIdx >= 0 ? state?.players[playerIdx] : null;

  // Always render the remote player's panel in bottom orientation
  const displayPlayer: PlayerState | null = player
    ? { ...player, position: 'bottom' }
    : null;

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === 'enter-code' || phase === 'loading') {
    return (
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          gap: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Join Game
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Enter the code shown on the host&apos;s screen
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 320 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Game Code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toLowerCase())}
              inputProps={{ maxLength: 8, style: { fontFamily: 'monospace', fontSize: 24, letterSpacing: 4 } }}
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              error={!!errorMsg}
              helperText={errorMsg || ' '}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={phase === 'loading' || codeInput.trim().length === 0}
            >
              {phase === 'loading' ? <CircularProgress size={22} color="inherit" /> : 'Connect'}
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }

  if (phase === 'not-found') {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h6">Session not found</Typography>
          <Typography variant="body2" color="text.secondary">That code is invalid or has expired.</Typography>
          <Button variant="outlined" onClick={() => { setPhase('enter-code'); setErrorMsg(''); }}>
            Try Again
          </Button>
        </Stack>
      </Box>
    );
  }

  if (phase === 'ended') {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h6">Game Over</Typography>
          <Typography variant="body2" color="text.secondary">The game has ended.</Typography>
          {code && (
            <Button variant="contained" onClick={() => connect(code)}>
              Rejoin Game
            </Button>
          )}
          <Button variant="outlined" onClick={() => { setPhase('enter-code'); setCodeInput(''); }}>
            Join Another Game
          </Button>
        </Stack>
      </Box>
    );
  }

  if (!state || !displayPlayer || playerIdx < 0) {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const isMyTurn = state.players[state.currentPlayerIdx]?.position === seat;

  return (
    <Box sx={{ width: '100dvw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      {showReconnect && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, bgcolor: 'warning.main', px: 2, py: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'warning.contrastText' }}>Connection lost</Typography>
          <Chip label="Reconnect" size="small" onClick={() => connect(code)} sx={{ fontWeight: 700, cursor: 'pointer' }} />
        </Box>
      )}
      <PlayerPanel
        player={displayPlayer}
        playerIdx={playerIdx}
        allPlayers={state.players}
        commanderDamage={state.commanderDamage}
        onLifeChange={handleLifeChange}
        onPoisonChange={handlePoisonChange}
        onCommanderTaxChange={handleCommanderTaxChange}
        onEnergyChange={handleEnergyChange}
        onExperienceChange={handleExperienceChange}
        onToggleMonarch={handleToggleMonarch}
        onToggleInitiative={handleToggleInitiative}
        onToggleCitysBlessing={handleToggleCitysBlessing}
        onCommanderDamageChange={handleCommanderDamageChange}
        onEliminate={handleEliminate}
        onUndoEliminate={handleUndoEliminate}
        startingLife={state.startingLife}
        turnTimerSeconds={state.turnTimerSeconds}
        isCurrentPlayer={isMyTurn}
        activePlayerIdx={isMyTurn ? undefined : state.currentPlayerIdx}
        elapsedSeconds={isMyTurn ? elapsedSeconds : 0}
        textSizeMode={textSizeMode}
        highlightMode={true}
        remoteMode={true}
        onPassTurn={isMyTurn ? handlePassTurn : undefined}
        {...(lifeKillPending && {
          lifeKillOpponents: state.players
            .map((p, i) => ({ name: p.playerName, idx: i }))
            .filter((_, i) => i !== playerIdx && !state.players[i].isEliminated),
          onLifeKillSelect: (sourceIdx) => {
            sendEvent({ type: 'life_kill_attr', playerIdx, sourcePlayerIdx: sourceIdx });
            setLifeKillPending(false);
          },
        })}
        {...(poisonKillPending && {
          poisonKillOpponents: state.players
            .map((p, i) => ({ name: p.playerName, idx: i }))
            .filter((_, i) => i !== playerIdx && !state.players[i].isEliminated),
          onPoisonKillSelect: (sourceIdx) => {
            sendEvent({ type: 'poison_kill_attr', playerIdx, sourcePlayerIdx: sourceIdx });
            setPoisonKillPending(false);
          },
        })}
      />

      {/* Text size toggle */}
      <IconButton
        onClick={() => setTextSizeMode((m) => ((m + 1) % 3) as 0 | 1 | 2)}
        sx={{
          position: 'absolute', bottom: 10, left: 10, zIndex: 10,
          color: textSizeMode === 2 ? 'warning.main' : textSizeMode === 1 ? 'primary.main' : 'text.secondary',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <TextFieldsIcon sx={{ fontSize: textSizeMode === 2 ? 24 : textSizeMode === 1 ? 22 : 20 }} />
      </IconButton>

      {/* Dark mode toggle */}
      <IconButton
        onClick={toggleTheme}
        aria-label="toggle dark mode"
        sx={{
          position: 'absolute', bottom: 10, left: 58, zIndex: 10,
          color: 'text.secondary',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Box>
  );
}

// ─── Outer wrapper with Suspense (required for useSearchParams in static export) ─

export default function RemotePage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    }>
      <RemotePageInner />
    </Suspense>
  );
}
