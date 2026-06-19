'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, TextField, Button, Stack, CircularProgress, IconButton, Chip, Fab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PlayerPanel } from '../components/PlayerPanel';
import { api } from '@/lib/api';
import type { GameManagerState, PlayerState, LiveGameEvent, DistributiveOmit } from '@/lib/types';
import { applyEvent } from '../remoteTransforms';
import { useThemeMode } from '@/components/ThemeProvider';

// After sending an event, suppress incoming SSE state for this long.
// The host polls at 500ms, so within ~600ms the event is processed and
// written to DB. 1500ms gives 2+ host cycles of margin before we re-sync.
const POST_EVENT_GRACE_MS = 1500;
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
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return localStorage.getItem('remoteSoundEnabled') !== '0'; } catch { return true; }
  });
  const [lifeKillPending, setLifeKillPending] = useState(false);
  const [poisonKillPending, setPoisonKillPending] = useState(false);
  const [viewingPlayerIdx, setViewingPlayerIdx] = useState<number | null>(null);
  const { mode, toggleTheme } = useThemeMode();

  // Cross-browser fullscreen: try native API, fall back to CSS fixed overlay (iOS Safari)
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cssFullscreen, setCssFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) { setIsFullscreen(false); setCssFullscreen(false); }
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (isFullscreen) {
      if (document.fullscreenElement) { document.exitFullscreen(); }
      else { setCssFullscreen(false); setIsFullscreen(false); }
    } else if (el?.requestFullscreen) {
      el.requestFullscreen()
        .then(() => { setIsFullscreen(true); setCssFullscreen(false); })
        .catch(() => { setCssFullscreen(true); setIsFullscreen(true); });
    } else {
      // iOS Safari — CSS-only fullscreen
      setCssFullscreen(true);
      setIsFullscreen(true);
    }
  };

  // Lock body scroll and prevent pull-to-refresh while on the remote panel
  useEffect(() => {
    const prev = { overflow: document.body.style.overflow, overscrollBehavior: document.body.style.overscrollBehavior };
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.overscrollBehavior = prev.overscrollBehavior;
    };
  }, []);

  const lastSuccessfulPollRef = useRef<number>(Date.now());
  const lastEventTimeRef = useRef<number>(0);
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

  // ── SSE state stream ─────────────────────────────────────────────────────
  // Replaces the previous 1s setInterval poll. The server pushes state
  // whenever the host writes a change, so the remote only receives data when
  // something actually changed. The EventSource reconnects automatically
  // after the server's planned 270s close (retry:100 = 100ms reconnect delay).
  useEffect(() => {
    if (phase !== 'connected' || !code) return;

    const closeStream = api.openLiveGameStream(
      code,
      (newState) => {
        lastSuccessfulPollRef.current = Date.now();
        pollFailCountRef.current = 0;
        inactiveCountRef.current = 0;
        if (showReconnect) setShowReconnect(false);
        // Skip applying server state during the grace period — optimistic
        // update is ahead of the DB until the host processes our last event.
        if (Date.now() - lastEventTimeRef.current < POST_EVENT_GRACE_MS) return;
        setState(newState);
      },
      () => {
        // Server reports session inactive — require 3 before ending (guards
        // against transient responses during deploys or file uploads)
        inactiveCountRef.current++;
        if (inactiveCountRef.current >= 3) setPhase('ended');
      },
      () => {
        pollFailCountRef.current++;
        if (pollFailCountRef.current >= 8) setShowReconnect(true);
      },
    );

    // Periodic checkin so host's "connected" indicator stays alive
    const checkin = setInterval(() => {
      if (!seat) return;
      api.sendLiveGameEvent(code, { type: 'checkin', seat, ts: Date.now() }).catch(() => {});
    }, CHECKIN_INTERVAL_MS);

    return () => { closeStream(); clearInterval(checkin); };
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
  const sendEvent = useCallback((eventData: DistributiveOmit<LiveGameEvent, 'seat' | 'ts'>) => {
    // DistributiveOmit preserves each union member's discriminant fields; a
    // plain Omit would collapse them and lose type narrowing at call sites.
    const event = { ...eventData, seat, ts: Date.now() } as LiveGameEvent;
    // Optimistic update — apply instantly so the panel feels responsive.
    setState((prev) => prev ? applyEvent(prev, event) : prev);
    // Start grace period so the poll doesn't overwrite optimistic state
    // before the host has had time to process and write this event to DB.
    lastEventTimeRef.current = Date.now();
    api.sendLiveGameEvent(code, event).catch(() => {});
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

  const handleOpenChat = useCallback((playerName: string) => {
    if (!state) return;
    const ctx = {
      players: state.players.map((p, idx) => {
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
        const dmgReceived = state.commanderDamage[idx];
        if (dmgReceived) {
          const dmg: Record<string, number[]> = {};
          for (const [srcIdx, vals] of Object.entries(dmgReceived)) {
            const [regular, partner] = vals as [number, number];
            if (regular > 0 || partner > 0) {
              dmg[state.players[Number(srcIdx)]?.playerName ?? srcIdx] = partner > 0 ? [regular, partner] : [regular];
            }
          }
          if (Object.keys(dmg).length > 0) entry.commanderDamage = dmg;
        }
        return entry;
      }),
      focusPlayerName: playerName,
      turnNumber: state.turnNumber ?? null,
      currentPlayer: state.players[state.currentPlayerIdx]?.playerName ?? null,
    };
    const ctxParam = encodeURIComponent(btoa(JSON.stringify(ctx)));
    const base = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3003'
      : '/app/projects/commander/rules';
    window.open(`${base}/chat?ctx=${ctxParam}`, '_blank');
  }, [state]);

  // Sync view overlay state to host so target player's remote panel gets eye notification.
  // view_open/view_close sent on open/close; view_heartbeat sent every 5s while open.
  useEffect(() => {
    if (phase !== 'connected' || !code || !seat) return;
    if (viewingPlayerIdx === null) {
      api.sendLiveGameEvent(code, { type: 'view_close', seat, ts: Date.now() }).catch(() => {});
      return;
    }
    // Send view_open immediately
    api.sendLiveGameEvent(code, { type: 'view_open', playerIdx: viewingPlayerIdx, seat, ts: Date.now() }).catch(() => {});
    // Send heartbeat every 5s while viewing
    const id = setInterval(() => {
      api.sendLiveGameEvent(code, { type: 'view_heartbeat', playerIdx: viewingPlayerIdx, seat, ts: Date.now() }).catch(() => {});
    }, 5000);
    return () => clearInterval(id);
  }, [viewingPlayerIdx, phase, code, seat]);

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
    <Box
      ref={containerRef}
      sx={{
        width: '100dvw', height: '100dvh', overflow: 'hidden', position: 'relative',
        pt: 'env(safe-area-inset-top)', boxSizing: 'border-box',
        touchAction: 'manipulation', overscrollBehavior: 'none',
        ...(cssFullscreen && {
          position: 'fixed', inset: 0, zIndex: 1400,
          width: '100%', height: '100%',
          bgcolor: 'background.default',
        }),
      }}
    >
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
        soundEnabled={soundEnabled}
        highlightMode={true}
        remoteMode={true}
        viewerPlayerNames={Object.values(state.viewerMap ?? {}).filter(e => e.targetIdx === playerIdx && Date.now() - e.ts < 20000).map(e => e.viewerName)}
        onSwitchToPlayer={(targetIdx) => setViewingPlayerIdx(targetIdx)}
        onToggleTheme={toggleTheme}
        themeMode={mode}
        onToggleSound={() => setSoundEnabled(s => { const next = !s; try { localStorage.setItem('remoteSoundEnabled', next ? '1' : '0'); } catch {} return next; })}
        onPassTurn={isMyTurn ? handlePassTurn : undefined}
        onOpenChat={handleOpenChat}
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


      {/* Read-only overlay — view another player's panel */}
      {viewingPlayerIdx !== null && state && (() => {
        const vPlayer = state.players[viewingPlayerIdx];
        if (!vPlayer) return null;
        const noop = () => {};
        return (
          <Box sx={{ position: 'absolute', inset: 0, zIndex: 60, bgcolor: 'rgba(0,0,0,0.7)' }}
            onClick={() => setViewingPlayerIdx(null)}>
            <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'absolute', inset: 0 }}>
              <PlayerPanel
                player={{ ...vPlayer, position: 'bottom' }}
                playerIdx={viewingPlayerIdx}
                allPlayers={state.players}
                commanderDamage={state.commanderDamage}
                startingLife={state.startingLife}
                onLifeChange={noop} onPoisonChange={noop} onCommanderTaxChange={noop}
                onEnergyChange={noop} onExperienceChange={noop}
                onToggleMonarch={noop} onToggleInitiative={noop} onToggleCitysBlessing={noop}
                onCommanderDamageChange={noop} onEliminate={noop} onUndoEliminate={noop}
                highlightMode={false} soundEnabled={false} remoteMode={true}
                activePlayerIdx={state.currentPlayerIdx}
                turnTimerSeconds={state.turnTimerSeconds}
                onSwitchToPlayer={(targetIdx) => setViewingPlayerIdx(targetIdx)}
              />
              <Box sx={{ position: 'absolute', inset: 0, zIndex: 5, cursor: 'pointer' }}
                onClick={() => setViewingPlayerIdx(null)} />
              {/* Read-only banner */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 1, py: 0.4, background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 44%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.7) 56%, rgba(0,0,0,0) 100%)' }}>
                <Typography sx={{ fontSize: 19, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                  Read Only — {vPlayer.playerName}
                </Typography>
              </Box>
              <IconButton onClick={() => setViewingPlayerIdx(null)}
                sx={{ position: 'absolute', top: 4, right: 8, zIndex: 11, p: 0.5, color: 'rgba(255,255,255,0.7)' }}>
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        );
      })()}

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
