'use client';

import { useState } from 'react';
import {
  Box, IconButton, Tooltip, Popover, Stack, Typography,
  FormControlLabel, Checkbox, TextField, Button, Divider, Switch, Chip,
} from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FlagIcon from '@mui/icons-material/Flag';
import { rulesApi } from '../lib/api';

interface Props {
  conversationId: number;
  messageId?: number;
  messageSnippet?: string;
  cards?: string[];
}

type Rating = 'up' | 'down' | null;

function BoolField({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <FormControlLabel
      control={<Checkbox size="small" checked={checked} onChange={(e) => onChange(e.target.checked)} />}
      label={<Typography variant="body2">{label}</Typography>}
      sx={{ alignItems: 'flex-start', '& .MuiCheckbox-root': { pt: 0.25 } }}
    />
  );
}

export function MessageFeedback({ conversationId, messageId, messageSnippet, cards = [] }: Props) {
  const [rating, setRating] = useState<Rating>(null);
  const [submitted, setSubmitted] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Down-vote specific questions
  const [wrongConclusion, setWrongConclusion] = useState(false);
  const [wrongCrCite, setWrongCrCite] = useState(false);
  const [missingCrRules, setMissingCrRules] = useState(false);
  const [offTopic, setOffTopic] = useState(false);
  const [hardToApply, setHardToApply] = useState(false);
  const [cardsNotRelevant, setCardsNotRelevant] = useState(false);
  const [notes, setNotes] = useState('');
  const [flagPattern, setFlagPattern] = useState(false);

  // Per-card relevance: true = relevant, false = not relevant, undefined = unrated
  const [cardRatings, setCardRatings] = useState<Record<string, boolean>>({});

  // Up-vote optional note
  const [upNotes, setUpNotes] = useState('');

  const toggleCardRating = (name: string, value: boolean) => {
    setCardRatings((prev) => {
      if (prev[name] === value) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: value };
    });
  };

  const handleThumbUp = (e: React.MouseEvent<HTMLElement>) => {
    if (submitted) return;
    setRating('up');
    setAnchor(e.currentTarget);
  };

  const handleThumbDown = (e: React.MouseEvent<HTMLElement>) => {
    if (submitted) return;
    setRating('down');
    setAnchor(e.currentTarget);
  };

  const handleClose = () => setAnchor(null);

  const submit = async () => {
    if (!rating || submitting) return;
    setSubmitting(true);
    const ratedCards = Object.keys(cardRatings);
    try {
      await rulesApi.submitMessageFeedback({
        conversation_id: conversationId,
        message_id: messageId,
        message_snippet: messageSnippet,
        rating,
        wrong_conclusion: wrongConclusion || undefined,
        wrong_cr_cite: wrongCrCite || undefined,
        missing_cr_rules: missingCrRules || undefined,
        off_topic: offTopic || undefined,
        hard_to_apply: hardToApply || undefined,
        cards_not_relevant: cardsNotRelevant || undefined,
        card_feedback: ratedCards.length ? cardRatings : undefined,
        notes: notes || upNotes || undefined,
        flag_pattern: flagPattern || undefined,
      });
      setSubmitted(true);
      setAnchor(null);
    } catch {
      setSubmitted(true);
      setAnchor(null);
    } finally {
      setSubmitting(false);
    }
  };

  const open = Boolean(anchor);

  if (submitted) {
    return (
      <Tooltip title="Thanks for the feedback">
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, opacity: 0.6 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
          {rating === 'up'
            ? <ThumbUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
            : <ThumbDownIcon sx={{ fontSize: 14, color: 'error.main' }} />}
        </Box>
      </Tooltip>
    );
  }

  const ratedCount = Object.keys(cardRatings).length;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
      <Tooltip title="Helpful">
        <IconButton size="small" onClick={handleThumbUp} sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}>
          <ThumbUpOutlinedIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Not helpful">
        <IconButton size="small" onClick={handleThumbDown} sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}>
          <ThumbDownOutlinedIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>

      {/* Card ratings pending indicator */}
      {ratedCount > 0 && !submitted && (
        <Tooltip title={`${ratedCount} card${ratedCount > 1 ? 's' : ''} rated — submit feedback to save`}>
          <Typography variant="caption" sx={{ opacity: 0.6, fontSize: 10, cursor: 'default' }}>
            {ratedCount}★
          </Typography>
        </Tooltip>
      )}

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { p: 2, width: 340 } } }}
      >
        {rating === 'down' ? (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              What was the problem?
            </Typography>

            <Stack spacing={0.25}>
              <BoolField label="The ruling conclusion was wrong" checked={wrongConclusion} onChange={setWrongConclusion} />
              <BoolField label="CR rule numbers cited were inaccurate" checked={wrongCrCite} onChange={setWrongCrCite} />
              <BoolField label="Relevant CR rules were not mentioned" checked={missingCrRules} onChange={setMissingCrRules} />
              <BoolField label="Did not answer the actual question asked" checked={offTopic} onChange={setOffTopic} />
              <BoolField label="Hard to understand or apply at the table" checked={hardToApply} onChange={setHardToApply} />
              {cards.length > 0 && (
                <BoolField label="Example cards were not relevant to this scenario" checked={cardsNotRelevant} onChange={setCardsNotRelevant} />
              )}
            </Stack>

            {cards.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.75 }}>
                    Rate each example card
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.75} useFlexGap>
                    {cards.map((name) => {
                      const rv = cardRatings[name];
                      return (
                        <Box key={name} sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                          <Chip
                            label={name}
                            size="small"
                            variant={rv === true ? 'filled' : 'outlined'}
                            color={rv === true ? 'success' : rv === false ? 'error' : 'default'}
                            sx={{ fontSize: '0.7rem', height: 22 }}
                          />
                          <Tooltip title="Relevant">
                            <IconButton size="small" sx={{ p: 0.25, opacity: rv === true ? 1 : 0.4 }} onClick={() => toggleCardRating(name, true)}>
                              <ThumbUpOutlinedIcon sx={{ fontSize: 11 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Not relevant">
                            <IconButton size="small" sx={{ p: 0.25, opacity: rv === false ? 1 : 0.4 }} onClick={() => toggleCardRating(name, false)}>
                              <ThumbDownOutlinedIcon sx={{ fontSize: 11 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              </>
            )}

            <TextField
              size="small"
              multiline
              minRows={2}
              placeholder="What specifically was wrong or missing?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Divider />
            <FormControlLabel
              control={
                <Switch size="small" checked={flagPattern} onChange={(e) => setFlagPattern(e.target.checked)} color="warning" />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FlagIcon sx={{ fontSize: 14, color: flagPattern ? 'warning.main' : 'text.disabled' }} />
                  <Typography variant="body2">Flag for pattern review</Typography>
                </Box>
              }
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" onClick={handleClose}>Cancel</Button>
              <Button size="small" variant="contained" onClick={submit} disabled={submitting}>Submit</Button>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              What was helpful? (optional)
            </Typography>

            {cards.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.75 }}>
                  Were these example cards relevant?
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.75} useFlexGap>
                  {cards.map((name) => {
                    const rv = cardRatings[name];
                    return (
                      <Box key={name} sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                        <Chip
                          label={name}
                          size="small"
                          variant={rv === true ? 'filled' : 'outlined'}
                          color={rv === true ? 'success' : rv === false ? 'error' : 'default'}
                          sx={{ fontSize: '0.7rem', height: 22 }}
                        />
                        <Tooltip title="Relevant">
                          <IconButton size="small" sx={{ p: 0.25, opacity: rv === true ? 1 : 0.4 }} onClick={() => toggleCardRating(name, true)}>
                            <ThumbUpOutlinedIcon sx={{ fontSize: 11 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Not relevant">
                          <IconButton size="small" sx={{ p: 0.25, opacity: rv === false ? 1 : 0.4 }} onClick={() => toggleCardRating(name, false)}>
                            <ThumbDownOutlinedIcon sx={{ fontSize: 11 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            )}

            <TextField
              size="small"
              multiline
              minRows={2}
              placeholder="Anything specific that was useful..."
              value={upNotes}
              onChange={(e) => setUpNotes(e.target.value)}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" onClick={submit} disabled={submitting}>Skip</Button>
              <Button size="small" variant="contained" onClick={submit} disabled={submitting}>Submit</Button>
            </Stack>
          </Stack>
        )}
      </Popover>
    </Box>
  );
}
