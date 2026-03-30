---
id: p516
name: Tiered (FIN) — Mandatory Mode Additional Cost, Free-Cast Trap, MV Calculation, and Copy Mode Lock
category: costs
cr_refs: [601.2b, 601.2f, 202.3, 706.10]
tags: [tiered, additional-cost, mandatory-mode, free-cast, omniscience, mana-value, copy, mode-lock, final-fantasy, FIN, fire-magic, ice-magic, thunder-magic]
created: 2026-03-30
examples_count: 4
---

# P516 — Tiered (FIN) — Mandatory Mode Additional Cost, Free-Cast Trap, MV Calculation, and Copy Mode Lock

## Abstract
**Tiered** (Final Fantasy, 2025) is a keyword mechanic where a spell offers three named modes (e.g., Fire / Fira / Firaga), each requiring a different **additional cost** to cast. The player **must** choose exactly one mode and pay its associated additional cost — this is mandatory. The critical trap: **"free cast" effects (Omniscience, suspend, cascade) do NOT waive the Tiered additional cost** — the base mana cost is free, but the chosen mode's additional cost must still be paid. The spell's **mana value** is determined only by the base mana cost in the upper-right corner, not by which mode was chosen. Copies cannot change modes — the copy retains the chosen mode. The three modes have graduated power levels with graduated costs, creating a gameplay decision each cast.

## The Definitive Rules

**Official Ruling (2025-06-06):** *"You must choose exactly one of the listed modes and pay its associated additional cost in order to cast a spell with tiered."*

**Official Ruling (2025-06-06):** *"The mana value of a spell with tiered is determined only by its mana cost (in the upper right corner of the card). It doesn't matter which mode you choose or which additional costs you pay, including any additional costs imposed by other effects."*

**Official Ruling (2025-06-06):** *"If an effect allows you to cast a spell with tiered 'without paying its mana cost,' you must still choose exactly one mode and pay the associated additional cost."*

**Official Ruling (2025-06-06):** *"You choose the mode as you cast the spell with tiered. Once the mode is chosen, it can't be changed."*

**Official Ruling (2025-06-06):** *"If a spell with tiered is copied, the effect that creates the copy may allow you to choose new targets. You cannot choose a new mode."*

**Official Ruling (2025-06-06):** *"If a mode requires a target, you can select that mode only if there's a legal target available. Ignore the targeting requirements for modes you don't choose."*

**CR 601.2b:** When casting, choose the mode (for modal spells) as part of announcing the spell.

**CR 601.2f:** Additional costs are paid when the spell's total cost is paid.

**CR 202.3:** "The mana value of an object is a number equal to the total amount of mana in its mana cost, regardless of color."

## The Pattern

