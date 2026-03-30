export interface GameContextPlayer {
  playerName: string;
  deckName: string;
  commander: string | null;
  partner: string | null;
  deckId: number | null;
  cards: string[];
}

export interface ActiveGameContext {
  players: GameContextPlayer[];
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
  response: string;
  pending_pattern: RulesPattern | null;
}
