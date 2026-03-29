---
id: p434
name: Emerge, Surge, Awaken, Devoid, and Myriad — Battle for Zendikar/Eldritch Moon Mechanics
category: costs
cr_refs: [702.119a, 702.119b, 702.119c, 702.117a, 702.113a, 702.113b, 702.114a, 702.116a, 702.116b]
tags: [emerge, surge, awaken, devoid, myriad, sacrifice-cost-reduction, team-cast-condition, land-animation, colorless-CDA, token-copy-multiplayer, Eldrazi, Elder-Deep-Fiend, Decimator-of-the-Provinces, Crush-of-Tentacles, Exquisite-Firecraft, Dimensional-Infiltrator, myriad-token-exile-end-of-combat, myriad-combat-damage-triggers, emerge-sacrifice-timing, surge-teammate, awaken-land-becomes-creature, BFZ, SOI, EMN]
created: 2026-03-29
examples_count: 2
---

# P434 — Emerge, Surge, Awaken, Devoid, and Myriad — Battle for Zendikar/Eldritch Moon Mechanics

## Abstract
Five mechanics from the Battle for Zendikar/Shadows over Innistrad/Eldritch Moon era. **Emerge** (702.119) lets you sacrifice a creature to reduce an Eldrazi's cost by that creature's mana value. **Surge** (702.117) is an alternative cost available if you or a teammate cast another spell this turn. **Awaken** (702.113) is an alternative cost that also animates a land you control. **Devoid** (702.114) is a CDA making the object colorless. **Myriad** (702.116) creates token copies of an attacking creature that also attack each other opponent. Key non-obvious interactions: (1) **emerge's cost reduction happens before paying** — you sacrifice the creature as part of paying the cost, then the generic cost is reduced by that creature's MV; (2) **surge and extort interact** — casting a spell to enable surge also triggers extort; (3) **awaken animates the land but it remains a land** — it has land card type AND creature card type; affected by both creature and land removal; (4) **devoid interacts with color-checking effects** — devoid permanents don't count for "blue permanent" effects; and (5) **myriad tokens exiled at end of combat** — they never survive to the end step; combat damage triggers from myriad tokens still fire normally before exile.

## The Definitive Rules

**CR 702.119a** (verbatim): *"Emerge represents two static abilities that function while the spell with emerge is on the stack. 'Emerge [cost]' means 'You may cast this spell by paying [cost] and sacrificing a creature rather than paying its mana cost' and 'If you chose to pay this spell's emerge cost, its total cost is reduced by an amount of generic mana equal to the sacrificed creature's mana value.'"*

**CR 702.119c** (verbatim): *"You choose which permanent to sacrifice as you choose to pay a spell's emerge cost (see rule 601.2b), and you sacrifice that permanent as you pay the total cost (see rule 601.2h)."*

**CR 702.117a** (verbatim): *"Surge is a static ability that functions while the spell with surge is on the stack. 'Surge [cost]' means 'You may pay [cost] rather than pay this spell's mana cost as you cast this spell if you or one of your teammates has cast another spell this turn.'"*

**CR 702.113a** (verbatim): *"Awaken appears on some instants and sorceries. It represents two abilities: a static ability that functions while the spell with awaken is on the stack and a spell ability. 'Awaken N—[cost]' means 'You may pay [cost] rather than pay this spell's mana cost as you cast this spell' and 'If this spell's awaken cost was paid, put N +1/+1 counters on target land you control. That land becomes a 0/0 Elemental creature with haste. It's still a land.'"*

**CR 702.114a** (verbatim): *"Devoid is a characteristic-defining ability. 'Devoid' means 'This object is colorless.' This ability functions everywhere, even outside the game. See rule 604.3."*

**CR 702.116a** (verbatim): *"Myriad is a triggered ability that may also create a delayed triggered ability. 'Myriad' means 'Whenever this creature attacks, for each opponent other than defending player, you may create a token that's a copy of this creature that's tapped and attacking that player or a planeswalker they control. If one or more tokens are created this way, exile the tokens at end of combat.'"*

## The Pattern

