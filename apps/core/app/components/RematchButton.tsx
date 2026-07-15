'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme, alpha } from '@mui/material/styles';
import ReplayIcon from '@mui/icons-material/Replay';
import { api } from '@/lib/api';
import styles from './RematchButton.module.scss';

export interface RematchButtonProps {
  /** Rematch a specific game. Omit to rematch the most recent (hides when none). */
  gameId?: string;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined' | 'text';
  className?: string;
}

export function RematchButton({
  gameId,
  label = 'Rematch',
  size = 'medium',
  variant = 'contained',
  className,
}: RematchButtonProps) {
  const router = useRouter();
  const theme = useTheme();
  // undefined = resolving, null = no prior game to rematch.
  const [recentId, setRecentId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (gameId) return;
    let active = true;
    api
      .getMostRecentGame()
      .then((game) => {
        if (active) setRecentId(game?.id ?? null);
      })
      .catch(() => {
        if (active) setRecentId(null);
      });
    return () => {
      active = false;
    };
  }, [gameId]);

  const targetId = gameId ?? recentId;
  if (!targetId) return null;

  const styleVars = {
    '--rematch-accent': theme.palette.primary.main,
    '--rematch-accent-contrast': theme.palette.primary.contrastText,
    '--rematch-accent-hover': theme.palette.primary.dark,
    '--rematch-accent-soft': alpha(theme.palette.primary.main, 0.12),
  } as CSSProperties;

  const variantClass =
    variant === 'outlined' ? styles.outlined : variant === 'text' ? styles.text : styles.contained;
  const classes = [styles.rematch, styles[size], variantClass, className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      style={styleVars}
      onClick={() => router.push(`/game-manager?rematch=${targetId}`)}
    >
      <ReplayIcon className={styles.icon} fontSize="inherit" />
      {label}
    </button>
  );
}
