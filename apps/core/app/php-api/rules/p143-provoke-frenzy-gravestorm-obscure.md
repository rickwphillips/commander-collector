---
id: p143
name: Provoke, Frenzy, and Gravestorm — Niche Combat and Graveyard Keywords
category: combat
cr_refs: [702.39a, 702.39b, 702.68a, 702.68b, 702.69a, 702.69b]
tags: [provoke, frenzy, gravestorm, attack, force-block, unblocked, copy, permanents-died, onslaught]
created: 2026-03-28
examples_count: 3
---

# P143 — Provoke, Frenzy, and Gravestorm — Niche Combat and Graveyard Keywords

## Abstract
Three niche mechanics from different sets. **Provoke** (Onslaught) forces a defending creature to block the provoker and untaps it. **Frenzy N** gives +N/+0 when it attacks unblocked. **Gravestorm** is like storm but counts permanents that went to the graveyard from the battlefield this turn instead of spells cast. Each has specific timing and interaction rules.

## The Definitive Rules

**CR 702.39a** (verbatim): *"'Provoke' means 'Whenever this creature attacks, you may choose to have target creature defending player controls block this creature this combat if able. If you do, untap that creature.'"*

**CR 702.68a** (verbatim): *"'Frenzy N' means 'Whenever this creature attacks and isn't blocked, it gets +N/+0 until end of turn.'"*

**CR 702.69a** (verbatim): *"'Gravestorm' means 'When you cast this spell, copy it for each permanent that was put into a graveyard from the battlefield this turn. If the spell has any targets, you may choose new targets for any of the copies.'"*

## The Pattern

```
PROVOKE:
  Triggered attack ability: "when this creature attacks, you may force a defending creature to block it"
  Effect:
    1. Optional: choose a creature defending player controls
    2. That creature MUST block the provoker this combat if able
    3. The chosen creature is UNTAPPED (so it CAN block if previously tapped)

  PROVOKE + "IF ABLE":
    The chosen creature blocks the provoker "if able"
    If something prevents it from blocking (e.g., it gets summoning sickness via control change, gains "can't block"): it doesn't have to
    If it physically can block: it must

  PROVOKE + TAP:
    Provoke untaps the chosen creature to ensure it CAN block
    If the creature was tapped (attacked earlier): provoke untaps it → it can block → it must block
    Powerful use: provoke a creature that attacked → untap it → it blocks → it might die in combat

  PROVOKE + SUMMONING SICKNESS:
    A creature that just entered can't be provoked if it has summoning sickness?
    Actually summoning sickness is about attacking/using tap abilities, not blocking
    A summoning-sick creature CAN block
    → A summoning-sick creature CAN be chosen as provoke target and MUST block

FRENZY:
  Triggered attack ability: when this creature attacks AND is not blocked
  Effect: +N/+0 until end of turn

  FRENZY TIMING:
    Triggers when declared as attacker AND will not be blocked
    Actually: triggers at "end of combat" or "when blockers are declared"?
    Wait: CR 702.68a just says "whenever this creature attacks and isn't blocked"
    The "isn't blocked" check happens after blockers are declared
    Trigger fires after declare blockers if the creature has no blockers

  FRENZY + MENACE:
    Menace requires 2 blockers; if opponent can't provide 2, creature is unblocked
    Frenzy on a menace creature: often unblocked (opponent can't or won't provide 2) → frenzy pump applies

  FRENZY + MULTIPLE:
    Multiple instances trigger separately → each gives +N/+0

GRAVESTORM:
  Like storm (P036) but counts permanents that died this turn instead of spells cast
  Triggered: "when you cast this spell, copy it for each permanent that went to graveyard from battlefield this turn"
  Note: PERMANENTS that died, not spells. Land sacrifice, creatures dying, artifacts destroyed → all count

  GRAVESTORM COUNT:
    Count ALL permanents that went to graveyard from battlefield this turn for ANY reason
    Includes: opponent's permanents and your permanents
    Includes: sacrificed, destroyed, -X/-X'd, etc.
    Does NOT include tokens (tokens cease to exist when they leave the battlefield, don't go to graveyard)
    Wait: CR 704.5d says tokens in non-battlefield zones cease to exist
    Does a token "going to the graveyard" count? No — tokens that are put into the graveyard exist briefly before the SBA removes them. The "put into graveyard" event does happen...
    Actually: tokens CAN be put into graveyards and then the SBA removes them. So they DID "go to the graveyard from the battlefield" for gravestorm count purposes.
    (This is a complex ruling — generally, tokens may count for gravestorm)

  GRAVESTORM + RITUAL SPELLS:
    Mass sacrifice effects → many permanents die → large gravestorm count
    Sacrifice 5 permanents then cast gravestorm spell → 5 copies

GRAVESTORM CARD:
  Bitter Ordeal (Gravestorm): "Search target player's library for a card, exile it, then shuffle."
  Combo: sacrifice many permanents → gravestorm count = N → N copies of Bitter Ordeal → exile N cards from opponent's library
```

## Definitive Conclusions

- **Provoke forces a defending creature to block if able — and untaps it to enable blocking.**
- **Frenzy gives +N/+0 when the creature is unblocked** — reward for evasion or unchallenged attack.
- **Gravestorm counts permanents that died from the battlefield this turn** (not spells, not cards from other zones).
- **Tokens may count for gravestorm** (they go to graveyard briefly before the SBA removes them).

## Canonical Example P143a — Provoke:
**Gempalm Strider (Provoke):** Attacks. Provoke: choose opponent's 5/5 (which already attacked and is tapped). Provoke untaps the 5/5 and forces it to block. The 5/5 must now block the Gempalm Strider. If Gempalm Strider is small, it might die, but took out the opponent's 5/5.

**Example P143b — Frenzy:**
**Frenzy Sliver (Frenzy 1):** All Slivers get Frenzy 1 if unblocked.
A 2/2 Sliver attacks unblocked: frenzy trigger → becomes 3/2 → deals 3 unblocked damage.

**Example P143c — Gravestorm:**
**Bitter Ordeal (Gravestorm {2}{B}):** Before casting, you sacrifice 8 artifacts (e.g., via Krark-Clan Ironworks). 8 permanents died.
Cast Bitter Ordeal. Gravestorm: copy it 8 times. You cast the original + 8 copies = 9 total.
Each resolves: exile a card from target player's library. 9 specific cards exiled from opponent's library.

## Commonly Confused With
- **P036 (Storm)** — Storm counts spells; gravestorm counts permanents. Similar mechanic, different condition.
- **P110 (Menace)** — Menace creates situations where frenzy often applies (can't be blocked legally → unblocked → frenzy).
- **P001 (Threshold Damage Assignment)** — Provoke combined with combat creates complex multi-blocker situations.
