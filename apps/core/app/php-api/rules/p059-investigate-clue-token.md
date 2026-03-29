---
id: p059
name: Investigate — Clue Token Creation and Sacrifice
category: stack
cr_refs: [701.16a, 111.10f]
tags: [investigate, clue, token, artifact, sacrifice, draw, activated-ability, improvise]
created: 2026-03-28
examples_count: 2
---

# P059 — Investigate — Clue Token Creation and Sacrifice

## Abstract
Investigate is a keyword action meaning "create a Clue token." A Clue token is a colorless artifact token with the activated ability "{2}, Sacrifice this token: Draw a card." Clue tokens can be cracked at any time (instant speed, as long as you have priority), and because they are artifacts, they interact with artifact synergies including Improvise (P057). Multiple investigators in play can stack Clue tokens for significant card advantage. Investigate itself is not a triggered ability — it's an action instructed by another ability.

## The Definitive Rule

**CR 701.16a** (verbatim): *"'Investigate' means 'Create a Clue token.' See rule 111.10f."*

**CR 111.10f** (verbatim): *"A Clue token is a colorless Clue artifact token with '{2}, Sacrifice this token: Draw a card.'"*

## The Pattern

```
INVESTIGATE:
  When instructed to "investigate": create a Clue token
  The Clue token: colorless, artifact type, token, Clue subtype
  Clue token's ability: {2}, Sacrifice this token: Draw a card

CRACKING A CLUE:
  {2}, Sacrifice this token: Draw a card
  This is an ACTIVATED ABILITY of the token
  → Can be activated any time you have priority
  → Instant speed (no sorcery restriction)
  → Costs {2} + sacrifice (not free)
  → The draw happens when the ability resolves

CLUE AS ARTIFACT:
  Clue is an artifact token → all artifact synergies apply:
    Improvise: tap Clue instead of paying {1} for improvise costs
    Affinity for artifacts: reduces spell cost
    "Whenever an artifact enters": Clue token entering can trigger
    "Whenever you sacrifice an artifact": cracking Clue triggers this
    Tinker/Academy Ruins: artifact interactions
  Clue is not a creature → no summoning sickness, no creature synergies

MULTIPLE CLUES:
  Multiple Clue tokens each need {2} to crack
  Storing clues for later turns is resource management
  Cannot crack all Clues in one action — each activation is separate
    (Each requires {2} priority action; can crack multiple in one priority window
    by activating multiple times)

INVESTIGATE IS NOT A TRIGGERED ABILITY:
  "When [event], investigate" — the "investigate" is the ACTION, not the trigger
  The trigger is the outer ability; investigate is what it does
  "Whenever you investigate" on other cards triggers when the Clue token is created
  → These triggers fire after the Clue token is created, not as a separate event

CLUE TOKEN DEPARTING:
  If Clue is destroyed (not sacrificed): no draw (the draw is from the sacrifice ability)
  If Clue is exiled: no draw
  Only sacrificing the Clue via its ability triggers the draw
  Can also use other "sacrifice a token" effects to sacrifice the Clue
    → But those don't draw (they just sacrifice it)
```

## Definitive Conclusions

- **Investigate creates a colorless Clue artifact token.** The token has an activated ability costing {2} plus sacrifice.
- **Cracking a Clue is instant speed.** Any time you have priority.
- **Clue tokens are artifacts.** They interact with Improvise, Affinity, and other artifact synergies.
- **Destroying a Clue doesn't draw a card.** Only the sacrifice-activated ability draws.
- **"Whenever you investigate" triggers fire** when the Clue token is created, not when it's sacrificed.

## Canonical Example
**Clue tokens in Investigation theme:**
You have 3 Clue tokens from various investigation effects. During opponent's end step, you activate two Clues: {2}, sacrifice one — draw a card. {2}, sacrifice another — draw a card. Spend {4} total, draw 2 cards. On your turn, crack the third for another draw. Each activation is independent.

**Example 2 — Clue + Improvise:**
You have 2 Clue tokens and want to cast a spell with improvise costing {4}. Tap both Clue tokens for Improvise (each replaces {1}). Pay {2} mana. Total: {2} mana + 2 tapped artifacts. You still have the Clue tokens (tapping them doesn't sacrifice them — improvise only taps).

## Commonly Confused With
- **P057 (Delve/Improvise)** — Clue tokens are artifacts and can be tapped for Improvise, reducing generic mana costs.
- **P053 (Populate)** — Clue tokens are artifact tokens but NOT creature tokens. Populate cannot copy a Clue token.
