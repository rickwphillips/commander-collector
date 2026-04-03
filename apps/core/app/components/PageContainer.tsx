'use client';

import { Container, Box, Typography, Fade, Button, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useEffect, useState, ReactNode } from 'react';
import { SettingsTab } from './SettingsTab';

interface PageContainerProps {
  title: string;
  subtitle?: ReactNode;
  /** Optional card image shown to the left of the title/subtitle block */
  titleImage?: string | null;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function PageContainer({
  title,
  subtitle,
  titleImage,
  backHref = '/',
  backLabel = 'Back',
  children,
  actions,
}: PageContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SettingsTab />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Button component={Link} href={backHref} startIcon={<ArrowBackIcon />}>
            {backLabel}
          </Button>
          {actions && <Box>{actions}</Box>}
        </Box>

        <Fade in={mounted} timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start' }}>
              {titleImage && (
                <Tooltip
                  placement="right"
                  title={
                    <Box
                      component="img"
                      src={titleImage}
                      alt={title}
                      sx={{ width: 220, borderRadius: 1.5, display: 'block' }}
                    />
                  }
                  slotProps={{ tooltip: { sx: { bgcolor: 'transparent', p: 0, boxShadow: 8 } } }}
                >
                  <Box
                    component="img"
                    src={titleImage}
                    alt={title}
                    sx={{ width: { xs: 70, sm: 90, md: 110 }, borderRadius: 2, boxShadow: 4, flexShrink: 0, display: 'block', cursor: 'default' }}
                  />
                </Tooltip>
              )}
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: subtitle ? 1 : 0,
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #FF8C00 0%, #DAA520 100%)'
                        : 'linear-gradient(135deg, #D2691E 0%, #8B4513 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="body1" color="text.secondary">
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
