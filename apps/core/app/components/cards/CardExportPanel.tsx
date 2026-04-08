'use client';

import {
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import TableChartIcon from '@mui/icons-material/TableChart';

import { api } from '@/lib/api';
import type { Card } from '@/lib/cards/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CardExportPanelProps {
  /** Cards to export — required for TCGPlayer text and CSV. */
  cards: Card[];
  /**
   * List ID — required for TTS export. When absent, the TTS button is disabled
   * with an explanatory tooltip.
   */
  listId?: string;
  /**
   * Optional analytics callback fired after each successful export action.
   */
  onExport?: (format: 'tcg' | 'csv' | 'tts') => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a TCGPlayer-style text block: "<qty> <name>" per line. */
function buildTCGText(cards: Card[]): string {
  return cards
    .map((c) => `${c.quantity} ${c.card_name}`)
    .join('\n');
}

/** Build a CSV string with header row. */
function buildCSV(cards: Card[]): string {
  const header = 'name,quantity,scryfall_id,set,is_proxy';
  const rows = cards.map((c) => {
    const name      = `"${c.card_name.replace(/"/g, '""')}"`;
    const qty       = c.quantity;
    const sfId      = c.scryfall_id ?? '';
    const set       = ''; // not present on Card; leave blank per spec
    const isProxy   = c.is_proxy ? '1' : '0';
    return `${name},${qty},${sfId},${set},${isProxy}`;
  });
  return [header, ...rows].join('\n');
}

/** Trigger a browser download for the given text content. */
function triggerDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Copy text to the clipboard. */
async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CardExportPanel({ cards, listId, onExport }: CardExportPanelProps) {
  const hasCards = cards.length > 0;

  // ── TCGPlayer ──────────────────────────────────────────────────────────────

  const handleTCGCopy = async () => {
    await copyToClipboard(buildTCGText(cards));
    onExport?.('tcg');
  };

  const handleTCGDownload = () => {
    triggerDownload(buildTCGText(cards), 'decklist.txt', 'text/plain');
    onExport?.('tcg');
  };

  // ── CSV ────────────────────────────────────────────────────────────────────

  const handleCSVCopy = async () => {
    await copyToClipboard(buildCSV(cards));
    onExport?.('csv');
  };

  const handleCSVDownload = () => {
    triggerDownload(buildCSV(cards), 'decklist.csv', 'text/csv');
    onExport?.('csv');
  };

  // ── TTS ────────────────────────────────────────────────────────────────────

  const handleTTSDownload = async () => {
    if (!listId) return;
    const ttsData = await api.exportTTS({ listId });
    triggerDownload(
      JSON.stringify(ttsData, null, 2),
      'decklist_TTS.json',
      'application/json',
    );
    onExport?.('tts');
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const ttsButton = (
    <Button
      variant="outlined"
      startIcon={<TableChartIcon />}
      onClick={handleTTSDownload}
      disabled={!listId || !hasCards}
      aria-label="Download Tabletop Simulator JSON"
      fullWidth
      sx={{ justifyContent: 'flex-start' }}
    >
      Download .json (TTS)
    </Button>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* ── TCGPlayer ─────────────────────────────────────────── */}
      <Typography variant="overline" color="text.secondary">
        TCGPlayer Text
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ mt: 0.5, mb: 2 }}
      >
        <Button
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={handleTCGCopy}
          disabled={!hasCards}
          aria-label="Copy TCGPlayer text to clipboard"
          fullWidth
          sx={{ justifyContent: 'flex-start' }}
        >
          Copy to clipboard
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleTCGDownload}
          disabled={!hasCards}
          aria-label="Download TCGPlayer text file"
          fullWidth
          sx={{ justifyContent: 'flex-start' }}
        >
          Download .txt
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* ── CSV ───────────────────────────────────────────────── */}
      <Typography variant="overline" color="text.secondary">
        CSV
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ mt: 0.5, mb: 2 }}
      >
        <Button
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={handleCSVCopy}
          disabled={!hasCards}
          aria-label="Copy CSV to clipboard"
          fullWidth
          sx={{ justifyContent: 'flex-start' }}
        >
          Copy to clipboard
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleCSVDownload}
          disabled={!hasCards}
          aria-label="Download CSV file"
          fullWidth
          sx={{ justifyContent: 'flex-start' }}
        >
          Download .csv
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* ── TTS ───────────────────────────────────────────────── */}
      <Typography variant="overline" color="text.secondary">
        Tabletop Simulator
      </Typography>
      <Box sx={{ mt: 0.5 }}>
        {listId ? (
          ttsButton
        ) : (
          <Tooltip
            title="Save the list first to export to TTS."
            placement="top"
            arrow
          >
            {/* Tooltip requires a focusable child even when disabled — wrap in span */}
            <span style={{ display: 'block' }}>{ttsButton}</span>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
