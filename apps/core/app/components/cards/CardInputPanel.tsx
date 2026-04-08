'use client';

/**
 * CardInputPanel — unified card-input surface for any edit mode.
 *
 * Provides four input methods (Lookup, Import file, Paste text, Scan) under
 * a shared tab bar. All methods emit Card[] into a caller-managed buffer via
 * onBufferChange. Dedup / singleton rules are applied uniformly here before
 * the caller ever sees the new buffer.
 *
 * The panel knows nothing about decks vs lists. The `format` prop (used to
 * default the singleton toggle) is passed in by the caller; it is never
 * inferred from deck or list identity.
 *
 * Peers rule: CardInputPanel is a pure input surface. The caller owns the
 * buffer state machine. When a pending "Keep both vs Merge" confirmation is
 * later resolved by the user, the CALLER should re-run mergeIntoBuffer against
 * the rest of the buffer to apply the decision consistently.
 *
 * Event surfacing:
 *   - duplicate        → Snackbar "Already in list: <name>"
 *   - name-fallback-warn → Dialog with "Merge" / "Keep both" (queued, shown one at a time)
 *   - merged-printing  → Snackbar "Merged with existing <name>"
 *   - incremented      → not surfaced (qty change is self-evident in the card list)
 */

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

import { CardLookupField } from '@/components/cards/CardLookupField';
import { CardLookupTips } from '@/components/cards/CardLookupTips';
import { CardImportPanel } from '@/components/cards/CardImportPanel';
import { ScanInput } from '@/components/scan/ScanInput';
import { mergeIntoBuffer } from '@/lib/cards/mergeIntoBuffer';
import type { MergeEvent } from '@/lib/cards/mergeIntoBuffer';
import type { Card } from '@/lib/cards/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CardInputPanelProps {
  /** Current buffer contents — used for dedup checks. */
  buffer: Card[];
  /** Called when the buffer should change. Caller applies the new value. */
  onBufferChange: (cards: Card[]) => void;
  /** 'commander' | 'standard' | undefined — drives default singleton mode. */
  format?: string;
  /** Default tab when first mounted. */
  defaultTab?: 'lookup' | 'import' | 'paste' | 'scan';
  /** Optional override of the singleton toggle initial value. */
  defaultSingleton?: boolean;
}

// ── Snackbar toast shape ──────────────────────────────────────────────────────

interface ToastState {
  message: string;
  severity: 'info' | 'success';
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TAB_KEYS = ['lookup', 'import', 'paste', 'scan'] as const;
type TabKey = typeof TAB_KEYS[number];

// ── Tab config ────────────────────────────────────────────────────────────────

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ReactElement;
  ariaLabel: string;
}

const TAB_CONFIGS: TabConfig[] = [
  {
    key: 'lookup',
    label: 'Lookup',
    icon: <SearchIcon fontSize="small" />,
    ariaLabel: 'Lookup tab — search for a card by name or Scryfall query',
  },
  {
    key: 'import',
    label: 'Import file',
    icon: <FileUploadIcon fontSize="small" />,
    ariaLabel: 'Import file tab — upload a card list file',
  },
  {
    key: 'paste',
    label: 'Paste text',
    icon: <ContentPasteIcon fontSize="small" />,
    ariaLabel: 'Paste text tab — paste a card list as plain text',
  },
  {
    key: 'scan',
    label: 'Scan',
    icon: <CameraAltIcon fontSize="small" />,
    ariaLabel: 'Scan tab — use camera to recognise cards (coming soon)',
  },
];

// ── Main component ────────────────────────────────────────────────────────────

