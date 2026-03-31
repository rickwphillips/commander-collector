'use client';

import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import {
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
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { api } from '@/lib/api';
import type { CoachMessage, CoachNote } from '@/lib/types';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { looksLikeCardName } from '@commander/shared/components/cardNameUtils';

export const COACH_DRAWER_WIDTH = 420;

const THINKING_MESSAGES = [
  'Reviewing your match history...',
  'Analyzing deck performance...',
  'Checking commander matchups...',
  'Looking at your win rate trends...',
  'Considering meta adaptations...',
  'Evaluating color identity gaps...',
  'Studying your nemesis matchups...',
  'Consulting the Comprehensive Rules...',
  'Checking Scryfall for options...',
  'Analyzing pod dynamics...',
];

export interface ActiveDeckContext {
  deckId: number;
  deckName: string;
  cardCount: number;
  /** Pre-formatted context string for the coach prompt */
  contextString: string;
}

export interface CoachChatHandle {
  appendToInput: (text: string) => void;
  setActiveDeck: (data: ActiveDeckContext | null) => void;
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
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<CoachNote[]>(initialNotes);
  const [activeDeck, setActiveDeck] = useState<ActiveDeckContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const thinkingInterval = useRef<ReturnType<typeof setInterval>>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      let idx = 0;
      setThinkingMsg(THINKING_MESSAGES[0]);
      thinkingInterval.current = setInterval(() => {
        idx = (idx + 1) % THINKING_MESSAGES.length;
        setThinkingMsg(THINKING_MESSAGES[idx]);
      }, 3000);
    } else {
      if (thinkingInterval.current) clearInterval(thinkingInterval.current);
      setThinkingMsg('');
    }
    return () => {
      if (thinkingInterval.current) clearInterval(thinkingInterval.current);
    };
  }, [loading]);

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

  const handleNewChat = async () => {
    setMessages([]);
    setError(null);
    setInput('');
    setActiveDeck(null);
    try {
      const freshNotes = await api.getCoachNotes();
      setNotes(freshNotes);
    } catch {
      // Keep cached notes on failure
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setError(null);

    // Append active deck profile as a system hint (hidden from display)
    let messageText = text;
    if (activeDeck) {
      messageText = `${text}\n\n[ACTIVE_DECK_PROFILE: ${activeDeck.deckName}]\n${activeDeck.contextString}`;
    }

    const userMsg: CoachMessage = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { response } = await api.sendCoachMessage(messageText, messages);
      const assistantMsg: CoachMessage = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setLoading(false);
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
          <Tooltip title="New chat">
            <IconButton size="small" onClick={handleNewChat} disabled={loading}>
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
          {/* Coach Notes */}
          {notes.length > 0 && (
            <Paper
              variant="outlined"
              square
              sx={{
                px: 2,
                py: 1,
                flexShrink: 0,
                bgcolor: (t) =>
                  t.palette.mode === 'dark' ? '#6B8E6B15' : '#6B8E6B08',
                borderColor: '#6B8E6B40',
                borderLeft: 0,
                borderRight: 0,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#6B8E6B', display: 'block', mb: 0.5 }}>
                Coach&apos;s Notes ({notes.length})
              </Typography>
              {notes.slice(0, 3).map((note) => (
                <Box key={note.id} sx={{ mb: 0.25 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {note.topic}:
                  </Typography>{' '}
                  <Typography variant="caption" color="text.secondary">
                    {note.observation}
                  </Typography>
                </Box>
              ))}
              {notes.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  +{notes.length - 3} more
                </Typography>
              )}
            </Paper>
          )}

          {/* Messages */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {thinkingMsg}
                </Typography>
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

          {/* Active deck indicator */}
          {activeDeck && (
            <Box sx={{ px: 1.5, pt: 1, flexShrink: 0 }}>
              <Chip
                label={`Viewing: ${activeDeck.deckName} (${activeDeck.cardCount} cards)`}
                size="small"
                color="success"
                variant="outlined"
                onDelete={() => setActiveDeck(null)}
              />
            </Box>
          )}

          {/* Input */}
          <Stack direction="row" spacing={1} sx={{ p: 1.5, flexShrink: 0 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask the coach..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              multiline
              maxRows={3}
              inputRef={inputRef}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || loading}
              color="primary"
            >
              <SendIcon />
            </IconButton>
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

// ── Chat bubble with basic markdown rendering ─────────────────────────────

function ChatBubble({ message }: { message: CoachMessage }) {
  const isUser = message.role === 'user';
  const displayContent = message.content
    .replace(/\nCARDS:.*$/m, '')
    .replace(/\n\n\[ACTIVE_DECK_PROFILE:[\s\S]*$/m, '')
    .trim();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1.5,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1.5,
          maxWidth: '85%',
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
  );
}

/** Render markdown text as React elements with CardTooltip on bold card names */
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) result.push(<br key={`br-${lineIdx}`} />);

    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    parts.forEach((part, partIdx) => {
      const key = `${lineIdx}-${partIdx}`;

      if (part.startsWith('**') && part.endsWith('**')) {
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
