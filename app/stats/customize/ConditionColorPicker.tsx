'use client';

import { Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { ManaSymbol } from '../../components/ManaSymbol';
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
      const next = active ? current.filter((c) => c !== color) : [...current, color];
      onColorsChange(next.length ? next : undefined);
      if (!next.length) onColorModeChange(undefined);
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
      {(['W', 'U', 'B', 'R', 'G', 'C'] as const).map((color) => (
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
  );
}
