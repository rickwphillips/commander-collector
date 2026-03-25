'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, TextField, Button, Stack, CircularProgress, IconButton } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { PlayerPanel } from '../components/PlayerPanel';
import { api } from '@/lib/api';
import type { GameManagerState, PlayerState } from '@/lib/types';
import {
  applyLifeChange,
  applyPoisonChange,
  applyCommanderTaxChange,
  applyEnergyChange,
  applyExperienceChange,
  applyToggleMonarch,
  applyToggleInitiative,
  applyToggleCitysBlessing,
  applyCommanderDamageChange,
  applyEliminate,
  applyUndoEliminate,
  applyPassTurn,
} from '../remoteTransforms';

const POLL_INTERVAL_MS = 3000;

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

  const lastWriteTimeRef = useRef<number>(0);
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
      // Write checkin so host sees us immediately
      const checkinState = { ...res.state, remoteCheckins: { ...(res.state.remoteCheckins ?? {}), [res.seat]: Date.now() } };
      setState(checkinState);
      api.updateLiveGame(trimmed, checkinState).catch(() => {});
      lastWriteTimeRef.current = Date.now();
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
      if (Date.now() - lastWriteTimeRef.current < POLL_INTERVAL_MS) return;
      if (document.visibilityState === 'hidden') return;
      try {
        const res = await api.getLiveGame(code);
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

    const id = setInterval(poll, POLL_INTERVAL_MS);

    // Heartbeat every 9s — keeps the "remote connected" indicator alive on the host.
    // Reads current DB state first so we never overwrite a stale local copy into the DB.
    const heartbeat = setInterval(async () => {
      if (!seat) return;
      try {
        const res = await api.getLiveGame(code);
        if (!res.is_active) return;
        const now = Date.now();
        const next = { ...res.state, remoteCheckins: { ...(res.state.remoteCheckins ?? {}), [seat]: now } };
        api.updateLiveGame(code, next).catch(() => {});
        // Sync local state with latest DB state + updated checkin
        setState((prev) => {
          if (!prev) return prev;
          return { ...res.state, remoteCheckins: { ...(res.state.remoteCheckins ?? {}), [seat]: now } };
        });
      } catch {/* silent */}
    }, 9000);

    return () => { clearInterval(id); clearInterval(heartbeat); };
  }, [phase, code, seat]);

  // ── Write helper — optimistic local update + read-modify-write to DB ────────
  // All action handlers go through here so the DB write always uses the freshest
  // server state as its base.  This prevents the remote from overwriting fields
  // (currentPlayerIdx, turnNumber, etc.) that the host may have changed since
  // the remote panel last polled.
  const remoteWrite = useCallback(async (applyFn: (s: GameManagerState) => GameManagerState) => {
    // 1. Optimistic local update for instant UX
    setState((prev) => (prev ? applyFn(prev) : prev));
    lastWriteTimeRef.current = Date.now();
    // 2. Read-modify-write — apply the same delta on top of the current DB state
    try {
      const res = await api.getLiveGame(code);
      if (!res.is_active) { setPhase('ended'); return; }
      api.updateLiveGame(code, applyFn(res.state)).catch(() => {/* silent */});
    } catch {/* silent */}
  }, [code]);

  const handleLifeChange = useCallback((idx: number, delta: number) => {
    remoteWrite((s) => applyLifeChange(s, idx, delta));
  }, [remoteWrite]);

  const handlePoisonChange = useCallback((idx: number, delta: number) => {
    remoteWrite((s) => applyPoisonChange(s, idx, delta));
  }, [remoteWrite]);

  const handleCommanderTaxChange = useCallback((idx: number, delta: number) => {
    remoteWrite((s) => applyCommanderTaxChange(s, idx, delta));
  }, [remoteWrite]);

  const handleEnergyChange = useCallback((idx: number, delta: number) => {
    remoteWrite((s) => applyEnergyChange(s, idx, delta));
  }, [remoteWrite]);

  const handleExperienceChange = useCallback((idx: number, delta: number) => {
    remoteWrite((s) => applyExperienceChange(s, idx, delta));
  }, [remoteWrite]);

  const handleToggleMonarch = useCallback((idx: number) => {
    remoteWrite((s) => applyToggleMonarch(s, idx));
  }, [remoteWrite]);

  const handleToggleInitiative = useCallback((idx: number) => {
    remoteWrite((s) => applyToggleInitiative(s, idx));
  }, [remoteWrite]);

  const handleToggleCitysBlessing = useCallback((idx: number) => {
    remoteWrite((s) => applyToggleCitysBlessing(s, idx));
  }, [remoteWrite]);

  const handleCommanderDamageChange = useCallback((
    targetIdx: number,
    sourceIdx: number,
    isPartner: boolean,
    delta: number,
  ) => {
    remoteWrite((s) => applyCommanderDamageChange(s, targetIdx, sourceIdx, isPartner, delta));
  }, [remoteWrite]);

  const handleEliminate = useCallback((idx: number) => {
    remoteWrite((s) => applyEliminate(s, idx));
  }, [remoteWrite]);

  const handleUndoEliminate = useCallback((idx: number) => {
    remoteWrite((s) => applyUndoEliminate(s, idx));
  }, [remoteWrite]);

  const handlePassTurn = useCallback(() => {
    remoteWrite(applyPassTurn);
  }, [remoteWrite]);

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
