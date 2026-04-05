'use client';

import { useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';

interface ImageEditorState {
  rotation: number;
  brightness: number;
  contrast: number;
  zoom: number;
  panX: number;
  panY: number;
}

interface ImageEditorDialogProps {
  open: boolean;
  previewUrl: string | null;
  state: ImageEditorState;
  onStateChange: (updates: Partial<ImageEditorState>) => void;
  onSubmit: () => void;
  onClose: () => void;
  onRetake?: () => void;
  onReupload: () => void;
}

export function ImageEditorDialog({
  open,
  previewUrl,
  state,
  onStateChange,
  onSubmit,
  onClose,
  onRetake,
  onReupload,
}: ImageEditorDialogProps) {
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Adjust Image Before Scanning
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Arrange cards in piles that fit inside the grid cells for best results. 10 piles (one per cell + full image) yields the highest accuracy. Avoid placing cards in the amber overlap zones — these areas are scanned by adjacent tiles and can produce duplicates.
          </Typography>

          {/* Preview with grid overlay */}
          <Box
            sx={{ textAlign: 'center', overflow: 'hidden', borderRadius: 1, bgcolor: 'action.hover', p: 1, cursor: 'grab', userSelect: 'none', touchAction: 'none', '&:active': { cursor: 'grabbing' } }}
            onWheel={(e) => {
              e.preventDefault();
              onStateChange({ zoom: Math.min(3, Math.max(0.5, state.zoom + (e.deltaY > 0 ? -0.1 : 0.1))) });
            }}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              panStartRef.current = { x: e.clientX, y: e.clientY, panX: state.panX, panY: state.panY };
            }}
            onPointerMove={(e) => {
              if (!panStartRef.current) return;
              const dx = e.clientX - panStartRef.current.x;
              const dy = e.clientY - panStartRef.current.y;
              const sensitivity = 0.15 / state.zoom;
              onStateChange({
                panX: panStartRef.current.panX + dx * sensitivity,
                panY: panStartRef.current.panY + dy * sensitivity,
              });
            }}
            onPointerUp={() => { panStartRef.current = null; }}
            onPointerCancel={() => { panStartRef.current = null; }}
          >
            {previewUrl && (
              <Box sx={{ position: 'relative', display: 'inline-block', overflow: 'hidden' }}>
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  draggable={false}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 400,
                    objectFit: 'contain',
                    transform: `rotate(${state.rotation}deg) scale(${state.zoom}) translate(${state.panX}%, ${state.panY}%)`,
                    filter: `brightness(${state.brightness}%) contrast(${state.contrast}%)`,
                    transition: 'filter 0.2s',
                    display: 'block',
                    pointerEvents: 'none',
                  }}
                />
                {/* 3x3 grid overlay with 8% overlap zones */}
                <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 'calc(33.33% - 2.67%)', width: '5.33%', bgcolor: 'rgba(255,160,0,0.18)' }} />
                  <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 'calc(66.66% - 2.67%)', width: '5.33%', bgcolor: 'rgba(255,160,0,0.18)' }} />
                  <Box sx={{ position: 'absolute', left: 0, right: 0, top: 'calc(33.33% - 2.67%)', height: '5.33%', bgcolor: 'rgba(255,160,0,0.18)' }} />
                  <Box sx={{ position: 'absolute', left: 0, right: 0, top: 'calc(66.66% - 2.67%)', height: '5.33%', bgcolor: 'rgba(255,160,0,0.18)' }} />
                  <Box sx={{
                    position: 'absolute', inset: 0,
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)',
                  }}>
                    {Array.from({ length: 9 }).map((_, i) => (
                      <Box key={i} sx={{ border: '1px solid rgba(255,255,255,0.5)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)' }} />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Zoom */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>Zoom</Typography>
            <Slider
              value={state.zoom}
              onChange={(_, v) => onStateChange({ zoom: v as number })}
              min={0.5} max={3} step={0.1}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${Math.round(v * 100)}%`}
              sx={{ flex: 1 }}
            />
            <Button size="small" onClick={() => onStateChange({ zoom: 1, panX: 0, panY: 0 })}>Reset</Button>
          </Stack>

          {/* Retake / Reupload */}
          <Stack direction="row" spacing={1} justifyContent="center">
            {onRetake && (
              <Button size="small" variant="outlined" startIcon={<CameraAltIcon />} onClick={onRetake}>
                Retake
              </Button>
            )}
            <Button size="small" variant="outlined" startIcon={<FileUploadIcon />} onClick={onReupload}>
              Reupload
            </Button>
          </Stack>

          {/* Rotation */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>Rotation</Typography>
            <IconButton onClick={() => onStateChange({ rotation: (state.rotation - 90 + 360) % 360 })}>
              <RotateLeftIcon />
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'center' }}>
              {state.rotation}°
            </Typography>
            <IconButton onClick={() => onStateChange({ rotation: (state.rotation + 90) % 360 })}>
              <RotateRightIcon />
            </IconButton>
          </Stack>

          {/* Brightness */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>Brightness</Typography>
            <Slider
              value={state.brightness}
              onChange={(_, v) => onStateChange({ brightness: v as number })}
              min={50} max={200} step={5}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v}%`}
              sx={{ flex: 1 }}
            />
            <Button size="small" onClick={() => onStateChange({ brightness: 100 })}>Reset</Button>
          </Stack>

          {/* Contrast */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>Contrast</Typography>
            <Slider
              value={state.contrast}
              onChange={(_, v) => onStateChange({ contrast: v as number })}
              min={50} max={200} step={5}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v}%`}
              sx={{ flex: 1 }}
            />
            <Button size="small" onClick={() => onStateChange({ contrast: 100 })}>Reset</Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" startIcon={<CameraAltIcon />} onClick={onSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export type { ImageEditorState };
