"""
Mana-cost decomposition.

Parses a Scryfall-style mana cost string like '{2/W}{W/U}{G/P}{X}' into a
structured breakdown that the agent can reason over directly. Authoritative
behaviour comes from:

  CR 107.4   — mana symbols (including hybrid, Phyrexian, twobrid, snow, generic, X)
  CR 202.3b  — mana value (CMC) calculation, including twobrid = 2
  CR 702.158 — Phyrexian mana cost can be paid with 2 life
  CR 903.4   — color identity for the Commander variant

Snow ({S}) is generic-equivalent for CMC but can only be paid with snow mana.
{X} contributes 0 to mana value in the casting cost (its value is set on resolve).
"""

from __future__ import annotations

import re
from typing import Any

_SYMBOL_RE = re.compile(r"\{([^{}]+)\}")
_COLORS = ("W", "U", "B", "R", "G")


def decompose(mana_cost: str) -> dict[str, Any]:
    """
    Parse a mana cost string into per-symbol records plus aggregates.

    Returns:
        {
          "raw": "{2/W}{W/U}",
          "mana_value": 3,
          "color_identity": ["W", "U"],
          "symbols": [<per-symbol records>],
          "totals": {"colored_pips": 2, "generic": 0, "hybrid": 1,
                     "twobrid": 1, "phyrexian": 0, "variable": 0, "snow": 0},
        }
    """
    raw_input = mana_cost or ""
    symbols: list[dict[str, Any]] = []
    color_set: set[str] = set()
    mana_value = 0
    totals = {
        "colored_pips": 0,
        "generic": 0,
        "hybrid": 0,
        "twobrid": 0,
        "phyrexian": 0,
        "hybrid_phyrexian": 0,
        "variable": 0,
        "snow": 0,
        "colorless": 0,
        "unknown": 0,
    }

    for m in _SYMBOL_RE.finditer(raw_input):
        sym = _classify(m.group(1))
        symbols.append(sym)
        mana_value += sym["cmc_contribution"]
        color_set.update(sym["colors"])
        kind = sym["kind"]
        if kind == "colored":
            totals["colored_pips"] += 1
        elif kind in totals:
            totals[kind] += 1

    return {
        "raw": raw_input,
        "mana_value": mana_value,                                        # aka CMC
        "color_identity": [c for c in _COLORS if c in color_set],
        "symbols": symbols,
        "totals": totals,
    }


def _classify(content: str) -> dict[str, Any]:
    """Classify the contents of a single brace-delimited symbol."""
    raw = "{" + content + "}"
    upper = content.upper().strip()

    # Pure generic: {0}..{N}
    if upper.isdigit():
        return {
            "raw": raw,
            "kind": "generic",
            "colors": [],
            "cmc_contribution": int(upper),
        }

    # Variable: {X}, {Y}, {Z}
    if upper in ("X", "Y", "Z"):
        return {
            "raw": raw,
            "kind": "variable",
            "colors": [],
            "cmc_contribution": 0,
            "notes": "Contributes 0 to mana value in the casting cost; resolves on the stack.",
        }

    # Single-char non-hybrid
    if len(upper) == 1:
        if upper in _COLORS:
            return {
                "raw": raw,
                "kind": "colored",
                "colors": [upper],
                "cmc_contribution": 1,
            }
        if upper == "C":
            return {
                "raw": raw,
                "kind": "colorless",
                "colors": [],
                "cmc_contribution": 1,
                "notes": "Must be paid with colorless mana.",
            }
        if upper == "S":
            return {
                "raw": raw,
                "kind": "snow",
                "colors": [],
                "cmc_contribution": 1,
                "notes": "Generic for mana-value purposes; can only be paid with snow mana.",
            }
        if upper == "T":
            return {
                "raw": raw,
                "kind": "tap",
                "colors": [],
                "cmc_contribution": 0,
                "notes": "Tap symbol — not a mana symbol; appears in activation costs.",
            }
        if upper == "Q":
            return {
                "raw": raw,
                "kind": "untap",
                "colors": [],
                "cmc_contribution": 0,
                "notes": "Untap symbol — not a mana symbol; appears in activation costs.",
            }

    # Anything containing '/' is hybrid in some form
    if "/" in upper:
        parts = [p.strip() for p in upper.split("/")]
        is_phyrexian = "P" in parts
        non_p = [p for p in parts if p != "P"]

        # Twobrid: {2/W}
        if "2" in non_p and len(non_p) == 2:
            color = next((p for p in non_p if p in _COLORS), None)
            if color:
                return {
                    "raw": raw,
                    "kind": "twobrid",
                    "colors": [color],
                    "cmc_contribution": 2,
                    "notes": f"Pay {{2}} OR {{{color}}}. Counts as 2 toward mana value (CR 202.3b).",
                }

        # Mono-color Phyrexian: {W/P}
        if is_phyrexian and len(non_p) == 1 and non_p[0] in _COLORS:
            c = non_p[0]
            return {
                "raw": raw,
                "kind": "phyrexian",
                "colors": [c],
                "cmc_contribution": 1,
                "notes": f"Pay {{{c}}} OR 2 life (CR 702.158). Color identity includes {c}.",
            }

        # Hybrid Phyrexian: {W/U/P}
        if is_phyrexian and len(non_p) == 2:
            colors = [p for p in non_p if p in _COLORS]
            if len(colors) == 2:
                return {
                    "raw": raw,
                    "kind": "hybrid_phyrexian",
                    "colors": colors,
                    "cmc_contribution": 1,
                    "notes": (
                        f"Pay {{{colors[0]}}} OR {{{colors[1]}}} OR 2 life. "
                        f"Color identity includes both {colors[0]} and {colors[1]}."
                    ),
                }

        # Plain mono-color hybrid: {W/U}
        if not is_phyrexian and len(parts) == 2:
            colors = [p for p in parts if p in _COLORS]
            if len(colors) == 2:
                return {
                    "raw": raw,
                    "kind": "hybrid",
                    "colors": colors,
                    "cmc_contribution": 1,
                    "notes": (
                        f"Pay {{{colors[0]}}} OR {{{colors[1]}}}. "
                        f"Color identity includes both colors (CR 903.4)."
                    ),
                }

    # Fallback for anything unrecognized (e.g. future symbols)
    return {
        "raw": raw,
        "kind": "unknown",
        "colors": [],
        "cmc_contribution": 0,
        "notes": f"Unrecognized symbol contents {content!r}.",
    }
