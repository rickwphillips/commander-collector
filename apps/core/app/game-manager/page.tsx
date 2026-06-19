'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthGuard';
import { GameSetup, type GameSetupSubmit } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { GameEndSummary } from './components/GameEndSummary';
import type { GameManagerState, PlayerSetup, PlayerState, CommanderDamageMap } from './types';
import type { GameResultInput, GameType } from '@/lib/types';
import { isSeatFilled } from '@/lib/types';
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

/**
 * A state is resumable from the DB if it represents an active session: either
 * seating (filling chairs) or playing. Anything else (empty, ended, or with
 * an out-of-range currentPlayerIdx) is treated as junk and the session is
 * deleted on load.
 */
function isResumableState(state: GameManagerState): boolean {
  if (!state.players || state.players.length === 0) return false;
  if (state.phase !== 'seating' && state.phase !== 'playing') return false;
  if (state.currentPlayerIdx < 0 || state.currentPlayerIdx >= state.players.length) return false;
  if (!state.commanderDamage) return false;
  return true;
}

function emptySeatAt(position: PlayerState['position']): PlayerState {
  return {
    playerId: '',
    deckId: '',
    playerName: '',
    deckName: '',
    commander: { name: '' },
    position,
    life: 0,
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
  };
}

function buildSeatingState(payload: GameSetupSubmit, prefill?: PlayerSetup[]): GameManagerState {
  const positions = POSITIONS_BY_COUNT[payload.playerCount] ?? POSITIONS_BY_COUNT[4];
  const players: PlayerState[] = positions.map((position, i) => {
    const seed = prefill?.[i];
    const base = emptySeatAt(position);
    if (seed) {
      return {
        ...base,
        playerId: seed.playerId,
        deckId: seed.deckId,
        playerName: seed.playerName,
        deckName: seed.deckName,
        commander: seed.commander,
        partner: seed.partner,
        life: payload.startingLife,
      };
    }
    return { ...base, life: payload.startingLife };
  });

  const commanderDamage: CommanderDamageMap = {};
  for (let target = 0; target < players.length; target++) {
    commanderDamage[target] = {};
    for (let source = 0; source < players.length; source++) {
      if (source !== target) commanderDamage[target][source] = [0, 0];
    }
  }

  return {
    players,
    commanderDamage,
    currentPlayerIdx: 0,
    turnNumber: 1,
    startingLife: payload.startingLife,
    phase: 'seating',
    turnTimerSeconds: payload.turnTimerSeconds,
    turnStartTime: 0,
    notes: '',
    gameType: payload.gameType,
  };
}

