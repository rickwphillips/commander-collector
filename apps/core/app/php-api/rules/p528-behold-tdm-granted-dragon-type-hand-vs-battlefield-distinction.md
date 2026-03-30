---
id: p528
name: Behold (TDM) + Granted Dragon Type — Hand vs. Battlefield Distinction and Reveal Mechanics
category: cross-mechanic
cr_refs: [701.4, 708.2, 109.1, 205.3m]
tags: [behold, dragon-subtype, granted-type, hand, battlefield, type-change, reveal, tarkir-dragonstorm, TDM, type-alteration]
created: 2026-03-30
examples_count: 3
---

# P528 — Behold (TDM) + Granted Dragon Type — Hand vs. Battlefield Distinction and Reveal Mechanics

## Abstract
**Behold** requires revealing a Dragon card from hand OR choosing a Dragon permanent you control. The critical distinction: "Dragon card" means a card with the Dragon type printed on it (or temporarily gained while in hand via enchantment), but **temporary type grants from enchantments only apply on the battlefield**. A creature in your hand cannot have a temporary type granted to it — type-granting effects are continuous effects that only apply to permanents (objects on the battlefield). Therefore, if you control an enchantment that says "creatures you control are Dragons," that enchantment does NOT make creatures in your hand Dragons for the purpose of revealing them to Behold. You can only reveal Dragon cards (with Dragon printed as their type or permanently gained type), not creatures in hand that would become Dragons if they entered.

## The Definitive Rules

**CR 701.4 (Behold):** *"'Behold' means 'reveal a card from your hand that has the [subtype] subtype or choose a [subtype] permanent you control.' If it's a cost, the player must reveal that card or choose a permanent you control with that subtype."*

**CR 109.1 (Objects):** *"An object is anything on the stack, in hand, in the graveyard, in exile, or on the battlefield. ... Objects in other zones are not permanents."*

**CR 205.3m (Creature Subtypes):** *"A creature card has its subtypes printed in its type line. A creature permanent's subtypes are those it was born with as well as those it has gained (via spell effect or permanent effect). Permanents can have type changes applied; non-permanents have fixed types based on card printing."*

**CR 613.3 (Continuous Effects):** *"Static effects only apply to permanents. A spell or object not on the battlefield has only those characteristics printed on the card."*

## The Pattern

```
BEHOLD REQUIRES DRAGON SUBTYPE:

  Behold (cost or effect): reveal a Dragon from hand OR choose Dragon permanent.
  Requirement: the card must have "Dragon" listed as a creature subtype.

PERMANENT vs. NON-PERMANENT TYPE DISTINCTION:

  PRINTED TYPE (card itself):
    A card has its printed type regardless of zone (hand, library, graveyard, exile).
    "Lightning Dragon ({4}{R}: 4/4 Dragon)" is always a Dragon card.
    You can always reveal it to Behold from your hand.

  GRANTED TYPE (continuous effect):
    An enchantment says: "Creatures you control are Dragons in addition to their other types."
    This effect is a continuous effect that applies to permanents (objects on the battlefield).
    A creature in your hand is NOT on the battlefield → the effect does not apply to it.
    → The creature in hand is NOT a Dragon for Behold purposes (unless it was already a Dragon).

EXAMPLE: DORMANT DRAGON + MAGICAL CHRISTAMAS TREE (HYPOTHETICAL):

  You control "Magical Christmas Tree: Enchantment — {2}{G}: Creatures you control are
    Dragons in addition to their other types."
  In your hand: Grizzly Bears (1/2 creature, no Dragon type). "Is Grizzly Bears a Dragon?"
    → NO. The type grant is a continuous effect (applies to permanents only).
    → Grizzly Bears is in hand (non-permanent) → type grant does NOT apply.
    → Grizzly Bears is not a Dragon for Behold purposes.

  On the battlefield: Grizzly Bears is a creature (enters). Magical Christmas Tree applies:
    → Grizzly Bears becomes a Dragon creature (type change via continuous effect).
    → If you then reveal from hand or target with Behold: the Grizzly Bears on the
      battlefield is now a Dragon.
    → But the Grizzly Bears in your hand is still not a Dragon (hand is non-permanent).

PERMANENTS ON BATTLEFIELD + TYPE GRANTS:

  If a creature is on the battlefield and a type-granting effect applies:
    The creature gains the type (continuous effect on permanent = legal).
    → Creature is now a legal Behold target (if the granted type is Dragon).
    Example: 2/2 creature gains Dragon type from Breath of the Dragon (enchantment aura).
      On battlefield: it's a Dragon.
      If bounced to hand: it's no longer a permanent → continuous effect stops applying.
      In hand: no longer a Dragon (unless it was printed as one).

REVEAL MECHANICS AND BEHOLD:

  When you reveal a card to Behold, you're showing the card's printed characteristics.
  The revealed card remains in your hand (revealed but not exiled, not cast).
  If the revealed card is "a Dragon," the Behold condition is met.
  The revealed card is NOT cast or played — just revealed.

BEHOLD WHILE ON STACK:

  Some Behold effects are costs while casting a spell. You reveal/choose before paying.
  The revealed card stays in your hand throughout the spell's resolution.
  The spell's effects apply based on whether a Dragon was revealed.

EXAMPLE: MOLTEN EXHALE FLASH GRANT:

  Molten Exhale ({1}{R}: Sorcery with Behold):
    "Behold a Dragon. Molten Exhale costs {1}{R} more to cast. If you beheld a Dragon
     as you cast this spell, you may cast it as though it had flash."

  You reveal Chandra, Torch of Defiance (planeswalker, not a Dragon creature).
    → Not a Dragon → can't use the Behold cost → must pay the extra {1}{R} anyway.
  You reveal Twinmaw Stormbrood // [Omen] from your hand (Dragon card).
    → Dragon → Behold condition met → cast at instant speed (flash granted).
  You choose a creature on the battlefield that has been granted Dragon type by an aura.
    → It's a Dragon permanent → Behold condition met → flash granted.
  You choose a creature in your hand that has been granted Dragon type... → NO, hand is
    non-permanent → type grant doesn't apply → not a Dragon for Behold → condition NOT met.

CREATURE TYPE ANIMATIONS + BEHOLD:

  Land animate to become creatures (via "Land becomes a creature" effect).
  Once animated: they're on the battlefield (permanents) → type grants apply.
  If type-granted as Dragons: Behold can choose them.
  If later the animation ends: they're no longer permanents → type grant stops.

PRINTING vs. GRANTING:

  Printed Dragon (always legal for Behold):
    Example: "Thunder Drake ({3}{U}: 3/3 Dragon Creature)"
      In hand: it's a Dragon.
      On battlefield: it's a Dragon.
      In graveyard: it's a Dragon.

  Granted Dragon (legal only if permanent):
    Example: Creature with "Creatures you control are Dragons."
      On battlefield: Dragon creatures are Dragons (type grant applies).
      In hand: not Dragons (non-permanent, grant doesn't apply).
```

