---
id: p018
name: Static Ability Universal Scope
category: continuous
cr_refs: [112.3a, 613.1, 613.3, 400.1, 613.5]
tags: [static-ability, zones, library, graveyard, exile, continuous-effect, painter-servant, grindstone, color, layer-5]
created: 2026-03-28
examples_count: 1
---

# P018 — Static Ability Universal Scope

## Abstract
Static abilities generate continuous effects that apply universally across all game zones unless the text explicitly restricts them to a specific zone. A static ability that says "all cards are blue" means all cards everywhere — on the battlefield, in graveyards, in libraries, in hands, in exile, and on the stack. The game evaluates card characteristics (including color, type, power/toughness) in whatever zone they're currently in, and a zone-unrestricted static ability applies during that evaluation regardless of zone.

## The Definitive Rule

**CR 112.3a**: *"Static abilities are written as statements... They are simply true."*

**CR 613.1**: Continuous effects from static abilities apply in layer order. Layer 5 handles color-changing effects. These apply wherever the card is being evaluated.

**CR 400.1**: The game zones are: library, hand, battlefield, graveyard, stack, exile, command. Static abilities with no zone restriction affect objects in all of these zones.

**Painter's Servant ruling (2008-05-01)**: *"This ability affects every card in every game zone, all tokens on the battlefield, and all spell copies on the stack, regardless of who controls or owns them."*

## The Pattern

```
STATIC ABILITY CHECK:
  Does the ability name a specific zone?
    YES → applies only in that zone
    NO  → applies in ALL zones

PAINTER'S SERVANT + GRINDSTONE:
  Painter's Servant: "All cards that aren't on the battlefield,
    spells, and permanents are the chosen color in addition to
    their other colors."
  → No zone restriction on "all cards"
  → Every card in every library is now the chosen color

  Grindstone activation: mill 2 cards
  → Both cards are the chosen color (Servant applies to library)
  → Two cards sharing a color → repeat
  → Repeat again (still share color) → mill entire library
```

## Definitive Conclusions

- **Library cards have characteristics.** Static abilities can affect color, type, and other characteristics of cards in the library. Grindstone's "share a color" check sees Painter's Servant's effect applied to those cards.
- **No zone = all zones.** Painter's Servant's text says "all cards that aren't on the battlefield, spells, and permanents" — explicit statement of scope. The general rule for zone-unrestricted statics is the same: all zones.
- **Colorless cards become the chosen color, period.** A colorless artifact under Painter's Servant becomes (e.g.) blue. It does not become "colorless and blue." It simply is blue. (Ruling: "If something affected by Painter's Servant is normally colorless, it will simply be the new color.")
- **Overwriting effects only work on the battlefield.** If you cast Cerulean Wisps on a creature, that creature's color is overwritten — but only on the battlefield where both effects apply. Cards in the library just have Painter's Servant's effect.
- **Multiple Servants stack.** A Servant naming blue + a Servant naming red makes all cards blue AND red.
- **Zone-change timing note.** Painter's Servant ruling: ETB zone-change *replacement* abilities that care about color (like "enters tapped if blue") won't see the Servant's effect because those apply during entry. Triggered ETB abilities (like "when a blue permanent enters") DO see it because they fire after the card is already on the battlefield.

## Canonical Example
**Painter's Servant + Grindstone (2-card mill combo):**
Activate Painter's Servant naming blue. All cards everywhere are blue. Activate Grindstone targeting opponent: mill 2. Both cards are blue (Servant applies to library). They share blue → repeat → mill 2 more → share blue → repeat → library empty. One {3} activation empties the library.

**Blood Moon vs. Painter's Servant:**
Blood Moon's text: "Nonbasic lands are Mountains." Applies only on the battlefield (lands are only on the battlefield). Painter's Servant naming red doesn't conflict with Blood Moon — Blood Moon restricts to the battlefield zone implicitly (lands don't exist meaningfully in other zones).

## Commonly Confused With
- **P004 (Layer Dependency)** — P004 is about which of two conflicting continuous effects applies first within the layer system. P018 is about whether a static ability applies in a given zone at all — these are different questions.
- **P010 (Multi-Layer Effect Continuity)** — P010 covers effects that persist across multiple layers even after their generating ability is removed in an earlier layer. P018 is simpler: it just answers "where does this apply?"
