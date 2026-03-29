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
  FormControlLabel,
  LinearProgress,
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
  Switch,
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
import StyleIcon from '@mui/icons-material/Style';
import { PageContainer } from '@/components/PageContainer';
import { ManaSymbol } from '@/components/ManaSymbol';
import { DeckBreakdown } from '@/components/DeckBreakdown';
import { api } from '@/lib/api';
import { MTG_COLORS_WITH_C } from '@/lib/utils';
import { scryfallAutocomplete } from '@/lib/scryfall';
import type { ScryfallCachedCard, Player, DeckWithPlayer, ScannedCard, ScanDraft } from '@/lib/types';

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

function cropDataUrl(
  dataUrl: string,
  x: number, y: number, w: number, h: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const sw = Math.round(img.width * w);
      const sh = Math.round(img.height * h);
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('No canvas context'));
      ctx.drawImage(img, img.width * x, img.height * y, sw, sh, 0, 0, sw, sh);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function cardFromScryfall(name: string, data: ScryfallCachedCard | null, proxy = false): ScannedCard {
  return {
    id: tempId(),
    card_name: data?.name ?? name,
    scryfall_id: data?.scryfall_id ?? null,
    image_uri: data?.image_uri ?? null,
    color_identity: data?.color_identity ?? '',
    type_line: data?.type_line ?? null,
    mana_cost: data?.mana_cost ?? null,
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
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const [step, setStep]     = useState<number>(0);
  const [cards, setCards]   = useState<ScannedCard[]>([]);
  const [deckName, setDeckName] = useState('');
  const [playerId, setPlayerId] = useState<number | ''>('');
  const [colors, setColors] = useState<string[]>([]);
  // draftReady gates the auto-save: don't write back until we've loaded the server draft
  const [draftReady, setDraftReady] = useState(!!editDeckId);
  const draftSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [scanResults, setScanResults] = useState<ScannedCard[] | null>(null);
  const [cropMap, setCropMap] = useState<Record<string, string>>({}); // card id → cropped data URL

  // Edit-mode: loading existing deck cards
  const [editLoading, setEditLoading] = useState(!!editDeckId);
  const [importing, setImporting] = useState(false);
  const [singletonImport, setSingletonImport] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [scanning, setScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState<{ current: number; total: number } | null>(null);
  const scanStartCardCount = useRef(0); // cards.length when current scan began

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
  const [saveMode, setSaveMode] = useState<'new' | 'existing'>('new');
  const [allDecks, setAllDecks] = useState<DeckWithPlayer[]>([]);
  const [existingDeckId, setExistingDeckId] = useState<number | ''>('');

  // Pre-scan image editor
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [editRotation, setEditRotation] = useState(0);
  const [editBrightness, setEditBrightness] = useState(100);
  const [editContrast, setEditContrast] = useState(100);

  // Discard confirmation
  const [discardOpen, setDiscardOpen] = useState(false);

  // Scan more dialog
  const [scanMoreOpen, setScanMoreOpen] = useState(false);

  // Version picker dialog
  const [versionCard, setVersionCard] = useState<ScannedCard | null>(null);
  const [prints, setPrints] = useState<import('@/lib/types').CardPrint[]>([]);
  const [loadingPrints, setLoadingPrints] = useState(false);

  // ── Load server draft on mount (new deck mode only) ──────────────────────

  useEffect(() => {
    if (editDeckId) return;
    api.getScanDraft().then(({ state }) => {
      if (state) {
        setStep(state.step);
        setCards(state.cards);
        setDeckName(state.deckName);
        setPlayerId(state.playerId);
        setColors(state.colors);
      }
    }).catch(() => {}).finally(() => setDraftReady(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            type_line: c.type_line ?? null,
            mana_cost: c.mana_cost ?? null,
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

  // ── Persist draft to server (new decks only, debounced 1.5s) ──────────────

  useEffect(() => {
    if (!draftReady || editDeckId) return;
    if (step === 0 && cards.length === 0) return;
    if (draftSaveTimer.current) clearTimeout(draftSaveTimer.current);
    draftSaveTimer.current = setTimeout(() => {
      api.saveScanDraft({ step, cards, deckName, playerId, colors }).catch(() => {});
    }, 1500);
    return () => { if (draftSaveTimer.current) clearTimeout(draftSaveTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftReady, editDeckId, step, cards, deckName, playerId, colors]);

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
          // non-basic already in deck: skip
        } else if (toAdd.some((t) => t.name.toLowerCase() === key)) {
          // duplicate within this import file: skip
        } else {
          const effectiveQty = singletonImport && !isBasic ? 1 : qty;
          toAdd.push({ name, qty: effectiveQty });
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
              card.type_line = hit.data.type_line ?? null;
              card.mana_cost = hit.data.mana_cost ?? null;
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
    api.clearScanDraft().catch(() => {});
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

  // Split a processed canvas into a cols×rows grid of overlapping tiles
  function splitCanvasToTiles(
    source: HTMLCanvasElement,
    cols: number,
    rows: number,
  ): { base64: string; mimeType: string }[] {
    const W = source.width;
    const H = source.height;
    const tileW = Math.ceil(W / cols);
    const tileH = Math.ceil(H / rows);
    // 8% overlap on each edge so cards near boundaries are fully visible in at least one tile
    const overlapX = Math.round(tileW * 0.08);
    const overlapY = Math.round(tileH * 0.08);
    const tiles: { base64: string; mimeType: string }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const sx = Math.max(0, col * tileW - overlapX);
        const sy = Math.max(0, row * tileH - overlapY);
        const ex = Math.min(W, (col + 1) * tileW + overlapX);
        const ey = Math.min(H, (row + 1) * tileH + overlapY);
        const tileCanvas = document.createElement('canvas');
        tileCanvas.width = ex - sx;
        tileCanvas.height = ey - sy;
        tileCanvas.getContext('2d')!.drawImage(source, sx, sy, ex - sx, ey - sy, 0, 0, ex - sx, ey - sy);
        const dataUrl = tileCanvas.toDataURL('image/jpeg', 0.88);
        tiles.push({ base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' });
      }
    }
    return tiles;
  }

  // Apply rotation + brightness/contrast to a canvas and return base64 JPEG + the canvas
  async function fileToBase64(
    file: File,
    rotation: number,
    brightness: number,
    contrast: number,
  ): Promise<{ base64: string; mimeType: string; canvas: HTMLCanvasElement }> {
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
      return { base64: dataUrl.split(',')[1], mimeType: 'image/jpeg', canvas };
    } catch (err) {
      if (isHeic) {
        throw new Error(
          'Could not convert HEIC. Open the photo in Preview → Export as JPEG, then upload that.'
        );
      }
      throw new Error('Could not process image: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  // Called when user confirms the pre-scan editor and clicks Submit
  async function processAndScan() {
    if (!pendingFile) return;
    const fileToRestore = pendingFile;
    const previewToRestore = previewUrl;
    setPendingFile(null);
    setScanMoreOpen(false);
    setScanning(true);
    setScanProgress(null);
    scanStartCardCount.current = cards.length;

    try {
      const { base64, mimeType, canvas } = await fileToBase64(fileToRestore, editRotation, editBrightness, editContrast);
      setPreviewUrl(`data:${mimeType};base64,${base64}`);

      // Split into 3×3 = 9 tiles + 1 full-image pass = 10 total scans
      // Full image catches edge cards that span tile borders
      const COLS = 3, ROWS = 3;
      const tiles = splitCanvasToTiles(canvas, COLS, ROWS);
      const allScans = [...tiles, { base64, mimeType }];
      const totalScans = allScans.length;
      setScanProgress({ current: 1, total: totalScans });

      // Scan in batches of 3 to stay within API rate limits (30k tokens/min).
      // Each batch's new cards are deduped and looked up immediately — lookups
      // run concurrently with the next batch scan so cards appear progressively.
      const BATCH_SIZE = 3;
      const seen = new Set<string>();
      const lookupPromises: Promise<ScannedCard[]>[] = [];

      for (let i = 0; i < allScans.length; i += BATCH_SIZE) {
        const batch = allScans.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.allSettled(
          batch.map(async (tile) => {
            const result = await api.scanDeck(tile.base64, tile.mimeType);
            setScanProgress((prev) => prev ? { ...prev, current: Math.min(prev.current + 1, prev.total) } : prev);
            return result.cards;
          })
        );

        // Dedupe new names from this batch and kick off lookup immediately
        const newCards: { name: string; proxy: boolean }[] = [];
        for (const result of batchResults) {
          if (result.status !== 'fulfilled') continue;
          for (const card of result.value) {
            const key = card.name.toLowerCase().trim();
            if (!key || seen.has(key)) continue;
            seen.add(key);
            newCards.push(card);
          }
        }
        if (newCards.length > 0) {
          lookupPromises.push(lookupAllCards(newCards));
        }
      }

      // Wait for all in-flight lookups and flatten into a single result list
      const added = (await Promise.all(lookupPromises)).flat();

      // Async: ask Claude to locate each not-found card and store a crop snippet
      const notFoundCards = added.filter((c) => c.notFound);
      const scanBase64 = base64;
      const scanMime = mimeType;
      notFoundCards.forEach((c) => {
        api.findCardCrop(scanBase64, scanMime, c.card_name)
          .then(async ({ crop }) => {
            if (!crop) {
              // Claude couldn't locate this card in the image — likely a hallucination, discard it
              setCards((prev) => prev.filter((card) => card.id !== c.id));
              setScanResults((prev) => prev ? prev.filter((card) => card.id !== c.id) : null);
              return;
            }
            const snippet = await cropDataUrl(
              `data:${scanMime};base64,${scanBase64}`,
              crop.x, crop.y, crop.w, crop.h
            );
            setCropMap((prev) => ({ ...prev, [c.id]: snippet }));
          })
          .catch(() => {/* network error — leave card in place, treat as unknown */});
      });

      if (editDeckId) {
        setScanResults(added);
      } else {
        setStep(1);
      }
    } catch (err) {
      console.error('[Scan error]', err);
      setError(err instanceof Error ? err.message : 'Scan failed');
      setPreviewUrl(previewToRestore);
      setPendingFile(fileToRestore);
    } finally {
      setScanning(false);
      setScanProgress(null);
    }
  }

  // ── Scryfall lookups ──────────────────────────────────────────────────────

  async function lookupAllCards(items: { name: string; proxy: boolean }[]): Promise<ScannedCard[]> {
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
          hits.forEach((hit) => {
            const card = scanned.find((c) => c.id === hit.id);
            if (card) {
              card.card_name = hit.data.name ?? card.card_name;
              card.scryfall_id = hit.data.scryfall_id;
              card.image_uri = hit.data.image_uri ?? null;
              card.color_identity = hit.data.color_identity ?? '';
              card.type_line = hit.data.type_line ?? null;
              card.mana_cost = hit.data.mana_cost ?? null;
              card.notFound = false;
            }
          });
          setCards((prev) =>
            prev.map((c) => {
              const updated = scanned.find((s) => s.id === c.id);
              return updated ?? c;
            })
          );
        }
      }
      return scanned;
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
    const [playerData, deckData] = await Promise.all([api.getPlayers(), api.getDecks()]);
    setPlayers(playerData);
    setAllDecks(deckData);
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

    if (saveMode === 'existing') {
      if (!existingDeckId) {
        setError('Please select an existing deck');
        return;
      }
      setSaving(true);
      setError(null);
      try {
        await api.saveDeckCards(existingDeckId as number, cards.map((c) => ({
          card_name: c.card_name,
          scryfall_id: c.scryfall_id,
          quantity: c.quantity,
          is_commander: c.is_commander,
          is_proxy: c.is_proxy,
        })));
        api.clearScanDraft().catch(() => {});
        router.push(`/decks/detail?id=${existingDeckId}`);
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

      api.clearScanDraft().catch(() => {});
      router.push(`/decks/detail?id=${deck.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save deck');
    } finally {
      setSaving(false);
    }
  }

  // ── Version picker ────────────────────────────────────────────────────────

  async function openVersionPicker(card: ScannedCard) {
    setVersionCard(card);
    setPrints([]);
    setLoadingPrints(true);
    try {
      const { prints: data } = await api.getCardPrints(card.card_name);
      setPrints(data);
    } catch {
      // show empty state in dialog
    } finally {
      setLoadingPrints(false);
    }
  }

  async function selectVersion(print: import('@/lib/types').CardPrint) {
    if (!versionCard) return;
    // Pre-fetch and cache the image in the background
    if (print.image_uri) {
      api.getCardImage(print.scryfall_id, print.image_uri).catch(() => {/* ignore */});
    }
    setCards((prev) =>
      prev.map((c) =>
        c.id === versionCard.id
          ? { ...c, scryfall_id: print.scryfall_id, image_uri: print.image_uri }
          : c
      )
    );
    setVersionCard(null);
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

      {/* Hidden file inputs — always mounted so refs work from any step */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        {...(isMobile ? { capture: 'environment' } : {})}
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

      {/* ── Step 0: Capture ── */}
      {step === 0 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stack alignItems="center" spacing={3} py={4}>
              <CameraAltIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
              <Typography variant="h6">Photograph your deck layout</Typography>
              <Typography color="text.secondary" textAlign="center" maxWidth={480}>
                Lay your cards face-up in rows and take a clear photo. Claude will read the card
                names and look them up on Scryfall.
              </Typography>
              <Stack direction="row" spacing={2}>
                {isMobile && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CameraAltIcon />}
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    Take Photo
                  </Button>
                )}
                <Button
                  variant={isMobile ? 'outlined' : 'contained'}
                  size="large"
                  startIcon={<UploadFileIcon />}
                  onClick={() => uploadInputRef.current?.click()}
                >
                  Upload Image
                </Button>
              </Stack>
            </Stack>
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
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={singletonImport}
                        onChange={(e) => setSingletonImport(e.target.checked)}
                      />
                    }
                    label={<Typography variant="caption">Singleton</Typography>}
                    sx={{ mr: 0 }}
                  />
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
                  ) : card.notFound && cropMap[card.id] ? (
                    <Box
                      component="img"
                      src={cropMap[card.id]}
                      alt={card.card_name}
                      sx={{ aspectRatio: '488/680', width: '100%', objectFit: 'contain', bgcolor: 'action.hover' }}
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
                        {card.scryfall_id && (
                          <IconButton
                            size="small"
                            title="Change version/set"
                            onClick={() => openVersionPicker(card)}
                          >
                            <StyleIcon fontSize="inherit" />
                          </IconButton>
                        )}
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

          {/* Deck breakdown summary */}
          {cards.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Deck Breakdown
              </Typography>
              <DeckBreakdown cards={cards} />
            </Box>
          )}

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
      {step === 2 && (() => {
        const playerDecks = allDecks.filter((d) => d.player_id === playerId);
        const selectedExistingDeck = allDecks.find((d) => d.id === existingDeckId);
        const existingHasCards = (selectedExistingDeck?.card_count ?? 0) > 0;
        const canSave = saveMode === 'existing'
          ? !!existingDeckId
          : !!playerId && !!deckName.trim();

        return (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <Typography variant="h6">Save as Deck</Typography>

                {/* New vs Existing toggle */}
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={saveMode === 'new' ? 'contained' : 'outlined'}
                    onClick={() => setSaveMode('new')}
                  >
                    New Deck
                  </Button>
                  <Button
                    variant={saveMode === 'existing' ? 'contained' : 'outlined'}
                    onClick={() => setSaveMode('existing')}
                  >
                    Existing Deck
                  </Button>
                </Stack>

                {saveMode === 'new' ? (
                  <>
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
                      helperText="Go back to step 1 to change the commander"
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
                  </>
                ) : (
                  <>
                    <TextField
                      select
                      label="Player"
                      value={playerId}
                      onChange={(e) => { setPlayerId(Number(e.target.value)); setExistingDeckId(''); }}
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
                      select
                      label="Deck"
                      value={existingDeckId}
                      onChange={(e) => setExistingDeckId(Number(e.target.value))}
                      fullWidth
                      disabled={!playerId || playerDecks.length === 0}
                      helperText={playerId && playerDecks.length === 0 ? 'This player has no decks' : undefined}
                    >
                      <MenuItem value="">Select a deck</MenuItem>
                      {playerDecks.map((d) => (
                        <MenuItem key={d.id} value={d.id}>
                          {d.name} — {d.commander}
                          {d.card_count > 0 ? ` (${d.card_count} cards)` : ''}
                        </MenuItem>
                      ))}
                    </TextField>

                    {existingHasCards && (
                      <Alert severity="warning">
                        <strong>{selectedExistingDeck?.name}</strong> already has {selectedExistingDeck?.card_count} cards.
                        Saving will replace that list entirely.
                      </Alert>
                    )}
                  </>
                )}

                <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 2 }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography variant="body2">
                        {cards.length} cards will be saved
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
                  <Button variant="outlined" color="error" onClick={() => setDiscardOpen(true)}>
                    Discard Deck
                  </Button>
                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      disabled={saving || !canSave}
                      onClick={handleSave}
                    >
                      {saving ? 'Saving...' : saveMode === 'existing' ? 'Replace Card List' : 'Save Deck'}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        );
      })()}

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
            {isMobile && (
              <Button
                variant="contained"
                size="large"
                startIcon={<CameraAltIcon />}
                onClick={() => { setScanMoreOpen(false); setTimeout(() => cameraInputRef.current?.click(), 50); }}
                fullWidth
              >
                Take Photo
              </Button>
            )}
            <Button
              variant={isMobile ? 'outlined' : 'contained'}
              size="large"
              startIcon={<UploadFileIcon />}
              onClick={() => { setScanMoreOpen(false); setTimeout(() => uploadInputRef.current?.click(), 50); }}
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
            Submit
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

      {/* ── Version Picker Dialog ── */}
      <Dialog open={!!versionCard} onClose={() => setVersionCard(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Choose Version — {versionCard?.card_name}
          <IconButton onClick={() => setVersionCard(null)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loadingPrints ? (
            <Stack alignItems="center" py={4}>
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Loading printings...
              </Typography>
            </Stack>
          ) : prints.length === 0 ? (
            <Typography color="text.secondary" py={2}>
              No printings found.
            </Typography>
          ) : (
            <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
              {prints.map((print) => (
                <Grid key={print.scryfall_id} size={{ xs: 6, sm: 4, md: 3 }}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      outline: versionCard?.scryfall_id === print.scryfall_id ? '2px solid' : undefined,
                      outlineColor: 'primary.main',
                      '&:hover': { outline: '2px solid', outlineColor: 'primary.light' },
                    }}
                    onClick={() => selectVersion(print)}
                  >
                    {print.image_uri ? (
                      <CardMedia
                        component="img"
                        image={print.image_uri}
                        alt={print.name}
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
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          No image
                        </Typography>
                      </Box>
                    )}
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                      <Typography variant="caption" noWrap display="block">
                        {print.set_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        #{print.collector_number} · {print.released_at.slice(0, 4)}
                        {print.image_cached && (
                          <Chip label="cached" size="small" color="success" sx={{ ml: 0.5, height: 14, fontSize: '0.55rem' }} />
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVersionCard(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* ── Scanning Progress Dialog ── */}
      {(() => {
        const SCAN_QUIPS = [
          'Wibbling…',
          'Concentrating…',
          'Tapping out…',
          'Consulting the oracle…',
          'Shuffling through the library…',
          'Reading the name bars…',
          'Checking for proxies…',
          'Cross-referencing Scryfall…',
          'Identifying your commanders…',
          'Counting the spells…',
        ];
        const quipIdx = scanProgress
          ? Math.floor((scanProgress.current / scanProgress.total) * SCAN_QUIPS.length)
          : 0;
        const quip = SCAN_QUIPS[Math.min(quipIdx, SCAN_QUIPS.length - 1)];
        const newCards = cards.slice(scanStartCardCount.current);
        const hasResults = newCards.length > 0;
        return (
          <Dialog open={scanning} maxWidth="xs" fullWidth>
            <DialogContent>
              <Stack alignItems="center" spacing={1.5} py={1}>
                <Stack direction="row" alignItems="center" spacing={1.5} width="100%">
                  <CircularProgress size={hasResults ? 20 : 40} sx={{ flexShrink: 0, transition: 'all 0.3s' }} />
                  <Box flex={1}>
                    <Typography variant={hasResults ? 'body2' : 'body1'}>
                      {scanProgress
                        ? `Tile ${scanProgress.current} of ${scanProgress.total} — ${quip}`
                        : 'Preparing image…'}
                    </Typography>
                    {scanProgress && (
                      <LinearProgress
                        variant="determinate"
                        value={(scanProgress.current / scanProgress.total) * 100}
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                </Stack>
                {hasResults ? (
                  <Box sx={{ width: '100%', maxHeight: 220, overflowY: 'auto' }}>
                    {newCards.map((c) => (
                      <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.25 }}>
                        {c.image_uri ? (
                          <Box component="img" src={c.image_uri} alt={c.card_name}
                            sx={{ width: 24, height: 34, borderRadius: 0.5, objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <Box sx={{ width: 24, height: 34, bgcolor: 'action.hover', borderRadius: 0.5, flexShrink: 0 }} />
                        )}
                        <Typography variant="caption" noWrap sx={{ flex: 1 }}>{c.card_name}</Typography>
                        {c.notFound && (
                          <Typography variant="caption" color="error" sx={{ flexShrink: 0 }}>?</Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : previewUrl && (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Deck photo"
                    sx={{ maxWidth: '100%', maxHeight: 180, borderRadius: 1, objectFit: 'contain' }}
                  />
                )}
              </Stack>
            </DialogContent>
          </Dialog>
        );
      })()}

      {/* ── Scan Results Dialog (edit mode) ── */}
      <Dialog open={!!scanResults} onClose={() => { setScanResults(null); setCropMap({}); }} maxWidth="xs" fullWidth>
        <DialogTitle>
          Scan Results
          <IconButton onClick={() => { setScanResults(null); setCropMap({}); }} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {scanResults && scanResults.length === 0 ? (
            <Typography color="text.secondary">No new cards were identified.</Typography>
          ) : (
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {scanResults?.length} card{scanResults?.length !== 1 ? 's' : ''} added to your deck:
              </Typography>
              {scanResults?.map((c) => (
                <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {c.notFound ? (
                    cropMap[c.id] ? (
                      <Box
                        component="img"
                        src={cropMap[c.id]}
                        alt={c.card_name}
                        sx={{ width: 36, height: 50, borderRadius: 0.5, objectFit: 'cover', flexShrink: 0, opacity: 0.85 }}
                      />
                    ) : (
                      <Box sx={{ width: 36, height: 50, bgcolor: 'action.hover', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CircularProgress size={16} />
                      </Box>
                    )
                  ) : c.image_uri ? (
                    <Box component="img" src={c.image_uri} alt={c.card_name} sx={{ width: 36, height: 50, borderRadius: 0.5, objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <Box sx={{ width: 36, height: 50, bgcolor: 'action.hover', borderRadius: 0.5, flexShrink: 0 }} />
                  )}
                  <Box>
                    <Typography variant="body2">{c.card_name}</Typography>
                    {c.notFound && <Typography variant="caption" color="error">Not found on Scryfall</Typography>}
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => { setScanResults(null); setCropMap({}); }}>Done</Button>
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
