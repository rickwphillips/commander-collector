'use client';

import { Stack, Box, Tooltip } from '@mui/material';

const colorMap: Record<string, { name: string; color: string; bg: string }> = {
  W: { name: 'White', color: '#F8F6D8', bg: '#F8E7B9' },
  U: { name: 'Blue', color: '#0E68AB', bg: '#C9DEF9' },
  B: { name: 'Black', color: '#332B2E', bg: '#BFACAB' },
  R: { name: 'Red', color: '#D3202A', bg: '#F9C8C6' },
  G: { name: 'Green', color: '#00733E', bg: '#A3C095' },
};

interface ColorIdentityChipsProps {
  colors: string;
  size?: 'small' | 'medium' | 'large';
}

export function ColorIdentityChips({ colors, size = 'medium' }: ColorIdentityChipsProps) {
  const sizeMap = { small: 20, medium: 28, large: 36 };
  const dimension = sizeMap[size];

  if (!colors || colors === 'C') {
    return (
      <Tooltip title="Colorless">
        <Box
          sx={{
            width: dimension,
            height: dimension,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #BEB9B2 0%, #8F8781 100%)',
            border: '2px solid #6B6560',
          }}
        />
      </Tooltip>
    );
  }

  return (
    <Stack direction="row" spacing={0.5}>
      {colors.split('').map((color, index) => {
        const colorInfo = colorMap[color];
        if (!colorInfo) return null;

        return (
          <Tooltip key={index} title={colorInfo.name}>
            <Box
              sx={{
                width: dimension,
                height: dimension,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colorInfo.bg} 0%, ${colorInfo.color} 100%)`,
                border: `2px solid ${colorInfo.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: dimension * 0.5,
                fontWeight: 700,
                color: color === 'W' ? '#333' : '#FFF',
              }}
            >
              {color}
            </Box>
          </Tooltip>
        );
      })}
    </Stack>
  );
}
