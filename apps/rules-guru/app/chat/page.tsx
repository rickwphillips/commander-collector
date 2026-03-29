'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse, // used for pattern expand
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { rulesApi } from '../lib/api';
import type { ActiveGameContext, RulesConversation, RulesMessage, RulesPattern } from '../lib/types';

// ── Local message type (includes pending_pattern for new messages) ──────────
interface LocalMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  pending_pattern?: RulesPattern | null;
}

const DRAWER_WIDTH = 300;

// ── Resolve #P### references in a string to pattern names ──────────────────
function resolvePatternRefs(text: string, patterns: RulesPattern[]): string {
  return text.replace(/#(p\d+)/gi, (match, id) => {
    const p = patterns.find(x => x.pattern_id.toLowerCase() === id.toLowerCase());
    return p ? `#${p.pattern_id.toUpperCase()} (${p.name})` : match;
  });
}

// ── Generate deck-aware suggestions from active game context ─────────────────
function buildGameSuggestions(ctx: ActiveGameContext): string[] {
  const result: string[] = [];
  const commanders = ctx.players.map(p => p.commander).filter((c): c is string => !!c);

  for (const cmd of commanders.slice(0, 2)) {
    result.push(`What are the tricky rules interactions for ${cmd}?`);
  }

  if (commanders.length >= 2) {
    result.push(`How does ${commanders[0]} interact with ${commanders[1]}?`);
  }

  const withPartner = ctx.players.find(p => p.partner);
  if (withPartner?.commander && withPartner.partner) {
    result.push(`How do ${withPartner.commander} and ${withPartner.partner} work as partners?`);
  }

  result.push('What rules questions commonly come up in Commander?');
  return result.slice(0, 4);
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [conversationId, setConversationId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<RulesConversation[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [patternsOpen, setPatternsOpen] = useState(false);
  const [patterns, setPatterns] = useState<RulesPattern[]>([]);
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);

  const [patternDialog, setPatternDialog] = useState<RulesPattern | null>(null);
  const [savingPattern, setSavingPattern] = useState(false);
  const [patternsLoading, setPatternsLoading] = useState(true);

  const [gameContext, setGameContext] = useState<ActiveGameContext | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Load conversations, patterns, and active game on mount
  useEffect(() => {
    rulesApi.getConversations().then(r => setConversations(r.conversations)).catch(() => {});
    rulesApi.getPatterns()
      .then(r => {
        const sorted = [...r.patterns].sort((a, b) => {
          const numA = parseInt(a.pattern_id.replace(/\D/g, ''), 10);
          const numB = parseInt(b.pattern_id.replace(/\D/g, ''), 10);
          return numA - numB;
        });
        setPatterns(sorted);
      })
      .catch(() => {})
      .finally(() => setPatternsLoading(false));
    rulesApi.getActiveGame()
      .then(r => setGameContext(r.game))
      .catch(() => {});
  }, []);

  const loadConversation = async (id: number) => {
    try {
      const { messages: msgs } = await rulesApi.getConversation(id);
      setConversationId(id);
      setMessages(msgs.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        pending_pattern: m.pending_pattern,
      })));
      setHistoryOpen(false);
      setError(null);
    } catch {
      setError('Failed to load conversation');
    }
  };

  const startNewConversation = () => {
    setConversationId(null);
    setMessages([]);
    setError(null);
    setHistoryOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const deleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await rulesApi.deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (conversationId === id) startNewConversation();
    } catch {
      setError('Failed to delete conversation');
    }
  };

  // Insert a #P### reference into the input at the end
  const citePattern = (p: RulesPattern) => {
    const ref = `#${p.pattern_id.toUpperCase()} `;
    setInput(prev => (prev.endsWith(' ') || prev === '' ? prev + ref : prev + ' ' + ref));
    setPatternsOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = async () => {
    const raw = input.trim();
    if (!raw || loading) return;

    // Resolve #P### refs so Claude sees the pattern name inline
    const resolved = resolvePatternRefs(raw, patterns);

    setInput('');
    setError(null);

    // Show the original (unresolved) text to the user
    const userMsg: LocalMessage = { role: 'user', content: raw };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await rulesApi.sendMessage({
        message: resolved,
        conversation_id: conversationId ?? undefined,
        new_conversation_title: !conversationId ? raw.slice(0, 80) : undefined,
        game_context: gameContext ?? undefined,
      });

      setConversationId(res.conversation_id);

      const assistantMsg: LocalMessage = {
        id: res.message_id,
        role: 'assistant',
        content: res.response,
        pending_pattern: res.pending_pattern,
      };
      setMessages(prev => [...prev, assistantMsg]);

      rulesApi.getConversations().then(r => setConversations(r.conversations)).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const savePattern = async (pattern: RulesPattern) => {
    setSavingPattern(true);
    try {
      const saved = await rulesApi.savePattern({
        pattern_id: pattern.pattern_id,
        name: pattern.name,
        category: pattern.category,
        cr_refs: pattern.cr_refs ?? null,
        tags: pattern.tags ?? null,
        content: pattern.content,
        examples_count: pattern.examples_count ?? 1,
      });
      setPatterns(prev => {
        const idx = prev.findIndex(p => p.pattern_id === pattern.pattern_id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved.pattern;
          return next;
        }
        return [...prev, saved.pattern];
      });
      setPatternDialog(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save pattern');
    } finally {
      setSavingPattern(false);
    }
  };

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Render user message with #P### highlighted as chips
  const renderUserContent = (text: string) => {
    const parts = text.split(/(#P\d+(?:\s+\([^)]+\))?)/gi);
    if (parts.length === 1) {
      return <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{text}</Typography>;
    }
    return (
      <Box sx={{ lineHeight: 1.6, fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
        {parts.map((part, i) =>
          /^#P\d+/i.test(part)
            ? <Chip key={i} label={part} size="small" color="primary" variant="outlined" sx={{ mx: 0.25, height: 20, fontSize: '0.7rem', color: 'primary.contrastText', borderColor: 'primary.contrastText' }} />
            : <span key={i}>{part}</span>
        )}
      </Box>
    );
  };

  // Suggestions: game-aware if context available, otherwise pattern-based
  const suggestions: string[] = (() => {
    if (gameContext && gameContext.players.length > 0) {
      return buildGameSuggestions(gameContext);
    }
    if (patterns.length > 0) {
      return patterns.slice(0, 4).flatMap(p => {
        if (p.suggested_questions) {
          try {
            const qs: string[] = JSON.parse(p.suggested_questions);
            return qs.slice(0, 1);
          } catch { /* fall through */ }
        }
        const firstTag = p.tags
          ? p.tags.replace(/^\[|\]$/g, '').split(',')[0].trim().replace(/-/g, ' ')
          : null;
        if (!firstTag) return [`Explain ${p.name}`];
        const verb = firstTag.endsWith('s') ? 'do' : 'does';
        return [`How ${verb} ${firstTag} work?`];
      });
    }
    return [
      'Does deathtouch work with trample?',
      'Can I respond to a mana ability?',
      'How does the legend rule work?',
      'What is the layer system?',
    ];
  })();

  return (
    <Box sx={{ display: 'flex', height: '100dvh', overflow: 'hidden' }}>

      {/* ── History Drawer ──────────────────────────────────────── */}
      <Drawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">History</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={startNewConversation}>New</Button>
        </Box>
        <Divider />
        <List dense>
          {conversations.map(c => (
            <ListItem
              key={c.id}
              disablePadding
              secondaryAction={
                <IconButton size="small" onClick={e => deleteConversation(c.id, e)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemButton
                selected={c.id === conversationId}
                onClick={() => loadConversation(c.id)}
                sx={{ pr: 5 }}
              >
                <ListItemText
                  primary={c.title ?? 'Untitled'}
                  secondary={formatTimestamp(c.updated_at)}
                  primaryTypographyProps={{ noWrap: true, fontSize: '0.875rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {conversations.length === 0 && (
            <ListItem>
              <ListItemText secondary="No conversations yet" />
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* ── Patterns Drawer ─────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={patternsOpen}
        onClose={() => setPatternsOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH + 60 } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoStoriesIcon color="primary" />
          <Typography variant="h6">Pattern Library</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {patterns.length} patterns
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ overflow: 'auto', flex: 1 }}>
          {patternsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
              <CircularProgress size={32} />
            </Box>
          ) : patterns.map(p => (
            <Box key={p.pattern_id}>
              <ListItemButton
                onClick={() => setExpandedPattern(expandedPattern === p.pattern_id ? null : p.pattern_id)}
                sx={{ py: 1 }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Chip label={p.pattern_id.toUpperCase()} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                    <Chip label={p.category} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                  </Box>
                  <Typography variant="body2" fontWeight={500} noWrap>{p.name}</Typography>
                </Box>
                <Tooltip title={`Cite #${p.pattern_id.toUpperCase()} in your question`}>
                  <IconButton
                    size="small"
                    onClick={e => { e.stopPropagation(); citePattern(p); }}
                    sx={{ mr: 0.5, flexShrink: 0 }}
                  >
                    <AddCommentIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                {expandedPattern === p.pattern_id ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </ListItemButton>
              <Collapse in={expandedPattern === p.pattern_id}>
                <Box sx={{ px: 2, pb: 1.5, bgcolor: 'action.hover' }}>
                  {p.tags && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {p.tags.replace(/[\[\]]/g, '').split(',').map(t => (
                        <Chip key={t.trim()} label={t.trim()} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                      ))}
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', display: 'block', maxHeight: 200, overflow: 'auto' }}>
                    {p.content.split('\n').slice(0, 8).join('\n')}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddCommentIcon />}
                    onClick={() => citePattern(p)}
                    sx={{ mt: 1 }}
                  >
                    Cite in question
                  </Button>
                </Box>
              </Collapse>
              <Divider />
            </Box>
          ))}
        </Box>
      </Drawer>

      {/* ── Main layout ─────────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <Paper
          elevation={2}
          square
          sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1, zIndex: 10 }}
        >
          <Tooltip title="Commander Collector">
            <IconButton component="a" href={process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '/app/projects/commander'} size="small">
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="History">
            <IconButton onClick={() => setHistoryOpen(true)} size="small">
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <AutoStoriesIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
            MTG Rules Guru
          </Typography>
          <Tooltip title="Pattern Library">
            <IconButton onClick={() => setPatternsOpen(true)} size="small">
              <MenuBookIcon />
            </IconButton>
          </Tooltip>
        </Paper>

        {/* Active game banner */}
        {gameContext && (
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: theme => theme.palette.mode === 'dark' ? 'success.dark' : 'success.light',
              px: 2,
              py: 0.75,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SportsEsportsIcon sx={{ fontSize: 15, color: 'success.contrastText', opacity: 0.9, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ color: 'success.contrastText', fontWeight: 600, flexShrink: 0 }}>
              Live game
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {gameContext.players.map(p => (
                <Chip
                  key={p.playerName}
                  label={p.partner ? `${p.playerName}: ${p.commander} + ${p.partner}` : `${p.playerName}: ${p.commander ?? p.deckName}`}
                  size="small"
                  sx={{ fontSize: '0.65rem', height: 18, bgcolor: 'rgba(255,255,255,0.2)', color: 'success.contrastText' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Messages */}
        <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {messages.length === 0 && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, opacity: 0.6 }}>
              <AutoStoriesIcon sx={{ fontSize: 64 }} color="primary" />
              <Typography variant="h6" color="text.secondary">
                {gameContext ? `Asking about your game? I know the decks.` : 'Ask an MTG rules question'}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', maxWidth: 500 }}>
                {patternsLoading && !gameContext ? (
                  <CircularProgress size={20} />
                ) : suggestions.map(q => (
                  <Chip
                    key={q}
                    label={q}
                    variant="outlined"
                    clickable
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  maxWidth: '80%',
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                  color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                }}
              >
                {msg.role === 'assistant' ? (
                  <Box sx={{ '& p': { m: 0, mb: 1, lineHeight: 1.6, fontSize: '0.875rem' }, '& p:last-child': { mb: 0 }, '& ul, & ol': { mt: 0.5, mb: 1, pl: 2.5 }, '& li': { fontSize: '0.875rem', lineHeight: 1.6 }, '& strong': { fontWeight: 600 }, '& code': { fontFamily: 'monospace', fontSize: '0.8rem', bgcolor: 'action.hover', px: 0.5, borderRadius: 0.5 } }}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </Box>
                ) : renderUserContent(msg.content)}

                {/* Pending pattern proposal */}
                {msg.pending_pattern && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: 'action.selected',
                      border: '1px solid',
                      borderColor: 'warning.main',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <AutoStoriesIcon fontSize="small" color="warning" />
                      <Typography variant="caption" fontWeight={600} color="warning.main">
                        New Pattern Proposed
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      {msg.pending_pattern.pattern_id.toUpperCase()} — {msg.pending_pattern.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Category: {msg.pending_pattern.category}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<SaveIcon />}
                        onClick={() => setPatternDialog(msg.pending_pattern!)}
                      >
                        Review & Save
                      </Button>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Paper elevation={1} sx={{ p: 1.5, borderRadius: '16px 16px 16px 4px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">Consulting the rules…</Typography>
                </Box>
              </Paper>
            </Box>
          )}

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Paper
          elevation={3}
          square
          sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'flex-end' }}
        >
          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            maxRows={6}
            placeholder={gameContext ? 'Ask about your game…' : 'Ask a rules question…'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            size="small"
            variant="outlined"
            autoFocus
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            sx={{ mb: 0.25 }}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* ── Pattern Review Dialog ────────────────────────────────── */}
      <Dialog
        open={!!patternDialog}
        onClose={() => setPatternDialog(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoStoriesIcon color="primary" />
          Review New Pattern
          <IconButton sx={{ ml: 'auto' }} onClick={() => setPatternDialog(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {patternDialog && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={patternDialog.pattern_id.toUpperCase()} color="primary" />
                <Chip label={patternDialog.category} variant="outlined" />
                {patternDialog.cr_refs && <Chip label={`CR: ${patternDialog.cr_refs}`} variant="outlined" size="small" />}
              </Box>
              <Typography variant="h6">{patternDialog.name}</Typography>
              {patternDialog.tags && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {patternDialog.tags.replace(/[\[\]]/g, '').split(',').map(t => (
                    <Chip key={t.trim()} label={t.trim()} size="small" variant="outlined" />
                  ))}
                </Box>
              )}
              <Box
                sx={{
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  p: 2,
                  maxHeight: 400,
                  overflow: 'auto',
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {patternDialog.content}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPatternDialog(null)}>Discard</Button>
          <Button
            variant="contained"
            startIcon={savingPattern ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={() => patternDialog && savePattern(patternDialog)}
            disabled={savingPattern}
          >
            Save to Pattern Library
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
