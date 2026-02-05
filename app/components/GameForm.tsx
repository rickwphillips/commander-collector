'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  MenuItem,
  Alert,
  Typography,
  Box,
  IconButton,
  Grow,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import ListSubheader from '@mui/material/ListSubheader';
import { ColorIdentityChips } from './ColorIdentityChips';
import { LoadingSpinner } from './LoadingSpinner';
import { api } from '../lib/api';
import type { Player, DeckWithPlayer, GameResultInput, GameType, GameWithResults } from '../lib/types';

interface DeckOption extends DeckWithPlayer {
  total_games?: number;
  wins?: number;
}

interface PlayerResult {
  player_id: number | '';
  deck_id: number | '';
  finish_position: number;
  eliminated_turn: number | '';
  team_number: number | null;
}

const defaultResults: PlayerResult[] = [
  { player_id: '', deck_id: '', finish_position: 1, eliminated_turn: '', team_number: null },
  { player_id: '', deck_id: '', finish_position: 2, eliminated_turn: '', team_number: null },
  { player_id: '', deck_id: '', finish_position: 3, eliminated_turn: '', team_number: null },
  { player_id: '', deck_id: '', finish_position: 4, eliminated_turn: '', team_number: null },
];

const default2hgResults: PlayerResult[] = [
  { player_id: '', deck_id: '', finish_position: 1, eliminated_turn: '', team_number: 1 },
  { player_id: '', deck_id: '', finish_position: 1, eliminated_turn: '', team_number: 1 },
  { player_id: '', deck_id: '', finish_position: 2, eliminated_turn: '', team_number: 2 },
  { player_id: '', deck_id: '', finish_position: 2, eliminated_turn: '', team_number: 2 },
];

interface GameFormProps {
  mode: 'create' | 'edit';
  gameId?: number;
  onSuccess: (gameId: number) => void;
}

