---
id: p476
name: Prototype, Read Ahead, and Craft — Smaller-Version Casting, Choose-Saga-Chapter, and Exile-for-Alternate-Form
category: costs
cr_refs: [702.182, 702.183, 702.185, 600.1, 714.2, 601.2b, 400.7, 613.1]
tags: prototype, read-ahead, craft, formal-keyword, alternate-cast, saga-chapter-choice, exile-transform, brothers-war, march-of-the-machine, lost-caverns-ixalan
created: 2026-03-29
examples_count: 7
---

# P476 — Prototype, Read Ahead, and Craft — Smaller-Version Casting, Choose-Saga-Chapter, and Exile-for-Alternate-Form

## Abstract

Three formal keywords from recent sets with distinct alternative-casting or transformation mechanics: **Prototype** (CR 702.182, The Brothers' War) allows casting an artifact creature for a reduced cost, resulting in a smaller version with different P/T and sometimes different abilities; **Read Ahead** (CR 702.183, March of the Machine) allows a Saga to start at any chapter you choose (rather than always starting at Chapter I); and **Craft** (CR 702.185, Lost Caverns of Ixalan) is an activated ability that exiles the card plus other specified materials to transform it into a powerful alternate form. All three interact with mana value calculation, copy effects, and the Saga rules in non-obvious ways.

## The Definitive Rules

### Prototype (CR 702.182)
**CR 702.182a verbatim:** *"Prototype [cost] — [power/toughness] means 'You may cast this spell by paying [cost] rather than its mana cost, and if you do, it has base power [power] and base toughness [toughness] instead of its normal values. This applies while the spell is on the stack and if the permanent enters the battlefield using the alternate casting cost.'"*

Prototype creates two castable versions of one card. The prototyped version: uses the prototype cost, has the prototype P/T (smaller), and may have different abilities. The non-prototyped version: full mana cost, full P/T, full abilities.

### Read Ahead (CR 702.183)
**CR 702.183a verbatim:** *"Read ahead means 'As this Saga enters the battlefield, choose a chapter. This Saga begins with that many lore counters on it, and its chapter abilities trigger starting from that chapter.'"*

Read Ahead allows a Saga to skip to any chapter you choose when it enters. The Saga begins with the chosen chapter's worth of lore counters, and subsequent abilities trigger from that chapter onward.

### Craft (CR 702.185)
**CR 702.185a verbatim:** *"Craft with [cost and materials]: [activation instructions]."*

Craft is an activated ability: pay the craft cost and exile specified cards, then the card transforms into its alternate form. The alternate form (the "with" version) is usually a more powerful version of the same card.

## The Pattern

```
PROTOTYPE pattern:
Two cast options for the same card:
  Option A: Cast at full mana cost → full P/T, full abilities, on the battlefield as normal
  Option B: Cast at prototype cost → prototype P/T (smaller), same card, possible reduced abilities

When cast as prototype:
  → The card on the stack has the PROTOTYPE characteristics (smaller P/T)
  → If prototyped: the permanent enters the battlefield with the smaller P/T
  → MANA VALUE: the card's printed MV is always the full mana cost, regardless of how cast
    → A prototype card cast for 2 mana instead of 7 still has MV = 7
    → This matters for Cascade (cascade checks MV), graveyard recursion cost limits, etc.
  → Copying a prototyped spell on the stack: the copy has the prototype characteristics
    (because it's copying the spell as it appears on the stack with prototype P/T)
  → Blinking a prototyped creature: returns as... a new permanent entering the battlefield.
    The blink doesn't re-cast it. It returns as a new object NOT cast, so it enters as the
    full version? No — the "prototype" status comes from HOW IT WAS CAST.
    When a prototyped creature blinks and returns, it re-enters as the default state (full version)
    because the blink doesn't use the casting choice. The prototype P/T was a "base P/T set
    from an alternative cast" which no longer applies when re-entering without being cast.
    → After blink: full version (full P/T, full abilities) enters the battlefield

READ AHEAD pattern:
When a Read Ahead Saga enters:
  → Choose which chapter to start at (I, II, or III for a 3-chapter saga)
  → The Saga enters with that many lore counters
    → Start at Chapter I: 1 lore counter → triggers Chapter I
    → Start at Chapter II: 2 lore counters → triggers Chapter II
    → Start at Chapter III: 3 lore counters → triggers Chapter III → Saga complete
  → Starting at Chapter II: Chapter I's effect is SKIPPED — never triggers
  → Starting at Chapter III: Chapters I and II are SKIPPED
  → The Saga still follows normal Saga rules from chosen chapter:
    → At each upkeep, add a lore counter → trigger that chapter
    → When lore counters ≥ final chapter: sacrifice the Saga after that trigger resolves
  → Read Ahead + proliferate: adding a lore counter via proliferate before your upkeep
    → Can skip ahead a chapter mid-saga by proliferating
  → Read Ahead allows DIRECT CHAPTER III ACCESS: start at the final chapter,
    get its effect immediately, Saga completes and is sacrificed → instant one-time effect
    → This effectively converts a Saga into a sorcery that does Chapter III's effect

CRAFT pattern:
Activated ability: "[Cost], Exile [this card] and [specified materials]: transform/create alternate form"
  → Crafting from the graveyard: some Craft abilities say "Exile this card from your graveyard"
    → Others may say from hand or other zones
  → Materials: "and exile [N artifacts / creatures / other permanents / cards from GY]"
  → The crafted form enters the battlefield as a new permanent
  → This is NOT casting (crafted form enters via ability resolution)
    → No "cast" triggers
    → ETB abilities of the new form DO trigger (it enters the battlefield)
  → The crafted form's MV: the card's printed MV (same card, different side)
  → Grafdigger's Cage: Craft doesn't cast from exile or GY — it transforms/creates via ability
    → Cage doesn't stop Craft (Craft is an activated ability, not a cast)
  → Craft components going to exile: the exiled cards are consumed (gone)
  → If the Craft ability is countered (Stifle): the card being crafted and the exiled materials
    are already exiled (cost paid), but the transform doesn't happen
```

## Definitive Conclusions

**Prototype:**
- Prototype is essentially a "budget version" of a powerful card. The full version costs 7 mana for a 7/7 with abilities; the prototype version costs 2 mana for a 2/2 with fewer abilities. Early game: play the prototype. Later: replay the full version.
- Mana Value trap: the prototype card's MV is always the full cost. If you cascade or Discover looking for cards with MV ≤ 4, a 7-MV prototype card is NOT found even if you can cast the prototype version for 2 mana.
- Blink/flicker resets prototype to full version. This is sometimes desirable (you want the full version) or sometimes undesirable (you wanted the cost-efficient smaller version to stick around).
- Key card: *Blitz Automaton* (BRO): "Haste. Prototype {2}{R} — 3/2." Full version is a 6/4 artifact creature for {7}; prototype is a hasty 3/2 for {2}{R}. Drop the prototype on turn 3 for an aggressive hasty beater.

**Read Ahead:**
- Read Ahead on a Saga with a powerful Chapter III effect effectively converts that Saga into a sorcery: enter at Chapter III → trigger immediately → Saga sacrifices itself. One-time payoff.
- Read Ahead + Proliferate: control when each chapter fires. Start at Chapter II, proliferate → skip to Chapter III without waiting a turn. Or start at Chapter I and proliferate to rush through chapters.
- The key rules question: do you have to start at Chapter I or can you skip? Read Ahead explicitly says you CHOOSE which chapter to start at. There is no "default" — you always choose when a Read Ahead Saga enters.
- Key card: *March of the Machine* Sagas and *Phyrexia: All Will Be One* Sagas with Read Ahead. Example: *Invasion of [Plane]* type Sagas sometimes have Read Ahead.

**Craft:**
- Craft is a powerful transformation: typically a creature in the GY is the craft source, and it exiles other cards as materials to transform into a much stronger form.
- The key question: "is the crafted permanent the same object?" When a card transforms via Craft, the new form enters the battlefield as a new permanent (different characteristics). Counters and attachments from the original card (which was in the GY or exiled) don't transfer because the original was in a non-battlefield zone.
- Key card: *Quintorius Kand* (LCI) is not craft, but represents the type. Actual Craft cards: *Akal Pakal, First Among Equals* (LCI), various artifact crafting cards.

## Canonical Examples

**Prototype:**
- *Blitz Automaton* (BRO): 2/1 haste for {1}{R} (prototype) OR full large version later. Early aggro pressure, late upgrade.

**Read Ahead:**
- A Saga with Read Ahead where Chapter III = "Create a 5/5 token": Start at Chapter III → immediately create the token → Saga completes and is sacrificed. Instant 5/5 for the Saga's casting cost.

**Craft:**
- A Craft artifact: pay craft cost, exile this card from GY + 2 other artifacts → the crafted weapon enters the battlefield transformed as a much more powerful version.

## Commonly Confused With

- **P095** (Double-Faced Cards / Transform) — Craft creates a transformed permanent via an activated ability; DFCs transform via triggered effects or spells; both result in different faces but through different mechanisms
- **P416** (Split Second) — Not directly related, but Read Ahead Sagas could be used at instant-speed to respond to... wait, Sagas are cast at sorcery speed. Not applicable.
- **P417** (Suspend/Vanishing) — Sagas use lore counters; Read Ahead chooses the starting lore counter count; both involve counter-based progression but lore counters and time counters are different types
- **P460** (Incubate/Ring Tempts You) — Incubator tokens transform for {2}; Craft exiles the source card + materials; both are transformation mechanics but very different mechanisms
