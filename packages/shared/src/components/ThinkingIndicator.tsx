'use client';

import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';

export interface ThinkingIndicatorProps {
  messages: string[];
  intervalMs?: number;
  showCursor?: boolean;
  paperStyle?: boolean;
}

export function ThinkingIndicator({
  messages,
  intervalMs = 3000,
  showCursor = false,
  paperStyle = false,
}: ThinkingIndicatorProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    let idx = 0;
    if (textRef.current) textRef.current.textContent = messages[0];
    const timer = setInterval(() => {
      idx = (idx + 1) % messages.length;
      if (textRef.current) textRef.current.textContent = messages[idx];
    }, intervalMs);
    return () => clearInterval(timer);
  }, [messages, intervalMs]);

  const inner = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <CircularProgress size={16} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontStyle: paperStyle ? 'normal' : 'italic', fontFamily: paperStyle ? 'monospace' : undefined, fontSize: paperStyle ? '0.8rem' : undefined, minWidth: paperStyle ? 220 : undefined }}
      >
        <span ref={textRef} />
        {showCursor && (
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
        )}
      </Typography>
    </Box>
  );

  if (paperStyle) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Paper elevation={1} sx={{ p: 1.5, borderRadius: '16px 16px 16px 4px' }}>
          {inner}
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
      {inner}
    </Box>
  );
}
