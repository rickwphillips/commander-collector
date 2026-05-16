"""
Phase 2 — Comprehensive Rules, Layer System, and Glossary.

The CR is one of the three authoritative sources (Scryfall card data, Oracle
rulings, Comprehensive Rules). All results here are CERTAIN if found, UNKNOWN
if not — never invented.

Rick specifically called out the Layer System (CR 613) as the area to know
intimately. `explain_layer` returns CR 613 in full so the agent can reason
over it without relying on a structural shortcut that might drift if WotC
renumbers things in a future release.

Ingestion: scripts/ingest_rules.py downloads MagicCompRules.txt and populates
the DB. Tools below check ingestion status and return UNKNOWN cleanly if it
hasn't run yet.
"""

from __future__ import annotations

from typing import Annotated, Any
from pydantic import Field

from commander_mcp.confidence import Confidence
from commander_mcp.db import rules_repo


def register(mcp) -> None:
    @mcp.tool()
    async def lookup_comprehensive_rule(
        rule_number: Annotated[
            str,
            Field(description="Rule number, e.g. '613.1', '613.1a', '702.180' (toxic), '903' (Commander)."),
        ],
    ) -> dict[str, Any]:
        """
        Look up an exact rule or subrule in the Comprehensive Rules.

        If `rule_number` is a section (e.g. '613' or '903'), returns the whole
        section: every rule and subrule under it in order.

        If `rule_number` is a specific rule ('613.1a'), returns just that rule.
        """
        if not await rules_repo.is_ingested():
            return Confidence.unknown(
                "Comprehensive Rules have not been ingested. Run: "
                "python -m commander_mcp.scripts.ingest_rules"
            ).model_dump()

        meta = await rules_repo.get_metadata()
        effective = meta.get("effective_date", "unknown")
        source = f"MagicCompRules effective {effective}"

        # Section-level request (just digits, no dot)
        if rule_number.isdigit() and len(rule_number) == 3:
            rules = await rules_repo.get_section_rules(rule_number)
            if not rules:
                return Confidence.unknown(f"No CR section {rule_number!r} found.").model_dump()
            return Confidence.certain(
                data={"section": rule_number, "rules": rules},
                sources=[source],
            ).model_dump()

        rule = await rules_repo.get_rule(rule_number)
        if rule is None:
            return Confidence.unknown(f"No CR rule {rule_number!r} found.").model_dump()
        return Confidence.certain(data=rule, sources=[source]).model_dump()

    @mcp.tool()
    async def search_comprehensive_rules(
        query: Annotated[str, Field(description="Full-text query, e.g. 'state-based action', 'layer 7', 'commander damage'.")],
        max_results: Annotated[int, Field(ge=1, le=50)] = 10,
    ) -> dict[str, Any]:
        """Full-text search across rule bodies (FTS5, Porter stemmer)."""
        if not await rules_repo.is_ingested():
            return Confidence.unknown(
                "Comprehensive Rules have not been ingested. Run: "
                "python -m commander_mcp.scripts.ingest_rules"
            ).model_dump()

        results = await rules_repo.search_rules(query, limit=max_results)
        meta = await rules_repo.get_metadata()
        return Confidence.certain(
            data={"query": query, "returned": len(results), "rules": results},
            sources=[f"MagicCompRules effective {meta.get('effective_date', 'unknown')}"],
        ).model_dump()

    @mcp.tool()
    async def explain_layer(
        layer: Annotated[int, Field(ge=1, le=7, description="Continuous-effect layer (1-7).")],
    ) -> dict[str, Any]:
        """
        Return the section of the Comprehensive Rules describing the continuous-
        effects layer system (CR 613) along with hints for the specific layer.

        The seven layers (for orientation; authoritative text is in the returned rules):
          1. Copy effects
          2. Control-changing effects
          3. Text-changing effects
          4. Type-changing effects
          5. Color-changing effects
          6. Ability-adding / ability-removing effects
          7. Power/toughness effects (sublayers 7a-7d)

        Use the full returned section to ground any claim about how effects stack.
        """
        if not await rules_repo.is_ingested():
            return Confidence.unknown(
                "Comprehensive Rules have not been ingested. Run: "
                "python -m commander_mcp.scripts.ingest_rules"
            ).model_dump()

        rules = await rules_repo.get_section_rules("613")
        if not rules:
            return Confidence.unknown(
                "CR 613 not found in ingested rules — the section may have been renumbered."
            ).model_dump()

        # Heuristic: pick subrules whose body explicitly references this layer.
        needle_a = f"Layer {layer}:"
        needle_b = f"Layer {layer} "
        focused = [r for r in rules if needle_a in r["body"] or needle_b in r["body"]]

        meta = await rules_repo.get_metadata()
        return Confidence.certain(
            data={
                "layer": layer,
                "focused_rules": focused,
                "full_section_613": rules,
            },
            sources=[f"MagicCompRules effective {meta.get('effective_date', 'unknown')} §613"],
        ).model_dump()

    @mcp.tool()
    async def lookup_glossary_term(
        term: Annotated[str, Field(description="Glossary term, e.g. 'Toxic', 'State-Based Action', 'Commander'.")],
    ) -> dict[str, Any]:
        """Look up a glossary term. Falls back to fuzzy FTS search if no exact match."""
        if not await rules_repo.is_ingested():
            return Confidence.unknown(
                "Comprehensive Rules have not been ingested. Run: "
                "python -m commander_mcp.scripts.ingest_rules"
            ).model_dump()

        result = await rules_repo.lookup_glossary_term(term)
        if result is None:
            return Confidence.unknown(f"No glossary entry matched {term!r}.").model_dump()

        meta = await rules_repo.get_metadata()
        band_source = f"MagicCompRules glossary, effective {meta.get('effective_date', 'unknown')}"
        return Confidence.certain(data=result, sources=[band_source]).model_dump()
