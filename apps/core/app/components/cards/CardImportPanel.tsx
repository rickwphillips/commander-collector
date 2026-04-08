'use client';

import { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { parseImport } from '@/lib/parseImport';
import type { Card } from '@/lib/cards/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CardImportPanelProps {
  /** Called with the parsed cards when import succeeds. */
  onCards: (cards: Card[]) => void;
  /** Called when the parser produces an error. Also surfaced inline. */
  onError?: (err: string) => void;
  /**
   * File types accepted by the file-input. Defaults to ['.txt', '.csv', '.dec'].
   * Note: .json (TTS) is always handled by parseImport internally; add it here
   * if you want it selectable via the file picker too.
   */
  acceptFormats?: string[];
  /**
   * Which import surfaces to render.
   * 'file'  — dropzone + choose-file only.
   * 'paste' — textarea only.
   * 'both'  — both (default).
   */
  mode?: 'file' | 'paste' | 'both';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PARSE_EMPTY_ERROR = 'No cards recognised — check the format and try again.';

const FORMAT_TIP =
  'Lines like "4 Lightning Bolt", "1x Sol Ring", or "1 Sol Ring (CMR) 472" all work. ' +
  'Section headers like "// Commander" are also supported.';

/**
 * Convert a ParsedCard[] (from parseImport) to Card[].
 *
 * ParsedCard already carries boolean is_commander / is_proxy and the required
 * card_name / quantity fields. The only required Card field not present in
 * ParsedCard is color_identity — default to '' (unknown, pre-Scryfall lookup).
 * All Scryfall-enriched fields are left absent; callers can enrich later.
 */
function parsedToCards(parsed: ReturnType<typeof parseImport>['cards']): Card[] {
  return parsed.map((p) => ({
    card_name:      p.card_name,
    quantity:       p.quantity,
    is_commander:   p.is_commander,
    is_proxy:       p.is_proxy,
    color_identity: '',
    scryfall_id:    null,
  }));
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface DropZoneProps {
  acceptAttr: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileRead: (raw: string) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
}

function DropZone({
  acceptAttr,
  fileInputRef,
  onFileRead,
  isDragging,
  setIsDragging,
}: DropZoneProps) {
  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => onFileRead((ev.target?.result as string) ?? '');
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label="Drop a card list file here, or click to choose a file"
      sx={{
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: 1,
        p: { xs: 2, sm: 3 },
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background-color 0.2s',
        bgcolor: isDragging ? 'action.hover' : 'transparent',
        '&:hover': { borderColor: 'primary.main' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
      }}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
    >
      {/* Real file input — hidden, but associated with the label via aria */}
      <input
        ref={fileInputRef}
        id="card-import-file-input"
        type="file"
        hidden
        accept={acceptAttr}
        aria-label="Choose a card list file to import"
        onChange={handleFileChange}
      />
      <FileUploadIcon sx={{ fontSize: { xs: 28, sm: 36 }, color: 'text.secondary', mb: 0.5 }} />
      <Typography variant="body2" color="text.secondary">
        Drag &amp; drop, or{' '}
        <Typography component="span" variant="body2" color="primary" sx={{ fontWeight: 600 }}>
          choose a file
        </Typography>
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
        {acceptAttr.replace(/\./g, '').split(',').join(', ').toUpperCase()}
      </Typography>
    </Box>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function CardImportPanel({
  onCards,
  onError,
  acceptFormats = ['.txt', '.csv', '.dec'],
  mode = 'both',
}: CardImportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pasteText,   setPasteText]   = useState('');
  const [parseError,  setParseError]  = useState<string | null>(null);
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const [isDragging,  setIsDragging]  = useState(false);

  // Shared parse-and-emit logic
  const runParse = (raw: string) => {
    setParseError(null);
    setParsedCount(null);

    if (!raw.trim()) return;

    const { cards } = parseImport(raw);

    if (cards.length === 0) {
      setParseError(PARSE_EMPTY_ERROR);
      onError?.(PARSE_EMPTY_ERROR);
      return;
    }

    setParsedCount(cards.reduce((s, c) => s + c.quantity, 0));
    onCards(parsedToCards(cards));
  };

  const handleFileRead = (raw: string) => runParse(raw);

  const handleParsePaste = () => runParse(pasteText);

  const acceptAttr = acceptFormats.join(',');

  const showFile  = mode === 'file'  || mode === 'both';
  const showPaste = mode === 'paste' || mode === 'both';

  return (
    <Box sx={{ width: '100%' }}>
      {/* ── Tips affordance ─────────────────────────────────────────────── */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary">
          Supported formats
        </Typography>
        <Tooltip title={FORMAT_TIP} placement="top" arrow>
          <HelpOutlineIcon
            fontSize="small"
            sx={{ color: 'text.disabled', cursor: 'help', fontSize: '1rem' }}
            aria-label="Format help: lines like 4 Lightning Bolt, 1x Sol Ring, or 1 Sol Ring (CMR) 472 all work"
          />
        </Tooltip>
      </Stack>

      {/* ── File upload surface ─────────────────────────────────────────── */}
      {showFile && (
        <DropZone
          acceptAttr={acceptAttr}
          fileInputRef={fileInputRef}
          onFileRead={handleFileRead}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      )}

      {/* ── Paste text surface ──────────────────────────────────────────── */}
      {showPaste && (
        <Box sx={{ mt: showFile ? 2 : 0 }}>
          <TextField
            label="Paste card list"
            multiline
            minRows={4}
            maxRows={12}
            fullWidth
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={
              '1 Sol Ring\n1 Command Tower\n4 Island\n\n' +
              '// Commander\n1 Atraxa, Praetors\u2019 Voice'
            }
            inputProps={{
              'aria-label': 'Paste card list text',
              style: { fontFamily: 'monospace', fontSize: '0.85rem' },
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleParsePaste}
            disabled={!pasteText.trim()}
            aria-label="Parse pasted card list"
            sx={{ mt: 1 }}
          >
            Parse
          </Button>
        </Box>
      )}

      {/* ── Inline error ────────────────────────────────────────────────── */}
      {parseError && (
        <Alert
          severity="warning"
          sx={{ mt: 1.5 }}
          onClose={() => setParseError(null)}
        >
          {parseError}
        </Alert>
      )}

      {/* ── Success summary ─────────────────────────────────────────────── */}
      {parsedCount !== null && parsedCount > 0 && !parseError && (
        <Chip
          label={`${parsedCount} card${parsedCount === 1 ? '' : 's'} ready`}
          color="success"
          size="small"
          sx={{ mt: 1.5 }}
        />
      )}
    </Box>
  );
}
