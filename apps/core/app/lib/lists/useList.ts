/**
 * useList — shared hook for both standalone-list editing and deck-attached-list editing.
 *
 * PEERS RULE (enforced here):
 * This hook operates on a list. It has no knowledge of whether the list is
 * attached to a deck or not — it just operates on a list. Deck-native fields
 * (commander, partner, colors, has_*) come from useDeck, not from this hook.
 *
 * USAGE MODES:
 * - useList({ id })      — load a list directly by its UUID
 * - useList({ deckId })  — find the deck's role='main' list, then load it
 *
 * NULL LIST CASE:
 * When called with { deckId } and the deck has no role='main' list (e.g., a
 * freshly-created deck post-cutover before the PHP layer creates its main list),
 * the hook returns { list: null, cards: [] } with no error. The caller (e.g.,
 * CardListView) is responsible for deciding how to handle the empty state.
 *
 * OPTIMISTIC CONCURRENCY:
 * Every save passes the current list `version` to the server. If the server
 * returns HTTP 409 (conflict), the hook sets `error` and raises `conflict: true`
 * WITHOUT updating local state. The caller reads `conflict` and presents a
 * resolution UI (e.g., a "Reload and merge" dialog). The hook never retries
 * internally — conflict resolution is the caller's responsibility.
 *
 * ATTACH / DETACH (Step 6 NOTE):
 * TODO(Step 6): attachToDeck / detachFromDeck currently call a no-op shim on the
 * PHP side (introduced in Step 2 as a placeholder). Once Step 6 (list_history
 * audit) makes the underlying SQL functional, these calls will take effect and
 * a subsequent refresh() will reflect the new deck_id. Until Step 6 lands,
 * calling attachToDeck or detachFromDeck will succeed (2xx) but leave the DB
 * unchanged. Callers should always call refresh() after attach/detach.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Card } from '@/lib/cards/types';
import { fromApiCard } from '@/lib/cards/types';
import { mergeIntoBuffer } from '@/lib/cards/mergeIntoBuffer';
import { apiFetch } from '@/lib/api';
import type { ApiCardRow } from '@/lib/cards/types';
import type { CreateListCardInput } from '@/lib/types';

// ── Public interfaces ─────────────────────────────────────────────────────────

/** Metadata fields for a list row (UUID-keyed, post-v4.7.0 schema). */
export interface ListMeta {
  id: string;
  name: string;
  deck_id: string | null;
  role: string | null;
  format: string;
  version: number;
  deleted_at: string | null;
}

/** Options for initializing useList. Exactly one of id or deckId should be set. */
export interface UseListOptions {
  /** Existing list UUID — load directly. Preferred when you already have the list id. */
  id?: string;
  /**
   * Deck UUID — find and load the deck's role='main' list.
   * If the deck has no main list, hook returns { list: null, cards: [] }.
   */
  deckId?: string;
}

/** Return value of useList. */
export interface UseListResult {
  /** Loaded list metadata; null before load completes or if no main list exists. */
  list: ListMeta | null;
  /** Current card set for the list. Empty array until loaded or if no main list exists. */
  cards: Card[];
  loading: boolean;
  /** Non-null when an error occurred. Includes conflict message when `conflict` is true. */
  error: string | null;
  /**
   * True when the last save failed due to an optimistic concurrency conflict (HTTP 409).
   * Caller should present a "Reload and merge" UI. Cleared on next successful refresh().
   */
  conflict: boolean;
  /** Atomically replace the list's cards on the server. Passes current version for OCC. */
  save: (cards: Card[]) => Promise<void>;
  /**
   * Merge incoming cards into the current list using dedup/singleton rules
   * (via mergeIntoBuffer), then save.
   */
  addCards: (incoming: Card[]) => Promise<void>;
  /** Remove a card by its DB id (string UUID), then save. */
  removeCard: (cardId: string) => Promise<void>;
  /** Apply a partial patch to a card by its DB id (string UUID), then save. */
  updateCard: (cardId: string, patch: Partial<Card>) => Promise<void>;
  /**
   * Attach this list to a deck. Calls the PHP shim; see TODO(Step 6) above.
   * Always call refresh() after this to pick up the updated deck_id.
   */
  attachToDeck: (deckId: string) => Promise<void>;
  /**
   * Detach this list from its deck. Calls the PHP shim; see TODO(Step 6) above.
   * Always call refresh() after this to pick up the cleared deck_id.
   */
  detachFromDeck: () => Promise<void>;
  /** Re-fetch list metadata and cards from the server. */
  refresh: () => Promise<void>;
  /** True while a background scryfall metadata resolution is in progress. */
  resolving: boolean;
  /** Total cards queued for resolution in the current run. */
  resolvingTotal: number;
  /** Number of cards resolved so far in the current run. */
  resolvedCount: number;
  /** Call on success toast close to reset resolvedCount and dismiss the toast. */
  clearResolved: () => void;
  /** Non-null when the resolver stopped early due to a Scryfall or network failure. */
  resolveError: string | null;
}