## Definitive Conclusions

- **Type-granting effects only apply to permanents** — a creature in your hand cannot be granted the Dragon type; only printed Dragon cards in hand can be revealed to Behold.
- **Behold distinguishes "Dragon card" from "Dragon permanent"** — the cost/effect requires either a Dragon card from hand (printed type) or a Dragon permanent on battlefield (printed or granted type).
- **Continuous effects stop applying when permanents leave the battlefield** — if a Grizzly Bears with granted Dragon type is bounced to hand, the grant no longer applies (hand is non-permanent zone).
- **Reveal mechanics keep cards in hand** — revealing to Behold doesn't exile or cast the card; it just shows the type for condition-checking.
- **Planeswalker vs. creature distinction matters** — Behold looks for Dragon subtype (a creature subtype); planeswalkers cannot be Dragons and cannot be revealed/chosen for Behold Dragon conditions.

## Canonical Example

**Aura Grants Dragon Type — Behold Window:**

You control an aura that grants Dragon type to creatures. You equip/enchant a Grizzly Bears on the battlefield. Grizzly Bears becomes a Dragon (granted type, on battlefield = legal).

You want to cast Molten Exhale (Behold a Dragon for flash). You can choose Grizzly Bears (now a Dragon permanent) to Behold.

You also have a second Grizzly Bears in your hand (not enchanted). You cannot reveal it to Behold — it's in hand, and the Dragon type grant doesn't apply to non-permanents. The hand-copy is not a Dragon.

**Example 2 — Printed vs. Granted:**

In hand: Thunder Drake (printed Dragon) and Llanowar Elves (printed 1/1 Elf).

You cast a Behold spell. You reveal Thunder Drake — it's a Dragon card, Behold condition met. You could also reveal nothing else (only one can be revealed per Behold).

Llanowar Elves is not a Dragon card (printed Elf type only), so even if you had a Dragon-granting effect, the hand-copy wouldn't be a Dragon.

**Example 3 — Aura Bounce:**

Your Grizzly Bears is on the battlefield with an aura granting Dragon type. You Behold — Grizzly Bears is a Dragon (legal target). The aura is bounced. Grizzly Bears is still on the battlefield but no longer has the aura. Continuous effect ends. Grizzly Bears is no longer a Dragon for the remainder of the turn.

## Commonly Confused With
- **P522 (Behold)** — P522 covers the baseline Behold mechanics and "was beheld" persistence. P528 clarifies the Dragon type distinction between hand and battlefield.
- **P018 (Static Ability Universal Scope)** — P018 covers whether static effects apply to non-battlefield zones. P528 applies that rule specifically to Behold's Dragon-type requirement.
- **P512 (Omens — Zone Identity)** — Omens are Dragon creatures in all zones (they have printed Dragon type). P528 clarifies that granted Dragon types do NOT extend to hand.
