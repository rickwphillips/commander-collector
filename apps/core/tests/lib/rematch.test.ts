import { describe, it, expect } from 'vitest';
import { buildRematchPrefill } from '@/lib/rematch';
import type { GameWithResults, GameResultWithDeck } from '@/lib/types';

type ResultOverrides = Partial<GameResultWithDeck> & Pick<GameResultWithDeck, 'deck_id' | 'finish_position'>;

function makeResult(o: ResultOverrides): GameResultWithDeck {
  return {
    id: `r-${o.deck_id}`,
    game_id: 'g1',
    player_id: `p-${o.deck_id}`,
    player_name: `Player ${o.deck_id}`,
    deck_name: `Deck ${o.deck_id}`,
    commander: `Commander ${o.deck_id}`,
    partner: null,
    colors: 'WUBRG',
    eliminated_turn: null,
    team_number: null,
    ...o,
  };
}

function makeGame(o: Partial<GameWithResults> & { results: GameResultWithDeck[] }): GameWithResults {
  return {
    id: 'g1',
    played_at: '2026-07-15',
    winning_turn: null,
    notes: null,
    game_type: 'standard',
    created_at: '2026-07-15 12:00:00',
    ...o,
  };
}

describe('buildRematchPrefill', () => {
  it('maps a standard four-player game to one seat per result, ordered by finish position', () => {
    const game = makeGame({
      game_type: 'standard',
      results: [
        makeResult({ deck_id: 'c', finish_position: 3 }),
        makeResult({ deck_id: 'a', finish_position: 1 }),
        makeResult({ deck_id: 'd', finish_position: 4 }),
        makeResult({ deck_id: 'b', finish_position: 2 }),
      ],
    });

    const { prefill, gameType, playerCount, startingLife } = buildRematchPrefill(game);

    expect(gameType).toBe('standard');
    expect(playerCount).toBe(4);
    expect(startingLife).toBe(40);
    expect(prefill.map((p) => p.deckId)).toEqual(['a', 'b', 'c', 'd']);
    expect(prefill[0]).toEqual({
      playerId: 'p-a',
      deckId: 'a',
      playerName: 'Player a',
      deckName: 'Deck a',
      commander: { name: 'Commander a' },
      partner: undefined,
    });
  });

  it('defaults starting life to 30 for a two-player game', () => {
    const game = makeGame({
      results: [
        makeResult({ deck_id: 'a', finish_position: 1 }),
        makeResult({ deck_id: 'b', finish_position: 2 }),
      ],
    });
    expect(buildRematchPrefill(game).startingLife).toBe(30);
  });

  it('defaults starting life to 40 for a three-player game', () => {
    const game = makeGame({
      results: [
        makeResult({ deck_id: 'a', finish_position: 1 }),
        makeResult({ deck_id: 'b', finish_position: 2 }),
        makeResult({ deck_id: 'c', finish_position: 3 }),
      ],
    });
    expect(buildRematchPrefill(game).startingLife).toBe(40);
  });

  it('orders 2HG seats by team then finish so teammates stay grouped, and uses 30 life', () => {
    const game = makeGame({
      game_type: '2hg',
      results: [
        makeResult({ deck_id: 't2b', finish_position: 4, team_number: 2 }),
        makeResult({ deck_id: 't1a', finish_position: 1, team_number: 1 }),
        makeResult({ deck_id: 't2a', finish_position: 3, team_number: 2 }),
        makeResult({ deck_id: 't1b', finish_position: 2, team_number: 1 }),
      ],
    });

    const { prefill, gameType, startingLife } = buildRematchPrefill(game);

    expect(gameType).toBe('2hg');
    expect(startingLife).toBe(30);
    // Team 1 seats first (finish order within team), then team 2.
    expect(prefill.map((p) => p.deckId)).toEqual(['t1a', 't1b', 't2a', 't2b']);
  });

  it('preserves a partner commander when the deck has one', () => {
    const game = makeGame({
      results: [
        makeResult({ deck_id: 'a', finish_position: 1, partner: 'Tana, the Bloodsower' }),
        makeResult({ deck_id: 'b', finish_position: 2 }),
      ],
    });
    const { prefill } = buildRematchPrefill(game);
    expect(prefill[0].partner).toEqual({ name: 'Tana, the Bloodsower' });
    expect(prefill[1].partner).toBeUndefined();
  });

  it('leaves partner undefined when the field is absent', () => {
    const game = makeGame({
      results: [makeResult({ deck_id: 'a', finish_position: 1, partner: undefined })],
    });
    expect(buildRematchPrefill(game).prefill[0].partner).toBeUndefined();
  });

  it('returns an empty prefill when the game has no results', () => {
    const game = makeGame({ results: [] });
    const { prefill, playerCount, startingLife } = buildRematchPrefill(game);
    expect(prefill).toEqual([]);
    expect(playerCount).toBe(0);
    expect(startingLife).toBe(40);
  });

  it('tolerates a game whose results are missing entirely', () => {
    const game = makeGame({ results: [] });
    // Simulate a malformed payload with no results array at all.
    delete (game as { results?: unknown }).results;
    expect(buildRematchPrefill(game).prefill).toEqual([]);
  });
});
