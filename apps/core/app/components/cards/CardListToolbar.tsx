'use client';

/**
 * CardListToolbar — sticky toolbar above any editable CardListView.
 *
 * Composes CardInputPanel (Add), CardExportPanel (Export), and SaveToListDialog
 * (Save) into a single AppBar. All data flows through props; this component
 * owns only open/close state for the three panels and the overflow menu.
 *
 * Responsive strategy:
 *   - Primary actions (Add, view-mode toggle, edit-mode toggle, Undo/Redo, Save)
 *     are always visible.
 *   - Secondary actions (Export, Clear, Detach from deck) collapse into an
 *     overflow <Menu> on narrow viewports (< sm breakpoint).
 */

import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GridViewIcon from '@mui/icons-material/GridView';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import SubjectIcon from '@mui/icons-material/Subject';
import TableChartIcon from '@mui/icons-material/TableChart';
import UndoIcon from '@mui/icons-material/Undo';

import { CardInputPanel } from '@/components/cards/CardInputPanel';
import { CardExportPanel } from '@/components/cards/CardExportPanel';
import { SaveToListDialog } from '@/components/cards/SaveToListDialog';
import type { SaveDestination } from '@/components/cards/SaveToListDialog';
import type { Card } from '@/lib/cards/types';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface CardListToolbarProps {
  buffer: Card[];
  onBufferChange: (cards: Card[]) => void;

  /** Format context for CardInputPanel singleton default */
  format?: string;

  /** View-mode controls */
  viewMode: 'gallery' | 'text' | 'breakdown';
  onViewModeChange: (mode: 'gallery' | 'text' | 'breakdown') => void;

  /** Edit mode controls */
  editMode: boolean;
  onEditModeChange: (editMode: boolean) => void;

  /** Undo/redo wiring */
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;

  /** Save / clear actions */
  onSave: (destination: SaveDestination) => void;
  onClear: () => void;

  /** Optional list metadata for export */
  listId?: string;

  /** When set, the "detach from deck" button is rendered */
  deckContext?: { id: string; name: string } | null;
  onDetachFromDeck?: () => void;

  /** Existing decks/lists for SaveToListDialog */
  decks?: Array<{ id: string; name: string }>;
  lists?: Array<{ id: string; name: string }>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CardListToolbar({
  buffer,
  onBufferChange,
  format,
  viewMode,
  onViewModeChange,
  editMode,
  onEditModeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onClear,
  listId,
  deckContext,
  onDetachFromDeck,
  decks = [],
  lists = [],
}: CardListToolbarProps) {
  const theme    = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('sm'));

  // ── Panel open/close state ─────────────────────────────────────────────────

  const [addOpen,    setAddOpen]    = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [saveOpen,   setSaveOpen]   = useState(false);

  // Anchor elements for popovers
  const [addAnchor,    setAddAnchor]    = useState<HTMLElement | null>(null);
  const [exportAnchor, setExportAnchor] = useState<HTMLElement | null>(null);

  // Overflow menu anchor
  const [overflowAnchor, setOverflowAnchor] = useState<HTMLElement | null>(null);
  const overflowOpen = Boolean(overflowAnchor);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleAddClick(e: React.MouseEvent<HTMLElement>) {
    setAddAnchor(e.currentTarget);
    setAddOpen(true);
  }

  function handleAddClose() {
    setAddOpen(false);
    setAddAnchor(null);
  }

  function handleExportClick(e: React.MouseEvent<HTMLElement>) {
    setExportAnchor(e.currentTarget);
    setExportOpen(true);
    setOverflowAnchor(null);
  }

  function handleExportClose() {
    setExportOpen(false);
    setExportAnchor(null);
  }

  function handleSaveClick() {
    setSaveOpen(true);
    setOverflowAnchor(null);
  }

  function handleSaveConfirm(destination: SaveDestination) {
    onSave(destination);
    setSaveOpen(false);
  }

  function handleSaveCancel() {
    setSaveOpen(false);
  }

  function handleClear() {
    setOverflowAnchor(null);
    const confirmed = window.confirm(
      `Clear all ${buffer.length} card${buffer.length === 1 ? '' : 's'} from the buffer? This cannot be undone except via Cmd+Z.`,
    );
    if (confirmed) {
      onClear();
    }
  }

  function handleDetach() {
    setOverflowAnchor(null);
    if (!deckContext) return;
    const confirmed = window.confirm(
      `Detach this list from deck "${deckContext.name}"? The deck and list will both be kept — only the link between them will be removed.`,
    );
    if (confirmed) {
      onDetachFromDeck?.();
    }
  }

  function handleViewModeChange(
    _: React.MouseEvent<HTMLElement>,
    newMode: 'gallery' | 'text' | 'breakdown' | null,
  ) {
    // ToggleButtonGroup can emit null if the selected button is clicked again;
    // keep the current selection in that case.
    if (newMode !== null) {
      onViewModeChange(newMode);
    }
  }

  // ── Secondary actions (collapse into overflow on narrow viewports) ──────────

  const secondaryActions = (
    <>
      {/* Export */}
      <Tooltip title="Export cards">
        <span>
          <IconButton
            aria-label="Export cards"
            onClick={handleExportClick}
            size="small"
            disabled={buffer.length === 0}
          >
            <FileDownloadIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Clear */}
      <Tooltip title="Clear buffer">
        <span>
          <IconButton
            aria-label="Clear all cards from buffer"
            onClick={handleClear}
            size="small"
            color="error"
            disabled={buffer.length === 0}
          >
            <ClearAllIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Detach from deck — only when deckContext is set */}
      {deckContext && (
        <Tooltip title={`Detach from deck: ${deckContext.name}`}>
          <IconButton
            aria-label={`Detach list from deck ${deckContext.name}`}
            onClick={handleDetach}
            size="small"
          >
            <LinkOffIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  // ── Overflow menu items (same actions, menu form) ───────────────────────────

  const overflowMenuItems = (
    <Menu
      anchorEl={overflowAnchor}
      open={overflowOpen}
      onClose={() => setOverflowAnchor(null)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem
        onClick={handleExportClick}
        disabled={buffer.length === 0}
        aria-label="Export cards"
      >
        <FileDownloadIcon fontSize="small" sx={{ mr: 1 }} />
        Export
      </MenuItem>

      <MenuItem
        onClick={handleClear}
        disabled={buffer.length === 0}
        aria-label="Clear all cards from buffer"
        sx={{ color: 'error.main' }}
      >
        <ClearAllIcon fontSize="small" sx={{ mr: 1 }} />
        Clear
      </MenuItem>

      {deckContext && (
        <MenuItem
          onClick={handleDetach}
          aria-label={`Detach list from deck ${deckContext.name}`}
        >
          <LinkOffIcon fontSize="small" sx={{ mr: 1 }} />
          Detach from deck
        </MenuItem>
      )}
    </Menu>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{
          top: 0,
          zIndex: (t) => t.zIndex.appBar,
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            gap: 0.5,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            py: 0.5,
            minHeight: 48,
          }}
        >
          {/* 1. Add button — opens CardInputPanel in a popover */}
          <Tooltip title="Add cards">
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              aria-label="Add cards to buffer"
              aria-haspopup="dialog"
              sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              Add
            </Button>
          </Tooltip>

          {/* 2. View mode toggle — always visible */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            aria-label="View mode"
            sx={{ flexShrink: 0 }}
          >
            <ToggleButton value="gallery" aria-label="Gallery view">
              <Tooltip title="Gallery">
                <GridViewIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="text" aria-label="Text view">
              <Tooltip title="Text list">
                <SubjectIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="breakdown" aria-label="Breakdown view">
              <Tooltip title="Breakdown by type">
                <TableChartIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* 3. Edit mode toggle — always visible */}
          <Tooltip title={editMode ? 'Exit edit mode' : 'Enter edit mode'}>
            <ToggleButton
              value="edit"
              selected={editMode}
              onChange={() => onEditModeChange(!editMode)}
              size="small"
              aria-label={editMode ? 'Exit edit mode' : 'Enter edit mode'}
              aria-pressed={editMode}
              sx={{ flexShrink: 0 }}
            >
              {editMode ? (
                <EditOffIcon fontSize="small" />
              ) : (
                <EditIcon fontSize="small" />
              )}
            </ToggleButton>
          </Tooltip>

          {/* 4. Undo / Redo — always visible */}
          <Tooltip title="Undo (Cmd+Z)">
            <span>
              <IconButton
                onClick={onUndo}
                disabled={!canUndo}
                aria-label="Undo"
                aria-disabled={!canUndo}
                size="small"
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo (Cmd+Shift+Z)">
            <span>
              <IconButton
                onClick={onRedo}
                disabled={!canRedo}
                aria-label="Redo"
                aria-disabled={!canRedo}
                size="small"
              >
                <RedoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {/* Spacer — pushes Save (and secondary actions on wide) to the right */}
          <Box sx={{ flex: 1 }} />

          {/* Secondary actions: inline on wide, overflow menu on narrow */}
          {isNarrow ? (
            <Tooltip title="More actions">
              <IconButton
                onClick={(e) => setOverflowAnchor(e.currentTarget)}
                aria-label="More actions"
                aria-haspopup="menu"
                aria-expanded={overflowOpen}
                size="small"
                sx={{ flexShrink: 0 }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            secondaryActions
          )}

          {/* 6. Save — always visible */}
          <Tooltip title="Save cards">
            <Button
              variant="contained"
              size="small"
              startIcon={<SaveIcon />}
              onClick={handleSaveClick}
              aria-label="Save cards to a list or deck"
              aria-haspopup="dialog"
              sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              Save
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* ── Overflow menu ───────────────────────────────────────────────────── */}
      {overflowMenuItems}

      {/* ── CardInputPanel — popover on wide, full-width dialog on narrow ──── */}
      {isNarrow ? (
        <Dialog
          open={addOpen}
          onClose={handleAddClose}
          fullWidth
          maxWidth="sm"
          aria-label="Add cards"
        >
          <DialogTitle
            sx={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              pb: 1,
            }}
          >
            <Typography variant="h6" component="span">
              Add cards
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <CardInputPanel
              buffer={buffer}
              onBufferChange={onBufferChange}
              format={format}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Popover
          open={addOpen}
          anchorEl={addAnchor}
          onClose={handleAddClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                width: 480,
                maxWidth: '95vw',
                p: 2,
                mt: 0.5,
              },
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
            Add cards
          </Typography>
          <CardInputPanel
            buffer={buffer}
            onBufferChange={onBufferChange}
            format={format}
          />
        </Popover>
      )}

      {/* ── CardExportPanel — popover (both breakpoints; content is compact) ── */}
      <Popover
        open={exportOpen}
        anchorEl={exportAnchor}
        onClose={handleExportClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxWidth: '95vw',
              p: 2,
              mt: 0.5,
            },
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          Export
        </Typography>
        <CardExportPanel cards={buffer} listId={listId} />
      </Popover>

      {/* ── SaveToListDialog ────────────────────────────────────────────────── */}
      <SaveToListDialog
        open={saveOpen}
        buffer={buffer}
        deckContext={deckContext}
        decks={decks}
        lists={lists}
        onCancel={handleSaveCancel}
        onConfirm={handleSaveConfirm}
      />
    </>
  );
}