```
EMERGE (702.119a, 702.119c):
  ALTERNATIVE COST + COST REDUCTION:
    Pay emerge cost + sacrifice a creature INSTEAD of paying mana cost.
    The generic mana portion of the emerge cost is reduced by the sacrificed creature's MV.
    Example: Elder Deep-Fiend ({8}: 5/6; flash; emerge {5}{U}):
      Emerge cost: {5}{U} (6 total). Sacrifice a creature with MV 4.
      Reduced: {5}{U} - {4} generic = {1}{U}. Pay {1}{U} total.
      The sacrificed creature's MV reduces the GENERIC portion (colored mana isn't reduced).
    Elder Deep-Fiend with emerge by sacrificing a MV 5 creature: {5}{U} - {5} = {0}{U} = {U}.
    Pay only {U}! Enormous value.

  TIMING OF SACRIFICE (702.119c):
    "You choose which permanent to sacrifice as you choose to pay the emerge cost (601.2b)"
    "You sacrifice that permanent as you pay the total cost (601.2h)"
    The sacrifice happens when you PAY (step 601.2h) — not before you cast, not at resolution.
    Between announcing emerge and paying: the chosen creature is "selected" but not yet sacrificed.
    Opponent can't remove the creature between these steps to prevent emerge (sacrifice happens
    at payment, which is during casting — no priority window for opponents between steps of casting).
    The sacrifice is PART OF PAYING the cost, not a separate effect.

  EMERGE ETB:
    When the emerge permanent enters: ETBs fire normally.
    Elder Deep-Fiend's flash lets you cast emerge at instant speed (flash + emerge = respond to
    opponent's spell by emerging and tapping down opponent's creatures via ETB).

  EMERGE AND PERSIST:
    If you sacrifice a persist creature (no -1/-1 counter) for emerge:
    The persist creature goes to GY. Persist triggers. Returns with -1/-1 counter.
    The emerge creature entered (with ETBs). You sacrificed the persist creature (gained MV reduction).
    Persist creature returns to battlefield with -1/-1 counter.
    Net: emerge creature enters + persist creature returns. You "kept" both.
    Compare: emerge cost reduction from MV 3 persist creature. Pay reduced emerge cost, then
      persist creature returns. You paid the emerge cost reduction AND got the creature back.
    This is similar to devour + persist from P429.

SURGE (702.117a):
  "You may pay [surge cost] rather than pay this spell's mana cost if you or one of your
   teammates has cast another spell this turn."

  CONDITION: "has cast another spell this turn."
    ANY spell cast by you or a teammate satisfies surge (in team formats with teammates).
    In 1v1: just "another spell" you cast this turn.
    The surge spell is NOT the "other spell" — you need an additional spell cast before the surge.
    Multiple surges: once the condition is met, all your surge spells can use surge cost.

  SURGE + CANTRIPS:
    Cast a Gitaxian Probe (cantrip): condition met. Now cast any surge spell for its surge cost.
    The cantrip effectively "turns on" surge for cheap.

  SURGE IN TEAM FORMATS:
    "You or one of your teammates has cast another spell": in Two-Headed Giant or Emperor:
    If your teammate casts a spell: surge condition met for you. You can cast your surge spells
      for their surge cost even if you haven't cast anything yet.

AWAKEN (702.113a):
  ALTERNATIVE COST + ANIMATE A LAND:
    Pay awaken cost instead of mana cost.
    If awaken cost was paid: put N +1/+1 counters on target land you control AND
      that land "becomes a 0/0 Elemental creature with haste. It's still a land."

  THE LAND IS STILL A LAND:
    702.113a explicitly: "It's still a land."
    The animated land has BOTH the Land card type AND the Creature card type.
    It can tap for mana (still a land) AND attack/block (now also a creature).
    Land destruction removes it. Creature removal removes it. Both types of removal apply.
    Non-basic land types still apply: an awakened Forest is still a Forest (adds {G}).

  AWAKEN COUNTERS AND TOUGHNESS:
    The land becomes 0/0 + N +1/+1 counters = effectively N/N creature.
    If the +1/+1 counters are removed (proliferate adding -1/-1, Hex Parasite removing, etc.):
      the land's toughness drops. If toughness reaches 0: SBA 704.5f. The land is a creature
      with toughness ≤ 0 and goes to the GY. Awakened land can die from counter removal.
    Awakened land with haste: can attack the turn it's animated. Relevant for surprise awaken.

  AWAKEN MULTIPLE TIMES:
    A land can be animated by multiple awaken effects. Each adds more counters.
    Awakened land from one Scatter to the Winds: 3/3. Awaken again with another spell: +N/+N more.
    The "becomes a 0/0 Elemental creature with haste" effect: each application sets it to 0/0 base
    and adds the new N counters. But the previous counters remain (they're separate objects on it).
    Wait: "becomes a 0/0 Elemental creature with haste" — each awaken effect sets P/T to 0/0
    (layer 7b) and adds the counters (layer 7c). Multiple awaken effects stack the counters.
    The land is an Elemental creature (from the type-setting effect) with multiple sets of counters.

DEVOID (702.114a):
  CDA: "This object is colorless." Works everywhere (like Changeling).

  COLORLESS VS. NO COLOR:
    Devoid objects are explicitly colorless — they have no color.
    Effects that check for colored permanents: devoid permanents don't qualify.
    "Destroy target blue permanent": a devoid Eldrazi is not blue. Not destroyed.
    "Counter target colored spell": a devoid spell is colorless. Can't be countered by this.
    Effects that care about generic/colorless mana: devoid doesn't change mana costs.
    Devoid changes COLOR (characteristic), not MANA COST.

  DEVOID AND PROTECTION:
    "Protection from colorless": prevents damage from colorless sources.
    Devoid creatures deal colorless damage (they're colorless sources).
    A creature with "protection from colorless" prevents damage from devoid creatures.
    "Protection from everything": prevents all damage, targeting, blocking, enchanting.

  DEVOID AND INTERACT WITH COLORED EFFECTS:
    "Counter target spell that isn't colorless": a devoid spell is colorless. Can't be countered.
    "Proliferate": proliferate cares about counters, not colors. Works on devoid permanents.
    Color-based protection: devoid creatures don't have colors. Immunity to color-based protection
      effects that apply based on the SOURCE's color.

MYRIAD (702.116a):
  "Whenever this creature attacks, for each opponent other than defending player, you may create
   a token that's a copy of this creature that's tapped and attacking that player (or a
   planeswalker they control). If one or more tokens are created this way, exile the tokens
   at end of combat."

  ONLY RELEVANT IN MULTIPLAYER (3+ players):
    "For each opponent OTHER THAN defending player": in 1v1, there's only one opponent (the
      defending player). No "other opponents." Myriad does nothing in 1v1.
    In 3 players: attacking Player A. Myriad creates a copy attacking Player B.
      Token is tapped, attacking Player B.
    In 4 players: attacking Player A. Myriad creates tokens attacking Players B and C.

  TOKENS ARE COPIES:
    The token is a copy of the attacking creature. It has all the same characteristics.
    If the original has triggered abilities, ETBs, or other effects: the copy has them too.
    Wait: the token ENTERS THE BATTLEFIELD (tapped, attacking). ETBs fire? Yes if the token
      enters the battlefield. "Create a token that's a copy of this creature that's tapped
      and attacking" — this is the creation event. ETBs fire for the token.
    If the original creature has a significant ETB, myriad creates copies that also fire those ETBs
      against each other opponent.

  MYRIAD AND COMBAT DAMAGE:
    The myriad tokens deal combat damage to their assigned defenders/players.
    All combat damage triggers fire normally (lifelink, deathtouch, infect, cipher, etc.).
    The tokens are exiled AT END OF COMBAT — not during combat. All combat damage happens normally.
    "End of combat" trigger: all myriad tokens are exiled. The originals remain.

  MYRIAD TOKENS AND TRIGGERED ABILITIES:
    Tokens with cipher (encoded card on the original): the copy has the same encoded creature?
      Actually: cipher is encoded on a SPECIFIC creature object (P432). The copy is a new object.
      The cipher card was encoded on the original. The token is a different object.
      The token doesn't have the cipher encoding (it's a new token, not the original object).
    Tokens with other triggers (e.g., "when this creature deals combat damage to a player, draw"):
      The token HAS this triggered ability (it's a copy). When the token deals combat damage:
      the trigger fires. Draw a card.

  MYRIAD AND LEGENDARY PERMANENTS:
    If the original attacker is legendary: creating legendary tokens via myriad would normally
      cause SBAs to apply (two legendary permanents with the same name → one goes to GY).
      But wait: you choose which to keep. Do you sacrifice the tokens or the original?
      In most cases, you'd keep the original (tokens are exiled at end of combat anyway).
      The SBA fires for legendary rule: you put one on GY. Put the token in GY. The original stays.
      Actually, the tokens are put on the battlefield simultaneously (tapped, attacking). Immediately
      after they enter: SBA checks. Multiple legendary permanents with the same name.
      For EACH duplicate: choose one to keep, put the rest in GY. Keep the original, put each
      token in GY. But the tokens were attacking! They attacked, then immediately went to GY via SBA.
      Combat damage: do the tokens deal damage before the SBA can remove them?
      SBAs check before combat damage (actually: SBAs check whenever a player would receive priority.
      Myriad tokens enter at the start of declare attackers step. SBAs are checked next.
      The tokens might be removed by SBA before combat damage).
      PRACTICAL: for legendary creatures with myriad, the legendary tokens are immediately removed
      by SBA. Myriad doesn't really work for legendary attackers (the tokens die before damage).
      But: COMMANDER's singleton rule and legendary rule work similarly — this is a real concern
      in Commander with myriad on legendary commanders.
```