```
TIERED STRUCTURE:

  "Tiered (Choose one additional cost.)"
  Then: three named modes, each with:
    - A mode name (Fire / Fira / Firaga)
    - A cost: {0}, {2}, or {5}{R} (varies per spell)
    - An effect (scales with cost)

  Example: Fire Magic ({R})
    • Fire — {0} — deals 1 damage to each creature.
    • Fira — {2} — deals 2 damage to each creature.
    • Firaga — {5} — deals 3 damage to each creature.

CASTING A TIERED SPELL:

  Step 1: Choose one of the three modes.
  Step 2: That mode's additional cost becomes part of the total cost.
  Step 3: Pay total cost = base mana cost + chosen mode's additional cost.

  MINIMUM COST: Always at least the base mana cost + {0} (the free mode).
  "Free" mode: The {0} additional cost means you pay only the base mana cost.
    → Fire Magic with Fire ({0}): pay {R}, deal 1 damage to each creature.
    → Fire Magic with Fira ({2}): pay {R} + {2} = {R}{2}, deal 2 damage.
    → Fire Magic with Firaga ({5}): pay {R} + {5} = {R}{5}, deal 3 damage.

FREE CAST TRAP (Omniscience, Cascade, Suspend, Free-Cast Effects):

  "Without paying its mana cost" waives only the BASE mana cost.
  Additional costs are NOT waived by free-cast effects.
  The Tiered mechanic's mode costs are ADDITIONAL COSTS, not mana costs.

  OMNISCIENCE ({10}: "You may cast spells from your hand without paying their mana costs"):
    → Cast Fire Magic from hand via Omniscience: base mana cost {R} is free.
    → BUT you still must choose a Tiered mode and pay its additional cost.
    → Choose Fire ({0}): total paid = {0}. OK.
    → Choose Fira ({2}): total paid = {2}. Must pay {2} even though spell is "free."
    → Choose Firaga ({5}): total paid = {5}. Must pay {5}.

  CASCADE (cast for free from library):
    → Same as above. The "cast without paying mana cost" only waives the base cost.
    → Cascaded Tiered spell must still have a Tiered mode chosen and its cost paid.
    → In practice: cascade into Fire Magic = you can choose Fire ({0}) for a free 1-damage
        sweep, or pay {2} for Fira (if you have the mana), etc.

  SUSPEND (cast for free when last counter removed):
    → Same rule. "Cast without paying its mana cost" does not waive Tiered additional cost.
    → The suspended Tiered spell's mode must still be paid when casting from exile.

  WHY: Additional costs are a separate category from mana costs in casting rules (CR 601.2).
    "Without paying its mana cost" waives the item in the upper-right corner.
    Additional costs listed in the oracle text (like Tiered mode costs, Kicker, Escalate)
    are separate — free-cast effects do not inherently waive them.

MANA VALUE (MV) RULES:

  The MV of a Tiered spell is determined by the BASE mana cost ONLY.
  Regardless of which mode is chosen or what additional costs are paid.

  Example: Fire Magic ({R}) always has MV 1, whether you chose Fire, Fira, or Firaga.
  Example: Ice Magic ({1}{U}) always has MV 2.
  Example: Thunder Magic ({R}) always has MV 1.

  IMPLICATIONS:
    Cascade: A cascade spell with "cast a card with MV < X" checks the base MV of Tiered cards.
      → Fire Magic (MV 1) would cascade from any spell with cascade threshold > 1.
      → When cascaded: you still must choose a mode and pay its additional cost.
    Trinisphere: If Trinisphere is out, the total cost (base + additional) is raised to 3 minimum.
      → The "3 minimum" may interact with the chosen mode's additional cost.
    X spells: N/A (Tiered doesn't use X).

MODE SELECTION RULES:

  TIMING: Choose mode as you announce the spell (during the casting process, before costs are paid).
  ONCE CHOSEN: Mode is locked. You cannot change modes after announcement.
  LEGALITY CHECK: "If a mode requires a target, you can select that mode only if there's a legal
    target available." → If no legal targets exist for mode A, you must choose B or C.
  COPIES: When the spell is copied, the copy retains the original mode.
    → You cannot choose a different mode for the copy.
    → New targets may be chosen for the copy, but mode is fixed.

VINCENT'S LIMIT BREAK — MODE SETS P/T:

  Vincent's Limit Break ({1}{B}):
    "Tiered (Choose one additional cost.) Until end of turn, target creature you control gains
    [mode ability] and has the chosen base power and toughness."
    • Galian Beast — {0} — 3/2.
    • Death Gigas — {1} — 5/2.
    • Hellmasker — {3} — 7/2.

  This shows Tiered setting characteristics (P/T), not just effects.
  The mode chosen determines the creature's power and toughness for that turn.
  Free-cast (Omniscience): base cost {1}{B} is free; but Death Gigas ({1}) or Hellmasker ({3})
    additional costs must still be paid to access those modes.

TIFA'S LIMIT BREAK — POWER MULTIPLIER:

  Tifa's Limit Break ({G}):
    • Somersault — {0} — target creature gets +2/+2 until end of turn.
    • Meteor Strikes — {2} — double target creature's power and toughness until end of turn.
    • Final Heaven — {6}{G} — triple target creature's power and toughness until end of turn.

  Note: "Final Heaven" has an additional cost of {6}{G} — a very heavy cost for a tripling effect.
  MV of Tifa's Limit Break is still 1 (just {G} in the mana cost), regardless of mode.
  If cascaded: MV 1 is found by any cascade threshold ≥ 2. Somersault ({0}) would be free to cast;
    Meteor Strikes ({2}) requires 2 additional mana even when cascaded.
```

## Definitive Conclusions

