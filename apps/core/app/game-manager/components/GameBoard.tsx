'use client';

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Box, Button, Typography, IconButton, Stack, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { PlayerPanel } from './PlayerPanel';
import { ReadOnlyPlayerPanel } from './ReadOnlyPlayerPanel';
import { SeatingCard } from './SeatingCard';
import { CenterZone } from './CenterZone';
import { TeamPanel, type TeamMember } from './TeamPanel';
import { SeatPickerModal } from './SeatPickerModal';
import { api } from '@/lib/api';
import { isSeatFilled } from '@/lib/types';
import { teamLabel, teamName, otherTeam } from '@/lib/teams';
import { BracketMismatchBanner } from '@/components/BracketMismatchBanner';
import type { Player, DeckWithPlayer, PlayerSetup, LiveGameEvent, DistributiveOmit } from '@/lib/types';
import type { GameManagerState, PlayerState } from '../types';
import {
  applyEvent,
  applyLifeKillAttr,
  applyPassTurn,
  applyPoisonKillAttr,
  applyPrevTurn,
  CLOCKWISE,
} from '../remoteTransforms';
import { detectSideEffects, type SideEffect } from '../detectSideEffects';

type RollPhase = 'idle' | 'rolling' | 'done';

interface RollState {
  phase: RollPhase;
  highlightIdx: number | null;
  finalIdx: number | null;
}

const IDLE_ROLL_STATE: RollState = { phase: 'idle', highlightIdx: null, finalIdx: null };

// Backdrop intro-reveal timing. STEP is the per-seat stagger; FADE mirrors the
// CommanderArt cbReveal duration. The active-turn highlight is held off until the
// last seat's fade completes: (seats - 1) * STEP + FADE.
const BG_REVEAL_STEP_MS = 900;
const BG_FADE_MS = 800;

function getActiveOpponents(players: PlayerState[], excludeIdx: number) {
  return players
    .map((p, i) => ({ name: p.playerName, idx: i }))
    .filter((_, i) => i !== excludeIdx && !players[i].isEliminated);
}

/**
 * Two-Headed Giant start-of-game roll: every active player rolls a d20. The
 * roll is only redone when the highest roll is tied across opposing teams — a
 * tie between teammates does not require a reroll. The team of the highest
 * roller takes the first turn. Returns the winning seat index plus a human
 * note recording every roll for the game log.
 */
export type TeamRollResult = {
  winnerIdx: number;
  detail: string;
  rolls: { idx: number; roll: number }[];
};

export function rollForFirstTeam(
  players: PlayerState[],
  active: number[],
): TeamRollResult {
  let rolls: { idx: number; roll: number }[] = [];
  for (let attempt = 0; attempt < 50; attempt++) {
    rolls = active.map((idx) => ({ idx, roll: 1 + Math.floor(Math.random() * 20) }));
    const max = Math.max(...rolls.map((r) => r.roll));
    const top = rolls.filter((r) => r.roll === max);
    const topTeams = new Set(top.map((r) => players[r.idx].teamNumber));
    if (topTeams.size > 1) continue; // highest roll tied across teams — reroll
    const winnerIdx = top[0].idx;
    const team = players[winnerIdx].teamNumber;
    const summary = rolls.map((r) => `${players[r.idx].playerName} ${r.roll}`).join(', ');
    return {
      winnerIdx,
      detail: `2HG roll (d20): ${summary}. Team ${team} (${players[winnerIdx].playerName}) goes first.`,
      rolls,
    };
  }
  const winnerIdx = active[0];
  return { winnerIdx, detail: `2HG roll: Team ${players[winnerIdx].teamNumber} goes first.`, rolls };
}

interface GameBoardProps {
  state: GameManagerState;
  onUpdate: (newState: GameManagerState | ((prev: GameManagerState) => GameManagerState)) => void;
  onEndGame: () => void;
  onRestartGame: (players: PlayerState[]) => void;
  onLogGame: () => void;
  onSaveGame: (state: GameManagerState) => Promise<void>;
  /** Seating-phase only: commit a seat's player/deck/commander selection. */
  onSeatUpdate?: (idx: number, setup: PlayerSetup) => void;
  /** Seating-phase only: flip to 'playing' once all seats are filled. */
  onStartGame?: () => void;
  /** Seating-phase only: cancel the game and return to /games. */
  onDiscard?: () => void;
  /** Log die-roll events (values live in the dice UI, not GameManagerState). */
  onLogEvent?: (events: import('@/lib/types').GameLogEvent[]) => void;
  /** Fetch the current game's buffered log entries for the in-game viewer. */
  onViewLog?: () => Promise<import('@/lib/types').GameLogEntry[]>;
  /** Called right before the turn is stepped backwards, so it logs as a revert. */
  onTurnRevert?: () => void;
}

