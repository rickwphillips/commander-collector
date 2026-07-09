'use client';

import type { ComponentProps } from 'react';
import { SvgIcon } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

/** Shared crown glyph (was duplicated in PlayerCard and TeamPanel). */
export const CrownIcon = (props: ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M5 16l-3-10 5.5 4L12 2l4.5 8L22 6l-3 10H5zm0 2h14v2H5v-2z" />
  </SvgIcon>
);

const crownShimmerBig = keyframes`
  0%, 100% { filter: drop-shadow(0 0 3px #DAA520) brightness(1); }
  50%       { filter: drop-shadow(0 0 10px #FFD700) brightness(1.6); }
`;
const crownEnterFromTop = keyframes`
  from { transform: translateY(-80px) rotate(-25deg); opacity: 0; }
  to   { transform: translateY(0) rotate(-25deg); opacity: 1; }
`;
const crownExitToTop = keyframes`
  from { transform: translateY(0) rotate(-25deg); opacity: 1; }
  to   { transform: translateY(-80px) rotate(-25deg); opacity: 0; }
`;

/**
 * Build the crown animation CSS from the monarch transition mode. Verbatim from
 * PlayerCard's monarchAnimStr: shimmer when steady, slide-in on gain (longer +
 * delayed when the monarch is transferred), slide-out on loss.
 */
export function monarchCrownAnim(mode: string, transfer: boolean): string {
  if (mode === 'exiting') return `${crownExitToTop} 0.5s ease-in forwards`;
  if (mode === 'entering') return `${crownEnterFromTop} ${transfer ? '1s' : '0.5s'} ${transfer ? '0.5s' : '0s'} ease-out both, ${crownShimmerBig} 2s ease-in-out infinite`;
  return `${crownShimmerBig} 2s ease-in-out infinite`;
}

/**
 * The floating Monarch crown, shared by PlayerCard and TeamPanel. Positioned by
 * default over the top-left of the life number; pass `sx` to reposition (the
 * 2HG panel floats it over the shared life).
 */
export function MonarchCrown({ show, animStr, sx }: { show: boolean; animStr: string; sx?: SxProps<Theme> }) {
  if (!show) return null;
  return (
    <CrownIcon sx={{
      fontSize: 'clamp(40px, 9dvh, 72px)',
      color: '#DAA520',
      transform: 'rotate(-25deg)',
      position: 'absolute',
      top: '-3dvh',
      left: '-4dvh',
      animation: animStr,
      ...sx,
    }} />
  );
}
