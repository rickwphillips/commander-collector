'use client';

/**
 * ScanInput — real Phase 3 camera/OCR scan input surface.
 *
 * Pure producer: captures images, runs the OCR pipeline, and emits Card[] to
 * its parent via onCardsRecognized. Knows nothing about decks vs lists.
 * The parent (CardInputPanel, CardListView, etc.) decides where cards go.
 *
 * Peers rule: no DB writes, no navigation, no auth checks.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  Slider,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import TuneIcon from '@mui/icons-material/Tune';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

import { CardTile } from '@/components/cards/CardTile';
import { api, getDeviceId } from '@/lib/api';
import {
  cropDataUrl,
  fileToBase64,
  runTileScan,
  splitCanvasToTiles,
  lookupAndEnrichCards,
  tempId,
} from '@/lib/scan';
import type { ScannedCard } from '@/lib/types';
import type { Card as CardType } from '@/lib/cards/types';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ScanInputProps {
  /** Called when the user finalizes a batch of recognized cards. */
  onCardsRecognized: (cards: CardType[]) => void;
  /** Optional initial buffer to start with (for resuming a draft). */
  initialBuffer?: CardType[];
  /** When true, autosaves drafts via the buffer-draft endpoint. */
  autoSave?: boolean;
  /** Device id for buffer-draft scoping (default: read from localStorage via getDeviceId). */
  deviceId?: string;
  /** Whether to render compact (e.g. inside a tab) or full-page. */
  compact?: boolean;
  /** Disabled state. */
  disabled?: boolean;
}

interface EditorState {
  rotation: number;
  brightness: number;
  contrast: number;
  zoom: number;
  panX: number;
  panY: number;
}

// Context key used for buffer-draft persistence in scan mode.
const DRAFT_CONTEXT_TYPE = 'scan_input_buffer';

// Tile grid: 3×3 = 9 tiles + 1 full-image = 10 total scans (matches scan page default).
const COLS = 3;
const ROWS = 3;

// ── Adapter ────────────────────────────────────────────────────────────────────

/**
 * Converts a ScannedCard (from the OCR lib, deprecated type) into the
 * canonical Card type that ScanInput exposes via onCardsRecognized.
 * ScannedCard has a top-level `id` field; Card uses `tempId` for ephemeral IDs.
 */
function scannedToCard(s: ScannedCard): CardType {
  return {
    tempId: s.id,
    card_name: s.card_name,
    scryfall_id: s.scryfall_id,
    image_uri: s.image_uri,
    back_image_uri: s.back_image_uri ?? null,
    color_identity: s.color_identity,
    type_line: s.type_line,
    mana_cost: s.mana_cost,
    quantity: s.quantity,
    is_commander: s.is_commander,
    is_proxy: s.is_proxy,
    notFound: s.notFound,
  };
}

/**
 * Converts the canonical Card type back into ScannedCard for draft persistence.
 * Only the fields that ScanDraft / buffer-draft.php expect.
 */
