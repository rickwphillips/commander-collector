'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
  Stack,
  Chip,
  Box,
  Grow,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { PageContainer } from '../../components/PageContainer';
import { StatsCard } from '../../components/StatsCard';
import { ColorIdentityChips } from '../../components/ColorIdentityChips';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { api } from '../../lib/api';
import type { DeckDetail as DeckDetailType, GameWithResults } from '../../lib/types';

const COLOR_OPTIONS = [
  { value: 'W', label: 'White', color: '#F9FAF4' },
  { value: 'U', label: 'Blue', color: '#0E68AB' },
  { value: 'B', label: 'Black', color: '#150B00' },
  { value: 'R', label: 'Red', color: '#D3202A' },
  { value: 'G', label: 'Green', color: '#00733E' },
];

export default function DeckDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deckId = Number(searchParams.get('id'));

  const [mounted, setMounted] = useState(false);
  const [deck, setDeck] = useState<DeckDetailType | null>(null);
  const [games, setGames] = useState<GameWithResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCommander, setEditCommander] = useState('');
  const [editColors, setEditColors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    if (deckId) {
      fetchData();
    } else {
      setLoading(false);
    }
    return () => clearTimeout(timer);
  }, [deckId]);

  const fetchData = async () => {
    try {
      const [deckData, gamesData] = await Promise.all([
        api.getDeck(deckId),
        api.getGames(),
      ]);
      setDeck(deckData);
      setEditName(deckData.name);
      setEditCommander(deckData.commander);
      setEditColors(deckData.colors ? deckData.colors.split('') : []);

      // Filter games where this deck participated
      const deckGames = gamesData.filter((game) =>
        game.results?.some((r) => r.deck_id === deckId)
      );
      setGames(deckGames);
    } catch {
      setError('Failed to load deck data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditName(deck?.name || '');
    setEditCommander(deck?.commander || '');
    setEditColors(deck?.colors ? deck.colors.split('') : []);
    setEditDialogOpen(true);
  };

  const handleColorToggle = (color: string) => {
    setEditColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const handleSave = async () => {
    if (!editName.trim() || !editCommander.trim()) return;

    setSaving(true);
    try {
      const colorsString = COLOR_OPTIONS
        .filter((c) => editColors.includes(c.value))
        .map((c) => c.value)
        .join('');

      await api.updateDeck(deckId, {
        name: editName.trim(),
        commander: editCommander.trim(),
        colors: colorsString || 'C',
      });
      setDeck({
        ...deck!,
        name: editName.trim(),
        commander: editCommander.trim(),
        colors: colorsString || 'C',
      });
      setEditDialogOpen(false);
    } catch {
      setError('Failed to update deck');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteDeck(deckId);
      router.push('/decks');
    } catch {
      setError('Failed to delete deck');
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (!deckId) {
    return (
      <PageContainer title="Deck Not Found" backHref="/decks" backLabel="Back to Decks">
        <EmptyState title="No deck ID provided" description="Please select a deck from the list" />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer title="Deck" backHref="/decks" backLabel="Back to Decks">
        <LoadingSpinner message="Loading deck..." />
      </PageContainer>
    );
  }

  if (!deck) {
    return (
      <PageContainer title="Deck Not Found" backHref="/decks" backLabel="Back to Decks">
        <EmptyState title="Deck not found" description="This deck doesn't exist" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={deck.name}
      subtitle={deck.commander}
      backHref="/decks"
      backLabel="Back to Decks"
      actions={
        <Stack direction="row" spacing={1}>
          <Button startIcon={<EditIcon />} onClick={handleEdit}>
            Edit
          </Button>
          <Button color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteDialogOpen(true)}>
            Delete
          </Button>
        </Stack>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Deck Info */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body1" color="text.secondary">
                Created by <strong>{deck.player_name}</strong>
              </Typography>
            </Box>
            <ColorIdentityChips colors={deck.colors} size="large" />
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Total Games"
            value={deck.total_games}
            color="#D2691E"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Wins"
            value={deck.wins}
            icon={<EmojiEventsIcon />}
            color="#DAA520"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Win Rate"
            value={deck.win_rate ? `${deck.win_rate}%` : '-'}
            color="#8B4513"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Avg. Finish"
            value={deck.avg_finish_position != null ? Number(deck.avg_finish_position).toFixed(2) : '-'}
            color="#CD853F"
          />
        </Grid>
      </Grid>

      {/* Game History */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Game History
      </Typography>

      {games.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              title="No games yet"
              description="This deck hasn't been played yet"
              actionLabel="Log a Game"
              actionHref="/games/new"
            />
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {games.map((game, index) => {
            const deckResult = game.results?.find((r) => r.deck_id === deckId);
            const isWin = deckResult?.finish_position === 1;

            return (
              <Grow key={game.id} in={mounted} timeout={600 + index * 100}>
                <Card>
                  <CardActionArea component={Link} href={`/games/detail?id=${game.id}`}>
                    <CardContent>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={1}
                      >
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {isWin && (
                              <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 20 }} />
                            )}
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {isWin ? 'Victory!' : `Finished ${deckResult?.finish_position}${getOrdinalSuffix(deckResult?.finish_position || 0)}`}
                            </Typography>
                          </Stack>
                          {deckResult?.eliminated_turn && (
                            <Typography variant="body2" color="text.secondary">
                              Eliminated turn {deckResult.eliminated_turn}
                            </Typography>
                          )}
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {game.winning_turn && (
                            <Chip
                              label={`Turn ${game.winning_turn}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          <Typography variant="body2" color="text.secondary">
                            {new Date(game.played_at).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            );
          })}
        </Stack>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Deck</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Deck Name"
              fullWidth
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <TextField
              label="Commander"
              fullWidth
              value={editCommander}
              onChange={(e) => setEditCommander(e.target.value)}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Color Identity
              </Typography>
              <FormGroup row>
                {COLOR_OPTIONS.map((color) => (
                  <FormControlLabel
                    key={color.value}
                    control={
                      <Checkbox
                        checked={editColors.includes(color.value)}
                        onChange={() => handleColorToggle(color.value)}
                        sx={{
                          color: color.color,
                          '&.Mui-checked': { color: color.color },
                        }}
                      />
                    }
                    label={color.label}
                  />
                ))}
              </FormGroup>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!editName.trim() || !editCommander.trim() || saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Deck?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deck.name}? This will also remove it from all game results.
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
