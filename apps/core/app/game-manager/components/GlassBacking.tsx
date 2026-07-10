'use client';

import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { glassBackingSx } from './controlGlass';

/**
 * GlassBacking — prop-driven wrapper that applies the shared control-glass
 * backing to any cluster that is NOT a StepperControl (which owns its own glass
 * via its `glass` prop). Use this instead of spreading `glassBackingSx` inline,
 * so the backing stays a component/prop concern rather than bespoke sx.
 *
 * Example: the hero life number + buttons on PlayerCard.
 */
export function GlassBacking({
  active,
  sx,
  children,
}: {
  active: boolean;
  sx?: SxProps<Theme>;
  children: ReactNode;
}) {
  return (
    <Box sx={[glassBackingSx(active), ...(Array.isArray(sx) ? sx : [sx])] as SxProps<Theme>}>
      {children}
    </Box>
  );
}
