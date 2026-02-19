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
  Tabs,
  Tab,
  Autocomplete,
  Checkbox,
  FormGroup,
  Collapse,
  CircularProgress,
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
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
import Link from 'next/link';
import { PageContainer } from '../../components/PageContainer';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { api } from '../../lib/api';
import { STATS_SECTIONS, getSectionDef } from '../../lib/statsSections';
import type { StatsSectionId } from '../../lib/statsSections';
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
import { ComparisonPanel } from '../ComparisonPanel';

// ---- Metric definitions ----
const METRIC_OPTIONS: { id: ComparisonMetric; label: string; description: string }[] = [
  { id: 'win_rate', label: 'Win Rate', description: '% of games won' },
  { id: 'wins', label: 'Wins', description: 'Total wins' },
  { id: 'total_games', label: 'Total Games', description: 'Games played' },
  { id: 'avg_finish_position', label: 'Avg Finish Position', description: 'Lower is better' },
  { id: 'recent_win_rate', label: 'Recent Win Rate', description: 'Last 5 matching games' },
  { id: 'avg_survival_turns', label: 'Avg Survival Turns', description: 'How long when not winning' },
  { id: 'avg_turns_to_win', label: 'Avg Turns to Win', description: 'Fast vs slow wins' },
  { id: 'top2_rate', label: 'Top-2 Rate', description: 'Finish 1st or 2nd' },
  { id: 'elimination_rate', label: 'Elimination Rate', description: 'How often knocked out' },
];

const GROUP_BY_ENTITY: { id: ComparisonGroupBy; label: string }[] = [
  { id: 'player', label: 'Player' },
  { id: 'deck', label: 'Deck' },
  { id: 'commander', label: 'Commander' },
  { id: 'color', label: 'Color' },
  { id: 'deck_age', label: 'Deck Age' },
];

const GROUP_BY_PROPERTY: { id: ComparisonGroupBy; label: string }[] = [
  { id: 'pod_size', label: 'Pod Size' },
  { id: 'game_length', label: 'Game Length' },
  { id: 'game_type', label: 'Game Type' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
  { id: 'season', label: 'Season' },
  { id: 'day_of_week', label: 'Day of Week' },
];

const ENTITY_GROUP_BYS = new Set<ComparisonGroupBy>(['player', 'deck', 'commander', 'color', 'deck_age']);

// ---- Sortable section for predefined builder ----
function SortableSection({ id, onRemove }: { id: StatsSectionId; onRemove: (id: StatsSectionId) => void }) {
  const def = getSectionDef(id);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

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
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1, bgcolor: 'background.paper' }}
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

// ---- Chip selector helper ----
function ChipGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
        {options.map(opt => (
          <Chip
            key={String(opt.value)}
            label={opt.label}
            size="small"
            onClick={() => onChange(opt.value)}
            color={value === opt.value ? 'primary' : 'default'}
            variant={value === opt.value ? 'filled' : 'outlined'}
            sx={{ mb: 0.5 }}
          />
        ))}
      </Stack>
    </Box>
  );
}

// ---- Comparison Builder sub-form ----
interface ComparisonBuilderProps {
  groupBy: ComparisonGroupBy;
  setGroupBy: (v: ComparisonGroupBy) => void;
  conditions: ComparisonConditions;
  setConditions: (v: ComparisonConditions) => void;
  entityFilter: ComparisonEntityFilter;
  setEntityFilter: (v: ComparisonEntityFilter) => void;
  metrics: ComparisonMetric[];
  setMetrics: (v: ComparisonMetric[]) => void;
  players: Player[];
  decks: DeckWithPlayer[];
}

