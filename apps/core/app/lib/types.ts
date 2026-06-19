// Canonical card type and API adapters (Phase 0 unified card workflow)
import type { Card } from './cards/types';
export type { Card } from './cards/types';
export { toApiCard, fromApiCard } from './cards/types';

// Game type
export type GameType = 'standard' | '2hg';

// Scan draft (cross-device persistence)
/** @deprecated Use Card from './cards/types' instead. */
export interface ScannedCard {
  id: string;
  card_name: string;
  scryfall_id: string | null;
  image_uri: string | null;
  back_image_uri?: string | null;
  color_identity: string;
  type_line: string | null;
  mana_cost: string | null;
  quantity: number;
  is_commander: boolean;
  is_proxy: boolean;
  notFound: boolean;
}

export interface ScanDraft {
  step: number;
  cards: ScannedCard[];
  deckName: string;
  playerId: string | '';
  colors: string[];
}

// Scryfall card cache
export interface ScryfallCachedCard {
  id?: string;
  scryfall_id: string;
  name: string;
  image_uri: string | null;
  back_image_uri?: string | null;
  colors: string;
  color_identity: string;
  type_line: string | null;
  mana_cost: string | null;
  cached_at?: string;
}

export interface CreateDeckCardInput {
  card_name: string;
  scryfall_id?: string | null;
  quantity?: number;
  is_commander?: boolean;
  is_proxy?: boolean;
}

/**
 * Input shape for saving a card into a list (POST /lists?id=<uuid>).
 * Mirror of CreateDeckCardInput — lists use the same wire shape.
 * Introduced in Phase 2.2 Step 3 for the useList hook.
 */
export interface CreateListCardInput {
  card_name: string;
  scryfall_id?: string | null;
  quantity?: number;
  is_commander?: boolean;
  is_proxy?: boolean;
}

// Card Lists (standalone, no commander restriction)
export interface CardList {
  id: string;
  name: string;
  description: string | null;
  card_count: number;
  created_at: string;
  updated_at: string;
}

export interface CardListDetail extends CardList {
  cards: Card[];
}

export interface CardPrint {
  scryfall_id: string;
  name: string;
  set_name: string;
  set_code: string;
  collector_number: string;
  image_uri: string | null;
  back_image_uri?: string | null;
  released_at: string;
  image_cached: boolean;
}

// Database row types
export interface Player {
  id: string;
  name: string;
  user_id: string | null;
  created_at: string;
}

export interface Deck {
  id: string;
  player_id: string;
  name: string;
  commander: string;
  partner: string | null;
  colors: string; // Stored as "WUBRG" format, "C" for colorless
  has_w: number; // 0 or 1
  has_u: number;
  has_b: number;
  has_r: number;
  has_g: number;
  created_at: string;
}

export interface Game {
  id: string;
  played_at: string;
  winning_turn: number | null;
  notes: string | null;
  game_type: GameType;
  created_at: string;
}

export interface GameResult {
  id: string;
  game_id: string;
  deck_id: string;
  player_id: string; // The player who piloted this deck (may differ from deck owner)
  finish_position: number; // 1 = winner, 2-8 = order of elimination
  eliminated_turn: number | null;
  team_number: number | null; // 1 or 2 for 2HG, null for standard
}

// Extended types with joins
export interface DeckWithPlayer extends Deck {
  player_name: string;
  card_count: number;
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
  player_id: string;
  player_name: string;
  total_games: number;
  wins: number;
  win_rate: number;
  avg_finish_position: number;
}

