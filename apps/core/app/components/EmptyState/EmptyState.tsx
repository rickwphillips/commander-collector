'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import type { EmptyStateProps } from './EmptyState.types';
import styles from './EmptyState.module.scss';

/**
 * Placeholder for a list or panel that has loaded successfully but has nothing
 * to show: an optional icon, a headline, an optional explanation, and an
 * optional call-to-action.
 *
 * Distinct from {@link LoadingSpinner} (still fetching) and from an error
 * alert (the fetch failed); this one means "we looked, and there is nothing".
 * The action renders only when both `actionLabel` and `actionHref` are given.
 *
 * The icon is wrapped in a Typography rather than a Box so its muted colour
 * stays a theme token instead of a hardcoded hex in the stylesheet.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <Box className={styles.root}>
      {icon && (
        <Typography component="div" color="text.secondary" className={styles.icon}>
          {icon}
        </Typography>
      )}
      <Typography variant="h6" className={styles.title}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" className={styles.description}>
          {description}
        </Typography>
      )}
      {actionLabel && actionHref && (
        <Button component={Link} href={actionHref} variant="contained">
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
