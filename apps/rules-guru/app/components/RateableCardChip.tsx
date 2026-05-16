'use client';

import { useState } from 'react';
import { Chip, Tooltip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { rulesApi } from '../lib/api';

export type CardRatingValue = 'good' | 'not_relevant' | 'bad' | null;

interface Props {
  name: string;
  conversationId: number;
  messageId?: number;
}

const CYCLE: CardRatingValue[] = [null, 'good', 'not_relevant', 'bad'];

const STATE: Record<Exclude<CardRatingValue, null>, {
  color: 'success' | 'default' | 'error';
  icon: React.ReactElement;
  tip: string;
}> = {
  good:         { color: 'success', icon: <ThumbUpIcon       sx={{ fontSize: '11px !important' }} />, tip: 'Click: mark not relevant' },
  not_relevant: { color: 'default', icon: <RemoveCircleIcon  sx={{ fontSize: '11px !important' }} />, tip: 'Click: mark bad' },
  bad:          { color: 'error',   icon: <ThumbDownIcon     sx={{ fontSize: '11px !important' }} />, tip: 'Click: clear rating' },
};

/**
 * Card chip that cycles through three states on click:
 *   unrated → good (green ↑) → not relevant (gray –) → bad (red ↓) → unrated
 */
export function RateableCardChip({ name, conversationId, messageId }: Props) {
  const [rating, setRating] = useState<CardRatingValue>(null);

  const handleClick = async () => {
    const next = CYCLE[(CYCLE.indexOf(rating) + 1) % CYCLE.length];
    setRating(next);
    if (!next) return;
    try {
      await rulesApi.submitMessageFeedback({
        conversation_id: conversationId,
        message_id: messageId,
        rating: 'up',
        card_feedback: { [name]: next },
      });
    } catch {
      // silent
    }
  };

  const state = rating ? STATE[rating] : null;
  const tip = state?.tip ?? 'Click: mark good';

  return (
    <Tooltip title={tip} placement="top">
      <span>
        <CardTooltip name={name}>
          <Chip
            label={name}
            icon={state?.icon}
            size="small"
            variant={state ? 'filled' : 'outlined'}
            color={state?.color ?? 'default'}
            onClick={handleClick}
            sx={{
              fontSize: '0.7rem',
              height: 20,
              cursor: 'pointer',
              '& .MuiChip-label': { px: 0.75 },
              '& .MuiChip-icon': { ml: 0.5 },
              transition: 'all 0.15s',
            }}
          />
        </CardTooltip>
      </span>
    </Tooltip>
  );
}