export function GameBoard({
  state,
  onUpdate,
  onEndGame,
  onRestartGame,
  onSaveGame,
  onSeatUpdate,
  onStartGame,
  onDiscard,
  onLogEvent,
  onViewLog,
  onTurnRevert,
}: GameBoardProps) {
  const { players, commanderDamage, currentPlayerIdx, turnNumber, turnTimerSeconds, turnStartTime, startingLife } = state;

  const [rollState, setRollState] = useState<RollState>(IDLE_ROLL_STATE);
  const [firstPlayerSet, setFirstPlayerSet] = useState(state.firstPlayerIdx != null);
  // If the game was ALREADY in progress at mount (a reload/resume), the seat
  // backdrops fade in together rather than staggering — the staggered turn-order
  // reveal is reserved for the moment a first player is freshly rolled this session.
  // useState initializer captures the mount-time value once (stable across renders).
  const [bgWasPreset] = useState(() => state.firstPlayerIdx != null);
  // Active-turn highlight is held off during the fresh-roll intro reveal and
  // switched on once the final seat's backdrop finishes fading in. On a reload
  // (bgWasPreset) it is on from the start.
  const [turnIndicatorOn, setTurnIndicatorOn] = useState(bgWasPreset);
  const introTimerStartedRef = useRef(bgWasPreset);
  useEffect(() => {
    if (introTimerStartedRef.current || !firstPlayerSet) return;
    introTimerStartedRef.current = true;
    const total = Math.max(0, players.length - 1) * BG_REVEAL_STEP_MS + BG_FADE_MS;
    const id = setTimeout(() => setTurnIndicatorOn(true), total);
    return () => clearTimeout(id);
  }, [firstPlayerSet, players.length]);
  const [winnerCountdown, setWinnerCountdown] = useState<number | null>(null);
  const [prevWinnerKey, setPrevWinnerKey] = useState<string | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const winnerSavedRef = useRef(false);
  const saveAttemptsRef = useRef(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lifeKillPrompt, setLifeKillPrompt] = useState<{ targetIdx: number } | null>(null);
  const [poisonKillPrompt, setPoisonKillPrompt] = useState<{ targetIdx: number } | null>(null);
  const [monarchTransfer, setMonarchTransfer] = useState<{ fromPos: string | null; toPos: string | null }>({ fromPos: null, toPos: null });
  const [highlightMode, setHighlightMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [viewingPlayerIdx, _setViewingPlayerIdxRaw] = useState<number | null>(null);
  const settingsLoadedRef = useRef(false);

  // Seating phase: per-seat picker state and loaded player/deck lists.
  const [pickerSeatIdx, setPickerSeatIdx] = useState<number | null>(null);
  const [pickerPlayers, setPickerPlayers] = useState<Player[]>([]);
  const [pickerDecks, setPickerDecks] = useState<DeckWithPlayer[]>([]);
  const seatingDataLoadedRef = useRef(false);

  useEffect(() => {
    if (state.phase !== 'seating' || seatingDataLoadedRef.current) return;
    seatingDataLoadedRef.current = true;
    Promise.all([api.getDecks(), api.getPlayers()])
      .then(([decks, players]) => {
        setPickerDecks(decks);
        setPickerPlayers(players);
      })
      .catch(() => { /* leave empty; user can refresh */ });
  }, [state.phase]);

  // Sync local firstPlayer state when it arrives from the DB (resume) or a
  // remote event. Adjusting during render on the prop change avoids a
  // synchronous setState in an effect.
  const [prevStateFirstIdx, setPrevStateFirstIdx] = useState(state.firstPlayerIdx);
  if (state.firstPlayerIdx !== prevStateFirstIdx) {
    setPrevStateFirstIdx(state.firstPlayerIdx);
    if (state.firstPlayerIdx != null && !firstPlayerSet) {
      setFirstPlayerSet(true);
    }
  }

  // The winner is derived from the board, not stored in effect-set state: in 2HG
  // the game ends when only one team still has live players; in standard play
  // when one seat remains. Deriving it keeps it consistent with `players` on
  // every render (from direct handlers OR remote events applied via setState).
  const winner: PlayerState | null = (() => {
    if (!firstPlayerSet) return null;
    if (!players.some((p) => p.isEliminated)) return null;
    const remaining = players.filter((p) => !p.isEliminated);
    if (state.gameType === '2hg') {
      const remainingTeams = new Set(remaining.map((p) => p.teamNumber));
      return remainingTeams.size === 1 && remaining.length > 0 ? remaining[0] : null;
    }
    return remaining.length === 1 ? remaining[0] : null;
  })();
  const winnerKey = winner
    ? state.gameType === '2hg' && winner.teamNumber != null
      ? `team-${winner.teamNumber}`
      : winner.playerId
    : null;

  // Start a 15s auto-save countdown when a winner appears, and clear it if a
  // correction restores a contested board. Adjusting state during render on the
  // winner-key change keeps this out of an effect (React's "storing information
  // from previous renders" pattern), so no synchronous setState runs in an effect.
  if (winnerKey !== prevWinnerKey) {
    setPrevWinnerKey(winnerKey);
    setWinnerCountdown(winnerKey ? 15 : null);
  }

  // Tick the countdown down each second. The setState runs inside the timer
  // callback (deferred), not synchronously in the effect body.
  useEffect(() => {
    if (winnerCountdown === null || winnerCountdown <= 0) return;
    const t = setTimeout(() => setWinnerCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [winnerCountdown]);

  // Save the finished game, retrying transient failures a bounded number of
  // times. onSaveGame navigates away on success; on failure it rejects without
  // navigating, so we release the guard. Auto-save re-arms the countdown for
  // another attempt up to MAX_SAVE_ATTEMPTS, then stops (banner shows a retry
  // prompt); a manual Save Now resets the budget and always attempts.
  const MAX_SAVE_ATTEMPTS = 3;
  const saveWithRetry = useCallback((auto: boolean) => {
    winnerSavedRef.current = true;
    if (!auto) saveAttemptsRef.current = 0;
    saveAttemptsRef.current += 1;
    setSaveFailed(false);
    if (!auto) setWinnerCountdown(null);
    Promise.resolve(onSaveGame(state)).catch(() => {
      winnerSavedRef.current = false;
      if (auto && saveAttemptsRef.current < MAX_SAVE_ATTEMPTS) {
        setWinnerCountdown(5); // re-arm one more bounded auto-retry
      } else {
        setWinnerCountdown(null);
        setSaveFailed(true); // stop hammering; Save Now stays available
      }
    });
  }, [onSaveGame, state]);

  // When the countdown reaches 0, auto-save the current (still-winning) board.
  useEffect(() => {
    if (winnerCountdown === 0 && !winnerSavedRef.current) saveWithRetry(true);
  }, [winnerCountdown, saveWithRetry]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Load game settings from DB on mount
  useEffect(() => {
    if (settingsLoadedRef.current) return;
    settingsLoadedRef.current = true;

    api.getGameSettings()
      .then((settings) => {
        setHighlightMode(settings.highlight_mode);
        setSoundEnabled(settings.sound_enabled);
        const timerVal = settings.turn_timer_enabled ? settings.turn_timer_seconds : 0;
        if (timerVal !== turnTimerSeconds) {
          onUpdate((prev) => ({ ...prev, turnTimerSeconds: timerVal }));
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-apply all settings when game resets (firstPlayerSet goes false)
  const firstPlayerSetRef = useRef(firstPlayerSet);
  useEffect(() => {
    const wasGameActive = firstPlayerSetRef.current;
    firstPlayerSetRef.current = firstPlayerSet;

    if (wasGameActive && !firstPlayerSet) {
      // Game was reset, re-apply UI settings from DB
      api.getGameSettings()
        .then((settings) => {
          setHighlightMode(settings.highlight_mode);
          setSoundEnabled(settings.sound_enabled);
        })
        .catch(() => {});
    }
  }, [firstPlayerSet, onUpdate]);


  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  // Wall-clock, refreshed by the per-second tick, so remote-connection freshness
  // is computed from state instead of an impure Date.now() call during render.
  const [nowMs, setNowMs] = useState(0);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick the turn timer every second
  useEffect(() => {
    if (!firstPlayerSet) return;
    if (tickTimer.current) clearInterval(tickTimer.current);
    const tick = () => {
      const t = Date.now();
      setElapsedSeconds(Math.floor((t - turnStartTime) / 1000));
      setNowMs(t);
    };
    // Seed on the next macrotask (deferred, not a synchronous setState in the
    // effect body) so remote-connection freshness (nowMs) and the elapsed timer
    // are correct almost immediately instead of reading 0 until the first
    // interval callback fires ~1s later (which flashed every remote player as
    // disconnected for that first second).
    const seedTimer = setTimeout(tick, 0);
    tickTimer.current = setInterval(tick, 1000);
    return () => {
      clearTimeout(seedTimer);
      if (tickTimer.current) clearInterval(tickTimer.current);
    };
  }, [firstPlayerSet, turnStartTime]);

  // No explicit elapsed-seconds reset on turn change: turnStartTime already
  // advances per turn (handleNextTurn/handlePrevTurn set turnStartTime: Date.now()),
  // and the tick effect above re-runs whenever turnStartTime changes, picking up
  // the fresh value immediately.

  // Commit a first player. `note` overrides the default line (used by the 2HG
  // team roll to record its full d20 summary); a plain pick falls back to
  // "First player (chosen)".
  const handleChooseFirstPlayer = (idx: number, note?: string) => {
    const player = players[idx];
    const line = note ?? `First player (chosen): ${player?.playerName ?? '?'}`;
    const turnStartTime = Date.now();
    // Functional form so notes append onto the latest committed state and a
    // concurrent remote event isn't clobbered.
    onUpdate((prev) => ({
      ...prev,
      currentPlayerIdx: idx,
      firstPlayerIdx: idx,
      turnStartTime,
      notes: prev.notes ? `${prev.notes}\n${line}` : line,
    }));
    setRollState(IDLE_ROLL_STATE);
    setFirstPlayerSet(true);
  };

  const handleRestartGame = () => {
    setFirstPlayerSet(false);
    setRollState(IDLE_ROLL_STATE);
    onRestartGame(players);
  };

  const updateState = (patch: Partial<GameManagerState>) => {
    // Functional form: merge onto the latest committed state, not the render
    // closure's `state`, so an SSE remote event that landed after this render
    // isn't clobbered by the merge.
    onUpdate((prev) => ({ ...prev, ...patch }));
  };

  // Replaces a useState setter so the read-only overlay choice mirrors to the
  // shared game state in one event. Avoids the effect-driven sync that would
  // also fire on every unrelated state change.
  const setViewingPlayerIdx = (idx: number | null) => {
    _setViewingPlayerIdxRaw(idx);
    updateState({ viewingPlayerIdx: idx });
  };

  /**
   * Apply a side effect produced by `detectSideEffects`. Centralized here so the
   * host-handler path and the SSE-watch path produce identical UI behavior.
   */
  const applySideEffect = useCallback((fx: SideEffect) => {
    switch (fx.type) {
      case 'lifeKillPrompt':
        setLifeKillPrompt((prev) => prev ?? { targetIdx: fx.targetIdx });
        return;
      case 'poisonKillPrompt':
        setPoisonKillPrompt((prev) => prev ?? { targetIdx: fx.targetIdx });
        return;
      case 'monarchTransfer':
        setMonarchTransfer({ fromPos: fx.fromPos, toPos: fx.toPos });
        setTimeout(() => setMonarchTransfer({ fromPos: null, toPos: null }), 900);
        return;
    }
  }, []);

  // Stale-state-resistant prev pointer for diff-based side-effect detection.
  // This catches state changes from any source: host dispatchHostEvent calls
  // AND SSE events applied by page.tsx. Using useLayoutEffect makes the
  // resulting prompt feel synchronous with the user's action.
  const prevStateRef = useRef<GameManagerState>(state);
  useLayoutEffect(() => {
    const prev = prevStateRef.current;
    prevStateRef.current = state;
    if (prev === state) return;
    const fx = detectSideEffects(prev, state);
    fx.forEach(applySideEffect);
  }, [state, applySideEffect]);

  /**
   * Single funnel for host-initiated state mutations. Builds the next state via
   * the same `applyEvent` dispatcher the SSE path uses, then commits it. Side
   * effects fall out of the state diff via the useLayoutEffect above — meaning
   * a remote-driven life kill triggers the same attribution prompt as a host
   * button press.
   */
  const dispatchHostEvent = useCallback(
    (event: DistributiveOmit<LiveGameEvent, 'seat' | 'ts'>) => {
      const stamped = { ...event, seat: '__host__', ts: Date.now() } as LiveGameEvent;
      onUpdate((prev) => applyEvent(prev, stamped));
    },
    [onUpdate],
  );

  const handleLifeChange = (idx: number, delta: number) =>
    dispatchHostEvent({ type: 'life_change', playerIdx: idx, delta });

  const handlePoisonChange = (idx: number, delta: number) =>
    dispatchHostEvent({ type: 'poison_change', playerIdx: idx, delta });

  const handleCommanderTaxChange = (idx: number, delta: number, isPartner = false) =>
    dispatchHostEvent({ type: 'commander_tax_change', playerIdx: idx, delta, isPartner });

  const handleToggleMonarch = (idx: number) =>
    dispatchHostEvent({ type: 'toggle_monarch', playerIdx: idx });

  const handleToggleInitiative = (idx: number) =>
    dispatchHostEvent({ type: 'toggle_initiative', playerIdx: idx });

  const handleEnergyChange = (idx: number, delta: number) =>
    dispatchHostEvent({ type: 'energy_change', playerIdx: idx, delta });

  const handleExperienceChange = (idx: number, delta: number) =>
    dispatchHostEvent({ type: 'experience_change', playerIdx: idx, delta });

  const handleToggleCitysBlessing = (idx: number) =>
    dispatchHostEvent({ type: 'toggle_citys_blessing', playerIdx: idx });

  const handleCommanderDamageChange = (
    targetIdx: number,
    sourceIdx: number,
    isPartner: boolean,
    delta: number,
  ) =>
    dispatchHostEvent({
      type: 'commander_damage_change',
      targetIdx,
      sourceIdx,
      isPartner,
      delta,
    });

  const handleEliminate = (idx: number) =>
    dispatchHostEvent({ type: 'eliminate', playerIdx: idx });

  const handleUndoEliminate = (idx: number) =>
    dispatchHostEvent({ type: 'undo_eliminate', playerIdx: idx });

  const handleNextTurn = () => {
    // Recompute the turn advance from the latest committed state inside the
    // updater so a remote event landing after this render survives the write.
    onUpdate((prev) => {
      const next = applyPassTurn(prev);
      return next === prev
        ? prev
        : { ...prev, currentPlayerIdx: next.currentPlayerIdx, turnNumber: next.turnNumber, turnStartTime: next.turnStartTime };
    });
  };

  const handlePrevTurn = () => {
    // Decide whether a revert applies (and fire the log side effect) from the
    // render-closure state — turn structure isn't affected by remote life/counter
    // events — but perform the actual merge functionally so those events survive.
    if (applyPrevTurn(state) === state) return;
    // Flag the reversal so page.tsx logs turn_revert rather than pass_turn.
    onTurnRevert?.();
    onUpdate((prev) => {
      const next = applyPrevTurn(prev);
      return next === prev
        ? prev
        : { ...prev, currentPlayerIdx: next.currentPlayerIdx, turnNumber: next.turnNumber, turnStartTime: next.turnStartTime };
    });
  };

  const getRotation = (position: PlayerState['position']) => {
    switch (position) {
      case 'bottom': return 'rotate(0deg)';
      case 'top': return 'rotate(180deg)';
      case 'left': return 'rotate(90deg)';
      case 'right': return 'rotate(-90deg)';
    }
  };

  // Grid placement: col/row (1-indexed)
  const getGridPlacement = (position: PlayerState['position']) => {
    switch (position) {
      case 'top':    return { gridColumn: 2, gridRow: 1 };
      case 'bottom': return { gridColumn: 2, gridRow: 3 };
      case 'left':   return { gridColumn: 1, gridRow: '1 / 4' }; // full height
      case 'right':  return { gridColumn: 3, gridRow: '1 / 4' }; // full height
    }
  };

  const playerCount = players.length;
  // 2HG takes its turn as a team, so both teammates highlight together; standard
  // play highlights the single active seat.
  const activeTeamNumber = state.gameType === '2hg' ? players[currentPlayerIdx]?.teamNumber ?? null : null;
  const isSeatActive = (idx: number) =>
    state.gameType === '2hg'
      ? players[idx]?.teamNumber != null && players[idx].teamNumber === activeTeamNumber
      : currentPlayerIdx === idx;

  // Staggered backdrop reveal (standard play). Turn order = the first player,
  // then clockwise through the occupied seats. Each seat's ordinal in that order
  // sets how long its backdrop waits before popping in.
  const seatRevealOrdinal = (idx: number): number => {
    const firstIdx = state.firstPlayerIdx;
    if (firstIdx == null) return 0;
    // Player indices in clockwise seating order, rotated to start at the first player.
    const cwOrder = CLOCKWISE
      .map((pos) => players.findIndex((p) => p.position === pos))
      .filter((i) => i !== -1);
    const startAt = cwOrder.indexOf(firstIdx);
    const rotated = startAt >= 0 ? [...cwOrder.slice(startAt), ...cwOrder.slice(0, startAt)] : cwOrder;
    const ord = rotated.indexOf(idx);
    return ord >= 0 ? ord : 0;
  };
  // null → hidden (no first player yet); 0 for every seat → fade all in at once
  // on a reload; otherwise stagger in turn order for a fresh roll.
  const bgRevealDelay = (idx: number): number | null => {
    if (state.gameType === '2hg' || !firstPlayerSet) return null;
    if (bgWasPreset) return 0;
    return seatRevealOrdinal(idx) * BG_REVEAL_STEP_MS;
  };
  const leftPanelCss = playerCount === 3 ? 'clamp(200px, 25dvw, 380px)' : 'clamp(160px, 21dvw, 300px)';
  const rightPanelCss = 'clamp(160px, 21dvw, 300px)';
  const leftColumnWidth = playerCount >= 3 ? leftPanelCss : '0px';
  const rightColumnWidth = playerCount >= 4 ? rightPanelCss : '0px';
  // 2HG renders two team panels rotated into the left/right columns so each
  // 2HG renders one full-width team panel along the top edge and one along the
  // bottom edge (tablet flat in landscape between the two teams). The bottom
  // team is upright; the top team is rotated 180deg to face the players on the
  // opposite long side. Standard play sizes the side columns to the seat count.
  const is2hg = state.gameType === '2hg';
  const gridTemplateColumns = is2hg
    ? '1fr minmax(300px, 520px) 1fr'
    : `${leftColumnWidth} 1fr ${rightColumnWidth}`;

  // Whole-board-on-one-phone: the 2HG board is a shared-table layout (top team
  // flipped 180deg) sized to fill the viewport with two 1fr rows. On a phone
  // those rows are far shorter than a team panel needs, so overflow:hidden clips
  // the content. On compact viewports we instead let the rows size to content
  // and scale the entire board down with a transform so nothing clips while the
  // flip-for-opponent ergonomics survive. Tablet layout and the per-team remote
  // view are unaffected (they never hit compact2hg).
  const isCompactViewport = useMediaQuery('(max-height: 500px), (max-width: 500px)');
  const compact2hg = is2hg && isCompactViewport;
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardScale, setBoardScale] = useState(1);
  useLayoutEffect(() => {
    // boardScale is only read when compact2hg is applied to the grid, so there's
    // nothing to reset when it's off — bail without touching state.
    if (!compact2hg) return;
    const el = boardRef.current;
    if (!el) return;
    // offsetWidth/offsetHeight report the UNSCALED layout box (transform does not
    // affect them), so measuring the element we also scale can't feed back into a
    // loop. width is pinned to 100vw, so the width ratio is ~1 and the scale is
    // driven by height.
    const recompute = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;
      const s = Math.min(1, window.innerWidth / w, window.innerHeight / h);
      setBoardScale(s > 0 ? s : 1);
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    window.addEventListener('resize', recompute);
    window.addEventListener('orientationchange', recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recompute);
      window.removeEventListener('orientationchange', recompute);
    };
    // state.phase is a dep so the effect re-runs when the board actually mounts
    // (seating -> playing): compact2hg alone doesn't change across that flip, so
    // without it the ref would still be null from the seating render and never
    // get measured.
  }, [compact2hg, state.phase, players.length]);

  // -------- Seating phase early-return --------
  if (state.phase === 'seating') {
    const filledCount = players.filter(isSeatFilled).length;
    const allFilled = filledCount === players.length && players.length > 0;
    const takenPlayerIds = players.map((p) => p.playerId).filter(Boolean);
    const currentSeat = pickerSeatIdx !== null ? players[pickerSeatIdx] : null;
    const currentSetup: PlayerSetup | undefined =
      currentSeat && isSeatFilled(currentSeat)
        ? {
            playerId: currentSeat.playerId,
            deckId: currentSeat.deckId,
            playerName: currentSeat.playerName,
            deckName: currentSeat.deckName,
            commander: currentSeat.commander,
            partner: currentSeat.partner,
          }
        : undefined;

    return (
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'grid',
          gridTemplateColumns,
          gridTemplateRows: '1fr clamp(120px, 18dvh, 220px) 1fr',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1A1410' : '#FFF8F0'),
          gap: 0.5,
          px: 0.5,
          py: 0,
        }}
      >
        {state.gameType === '2hg' ? (
          // 2HG seating: Team 2 spans the top row, Team 1 the bottom row, each
          // holding its two seats side by side (matches the top/bottom board).
          [2, 1].map((teamNum) => (
            <Box
              key={teamNum}
              sx={{
                gridColumn: '1 / -1',
                gridRow: teamNum === 2 ? 1 : 3,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                gap: 0.5,
                p: 0.5,
                minHeight: 0,
              }}
            >
              <Box sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: teamNum === 1 ? 'primary.main' : 'secondary.main', flexShrink: 0 }}>
                Team {teamNum}
              </Box>
              {players.map((player, idx) =>
                player.teamNumber === teamNum ? (
                  <Box key={idx} sx={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden' }}>
                    <SeatingCard player={player} onOpenSeatPicker={() => setPickerSeatIdx(idx)} />
                  </Box>
                ) : null,
              )}
            </Box>
          ))
        ) : (
          players.map((player, idx) => {
            const placement = getGridPlacement(player.position);
            const rotation = getRotation(player.position);
            const isVertical = player.position === 'left' || player.position === 'right';

            return (
              <Box key={idx} sx={{ ...placement, position: 'relative', overflow: 'hidden' }}>
                <Box
                  sx={
                    isVertical
                      ? {
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '100dvh',
                          height: player.position === 'left' ? leftPanelCss : rightPanelCss,
                          transform: `translate(-50%, -50%) ${rotation}`,
                        }
                      : { position: 'absolute', inset: 0, transform: rotation }
                  }
                >
                  <SeatingCard
                    player={player}
                    onOpenSeatPicker={() => setPickerSeatIdx(idx)}
                  />
                </Box>
              </Box>
            );
          })
        )}

        <Box
          sx={{
            gridColumn: 2,
            gridRow: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            px: 2,
          }}
        >
          <BracketMismatchBanner
            slots={players.map((p, i) => ({
              deckId: p.deckId || null,
              commander: p.commander?.name || null,
              playerName: p.playerName || `Player ${i + 1}`,
            }))}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            Seats filled {filledCount} / {players.length}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {onDiscard && (
              <Button startIcon={<ArrowBackIcon />} onClick={onDiscard} color="inherit">
                Cancel
              </Button>
            )}
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              disabled={!allFilled || !onStartGame}
              onClick={() => onStartGame?.()}
            >
              Start Game
            </Button>
          </Stack>
          {!allFilled && (
            <Typography variant="caption" color="text.secondary">
              Tap each seat to choose a player and deck.
            </Typography>
          )}
        </Box>

        {pickerSeatIdx !== null && (
          <SeatPickerModal
            open
            seatLabel={`${players[pickerSeatIdx]?.position ?? 'seat'} seat`}
            initial={currentSetup}
            players={pickerPlayers}
            decks={pickerDecks}
            excludePlayerIds={takenPlayerIds.filter((id) => id !== currentSeat?.playerId)}
            onClose={() => setPickerSeatIdx(null)}
            onConfirm={(setup) => {
              onSeatUpdate?.(pickerSeatIdx, setup);
              setPickerSeatIdx(null);
            }}
          />
        )}
      </Box>
    );
  }
  // -------- End seating phase --------

  // 2HG: collapse the four seats into two team panels (Team 1 left, Team 2
  // right). Life/poison are already shared by reconcileTeams; the panels render
  // a single life + poison and route mutations through the normal handlers.
  const team1: TeamMember[] = players.map((player, idx) => ({ player, idx })).filter((m) => m.player.teamNumber === 1);
  const team2: TeamMember[] = players.map((player, idx) => ({ player, idx })).filter((m) => m.player.teamNumber === 2);
  const activeTeam = state.gameType === '2hg' ? players[currentPlayerIdx]?.teamNumber ?? null : null;
  const handleTeamNameChange = (teamNumber: number, name: string) => {
    onUpdate((prev) => ({ ...prev, teamNames: { ...prev.teamNames, [teamNumber]: name } }));
  };
  const renderTeamPanel = (members: TeamMember[], opponents: TeamMember[], teamNumber: number, edge: 'top' | 'bottom') => {
    // One phone per team: pair via the primary seat's code, and treat the team
    // as connected if either teammate's phone has checked in recently.
    const primaryPos = members[0]?.player.position;
    const teamSeatCode = primaryPos ? state.sessionSeats?.[primaryPos] ?? undefined : undefined;
    const teamRemoteConnected = nowMs > 0 && members.some((m) => {
      const c = state.remoteCheckins?.[m.player.position];
      return !!c && nowMs - c < 15000;
    });
    return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        gridRow: edge === 'top' ? 1 : 3,
        position: 'relative',
        overflow: 'hidden',
        p: 0.5,
        // Top team is rotated 180deg to face the players on the opposite side.
        transform: edge === 'top' ? 'rotate(180deg)' : 'none',
      }}
    >
      <TeamPanel
        teamNumber={teamNumber}
        teamName={teamName(teamNumber, state.teamNames)}
        opponentTeamName={teamName(otherTeam(teamNumber), state.teamNames)}
        onTeamNameChange={(name) => handleTeamNameChange(teamNumber, name)}
        members={members}
        opponents={opponents}
        commanderDamage={commanderDamage}
        startingLife={startingLife}
        monarchTransfer={monarchTransfer}
        isActiveTeam={firstPlayerSet && activeTeam === teamNumber}
        elapsedSeconds={firstPlayerSet && activeTeam === teamNumber ? elapsedSeconds : 0}
        turnTimerSeconds={turnTimerSeconds}
        highlightMode={highlightMode}
        seatCode={teamSeatCode}
        remoteConnected={teamRemoteConnected}
        soundEnabled={soundEnabled}
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
      />
    </Box>
    );
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A1410' : '#FFF8F0',
      }}
    >
    <Box
      ref={boardRef}
      sx={{
        display: 'grid',
        gridTemplateColumns,
        // Compact 2HG: content-sized team rows (never clip) + transform scale to
        // fit. Otherwise the original viewport-filling 1fr rows.
        gridTemplateRows: compact2hg
          ? 'auto clamp(120px, 18dvh, 220px) auto'
          : '1fr clamp(120px, 18dvh, 220px) 1fr',
        gap: 0.5,
        px: 0.5,
        py: 0,
        ...(compact2hg
          ? {
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              transform: `translate(-50%, -50%) scale(${boardScale})`,
              transformOrigin: 'center center',
            }
          : { position: 'absolute', inset: 0 }),
      }}
    >
      {state.gameType === '2hg' && (
        <>
          {renderTeamPanel(team1, team2, 1, 'bottom')}
          {renderTeamPanel(team2, team1, 2, 'top')}
        </>
      )}
      {state.gameType !== '2hg' && players.map((player, idx) => {
        // POSITIONS_BY_COUNT (page.tsx) restricts the players array to the
        // active seats for the chosen count, so player.position is always one
        // we render. No need for a "skip right at 3 players" guard.
        const placement = getGridPlacement(player.position);
        const rotation = getRotation(player.position);
        const isVertical = player.position === 'left' || player.position === 'right';

        return (
          <Box
            key={idx}
            sx={{
              ...placement,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={
                isVertical
                  ? {
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '100dvh',
                      height: player.position === 'left' ? leftPanelCss : rightPanelCss,
                      transform: `translate(-50%, -50%) ${rotation}`,
                    }
                  : {
                      position: 'absolute',
                      inset: 0,
                      transform: rotation,
                    }
              }
            >
              <PlayerPanel
                player={player}
                playerIdx={idx}
                allPlayers={players}
                commanderDamage={commanderDamage}
                bgRevealDelayMs={bgRevealDelay(idx)}
                bgRevealFlash={!bgWasPreset}
                turnIndicatorEnabled={turnIndicatorOn}
                isHighlighted={rollState.highlightIdx === idx}
                isCurrentPlayer={firstPlayerSet && isSeatActive(idx)}
                elapsedSeconds={firstPlayerSet && isSeatActive(idx) ? elapsedSeconds : 0}
                turnTimerSeconds={turnTimerSeconds}
                startingLife={startingLife}
                highlightMode={highlightMode}
                seatCode={state.gameType === '2hg' ? undefined : (state.sessionSeats?.[player.position] ?? undefined)}
                remoteConnected={state.gameType !== '2hg' && nowMs > 0 && !!state.remoteCheckins?.[player.position] && nowMs - (state.remoteCheckins[player.position] ?? 0) < 15000}
                onLifeChange={handleLifeChange}
                onPoisonChange={handlePoisonChange}
                onCommanderTaxChange={handleCommanderTaxChange}
                onEnergyChange={handleEnergyChange}
                onExperienceChange={handleExperienceChange}
                monarchTransfer={monarchTransfer}
                onToggleMonarch={handleToggleMonarch}
                onToggleInitiative={handleToggleInitiative}
                onToggleCitysBlessing={handleToggleCitysBlessing}
                onCommanderDamageChange={handleCommanderDamageChange}
                onEliminate={handleEliminate}
                onUndoEliminate={handleUndoEliminate}
                onPassTurn={firstPlayerSet ? handleNextTurn : undefined}
                isBeingViewed={viewingPlayerIdx === idx}
                soundEnabled={soundEnabled}
                {...(lifeKillPrompt?.targetIdx === idx && {
                  lifeKillOpponents: getActiveOpponents(players, idx),
                  onLifeKillSelect: (sourceIdx) => {
                    // Attribution is a host-only side-channel note; no event
                    // is broadcast to remotes. Use the reducer directly.
                    const { notes: newNotes } = applyLifeKillAttr(state, lifeKillPrompt.targetIdx, sourceIdx);
                    updateState({ notes: newNotes });
                    // The death was already logged (eliminate); this records the
                    // player the host credited with the life-to-0 kill.
                    onLogEvent?.([{
                      type: 'kill_attribution',
                      payload: {
                        player: players[lifeKillPrompt.targetIdx]?.playerName,
                        source: sourceIdx != null ? players[sourceIdx]?.playerName ?? null : null,
                        cause: 'life',
                      },
                    }]);
                    setLifeKillPrompt(null);
                    // Winner detection runs in the state-driven useEffect, so
                    // no explicit setWinner here.
                  },
                })}
                {...(poisonKillPrompt?.targetIdx === idx && {
                  poisonKillOpponents: getActiveOpponents(players, idx),
                  onPoisonKillSelect: (sourceIdx) => {
                    const { notes: newNotes } = applyPoisonKillAttr(state, poisonKillPrompt.targetIdx, sourceIdx);
                    updateState({ notes: newNotes });
                    onLogEvent?.([{
                      type: 'kill_attribution',
                      payload: {
                        player: players[poisonKillPrompt.targetIdx]?.playerName,
                        source: sourceIdx != null ? players[sourceIdx]?.playerName ?? null : null,
                        cause: 'poison',
                      },
                    }]);
                    setPoisonKillPrompt(null);
                  },
                })}
              />
            </Box>
          </Box>
        );
      })}

<Box sx={{ gridColumn: 2, gridRow: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CenterZone
          turnNumber={turnNumber}
          currentPlayerIdx={currentPlayerIdx}
          players={players}
          firstPlayerSet={firstPlayerSet}
          onNextTurn={handleNextTurn}
          onPrevTurn={handlePrevTurn}
          onEndGame={onEndGame}
          onChooseFirstPlayer={handleChooseFirstPlayer}
          onRollForFirstTeam={() => {
            const result = rollForFirstTeam(players, players.map((_, i) => i).filter((i) => !players[i].isEliminated));
            return { ...result, winnerLabel: teamName(players[result.winnerIdx]?.teamNumber, state.teamNames) };
          }}
          onRestartGame={handleRestartGame}
          onLogEvent={onLogEvent}
          onViewLog={onViewLog}
          elapsedSeconds={elapsedSeconds}
          turnTimerSeconds={turnTimerSeconds}
          onTimerChange={(s) => {
            updateState({ turnTimerSeconds: s });
            api.updateGameSettings({
              turn_timer_enabled: s > 0,
              turn_timer_seconds: s > 0 ? s : 300,
            })
              .then((response) => {
                if (response.turn_timer_enabled) {
                  updateState({ turnTimerSeconds: response.turn_timer_seconds });
                } else {
                  updateState({ turnTimerSeconds: 0 });
                }
              })
              .catch(() => {});
          }}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          notes={state.notes}
          onNotesChange={(n) => updateState({ notes: n })}
          gameType={state.gameType}
          teamNames={state.teamNames}
          highlightMode={highlightMode}
          onToggleHighlightMode={() => {
            const newVal = !highlightMode;
            setHighlightMode(newVal);
            api.updateGameSettings({ highlight_mode: newVal })
              .then((response) => {
                setHighlightMode(response.highlight_mode);
              })
              .catch(() => {});
          }}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const newVal = !soundEnabled;
            setSoundEnabled(newVal);
            api.updateGameSettings({ sound_enabled: newVal })
              .then((response) => {
                setSoundEnabled(response.sound_enabled);
              })
              .catch(() => {});
          }}
          commanderDamage={commanderDamage}
        />
      </Box>
    </Box>

      {/* Read-only player panel overlay */}
      {viewingPlayerIdx !== null && (() => {
        const vPlayer = players[viewingPlayerIdx];
        return (
          <Box
            sx={{ position: 'fixed', inset: 0, zIndex: 60, bgcolor: 'rgba(0,0,0,0.7)' }}
            onClick={() => setViewingPlayerIdx(null)}
          >
            <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'absolute', inset: 0 }}>
              <ReadOnlyPlayerPanel
                player={vPlayer}
                playerIdx={viewingPlayerIdx}
                allPlayers={players}
                commanderDamage={commanderDamage}
                startingLife={startingLife}
                activePlayerIdx={currentPlayerIdx}
                turnTimerSeconds={turnTimerSeconds}
              />
              {/* Read-only blocker — prevents all interaction with the panel */}
              <Box sx={{ position: 'absolute', inset: 0, zIndex: 5, cursor: 'pointer' }} onClick={() => setViewingPlayerIdx(null)} />
              <IconButton
                onClick={() => setViewingPlayerIdx(null)}
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1.5, pointerEvents: 'none' }}>
                View Only
              </Typography>
            </Box>
          </Box>
        );
      })()}

      {/* Winner countdown banner */}
      {winner && (winnerCountdown !== null || saveFailed) && (
        <Box sx={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
          bgcolor: 'background.paper',
          borderTop: (theme) => `2px solid ${theme.palette.primary.main}`,
          px: 2, py: 1.5,
          display: 'flex', alignItems: 'center', gap: 1.5,
        }}>
          <Typography sx={{ fontWeight: 900, fontSize: 'clamp(14px, 2.5dvh, 20px)', flex: 1 }}>
            🏆 {state.gameType === '2hg' && winner.teamNumber != null
              ? teamLabel(winner.teamNumber, players, state.teamNames)
              : winner.playerName} wins {saveFailed ? '— save failed, tap Save Now' : `— saving in ${winnerCountdown}s`}
          </Typography>
          <Button size="small" variant="contained" onClick={() => saveWithRetry(false)}>
            Save Now
          </Button>
        </Box>
      )}
    </Box>
  );
}
