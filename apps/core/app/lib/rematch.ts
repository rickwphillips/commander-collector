import type { GameWithResults, GameType, PlayerSetup } from './types';

export interface RematchPrefill {
  prefill: PlayerSetup[];
  gameType: GameType;
  playerCount: number;
  // Recorded games don't store starting life; mirror the setup default.
  startingLife: number;
}

// Build new-game setup values from a recorded game. Seats sort by team then
// finish position so 2HG teammates stay paired and the prior winner leads.
export function buildRematchPrefill(game: GameWithResults): RematchPrefill {
  const results = [...(game.results ?? [])].sort((a, b) => {
    const teamDelta = (a.team_number ?? 0) - (b.team_number ?? 0);
    if (teamDelta !== 0) return teamDelta;
    return a.finish_position - b.finish_position;
  });

  const prefill: PlayerSetup[] = results.map((r) => ({
    playerId: r.player_id,
    deckId: r.deck_id,
    playerName: r.player_name,
    deckName: r.deck_name,
    commander: { name: r.commander },
    partner: r.partner ? { name: r.partner } : undefined,
  }));

  const gameType: GameType = game.game_type;
  const playerCount = prefill.length;
  const startingLife = gameType === '2hg' ? 30 : playerCount === 2 ? 30 : 40;

  return { prefill, gameType, playerCount, startingLife };
}
