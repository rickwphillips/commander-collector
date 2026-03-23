'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from '@mui/material';
import { PlayerPanel } from './PlayerPanel';
import { CenterZone } from './CenterZone';
import type { GameManagerState, CommanderDamageMap, PlayerState } from '../types';

type RollPhase = 'idle' | 'rolling' | 'done';

interface RollState {
  phase: RollPhase;
  highlightIdx: number | null;
  finalIdx: number | null;
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

  const [rollState, setRollState] = useState<RollState>({ phase: 'idle', highlightIdx: null, finalIdx: null });
  const [firstPlayerSet, setFirstPlayerSet] = useState(isResumed);
  const [firstPlayerIdx, setFirstPlayerIdx] = useState(isResumed ? state.currentPlayerIdx : 0);
  const [winner, setWinner] = useState<PlayerState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [textSizeMode, setTextSizeMode] = useState<0 | 1 | 2>(0);
  const [poisonKillPrompt, setPoisonKillPrompt] = useState<{ targetIdx: number; newPlayers: PlayerState[] } | null>(null);
  const [lifeKillPrompt, setLifeKillPrompt] = useState<{ targetIdx: number; pendingWinner: PlayerState | null } | null>(null);
  const [monarchTransfer, setMonarchTransfer] = useState<{ fromPos: string | null; toPos: string | null }>({ fromPos: null, toPos: null });
  const [highlightMode, setHighlightMode] = useState(true);

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
    onUpdate({ ...state, currentPlayerIdx: rollState.finalIdx, turnStartTime: Date.now(), notes: newNotes });
    setRollState({ phase: 'idle', highlightIdx: null, finalIdx: null });
    setFirstPlayerIdx(rollState.finalIdx);
    setFirstPlayerSet(true);
  };

  const handleChooseFirstPlayer = (idx: number) => {
    const player = players[idx];
    const note = `First player (chosen): ${player?.playerName ?? '?'}`;
    const newNotes = state.notes ? `${state.notes}\n${note}` : note;
    onUpdate({ ...state, currentPlayerIdx: idx, turnStartTime: Date.now(), notes: newNotes });
    setRollState({ phase: 'idle', highlightIdx: null, finalIdx: null });
    setFirstPlayerIdx(idx);
    setFirstPlayerSet(true);
  };

  const handleRollAgain = () => {
    startRoll();
  };

  const handleRestartGame = () => {
    setFirstPlayerSet(false);
    setFirstPlayerIdx(0);
    setRollState({ phase: 'idle', highlightIdx: null, finalIdx: null });
    setWinner(null);
    onRestartGame(players);
  };

  const updateState = (patch: Partial<GameManagerState>) => {
    onUpdate({ ...state, ...patch });
  };

  const handleLifeChange = (idx: number, delta: number) => {
    const target = players[idx];
    const newLife = target.life + delta;
    const isNewLifeKill = target.life > 0 && newLife <= 0;
    const isUndoLifeKill = target.life <= 0 && newLife > 0;
    const lifeNoteTag = `[lifekill:${idx}]`;

    let newNotes = state.notes;
    if (isUndoLifeKill) {
      newNotes = state.notes.split('\n').filter((l) => !l.includes(lifeNoteTag)).join('\n');
    }

    const wasEliminatedByLife = target.isEliminated && target.life <= 0 && target.poison < 10;
    const newPlayers = players.map((p, i) => {
      if (i !== idx) return p;
      return {
        ...p,
        life: newLife,
        ...(isNewLifeKill && !p.isEliminated ? { isEliminated: true, eliminatedTurn: state.turnNumber } : {}),
        ...(isUndoLifeKill && wasEliminatedByLife ? { isEliminated: false, eliminatedTurn: null } : {}),
      };
    });
    updateState({ players: newPlayers, notes: newNotes });

    if (isNewLifeKill) {
      const remaining = newPlayers.filter((p) => !p.isEliminated);
      const pendingWinner = remaining.length === 1 ? remaining[0] : null;
      setLifeKillPrompt({ targetIdx: idx, pendingWinner });
    }
  };

  const handlePoisonChange = (idx: number, delta: number) => {
    const target = players[idx];
    const newPlayers = players.map((p, i) => {
      if (i !== idx) return p;
      const poison = Math.max(0, p.poison + delta);
      const wasEliminatedByPoison = p.isEliminated && p.poison >= 10;
      const isEliminated = poison >= 10 ? true : wasEliminatedByPoison ? false : p.isEliminated;
      const eliminatedTurn = poison >= 10 && !p.isEliminated ? state.turnNumber : isEliminated ? p.eliminatedTurn : null;
      return { ...p, poison, isEliminated, eliminatedTurn };
    });

    const isNewPoisonKill = !target.isEliminated && Math.max(0, target.poison + delta) >= 10;
    const isUndoPoisonKill = target.isEliminated && target.poison >= 10 && Math.max(0, target.poison + delta) < 10;
    const poisonNoteTag = `[poisonkill:${idx}]`;

    let newNotes = state.notes;
    if (isUndoPoisonKill) {
      newNotes = state.notes.split('\n').filter((l) => !l.includes(poisonNoteTag)).join('\n');
    }

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
    const current = commanderDamage[targetIdx]?.[sourceIdx] ?? [0, 0];
    const newDmg: [number, number] = [
      isPartner ? current[0] : Math.max(0, current[0] + delta),
      isPartner ? Math.max(0, current[1] + delta) : current[1],
    ];
    const newCommanderDamage: CommanderDamageMap = {
      ...commanderDamage,
      [targetIdx]: {
        ...(commanderDamage[targetIdx] ?? {}),
        [sourceIdx]: newDmg,
      },
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
    const noteLine = `${noteTag} ${target.playerName} eliminated by ${cmdLabel} commander damage (turn ${state.turnNumber})`;

    let newNotes = state.notes;
    if (isNewElimination) {
      newNotes = [state.notes, noteLine].filter(Boolean).join('\n');
    } else if (isUndoElimination) {
      newNotes = state.notes.split('\n').filter((l) => !l.includes(noteTag)).join('\n');
    }

    const newPlayers = players.map((p, i) => {
      if (i !== targetIdx) return p;
      return {
        ...p,
        life: p.life - actualDelta,
        ...(isNewElimination ? { isEliminated: true, eliminatedTurn: state.turnNumber } : {}),
        ...(isUndoElimination ? { isEliminated: false, eliminatedTurn: null } : {}),
      };
    });
    updateState({ commanderDamage: newCommanderDamage, players: newPlayers, notes: newNotes });
    if (isNewElimination) {
      const remaining = newPlayers.filter((p) => !p.isEliminated);
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
        const placement = getGridPlacement(player.position);
        const rotation = getRotation(player.position);
        const isVertical = player.position === 'left' || player.position === 'right';

        if (player.position === 'right' && playerCount <= 3) return null;
        if (player.position === 'left' && playerCount <= 2) return null;

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
                textSizeMode={textSizeMode}
                highlightMode={highlightMode}
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
          onTimerChange={(s) => updateState({ turnTimerSeconds: s })}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          notes={state.notes}
          onNotesChange={(n) => updateState({ notes: n })}
          textSizeMode={textSizeMode}
          onCycleTextSizeMode={() => setTextSizeMode((m) => ((m + 1) % 3) as 0 | 1 | 2)}
          highlightMode={highlightMode}
          onToggleHighlightMode={() => setHighlightMode(m => !m)}
        />
      </Box>

      {/* Life kill attribution prompt */}
      {lifeKillPrompt && (() => {
        const target = players[lifeKillPrompt.targetIdx];
        const opponents = players.filter((_, i) => i !== lifeKillPrompt.targetIdx && !players[i].isEliminated);
        const lifeNoteTag = `[lifekill:${lifeKillPrompt.targetIdx}]`;
        const handleSelect = (sourceIdx: number | null) => {
          const source = sourceIdx !== null ? players[sourceIdx] : null;
          const noteLine = source
            ? `${lifeNoteTag} ${target.playerName} brought to 0 life by ${source.playerName} (turn ${state.turnNumber})`
            : `${lifeNoteTag} ${target.playerName} brought to 0 life (turn ${state.turnNumber})`;
          updateState({ notes: [state.notes, noteLine].filter(Boolean).join('\n') });
          const pending = lifeKillPrompt.pendingWinner;
          setLifeKillPrompt(null);
          if (pending) setWinner(pending);
        };
        return (
          <Dialog open maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>Who brought {target.playerName} to 0?</DialogTitle>
            <DialogContent>
              <Stack spacing={1}>
                {opponents.map((opp) => {
                  const oppIdx = players.indexOf(opp);
                  return (
                    <Button key={oppIdx} variant="outlined" fullWidth onClick={() => handleSelect(oppIdx)}>
                      {opp.playerName}
                    </Button>
                  );
                })}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleSelect(null)}>Skip</Button>
            </DialogActions>
          </Dialog>
        );
      })()}

      {/* Poison kill attribution prompt */}
      {poisonKillPrompt && (() => {
        const target = players[poisonKillPrompt.targetIdx];
        const opponents = players.filter((_, i) => i !== poisonKillPrompt.targetIdx && !players[i].isEliminated);
        const poisonNoteTag = `[poisonkill:${poisonKillPrompt.targetIdx}]`;
        const handleSelect = (sourceIdx: number | null) => {
          const source = sourceIdx !== null ? players[sourceIdx] : null;
          const noteLine = source
            ? `${poisonNoteTag} ${target.playerName} eliminated by ${source.playerName}'s poison (turn ${state.turnNumber})`
            : `${poisonNoteTag} ${target.playerName} eliminated by poison (turn ${state.turnNumber})`;
          updateState({ notes: [state.notes, noteLine].filter(Boolean).join('\n') });
          const remaining = poisonKillPrompt.newPlayers.filter((p) => !p.isEliminated);
          const pending = remaining.length === 1 ? remaining[0] : null;
          setPoisonKillPrompt(null);
          if (pending) setWinner(pending);
        };
        return (
          <Dialog open maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>Who poisoned {target.playerName}?</DialogTitle>
            <DialogContent>
              <Stack spacing={1}>
                {opponents.map((opp, i) => {
                  const oppIdx = players.indexOf(opp);
                  return (
                    <Button key={i} variant="outlined" fullWidth onClick={() => handleSelect(oppIdx)}>
                      {opp.playerName}
                    </Button>
                  );
                })}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleSelect(null)}>Skip</Button>
            </DialogActions>
          </Dialog>
        );
      })()}

      {/* Win dialog */}
      <Dialog open={!!winner} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 900, fontSize: 24 }}>
          🏆 {winner?.playerName} Wins!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            {winner?.commander.name}
          </Typography>
          <Typography sx={{ mt: 1 }}>Would you like to save this game?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 2 }}>
          <Button variant="outlined" onClick={() => { setWinner(null); onEndGame(); }}>Skip</Button>
          <Button variant="contained" onClick={() => { setWinner(null); onSaveGame(state); }}>Save Game</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