export function GameForm({ mode, gameId, onSuccess }: GameFormProps) {
  const [mounted, setMounted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [decks, setDecks] = useState<DeckOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [playedAt, setPlayedAt] = useState(new Date().toISOString().split('T')[0]);
  const [winningTurn, setWinningTurn] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [results, setResults] = useState<PlayerResult[]>(defaultResults);
  const [gameType, setGameType] = useState<GameType>('standard');
  const [winningTeam, setWinningTeam] = useState<number>(1);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchData();
    return () => clearTimeout(timer);
  }, [gameId]);

  const fetchData = async () => {
    try {
      const [deckData, playerData] = await Promise.all([
        api.getDecks(),
        api.getPlayers(),
      ]);
      setDecks(deckData as DeckOption[]);
      setPlayers(playerData);

      // If editing, load existing game data
      if (mode === 'edit' && gameId) {
        const gameData = await api.getGame(gameId);
        populateFromGame(gameData);
      }
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const populateFromGame = (gameData: GameWithResults) => {
    setPlayedAt(gameData.played_at.split('T')[0]);
    setWinningTurn(gameData.winning_turn ?? '');
    setNotes(gameData.notes ?? '');
    setGameType((gameData.game_type as GameType) || 'standard');

    if (gameData.results && gameData.results.length > 0) {
      const formResults: PlayerResult[] = gameData.results
        .sort((a, b) => a.finish_position - b.finish_position)
        .map(r => ({
          player_id: r.player_id ?? '',
          deck_id: r.deck_id,
          finish_position: r.finish_position,
          eliminated_turn: r.eliminated_turn ?? '',
          team_number: r.team_number ?? null,
        }));
      setResults(formResults);

      if (gameData.game_type === '2hg') {
        const winner = gameData.results.find(r => r.finish_position === 1);
        if (winner?.team_number) {
          setWinningTeam(winner.team_number);
        }
      }
    }
  };

  const addPlayer = () => {
    if (gameType === 'standard' && results.length < 8) {
      setResults([
        ...results,
        { player_id: '', deck_id: '', finish_position: results.length + 1, eliminated_turn: '', team_number: null },
      ]);
    }
  };

  const removePlayer = (index: number) => {
    if (results.length > 2) {
      const newResults = results.filter((_, i) => i !== index);
      setResults(newResults.map((r, i) => ({ ...r, finish_position: i + 1 })));
    }
  };

  const updateResult = (index: number, field: keyof PlayerResult, value: number | string | null) => {
    const newResults = [...results];
    if (field === 'player_id') {
      newResults[index].player_id = value as number | '';
    } else if (field === 'deck_id') {
      newResults[index].deck_id = value as number | '';
      if (value !== '' && newResults[index].player_id === '') {
        const deck = decks.find(d => d.id === value);
        if (deck) {
          newResults[index].player_id = deck.player_id;
        }
      }
    } else if (field === 'finish_position') {
      newResults[index].finish_position = value as number;
    } else if (field === 'eliminated_turn') {
      newResults[index].eliminated_turn = value as number | '';
    } else if (field === 'team_number') {
      newResults[index].team_number = value as number | null;
      if (gameType === '2hg') {
        newResults.forEach(r => {
          if (r.team_number === winningTeam) {
            r.finish_position = 1;
          } else if (r.team_number !== null) {
            r.finish_position = 2;
          }
        });
      }
    }
    setResults(newResults);
  };

  const handleGameTypeChange = (_: React.MouseEvent<HTMLElement>, newType: GameType | null) => {
    if (newType === null) return;
    setGameType(newType);
    if (newType === '2hg') {
      setResults(default2hgResults);
      setWinningTeam(1);
    } else {
      setResults(defaultResults);
    }
  };

  const handleWinningTeamChange = (_: React.MouseEvent<HTMLElement>, team: number | null) => {
    if (team === null) return;
    setWinningTeam(team);
    setResults(prev =>
      prev.map(r => ({
        ...r,
        finish_position: r.team_number === team ? 1 : 2,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validResults = results.filter((r) => r.deck_id !== '');
    if (validResults.length < 2) {
      setError('Please select at least 2 decks');
      return;
    }

    const deckIds = validResults.map((r) => r.deck_id);
    if (new Set(deckIds).size !== deckIds.length) {
      setError('Each deck can only be used once per game');
      return;
    }

    const playerIds = validResults.map((r) => r.player_id).filter(id => id !== '');
    if (new Set(playerIds).size !== playerIds.length) {
      setError('Each player can only appear once per game');
      return;
    }

    if (validResults.some(r => r.player_id === '')) {
      setError('Please select a player for each slot');
      return;
    }

    if (gameType === '2hg') {
      if (validResults.length !== 4) {
        setError('2-Headed Giant requires exactly 4 players');
        return;
      }
      const team1 = validResults.filter(r => r.team_number === 1);
      const team2 = validResults.filter(r => r.team_number === 2);
      if (team1.length !== 2 || team2.length !== 2) {
        setError('Each team must have exactly 2 players');
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      const gameResults: GameResultInput[] = validResults.map((r, index) => ({
        deck_id: r.deck_id as number,
        player_id: r.player_id as number,
        finish_position: gameType === '2hg' ? r.finish_position : index + 1,
        eliminated_turn: r.eliminated_turn === '' ? null : Number(r.eliminated_turn),
        team_number: gameType === '2hg' ? r.team_number : null,
      }));

      const gameData = {
        played_at: playedAt,
        winning_turn: winningTurn === '' ? null : Number(winningTurn),
        notes: notes.trim() || null,
        game_type: gameType,
        results: gameResults,
      };

      if (mode === 'create') {
        const result = await api.createGame(gameData);
        onSuccess(result.id);
      } else if (gameId) {
        await api.updateGame(gameId, gameData);
        onSuccess(gameId);
      }
    } catch {
      setError(`Failed to ${mode === 'create' ? 'save' : 'update'} game`);
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedDeck = (deckId: number | '') => {
    if (deckId === '') return null;
    return decks.find((d) => d.id === deckId);
  };

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (decks.length === 0) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            You need to create some decks before logging a game.{' '}
            <Button component="a" href="/decks/new" size="small">
              Add Deck
            </Button>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const renderPlayerAndDeckSelector = (result: PlayerResult, index: number) => {
    const selectedDeck = getSelectedDeck(result.deck_id);
    const selectedPlayerId = result.player_id;

    const playerDecks = selectedPlayerId !== '' ? decks.filter(d => d.player_id === selectedPlayerId) : [];
    const otherDecks = selectedPlayerId !== '' ? decks.filter(d => d.player_id !== selectedPlayerId) : decks;

    return (
      <>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            label="Player"
            value={result.player_id}
            onChange={(e) => updateResult(index, 'player_id', e.target.value === '' ? '' : Number(e.target.value))}
            sx={{ minWidth: 180 }}
            required
          >
            <MenuItem value="">Select a player</MenuItem>
            {players.map((player) => (
              <MenuItem
                key={player.id}
                value={player.id}
                disabled={results.some((r, i) => i !== index && r.player_id === player.id)}
              >
                {player.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Deck"
            value={result.deck_id}
            onChange={(e) => updateResult(index, 'deck_id', Number(e.target.value))}
            fullWidth
            required
          >
            <MenuItem value="">Select a deck</MenuItem>
            {playerDecks.length > 0 && <ListSubheader>Your Decks</ListSubheader>}
            {playerDecks.map((deck) => (
              <MenuItem
                key={deck.id}
                value={deck.id}
                disabled={results.some((r, i) => i !== index && r.deck_id === deck.id)}
              >
                {deck.name} - {deck.commander}
              </MenuItem>
            ))}
            {playerDecks.length > 0 && otherDecks.length > 0 && <ListSubheader>Other Decks</ListSubheader>}
            {otherDecks.map((deck) => (
              <MenuItem
                key={deck.id}
                value={deck.id}
                disabled={results.some((r, i) => i !== index && r.deck_id === deck.id)}
              >
                {deck.name} ({deck.player_name}) - {deck.commander}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {selectedDeck && (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1 }}>
            <ColorIdentityChips colors={selectedDeck.colors} size="small" />
            <Typography variant="body2" color="text.secondary">
              {selectedDeck.commander}
            </Typography>
          </Stack>
        )}
      </>
    );
  };

  const renderStandardResults = () => (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Players & Results</Typography>
        <Typography variant="body2" color="text.secondary">Order from winner (1st) to last eliminated</Typography>
      </Stack>

      <Stack spacing={2}>
        {results.map((result, index) => {
          const isWinner = index === 0;
          return (
            <Grow key={index} in={mounted} timeout={600 + index * 100}>
              <Card variant="outlined" sx={{ borderColor: isWinner ? 'primary.main' : 'divider', borderWidth: isWinner ? 2 : 1 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {isWinner && <EmojiEventsIcon sx={{ color: '#DAA520' }} />}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: isWinner ? 'primary.main' : 'text.primary' }}>
                          {isWinner ? 'Winner' : `${index + 1}${getOrdinalSuffix(index + 1)} Place`}
                        </Typography>
                      </Stack>
                      {results.length > 2 && (
                        <IconButton onClick={() => removePlayer(index)} color="error" size="small">
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Box sx={{ flex: 1 }}>{renderPlayerAndDeckSelector(result, index)}</Box>
                      {!isWinner && (
                        <TextField
                          label="Eliminated Turn"
                          type="number"
                          value={result.eliminated_turn}
                          onChange={(e) => updateResult(index, 'eliminated_turn', e.target.value === '' ? '' : Number(e.target.value))}
                          sx={{ minWidth: 150 }}
                          inputProps={{ min: 1 }}
                        />
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          );
        })}
      </Stack>

      {results.length < 8 && (
        <Button startIcon={<AddIcon />} onClick={addPlayer} sx={{ mt: 2 }}>Add Player</Button>
      )}
    </>
  );

  const render2hgResults = () => {
    const team1Results = results.map((r, i) => ({ ...r, originalIndex: i })).filter(r => r.team_number === 1);
    const team2Results = results.map((r, i) => ({ ...r, originalIndex: i })).filter(r => r.team_number === 2);

    const renderTeamSection = (teamNum: number, teamResults: (PlayerResult & { originalIndex: number })[], isWinning: boolean) => (
      <Card variant="outlined" sx={{ borderColor: isWinning ? '#DAA520' : 'divider', borderWidth: isWinning ? 2 : 1 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            {isWinning && <EmojiEventsIcon sx={{ color: '#DAA520' }} />}
            <GroupsIcon color={isWinning ? 'primary' : 'action'} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: isWinning ? 'primary.main' : 'text.primary' }}>
              Team {teamNum} {isWinning ? '(Winners)' : ''}
            </Typography>
          </Stack>
          <Stack spacing={2}>
            {teamResults.map((result) => (
              <Box key={result.originalIndex}>{renderPlayerAndDeckSelector(result, result.originalIndex)}</Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );

    return (
      <>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Teams & Results</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">Winning Team:</Typography>
          <ToggleButtonGroup value={winningTeam} exclusive onChange={handleWinningTeamChange} size="small">
            <ToggleButton value={1}>Team 1</ToggleButton>
            <ToggleButton value={2}>Team 2</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">Assign each player to a team:</Typography>
          {results.map((result, index) => (
            <Grow key={index} in={mounted} timeout={600 + index * 100}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                    <TextField
                      select
                      label="Team"
                      value={result.team_number ?? ''}
                      onChange={(e) => updateResult(index, 'team_number', Number(e.target.value))}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value={1}>Team 1</MenuItem>
                      <MenuItem value={2}>Team 2</MenuItem>
                    </TextField>
                    <Box sx={{ flex: 1 }}>{renderPlayerAndDeckSelector(result, index)}</Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          ))}
        </Stack>

        {team1Results.length > 0 && team2Results.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Team Preview</Typography>
            <Stack spacing={2}>
              {renderTeamSection(1, team1Results, winningTeam === 1)}
              {renderTeamSection(2, team2Results, winningTeam === 2)}
            </Stack>
          </>
        )}
      </>
    );
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Game Details</Typography>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <TextField
                    label="Date Played"
                    type="date"
                    value={playedAt}
                    onChange={(e) => setPlayedAt(e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Winning Turn"
                    type="number"
                    value={winningTurn}
                    onChange={(e) => setWinningTurn(e.target.value === '' ? '' : Number(e.target.value))}
                    fullWidth
                    placeholder="e.g., 8"
                    inputProps={{ min: 1 }}
                  />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body2" color="text.secondary">Game Mode:</Typography>
                  <ToggleButtonGroup value={gameType} exclusive onChange={handleGameTypeChange} size="small">
                    <ToggleButton value="standard">Standard</ToggleButton>
                    <ToggleButton value="2hg">
                      <GroupsIcon sx={{ mr: 0.5, fontSize: 18 }} />
                      2-Headed Giant
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              {gameType === 'standard' ? renderStandardResults() : render2hgResults()}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Notes</Typography>
              <TextField
                label="Game Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={3}
                fullWidth
                placeholder="Notable plays, combos, memorable moments..."
              />
            </CardContent>
          </Card>

          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Saving...' : mode === 'create' ? 'Save Game' : 'Update Game'}
          </Button>
        </Stack>
      </form>
    </>
  );
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
