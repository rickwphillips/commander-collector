"""
Phase 3 — Deck-level analysis and suggestions.

Tools land here:
  analyze_deck                : objective metrics — curve, colors, types, roles,
                                keyword density, lands, warnings
  suggest_cards_for_deck      : color-identity-filtered, format-legal,
                                theme-aware Scryfall queries
  identify_synergies          : heuristic blended with Phase 5 learned weights
  identify_anti_patterns      : pairs flagged by accumulated user corrections

Resolution goes through the local card_cache first (db/card_cache_repo) and
falls back to Scryfall's /cards/collection batch endpoint for misses. A
100-card Commander deck costs zero API calls on a warm cache, ~2 cold.
"""

from __future__ import annotations

from typing import Annotated, Any
from pydantic import Field

from commander_mcp.confidence import Confidence, Band
from commander_mcp.services.decklist import parse_decklist, DeckEntry
from commander_mcp.services import deck_analysis
from commander_mcp.services import deck_scoring
from commander_mcp.services import synergy_learned
from commander_mcp.services.scryfall import ScryfallClient, ScryfallNotFound
from commander_mcp.db import card_cache_repo


_scryfall: ScryfallClient | None = None


def _client() -> ScryfallClient:
    global _scryfall
    if _scryfall is None:
        _scryfall = ScryfallClient()
    return _scryfall


async def _resolve_entries(
    entries: list[DeckEntry],
) -> tuple[list[dict[str, Any]], list[dict[str, str]]]:
    """
    Resolve a list of DeckEntry to Scryfall payloads using cache-first lookup.

    Returns (found_cards, missing_identifiers) in the same shape ScryfallClient.collection
    returns, so callers don't have to care that there's a cache in the middle.
    """
    names = [e.name for e in entries]
    cached = await card_cache_repo.get_cached(names)
    miss_names = [n for n in names if n not in cached]

    fetched: list[dict[str, Any]] = []
    missing: list[dict[str, str]] = []
    if miss_names:
        identifiers = [{"name": n} for n in miss_names]
        fetched, missing = await _client().collection(identifiers)
        if fetched:
            await card_cache_repo.persist(fetched)

    # Preserve original order: walk entries, prefer cache hit, fall back to fetched.
    fetched_by_name = {c.get("name", "").lower(): c for c in fetched}
    found: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    for n in names:
        if n in cached:
            card = cached[n]
        else:
            card = fetched_by_name.get(n.lower())
            if card is None:
                continue
        cid = card.get("id")
        if cid and cid in seen_ids:
            continue
        if cid:
            seen_ids.add(cid)
        found.append(card)
    return found, missing


