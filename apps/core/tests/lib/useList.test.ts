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
});
