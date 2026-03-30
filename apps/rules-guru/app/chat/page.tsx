'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckIcon from '@mui/icons-material/Check';
import { rulesApi } from '../lib/api';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
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

// ── Helpers ─────────────────────────────────────────────────────────────────

function nodeText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (node && typeof node === 'object' && 'props' in node)
    return nodeText((node as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  return '';
}

// ── Parse CARDS: manifest from assistant response ────────────────────────────
function parseCardManifest(content: string): { cleaned: string; cards: string[] } {
  const match = content.match(/\nCARDS:\s*(.+)$/m);
  if (!match) return { cleaned: content, cards: [] };
  const cards = match[1]
    .split(',')
    .map(s => s.trim().replace(/^\[\[|\]\]$/g, '').trim())
    .filter(Boolean);
  const cleaned = content.replace(/\nCARDS:\s*.+$/m, '').trimEnd();
  return { cleaned, cards };
}

// ── Markdown components ──────────────────────────────────────────────────────

function looksLikeCardName(text: string): boolean {
  if (!text || text.length < 2) return false;
  if (text.includes(':')) return false;           // CR refs, labels
  if (/^\d/.test(text)) return false;             // "7c", "117.3"
  if (text === text.toUpperCase()) return false;  // "APNAP", "SBA"
  if (text.split(' ').length > 7) return false;   // no real card has 8+ words
  if (/^(Note|Example|Important|Warning|Summary|Result|Step|Phase|Rule|Effect|Trigger|Action|Cost|Event|Zone|Stack|Turn|Ability|Creature|Spell|Permanent|Player|Target|Source|Object|Card)s?$/.test(text)) return false;
  return true;
}

const mdComponents = {
  strong: ({ children }: { children?: React.ReactNode }) => {
    const text = nodeText(children).trim();
    if (!text || !looksLikeCardName(text)) return <strong>{children}</strong>;
    return (
      <CardTooltip name={text} style={{ borderBottom: '1px dotted currentColor' }}>
        <strong>{children}</strong>
      </CardTooltip>
    );
  },
};

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
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [savedNoteIndices, setSavedNoteIndices] = useState<Set<number>>(new Set());

  const [thinkingText, setThinkingText] = useState('Consulting the rules…');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const retryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const THINKING_MESSAGES = [
    'Consulting the rules...',
    'Checking the Comprehensive Rules...',
    'Resolving triggered abilities...',
    'Checking state-based actions...',
    'Passing priority...',
    'Searching the pattern library...',
    'Cross-referencing CR 117...',
    'Untapping, upkeep, draw...',
    'Looking up Oracle text...',
    'Verifying with Gatherer rulings...',
    'Checking the stack...',
    'Declaring attackers...',
  ];

  useEffect(() => {
    if (!loading) {
      setThinkingText('');
      return;
    }

    let cancelled = false;
    let msgIdx = 0;
    let charIdx = 0;
    type Phase = 'typing' | 'hold' | 'erasing' | 'gap';
    let phase: Phase = 'typing';
    let tid: ReturnType<typeof setTimeout>;

    setThinkingText('');

    function tick() {
      if (cancelled) return;
      const msg = THINKING_MESSAGES[msgIdx];
      if (phase === 'typing') {
        charIdx++;
        setThinkingText(msg.slice(0, charIdx));
        if (charIdx >= msg.length) { phase = 'hold'; tid = setTimeout(tick, 1000); return; }
        tid = setTimeout(tick, 95);
      } else if (phase === 'hold') {
        phase = 'erasing';
        tid = setTimeout(tick, 55);
      } else if (phase === 'erasing') {
        charIdx--;
        setThinkingText(msg.slice(0, charIdx));
        if (charIdx <= 0) { phase = 'gap'; tid = setTimeout(tick, 500); }
        else { tid = setTimeout(tick, 55); }
      } else {
        let next = Math.floor(Math.random() * THINKING_MESSAGES.length);
        if (next === msgIdx) next = (next + 1) % THINKING_MESSAGES.length;
        msgIdx = next;
        charIdx = 0;
        phase = 'typing';
        tid = setTimeout(tick, 30);
      }
    }

    tid = setTimeout(tick, 30);
    return () => { cancelled = true; clearTimeout(tid); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Scroll to bottom only when the user sends a message (not on incoming assistant responses)
  const prevMessageCountRef = useRef(0);
  useEffect(() => {
    const prev = prevMessageCountRef.current;
    const curr = messages.length;
    prevMessageCountRef.current = curr;
    // Only scroll when a user message was just added (odd → even, or count increased by user action)
    if (curr > prev && messages[curr - 1]?.role === 'user') {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Clean up retry countdown interval on unmount
  useEffect(() => {
    return () => {
      if (retryIntervalRef.current) clearInterval(retryIntervalRef.current);
    };
  }, []);

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

    // Check for inline game context passed via ?ctx= (from game manager chat button)
    const params = new URLSearchParams(window.location.search);
    const ctxParam = params.get('ctx');
    if (ctxParam) {
      setIsEmbedded(true);
      try {
        const raw = JSON.parse(atob(decodeURIComponent(ctxParam)));
        // Map to ActiveGameContext shape (players only — life/poison are extra but harmless)
        const ctx: ActiveGameContext = {
          players: (raw.players ?? []).map((p: Record<string, unknown>) => ({
            playerName: p.playerName ?? 'Unknown',
            deckName: p.deckName ?? '',
            commander: p.commander ?? null,
            partner: p.partner ?? null,
            deckId: p.deckId ?? null,
            cards: [],
          })),
        };
        setGameContext(ctx);
        // Also store turn/life state for display in system message
        if (raw.turnNumber || raw.currentPlayer) {
          const playerLines = (raw.players ?? [])
            .map((p: Record<string, unknown>) => {
              const name = p.playerName ?? '?';
              const life = p.life ?? '?';
              const parts: string[] = [`${life} life`];
              if ((p.poison as number) > 0) parts.push(`${p.poison} poison`);
              if ((p.energy as number) > 0) parts.push(`${p.energy} energy`);
              if ((p.experience as number) > 0) parts.push(`${p.experience} experience`);
              if ((p.commanderTax as number) > 0) parts.push(`commander tax +${(p.commanderTax as number) * 2}`);
              const badges: string[] = [];
              if (p.isMonarch) badges.push('Monarch');
              if (p.hasInitiative) badges.push('Initiative');
              if (p.hasCitysBlessing) badges.push("City's Blessing");
              if (badges.length) parts.push(badges.join(', '));
              if (p.isEliminated) parts.push('eliminated');
              let line = `  • ${name}: ${parts.join(', ')}`;
              // Commander damage received
              const dmg = p.commanderDamage as Record<string, number[]> | undefined;
              if (dmg && Object.keys(dmg).length > 0) {
                const dmgParts = Object.entries(dmg).map(([src, vals]) =>
                  vals.length > 1 ? `${vals[0]}+${vals[1]} from ${src}` : `${vals[0]} from ${src}`
                );
                line += ` (cmd dmg: ${dmgParts.join(', ')})`;
              }
              return line;
            })
            .join('\n');
          const systemMsg = [
            `**Active game — Turn ${raw.turnNumber ?? '?'}, ${raw.currentPlayer ?? '?'}\'s turn**`,
            playerLines,
          ].join('\n');
          // Build hidden timer note for AI context (not shown to user)
          if (raw.timerSeconds && raw.currentPlayer) {
            const elapsed = (raw.elapsedSeconds as number) ?? 0;
            const total = raw.timerSeconds as number;
            const remaining = Math.max(0, total - elapsed);
            const pct = elapsed / total;
            const name = raw.currentPlayer as string;
            const quips =
              pct >= 0.75
                ? [
                    `${name} has used ${Math.round(pct * 100)}% of the turn timer and still hasn't acted. Feel free to weave in a gentle ribbing if it's relevant.`,
                    `${name} is deep in the tank with only ~${Math.round(remaining)}s left on the timer. You can playfully acknowledge the delay if appropriate.`,
                  ]
                : pct >= 0.4
                ? [
                    `${name} is about halfway through the turn timer (${Math.round(elapsed)}s elapsed). You can lightly tease them about thinking time if it fits.`,
                  ]
                : [
                    `${name}'s turn just started — timer is running but no pressure yet.`,
                  ];
            ctx._timerNote = quips[Math.floor(Math.random() * quips.length)];
            setGameContext(ctx);
          }
          setMessages([{ role: 'assistant', content: systemMsg }]);
        }
      } catch {
        // Malformed ctx param — fall back to DB lookup
        rulesApi.getActiveGame().then(r => setGameContext(r.game)).catch(() => {});
      }
    } else {
      rulesApi.getActiveGame().then(r => setGameContext(r.game)).catch(() => {});
    }
  }, []);

  // postMessage bridge for saving notes back to game manager (embedded mode only)
  const saveToGameNotes = useCallback((content: string) => {
    if (typeof window !== 'undefined') {
      window.parent.postMessage({ type: 'rules_save_notes', content }, '*');
    }
  }, []);

  // Real-time timer state pushed from parent every second
  const liveTimerRef = useRef<ActiveGameContext['_liveTimer']>(undefined);
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'rules_timer_update') {
        liveTimerRef.current = {
          timerSeconds:   event.data.timerSeconds,
          elapsedSeconds: event.data.elapsedSeconds,
          remaining:      event.data.remaining,
          currentPlayer:  event.data.currentPlayer,
          turnNumber:     event.data.turnNumber,
        };
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
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
    if (isEmbedded) window.parent.postMessage({ type: 'rules_loading', value: true }, '*');

    const isRateLimitError = (err: unknown): boolean => {
      const msg = err instanceof Error ? err.message : String(err);
      return /rate|overload|529|429/i.test(msg);
    };

    const waitWithCountdown = (seconds: number): Promise<void> => {
      return new Promise(resolve => {
        let remaining = seconds;
        setThinkingText(`The rules oracle is a bit overwhelmed — trying again in a moment.`);
        if (retryIntervalRef.current) clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = setInterval(() => {
          remaining -= 1;
          if (remaining <= 0) {
            if (retryIntervalRef.current) clearInterval(retryIntervalRef.current);
            retryIntervalRef.current = null;
            resolve();
          } else {
            setThinkingText(`Retrying in ${remaining}s…`);
          }
        }, 1000);
        // Initial countdown display
        setThinkingText(`Retrying in ${remaining}s…`);
      });
    };

    const RETRY_DELAYS = [5, 15, 30, 60];
    let res: Awaited<ReturnType<typeof rulesApi.sendMessage>> | null = null;
    let lastErr: unknown = null;

    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      try {
        const contextWithTimer = gameContext
          ? { ...gameContext, _liveTimer: liveTimerRef.current ?? gameContext._liveTimer }
          : undefined;
        res = await rulesApi.sendMessage({
          message: resolved,
          conversation_id: conversationId ?? undefined,
          new_conversation_title: !conversationId ? raw.slice(0, 80) : undefined,
          game_context: contextWithTimer,
        });
        lastErr = null;
        break; // success
      } catch (err) {
        lastErr = err;
        if (isRateLimitError(err) && attempt < RETRY_DELAYS.length) {
          await waitWithCountdown(RETRY_DELAYS[attempt]);
          // Continue to next attempt
        } else {
          break; // non-rate-limit error or retries exhausted
        }
      }
    }

    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }

    if (res) {
      setConversationId(res.conversation_id);

      const assistantMsg: LocalMessage = {
        id: res.message_id,
        role: 'assistant',
        content: res.response,
        pending_pattern: res.pending_pattern,
      };
      setMessages(prev => [...prev, assistantMsg]);

      rulesApi.getConversations().then(r => setConversations(r.conversations)).catch(() => {});

      if (isEmbedded && typeof window !== 'undefined') {
        window.parent.postMessage({ type: 'rules_new_content' }, '*');
      }
    } else {
      const errMsg = isRateLimitError(lastErr)
        ? 'The rules oracle is a bit overwhelmed — trying again in a moment.'
        : (lastErr instanceof Error ? lastErr.message : 'Failed to send message');
      setError(errMsg);
      setMessages(prev => prev.slice(0, -1));
    }

    setLoading(false);
    if (isEmbedded) window.parent.postMessage({ type: 'rules_loading', value: false }, '*');
    setTimeout(() => inputRef.current?.focus(), 100);
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
                      {p.tags.replace(/[\[\]]/g, '').split(',').map((t, i) => (
                        <Chip key={`${t.trim()}-${i}`} label={t.trim()} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
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
          {!isEmbedded && (
            <Tooltip title="Commander Collector">
              <IconButton component="a" href={process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '/app/projects/commander'} size="small">
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}
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
              {gameContext.players.map(p => {
                const cmd = p.partner
                  ? `${p.commander} + ${p.partner}`
                  : (p.commander ?? p.deckName);
                const question = p.partner
                  ? `What are the key rules interactions between ${p.commander} and ${p.partner} as partner commanders?`
                  : `What are the tricky rules interactions for ${cmd} in our current game?`;
                return (
                  <Tooltip key={p.playerName} title={`Ask about ${cmd}`}>
                    <Chip
                      label={`${p.playerName}: ${cmd}`}
                      size="small"
                      clickable
                      onClick={() => { setInput(question); setTimeout(() => inputRef.current?.focus(), 100); }}
                      sx={{ fontSize: '0.65rem', height: 18, bgcolor: 'rgba(255,255,255,0.2)', color: 'success.contrastText', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' } }}
                    />
                  </Tooltip>
                );
              })}
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
                {msg.role === 'assistant' ? (() => {
                  const { cleaned, cards } = parseCardManifest(msg.content);
                  return (
                    <>
                      <Box sx={{
                        '& p': { m: 0, mb: 1, lineHeight: 1.6, fontSize: '0.875rem' },
                        '& p:last-child': { mb: 0 },
                        '& ul, & ol': { mt: 0.5, mb: 1, pl: 2.5 },
                        '& li': { fontSize: '0.875rem', lineHeight: 1.6 },
                        '& strong': { fontWeight: 600 },
                        '& code': { fontFamily: 'monospace', fontSize: '0.8rem', bgcolor: 'action.hover', px: 0.5, borderRadius: 0.5 },
                        '& table': { borderCollapse: 'collapse', width: '100%', fontSize: '0.8rem', mb: 1 },
                        '& th, & td': { border: '1px solid', borderColor: 'divider', px: 1, py: 0.5, textAlign: 'left' },
                        '& th': { bgcolor: 'action.hover', fontWeight: 600 },
                        '& tr:nth-of-type(even)': { bgcolor: 'action.hover' },
                      }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{cleaned}</ReactMarkdown>
                      </Box>
                      {/* Card chip bar */}
                      {cards.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                          {cards.map(name => (
                            <CardTooltip key={name} name={name}>
                              <Chip
                                label={name}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20, cursor: 'default', '& .MuiChip-label': { px: 0.75 } }}
                              />
                            </CardTooltip>
                          ))}
                        </Box>
                      )}
                      {/* Save to game notes (embedded only) */}
                      {isEmbedded && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                          <Tooltip title={savedNoteIndices.has(i) ? 'Saved to game notes' : 'Save to game notes'}>
                            <span>
                              <IconButton
                                size="small"
                                disabled={savedNoteIndices.has(i)}
                                onClick={() => {
                                  saveToGameNotes(cleaned);
                                  setSavedNoteIndices(prev => new Set(prev).add(i));
                                }}
                                sx={{
                                  opacity: savedNoteIndices.has(i) ? 1 : 0.5,
                                  color: savedNoteIndices.has(i) ? 'success.main' : 'inherit',
                                  '&:hover': { opacity: 1 },
                                }}
                              >
                                {savedNoteIndices.has(i) ? <CheckIcon sx={{ fontSize: 16 }} /> : <NoteAddIcon sx={{ fontSize: 16 }} />}
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      )}
                    </>
                  );
                })() : renderUserContent(msg.content)}

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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minWidth: 220, fontFamily: 'monospace', fontSize: '0.8rem' }}
                  >
                    {thinkingText}
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        width: '1ch',
                        height: '0.9em',
                        bgcolor: 'text.secondary',
                        verticalAlign: 'text-bottom',
                        ml: '1px',
                        animation: 'blink-cursor 1s step-end infinite',
                        '@keyframes blink-cursor': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0 },
                        },
                      }}
                    />
                  </Typography>
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
                  {patternDialog.tags.replace(/[\[\]]/g, '').split(',').map((t, i) => (
                    <Chip key={`${t.trim()}-${i}`} label={t.trim()} size="small" variant="outlined" />
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
