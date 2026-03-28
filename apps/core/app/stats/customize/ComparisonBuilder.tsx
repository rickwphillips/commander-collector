'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Alert,
  Divider,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import type {
  Player,
  DeckWithPlayer,
  ComparisonGroupBy,
  ComparisonMetric,
  ComparisonConditions,
  ComparisonEntityFilter,
} from '@/lib/types';
import { QuerySentence } from './QuerySentence';
import { ConditionColorPicker } from './ConditionColorPicker';

// ---- Constants (exported for use by PanelCard / page) ----

export const METRIC_OPTIONS: { id: ComparisonMetric; label: string; description: string }[] = [
  { id: 'win_rate', label: 'Win Rate', description: '% of games won' },
  { id: 'wins', label: 'Wins', description: 'Total wins' },
  { id: 'total_games', label: 'Total Games', description: 'Games played' },
  { id: 'avg_finish_position', label: 'Avg Finish Position', description: 'Lower is better' },
  { id: 'recent_win_rate', label: 'Recent Win Rate', description: 'Last 5 matching games' },
  { id: 'avg_survival_turns', label: 'Avg Survival Turns', description: 'How long when not winning' },
  { id: 'avg_turns_to_win', label: 'Avg Turns to Win', description: 'Fast vs slow wins' },
  { id: 'top2_rate', label: 'Top-2 Rate', description: 'Finish 1st or 2nd' },
  { id: 'elimination_rate', label: 'Elimination Rate', description: 'How often knocked out' },
  {
    id: 'std_dev_finish_position',
    label: 'Consistency Score',
    description: 'Std dev of finish position — low = consistent',
  },
  {
    id: 'first_elimination_rate',
    label: 'First Eliminated Rate',
    description: '% of games knocked out first',
  },
];

export const GROUP_BY_ENTITY: { id: ComparisonGroupBy; label: string }[] = [
  { id: 'player', label: 'Player' },
  { id: 'deck', label: 'Deck' },
  { id: 'commander', label: 'Commander' },
  { id: 'color', label: 'Color' },
  { id: 'deck_age', label: 'Deck Age' },
  { id: 'opponent_player', label: 'Opponent Player' },
  { id: 'opponent_commander', label: 'Opponent Commander' },
];

