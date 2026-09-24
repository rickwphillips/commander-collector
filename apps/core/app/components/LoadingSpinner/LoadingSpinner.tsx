'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { DEFAULT_LOADING_MESSAGE, type LoadingSpinnerProps } from './LoadingSpinner.types';
import styles from './LoadingSpinner.module.scss';

/**
 * Centred spinner with a caption, used as the in-place placeholder while a page
 * or panel waits on its first fetch.
 *
 * It occupies vertical space (a generous block of padding) on purpose, so the
 * surrounding layout does not visibly jump when the real content arrives.
 */
export function LoadingSpinner({ message = DEFAULT_LOADING_MESSAGE }: LoadingSpinnerProps) {
  return (
    <Box className={styles.root}>
      <CircularProgress color="primary" />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
