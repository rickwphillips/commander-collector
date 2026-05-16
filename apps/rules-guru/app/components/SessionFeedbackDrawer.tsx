'use client';

import { useState } from 'react';
import {
  Drawer, Box, Stack, Typography, IconButton, Button,
  TextField, Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { rulesApi } from '../lib/api';
import type { RulesMessage } from '../lib/types';

interface Props {
  open: boolean;
  onClose: () => void;
  conversationId: number;
  messages: RulesMessage[];
}

interface Point {
  key: string;      // "msgIdx:pointIdx"
  msgIdx: number;
  label: string;
}

function extractPoints(content: string, msgIdx: number): Point[] {
  const clean = content
    .replace(/```[\s\S]*?```/g, '[code block]')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();

  const makePoint = (text: string, pi: number): Point => ({
    key: `${msgIdx}:${pi}`,
    msgIdx,
    label: text.trim(),
  });

  // Numbered list: "1. text"
  const numbered = clean.match(/^\d+\.\s+[\s\S]+?(?=\n\d+\.|\n\n|$)/gm);
  if (numbered && numbered.length > 1) {
    return numbered
      .map((p, i) => makePoint(p.replace(/^\d+\.\s+/, ''), i))
      .filter((p) => p.label.length > 15);
  }

  // Bullet list: "- text" or "* text"
  const bullets = clean.match(/^[-*•]\s+[\s\S]+?(?=\n[-*•]|\n\n|$)/gm);
  if (bullets && bullets.length > 1) {
    return bullets
      .map((p, i) => makePoint(p.replace(/^[-*•]\s+/, ''), i))
      .filter((p) => p.label.length > 15);
  }

  // Paragraphs
  const paras = clean.split(/\n\n+/).map((p) => p.trim()).filter((p) => p.length > 30);
  if (paras.length > 1) {
    return paras.map((p, i) => makePoint(p, i));
  }

  // Whole message as single point
  return [makePoint(clean, 0)];
}

const EMPTY_STATE = { rating: 0, selected: new Set<string>(), notes: '' };

// Cycle: undefined → 'helpful' (green) → 'incorrect' (red) → undefined
type PointState = 'helpful' | 'incorrect';

export function SessionFeedbackDrawer({ open, onClose, conversationId, messages }: Props) {
  const [rating, setRating] = useState(0);
  const [pointRatings, setPointRatings] = useState<Map<string, PointState>>(new Map());
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const assistantMessages = messages.filter((m) => m.role === 'assistant');

  const allPoints: Point[] = assistantMessages.flatMap((m, i) =>
    extractPoints(m.content, i)
  );

  const cyclePoint = (key: string) =>
    setPointRatings((prev) => {
      const next = new Map(prev);
      const cur = next.get(key);
      if (!cur)           next.set(key, 'helpful');
      else if (cur === 'helpful')  next.set(key, 'incorrect');
      else                next.delete(key);
      return next;
    });

  const handleClear = () => {
    setRating(0);
    setPointRatings(new Map());
    setNotes('');
    setDone(false);
  };

  // Close without resetting — state persists until Clear or successful submit
  const handleClose = () => onClose();

  const handleDoneClose = () => {
    handleClear();
    onClose();
  };

  const handleSubmit = async () => {
    if (!rating || submitting) return;
    setSubmitting(true);
    try {
      const msgIdxFor = (state: PointState) =>
        Array.from(
          new Set(
            [...pointRatings.entries()]
              .filter(([, v]) => v === state)
              .map(([k]) => parseInt(k.split(':')[0], 10))
          )
        );

      await rulesApi.submitSessionFeedback({
        conversation_id: conversationId,
        rating,
        helpful_indices: msgIdxFor('helpful').length ? msgIdxFor('helpful') : undefined,
        notes: notes || undefined,
      });
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  const hasInput = rating > 0 || pointRatings.size > 0 || notes.trim().length > 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      keepMounted
      slotProps={{ paper: { sx: { width: { xs: '95vw', sm: 480 }, p: 3, display: 'flex', flexDirection: 'column' } } }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" sx={{ mb: 2, flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
          Rate this session
        </Typography>
        {hasInput && !done && (
          <Button
            size="small"
            startIcon={<ClearIcon sx={{ fontSize: 14 }} />}
            onClick={handleClear}
            sx={{ mr: 0.5, fontSize: 12, opacity: 0.7 }}
          >
            Clear
          </Button>
        )}
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      {done ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">Thanks for the feedback!</Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
            It helps improve the Rules Guru over time.
          </Typography>
          <Button sx={{ mt: 3 }} onClick={handleDoneClose}>Close</Button>
        </Box>
      ) : (
        <Stack spacing={3} sx={{ flex: 1, overflowY: 'auto', pb: 1 }}>
          {/* Star rating */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Overall rating</Typography>
            <Stack direction="row" spacing={0.5}>
              {[1, 2, 3, 4, 5].map((n) => (
                <IconButton
                  key={n}
                  size="small"
                  onClick={() => setRating(n)}
                  sx={{ color: n <= rating ? 'warning.main' : 'text.disabled' }}
                >
                  {n <= rating ? <StarIcon /> : <StarOutlineIcon />}
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* Point selection */}
          {allPoints.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Which points were most helpful? (optional)
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.55, display: 'block', mb: 0.25 }}>
                Click once = helpful, twice = incorrect, third click = clear
              </Typography>
              <Stack spacing={0.75}>
                {allPoints.map((pt) => {
                  const state = pointRatings.get(pt.key);
                  const isHelpful   = state === 'helpful';
                  const isIncorrect = state === 'incorrect';
                  return (
                    <Paper
                      key={pt.key}
                      variant="outlined"
                      onClick={() => cyclePoint(pt.key)}
                      sx={{
                        p: 1.25,
                        cursor: 'pointer',
                        borderColor: isHelpful ? 'success.main' : isIncorrect ? 'error.main' : 'divider',
                        bgcolor: isHelpful ? 'success.main' : isIncorrect ? 'error.main' : 'transparent',
                        color: (isHelpful || isIncorrect) ? '#fff' : 'text.primary',
                        transition: 'all 0.15s',
                        '&:hover': {
                          borderColor: isHelpful ? 'success.dark' : isIncorrect ? 'error.dark' : 'primary.main',
                          bgcolor: isHelpful ? 'success.dark' : isIncorrect ? 'error.dark' : 'action.hover',
                        },
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.5, fontWeight: state ? 500 : 400 }}>
                        {assistantMessages.length > 1 && (
                          <Box component="span" sx={{ opacity: 0.6, mr: 0.5, fontSize: '0.7rem' }}>
                            #{pt.msgIdx + 1}
                          </Box>
                        )}
                        {pt.label}
                      </Typography>
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* Notes */}
          <TextField
            size="small"
            multiline
            minRows={3}
            label="Notes (optional)"
            placeholder="Anything else you'd like to share..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Actions */}
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={handleClose}>Close</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={!rating || submitting}>
              Submit
            </Button>
          </Stack>
        </Stack>
      )}
    </Drawer>
  );
}
