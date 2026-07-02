'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthGuard';
import { GameSetup, type GameSetupSubmit } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { GameEndSummary } from './components/GameEndSummary';
import type { GameManagerState, PlayerSetup, PlayerState, CommanderDamageMap } from './types';
import type { GameResultInput, GameType, GameLogEvent, DeckWithPlayer } from '@/lib/types';
import { isSeatFilled } from '@/lib/types';
import { api } from '@/lib/api';
import { applyEvent } from './remoteTransforms';
import { buildGameStartedEvent, diffGameEvents } from './gameLog';

const POSITIONS_BY_COUNT: Record<number, Array<PlayerState['position']>> = {
  2: ['bottom', 'top'],
  3: ['bottom', 'left', 'top'],
  4: ['bottom', 'left', 'top', 'right'],
};

// 2HG pairs the four seats into two teams of two. The pairing follows the
// clockwise turn order (bottom → left → top → right) so teammates are adjacent:
// Team 1 = bottom + left, Team 2 = top + right.
const TEAM_BY_POSITION: Record<PlayerState['position'], number> = {
  bottom: 1,
  left: 1,
  top: 2,
  right: 2,
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
    teamNumber: null,
  };
}

// Fisher-Yates shuffle (in place), used to randomize player selection.
function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build a random seating prefill: up to `count` seats, each a UNIQUE player with
// one randomly chosen deck they own. Returns fewer entries when not enough
// players own decks (remaining seats are left empty for manual selection).
function buildRandomPrefill(decks: DeckWithPlayer[], count: number): PlayerSetup[] {
  const byPlayer = new Map<string, DeckWithPlayer[]>();
  for (const d of decks) {
    const list = byPlayer.get(d.player_id);
    if (list) list.push(d);
    else byPlayer.set(d.player_id, [d]);
  }
  const playerIds = shuffleInPlace([...byPlayer.keys()]).slice(0, count);
  return playerIds.map((pid) => {
    const owned = byPlayer.get(pid)!;
    const deck = owned[Math.floor(Math.random() * owned.length)];
    return {
      playerId: deck.player_id,
      deckId: deck.id,
      playerName: deck.player_name,
      deckName: deck.name,
      commander: { name: deck.commander },
      partner: deck.partner ? { name: deck.partner } : undefined,
    };
  });
}

