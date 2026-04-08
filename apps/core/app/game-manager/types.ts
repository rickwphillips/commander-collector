// Shared game manager types live in lib/types.ts (also used by remote panel and api.ts)
export type {
  CommanderInfo,
  PlayerSetup,
  PlayerState,
  CommanderDamageMap,
  GamePhase,
  GameManagerState,
} from '@/lib/types';

export interface GameManagerPrefill {
  playedAt: string;
  results: Array<{
    playerId: string;
    deckId: string;
    finishPosition: number | '';
    eliminatedTurn: number | '';
  }>;
}

export const GAME_MANAGER_PREFILL_KEY = 'commander_game_prefill';
