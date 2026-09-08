'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import NextLink from 'next/link';
import { useThemeMode } from '../ThemeProvider';
import { DEFAULT_STATS_CARD_ACCENT, type StatsCardProps } from './StatsCard.types';
import styles from './StatsCard.module.scss';

/**
 * A single headline statistic: a title, a large accent-coloured value, and an
 * optional icon and subtitle. Used across the dashboard, the stats page, and the
 * player and deck detail pages.
 *
 * The accent is chosen by name from a fixed set of profiles rather than by hex,
 * so the border, background wash, hover glow, and value colour are all resolved
 * by Sass at build time (see the `$accents` map in app/styles/_palette.scss).
 * Because the MUI theme is JS-only and exposes no DOM hook, the card stamps its
 * own `data-theme` so the stylesheet can lean on the accent harder in dark mode.
 *
 * Passing `href` turns the value into a next/link; the rest of the card stays
 * inert, so the card itself is not a click target.
 */
export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  accent = DEFAULT_STATS_CARD_ACCENT,
  href,
}: StatsCardProps) {
  const { mode } = useThemeMode();

  return (
    <Card className={`${styles.card} ${styles[`accent-${accent}`]}`} data-theme={mode}>
      <CardContent>
        <Box className={styles.header}>
          {icon && <Box className={styles.icon}>{icon}</Box>}
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h3"
          className={styles.value}
          {...(href ? { component: NextLink, href } : {})}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" className={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
