'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Alert,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CasinoIcon from '@mui/icons-material/Casino';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import ListSubheader from '@mui/material/ListSubheader';
import { api } from '@/lib/api';
import type { Player, DeckWithPlayer } from '@/lib/types';
import { scryfallAutocomplete, scryfallGetCard, getCardArtCrop } from '@/lib/scryfall';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { PlayerSetup, CommanderInfo } from '../types';

interface GameSetupProps {
  onStart: (players: PlayerSetup[], startingLife: number, turnTimerSeconds: number) => void;
  prefillPlayers?: PlayerSetup[];
}

interface CommanderFieldState {
  name: string;
  artCropUrl?: string;
  options: string[];
  loading: boolean;
}

const emptyCommander = (): CommanderFieldState => ({
  name: '',
  artCropUrl: undefined,
  options: [],
  loading: false,
});

interface PlayerSlot {
  playerId: number | '';
  deckId: number | '';
  commander: CommanderFieldState;
  hasPartner: boolean;
  partner: CommanderFieldState;
}

const emptySlot = (): PlayerSlot => ({
  playerId: '',
  deckId: '',
  commander: emptyCommander(),
  hasPartner: false,
  partner: emptyCommander(),
});

const LIFE_PRESETS = [20, 30, 40];

type SeatPosition = 'bottom' | 'left' | 'top' | 'right';
const ALL_POSITIONS: SeatPosition[] = ['bottom', 'left', 'top', 'right'];
const POSITIONS_BY_COUNT_DEFAULT: Record<number, SeatPosition[]> = {
  2: ['bottom', 'top'],
  3: ['bottom', 'left', 'top'],
  4: ['bottom', 'left', 'top', 'right'],
};
// Sort order for reordering playerSetups on start (matches game manager's POSITIONS_BY_COUNT)
const POSITION_ORDER: Record<SeatPosition, number> = { bottom: 0, left: 1, top: 2, right: 3 };

