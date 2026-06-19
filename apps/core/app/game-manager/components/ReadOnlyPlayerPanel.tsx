'use client';

import { PlayerPanel } from './PlayerPanel';
import type { PlayerState, CommanderDamageMap } from '../types';

interface ReadOnlyPlayerPanelProps {
  player: PlayerState;
  playerIdx: number;
  allPlayers: PlayerState[];
  commanderDamage: CommanderDamageMap;
  startingLife?: number;
  turnTimerSeconds?: number;
  activePlayerIdx?: number;
}

const noop = () => {};

/**
 * View-only wrapper used when the host opens another player's panel as an
 * overlay. Forces `position: 'bottom'` so the rotated layout renders upright,
 * disables sound, and supplies noop handlers for every control. Interaction
 * is blocked by an absolutely-positioned click-blocker in the parent overlay
 * (see GameBoard.tsx); this component is purely presentational.
 */
export function ReadOnlyPlayerPanel({
  player,
  playerIdx,
  allPlayers,
  commanderDamage,
  startingLife,
  turnTimerSeconds,
  activePlayerIdx,
}: ReadOnlyPlayerPanelProps) {
  return (
    <PlayerPanel
      player={{ ...player, position: 'bottom' }}
      playerIdx={playerIdx}
      allPlayers={allPlayers}
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
      activePlayerIdx={activePlayerIdx}
      turnTimerSeconds={turnTimerSeconds}
    />
  );
}
