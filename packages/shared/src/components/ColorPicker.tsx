'use client';

import { Stack, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';
import { ManaSymbol } from './ManaSymbol';
import { MTG_COLORS_WITH_C, sortColors, getColorNickname } from '../lib/utils';
import type { ColorFilterMode } from '../lib/types';

// ── Toggle logic (shared across all color pickers) ────────────────

/**
 * Applies exclusive-colorless toggle logic to a color array.
 * - Clicking C clears WUBRG and sets only C (or clears C if already active).
 * - Clicking any color removes C and toggles that color.
 * Returns a new sorted array.
 */
export function toggleColorSelection(current: string[], color: string): string[] {
  const active = current.includes(color);
  if (color === 'C') {
    return active ? [] : ['C'];
  }
  const without = current.filter((c) => c !== 'C');
  const next = active ? without.filter((c) => c !== color) : [...without, color];
  return next.length ? sortColors(next).split('') : [];
}

// ── ColorPicker component ─────────────────────────────────────────

interface ColorPickerProps {
  /** Currently selected color codes (e.g. ['W', 'U'] or ['C']). */
  colors: string[];
  /** Called with the new colors array after a toggle. */
  onColorsChange: (colors: string[]) => void;
  /** Pip size in pixels. Default 32. */
  size?: number;
  /**
   * When provided, shows AND/OR/Only mode toggle for multi-color selections.
   * Omit for simple identity pickers that don't need filter modes.
   */
  colorMode?: ColorFilterMode;
  /** Called when the filter mode changes. Required if colorMode is provided. */
  onColorModeChange?: (mode: ColorFilterMode | undefined) => void;
  /** Show guild/shard/wedge nickname below pips. Default true when colorMode is provided. */
  showNickname?: boolean;
  /** Optional label shown above the pips. */
  label?: string;
  /** Optional caption shown below when no colors are selected. */
  emptyCaption?: string;
}

export function ColorPicker({
  colors,
  onColorsChange,
  size = 32,
  colorMode,
  onColorModeChange,
  showNickname,
  label,
  emptyCaption,
}: ColorPickerProps) {
  const hasMode = colorMode !== undefined || onColorModeChange !== undefined;
  const resolvedShowNickname = showNickname ?? hasMode;
  const isColorless = colors.includes('C');

  const handleToggle = (color: string) => {
    const next = toggleColorSelection(colors, color);
    onColorsChange(next);
    // Clear mode when colors empty or colorless
    if (onColorModeChange && (next.length === 0 || next.includes('C'))) {
      onColorModeChange(undefined);
    }
  };

  const nickname =
    resolvedShowNickname && colors.length > 0 && !isColorless && (colorMode === 'and' || colorMode == null)
      ? getColorNickname(colors)
      : undefined;

  return (
    <Stack spacing={0.5}>
      {label && (
        <Typography variant="subtitle2">{label}</Typography>
      )}
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        {MTG_COLORS_WITH_C.map((color) => (
          <ManaSymbol
            key={color}
            color={color}
            size={size}
            active={colors.includes(color)}
            dimmed
            onClick={() => handleToggle(color)}
          />
        ))}
        {hasMode && colors.length > 0 && !isColorless && (
          <ToggleButtonGroup
            exclusive
            size="small"
            value={colorMode ?? 'and'}
            onChange={(_, v) => { if (v && onColorModeChange) onColorModeChange(v as ColorFilterMode); }}
            sx={{ '& .MuiToggleButton-root': { py: 0, px: 0.75, fontSize: '0.65rem' } }}
          >
            <ToggleButton value="and">AND</ToggleButton>
            <ToggleButton value="or">OR</ToggleButton>
            <ToggleButton value="only">Only</ToggleButton>
          </ToggleButtonGroup>
        )}
      </Stack>
      {nickname && (
        <Typography variant="caption" color="primary.main" sx={{ fontStyle: 'italic' }}>
          {nickname}
        </Typography>
      )}
      {emptyCaption && colors.length === 0 && (
        <Typography variant="caption" color="text.secondary">
          {emptyCaption}
        </Typography>
      )}
    </Stack>
  );
}
