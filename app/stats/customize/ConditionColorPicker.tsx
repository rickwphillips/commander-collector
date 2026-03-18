'use client';

import { Stack, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';
import { ManaSymbol } from '@/components/ManaSymbol';
import { MTG_COLORS_WITH_C, sortColors, getColorNickname } from '@/lib/utils';
import type { ColorFilterMode } from '@/lib/types';

interface ConditionColorPickerProps {
  colors: string[] | undefined;
  colorMode: ColorFilterMode | undefined;
  onColorsChange: (colors?: string[]) => void;
  onColorModeChange: (mode?: ColorFilterMode) => void;
}

export function ConditionColorPicker({
  colors,
  colorMode,
  onColorsChange,
  onColorModeChange,
}: ConditionColorPickerProps) {
  const isColorless = colors?.includes('C') ?? false;

  const handleColor = (color: string) => {
    const active = colors?.includes(color) ?? false;
    if (color === 'C') {
      if (active) {
        onColorsChange(undefined);
        onColorModeChange(undefined);
      } else {
        onColorsChange(['C']);
        onColorModeChange(undefined);
      }
    } else {
      const current = (colors ?? []).filter((c) => c !== 'C');
      const raw = active ? current.filter((c) => c !== color) : [...current, color];
      const next = raw.length ? sortColors(raw).split('') : [];
      onColorsChange(next.length ? next : undefined);
      if (!next.length) onColorModeChange(undefined);
    }
  };

  const nickname = colors?.length && (colorMode === 'and' || colorMode == null) ? getColorNickname(colors) : undefined;

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        {MTG_COLORS_WITH_C.map((color) => (
          <ManaSymbol
            key={color}
            color={color}
            size={32}
            active={colors?.includes(color) ?? false}
            dimmed
            onClick={() => handleColor(color)}
          />
        ))}
        {(colors?.length ?? 0) > 0 && !isColorless && (
          <ToggleButtonGroup
            exclusive
            size="small"
            value={colorMode ?? 'and'}
            onChange={(_, v) => { if (v) onColorModeChange(v as ColorFilterMode); }}
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
    </Stack>
  );
}