function ComparisonBuilder({
  groupBy, setGroupBy,
  conditions, setConditions,
  entityFilter, setEntityFilter,
  metrics, setMetrics,
  players, decks,
}: ComparisonBuilderProps) {
  const isEntityGroup = ENTITY_GROUP_BYS.has(groupBy);

  function setCond<K extends keyof ComparisonConditions>(key: K, val: ComparisonConditions[K]) {
    setConditions({ ...conditions, [key]: val });
  }

  function setFilter<K extends keyof ComparisonEntityFilter>(key: K, val: ComparisonEntityFilter[K]) {
    setEntityFilter({ ...entityFilter, [key]: val });
  }

  function toggleMetric(m: ComparisonMetric) {
    setMetrics(metrics.includes(m) ? metrics.filter(x => x !== m) : [...metrics, m]);
  }

  return (
    <Stack spacing={0}>
      {/* A — Conditions */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          A — Conditions
        </Typography>

        <ChipGroup
          label="Game Type"
          value={conditions.game_type ?? 'all'}
          options={[
            { value: 'all', label: 'All' },
            { value: 'standard', label: 'Standard' },
            { value: '2hg', label: '2HG' },
          ]}
          onChange={v => setCond('game_type', v as 'all' | 'standard' | '2hg')}
        />

        <ChipGroup
          label="Pod Size"
          value={conditions.pod_size ?? 0}
          options={[
            { value: 0, label: 'Any' },
            { value: 3, label: '3-player' },
            { value: 4, label: '4-player' },
            { value: 5, label: '5+' },
          ]}
          onChange={v => setCond('pod_size', v === 0 ? undefined : (v as number))}
        />

        <ChipGroup
          label="Game Length"
          value={conditions.min_winning_turn ?? 0}
          options={[
            { value: 0, label: 'Any' },
            { value: 5, label: '5+ turns' },
            { value: 8, label: '8+ turns' },
            { value: 10, label: '10+ turns' },
          ]}
          onChange={v => setCond('min_winning_turn', v === 0 ? undefined : (v as number))}
        />

        <ChipGroup
          label="Count As Win"
          value={conditions.min_finish_position ?? 1}
          options={[
            { value: 1, label: '1st place only' },
            { value: 2, label: 'Top-2 finishes' },
          ]}
          onChange={v => setCond('min_finish_position', v === 1 ? undefined : (v as number))}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Player must be in pod (required_players)
          </Typography>
          <Autocomplete
            multiple
            size="small"
            options={players}
            getOptionLabel={p => p.name}
            value={players.filter(p => conditions.required_player_ids?.includes(p.id) ?? false)}
            onChange={(_, v) => setCond('required_player_ids', v.map(p => p.id))}
            renderInput={params => <TextField {...params} placeholder="Any player" />}
            isOptionEqualToValue={(o, v) => o.id === v.id}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Commander must be in pod
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            size="small"
            options={[] as string[]}
            value={conditions.required_commanders ?? []}
            onChange={(_, v) => setCond('required_commanders', v as string[])}
            renderInput={params => <TextField {...params} placeholder="Type commander name + Enter" />}
          />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Date From"
            type="date"
            size="small"
            value={conditions.date_from ?? ''}
            onChange={e => setCond('date_from', e.target.value || undefined)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Date To"
            type="date"
            size="small"
            value={conditions.date_to ?? ''}
            onChange={e => setCond('date_to', e.target.value || undefined)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
        </Stack>

        <TextField
          label="Min games threshold"
          type="number"
          size="small"
          value={conditions.min_games ?? ''}
          onChange={e => setCond('min_games', e.target.value ? parseInt(e.target.value) : undefined)}
          helperText="Exclude entities with fewer games"
          inputProps={{ min: 1, max: 50 }}
          sx={{ maxWidth: 220 }}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* B — Group by */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          B — Group by
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          Entity
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
          {GROUP_BY_ENTITY.map(opt => (
            <Chip
              key={opt.id}
              label={opt.label}
              size="small"
              onClick={() => setGroupBy(opt.id)}
              color={groupBy === opt.id ? 'primary' : 'default'}
              variant={groupBy === opt.id ? 'filled' : 'outlined'}
              sx={{ mb: 0.5 }}
            />
          ))}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          Game Property
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {GROUP_BY_PROPERTY.map(opt => (
            <Chip
              key={opt.id}
              label={opt.label}
              size="small"
              onClick={() => setGroupBy(opt.id)}
              color={groupBy === opt.id ? 'primary' : 'default'}
              variant={groupBy === opt.id ? 'filled' : 'outlined'}
              sx={{ mb: 0.5 }}
            />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* C — Narrow to */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          C — Narrow to <Typography component="span" variant="caption" color="text.secondary">(optional — leave empty for all)</Typography>
        </Typography>

        {(groupBy === 'player') && (
          <Autocomplete
            multiple
            size="small"
            options={players}
            getOptionLabel={p => p.name}
            value={players.filter(p => entityFilter.player_ids?.includes(p.id) ?? false)}
            onChange={(_, v) => setFilter('player_ids', v.map(p => p.id))}
            renderInput={params => <TextField {...params} label="Specific players" placeholder="All players" />}
            isOptionEqualToValue={(o, v) => o.id === v.id}
          />
        )}

        {groupBy === 'deck' && (
          <Stack spacing={1.5}>
            <Autocomplete
              multiple
              size="small"
              options={players}
              getOptionLabel={p => p.name}
              value={players.filter(p => entityFilter.player_ids?.includes(p.id) ?? false)}
              onChange={(_, v) => setFilter('player_ids', v.map(p => p.id))}
              renderInput={params => <TextField {...params} label="Filter decks by player" placeholder="All players" />}
              isOptionEqualToValue={(o, v) => o.id === v.id}
            />
            <Autocomplete
              multiple
              size="small"
              options={decks.filter(d =>
                !entityFilter.player_ids?.length || entityFilter.player_ids.includes(d.player_id)
              )}
              getOptionLabel={d => `${d.name} (${d.player_name})`}
              value={decks.filter(d => entityFilter.deck_ids?.includes(d.id) ?? false)}
              onChange={(_, v) => setFilter('deck_ids', v.map(d => d.id))}
              renderInput={params => <TextField {...params} label="Specific decks" placeholder="All decks" />}
              isOptionEqualToValue={(o, v) => o.id === v.id}
            />
          </Stack>
        )}

        {groupBy === 'commander' && (
          <Autocomplete
            multiple
            freeSolo
            size="small"
            options={[] as string[]}
            value={entityFilter.commanders ?? []}
            onChange={(_, v) => setFilter('commanders', v as string[])}
            renderInput={params => <TextField {...params} label="Specific commanders" placeholder="All commanders" />}
          />
        )}

        {groupBy === 'color' && (
          <Autocomplete
            multiple
            freeSolo
            size="small"
            options={['W', 'U', 'B', 'R', 'G', 'WU', 'WB', 'WR', 'WG', 'UB', 'UR', 'UG', 'BR', 'BG', 'RG', 'WUB', 'WUR', 'WUG', 'WBR', 'WBG', 'WRG', 'UBR', 'UBG', 'URG', 'BRG', 'WUBR', 'WUBG', 'WURG', 'WBRG', 'UBRG', 'WUBRG', 'C']}
            value={entityFilter.colors ?? []}
            onChange={(_, v) => setFilter('colors', v as string[])}
            renderInput={params => <TextField {...params} label="Specific color identities" placeholder="All colors" />}
          />
        )}

        {!isEntityGroup && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Filter whose stats appear in each bucket:
            </Typography>
            <Autocomplete
              multiple
              size="small"
              options={players}
              getOptionLabel={p => p.name}
              value={players.filter(p => entityFilter.player_ids?.includes(p.id) ?? false)}
              onChange={(_, v) => setFilter('player_ids', v.map(p => p.id))}
              renderInput={params => <TextField {...params} label="Specific players" placeholder="All players" />}
              isOptionEqualToValue={(o, v) => o.id === v.id}
            />
          </Box>
        )}

        {groupBy === 'deck_age' && (
          <Autocomplete
            multiple
            size="small"
            options={players}
            getOptionLabel={p => p.name}
            value={players.filter(p => entityFilter.player_ids?.includes(p.id) ?? false)}
            onChange={(_, v) => setFilter('player_ids', v.map(p => p.id))}
            renderInput={params => <TextField {...params} label="Specific players" placeholder="All players" />}
            isOptionEqualToValue={(o, v) => o.id === v.id}
          />
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* D — Metrics */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          D — Metrics <Typography component="span" variant="caption" color="text.secondary">(select at least one)</Typography>
        </Typography>
        <FormGroup>
          <Stack direction="row" flexWrap="wrap" useFlexGap gap={0}>
            {METRIC_OPTIONS.map(m => (
              <FormControlLabel
                key={m.id}
                sx={{ width: { xs: '100%', sm: '50%' }, mr: 0 }}
                control={
                  <Checkbox
                    size="small"
                    checked={metrics.includes(m.id)}
                    onChange={() => toggleMetric(m.id)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">{m.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{m.description}</Typography>
                  </Box>
                }
              />
            ))}
          </Stack>
        </FormGroup>
      </Box>
    </Stack>
  );
}

// ---- Main page ----
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
  const [builderTab, setBuilderTab] = useState(0); // 0 = predefined, 1 = comparison

  // Comparison state
  const [compGroupBy, setCompGroupBy] = useState<ComparisonGroupBy>('player');
  const [compConditions, setCompConditions] = useState<ComparisonConditions>({});
  const [compEntityFilter, setCompEntityFilter] = useState<ComparisonEntityFilter>({});
  const [compMetrics, setCompMetrics] = useState<ComparisonMetric[]>(['win_rate', 'total_games', 'wins']);

  // Entity data for pickers
  const [players, setPlayers] = useState<Player[]>([]);
  const [decks, setDecks] = useState<DeckWithPlayer[]>([]);

  // Preview state
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [previewData, setPreviewData] = useState<Record<number, ComparisonResult | 'error'>>({});
  const [previewLoading, setPreviewLoading] = useState<Set<number>>(new Set());

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<StatPanel | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    fetchPanels();
    // Load players and decks for pickers
    Promise.all([api.getPlayers(), api.getDecks()]).then(([p, d]) => {
      setPlayers(p);
      setDecks(d);
    }).catch(() => {/* non-fatal */});
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

  const availableSections = STATS_SECTIONS.filter(s => !selectedSections.includes(s.id));

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

  const resetComparisonState = () => {
    setCompGroupBy('player');
    setCompConditions({});
    setCompEntityFilter({});
    setCompMetrics(['win_rate', 'total_games', 'wins']);
  };

  const startNew = () => {
    setEditingId(null);
    setPanelName('');
    setSelectedSections([]);
    resetComparisonState();
    setBuilderTab(0);
    setShowBuilder(true);
  };

  const startEdit = (panel: StatPanel) => {
    setEditingId(panel.id);
    setPanelName(panel.name);
    if (panel.panel_type === 'comparison' && panel.config) {
      setBuilderTab(1);
      setCompGroupBy(panel.config.groupBy);
      setCompConditions(panel.config.conditions ?? {});
      setCompEntityFilter(panel.config.entityFilter ?? {});
      setCompMetrics(panel.config.metrics ?? ['win_rate']);
      setSelectedSections([]);
    } else {
      setBuilderTab(0);
      setSelectedSections(panel.sections as StatsSectionId[]);
      resetComparisonState();
    }
    setShowBuilder(true);
  };

  const cancelBuilder = () => {
    setShowBuilder(false);
    setEditingId(null);
    setPanelName('');
    setSelectedSections([]);
    resetComparisonState();
    setBuilderTab(0);
  };

  const handleSave = async () => {
    if (!panelName.trim()) {
      setSnackbar('Panel name is required');
      return;
    }

    const isComparison = builderTab === 1;

    if (isComparison) {
      if (compMetrics.length === 0) {
        setSnackbar('Select at least one metric');
        return;
      }
    } else {
      if (selectedSections.length === 0) {
        setSnackbar('At least one section is required');
        return;
      }
    }

    setSaving(true);
    try {
      if (editingId) {
        if (isComparison) {
          const config: ComparisonConfig = {
            groupBy: compGroupBy,
            conditions: compConditions,
            entityFilter: Object.keys(compEntityFilter).length > 0 ? compEntityFilter : undefined,
            metrics: compMetrics,
          };
          await api.updateStatPanel(editingId, { name: panelName.trim(), config });
        } else {
          await api.updateStatPanel(editingId, { name: panelName.trim(), sections: selectedSections });
        }
        setSnackbar('Panel updated');
      } else {
        if (isComparison) {
          const config: ComparisonConfig = {
            groupBy: compGroupBy,
            conditions: compConditions,
            entityFilter: Object.keys(compEntityFilter).length > 0 ? compEntityFilter : undefined,
            metrics: compMetrics,
          };
          await api.createStatPanel({ name: panelName.trim(), panel_type: 'comparison', config });
        } else {
          await api.createStatPanel({ name: panelName.trim(), panel_type: 'predefined', sections: selectedSections });
        }
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
    if (previewId === panel.id) {
      setPreviewId(null);
      return;
    }
    setPreviewId(panel.id);
    // Comparison panels: fetch data if not already cached
    if (panel.panel_type === 'comparison' && panel.config && !previewData[panel.id]) {
      setPreviewLoading(prev => new Set(prev).add(panel.id));
      api.getComparison(panel.config)
        .then(result => setPreviewData(prev => ({ ...prev, [panel.id]: result })))
        .catch(() => setPreviewData(prev => ({ ...prev, [panel.id]: 'error' })))
        .finally(() => setPreviewLoading(prev => { const s = new Set(prev); s.delete(panel.id); return s; }));
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

  const groupByLabel = (gb: ComparisonGroupBy) =>
    [...GROUP_BY_ENTITY, ...GROUP_BY_PROPERTY].find(o => o.id === gb)?.label ?? gb;

  const isSaveDisabled = saving || !panelName.trim() ||
    (builderTab === 0 && selectedSections.length === 0) ||
    (builderTab === 1 && compMetrics.length === 0);

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

          {panels.map(panel => {
            const isPreviewing = previewId === panel.id;
            const isLoadingPreview = previewLoading.has(panel.id);
            const previewResult = previewData[panel.id];

            return (
              <Card key={panel.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ py: 2, '&:last-child': { pb: isPreviewing ? 1 : 2 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{panel.name}</Typography>
                        {panel.panel_type === 'comparison' && (
                          <Chip
                            icon={<CompareArrowsIcon sx={{ fontSize: 14 }} />}
                            label="Comparison"
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                        {panel.panel_type === 'comparison' && panel.config ? (
                          <Chip
                            label={`Group by: ${groupByLabel(panel.config.groupBy)}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ) : (
                          panel.sections.map(s => {
                            const def = getSectionDef(s as StatsSectionId);
                            return def ? (
                              <Chip key={s} label={def.label} size="small" variant="outlined" />
                            ) : null;
                          })
                        )}
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Tooltip title={isPreviewing ? 'Hide preview' : 'Preview'}>
                        <IconButton
                          size="small"
                          onClick={() => handleTogglePreview(panel)}
                          color={isPreviewing ? 'primary' : 'default'}
                        >
                          {isPreviewing ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
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

                  <Collapse in={isPreviewing}>
                    <Divider sx={{ mt: 1.5, mb: 2 }} />
                    {panel.panel_type === 'comparison' ? (
                      isLoadingPreview ? (
                        <Stack alignItems="center" sx={{ py: 2 }}>
                          <CircularProgress size={24} />
                        </Stack>
                      ) : previewResult === 'error' ? (
                        <Alert severity="error" sx={{ mb: 1 }}>Failed to load preview.</Alert>
                      ) : previewResult ? (
                        <ComparisonPanel result={previewResult} />
                      ) : null
                    ) : (
                      <List dense disablePadding>
                        {panel.sections.map(s => {
                          const def = getSectionDef(s as StatsSectionId);
                          if (!def) return null;
                          const Icon = def.icon;
                          return (
                            <ListItem key={s} disableGutters sx={{ py: 0.25 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <Icon color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary={def.label}
                                secondary={def.description}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    )}
                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
                      <Button
                        component={Link}
                        href={`/stats?panel_id=${panel.id}`}
                        size="small"
                        variant="outlined"
                      >
                        Open in Stats →
                      </Button>
                    </Stack>
                  </Collapse>
                </CardContent>
              </Card>
            );
          })}
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
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 100 }}
            />

            {/* Panel type tabs */}
            <Tabs
              value={builderTab}
              onChange={(_, v) => setBuilderTab(v)}
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Pre-built Sections" />
              <Tab label="Custom Comparison" icon={<CompareArrowsIcon fontSize="small" />} iconPosition="start" />
            </Tabs>

            {/* Predefined builder */}
            {builderTab === 0 && (
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Available Sections */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Available Sections
                  </Typography>
                  {availableSections.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">All sections added</Typography>
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
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={selectedSections} strategy={verticalListSortingStrategy}>
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
            )}

            {/* Comparison builder */}
            {builderTab === 1 && (
              <ComparisonBuilder
                groupBy={compGroupBy}
                setGroupBy={setCompGroupBy}
                conditions={compConditions}
                setConditions={setCompConditions}
                entityFilter={compEntityFilter}
                setEntityFilter={setCompEntityFilter}
                metrics={compMetrics}
                setMetrics={setCompMetrics}
                players={players}
                decks={decks}
              />
            )}

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
