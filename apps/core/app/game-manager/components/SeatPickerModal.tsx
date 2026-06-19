'use client';

/**
 * Per-seat player/deck/commander/partner picker.
 *
 * Used by GameBoard during the 'seating' phase: each PlayerPanel opens this
 * modal when the user taps its empty CTA (or its edit affordance on a filled
 * seat). Behavior mirrors the per-slot block that used to live in GameSetup.
 */
import { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  ListSubheader,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyleIcon from '@mui/icons-material/Style';
import { BracketChip } from '@/components/BracketChip';
import { scryfallAutocomplete, scryfallGetCard, getCardArtCrop } from '@/lib/scryfall';
import type { Player, DeckWithPlayer } from '@/lib/types';
import type { CommanderInfo, PlayerSetup } from '../types';

interface CommanderFieldState {
  name: string;
  artCropUrl?: string;
  options: string[];
  loading: boolean;
}

function emptyCommanderField(initial?: CommanderInfo): CommanderFieldState {
  return {
    name: initial?.name ?? '',
    artCropUrl: initial?.artCropUrl,
    options: [],
    loading: false,
  };
}

export interface SeatPickerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (setup: PlayerSetup) => void;
  initial?: PlayerSetup;
  seatLabel: string;
  players: Player[];
  decks: DeckWithPlayer[];
  /** Player IDs already claimed by other seats (disabled in the dropdown). */
  excludePlayerIds: string[];
}

