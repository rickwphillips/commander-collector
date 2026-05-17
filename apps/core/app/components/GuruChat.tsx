'use client';

import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef, memo } from 'react';
import {
  Collapse,
  Drawer,
  Typography,
  Box,
  Stack,
  Chip,
  Fab,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloseIcon from '@mui/icons-material/Close';
import AddCommentIcon from '@mui/icons-material/AddComment';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '@/lib/api';
import type { CoachMessage, CoachNote, CoachToolCall } from '@/lib/types';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { RuleTooltip } from '@commander/shared/components/RuleTooltip';
import { PatternTooltip } from '@commander/shared/components/PatternTooltip';
import { RatingChip, type RatingChipSubmit } from '@commander/shared/components/RatingChip';
import { looksLikeCRReference, looksLikePNumber } from '@commander/shared/components/cardNameUtils';
import { loadCardCatalog, isKnownCardName } from '@commander/shared/lib/cardCatalog';
import { ChatInput, type ChatInputHandle } from '@commander/shared/components/ChatInput';
import { ThinkingIndicator } from '@commander/shared/components/ThinkingIndicator';
import { useChatKeys } from '@commander/shared/lib/useChatKeys';

// basePath is empty in dev and /app/projects/commander in prod for the core app.
const BASE_PATH = process.env.NODE_ENV === 'development' ? '' : '/app/projects/commander';

// Style applied to lookup-tooltip wrappers when the child is a chip. The chip
// is its own visual cue, so we drop the dotted-underline and help-cursor that
// the tooltip components apply by default.
const CHIP_TOOLTIP_STYLE: React.CSSProperties = { borderBottom: 'none', cursor: 'inherit' };

export const GURU_DRAWER_WIDTH = 420;

// ── Chat history (localStorage) ───────────────────────────────────────────────

const HISTORY_KEY = 'coach_history';
const MAX_SESSIONS = 30;

interface ChatSession {
  id: string;
  title: string;
  messages: CoachMessage[];
  createdAt: string;
  updatedAt: string;
}

function loadHistory(): ChatSession[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as ChatSession[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(sessions: ChatSession[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
  } catch {}
}

function upsertSession(id: string, messages: CoachMessage[]): ChatSession[] {
  if (messages.length === 0) return loadHistory();
  const sessions = loadHistory();
  const title = (messages.find(m => m.role === 'user')?.content ?? 'New conversation').slice(0, 60);
  const now = new Date().toISOString();
  const idx = sessions.findIndex(s => s.id === id);
  const session: ChatSession = {
    id,
    title,
    messages,
    createdAt: idx >= 0 ? sessions[idx].createdAt : now,
    updatedAt: now,
  };
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  saveHistory(sessions);
  return sessions;
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

/** Build a context-aware list of thinking messages for this request */
function buildThinkingMessages(
  deckName?: string,
  commander?: string,
  userMessage?: string,
): string[] {
  const deck = deckName;
  const cmd  = commander;

  // Generic MTG-flavored messages that work without deck context
  const generic = [
    'Pulling up CR 704 — State-Based Actions...',
    'Consulting Scryfall for Oracle text...',
    'Checking your finish positions by pod size...',
    'Reading game notes from past sessions...',
    'Cross-referencing CR 601.2 — Casting Spells...',
    'Scouting your nemesis commander\'s decklist...',
    'Reviewing your last 30 games for patterns...',
    'Weighing Cyclonic Rift vs. Toxic Deluge...',
    'Considering the political angle of that play...',
    'Verifying deathtouch + trample interaction...',
    'Consulting the stack resolution rules...',
    'Analyzing your color identity gaps...',
    'Checking for counterspell coverage in that range...',
    'Looking at your removal package density...',
    'Evaluating Aristocrats vs. Stax matchup...',
    'Checking if Doomsday is in their 99...',
  ];

  // Deck/commander-specific messages (only added when context is available)
  const specific: string[] = [];
  if (deck) {
    specific.push(
      `Reviewing your ${deck} match history...`,
      `Analyzing ${deck} performance data...`,
      `Checking ${deck} for interaction pieces...`,
      `Evaluating ${deck}'s removal package...`,
      `Comparing ${deck} vs. your nemesis commanders...`,
    );
  }
  if (cmd) {
    specific.push(
      `Looking at ${cmd} synergies...`,
      `Checking ${cmd}'s win condition...`,
      `Scouting matchups for ${cmd}...`,
      `Verifying ${cmd}'s ability text on Scryfall...`,
    );
  }

  // Try to detect card-like tokens in the user's message (Title Case, 2+ words or known singles)
  if (userMessage) {
    const tokens = userMessage.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) ?? [];
    const unique = [...new Set(tokens)].slice(0, 3);
    for (const token of unique) {
      specific.push(`Looking up ${token} on Scryfall...`);
      specific.push(`Checking your deck for ${token}...`);
    }
  }

  // Interleave specific (front) with generic (back), shuffle neither — just combine
  return [...specific, ...generic];
}

export interface ActiveDeckContext {
  deckId: string;
  deckName: string;
  cardCount: number;
  commander: string;
  colors: string;
  // Set when the deck's main list is loaded on the same page so tools that
  // need list_id (saveListCards, resolveListImages, ...) can find it without
  // a second "List:" chip duplicating the same info.
  listId?: string;
  // Lowercase set of card names in the active deck. When a chat response
  // mentions a card that's already in the deck, the chip renders as a
  // tooltip-only reference (no rating). Cards outside this set are
  // recommendations and get a rateable chip.
  cardNames?: Set<string>;
}

export interface ActiveListContext {
  listId: string;
  listName: string;
  cardCount: number;
  cardNames?: Set<string>;
}

// ChatInput is imported from @commander/shared/components/ChatInput

// ─────────────────────────────────────────────────────────────────────────────

export interface GuruChatHandle {
  appendToInput: (text: string) => void;
  setActiveDeck: (data: ActiveDeckContext | null) => void;
  setActiveList: (data: ActiveListContext | null) => void;
}

interface GuruChatProps {
  notes: CoachNote[];
  open: boolean;
  onToggle: (open: boolean) => void;
  autoGreet?: string;
}

export const GuruChat = forwardRef<GuruChatHandle, GuruChatProps>(function GuruChat({ notes: initialNotes, open, onToggle, autoGreet }, ref) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [initialized, setInitialized] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [partialResponse, setPartialResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<CoachNote[]>(initialNotes);
  const [activeDeck, setActiveDeck] = useState<ActiveDeckContext | null>(null);
  const [activeList, setActiveList] = useState<ActiveListContext | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showToolDetails, setShowToolDetails] = useState(false);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const sessionIdRef = useRef<string>(Date.now().toString());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const thinkingMessagesRef = useRef<string[]>([]);
  const coachInputRef = useRef<ChatInputHandle>(null);
  const abortCtrlRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);
  loadingRef.current = loading;

  useImperativeHandle(ref, () => ({
    appendToInput: (text: string) => {
      coachInputRef.current?.appendText(text);
      coachInputRef.current?.focus();
    },
    setActiveDeck: (data: ActiveDeckContext | null) => {
      setActiveDeck(data);
    },
    setActiveList: (data: ActiveListContext | null) => {
      setActiveList(data);
    },
  }));

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Load history and restore last session once initialized
  useEffect(() => {
    if (!initialized) return;
    const sessions = loadHistory();
    setHistory(sessions);
    if (sessions.length > 0 && messages.length === 0) {
      const latest = sessions[0];
      sessionIdRef.current = latest.id;
      // Backfill uuids for messages saved before the rating-chip system landed
      // so re-renders have stable keys for the chips.
      const backfilled = latest.messages.map((m) =>
        m.role === 'assistant' && !m.uuid
          ? { ...m, uuid: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `m-${Date.now()}-${Math.random()}` }
          : m
      );
      setMessages(backfilled);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  // Auto-save current session whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      setHistory(upsertSession(sessionIdRef.current, messages));
    }
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (open && initialized) {
      coachInputRef.current?.focus();
    }
  }, [open, initialized]);

  // Warm the card-name catalog once the drawer mounts so isKnownCardName()
  // returns true matches by the time the first response renders.
  useEffect(() => {
    if (initialized) {
      void loadCardCatalog(`${BASE_PATH}/card-names.json`);
    }
  }, [initialized]);

  useChatKeys({
    onToggleToolDetails: () => setShowToolDetails(v => !v),
    onEscCancel: () => {
      if (!loadingRef.current) return;
      abortCtrlRef.current?.abort();
      abortCtrlRef.current = null;
      setLoading(false);
      setPartialResponse('');
    },
  });

  const handleOpen = () => {
    onToggle(true);
    if (!initialized) setInitialized(true);
  };

  // No auto-greet: opening the drawer with a deck/list active should attach
  // context and show suggested questions, not fire off a canned prompt.
  // (autoGreet prop kept for back-compat; intentionally unused.)
  void autoGreet;

  const handleNewChat = () => {
    abortCtrlRef.current?.abort();
    abortCtrlRef.current = null;
    sessionIdRef.current = Date.now().toString();
    setMessages([]);
    setError(null);
    coachInputRef.current?.setValue('');
    setLoading(false);
    setPartialResponse('');
    // Intentionally do NOT clear activeDeck/activeList: deck/list context is
    // a property of the page the user is on, not the conversation. Clearing
    // it here drops the chips back to the meta set even though the parent
    // page still has the same deck loaded.
    setShowHistory(false);
    coachInputRef.current?.focus();
  };

  const loadSession = (session: ChatSession) => {
    sessionIdRef.current = session.id;
    setMessages(session.messages);
    setShowHistory(false);
    coachInputRef.current?.focus();
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(s => s.id !== id);
    saveHistory(updated);
    setHistory(updated);
  };

  const handleStop = () => {
    abortCtrlRef.current?.abort();
    abortCtrlRef.current = null;
    setLoading(false);
    setPartialResponse('');
  };

  // Fired once per settled chip toggle. Forwards to the chat-feedback MCP tool
  // via the PHP proxy. Failures are swallowed; user-visible signal is the chip
  // state itself.
  const handleRate = useCallback(async (payload: RatingChipSubmit) => {
    try {
      await api.submitChatFeedback({
        surface:     'coach',
        messageUuid: payload.messageUuid,
        kind:        payload.kind,
        targetId:    payload.targetId,
        rating:      payload.rating,
        contentText: payload.contentText,
        deckId:      activeDeck?.deckId,
        listId:      activeDeck?.listId ?? activeList?.listId,
      });
    } catch (e) {
      console.warn('[coach] submitChatFeedback failed', e);
    }
  }, [activeDeck, activeList]);

  // Union of card-name sets from the active deck/list, lowercased. Used by
  // renderMarkdown to decide whether a card mention is a reference (no chip)
  // or a recommendation (rateable chip).
  const cardsInContext = (activeDeck?.cardNames || activeList?.cardNames) ?? null;

  const handleSend = async (text: string) => {
    if (!text) return;

    // Abort any in-flight request so new message takes over
    abortCtrlRef.current?.abort();
    const ctrl = new AbortController();
    abortCtrlRef.current = ctrl;

    setError(null);
    setPartialResponse('');

    // Build context-aware thinking messages before triggering loading state
    thinkingMessagesRef.current = buildThinkingMessages(
      activeDeck?.deckName,
      activeDeck?.commander,
      text,
    );

    const userMsg: CoachMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { response, toolsUsed } = await api.sendCoachMessage(
        text, messages, activeDeck ?? undefined, activeList ?? undefined,
        (partial) => { if (!ctrl.signal.aborted) setPartialResponse(partial); },
        ctrl.signal,
      );
      if (ctrl.signal.aborted) return;
      console.log('[coach] response received', { len: response.length, tools: toolsUsed.length, empty: response === '' });
      setPartialResponse('');
      const assistantMsg: CoachMessage = {
        role: 'assistant',
        content: response,
        toolsUsed,
        uuid: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `m-${Date.now()}`,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      if (ctrl.signal.aborted) return;
      console.error('[coach] sendCoachMessage threw:', err);
      setPartialResponse('');
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      if (!ctrl.signal.aborted) {
        setLoading(false);
        abortCtrlRef.current = null;
      }
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <PsychologyIcon sx={{ color: '#6B8E6B' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Commander Coach
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title={showToolDetails ? 'Hide tool details (Ctrl+O)' : 'Show tool details (Ctrl+O)'}>
            <IconButton
              size="small"
              onClick={() => setShowToolDetails(v => !v)}
              sx={{ color: showToolDetails ? 'primary.main' : 'inherit' }}
            >
              <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.65rem', lineHeight: 1, px: 0.25 }}>
                {'</>'}
              </Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title={showHistory ? 'Hide history' : 'Chat history'}>
            <IconButton
              size="small"
              onClick={() => setShowHistory(v => !v)}
              sx={{ color: showHistory ? 'primary.main' : 'inherit' }}
            >
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="New chat">
            <IconButton size="small" onClick={handleNewChat}>
              <AddCommentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton size="small" onClick={() => onToggle(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      {!initialized ? null : (
        <>
          {/* ── History panel (collapsible) ──────────────────────────────── */}
          <Collapse in={showHistory} unmountOnExit={false}>
            <Box
              sx={{
                maxHeight: 280,
                overflowY: 'auto',
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: (t) => t.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
              }}
            >
              {history.length === 0 ? (
                <Stack alignItems="center" spacing={1} sx={{ py: 4 }}>
                  <HistoryIcon sx={{ fontSize: 36, color: 'text.disabled' }} />
                  <Typography color="text.secondary" variant="body2">
                    No saved conversations yet.
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={0} divider={<Divider />}>
                  {history.map(session => (
                    <Stack
                      key={session.id}
                      direction="row"
                      alignItems="center"
                      onClick={() => loadSession(session)}
                      sx={{
                        px: 2, py: 1, cursor: 'pointer',
                        bgcolor: session.id === sessionIdRef.current
                          ? (t) => t.palette.mode === 'dark' ? 'grey.800' : 'grey.100'
                          : 'transparent',
                        '&:hover': { bgcolor: (t) => t.palette.mode === 'dark' ? 'grey.800' : 'grey.100' },
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ fontWeight: session.id === sessionIdRef.current ? 600 : 400 }}
                        >
                          {session.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {relativeDate(session.updatedAt)} · {session.messages.length} messages
                        </Typography>
                      </Box>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={(e) => deleteSession(session.id, e)}
                          sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                        >
                          <DeleteIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Box>
          </Collapse>

          {/* ── Messages panel ───────────────────────────────────────────── */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 2,
              py: 1.5,
              bgcolor: (t) =>
                t.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
            }}
          >
            {messages.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <PsychologyIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                  Ask me anything about your Commander performance.
                </Typography>
                <Stack spacing={1} alignItems="center">
                  {(activeDeck
                    ? [
                        `Give me a focused overview of ${activeDeck.deckName}`,
                        `What are the key synergies in ${activeDeck.deckName}?`,
                        `What are this deck's win conditions and biggest weaknesses?`,
                        `Suggest cuts and additions for ${activeDeck.deckName}`,
                      ]
                    : activeList
                    ? [
                        `Give me an overview of "${activeList.listName}"`,
                        `What are the notable synergies in this list?`,
                        `What's missing — any obvious gaps?`,
                        `Suggest cuts and additions for "${activeList.listName}"`,
                      ]
                    : [
                        'How can I improve?',
                        'Which deck should I retire?',
                        'What beats my nemesis?',
                        'Suggest cards for my best deck',
                      ]
                  ).map((q) => (
                    <Chip
                      key={q}
                      label={q}
                      size="small"
                      variant="outlined"
                      clickable
                      onClick={() => { coachInputRef.current?.setValue(q); coachInputRef.current?.focus(); }}
                      sx={{ width: 'fit-content' }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {messages.map((msg, i) => (
              <ChatBubble
                key={msg.uuid ?? i}
                message={msg}
                showToolDetails={showToolDetails}
                onRate={handleRate}
                cardsInContext={cardsInContext}
              />
            ))}

            {loading && (
              <Box sx={{ mt: 1 }}>
                {partialResponse && (
                  <Box sx={{ opacity: 0.7 }}>
                    <ChatBubble
                      message={{ role: 'assistant', content: partialResponse }}
                      onRate={handleRate}
                      cardsInContext={cardsInContext}
                    />
                  </Box>
                )}
                <ThinkingIndicator messages={thinkingMessagesRef.current} />
              </Box>
            )}

            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Active context indicator */}
          {(activeDeck || activeList) && (
            <Box sx={{ px: 1.5, pt: 1, flexShrink: 0, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {activeDeck && (
                <Chip
                  label={`Deck: ${activeDeck.deckName} (${activeDeck.cardCount} cards)`}
                  size="small"
                  color="success"
                  variant="outlined"
                  onDelete={() => setActiveDeck(null)}
                />
              )}
              {activeList && (
                <Chip
                  label={`List: ${activeList.listName} (${activeList.cardCount} cards)`}
                  size="small"
                  color="info"
                  variant="outlined"
                  onDelete={() => setActiveList(null)}
                />
              )}
            </Box>
          )}

          {/* Input */}
          <ChatInput
            ref={coachInputRef}
            onSend={handleSend}
            onStop={handleStop}
            loading={loading}
            placeholder="Ask the coach…"
            elevation={0}
          />
        </>
      )}
    </Box>
  );

  return (
    <>
      {/* Toggle FAB */}
      <Tooltip title="Commander Coach" placement="left">
        <Fab
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#6B8E6B',
            color: 'white',
            '&:hover': { bgcolor: '#5A7D5A' },
            zIndex: (t) => t.zIndex.drawer + 1,
            display: open ? 'none' : 'flex',
          }}
        >
          <PsychologyIcon />
        </Fab>
      </Tooltip>

      {/* Mobile: temporary overlay drawer */}
      {isMobile ? (
        <Drawer
          anchor="right"
          open={open}
          onClose={() => onToggle(false)}
          variant="temporary"
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop: persistent drawer that pushes content */
        <Drawer
          anchor="right"
          open={open}
          variant="persistent"
          sx={{
            width: open ? GURU_DRAWER_WIDTH : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: GURU_DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
});

// ── Tool indicator labels ─────────────────────────────────────────────────

const TOOL_LABELS: Record<string, string> = {
  lookup_card:          'Looked up card',
  lookup_decklist:      'Fetched full decklist',
  check_card_in_deck:   'Checked deck for card',
  search_deck_cards:    "Searched deck's card list",
  get_deck_stats:       'Fetched match history',
  save_coach_note:      'Saved note',
  get_pattern:          'Checked rules pattern',
  lookup_opponent_deck: 'Looked up opponent deck',
  get_player_stats:     'Fetched player stats',
  get_player_lists:     'Fetched list index',
  get_game_notes:       'Read game notes',
  get_game_history:     'Queried game history',
  create_list:          'Saved list',
  get_list_cards:       'Fetched list cards',
  update_list:          'Updated list',
  search_scryfall:      'Searched Scryfall',
  search_oracle:        'Searched oracle text',
  web_search:           'Searched the web',
};

function toolLabel(tool: CoachToolCall): string {
  const base = TOOL_LABELS[tool.name] ?? tool.name;
  if (tool.name === 'lookup_card') {
    const names = Array.isArray(tool.input.names) ? tool.input.names as string[]
                : tool.input.name ? [tool.input.name as string]
                : [];
    if (names.length === 1) return `${base}: ${names[0]}`;
    if (names.length > 1)   return `${base}: ${names.slice(0, 3).join(', ')}${names.length > 3 ? ` +${names.length - 3}` : ''}`;
  }
  if (tool.name === 'check_card_in_deck' && tool.input.card_name) return `${base}: ${tool.input.card_name}`;
  if (tool.name === 'search_deck_cards' && (tool.input.query || tool.input.type_category)) {
    const q = [tool.input.type_category, tool.input.query].filter(Boolean).join(' / ');
    return `${base}: ${q}`;
  }
  if (tool.name === 'lookup_opponent_deck' && tool.input.commander_name) return `${base}: ${tool.input.commander_name}`;
  if (tool.name === 'create_list' && tool.input.name) return `${base}: "${tool.input.name}"`;
  if (tool.name === 'update_list' && tool.input.list_id) return `${base} #${tool.input.list_id}`;
  if (tool.name === 'search_scryfall' && tool.input.query) return `${base}: ${tool.input.query}`;
  if (tool.name === 'search_oracle' && tool.input.text) return `${base}: "${tool.input.text}"`;
  if (tool.name === 'web_search' && tool.input.query) return `${base}: ${tool.input.site ? `[${tool.input.site}] ` : ''}${tool.input.query}`;
  return base;
}

// ── Chat bubble with basic markdown rendering ─────────────────────────────

const ChatBubble = memo(function ChatBubble({
  message, showToolDetails, onRate, cardsInContext,
}: {
  message: CoachMessage;
  showToolDetails?: boolean;
  onRate?: (payload: RatingChipSubmit) => void | Promise<void>;
  cardsInContext?: Set<string> | null;
}) {
  const isUser = message.role === 'user';
  const displayContent = message.content
    .replace(/\nCARDS:.*$/m, '')
    .trim();
  const hasTools = !isUser && message.toolsUsed && message.toolsUsed.length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1.5,
      }}
    >
      <Box sx={{ maxWidth: '85%' }}>
        {hasTools && (
          <>
            <Collapse in={showToolDetails}>
              <Stack direction="row" flexWrap="wrap" spacing={0.5} sx={{ mb: 0.5 }}>
                {message.toolsUsed!.map((t, i) => (
                  <Chip
                    key={i}
                    label={toolLabel(t)}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.65rem', height: 18, borderColor: '#6B8E6B60', color: '#6B8E6B' }}
                  />
                ))}
              </Stack>
            </Collapse>
            {!showToolDetails && (
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.25, fontSize: '0.6rem' }}>
                {message.toolsUsed!.length} tool{message.toolsUsed!.length !== 1 ? 's' : ''} used
              </Typography>
            )}
          </>
        )}
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: (t) =>
              isUser
                ? t.palette.mode === 'dark'
                  ? '#8B451340'
                  : '#D2691E15'
                : t.palette.mode === 'dark'
                  ? 'grey.800'
                  : 'white',
            border: 1,
            borderColor: isUser ? 'transparent' : 'divider',
          }}
        >
          <Typography
            variant="body2"
            component="div"
            sx={{
              whiteSpace: 'pre-wrap',
              '& strong': { fontWeight: 700 },
              '& em': { fontStyle: 'italic' },
              '& code': { background: 'rgba(0,0,0,0.1)', padding: '1px 4px', borderRadius: '3px' },
            }}
          >
            {renderMarkdown(displayContent, message.uuid, onRate, cardsInContext ?? null)}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
});

/**
 * Render assistant markdown with the four-kind rating-chip matrix:
 *   - card in active deck/list → CardTooltip + plain bold (no chip)
 *   - card NOT in active deck/list → CardTooltip + RatingChip(kind=card)
 *   - CR ref (e.g. **117.3c**) → RuleTooltip + RatingChip(kind=cr_rule)
 *   - P ref  (e.g. **P523**)   → PatternTooltip + RatingChip(kind=pattern)
 *   - [!claim topic="..."]body[/claim] → RatingChip(kind=claim), no tooltip
 *   - everything else: plain bold / italic / code
 *
 * messageUuid is the per-message client UUID; when missing (e.g. the streaming
 * partial bubble), all chips fall back to noop (no submission).
 */
function renderMarkdown(
  text: string,
  messageUuid: string | undefined,
  onRate: ((p: RatingChipSubmit) => void | Promise<void>) | undefined,
  cardsInContext: Set<string> | null,
): React.ReactNode {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  const canRate = !!(messageUuid && onRate);
  const cardInCtx = (name: string) => !!cardsInContext && cardsInContext.has(name.trim().toLowerCase());

  // Split tokens we recognize: [[chip]], [!claim ...]...[/claim], **bold**, *em*, `code`.
  const splitRe = /(\[\[.*?\]\]|\[!claim\s+topic="[^"]*"\][\s\S]*?\[\/claim\]|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) result.push(<br key={`br-${lineIdx}`} />);
    const parts = line.split(splitRe);

    parts.forEach((part, partIdx) => {
      const key = `${lineIdx}-${partIdx}`;

      // [[Card Name]] explicit author markup → chip (no underline; chip is the cue)
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const name = part.slice(2, -2).trim();
        if (canRate && !cardInCtx(name)) {
          result.push(
            <CardTooltip key={key} name={name} style={CHIP_TOOLTIP_STYLE}>
              <RatingChip
                kind="card"
                targetId={name.toLowerCase()}
                messageUuid={messageUuid!}
                contentText={name}
                onSubmit={onRate!}
              >
                {name}
              </RatingChip>
            </CardTooltip>
          );
        } else {
          result.push(
            <CardTooltip key={key} name={name} style={CHIP_TOOLTIP_STYLE}>
              <Chip
                label={name}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem', height: 20, cursor: 'default', verticalAlign: 'middle', mx: 0.25,
                  borderColor: 'primary.main', color: 'primary.main', '& .MuiChip-label': { px: 0.75 },
                }}
              />
            </CardTooltip>
          );
        }
        return;
      }

      // [!claim topic="..."]body[/claim] → rateable claim chip, no tooltip
      const claimMatch = /^\[!claim\s+topic="([^"]*)"\]([\s\S]*?)\[\/claim\]$/.exec(part);
      if (claimMatch) {
        const topic = claimMatch[1].trim();
        const body  = claimMatch[2].trim();
        if (canRate && topic) {
          result.push(
            <RatingChip
              key={key}
              kind="claim"
              targetId={topic}
              messageUuid={messageUuid!}
              contentText={body}
              onSubmit={onRate!}
            >
              {body}
            </RatingChip>
          );
        } else {
          result.push(<span key={key}>{body}</span>);
        }
        return;
      }

      // **bold** → dispatch by content
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);

        // AI commonly emits `**Baseline: [[Sol Ring]] — ...**`, wrapping a
        // [[Card]] chip inside bold. The outer regex matched the bold first
        // and would otherwise render the brackets as literal text. Re-split
        // the bold's interior on [[...]] so the chips render inside <strong>.
        if (inner.includes('[[') && inner.includes(']]')) {
          const subRe = /(\[\[.*?\]\])/g;
          const subParts = inner.split(subRe);
          const rendered: React.ReactNode[] = subParts.map((sp, i) => {
            const subKey = `${key}-s${i}`;
            if (sp.startsWith('[[') && sp.endsWith(']]')) {
              const n = sp.slice(2, -2).trim();
              if (canRate && !cardInCtx(n)) {
                return (
                  <CardTooltip key={subKey} name={n} style={CHIP_TOOLTIP_STYLE}>
                    <RatingChip
                      kind="card"
                      targetId={n.toLowerCase()}
                      messageUuid={messageUuid!}
                      contentText={n}
                      onSubmit={onRate!}
                    >
                      {n}
                    </RatingChip>
                  </CardTooltip>
                );
              }
              return (
                <CardTooltip key={subKey} name={n} style={CHIP_TOOLTIP_STYLE}>
                  <Chip
                    label={n}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.7rem', height: 20, cursor: 'default', verticalAlign: 'middle', mx: 0.25,
                      borderColor: 'primary.main', color: 'primary.main', '& .MuiChip-label': { px: 0.75 },
                    }}
                  />
                </CardTooltip>
              );
            }
            return <span key={subKey}>{sp}</span>;
          });
          result.push(<strong key={key}>{rendered}</strong>);
          return;
        }

        if (looksLikePNumber(inner)) {
          if (canRate) {
            result.push(
              <PatternTooltip key={key} reference={inner} style={CHIP_TOOLTIP_STYLE}>
                <RatingChip
                  kind="pattern"
                  targetId={inner.toLowerCase().replace(/^#/, '')}
                  messageUuid={messageUuid!}
                  contentText={inner}
                  onSubmit={onRate!}
                >
                  {inner}
                </RatingChip>
              </PatternTooltip>
            );
          } else {
            result.push(
              <PatternTooltip key={key} reference={inner}>
                <strong>{inner}</strong>
              </PatternTooltip>
            );
          }
          return;
        }

        if (looksLikeCRReference(inner)) {
          if (canRate) {
            result.push(
              <RuleTooltip key={key} reference={inner} style={CHIP_TOOLTIP_STYLE}>
                <RatingChip
                  kind="cr_rule"
                  targetId={inner.toLowerCase().replace(/^cr\s+/i, '')}
                  messageUuid={messageUuid!}
                  contentText={inner}
                  onSubmit={onRate!}
                >
                  {inner}
                </RatingChip>
              </RuleTooltip>
            );
          } else {
            result.push(
              <RuleTooltip key={key} reference={inner}>
                <strong>{inner}</strong>
              </RuleTooltip>
            );
          }
          return;
        }

        if (isKnownCardName(inner)) {
          if (canRate && !cardInCtx(inner)) {
            // Out-of-deck recommendation: chip handles the visual cue, no underline.
            result.push(
              <CardTooltip key={key} name={inner} style={CHIP_TOOLTIP_STYLE}>
                <RatingChip
                  kind="card"
                  targetId={inner.toLowerCase()}
                  messageUuid={messageUuid!}
                  contentText={inner}
                  onSubmit={onRate!}
                >
                  {inner}
                </RatingChip>
              </CardTooltip>
            );
          } else {
            // In-deck reference: plain bold with the dotted underline cue.
            result.push(
              <CardTooltip key={key} name={inner} style={{ borderBottom: '1px dotted currentColor' }}>
                <strong>{inner}</strong>
              </CardTooltip>
            );
          }
          return;
        }

        result.push(<strong key={key}>{inner}</strong>);
        return;
      }

      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        result.push(<em key={key}>{part.slice(1, -1)}</em>);
        return;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        result.push(<code key={key}>{part.slice(1, -1)}</code>);
        return;
      }
      result.push(<span key={key}>{part}</span>);
    });
  });

  return result;
}
