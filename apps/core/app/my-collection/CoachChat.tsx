'use client';

import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import {
  Collapse,
  Drawer,
  Typography,
  Box,
  TextField,
  IconButton,
  Stack,
  CircularProgress,
  Paper,
  Chip,
  Fab,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import AddCommentIcon from '@mui/icons-material/AddComment';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '@/lib/api';
import type { CoachMessage, CoachNote, CoachToolCall } from '@/lib/types';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { looksLikeCardName } from '@commander/shared/components/cardNameUtils';

export const COACH_DRAWER_WIDTH = 420;

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

function upsertSession(id: string, messages: CoachMessage[]) {
  if (messages.length === 0) return;
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
}

export interface ActiveListContext {
  listId: string;
  listName: string;
  cardCount: number;
}

export interface CoachChatHandle {
  appendToInput: (text: string) => void;
  setActiveDeck: (data: ActiveDeckContext | null) => void;
  setActiveList: (data: ActiveListContext | null) => void;
}

interface CoachChatProps {
  notes: CoachNote[];
  open: boolean;
  onToggle: (open: boolean) => void;
}

export const CoachChat = forwardRef<CoachChatHandle, CoachChatProps>(function CoachChat({ notes: initialNotes, open, onToggle }, ref) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [initialized, setInitialized] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingMsg, setThinkingMsg] = useState('');
  const [partialResponse, setPartialResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<CoachNote[]>(initialNotes);
  const [activeDeck, setActiveDeck] = useState<ActiveDeckContext | null>(null);
  const [activeList, setActiveList] = useState<ActiveListContext | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const sessionIdRef = useRef<string>(Date.now().toString());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const thinkingInterval = useRef<ReturnType<typeof setInterval>>(null);
  const thinkingMessagesRef = useRef<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortCtrlRef = useRef<AbortController | null>(null);

  useImperativeHandle(ref, () => ({
    appendToInput: (text: string) => {
      setInput((prev) => {
        const trimmed = prev.trimEnd();
        return trimmed ? `${trimmed} ${text}` : text;
      });
      setTimeout(() => inputRef.current?.focus(), 50);
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

  // Rotate thinking message while loading
  useEffect(() => {
    if (loading) {
      const msgs = thinkingMessagesRef.current;
      let idx = 0;
      setThinkingMsg(msgs[0] ?? '');
      thinkingInterval.current = setInterval(() => {
        idx = (idx + 1) % msgs.length;
        setThinkingMsg(msgs[idx]);
      }, 3000);
    } else {
      if (thinkingInterval.current) clearInterval(thinkingInterval.current);
      setThinkingMsg('');
    }
    return () => {
      if (thinkingInterval.current) clearInterval(thinkingInterval.current);
    };
  }, [loading]);

  // Load history and restore last session once initialized
  useEffect(() => {
    if (!initialized) return;
    const sessions = loadHistory();
    setHistory(sessions);
    // Restore most recent session automatically
    if (sessions.length > 0 && messages.length === 0) {
      const latest = sessions[0];
      sessionIdRef.current = latest.id;
      setMessages(latest.messages);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  // Auto-save current session whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      upsertSession(sessionIdRef.current, messages);
      setHistory(loadHistory());
    }
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (open && initialized) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, initialized]);

  const handleOpen = () => {
    onToggle(true);
    if (!initialized) setInitialized(true);
  };

  const handleNewChat = () => {
    abortCtrlRef.current?.abort();
    abortCtrlRef.current = null;
    sessionIdRef.current = Date.now().toString();
    setMessages([]);
    setError(null);
    setInput('');
    setLoading(false);
    setPartialResponse('');
    setActiveDeck(null);
    setActiveList(null);
    setShowHistory(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const loadSession = (session: ChatSession) => {
    sessionIdRef.current = session.id;
    setMessages(session.messages);
    setShowHistory(false);
    setTimeout(() => inputRef.current?.focus(), 100);
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

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    // Abort any in-flight request so new message takes over
    abortCtrlRef.current?.abort();
    const ctrl = new AbortController();
    abortCtrlRef.current = ctrl;

    setInput('');
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
      const assistantMsg: CoachMessage = { role: 'assistant', content: response, toolsUsed };
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
          <SmartToyIcon sx={{ color: '#6B8E6B' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Commander Coach
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5}>
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
                <SmartToyIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                  Ask me anything about your Commander performance.
                </Typography>
                <Stack spacing={1} alignItems="center">
                  {[
                    'How can I improve?',
                    'Which deck should I retire?',
                    'What beats my nemesis?',
                    activeDeck ? `Suggest cards for ${activeDeck.deckName}` : 'Suggest cards for my best deck',
                  ].map((q) => (
                    <Chip
                      key={q}
                      label={q}
                      size="small"
                      variant="outlined"
                      clickable
                      onClick={() => setInput(q)}
                      sx={{ width: 'fit-content' }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}

            {loading && (
              <Box sx={{ mt: 1 }}>
                {partialResponse && (
                  <Box sx={{ opacity: 0.7 }}>
                    <ChatBubble message={{ role: 'assistant', content: partialResponse }} />
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: partialResponse ? 1 : 0 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    {thinkingMsg}
                  </Typography>
                </Box>
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
          {loading && (
            <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, fontStyle: 'italic' }}>
              Type to interrupt the coach...
            </Typography>
          )}
          <Stack direction="row" spacing={1} sx={{ p: 1.5, pt: loading ? 0.5 : 1.5, flexShrink: 0 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={loading ? 'Add more details...' : 'Ask the coach...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              multiline
              maxRows={3}
              inputRef={inputRef}
            />
            {loading && !input.trim() ? (
              <Tooltip title="Stop">
                <IconButton onClick={handleStop} color="default">
                  <StopCircleIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title={loading ? 'Interrupt and send' : 'Send'}>
                <span>
                  <IconButton
                    onClick={handleSend}
                    disabled={!input.trim()}
                    color={loading ? 'warning' : 'primary'}
                  >
                    <SendIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Stack>
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
          <SmartToyIcon />
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
            width: open ? COACH_DRAWER_WIDTH : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: COACH_DRAWER_WIDTH,
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

function ChatBubble({ message }: { message: CoachMessage }) {
  const isUser = message.role === 'user';
  const displayContent = message.content
    .replace(/\nCARDS:.*$/m, '')
    .trim();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1.5,
      }}
    >
      <Box sx={{ maxWidth: '85%' }}>
        {!isUser && message.toolsUsed && message.toolsUsed.length > 0 && (
          <Stack direction="row" flexWrap="wrap" spacing={0.5} sx={{ mb: 0.5 }}>
            {message.toolsUsed.map((t, i) => (
              <Chip
                key={i}
                label={toolLabel(t)}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.65rem', height: 18, borderColor: '#6B8E6B60', color: '#6B8E6B' }}
              />
            ))}
          </Stack>
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
            {renderMarkdown(displayContent)}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

/** Render markdown text as React elements with CardTooltip on bold card names and [[Card Name]] chips */
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) result.push(<br key={`br-${lineIdx}`} />);

    const parts = line.split(/(\[\[.*?\]\]|\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    parts.forEach((part, partIdx) => {
      const key = `${lineIdx}-${partIdx}`;

      if (part.startsWith('[[') && part.endsWith(']]')) {
        const name = part.slice(2, -2).trim();
        result.push(
          <CardTooltip key={key} name={name}>
            <Chip
              label={name}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.7rem',
                height: 20,
                cursor: 'default',
                verticalAlign: 'middle',
                mx: 0.25,
                borderColor: 'primary.main',
                color: 'primary.main',
                '& .MuiChip-label': { px: 0.75 },
              }}
            />
          </CardTooltip>
        );
      } else if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        if (looksLikeCardName(inner)) {
          result.push(
            <CardTooltip key={key} name={inner} style={{ borderBottom: '1px dotted currentColor' }}>
              <strong>{inner}</strong>
            </CardTooltip>
          );
        } else {
          result.push(<strong key={key}>{inner}</strong>);
        }
      } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        result.push(<em key={key}>{part.slice(1, -1)}</em>);
      } else if (part.startsWith('`') && part.endsWith('`')) {
        result.push(<code key={key}>{part.slice(1, -1)}</code>);
      } else {
        result.push(<span key={key}>{part}</span>);
      }
    });
  });

  return result;
}
