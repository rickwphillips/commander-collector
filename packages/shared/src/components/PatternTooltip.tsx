'use client';

import React, { useState, useEffect } from 'react';
import { Box, Chip, CircularProgress, Tooltip, Typography } from '@mui/material';
import { getPatternById, type PatternRef } from '../lib/ruleCache';

interface Props {
  /** Pattern reference, e.g. "P523", "#P523". */
  reference: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  style?: React.CSSProperties;
}

/**
 * Hover-fetches the pattern record from the verified-pattern library and shows
 * a summary tooltip (id, name, abstract, CR refs, tags).
 * If the lookup returns nothing, renders children as-is with no cursor or tooltip.
 */
export function PatternTooltip({ reference, children, placement = 'top', style }: Props) {
  const [pattern, setPattern] = useState<PatternRef | null>(null);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [looked, setLooked]   = useState(false);

  useEffect(() => {
    if (!hovered || looked) return;
    setLoading(true);
    getPatternById(reference).then((p) => {
      setPattern(p);
      setLoading(false);
      setLooked(true);
    });
  }, [hovered, looked, reference]);

  if (looked && !pattern) {
    return <>{children}</>;
  }

  const tooltipTitle: React.ReactNode = !hovered
    ? false
    : loading
    ? (
      <Box sx={{
        minWidth: 240,
        minHeight: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1.5,
      }}>
        <CircularProgress size={20} thickness={4} sx={{ color: 'rgba(255,255,255,0.6)' }} />
      </Box>
    )
    : pattern
    ? (
      <Box sx={{ maxWidth: 400, p: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
          <Chip
            label={pattern.pattern_id.toUpperCase()}
            size="small"
            color="warning"
            variant="outlined"
            sx={{ fontSize: '0.65rem', height: 18, fontWeight: 700 }}
          />
          {pattern.category && (
            <Chip
              label={pattern.category}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.65rem', height: 18, color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.3)' }}
            />
          )}
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.85rem' }}>
          {pattern.name}
        </Typography>
        {pattern.abstract && (
          <Typography variant="caption" sx={{ display: 'block', whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: '0.75rem', opacity: 0.9, maxHeight: 160, overflow: 'auto' }}>
            {pattern.abstract}
          </Typography>
        )}
        {Array.isArray(pattern.cr_refs) && pattern.cr_refs.length > 0 && (
          <Box sx={{ mt: 1, pt: 0.5, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.75 }}>
              CR refs: {pattern.cr_refs.join(', ')}
            </Typography>
          </Box>
        )}
      </Box>
    )
    : false;

  return (
    <Tooltip
      placement={placement}
      enterDelay={150}
      title={tooltipTitle}
      slotProps={{ tooltip: { sx: { bgcolor: 'rgba(20,20,20,0.95)', p: 0, boxShadow: 8 } } }}
    >
      <span
        style={{ cursor: 'help', borderBottom: '1px dotted currentColor', ...style }}
        onMouseEnter={() => setHovered(true)}
      >
        {children}
      </span>
    </Tooltip>
  );
}