export default function GameManagerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [state, setState] = useState<GameManagerState>(DEFAULT_STATE);
  const [restartPrefill, setRestartPrefill] = useState<PlayerSetup[] | null>(null);

  const [dbCheckComplete, setDbCheckComplete] = useState<boolean>(false);
  const dbCheckRef = useRef<boolean>(false);

  /**
   * The canonical mutation funnel: update React state AND persist to the live
   * session row. Replaces a pair of useEffects (one watching `state`, one
   * watching `state.sessionCode` with a 100ms debounce) that previously kept
   * the DB in sync after the fact. Calling commit() at the moment of mutation
   * removes the effect-driven sync and its timing-ref scaffolding.
   *
   * Persistence is skipped when there is no sessionCode or the phase is not
   * 'seating' / 'playing' (e.g. setup screen, ended summary, resume load).
   */
  const commit = useCallback(
    (updater: GameManagerState | ((prev: GameManagerState) => GameManagerState)) => {
      setState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (next.sessionCode && (next.phase === 'seating' || next.phase === 'playing')) {
          api.updateLiveGame(next.sessionCode, next).catch(() => {});
        }
        return next;
      });
    },
    [],
  );

  // On mount: query DB for active game session. Resume seating or playing.
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
          if (isResumableState(res.state)) {
            loadedGame = {
              ...res.state,
              sessionCode: res.session_code,
              sessionSeats: res.session_seats ?? null,
            };
          } else if (sessionCode) {
            api.deleteLiveGame(sessionCode).catch(() => {});
          }
        }
      } catch {
        /* no active session */
      }

      if (loadedGame) setState(loadedGame);
      setDbCheckComplete(true);
    };

    checkAndLoad();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guard against accidental nav while the game is actually being played.
  // Seating phase intentionally does NOT trigger this since the user may want
  // to back out before committing to a game.
  useEffect(() => {
    if (state.phase !== 'playing') return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [state.phase]);

  // SSE stream for remote events (host side). Only runs in 'playing' phase;
  // remotes should never connect before the game has actually started.
  useEffect(() => {
    if (state.phase !== 'playing' || !state.sessionCode || !dbCheckComplete) return;
    const code = state.sessionCode;
    const closeStream = api.openLiveGameHostStream(
      code,
      (events) => {
        commit((prev) => events.reduce((s, ev) => applyEvent(s, ev), prev));
      },
      () => { /* session inactive — host controls */ },
    );
    return () => { closeStream(); };
  }, [state.phase, state.sessionCode, dbCheckComplete, commit]);

  const handleSetupSubmit = async (payload: GameSetupSubmit) => {
    dbCheckRef.current = true;
    setDbCheckComplete(true);
    if (state.sessionCode) {
      try { await api.deleteLiveGame(state.sessionCode); } catch { /* ok */ }
    }
    const newState = buildSeatingState(payload, restartPrefill ?? undefined);
    // Direct setState here: no sessionCode yet, so commit() would skip persistence
    // anyway. The first persist happens once the sessionCode arrives below.
    setState(newState);
    setRestartPrefill(null);

    try {
      const seats = newState.players.map((p) => p.position);
      const session = await api.createLiveGame(newState, seats, user?.id ?? undefined);
      const bottomSeat = newState.players.find((p) => p.position === 'bottom')?.position ?? 'bottom';
      const newSessionCode = session.seats[bottomSeat] ?? null;
      // commit() here: writes the full state (including any seat picks the
      // user made while createLiveGame was in flight) in a single DB call.
      commit((prev) => ({ ...prev, sessionCode: newSessionCode, sessionSeats: session.seats }));
    } catch (err) {
      console.error('[GameManager] createLiveGame failed during seating:', err);
    }
  };

  const handleUpdate = commit;

  const handleSeatUpdate = (idx: number, setup: PlayerSetup) => {
    commit((prev) => ({
      ...prev,
      players: prev.players.map((p, i) =>
        i === idx
          ? {
              ...p,
              playerId: setup.playerId,
              deckId: setup.deckId,
              playerName: setup.playerName,
              deckName: setup.deckName,
              commander: setup.commander,
              partner: setup.partner,
            }
          : p,
      ),
    }));
  };

  const handleStartGame = () => {
    commit((prev) => {
      if (prev.phase !== 'seating') return prev;
      if (!prev.players.every(isSeatFilled)) return prev;
      return { ...prev, phase: 'playing', turnStartTime: Date.now() };
    });
  };

  const handleEndGame = () => {
    commit((prev) => {
      if (prev.sessionCode) api.deleteLiveGame(prev.sessionCode).catch(() => {});
      // phase: 'ended' falls outside commit()'s persist guard, so the deleted
      // session is the only DB-side effect here.
      return { ...prev, phase: 'ended' };
    });
  };

  const handleLogGame = () => {
    router.push('/games/new');
  };

  const handleSaveGame = async (currentState: GameManagerState) => {
    if (currentState.sessionCode) {
      api.deleteLiveGame(currentState.sessionCode).catch(() => {});
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
    const gameType: GameType = currentState.gameType ?? 'standard';
    const { id } = await api.createGame({ played_at: today, notes: cleanNotes, game_type: gameType, results });
    router.push(`/games/detail?id=${id}`);
  };

  const handleNewGame = () => {
    if (state.sessionCode) {
      api.deleteLiveGame(state.sessionCode).catch(() => {/* silent */});
    }
    setRestartPrefill(null);
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
    setRestartPrefill(currentPlayers.map((p) => ({
      playerId: p.playerId,
      deckId: p.deckId,
      playerName: p.playerName,
      deckName: p.deckName,
      commander: p.commander,
      partner: p.partner,
    })));
    setState({ ...DEFAULT_STATE });
  };

  if (!dbCheckComplete) {
    return null;
  }

  // Active session: seating or playing. Both go through GameBoard.
  if (isResumableState(state)) {
    return (
      <GameBoard
        state={state}
        onUpdate={handleUpdate}
        onSeatUpdate={handleSeatUpdate}
        onStartGame={handleStartGame}
        onEndGame={handleEndGame}
        onRestartGame={handleRestartGame}
        onLogGame={handleLogGame}
        onSaveGame={handleSaveGame}
        onDiscard={handleDiscard}
      />
    );
  }

  if (state.phase === 'ended' && state.players.length > 0 && state.firstPlayerIdx != null) {
    return (
      <GameEndSummary
        players={state.players}
        turnNumber={state.turnNumber}
        startingLife={state.startingLife}
        commanderDamage={state.commanderDamage}
        onLogGame={handleLogGame}
        onNewGame={handleNewGame}
        onDiscard={() => setState(DEFAULT_STATE)}
      />
    );
  }

  // Setup: simplified table-wide options. Restart prefill is held in
  // restartPrefill and applied once the user submits.
  return (
    <GameSetup
      onStart={handleSetupSubmit}
      initial={
        restartPrefill
          ? { playerCount: restartPrefill.length, startingLife: state.startingLife }
          : undefined
      }
    />
  );
}