// ── Wire shape from the /lists endpoint ───────────────────────────────────────

/** Shape returned by /lists?id=<uuid> (post-v4.7.0) */
interface ApiListDetailRow {
  id: string;
  name: string;
  deck_id: string | null;
  role: string | null;
  format: string;
  version: number;
  deleted_at: string | null;
  cards: ApiCardRow[];
}

/** Shape returned by /lists?deck_id=<uuid>&role=main */
interface ApiListByDeckRow {
  id: string;
  name: string;
  deck_id: string | null;
  role: string | null;
  format: string;
  version: number;
  deleted_at: string | null;
  cards: ApiCardRow[];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Shared hook for list editing.
 *
 * @param opts - Either { id } (direct list load) or { deckId } (find deck's main list).
 *
 * @example Deck card editor:
 *   const { list, cards, save, addCards } = useList({ deckId: deck.id });
 *
 * @example Standalone list editor:
 *   const { list, cards, save, removeCard } = useList({ id: listId });
 */
export function useList(opts: UseListOptions): UseListResult {
  const [list, setList] = useState<ListMeta | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  // Initialize loading=true if there's an id/deckId to fetch — otherwise the
  // first render flashes "no list" and any "redirect on missing list" effect
  // in the caller fires before the fetch even starts.
  const [loading, setLoading] = useState<boolean>(Boolean(opts.id || opts.deckId));
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [resolvingTotal, setResolvingTotal] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [resolveError, setResolveError] = useState<string | null>(null);

  // ── Internal: background metadata resolver with progress tracking ────────

  const resolveMetadata = useCallback(async (listId: string, total: number) => {
    setResolving(true);
    setResolvingTotal(total);
    setResolvedCount(0);
    setResolveError(null);
    let resolved = 0;
    const BATCH = 25;
    try {
      while (true) {
        const { updated, remaining } = await apiFetch<{ updated: ApiCardRow[]; remaining: number }>(
          '/list-image-resolve',
          { method: 'POST', body: JSON.stringify({ list_id: listId, limit: BATCH }) }
        );
        console.log(`[useList] batch resolved ${updated.length}, remaining ${remaining}`);
        if (updated.length > 0) {
          const patchMap = new Map(updated.map((u) => [u.id, u]));
          setCards((prev) =>
            prev.map((c) => {
              const patch = patchMap.get(c.id);
              if (!patch) return c;
              return {
                ...c,
                scryfall_id:    patch.scryfall_id    ?? c.scryfall_id,
                image_uri:      patch.image_uri      ?? c.image_uri,
                back_image_uri: patch.back_image_uri ?? c.back_image_uri,
                type_line:      patch.type_line      ?? c.type_line,
                mana_cost:      patch.mana_cost      ?? c.mana_cost,
                colors:         patch.colors         ?? c.colors,
                color_identity: patch.color_identity ?? c.color_identity,
              };
            })
          );
        }
        resolved += updated.length;
        setResolvedCount(resolved);
        if (remaining === 0) break;
        if (updated.length === 0) {
          // No progress made — Scryfall likely unreachable or card names unresolvable.
          setResolveError(`${remaining} card${remaining !== 1 ? 's' : ''} could not be resolved.`);
          break;
        }
      }
    } catch (err) {
      console.warn('[useList] image resolve failed:', err);
      setResolveError(err instanceof Error ? err.message : 'Metadata resolve failed.');
    } finally {
      setResolving(false);
    }
  }, []);

  // ── Internal: fetch and normalize a list detail response ─────────────────

  const loadFromDetail = useCallback((raw: ApiListDetailRow | ApiListByDeckRow) => {
    const meta: ListMeta = {
      id:         raw.id,
      name:       raw.name,
      deck_id:    raw.deck_id,
      role:       raw.role,
      format:     raw.format,
      version:    raw.version,
      deleted_at: raw.deleted_at,
    };
    setList(meta);
    setCards((raw.cards ?? []).map(fromApiCard));
    setConflict(false);
    setError(null);
  }, []);

  // ── Internal: fetch by list UUID ─────────────────────────────────────────

  const fetchById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const raw = await apiFetch<ApiListDetailRow>(`/lists?id=${encodeURIComponent(id)}`);
      loadFromDetail(raw);
      // Background: resolve scryfall metadata for any cards that are missing it.
      // Happens after text-import or coach update_list where scryfall_id is null.
      // Trigger resolver if any Scryfall metadata is missing.
      // type_line: always present on real cards — null means cache join returned nothing.
      // image_uri: may legitimately be null for some cards; PHP handles the no-infinite-loop case.
      const unresolvedCount = (raw.cards ?? []).filter(
        (c) => !c.scryfall_id || !c.type_line || !c.image_uri || c.colors === undefined || !c.color_identity
      ).length;
      if (unresolvedCount > 0) {
        console.log(`[useList] ${unresolvedCount} cards missing metadata — resolving…`);
        resolveMetadata(id, unresolvedCount);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load list');
    } finally {
      setLoading(false);
    }
  }, [loadFromDetail, resolveMetadata]);

