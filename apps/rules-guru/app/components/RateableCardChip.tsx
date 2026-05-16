'use client';

import { useState } from 'react';
import { Box, Chip, Tooltip, IconButton } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { rulesApi } from '../lib/api';

interface Props {
  name: string;
  conversationId: number;
  messageId?: number;
}

type CardRating = 'relevant' | 'irrelevant' | null;

/**
 * Card chip with always-visible inline relevance buttons.
 * Submits immediately on rating; subsequent clicks toggle the rating off.
 */
export function RateableCardChip({ name, conversationId, messageId }: Props) {
  const [rating, setRating] = useState<CardRating>(null);
  const [submitted, setSubmitted] = useState(false);

  const rate = async (value: 'relevant' | 'irrelevant') => {
    const next: CardRating = rating === value ? null : value;
    setRating(next);

    if (next === null) return; // toggled off — nothing to submit

    try {
      await rulesApi.submitMessageFeedback({
        conversation_id: conversationId,
        message_id: messageId,
        rating: 'up',
        card_feedback: { [name]: next === 'relevant' },
      });
      setSubmitted(true);
    } catch {
      // silent — card rating is best-effort
    }
  };

  const isRelevant   = rating === 'relevant';
  const isIrrelevant = rating === 'irrelevant';

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
      <CardTooltip name={name}>
        <Chip
          label={name}
          size="small"
          variant="outlined"
          sx={{
            fontSize: '0.7rem',
            height: 20,
            cursor: 'default',
            '& .MuiChip-label': { px: 0.75 },
            borderColor: isRelevant ? 'success.main' : isIrrelevant ? 'error.main' : undefined,
            color: isRelevant ? 'success.main' : isIrrelevant ? 'error.main' : undefined,
          }}
        />
      </CardTooltip>

      <Tooltip title={isRelevant ? 'Marked relevant (click to undo)' : 'Relevant example'}>
        <IconButton
          size="small"
          aria-label={`${name} relevant`}
          onClick={() => rate('relevant')}
          sx={{
            p: 0.2,
            color: isRelevant ? 'success.main' : 'text.disabled',
            '&:hover': { color: 'success.main' },
          }}
        >
          {isRelevant
            ? <ThumbUpIcon sx={{ fontSize: 11 }} />
            : <ThumbUpOutlinedIcon sx={{ fontSize: 11 }} />}
        </IconButton>
      </Tooltip>

      <Tooltip title={isIrrelevant ? 'Marked not relevant (click to undo)' : 'Not relevant'}>
        <IconButton
          size="small"
          aria-label={`${name} not relevant`}
          onClick={() => rate('irrelevant')}
          sx={{
            p: 0.2,
            color: isIrrelevant ? 'error.main' : 'text.disabled',
            '&:hover': { color: 'error.main' },
          }}
        >
          {isIrrelevant
            ? <ThumbDownIcon sx={{ fontSize: 11 }} />
            : <ThumbDownOutlinedIcon sx={{ fontSize: 11 }} />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
