import { describe, it, expect } from 'vitest';
import { buildQuerySentence } from '@/stats/customize/QuerySentence';
import type {
  ComparisonConditions,
  ComparisonEntityFilter,
  ComparisonMetric,
  ComparisonGroupBy,
  Player,
  DeckWithPlayer,
} from '@/lib/types';

// ── Helpers ──────────────────────────────────────────────────────────

const EMPTY_CONDITIONS: ComparisonConditions = {};
const EMPTY_ENTITY_FILTER: ComparisonEntityFilter = {};
const PLAYERS: Player[] = [
  { id: 'player-alice', name: 'Alice', user_id: null, created_at: '' },
  { id: 'player-bob', name: 'Bob', user_id: null, created_at: '' },
];
const DECKS: DeckWithPlayer[] = [];

function sentence(overrides: {
  groupBy?: ComparisonGroupBy;
  conditions?: ComparisonConditions;
  entityFilter?: ComparisonEntityFilter;
  metrics?: ComparisonMetric[];
  topN?: number;
  players?: Player[];
  decks?: DeckWithPlayer[];
  nickFlags?: { useGuilds: boolean; useShards: boolean; useWedges: boolean };
}): string {
  return buildQuerySentence({
    groupBy: overrides.groupBy ?? 'player',
    conditions: overrides.conditions ?? EMPTY_CONDITIONS,
    entityFilter: overrides.entityFilter ?? EMPTY_ENTITY_FILTER,
    metrics: overrides.metrics ?? ['win_rate'],
    topN: overrides.topN,
    players: overrides.players ?? PLAYERS,
    decks: overrides.decks ?? DECKS,
    nickFlags: overrides.nickFlags,
  });
}

// ── Tests ────────────────────────────────────────────────────────────

