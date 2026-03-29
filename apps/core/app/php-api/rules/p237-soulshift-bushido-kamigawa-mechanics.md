---
id: p237
name: Soulshift and Bushido — Kamigawa Spirit Return and Combat Pump
category: triggered
cr_refs: [702.45a, 702.45b, 702.46a, 702.46b]
tags: [soulshift, bushido, spirit, warrior, combat, graveyard, Kamigawa, Isamaru, Eight-and-a-Half-Tails, Hikari-Twilight-Guardian]
created: 2026-03-28
examples_count: 2
---

# P237 — Soulshift and Bushido — Kamigawa Spirit Return and Combat Pump

## Abstract
Two Kamigawa block mechanics. **Bushido N**: a triggered ability that gives a creature +N/+N whenever it blocks OR becomes blocked — rewarding creatures that engage in combat. The bonus applies symmetrically whether attacking into a blocker or receiving a blocker. **Soulshift N**: a death trigger on Spirits that returns a Spirit card with mana value N or less from your graveyard to your hand when the Soulshift creature dies. This creates a Spirit recursion chain: die → return cheaper Spirit → that Spirit dies → return even cheaper Spirit. Both mechanics were key to Kamigawa block's Spirit and Warrior tribal themes.

## The Definitive Rules

**CR 702.45a** (verbatim): *"Bushido is a triggered ability. 'Bushido N' means 'Whenever this creature blocks or becomes blocked, it gets +N/+N until end of turn.' (See rule 509, 'Declare Blockers Step.')"*

**CR 702.45b** (verbatim): *"If a creature has multiple instances of bushido, each triggers separately."*

**CR 702.46a** (verbatim): *"Soulshift is a triggered ability. 'Soulshift N' means 'When this permanent is put into a graveyard from the battlefield, you may return target Spirit card with mana value N or less from your graveyard to your hand.'"*

**CR 702.46b** (verbatim): *"If a permanent has multiple instances of soulshift, each triggers separately."*

## The Pattern

```
BUSHIDO:
  Triggered: "whenever this creature blocks OR becomes blocked"
  Effect: +N/+N until end of turn (power AND toughness)
  Fires when: the creature is declared as a blocker OR when a blocker is declared for it
  Does NOT fire when the creature attacks and is NOT blocked
  Does fire if creature attacks and IS blocked
  Does fire if creature blocks

  BUSHIDO + UNBLOCKED ATTACK:
    Bushido does NOT trigger when the creature attacks unblocked
    Only fires when blocking or becoming blocked
    Pure offensive unblocked attacks: creature's stats unchanged

  BUSHIDO + MULTIPLE BLOCKERS:
    If a Bushido creature is blocked by 3 creatures: does it trigger once or thrice?
    Triggering condition: "becomes blocked" — this happens ONCE when the first blocker is assigned
    Result: one trigger for the blocked event, regardless of how many blockers
    +N/+N once: not once per blocker

  BUSHIDO + MULTIPLE BUSHIDO:
    If creature has Bushido 2 twice (e.g., from two sources): EACH triggers separately
    Two separate Bushido 2 triggers: creature gets +2/+2 twice = +4/+4 total
    Stacking: Bushido is additive from multiple sources

  BUSHIDO CARDS (Kamigawa):
    Isamaru, Hound of Konda ({W}): 2/2 Dog (no bushido, just good stats)
    Kentaro, the Smiling Cat: White Samurai with bushido
    Oathkeeper, Takeno's Daisho (Equipment): grants +3/+1 and returns attached Samurai from GY
    Nagao, Bound by Honor (Legendary, {3}{W}): bushido, "tap to give all Samurai +2/+2 until EOT"
    Toshiro Umezawa ({1}{B}{B}): bushido 1, legendary, "whenever an opponent's creature dies, you may cast instant from GY"
    Kentaro, the Smiling Cat: {W} to cast Samurai spells paying only their white mana cost

  BUSHIDO + FIRST STRIKE:
    Creature with Bushido 2 and first strike: +2/+2 triggers when blocking or blocked
    In first strike combat damage step: has the +2/+2 already (trigger resolved before damage)
    Common: Samurai decks stacked first strike + bushido

SOULSHIFT:
  Triggered: "when this permanent is put into a graveyard from the battlefield"
  Effect: return a Spirit card with MV ≤ N from YOUR graveyard to hand
  Optional: "you may" — you choose whether to return a card
  The Soulshift creature must be a Spirit itself? No — Soulshift just says "when this permanent goes to GY"
  Any creature with Soulshift (typically Spirits in Kamigawa) can have the ability

  SOULSHIFT CHAIN:
    Soulshift 2 Spirit (MV 3) dies → return a Spirit with MV ≤ 2
    That Spirit (MV 2) eventually dies → if it has Soulshift 1, return Spirit with MV ≤ 1
    That Spirit (MV 1) eventually dies → if it has Soulshift 0, return 0-MV Spirit
    This creates a recursion ladder: start at top, work down to 0-cost Spirits
    The inverse: if you start with cheap Spirits in GY and kill expensive Soulshift Spirit

  SOULSHIFT + TARGETING:
    Soulshift returns "target Spirit card with MV N or less" — it TARGETS
    If the GY has no valid targets: Soulshift has no legal targets, ability doesn't trigger?
    Actually: the ability triggers regardless, but on resolution if there's no valid target, it does nothing
    "You may" + targeting: if you choose to use it, you must have a valid target
    If you choose "yes I want to return a Spirit" but no valid Spirit in GY: the ability fizzles

  SOULSHIFT CARDS (Kamigawa Champions / Betrayers):
    Hundred-Talon Kami ({4}{W}): 2/3 Spirit, Soulshift 4 — return Spirit with MV ≤ 4
    Kami of Ancient Law ({1}{W}): 2/2 Spirit, "sacrifice to destroy target enchantment", Soulshift 2
    Hikari, Twilight Guardian ({3}{W}{W}): 3/4 Spirit, legendary, Soulshift 5 (high recursion)
    Ethereal Haze ({W}): spell that prevents all damage from creatures this turn
    Thief of Hope ({2}{B}): soulshift 2, "whenever you play a Spirit or arcane spell, target opponent loses 1 life"

  SOULSHIFT + CONTROL CHANGE:
    If a Spirit leaves the battlefield due to opponent exiling it: doesn't go to GY → no soulshift
    If bounced: doesn't go to GY → no soulshift
    Only GRAVEYARD movement triggers soulshift
```

