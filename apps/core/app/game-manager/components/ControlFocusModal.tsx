'use client';

import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export interface ControlFocusModalProps {
  open: boolean;
  onClose: () => void;
  label: string;
  value: number | string;
  color?: string;
  onInc: () => void;
  onDec: () => void;
  onInc5?: () => void;
  onDec5?: () => void;
  disableDec?: boolean;
}

export function ControlFocusModal({
  open,
  onClose,
  label,
  value,
  color = 'text.primary',
  onInc,
  onDec,
  onInc5,
  onDec5,
  disableDec,
}: ControlFocusModalProps) {
  if (!open) return null;
  const hasStepOf5 = !!(onInc5 && onDec5);

  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        bgcolor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 2,
          minWidth: 220,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          boxShadow: 8,
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{label}</Typography>
          <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
        </Box>

        {/* ±1 row */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconButton
            size="large"
            onClick={onDec}
            disabled={disableDec}
            sx={{ width: 64, height: 64 }}
          >
            <RemoveIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography sx={{ fontSize: 64, fontWeight: 900, lineHeight: 1, minWidth: 90, textAlign: 'center', color }}>
            {value}
          </Typography>
          <IconButton
            size="large"
            onClick={onInc}
            sx={{ width: 64, height: 64 }}
          >
            <AddIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Stack>

        {/* ±5 row (optional) */}
        {hasStepOf5 && (
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton
              size="medium"
              onClick={onDec5}
              disabled={disableDec}
              sx={{ width: 56, height: 36 }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1 }}>−5</Typography>
            </IconButton>
            <Typography sx={{ minWidth: 90, textAlign: 'center', color: 'text.disabled', fontSize: 12 }}>
              ±5
            </Typography>
            <IconButton
              size="medium"
              onClick={onInc5}
              sx={{ width: 56, height: 36 }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1 }}>+5</Typography>
            </IconButton>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
