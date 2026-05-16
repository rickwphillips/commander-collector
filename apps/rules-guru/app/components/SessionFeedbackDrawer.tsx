'use client';

import { useState } from 'react';
import {
  Drawer, Box, Stack, Typography, IconButton, Button,
  TextField, ToggleButton, ToggleButtonGroup, Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

export function SessionFeedbackDrawer({ open, onClose, conversationId, messages }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [helpfulIds, setHelpfulIds] = useState<Set<number>>(new Set());
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const assistantMessages = messages.filter((m) => m.role === 'assistant');

  const toggleHelpful = (id: number) => {
    setHelpfulIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!rating || submitting) return;
    setSubmitting(true);
    try {
      const helpfulIndices = assistantMessages
        .map((m, i) => (helpfulIds.has(m.id) ? i : -1))
        .filter((i) => i >= 0);

      await rulesApi.submitSessionFeedback({
        conversation_id: conversationId,
        rating,
        helpful_indices: helpfulIndices.length ? helpfulIndices : undefined,
        notes: notes || undefined,
      });
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHelpfulIds(new Set());
    setNotes('');
    setDone(false);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      slotProps={{ paper: { sx: { width: { xs: '90vw', sm: 400 }, p: 3 } } }}
    >
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
          Rate this session
        </Typography>
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
          <Button sx={{ mt: 3 }} onClick={handleClose}>Close</Button>
        </Box>
      ) : (
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Overall rating
            </Typography>
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

          {assistantMessages.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Which answers were most helpful? (optional)
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
                {assistantMessages.map((m, i) => {
                  const snippet = m.content.slice(0, 60).replace(/\n/g, ' ');
                  const selected = helpfulIds.has(m.id);
                  return (
                    <Chip
                      key={m.id}
                      label={`#${i + 1}: ${snippet}${m.content.length > 60 ? '…' : ''}`}
                      size="small"
                      variant={selected ? 'filled' : 'outlined'}
                      color={selected ? 'primary' : 'default'}
                      onClick={() => toggleHelpful(m.id)}
                      sx={{ maxWidth: 340, cursor: 'pointer' }}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}

          <TextField
            size="small"
            multiline
            minRows={3}
            label="Notes (optional)"
            placeholder="Anything else you'd like to share..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={handleClose}>Skip</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!rating || submitting}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      )}
    </Drawer>
  );
}
