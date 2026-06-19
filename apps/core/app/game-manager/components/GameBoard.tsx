'use client';

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Box, Button, Typography, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { PlayerPanel } from './PlayerPanel';
import { CenterZone } from './CenterZone';
import { SeatPickerModal } from './SeatPickerModal';
import { api } from '@/lib/api';
import { isSeatFilled } from '@/lib/types';
import { BracketMismatchBanner } from '@/components/BracketMismatchBanner';
import type { Player, DeckWithPlayer, PlayerSetup, LiveGameEvent, DistributiveOmit } from '@/lib/types';
import type { GameManagerState, PlayerState } from '../types';
import {
  applyEvent,
  applyLifeKillAttr,
  applyPassTurn,
  applyPoisonKillAttr,
  applyPrevTurn,
} from '../remoteTransforms';
import { detectSideEffects, type SideEffect } from '../detectSideEffects';

type RollPhase = 'idle' | 'rolling' | 'done';

interface RollState {
  phase: RollPhase;
  highlightIdx: number | null;
  finalIdx: number | null;
}

const IDLE_ROLL_STATE: RollState = { phase: 'idle', highlightIdx: null, finalIdx: null };

function getActiveOpponents(players: PlayerState[], excludeIdx: number) {
  return players
    .map((p, i) => ({ name: p.playerName, idx: i }))
    .filter((_, i) => i !== excludeIdx && !players[i].isEliminated);
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
}: GameBoardProps) {
  const { players, commanderDamage, currentPlayerIdx, turnNumber, turnTimerSeconds, turnStartTime, startingLife } = state;

  const [rollState, setRollState] = useState<RollState>(IDLE_ROLL_STATE);
  const [firstPlayerSet, setFirstPlayerSet] = useState(state.firstPlayerIdx != null);
  const [firstPlayerIdx, setFirstPlayerIdx] = useState(state.firstPlayerIdx ?? 0);
  const [winner, setWinner] = useState<PlayerState | null>(null);
  const [winnerCountdown, setWinnerCountdown] = useState<number | null>(null);
  const winnerStateRef = useRef<GameManagerState | null>(null);
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

  // Sync local firstPlayerIdx/firstPlayerSet with game state when loaded from DB
  useEffect(() => {
    if (state.firstPlayerIdx != null && !firstPlayerSet) {
      setFirstPlayerIdx(state.firstPlayerIdx);
      setFirstPlayerSet(true);
    }
  }, [state.firstPlayerIdx, firstPlayerSet]);

  // Start a 15s countdown when a winner is detected; auto-save when it hits 0
  useEffect(() => {
    if (winner) {
      winnerStateRef.current = state;
      setWinnerCountdown(15);
    } else {
      setWinnerCountdown(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  // Detect winner from any source (direct handlers OR remote events applied via setState)
  useEffect(() => {
    if (winner) return;
    if (!firstPlayerSet) return;
    const remaining = players.filter((p) => !p.isEliminated);
    if (remaining.length === 1 && players.some((p) => p.isEliminated)) {
      setWinner(remaining[0]);
    }
  }, [players, winner, firstPlayerSet]);

  // Cancel countdown if a correction restores more than one active player
  useEffect(() => {
    if (!winner) return;
    const remaining = players.filter((p) => !p.isEliminated);
    if (remaining.length !== 1) {
      setWinner(null);
      setWinnerCountdown(null);
    }
  }, [players, winner]);

  useEffect(() => {
    if (winnerCountdown === null) return;
    if (winnerCountdown === 0) {
      const savedState = winnerStateRef.current;
      setWinner(null);
      setWinnerCountdown(null);
      if (savedState) onSaveGame(savedState);
      return;
    }
    const t = setTimeout(() => setWinnerCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [winnerCountdown, onSaveGame]);

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
  const rollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick the turn timer every second
  useEffect(() => {
    if (!firstPlayerSet) return;
    if (tickTimer.current) clearInterval(tickTimer.current);
    tickTimer.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - turnStartTime) / 1000));
    }, 1000);
    return () => { if (tickTimer.current) clearInterval(tickTimer.current); };
  }, [firstPlayerSet, turnStartTime]);

  // No explicit elapsed-seconds reset on turn change: turnStartTime already
  // advances per turn (handleNextTurn/handlePrevTurn set turnStartTime: Date.now()),
  // and the tick effect above re-runs whenever turnStartTime changes, picking up
  // the fresh value immediately.

  const startRoll = () => {
    if (rollTimer.current) clearTimeout(rollTimer.current);
    const active = players.map((p, i) => i).filter((i) => !players[i].isEliminated);
    const finalIdx = active[Math.floor(Math.random() * active.length)];

    // Build a sequence that cycles through active players and lands on finalIdx
    const STEPS = 18;
    const sequence: number[] = [];
    let cur = 0;
    for (let i = 0; i < STEPS - 1; i++) {
      sequence.push(active[cur % active.length]);
      cur++;
    }
    sequence.push(finalIdx);

    setRollState({ phase: 'rolling', highlightIdx: sequence[0], finalIdx });

    let step = 0;
    const animate = () => {
      step++;
      if (step >= sequence.length) {
        setRollState({ phase: 'done', highlightIdx: finalIdx, finalIdx });
        return;
      }
      setRollState((prev) => ({ ...prev, highlightIdx: sequence[step] }));
      const progress = step / sequence.length;
      rollTimer.current = setTimeout(animate, 30 + (1 - Math.cos(progress * Math.PI)) / 2 * 380);
    };
    rollTimer.current = setTimeout(animate, 30);
  };

  const handleAcceptFirstPlayer = () => {
    if (rollState.finalIdx === null) return;
    const player = players[rollState.finalIdx];
    const note = `First player (rolled): ${player?.playerName ?? '?'}`;
    const newNotes = state.notes ? `${state.notes}\n${note}` : note;
    onUpdate({ ...state, currentPlayerIdx: rollState.finalIdx, firstPlayerIdx: rollState.finalIdx, turnStartTime: Date.now(), notes: newNotes });
    setRollState(IDLE_ROLL_STATE);
    setFirstPlayerIdx(rollState.finalIdx);
    setFirstPlayerSet(true);
  };

  const handleChooseFirstPlayer = (idx: number) => {
    const player = players[idx];
    const note = `First player (chosen): ${player?.playerName ?? '?'}`;
    const newNotes = state.notes ? `${state.notes}\n${note}` : note;
    onUpdate({ ...state, currentPlayerIdx: idx, firstPlayerIdx: idx, turnStartTime: Date.now(), notes: newNotes });
    setRollState(IDLE_ROLL_STATE);
    setFirstPlayerIdx(idx);
    setFirstPlayerSet(true);
  };

  const handleRollAgain = () => {
    startRoll();
  };

  const handleRestartGame = () => {
    setFirstPlayerSet(false);
    setFirstPlayerIdx(0);
    setRollState(IDLE_ROLL_STATE);
    setWinner(null);
    onRestartGame(players);
  };

  const updateState = (patch: Partial<GameManagerState>) => {
    const next = { ...state, ...patch };
    if (winner) winnerStateRef.current = next;
    onUpdate(next);
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
      onUpdate((prev) => {
        const next = applyEvent(prev, stamped);
        // winnerStateRef snapshots the about-to-be-committed state so the 15s
        // auto-save countdown sees the player config at the moment of the win.
        if (winner) winnerStateRef.current = next;
        return next;
      });
    },
    [onUpdate, winner],
  );

  const handleLifeChange = (idx: number, delta: number) =>
    dispatchHostEvent({ type: 'life_change', playerIdx: idx, delta });

  const handlePoisonChange = (idx: number, delta: number) =>
    dispatchHostEvent({ type: 'poison_change', playerIdx: idx, delta });

  const handleCommanderTaxChange = (idx: number, delta: number) =>
    dispatchHostEvent({ type: 'commander_tax_change', playerIdx: idx, delta });

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
    const next = applyPassTurn(state);
    if (next === state) return;
    updateState({ currentPlayerIdx: next.currentPlayerIdx, turnNumber: next.turnNumber, turnStartTime: next.turnStartTime });
  };

  const handlePrevTurn = () => {
    const next = applyPrevTurn(state);
    if (next === state) return;
    updateState({ currentPlayerIdx: next.currentPlayerIdx, turnNumber: next.turnNumber, turnStartTime: next.turnStartTime });
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
  const leftPanelCss = playerCount === 3 ? 'clamp(200px, 25dvw, 380px)' : 'clamp(160px, 21dvw, 300px)';
  const rightPanelCss = 'clamp(160px, 21dvw, 300px)';
  const leftColumnWidth = playerCount >= 3 ? leftPanelCss : '0px';
  const rightColumnWidth = playerCount >= 4 ? rightPanelCss : '0px';
  const gridTemplateColumns = `${leftColumnWidth} 1fr ${rightColumnWidth}`;

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
        {players.map((player, idx) => {
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
                <PlayerPanel
                  player={player}
                  playerIdx={idx}
                  allPlayers={players}
                  commanderDamage={commanderDamage}
                  startingLife={startingLife}
                  highlightMode={false}
                  turnTimerSeconds={turnTimerSeconds}
                  onLifeChange={() => {}}
                  onPoisonChange={() => {}}
                  onCommanderTaxChange={() => {}}
                  onEnergyChange={() => {}}
                  onExperienceChange={() => {}}
                  onToggleMonarch={() => {}}
                  onToggleInitiative={() => {}}
                  onToggleCitysBlessing={() => {}}
                  onCommanderDamageChange={() => {}}
                  onEliminate={() => {}}
                  onUndoEliminate={() => {}}
                  soundEnabled={false}
                  seatingMode
                  onOpenSeatPicker={() => setPickerSeatIdx(idx)}
                />
              </Box>
            </Box>
          );
        })}

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

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        gridTemplateColumns,
        gridTemplateRows: '1fr clamp(120px, 18dvh, 220px) 1fr',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A1410' : '#FFF8F0',
        gap: 0.5,
        px: 0.5,
        py: 0,
      }}
    >
      {players.map((player, idx) => {
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
                isHighlighted={rollState.highlightIdx === idx}
                isCurrentPlayer={firstPlayerSet && currentPlayerIdx === idx}
                elapsedSeconds={firstPlayerSet && currentPlayerIdx === idx ? elapsedSeconds : 0}
                turnTimerSeconds={turnTimerSeconds}
                startingLife={startingLife}
                highlightMode={highlightMode}
                seatCode={state.sessionSeats?.[player.position] ?? undefined}
                remoteConnected={!!state.remoteCheckins?.[player.position] && Date.now() - (state.remoteCheckins[player.position] ?? 0) < 15000}
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
          rollPhase={rollState.phase}
          rolledPlayerName={rollState.highlightIdx !== null ? players[rollState.highlightIdx]?.playerName : undefined}
          firstPlayerSet={firstPlayerSet}
          onNextTurn={handleNextTurn}
          onPrevTurn={handlePrevTurn}
          onEndGame={onEndGame}
          onRollForFirst={startRoll}
          onAcceptFirstPlayer={handleAcceptFirstPlayer}
          onChooseFirstPlayer={handleChooseFirstPlayer}
          onRollAgain={handleRollAgain}
          onRestartGame={handleRestartGame}
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


      {/* Read-only player panel overlay */}
      {viewingPlayerIdx !== null && (() => {
        const vPlayer = players[viewingPlayerIdx];
        const noop = () => {};
        return (
          <Box
            sx={{ position: 'fixed', inset: 0, zIndex: 60, bgcolor: 'rgba(0,0,0,0.7)' }}
            onClick={() => setViewingPlayerIdx(null)}
          >
            <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'absolute', inset: 0 }}>
              <PlayerPanel
                player={{ ...vPlayer, position: 'bottom' }}
                playerIdx={viewingPlayerIdx}
                allPlayers={players}
                commanderDamage={commanderDamage}
                startingLife={startingLife}
                onLifeChange={noop}
                onPoisonChange={noop}
                onCommanderTaxChange={noop}
                onEnergyChange={noop}
                onExperienceChange={noop}
                onToggleMonarch={noop}
                onToggleInitiative={noop}
                onToggleCitysBlessing={noop}
                onCommanderDamageChange={noop}
                onEliminate={noop}
                onUndoEliminate={noop}
                highlightMode={false}
                soundEnabled={false}
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
      {winner && winnerCountdown !== null && (
        <Box sx={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
          bgcolor: 'background.paper',
          borderTop: (theme) => `2px solid ${theme.palette.primary.main}`,
          px: 2, py: 1.5,
          display: 'flex', alignItems: 'center', gap: 1.5,
        }}>
          <Typography sx={{ fontWeight: 900, fontSize: 'clamp(14px, 2.5dvh, 20px)', flex: 1 }}>
            🏆 {winner.playerName} wins — saving in {winnerCountdown}s
          </Typography>
          <Button size="small" variant="contained" onClick={() => {
            const s = winnerStateRef.current ?? state;
            setWinner(null); setWinnerCountdown(null); onSaveGame(s);
          }}>
            Save Now
          </Button>
        </Box>
      )}
    </Box>
  );
}