- **Tiered requires choosing exactly one mode — always** — there is no option to not pay the additional cost; you must pick a mode and pay its cost.
- **Free-cast effects do NOT waive Tiered additional costs** — Omniscience, cascade, suspend, and similar effects waive only the base mana cost; the chosen mode's cost must still be paid.
- **MV of Tiered spells is the base mana cost only** — mode selection does not affect MV; Fire Magic is always MV 1 regardless of whether Firaga was chosen.
- **Copies retain the original mode** — you can choose new targets for a copied Tiered spell but cannot switch modes.
- **Mode legality requires available targets** — if a mode requires a target and no legal target exists, that mode cannot be chosen; choose a targetless or legal-target mode instead.
- **The {0}-cost mode is always available as a minimum** — every Tiered spell has a "free tier" ({0} additional cost), ensuring the spell can always be cast for just its base mana cost.

## Canonical Example

**Omniscience + Thunder Magic:**

You control Omniscience ({10}: cast spells from hand without paying mana costs). You have Thunder Magic ({R}) in hand.

You cast Thunder Magic without paying its mana cost ({R} is waived). You MUST still choose a Tiered mode:
- Thunder ({0}): deals 2 damage to target creature. Additional cost: {0}. Total paid: free. ✓
- Thundara ({3}): deals 4 damage to target creature. Additional cost: {3}. Total paid: {3}. You'd need to pay {3}.
- Thundaga ({5}{R}): deals 8 damage to target creature. Additional cost: {5}{R}. Total paid: {5}{R}. You'd need to pay {5}{R} even though the base cost is free.

Most efficient play: choose Thunder, pay nothing, deal 2 damage.

**Example 2 — Cascade into Fire Magic:**

You cast Shardless Agent ({1}{G}{U}: cascade). Cascade fires: reveal until a card with MV < 3 (Shardless Agent is MV 3, cascade threshold is MV < 3 = MV ≤ 2). You reveal Fire Magic ({R}: MV 1).

You may cast Fire Magic for free (without paying {R}). But you must choose a Tiered mode:
- Fire ({0}): free. Deals 1 damage to each creature.
- Fira ({2}): must pay {2}. Deals 2 damage to each creature.
- Firaga ({5}): must pay {5}. Deals 3 damage to each creature.

If you have no mana: choose Fire (free tier), deal 1 to each creature.
If you have {5} available: choose Firaga for maximum value.

**Example 3 — Copy of Tiered Spell:**

You cast Ice Magic ({1}{U}) with Blizzara mode chosen ({2} additional cost, put target creature on top or bottom of library). Your opponent copies Ice Magic with Twincast.

The copy has the Blizzara mode (same as the original). You cannot change the copy to Blizzaga mode. However, you may choose new targets for the copy — put a different creature on top or bottom of library.

**Example 4 — Mode Legality Check:**

You cast Ice Magic ({1}{U}; Tiered). You want to choose Blizzaga ({5}{U}: target creature's owner shuffles it into their library). But there are no creatures on the battlefield at all.

Blizzaga requires a target (target creature's owner shuffles it). No legal target exists. You CANNOT choose Blizzaga. You must choose Blizzard ({0}: return target creature to its owner's hand) or Blizzara ({2}: also needs a target) — neither has a legal target either. If ALL modes require a target and no legal target exists, you cannot legally cast Ice Magic at all. (This would be exceptional — the spell would need at least one mode without targeting requirements.)

## Commonly Confused With
- **P200 (Kicker / Optional Additional Costs)** — Kicker is an optional additional cost that grants bonus effects. Tiered is a mandatory additional cost with exactly one of three modes; it cannot be "skipped" as Kicker can.
- **P195 (Escalate — Choose Multiple Modes)** — Escalate (from Eldritch Moon) lets you pay additional costs to choose more modes. Tiered is different: choose exactly one, not multiple.
- **P025 (Counter Placement — Cost vs. Effect)** — P025 covers how "paying costs" vs. "effect" matters for Doubling Season. Tiered's additional cost is a cost; it can't be circumvented by effect-doubling.
- **P507 (Phyrexian Mana)** — Phyrexian mana lets you pay 2 life instead of one colored mana. Tiered additional costs are generic or colored mana — if a Tiered cost includes a Phyrexian symbol, the life option would apply.