## Definitive Conclusions

- **Emerge's sacrifice happens as you pay the cost** — no priority window for opponents between choosing emerge and sacrificing; persist creatures sacrificed to emerge return to battlefield after the emerge permanent enters.
- **Surge requires a PREVIOUS spell that turn** — the surge spell itself doesn't satisfy the "another spell was cast" condition; cast a cantrip first, then cast surge spells.
- **Awaken animates a land while it remains a land** — the animated land has both Land and Creature card types; it can be hit by creature removal AND land destruction; counter removal can kill an awakened land via toughness ≤ 0 SBA.
- **Devoid permanents are colorless** — they don't satisfy color-based conditions ("blue permanent," "colored spell"); protection from colorless applies to them; they're immune to color-based protection.
- **Myriad only works in multiplayer (3+ players)** — "for each opponent other than defending player" requires at least two opponents; in 1v1 there are no "other opponents."
- **Myriad tokens are exiled at end of combat, not before damage** — all combat damage and triggers fire normally; legendary myriad tokens are removed by SBA immediately on entry before combat damage is dealt.

## Canonical Example
**Elder Deep-Fiend emerge flash timing:**
Opponent casts a 4-mana spell (Collected Company, etc.).
You have Elder Deep-Fiend ({8}: 5/6; flash; emerge {5}{U}; "when Elder Deep-Fiend enters, tap up to 4 target permanents") in hand and a creature with MV 4 on battlefield.
Emerge {5}{U} minus sacrificed creature's MV {4} = {1}{U}. You pay {1}{U} total.
Sacrifice the creature as part of paying the emerge cost (601.2h: sacrifice at cost payment step).
Elder Deep-Fiend enters (flash speed — instant timing). ETB: tap up to 4 permanents.
Tap opponent's 4 lands (or key creatures + lands). Opponent's Collected Company resolves but
  with lands tapped, they may not be able to do much on their turn.

