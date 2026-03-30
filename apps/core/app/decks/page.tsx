'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardActionArea,
  Grid,
  IconButton,
  Tooltip,
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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StyleIcon from '@mui/icons-material/Style';
import InputAdornment from '@mui/material/InputAdornment';
import { PageContainer } from '@/components/PageContainer';
import { ColorIdentityChips } from '@/components/ColorIdentityChips';
import { ManaSymbol } from '@/components/ManaSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { api } from '@/lib/api';
import { MTG_COLORS, MTG_COLORS_WITH_C } from '@/lib/utils';
import type { DeckWithPlayer, MtgColorOrColorless, ColorFilterMode } from '@/lib/types';

interface DeckWithStats extends DeckWithPlayer {
  total_games: number;
  wins: number;
  win_rate: number | null;
}


type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'winrate-desc'
  | 'winrate-asc'
  | 'games-desc'
  | 'games-asc';

export default function DecksPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<DeckWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [playerFilter, setPlayerFilter] = useState('');
  const [colorFilter, setColorFilter] = useState<Set<MtgColorOrColorless>>(new Set());
  const [colorMode, setColorMode] = useState<ColorFilterMode>('and');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [hasListFilter, setHasListFilter] = useState(false);

  useEffect(() => {
    fetchDecks();
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

  const toggleColor = (color: MtgColorOrColorless) => {
    setColorFilter((prev) => {
      const next = new Set(prev);
      if (color === 'C') {
        if (next.has('C')) {
          next.delete('C');
        } else {
          next.clear();
          next.add('C');
        }
      } else {
        next.delete('C');
        if (next.has(color)) {
          next.delete(color);
        } else {
          next.add(color);
        }
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
        (d) => d.name.toLowerCase().includes(q) || d.commander.toLowerCase().includes(q)
      );
    }

    // Player filter
    if (playerFilter) {
      result = result.filter((d) => d.player_name === playerFilter);
    }

    // Has card list filter
    if (hasListFilter) {
      result = result.filter((d) => d.card_count > 0);
    }

    // Color filter
    if (colorFilter.size > 0) {
      const selected = [...colorFilter];
      if (colorFilter.has('C')) {
        result = result.filter((d) => d.colors === 'C' || d.colors === '');
      } else if (colorMode === 'or') {
        result = result.filter((d) => selected.some((c) => d.colors.includes(c)));
      } else if (colorMode === 'only') {
        result = result.filter((d) => {
          const hasAll = selected.every((c) => d.colors.includes(c));
          const hasNone = MTG_COLORS
            .filter((c) => !selected.includes(c))
            .every((c) => !d.colors.includes(c));
          return hasAll && hasNone;
        });
      } else {
        result = result.filter((d) => selected.every((c) => d.colors.includes(c)));
      }
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
  }, [decks, searchQuery, playerFilter, hasListFilter, colorFilter, colorMode, sortOption]);

  const hasActiveFilters = searchQuery || playerFilter || colorFilter.size > 0 || hasListFilter;

  const clearFilters = () => {
    setSearchQuery('');
    setPlayerFilter('');
    setColorFilter(new Set());
    setColorMode('and');
    setSortOption('name-asc');
    setHasListFilter(false);
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
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<CameraAltIcon />} component={Link} href="/decks/scan">
            Scan Deck
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} component={Link} href="/decks/new">
            Add Deck
          </Button>
        </Stack>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filter Bar */}
      {decks.length > 0 && (
        <Grow in timeout={400}>
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
                <Grid size={{ xs: 6, sm: 2 }}>
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
                <Grid size={{ xs: 6, sm: 1 }}>
                  <Tooltip title={hasListFilter ? 'Showing decks with card lists' : 'Show only decks with card lists'}>
                    <ToggleButton
                      value="has-list"
                      selected={hasListFilter}
                      onChange={() => setHasListFilter((v) => !v)}
                      size="small"
                      sx={{ width: '100%', height: 40 }}
                    >
                      <StyleIcon fontSize="small" />
                    </ToggleButton>
                  </Tooltip>
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <Stack spacing={0.75} alignItems="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      {MTG_COLORS_WITH_C.map((code) => (
                        <ManaSymbol
                          key={code}
                          color={code}
                          size={28}
                          active={colorFilter.has(code)}
                          dimmed
                          onClick={() => toggleColor(code)}
                        />
                      ))}
                    </Stack>
                    {colorFilter.size > 0 && !colorFilter.has('C') && (
                      <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={colorMode}
                        onChange={(_, v) => { if (v) setColorMode(v as ColorFilterMode); }}
                        sx={{ '& .MuiToggleButton-root': { py: 0, px: 0.75, fontSize: '0.65rem' } }}
                      >
                        <ToggleButton value="and">AND</ToggleButton>
                        <ToggleButton value="or">OR</ToggleButton>
                        <ToggleButton value="only">Only</ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  </Stack>
                </Grid>
              </Grid>
              {hasActiveFilters && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 1.5 }}
                >
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
              <Grow in timeout={600 + index * 100}>
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
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0, ml: -30 }}>
                          {deck.card_count > 0 && (
                            <Tooltip title={`${deck.card_count} cards — edit list`}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  router.push(`/decks/scan?edit=${deck.id}`);
                                }}
                              >
                                <StyleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <ColorIdentityChips colors={deck.colors} size="medium" fixed />
                        </Stack>
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
                        <Chip label={`${deck.total_games} games`} size="small" variant="outlined" />
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
