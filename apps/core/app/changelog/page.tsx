'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Stack, Box, Chip, Grow, Divider, CircularProgress } from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import BuildIcon from '@mui/icons-material/Build';
import BugReportIcon from '@mui/icons-material/BugReport';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { PageContainer } from '@/components/PageContainer';
import { api } from '@/lib/api';

type ChangeType = 'added' | 'changed' | 'fixed' | 'improved';

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  title: string;
  changes: Change[];
}

const changeTypeConfig: Record<
  ChangeType,
  { label: string; color: string; icon: React.ReactElement }
> = {
  added: { label: 'Added', color: '#2e7d32', icon: <NewReleasesIcon sx={{ fontSize: 14 }} /> },
  changed: { label: 'Changed', color: '#ed6c02', icon: <BuildIcon sx={{ fontSize: 14 }} /> },
  fixed: { label: 'Fixed', color: '#d32f2f', icon: <BugReportIcon sx={{ fontSize: 14 }} /> },
  improved: {
    label: 'Improved',
    color: '#0288d1',
    icon: <AutoAwesomeIcon sx={{ fontSize: 14 }} />,
  },
};

export default function ChangelogPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.getChangelog()
      .then((dbReleases) => {
        if (!cancelled) {
          setReleases(dbReleases.map((r) => ({
            ...r,
            changes: r.changes.map((c) => ({ ...c, type: c.type as ChangeType })),
          })));
        }
      })
      .catch(() => { /* empty state */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <PageContainer title="Changelog" subtitle="What's new in Commander Collector">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : releases.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          No changelog entries found.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {releases.map((release, index) => (
            <Grow key={release.version} in timeout={600 + index * 200}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Chip
                      label={`v${release.version}`}
                      sx={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        backgroundColor: index === 0 ? 'primary.main' : 'action.selected',
                        color: index === 0 ? '#fff' : 'text.primary',
                      }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {release.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(release.date + 'T00:00:00').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={1}>
                    {release.changes.map((change, i) => {
                      const config = changeTypeConfig[change.type];
                      return (
                        <Stack key={i} direction="row" alignItems="flex-start" spacing={1.5}>
                          <Chip
                            icon={config.icon}
                            label={config.label}
                            size="small"
                            sx={{
                              backgroundColor: config.color,
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              minWidth: 90,
                              '& .MuiChip-icon': { color: '#fff' },
                            }}
                          />
                          <Typography variant="body2" sx={{ pt: 0.3 }}>
                            {change.text}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          ))}
        </Stack>
      )}
    </PageContainer>
  );
}
