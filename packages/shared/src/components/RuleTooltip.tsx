'use client';

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Tooltip, Typography } from '@mui/material';
import { getCRRuleByNumber, type CRRule } from '../lib/ruleCache';

interface Props {
  /** Reference text, e.g. "CR 117.3c", "117.3c", "903.6". */
  reference: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  style?: React.CSSProperties;
}

/**
 * Hover-fetches the CR rule body and displays it in a MUI Tooltip.
 * If the rule lookup returns nothing, renders children as-is with no cursor or tooltip.
 */
export function RuleTooltip({ reference, children, placement = 'top', style }: Props) {
  const [rule, setRule]       = useState<CRRule | null>(null);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [looked, setLooked]   = useState(false);

  useEffect(() => {
    if (!hovered || looked) return;
    setLoading(true);
    getCRRuleByNumber(reference).then((r) => {
      setRule(r);
      setLoading(false);
      setLooked(true);
    });
  }, [hovered, looked, reference]);

  if (looked && !rule) {
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
    : rule
    ? (
      <Box sx={{ maxWidth: 380, p: 1.25 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.light', fontFamily: 'monospace', display: 'block', mb: 0.5 }}>
          CR {rule.rule_number}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: '0.8rem' }}>
          {rule.body}
        </Typography>
        {Array.isArray(rule.examples) && rule.examples.length > 0 && (
          <Box sx={{ mt: 1, pt: 0.75, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <Typography variant="caption" sx={{ display: 'block', opacity: 0.85, fontSize: '0.7rem' }}>
              Example: {rule.examples[0]}
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
        onMouseOver={() => setHovered(true)}
      >
        {children}
      </span>
    </Tooltip>
  );
}
