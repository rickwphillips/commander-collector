'use client';

import { Stack, Chip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import type { ColorFilterMode } from '../../lib/types';

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
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
      {(['W', 'U', 'B', 'R', 'G'] as const).map((color) => {
        const active = colors?.includes(color) ?? false;
        return (
          <Chip
            key={color}
            label={color}
            size="small"
            onClick={() => {
              const current = colors ?? [];
              const next = active ? current.filter((c) => c !== color) : [...current, color];
              onColorsChange(next.length ? next : undefined);
              if (!next.length) onColorModeChange(undefined);
            }}
            color={active ? 'primary' : 'default'}
            variant={active ? 'filled' : 'outlined'}
          />
        );
      })}
      {(colors?.length ?? 0) > 0 && (
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
  );
}