export function SeatPickerModal({
  open,
  onClose,
  onConfirm,
  initial,
  seatLabel,
  players,
  decks,
  excludePlayerIds,
}: SeatPickerModalProps) {
  const [playerId, setPlayerId] = useState<string>(initial?.playerId ?? '');
  const [deckId, setDeckId] = useState<string>(initial?.deckId ?? '');
  const [commander, setCommander] = useState<CommanderFieldState>(emptyCommanderField(initial?.commander));
  const [hasPartner, setHasPartner] = useState<boolean>(!!initial?.partner);
  const [partner, setPartner] = useState<CommanderFieldState>(emptyCommanderField(initial?.partner));
  const [error, setError] = useState<string | null>(null);
  const [debounceTimers] = useState<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (!open) return;
    setPlayerId(initial?.playerId ?? '');
    setDeckId(initial?.deckId ?? '');
    setCommander(emptyCommanderField(initial?.commander));
    setHasPartner(!!initial?.partner);
    setPartner(emptyCommanderField(initial?.partner));
    setError(null);
  }, [open, initial]);

  async function fetchArt(field: 'commander' | 'partner', name: string) {
    const card = await scryfallGetCard(name);
    const artCropUrl = card ? (getCardArtCrop(card) ?? undefined) : undefined;
    if (field === 'commander') setCommander((s) => ({ ...s, artCropUrl }));
    else setPartner((s) => ({ ...s, artCropUrl }));
  }

  function handleCommanderInput(field: 'commander' | 'partner', value: string) {
    if (field === 'commander') setCommander((s) => ({ ...s, name: value, artCropUrl: undefined }));
    else setPartner((s) => ({ ...s, name: value, artCropUrl: undefined }));
    const key = `pick-${field}`;
    clearTimeout(debounceTimers[key]);
    debounceTimers[key] = setTimeout(async () => {
      if (value.length < 2) return;
      if (field === 'commander') setCommander((s) => ({ ...s, loading: true }));
      else setPartner((s) => ({ ...s, loading: true }));
      const options = await scryfallAutocomplete(value);
      if (field === 'commander') setCommander((s) => ({ ...s, options, loading: false }));
      else setPartner((s) => ({ ...s, options, loading: false }));
    }, 300);
  }

  async function handleCommanderSelect(field: 'commander' | 'partner', name: string | null) {
    if (!name) return;
    if (field === 'commander') setCommander((s) => ({ ...s, name, artCropUrl: undefined }));
    else setPartner((s) => ({ ...s, name, artCropUrl: undefined }));
    await fetchArt(field, name);
  }

  function handleDeckChange(newDeckId: string) {
    const deck = decks.find((d) => d.id === newDeckId);
    const commanderName = deck?.commander ?? '';
    const partnerName = deck?.partner ?? '';
    const ownerPlayerId = deck?.player_id ?? '';
    const ownerAlreadyPlaying = excludePlayerIds.includes(ownerPlayerId);
    const resolvedPlayerId = playerId === '' && !ownerAlreadyPlaying ? ownerPlayerId : playerId;
    setDeckId(newDeckId);
    setPlayerId(resolvedPlayerId);
    setCommander({ name: commanderName, artCropUrl: undefined, options: [], loading: false });
    setHasPartner(!!partnerName);
    setPartner({ name: partnerName, artCropUrl: undefined, options: [], loading: false });
    if (commanderName) fetchArt('commander', commanderName);
    if (partnerName) fetchArt('partner', partnerName);
  }

  function handleConfirm() {
    if (!playerId) { setError('Pick a player.'); return; }
    if (!deckId) { setError('Pick a deck.'); return; }
    if (!commander.name) { setError('Commander is required.'); return; }
    if (hasPartner && !partner.name) { setError('Partner commander is required (or uncheck Partner).'); return; }
    const player = players.find((p) => p.id === playerId);
    const deck = decks.find((d) => d.id === deckId);
    const setup: PlayerSetup = {
      playerId,
      deckId,
      playerName: player?.name ?? 'Player',
      deckName: deck?.name ?? '',
      commander: { name: commander.name, artCropUrl: commander.artCropUrl },
    };
    if (hasPartner && partner.name) {
      setup.partner = { name: partner.name, artCropUrl: partner.artCropUrl };
    }
    onConfirm(setup);
  }

  const playerDecks = playerId ? decks.filter((d) => d.player_id === playerId) : [];
  const otherDecks = playerId ? decks.filter((d) => d.player_id !== playerId) : decks;

  function renderCommanderField(field: 'commander' | 'partner', label: string) {
    const cmdState = field === 'commander' ? commander : partner;
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Autocomplete
          freeSolo
          options={cmdState.options}
          loading={cmdState.loading}
          inputValue={cmdState.name}
          onInputChange={(_, value) => handleCommanderInput(field, value)}
          onChange={(_, value) => handleCommanderSelect(field, value)}
          renderInput={(params) => <TextField {...params} label={label} size="small" fullWidth />}
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
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        Choose Player & Deck
        <Typography variant="caption" component="div" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
          {seatLabel}
        </Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            select
            label="Deck"
            value={deckId}
            onChange={(e) => handleDeckChange(e.target.value)}
            size="small"
            fullWidth
          >
            <MenuItem value="">Select a deck</MenuItem>
            {playerDecks.length > 0 && <ListSubheader>Player's Decks</ListSubheader>}
            {playerDecks.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {d.card_count > 0 && <StyleIcon sx={{ fontSize: 14, opacity: 0.6 }} />}
                  {d.name} ({d.commander})
                </Box>
              </MenuItem>
            ))}
            {playerDecks.length > 0 && otherDecks.length > 0 && <ListSubheader>Other Decks</ListSubheader>}
            {otherDecks.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {d.card_count > 0 && <StyleIcon sx={{ fontSize: 14, opacity: 0.6 }} />}
                  {d.name} ({d.player_name}) ({d.commander})
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Player"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            size="small"
            fullWidth
          >
            <MenuItem value="">Select a player</MenuItem>
            {players.map((p) => (
              <MenuItem key={p.id} value={p.id} disabled={excludePlayerIds.includes(p.id) && p.id !== initial?.playerId}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          {renderCommanderField('commander', 'Commander')}

          {deckId && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BracketChip deckId={deckId} commander={commander.name || undefined} />
            </Box>
          )}

          <FormControlLabel
            control={<Checkbox checked={hasPartner} onChange={(e) => setHasPartner(e.target.checked)} size="small" />}
            label="Partner Commander?"
          />

          {hasPartner && renderCommanderField('partner', 'Partner Commander')}

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm}>
          Save Seat
        </Button>
      </DialogActions>
    </Dialog>
  );
}