describe('buildQuerySentence', () => {
  it('produces a basic sentence with default args', () => {
    expect(sentence({})).toBe('Show me all players, ranked by Win Rate.');
  });

  it('includes top_n in the prefix', () => {
    expect(sentence({ topN: 10 })).toBe(
      'Show me top 10 players, ranked by Win Rate.',
    );
  });

  it('uses deck subject when groupBy is deck', () => {
    expect(sentence({ groupBy: 'deck' })).toBe(
      'Show me all decks, ranked by Win Rate.',
    );
  });

  it('uses guild names for 2-color identity with useGuilds on', () => {
    const result = sentence({
      groupBy: 'deck',
      conditions: { must_include_colors: ['W', 'U'] },
      nickFlags: { useGuilds: true, useShards: false, useWedges: false },
    });
    expect(result).toBe('Show me all Azorius decks, ranked by Win Rate.');
  });

  it('falls back to full color names when useGuilds is off', () => {
    const result = sentence({
      groupBy: 'deck',
      conditions: { must_include_colors: ['W', 'U'] },
      nickFlags: { useGuilds: false, useShards: false, useWedges: false },
    });
    expect(result).toBe(
      'Show me all white and blue decks, ranked by Win Rate.',
    );
  });

  it('uses shard names for 3-color identity', () => {
    const result = sentence({
      groupBy: 'deck',
      conditions: { must_include_colors: ['W', 'U', 'G'] },
      nickFlags: { useGuilds: false, useShards: true, useWedges: false },
    });
    expect(result).toBe('Show me all Bant decks, ranked by Win Rate.');
  });

  it('appends "in my games" for my_games_only', () => {
    const result = sentence({
      conditions: { my_games_only: true },
    });
    expect(result).toBe(
      'Show me all players, in my games, ranked by Win Rate.',
    );
  });

  it('changes prefix to "my" for my_decks_only', () => {
    const result = sentence({
      conditions: { my_decks_only: true },
    });
    expect(result).toBe('Show me my players, ranked by Win Rate.');
  });

  it('combines my_decks_only with top_n', () => {
    const result = sentence({
      conditions: { my_decks_only: true },
      topN: 5,
    });
    expect(result).toBe('Show me my top 5 players, ranked by Win Rate.');
  });

  it('shows Commander game type filter', () => {
    const result = sentence({
      conditions: { game_type: 'standard' },
    });
    expect(result).toBe(
      'Show me all players, in Commander games, ranked by Win Rate.',
    );
  });

  it('shows 2HG game type filter', () => {
    const result = sentence({
      conditions: { game_type: '2hg' },
    });
    expect(result).toBe(
      'Show me all players, in 2HG games, ranked by Win Rate.',
    );
  });

  it('combines my_games_only with Commander game type', () => {
    const result = sentence({
      conditions: { my_games_only: true, game_type: 'standard' },
    });
    expect(result).toBe(
      'Show me all players, in my Commander games, ranked by Win Rate.',
    );
  });

  it('includes required_player_ids clause (singular)', () => {
    const result = sentence({
      conditions: { required_player_ids: ['player-alice'] },
    });
    expect(result).toBe(
      'Show me all players, when Alice was in the pod, ranked by Win Rate.',
    );
  });

  it('includes required_player_ids clause (plural)', () => {
    const result = sentence({
      conditions: { required_player_ids: ['player-alice', 'player-bob'] },
    });
    expect(result).toBe(
      'Show me all players, when Alice and Bob were in the pod, ranked by Win Rate.',
    );
  });

  it('joins multiple metrics with "and"', () => {
    const result = sentence({
      metrics: ['win_rate', 'total_games'],
    });
    expect(result).toBe(
      'Show me all players, ranked by Win Rate and Total Games.',
    );
  });

  it('joins three metrics with commas and "and"', () => {
    const result = sentence({
      metrics: ['win_rate', 'total_games', 'wins'],
    });
    expect(result).toBe(
      'Show me all players, ranked by Win Rate, Total Games, and Wins.',
    );
  });

  it('color mode "or" uses "or" join when guild names are off', () => {
    const result = sentence({
      groupBy: 'deck',
      conditions: { must_include_colors: ['W', 'U'], color_mode: 'or' },
      nickFlags: { useGuilds: false, useShards: false, useWedges: false },
    });
    expect(result).toBe(
      'Show me all white or blue decks, ranked by Win Rate.',
    );
  });

  it('color mode "or" still uses guild name when useGuilds is on', () => {
    const result = sentence({
      groupBy: 'deck',
      conditions: { must_include_colors: ['W', 'U'], color_mode: 'or' },
      nickFlags: { useGuilds: true, useShards: false, useWedges: false },
    });
    expect(result).toBe(
      'Show me all Azorius decks, ranked by Win Rate.',
    );
  });

  it('color mode "only" prefixes "only"', () => {
    const result = sentence({
      groupBy: 'deck',
      conditions: { must_include_colors: ['R'], color_mode: 'only' },
    });
    expect(result).toBe(
      'Show me all only red decks, ranked by Win Rate.',
    );
  });

  it('includes min_games clause', () => {
    const result = sentence({
      conditions: { min_games: 5 },
    });
    expect(result).toBe(
      'Show me all players, with at least 5 games, ranked by Win Rate.',
    );
  });

  it('omits min_games clause when value is 1', () => {
    const result = sentence({
      conditions: { min_games: 1 },
    });
    expect(result).toBe('Show me all players, ranked by Win Rate.');
  });

  it('includes date range clauses', () => {
    const result = sentence({
      conditions: { date_from: '2025-01-01', date_to: '2025-12-31' },
    });
    expect(result).toContain('between 2025-01-01 and 2025-12-31');
  });

  it('includes pod_size clause', () => {
    const result = sentence({
      conditions: { pod_size: 4 },
    });
    expect(result).toContain('in 4-player pods');
  });

  it('shows 5+ for pod_size >= 5', () => {
    const result = sentence({
      conditions: { pod_size: 5 },
    });
    expect(result).toContain('in 5+-player pods');
  });

  it('does not include game_type clause when set to "all"', () => {
    const result = sentence({
      conditions: { game_type: 'all' },
    });
    expect(result).toBe('Show me all players, ranked by Win Rate.');
  });
});
