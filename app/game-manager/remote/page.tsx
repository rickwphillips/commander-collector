'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, TextField, Button, Stack, CircularProgress, IconButton } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { PlayerPanel } from '../components/PlayerPanel';
import { api } from '@/lib/api';
import type { GameManagerState, PlayerState, CommanderDamageMap } from '@/lib/types';

const POLL_INTERVAL_MS = 3000;
const STORAGE_KEY = 'commander_remote_code';

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

  // ── Auto-connect from URL param or localStorage ──────────────────────────
  useEffect(() => {
    const saved = urlCode || localStorage.getItem(STORAGE_KEY) || '';
    if (saved) {
      setCodeInput(saved);
      connect(saved);
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
      localStorage.setItem(STORAGE_KEY, trimmed);
      setCode(trimmed);
      setSeat(res.seat);
      setState(res.state);
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
          localStorage.removeItem(STORAGE_KEY);
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
    return () => clearInterval(id);
  }, [phase, code]);

  // ── Write helper — optimistic update + fire-and-forget DB write ───────────
  const write = useCallback((newState: GameManagerState) => {
    setState(newState);
    lastWriteTimeRef.current = Date.now();
    api.updateLiveGame(code, newState).catch(() => {/* silent */});
  }, [code]);

  // ── Handler logic (mirrors GameBoard exactly) ─────────────────────────────
  const updateState = useCallback((patch: Partial<GameManagerState>) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const handleLifeChange = useCallback((idx: number, delta: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const { players, turnNumber, notes } = prev;
      const target = players[idx];
      const newLife = target.life + delta;
      const isNewLifeKill = target.life > 0 && newLife <= 0;
      const isUndoLifeKill = target.life <= 0 && newLife > 0;
      const wasEliminatedByLife = target.isEliminated && target.life <= 0 && target.poison < 10;
      const lifeNoteTag = `[lifekill:${idx}]`;
      let newNotes = notes;
      if (isUndoLifeKill) {
        newNotes = notes.split('\n').filter((l) => !l.includes(lifeNoteTag)).join('\n');
      }
      const newPlayers = players.map((p, i) => {
        if (i !== idx) return p;
        return {
          ...p,
          life: newLife,
          ...(isNewLifeKill && !p.isEliminated ? { isEliminated: true, eliminatedTurn: turnNumber } : {}),
          ...(isUndoLifeKill && wasEliminatedByLife ? { isEliminated: false, eliminatedTurn: null } : {}),
        };
      });
      const next = { ...prev, players: newPlayers, notes: newNotes };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const handlePoisonChange = useCallback((idx: number, delta: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const { players, turnNumber, notes } = prev;
      const target = players[idx];
      const newPlayers = players.map((p, i) => {
        if (i !== idx) return p;
        const poison = Math.max(0, p.poison + delta);
        const wasEliminatedByPoison = p.isEliminated && p.poison >= 10;
        const isEliminated = poison >= 10 ? true : wasEliminatedByPoison ? false : p.isEliminated;
        const eliminatedTurn = poison >= 10 && !p.isEliminated ? turnNumber : isEliminated ? p.eliminatedTurn : null;
        return { ...p, poison, isEliminated, eliminatedTurn };
      });
      const isUndoPoisonKill = target.isEliminated && target.poison >= 10 && Math.max(0, target.poison + delta) < 10;
      const poisonNoteTag = `[poisonkill:${idx}]`;
      let newNotes = notes;
      if (isUndoPoisonKill) {
        newNotes = notes.split('\n').filter((l) => !l.includes(poisonNoteTag)).join('\n');
      }
      const next = { ...prev, players: newPlayers, notes: newNotes };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const handleCommanderTaxChange = useCallback((idx: number, delta: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const newPlayers = prev.players.map((p, i) =>
        i === idx ? { ...p, commanderTax: Math.max(0, p.commanderTax + delta) } : p
      );
      const next = { ...prev, players: newPlayers };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const handleEnergyChange = useCallback((idx: number, delta: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const newPlayers = prev.players.map((p, i) =>
        i === idx ? { ...p, energy: Math.max(0, p.energy + delta) } : p
      );
      const next = { ...prev, players: newPlayers };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const handleExperienceChange = useCallback((idx: number, delta: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const newPlayers = prev.players.map((p, i) =>
        i === idx ? { ...p, experience: Math.max(0, p.experience + delta) } : p
      );
      const next = { ...prev, players: newPlayers };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const handleToggleMonarch = useCallback((idx: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const newPlayers = prev.players.map((p, i) => ({
        ...p,
        isMonarch: i === idx ? !p.isMonarch : false,
      }));
      const next = { ...prev, players: newPlayers };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const handleToggleInitiative = useCallback((idx: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const newPlayers = prev.players.map((p, i) => ({
        ...p,
        hasInitiative: i === idx ? !p.hasInitiative : false,
      }));
      const next = { ...prev, players: newPlayers };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const handleToggleCitysBlessing = useCallback((idx: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const newPlayers = prev.players.map((p, i) =>
        i === idx ? { ...p, hasCitysBlessing: !p.hasCitysBlessing } : p
      );
      const next = { ...prev, players: newPlayers };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const handleCommanderDamageChange = useCallback((
    targetIdx: number,
    sourceIdx: number,
    isPartner: boolean,
    delta: number
  ) => {
    setState((prev) => {
      if (!prev) return prev;
      const { players, commanderDamage, turnNumber, notes } = prev;
      const current = commanderDamage[targetIdx]?.[sourceIdx] ?? [0, 0];
      const newDmg: [number, number] = [
        isPartner ? current[0] : Math.max(0, current[0] + delta),
        isPartner ? Math.max(0, current[1] + delta) : current[1],
      ];
      const newCommanderDamage: CommanderDamageMap = {
        ...commanderDamage,
        [targetIdx]: { ...(commanderDamage[targetIdx] ?? {}), [sourceIdx]: newDmg },
      };
      const prevTotal = current[0] + current[1];
      const cmdDmgTotal = newDmg[0] + newDmg[1];
      const actualDelta = cmdDmgTotal - prevTotal;
      const isNewElimination = !players[targetIdx].isEliminated && cmdDmgTotal >= 21;
      const isUndoElimination = players[targetIdx].isEliminated && prevTotal >= 21 && cmdDmgTotal < 21;
      const target = players[targetIdx];
      const source = players[sourceIdx];
      const cmdLabel = source.partner
        ? `${source.commander.name} / ${source.partner.name}`
        : source.commander.name;
      const noteTag = `[cmdkill:${targetIdx}:${sourceIdx}]`;
      const noteLine = `${noteTag} ${target.playerName} eliminated by ${cmdLabel} commander damage (turn ${turnNumber})`;
      let newNotes = notes;
      if (isNewElimination) newNotes = [notes, noteLine].filter(Boolean).join('\n');
      else if (isUndoElimination) newNotes = notes.split('\n').filter((l) => !l.includes(noteTag)).join('\n');
      const newPlayers = players.map((p, i) => {
        if (i !== targetIdx) return p;
        return {
          ...p,
          life: p.life - actualDelta,
          ...(isNewElimination ? { isEliminated: true, eliminatedTurn: turnNumber } : {}),
          ...(isUndoElimination ? { isEliminated: false, eliminatedTurn: null } : {}),
        };
      });
      const next = { ...prev, commanderDamage: newCommanderDamage, players: newPlayers, notes: newNotes };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const handleEliminate = useCallback((idx: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const newPlayers = prev.players.map((p, i) =>
        i === idx ? { ...p, isEliminated: true, isConceded: true, eliminatedTurn: prev.turnNumber } : p
      );
      const next = { ...prev, players: newPlayers };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const handleUndoEliminate = useCallback((idx: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const newPlayers = prev.players.map((p, i) =>
        i === idx ? { ...p, isEliminated: false, isConceded: false, eliminatedTurn: null } : p
      );
      const next = { ...prev, players: newPlayers };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

  const CLOCKWISE: PlayerState['position'][] = ['bottom', 'left', 'top', 'right'];

  const handlePassTurn = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const { players, currentPlayerIdx, turnNumber } = prev;
      const firstIdx = prev.firstPlayerIdx ?? 0;
      const currentPos = players[currentPlayerIdx].position;
      const curCW = CLOCKWISE.indexOf(currentPos);
      const firstCW = CLOCKWISE.indexOf(players[firstIdx].position);
      let nextPlayerIdx = -1;
      let stepsToNext = 0;
      for (let step = 1; step <= 4; step++) {
        const nextPos = CLOCKWISE[(curCW + step) % 4];
        const idx = players.findIndex((p) => p.position === nextPos && !p.isEliminated);
        if (idx !== -1) { nextPlayerIdx = idx; stepsToNext = step; break; }
      }
      if (nextPlayerIdx === -1) return prev;
      const distToFirst = (firstCW - curCW + 4) % 4;
      const newTurnNumber = distToFirst >= 1 && distToFirst <= stepsToNext ? turnNumber + 1 : turnNumber;
      const next = { ...prev, currentPlayerIdx: nextPlayerIdx, turnNumber: newTurnNumber, turnStartTime: Date.now() };
      lastWriteTimeRef.current = Date.now();
      api.updateLiveGame(code, next).catch(() => {/* silent */});
      return next;
    });
  }, [code]);

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
          <Button variant="outlined" onClick={() => { localStorage.removeItem(STORAGE_KEY); setPhase('enter-code'); setCodeInput(''); }}>
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
