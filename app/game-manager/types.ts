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
  hasCitysBlessing: boolean;
  energy: number;
  experience: number;
  isEliminated: boolean;
  isConceded: boolean;
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
  turnTimerSeconds: number;
  turnStartTime: number; // Date.now() when current turn began
  notes: string;
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
