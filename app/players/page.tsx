'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
  Stack,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grow,
} from '@mui/material';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { PageContainer } from '../components/PageContainer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { api } from '../lib/api';
import type { Player } from '../lib/types';

interface PlayerWithStats extends Player {
  total_games: number;
  wins: number;
  win_rate: number | null;
}

export default function PlayersPage() {
  const [mounted, setMounted] = useState(false);
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchPlayers();
    return () => clearTimeout(timer);
  }, []);

  const fetchPlayers = async () => {
    try {
      const data = await api.getPlayers();
      setPlayers(data as PlayerWithStats[]);
    } catch {
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) return;

    setSubmitting(true);
    try {
      await api.createPlayer({ name: newPlayerName.trim() });
      setDialogOpen(false);
      setNewPlayerName('');
      fetchPlayers();
    } catch {
      setError('Failed to add player');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Players" subtitle="Manage your playgroup">
        <LoadingSpinner message="Loading players..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Players"
      subtitle="Manage your playgroup"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Player
        </Button>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {players.length === 0 ? (
        <EmptyState
          title="No players yet"
          description="Add players from your playgroup to start tracking games"
          actionLabel="Add Player"
          actionHref="#"
        />
      ) : (
        <Grid container spacing={3}>
          {players.map((player, index) => (
            <Grid key={player.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Grow in={mounted} timeout={600 + index * 100}>
                <Card>
                  <CardActionArea component={Link} href={`/players/detail?id=${player.id}`}>
                    <CardContent>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                        {player.name}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        {player.wins > 0 && (
                          <Chip
                            icon={<EmojiEventsIcon />}
                            label={`${player.wins} wins`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        {player.total_games > 0 && (
                          <Chip
                            label={`${player.total_games} games`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>

                      {player.win_rate !== null && player.total_games > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Win Rate: {player.win_rate}%
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Player Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Player</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Player Name"
            fullWidth
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddPlayer}
            variant="contained"
            disabled={!newPlayerName.trim() || submitting}
          >
            {submitting ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