Persist interaction: you sacrifice Kitchen Finks (MV 3) for emerge. Cost: {5}{U} - {3} = {2}{U}.
Kitchen Finks goes to GY. Persist triggers. Elder Deep-Fiend enters with ETB (tap 4 permanents).
Kitchen Finks returns with -1/-1 counter. You now have Elder Deep-Fiend + Kitchen Finks.

**Example 2 — Myriad in Commander:**
Hammers of Bogardan ({2}{R}: 3/2; myriad; "whenever it deals combat damage to a player, it deals 3 damage to another target"). You attack Player A.
Myriad: create token copies of Hammers attacking Players B and C.
Token 1 (3/2) attacks Player B. Token 2 (3/2) attacks Player C.
Combat damage: Hammers deals 3 to Player A; triggers fire for Hammers AND for each token.
Hammers trigger: deal 3 to any target. Token 1 trigger: deal 3 to any target. Token 2 trigger: deal 3 to any target.
3 targets: players D, D, D (or other targets). 9 total damage from triggers.
Plus 9 combat damage across 3 players. Total: 18 damage from one creature's attack.
End of combat: tokens exiled. Hammers stays.

Legendary version warning: if the creature were legendary, myriad tokens would be immediately
removed by SBA (legendary rule) before combat damage could be dealt. No damage from tokens.

## Commonly Confused With
- **P419 (Persist/Undying)** — Emerge and persist interact: sacrificing persist creatures for emerge gives both the cost reduction AND returns the persist creature. P434 covers the emerge mechanic; P426 covers how champion (a similar "exile your creature" effect) interacts with persist.
- **P424 (Cascade)** — Surge and cascade are both alternative costs that have conditions. Cascade requires the spell to be found via exiling from library; surge requires a previous spell cast. Both replace the mana cost; additional costs can still be paid.
- **P425 (Changeling Card Types)** — Devoid is a CDA that makes the object colorless (like Changeling makes it every creature type). Both are CDAs that function in all zones. Devoid changes color; Changeling changes creature subtypes. Both use CR 604.3.
- **P409 (Copy Effects)** — Myriad creates token copies. The tokens are copies and have all characteristics of the original. ETBs fire for the token entering. Cipher encoding is NOT copied (it's on the original permanent object). See the cipher interaction in P432.
