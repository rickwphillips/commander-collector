'use client';

import { useEffect, useRef, useState, useCallback, useId } from 'react';
import { Chip, Tooltip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

/**
 * Three-state rateable wrapper used by the rules-guru and coach chat surfaces.
 *
 * Click cycles: unrated → good → not_relevant → bad → unrated. After 600ms
 * with no further click the current value is treated as "settled" and onSubmit
 * fires. Re-toggling later submits the new settled value, so the event log
 * carries the full toggle history.
 *
 * The chip wraps an arbitrary child (a CardTooltip, RuleTooltip, PatternTooltip,
 * or just text for AI claims). The toggle behavior is the chip's; the child
 * keeps its own hover / lookup semantics.
 */

export type RatingValue = 'good' | 'not_relevant' | 'bad' | null;
export type RatingKind  = 'card' | 'cr_rule' | 'pattern' | 'claim';

export interface RatingChipSubmit {
  rating: Exclude<RatingValue, null>;
  kind:    RatingKind;
  targetId: string;
  messageUuid: string;
  contentText?: string;
}

export interface RatingChipProps {
  kind:        RatingKind;
  targetId:    string;
  messageUuid: string;
  contentText?: string;
  /** Called once per settled toggle (i.e. 600ms after the last click). */
  onSubmit:    (payload: RatingChipSubmit) => void | Promise<void>;
  /** Initial rating, if a prior submission for this (kind, target_id, message_uuid) is known. */
  initial?:    RatingValue;
  /** Optional CSS class so the lookup detector can ignore these chips. */
  className?:  string;
  children:    React.ReactNode;
}

const CYCLE: RatingValue[] = [null, 'good', 'not_relevant', 'bad'];
const SETTLE_MS = 600;

const STATE: Record<Exclude<RatingValue, null>, {
  color: 'success' | 'default' | 'error';
  icon:  React.ReactElement;
  tip:   string;
}> = {
  good:         { color: 'success', icon: <ThumbUpIcon      sx={{ fontSize: '11px !important' }} />, tip: 'Marked good. Click: not relevant.' },
  not_relevant: { color: 'default', icon: <RemoveCircleIcon sx={{ fontSize: '11px !important' }} />, tip: 'Marked not relevant. Click: bad.' },
  bad:          { color: 'error',   icon: <ThumbDownIcon    sx={{ fontSize: '11px !important' }} />, tip: 'Marked bad. Click: clear.' },
};

export function RatingChip({
  kind, targetId, messageUuid, contentText, onSubmit, initial = null, className, children,
}: RatingChipProps) {
  const [rating, setRating] = useState<RatingValue>(initial);
  const lastSubmittedRef = useRef<RatingValue>(initial);
  const settleTimer       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const submitIfChanged = useCallback((value: RatingValue) => {
    if (value === lastSubmittedRef.current) return;
    lastSubmittedRef.current = value;
    if (!value) return; // we do not submit "cleared" — absence is the signal
    void onSubmit({ rating: value, kind, targetId, messageUuid, contentText });
  }, [onSubmit, kind, targetId, messageUuid, contentText]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRating((prev) => {
      const next = CYCLE[(CYCLE.indexOf(prev) + 1) % CYCLE.length];
      if (settleTimer.current) clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(() => submitIfChanged(next), SETTLE_MS);
      return next;
    });
  };

  useEffect(() => () => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
  }, []);

  const state = rating ? STATE[rating] : null;
  const tip   = state?.tip ?? 'Click to rate (good / not relevant / bad)';

  return (
    <Tooltip title={tip} placement="top" disableInteractive>
      <Chip
        data-rating-chip-id={id}
        className={['rating-chip', className].filter(Boolean).join(' ')}
        icon={state?.icon}
        label={children}
        size="small"
        variant={state ? 'filled' : 'outlined'}
        color={state?.color ?? 'default'}
        onClick={handleClick}
        sx={{
          fontSize: '0.7rem',
          height: 'auto',
          minHeight: 20,
          py: 0.5,
          cursor: 'pointer',
          verticalAlign: 'middle',
          mx: 0.25,
          maxWidth: '100%',
          '& .MuiChip-label': {
            px: 0.75,
            // Allow the chip to grow vertically and wrap so long claim bodies
            // remain fully readable instead of being truncated with ellipsis.
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'clip',
            display: 'inline',
            lineHeight: 1.4,
          },
          '& .MuiChip-icon':  { ml: 0.5 },
          transition: 'all 0.15s',
        }}
      />
    </Tooltip>
  );
}
