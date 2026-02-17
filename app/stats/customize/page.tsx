'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Button,
  TextField,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageContainer } from '../../components/PageContainer';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { api } from '../../lib/api';
import { STATS_SECTIONS, getSectionDef } from '../../lib/statsSections';
import type { StatsSectionId } from '../../lib/statsSections';
import type { StatPanel } from '../../lib/types';

// Sortable item component
function SortableSection({ id, onRemove }: { id: StatsSectionId; onRemove: (id: StatsSectionId) => void }) {
  const def = getSectionDef(id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!def) return null;
  const Icon = def.icon;

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper',
      }}
    >
      <ListItemIcon sx={{ minWidth: 36, cursor: 'grab' }} {...attributes} {...listeners}>
        <DragIndicatorIcon color="action" />
      </ListItemIcon>
      <ListItemIcon sx={{ minWidth: 36 }}>
        <Icon color="primary" fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={def.label} secondary={def.description} />
      <ListItemSecondaryAction>
        <IconButton edge="end" size="small" onClick={() => onRemove(id)}>
          <RemoveCircleOutlineIcon fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default function CustomizePage() {
  const [loading, setLoading] = useState(true);
  const [panels, setPanels] = useState<StatPanel[]>([]);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  // Builder state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [panelName, setPanelName] = useState('');
  const [selectedSections, setSelectedSections] = useState<StatsSectionId[]>([]);
  const [saving, setSaving] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<StatPanel | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    fetchPanels();
  }, []);

  const fetchPanels = async () => {
    try {
      const data = await api.getStatPanels();
      setPanels(data.own);
    } catch {
      setSnackbar('Failed to load panels');
    } finally {
      setLoading(false);
    }
  };

  const availableSections = STATS_SECTIONS.filter(
    s => !selectedSections.includes(s.id)
  );

  const handleAddSection = (id: StatsSectionId) => {
    setSelectedSections(prev => [...prev, id]);
  };

  const handleRemoveSection = useCallback((id: StatsSectionId) => {
    setSelectedSections(prev => prev.filter(s => s !== id));
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelectedSections(prev => {
        const oldIndex = prev.indexOf(active.id as StatsSectionId);
        const newIndex = prev.indexOf(over.id as StatsSectionId);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const startNew = () => {
    setEditingId(null);
    setPanelName('');
    setSelectedSections([]);
    setShowBuilder(true);
  };

  const startEdit = (panel: StatPanel) => {
    setEditingId(panel.id);
    setPanelName(panel.name);
    setSelectedSections(panel.sections as StatsSectionId[]);
    setShowBuilder(true);
  };

  const cancelBuilder = () => {
    setShowBuilder(false);
    setEditingId(null);
    setPanelName('');
    setSelectedSections([]);
  };

  const handleSave = async () => {
    if (!panelName.trim()) {
      setSnackbar('Panel name is required');
      return;
    }
    if (selectedSections.length === 0) {
      setSnackbar('At least one section is required');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.updateStatPanel(editingId, {
          name: panelName.trim(),
          sections: selectedSections,
        });
        setSnackbar('Panel updated');
      } else {
        await api.createStatPanel({
          name: panelName.trim(),
          sections: selectedSections,
        });
        setSnackbar('Panel created');
      }
      cancelBuilder();
      fetchPanels();
    } catch (err) {
      setSnackbar(err instanceof Error ? err.message : 'Failed to save panel');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteStatPanel(deleteTarget.id);
      setSnackbar('Panel deleted');
      setDeleteTarget(null);
      fetchPanels();
    } catch {
      setSnackbar('Failed to delete panel');
    }
  };

  const handleShareToggle = async (panel: StatPanel) => {
    try {
      const updated = await api.updateStatPanel(panel.id, { is_shared: !panel.is_shared });
      setPanels(prev => prev.map(p => p.id === panel.id ? updated : p));
      setSnackbar(updated.is_shared ? 'Panel shared' : 'Panel unshared');
    } catch {
      setSnackbar('Failed to update sharing');
    }
  };

  const copyShareLink = (panel: StatPanel) => {
    if (!panel.share_code) return;
    const url = `https://rickwphillips.com/app/projects/commander/stats?panel=${panel.share_code}`;
    navigator.clipboard.writeText(url).then(() => {
      setSnackbar('Share link copied to clipboard');
    }).catch(() => {
      setSnackbar('Failed to copy link');
    });
  };

  if (loading) {
    return (
      <PageContainer title="Customize Stats" subtitle="Create and manage custom stat panels" backHref="/stats" backLabel="Stats">
        <LoadingSpinner message="Loading panels..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Customize Stats" subtitle="Create and manage custom stat panels" backHref="/stats" backLabel="Stats">
      {/* Your Panels */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Your Panels</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={startNew}
              disabled={showBuilder || panels.length >= 10}
              size="small"
            >
              New Panel
            </Button>
          </Stack>

          {panels.length >= 10 && (
            <Alert severity="info" sx={{ mb: 2 }}>Maximum of 10 panels reached.</Alert>
          )}

          {panels.length === 0 && !showBuilder && (
            <Typography color="text.secondary">
              No custom panels yet. Create one to save your preferred stat views.
            </Typography>
          )}

          {panels.map(panel => (
            <Card key={panel.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{panel.name}</Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                      {panel.sections.map(s => {
                        const def = getSectionDef(s as StatsSectionId);
                        return def ? (
                          <Chip key={s} label={def.label} size="small" variant="outlined" />
                        ) : null;
                      })}
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={panel.is_shared}
                          onChange={() => handleShareToggle(panel)}
                          size="small"
                        />
                      }
                      label={<ShareIcon fontSize="small" color={panel.is_shared ? 'primary' : 'action'} />}
                      sx={{ mr: 0 }}
                    />
                    {panel.is_shared && panel.share_code && (
                      <Tooltip title="Copy share link">
                        <IconButton size="small" onClick={() => copyShareLink(panel)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => startEdit(panel)} disabled={showBuilder}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => setDeleteTarget(panel)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Panel Builder */}
      {showBuilder && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              {editingId ? 'Edit Panel' : 'New Panel'}
            </Typography>

            <TextField
              label="Panel Name"
              value={panelName}
              onChange={e => setPanelName(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 3 }}
              inputProps={{ maxLength: 100 }}
            />

            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Available Sections */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Available Sections
                </Typography>
                {availableSections.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    All sections added
                  </Typography>
                ) : (
                  <List dense>
                    {availableSections.map(section => {
                      const Icon = section.icon;
                      return (
                        <ListItem
                          key={section.id}
                          component="div"
                          onClick={() => handleAddSection(section.id)}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 0.5,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Icon color="action" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={section.label} />
                          <AddIcon fontSize="small" color="action" />
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

              {/* Selected Sections (sortable) */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Selected Sections ({selectedSections.length})
                </Typography>
                {selectedSections.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Click sections from the left to add them
                  </Typography>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={selectedSections}
                      strategy={verticalListSortingStrategy}
                    >
                      <List dense>
                        {selectedSections.map(id => (
                          <SortableSection key={id} id={id} onRemove={handleRemoveSection} />
                        ))}
                      </List>
                    </SortableContext>
                  </DndContext>
                )}
              </Box>
            </Box>

            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={cancelBuilder}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving || selectedSections.length === 0 || !panelName.trim()}
              >
                {saving ? 'Saving...' : editingId ? 'Update Panel' : 'Create Panel'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Panel</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{deleteTarget?.name}&quot;?
            {deleteTarget?.is_shared && ' This panel is currently shared with other users.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </PageContainer>
  );
}
