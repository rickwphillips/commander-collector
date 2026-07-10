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
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
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

// Duration of the seat-backdrop fade, shared so a thumbnail can be revealed
// exactly AFTER its seat's backdrop finishes (delay + BACKDROP_FADE_MS).
export const BACKDROP_FADE_MS = 800;

// Thumbnail fade-in: the img mounts only once its data URI resolves, so this
// keyframe plays on appearance. Plain opacity fade (the seat backdrop, not the
// thumbnail, carries the intro shimmer). No transform (callers may rotate their
// thumbnails). `backwards` fill holds it hidden through any reveal delay, then
// reverts to the caller's rest state so hover opacity still works.
const thumbRevealSx = (delayMs: number) => ({
  '@keyframes cbThumbIn': { from: { opacity: 0 }, to: { opacity: 1 } },
  animation: `cbThumbIn 0.7s ease ${delayMs}ms backwards`,
});

/**
 * <img> commander art crop via the phone-safe proxy. Renders nothing until
 * resolved. `revealDelayMs` gates the fade the same way the backdrop does:
 * `undefined` = fade in on load; `null` = stay hidden (held back during the intro
 * until the seat's backdrop reveals); a number = fade in after that many ms.
 */
export function CommanderArt({ name, alt, sx, onClick, title, revealDelayMs }: {
  name?: string;
  alt?: string;
  sx?: SxProps<Theme>;
  onClick?: (e: MouseEvent) => void;
  title?: string;
  revealDelayMs?: number | null;
}) {
  const src = useProxiedArtUrl(name);
  if (!src || revealDelayMs === null) return null;
  const delay = revealDelayMs === undefined ? 0 : revealDelayMs;
  return (
    <Box
      component="img"
      src={src}
      alt={alt ?? ''}
      onClick={onClick}
      title={title}
      sx={[...(Array.isArray(sx) ? sx : [sx]), thumbRevealSx(delay)] as SxProps<Theme>}
    />
  );
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

/**
 * Dramatic faded card backdrop for a player seat. Resolves the commander art by
 * name; once BOTH the art has settled AND the seat's `revealDelayMs` has elapsed,
 * it pops in (fade + slight scale-down). Decks without a resolvable image fall
 * back to a large diagonal commander name that reveals the same way, so every
 * seat gets a backdrop.
 *
 * The reveal is gated by `revealDelayMs`:
 *   • `null`      → stay hidden (the host board before a first player is picked)
 *   • `undefined` → reveal immediately (callers not doing a staggered reveal,
 *                   e.g. the remote / read-only views)
 *   • a number    → reveal after that many ms (staggered in turn order)
 *
 * Shared by every standard seat (PlayerCard); the caller supplies only the
 * absolute positioning sx — the component owns the watermark opacity + animation.
 */
export function CommanderBackdrop({ name, revealDelayMs, flashOnReveal = false, sx }: {
  name?: string;
  revealDelayMs?: number | null;
  /** Punctuate the end of the fade with a soft flash. Reserved for the initial
   *  intro sequence (a fresh first-player roll), not reloads or the remote view. */
  flashOnReveal?: boolean;
  sx?: SxProps<Theme>;
}) {
  // Resolve art with a `settled` flag so we don't flash the text fallback while
  // a real image is still resolving.
  const [art, setArt] = useState<{ src?: string; settled: boolean }>({ settled: false });
  useEffect(() => {
    let alive = true;
    const finish = (src?: string) => { if (alive) setArt({ src, settled: true }); };
    if (!name) {
      // No commander name: settle (to the text fallback path) on the next frame
      // rather than synchronously, so the effect never setState()s in its body.
      const id = requestAnimationFrame(() => finish(undefined));
      return () => { alive = false; cancelAnimationFrame(id); };
    }
    getArtCropByName(name)
      .then((u) => finish(u || undefined))
      .catch(() => finish(undefined));
    return () => { alive = false; };
  }, [name]);

  // undefined = no gating (reveal now); null = stay hidden; number = delay (ms).
  const delay = revealDelayMs === undefined ? 0 : revealDelayMs;

  // Don't commit to image-vs-text until art has settled (avoids a fallback flash).
  if (!art.settled) return null;

  // A CSS keyframe (not a transition) drives the reveal: animations always run
  // when applied, with no dependency on a previously-painted value, so they never
  // "pop" the way a mount-time transition can. `animation-delay` = the seat's
  // stagger offset and `fill-mode: both` holds it hidden through that delay and at
  // rest afterward. The wrapper animates opacity 0→1 while the inner image/text
  // keeps its low watermark opacity, so the net effect fades up to the watermark.
  const FADE_MS = BACKDROP_FADE_MS;
  const base = Array.isArray(sx) ? sx : [sx];
  const reveal =
    delay === null
      ? { opacity: 0 }
      : {
          opacity: 0,
          '@keyframes cbReveal': {
            from: { opacity: 0, transform: 'scale(1.06)' },
            to: { opacity: 1, transform: 'scale(1)' },
          },
          animation: `cbReveal ${FADE_MS}ms ease ${delay}ms both`,
        };

  // A soft warm flash punctuates the moment each fade completes (delay + FADE_MS).
  // Intro sequence only (flashOnReveal) — reloads and the remote view don't flash.
  const flash =
    delay === null || !flashOnReveal ? null : (
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 45%, rgba(255,241,214,1) 0%, rgba(255,230,188,0) 60%)',
          opacity: 0,
          '@keyframes cbFlash': {
            '0%': { opacity: 0 },
            '35%': { opacity: 0.32 },
            '100%': { opacity: 0 },
          },
          animation: `cbFlash 600ms ease-out ${delay + FADE_MS}ms both`,
        }}
      />
    );

  return (
    <Box sx={[...base, { overflow: 'hidden', pointerEvents: 'none' }, reveal] as SxProps<Theme>}>
      {art.src ? (
        <Box
          component="img"
          src={art.src}
          alt=""
          sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.12 }}
        />
      ) : (
        // No image: flash the commander name diagonally, revealed the same way.
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography
            sx={{
              transform: 'rotate(-28deg)',
              fontWeight: 900,
              fontSize: 'clamp(1.1rem, 5.5dvh, 3rem)',
              letterSpacing: 1,
              textTransform: 'uppercase',
              lineHeight: 1,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              color: 'text.primary',
              opacity: 0.16,
              px: 2,
            }}
          >
            {name}
          </Typography>
        </Box>
      )}
      {flash}
    </Box>
  );
}
