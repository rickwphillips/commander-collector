'use client';

import { Box } from '@mui/material';
import { PlayerPanel } from './PlayerPanel';
import { CenterZone } from './CenterZone';
import type { GameManagerState, CommanderDamageMap, PlayerState } from '../types';

interface GameBoardProps {
  state: GameManagerState;
  onUpdate: (newState: GameManagerState) => void;
  onEndGame: () => void;
}

export function GameBoard({ state, onUpdate, onEndGame }: GameBoardProps) {
  const { players, commanderDamage, currentPlayerIdx, turnNumber } = state;

  const updateState = (patch: Partial<GameManagerState>) => {
    onUpdate({ ...state, ...patch });
  };

  const handleLifeChange = (idx: number, delta: number) => {
    const newPlayers = players.map((p, i) =>
      i === idx ? { ...p, life: p.life + delta } : p
    );
    updateState({ players: newPlayers });
  };

  const handlePoisonChange = (idx: number, delta: number) => {
    const newPlayers = players.map((p, i) => {
      if (i !== idx) return p;
      const poison = Math.max(0, p.poison + delta);
      const isEliminated = poison >= 10 ? true : p.isEliminated;
      const eliminatedTurn = poison >= 10 && !p.isEliminated ? state.turnNumber : p.eliminatedTurn;
      return { ...p, poison, isEliminated, eliminatedTurn };
    });
    updateState({ players: newPlayers });
  };

  const handleCommanderTaxChange = (idx: number, delta: number) => {
    const newPlayers = players.map((p, i) =>
      i === idx ? { ...p, commanderTax: Math.max(0, p.commanderTax + delta) } : p
    );
    updateState({ players: newPlayers });
  };

  const handleToggleMonarch = (idx: number) => {
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
    updateState({ commanderDamage: newCommanderDamage });
  };

  const handleEliminate = (idx: number) => {
    const newPlayers = players.map((p, i) =>
      i === idx
        ? { ...p, isEliminated: true, eliminatedTurn: state.turnNumber }
        : p
    );
    updateState({ players: newPlayers });
  };

  const handleUndoEliminate = (idx: number) => {
    const newPlayers = players.map((p, i) =>
      i === idx ? { ...p, isEliminated: false, eliminatedTurn: null } : p
    );
    updateState({ players: newPlayers });
  };

  const handleNextTurn = () => {
    const count = players.length;
    let next = (currentPlayerIdx + 1) % count;
    let wrapped = false;
    // skip eliminated players
    while (players[next].isEliminated && next !== currentPlayerIdx) {
      if (next === 0) wrapped = true;
      next = (next + 1) % count;
    }
    const cycledBack = next <= currentPlayerIdx || wrapped;
    const newTurnNumber = cycledBack ? turnNumber + 1 : turnNumber;
    updateState({ currentPlayerIdx: next, turnNumber: newTurnNumber });
  };

  // Assign grid areas based on position
  const getGridArea = (position: PlayerState['position']) => {
    switch (position) {
      case 'bottom': return 'bottom';
      case 'top': return 'top';
      case 'left': return 'left';
      case 'right': return 'right';
    }
  };

  const getRotation = (position: PlayerState['position']) => {
    switch (position) {
      case 'bottom': return 'rotate(0deg)';
      case 'top': return 'rotate(180deg)';
      case 'left': return 'rotate(-90deg)';
      case 'right': return 'rotate(90deg)';
    }
  };

  const playerCount = players.length;
  const sideColumnWidth = playerCount === 2 ? '0px' : '220px';
  const gridTemplateColumns = `${sideColumnWidth} 1fr ${sideColumnWidth}`;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        gridTemplateAreas: '". top ." "left center right" ". bottom ."',
        gridTemplateColumns,
        gridTemplateRows: '220px 1fr 220px',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A1410' : '#FFF8F0',
        gap: 0.5,
        p: 0.5,
      }}
    >
      {players.map((player, idx) => {
        const area = getGridArea(player.position);
        const rotation = getRotation(player.position);
        const isVertical = player.position === 'left' || player.position === 'right';

        if (player.position === 'top' && playerCount < 4) return null;
        if (player.position === 'left' && playerCount < 3) return null;

        return (
          <Box
            key={idx}
            sx={{
              gridArea: area,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                transform: rotation,
                transformOrigin: 'center center',
                width: isVertical ? 'calc(100vh - 440px - 8px)' : '100%',
                height: isVertical ? '220px' : '100%',
                position: 'relative',
              }}
            >
              <PlayerPanel
                player={player}
                playerIdx={idx}
                allPlayers={players}
                commanderDamage={commanderDamage}
                onLifeChange={handleLifeChange}
                onPoisonChange={handlePoisonChange}
                onCommanderTaxChange={handleCommanderTaxChange}
                onToggleMonarch={handleToggleMonarch}
                onToggleInitiative={handleToggleInitiative}
                onCommanderDamageChange={handleCommanderDamageChange}
                onEliminate={handleEliminate}
                onUndoEliminate={handleUndoEliminate}
              />
            </Box>
          </Box>
        );
      })}

      <Box sx={{ gridArea: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CenterZone
          turnNumber={turnNumber}
          currentPlayerIdx={currentPlayerIdx}
          players={players}
          onNextTurn={handleNextTurn}
          onEndGame={onEndGame}
        />
      </Box>
    </Box>
  );
}
