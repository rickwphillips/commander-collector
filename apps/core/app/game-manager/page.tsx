'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthGuard';
import { GameSetup } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { GameEndSummary } from './components/GameEndSummary';
import type { GameManagerState, PlayerSetup, PlayerState, CommanderDamageMap } from './types';
import type { GameResultInput } from '@/lib/types';
import { api } from '@/lib/api';
import { applyEvent } from './remoteTransforms';

const POSITIONS_BY_COUNT: Record<number, Array<PlayerState['position']>> = {
  2: ['bottom', 'top'],
  3: ['bottom', 'left', 'top'],
  4: ['bottom', 'left', 'top', 'right'],
};
const DEFAULT_STATE: GameManagerState = {
  players: [],
  commanderDamage: {},
  currentPlayerIdx: 0,
  turnNumber: 1,
  startingLife: 40,
  phase: 'setup',
  turnTimerSeconds: 300,
  turnStartTime: 0,
  notes: '',
  sessionCode: null,
  sessionSeats: null,
};

// Validate that a loaded game state is valid and playable
function isValidPlayableState(state: GameManagerState): boolean {
  if (!state.players || state.players.length === 0) return false;
  if (state.phase !== 'playing') return false;
  if (state.currentPlayerIdx < 0 || state.currentPlayerIdx >= state.players.length) return false;
  if (!state.commanderDamage) return false;
  return true;
}

function buildInitialState(playerSetups: PlayerSetup[], startingLife: number): GameManagerState {
  const players: PlayerState[] = playerSetups.map((setup, i) => ({
    ...setup,
    position: (POSITIONS_BY_COUNT[playerSetups.length] ?? POSITIONS_BY_COUNT[4])[i],
    life: startingLife,
    poison: 0,
    commanderTax: 0,
    isMonarch: false,
    hasInitiative: false,
    hasCitysBlessing: false,
    energy: 0,
    experience: 0,
    isEliminated: false,
    isConceded: false,
    eliminatedTurn: null,
  }));

  // Initialize commanderDamage map: each target has an entry for each source
  const commanderDamage: CommanderDamageMap = {};
  for (let target = 0; target < players.length; target++) {
    commanderDamage[target] = {};
    for (let source = 0; source < players.length; source++) {
      if (source !== target) {
        commanderDamage[target][source] = [0, 0];
      }
    }
  }

  return {
    players,
    commanderDamage,
    currentPlayerIdx: 0,
    turnNumber: 1,
    startingLife,
    phase: 'playing',
    turnTimerSeconds: 300,
    turnStartTime: Date.now(),
    notes: '',
  };
}

const POLL_INTERVAL_MS = 3000;

