'use client';

import { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Slider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StarIcon from '@mui/icons-material/Star';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { PageContainer } from '@/components/PageContainer';
import { ManaSymbol } from '@/components/ManaSymbol';
import { api } from '@/lib/api';
import { MTG_COLORS_WITH_C } from '@/lib/utils';
import { scryfallAutocomplete } from '@/lib/scryfall';
import type { ScryfallCachedCard, Player } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScannedCard {
  id: string;               // local temp id
  card_name: string;
  scryfall_id: string | null;
  image_uri: string | null;
  color_identity: string;
  quantity: number;
  is_commander: boolean;
  is_proxy: boolean;
  notFound: boolean;        // true if Scryfall returned no match
}

// ─── Draft persistence ─────────────────────────────────────────────────────────

const DRAFT_KEY = 'cc:scan-draft';

interface ScanDraft {
  step: number;
  cards: ScannedCard[];
  deckName: string;
  playerId: number | '';
  colors: string[];
}

function readDraft(): Partial<ScanDraft> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null') ?? {}; }
  catch { return {}; }
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = ['Capture Photo', 'Review Cards', 'Save Deck'];

// ─── Constants ────────────────────────────────────────────────────────────────

const BASIC_LANDS = new Set([
  'Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes',
  'Snow-Covered Plains', 'Snow-Covered Island', 'Snow-Covered Swamp',
  'Snow-Covered Mountain', 'Snow-Covered Forest',
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tempId() {
  return Math.random().toString(36).slice(2);
}

function cardFromScryfall(name: string, data: ScryfallCachedCard | null, proxy = false): ScannedCard {
  return {
    id: tempId(),
    card_name: data?.name ?? name,
    scryfall_id: data?.scryfall_id ?? null,
    image_uri: data?.image_uri ?? null,
    color_identity: data?.color_identity ?? '',
    quantity: 1,
    is_commander: false,
    is_proxy: proxy,
    notFound: !data,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

function ScanDeckPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editDeckId = Number(searchParams.get('edit')) || null;
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // In edit mode ignore any persisted draft; start fresh from the deck's saved cards
  const draft = editDeckId ? {} : readDraft();

  const [step, setStep]     = useState<number>(draft.step ?? 0);
  const [cards, setCards]   = useState<ScannedCard[]>(draft.cards ?? []);
  const [deckName, setDeckName] = useState(draft.deckName ?? '');
  const [playerId, setPlayerId] = useState<number | ''>(draft.playerId ?? '');
  const [colors, setColors] = useState<string[]>(draft.colors ?? []);

  // Edit-mode: loading existing deck cards
  const [editLoading, setEditLoading] = useState(!!editDeckId);
  const [importing, setImporting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [scanning, setScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Step 2
  const [lookingUp, setLookingUp] = useState(false);

  // Edit dialog
  const [editCard, setEditCard] = useState<ScannedCard | null>(null);
  const [editName, setEditName] = useState('');
  const [editSuggestions, setEditSuggestions] = useState<string[]>([]);
  const [editLooking, setEditLooking] = useState(false);

  // Add card dialog
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addSuggestions, setAddSuggestions] = useState<string[]>([]);
  const [addLooking, setAddLooking] = useState(false);

  // Step 3
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersLoaded, setPlayersLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  // Pre-scan image editor
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [editRotation, setEditRotation] = useState(0);
  const [editBrightness, setEditBrightness] = useState(100);
  const [editContrast, setEditContrast] = useState(100);

  // Discard confirmation
  const [discardOpen, setDiscardOpen] = useState(false);

  // Scan more dialog
  const [scanMoreOpen, setScanMoreOpen] = useState(false);

  // ── Load existing deck in edit mode ────────────────────────────────────────

  useEffect(() => {
    if (!editDeckId) return;
    (async () => {
      try {
        const [deck, deckCards] = await Promise.all([
          api.getDeck(editDeckId),
          api.getDeckCards(editDeckId),
        ]);
        setDeckName(deck.name);
        setColors(deck.colors ? deck.colors.split('') : []);
        setPlayerId(deck.player_id);
        setCards(
          deckCards.map((c) => ({
            id: tempId(),
            card_name: c.card_name,
            scryfall_id: c.scryfall_id,
            image_uri: c.image_uri ?? null,
            color_identity: c.color_identity ?? '',
            quantity: c.quantity,
            is_commander: !!c.is_commander,
            is_proxy: !!c.is_proxy,
            notFound: !c.scryfall_id,
          }))
        );
        setStep(1);
      } catch {
        setError('Failed to load deck cards');
      } finally {
        setEditLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editDeckId]);

  // ── Persist draft to localStorage (new decks only) ─────────────────────────

  useEffect(() => {
    if (editDeckId) return; // don't clobber draft with edit-mode state
    if (step === 0 && cards.length === 0) return;
    try {
      const draft: ScanDraft = { step, cards, deckName, playerId, colors };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch { /* quota exceeded, ignore */ }
  }, [editDeckId, step, cards, deckName, playerId, colors]);

  // ── Discard ────────────────────────────────────────────────────────────────

  function exportTCGPlayer() {
    const lines = cards.map((c) => `${c.quantity} ${c.card_name}`);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deckName.trim().replace(/[^a-z0-9]/gi, '_') || 'decklist'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (importInputRef.current) importInputRef.current.value = '';
    if (!file) return;

    const text = await file.text();

    // Parse "quantity cardname" lines; skip blanks and comment lines
    const parsed: { name: string; qty: number }[] = [];
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('//')) continue;
      const m = line.match(/^(\d+)[x\s]+(.+)$/i);
      if (!m) continue;
      parsed.push({ qty: parseInt(m[1], 10), name: m[2].trim() });
    }
    if (parsed.length === 0) return;

    setImporting(true);
    try {
      // Snapshot current card names for dedup logic
      const currentNames = new Map(cards.map((c) => [c.card_name.toLowerCase(), c.id]));

      const basicMerges: { id: string; qty: number }[] = [];
      const toAdd: { name: string; qty: number }[] = [];

      for (const { name, qty } of parsed) {
        const key = name.toLowerCase();
        const existingId = currentNames.get(key);
        const isBasic = [...BASIC_LANDS].some((b) => b.toLowerCase() === key);

        if (existingId) {
          if (isBasic) basicMerges.push({ id: existingId, qty });
          // non-basic duplicate: skip
        } else {
          toAdd.push({ name, qty });
        }
      }

      // Apply basic land quantity merges immediately
      if (basicMerges.length > 0) {
        setCards((prev) =>
          prev.map((c) => {
            const merge = basicMerges.find((m) => m.id === c.id);
            return merge ? { ...c, quantity: c.quantity + merge.qty } : c;
          })
        );
      }

      // Bulk-lookup new cards then retry not-founds with fuzzy
      if (toAdd.length > 0) {
        const { results } = await api.bulkLookupCards(toAdd.map((e) => e.name));
        const added: ScannedCard[] = results.map((r, i) => {
          const data = 'error' in r ? null : (r as ScryfallCachedCard);
          const card = cardFromScryfall(toAdd[i].name, data);
          card.quantity = toAdd[i].qty;
          return card;
        });

        const notFound = added.filter((c) => c.notFound);
        if (notFound.length > 0) {
          const retries = await Promise.all(
            notFound.map(async (c) => {
              const data = await api.lookupCard(c.card_name);
              return data ? { id: c.id, data } : null;
            })
          );
          for (const hit of retries.filter((r): r is { id: string; data: ScryfallCachedCard } => r !== null)) {
            const card = added.find((c) => c.id === hit.id);
            if (card) {
              card.card_name = hit.data.name ?? card.card_name;
              card.scryfall_id = hit.data.scryfall_id;
              card.image_uri = hit.data.image_uri ?? null;
              card.color_identity = hit.data.color_identity ?? '';
              card.notFound = false;
            }
          }
        }

        setCards((prev) => [...prev, ...added]);
      }
    } finally {
      setImporting(false);
    }
  }

  function discardDraft() {
    clearDraft();
    setStep(0);
    setCards([]);
    setDeckName('');
    setPlayerId('');
    setColors([]);
    setPreviewUrl(null);
    setError(null);
    setDiscardOpen(false);
  }

  // ── File / Camera input ────────────────────────────────────────────────────

  // Open the pre-scan editor instead of scanning immediately
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
    setEditRotation(0);
    setEditBrightness(100);
    setEditContrast(100);
    setPendingFile(file);
    // Reset inputs so the same file can be re-selected
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (uploadInputRef.current) uploadInputRef.current.value = '';
  }, []);

  // Apply rotation + brightness/contrast to a canvas and return base64 JPEG
  async function fileToBase64(
    file: File,
    rotation: number,
    brightness: number,
    contrast: number,
  ): Promise<{ base64: string; mimeType: string }> {
    const MAX_PX = 3000;

    const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
      file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');

    try {
      const bitmap = await createImageBitmap(file);
      const origW = bitmap.width;
      const origH = bitmap.height;

      // Scale the source so the longest side fits MAX_PX
      let sw = origW, sh = origH;
      if (Math.max(sw, sh) > MAX_PX) {
        const scale = MAX_PX / Math.max(sw, sh);
        sw = Math.round(sw * scale);
        sh = Math.round(sh * scale);
      }

      // Output canvas dimensions swap when rotating 90° or 270°
      const swapped = rotation === 90 || rotation === 270;
      const outW = swapped ? sh : sw;
      const outH = swapped ? sw : sh;

      const canvas = document.createElement('canvas');
      canvas.width  = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d')!;

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.translate(outW / 2, outH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(bitmap, -sw / 2, -sh / 2, sw, sh);
      bitmap.close();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      return { base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' };
    } catch (err) {
      if (isHeic) {
        throw new Error(
          'Could not convert HEIC. Open the photo in Preview → Export as JPEG, then upload that.'
        );
      }
      throw new Error('Could not process image: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  // Called when user confirms the pre-scan editor and clicks Scan
  async function processAndScan() {
    if (!pendingFile) return;
    setPendingFile(null);
    setScanMoreOpen(false);
    setScanning(true);

    try {
      const { base64, mimeType } = await fileToBase64(pendingFile, editRotation, editBrightness, editContrast);
      const result = await api.scanDeck(base64, mimeType);
      await lookupAllCards(result.cards);
      setStep(1);
    } catch (err) {
      console.error('[Scan error]', err);
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setScanning(false);
    }
  }

  // ── Scryfall lookups ──────────────────────────────────────────────────────

  async function lookupAllCards(items: { name: string; proxy: boolean }[]) {
    setLookingUp(true);
    try {
      const names = items.map((i) => i.name);
      const { results } = await api.bulkLookupCards(names);
      const scanned: ScannedCard[] = results.map((r, i) =>
        cardFromScryfall(
          items[i]?.name ?? r.name ?? '',
          'error' in r ? null : (r as ScryfallCachedCard),
          items[i]?.proxy ?? false,
        )
      );
      setCards((prev) => [...prev, ...scanned]);

      // Retry not-found cards individually with fuzzy matching
      const notFound = scanned.filter((c) => c.notFound);
      if (notFound.length > 0) {
        const retries = await Promise.all(
          notFound.map(async (c) => {
            const data = await api.lookupCard(c.card_name);
            if (!data) return null;
            return { id: c.id, data };
          })
        );
        const hits = retries.filter((r): r is { id: string; data: ScryfallCachedCard } => r !== null);
        if (hits.length > 0) {
          setCards((prev) =>
            prev.map((c) => {
              const hit = hits.find((h) => h.id === c.id);
              if (!hit) return c;
              return {
                ...c,
                card_name: hit.data.name ?? c.card_name,
                scryfall_id: hit.data.scryfall_id,
                image_uri: hit.data.image_uri ?? null,
                color_identity: hit.data.color_identity ?? '',
                notFound: false,
              };
            })
          );
        }
      }
    } finally {
      setLookingUp(false);
    }
  }

  // ── Card editing ──────────────────────────────────────────────────────────

  function openEdit(card: ScannedCard) {
    setEditCard(card);
    setEditName(card.card_name);
    setEditSuggestions([]);
  }

  async function handleEditNameChange(value: string) {
    setEditName(value);
    if (value.length >= 2) {
      const suggestions = await scryfallAutocomplete(value);
      setEditSuggestions(suggestions.slice(0, 6));
    } else {
      setEditSuggestions([]);
    }
  }

  async function confirmEdit(nameOverride?: string) {
    if (!editCard) return;
    const name = nameOverride ?? editName;
    setEditLooking(true);
    try {
      const data = await api.lookupCard(name);
      const updated = cardFromScryfall(name, data);
      updated.id = editCard.id;
      updated.quantity = editCard.quantity;
      updated.is_commander = editCard.is_commander;
      setCards((prev) => prev.map((c) => (c.id === editCard.id ? updated : c)));
    } finally {
      setEditLooking(false);
      setEditCard(null);
    }
  }

  function removeCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function toggleCommander(id: string) {
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        is_commander: c.id === id ? !c.is_commander : c.is_commander,
      }))
    );
  }

  function toggleProxy(id: string) {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_proxy: !c.is_proxy } : c))
    );
  }

  function changeQuantity(id: string, delta: number) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c
      )
    );
  }

  // ── Add card ──────────────────────────────────────────────────────────────

  async function handleAddNameChange(value: string) {
    setAddName(value);
    if (value.length >= 2) {
      const suggestions = await scryfallAutocomplete(value);
      setAddSuggestions(suggestions.slice(0, 6));
    } else {
      setAddSuggestions([]);
    }
  }

  async function confirmAdd(nameOverride?: string) {
    const name = nameOverride ?? addName;
    if (!name.trim()) return;
    setAddLooking(true);
    try {
      const data = await api.lookupCard(name);
      const card = cardFromScryfall(name, data);
      setCards((prev) => [...prev, card]);
    } finally {
      setAddLooking(false);
      setAddOpen(false);
      setAddName('');
      setAddSuggestions([]);
    }
  }

  // ── Step 3: save ──────────────────────────────────────────────────────────

  async function loadPlayers() {
    if (playersLoaded) return;
    const data = await api.getPlayers();
    setPlayers(data);
    setPlayersLoaded(true);

    // Auto-detect colors from commander's color_identity
    const commander = cards.find((c) => c.is_commander);
    if (commander?.color_identity) {
      setColors(commander.color_identity.split(''));
    }
  }

  function handleColorClick(color: string) {
    const active = colors.includes(color);
    if (color === 'C') {
      setColors(active ? [] : ['C']);
    } else {
      const current = colors.filter((c) => c !== 'C');
      setColors(active ? current.filter((c) => c !== color) : [...current, color]);
    }
  }

  async function handleSave() {
    const commanderCard = cards.find((c) => c.is_commander);

    if (editDeckId) {
      // Edit mode: only update the card list
      if (!commanderCard) {
        setError('Please mark one card as the commander');
        return;
      }
      setSaving(true);
      setError(null);
      try {
        await api.saveDeckCards(editDeckId, cards.map((c) => ({
          card_name: c.card_name,
          scryfall_id: c.scryfall_id,
          quantity: c.quantity,
          is_commander: c.is_commander,
          is_proxy: c.is_proxy,
        })));
        router.push(`/decks/detail?id=${editDeckId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save cards');
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!playerId || !deckName.trim()) {
      setError('Please fill in player and deck name');
      return;
    }

    if (!commanderCard) {
      setError('Please mark one card as the commander');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const deck = await api.createDeck({
        player_id: playerId as number,
        name: deckName.trim(),
        commander: commanderCard.card_name,
        colors: colors.length > 0 ? colors.join('') : 'C',
      });

      await api.saveDeckCards(deck.id, cards.map((c) => ({
        card_name: c.card_name,
        scryfall_id: c.scryfall_id,
        quantity: c.quantity,
        is_commander: c.is_commander,
        is_proxy: c.is_proxy,
      })));

      clearDraft();
      router.push(`/decks/detail?id=${deck.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save deck');
    } finally {
      setSaving(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const notFoundCount = cards.filter((c) => c.notFound).length;
  const proxyCount    = cards.filter((c) => c.is_proxy).length;
  const commanderCount = cards.filter((c) => c.is_commander).length;

  if (editLoading) {
    return (
      <PageContainer title="Edit Cards" backHref={`/decks/detail?id=${editDeckId}`} backLabel="Back to Deck">
        <Stack alignItems="center" spacing={2} py={8}>
          <CircularProgress size={48} />
          <Typography>Loading deck cards...</Typography>
        </Stack>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={editDeckId ? 'Edit Cards' : 'Scan Deck'}
      backHref={editDeckId ? `/decks/detail?id=${editDeckId}` : '/decks'}
      backLabel={editDeckId ? 'Back to Deck' : 'Back to Decks'}
    >
      {!editDeckId && (
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ── Step 0: Capture ── */}
      {step === 0 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            {scanning ? (
              <Stack alignItems="center" spacing={2} py={4}>
                <CircularProgress size={48} />
                <Typography>Scanning photo with Claude Vision...</Typography>
                {previewUrl && (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Deck photo"
                    sx={{ maxWidth: 320, maxHeight: 240, borderRadius: 1, objectFit: 'contain' }}
                  />
                )}
              </Stack>
            ) : (
              <Stack alignItems="center" spacing={3} py={4}>
                <CameraAltIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                <Typography variant="h6">Photograph your deck layout</Typography>
                <Typography color="text.secondary" textAlign="center" maxWidth={480}>
                  Lay your cards face-up in rows and take a clear photo. Claude will read the card
                  names and look them up on Scryfall.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CameraAltIcon />}
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    Take Photo
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<UploadFileIcon />}
                    onClick={() => uploadInputRef.current?.click()}
                  >
                    Upload Image
                  </Button>
                </Stack>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <input
                  ref={importInputRef}
                  type="file"
                  accept=".txt,text/plain"
                  style={{ display: 'none' }}
                  onChange={handleImportFile}
                />
              </Stack>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 1: Review ── */}
      {step === 1 && (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
              <Chip label={`${cards.length} cards`} />
              {proxyCount > 0 && (
                <Chip label={`${proxyCount} proxies`} color="warning" size="small" />
              )}
              {notFoundCount > 0 && (
                <Chip label={`${notFoundCount} not found`} color="error" size="small" />
              )}
              {commanderCount === 0 && (
                <Chip label="No commander marked" color="error" size="small" />
              )}
              {commanderCount > 0 && (
                <Chip
                  label={`Commander: ${cards.find((c) => c.is_commander)?.card_name}`}
                  color="success"
                  size="small"
                  icon={<StarIcon />}
                />
              )}
            </Stack>
            <Stack direction="row" spacing={1}>
              {editDeckId && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FileUploadIcon />}
                    onClick={() => importInputRef.current?.click()}
                    disabled={importing}
                  >
                    {importing ? 'Importing…' : 'Import'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={exportTCGPlayer}
                    disabled={cards.length === 0}
                  >
                    Export
                  </Button>
                </>
              )}
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setAddOpen(true)}
              >
                Add Card
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CameraAltIcon />}
                onClick={() => setScanMoreOpen(true)}
              >
                Scan More
              </Button>
            </Stack>
          </Stack>

          {(lookingUp || importing) && (
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">
                {importing ? 'Importing cards from file…' : 'Looking up cards on Scryfall...'}
              </Typography>
            </Stack>
          )}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards.map((card) => (
              <Grid key={card.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <Card
                  sx={{
                    height: '100%',
                    outline: card.is_commander ? '2px solid' : card.is_proxy ? '2px dashed' : undefined,
                    outlineColor: card.is_commander ? 'warning.main' : card.is_proxy ? 'error.main' : undefined,
                    opacity: card.notFound ? 0.7 : 1,
                  }}
                >
                  {card.image_uri ? (
                    <CardMedia
                      component="img"
                      image={card.image_uri}
                      alt={card.card_name}
                      sx={{ aspectRatio: '488/680' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        aspectRatio: '488/680',
                        bgcolor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1,
                      }}
                    >
                      <Typography variant="caption" textAlign="center" color="text.secondary">
                        {card.notFound ? 'Not found' : card.card_name}
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
                        <IconButton size="small" onClick={() => changeQuantity(card.id, -1)}>
                          <Typography variant="caption" lineHeight={1}>−</Typography>
                        </IconButton>
                        <Typography variant="caption">{card.quantity}</Typography>
                        <IconButton size="small" onClick={() => changeQuantity(card.id, 1)}>
                          <Typography variant="caption" lineHeight={1}>+</Typography>
                        </IconButton>
                      </Stack>
                      {/* Actions */}
                      <Stack direction="row">
                        <IconButton
                          size="small"
                          title={card.is_proxy ? 'Mark as real' : 'Mark as proxy'}
                          onClick={() => toggleProxy(card.id)}
                          color={card.is_proxy ? 'error' : 'default'}
                        >
                          <ContentCopyIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          size="small"
                          title="Mark as commander"
                          onClick={() => toggleCommander(card.id)}
                          color={card.is_commander ? 'warning' : 'default'}
                        >
                          <StarIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="small" title="Edit" onClick={() => openEdit(card)}>
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          size="small"
                          title="Remove"
                          color="error"
                          onClick={() => removeCard(card.id)}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" justifyContent="space-between">
            {!editDeckId && (
              <Button
                variant="outlined"
                color="error"
                size="large"
                onClick={() => setDiscardOpen(true)}
              >
                Discard Deck
              </Button>
            )}
            {editDeckId ? (
              <Button
                variant="contained"
                size="large"
                disabled={cards.length === 0 || commanderCount === 0 || saving}
                onClick={handleSave}
              >
                {saving ? 'Saving...' : 'Save Cards'}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                disabled={cards.length === 0 || commanderCount === 0}
                onClick={() => { loadPlayers(); setStep(2); }}
              >
                Continue to Save
              </Button>
            )}
          </Stack>
        </>
      )}

      {/* ── Step 2: Save ── */}
      {step === 2 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Save as Deck</Typography>

              <TextField
                select
                label="Player"
                value={playerId}
                onChange={(e) => setPlayerId(Number(e.target.value))}
                required
                fullWidth
              >
                <MenuItem value="">Select a player</MenuItem>
                {players.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Deck Name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                required
                fullWidth
                placeholder="e.g., Landfall Aggro"
              />

              <TextField
                label="Commander"
                value={cards.find((c) => c.is_commander)?.card_name ?? ''}
                InputProps={{ readOnly: true }}
                fullWidth
                helperText="Go back to Step 2 to change the commander"
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Color Identity
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {MTG_COLORS_WITH_C.map((color) => (
                    <ManaSymbol
                      key={color}
                      color={color}
                      size={32}
                      active={colors.includes(color)}
                      dimmed
                      onClick={() => handleColorClick(color)}
                    />
                  ))}
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Auto-filled from commander — adjust if needed
                </Typography>
              </Box>

              <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 2 }}>
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body2">
                      {cards.length} cards will be saved with this deck
                    </Typography>
                  </Stack>
                  {proxyCount > 0 && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ContentCopyIcon color="error" fontSize="small" />
                      <Typography variant="body2" color="error.main">
                        {proxyCount} {proxyCount === 1 ? 'proxy' : 'proxies'} — need procurement
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDiscardOpen(true)}
                >
                  Discard Deck
                </Button>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    disabled={saving || !playerId || !deckName.trim()}
                    onClick={handleSave}
                  >
                    {saving ? 'Saving...' : 'Save Deck'}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* ── Edit Card Dialog ── */}
      <Dialog open={!!editCard} onClose={() => setEditCard(null)} fullWidth maxWidth="xs">
        <DialogTitle>
          Edit Card
          <IconButton
            onClick={() => setEditCard(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Card Name"
            value={editName}
            onChange={(e) => handleEditNameChange(e.target.value)}
            sx={{ mt: 1 }}
          />
          {editSuggestions.length > 0 && (
            <Stack spacing={0.5} mt={1}>
              {editSuggestions.map((s) => (
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
          <Button onClick={() => setEditCard(null)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={editLooking || !editName.trim()}
            onClick={() => confirmEdit()}
          >
            {editLooking ? <CircularProgress size={18} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Scan More Dialog ── */}
      <Dialog open={scanMoreOpen} onClose={() => setScanMoreOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Scan More Cards
          <IconButton onClick={() => setScanMoreOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} py={1}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CameraAltIcon />}
              onClick={() => { setScanMoreOpen(false); cameraInputRef.current?.click(); }}
              fullWidth
            >
              Take Photo
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<UploadFileIcon />}
              onClick={() => { setScanMoreOpen(false); uploadInputRef.current?.click(); }}
              fullWidth
            >
              Upload Image
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ── Pre-Scan Image Editor ── */}
      <Dialog open={!!pendingFile} onClose={() => setPendingFile(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Adjust Image Before Scanning
          <IconButton onClick={() => setPendingFile(null)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            {/* Preview */}
            <Box sx={{ textAlign: 'center', overflow: 'hidden', borderRadius: 1, bgcolor: 'action.hover', p: 1 }}>
              {previewUrl && (
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 400,
                    objectFit: 'contain',
                    transform: `rotate(${editRotation}deg)`,
                    filter: `brightness(${editBrightness}%) contrast(${editContrast}%)`,
                    transition: 'transform 0.2s',
                  }}
                />
              )}
            </Box>

            {/* Rotation */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 80 }}>Rotation</Typography>
              <IconButton onClick={() => setEditRotation((r) => (r - 90 + 360) % 360)}>
                <RotateLeftIcon />
              </IconButton>
              <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'center' }}>
                {editRotation}°
              </Typography>
              <IconButton onClick={() => setEditRotation((r) => (r + 90) % 360)}>
                <RotateRightIcon />
              </IconButton>
            </Stack>

            {/* Brightness */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 80 }}>Brightness</Typography>
              <Slider
                value={editBrightness}
                onChange={(_, v) => setEditBrightness(v as number)}
                min={50} max={200} step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}%`}
                sx={{ flex: 1 }}
              />
              <Button size="small" onClick={() => setEditBrightness(100)}>Reset</Button>
            </Stack>

            {/* Contrast */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 80 }}>Contrast</Typography>
              <Slider
                value={editContrast}
                onChange={(_, v) => setEditContrast(v as number)}
                min={50} max={200} step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}%`}
                sx={{ flex: 1 }}
              />
              <Button size="small" onClick={() => setEditContrast(100)}>Reset</Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingFile(null)}>Cancel</Button>
          <Button variant="contained" startIcon={<CameraAltIcon />} onClick={processAndScan}>
            Scan
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Discard Confirmation Dialog ── */}
      <Dialog open={discardOpen} onClose={() => setDiscardOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Discard this deck?</DialogTitle>
        <DialogContent>
          <Typography>
            All {cards.length} scanned card{cards.length !== 1 ? 's' : ''} will be lost. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDiscardOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={discardDraft}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Add Card Dialog ── */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>
          Add Card
          <IconButton
            onClick={() => setAddOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Card Name"
            value={addName}
            onChange={(e) => handleAddNameChange(e.target.value)}
            sx={{ mt: 1 }}
          />
          {addSuggestions.length > 0 && (
            <Stack spacing={0.5} mt={1}>
              {addSuggestions.map((s) => (
                <Button
                  key={s}
                  variant="text"
                  size="small"
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  onClick={() => confirmAdd(s)}
                >
                  {s}
                </Button>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={addLooking || !addName.trim()}
            onClick={() => confirmAdd()}
          >
            {addLooking ? <CircularProgress size={18} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}

export default function ScanDeckPage() {
  return (
    <Suspense fallback={
      <PageContainer title="Scan Deck" backHref="/decks" backLabel="Back to Decks">
        <Stack alignItems="center" spacing={2} py={8}>
          <CircularProgress size={48} />
        </Stack>
      </PageContainer>
    }>
      <ScanDeckPageInner />
    </Suspense>
  );
}
