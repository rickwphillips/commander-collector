---
id: p437
name: Embalm, Eternalize, and Aftermath — Graveyard Token Creation and GY-Only Casting
category: zones
cr_refs: [702.128a, 702.128b, 702.129a, 702.127a, 709.4, 709.3b, 202.3a, 704.5j, 707.2]
tags: [embalm, eternalize, aftermath, split-card, GY-cast, token-copy, no-mana-cost, MV-zero, zombie-token, legend-rule, Grafdigger-Cage, cascade-split-card, embalm-legendaray, Champion-of-Wits, Earthshaker-Khenra, Honored-Hydra, Dusk-Dawn, Cut-Ribbons, Amonkhet, Hour-of-Devastation]
created: 2026-03-29
examples_count: 2
---

# P437 — Embalm, Eternalize, and Aftermath — Graveyard Token Creation and GY-Only Casting

## Abstract
Three Amonkhet-block mechanics that exploit the graveyard. **Embalm** (702.128) is a GY-only activated ability that exiles the card and creates a modified copy token: same printed characteristics but white, no mana cost, and +Zombie subtype. **Eternalize** (702.129) is similar but the token is always 4/4, black, no mana cost, and +Zombie. **Aftermath** (702.127) is a split-card mechanic where the second half can ONLY be cast from the graveyard and exiles on resolution (like flashback). Key non-obvious interactions: (1) **embalm/eternalize tokens have MV 0** — no mana cost means mana value = 0 (CR 202.3a), which matters for emerge cost reduction (sacrificing an eternalize token reduces emerge cost by 0), "MV X or less" targeting, and other cost-based filters; (2) **Grafdigger's Cage does NOT stop embalm or eternalize** — the card is exiled (not entering the battlefield) and a token is CREATED (tokens enter from the game state, not from a zone); (3) **Aftermath's non-aftermath half can be cast from hand; if it resolves and goes to GY, the aftermath half is then available** — but if the non-aftermath half is exiled on the way to the GY (Dissipate), the aftermath half can never be cast; (4) **cascading into a split card with aftermath finds the card by COMBINED MV** — but you can only cast the non-aftermath half (aftermath half "can't be cast from any zone other than a graveyard").

## The Definitive Rules

**CR 702.128a** (verbatim): *"Embalm is an activated ability that functions while the card with embalm is in a graveyard. 'Embalm [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of this card, except it's white, it has no mana cost, and it's a Zombie in addition to its other types. Activate only as a sorcery.'"*

**CR 702.129a** (verbatim): *"Eternalize is an activated ability that functions while the card with eternalize is in a graveyard. 'Eternalize [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of it, except it's black, it's 4/4, it has no mana cost, and it's a Zombie in addition to its other types. Activate only as a sorcery.'"*

**CR 702.127a** (verbatim): *"Aftermath is an ability found on some split cards (see rule 709, 'Split Cards'). It represents three static abilities. 'Aftermath' means 'You may cast this half of this split card from your graveyard,' 'This half of this split card can't be cast from any zone other than a graveyard,' and 'If this spell was cast from a graveyard, exile it instead of putting it anywhere else any time it would leave the stack.'"*

**CR 709.4** (verbatim): *"In every zone except the stack, the characteristics of a split card are those of its two halves combined."*

**CR 202.3a** (verbatim): *"The mana value of an object with no mana cost is 0, unless that object is the back face of a nonmodal double-faced permanent..."*

## The Pattern

