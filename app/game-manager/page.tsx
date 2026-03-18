'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameSetup } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { GameEndSummary } from './components/GameEndSummary';
import type { GameManagerState, PlayerSetup, PlayerState, CommanderDamageMap } from './types';

const POSITIONS: Array<PlayerState['position']> = ['bottom', 'top', 'left', 'right'];
const GAME_STATE_KEY = 'commander_game_state';

const DEFAULT_STATE: GameManagerState = {
  players: [],
  commanderDamage: {},
  currentPlayerIdx: 0,
  turnNumber: 1,
  startingLife: 40,
  phase: 'setup',
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
    position: POSITIONS[i],
    life: startingLife,
    poison: 0,
    commanderTax: 0,
    isMonarch: false,
    hasInitiative: false,
    isEliminated: false,
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
  };
}

export default function GameManagerPage() {
  const router = useRouter();
  const [state, setState] = useState<GameManagerState>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    return loadSavedState() ?? DEFAULT_STATE;
  });

  useEffect(() => {
    if (state.phase !== 'setup') {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const handleStart = (playerSetups: PlayerSetup[], startingLife: number) => {
    setState(buildInitialState(playerSetups, startingLife));
  };

  const handleUpdate = (newState: GameManagerState) => {
    setState(newState);
  };

  const handleEndGame = () => {
    setState((prev) => ({ ...prev, phase: 'ended' }));
  };

  const handleLogGame = () => {
    localStorage.removeItem(GAME_STATE_KEY);
    router.push('/games/new');
  };

  const handleNewGame = () => {
    localStorage.removeItem(GAME_STATE_KEY);
    setState(DEFAULT_STATE);
  };

  if (state.phase === 'setup') {
    return <GameSetup onStart={handleStart} />;
  }

  if (state.phase === 'playing') {
    return (
      <GameBoard
        state={state}
        onUpdate={handleUpdate}
        onEndGame={handleEndGame}
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
    />
  );
}