export default function GameManagerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [state, setState] = useState<GameManagerState>(DEFAULT_STATE);
  const [setupPrefill, setSetupPrefill] = useState<PlayerSetup[] | null>(null);

  // Ref for live session sync (tracks when last write happened)
  const lastWriteTimeRef = useRef<number>(0);

  // Single flag: don't render until DB check completes and state is actually loaded
  // This prevents any rendering while checking for active session
  const [dbCheckComplete, setDbCheckComplete] = useState<boolean>(false);
  const dbCheckRef = useRef<boolean>(false);

  // On mount: query DB for active game session
  // Don't render ANYTHING until this completes and state is set
  useEffect(() => {
    if (dbCheckRef.current) return;
    dbCheckRef.current = true;

    const checkAndLoad = async () => {
      let loadedGame: GameManagerState | null = null;
      let sessionCode: string | null = null;

      try {
        const res = await api.getActiveGame();

        if (res.is_active && res.state) {
          sessionCode = res.session_code;

          // Check: is state valid AND in playing phase?
          if (isValidPlayableState(res.state) && res.state.phase === 'playing') {
            // Valid, playable game — load it
            loadedGame = {
              ...res.state,
              sessionCode: res.session_code,
              sessionSeats: res.session_seats ?? null
            };
          } else {
            // Bad state or ended game — delete corrupted session
            if (sessionCode) {
              api.deleteLiveGame(sessionCode).catch(() => {});
            }
          }
        }
      } catch (err) {
        // No active session or error — start fresh
      }

      // Update state and complete check in same effect
      if (loadedGame) {
        setState(loadedGame);
      }
      // Mark check complete
      setDbCheckComplete(true);
    };

    checkAndLoad();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fire-and-forget DB write on every state change while playing.
  useEffect(() => {
    if (state.phase !== 'playing' || !state.sessionCode || !dbCheckComplete) return;
    lastWriteTimeRef.current = Date.now();
    api.updateLiveGame(state.sessionCode, state).catch(() => {});
  }, [state, dbCheckComplete]);

  // Also save state when sessionCode first becomes available (in case state changed while waiting for session)
  useEffect(() => {
    if (state.phase !== 'playing' || !state.sessionCode || !dbCheckComplete) return;
    // Only trigger if enough time has passed since last write (avoid duplicate saves)
    if (Date.now() - lastWriteTimeRef.current < 100) return;
    api.updateLiveGame(state.sessionCode, state).catch(() => {});
  }, [state.sessionCode]);

  // Poll for remote events. The host is the sole writer of full state; remotes
  // append typed events to the queue instead. We consume (read + clear) the queue
  // every second and apply any events to our local state. The existing write effect
  // then persists the merged result to the DB.
  useEffect(() => {
    if (state.phase !== 'playing' || !state.sessionCode || !dbCheckComplete) return;
    const code = state.sessionCode;

    const poll = async () => {
      try {
        const res = await api.getLiveGame(code, true); // consume=true clears the queue
        if (!res.is_active) return;
        if (res.remote_events.length === 0) return; // nothing to apply
        setState((prev) => {
          if (!prev) return prev;
          return res.remote_events.reduce((s, ev) => applyEvent(s, ev), prev);
        });
      } catch { /* ignore poll errors */ }
    };

    const id = setInterval(poll, 500);

    // Immediately consume queue on visibility restore — prevents events sitting
    // unconsumed while the host tab was backgrounded, causing remote to revert.
    const onVisible = () => {
      if (document.visibilityState === 'visible') poll();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVisible); };
  }, [state.phase, state.sessionCode, dbCheckComplete]);

  const handleStart = async (playerSetups: PlayerSetup[], startingLife: number, turnTimerSeconds: number) => {
    // New game starting — mark check as complete since we're creating a fresh session
    dbCheckRef.current = true;
    setDbCheckComplete(true);  // Also set state so fire-and-forget effect works
    // Await the delete so the old session is gone before the new one is created.
    // If it fails we proceed anyway — the new game gets a new code so it's isolated.
    if (state.sessionCode) {
      try { await api.deleteLiveGame(state.sessionCode); } catch {/* ok to proceed */}
    }
    const newState = { ...buildInitialState(playerSetups, startingLife), turnTimerSeconds };
    setState(newState);
    // Create live session — fire-and-forget, failures don't block the game
    try {
      const seats = playerSetups.map((_, i) =>
        (POSITIONS_BY_COUNT[playerSetups.length] ?? POSITIONS_BY_COUNT[4])[i]
      );
      // Always pass user ID so session can be loaded later via active-game endpoint
      const session = await api.createLiveGame(newState, seats, user?.id ?? undefined);
      const newSessionCode = session.seats[newState.players.find((p) => p.position === 'bottom')?.position ?? 'bottom'] ?? null;
      setState((prev) => ({
        ...prev,
        sessionCode: newSessionCode,
        sessionSeats: session.seats,
      }));
    } catch {/* silent — live session is optional */}
  };

  const handleUpdate = (newState: GameManagerState | ((prev: GameManagerState) => GameManagerState)) => {
    setState(newState);
  };

  const handleEndGame = () => {
    setState((prev) => {
      if (prev.sessionCode) api.deleteLiveGame(prev.sessionCode).catch(() => {});
      return { ...prev, phase: 'ended' };
    });
  };

  const handleLogGame = () => {
    router.push('/games/new');
  };

  const handleSaveGame = async (currentState: GameManagerState) => {
    if (currentState.sessionCode) {
      api.deleteLiveGame(currentState.sessionCode).catch(() => {/* silent */});
    }
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const winner = currentState.players.find((p) => !p.isEliminated);
    const losers = currentState.players
      .filter((p) => p.isEliminated)
      .sort((a, b) => (b.eliminatedTurn ?? 0) - (a.eliminatedTurn ?? 0));
    const results: GameResultInput[] = [
      ...(winner ? [{ deck_id: winner.deckId, player_id: winner.playerId, finish_position: 1, eliminated_turn: null, team_number: null }] : []),
      ...losers.map((p, i) => ({ deck_id: p.deckId, player_id: p.playerId, finish_position: i + 2, eliminated_turn: p.eliminatedTurn, team_number: null })),
    ];
    const cleanNotes = currentState.notes.replace(/\[(?:cmdkill|poisonkill):[^\]]+\]\s*/g, '').trim() || null;
    const { id } = await api.createGame({ played_at: today, notes: cleanNotes, game_type: 'standard', results });
    router.push(`/games/detail?id=${id}`);
  };

  const handleNewGame = () => {
    if (state.sessionCode) {
      api.deleteLiveGame(state.sessionCode).catch(() => {/* silent */});
    }
    setSetupPrefill(null);
    setState(DEFAULT_STATE);
  };

  const handleDiscard = () => {
    if (state.sessionCode) {
      api.deleteLiveGame(state.sessionCode).catch(() => {/* silent */});
    }
    router.push('/games');
  };

  const handleRestartGame = (currentPlayers: PlayerState[]) => {
    if (state.sessionCode) {
      api.deleteLiveGame(state.sessionCode).catch(() => {/* silent */});
    }
    setSetupPrefill(currentPlayers.map((p) => ({
      playerId: p.playerId,
      deckId: p.deckId,
      playerName: p.playerName,
      deckName: p.deckName,
      commander: p.commander,
      partner: p.partner,
    })));
    setState(DEFAULT_STATE);
  };


  // Don't render visible content until DB check completes
  if (!dbCheckComplete) {
    return null;
  }

  // Show GameBoard if state is valid, playable, and in playing phase
  if (isValidPlayableState(state) && state.phase === 'playing') {
    return (
      <GameBoard
        state={state}
        onUpdate={handleUpdate}
        onEndGame={handleEndGame}
        onRestartGame={handleRestartGame}
        onLogGame={handleLogGame}
        onSaveGame={handleSaveGame}
      />
    );
  }

  // Show end game summary when game has ended and a turn was actually played
  if (state.phase === 'ended' && state.players.length > 0 && state.firstPlayerIdx != null) {
    return (
      <GameEndSummary
        players={state.players}
        turnNumber={state.turnNumber}
        startingLife={state.startingLife}
        commanderDamage={state.commanderDamage}
        onLogGame={handleLogGame}
        onNewGame={() => setState(DEFAULT_STATE)}
        onDiscard={() => setState(DEFAULT_STATE)}
      />
    );
  }

  // All else: show setup form (covers bad state, new games)
  return <GameSetup onStart={handleStart} prefillPlayers={setupPrefill ?? undefined} />;
}