```
EMBALM (702.128a):
  ACTIVATION: GY-only activated ability. "[Cost], Exile this card from your GY:
    Create a token that's a copy of this card, except:
      - It's white (replaces other colors)
      - It has no mana cost
      - It's a Zombie in addition to its other types."
  Activate only as a sorcery (your main phase, stack empty).

  THE TOKEN IS A COPY:
    Copies the printed characteristics of the card: name, P/T, types, abilities.
    Honored Hydra ({4}{G}{G}: 6/6 trample; embalm {3}{G}):
      Embalm token: 6/6 (same P/T), trample (same ability), white, no mana cost, Zombie Snake Hydra.
    The token copies ETB abilities: Champion of Wits ({2}{U}: 2/1; "when it enters,
      draw cards equal to power; if you do, discard 2"; eternalize {5}{U}{U}):
      Eternalized token: 4/4 black Zombie Snake Wizard, no mana cost. Has the ETB draw/discard.
      When the eternalize token enters: trigger fires (draw 4, discard 2).

  MV OF THE TOKEN:
    CR 202.3a: "no mana cost → MV 0."
    The embalm/eternalize token has MV 0. Not the original card's MV.
    This matters for:
      Emerge cost reduction: sacrificing an eternalized 4/4 token reduces emerge cost by 0
        (MV 0), paying full emerge cost. The token's P/T doesn't affect cost reduction.
      "Target creature with MV 3 or less": an eternalized Champion of Wits (4/4, MV 0)
        CAN be targeted (MV 0 ≤ 3 even though it's a 4/4).
      "Counter target spell with MV 3 or less": not directly relevant (tokens aren't spells).

  GRAFDIGGER'S CAGE + EMBALM/ETERNALIZE:
    Cage (artifact): "Creature cards in graveyards and libraries can't enter the battlefield."
                     "Players can't cast spells from graveyards or libraries."
    First clause: "creature CARDS in graveyards can't enter." The embalm/eternalize card is EXILED —
      it never tries to enter the battlefield. A TOKEN is created (tokens are not cards;
      they enter by being "created" from game state, not from a zone).
    Second clause: "players can't cast SPELLS from graveyards." Embalm/eternalize is an
      ACTIVATED ABILITY (not a spell being cast from the GY). Cage doesn't stop activated abilities.
    RESULT: Grafdigger's Cage does NOT stop embalm or eternalize.
    Compare: Cage DOES stop retrace (casting a spell from the GY) and escape (ditto).

  LEGENDARY EMBALM/ETERNALIZE:
    If the original card is legendary: the token is also legendary (copies name).
    Can you create two identical legendary embalm tokens? Only if you have two COPIES of the
      same legendary card in the GY. (Each embalm activation exiles the card used.)
    Two tokens of the same legendary name: SBA 704.5j applies → same controller must
      choose one to be put into the GY; both can exist briefly in response to triggers.
    In practice: if you embalm Champion of Wits once, that card is exiled. You can't embalm
      a second one unless you have a second copy of Champion of Wits in the GY.

  ETERNALIZE vs. EMBALM:
    Embalm: same P/T as printed; changes color to white; adds Zombie.
    Eternalize: always 4/4; changes color to black; adds Zombie.
    Honored Hydra (6/6): embalm gives a 6/6 white Zombie Snake Hydra with trample.
    Champion of Wits (2/1): eternalize gives a 4/4 black Zombie Snake Wizard (upgraded).
    Earthshaker Khenra (2/1): eternalize gives a 4/4 black Zombie Jackal Warrior (major upgrade).
      ETB "target creature with power less than or equal to this creature's power can't block" = ≤ 4, not ≤ 2.

AFTERMATH (702.127a):
  SPLIT CARD STRUCTURE:
    Aftermath cards are split cards (709). One half is a "normal" spell. The second half
      has Aftermath. The second half can ONLY be cast from the graveyard (not from hand,
      not from exile).

  IN THE GY (before either half is cast):
    709.4: "In every zone except the stack, split card's characteristics are its two halves combined."
    In the GY: both halves' names, types, costs, and abilities apply to the single card.
    Dusk // Dawn in the GY has:
      MV = {2}{W}{W} + {3}{W}{W} = {10} combined (for cascade threshold: 10; for cost: 4+5=9 in white).
      Wait: 709.4b: mana value is from combined mana cost. Dusk ({2}{W}{W}: MV 4) + Dawn ({3}{W}{W}: MV 5).
      Combined mana cost: all symbols from both halves together. Total pip count: {2}{W}{W}{3}{W}{W} = 10.

  CASTING THE NON-AFTERMATH HALF (first half):
    Cast Dusk from hand normally: only Dusk's characteristics exist while on stack.
    Dusk resolves → "destroy all creatures with power 3 or greater."
    Dusk goes to GY (standard spell resolution → owner's GY).
    NOW: Dawn (the aftermath half) is available to cast FROM the GY.

  CASTING THE AFTERMATH HALF (Dawn):
    Cast Dawn from GY: {3}{W}{W} alternative cost (the aftermath half's mana cost).
    While on stack: only Dawn's characteristics exist (709.3b). Dawn is a sorcery.
    If Dawn resolves: "Return all creature cards with power 2 or less from your GY to hand."
    EXILE ON RESOLUTION: "If this spell was cast from a graveyard, exile it instead."
      The entire split card is exiled (Dawn used up the card; both halves gone).

  IF THE FIRST HALF IS EXILED INSTEAD OF GY:
    Example: Opponent uses Dissipate ({1}{U}{U}: counter target spell, then exile it).
    Dusk is countered and EXILED (not sent to GY).
    The split card (Dusk // Dawn) is now in exile. Aftermath only works FROM THE GRAVEYARD.
    Dawn can NEVER be cast. The card is in exile.
    Important: if you want to set up the aftermath half, the first half must resolve AND the
      card must reach the GY. Effects that exile countered spells (Dissipate, Drown in the Loch)
      prevent aftermath from ever becoming accessible.
    If the first half is NOT cast (card went to GY via discard, mill, etc.): only the
      aftermath half is accessible (from GY). You never cast the first half; you're
      going straight to the aftermath half.

  CASCADE INTO AN AFTERMATH SPLIT CARD:
    In library: split card's MV = combined MV of both halves (709.4b).
    Bloodbraid Elf cascades and finds Cut // Ribbons:
      Cut ({1}{R}: sorcery; "Cut deals 4 damage to target creature")
      Ribbons (aftermath; {X}{B}{B}: "each opponent loses X life")
      Combined MV in library = {1}{R}{X}{B}{B} where X=0 = 1+1+0+2 = 4... wait: X=0 in library
      (split card MV in library: both halves' costs combined; X=0 per CR 202.3e).
      Bloodbraid Elf has MV 4. Cascade threshold: MV < 4. Cut // Ribbons in library = MV 4
        (wait: 1R = 2 for Cut + X=0,BB = 2 for Ribbons with X=0 = total 4).
      Actually this would be below 4 if cascade threshold is strictly less than.
      Threshold is "mana value less than this spell's mana value" = less than 4.
      Combined MV = 4, which is NOT less than 4. Cut // Ribbons would NOT be found.
      If cascade found Cut // Ribbons: can you cast Ribbons (the aftermath half)? NO.
        Ribbons "can't be cast from any zone other than a graveyard." The card is in library/
        exile at cascade resolution. You must cast Cut (the non-aftermath half) instead.
```

