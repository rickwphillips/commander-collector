'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PlayerPanel } from './PlayerPanel';
import { CenterZone } from './CenterZone';
import { api } from '@/lib/api';
import type { GameManagerState, PlayerState } from '../types';
import {
  applyCommanderDamageChange,
  applyLifeChange,
  applyPoisonChange,
  applyLifeKillAttr,
  applyPoisonKillAttr,
} from '../remoteTransforms';

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
  onUpdate: (newState: GameManagerState) => void;
  onEndGame: () => void;
  onRestartGame: (players: PlayerState[]) => void;
  onLogGame: () => void;
  onSaveGame: (state: GameManagerState) => Promise<void>;
  isResumed?: boolean;
}

export function GameBoard({ state, onUpdate, onEndGame, onRestartGame, onSaveGame, isResumed = false }: GameBoardProps) {
  const { players, commanderDamage, currentPlayerIdx, turnNumber, turnTimerSeconds, turnStartTime, startingLife } = state;

  const [rollState, setRollState] = useState<RollState>(IDLE_ROLL_STATE);
  const [firstPlayerSet, setFirstPlayerSet] = useState(isResumed);
  const [firstPlayerIdx, setFirstPlayerIdx] = useState(isResumed ? state.currentPlayerIdx : 0);
  const [winner, setWinner] = useState<PlayerState | null>(null);
  const [winnerCountdown, setWinnerCountdown] = useState<number | null>(null);
  const winnerStateRef = useRef<GameManagerState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lifeKillPrompt, setLifeKillPrompt] = useState<{ targetIdx: number; pendingWinner: PlayerState | null } | null>(null);
  const [poisonKillPrompt, setPoisonKillPrompt] = useState<{ targetIdx: number; newPlayers: PlayerState[] } | null>(null);
  const [monarchTransfer, setMonarchTransfer] = useState<{ fromPos: string | null; toPos: string | null }>({ fromPos: null, toPos: null });
  const [highlightMode, setHighlightMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [highlightLoading, setHighlightLoading] = useState(false);
  const [soundLoading, setSoundLoading] = useState(false);
  const [timerLoading, setTimerLoading] = useState(false);
  const [posOverrides, setPosOverrides] = useState<Record<number, PlayerState['position']>>({});
  const [viewingPlayerIdx, setViewingPlayerIdx] = useState<number | null>(null);
  const settingsLoadedRef = useRef(false);

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
        if (settings.turn_timer_enabled) {
          onUpdate({ turnTimerSeconds: settings.turn_timer_seconds });
        } else {
          onUpdate({ turnTimerSeconds: 0 });
        }
        setSettingsLoaded(true);
      })
      .catch(() => {
        setSettingsLoaded(true);
      });
  }, []);

  // Re-apply all settings when game resets (firstPlayerSet goes false)
  const firstPlayerSetRef = useRef(firstPlayerSet);
  useEffect(() => {
    const wasGameActive = firstPlayerSetRef.current;
    firstPlayerSetRef.current = firstPlayerSet;

    if (wasGameActive && !firstPlayerSet) {
      // Game was reset, re-apply all settings from DB
      api.getGameSettings()
        .then((settings) => {
          setHighlightMode(settings.highlight_mode);
          setSoundEnabled(settings.sound_enabled);
          if (!settings.turn_timer_enabled) {
            onUpdate({ turnTimerSeconds: 0 });
          } else {
            onUpdate({ turnTimerSeconds: settings.turn_timer_seconds });
          }
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

  // Reset elapsed display when turn changes
  useEffect(() => {
    setElapsedSeconds(0);
  }, [currentPlayerIdx]);

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

  // Sync read-only overlay visibility to game state so remote panels can show the eye indicator
  useEffect(() => {
    updateState({ viewingPlayerIdx: viewingPlayerIdx ?? null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewingPlayerIdx]);

  const handleLifeChange = (idx: number, delta: number) => {
    const target = players[idx];
    const isNewLifeKill = target.life > 0 && target.life + delta <= 0;
    const { players: newPlayers, notes: newNotes } = applyLifeChange(state, idx, delta);
    updateState({ players: newPlayers, notes: newNotes });
    if (isNewLifeKill) {
      const remaining = newPlayers.filter((p) => !p.isEliminated);
      const pendingWinner = remaining.length === 1 ? remaining[0] : null;
      setLifeKillPrompt({ targetIdx: idx, pendingWinner });
    }
  };

  const handlePoisonChange = (idx: number, delta: number) => {
    const target = players[idx];
    const isNewPoisonKill = !target.isEliminated && Math.max(0, target.poison + delta) >= 10;
    const { players: newPlayers, notes: newNotes } = applyPoisonChange(state, idx, delta);
    updateState({ players: newPlayers, notes: newNotes });
    if (isNewPoisonKill) {
      setPoisonKillPrompt({ targetIdx: idx, newPlayers });
    }
  };

  const handleCommanderTaxChange = (idx: number, delta: number) => {
    const newPlayers = players.map((p, i) =>
      i === idx ? { ...p, commanderTax: Math.max(0, p.commanderTax + delta) } : p
    );
    updateState({ players: newPlayers });
  };

  const handleToggleMonarch = (idx: number) => {
    const currentMonarchIdx = players.findIndex(p => p.isMonarch);
    const fromPos = currentMonarchIdx >= 0 ? players[currentMonarchIdx].position : null;
    const toPos = !players[idx].isMonarch ? players[idx].position : null;
    setMonarchTransfer({ fromPos, toPos });
    setTimeout(() => setMonarchTransfer({ fromPos: null, toPos: null }), 900);
    const newPlayers = players.map((p, i) => ({
      ...p,
      isMonarch: i === idx ? !p.isMonarch : false,
    }));
    updateState({ players: newPlayers });
  };

  const handleToggleInitiative = (idx: number) => {
    const newPlayers = players.map((p, i) => ({
      ...p,
      hasInitiative: i === idx ? !p.hasInitiative : false,
    }));
    updateState({ players: newPlayers });
  };

  const handleEnergyChange = (idx: number, delta: number) => {
    const newPlayers = players.map((p, i) =>
      i === idx ? { ...p, energy: Math.max(0, p.energy + delta) } : p
    );
    updateState({ players: newPlayers });
  };

  const handleExperienceChange = (idx: number, delta: number) => {
    const newPlayers = players.map((p, i) =>
      i === idx ? { ...p, experience: Math.max(0, p.experience + delta) } : p
    );
    updateState({ players: newPlayers });
  };

  const handleToggleCitysBlessing = (idx: number) => {
    const newPlayers = players.map((p, i) =>
      i === idx ? { ...p, hasCitysBlessing: !p.hasCitysBlessing } : p
    );
    updateState({ players: newPlayers });
  };

  const handleCommanderDamageChange = (
    targetIdx: number,
    sourceIdx: number,
    isPartner: boolean,
    delta: number
  ) => {
    const wasEliminated = players[targetIdx].isEliminated;
    const newState = applyCommanderDamageChange(state, targetIdx, sourceIdx, isPartner, delta);
    onUpdate(newState);
    if (!wasEliminated && newState.players[targetIdx].isEliminated) {
      const remaining = newState.players.filter((p) => !p.isEliminated);
      if (remaining.length === 1) setWinner(remaining[0]);
    }
  };

  const handleEliminate = (idx: number) => {
    const newPlayers = players.map((p, i) =>
      i === idx
        ? { ...p, isEliminated: true, isConceded: true, eliminatedTurn: state.turnNumber }
        : p
    );
    updateState({ players: newPlayers });
    const remaining = newPlayers.filter((p) => !p.isEliminated);
    if (remaining.length === 1) setWinner(remaining[0]);
  };

  const handleUndoEliminate = (idx: number) => {
    const newPlayers = players.map((p, i) =>
      i === idx ? { ...p, isEliminated: false, isConceded: false, eliminatedTurn: null } : p
    );
    updateState({ players: newPlayers });
  };

  const CLOCKWISE: PlayerState['position'][] = ['bottom', 'left', 'top', 'right'];

  const handleNextTurn = () => {
    const currentPos = players[currentPlayerIdx].position;
    const curCW = CLOCKWISE.indexOf(currentPos);
    const firstCW = CLOCKWISE.indexOf(players[firstPlayerIdx].position);
    let nextPlayerIdx = -1;
    let stepsToNext = 0;
    for (let step = 1; step <= 4; step++) {
      const nextPos = CLOCKWISE[(curCW + step) % 4];
      const idx = players.findIndex(p => p.position === nextPos && !p.isEliminated);
      if (idx !== -1) { nextPlayerIdx = idx; stepsToNext = step; break; }
    }
    if (nextPlayerIdx === -1) return;
    // Increment turn when we cross through the first player's position (even if they're eliminated)
    const distToFirst = (firstCW - curCW + 4) % 4;
    const newTurnNumber = distToFirst >= 1 && distToFirst <= stepsToNext ? turnNumber + 1 : turnNumber;
    updateState({ currentPlayerIdx: nextPlayerIdx, turnNumber: newTurnNumber, turnStartTime: Date.now() });
  };

  const handlePrevTurn = () => {
    const currentPos = players[currentPlayerIdx].position;
    const curCW = CLOCKWISE.indexOf(currentPos);
    const firstCW = CLOCKWISE.indexOf(players[firstPlayerIdx].position);
    let prevPlayerIdx = -1;
    let stepsBack = 0;
    for (let step = 1; step <= 4; step++) {
      const prevPos = CLOCKWISE[(curCW - step + 4) % 4];
      const idx = players.findIndex(p => p.position === prevPos && !p.isEliminated);
      if (idx !== -1) { prevPlayerIdx = idx; stepsBack = step; break; }
    }
    if (prevPlayerIdx === -1) return;
    // Decrement turn when we depart through the first player's position going backward (including when current IS first player)
    const distBackToFirst = (curCW - firstCW + 4) % 4;
    const wouldDecrement = distBackToFirst < stepsBack;
    if (wouldDecrement && turnNumber === 1) return;
    const newTurnNumber = wouldDecrement ? Math.max(1, turnNumber - 1) : turnNumber;
    updateState({ currentPlayerIdx: prevPlayerIdx, turnNumber: newTurnNumber, turnStartTime: Date.now() });
  };

  const getRotation = (position: PlayerState['position']) => {
    switch (position) {
      case 'bottom': return 'rotate(0deg)';
      case 'top': return 'rotate(180deg)';
      case 'left': return 'rotate(90deg)';
      case 'right': return 'rotate(-90deg)';
    }
  };

  const getEffectivePos = (idx: number): PlayerState['position'] => posOverrides[idx] ?? players[idx].position;

  const handleSwitchToPlayer = (fromIdx: number, toIdx: number) => {
    const fromPos = getEffectivePos(fromIdx);
    const toPos = getEffectivePos(toIdx);
    setPosOverrides(prev => ({ ...prev, [fromIdx]: toPos, [toIdx]: fromPos }));
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
  const leftPanelCss = playerCount === 3 ? 'clamp(180px, 22dvw, 340px)' : 'clamp(140px, 18dvw, 260px)';
  const rightPanelCss = 'clamp(140px, 18dvw, 260px)';
  const leftColumnWidth = playerCount >= 3 ? leftPanelCss : '0px';
  const rightColumnWidth = playerCount >= 4 ? rightPanelCss : '0px';
  const gridTemplateColumns = `${leftColumnWidth} 1fr ${rightColumnWidth}`;

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
        const effectivePosition = getEffectivePos(idx);
        const placement = getGridPlacement(effectivePosition);
        const rotation = getRotation(effectivePosition);
        const isVertical = effectivePosition === 'left' || effectivePosition === 'right';

        if (effectivePosition === 'right' && playerCount <= 3) return null;
        if (effectivePosition === 'left' && playerCount <= 2) return null;

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
                    const { notes: newNotes } = applyLifeKillAttr(state, lifeKillPrompt.targetIdx, sourceIdx);
                    updateState({ notes: newNotes });
                    const pending = lifeKillPrompt.pendingWinner;
                    setLifeKillPrompt(null);
                    if (pending) setWinner(pending);
                  },
                })}
                {...(poisonKillPrompt?.targetIdx === idx && {
                  poisonKillOpponents: getActiveOpponents(players, idx),
                  onPoisonKillSelect: (sourceIdx) => {
                    const { notes: newNotes } = applyPoisonKillAttr(state, poisonKillPrompt.targetIdx, sourceIdx);
                    updateState({ notes: newNotes });
                    const remaining = poisonKillPrompt.newPlayers.filter((p) => !p.isEliminated);
                    const pending = remaining.length === 1 ? remaining[0] : null;
                    setPoisonKillPrompt(null);
                    if (pending) setWinner(pending);
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
            setTimerLoading(true);
            updateState({ turnTimerSeconds: s });
            api.updateGameSettings({
              turn_timer_enabled: s > 0,
              turn_timer_seconds: s > 0 ? s : 300,
            }).finally(() => setTimerLoading(false));
          }}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          notes={state.notes}
          onNotesChange={(n) => updateState({ notes: n })}
          highlightMode={highlightMode}
          onToggleHighlightMode={() => {
            setHighlightLoading(true);
            const newVal = !highlightMode;
            setHighlightMode(newVal);
            api.updateGameSettings({ highlight_mode: newVal }).finally(() => setHighlightLoading(false));
          }}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            setSoundLoading(true);
            const newVal = !soundEnabled;
            setSoundEnabled(newVal);
            api.updateGameSettings({ sound_enabled: newVal }).finally(() => setSoundLoading(false));
          }}
          settingsLoaded={settingsLoaded}
          timerLoading={timerLoading}
          highlightLoading={highlightLoading}
          soundLoading={soundLoading}
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
