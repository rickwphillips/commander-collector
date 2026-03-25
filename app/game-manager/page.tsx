'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GameSetup } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { GameEndSummary } from './components/GameEndSummary';
import type { GameManagerState, PlayerSetup, PlayerState, CommanderDamageMap } from './types';
import type { GameResultInput } from '@/lib/types';
import { api } from '@/lib/api';

const POSITIONS_BY_COUNT: Record<number, Array<PlayerState['position']>> = {
  2: ['bottom', 'top'],
  3: ['bottom', 'left', 'top'],
  4: ['bottom', 'left', 'top', 'right'],
};
const GAME_STATE_KEY = 'commander_game_state';

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

function loadSavedState(): GameManagerState | null {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameManagerState;
    if (parsed.phase === 'playing' || parsed.phase === 'ended') return parsed;
    return null;
  } catch {
    return null;
  }
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
  const [isResumed, setIsResumed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return loadSavedState() !== null;
  });
  const [state, setState] = useState<GameManagerState>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    return loadSavedState() ?? DEFAULT_STATE;
  });
  const [setupPrefill, setSetupPrefill] = useState<PlayerSetup[] | null>(null);

  // Refs for live session sync
  const lastWriteTimeRef = useRef<number>(0);
  const lastSeenUpdatedAtRef = useRef<string | null>(null);

  // On reload from localStorage we must verify the saved sessionCode is still active before
  // writing — otherwise we replay stale local state into a live session that may have moved on.
  // Starts false only when a playing session was resumed; becomes true after the GET verifies it.
  const sessionVerifiedRef = useRef<boolean>(
    typeof window === 'undefined' ||
    (() => { const s = loadSavedState(); return !s?.sessionCode || s.phase !== 'playing'; })(),
  );

  // Persist to localStorage
  useEffect(() => {
    if (state.phase !== 'setup') {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(GAME_STATE_KEY);
    }
  }, [state]);

  // Fire-and-forget DB write on every state change while playing.
  // Gated on sessionVerifiedRef so a reload never replays stale localStorage state into DB
  // before we've confirmed the session is still active.
  useEffect(() => {
    if (state.phase !== 'playing' || !state.sessionCode) return;
    if (!sessionVerifiedRef.current) return;
    lastWriteTimeRef.current = Date.now();
    api.updateLiveGame(state.sessionCode, state).catch(() => {/* silent */});
  }, [state]);

  // On mount: if we resumed a playing session from localStorage, verify it's still active.
  // If yes  → sync to current DB state (don't replay potentially stale localStorage).
  // If no   → clear the sessionCode so we don't write to a dead session.
  useEffect(() => {
    if (sessionVerifiedRef.current) return;
    const saved = loadSavedState();
    if (!saved?.sessionCode) { sessionVerifiedRef.current = true; return; }
    api.getLiveGame(saved.sessionCode)
      .then((res) => {
        sessionVerifiedRef.current = true;
        if (res.is_active) {
          setState((prev) => ({
            ...res.state,
            sessionCode: prev.sessionCode,
            sessionSeats: prev.sessionSeats,
          }));
        } else {
          setState((prev) => ({ ...prev, sessionCode: null, sessionSeats: null }));
        }
      })
      .catch(() => {
        sessionVerifiedRef.current = true;
        setState((prev) => ({ ...prev, sessionCode: null, sessionSeats: null }));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll for incoming remote changes
  useEffect(() => {
    if (state.phase !== 'playing' || !state.sessionCode) return;
    const code = state.sessionCode;

    const poll = async () => {
      // Skip if we just wrote (avoid reading back our own write)
      if (Date.now() - lastWriteTimeRef.current < 500) return;
      // Skip if tab is hidden
      if (document.visibilityState === 'hidden') return;
      try {
        const res = await api.getLiveGame(code);
        if (!res.is_active) return;
        if (res.updated_at === lastSeenUpdatedAtRef.current) return;
        lastSeenUpdatedAtRef.current = res.updated_at;
        // Only apply if the incoming state is different from ours
        // (prevents stomping local state with stale data)
        setState((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(res.state)) return prev;
          return { ...res.state, sessionCode: prev.sessionCode, sessionSeats: prev.sessionSeats };
        });
      } catch {/* silent */}
    };

    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [state.phase, state.sessionCode]);

  const handleStart = async (playerSetups: PlayerSetup[], startingLife: number, turnTimerSeconds: number) => {
    // Mark verified immediately — this is a fresh game, no localStorage session to worry about
    sessionVerifiedRef.current = true;
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
      const session = await api.createLiveGame(newState, seats);
      setState((prev) => ({
        ...prev,
        sessionCode: session.seats[prev.players.find((p) => p.position === 'bottom')?.position ?? 'bottom'] ?? null,
        sessionSeats: session.seats,
      }));
    } catch {/* silent — live session is optional */}
  };

  const handleUpdate = (newState: GameManagerState) => {
    setState(newState);
  };

  const handleEndGame = () => {
    setState((prev) => {
      if (prev.sessionCode) api.deleteLiveGame(prev.sessionCode).catch(() => {});
      return { ...prev, phase: 'ended' };
    });
  };

  const handleLogGame = () => {
    localStorage.removeItem(GAME_STATE_KEY);
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
    localStorage.removeItem(GAME_STATE_KEY);
    router.push(`/games/detail?id=${id}`);
  };

  const handleNewGame = () => {
    if (state.sessionCode) {
      api.deleteLiveGame(state.sessionCode).catch(() => {/* silent */});
    }
    localStorage.removeItem(GAME_STATE_KEY);
    setSetupPrefill(null);
    setState(DEFAULT_STATE);
  };

  const handleDiscard = () => {
    if (state.sessionCode) {
      api.deleteLiveGame(state.sessionCode).catch(() => {/* silent */});
    }
    localStorage.removeItem(GAME_STATE_KEY);
    router.push('/games');
  };

  const handleRestartGame = (currentPlayers: PlayerState[]) => {
    if (state.sessionCode) {
      api.deleteLiveGame(state.sessionCode).catch(() => {/* silent */});
    }
    localStorage.removeItem(GAME_STATE_KEY);
    setIsResumed(false);
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

  if (state.phase === 'setup') {
    return <GameSetup onStart={handleStart} prefillPlayers={setupPrefill ?? undefined} />;
  }

  if (state.phase === 'playing') {
    return (
      <GameBoard
        state={state}
        onUpdate={handleUpdate}
        onEndGame={handleEndGame}
        onRestartGame={handleRestartGame}
        onLogGame={handleLogGame}
        onSaveGame={handleSaveGame}
        isResumed={isResumed}
      />
    );
  }

  return (
    <GameEndSummary
      players={state.players}
      turnNumber={state.turnNumber}
      startingLife={state.startingLife}
      commanderDamage={state.commanderDamage}
      onLogGame={handleLogGame}
      onNewGame={handleNewGame}
      onDiscard={handleDiscard}
    />
  );
}
