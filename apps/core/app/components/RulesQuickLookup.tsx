'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  CircularProgress,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '../lib/api';
import { CardTooltip } from '@commander/shared/components/CardTooltip';

/**
 * Single-query lookup panel. Detects the query kind by regex:
 *   - `117.3c`, `CR 117.3c`, `903`         → comprehensive rule (cr-rule.php)
 *   - `P523`, `#P523`, `p1`                → verified pattern (pattern.php)
 *   - anything else                        → card name (CardTooltip preview)
 *
 * No AI: just direct MCP fetches. Useful mid-game when you want a quick
 * answer without opening the full Rules Guru chat.
 */

type LookupKind = 'cr' | 'pattern' | 'card' | null;

interface CRResult { rule_number: string; body: string; examples?: string[] | null; }
interface PatternResult { pattern_id: string; name: string; abstract?: string | null; tags?: string[] | null; cr_refs?: string[] | null; }

function classify(q: string): LookupKind {
  const t = q.trim();
  if (!t) return null;
  if (/^(CR\s+|rule\s+|§\s*)?\d{1,3}(\.\d+[a-z]?)?$/i.test(t)) return 'cr';
  if (/^#?P\d{1,4}$/i.test(t)) return 'pattern';
  return 'card';
}

export function RulesQuickLookup() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [crResult, setCrResult] = useState<CRResult | null>(null);
  const [patternResult, setPatternResult] = useState<PatternResult | null>(null);
  const [cardName, setCardName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const doLookup = async (q: string) => {
    const kind = classify(q);
    setCrResult(null);
    setPatternResult(null);
    setCardName(null);
    setError(null);
    if (!kind) return;

    setLoading(true);
    try {
      if (kind === 'cr') {
        const normalized = q.trim().replace(/^(CR\s+|rule\s+|§\s*)/i, '').toLowerCase();
        const r = await api.lookupCRRule(normalized);
        if (r.band === 'certain' && r.data) {
          setCrResult({ rule_number: r.data.rule_number, body: r.data.body, examples: r.data.examples });
        } else {
          setError(r.caveats?.[0] ?? `No rule found for ${q}`);
        }
      } else if (kind === 'pattern') {
        const id = q.trim().replace(/^#/, '');
        const r = await api.getPattern(id);
        if (r.band === 'certain' && r.data) {
          setPatternResult(r.data);
        } else {
          setError(r.caveats?.[0] ?? `No pattern found for ${q}`);
        }
      } else {
        setCardName(q.trim());
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Quick lookup (CR rule, pattern, or card)">
        <IconButton onClick={() => setOpen(true)} size="small" sx={{ color: 'text.secondary' }}>
          <MenuBookIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: { xs: '85vw', sm: 380 }, p: 2 } } }}
      >
        <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            Quick Lookup
          </Typography>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <TextField
          autoFocus
          fullWidth
          size="small"
          placeholder="CR 117.3c, P523, or card name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') doLookup(query); }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => doLookup(query)}>
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ mt: 2, minHeight: 60 }}>
          {loading && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ opacity: 0.7 }}>
              <CircularProgress size={16} thickness={5} />
              <Typography variant="caption">Looking up…</Typography>
            </Stack>
          )}
          {!loading && error && (
            <Typography variant="body2" sx={{ color: 'error.main' }}>{error}</Typography>
          )}
          {!loading && crResult && (
            <Box>
              <Typography variant="overline" sx={{ fontFamily: 'monospace', color: 'primary.light' }}>
                CR {crResult.rule_number}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, mt: 0.5 }}>
                {crResult.body}
              </Typography>
              {Array.isArray(crResult.examples) && crResult.examples.length > 0 && (
                <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                  <Typography variant="caption" sx={{ opacity: 0.85 }}>
                    Example: {crResult.examples[0]}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          {!loading && patternResult && (
            <Box>
              <Typography variant="overline" sx={{ fontFamily: 'monospace', color: 'primary.light' }}>
                {patternResult.pattern_id.toUpperCase()}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {patternResult.name}
              </Typography>
              {patternResult.abstract && (
                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                  {patternResult.abstract}
                </Typography>
              )}
              {Array.isArray(patternResult.tags) && patternResult.tags.length > 0 && (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                  {patternResult.tags.slice(0, 6).map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              )}
              {Array.isArray(patternResult.cr_refs) && patternResult.cr_refs.length > 0 && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.85 }}>
                  Cites: {patternResult.cr_refs.join(', ')}
                </Typography>
              )}
            </Box>
          )}
          {!loading && cardName && (
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', mb: 0.5 }}>
                Hover for card preview:
              </Typography>
              <CardTooltip name={cardName} placement="left" style={{ borderBottom: '1px dotted currentColor' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, cursor: 'help' }}>
                  {cardName}
                </Typography>
              </CardTooltip>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
