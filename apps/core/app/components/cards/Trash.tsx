'use client';

/**
 * Trash — presentational panel listing soft-deleted decks and lists.
 *
 * Decks and lists are PEERS. Each row is independently restorable.
 * Restoring a deck does NOT restore its attached lists, and vice versa.
 *
 * This component owns NO data fetching and makes NO API calls.
 * The caller provides `items` and handles restoration via `onRestore`.
 */

import { useState } from 'react';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StyleIcon from '@mui/icons-material/Style';
import LayersIcon from '@mui/icons-material/Layers';

// ── Types ─────────────────────────────────────────────────────────────────────

export type TrashItem =
  | {
      kind: 'deck';
      id: string;
      name: string;
      deletedAt: string;
      cardCount: number;
      attachedListCount: number;
    }
  | {
      kind: 'list';
      id: string;
      name: string;
      deletedAt: string;
      cardCount: number;
      deckName: string | null;
    };

export interface TrashProps {
  items: TrashItem[];
  onRestore: (item: TrashItem) => void | Promise<void>;
  loading?: boolean;
  emptyMessage?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const RETENTION_DAYS = 30;
const WARNING_THRESHOLD = 3;
const SKELETON_COUNT = 4;

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysRemaining(deletedAt: string): number {
  const deleted = dayjs(deletedAt);
  const expiry = deleted.add(RETENTION_DAYS, 'day');
  const diff = expiry.diff(dayjs(), 'day');
  // Clamp to [0, RETENTION_DAYS] — never show negative
  return Math.max(0, Math.min(diff, RETENTION_DAYS));
}

function DaysRemainingBadge({ deletedAt }: { deletedAt: string }) {
  const days = daysRemaining(deletedAt);
  const isWarning = days <= WARNING_THRESHOLD;

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {isWarning && (
        <WarningAmberIcon
          fontSize="small"
          sx={{ color: 'warning.main' }}
          aria-hidden
        />
      )}
      <Typography
        variant="caption"
        sx={{
          color: isWarning ? 'warning.main' : 'text.secondary',
          fontWeight: isWarning ? 700 : 400,
          whiteSpace: 'nowrap',
        }}
      >
        {days === 0 ? 'Expires today' : `${days}d remaining`}
      </Typography>
    </Stack>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────

interface TrashRowProps {
  item: TrashItem;
  onRestore: (item: TrashItem) => void | Promise<void>;
}

function TrashRow({ item, onRestore }: TrashRowProps) {
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await onRestore(item);
    } finally {
      setRestoring(false);
    }
  };

  const kindLabel = item.kind === 'deck' ? 'Deck' : 'List';
  const ariaLabel = `Restore ${item.kind} ${item.name}`;

  const kindChip =
    item.kind === 'deck' ? (
      <Chip
        icon={<LayersIcon />}
        label="Deck"
        size="small"
        color="primary"
        variant="outlined"
        sx={{ flexShrink: 0 }}
      />
    ) : (
      <Chip
        icon={<StyleIcon />}
        label="List"
        size="small"
        color="secondary"
        variant="outlined"
        sx={{ flexShrink: 0 }}
      />
    );

  const subtitle =
    item.kind === 'deck'
      ? `${item.cardCount} card${item.cardCount !== 1 ? 's' : ''} · ${item.attachedListCount} list${item.attachedListCount !== 1 ? 's' : ''} attached`
      : item.deckName
        ? `${item.cardCount} card${item.cardCount !== 1 ? 's' : ''} · from deck "${item.deckName}"`
        : `${item.cardCount} card${item.cardCount !== 1 ? 's' : ''} · standalone`;

  return (
    <ListItem
      disableGutters
      sx={{
        px: 0,
        py: 0.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 'none' },
        // Stack vertically on very narrow viewports
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      {/* Left: kind + name + meta */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
        {kindChip}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={item.name}
          >
            {item.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>

      {/* Right: days remaining + restore button */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ flexShrink: 0, ml: 'auto' }}
      >
        <DaysRemainingBadge deletedAt={item.deletedAt} />
        <Button
          size="small"
          variant="outlined"
          startIcon={<RestoreIcon />}
          onClick={handleRestore}
          loading={restoring}
          aria-label={ariaLabel}
          sx={{ whiteSpace: 'nowrap', minWidth: 88 }}
        >
          Restore
        </Button>
      </Stack>
    </ListItem>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

interface TrashSectionProps {
  title: string;
  items: TrashItem[];
  onRestore: (item: TrashItem) => void | Promise<void>;
}

function TrashSection({ title, items, onRestore }: TrashSectionProps) {
  if (items.length === 0) return null;

  return (
    <Box>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ display: 'block', mb: 0.5, letterSpacing: '0.08em' }}
      >
        {title} ({items.length})
      </Typography>
      <List disablePadding>
        {items.map((item) => (
          <TrashRow key={`${item.kind}-${item.id}`} item={item} onRestore={onRestore} />
        ))}
      </List>
    </Box>
  );
}

// ── Skeleton loading state ────────────────────────────────────────────────────

function TrashSkeletonRows() {
  return (
    <List disablePadding>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <ListItem
          key={i}
          disableGutters
          sx={{
            px: 0,
            py: 0.75,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:last-child': { borderBottom: 'none' },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
            <Skeleton variant="rounded" width={60} height={24} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="45%" height={20} />
              <Skeleton variant="text" width="30%" height={16} />
            </Box>
            <Skeleton variant="rounded" width={88} height={32} sx={{ ml: 'auto' }} />
          </Stack>
        </ListItem>
      ))}
    </List>
  );
}

// ── Trash (main export) ───────────────────────────────────────────────────────

export function Trash({
  items,
  onRestore,
  loading = false,
  emptyMessage = 'Trash is empty.',
}: TrashProps) {
  const decks = items.filter((i): i is Extract<TrashItem, { kind: 'deck' }> => i.kind === 'deck');
  const lists = items.filter((i): i is Extract<TrashItem, { kind: 'list' }> => i.kind === 'list');

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <DeleteIcon color="action" fontSize="small" aria-hidden />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Trash
          </Typography>
          {!loading && items.length > 0 && (
            <Chip
              label={items.length}
              size="small"
              variant="outlined"
              sx={{ ml: 0.5 }}
            />
          )}
        </Stack>

        {/* Retention notice */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Items are permanently deleted after {RETENTION_DAYS} days. Restoring a deck does not
          restore its lists, and vice versa.
        </Typography>

        {/* Content */}
        {loading ? (
          <TrashSkeletonRows />
        ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        ) : (
          <Stack spacing={3}>
            <TrashSection title="Decks" items={decks} onRestore={onRestore} />
            <TrashSection title="Lists" items={lists} onRestore={onRestore} />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
