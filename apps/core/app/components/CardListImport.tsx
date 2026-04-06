'use client';

import { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { parseImport } from '@/lib/parseImport';
import type { ParsedCard } from '@/lib/parseImport';

interface Props {
  /** Called with the parsed cards when import text changes. */
  onImport: (cards: ParsedCard[], deckName: string | null) => void;
}

/**
 * Reusable card list import UI — textarea + file upload + parsed summary.
 * Used on new deck, decklist edit, and list detail edit pages.
 */
export function CardListImport({ onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importText,  setImportText]  = useState('');
  const [parsedCards, setParsedCards] = useState<ParsedCard[]>([]);
  const [parseError,  setParseError]  = useState<string | null>(null);

  const applyImport = (raw: string) => {
    setImportText(raw);
    setParseError(null);
    if (!raw.trim()) { setParsedCards([]); return; }

    const { cards, deckName } = parseImport(raw);

    if (cards.length === 0) {
      setParseError('No cards recognized — check the format and try again.');
      setParsedCards([]);
      return;
    }

    setParsedCards(cards);
    onImport(cards, deckName);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => applyImport((ev.target?.result as string) ?? '');
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => applyImport((ev.target?.result as string) ?? '');
    reader.readAsText(file);
  };

  const totalCards        = parsedCards.reduce((s, c) => s + c.quantity, 0);
  const detectedCommander = parsedCards.find((c) => c.is_commander);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 0.5 }}>Import Card List</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        TCGPlayer, Moxfield, Archidekt, Arena, MTGO, Tappedout, or TTS JSON
      </Typography>

      <TextField
        label="Paste card list"
        multiline
        rows={10}
        fullWidth
        value={importText}
        onChange={(e) => applyImport(e.target.value)}
        placeholder={
          '1 Sol Ring\n1 Command Tower\n4 Island\n\n' +
          '// Commander\n1 Atraxa, Praetors\u2019 Voice\n\n' +
          'Or paste a TTS JSON export\u2026'
        }
        slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: '0.85rem' } } }}
      />

      <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 2 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="caption" color="text.secondary">or</Typography>
        <Divider sx={{ flex: 1 }} />
      </Stack>

      <Box
        sx={{
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          '&:hover': { borderColor: 'primary.main' },
        }}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept=".txt,.json"
          onChange={handleFileChange}
        />
        <FileUploadIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
          Click or drag a <strong>.txt</strong> or <strong>.json</strong> file
        </Typography>
      </Box>

      {parseError && (
        <Alert severity="warning" sx={{ mt: 2 }} onClose={() => setParseError(null)}>
          {parseError}
        </Alert>
      )}

      {parsedCards.length > 0 && (
        <Stack direction="row" sx={{ mt: 2, gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`${totalCards} cards \u00b7 ${parsedCards.length} unique`}
            color="success"
            size="small"
          />
          {detectedCommander && (
            <Chip
              label={`Commander: ${detectedCommander.card_name}`}
              color="primary"
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      )}
    </>
  );
}
