'use client';

import { Container, Box, Typography, Fade, Button, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SettingsTab } from '../SettingsTab';
import { useThemeMode } from '../ThemeProvider';
import {
  DEFAULT_BACK_HREF,
  DEFAULT_BACK_LABEL,
  type PageContainerProps,
} from './PageContainer.types';
import styles from './PageContainer.module.scss';

/**
 * The standard chrome every non-dashboard page sits in: the settings tab, a
 * back button with optional right-aligned actions, a gradient heading with an
 * optional subtitle and card thumbnail, then the page body.
 *
 * Both the heading and the body fade in off a `mounted` flag set on a
 * zero-delay timer, so the transitions run on first paint rather than starting
 * mid-flight; the body's slower timeout staggers it behind the heading.
 *
 * `onBackClick` runs before navigation and can `preventDefault()` it, which is
 * how the editing pages interpose an unsaved-changes confirm. The container
 * stamps `data-theme` so the stylesheet can brighten the heading gradient in
 * dark mode, since the MUI theme itself puts nothing on the DOM.
 */
export function PageContainer({
  title,
  subtitle,
  titleImage,
  backHref = DEFAULT_BACK_HREF,
  backLabel = DEFAULT_BACK_LABEL,
  onBackClick,
  children,
  actions,
}: PageContainerProps) {
  const { mode } = useThemeMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SettingsTab />
      <Container maxWidth="lg" className={styles.container} data-theme={mode}>
        <Box className={styles.toolbar}>
          <Button
            component={Link}
            href={backHref}
            onClick={onBackClick}
            startIcon={<ArrowBackIcon />}
          >
            {backLabel}
          </Button>
          {actions && <Box>{actions}</Box>}
        </Box>

        <Fade in={mounted} timeout={800}>
          <Box className={styles.header}>
            <Box className={styles.headerRow}>
              {titleImage && (
                <Tooltip
                  placement="right"
                  slotProps={{ tooltip: { className: styles.imageTooltip } }}
                  title={
                    <Box
                      component="img"
                      src={titleImage}
                      alt={title}
                      className={styles.titleImageLarge}
                    />
                  }
                >
                  <Box
                    component="img"
                    src={titleImage}
                    alt={title}
                    className={styles.titleImage}
                  />
                </Tooltip>
              )}
              <Box>
                <Typography
                  variant="h3"
                  className={`${styles.title} ${subtitle ? styles.titleSpaced : ''}`}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="body1" color="text.secondary" component="div">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Fade>

        <Fade in={mounted} timeout={1000}>
          <Box>{children}</Box>
        </Fade>
      </Container>
    </>
  );
}
