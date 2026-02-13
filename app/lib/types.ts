// Game type
export type GameType = 'standard' | '2hg';

// Database row types
export interface Player {
  id: number;
  name: string;
  user_id: number | null;
  created_at: string;
}

export interface Deck {
  id: number;
  player_id: number;
  name: string;
  commander: string;
  colors: string; // Stored as "WUBRG" format, "C" for colorless
  created_at: string;
}

export interface Game {
  id: number;
  played_at: string;
  winning_turn: number | null;
  notes: string | null;
  game_type: GameType;
  created_at: string;
}

export interface GameResult {
  id: number;
  game_id: number;
  deck_id: number;
  player_id: number; // The player who piloted this deck (may differ from deck owner)
  finish_position: number; // 1 = winner, 2-8 = order of elimination
  eliminated_turn: number | null;
  team_number: number | null; // 1 or 2 for 2HG, null for standard
}

// Extended types with joins
export interface DeckWithPlayer extends Deck {
  player_name: string;
}

// Deck detail from API (includes stats)
export interface DeckDetail extends Deck {
  player_name: string;
  total_games: number;
  wins: number;
  win_rate: number | null;
  avg_finish_position: number | null;
}

export interface GameWithResults extends Game {
  results: GameResultWithDeck[];
}

export interface GameResultWithDeck extends GameResult {
  deck_name: string;
  commander: string;
  player_name: string;
  colors: string;
}

// Stats types
export interface PlayerStats {
  player_id: number;
  player_name: string;
  total_games: number;
  wins: number;
  win_rate: number;
  avg_finish_position: number;
}

export interface DeckStats {
  deck_id: number;
  deck_name: string;
  commander: string;
  colors: string;
  player_name: string;
  total_games: number;
  wins: number;
  win_rate: number;
  avg_finish_position: number;
}

export interface CommanderStats {
  commander: string;
  total_games: number;
  wins: number;
  win_rate: number;
  decks_using: number;
}

export interface HeadToHeadRecord {
  player1_id: number;
  player1_name: string;
  player2_id: number;
  player2_name: string;
  player1_wins: number;
  player2_wins: number;
  total_games: number;
}

export interface HeadToHeadResponse {
  twoPlayer: HeadToHeadRecord[];
  multiplayer: HeadToHeadRecord[];
}

export interface OverallStats {
  total_games: number;
  total_players: number;
  total_decks: number;
  avg_game_length: number | null;
}

export interface StatsResponse {
  overall: OverallStats;
  topPlayers: PlayerStats[];
  topDecks: DeckStats[];
  topCommanders: CommanderStats[];
  recentGames: RecentGame[];
}

export interface RecentGame {
  id: number;
  played_at: string;
  winning_turn: number | null;
  winning_deck: string;
  winning_commander: string;
  winner: string;
  game_type: GameType;
}

// Advanced stats types
export interface ColorMetaStats {
  colors: string;
  color_count: number;
  deck_count: number;
  total_games: number;
  wins: number;
  win_rate: number;
  avg_finish_position: number;
}

export interface GameSizeEntry {
  player_id: number;
  player_name: string;
  games_played: number;
  wins: number;
  win_rate: number;
  avg_finish_position: number;
}

export interface GameSizeStats {
  pod_size: number;
  total_games: number;
  entries: GameSizeEntry[];
}

export interface PlayerStreak {
  player_id: number;
  player_name: string;
  current_streak: number;
  current_streak_type: 'W' | 'L';
  longest_win_streak: number;
  last_5_wins: number;
  last_5_games: number;
  overall_win_rate: number;
  recent_win_rate: number;
  trend: 'hot' | 'cold' | 'steady';
}

export interface DeckStreak {
  deck_id: number;
  deck_name: string;
  commander: string;
  colors: string;
  player_name: string;
  current_streak: number;
  current_streak_type: 'W' | 'L';
  longest_win_streak: number;
  last_5_wins: number;
  last_5_games: number;
  overall_win_rate: number;
  recent_win_rate: number;
  trend: 'hot' | 'cold' | 'steady';
}

export interface AdvancedStatsResponse {
  colorMeta: ColorMetaStats[];
  gameSizeStats: GameSizeStats[];
  playerStreaks: PlayerStreak[];
  deckStreaks: DeckStreak[];
}

// MTG color identity
export type MtgColor = 'W' | 'U' | 'B' | 'R' | 'G';

// Form input types
export interface CreatePlayerInput {
  name: string;
}

export interface CreateDeckInput {
  player_id: number;
  name: string;
  commander: string;
  colors: string;
}

export interface GameResultInput {
  deck_id: number;
  player_id?: number; // Defaults to deck owner if omitted
  finish_position: number;
  eliminated_turn: number | null;
  team_number: number | null;
}

export interface CreateGameInput {
  played_at: string;
  winning_turn: number | null;
  notes: string | null;
  game_type: GameType;
  results: GameResultInput[];
}
