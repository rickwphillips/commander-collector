'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, TextField, Button, Stack, CircularProgress, IconButton } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { PlayerPanel } from '../components/PlayerPanel';
import { api } from '@/lib/api';
import type { GameManagerState, PlayerState, LiveGameEvent } from '@/lib/types';
import { applyEvent } from '../remoteTransforms';

const POLL_INTERVAL_MS = 1000;
// After sending an event, suppress polls for this long to avoid flickering
// back to a DB state that hasn't reflected the event yet. By 2s the host
// will have processed and written the merged state.
const POST_EVENT_GRACE_MS = 2000;
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

  const lastEventTimeRef = useRef<number>(0);
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
    connect(codeInput);
  };

  // ── Polling ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'connected' || !code) return;

    const poll = async () => {
      // Grace period after sending an event — wait for host to process it
      // before updating local state from DB, to avoid flickering
      if (Date.now() - lastEventTimeRef.current < POST_EVENT_GRACE_MS) return;
      if (document.visibilityState === 'hidden') return;
      try {
        const res = await api.getLiveGame(code); // remote never passes consume=true
        if (!res.is_active) {
          setPhase('ended');
          return;
        }
        setState((prev) => {
          if (!prev) return res.state;
          if (JSON.stringify(prev) === JSON.stringify(res.state)) return prev;
          return res.state;
        });
      } catch {/* silent */}
    };

    // Periodic checkin so host's "connected" indicator stays alive
    const checkin = setInterval(() => {
      if (!seat) return;
      api.sendLiveGameEvent(code, { type: 'checkin', seat, ts: Date.now() }).catch(() => {});
    }, CHECKIN_INTERVAL_MS);

    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => { clearInterval(id); clearInterval(checkin); };
  }, [phase, code, seat]);

  // ── Send event helper ─────────────────────────────────────────────────────
  // Applies the event optimistically to local state for instant UX, then
  // posts it to the DB event queue. The host picks it up on its next 1s poll,
  // applies it to the authoritative state, and writes the merged result.
  const sendEvent = useCallback((eventData: Omit<LiveGameEvent, 'seat' | 'ts'>) => {
    const event: LiveGameEvent = { ...eventData, seat, ts: Date.now() };
    // Optimistic local update
    setState((prev) => (prev ? applyEvent(prev, event) : prev));
    lastEventTimeRef.current = Date.now();
    // Fire and forget — failures are silent; host will still have the correct
    // state from its own actions, and remote re-syncs on next poll
    api.sendLiveGameEvent(code, event).catch(() => {});
  }, [code, seat]);

  // ── Action handlers ───────────────────────────────────────────────────────

  const handleLifeChange = useCallback((idx: number, delta: number) => {
    sendEvent({ type: 'life_change', playerIdx: idx, delta });
  }, [sendEvent]);

  const handlePoisonChange = useCallback((idx: number, delta: number) => {
    sendEvent({ type: 'poison_change', playerIdx: idx, delta });
  }, [sendEvent]);

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
      />
      {/* Pass Turn button — only shown when it's this player's turn */}
      {isMyTurn && (
        <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <Button variant="contained" color="primary" size="large" onClick={handlePassTurn} sx={{ px: 4, fontWeight: 700, borderRadius: 3 }}>
            Pass Turn
          </Button>
        </Box>
      )}

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
