'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Stack,
  Chip,
  Box,
  Grow,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Link from 'next/link';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { PageContainer } from '../../components/PageContainer';
import { ColorIdentityChips } from '../../components/ColorIdentityChips';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { api } from '../../lib/api';
import type { GameWithResults } from '../../lib/types';

interface GameDetailProps {
  gameId: number;
}

export function GameDetail({ gameId }: GameDetailProps) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [game, setGame] = useState<GameWithResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchGame();
    return () => clearTimeout(timer);
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const data = await api.getGame(gameId);
      setGame(data);
    } catch {
      setError('Failed to load game');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteGame(gameId);
      router.push('/games');
    } catch {
      setError('Failed to delete game');
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Game" backHref="/games" backLabel="Back to Games">
        <LoadingSpinner message="Loading game..." />
      </PageContainer>
    );
  }

  if (!game) {
    return (
      <PageContainer title="Game Not Found" backHref="/games" backLabel="Back to Games">
        <EmptyState title="Game not found" description="This game doesn't exist" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Game Details"
      backHref="/games"
      backLabel="Back to Games"
      actions={
        <Button
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Game Info */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <CalendarTodayIcon color="action" />
              <Typography variant="h6">
                {new Date(game.played_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Chip label={`${game.results?.length || 0} players`} />
              {game.winning_turn && (
                <Chip label={`Turn ${game.winning_turn}`} color="primary" />
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Results */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Results
      </Typography>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {game.results
          ?.sort((a, b) => a.finish_position - b.finish_position)
          .map((result, index) => {
            const isWinner = result.finish_position === 1;

            return (
              <Grow key={result.id} in={mounted} timeout={600 + index * 100}>
                <Card
                  sx={{
                    borderLeft: isWinner ? '4px solid #DAA520' : undefined,
                  }}
                >
                  <CardActionArea component={Link} href={`/decks/${result.deck_id}`}>
                    <CardContent>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: isWinner ? '#DAA520' : 'action.selected',
                              color: isWinner ? 'white' : 'text.primary',
                              fontWeight: 700,
                            }}
                          >
                            {isWinner ? (
                              <EmojiEventsIcon />
                            ) : (
                              result.finish_position
                            )}
                          </Box>
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {result.player_name}
                              </Typography>
                              <ColorIdentityChips colors={result.colors} size="small" />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {result.deck_name} - {result.commander}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          {isWinner ? (
                            <Chip label="Winner" color="primary" size="small" />
                          ) : (
                            <Chip
                              label={`${result.finish_position}${getOrdinalSuffix(result.finish_position)}`}
                              variant="outlined"
                              size="small"
                            />
                          )}
                          {result.eliminated_turn && (
                            <Chip
                              label={`Elim. turn ${result.eliminated_turn}`}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            );
          })}
      </Stack>

      {/* Notes */}
      {game.notes && (
        <>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Notes
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {game.notes}
              </Typography>
            </CardContent>
          </Card>
        </>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Game?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this game? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