  // ── Internal: fetch by deck UUID (finds role='main' list) ─────────────────

  const fetchByDeckId = useCallback(async (deckId: string) => {
    setLoading(true);
    try {
      // Try the deck_id+role query first. If the endpoint doesn't support it,
      // we fall back to /decks/<id> to get the main list id.
      let raw: ApiListByDeckRow | null = null;
      try {
        raw = await apiFetch<ApiListByDeckRow>(
          `/lists?deck_id=${encodeURIComponent(deckId)}&role=main`
        );
      } catch {
        // Fallback: fetch deck detail to get the main list id, then load by id.
        const deck = await apiFetch<{ main_list_id?: string | null }>(`/decks?id=${encodeURIComponent(deckId)}`);
        if (deck.main_list_id) {
          raw = await apiFetch<ApiListByDeckRow>(`/lists?id=${encodeURIComponent(deck.main_list_id)}`);
        }
      }

      if (raw) {
        loadFromDetail(raw);
        const unresolvedCount = (raw.cards ?? []).filter(
          (c) => !c.scryfall_id || !c.type_line || !c.image_uri || c.colors === undefined || !c.color_identity
        ).length;
        if (unresolvedCount > 0) {
          console.log(`[useList] ${unresolvedCount} cards missing metadata — resolving…`);
          resolveMetadata(raw.id, unresolvedCount);
        }
      } else {
        // No main list exists yet — not an error condition; caller handles null.
        setList(null);
        setCards([]);
        setConflict(false);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load list for deck');
    } finally {
      setLoading(false);
    }
  }, [loadFromDetail, resolveMetadata]);

  // ── Effect: initial load ─────────────────────────────────────────────────

  useEffect(() => {
    if (opts.id) {
      fetchById(opts.id);
    } else if (opts.deckId) {
      fetchByDeckId(opts.deckId);
    }
    // Re-fetch only when the id/deckId reference changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.id, opts.deckId]);

  // ── refresh ──────────────────────────────────────────────────────────────

  const refresh = useCallback(async () => {
    if (list?.id) {
      await fetchById(list.id);
    } else if (opts.id) {
      await fetchById(opts.id);
    } else if (opts.deckId) {
      await fetchByDeckId(opts.deckId);
    }
  }, [list, opts.id, opts.deckId, fetchById, fetchByDeckId]);

  // ── save ─────────────────────────────────────────────────────────────────

  const save = useCallback(async (nextCards: Card[]) => {
    if (!list) {
      setError('Cannot save: list not loaded');
      return;
    }

    const payload: CreateListCardInput[] = nextCards.map((c) => ({
      card_name:    c.card_name,
      scryfall_id:  c.scryfall_id ?? null,
      quantity:     c.quantity,
      is_commander: c.is_commander,
      is_proxy:     c.is_proxy,
    }));

    try {
      const result = await apiFetch<{ success: boolean; version: number; conflict?: boolean }>(
        `/lists?id=${encodeURIComponent(list.id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ cards: payload, version: list.version }),
        }
      );
      // Update local state with new version on success
      setList((prev) => prev ? { ...prev, version: result.version } : prev);
      setCards(nextCards);
      setConflict(false);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      // Detect 409 conflict: apiFetch throws with the server's error message.
      // The PHP endpoint should return { error: 'conflict' } with HTTP 409,
      // which apiFetch surfaces as Error('conflict').
      const isConflict = msg.toLowerCase().includes('conflict') || msg === '409';
      if (isConflict) {
        setConflict(true);
        setError('Save conflict: another session modified this list. Reload to merge.');
      } else {
        setConflict(false);
        setError(msg);
      }
      // DO NOT update local state on conflict — caller reads `conflict` flag.
    }
  }, [list]);

  // ── addCards (dedup via mergeIntoBuffer, then save) ──────────────────────

  const addCards = useCallback(async (incoming: Card[]) => {
    // Use singleton=false for lists (no format enforcement here; format-aware
    // validation lives in the commander validator layer, not in the hook).
    const { merged } = mergeIntoBuffer(cards, incoming, false);
    await save(merged);
  }, [cards, save]);

  // ── removeCard ───────────────────────────────────────────────────────────

  const removeCard = useCallback(async (cardId: string) => {
    const next = cards.filter((c) => String(c.id) !== cardId);
    await save(next);
  }, [cards, save]);

  // ── updateCard ───────────────────────────────────────────────────────────

  const updateCard = useCallback(async (cardId: string, patch: Partial<Card>) => {
    const next = cards.map((c) =>
      String(c.id) === cardId ? { ...c, ...patch } : c
    );
    await save(next);
  }, [cards, save]);

  // ── attachToDeck ─────────────────────────────────────────────────────────

  const attachToDeck = useCallback(async (deckId: string) => {
    if (!list) {
      setError('Cannot attach: list not loaded');
      return;
    }
    try {
      // TODO(Step 6): This is a no-op shim until Step 6 makes the SQL functional.
      // The call will succeed (2xx) but leave deck_id unchanged until Step 6 lands.
      // Always call refresh() after this.
      await apiFetch<{ success: boolean }>(
        `/lists?id=${encodeURIComponent(list.id)}&action=attach_deck`,
        {
          method: 'POST',
          body: JSON.stringify({ deck_id: deckId }),
        }
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to attach list to deck');
    }
  }, [list]);

  // ── detachFromDeck ───────────────────────────────────────────────────────

  const detachFromDeck = useCallback(async () => {
    if (!list) {
      const msg = 'Cannot detach: list not loaded';
      setError(msg);
      throw new Error(msg);
    }
    try {
      // TODO(Step 6): This is a no-op shim until Step 6 makes the SQL functional.
      // The call will succeed (2xx) but leave deck_id unchanged until Step 6 lands.
      // Always call refresh() after this.
      await apiFetch<{ success: boolean }>(
        `/lists?id=${encodeURIComponent(list.id)}&action=detach_deck`,
        { method: 'POST' }
      );
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to detach list from deck';
      setError(msg);
      throw new Error(msg);
    }
  }, [list]);

  // ── Result ───────────────────────────────────────────────────────────────

  return {
    list,
    cards,
    loading,
    error,
    conflict,
    save,
    addCards,
    removeCard,
    updateCard,
    attachToDeck,
    detachFromDeck,
    refresh,
    resolving,
    resolvingTotal,
    resolvedCount,
    resolveError,
    clearResolved: useCallback(() => { setResolvedCount(0); setResolvingTotal(0); setResolveError(null); }, []),
  };
}
