'use client';

import { useEffect } from 'react';
import { Grid, Card, CardActionArea, CardContent, Box, Typography } from '@mui/material';
import Link from 'next/link';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { PageContainer } from '@/components/PageContainer';
import { useAuth } from '@/components/AuthGuard';

const adminItems = [
  {
    title: 'Coach Notes',
    description: "View, edit, and delete the coach's saved observations for all players",
    href: '/admin/coach-notes',
    icon: <SmartToyIcon sx={{ fontSize: 40 }} />,
    color: '#6B8E6B',
  },
];

export default function AdminPage() {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      window.location.href = '/';
    }
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  return (
    <PageContainer title="Admin" subtitle="Management tools">
      <Grid container spacing={3}>
        {adminItems.map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardActionArea component={Link} href={item.href} sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Box sx={{ color: item.color, mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}
