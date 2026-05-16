import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDeckBracket, _resetDeckBracketCache } from '@/lib/useDeckBracket';
import * as apiModule from '@/lib/api';

function mockGetDeckProfile(cards: string[]) {
  return vi.spyOn(apiModule.api, 'getDeckProfile').mockResolvedValue({
    cards: cards.map((name) => ({ card_name: name, quantity: 1 })),
  } as never);
}

function mockScoreDeck(result: Parameters<typeof apiModule.api.scoreDeck>[0] extends never ? never : Awaited<ReturnType<typeof apiModule.api.scoreDeck>>) {
  return vi.spyOn(apiModule.api, 'scoreDeck').mockResolvedValue(result as never);
}

const CERTAIN_BRACKET: Awaited<ReturnType<typeof apiModule.api.scoreDeck>> = {
  band: 'high',
  data: {
    bracket: 3,
    bracket_name: 'High Power',
    strength_score: 2.4,
    signals: [{ name: 'fast_mana', contribution: 1.2, reason: 'Sol Ring' }],
    warnings: [],
    color_identity: ['U'],
    missing: [],
  },
  sources: ['mcp'],
  caveats: [],
};

describe('useDeckBracket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _resetDeckBracketCache();
    localStorage.clear();
  });
  afterEach(() => { vi.restoreAllMocks(); });

  it('returns loading:true initially when deckId is provided', () => {
    mockGetDeckProfile(['Sol Ring']);
    mockScoreDeck(CERTAIN_BRACKET);
    const { result } = renderHook(() => useDeckBracket('deck-1'));
    expect(result.current.loading).toBe(true);
    expect(result.current.bracket).toBeNull();
  });

  it('returns EMPTY state when deckId is null', () => {
    const { result } = renderHook(() => useDeckBracket(null));
    expect(result.current.loading).toBe(false);
    expect(result.current.bracket).toBeNull();
  });

  it('returns EMPTY state when deckId is undefined', () => {
    const { result } = renderHook(() => useDeckBracket(undefined));
    expect(result.current.loading).toBe(false);
    expect(result.current.bracket).toBeNull();
  });

  it('resolves bracket after fetch', async () => {
    mockGetDeckProfile(['Sol Ring', 'Brainstorm']);
    mockScoreDeck(CERTAIN_BRACKET);
    const { result } = renderHook(() => useDeckBracket('deck-1', 'Atraxa'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bracket).toBe(3);
    expect(result.current.bracketName).toBe('High Power');
    expect(result.current.strengthScore).toBeCloseTo(2.4);
    expect(result.current.signals).toHaveLength(1);
    expect(result.current.signals[0].name).toBe('fast_mana');
  });

  it('returns null bracket with caveat when deck has no cards', async () => {
    mockGetDeckProfile([]);
    const { result } = renderHook(() => useDeckBracket('empty-deck'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bracket).toBeNull();
    expect(result.current.caveats[0]).toMatch(/no card list/i);
  });

  it('returns null bracket with caveat when MCP returns unknown band', async () => {
    mockGetDeckProfile(['Sol Ring']);
    mockScoreDeck({ band: 'unknown', data: null, sources: [], caveats: ['MCP unavailable'] } as never);
    const { result } = renderHook(() => useDeckBracket('deck-2'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bracket).toBeNull();
    expect(result.current.caveats).toContain('MCP unavailable');
  });

  it('returns error state when getDeckProfile throws', async () => {
    vi.spyOn(apiModule.api, 'getDeckProfile').mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useDeckBracket('deck-3'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network error');
    expect(result.current.bracket).toBeNull();
  });

  it('caches result so getDeckProfile is not called twice for same deckId', async () => {
    const profileSpy = mockGetDeckProfile(['Sol Ring']);
    mockScoreDeck(CERTAIN_BRACKET);
    const { result: r1 } = renderHook(() => useDeckBracket('deck-cached'));
    await waitFor(() => expect(r1.current.loading).toBe(false));
    const { result: r2 } = renderHook(() => useDeckBracket('deck-cached'));
    await waitFor(() => expect(r2.current.loading).toBe(false));
    expect(profileSpy).toHaveBeenCalledTimes(1);
    expect(r2.current.bracket).toBe(3);
  });
});
