'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Button,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageContainer } from '../../components/PageContainer';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { api } from '../../lib/api';
import type {
  StatPanel,
  Player,
  DeckWithPlayer,
  ComparisonGroupBy,
  ComparisonMetric,
  ComparisonConditions,
  ComparisonEntityFilter,
  ComparisonConfig,
  ComparisonResult,
} from '../../lib/types';
import { ComparisonBuilder } from './ComparisonBuilder';
import { PanelCard } from './PanelCard';
import { DeletePanelDialog } from './DeletePanelDialog';

export default function CustomizePage() {
  const [loading, setLoading] = useState(true);
  const [panels, setPanels] = useState<StatPanel[]>([]);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  // Builder state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [panelName, setPanelName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);

  // Comparison state
  const [compGroupBy, setCompGroupBy] = useState<ComparisonGroupBy>('player');
  const [compConditions, setCompConditions] = useState<ComparisonConditions>({});
  const [compEntityFilter, setCompEntityFilter] = useState<ComparisonEntityFilter>({});
  const [compMetrics, setCompMetrics] = useState<ComparisonMetric[]>(['win_rate', 'total_games', 'wins']);
  const [compTopN, setCompTopN] = useState<number | undefined>(undefined);

  // Entity data for pickers
  const [players, setPlayers] = useState<Player[]>([]);
  const [decks, setDecks] = useState<DeckWithPlayer[]>([]);

  // Preview state
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [previewData, setPreviewData] = useState<Record<number, ComparisonResult | 'error'>>({});
  const [previewLoading, setPreviewLoading] = useState<Set<number>>(new Set());

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<StatPanel | null>(null);

  useEffect(() => {
    fetchPanels();
    Promise.all([api.getPlayers(), api.getDecks()])
      .then(([p, d]) => { setPlayers(p); setDecks(d); })
      .catch(() => { /* non-fatal */ });
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

  const resetComparisonState = () => {
    setCompGroupBy('player');
    setCompConditions({});
    setCompEntityFilter({});
    setCompMetrics(['win_rate', 'total_games', 'wins']);
    setCompTopN(undefined);
  };

  const startNew = () => {
    setEditingId(null);
    setPanelName('');
    resetComparisonState();
    setShowBuilder(true);
  };

  const startEdit = (panel: StatPanel) => {
    setEditingId(panel.id);
    setPanelName(panel.name);
    if (panel.panel_type === 'comparison' && panel.config) {
      setCompGroupBy(panel.config.groupBy);
      setCompConditions(panel.config.conditions ?? {});
      setCompEntityFilter(panel.config.entityFilter ?? {});
      setCompMetrics(panel.config.metrics ?? ['win_rate']);
      setCompTopN(panel.config.top_n);
    } else {
      resetComparisonState();
    }
    setShowBuilder(true);
  };

  const cancelBuilder = () => {
    setShowBuilder(false);
    setEditingId(null);
    setPanelName('');
    resetComparisonState();
  };

  const handleSave = async () => {
    if (!panelName.trim()) { setSnackbar('Panel name is required'); return; }
    if (compMetrics.length === 0) { setSnackbar('Select at least one metric'); return; }

    const config: ComparisonConfig = {
      groupBy: compGroupBy,
      conditions: compConditions,
      entityFilter: Object.keys(compEntityFilter).length > 0 ? compEntityFilter : undefined,
      metrics: compMetrics,
      top_n: compTopN,
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.updateStatPanel(editingId, { name: panelName.trim(), config });
        setSnackbar('Panel updated');
      } else {
        await api.createStatPanel({ name: panelName.trim(), panel_type: 'comparison', config });
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

  const handleTogglePreview = (panel: StatPanel) => {
    if (previewId === panel.id) { setPreviewId(null); return; }
    setPreviewId(panel.id);
    if (panel.panel_type === 'comparison' && panel.config && !previewData[panel.id]) {
      setPreviewLoading((prev) => new Set(prev).add(panel.id));
      api.getComparison(panel.config)
        .then((result) => setPreviewData((prev) => ({ ...prev, [panel.id]: result })))
        .catch(() => setPreviewData((prev) => ({ ...prev, [panel.id]: 'error' })))
        .finally(() => setPreviewLoading((prev) => { const s = new Set(prev); s.delete(panel.id); return s; }));
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
      setPanels((prev) => prev.map((p) => (p.id === panel.id ? updated : p)));
      setSnackbar(updated.is_shared ? 'Panel shared' : 'Panel unshared');
    } catch {
      setSnackbar('Failed to update sharing');
    }
  };

  const copyShareLink = (panel: StatPanel) => {
    if (!panel.share_code) return;
    const url = `https://rickwphillips.com/app/projects/commander/stats?panel=${panel.share_code}`;
    navigator.clipboard.writeText(url)
      .then(() => setSnackbar('Share link copied to clipboard'))
      .catch(() => setSnackbar('Failed to copy link'));
  };

  const isSaveDisabled = saving || !panelName.trim() || compMetrics.length === 0;

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

          {panels.map((panel) => (
            <PanelCard
              key={panel.id}
              panel={panel}
              isPreviewing={previewId === panel.id}
              isLoadingPreview={previewLoading.has(panel.id)}
              previewResult={previewData[panel.id]}
              showBuilder={showBuilder}
              onTogglePreview={() => handleTogglePreview(panel)}
              onEdit={() => startEdit(panel)}
              onDelete={() => setDeleteTarget(panel)}
              onShareToggle={() => handleShareToggle(panel)}
              onCopyShareLink={() => copyShareLink(panel)}
            />
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
              onChange={(e) => setPanelName(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 100 }}
            />

            <ComparisonBuilder
              groupBy={compGroupBy}
              setGroupBy={setCompGroupBy}
              conditions={compConditions}
              setConditions={setCompConditions}
              entityFilter={compEntityFilter}
              setEntityFilter={setCompEntityFilter}
              metrics={compMetrics}
              setMetrics={setCompMetrics}
              topN={compTopN}
              setTopN={setCompTopN}
              players={players}
              decks={decks}
            />

            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="outlined" startIcon={<CancelIcon />} onClick={cancelBuilder}>
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isSaveDisabled}
              >
                {saving ? 'Saving...' : editingId ? 'Update Panel' : 'Create Panel'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      <DeletePanelDialog
        target={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </PageContainer>
  );
}