function cardToScanned(c: CardType): ScannedCard {
  return {
    id: c.tempId ?? c.id ?? tempId(),
    card_name: c.card_name,
    scryfall_id: c.scryfall_id ?? null,
    image_uri: c.image_uri ?? null,
    back_image_uri: c.back_image_uri ?? null,
    color_identity: c.color_identity,
    type_line: c.type_line ?? null,
    mana_cost: c.mana_cost ?? null,
    quantity: c.quantity,
    is_commander: c.is_commander,
    is_proxy: c.is_proxy,
    notFound: c.notFound ?? false,
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ScanInput({
  onCardsRecognized,
  initialBuffer,
  autoSave = false,
  deviceId: deviceIdProp,
  compact = false,
  disabled = false,
}: ScanInputProps): ReactElement {
  const deviceId = deviceIdProp ?? getDeviceId();
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // ── Refs ────────────────────────────────────────────────────────────────────

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const draftSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Captured base64 + mimeType from the last processed image (for not-found crop)
  const lastProcessedRef = useRef<{ base64: string; mimeType: string } | null>(null);

  // ── State ───────────────────────────────────────────────────────────────────

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    rotation: 0,
    brightness: 100,
    contrast: 100,
    zoom: 1,
    panX: 0,
    panY: 0,
  });

  // Working buffer of recognized cards
  const [cards, setCards] = useState<CardType[]>(initialBuffer ?? []);
  // crop snippet data URLs for not-found cards (card.tempId → data URL)
  const [cropMap, setCropMap] = useState<Record<string, string>>({});

  const [processing, setProcessing] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [draftReady, setDraftReady] = useState(!autoSave);

  // Inline card name editing
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Editor controls visibility toggle
  const [showEditorControls, setShowEditorControls] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'info' | 'error' } | null>(null);

  // ── autoSave: restore draft on mount ────────────────────────────────────────

  useEffect(() => {
    if (!autoSave) return;
    // If initialBuffer is provided, skip restoring draft (caller wins)
    if (initialBuffer && initialBuffer.length > 0) {
      setDraftReady(true);
      return;
    }
    api
      .getBufferDraft(deviceId, DRAFT_CONTEXT_TYPE)
      .then(({ state }) => {
        if (state && state.cards.length > 0) {
          setCards(state.cards.map(scannedToCard));
          setToast({ message: 'Draft restored', severity: 'info' });
        }
      })
      .catch(() => {})
      .finally(() => setDraftReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── autoSave: debounce-save on cards change ──────────────────────────────────

  useEffect(() => {
    if (!autoSave || !draftReady) return;
    if (cards.length === 0) return;
    if (draftSaveTimer.current) clearTimeout(draftSaveTimer.current);
    draftSaveTimer.current = setTimeout(() => {
      api
        .saveBufferDraft(deviceId, DRAFT_CONTEXT_TYPE, '', {
          step: 0,
          cards: cards.map(cardToScanned),
          deckName: '',
          playerId: '',
          colors: [],
        })
        .catch(() => {});
    }, 1500);
    return () => {
      if (draftSaveTimer.current) clearTimeout(draftSaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSave, draftReady, cards]);

  // ── File / Camera input ──────────────────────────────────────────────────────

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError(null);
      setPreviewUrl(URL.createObjectURL(file));
      setEditorState({ rotation: 0, brightness: 100, contrast: 100, zoom: 1, panX: 0, panY: 0 });
      setImageFile(file);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    },
    []
  );

  // ── OCR pipeline ─────────────────────────────────────────────────────────────

  async function processAndScan() {
    if (!imageFile) return;
    const fileToProcess = imageFile;
    const previewToRestore = previewUrl;

    setProcessing(true);
    setProgress(null);
    setError(null);

    try {
      const { rotation, brightness, contrast, zoom, panX, panY } = editorState;
      const { base64, mimeType, canvas } = await fileToBase64(
        fileToProcess,
        rotation,
        brightness,
        contrast,
        zoom,
        panX,
        panY
      );
      // Update preview to processed version
      setPreviewUrl(`data:${mimeType};base64,${base64}`);
      lastProcessedRef.current = { base64, mimeType };

      // 3×3 tiles + 1 full-image pass = 10 total scans
      const tiles = splitCanvasToTiles(canvas, COLS, ROWS);
      const allScans = [...tiles, { base64, mimeType }];
      const totalScans = allScans.length;
      setProgress({ current: 0, total: totalScans });

      // Scan in batches of 3, deduplicate across batches, then bulk-lookup
      const BATCH_SIZE = 3;
      const seen = new Set<string>();
      const lookupPromises: Promise<ScannedCard[]>[] = [];

      for (let i = 0; i < allScans.length; i += BATCH_SIZE) {
        const batch = allScans.slice(i, i + BATCH_SIZE);
        const newNames = await runTileScan(batch, () => {
          setProgress((prev) =>
            prev ? { ...prev, current: Math.min(prev.current + 1, prev.total) } : prev
          );
        });
        // Dedup across batches
        const freshNames = newNames.filter((item) => {
          const key = item.name.toLowerCase().trim();
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        if (freshNames.length > 0) {
          setLookingUp(true);
          lookupPromises.push(
            lookupAndEnrichCards(freshNames).finally(() => setLookingUp(false))
          );
        }
      }

      // Wait for all lookups, flatten, and merge into card state
      const batches = await Promise.all(lookupPromises);
      const addedScanned = batches.flat();
      const added = addedScanned.map(scannedToCard);

      setCards((prev) => [...prev, ...added]);

      // Async: locate crop snippets for not-found cards to verify them
      const notFoundCards = added.filter((c) => c.notFound);
      const scanB64 = base64;
      const scanMime = mimeType;
      notFoundCards.forEach((c) => {
        const cardKey = c.tempId ?? '';
        api
          .findCardCrop(scanB64, scanMime, c.card_name)
          .then(async ({ crop }) => {
            if (!crop) {
              // Claude couldn't locate this card — likely a hallucination, discard it
              setCards((prev) => prev.filter((card) => (card.tempId ?? card.id) !== (c.tempId ?? c.id)));
              return;
            }
            const snippet = await cropDataUrl(
              `data:${scanMime};base64,${scanB64}`,
              crop.x,
              crop.y,
              crop.w,
              crop.h
            );
            setCropMap((prev) => ({ ...prev, [cardKey]: snippet }));
          })
          .catch(() => {
            /* network error — leave card in place, treat as unknown */
          });
      });

      // Clear image file so we show the review grid (not the capture screen)
      setImageFile(null);
    } catch (err) {
      console.error('[ScanInput] Scan error:', err);
      setError(err instanceof Error ? err.message : 'Scan failed');
      setPreviewUrl(previewToRestore);
    } finally {
      setProcessing(false);
      setProgress(null);
      setLookingUp(false);
    }
  }

  // ── Card editing (inline) ────────────────────────────────────────────────────

  function startEditName(card: CardType) {
    const key = card.tempId ?? card.id ?? '';
    setEditingCardId(key);
    setEditingName(card.card_name);
  }

  function commitEditName() {
    if (!editingCardId) return;
    const trimmed = editingName.trim();
    if (!trimmed) {
      setEditingCardId(null);
      return;
    }
    setCards((prev) =>
      prev.map((c) => {
        const key = c.tempId ?? c.id ?? '';
        if (key !== editingCardId) return c;
        return { ...c, card_name: trimmed, notFound: false };
      })
    );
    setEditingCardId(null);
  }

  function removeCard(card: CardType) {
    const key = card.tempId ?? card.id ?? '';
    setCards((prev) => prev.filter((c) => (c.tempId ?? c.id ?? '') !== key));
    setCropMap((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function changeQuantity(card: CardType, newQty: number) {
    const key = card.tempId ?? card.id ?? '';
    setCards((prev) =>
      prev.map((c) => ((c.tempId ?? c.id ?? '') === key ? { ...c, quantity: Math.max(1, newQty) } : c))
    );
  }

  // ── Finalize / reset ─────────────────────────────────────────────────────────

  function finalize() {
    onCardsRecognized(cards);
    if (autoSave) {
      api.clearBufferDraft(deviceId, DRAFT_CONTEXT_TYPE).catch(() => {});
    }
    reset();
  }

  function reset() {
    setCards([]);
    setCropMap({});
    setImageFile(null);
    setPreviewUrl(null);
    setProgress(null);
    setError(null);
    setEditorState({ rotation: 0, brightness: 100, contrast: 100, zoom: 1, panX: 0, panY: 0 });
    setShowEditorControls(false);
  }

  // ── Derived ──────────────────────────────────────────────────────────────────

  const notFoundCount = cards.filter((c) => c.notFound).length;
  const phase: 'capture' | 'review' =
    cards.length > 0 && !processing ? 'review' : 'capture';

  const spacing = compact ? 1 : 2;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        {...(isMobile ? { capture: 'environment' as const } : {})}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={disabled}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={disabled}
      />

      {/* ── Error banner ── */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: spacing }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* ── Phase: Capture (no cards yet or user scanning more) ── */}
      {phase === 'capture' && (
        <Card>
          <CardContent sx={{ p: compact ? 2 : 4 }}>
            {/* ── Capture buttons ── */}
            {!imageFile && !processing && (
              <Stack alignItems="center" spacing={compact ? 2 : 3} py={compact ? 2 : 4}>
                <CameraAltIcon
                  sx={{ fontSize: compact ? 40 : 64, color: 'text.secondary' }}
                />
                {!compact && (
                  <>
                    <Typography variant="h6">Photograph your card layout</Typography>
                    <Typography color="text.secondary" textAlign="center" maxWidth={480}>
                      Lay your cards face-up in rows and take a clear photo. The scanner
                      reads card names and looks them up on Scryfall automatically.
                    </Typography>
                  </>
                )}
                <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
                  {isMobile && (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<CameraAltIcon />}
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={disabled}
                      sx={{ minHeight: 44 }}
                    >
                      Take Photo
                    </Button>
                  )}
                  <Button
                    variant={isMobile ? 'outlined' : 'contained'}
                    size="large"
                    startIcon={<UploadFileIcon />}
                    onClick={() => uploadInputRef.current?.click()}
                    disabled={disabled}
                    sx={{ minHeight: 44 }}
                  >
                    Upload Image
                  </Button>
                </Stack>
              </Stack>
            )}

            {/* ── Image preview + editor controls ── */}
            {imageFile && !processing && (
              <Stack spacing={2}>
                {/* Preview */}
                {previewUrl && (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      maxHeight: compact ? 200 : 360,
                      overflow: 'hidden',
                      borderRadius: 1,
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: compact ? 200 : 360,
                        objectFit: 'contain',
                        transform: `rotate(${editorState.rotation}deg) scale(${editorState.zoom})`,
                        filter: `brightness(${editorState.brightness}%) contrast(${editorState.contrast}%)`,
                        transition: 'transform 0.2s, filter 0.2s',
                      }}
                    />
                  </Box>
                )}

                {/* Editor controls toggle */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    size="small"
                    startIcon={<TuneIcon />}
                    onClick={() => setShowEditorControls((v) => !v)}
                    variant="outlined"
                    sx={{ minHeight: 44 }}
                  >
                    {showEditorControls ? 'Hide Adjustments' : 'Adjust Image'}
                  </Button>
                  <Tooltip title="Rotate 90°">
                    <IconButton
                      size="small"
                      onClick={() =>
                        setEditorState((s) => ({
                          ...s,
                          rotation: (s.rotation + 90) % 360,
                        }))
                      }
                      sx={{ minWidth: 44, minHeight: 44 }}
                    >
                      <RotateRightIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Zoom in">
                    <IconButton
                      size="small"
                      onClick={() =>
                        setEditorState((s) => ({ ...s, zoom: Math.min(3, s.zoom + 0.1) }))
                      }
                      sx={{ minWidth: 44, minHeight: 44 }}
                    >
                      <ZoomInIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Zoom out">
                    <IconButton
                      size="small"
                      onClick={() =>
                        setEditorState((s) => ({ ...s, zoom: Math.max(0.5, s.zoom - 0.1) }))
                      }
                      sx={{ minWidth: 44, minHeight: 44 }}
                    >
                      <ZoomOutIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {/* Expanded editor controls */}
                {showEditorControls && (
                  <Stack spacing={1.5} sx={{ px: 1 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Brightness: {editorState.brightness}%
                      </Typography>
                      <Slider
                        value={editorState.brightness}
                        min={50}
                        max={200}
                        onChange={(_e, v) =>
                          setEditorState((s) => ({ ...s, brightness: v as number }))
                        }
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Contrast: {editorState.contrast}%
                      </Typography>
                      <Slider
                        value={editorState.contrast}
                        min={50}
                        max={200}
                        onChange={(_e, v) =>
                          setEditorState((s) => ({ ...s, contrast: v as number }))
                        }
                        size="small"
                      />
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary">
                          Pan X: {editorState.panX}
                        </Typography>
                        <Slider
                          value={editorState.panX}
                          min={-50}
                          max={50}
                          onChange={(_e, v) =>
                            setEditorState((s) => ({ ...s, panX: v as number }))
                          }
                          size="small"
                        />
                      </Box>
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary">
                          Pan Y: {editorState.panY}
                        </Typography>
                        <Slider
                          value={editorState.panY}
                          min={-50}
                          max={50}
                          onChange={(_e, v) =>
                            setEditorState((s) => ({ ...s, panY: v as number }))
                          }
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </Stack>
                )}

                {/* Action buttons */}
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(null);
                      setEditorState({ rotation: 0, brightness: 100, contrast: 100, zoom: 1, panX: 0, panY: 0 });
                    }}
                    sx={{ minHeight: 44 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={processAndScan}
                    disabled={disabled || processing}
                    sx={{ minHeight: 44 }}
                  >
                    Scan Cards
                  </Button>
                </Stack>
              </Stack>
            )}

            {/* ── Processing: progress indicator ── */}
            {processing && (
              <Stack spacing={2} alignItems="center" py={compact ? 2 : 4}>
                <CircularProgress size={compact ? 32 : 48} />
                <Typography variant={compact ? 'body2' : 'h6'}>
                  Scanning image…
                </Typography>
                {progress && (
                  <Box sx={{ width: '100%', maxWidth: 320 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(progress.current / progress.total) * 100}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                      Tile {progress.current} of {progress.total}
                    </Typography>
                  </Box>
                )}
                {lookingUp && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={14} />
                    <Typography variant="caption" color="text.secondary">
                      Looking up cards on Scryfall…
                    </Typography>
                  </Stack>
                )}
              </Stack>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Phase: Review — recognized cards grid ── */}
      {phase === 'review' && (
        <>
          {/* ── Stats bar ── */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            mb={spacing}
          >
            <Chip label={`${cards.length} card${cards.length === 1 ? '' : 's'}`} />
            {notFoundCount > 0 && (
              <Chip
                icon={<WarningAmberIcon />}
                label={`${notFoundCount} not found`}
                color="error"
                size="small"
              />
            )}
            {lookingUp && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CircularProgress size={14} />
                <Typography variant="caption" color="text.secondary">
                  Looking up…
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* ── Card grid ── */}
          <Grid
            container
            spacing={compact ? 1 : 1.5}
            sx={{ mb: spacing }}
          >
            {cards.map((card) => {
              const key = card.tempId ?? card.id ?? card.card_name;
              const isEditing = editingCardId === key;
              return (
                <Grid
                  key={key}
                  size={{ xs: 6, sm: compact ? 4 : 4, md: compact ? 3 : 3, lg: compact ? 2 : 2 }}
                >
                  <Stack spacing={0.5}>
                    <CardTile
                      card={card}
                      lookupState={
                        card.notFound
                          ? 'not_found'
                          : card.scryfall_id
                          ? 'resolved'
                          : 'pending'
                      }
                      size={compact ? 'sm' : 'md'}
                      editMode
                      onQtyChange={(newQty) => changeQuantity(card, newQty)}
                      onDelete={() => removeCard(card)}
                      onClick={card.notFound ? () => startEditName(card) : undefined}
                    />
                    {/* Crop snippet for not-found cards */}
                    {card.notFound && cropMap[key] && (
                      <Box
                        component="img"
                        src={cropMap[key]}
                        alt={`Crop: ${card.card_name}`}
                        sx={{
                          width: '100%',
                          borderRadius: 0.5,
                          border: '1px solid',
                          borderColor: 'warning.main',
                          opacity: 0.85,
                        }}
                      />
                    )}
                    {/* Inline name editor for not-found cards */}
                    {card.notFound && isEditing && (
                      <Stack direction="row" spacing={0.5}>
                        <TextField
                          size="small"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEditName();
                            if (e.key === 'Escape') setEditingCardId(null);
                          }}
                          autoFocus
                          placeholder="Card name"
                          sx={{ flex: 1, fontSize: '0.75rem' }}
                          inputProps={{ style: { fontSize: '0.75rem', padding: '4px 8px' } }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={commitEditName}
                          sx={{ minWidth: 0, px: 1, minHeight: 32 }}
                        >
                          OK
                        </Button>
                      </Stack>
                    )}
                    {/* Tap-to-edit hint for not-found cards without active editor */}
                    {card.notFound && !isEditing && (
                      <Typography
                        variant="caption"
                        color="error"
                        textAlign="center"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => startEditName(card)}
                      >
                        Tap to correct name
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              );
            })}
          </Grid>

          {/* ── Scan more button ── */}
          <Box sx={{ mb: spacing }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CameraAltIcon />}
              onClick={() => {
                setImageFile(null);
                setPreviewUrl(null);
              }}
              disabled={disabled}
              sx={{ minHeight: 44 }}
            >
              Scan More
            </Button>
          </Box>

          {/* ── Finalize / Try again ── */}
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              variant="outlined"
              color="error"
              startIcon={<RefreshIcon />}
              onClick={reset}
              disabled={disabled}
              sx={{ minHeight: 44 }}
            >
              Try Again
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={finalize}
              disabled={disabled || cards.length === 0}
              sx={{ minHeight: 44 }}
            >
              Looks Good
            </Button>
          </Stack>
        </>
      )}

      {/* ── Toast ── */}
      <Snackbar
        open={toast !== null}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast?.severity ?? 'info'}
          onClose={() => setToast(null)}
          sx={{ width: '100%' }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
