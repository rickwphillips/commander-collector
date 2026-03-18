export interface CommanderInfo {
  name: string;
  artCropUrl?: string;
}

export interface PlayerSetup {
  playerId: number;
  deckId: number;
  playerName: string;
  deckName: string;
  commander: CommanderInfo;
  partner?: CommanderInfo;
}

export interface PlayerState extends PlayerSetup {
  position: 'bottom' | 'top' | 'left' | 'right';
  life: number;
  poison: number;
  commanderTax: number;
  isMonarch: boolean;
  hasInitiative: boolean;
  isEliminated: boolean;
  eliminatedTurn: number | null;
}

// commanderDamage[targetPlayerIdx][sourcePlayerIdx] = [mainCmdDmg, partnerCmdDmg]
export type CommanderDamageMap = Record<number, Record<number, [number, number]>>;

export type GamePhase = 'setup' | 'playing' | 'ended';

export interface GameManagerState {
  players: PlayerState[];
  commanderDamage: CommanderDamageMap;
  currentPlayerIdx: number;
  turnNumber: number;
  startingLife: number;
  phase: GamePhase;
}

export interface GameManagerPrefill {
  playedAt: string;
  results: Array<{
    playerId: number;
    deckId: number;
    finishPosition: number | '';
    eliminatedTurn: number | '';
  }>;
}

export const GAME_MANAGER_PREFILL_KEY = 'commander_game_prefill';
