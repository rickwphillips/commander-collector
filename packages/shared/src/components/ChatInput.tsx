'use client';

import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Box, IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StopCircleIcon from '@mui/icons-material/StopCircle';

export interface ChatInputHandle {
  setValue(text: string): void;
  appendText(text: string): void;
  focus(): void;
}

export interface ChatInputProps {
  onSend: (text: string) => void;
  onStop?: () => void;
  loading: boolean;
  placeholder?: string;
  steeringHint?: string;
  elevation?: number;
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  function ChatInput(
    {
      onSend,
      onStop,
      loading,
      placeholder = 'Ask a question…',
      steeringHint = 'Type to steer · Esc to cancel',
      elevation = 3,
    },
    ref,
  ) {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      setValue,
      appendText: (text) =>
        setValue((prev) => {
          const trimmed = prev.trimEnd();
          return trimmed ? `${trimmed} ${text}` : text;
        }),
      focus: () => setTimeout(() => inputRef.current?.focus(), 50),
    }));

    const submit = () => {
      const trimmed = value.trim();
      if (!trimmed) return;
      setValue('');
      onSend(trimmed);
    };

    const showStop = loading && !value.trim() && onStop;
    const showSend = !showStop;

    return (
      <Box>
        {loading && steeringHint && (
          <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, display: 'block', fontStyle: 'italic' }}>
            {steeringHint}
          </Typography>
        )}
        <Paper elevation={elevation} square sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            maxRows={6}
            placeholder={loading ? 'Add more details…' : placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            size="small"
            variant="outlined"
          />
          {showStop ? (
            <Tooltip title="Stop">
              <IconButton onClick={onStop} color="default" sx={{ mb: 0.25 }}>
                <StopCircleIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={loading ? 'Interrupt and send' : 'Send'}>
              <span>
                <IconButton
                  onClick={submit}
                  disabled={!value.trim()}
                  color={loading ? 'warning' : 'primary'}
                  sx={{ mb: 0.25 }}
                >
                  <SendIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Paper>
      </Box>
    );
  },
);
