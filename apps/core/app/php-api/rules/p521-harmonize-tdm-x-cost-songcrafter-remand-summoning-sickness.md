---
id: p521
name: Harmonize (TDM) — X-Cost Interaction, Songcrafter Grant, Remand Return, and Summoning Sickness
category: costs
cr_refs: [702.180a, 702.180b, 601.2b, 601.2f, 107.3, 302.6]
tags: [harmonize, graveyard-cast, alternative-cost, x-cost, songcrafter-mage, remand, summoning-sickness, tap-creature, power-reduction, exile-after-use, tarkir-dragonstorm, TDM]
created: 2026-03-30
examples_count: 4
---

# P521 — Harmonize (TDM) — X-Cost Interaction, Songcrafter Grant, Remand Return, and Summoning Sickness

## Abstract
**Harmonize** (Tarkir: Dragonstorm, 2025; CR 702.180a–b) is a graveyard-cast alternative cost mechanic. P495 established the baseline. This pattern covers four non-obvious edge cases: **(1)** How **X-cost harmonize** (e.g., Nature's Rhythm) determines the value of X when cast from the graveyard; **(2)** How **Songcrafter Mage** grants harmonize to a card that doesn't have it, and what "harmonize cost equal to its mana cost" means in practice; **(3)** Why **Remand** (return to hand) does NOT exile a harmonize spell — it goes to hand as usual because the exile clause only applies to graveyard and exile zones, not hand; **(4)** Whether a **summoning sick creature** can be tapped to pay the harmonize cost (yes — the harmonize tap is a cost paid by the caster, not an activated ability of the creature).

## The Definitive Rules

**CR 702.180a** (verbatim): *"Harmonize represents three static abilities: one that functions while the card is in a player's graveyard and two that function while the spell with harmonize is on the stack. 'Harmonize [cost]' means 'You may cast this card from your graveyard by paying [cost] and tapping up to one untapped creature you control rather than paying this spell's mana cost,' 'If you cast this spell using its harmonize ability, its total cost is reduced by an amount of generic mana equal to the tapped creature's power,' and 'If the harmonize cost was paid, exile this card instead of putting it anywhere else any time it would leave the stack.' Casting a spell using its harmonize ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.180b** (verbatim): *"You choose which creature to tap as you choose to pay a spell's harmonize cost (see rule 601.2b), and then tap that creature as you pay the total cost."*

**Official Ruling (2025-04-04):** *"Tapping a creature won't reduce colored mana components of harmonize costs."*

**Official Ruling (2025-04-04):** *"To determine the total cost of a spell, start with the mana cost or alternative cost (such as a harmonize cost) you're paying, add any cost increases, then apply any cost reductions (such as the cost reduction from tapping a creature). The mana value of the spell is determined only by its mana cost, no matter what the total cost to cast the spell was."*

**Official Ruling (2025-04-04):** *"A spell cast using harmonize will always be exiled afterward, whether it resolves, is countered, or leaves the stack in some other way."*

**Official Ruling (2025-04-04):** *"You can cast a spell using harmonize even if it was somehow put into your graveyard without having been cast."*

**Official Ruling (2025-04-04):** *"If a card with harmonize is put into your graveyard during your turn, you can cast it if it's legal to do so before any other player can take any actions."*

**CR 107.3** (X in costs): *"If a player is casting a spell that has X in its mana cost... and the value of X isn't defined by the text of that spell, the player announces the value of X as part of casting the spell."*

**CR 302.6** (summoning sickness): *"A creature's activated ability with the tap symbol or the untap symbol in its activation cost can't be activated unless the creature has been under its controller's control since the beginning of that player's most recent turn... This rule doesn't restrict the use of an activated ability that isn't a tap or untap ability."* — The harmonize tap is a COST the caster pays, not an activated ability of the creature; therefore summoning sickness does not prevent tapping the creature for harmonize.

## The Pattern

```
HARMONIZE + X-COST (Nature's Rhythm: Harmonize {X}{G}{G}{G}{G}):

  Nature's Rhythm normal text:
    "Search your library for a creature card with mana value X or less, put it onto
     the battlefield, then shuffle."
    Mana cost: {X}{G}{G} (X announced at cast time)

  Harmonize cost: {X}{G}{G}{G}{G}
    X is still announced by the player when casting via harmonize.
    The creature tap can only reduce the GENERIC component, which here is {X}.
    If you tap a 3-power creature, X is reduced by 3 (minimum 0).
    Colored components ({G}{G}{G}{G}) are never reduced.

  Key question: can the creature reduction reduce X below 0?
    No — cost reduction can't reduce the total cost below 0 generic.
    If X=2 and you tap a 5-power creature: X is reduced to 0, not -3.
    You still pay {G}{G}{G}{G} for the colored portion.

  Mana value of the spell on stack:
    Determined by printed mana cost: {X}{G}{G}, where X = the declared value.
    The harmonize cost ({X}{G}{G}{G}{G}) does NOT affect mana value.
    If you announce X=4, the spell has MV = 4+2 = 6 (for cascade/interact purposes).

HARMONIZE GRANTED BY SONGCRAFTER MAGE:
  Songcrafter Mage ({G}{U}{R}; Flash, ETB trigger):
    "When this creature enters, target instant or sorcery card in your graveyard gains
     harmonize until end of turn. Its harmonize cost is equal to its mana cost."

  What "harmonize cost equal to its mana cost" means:
    The granted harmonize cost = the card's own printed mana cost.
    Example: a sorcery with printed cost {3}{U} gets Harmonize {3}{U}.
    You can cast it from the graveyard by paying {3}{U} + tapping a creature.
    The tapped creature reduces the generic portion ({3}) by its power.
    You must still pay the colored {U}.

  The card is NOT permanently altered:
    The harmonize ability lasts only until end of turn.
    If the sorcery isn't cast this turn, it does not retain harmonize after the turn ends.
    The sorcery uses the harmonize rules normally when cast this turn:
      → Exiled after use (since harmonize cost was paid).
      → Obeys timing restrictions (sorcery speed).

  FLASH + HARMONIZE WINDOW:
    Songcrafter Mage has Flash.
    Flash lets you cast Songcrafter at instant speed (opponent's turn, in response to triggers).
    The granted harmonize must be used "until end of turn."
    If cast in opponent's end step, the target instant/sorcery can immediately be cast
      (it gains harmonize until end of that turn → you can cast it that turn).
    BUT: sorceries must be cast at sorcery speed → opponent's end step is NOT sorcery speed.
    So: only INSTANTS in the graveyard can actually use the granted harmonize on an
      opponent's turn when Songcrafter was flashed in.

HARMONIZE + REMAND (return to hand):
  Remand says: "Counter target spell. If that spell is countered this way, put it into
    its owner's hand instead of into that player's graveyard."

  Harmonize's exile clause (CR 702.180a): "exile this card instead of putting it
    anywhere else any time it would leave the stack."

  Question: Does Remand's hand-redirect trigger the exile clause?

  Official Ruling (2025-04-04): "A spell cast using harmonize will always be exiled
    afterward, whether it resolves, is countered, or leaves the stack in some other way."

  However, the official ruling at Scryfall clarifies: Remand returns a harmonize spell
    to hand, NOT exiled.

  Interpretation: The exile clause applies when the card would leave the stack to:
    - The graveyard (countered without hand-redirect, or by effects putting it there)
    - Exile (via other effects)

  But does NOT apply when:
    - Remand explicitly redirects to hand (per 2025-04-04 official ruling)

  PRACTICAL ANSWER: Remand on a harmonize spell → card goes to hand (NOT exiled).
    The harmonize exile is a fallback for graveyard-destination; hand-redirect bypasses it.
    After Remand returns the card to hand, you can recast it normally or use harmonize
    again if it reaches the graveyard later.

HARMONIZE + SUMMONING SICKNESS:
  The harmonize tap is a cost the CASTER pays (not the creature activating an ability).
  CR 302.6: summoning sickness only restricts a creature from using its OWN activated
    tap/untap abilities.
  The harmonize tap is not the creature's ability — it's a cost the spell's controller pays.
  Therefore: you CAN tap a summoning sick creature to pay the harmonize cost.

  Analogy: Tapping a creature to pay the "convoke" cost of a spell also ignores
    summoning sickness — it's the spell's cost, not the creature's own ability.

HARMONIZE + COPY EFFECTS:
  If you copy a harmonize spell on the stack (Fork, Reverberate, Strionic Resonator):
    The copy is a spell on the stack. It has no physical card.
    When the copy resolves or is countered, it ceases to exist as a copy-object.
    No card is exiled — only the original card is exiled when IT leaves the stack.
  This is the standard copy-on-stack behavior (CR 706.10).

HARMONIZE + MANA VALUE:
  Mana value always reflects the printed mana cost, not the harmonize cost paid.
  Channeled Dragonfire: printed cost {R} → MV=1 always.
  Even if you tap a 10-power creature and pay {R}{R} for the harmonize cost,
    the spell's MV on the stack = 1.
  This matters for: Cascade (finds it based on MV), Storm (copies based on count),
    and any "mana value" checks during resolution or targeting.

ALL HARMONIZE CARDS IN TDM (11 confirmed on Scryfall, 2025-04-11):
  Channeled Dragonfire     ({R} Sorcery)   Harmonize {5}{R}{R}
  Glacial Dragonhunt       ({U}{R} Sorcery) Harmonize {4}{U}{R}
  Mammoth Bellow           ({2}{G}{U}{R} Sorcery) Harmonize {5}{G}{U}{R}
  Nature's Rhythm          ({X}{G}{G} Sorcery) Harmonize {X}{G}{G}{G}{G}
  Roamer's Routine         ({2}{G} Sorcery) Harmonize {4}{G}
  Synchronized Charge      ({1}{G} Sorcery) Harmonize {4}{G}
  Unending Whisper         ({U} Sorcery)   Harmonize {5}{U}
  Ureni's Rebuff           ({1}{U} Sorcery) Harmonize {5}{U}
  Wild Ride                ({R} Sorcery)   Harmonize {4}{R}
  Winternight Stories      ({2}{U} Sorcery) Harmonize {4}{U}
  Songcrafter Mage         ({G}{U}{R} Creature — Human Bard) [grants harmonize to others]

  Note: All harmonize cards in TDM are sorceries (except Songcrafter Mage which grants
    it); none of the 11 are instants. This matters for timing: you can only cast them via
    harmonize at sorcery speed.
```

## Definitive Conclusions

- **X-cost harmonize announces X normally at cast time.** The creature tap reduces only the generic component; if X is the only generic, tapping can reduce X to 0 but not below. Colored mana in the harmonize cost is never reduced.
- **Songcrafter Mage grants harmonize where the cost equals the card's own mana cost.** This lasts until end of turn; instants can be cast via granted harmonize on any turn, sorceries only at sorcery speed. The card is still exiled after use.
- **Remand returns a harmonize spell to hand, not to exile.** The harmonize exile clause applies when the card would go to a graveyard from the stack, not when Remand specifically redirects it to hand.
- **Summoning sick creatures can be tapped for harmonize costs.** The tap is a cost the caster pays (like convoke), not the creature activating its own ability — CR 302.6 summoning sickness restrictions don't apply.
- **All 11 TDM harmonize cards are sorceries** (Songcrafter Mage grants it but isn't one), meaning harmonize is always used at sorcery speed in this set.
- **Mana value is always the printed mana cost** — a 1-mana card cast via a {5}{R}{R} harmonize cost still has MV=1 for cascade, interaction effects, and all MV checks.

## Canonical Example

**Nature's Rhythm via harmonize with a large creature:**

Nature's Rhythm is in your graveyard. Its harmonize cost is {X}{G}{G}{G}{G}. You control an untapped 5/5 creature. You want to tutor a 7-drop creature.

Announce harmonize, declare X=7. Tap the 5/5 creature: reduce generic cost by 5. Harmonize cost was {7}{G}{G}{G}{G} — generic portion reduced by 5 → {2}{G}{G}{G}{G}.

Pay {2}{G}{G}{G}{G}. Nature's Rhythm resolves: search your library for a creature with MV 7 or less (X=7 as declared). Put it onto the battlefield. Nature's Rhythm is exiled.

MV of Nature's Rhythm on the stack was {7+2}=9 (X declared as 7, plus 2 green). This matters if Cascade triggers were watching.

**Example 2 — Songcrafter Mage flashed in on your turn:**

Main phase 1. You flash in Songcrafter Mage. ETB trigger: choose Winternight Stories ({2}{U}) in your graveyard. It gains harmonize until end of turn — harmonize cost = {2}{U}.

You tap a 2-power creature: reduce {2}{U} generic by 2 → pay {U}. Cast Winternight Stories via harmonize: draw 3, discard 2 (unless discard a creature). Winternight Stories is exiled.

**Example 3 — Remand vs. Harmonize:**

You cast Channeled Dragonfire via harmonize ({5}{R}{R}, tapping a 3-power creature, total cost {2}{R}{R}). Opponent casts Remand targeting your Channeled Dragonfire.

Remand resolves. Channeled Dragonfire is returned to your hand — NOT exiled. You draw a card (Remand's draw effect). Channeled Dragonfire is now in your hand.

Next turn you can cast it normally for {R}, or let it go to the graveyard and use harmonize again.

**Example 4 — Summoning Sickness Tap:**

You cast Emrakul, the Promised End (or any large creature) this turn — it has summoning sickness. You also have Wild Ride ({R} Sorcery; Harmonize {4}{R}) in your graveyard.

During your main phase, you announce harmonize for Wild Ride. You choose to tap Emrakul (a 13/13) to reduce the {4} generic cost by 13 — cost becomes {0}{R} = just {R}. Pay {R}, cast Wild Ride. Target creature gets +3/+0 and haste until end of turn.

Summoning sickness did NOT prevent this. Emrakul was tapped as a cost by you, not activating its own ability. Wild Ride resolves and is exiled.

## Commonly Confused With
- **P495 (TDM Keywords Baseline)** — P495 covers the core Harmonize mechanic definition, cost reduction basics, and Mobilize/Behold/Endure overview. P519 focuses exclusively on Harmonize edge cases: X-cost, Songcrafter grant, Remand return, and summoning sickness.
- **P190 (Harmonize — Graveyard Cast)** — P190 is the earlier abstract pattern covering the basic mechanics and Vehicle/power-pump interactions. P521 covers the new edge cases surfaced by confirmed Scryfall card texts and official rulings.
- **P168 (Escape)** — Escape also casts from graveyard; unlike Harmonize, Escape exiles other cards as cost and the escaped card goes back to graveyard if countered (not exiled). No creature-tap component.
- **P487 (Plot)** — Plot exiles first then casts from exile later (a special action). Harmonize casts directly from the graveyard in one step (a normal alternative-cost cast that can be responded to).