function buildSeatingState(payload: GameSetupSubmit, prefill?: PlayerSetup[]): GameManagerState {
  // 2HG is always four seats (two teams of two), regardless of the setup count.
  const is2hg = payload.gameType === '2hg';
  const positions = is2hg
    ? POSITIONS_BY_COUNT[4]
    : POSITIONS_BY_COUNT[payload.playerCount] ?? POSITIONS_BY_COUNT[4];
  const players: PlayerState[] = positions.map((position, i) => {
    const seed = prefill?.[i];
    const base = emptySeatAt(position);
    const teamNumber = is2hg ? TEAM_BY_POSITION[position] : null;
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
        teamNumber,
      };
    }
    return { ...base, life: payload.startingLife, teamNumber };
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

  // --- Game event log ------------------------------------------------------
  // Events are derived by diffing successive states (see gameLog.ts) and
  // buffered on the server (php-api/game-log.php) while a game is in progress,
  // then promoted to the durable game_logs row on successful completion.
  //
  // prevStateRef drives the idempotent diff (so StrictMode's double-invoked
  // renders never double-log). loggedSessionRef marks the session we are
  // actively logging, so resume-from-DB continues an existing buffer instead of
  // re-seeding and clearing it. Events queue in pendingLogRef and flush on a
  // short debounce so rapid actions (e.g. holding a life button) coalesce into
  // one append.
  const prevStateRef = useRef<GameManagerState>(DEFAULT_STATE);
  const loggedSessionRef = useRef<string | null>(null);
  const pendingLogRef = useRef<GameLogEvent[]>([]);
  const logFlushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Set by a host long-press (step turn backwards) so the next diffed turn
  // change logs as turn_revert instead of pass_turn.
  const turnRevertRef = useRef(false);

  const flushLog = useCallback(async () => {
    if (logFlushTimer.current) {
      clearTimeout(logFlushTimer.current);
      logFlushTimer.current = null;
    }
    const code = loggedSessionRef.current;
    const events = pendingLogRef.current;
    if (!code || events.length === 0) return;
    pendingLogRef.current = [];
    try {
      await api.gameLog.append(code, events);
    } catch {
      /* best-effort: logging never blocks play */
    }
  }, []);

  const logEvents = useCallback(
    (events: GameLogEvent[]) => {
      if (!events.length || !loggedSessionRef.current) return;
      pendingLogRef.current.push(...events);
      if (logFlushTimer.current) clearTimeout(logFlushTimer.current);
      logFlushTimer.current = setTimeout(() => {
        flushLog();
      }, 250);
    },
    [flushLog],
  );

  // Abandon the current game's log: drop pending events and clear the server
  // buffer. Used by every path that throws a game away (discard, new, restart,
  // starting a fresh setup over an existing session).
  // Called by GameBoard right before it steps the turn backwards.
  const markTurnRevert = useCallback(() => {
    turnRevertRef.current = true;
  }, []);

  const discardLog = useCallback((code: string | null | undefined) => {
    if (logFlushTimer.current) {
      clearTimeout(logFlushTimer.current);
      logFlushTimer.current = null;
    }
    pendingLogRef.current = [];
    loggedSessionRef.current = null;
    if (code) api.gameLog.cancel(code).catch(() => {});
  }, []);

  // Fetch the current game's buffered log entries for the in-game viewer.
  // Flush any pending events first so the viewer reflects the latest actions.
  const viewGameLog = useCallback(async () => {
    const code = loggedSessionRef.current ?? state.sessionCode ?? null;
    if (!code) return [];
    await flushLog();
    try {
      const res = await api.gameLog.read(code);
      return res.events ?? [];
    } catch {
      return [];
    }
  }, [flushLog, state.sessionCode]);

  // Derive and buffer log events whenever state advances during an actively
  // logged game. Idempotent: re-running with an unchanged state diffs to nothing.
  useEffect(() => {
    const prev = prevStateRef.current;
    const code = state.sessionCode ?? null;
    if (state.phase === 'playing' && code && loggedSessionRef.current === code) {
      const reverse = turnRevertRef.current;
      const events = diffGameEvents(prev, state, { reverse });
      // Clear the reverse flag once the backwards turn change has been logged.
      if (reverse && events.some((e) => e.type === 'turn_revert')) {
        turnRevertRef.current = false;
      }
      if (events.length) logEvents(events);
    }
    prevStateRef.current = state;
  }, [state, logEvents]);

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

      if (loadedGame) {
        setState(loadedGame);
        // Resuming a game already in progress: continue appending to its
        // existing server buffer. Do NOT re-seed (that would clear it).
        if (loadedGame.phase === 'playing' && loadedGame.sessionCode) {
          loggedSessionRef.current = loadedGame.sessionCode;
          prevStateRef.current = loadedGame;
        }
      }
      setDbCheckComplete(true);
    };

    checkAndLoad();
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
  // remotes should never connect before the game has actually started. Remote
  // phone panels are disabled for 2HG, so the host does not listen there.
  useEffect(() => {
    if (state.phase !== 'playing' || !state.sessionCode || !dbCheckComplete) return;
    if (state.gameType === '2hg') return;
    const code = state.sessionCode;
    const closeStream = api.openLiveGameHostStream(
      code,
      (events) => {
        commit((prev) => events.reduce((s, ev) => applyEvent(s, ev), prev));
      },
      () => { /* session inactive — host controls */ },
    );
    return () => { closeStream(); };
  }, [state.phase, state.sessionCode, state.gameType, dbCheckComplete, commit]);

  const handleSetupSubmit = async (payload: GameSetupSubmit) => {
    dbCheckRef.current = true;
    setDbCheckComplete(true);
    if (state.sessionCode) {
      discardLog(state.sessionCode);
      try { await api.deleteLiveGame(state.sessionCode); } catch { /* ok */ }
    }
    // Random fill: assign each seat a unique player and one of their own decks.
    // Falls back to any restart prefill (or empty seats) if the fetch fails.
    let prefill: PlayerSetup[] | undefined = restartPrefill ?? undefined;
    if (payload.random) {
      try {
        const decks = await api.getDecks();
        const seatCount = payload.gameType === '2hg' ? 4 : payload.playerCount;
        const randomPrefill = buildRandomPrefill(decks, seatCount);
        if (randomPrefill.length > 0) prefill = randomPrefill;
      } catch (err) {
        console.error('[GameManager] random seat fill failed:', err);
      }
    }
    const newState = buildSeatingState(payload, prefill);
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
    if (state.phase !== 'seating') return;
    if (!state.players.every(isSeatFilled)) return;
    const next: GameManagerState = { ...state, phase: 'playing', turnStartTime: Date.now() };
    commit(next);
    // Begin logging this game: reset the server buffer and seed the opening
    // event. This is the only genuine seating -> playing transition; resume
    // does not pass through here, so an in-progress buffer is never cleared.
    if (next.sessionCode) {
      loggedSessionRef.current = next.sessionCode;
      prevStateRef.current = next;
      pendingLogRef.current = [];
      api.gameLog.start(next.sessionCode, [buildGameStartedEvent(next)]).catch(() => {});
    }
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
    // Flush any buffered events before the server reads the buffer to promote
    // it into the durable game_logs row.
    await flushLog();
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const gameType: GameType = currentState.gameType ?? 'standard';

    let results: GameResultInput[];
    if (gameType === '2hg') {
      // 2HG resolves at the team level: the surviving team places 1st, the
      // eliminated team places 2nd. Every result carries its team_number, which
      // the games.php endpoint requires for 2HG.
      const winningTeam = currentState.players.find((p) => !p.isEliminated)?.teamNumber ?? null;
      results = currentState.players.map((p) => {
        const won = p.teamNumber != null && p.teamNumber === winningTeam;
        return {
          deck_id: p.deckId,
          player_id: p.playerId,
          finish_position: won ? 1 : 2,
          eliminated_turn: won ? null : p.eliminatedTurn,
          team_number: p.teamNumber ?? null,
        };
      });
    } else {
      const winner = currentState.players.find((p) => !p.isEliminated);
      const losers = currentState.players
        .filter((p) => p.isEliminated)
        .sort((a, b) => (b.eliminatedTurn ?? 0) - (a.eliminatedTurn ?? 0));
      results = [
        ...(winner ? [{ deck_id: winner.deckId, player_id: winner.playerId, finish_position: 1, eliminated_turn: null, team_number: null }] : []),
        ...losers.map((p, i) => ({ deck_id: p.deckId, player_id: p.playerId, finish_position: i + 2, eliminated_turn: p.eliminatedTurn, team_number: null })),
      ];
    }
    const cleanNotes = currentState.notes.replace(/\[(?:cmdkill|poisonkill):[^\]]+\]\s*/g, '').trim() || null;
    // Pass session_code so games.php promotes this game's buffered event log
    // into one durable game_logs row and clears the buffer.
    const { id } = await api.createGame({
      played_at: today,
      notes: cleanNotes,
      game_type: gameType,
      results,
      session_code: currentState.sessionCode ?? null,
    });
    loggedSessionRef.current = null;
    router.push(`/games/detail?id=${id}`);
  };

  const handleNewGame = () => {
    if (state.sessionCode) {
      discardLog(state.sessionCode);
      api.deleteLiveGame(state.sessionCode).catch(() => {/* silent */});
    }
    setRestartPrefill(null);
    setState(DEFAULT_STATE);
  };

  const handleDiscard = () => {
    if (state.sessionCode) {
      discardLog(state.sessionCode);
      api.deleteLiveGame(state.sessionCode).catch(() => {/* silent */});
    }
    router.push('/games');
  };

  const handleRestartGame = (currentPlayers: PlayerState[]) => {
    if (state.sessionCode) {
      discardLog(state.sessionCode);
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
        onLogEvent={logEvents}
        onViewLog={viewGameLog}
        onTurnRevert={markTurnRevert}
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
        onDiscard={() => { discardLog(state.sessionCode); setState(DEFAULT_STATE); }}
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

