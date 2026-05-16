'use client';

import { useEffect, useState } from 'react';
import { api } from './api';

/**
 * Wizards Commander Bracket score for a deck, via commander-mcp.
 *
 * Two states:
 *   - `bracket` is null while loading or when the deck has no cards (contingency).
 *   - `caveats` always present so callers can render a "Bracket pending" chip
 *     with an explanatory tooltip.
 *
 * The fetch is keyed on `deckId`: if the same deckId appears in multiple slots
 * (rare but possible), each hook instance fetches independently. The PHP layer
 * has its own per-request session, so this isn't a real perf concern at v1.
 */

interface DeckBracketState {
  loading: boolean;
  bracket: number | null;
  bracketName: string | null;
  strengthScore: number | null;
  signals: Array<{ name: string; contribution: number; reason: string }>;
  caveats: string[];
  error: string | null;
}

const EMPTY: DeckBracketState = {
  loading: false,
  bracket: null,
  bracketName: null,
  strengthScore: null,
  signals: [],
  caveats: [],
  error: null,
};

/**
 * Module-scope cache keyed on deckId. Survives component remounts within a
 * single page load; cleared on navigation. Failures are NOT cached so a
 * recovering MCP is picked up on the next call.
 */
const cache = new Map<string, DeckBracketState>();

export function useDeckBracket(deckId: string | null | undefined, commander?: string | null): DeckBracketState {
  const [state, setState] = useState<DeckBracketState>(() => {
    if (!deckId) return EMPTY;
    return cache.get(deckId) ?? { ...EMPTY, loading: true };
  });

  useEffect(() => {
    if (!deckId) {
      setState(EMPTY);
      return;
    }
    const cached = cache.get(deckId);
    if (cached && !cached.loading) {
      setState(cached);
      return;
    }
    let cancelled = false;
    setState({ ...EMPTY, loading: true });

    (async () => {
      try {
        const profile = await api.getDeckProfile(deckId);
        const cardNames = (profile.cards ?? [])
          .map((c) => c.card_name)
          .filter((n): n is string => typeof n === 'string' && n.length > 0);

        if (cardNames.length === 0) {
          const empty: DeckBracketState = {
            ...EMPTY,
            caveats: ['Deck has no card list yet, bracket pending'],
          };
          if (!cancelled) {
            cache.set(deckId, empty);
            setState(empty);
          }
          return;
        }

        const result = await api.scoreDeck(cardNames, commander ?? undefined);
        if (cancelled) return;

        if (result.band === 'unknown' || !result.data) {
          const unknown: DeckBracketState = {
            ...EMPTY,
            caveats: result.caveats?.length ? result.caveats : ['Bracket unavailable, MCP unreachable'],
          };
          cache.set(deckId, unknown);
          setState(unknown);
          return;
        }

        const next: DeckBracketState = {
          loading: false,
          bracket: result.data.bracket,
          bracketName: result.data.bracket_name,
          strengthScore: result.data.strength_score,
          signals: result.data.signals.map((s) => ({
            name: s.name,
            contribution: s.contribution,
            reason: s.reason,
          })),
          caveats: result.caveats ?? [],
          error: null,
        };
        cache.set(deckId, next);
        setState(next);
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setState({ ...EMPTY, error: msg, caveats: ['Bracket lookup failed'] });
      }
    })();

    return () => { cancelled = true; };
  }, [deckId, commander]);

  return state;
}

/** Test helper: clear the per-page cache. */
export function _resetDeckBracketCache(): void {
  cache.clear();
}
