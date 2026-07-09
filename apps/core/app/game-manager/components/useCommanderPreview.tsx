'use client';

import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from 'react';
import { Box, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getCardImageByName } from '@commander/shared/lib/cardImageCache';

/**
 * Commander card-preview overlay, shared by PlayerCard and TeamPanel.
 *
 * Tapping a commander name opens a full-panel overlay showing the card art;
 * tapping the art toggles a 2.5× zoom. The overlay is `position:absolute` and
 * scoped to the nearest positioned ancestor (each panel's root), so it covers
 * that panel only.
 *
 * Usage:
 *   const { openPreview, overlay } = useCommanderPreview();
 *   // ...onClick={() => openPreview(commanderName)}
 *   // render {overlay} once at the panel root.
 */
export function useCommanderPreview(): {
  openPreview: (name: string) => void;
  overlay: ReactNode;
} {
  const [name, setName] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [base, setBase] = useState<{ w: number; h: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Resolve preview URL when the name changes; reset zoom/base.
  useEffect(() => {
    if (!name) { setUrl(null); setZoom(1); setBase(null); return; }
    setUrl(null);
    setZoom(1);
    setBase(null);
    getCardImageByName(name).then((u) => setUrl(u));
  }, [name]);

  // Scroll to the card bottom (player name / mana cost) when zoomed in.
  useEffect(() => {
    if (zoom > 1 && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [zoom]);

  const close = () => { setName(null); setZoom(1); setBase(null); };

  const overlay: ReactNode = name ? (
    <Box
      onClick={close}
      sx={{ position: 'absolute', inset: 0, zIndex: 35, bgcolor: 'rgba(0,0,0,0.88)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}
    >
      <IconButton
        size="small"
        onClick={(e) => { e.stopPropagation(); close(); }}
        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: 'rgba(255,255,255,0.85)', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' } }}
      >
        <CloseIcon sx={{ fontSize: 28 }} />
      </IconButton>
      {url ? (
        zoom > 1 ? (
          <Box
            ref={scrollRef}
            onClick={close}
            sx={{ position: 'absolute', inset: 8, overflow: 'auto', cursor: 'zoom-out', background: 'transparent !important' }}
          >
            <Box sx={{ minWidth: '100%', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent !important' }}>
              <Box
                component="img"
                src={url}
                alt={name ?? ''}
                draggable={false}
                onClick={(e) => { e.stopPropagation(); setZoom(1); }}
                sx={{ display: 'block', width: base ? base.w * zoom : 'auto', height: 'auto', borderRadius: '4.7%', userSelect: 'none', flexShrink: 0 }}
              />
            </Box>
          </Box>
        ) : (
          <Box
            component="img"
            src={url}
            alt={name ?? ''}
            draggable={false}
            onLoad={(e: SyntheticEvent<HTMLImageElement>) => setBase({ w: e.currentTarget.clientWidth, h: e.currentTarget.clientHeight })}
            onClick={(e) => { e.stopPropagation(); setZoom(2.5); }}
            sx={{ maxHeight: '88%', maxWidth: '88%', borderRadius: '4.7%', display: 'block', cursor: 'zoom-in', userSelect: 'none' }}
          />
        )
      ) : (
        <CircularProgress size={36} thickness={4} sx={{ color: 'rgba(255,255,255,0.45)' }} />
      )}
    </Box>
  ) : null;

  return { openPreview: setName, overlay };
}
