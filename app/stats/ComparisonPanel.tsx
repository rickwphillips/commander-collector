'use client';

import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { ColorIdentityChips } from '../components/ColorIdentityChips';
import type {
  ComparisonResult,
  ComparisonMetric,
  ComparisonConditions,
  ComparisonGroupBy,
} from '../lib/types';

// ---- Metric labels ----
const METRIC_LABELS: Record<ComparisonMetric, string> = {
  win_rate: 'Win Rate',
  wins: 'Wins',
  total_games: 'Total Games',
  avg_finish_position: 'Avg Finish Pos.',
  recent_win_rate: 'Recent Win Rate',
  avg_survival_turns: 'Avg Survival Turns',
  avg_turns_to_win: 'Avg Turns to Win',
  top2_rate: 'Top-2 Rate',
  elimination_rate: 'Elimination Rate',
  std_dev_finish_position: 'Consistency',
  first_elimination_rate: '1st Elim. Rate',
};

// Metrics where lower = better (for winner highlighting)
const LOWER_IS_BETTER = new Set<ComparisonMetric>([
  'avg_finish_position',
  'avg_turns_to_win',
  'elimination_rate',
]);

// Metrics that are percentages
const PCT_METRICS = new Set<ComparisonMetric>([
  'win_rate',
  'recent_win_rate',
  'top2_rate',
  'elimination_rate',
]);

function formatMetricValue(metric: ComparisonMetric, value: number | null): string {
  if (value === null || value === undefined) return '—';
  if (PCT_METRICS.has(metric)) return `${value.toFixed(1)}%`;
  if (metric === 'avg_finish_position') return value.toFixed(2);
  if (metric === 'avg_survival_turns' || metric === 'avg_turns_to_win') return value.toFixed(1);
  return String(Math.round(value));
}

// ---- Conditions summary bar ----
function ConditionsSummary({
  conditions,
}: {
  conditions: ComparisonConditions;
  groupBy?: ComparisonGroupBy;
}) {
  const chips: string[] = [];

  if (conditions.game_type && conditions.game_type !== 'all') {
    chips.push(conditions.game_type === '2hg' ? '2HG' : 'Standard');
  }
  if (conditions.pod_size != null) {
    chips.push(conditions.pod_size >= 5 ? '5+-player' : `${conditions.pod_size}-player`);
  }
  if (conditions.min_winning_turn != null) {
    chips.push(`${conditions.min_winning_turn}+ turns`);
  }
  if (conditions.min_finish_position != null && conditions.min_finish_position > 1) {
    chips.push(`Top-${conditions.min_finish_position} finishes`);
  }
  if (conditions.date_from || conditions.date_to) {
    const from = conditions.date_from ?? '…';
    const to = conditions.date_to ?? '…';
    chips.push(`${from} → ${to}`);
  }
  if (conditions.min_games != null && conditions.min_games > 1) {
    chips.push(`Min ${conditions.min_games} games`);
  }

  if (chips.length === 0) return null;

  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
      {chips.map((c) => (
        <Chip key={c} label={c} size="small" variant="outlined" color="primary" />
      ))}
    </Stack>
  );
}

// ---- Main panel ----
interface ComparisonPanelProps {
  result: ComparisonResult;
}

export function ComparisonPanel({ result }: ComparisonPanelProps) {
  const { entities, metrics, conditions, groupBy } = result;

  if (entities.length === 0) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <CompareArrowsIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Custom Comparison
            </Typography>
          </Stack>
          <ConditionsSummary conditions={conditions} groupBy={groupBy} />
          <Typography color="text.secondary">
            No data matches the selected conditions. Try relaxing the filters.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Find best value per metric (for highlighting)
  const bestValues: Record<ComparisonMetric, number | null> = {} as Record<
    ComparisonMetric,
    number | null
  >;
  for (const metric of metrics) {
    const values = entities
      .map((e) => e[metric] as number | null)
      .filter((v): v is number => v !== null);
    if (values.length === 0) {
      bestValues[metric] = null;
    } else {
      bestValues[metric] = LOWER_IS_BETTER.has(metric) ? Math.min(...values) : Math.max(...values);
    }
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <CompareArrowsIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Custom Comparison
          </Typography>
        </Stack>

        <ConditionsSummary conditions={conditions} groupBy={groupBy} />

        {entities.length <= 8 ? (
          // Horizontal layout: entities as columns, metrics as rows
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
                  {entities.map((e) => (
                    <TableCell key={String(e.id)} align="center" sx={{ fontWeight: 600 }}>
                      <Box>
                        {groupBy === 'color' && e.colors ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.25 }}>
                            <ColorIdentityChips colors={e.colors} size="small" />
                          </Box>
                        ) : (
                          <>
                            {e.colors && (
                              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.25 }}>
                                <ColorIdentityChips colors={e.colors} size="small" />
                              </Box>
                            )}
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {e.label}
                            </Typography>
                          </>
                        )}
                        {e.sublabel && (
                          <Typography variant="caption" color="text.secondary">
                            {e.sublabel}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {metrics.map((metric) => (
                  <TableRow key={metric}>
                    <TableCell sx={{ fontWeight: 500 }}>{METRIC_LABELS[metric]}</TableCell>
                    {entities.map((e) => {
                      const val = e[metric] as number | null;
                      const isWinner =
                        val !== null && bestValues[metric] !== null && val === bestValues[metric];
                      return (
                        <TableCell key={String(e.id)} align="center">
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={0.5}
                          >
                            {isWinner && entities.length > 1 && (
                              <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 14 }} />
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isWinner && entities.length > 1 ? 700 : 400,
                                color:
                                  isWinner && entities.length > 1 ? 'primary.main' : 'text.primary',
                              }}
                            >
                              {formatMetricValue(metric, val)}
                            </Typography>
                          </Stack>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          // Vertical layout: entities as rows, metrics as columns
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Entity</TableCell>
                  {metrics.map((m) => (
                    <TableCell key={m} align="right" sx={{ fontWeight: 600 }}>
                      {METRIC_LABELS[m]}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {entities.map((e) => (
                  <TableRow key={String(e.id)}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {/* Fixed-width column so names align regardless of pip count or absence */}
                        <Box sx={{ width: 46, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                          {e.colors && <ColorIdentityChips colors={e.colors} size="small" />}
                        </Box>
                        <Box>
                          {groupBy !== 'color' && (
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {e.label}
                            </Typography>
                          )}
                          {e.sublabel && (
                            <Typography variant="caption" color="text.secondary">
                              {e.sublabel}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    {metrics.map((metric) => {
                      const val = e[metric] as number | null;
                      const isWinner =
                        val !== null && bestValues[metric] !== null && val === bestValues[metric];
                      return (
                        <TableCell key={metric} align="right">
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-end"
                            spacing={0.5}
                          >
                            {isWinner && entities.length > 1 && (
                              <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 14 }} />
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isWinner && entities.length > 1 ? 700 : 400,
                                color:
                                  isWinner && entities.length > 1 ? 'primary.main' : 'text.primary',
                              }}
                            >
                              {formatMetricValue(metric, val)}
                            </Typography>
                          </Stack>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ---- Loading skeleton ----
export function ComparisonPanelSkeleton() {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <CompareArrowsIcon color="action" />
          <Skeleton variant="text" width={200} height={32} />
        </Stack>
        <Skeleton variant="rectangular" height={120} />
      </CardContent>
    </Card>
  );
}
