'use client';

import { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '@/lib/api';
import { scryfallAutocomplete } from '@/lib/scryfall';
import type { ScannedCard, ScryfallCachedCard } from '@/lib/types';

function tempId() {
  return Math.random().toString(36).slice(2);
}

function cardFromScryfall(name: string, data: ScryfallCachedCard | null): ScannedCard {
  return {
    id: tempId(),
    card_name: data?.name ?? name,
    scryfall_id: data?.scryfall_id ?? null,
    image_uri: data?.image_uri ?? null,
    back_image_uri: data?.back_image_uri ?? null,
    color_identity: data?.color_identity ?? '',
    type_line: data?.type_line ?? null,
    mana_cost: data?.mana_cost ?? null,
    quantity: 1,
    is_commander: false,
    is_proxy: false,
    notFound: !data,
  };
}

interface CardEditDialogProps {
  card: ScannedCard | null;
  onClose: () => void;
  onUpdate: (cardId: string, updated: ScannedCard) => void;
}

export function CardEditDialog({ card, onClose, onUpdate }: CardEditDialogProps) {
  const [name, setName] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [looking, setLooking] = useState(false);

  // Reset state when card changes
  const [prevCardId, setPrevCardId] = useState<string | null>(null);
  if (card && card.id !== prevCardId) {
    setPrevCardId(card.id);
    setName(card.card_name);
    setSuggestions([]);
  }

  async function handleNameChange(value: string) {
    setName(value);
    if (value.length >= 2) {
      const results = await scryfallAutocomplete(value);
      setSuggestions(results.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }

  async function confirmEdit(nameOverride?: string) {
    if (!card) return;
    const finalName = nameOverride ?? name;
    setLooking(true);
    try {
      const data = await api.lookupCard(finalName);
      const updated = cardFromScryfall(finalName, data);
      updated.id = card.id;
      updated.quantity = card.quantity;
      updated.is_commander = card.is_commander;
      onUpdate(card.id, updated);
    } finally {
      setLooking(false);
      onClose();
    }
  }

  return (
    <Dialog open={!!card} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Edit Card
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Card Name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          sx={{ mt: 1 }}
        />
        {suggestions.length > 0 && (
          <Stack spacing={0.5} mt={1}>
            {suggestions.map((s) => (
              <Button
                key={s}
                variant="text"
                size="small"
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                onClick={() => confirmEdit(s)}
              >
                {s}
              </Button>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={looking || !name.trim()}
          onClick={() => confirmEdit()}
        >
          {looking ? <CircularProgress size={18} /> : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
