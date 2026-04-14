'use client';

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Tooltip } from '@mui/material';
import { getCardImageByName, getCardBackImageByName } from '../lib/cardImageCache';

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

// SVG card shape used as the hover cursor (14×20px, hotspot centered)
const CARD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="20"><rect x="1" y="1" width="12" height="18" rx="2" fill="%231e3a5f" stroke="%2399aacc" stroke-width="1"/><rect x="3" y="3" width="8" height="14" rx="1" fill="none" stroke="%236699ff" stroke-width="0.75"/></svg>`;
const CARD_CURSOR = `url("data:image/svg+xml,${CARD_SVG}") 7 10, zoom-in`;

/**
 * Wraps children in a MUI Tooltip showing a card image preview on hover.
 * Uses the shared cardImageCache — DB-backed, Scryfall fallback, in-memory dedup.
 * Renders children as-is (no wrapper span) when no image is available.
 */
export function CardTooltip({ name, children, previewWidth = 220, placement = 'top', style, onClick }: Props) {
  const [imageUrl, setImageUrl]         = useState<string | null>(null);
  const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
  const [hovered, setHovered]           = useState(false);
  const [loading, setLoading]           = useState(true);

  // Load on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCardImageByName(name),
      getCardBackImageByName(name),
    ]).then(([url, backUrl]) => {
      setImageUrl(url);
      setBackImageUrl(backUrl);
      setLoading(false);
    });
  }, [name]);

  // Retry on hover if initial load returned nothing (cache no longer blocks retries)
  useEffect(() => {
    if (hovered && !imageUrl) {
      setLoading(true);
      Promise.all([
        getCardImageByName(name),
        getCardBackImageByName(name),
      ]).then(([url, backUrl]) => {
        setImageUrl(url);
        setBackImageUrl(backUrl);
        setLoading(false);
      });
    }
  }, [hovered, imageUrl, name]);

  // loading → spinner; image ready → card image; not found → false (disables tooltip)
  const tooltipTitle: React.ReactNode = loading ? (
    <Box sx={{
      width: previewWidth,
      height: Math.round(previewWidth * 1.4),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'rgba(20, 20, 20, 0.85)',
      borderRadius: 1.5,
    }}>
      <CircularProgress size={28} thickness={4} sx={{ color: 'rgba(255,255,255,0.5)' }} />
    </Box>
  ) : imageUrl ? (
    backImageUrl ? (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Box component="img" src={imageUrl} alt={name}
          sx={{ width: previewWidth, borderRadius: 1.5, display: 'block' }} />
        <Box component="img" src={backImageUrl} alt={`${name} (back)`}
          sx={{ width: previewWidth, borderRadius: 1.5, display: 'block' }} />
      </Box>
    ) : (
      <Box component="img" src={imageUrl} alt={name}
        sx={{ width: previewWidth, borderRadius: 1.5, display: 'block' }} />
    )
  ) : false;

  return (
    <Tooltip
      placement={placement}
      enterDelay={loading ? 0 : 150}
      title={tooltipTitle}
      slotProps={{ tooltip: { sx: { bgcolor: 'transparent', p: 0, boxShadow: 8 } } }}
    >
      <span
        style={{ cursor: onClick ? 'pointer' : CARD_CURSOR, ...style }}
        onMouseEnter={() => setHovered(true)}
        onClick={onClick ? (e) => { e.stopPropagation(); onClick(name); } : undefined}
      >
        {children}
      </span>
    </Tooltip>
  );
}
