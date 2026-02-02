'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = '#D2691E'
}: StatsCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${color}15 0%, transparent 100%)`
            : `linear-gradient(135deg, ${color}08 0%, transparent 100%)`,
        borderLeft: `4px solid ${color}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? `0 8px 24px ${color}30`
              : `0 8px 24px ${color}20`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {icon && <Box sx={{ color }}>{icon}</Box>}
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700, color }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