export function CardInputPanel({
  buffer,
  onBufferChange,
  format,
  defaultTab = 'lookup',
  defaultSingleton,
}: CardInputPanelProps) {
  const theme    = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('sm'));

  // Singleton toggle — defaults to ON for commander format
  const [singleton, setSingleton] = useState<boolean>(
    defaultSingleton ?? (format === 'commander' ? true : false),
  );

  // Active tab
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);

  // Bottom-sheet drawer (narrow viewports)
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Toast state ──────────────────────────────────────────────────────────────

  const [toast, setToast] = useState<ToastState | null>(null);

  // ── Name-fallback dialog queue ───────────────────────────────────────────────
  //
  // name-fallback-warn events require a user decision (Merge / Keep both).
  // We queue them and process them one at a time. After the user decides,
  // the resolved event is removed and the next one (if any) is shown.
  //
  // Pending events carry the buffer state at the point they were emitted so
  // that a "Merge" decision can be applied consistently, even if the user
  // resolves multiple dialogs from the same merge batch.

  interface PendingFallback {
    event: Extract<MergeEvent, { kind: 'name-fallback-warn' }>;
    /** Buffer snapshot at the time this event was queued. */
    bufferAtEnqueue: Card[];
    /** Singleton value at the time this event was queued. */
    singletonAtEnqueue: boolean;
  }

  const [fallbackQueue, setFallbackQueue] = useState<PendingFallback[]>([]);

  // The dialog is open whenever the queue is non-empty
  const pendingFallback = fallbackQueue[0] ?? null;

  // ── Merge helper ─────────────────────────────────────────────────────────────

  const merge = (incoming: Card[]) => {
    const { merged, events } = mergeIntoBuffer(buffer, incoming, singleton);

    // Apply the merged buffer immediately (events that don't need user input)
    onBufferChange(merged);

    // Surface events
    const newFallbacks: PendingFallback[] = [];
    for (const event of events) {
      switch (event.kind) {
        case 'duplicate':
          setToast({ message: `Already in list: ${event.card.card_name}`, severity: 'info' });
          break;

        case 'merged-printing':
          setToast({
            message: `Merged with existing ${event.existingCard.card_name}`,
            severity: 'info',
          });
          break;

        case 'name-fallback-warn':
          // Queue for sequential dialog presentation
          newFallbacks.push({
            event: event as Extract<MergeEvent, { kind: 'name-fallback-warn' }>,
            bufferAtEnqueue: merged,
            singletonAtEnqueue: singleton,
          });
          break;

        case 'incremented':
          // Intentionally not surfaced — qty change is visible in the card list.
          break;
      }
    }

    if (newFallbacks.length > 0) {
      setFallbackQueue((q) => [...q, ...newFallbacks]);
    }
  };

  // ── Dialog resolution ─────────────────────────────────────────────────────────

  const resolveFallback = (decision: 'merge' | 'keep-both') => {
    if (!pendingFallback) return;

    const { event, bufferAtEnqueue, singletonAtEnqueue } = pendingFallback;

    if (decision === 'merge') {
      // Re-run mergeIntoBuffer with the incoming card given a scryfall_id so it
      // hits the ID-match path (or name-match without fallback warning) rather
      // than looping back to another name-fallback-warn. We assign the existing
      // card's scryfall_id so dedup treats them as the same printing.
      const resolvedCard: Card = {
        ...event.card,
        scryfall_id: event.existingCard.scryfall_id,
      };
      const { merged: remerged } = mergeIntoBuffer(
        bufferAtEnqueue,
        [resolvedCard],
        singletonAtEnqueue,
      );
      onBufferChange(remerged);
    }
    // decision === 'keep-both' → buffer already has the card added at merge time;
    // in the name-fallback path the buffer was NOT changed (card left out), so
    // we need to push it as a new row.
    if (decision === 'keep-both') {
      onBufferChange([...bufferAtEnqueue, { ...event.card }]);
    }

    // Advance the queue
    setFallbackQueue((q) => q.slice(1));
  };

  // ── Tab content renderer ─────────────────────────────────────────────────────

  const renderTabContent = () => {
    switch (activeTab) {
      case 'lookup':
        return (
          <CardLookupField
            singletonMode={singleton}
            onAdd={(cards) => merge(cards)}
          />
        );

      case 'import':
        return (
          <Box>
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
              <CardLookupTips />
            </Stack>
            <CardImportPanel
              mode="file"
              onCards={(cards) => merge(cards)}
            />
          </Box>
        );

      case 'paste':
        return (
          <Box>
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
              <CardLookupTips />
            </Stack>
            <CardImportPanel
              mode="paste"
              onCards={(cards) => merge(cards)}
            />
          </Box>
        );

      case 'scan':
        return (
          <ScanInput onCardsRecognized={(cards) => merge(cards)} />
        );
    }
  };

  // ── Tab bar (shared between wide and narrow layouts) ─────────────────────────

  const tabBar = (
    <Tabs
      value={activeTab}
      onChange={(_, v: TabKey) => {
        setActiveTab(v);
        if (isNarrow) setDrawerOpen(false);
      }}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="Card input method"
      sx={{
        borderBottom: isNarrow ? 'none' : '1px solid',
        borderColor: 'divider',
        minHeight: 40,
        '& .MuiTab-root': { minHeight: 40, py: 0.5, fontSize: '0.78rem' },
      }}
    >
      {TAB_CONFIGS.map((cfg) => (
        <Tab
          key={cfg.key}
          value={cfg.key}
          label={cfg.label}
          icon={cfg.icon}
          iconPosition="start"
          aria-label={cfg.ariaLabel}
        />
      ))}
    </Tabs>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: '100%' }}>
      {/* ── Singleton toggle — always visible above the tab bar ───────────── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={singleton}
              onChange={(e) => setSingleton(e.target.checked)}
              size="small"
              inputProps={{
                'aria-label': 'Singleton mode: no duplicate cards allowed',
              }}
            />
          }
          label="Singleton (no duplicates)"
          slotProps={{
            typography: { variant: 'body2' },
          }}
        />
      </Stack>

      {/* ── Wide layout: horizontal tab bar inline ───────────────────────── */}
      {!isNarrow && tabBar}

      {/* ── Narrow layout: hamburger FAB + bottom-sheet drawer ───────────── */}
      {isNarrow && (
        <>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <IconButton
              size="small"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open card input method selector"
              aria-haspopup="dialog"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1,
                gap: 0.5,
              }}
            >
              <MenuIcon fontSize="small" />
              <Box component="span" sx={{ fontSize: '0.78rem', fontWeight: 500 }}>
                {TAB_CONFIGS.find((c) => c.key === activeTab)?.label}
              </Box>
            </IconButton>
          </Stack>

          <SwipeableDrawer
            anchor="bottom"
            open={drawerOpen}
            onOpen={() => setDrawerOpen(true)}
            onClose={() => setDrawerOpen(false)}
            disableSwipeToOpen
            PaperProps={{
              sx: {
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                maxHeight: '60vh',
              },
            }}
          >
            <Box sx={{ pt: 1, pb: 2 }}>
              {/* Drag handle */}
              <Box
                sx={{
                  width: 32,
                  height: 4,
                  bgcolor: 'divider',
                  borderRadius: 2,
                  mx: 'auto',
                  mb: 1,
                }}
              />
              {tabBar}
            </Box>
          </SwipeableDrawer>
        </>
      )}

      {/* ── Tab content area ─────────────────────────────────────────────── */}
      <Box sx={{ pt: isNarrow ? 0 : 2 }}>
        {renderTabContent()}
      </Box>

      {/* ── Toast (duplicate / merged-printing notices) ──────────────────── */}
      <Snackbar
        open={toast !== null}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast?.severity ?? 'info'}
          variant="filled"
          onClose={() => setToast(null)}
          sx={{ width: '100%' }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>

      {/* ── Name-fallback dialog (shown one at a time from the queue) ─────── */}
      <Dialog
        open={pendingFallback !== null}
        onClose={() => resolveFallback('keep-both')}
        aria-labelledby="name-fallback-dialog-title"
      >
        <DialogTitle id="name-fallback-dialog-title">
          Possible duplicate
        </DialogTitle>
        <DialogContent>
          {pendingFallback && (
            <>
              <strong>{pendingFallback.event.card.card_name}</strong> looks like
              it might already be in your list as{' '}
              <strong>{pendingFallback.event.existingCard.card_name}</strong>.
              What would you like to do?
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => resolveFallback('keep-both')} color="inherit">
            Keep both
          </Button>
          <Button
            onClick={() => resolveFallback('merge')}
            variant="contained"
            color="primary"
          >
            Merge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
