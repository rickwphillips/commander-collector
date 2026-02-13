'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
  Stack,
  Chip,
  Button,
  Box,
  Grow,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InputAdornment from '@mui/material/InputAdornment';
import { PageContainer } from '../components/PageContainer';
import { ColorIdentityChips } from '../components/ColorIdentityChips';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { api } from '../lib/api';
import type { DeckWithPlayer, MtgColor } from '../lib/types';

interface DeckWithStats extends DeckWithPlayer {
  total_games: number;
  wins: number;
  win_rate: number | null;
}

const MTG_COLORS: { code: MtgColor; name: string; color: string; bg: string }[] = [
  { code: 'W', name: 'White', color: '#F8F6D8', bg: '#F8E7B9' },
  { code: 'U', name: 'Blue', color: '#0E68AB', bg: '#C9DEF9' },
  { code: 'B', name: 'Black', color: '#332B2E', bg: '#BFACAB' },
  { code: 'R', name: 'Red', color: '#D3202A', bg: '#F9C8C6' },
  { code: 'G', name: 'Green', color: '#00733E', bg: '#A3C095' },
];

type SortOption = 'name-asc' | 'name-desc' | 'winrate-desc' | 'winrate-asc' | 'games-desc' | 'games-asc';

export default function DecksPage() {
  const [mounted, setMounted] = useState(false);
  const [decks, setDecks] = useState<DeckWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [playerFilter, setPlayerFilter] = useState('');
  const [colorFilter, setColorFilter] = useState<Set<MtgColor>>(new Set());
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchDecks();
    return () => clearTimeout(timer);
  }, []);

  const fetchDecks = async () => {
    try {
      const data = await api.getDecks();
      setDecks(data as DeckWithStats[]);
    } catch {
      setError('Failed to load decks');
    } finally {
      setLoading(false);
    }
  };

  const uniquePlayers = useMemo(() => {
    const names = [...new Set(decks.map((d) => d.player_name))];
    return names.sort();
  }, [decks]);

  const toggleColor = (color: MtgColor) => {
    setColorFilter((prev) => {
      const next = new Set(prev);
      if (next.has(color)) {
        next.delete(color);
      } else {
        next.add(color);
      }
      return next;
    });
  };

  const filteredDecks = useMemo(() => {
    let result = decks;

    // Search filter (name + commander)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.commander.toLowerCase().includes(q)
      );
    }

    // Player filter
    if (playerFilter) {
      result = result.filter((d) => d.player_name === playerFilter);
    }

    // Color filter — deck must contain ALL selected colors
    if (colorFilter.size > 0) {
      result = result.filter((d) => {
        for (const c of colorFilter) {
          if (!d.colors.includes(c)) return false;
        }
        return true;
      });
    }

    // Sort
    const sorted = [...result];
    switch (sortOption) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'winrate-desc':
        sorted.sort((a, b) => (b.win_rate ?? 0) - (a.win_rate ?? 0));
        break;
      case 'winrate-asc':
        sorted.sort((a, b) => (a.win_rate ?? 0) - (b.win_rate ?? 0));
        break;
      case 'games-desc':
        sorted.sort((a, b) => b.total_games - a.total_games);
        break;
      case 'games-asc':
        sorted.sort((a, b) => a.total_games - b.total_games);
        break;
    }

    return sorted;
  }, [decks, searchQuery, playerFilter, colorFilter, sortOption]);

  const hasActiveFilters = searchQuery || playerFilter || colorFilter.size > 0;

  const clearFilters = () => {
    setSearchQuery('');
    setPlayerFilter('');
    setColorFilter(new Set());
    setSortOption('name-asc');
  };

  if (loading) {
    return (
      <PageContainer title="Decks" subtitle="Track your commanders and decks">
        <LoadingSpinner message="Loading decks..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Decks"
      subtitle="Track your commanders and decks"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/decks/new"
        >
          Add Deck
        </Button>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filter Bar */}
      {decks.length > 0 && (
        <Grow in={mounted} timeout={400}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search deck or commander..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Player</InputLabel>
                    <Select
                      value={playerFilter}
                      label="Player"
                      onChange={(e) => setPlayerFilter(e.target.value)}
                    >
                      <MenuItem value="">All Players</MenuItem>
                      {uniquePlayers.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort</InputLabel>
                    <Select
                      value={sortOption}
                      label="Sort"
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                    >
                      <MenuItem value="name-asc">Name A-Z</MenuItem>
                      <MenuItem value="name-desc">Name Z-A</MenuItem>
                      <MenuItem value="winrate-desc">Win Rate High</MenuItem>
                      <MenuItem value="winrate-asc">Win Rate Low</MenuItem>
                      <MenuItem value="games-desc">Games Most</MenuItem>
                      <MenuItem value="games-asc">Games Least</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    {MTG_COLORS.map(({ code, name, color, bg }) => (
                      <Tooltip key={code} title={name}>
                        <Box
                          onClick={() => toggleColor(code)}
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${bg} 0%, ${color} 100%)`,
                            border: `2px solid ${color}`,
                            opacity: colorFilter.has(code) ? 1 : 0.3,
                            cursor: 'pointer',
                            transition: 'opacity 0.2s, transform 0.2s',
                            transform: colorFilter.has(code) ? 'scale(1.15)' : 'scale(1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            fontWeight: 700,
                            color: code === 'W' ? '#333' : '#FFF',
                            '&:hover': {
                              opacity: colorFilter.has(code) ? 1 : 0.6,
                              transform: 'scale(1.15)',
                            },
                          }}
                        >
                          {code}
                        </Box>
                      </Tooltip>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
              {hasActiveFilters && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {filteredDecks.length} of {decks.length} decks
                  </Typography>
                  <Button size="small" startIcon={<ClearIcon />} onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grow>
      )}

      {decks.length === 0 ? (
        <EmptyState
          title="No decks yet"
          description="Add decks to start tracking your Commander games"
          actionLabel="Add Deck"
          actionHref="/decks/new"
        />
      ) : filteredDecks.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No decks match your filters
          </Typography>
          <Button variant="outlined" startIcon={<ClearIcon />} onClick={clearFilters}>
            Clear Filters
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredDecks.map((deck, index) => (
            <Grid key={deck.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Grow in={mounted} timeout={600 + index * 100}>
                <Card>
                  <CardActionArea component={Link} href={`/decks/detail?id=${deck.id}`}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {deck.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {deck.commander}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Piloted by {deck.player_name}
                          </Typography>
                        </Box>
                        <ColorIdentityChips colors={deck.colors} size="medium" />
                      </Stack>

                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        {deck.wins > 0 && (
                          <Chip
                            icon={<EmojiEventsIcon />}
                            label={`${deck.wins} wins`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        <Chip
                          label={`${deck.total_games} games`}
                          size="small"
                          variant="outlined"
                        />
                        {deck.win_rate !== null && deck.total_games > 0 && (
                          <Chip
                            label={`${deck.win_rate}%`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        )}
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
}
