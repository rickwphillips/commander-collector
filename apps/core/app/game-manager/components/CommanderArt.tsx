'use client';

/**
 * Commander art_crop resolved by NAME through the host proxy (getArtCropByName →
 * card-image.php?art=… → base64 data URI served by the host). Resolving by name
 * (not the stored artCropUrl) means it fills in art even for games whose state
 * never persisted a crop URL (older games store null). The proxy is reachable
 * via the host and, on the remote, authorized by the session code (see
 * setRemoteSessionCode); it falls back to the raw art_crop URL where the CDN is
 * reachable. Serves the ART CROP specifically — NOT the full card image.
 *
 * Shared by TeamPanel (2HG) and PlayerCard/PlayerPanel (standard) so every
 * commander-art surface uses one path.
 */
import { useEffect, useState, type MouseEvent } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { getArtCropByName } from '@commander/shared/lib/cardImageCache';

/**
 * Resolve a commander name to a phone-safe art_crop src: the proxied data URI
 * once it settles, else undefined (so callers render nothing while it resolves,
 * and nothing at all when the name doesn't resolve). Cached per name.
 */
export function useProxiedArtUrl(name?: string): string | undefined {
  const [src, setSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!name) return;
    let alive = true;
    getArtCropByName(name)
      .then((u) => { if (alive && u) setSrc(u); })
      .catch(() => {});
    return () => { alive = false; };
  }, [name]);
  return src;
}

/** <img> commander art crop via the phone-safe proxy. Renders nothing until resolved. */
export function CommanderArt({ name, alt, sx, onClick, title }: {
  name?: string;
  alt?: string;
  sx?: SxProps<Theme>;
  onClick?: (e: MouseEvent) => void;
  title?: string;
}) {
  const src = useProxiedArtUrl(name);
  if (!src) return null;
  return <Box component="img" src={src} alt={alt ?? ''} onClick={onClick} title={title} sx={sx} />;
}

/**
 * Faded background-art layer via the phone-safe proxy. Merges the resolved
 * `backgroundImage` under the caller's `sx` (positioning, opacity, size).
 * Renders nothing until resolved.
 */
export function CommanderArtBg({ name, sx }: {
  name?: string;
  sx?: SxProps<Theme>;
}) {
  const src = useProxiedArtUrl(name);
  if (!src) return null;
  // src is a base64 data URI — the ';' and ',' break an unquoted CSS url(), so quote it.
  return <Box sx={[{ backgroundImage: `url("${src}")` }, ...(Array.isArray(sx) ? sx : [sx])] as SxProps<Theme>} />;
}
