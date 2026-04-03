'use client';

/**
 * CardGridEditor — shared card-list editing component.
 *
 * Renders a two-tab interface (Cards grid | Breakdown) with per-card
 * actions (quantity ±, proxy, commander, rename/re-lookup, remove),
 * DFC flip, and Add / Edit Card dialogs backed by Scryfall autocomplete.
 *
 * The parent owns the card state array; this component is fully controlled.
 */

import { useState, useId, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlipIcon from '@mui/icons-material/SyncAlt';
import StarIcon from '@mui/icons-material/Star';

import { DeckBreakdown } from '@/components/DeckBreakdown';
import { DeckFilters, EMPTY_FILTERS, hasActiveFilters, matchesFilters, sortCards } from '@/components/DeckFilters';
import type { DeckFilterState } from '@/components/DeckFilters';
import { api } from '@/lib/api';
import { scryfallAutocomplete } from '@/lib/scryfall';

// ── Public type ───────────────────────────────────────────────────────────────

export interface EditableCard {
  _key: string;
  card_name: string;
  scryfall_id: string | null;
  image_uri: string | null;
  back_image_uri: string | null;
  type_line: string | null;
  mana_cost: string | null;
  color_identity: string;
  quantity: number;
  is_commander: boolean;
  is_proxy: boolean;
  /** Scan page sets this when Scryfall lookup fails */
  notFound?: boolean;
}

/** Generate a stable key for a newly created EditableCard */
export function newEditableKey(): string {
  return Math.random().toString(36).slice(2);
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface CardGridEditorProps {
  cards: EditableCard[];
  onChange: (cards: EditableCard[]) => void;
  /** Extra controls rendered to the right of the toolbar (e.g. Scan More, Import/Export) */
  toolbarExtra?: React.ReactNode;
  /** Show a loading indicator below the toolbar */
  loading?: boolean;
  loadingLabel?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CardGridEditor({
  cards,
  onChange,
  toolbarExtra,
  loading,
  loadingLabel = 'Loading…',
}: CardGridEditorProps) {
  const uid = useId();

  const [editTab, setEditTab] = useState(0);
  const [flippedKeys, setFlippedKeys] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<DeckFilterState>(EMPTY_FILTERS);

  const filteredCards = useMemo(
    () => sortCards(hasActiveFilters(filters) ? cards.filter(c => matchesFilters(c, filters)) : cards, filters.sortOrder, filters.sortDirection),
    [cards, filters]
  );

  // Add card dialog
  const [addOpen, setAddOpen]           = useState(false);
  const [addName, setAddName]           = useState('');
  const [addSuggestions, setAddSuggestions] = useState<string[]>([]);
  const [addLooking, setAddLooking]     = useState(false);

  // Edit card dialog
  const [editCard, setEditCard]         = useState<EditableCard | null>(null);
  const [editName, setEditName]         = useState('');
  const [editSuggestions, setEditSuggestions] = useState<string[]>([]);
  const [editLooking, setEditLooking]   = useState(false);

  // ── Mutations ───────────────────────────────────────────────────────────────

  const changeQuantity = (key: string, delta: number) =>
    onChange(cards.map(c =>
      c._key === key ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c
    ));

  const toggleCommander = (key: string) =>
    onChange(cards.map(c =>
      c._key === key ? { ...c, is_commander: !c.is_commander } : c
    ));

  const toggleProxy = (key: string) =>
    onChange(cards.map(c =>
      c._key === key ? { ...c, is_proxy: !c.is_proxy } : c
    ));

  const removeCard = (key: string) =>
    onChange(cards.filter(c => c._key !== key));

  const toggleFlip = (key: string) =>
    setFlippedKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  // ── Add card dialog ─────────────────────────────────────────────────────────

  const handleAddNameChange = async (value: string) => {
    setAddName(value);
    if (value.length >= 2) {
      const sug = await scryfallAutocomplete(value);
      setAddSuggestions(sug.slice(0, 6));
    } else {
      setAddSuggestions([]);
    }
  };

  const confirmAdd = async (nameOverride?: string) => {
    const name = (nameOverride ?? addName).trim();
    if (!name) return;
    setAddLooking(true);
    try {
      const data = await api.lookupCard(name);
      const existing = cards.findIndex(
        c => c.card_name.toLowerCase() === (data?.name ?? name).toLowerCase()
      );
      if (existing >= 0) {
        onChange(cards.map((c, i) => i === existing ? { ...c, quantity: c.quantity + 1 } : c));
      } else {
        const newCard: EditableCard = {
          _key:           newEditableKey(),
          card_name:      data?.name         ?? name,
          scryfall_id:    data?.scryfall_id  ?? null,
          image_uri:      data?.image_uri    ?? null,
          back_image_uri: data?.back_image_uri ?? null,
          type_line:      data?.type_line    ?? null,
          mana_cost:      data?.mana_cost    ?? null,
          color_identity: data?.color_identity ?? '',
          quantity:       1,
          is_commander:   false,
          is_proxy:       false,
          notFound:       !data,
        };
        onChange([...cards, newCard]);
      }
    } finally {
      setAddLooking(false);
      setAddOpen(false);
      setAddName('');
      setAddSuggestions([]);
    }
  };

  // ── Edit card dialog ────────────────────────────────────────────────────────

  const openEditCard = (card: EditableCard) => {
    setEditCard(card);
    setEditName(card.card_name);
    setEditSuggestions([]);
  };

  const handleEditNameChange = async (value: string) => {
    setEditName(value);
    if (value.length >= 2) {
      const sug = await scryfallAutocomplete(value);
      setEditSuggestions(sug.slice(0, 6));
    } else {
      setEditSuggestions([]);
    }
  };

  const confirmEditCard = async (nameOverride?: string) => {
    if (!editCard) return;
    const name = (nameOverride ?? editName).trim();
    setEditLooking(true);
    try {
      const data = await api.lookupCard(name);
      onChange(cards.map(c =>
        c._key === editCard._key
          ? {
              ...c,
              card_name:      data?.name         ?? name,
              scryfall_id:    data?.scryfall_id  ?? null,
              image_uri:      data?.image_uri    ?? null,
              back_image_uri: data?.back_image_uri ?? null,
              type_line:      data?.type_line    ?? null,
              mana_cost:      data?.mana_cost    ?? null,
              color_identity: data?.color_identity ?? '',
              notFound:       !data,
            }
          : c
      ));
    } finally {
      setEditLooking(false);
      setEditCard(null);
      setEditName('');
      setEditSuggestions([]);
    }
  };

  // ── Derived ─────────────────────────────────────────────────────────────────

  const commanderCard   = cards.find(c => c.is_commander);
  const commanderCount  = cards.filter(c => c.is_commander).length;
  const proxyCount      = cards.filter(c => c.is_proxy).reduce((s, c) => s + c.quantity, 0);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Tabs value={editTab} onChange={(_, v) => setEditTab(v)} sx={{ mb: 2 }}>
        <Tab label="Cards" />
        <Tab label="Breakdown" />
      </Tabs>

      {editTab === 0 && (
        <>
          {/* Toolbar */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
              <Chip label={`${cards.reduce((s, c) => s + c.quantity, 0)} cards`} size="small" />
              {commanderCount > 0 && (
                <Chip
                  icon={<StarIcon />}
                  label={`Commander: ${commanderCard?.card_name}`}
                  color="warning"
                  size="small"
                />
              )}
              {proxyCount > 0 && (
                <Chip label={`${proxyCount} proxies`} color="default" size="small" variant="outlined" />
              )}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
              {toolbarExtra}
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setAddOpen(true)}
              >
                Add Card
              </Button>
            </Stack>
          </Stack>

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <CircularProgress size={14} />
              <Typography variant="caption" color="text.secondary">{loadingLabel}</Typography>
            </Stack>
          )}

          <DeckFilters
            filters={filters}
            onChange={setFilters}
            cards={cards}
            resultCount={filteredCards.reduce((s, c) => s + c.quantity, 0)}
            totalCount={cards.reduce((s, c) => s + c.quantity, 0)}
          />

          {/* Card grid */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {filteredCards.map(card => (
              <Grid key={`${uid}-${card._key}`} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <Card
                  sx={{
                    height: '100%',
                    opacity: card.notFound ? 0.7 : 1,
                    outline: card.is_commander
                      ? '2px solid'
                      : card.is_proxy
                        ? '2px dashed'
                        : undefined,
                    outlineColor: card.is_commander ? 'warning.main' : 'error.main',
                  }}
                >
                  {card.image_uri ? (
                    <Box sx={{ position: 'relative', aspectRatio: '488/680', perspective: '600px' }}>
                      <Box sx={{
                        width: '100%', height: '100%', position: 'relative',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.5s ease',
                        transform: flippedKeys.has(card._key) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}>
                        <Box component="img" src={card.image_uri} alt={card.card_name}
                          sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', backfaceVisibility: 'hidden' }} />
                        {card.back_image_uri && (
                          <Box component="img" src={card.back_image_uri} alt={`${card.card_name} (back)`}
                            sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} />
                        )}
                      </Box>
                      {card.back_image_uri && (
                        <Box
                          onClick={() => toggleFlip(card._key)}
                          sx={{
                            position: 'absolute', inset: 0, zIndex: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0, transition: 'opacity 0.2s',
                            '&:hover': { opacity: 1 },
                            cursor: 'pointer',
                          }}
                        >
                          <Box sx={{
                            bgcolor: 'rgba(0,0,0,0.45)', borderRadius: '50%',
                            width: 44, height: 44,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <FlipIcon sx={{ fontSize: 26, color: '#fff' }} />
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{
                      aspectRatio: '488/680', bgcolor: 'action.hover',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1,
                    }}>
                      <Typography variant="caption" textAlign="center" color="text.secondary">
                        {card.card_name}
                      </Typography>
                    </Box>
                  )}

                  <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="caption" noWrap display="block" title={card.card_name}>
                      {card.card_name}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.5}>
                      {/* Quantity */}
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconButton size="small" onClick={() => changeQuantity(card._key, -1)}>
                          <Typography variant="caption" lineHeight={1}>−</Typography>
                        </IconButton>
                        <Typography variant="caption">{card.quantity}</Typography>
                        <IconButton size="small" onClick={() => changeQuantity(card._key, 1)}>
                          <Typography variant="caption" lineHeight={1}>+</Typography>
                        </IconButton>
                      </Stack>
                      {/* Action buttons */}
                      <Stack direction="row">
                        <Tooltip title={card.is_proxy ? 'Mark as real' : 'Mark as proxy'}>
                          <IconButton
                            size="small"
                            onClick={() => toggleProxy(card._key)}
                            color={card.is_proxy ? 'error' : 'default'}
                          >
                            <ContentCopyIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={card.is_commander ? 'Remove commander' : 'Mark as commander'}>
                          <IconButton
                            size="small"
                            onClick={() => toggleCommander(card._key)}
                            color={card.is_commander ? 'warning' : 'default'}
                          >
                            <StarIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit / re-lookup">
                          <IconButton size="small" onClick={() => openEditCard(card)}>
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove">
                          <IconButton size="small" color="error" onClick={() => removeCard(card._key)}>
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {editTab === 1 && (
        <DeckBreakdown cards={cards} showList sortOrder={filters.sortOrder} sortDirection={filters.sortDirection} />
      )}

      {/* ── Add Card Dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={addOpen}
        onClose={() => { setAddOpen(false); setAddName(''); setAddSuggestions([]); }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Card</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Card name"
            fullWidth
            size="small"
            value={addName}
            onChange={e => handleAddNameChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') confirmAdd(); }}
            sx={{ mt: 1 }}
          />
          {addSuggestions.length > 0 && (
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {addSuggestions.map(s => (
                <Box
                  key={s}
                  onClick={() => { setAddName(s); setAddSuggestions([]); confirmAdd(s); }}
                  sx={{ px: 1.5, py: 0.75, borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <Typography variant="body2">{s}</Typography>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAddOpen(false); setAddName(''); setAddSuggestions([]); }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!addName.trim() || addLooking}
            onClick={() => confirmAdd()}
            startIcon={addLooking ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Card Dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={!!editCard}
        onClose={() => { setEditCard(null); setEditName(''); setEditSuggestions([]); }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Card</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Card name"
            fullWidth
            size="small"
            value={editName}
            onChange={e => handleEditNameChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') confirmEditCard(); }}
            sx={{ mt: 1 }}
          />
          {editSuggestions.length > 0 && (
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {editSuggestions.map(s => (
                <Box
                  key={s}
                  onClick={() => { setEditName(s); setEditSuggestions([]); confirmEditCard(s); }}
                  sx={{ px: 1.5, py: 0.75, borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <Typography variant="body2">{s}</Typography>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditCard(null); setEditName(''); setEditSuggestions([]); }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!editName.trim() || editLooking}
            onClick={() => confirmEditCard()}
            startIcon={editLooking ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
