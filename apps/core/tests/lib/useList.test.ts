import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useList } from '@/lib/lists/useList';
import * as apiModule from '@/lib/api';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a minimal ApiCardRow. All metadata fields present by default. */
function makeApiCard(overrides: Record<string, unknown> = {}) {
  return {
    id: 'card-1',
    card_name: 'Lightning Bolt',
    scryfall_id: 'scry-abc',
    image_uri: 'https://example.com/img.jpg',
    back_image_uri: null,
    color_identity: 'R',
    colors: 'R',
    type_line: 'Instant',
    mana_cost: '{R}',
    quantity: 1,
    is_commander: 0,
    is_proxy: 0,
    ...overrides,
  };
}

/** Build a minimal list API response. Cards get auto-indexed ids (card-0, card-1, …) unless overrides specify id. */
function makeListDetail(cardOverrides: Record<string, unknown>[] = [{}]) {
  return {
    id: 'list-uuid-1',
    name: 'Test List',
    deck_id: null,
    role: null,
    format: 'commander',
    version: 1,
    deleted_at: null,
    cards: cardOverrides.map((overrides, i) => makeApiCard({ id: `card-${i}`, ...overrides })),
  };
}

// ── Mock apiFetch globally ────────────────────────────────────────────────────

vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof apiModule>();
  return {
    ...actual,
    apiFetch: vi.fn(),
  };
});