export const GROUP_BY_PROPERTY: { id: ComparisonGroupBy; label: string }[] = [
  { id: 'pod_size', label: 'Pod Size' },
  { id: 'game_length', label: 'Game Length' },
  { id: 'game_type', label: 'Game Type' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
  { id: 'season', label: 'Season' },
  { id: 'day_of_week', label: 'Day of Week' },
];

export const ENTITY_GROUP_BYS = new Set<ComparisonGroupBy>([
  'player', 'deck', 'commander', 'color', 'deck_age', 'opponent_player', 'opponent_commander',
]);

const OPPONENT_GROUP_BYS = new Set<ComparisonGroupBy>(['opponent_player', 'opponent_commander']);

export function groupByLabel(gb: ComparisonGroupBy): string {
  return [...GROUP_BY_ENTITY, ...GROUP_BY_PROPERTY].find((o) => o.id === gb)?.label ?? gb;
}

// ---- Internal helpers ----

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
        {options.map((opt) => (
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

// ---- Comparison Builder ----

export interface ComparisonBuilderProps {
  groupBy: ComparisonGroupBy;
  setGroupBy: (v: ComparisonGroupBy) => void;
  conditions: ComparisonConditions;
  setConditions: React.Dispatch<React.SetStateAction<ComparisonConditions>>;
  entityFilter: ComparisonEntityFilter;
  setEntityFilter: React.Dispatch<React.SetStateAction<ComparisonEntityFilter>>;
  metrics: ComparisonMetric[];
  setMetrics: (v: ComparisonMetric[]) => void;
  topN: number | undefined;
  setTopN: (v: number | undefined) => void;
  players: Player[];
  decks: DeckWithPlayer[];
}

export function ComparisonBuilder({
  groupBy,
  setGroupBy,
  conditions,
  setConditions,
  entityFilter,
  setEntityFilter,
  metrics,
  setMetrics,
  topN,
  setTopN,
  players,
  decks,
}: ComparisonBuilderProps) {
  const isEntityGroup = ENTITY_GROUP_BYS.has(groupBy);

  const [glValue, setGlValue] = useState(
    conditions.min_winning_turn ?? conditions.max_winning_turn ?? 5
  );
  const glDirection =
    conditions.min_winning_turn != null
      ? 'gte'
      : conditions.max_winning_turn != null
        ? 'lte'
        : null;

  function setCond<K extends keyof ComparisonConditions>(key: K, val: ComparisonConditions[K]) {
    setConditions((prev) => ({ ...prev, [key]: val }));
  }

  function setFilter<K extends keyof ComparisonEntityFilter>(
    key: K,
    val: ComparisonEntityFilter[K]
  ) {
    setEntityFilter((prev) => ({ ...prev, [key]: val }));
  }

  function toggleMetric(m: ComparisonMetric) {
    setMetrics(metrics.includes(m) ? metrics.filter((x) => x !== m) : [...metrics, m]);
  }

  const commanderOptions = [...new Set(decks.map((d) => d.commander))].sort();

  return (
    <Stack spacing={0}>
      <QuerySentence
        groupBy={groupBy}
        conditions={conditions}
        entityFilter={entityFilter}
        metrics={metrics}
        topN={topN}
        players={players}
        decks={decks}
      />

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
            { value: 'standard', label: 'Commander' },
            { value: '2hg', label: '2HG' },
          ]}
          onChange={(v) => setCond('game_type', v as 'all' | 'standard' | '2hg')}
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
          onChange={(v) => setCond('pod_size', v === 0 ? undefined : (v as number))}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Game Length
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
            <TextField
              type="number"
              size="small"
              value={glValue}
              disabled={glDirection === null}
              onChange={(e) => {
                const n = Math.max(1, parseInt(e.target.value) || 1);
                setGlValue(n);
                if (glDirection === 'gte') setCond('min_winning_turn', n);
                else if (glDirection === 'lte') setCond('max_winning_turn', n);
              }}
              inputProps={{ min: 1, max: 99 }}
              sx={{ width: 70 }}
            />
            <Typography variant="body2" color={glDirection === null ? 'text.disabled' : 'text.primary'}>
              turns
            </Typography>
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <Checkbox
                  size="small"
                  checked={glDirection === 'gte'}
                  onChange={() => {
                    if (glDirection === 'gte') {
                      setCond('min_winning_turn', undefined);
                    } else {
                      setConditions({ ...conditions, min_winning_turn: glValue, max_winning_turn: undefined });
                    }
                  }}
                />
              }
              label="or more"
            />
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <Checkbox
                  size="small"
                  checked={glDirection === 'lte'}
                  onChange={() => {
                    if (glDirection === 'lte') {
                      setCond('max_winning_turn', undefined);
                    } else {
                      setConditions({ ...conditions, min_winning_turn: undefined, max_winning_turn: glValue });
                    }
                  }}
                />
              }
              label="or less"
            />
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <Checkbox
                  size="small"
                  checked={glDirection === null}
                  onChange={() => {
                    if (glDirection !== null) {
                      setConditions({ ...conditions, min_winning_turn: undefined, max_winning_turn: undefined });
                    }
                  }}
                />
              }
              label="Any"
            />
          </Stack>
        </Box>

        <ChipGroup
          label="Count As Win"
          value={conditions.min_finish_position ?? 1}
          options={[
            { value: 1, label: '1st place only' },
            { value: 2, label: 'Top-2 finishes' },
          ]}
          onChange={(v) => setCond('min_finish_position', v === 1 ? undefined : (v as number))}
        />

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={conditions.my_games_only ?? false}
                onChange={(e) => setCond('my_games_only', e.target.checked || undefined)}
              />
            }
            label={
              <Box>
                <Typography variant="body2">My games only</Typography>
                <Typography variant="caption" color="text.secondary">
                  Only count games where you were at the table (requires claimed player)
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={conditions.my_decks_only ?? false}
                onChange={(e) => setCond('my_decks_only', e.target.checked || undefined)}
              />
            }
            label={
              <Box>
                <Typography variant="body2">My decks only</Typography>
                <Typography variant="caption" color="text.secondary">
                  Only count results for decks you own, regardless of who piloted them (requires claimed player)
                </Typography>
              </Box>
            }
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Deck must include colors
          </Typography>
          <ConditionColorPicker
            colors={conditions.must_include_colors}
            colorMode={conditions.color_mode}
            onColorsChange={(c) => setCond('must_include_colors', c)}
            onColorModeChange={(m) => setCond('color_mode', m)}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Player must be in pod
          </Typography>
          <Autocomplete
            multiple
            size="small"
            options={players}
            getOptionLabel={(p) => p.name}
            value={players.filter((p) => conditions.required_player_ids?.includes(p.id) ?? false)}
            onChange={(_, v) => setCond('required_player_ids', v.map((p) => p.id))}
            renderInput={(params) => <TextField {...params} placeholder="Any player" />}
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
            options={commanderOptions}
            value={conditions.required_commanders ?? []}
            onChange={(_, v) => setCond('required_commanders', v as string[])}
            renderInput={(params) => <TextField {...params} placeholder="Type or select commander" />}
          />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Date From"
            type="date"
            size="small"
            value={conditions.date_from ?? ''}
            onChange={(e) => setCond('date_from', e.target.value || undefined)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Date To"
            type="date"
            size="small"
            value={conditions.date_to ?? ''}
            onChange={(e) => setCond('date_to', e.target.value || undefined)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
        </Stack>

        <TextField
          label="Min games threshold"
          type="number"
          size="small"
          value={conditions.min_games ?? ''}
          onChange={(e) => setCond('min_games', e.target.value ? parseInt(e.target.value) : undefined)}
          helperText="Exclude entities with fewer games"
          inputProps={{ min: 1, max: 50 }}
          sx={{ maxWidth: 220 }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Opponent players were in pod
          </Typography>
          <Autocomplete
            multiple
            size="small"
            options={players}
            getOptionLabel={(p) => p.name}
            value={players.filter((p) => conditions.opponent_player_ids?.includes(p.id) ?? false)}
            onChange={(_, v) => setCond('opponent_player_ids', v.length ? v.map((p) => p.id) : undefined)}
            renderInput={(params) => <TextField {...params} placeholder="Any opponent" />}
            isOptionEqualToValue={(o, v) => o.id === v.id}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Opponent commander was in pod
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            size="small"
            options={commanderOptions}
            value={conditions.opponent_commanders ?? []}
            onChange={(_, v) => setCond('opponent_commanders', v.length ? (v as string[]) : undefined)}
            renderInput={(params) => <TextField {...params} placeholder="Type or select commander" />}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            At least one opponent played this color
          </Typography>
          <ConditionColorPicker
            colors={conditions.opponent_colors}
            colorMode={conditions.opponent_color_mode}
            onColorsChange={(c) => setCond('opponent_colors', c)}
            onColorModeChange={(m) => setCond('opponent_color_mode', m)}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Exclude players from pod
          </Typography>
          <Autocomplete
            multiple
            size="small"
            options={players}
            getOptionLabel={(p) => p.name}
            value={players.filter((p) => conditions.exclude_player_ids?.includes(p.id) ?? false)}
            onChange={(_, v) => setCond('exclude_player_ids', v.length ? v.map((p) => p.id) : undefined)}
            renderInput={(params) => <TextField {...params} placeholder="No exclusions" />}
            isOptionEqualToValue={(o, v) => o.id === v.id}
          />
        </Box>
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
          {GROUP_BY_ENTITY.map((opt) => (
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
          {GROUP_BY_PROPERTY.map((opt) => (
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

        {OPPONENT_GROUP_BYS.has(groupBy) && !conditions.required_player_ids?.length && !conditions.my_games_only && (
          <Alert severity="warning" sx={{ mt: 1.5 }}>
            Opponent group-bys require a perspective player — set &ldquo;Player must be in pod&rdquo; (one player) or enable &ldquo;My games only&rdquo; in section A.
          </Alert>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* C — Narrow to */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          C — Narrow to{' '}
          <Typography component="span" variant="caption" color="text.secondary">
            (optional — leave empty for all)
          </Typography>
        </Typography>

        {groupBy === 'player' && (
          <Stack spacing={1.5}>
            <Autocomplete
              multiple
              size="small"
              options={players}
              getOptionLabel={(p) => p.name}
              value={players.filter((p) => entityFilter.player_ids?.includes(p.id) ?? false)}
              onChange={(_, v) => setFilter('player_ids', v.map((p) => p.id))}
              renderInput={(params) => (
                <TextField {...params} label="Specific players" placeholder="All players" />
              )}
              isOptionEqualToValue={(o, v) => o.id === v.id}
            />
          </Stack>
        )}

        {groupBy === 'deck' && (
          <Stack spacing={1.5}>
            <Autocomplete
              multiple
              size="small"
              options={players}
              getOptionLabel={(p) => p.name}
              value={players.filter((p) => entityFilter.player_ids?.includes(p.id) ?? false)}
              onChange={(_, v) => setFilter('player_ids', v.map((p) => p.id))}
              renderInput={(params) => (
                <TextField {...params} label="Filter decks by player" placeholder="All players" />
              )}
              isOptionEqualToValue={(o, v) => o.id === v.id}
            />
            <Autocomplete
              multiple
              size="small"
              options={decks.filter(
                (d) => !entityFilter.player_ids?.length || entityFilter.player_ids.includes(d.player_id)
              )}
              getOptionLabel={(d) => `${d.name} (${d.player_name})`}
              value={decks.filter((d) => entityFilter.deck_ids?.includes(d.id) ?? false)}
              onChange={(_, v) => setFilter('deck_ids', v.map((d) => d.id))}
              renderInput={(params) => (
                <TextField {...params} label="Specific decks" placeholder="All decks" />
              )}
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
            renderInput={(params) => (
              <TextField {...params} label="Specific commanders" placeholder="All commanders" />
            )}
          />
        )}

        {groupBy === 'color' && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Narrow to color identities
            </Typography>
            <ConditionColorPicker
              colors={entityFilter.colors}
              colorMode={entityFilter.color_mode}
              onColorsChange={(c) => setFilter('colors', c)}
              onColorModeChange={(m) => setFilter('color_mode', m)}
            />
          </Box>
        )}

        {!isEntityGroup && (
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              Filter whose stats appear in each bucket:
            </Typography>
            <Autocomplete
              multiple
              size="small"
              options={players}
              getOptionLabel={(p) => p.name}
              value={players.filter((p) => entityFilter.player_ids?.includes(p.id) ?? false)}
              onChange={(_, v) => setFilter('player_ids', v.map((p) => p.id))}
              renderInput={(params) => (
                <TextField {...params} label="Specific players" placeholder="All players" />
              )}
              isOptionEqualToValue={(o, v) => o.id === v.id}
            />
          </Stack>
        )}

        {groupBy === 'deck_age' && (
          <Stack spacing={1.5}>
            <Autocomplete
              multiple
              size="small"
              options={players}
              getOptionLabel={(p) => p.name}
              value={players.filter((p) => entityFilter.player_ids?.includes(p.id) ?? false)}
              onChange={(_, v) => setFilter('player_ids', v.map((p) => p.id))}
              renderInput={(params) => (
                <TextField {...params} label="Specific players" placeholder="All players" />
              )}
              isOptionEqualToValue={(o, v) => o.id === v.id}
            />
          </Stack>
        )}

        {groupBy === 'opponent_player' && (
          <Autocomplete
            multiple
            size="small"
            options={players}
            getOptionLabel={(p) => p.name}
            value={players.filter((p) => entityFilter.player_ids?.includes(p.id) ?? false)}
            onChange={(_, v) => setFilter('player_ids', v.length ? v.map((p) => p.id) : undefined)}
            renderInput={(params) => (
              <TextField {...params} label="Specific opponents" placeholder="All opponents" />
            )}
            isOptionEqualToValue={(o, v) => o.id === v.id}
          />
        )}

        {groupBy === 'opponent_commander' && (
          <Autocomplete
            multiple
            freeSolo
            size="small"
            options={commanderOptions}
            value={entityFilter.commanders ?? []}
            onChange={(_, v) => setFilter('commanders', v.length ? (v as string[]) : undefined)}
            renderInput={(params) => (
              <TextField {...params} label="Specific commanders" placeholder="All commanders" />
            )}
          />
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* D — Metrics */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          D — Metrics{' '}
          <Typography component="span" variant="caption" color="text.secondary">
            (select at least one)
          </Typography>
        </Typography>
        <FormGroup>
          <Stack direction="row" flexWrap="wrap" useFlexGap gap={0}>
            {METRIC_OPTIONS.map((m) => (
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
                    <Typography variant="caption" color="text.secondary">
                      {m.description}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Stack>
        </FormGroup>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Top N results"
            type="number"
            size="small"
            value={topN ?? ''}
            onChange={(e) => setTopN(e.target.value ? Math.max(1, parseInt(e.target.value)) : undefined)}
            helperText="Leave blank for all results"
            inputProps={{ min: 1 }}
            sx={{ maxWidth: 180 }}
          />
        </Box>
      </Box>
    </Stack>
  );
}
