'use client';

import type { Theme } from '@mui/material/styles';

/**
 * Shared "glass" backing for interactive control clusters.
 *
 * When a busy board animation is active (City's Blessing, Initiative, or
 * late-stage poison), the steppers / toggles sit over a moving decorated
 * background and get hard to read. `glassBackingSx` returns a frosted-glass sx
 * (semi-opaque fill + backdrop blur + hairline inset) to drop behind a control
 * cluster so it stays legible.
 *
 * Used by BOTH PlayerCard and TeamPanel (never re-implemented per panel). The
 * `active` trigger is computed per panel from its own state, the same way
 * threatSource is computed per panel and fed to a shared component.
 *
 * Padding is applied whether or not `active`, so toggling the fill causes no
 * layout shift: only the background / border fade in and out.
 */
export function glassBackingSx(active: boolean) {
  return {
    position: 'relative',
    borderRadius: 1.5,
    px: 0.5,
    py: 0.25,
    // Keep the control content above the backing pseudo-element, and (when the
    // glass is active) lift it with a soft drop shadow so the icons / numbers /
    // buttons pop off the frosted panel.
    '& > *': {
      position: 'relative',
      zIndex: 1,
      filter: active ? 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.4))' : 'none',
      transition: 'filter 0.6s ease',
    },
    // The backing is a pseudo-element whose OPACITY is transitioned. Opacity
    // always animates cleanly (unlike toggling backdrop-filter / box-shadow), so
    // the frosted panel fades both ON and OFF instead of snapping. It carries the
    // fill + backdrop blur + a contrasting outline (outer ring defines it over the
    // bright god-ray sky where a near-white fill would vanish; inner light ring
    // defines it over dark buildings).
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      zIndex: 0,
      pointerEvents: 'none',
      opacity: active ? 1 : 0,
      // Long, gentle fade-IN when a board animation starts; quicker fade-out.
      transition: active ? 'opacity 1.5s ease' : 'opacity 0.4s ease',
      backgroundColor: (theme: Theme) =>
        theme.palette.mode === 'dark' ? 'rgba(16,14,12,0.34)' : 'rgba(250,248,244,0.44)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      boxShadow: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? '0 0 0 1px rgba(0,0,0,0.40), inset 0 0 0 1px rgba(255,255,255,0.09)'
          : '0 0 0 1px rgba(92,82,68,0.30), inset 0 0 0 1px rgba(255,255,255,0.55)',
    },
  };
}

/**
 * Whether the control-glass backing should show: any of the busy board
 * animations is active. `poisonProgress` is the shared 0..1 ramp toward lethal
 * (poison/10 for singles, poison/15 for 2HG); we gate on the late "post" stage
 * (>= 0.6) so the glass only appears once poison is clearly threatening.
 */
export function isControlGlassActive(opts: {
  cityBlessingVisible: boolean;
  hasInitiative: boolean;
  poisonProgress: number;
}): boolean {
  return opts.cityBlessingVisible || opts.hasInitiative || opts.poisonProgress >= 0.6;
}