export interface DeckStats {
  deck_id: string;
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
  player1_id: string;
  player1_name: string;
  player2_id: string;
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
  id: string;
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
  player_id: string;
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
  player_id: string;
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
  deck_id: string;
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

export interface TwoHgPlayerStats {
  player_id: string;
  player_name: string;
  total_games: number;
  wins: number;
  win_rate: number;
}

export interface TwoHgTeamPairing {
  player1_id: string;
  player1_name: string;
  player2_id: string;
  player2_name: string;
  total_games: number;
  wins: number;
  win_rate: number;
}

export interface TwoHgRecentGame {
  id: string;
  played_at: string;
  winning_turn: number | null;
  notes: string | null;
  winners: string;
  winning_decks: string;
}

export interface TwoHgStats {
  players: TwoHgPlayerStats[];
  teamPairings: TwoHgTeamPairing[];
  recentGames: TwoHgRecentGame[];
}

export interface ColorPresenceStats {
  color_key: string; // 'W' | 'U' | 'B' | 'R' | 'G'
  deck_count: number;
  total_games: number;
  wins: number;
  win_rate: number;
  avg_finish_position: number;
}

export interface ColorCountStats {
  color_count: number; // 0–5
  deck_count: number;
  total_games: number;
  wins: number;
  win_rate: number;
  avg_finish_position: number;
}

export interface AdvancedStatsResponse {
  colorMeta: ColorMetaStats[];
  gameSizeStats: GameSizeStats[];
  playerStreaks: PlayerStreak[];
  deckStreaks: DeckStreak[];
  twoHgStats: TwoHgStats;
  colorPresence: ColorPresenceStats[];
  colorCount: ColorCountStats[];
}

// MTG color identity
export type MtgColor = 'W' | 'U' | 'B' | 'R' | 'G';
export type MtgColorOrColorless = MtgColor | 'C';

// Comparison Builder types
export type PanelType = 'predefined' | 'comparison';

export type ColorFilterMode = 'and' | 'or' | 'only';

export type ComparisonGroupBy =
  | 'player'
  | 'deck'
  | 'commander'
  | 'color'
  | 'deck_age'
  | 'pod_size'
  | 'game_length'
  | 'game_type'
  | 'month'
  | 'year'
  | 'season'
  | 'day_of_week'
  | 'opponent_player'
  | 'opponent_commander';

export type ComparisonMetric =
  | 'win_rate'
  | 'total_games'
  | 'wins'
  | 'avg_finish_position'
  | 'recent_win_rate'
  | 'avg_survival_turns'
  | 'avg_turns_to_win'
  | 'top2_rate'
  | 'elimination_rate'
  | 'std_dev_finish_position'
  | 'first_elimination_rate';

export interface ComparisonConditions {
  game_type?: 'all' | 'standard' | '2hg';
  pod_size?: number;
  min_winning_turn?: number;
  max_winning_turn?: number;
  min_finish_position?: number;
  required_player_ids?: string[];
  required_commanders?: string[];
  date_from?: string;
  date_to?: string;
  min_games?: number;
  must_include_colors?: string[];
  color_mode?: ColorFilterMode;
  my_games_only?: boolean;
  my_decks_only?: boolean;
  opponent_player_ids?: string[];
  opponent_commanders?: string[];
  opponent_colors?: string[];
  opponent_color_mode?: ColorFilterMode;
  exclude_player_ids?: string[];
}

export interface ComparisonEntityFilter {
  player_ids?: string[];
  deck_ids?: string[];
  commanders?: string[];
  colors?: string[];
  color_mode?: ColorFilterMode; // mode for filter_colors — default 'and'
}

export interface ComparisonConfig {
  groupBy: ComparisonGroupBy;
  conditions: ComparisonConditions;
  entityFilter?: ComparisonEntityFilter;
  metrics: ComparisonMetric[];
  top_n?: number;
}

export interface ComparisonEntityResult {
  id: string;
  label: string;
  sublabel?: string;
  commander?: string | null;
  colors?: string | null;
  total_games: number;
  wins: number;
  win_rate: number | null;
  avg_finish_position: number | null;
  recent_win_rate: number | null;
  avg_survival_turns: number | null;
  avg_turns_to_win: number | null;
  top2_rate: number | null;
  elimination_rate: number | null;
  std_dev_finish_position: number | null;
  first_elimination_rate: number | null;
}

export interface ComparisonResult {
  groupBy: ComparisonGroupBy;
  metrics: ComparisonMetric[];
  conditions: ComparisonConditions;
  entities: ComparisonEntityResult[];
}

// Stat Panel types
export interface StatPanel {
  id: string;
  user_id: string;
  name: string;
  sections: string[];
  panel_type: PanelType;
  config: ComparisonConfig | null;
  is_shared: boolean;
  share_code: string | null;
  created_at: string;
  updated_at: string;
  owner_name?: string;
}

export interface CreateStatPanelInput {
  name: string;
  panel_type: PanelType;
  sections?: string[];
  config?: ComparisonConfig;
}

export interface UpdateStatPanelInput {
  name?: string;
  sections?: string[];
  config?: ComparisonConfig;
  is_shared?: boolean;
}

export interface StatPanelsResponse {
  own: StatPanel[];
  shared: StatPanel[];
}

// Live game session types
export interface LiveGameSession {
  session_id: string;
  seats: Record<string, string>; // { bottom: 'a3f9c12b', top: '...', ... }
  expires_at: string;
}

// Typed events sent by remote panels instead of full state writes.
// The host consumes these from the event queue, applies them to its own
// authoritative state, and writes the merged result back to the DB.
//
// Modeled as a discriminated union: each event type carries exactly the
// fields it needs, eliminating the prior pattern of `field?: T` + runtime
// non-null assertions in the dispatcher.
interface LiveGameEventBase {
  seat: string;     // which seat sent this event
  ts: number;       // client timestamp ms (for ordering / expiry)
}

export type LiveGameEvent =
  | (LiveGameEventBase & { type: 'life_change'; playerIdx: number; delta: number })
  | (LiveGameEventBase & { type: 'poison_change'; playerIdx: number; delta: number })
  | (LiveGameEventBase & { type: 'commander_tax_change'; playerIdx: number; delta: number })
  | (LiveGameEventBase & { type: 'energy_change'; playerIdx: number; delta: number })
  | (LiveGameEventBase & { type: 'experience_change'; playerIdx: number; delta: number })
  | (LiveGameEventBase & { type: 'toggle_monarch'; playerIdx: number })
  | (LiveGameEventBase & { type: 'toggle_initiative'; playerIdx: number })
  | (LiveGameEventBase & { type: 'toggle_citys_blessing'; playerIdx: number })
  | (LiveGameEventBase & {
      type: 'commander_damage_change';
      targetIdx: number;
      sourceIdx: number;
      isPartner: boolean;
      delta: number;
    })
  | (LiveGameEventBase & { type: 'eliminate'; playerIdx: number })
  | (LiveGameEventBase & { type: 'undo_eliminate'; playerIdx: number })
  | (LiveGameEventBase & { type: 'pass_turn' })
  | (LiveGameEventBase & { type: 'checkin' })
  | (LiveGameEventBase & {
      type: 'life_kill_attr';
      playerIdx: number;
      sourcePlayerIdx: number | null;
    })
  | (LiveGameEventBase & {
      type: 'poison_kill_attr';
      playerIdx: number;
      sourcePlayerIdx: number | null;
    })
  | (LiveGameEventBase & { type: 'view_open'; playerIdx: number })
  | (LiveGameEventBase & { type: 'view_heartbeat'; playerIdx: number })
  | (LiveGameEventBase & { type: 'view_close' });

/** All possible `type` values (back-compat alias derived from the union). */
export type LiveGameEventType = LiveGameEvent['type'];

/**
 * `Omit` distributed across a union. Plain `Omit<U, K>` collapses members so
 * the discriminant fields would be lost. Use this for shapes like "what the
 * remote panel constructs before stamping seat+ts on it."
 */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export interface LiveGameSeatResponse {
  seat: string;                  // 'bottom' | 'top' | 'left' | 'right'
  state: GameManagerState;
  remote_events: LiveGameEvent[]; // pending events for the host to apply
  updated_at: string;
  is_active: boolean;
}

// Game Manager shared types (also used by remote panel page and api.ts)
export interface CommanderInfo {
  name: string;
  artCropUrl?: string;
}

export interface PlayerSetup {
  playerId: string;
  deckId: string;
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

export type CommanderDamageMap = Record<number, Record<number, [number, number]>>;

export type GamePhase = 'setup' | 'seating' | 'playing' | 'ended';

/**
 * A seat is "filled" when the user has chosen a player, a deck, and a commander
 * for it. Used in the seating phase to gate the Start Game button and to flag
 * which PlayerPanels should render in empty (CTA) mode.
 */
export function isSeatFilled(p: { playerId?: string; deckId?: string; commander?: { name?: string } | null }): boolean {
  return !!p.playerId && !!p.deckId && !!p.commander?.name;
}

export interface GameManagerState {
  players: PlayerState[];
  commanderDamage: CommanderDamageMap;
  currentPlayerIdx: number;
  turnNumber: number;
  startingLife: number;
  phase: GamePhase;
  turnTimerSeconds: number;
  turnStartTime: number;
  notes: string;
  gameType?: GameType;
  firstPlayerIdx?: number;          // index of the player who goes first (set when first player is chosen)
  sessionCode?: string | null;      // hex code for live session; null = no active session
  sessionSeats?: Record<string, string> | null; // { bottom: 'a3f9c12b', ... }
  remoteCheckins?: Record<string, number> | null; // { bottom: <timestamp ms> } — set by remote panel on connect/heartbeat
  viewingPlayerIdx?: number | null;              // index of the player whose panel is being viewed (legacy, unused — see viewerMap)
  viewerMap?: Record<string, { targetIdx: number; viewerName: string; ts: number; firstSeenTs: number }> | null; // seat → entry
}

// My Collection types
export interface CollectionSummary {
  total_games: number;
  wins: number;
  win_rate: number | null;
  avg_finish: number | null;
  total_decks: number;
  total_lists: number;
}

export interface CollectionDeck {
  id: string;
  name: string;
  commander: string;
  colors: string;
  created_at: string;
  total_games: number;
  wins: number;
  win_rate: number | null;
  card_count: number;
}

export interface CollectionGame {
  game_id: string;
  played_at: string;
  winning_turn: number | null;
  game_type: string;
  finish_position: number;
  deck_name: string;
  commander: string;
  deck_colors: string;
  winner_name: string | null;
  pod_size: number;
}

export interface CollectionCommander {
  commander: string;
  total_games: number;
  wins: number;
  win_rate: number | null;
  avg_finish: number | null;
  deck_count: number;
}

export interface CollectionNemesis {
  opponent_id: string;
  opponent_name: string;
  games_together: number;
  their_wins: number;
  my_wins: number;
}

export interface CollectionNemesisCommander {
  enemy_commander: string;
  games_against: number;
  their_wins: number;
  my_wins: number;
}

export interface CollectionStreaks {
  current_type: 'win' | 'loss' | null;
  current_count: number;
  best_win_streak: number;
  worst_loss_streak: number;
}

export interface CollectionColorStat {
  colors: string;
  total_games: number;
  wins: number;
  win_rate: number | null;
}

export interface CollectionPodStat {
  pod_size: number;
  total_games: number;
  wins: number;
  win_rate: number | null;
}

export interface CollectionList {
  id: string;
  name: string;
  description: string | null;
  card_count: number;
  created_at: string;
  updated_at: string;
}

export interface MyCollectionResponse {
  player: { id: string; name: string } | null;
  summary: CollectionSummary | null;
  decks: CollectionDeck[];
  lists: CollectionList[];
  recentGames: CollectionGame[];
  commanders: CollectionCommander[];
  nemeses: CollectionNemesis[];
  nemesisCommanders: CollectionNemesisCommander[];
  streaks: CollectionStreaks | null;
  colorStats: CollectionColorStat[];
  podSizeStats: CollectionPodStat[];
  coachNotes: CoachNote[];
}

export interface DeckProfile {
  cards: { card_name: string; quantity: number; is_commander: number; is_proxy: number; type_line: string | null; mana_cost: string | null }[];
}

export interface CoachNote {
  id: string;
  topic: string;
  observation: string;
  reasoning: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoachToolCall {
  name: string;
  input: Record<string, unknown>;
}

export interface CoachMessage {
  role: 'user' | 'assistant';
  content: string;
  toolsUsed?: CoachToolCall[];
  /** Client-assigned UUID per assistant message, used to key rating chips. */
  uuid?: string;
}

// Form input types
export interface CreatePlayerInput {
  name: string;
}

export interface CreateDeckInput {
  player_id: string;
  name: string;
  commander: string;
  partner?: string | null;
  colors: string;
}

export interface GameResultInput {
  deck_id: string;
  player_id?: string; // Defaults to deck owner if omitted
  finish_position: number;
  eliminated_turn: number | null;
  team_number: number | null;
}

export interface CreateGameInput {
  played_at: string;
  notes: string | null;
  game_type: GameType;
  results: GameResultInput[];
}
