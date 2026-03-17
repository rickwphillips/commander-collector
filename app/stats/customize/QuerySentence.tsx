'use client';

import { Box, Typography } from '@mui/material';
import type {
  ComparisonGroupBy,
  ComparisonMetric,
  ComparisonConditions,
  ComparisonEntityFilter,
  Player,
  DeckWithPlayer,
} from '../../lib/types';

// ---- Helpers ----

function joinNames(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

const SUBJECT: Record<ComparisonGroupBy, string> = {
  player: 'players',
  deck: 'decks',
  commander: 'commanders',
  color: 'color identities',
  deck_age: 'decks by age',
  pod_size: 'games by pod size',
  game_length: 'games by length',
  game_type: 'games by type',
  month: 'games by month',
  year: 'games by year',
  season: 'games by season',
  day_of_week: 'games by day of week',
  opponent_player: 'opponents by player',
  opponent_commander: 'opponents by commander',
};

const METRIC_LABEL: Record<ComparisonMetric, string> = {
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

function colorClause(colors: string[], mode: string | undefined): string {
  const m = mode ?? 'and';
  if (m === 'only') return `only ${colors.join('')} decks`;
  if (m === 'or') return `${colors.join(' or ')} decks`;
  return `${colors.join('+')} decks`;
}

export function buildQuerySentence({
  groupBy,
  conditions,
  entityFilter,
  metrics,
  topN,
  players,
  decks,
}: {
  groupBy: ComparisonGroupBy;
  conditions: ComparisonConditions;
  entityFilter: ComparisonEntityFilter;
  metrics: ComparisonMetric[];
  topN: number | undefined;
  players: Player[];
  decks: DeckWithPlayer[];
}): string {
  const subject = SUBJECT[groupBy];
  const prefix = topN ? `top ${topN}` : 'all';

  // ── Narrow-to clauses (from entityFilter) ──────────────────────
  const narrowClauses: string[] = [];

  if (entityFilter.player_ids?.length) {
    const names = entityFilter.player_ids.map(
      (id) => players.find((p) => p.id === id)?.name ?? `#${id}`
    );
    narrowClauses.push(`for ${joinNames(names)}`);
  }
  if (entityFilter.deck_ids?.length) {
    const names = entityFilter.deck_ids.map(
      (id) => decks.find((d) => d.id === id)?.name ?? `#${id}`
    );
    narrowClauses.push(`for decks ${joinNames(names)}`);
  }
  if (entityFilter.commanders?.length) {
    narrowClauses.push(`playing ${joinNames(entityFilter.commanders)}`);
  }
  if (entityFilter.colors?.length) {
    narrowClauses.push(`playing ${colorClause(entityFilter.colors, entityFilter.color_mode)}`);
  }

  // ── Condition clauses ──────────────────────────────────────────
  const condClauses: string[] = [];

  if (conditions.my_games_only) {
    condClauses.push('in my games');
  }
  if (conditions.game_type && conditions.game_type !== 'all') {
    condClauses.push(`in ${conditions.game_type === '2hg' ? '2HG' : 'Commander'} games`);
  }
  if (conditions.pod_size != null) {
    condClauses.push(`in ${conditions.pod_size >= 5 ? '5+' : conditions.pod_size}-player pods`);
  }
  if (conditions.min_winning_turn != null) {
    condClauses.push(`won in ${conditions.min_winning_turn}+ turns`);
  }
  if (conditions.max_winning_turn != null) {
    condClauses.push(`won in ${conditions.max_winning_turn} or fewer turns`);
  }
  if (conditions.min_finish_position != null && conditions.min_finish_position > 1) {
    condClauses.push(`counting top-${conditions.min_finish_position} as wins`);
  }
  if (conditions.must_include_colors?.length) {
    condClauses.push(
      `where decks include ${colorClause(conditions.must_include_colors, conditions.color_mode)}`
    );
  }
  if (conditions.required_player_ids?.length) {
    const names = conditions.required_player_ids.map(
      (id) => players.find((p) => p.id === id)?.name ?? `#${id}`
    );
    condClauses.push(`when ${joinNames(names)} ${names.length > 1 ? 'were' : 'was'} in the pod`);
  }
  if (conditions.required_commanders?.length) {
    const n = conditions.required_commanders.length;
    condClauses.push(
      `when ${joinNames(conditions.required_commanders)} ${n > 1 ? 'were' : 'was'} in the pod`
    );
  }
  if (conditions.opponent_player_ids?.length) {
    const names = conditions.opponent_player_ids.map(
      (id) => players.find((p) => p.id === id)?.name ?? `#${id}`
    );
    condClauses.push(`against ${joinNames(names)}`);
  }
  if (conditions.opponent_commanders?.length) {
    condClauses.push(`against ${joinNames(conditions.opponent_commanders)}`);
  }
  if (conditions.opponent_colors?.length) {
    condClauses.push(
      `against ${colorClause(conditions.opponent_colors, conditions.opponent_color_mode)}`
    );
  }
  if (conditions.exclude_player_ids?.length) {
    const names = conditions.exclude_player_ids.map(
      (id) => players.find((p) => p.id === id)?.name ?? `#${id}`
    );
    condClauses.push(`excluding ${joinNames(names)} from pods`);
  }
  if (conditions.date_from && conditions.date_to) {
    condClauses.push(`between ${conditions.date_from} and ${conditions.date_to}`);
  } else if (conditions.date_from) {
    condClauses.push(`from ${conditions.date_from}`);
  } else if (conditions.date_to) {
    condClauses.push(`until ${conditions.date_to}`);
  }
  if (conditions.min_games != null && conditions.min_games > 1) {
    condClauses.push(`with at least ${conditions.min_games} games`);
  }

  // ── Assemble ───────────────────────────────────────────────────
  let sentence = `Show me ${prefix} ${subject}`;
  if (narrowClauses.length) sentence += ` ${narrowClauses.join(', ')}`;
  if (condClauses.length) sentence += `, ${condClauses.join(', ')}`;
  if (metrics.length) {
    sentence += `, ranked by ${metrics.map((m) => METRIC_LABEL[m]).join(' · ')}`;
  }
  sentence += '.';

  return sentence;
}

// ---- Component ----

interface QuerySentenceProps {
  groupBy: ComparisonGroupBy;
  conditions: ComparisonConditions;
  entityFilter: ComparisonEntityFilter;
  metrics: ComparisonMetric[];
  topN: number | undefined;
  players: Player[];
  decks: DeckWithPlayer[];
}

export function QuerySentence(props: QuerySentenceProps) {
  const sentence = buildQuerySentence(props);

  return (
    <Box
      sx={{
        borderLeft: 3,
        borderColor: 'primary.main',
        pl: 1.5,
        py: 0.75,
        mb: 3,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.04)'
            : 'rgba(0,0,0,0.03)',
        borderRadius: '0 4px 4px 0',
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontStyle: 'italic', color: 'text.secondary', lineHeight: 1.6 }}
      >
        {sentence}
      </Typography>
    </Box>
  );
}
