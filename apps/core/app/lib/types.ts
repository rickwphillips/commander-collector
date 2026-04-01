// Game type
export type GameType = 'standard' | '2hg';

// Scan draft (cross-device persistence)
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
  playerId: number | '';
  colors: string[];
}

// Scryfall card cache
export interface ScryfallCachedCard {
  id?: number;
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

// Deck card list entry
export interface DeckCard {
  id?: number;
  deck_id: number;
  scryfall_id: string | null;
  card_name: string;
  quantity: number;
  is_commander: number; // 0 or 1
  is_proxy: number;     // 0 or 1
  // Joined from scryfall_card_cache
  image_uri?: string | null;
  back_image_uri?: string | null;
  colors?: string;
  color_identity?: string;
  type_line?: string | null;
  mana_cost?: string | null;
}

export interface CreateDeckCardInput {
  card_name: string;
  scryfall_id?: string | null;
  quantity?: number;
  is_commander?: boolean;
  is_proxy?: boolean;
}

// Card Lists (standalone, no commander restriction)
export interface CardList {
  id: number;
  name: string;
  description: string | null;
  card_count: number;
  created_at: string;
  updated_at: string;
}

export interface CardListDetail extends CardList {
  cards: ListCard[];
}

export interface ListCard {
  id?: number;
  list_id: number;
  scryfall_id: string | null;
  card_name: string;
  quantity: number;
  is_commander: number;
  is_proxy: number;
  image_uri?: string | null;
  back_image_uri?: string | null;
  colors?: string;
  color_identity?: string;
  type_line?: string | null;
  mana_cost?: string | null;
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
  has_w: number; // 0 or 1
  has_u: number;
  has_b: number;
  has_r: number;
  has_g: number;
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

export interface TwoHgPlayerStats {
  player_id: number;
  player_name: string;
  total_games: number;
  wins: number;
  win_rate: number;
}

export interface TwoHgTeamPairing {
  player1_id: number;
  player1_name: string;
  player2_id: number;
  player2_name: string;
  total_games: number;
  wins: number;
  win_rate: number;
}

export interface TwoHgRecentGame {
  id: number;
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
  required_player_ids?: number[];
  required_commanders?: string[];
  date_from?: string;
  date_to?: string;
  min_games?: number;
  must_include_colors?: string[];
  color_mode?: ColorFilterMode;
  my_games_only?: boolean;
  my_decks_only?: boolean;
  opponent_player_ids?: number[];
  opponent_commanders?: string[];
  opponent_colors?: string[];
  opponent_color_mode?: ColorFilterMode;
  exclude_player_ids?: number[];
}

export interface ComparisonEntityFilter {
  player_ids?: number[];
  deck_ids?: number[];
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
  id: number | string;
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
  id: number;
  user_id: number;
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
  session_id: number;
  seats: Record<string, string>; // { bottom: 'a3f9c12b', top: '...', ... }
  expires_at: string;
}

// Typed events sent by remote panels instead of full state writes.
// The host consumes these from the event queue, applies them to its own
// authoritative state, and writes the merged result back to the DB.
export type LiveGameEventType =
  | 'life_change'
  | 'poison_change'
  | 'commander_tax_change'
  | 'energy_change'
  | 'experience_change'
  | 'toggle_monarch'
  | 'toggle_initiative'
  | 'toggle_citys_blessing'
  | 'commander_damage_change'
  | 'eliminate'
  | 'undo_eliminate'
  | 'pass_turn'
  | 'checkin'
  | 'life_kill_attr'
  | 'poison_kill_attr'
  | 'view_open'       // remote panel opened another player's panel overlay
  | 'view_heartbeat'  // remote panel is still viewing (sent every ~5s); -1 = stopped
  | 'view_close';     // remote panel closed the overlay

export interface LiveGameEvent {
  type: LiveGameEventType;
  playerIdx?: number;         // target player index (most events)
  targetIdx?: number;         // commander_damage_change: player receiving damage
  sourceIdx?: number;         // commander_damage_change: player dealing damage
  isPartner?: boolean;        // commander_damage_change: is partner commander
  delta?: number;             // numeric change (life_change, poison_change, etc.)
  sourcePlayerIdx?: number | null; // life_kill_attr / poison_kill_attr: who caused the kill (null = skip)
  seat: string;               // which seat sent this event
  ts: number;                 // client timestamp ms (for ordering / expiry)
}

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
  turnStartTime: number;
  notes: string;
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
  id: number;
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
  game_id: number;
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
  opponent_id: number;
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
  id: number;
  name: string;
  description: string | null;
  card_count: number;
  created_at: string;
  updated_at: string;
}

export interface MyCollectionResponse {
  player: { id: number; name: string } | null;
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
  id: number;
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
}

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
  notes: string | null;
  game_type: GameType;
  results: GameResultInput[];
}
