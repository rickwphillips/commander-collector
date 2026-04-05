'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import type {
  ComparisonGroupBy,
  ComparisonMetric,
  ComparisonConditions,
  ComparisonEntityFilter,
  Player,
  DeckWithPlayer,
} from '@/lib/types';
import { sortColors, GUILD_NAMES, SHARD_NAMES, WEDGE_NAMES, COLOR_NAMES_LOWER } from '@/lib/utils';

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

const COLOR_NAME = COLOR_NAMES_LOWER;

// ---- Guild / Shard / Wedge nickname flags ----

interface NickFlags { useGuilds: boolean; useShards: boolean; useWedges: boolean }

function colorNickname(colors: string[], flags: NickFlags): string | undefined {
  const key = sortColors(colors);
  if (colors.length === 2 && flags.useGuilds) return GUILD_NAMES[key];
  if (colors.length === 3) {
    if (flags.useShards && SHARD_NAMES[key]) return SHARD_NAMES[key];
    if (flags.useWedges && WEDGE_NAMES[key]) return WEDGE_NAMES[key];
  }
  return undefined;
}

/** Full color names for use in the subject: "white and blue", "only red", etc. */
function subjectColors(colors: string[], mode: string | undefined, flags: NickFlags): string {
  const nickname = colorNickname(colors, flags);
  if (nickname) return nickname;
  const names = colors.map((c) => COLOR_NAME[c] ?? c);
  const m = mode ?? 'and';
  if (m === 'only') return `only ${joinNames(names)}`;
  if (m === 'or') return names.join(' or ');
  return joinNames(names);
}

/** Color clause for filter/opponent contexts: uses nickname when AND mode matches a known combo. */
function colorClause(colors: string[], mode: string | undefined, flags: NickFlags): string {
  const m = mode ?? 'and';
  if (m === 'and') {
    const nickname = colorNickname(colors, flags);
    if (nickname) return `${nickname} decks`;
  }
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
  nickFlags = { useGuilds: false, useShards: false, useWedges: false },
}: {
  groupBy: ComparisonGroupBy;
  conditions: ComparisonConditions;
  entityFilter: ComparisonEntityFilter;
  metrics: ComparisonMetric[];
  topN: number | undefined;
  players: Player[];
  decks: DeckWithPlayer[];
  nickFlags?: NickFlags;
}): string {
  const subject = SUBJECT[groupBy];
  const prefix = conditions.my_decks_only
    ? topN ? `my top ${topN} ` : 'my '
    : topN ? `top ${topN} ` : 'all ';

  // Colors describe the subject itself (commanders/decks share the same color identity)
  const colorPrefix = conditions.must_include_colors?.length
    ? `${subjectColors(conditions.must_include_colors, conditions.color_mode, nickFlags)} `
    : '';

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

  // ── Condition clauses ──────────────────────────────────────────
  const condClauses: string[] = [];

  if (conditions.my_games_only) {
    const typeLabel =
      conditions.game_type === '2hg' ? '2HG' :
      conditions.game_type === 'standard' ? 'Commander' : '';
    condClauses.push(typeLabel ? `in my ${typeLabel} games` : 'in my games');
  } else if (conditions.game_type && conditions.game_type !== 'all') {
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
      `against ${colorClause(conditions.opponent_colors, conditions.opponent_color_mode, nickFlags)}`
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
  let sentence = `Show me ${prefix}${colorPrefix}${subject}`;
  if (narrowClauses.length) sentence += ` ${narrowClauses.join(', ')}`;
  if (condClauses.length) sentence += `, ${condClauses.join(', ')}`;
  if (metrics.length) {
    sentence += `, ranked by ${joinNames(metrics.map((m) => METRIC_LABEL[m]))}`;
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
  const [useGuilds, setUseGuilds] = useState(true);
  const [useShards, setUseShards] = useState(true);
  const [useWedges, setUseWedges] = useState(true);
  const nickFlags: NickFlags = { useGuilds, useShards, useWedges };

  const sentence = buildQuerySentence({ ...props, nickFlags });
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const nickOptions = [
    { label: 'Guilds', val: useGuilds, set: setUseGuilds },
    { label: 'Shards', val: useShards, set: setUseShards },
    { label: 'Wedges', val: useWedges, set: setUseWedges },
  ];

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1, marginBottom: -1 }} />
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderLeft: 3,
          borderColor: 'primary.main',
          pl: 1.5,
          py: 0.75,
          mb: 1,
          bgcolor: (theme) =>
            stuck
              ? theme.palette.background.paper
              : theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(0,0,0,0.03)',
          borderRadius: '0 4px 4px 0',
          boxShadow: stuck ? 2 : 0,
          transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontStyle: 'italic', color: 'text.secondary', lineHeight: 1.6 }}
        >
          {sentence}
        </Typography>
      </Box>
      <Stack direction="row" alignItems="center" spacing={0} sx={{ mb: 2, pl: 0.5 }}>
        <Typography variant="caption" color="text.disabled" sx={{ mr: 1 }}>
          Color names:
        </Typography>
        {nickOptions.map(({ label, val, set }) => (
          <FormControlLabel
            key={label}
            sx={{ mr: 1 }}
            control={
              <Checkbox
                size="small"
                checked={val}
                onChange={(e) => set(e.target.checked)}
                sx={{ py: 0.25 }}
              />
            }
            label={<Typography variant="caption">{label}</Typography>}
          />
        ))}
        <Typography
          variant="caption"
          onClick={() => { setUseGuilds(true); setUseShards(true); setUseWedges(true); }}
          sx={{ cursor: 'pointer', color: 'primary.main', mr: 0.75 }}
        >
          All
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ mr: 0.75 }}>/</Typography>
        <Typography
          variant="caption"
          onClick={() => { setUseGuilds(false); setUseShards(false); setUseWedges(false); }}
          sx={{ cursor: 'pointer', color: 'primary.main' }}
        >
          None
        </Typography>
      </Stack>
    </>
  );
}
