'use client';

import React, { useState, useEffect } from 'react';
import { Box, Tooltip } from '@mui/material';
import { getCardImageByName } from '../lib/cardImageCache';

interface Props {
  name: string;
  children: React.ReactNode;
  /** Width of the preview image in pixels. Default: 220 */
  previewWidth?: number;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Extra styles applied to the wrapper element */
  style?: React.CSSProperties;
  /** Click handler — receives the card name */
  onClick?: (name: string) => void;
}

/**
 * Wraps children in a MUI Tooltip showing a card image preview on hover.
 * Uses the shared cardImageCache — DB-backed, Scryfall fallback, in-memory dedup.
 * Renders children as-is (no wrapper span) when no image is available.
 */
export function CardTooltip({ name, children, previewWidth = 220, placement = 'top', style, onClick }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    getCardImageByName(name).then((url) => setImageUrl(url));
  }, [name]);

  if (!imageUrl) return <>{children}</>;

  return (
    <Tooltip
      placement={placement}
      enterDelay={150}
      title={
        <Box
          component="img"
          src={imageUrl}
          alt={name}
          sx={{ width: previewWidth, borderRadius: 1.5, display: 'block' }}
        />
      }
      slotProps={{ tooltip: { sx: { bgcolor: 'transparent', p: 0, boxShadow: 8 } } }}
    >
      <span
        style={{ cursor: onClick ? 'pointer' : 'help', ...style }}
        onClick={onClick ? (e) => { e.stopPropagation(); onClick(name); } : undefined}
      >
        {children}
      </span>
    </Tooltip>
  );
}