def register(mcp) -> None:
    @mcp.tool()
    async def analyze_deck(
        decklist: Annotated[
            list[str],
            Field(description="One entry per line. Accepts 'Sol Ring', '1 Sol Ring', '4x Forest', 'CMDR: Atraxa', '*CMDR* Atraxa'."),
        ],
        commander: Annotated[
            str | None,
            Field(description="Optional commander name. Overrides any inline *CMDR* / CMDR: markers."),
        ] = None,
        target_deck_size: Annotated[
            int,
            Field(ge=40, le=250, description="Expected deck size (100 for Commander; 60 for constructed)."),
        ] = 100,
    ) -> dict[str, Any]:
        """
        Analyze a decklist: color identity, mana curve, type mix, role buckets
        (ramp / draw / removal / interaction / wincon), keyword density,
        land count, and weak-spot warnings.

        Every entry is resolved against Scryfall (batched, ~2 API calls per
        100 cards) so the analysis is grounded in real Oracle text.
        """
        entries = parse_decklist(decklist, commander_hint=commander)
        if not entries:
            return Confidence.unknown("Empty decklist after parsing.").model_dump()

        try:
            found, missing = await _resolve_entries(entries)
        except Exception as exc:
            return Confidence.unknown(
                f"Failed to resolve decklist against Scryfall: {exc}"
            ).model_dump()

        missing_names = [m.get("name") or str(m) for m in missing]
        report = deck_analysis.analyze(
            found, entries=entries, missing=missing_names
        )

        # Composition metrics from Scryfall are CERTAIN; role classification is
        # heuristic. We compromise on HIGH when everything resolves, MODERATE
        # otherwise, and surface the heuristic via caveats.
        band = Band.HIGH if found and not missing_names else Band.MODERATE
        caveats = ["Role buckets use oracle-text regex heuristics; treat as guidance."]
        if missing_names:
            caveats.append(
                f"{len(missing_names)} card name(s) did not resolve and were excluded."
            )

        return Confidence(
            band=band,
            data=report,
            sources=["scryfall:cards/collection"],
            caveats=caveats,
        ).model_dump()

    @mcp.tool()
    async def suggest_cards_for_deck(
        decklist: Annotated[
            list[str],
            Field(description="Current decklist. Used for color identity and to exclude already-included cards."),
        ],
        strategy_hint: Annotated[
            str | None,
            Field(description="Optional theme, e.g. 'toxic', 'aristocrats', 'tokens', 'reanimator'."),
        ] = None,
        role: Annotated[
            str,
            Field(description="Which role to fill: 'ramp', 'draw', 'removal', 'theme'.", pattern="^(ramp|draw|removal|theme)$"),
        ] = "theme",
        max_suggestions: Annotated[int, Field(ge=1, le=50)] = 10,
        format_name: Annotated[
            str,
            Field(description="Format legality filter for Scryfall (commander, modern, standard, etc.)."),
        ] = "commander",
    ) -> dict[str, Any]:
        """
        Recommend cards that fit the deck.

        Heuristic: derive color identity from the resolved decklist, build a
        Scryfall query targeting the requested role + optional theme, then
        filter out names already in the deck. Full card data is returned so
        the agent can justify each pick from real Oracle text.
        """
        entries = parse_decklist(decklist)
        if not entries:
            return Confidence.unknown("Empty decklist after parsing.").model_dump()

        existing_names = {e.name.lower() for e in entries}

        try:
            found, _missing = await _resolve_entries(entries)
        except Exception as exc:
            return Confidence.unknown(
                f"Failed to resolve decklist for suggestions: {exc}"
            ).model_dump()

        identity = deck_analysis.color_identity_union(found)
        identity_clause = "id<=" + "".join(identity) if identity else "id=c"

        role_clauses: dict[str, str] = {
            "ramp": '(o:"add {" or o:"search your library for" or o:"treasure token")',
            "draw": 'o:"draw" o:"card"',
            "removal": '(o:"destroy target" or o:"exile target" or o:"counter target")',
            "theme": "",
        }
        clause = role_clauses.get(role, "")
        theme_clause = f' o:"{strategy_hint}"' if strategy_hint else ""

        # f:<format> applies legality; -is:digital strips Arena/MTGO-only variants.
        query = f"f:{format_name} {identity_clause} {clause}{theme_clause} -is:digital".strip()
        # Collapse double spaces from empty clauses
        query = " ".join(query.split())

        try:
            result = await _client().search(query)
        except ScryfallNotFound:
            return Confidence(
                band=Band.MODERATE,
                data={"query": query, "candidates": [], "color_identity": identity},
                sources=[f"scryfall:cards/search?q={query}"],
                caveats=["Scryfall returned no cards for the constructed query."],
            ).model_dump()
        except Exception as exc:
            return Confidence.unknown(f"Scryfall search failed: {exc}").model_dump()

        candidates = [
            c for c in result.get("data", [])
            if c.get("name", "").lower() not in existing_names
        ][:max_suggestions]

        return Confidence(
            band=Band.MODERATE,
            data={
                "query": query,
                "color_identity": identity,
                "role": role,
                "strategy_hint": strategy_hint,
                "candidates": candidates,
                "total_pool": result.get("total_cards"),
            },
            sources=[f"scryfall:cards/search?q={query}"],
            caveats=[
                "Suggestions are heuristic — color identity, format legality, "
                "and optional theme text matches. Synergy weights (Phase 5) will sharpen this."
            ],
        ).model_dump()

    @mcp.tool()
    async def identify_synergies(
        decklist: Annotated[list[str], Field(description="Decklist to evaluate (any of the formats analyze_deck accepts).")],
        commander: Annotated[
            str | None,
            Field(description="Optional commander; sets the context for learned-weight lookup."),
        ] = None,
        context: Annotated[
            str | None,
            Field(description=(
                "Context tag for learned weights, e.g. 'commander/atraxa-toxic'. "
                "Defaults to 'commander/<commander-name>' when commander is given, "
                "else empty string (global context)."
            )),
        ] = None,
        top_n: Annotated[int, Field(ge=1, le=100)] = 25,
    ) -> dict[str, Any]:
        """
        Pair-level synergy detection blending the heuristic (shared tribe,
        shared keywords, shared mechanical nouns) with learned weights from
        the feedback loop.

        For each pair, the response includes:
          - heuristic_score    cold-start signal (0..1)
          - learned_weight     accumulated user feedback (-1..+1)
          - sample_size        how many feedback events
          - blended_score      what to actually rank by
          - reasons            what triggered the heuristic match

        With no feedback history (sample_size=0) the blended score equals
        the heuristic. As feedback accumulates, the learned weight
        progressively dominates.
        """
        entries = parse_decklist(decklist, commander_hint=commander)
        if not entries:
            return Confidence.unknown("Empty decklist after parsing.").model_dump()

        try:
            found_list, missing = await _resolve_entries(entries)
        except Exception as exc:
            return Confidence.unknown(
                f"Failed to resolve decklist against Scryfall: {exc}"
            ).model_dump()

        # synergy_learned expects a name-keyed dict.
        found_by_name = {c["name"]: c for c in found_list}

        # Resolve default context if not provided.
        resolved_context = context
        if resolved_context is None and commander:
            resolved_context = f"commander/{commander.lower().replace(' ', '-')}"

        pairs = await synergy_learned.synergies_in_deck_with_learning(
            found_by_name, context=resolved_context, top_n=top_n
        )

        # Band reflects what's driving the ranking. If no learned signal at
        # all, this is pure heuristic = MODERATE. With learned signal in the
        # top pairs, we're HIGH.
        has_learning = any(p["sample_size"] > 0 for p in pairs)
        band = Band.HIGH if has_learning else Band.MODERATE

        caveats = [
            "Heuristic component matches on tribe / keywords / mechanical nouns; "
            "subtle synergies (combo lines, mana curves, payoff chains) won't show up.",
        ]
        if not has_learning:
            caveats.append(
                "No learned weights yet for this context; ranking is pure heuristic. "
                "Use record_feedback to teach the system."
            )
        missing_names = [m.get("name") or str(m) for m in missing]
        if missing_names:
            caveats.append(
                f"{len(missing_names)} card(s) didn't resolve and were excluded from pairing."
            )

        return Confidence(
            band=band,
            data={
                "context": resolved_context or "",
                "pairs_returned": len(pairs),
                "pairs": pairs,
                "unresolved": missing_names,
            },
            sources=["scryfall:cards/collection", "local:synergy_weight"],
            caveats=caveats,
        ).model_dump()

    @mcp.tool()
    async def identify_anti_patterns(
        decklist: Annotated[list[str], Field(description="Decklist to evaluate.")],
        commander: Annotated[
            str | None,
            Field(description="Optional commander; used to derive the learning context."),
        ] = None,
        context: Annotated[
            str | None,
            Field(description="Override the learning context tag."),
        ] = None,
        threshold: Annotated[
            float,
            Field(ge=-1.0, le=0.0, description=(
                "Pairs whose learned_weight is at or below this threshold are flagged. "
                "Default -0.25 catches mild-and-up corrections."
            )),
        ] = -0.25,
        min_sample_size: Annotated[int, Field(ge=1, le=20)] = 2,
    ) -> dict[str, Any]:
        """
        Surface card pairs the user has corrected — i.e. pairs with a
        negative learned weight backed by enough samples to be more than
        a single bad day.

        This is the inverse of identify_synergies and is the right tool to
        run BEFORE recommending a deck change, to avoid suggesting
        combinations the user has already rejected.
        """
        entries = parse_decklist(decklist, commander_hint=commander)
        if not entries:
            return Confidence.unknown("Empty decklist after parsing.").model_dump()

        names = sorted({e.name for e in entries})
        if len(names) < 2:
            return Confidence(
                band=Band.HIGH,
                data={"flagged": [], "deck_size": len(names)},
                sources=["local:synergy_weight"],
            ).model_dump()

        resolved_context = context
        if resolved_context is None and commander:
            resolved_context = f"commander/{commander.lower().replace(' ', '-')}"

        from itertools import combinations
        from commander_mcp.learning import weights as _weights
        from commander_mcp.db import feedback_repo as _fb

        pair_keys = [_weights.canonical_pair(a, b) for a, b in combinations(names, 2)]
        learned = await _fb.get_synergy_weights_batch(pair_keys, context=resolved_context)

        flagged = []
        for (ca, cb), lw in learned.items():
            if lw["sample_size"] >= min_sample_size and lw["weight"] <= threshold:
                flagged.append({
                    "card_a": ca,
                    "card_b": cb,
                    "learned_weight": round(lw["weight"], 3),
                    "sample_size": lw["sample_size"],
                })
        flagged.sort(key=lambda p: p["learned_weight"])  # most-negative first

        return Confidence(
            band=Band.HIGH if flagged else Band.CERTAIN,
            data={
                "context": resolved_context or "",
                "threshold": threshold,
                "min_sample_size": min_sample_size,
                "flagged": flagged,
            },
            sources=["local:synergy_weight"],
            caveats=(
                ["No corrected pairs in this deck for the given context."]
                if not flagged else [
                    "These are pairs YOU corrected in past feedback. "
                    "If the correction was context-dependent, treat with care."
                ]
            ),
        ).model_dump()

    @mcp.tool()
    async def score_deck(
        decklist: Annotated[
            list[str],
            Field(description="One entry per line, same parser as analyze_deck."),
        ],
        commander: Annotated[
            str | None,
            Field(description="Optional commander name."),
        ] = None,
    ) -> dict[str, Any]:
        """
        Deck-level strength scoring with Wizards' Bracket 1-5 assignment.

        Builds a DeckState from the resolved cards and evaluates a catalog of
        signals: fast mana presence, tutor density, Game Changer count, combo
        pieces, mass land destruction, stax engines, curve, land balance,
        removal density, and ramp density. Returns:

          {bracket, bracket_name, strength_score, signals[], warnings[]}

        Each signal entry has name, contribution, and reason. Surface the
        signals trace when discussing the bracket so the verdict is auditable.
        """
        entries = parse_decklist(decklist, commander_hint=commander)
        if not entries:
            return Confidence.unknown("Empty decklist after parsing.").model_dump()

        try:
            found, missing = await _resolve_entries(entries)
        except Exception as exc:
            return Confidence.unknown(
                f"Failed to resolve decklist against Scryfall: {exc}"
            ).model_dump()

        score = deck_scoring.score_deck(found)
        missing_names = [m.get("name") or str(m) for m in missing]

        caveats: list[str] = []
        if missing_names:
            caveats.append(
                f"{len(missing_names)} card name(s) did not resolve and were excluded from the score."
            )
        band = Band.HIGH if found and not missing_names else Band.MODERATE
        return Confidence(
            band=band,
            data={**score.to_dict(), "missing": missing_names},
            sources=["local:card_cache", "local:deck_scoring"],
            caveats=caveats,
        ).model_dump()

    @mcp.tool()
    async def discuss_strength(
        decklist: Annotated[
            list[str],
            Field(description="One entry per line."),
        ],
        commander: Annotated[
            str | None,
            Field(description="Optional commander name."),
        ] = None,
    ) -> dict[str, Any]:
        """
        Same evaluation as score_deck, formatted as prose for chat consumption.

        Returns the structured DeckScore alongside a 'narrative' field that
        names the bracket, the strength score, color identity, every signal
        that fired with its contribution, and any composition warnings.
        Use when the user wants a conversation about deck power, not raw data.
        """
        entries = parse_decklist(decklist, commander_hint=commander)
        if not entries:
            return Confidence.unknown("Empty decklist after parsing.").model_dump()

        try:
            found, missing = await _resolve_entries(entries)
        except Exception as exc:
            return Confidence.unknown(
                f"Failed to resolve decklist against Scryfall: {exc}"
            ).model_dump()

        score = deck_scoring.score_deck(found)
        narrative = deck_scoring.discuss_score(score)
        missing_names = [m.get("name") or str(m) for m in missing]

        caveats: list[str] = []
        if missing_names:
            caveats.append(
                f"{len(missing_names)} card name(s) did not resolve and were excluded from the score."
            )
        band = Band.HIGH if found and not missing_names else Band.MODERATE
        return Confidence(
            band=band,
            data={
                **score.to_dict(),
                "missing": missing_names,
                "narrative": narrative,
            },
            sources=["local:card_cache", "local:deck_scoring"],
            caveats=caveats,
        ).model_dump()