const mockApiFetch = vi.mocked(apiModule.apiFetch);

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('useList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── A) resolveMetadata loop ──────────────────────────────────────────────

  describe('resolveMetadata loop', () => {
    it('does not fire resolver when all cards have scryfall_id and type_line and image_uri', async () => {
      const detail = makeListDetail([
        { id: 'c1', scryfall_id: 'abc', type_line: 'Instant', image_uri: 'img.jpg', colors: 'R', color_identity: 'R' },
      ]);
      mockApiFetch.mockResolvedValueOnce(detail);

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.resolving).toBe(false);
      expect('unresolvedCount' in result.current).toBe(false); // not exposed
      // resolver did not fire — apiFetch called exactly once (the initial load)
      expect(mockApiFetch).toHaveBeenCalledTimes(1);
      expect(result.current.resolveError).toBeNull();
    });

    it('fires resolver when a card is missing scryfall_id and patches card state', async () => {
      const detail = makeListDetail([
        { id: 'c1', scryfall_id: null, type_line: null, image_uri: null, colors: undefined, color_identity: undefined },
      ]);
      // The card id in the patch must match the card id from the initial load
      const patchedId = detail.cards[0].id;
      const resolverResponse = {
        updated: [
          {
            id: patchedId,
            card_name: 'Lightning Bolt',
            scryfall_id: 'new-scry-id',
            image_uri: 'https://example.com/new.jpg',
            back_image_uri: null,
            type_line: 'Instant',
            mana_cost: '{R}',
            colors: 'R',
            color_identity: 'R',
            quantity: 1,
            is_commander: 0,
            is_proxy: 0,
          },
        ],
        remaining: 0,
      };

      mockApiFetch
        .mockResolvedValueOnce(detail)          // initial load
        .mockResolvedValueOnce(resolverResponse); // resolver batch

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      // Wait for loading to finish, then wait for resolving to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      await waitFor(() => expect(result.current.resolving).toBe(false));

      // Resolver fired and patched the card
      expect(mockApiFetch).toHaveBeenCalledTimes(2);
      expect(result.current.cards[0].scryfall_id).toBe('new-scry-id');
      expect(result.current.cards[0].type_line).toBe('Instant');
      expect(result.current.resolveError).toBeNull();
    });

    it('sets resolvingTotal to unresolvedCount upfront and increments resolvedCount after each batch', async () => {
      const detail = makeListDetail([
        { id: 'c1', scryfall_id: null, type_line: null, image_uri: null, colors: undefined, color_identity: undefined },
        { id: 'c2', scryfall_id: null, type_line: null, image_uri: null, colors: undefined, color_identity: undefined },
      ]);
      // Use the actual ids from the detail
      const id1 = detail.cards[0].id;
      const id2 = detail.cards[1].id;
      const resolverResponse = {
        updated: [
          { id: id1, scryfall_id: 'sid1', image_uri: 'img1.jpg', back_image_uri: null, type_line: 'Land', mana_cost: null, colors: '', color_identity: '', quantity: 1, is_commander: 0, is_proxy: 0, card_name: 'Island' },
          { id: id2, scryfall_id: 'sid2', image_uri: 'img2.jpg', back_image_uri: null, type_line: 'Land', mana_cost: null, colors: '', color_identity: '', quantity: 1, is_commander: 0, is_proxy: 0, card_name: 'Forest' },
        ],
        remaining: 0,
      };

      mockApiFetch
        .mockResolvedValueOnce(detail)
        .mockResolvedValueOnce(resolverResponse);

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));

      // After initial load resolving starts — resolvingTotal should be 2
      await waitFor(() => expect(result.current.loading).toBe(false));
      await waitFor(() => expect(result.current.resolving).toBe(false));

      expect(result.current.resolvingTotal).toBe(2);
      expect(result.current.resolvedCount).toBe(2);
    });

    it('exits loop after one call when remaining === 0 on first batch', async () => {
      const detail = makeListDetail([
        { id: 'c1', scryfall_id: null, type_line: null, image_uri: null, colors: undefined, color_identity: undefined },
      ]);
      const patchedId = detail.cards[0].id;
      const resolverResponse = {
        updated: [{ id: patchedId, scryfall_id: 's1', image_uri: 'img.jpg', back_image_uri: null, type_line: 'Instant', mana_cost: '{R}', colors: 'R', color_identity: 'R', quantity: 1, is_commander: 0, is_proxy: 0, card_name: 'Lightning Bolt' }],
        remaining: 0,
      };

      mockApiFetch
        .mockResolvedValueOnce(detail)
        .mockResolvedValueOnce(resolverResponse);

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      await waitFor(() => expect(result.current.resolving).toBe(false));

      // Only 2 calls total: initial load + one resolver batch
      expect(mockApiFetch).toHaveBeenCalledTimes(2);
    });

    it('exits loop and sets resolveError when updated.length === 0 and remaining > 0', async () => {
      const detail = makeListDetail([
        { id: 'c1', scryfall_id: null, type_line: null, image_uri: null, colors: undefined, color_identity: undefined },
        { id: 'c2', scryfall_id: null, type_line: null, image_uri: null, colors: undefined, color_identity: undefined },
      ]);
      const resolverResponse = { updated: [], remaining: 2 };

      mockApiFetch
        .mockResolvedValueOnce(detail)
        .mockResolvedValueOnce(resolverResponse);

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      await waitFor(() => expect(result.current.resolveError).not.toBeNull());

      expect(result.current.resolveError).toMatch(/could not be resolved/i);
      // Only one resolver call was made
      expect(mockApiFetch).toHaveBeenCalledTimes(2);
    });

    it('exits loop and sets resolveError when apiFetch throws', async () => {
      const detail = makeListDetail([
        { id: 'c1', scryfall_id: null, type_line: null, image_uri: null, colors: undefined, color_identity: undefined },
      ]);

      mockApiFetch
        .mockResolvedValueOnce(detail)
        .mockRejectedValueOnce(new Error('Network timeout'));

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      await waitFor(() => expect(result.current.resolveError).not.toBeNull());

      expect(result.current.resolveError).toBe('Network timeout');
    });
  });

  // ── B) detachFromDeck ────────────────────────────────────────────────────

  describe('detachFromDeck', () => {
    it('throws immediately when list is not loaded', async () => {
      // No apiFetch calls needed — hook starts with no id/deckId
      const { result } = renderHook(() => useList({}));

      await expect(act(() => result.current.detachFromDeck())).rejects.toThrow(
        'Cannot detach: list not loaded'
      );
    });

    it('throws and sets error state when apiFetch fails', async () => {
      const detail = makeListDetail();
      mockApiFetch
        .mockResolvedValueOnce(detail)
        .mockRejectedValueOnce(new Error('Server error'));

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      let caught: Error | null = null;
      await act(async () => {
        try {
          await result.current.detachFromDeck();
        } catch (e) {
          caught = e as Error;
        }
      });

      expect(caught).not.toBeNull();
      expect(caught!.message).toBe('Server error');
      expect(result.current.error).toBe('Server error');
    });

    it('does NOT throw and clears error when apiFetch succeeds', async () => {
      const detail = makeListDetail();
      mockApiFetch
        .mockResolvedValueOnce(detail)
        .mockResolvedValueOnce({ success: true });

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.detachFromDeck());
      expect(result.current.error).toBeNull();
    });
  });

  // ── C) clearResolved ─────────────────────────────────────────────────────

  describe('clearResolved', () => {
    it('resets resolvedCount, resolvingTotal, and resolveError to initial values', async () => {
      // Load a list with unresolved cards to trigger the resolver
      const detail = makeListDetail([
        { id: 'c1', scryfall_id: null, type_line: null, image_uri: null, colors: undefined, color_identity: undefined },
      ]);
      const resolverResponse = {
        updated: [],
        remaining: 1,  // will cause resolveError to be set
      };

      mockApiFetch
        .mockResolvedValueOnce(detail)
        .mockResolvedValueOnce(resolverResponse);

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      // Wait until the async resolver has set resolveError
      await waitFor(() => expect(result.current.resolveError).not.toBeNull());

      act(() => result.current.clearResolved());

      await waitFor(() => expect(result.current.resolveError).toBeNull());
      expect(result.current.resolvedCount).toBe(0);
      expect(result.current.resolvingTotal).toBe(0);
    });
  });

  // ── D) Unresolved filter condition ────────────────────────────────────────

  describe('unresolved filter condition (resolver trigger)', () => {
    it('card with scryfall_id=null is counted as unresolved (resolver fires)', async () => {
      const detail = makeListDetail([
        { scryfall_id: null, type_line: 'Instant', image_uri: 'img.jpg', colors: 'R', color_identity: 'R' },
      ]);
      const resolverResponse = { updated: [], remaining: 1 };

      mockApiFetch
        .mockResolvedValueOnce(detail)
        .mockResolvedValueOnce(resolverResponse);

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      await waitFor(() => expect(result.current.resolveError).not.toBeNull());

      // Resolver fired — 2 calls total
      expect(mockApiFetch).toHaveBeenCalledTimes(2);
    });

    it('card with type_line=null is counted as unresolved (resolver fires)', async () => {
      const detail = makeListDetail([
        { scryfall_id: 'abc', type_line: null, image_uri: 'img.jpg', colors: 'R', color_identity: 'R' },
      ]);
      const resolverResponse = { updated: [], remaining: 1 };

      mockApiFetch
        .mockResolvedValueOnce(detail)
        .mockResolvedValueOnce(resolverResponse);

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      await waitFor(() => expect(result.current.resolveError).not.toBeNull());

      expect(mockApiFetch).toHaveBeenCalledTimes(2);
    });

    it('card with image_uri=null is counted as unresolved (resolver fires)', async () => {
      const detail = makeListDetail([
        { scryfall_id: 'abc', type_line: 'Instant', image_uri: null, colors: 'R', color_identity: 'R' },
      ]);
      const resolverResponse = { updated: [], remaining: 1 };

      mockApiFetch
        .mockResolvedValueOnce(detail)
        .mockResolvedValueOnce(resolverResponse);

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      await waitFor(() => expect(result.current.resolveError).not.toBeNull());

      expect(mockApiFetch).toHaveBeenCalledTimes(2);
    });

    it('card with all fields populated is NOT counted as unresolved (resolver does not fire)', async () => {
      const detail = makeListDetail([
        { scryfall_id: 'abc', type_line: 'Instant', image_uri: 'img.jpg', colors: 'R', color_identity: 'R' },
      ]);

      mockApiFetch.mockResolvedValueOnce(detail);

      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      // Give any async resolver a tick to start — it shouldn't
      await new Promise((r) => setTimeout(r, 20));

      expect(mockApiFetch).toHaveBeenCalledTimes(1);
      expect(result.current.resolving).toBe(false);
    });
  });

  // ── E) fetchById error + no-op when no opts ──────────────────────────────

  describe('fetchById + effect', () => {
    it('sets error when the initial load fails', async () => {
      mockApiFetch.mockRejectedValueOnce(new Error('Failed to fetch list'));
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBe('Failed to fetch list');
    });

    it('does nothing when neither id nor deckId is provided', async () => {
      const { result } = renderHook(() => useList({}));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(mockApiFetch).not.toHaveBeenCalled();
      expect(result.current.list).toBeNull();
    });
  });

  // ── F) fetchByDeckId (all branches) ──────────────────────────────────────

  describe('fetchByDeckId', () => {
    it('loads via the deck_id+role query when supported', async () => {
      mockApiFetch.mockResolvedValueOnce(makeListDetail());
      const { result } = renderHook(() => useList({ deckId: 'deck-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.list?.id).toBe('list-uuid-1');
      expect(mockApiFetch).toHaveBeenCalledTimes(1);
    });

    it('falls back to /decks?id when the deck_id+role query is unsupported', async () => {
      mockApiFetch
        .mockRejectedValueOnce(new Error('no route'))
        .mockResolvedValueOnce({ main_list_id: 'L9' })
        .mockResolvedValueOnce(makeListDetail());
      const { result } = renderHook(() => useList({ deckId: 'deck-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.list?.id).toBe('list-uuid-1');
      expect(mockApiFetch).toHaveBeenCalledTimes(3);
    });

    it('returns list=null when the deck has no main list', async () => {
      mockApiFetch
        .mockRejectedValueOnce(new Error('no route'))
        .mockResolvedValueOnce({});
      const { result } = renderHook(() => useList({ deckId: 'deck-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.list).toBeNull();
      expect(result.current.cards).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('sets error when the fallback deck fetch fails', async () => {
      mockApiFetch
        .mockRejectedValueOnce(new Error('no route'))
        .mockRejectedValueOnce(new Error('deck boom'));
      const { result } = renderHook(() => useList({ deckId: 'deck-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBe('deck boom');
    });
  });

  // ── G) refresh ───────────────────────────────────────────────────────────

  describe('refresh', () => {
    it('re-fetches by the loaded list id', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail([{ card_name: 'Original' }]))
        .mockResolvedValueOnce(makeListDetail([{ card_name: 'Refreshed' }]));
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.refresh());
      expect(result.current.cards[0].card_name).toBe('Refreshed');
    });

    it('re-fetches by deckId when no list is loaded', async () => {
      mockApiFetch
        .mockRejectedValueOnce(new Error('no route'))
        .mockResolvedValueOnce({}) // no main list → list stays null
        .mockResolvedValueOnce(makeListDetail());
      const { result } = renderHook(() => useList({ deckId: 'deck-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.list).toBeNull();

      await act(() => result.current.refresh());
      expect(result.current.list?.id).toBe('list-uuid-1');
    });

    it('re-fetches via opts.id after a failed initial load', async () => {
      mockApiFetch
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce(makeListDetail());
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.list).toBeNull();

      await act(() => result.current.refresh());
      expect(result.current.list?.id).toBe('list-uuid-1');
    });
  });

  describe('fetchByDeckId resolver', () => {
    it('fires the resolver in the deckId fallback path when metadata is missing', async () => {
      mockApiFetch
        .mockRejectedValueOnce(new Error('no route'))
        .mockResolvedValueOnce({ main_list_id: 'L9' })
        .mockResolvedValueOnce(makeListDetail([
          { scryfall_id: null, type_line: null, image_uri: null, colors: undefined, color_identity: undefined },
        ]))
        .mockResolvedValueOnce({ updated: [], remaining: 1 });
      const { result } = renderHook(() => useList({ deckId: 'deck-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      await waitFor(() => expect(result.current.resolveError).not.toBeNull());
    });
  });

  // ── H) save / addCards / removeCard / updateCard ─────────────────────────

  describe('save and derived mutators', () => {
    const cardInput = [
      { id: 'x1', card_name: 'Sol Ring', scryfall_id: 's1', quantity: 1, is_commander: false, is_proxy: false },
    ] as never;

    it('save sets an error when the list is not loaded', async () => {
      const { result } = renderHook(() => useList({}));
      await act(() => result.current.save(cardInput));
      expect(result.current.error).toBe('Cannot save: list not loaded');
    });

    it('save PATCHes and updates version + cards on success', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail())
        .mockResolvedValueOnce({ success: true, version: 2 });
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.save(cardInput));
      expect(result.current.list?.version).toBe(2);
      expect(result.current.cards[0].card_name).toBe('Sol Ring');
      expect(result.current.error).toBeNull();
    });

    it('save flags a conflict on a 409-style error', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail())
        .mockRejectedValueOnce(new Error('conflict'));
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.save(cardInput));
      expect(result.current.conflict).toBe(true);
      expect(result.current.error).toMatch(/Save conflict/);
    });

    it('save surfaces a non-conflict error without setting the conflict flag', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail())
        .mockRejectedValueOnce(new Error('boom'));
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.save(cardInput));
      expect(result.current.conflict).toBe(false);
      expect(result.current.error).toBe('boom');
    });

    it('addCards merges then saves', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail([{ card_name: 'Island', scryfall_id: 'isl' }]))
        .mockResolvedValueOnce({ success: true, version: 2 });
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.addCards([
        { id: 'y1', card_name: 'Forest', scryfall_id: 'for', quantity: 1, is_commander: false, is_proxy: false },
      ] as never));
      expect(mockApiFetch).toHaveBeenCalledTimes(2);
      expect(result.current.error).toBeNull();
    });

    it('removeCard filters out the card by id then saves', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail([{ id: 'c0', card_name: 'A' }, { id: 'c1', card_name: 'B' }]))
        .mockResolvedValueOnce({ success: true, version: 2 });
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.removeCard('c0'));
      expect(result.current.cards.some((c) => String(c.id) === 'c0')).toBe(false);
    });

    it('updateCard applies a patch by id then saves', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail([{ id: 'c0', card_name: 'A', quantity: 1 }]))
        .mockResolvedValueOnce({ success: true, version: 2 });
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.updateCard('c0', { quantity: 4 } as never));
      expect(result.current.cards[0].quantity).toBe(4);
    });
  });

  // ── I) attachToDeck ──────────────────────────────────────────────────────

  describe('attachToDeck', () => {
    it('sets an error when the list is not loaded', async () => {
      const { result } = renderHook(() => useList({}));
      await act(() => result.current.attachToDeck('deck-1'));
      expect(result.current.error).toBe('Cannot attach: list not loaded');
    });

    it('POSTs the attach action and clears error on success', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail())
        .mockResolvedValueOnce({ success: true });
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.attachToDeck('deck-1'));
      expect(result.current.error).toBeNull();
      const lastCall = mockApiFetch.mock.calls.at(-1)!;
      expect(lastCall[0]).toContain('action=attach_deck');
    });

    it('sets an error when the attach call fails', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail())
        .mockRejectedValueOnce(new Error('attach boom'));
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.attachToDeck('deck-1'));
      expect(result.current.error).toBe('attach boom');
    });
  });

  // ── J) non-Error rejection fallbacks (err instanceof Error === false) ──────

  describe('non-Error rejection fallbacks', () => {
    it('fetchById uses the fallback message when a non-Error is thrown', async () => {
      mockApiFetch.mockRejectedValueOnce('bare string');
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBe('Failed to load list');
    });

    it('fetchByDeckId uses the fallback message when the fallback fetch throws a non-Error', async () => {
      mockApiFetch
        .mockRejectedValueOnce(new Error('no route'))
        .mockRejectedValueOnce('bare string');
      const { result } = renderHook(() => useList({ deckId: 'deck-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBe('Failed to load list for deck');
    });

    it('save uses the fallback message when a non-Error is thrown', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail())
        .mockRejectedValueOnce('bare string');
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.save([
        { id: 'x1', card_name: 'Sol Ring', scryfall_id: 's1', quantity: 1, is_commander: false, is_proxy: false },
      ] as never));
      expect(result.current.conflict).toBe(false);
      expect(result.current.error).toBe('Save failed');
    });

    it('attachToDeck uses the fallback message when a non-Error is thrown', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail())
        .mockRejectedValueOnce('bare string');
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.attachToDeck('deck-1'));
      expect(result.current.error).toBe('Failed to attach list to deck');
    });

    it('detachFromDeck uses the fallback message when a non-Error is thrown', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail())
        .mockRejectedValueOnce('bare string');
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      let caught: Error | null = null;
      await act(async () => {
        try {
          await result.current.detachFromDeck();
        } catch (e) {
          caught = e as Error;
        }
      });
      expect(caught).not.toBeNull();
      expect(caught!.message).toBe('Failed to detach list from deck');
      expect(result.current.error).toBe('Failed to detach list from deck');
    });
  });

  // ── K) updateCard leaves non-matching cards untouched (ternary else branch) ─

  describe('updateCard non-matching branch', () => {
    it('patches only the matching card and leaves the others unchanged', async () => {
      mockApiFetch
        .mockResolvedValueOnce(makeListDetail([
          { id: 'c0', card_name: 'A', quantity: 1 },
          { id: 'c1', card_name: 'B', quantity: 1 },
        ]))
        .mockResolvedValueOnce({ success: true, version: 2 });
      const { result } = renderHook(() => useList({ id: 'list-uuid-1' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(() => result.current.updateCard('c0', { quantity: 7 } as never));
      const c0 = result.current.cards.find((c) => String(c.id) === 'c0');
      const c1 = result.current.cards.find((c) => String(c.id) === 'c1');
      expect(c0!.quantity).toBe(7);
      expect(c1!.quantity).toBe(1);
    });
  });
});