export function GameSetup({ onStart, prefillPlayers }: GameSetupProps) {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [decks, setDecks] = useState<DeckWithPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startingLife, setStartingLife] = useState<number>(40);
  const [customLife, setCustomLife] = useState<string>('');
  const [isCustomLife, setIsCustomLife] = useState(false);
  const [turnTimerSeconds, setTurnTimerSeconds] = useState<number>(300);

  const [playerCount, setPlayerCount] = useState<number>(4);
  const [slots, setSlots] = useState<PlayerSlot[]>([emptySlot(), emptySlot(), emptySlot(), emptySlot()]);
  const [seatPositions, setSeatPositions] = useState<SeatPosition[]>(['bottom', 'left', 'top', 'right']);

  // debounce refs per slot (main/partner)
  const debounceTimers = useState<Record<string, ReturnType<typeof setTimeout>>>({})[0];

  useEffect(() => {
    (async () => {
      try {
        const [deckData, playerData] = await Promise.all([api.getDecks(), api.getPlayers()]);
        setDecks(deckData);
        setPlayers(playerData);

        if (prefillPlayers && prefillPlayers.length > 0) {
          setPlayerCount(prefillPlayers.length);
          setSlots(prefillPlayers.map((p) => ({
            playerId: p.playerId,
            deckId: p.deckId,
            commander: { name: p.commander.name, artCropUrl: p.commander.artCropUrl, options: [], loading: false },
            hasPartner: !!p.partner,
            partner: p.partner
              ? { name: p.partner.name, artCropUrl: p.partner.artCropUrl, options: [], loading: false }
              : emptyCommander(),
          })));
        } else if (process.env.NODE_ENV === 'development') {
          const seen = new Set<number>();
          const devSlots: PlayerSlot[] = [];
          for (const deck of deckData) {
            if (seen.has(deck.player_id)) continue;
            seen.add(deck.player_id);
            devSlots.push({
              playerId: deck.player_id,
              deckId: deck.id,
              commander: { name: deck.commander ?? '', artCropUrl: undefined, options: [], loading: false },
              hasPartner: false,
              partner: emptyCommander(),
            });
            if (devSlots.length === 4) break;
          }
          if (devSlots.length > 0) {
            setPlayerCount(devSlots.length);
            setSlots(devSlots);
            devSlots.forEach((slot, i) => {
              if (slot.commander.name) fetchCommanderArt(i, 'commander', slot.commander.name);
            });
          }
        }
      } catch {
        setError('Failed to load players and decks');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateSlot = useCallback((idx: number, patch: Partial<PlayerSlot>) => {
    setSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }, []);

  const handlePlayerChange = (idx: number, playerId: number | '') => {
    updateSlot(idx, { playerId });
  };

  const handleDeckChange = (idx: number, deckId: number | '') => {
    const deck = decks.find((d) => d.id === deckId);
    const commanderName = deck?.commander ?? '';
    const ownerPlayerId = deck?.player_id ?? '';
    const currentPlayerId = slots[idx].playerId;
    const ownerAlreadyPlaying = slots.some((s, i) => i !== idx && s.playerId === ownerPlayerId);
    const resolvedPlayerId =
      currentPlayerId === '' && !ownerAlreadyPlaying ? ownerPlayerId : currentPlayerId;
    updateSlot(idx, {
      deckId,
      playerId: resolvedPlayerId,
      commander: {
        ...slots[idx].commander,
        name: commanderName,
        artCropUrl: undefined,
        options: [],
      },
    });
    if (commanderName) {
      fetchCommanderArt(idx, 'commander', commanderName);
    }
  };

  const fetchCommanderArt = async (slotIdx: number, field: 'commander' | 'partner', name: string) => {
    const card = await scryfallGetCard(name);
    const artCropUrl = card ? (getCardArtCrop(card) ?? undefined) : undefined;
    setSlots((prev) =>
      prev.map((s, i) => {
        if (i !== slotIdx) return s;
        return { ...s, [field]: { ...s[field], artCropUrl } };
      })
    );
  };

  const handleCommanderInput = (slotIdx: number, field: 'commander' | 'partner', value: string) => {
    setSlots((prev) =>
      prev.map((s, i) => {
        if (i !== slotIdx) return s;
        return { ...s, [field]: { ...s[field], name: value, artCropUrl: undefined } };
      })
    );

    const timerKey = `${slotIdx}-${field}`;
    clearTimeout(debounceTimers[timerKey]);
    debounceTimers[timerKey] = setTimeout(async () => {
      if (value.length < 2) return;
      setSlots((prev) =>
        prev.map((s, i) =>
          i === slotIdx ? { ...s, [field]: { ...s[field], loading: true } } : s
        )
      );
      const options = await scryfallAutocomplete(value);
      setSlots((prev) =>
        prev.map((s, i) =>
          i === slotIdx ? { ...s, [field]: { ...s[field], options, loading: false } } : s
        )
      );
    }, 300);
  };

  const handleCommanderSelect = async (slotIdx: number, field: 'commander' | 'partner', name: string | null) => {
    if (!name) return;
    setSlots((prev) =>
      prev.map((s, i) =>
        i === slotIdx ? { ...s, [field]: { ...s[field], name, artCropUrl: undefined } } : s
      )
    );
    await fetchCommanderArt(slotIdx, field, name);
  };

  const handleLifePreset = (_: React.MouseEvent<HTMLElement>, val: number | null) => {
    if (val === null) return;
    setStartingLife(val);
    setIsCustomLife(false);
    setCustomLife('');
  };

  const handleCustomLife = (val: string) => {
    setCustomLife(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setStartingLife(num);
      setIsCustomLife(true);
    }
  };

  const handlePlayerCountChange = (_: React.MouseEvent<HTMLElement>, val: number | null) => {
    if (val === null) return;
    setPlayerCount(val);
    setSlots((prev) => {
      const next = [...prev];
      while (next.length < val) next.push(emptySlot());
      return next.slice(0, val);
    });
    setSeatPositions(POSITIONS_BY_COUNT_DEFAULT[val] ?? POSITIONS_BY_COUNT_DEFAULT[4]);
  };

  const cyclePosition = (idx: number) => {
    setSeatPositions((prev) => {
      const next = [...prev];
      const takenBefore = next.slice(0, idx);
      const available = ALL_POSITIONS.filter(p => !takenBefore.includes(p));
      if (available.length <= 1) return prev;
      const currentIdx = available.indexOf(next[idx]);
      next[idx] = available[(currentIdx + 1) % available.length];
      // Cascade: fix any conflict for later slots
      for (let j = idx + 1; j < playerCount; j++) {
        const takenBeforeJ = next.slice(0, j);
        if (takenBeforeJ.includes(next[j])) {
          const availableForJ = ALL_POSITIONS.filter(p => !takenBeforeJ.includes(p));
          next[j] = availableForJ[0] ?? next[j];
        }
      }
      return next;
    });
  };

  const handleRandom = useCallback(() => {
    setError(null);
    const shuffled = [...decks].sort(() => Math.random() - 0.5);
    const seen = new Set<number>();
    const picked: DeckWithPlayer[] = [];
    for (const deck of shuffled) {
      if (seen.has(deck.player_id)) continue;
      seen.add(deck.player_id);
      picked.push(deck);
      if (picked.length === playerCount) break;
    }
    if (picked.length < playerCount) {
      setError('Not enough players with decks to fill all slots randomly.');
      return;
    }
    const newSlots: PlayerSlot[] = picked.map((deck) => ({
      playerId: deck.player_id,
      deckId: deck.id,
      commander: { name: deck.commander ?? '', artCropUrl: undefined, options: [], loading: false },
      hasPartner: false,
      partner: emptyCommander(),
    }));
    setSlots((prev) => {
      const next = [...newSlots];
      while (next.length < prev.length) next.push(emptySlot());
      return next;
    });
    picked.forEach((deck, i) => {
      if (deck.commander) fetchCommanderArt(i, 'commander', deck.commander);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decks, playerCount]);

  const handleStart = () => {
    const activeSlots = slots.slice(0, playerCount);
    for (let i = 0; i < activeSlots.length; i++) {
      const s = activeSlots[i];
      if (s.playerId === '' || s.deckId === '' || !s.commander.name) {
        setError(`Player ${i + 1} is missing player, deck, or commander.`);
        return;
      }
    }
    const playerIds = activeSlots.map((s) => s.playerId).filter((id) => id !== '');
    if (new Set(playerIds).size !== playerIds.length) {
      setError('Each player must be unique.');
      return;
    }

    setError(null);

    // Sort slot indices by chosen seat position so page.tsx's POSITIONS_BY_COUNT[i]
    // assignment matches each player's chosen seat (bottom=0, left=1, top=2, right=3).
    const sortedIndices = activeSlots
      .map((_, i) => i)
      .sort((a, b) => POSITION_ORDER[seatPositions[a]] - POSITION_ORDER[seatPositions[b]]);

    const playerSetups: PlayerSetup[] = sortedIndices.map((i) => {
      const s = activeSlots[i];
      const deck = decks.find((d) => d.id === s.deckId);
      const player = players.find((p) => p.id === s.playerId);
      const setup: PlayerSetup = {
        playerId: s.playerId as number,
        deckId: s.deckId as number,
        playerName: player?.name ?? `Player ${i + 1}`,
        deckName: deck?.name ?? '',
        commander: { name: s.commander.name, artCropUrl: s.commander.artCropUrl },
      };
      if (s.hasPartner && s.partner.name) {
        setup.partner = { name: s.partner.name, artCropUrl: s.partner.artCropUrl };
      }
      return setup;
    });

    onStart(playerSetups, startingLife, turnTimerSeconds);
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  const renderCommanderField = (slotIdx: number, field: 'commander' | 'partner', label: string) => {
    const slot = slots[slotIdx];
    const cmdState = slot[field];
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Autocomplete
          freeSolo
          options={cmdState.options}
          loading={cmdState.loading}
          inputValue={cmdState.name}
          onInputChange={(_, value) => handleCommanderInput(slotIdx, field, value)}
          onChange={(_, value) => handleCommanderSelect(slotIdx, field, value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              size="small"
              fullWidth
            />
          )}
          sx={{ flex: 1 }}
        />
        {cmdState.artCropUrl && (
          <Box
            component="img"
            src={cmdState.artCropUrl}
            alt={cmdState.name}
            sx={{ height: 60, width: 'auto', borderRadius: 1, flexShrink: 0 }}
          />
        )}
      </Stack>
    );
  };

  const positionIcons: Record<string, React.ReactElement> = {
    bottom: <SouthIcon sx={{ fontSize: 'clamp(28px, 5dvh, 44px)', color: 'primary.main', opacity: 0.85 }} />,
    top: <NorthIcon sx={{ fontSize: 'clamp(28px, 5dvh, 44px)', color: 'primary.main', opacity: 0.85 }} />,
    left: <WestIcon sx={{ fontSize: 'clamp(28px, 5dvh, 44px)', color: 'primary.main', opacity: 0.85 }} />,
    right: <EastIcon sx={{ fontSize: 'clamp(28px, 5dvh, 44px)', color: 'primary.main', opacity: 0.85 }} />,
  };

  const renderSlot = (idx: number) => {
    const slot = slots[idx];
    const selectedPlayerId = slot.playerId;
    const playerDecks =
      selectedPlayerId !== '' ? decks.filter((d) => d.player_id === selectedPlayerId) : [];
    const otherDecks =
      selectedPlayerId !== '' ? decks.filter((d) => d.player_id !== selectedPlayerId) : decks;
    const position = seatPositions[idx];
    const takenBefore = seatPositions.slice(0, idx);
    const canCycle = ALL_POSITIONS.filter(p => !takenBefore.includes(p)).length > 1;

    return (
      <Card variant="outlined" key={idx} sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <IconButton
              onClick={() => cyclePosition(idx)}
              disabled={!canCycle}
              size="small"
              title={`${position} seat${canCycle ? ' — click to rotate' : ''}`}
              sx={{ p: 0.5 }}
            >
              {positionIcons[position]}
            </IconButton>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.1 }}>
                Player {idx + 1}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {position} seat
              </Typography>
            </Box>
          </Stack>
          <Stack spacing={2}>
            <TextField
              select
              label="Deck"
              value={slot.deckId}
              onChange={(e) =>
                handleDeckChange(idx, e.target.value === '' ? '' : Number(e.target.value))
              }
              size="small"
              fullWidth
            >
              <MenuItem value="">Select a deck</MenuItem>
              {playerDecks.length > 0 && <ListSubheader>Your Decks</ListSubheader>}
              {playerDecks.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name} — {d.commander}
                </MenuItem>
              ))}
              {playerDecks.length > 0 && otherDecks.length > 0 && (
                <ListSubheader>Other Decks</ListSubheader>
              )}
              {otherDecks.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name} ({d.player_name}) — {d.commander}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Player"
              value={slot.playerId}
              onChange={(e) =>
                handlePlayerChange(idx, e.target.value === '' ? '' : Number(e.target.value))
              }
              size="small"
              fullWidth
            >
              <MenuItem value="">Select a player</MenuItem>
              {players.map((p) => (
                <MenuItem
                  key={p.id}
                  value={p.id}
                  disabled={slots
                    .slice(0, playerCount)
                    .some((s, i) => i !== idx && s.playerId === p.id)}
                >
                  {p.name}
                </MenuItem>
              ))}
            </TextField>

            {renderCommanderField(idx, 'commander', 'Commander')}

            <FormControlLabel
              control={
                <Checkbox
                  checked={slot.hasPartner}
                  onChange={(e) => updateSlot(idx, { hasPartner: e.target.checked })}
                  size="small"
                />
              }
              label="Partner Commander?"
            />

            {slot.hasPartner && renderCommanderField(idx, 'partner', 'Partner Commander')}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A1410' : '#FFF8F0',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 700 }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/games')} sx={{ mr: 1 }}>
            Back
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, flex: 1, textAlign: 'center' }}>
            Game Setup
          </Typography>
          <Button startIcon={<CasinoIcon />} onClick={handleRandom} sx={{ ml: 1 }}>
            Random
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Starting Life Total
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <ToggleButtonGroup
                value={isCustomLife ? null : startingLife}
                exclusive
                onChange={handleLifePreset}
                size="small"
              >
                {LIFE_PRESETS.map((v) => (
                  <ToggleButton key={v} value={v}>
                    {v}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <TextField
                label="Custom"
                value={customLife}
                onChange={(e) => handleCustomLife(e.target.value)}
                size="small"
                type="number"
                inputProps={{ min: 1 }}
                sx={{ width: 100 }}
                placeholder="e.g. 30"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Starting life: <strong>{startingLife}</strong>
            </Typography>
            <TextField
              label="Turn Timer (seconds, 0 = no limit)"
              type="number"
              size="small"
              value={turnTimerSeconds}
              onChange={(e) => setTurnTimerSeconds(Math.max(0, Number(e.target.value)))}
              inputProps={{ min: 0 }}
              sx={{ mt: 2, width: 180 }}
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Number of Players
            </Typography>
            <ToggleButtonGroup
              value={playerCount}
              exclusive
              onChange={handlePlayerCountChange}
              size="small"
            >
              <ToggleButton value={2}>2</ToggleButton>
              <ToggleButton value={3}>3</ToggleButton>
              <ToggleButton value={4}>4</ToggleButton>
            </ToggleButtonGroup>
          </CardContent>
        </Card>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Players
        </Typography>
        {Array.from({ length: playerCount }, (_, i) => renderSlot(i))}

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleStart}
          sx={{ mt: 2 }}
        >
          Start Game
        </Button>
      </Box>
    </Box>
  );
}