## Definitive Conclusions

- **Embalm/eternalize tokens have MV 0** — no mana cost means MV 0 (CR 202.3a); sacrificing an eternalize token for emerge reduces cost by 0; "target creature with MV ≤ 3" CAN target a 4/4 eternalize token.
- **Grafdigger's Cage does NOT stop embalm or eternalize** — the card is exiled (doesn't enter battlefield), and a token is created (tokens aren't "creature cards entering from graveyards"); activated abilities, not spell casts, so the second clause also doesn't apply.
- **Eternalize tokens copy all printed abilities including ETBs** — Champion of Wits' eternalize token enters as a 4/4 and immediately draws 4 cards (the ETB trigger copies with the token).
- **Eternalize overrides original P/T to 4/4; embalm preserves original P/T** — a 6/6 embalms into a 6/6; a 2/1 externalizes into a 4/4.
- **Aftermath half can only be cast from the GY** — if the non-aftermath half is countered-and-exiled (Dissipate), the aftermath half can never be used; the card must reach the GY for aftermath to function.
- **Cascade finds split cards by COMBINED MV** — but the aftermath half can't be cast from library (only from GY); if cascade reveals a split card with aftermath, you must cast the non-aftermath half or put the card back.

## Canonical Example
**Champion of Wits eternalize + Grafdigger's Cage:**
You have Champion of Wits ({2}{U}: 2/1; "when it enters, draw cards equal to power; discard 2"; eternalize {5}{U}{U}) in your graveyard.

Your opponent controls Grafdigger's Cage.

You want to eternalize Champion of Wits. Can you? YES — Cage's two restrictions are:
1. "Creature cards in GY/library can't enter the battlefield" — The Champion card is exiled from the GY. The token CREATED never comes from the GY; tokens are created directly onto the battlefield.
2. "Players can't cast spells from GY" — Eternalize is an activated ability, not casting a spell.

You activate eternalize. Pay {5}{U}{U}, exile the Champion of Wits card.
Token enters: 4/4 black Zombie Snake Wizard with no mana cost.
ETB triggers: "When this creature enters, you may draw cards equal to its power." Power = 4.
Draw 4 cards, discard 2.

MV of the token = 0 (no mana cost). If you sacrifice the token to emerge Elder Deep-Fiend ({8}: 5/6; flash; emerge {5}{U}{U}): reduce emerge cost by token's MV = 0. Pay full {5}{U}{U}.
Compare: sacrificing the original 2/1 Champion (MV 3): reduce emerge cost by 3. Pay {2}{U}{U}.

**Example 2 — Dusk // Dawn aftermath interaction:**
Your library contains Dusk // Dawn. You cast Dusk from hand: "destroy all creatures with power 3 or greater."

Opponent responds with Hinder ({1}{U}{U}: "counter target spell; put it on top of owner's library").
Dusk is countered and returned to your library (not GY). Dawn is still inaccessible.

Alternatively: Dusk resolves. It goes to your GY. Now Dawn is in the GY as part of the same split card.
You cast Dawn ({3}{W}{W} from GY): "return all creature cards with power 2 or less from your GY to hand."
Dawn resolves. The split card (Dusk // Dawn) is exiled. Gone permanently.
You got the full Dusk // Dawn effect across two turns: destroy big creatures + rebuild small ones.

## Commonly Confused With
- **P415 (Dredge)** — Dredge and aftermath both involve GY mechanics, but dredge returns the card to hand (replacing a draw); aftermath casts from the GY and exiles on resolution. Neither creates tokens.
- **P430 (Rebound)** — Rebound exiles a spell at resolution and re-casts from exile; aftermath exiles the split card after the GY-cast half resolves. Both permanently remove the card, but rebound re-uses once; aftermath uses once from GY.
- **P423 (Retrace)** — Retrace (discard a land to re-cast from GY) vs. aftermath (second half only from GY, exiles). Retrace is stopped by Grafdigger's Cage (it's casting from GY); aftermath is too (split card cast from GY). Embalm/eternalize are NOT stopped (activated ability, not casting).
- **P424 (Cascade)** — Cascade interacts with split cards via combined MV (P424 covers this). P437 specifically covers why the aftermath half can't be cast when cascade reveals a split card from library — aftermath requires GY zone.