## Definitive Conclusions

- **Bushido triggers when blocking or becoming blocked** — NOT on unblocked attacks.
- **Multiple Bushido instances stack**: each triggers separately for cumulative +N/+N.
- **Soulshift creates a recursion chain**: die → return smaller Spirit → repeat.
- **Soulshift is optional** and requires a valid target in your graveyard.
- **Soulshift doesn't fire** if the Spirit is exiled or bounced (must go to graveyard).

## Canonical Example
**Soulshift Spirit Chain in Kamigawa Block Draft:**
Graveyard: Kami of Ancient Law ({1}{W}, Soulshift 2, MV 2) and Hundred-Talon Kami ({4}{W}, Soulshift 4, MV 5).
Battlefield: Hikari, Twilight Guardian ({3}{W}{W}, Soulshift 5).
Hikari is destroyed: Soulshift 5 triggers — return Hundred-Talon Kami (MV 5 ≤ 5) to hand.
Cast Hundred-Talon Kami next turn. It dies: Soulshift 4 triggers — return Kami of Ancient Law (MV 2 ≤ 4) to hand.
Kami of Ancient Law cast again: sacrifice → destroy enchantment. It dies: Soulshift 2 — return any Spirit with MV ≤ 2.
Chain: large Spirits die → recursively return smaller ones → small ones provide utility again.

**Example 2 — Bushido in Combat:**
Toshiro Umezawa ({1}{B}{B}): 2/2, Bushido 1, legendary.
Opponent attacks with Grizzly Bears (2/2).
Declare Toshiro as blocker: Bushido 1 triggers → Toshiro gets +1/+1 until EOT.
Toshiro is now 3/3 blocking a 2/2: Grizzly Bears die, Toshiro survives (has 1 damage marked).
Toshiro Umezawa's other ability: "Whenever a creature an opponent controls is put into a graveyard from the battlefield, you may cast target instant card from your graveyard."
Grizzly Bears died → Toshiro triggers → cast an instant from GY for free.
Bushido + utility ability: defensive combat engagement that generates card advantage.

## Commonly Confused With
- **P225 (Heroic)** — Heroic triggers on being targeted by spells; Bushido triggers on combat blocking/being blocked.
- **P226 (Monstrous)** — Monstrous is an activated pump; Bushido is an automatic triggered pump on combat.
- **P201 (Protection)** — Protection prevents damage/targeting; Bushido enhances stats when engaging in combat.
