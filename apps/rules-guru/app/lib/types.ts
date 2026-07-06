export interface GameContextPlayer {
  playerName: string;
  deckName: string;
  commander: string | null;
  partner: string | null;
  deckId: string | null;
  cards: string[];
  /** Live board state from the game manager */
  life?: number;
  poison?: number;
  energy?: number;
  experience?: number;
  commanderTax?: number;
  isEliminated?: boolean;
  isConceded?: boolean;
  isMonarch?: boolean;
  hasInitiative?: boolean;
  hasCitysBlessing?: boolean;
  commanderDamage?: Record<string, number[]>;
  teamNumber?: number;
  teamName?: string;
}

export interface ActiveGameContext {
  players: GameContextPlayer[];
  gameType?: 'commander' | '2hg';
  turnNumber?: number | null;
  currentPlayer?: string | null;
  currentTeam?: string | null;
  focusPlayerName?: string;
  _timerNote?: string;
  _liveTimer?: {
    timerSeconds: number;
    elapsedSeconds: number;
    remaining: number;
    currentPlayer: string | null;
    turnNumber: number | null;
  };
}

export interface RulesPattern {
  id?: number;
  pattern_id: string;
  name: string;
  category: string;
  cr_refs: string | null;
  tags: string | null;
  content: string;
  examples_count: number;
  updated_at?: string;
  suggested_questions?: string | null;
}

export interface RulesConversation {
  id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface RulesMessage {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  content: string;
  pending_pattern: RulesPattern | null;
  created_at: string;
}

export interface ChatResponse {
  conversation_id: number;
  message_id: number;
  qa_log_id: number | null;
  response: string;
  pending_pattern: RulesPattern | null;
}

export interface ChatProcessingResponse {
  status: 'processing';
  conversation_id: number;
  user_message_id: number;
}

export interface ChatPollResponse {
  status: 'processing' | 'complete';
  conversation_id?: number;
  message_id?: number;
  qa_log_id?: number | null;
  response?: string;
  pending_pattern?: RulesPattern | null;
}
