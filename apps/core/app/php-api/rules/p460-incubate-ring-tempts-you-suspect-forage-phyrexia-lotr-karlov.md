---
id: p460
name: Incubate, The Ring Tempts You, Suspect, and Forage — Phyrexia, LotR, and Karlov Manor Keyword Actions
category: triggered
cr_refs: [701.53, 701.54, 701.60, 701.61, 111.10i, 500.1, 704.5]
tags: incubate, ring-tempts-you, ring-bearer, suspect, forage, double-faced-token, designation, legendary, menace, cant-block, Phyrexia-All-Will-Be-One, Lord-of-the-Rings, Murders-Karlov-Manor
created: 2026-03-29
examples_count: 8
---

# P460 — Incubate, The Ring Tempts You, Suspect, and Forage — Phyrexia, LotR, and Karlov Manor Keyword Actions

## Abstract

Four recently introduced keyword actions (CR 701.53–701.61) generate non-obvious rules questions: **Incubate N** (Phyrexia: All Will Be One, CR 701.53) creates a double-faced Incubator token with N +1/+1 counters that can be transformed into a creature for {2}; **The Ring Tempts You** (Lord of the Rings, CR 701.54) creates an emblem and designates a Ring-bearer with progressively powerful effects as the Ring tempts more times; **Suspect** (Murders at Karlov Manor, CR 701.60) designates a creature as suspected, granting it menace and "can't block" as long as it's suspected; and **Forage** (Bloomburrow, CR 701.61) provides a flexible cost: exile three cards from your GY OR sacrifice a Food. All four are "designation" or "complex action" mechanics with specific rules about persistence and removal.

## The Definitive Rules

### Incubate (CR 701.53)
**CR 701.53a verbatim:** *"To incubate N, create an Incubator token that enters the battlefield with N +1/+1 counters on it."*

**CR 701.53b verbatim:** *"An Incubator token is a double-faced token. Its front face is a colorless Incubator artifact with '{2}: Transform this token.' Its back face is a 0/0 colorless Phyrexian artifact creature named 'Phyrexian Token.'"*

### The Ring Tempts You (CR 701.54)
**CR 701.54a–e** (see below — Ring-bearer designation, four progressive abilities)

**CR 701.54c**: The Ring emblem is created the first time the Ring tempts a player. The Ring's abilities unlock with each subsequent temptation (2, 3, 4 times).

**CR 701.54e**: "Is your Ring-bearer" checks for: on the battlefield under your control AND has the Ring-bearer designation.

### Suspect (CR 701.60)
**CR 701.60a**: A suspected creature gains menace and "this creature can't block."
**CR 701.60c verbatim:** *"A suspected permanent has menace and 'This creature can't block' for as long as it's suspected."*
**CR 701.60d verbatim:** *"A suspected permanent can't become suspected again."*

### Forage (CR 701.61)
**CR 701.61a verbatim:** *"To forage means 'Exile three cards from your graveyard or sacrifice a Food.'"*

## The Pattern

```
INCUBATE N pattern:
Result: Incubator token on battlefield with N +1/+1 counters
  → Front face: colorless artifact, no creature type, no power/toughness
  → Activate "{2}: Transform this token" → back face: 0/0 Phyrexian artifact creature
  → The 0/0 back face survives because of the +1/+1 counters (counters persist through transform)
  → Transform ability can be used at any time you have priority (instant speed!)
  → Counter modifiers (Doubling Season, Hardened Scales): apply when the token enters
    (the "enters with N counters" is a replacement/ETB counter effect)
  → The transform activation is a {2} activated ability on the artifact

RING TEMPTS YOU pattern:
First temptation:
  → Get emblem named "The Ring"
  → Choose a creature you control → becomes Ring-bearer (legendary, can't be blocked by greater power)
Each subsequent temptation (2nd, 3rd, 4th):
  → Reassign Ring-bearer (you choose which creature) OR keep current
  → 2nd total: "Whenever your Ring-bearer attacks, draw a card, then discard a card"
  → 3rd total: "Whenever your Ring-bearer becomes blocked, blocking creature's controller sacrifices it EOC"
  → 4th total: "Whenever your Ring-bearer deals combat damage to a player, each opponent loses 3 life"
  → Ring-bearer designation: lost if creature leaves battlefield or you lose control
  → Multiple Ring-bearers: you can only have one Ring-bearer at a time

SUSPECT pattern:
Designate a creature as suspected:
  → While suspected: has menace (must be blocked by 2+) and can't block
  → The condition persists until it leaves the battlefield or an effect removes the designation
  → Designation ≠ ability: suspected is NOT a copiable value, NOT an ability
  → Can't become suspected again (702.60d — wait, that's 701.60d in our rules)
  → If you become a suspect as a controller (funny wording), the CREATURE is suspected, not the player

FORAGE pattern:
To forage (paying the forage cost):
  → Choose: exile three cards from your GY -OR- sacrifice a Food token
  → The choice is made when forage is paid
  → Food sacrificed can be any Food token (yours or opponent's if applicable)
  → GY exile: any three cards (not just creatures; any card type), total MV doesn't matter
  → If you can't fulfill either option, you can't forage (can't pay the cost)
```

## Definitive Conclusions

**Incubate:**
- The Incubator token's transform ability is an activated ability on a noncreature artifact. It can be activated at instant speed (any time you have priority). This means you can transform it in response to your opponent's spells.
- The transformed Phyrexian Token is a 0/0 PLUS the counters that were on the Incubator. If you incubated 3, the Phyrexian Token is effectively 3/3 due to the +1/+1 counters.
- Counter-doubling effects (Doubling Season, Hardened Scales) apply when the Incubator token enters (that's when the counters are placed as part of the ETB replacement). A Doubling Season in play makes Incubate N create a token with 2N counters.
- The Incubator is a colorless artifact while face-up (front face). Transforming doesn't change zone; the same permanent flips to its back face.

**The Ring Tempts You:**
- The Ring Tempts You has a unique emblem mechanic that upgrades with repeated use. In Commander games where many players trigger the Ring repeatedly, the Ring at level 4 is extremely powerful.
- A creature is legendary once designated Ring-bearer (from the Ring's first ability). This means the legend rule applies — if you control two copies of a non-legendary creature, you can only make one Ring-bearer at a time (making one legendary while the other remains non-legendary... wait, only the designated one is legendary).
- Ring-bearer designation is lost when the creature leaves the battlefield. You choose a new one with the next temptation.
- The emblem is in the command zone and is not a permanent — it can't be destroyed, bounced, or exiled (unlike permanents). The Ring's abilities persist for the rest of the game once unlocked.

**Suspect:**
- Suspect is a double-edged sword: the suspected creature gets menace (harder to block) but can't block. Use it on opponent's creatures to prevent them from blocking your attacks; your opponent uses it offensively but their creature is then open for attacks.
- Suspected status is neither an ability nor part of copiable values. Copying a suspected creature doesn't make the copy suspected.
- "Can't become suspected again" — if a creature becomes suspected and later the designation is removed, can it be suspected again? The rule says "can't become suspected again" which implies permanent immunity after one time. This prevents repeated "unsuspect/resuspect" loops.

**Forage:**
- Forage is flexible: saves you from needing GY cards if you have Food, or saves Food if you have a deep GY. In Bloomburrow-style Food synergy decks, Food is often plentiful.
- Sacrificing a Food for Forage does NOT draw you a card the way paying {2}, Sacrifice Food would. It's just the sacrifice as payment.
- If you have no GY and no Food, you cannot Forage at all.

## Canonical Examples

**Incubate:**
- *Phyresis Outbreak* (Phyrexia: All Will Be One): "Each opponent gets a poison counter. Then each creature an opponent controls that's not a Phyrexian gets a -1/-1 counter for each poison counter that player has. Proliferate." This is a common way to distribute Incubator tokens in synergy with Phyrexian proliferate strategies. For a direct Incubate example: *Mycosynthlarge* and other MOM cards use the Incubate N wording. (Note: *Evolved Sleeper* does NOT have Incubate — it is a {B} 1/1 that transforms through activated abilities like "{B}: become a 2/2 Cleric" and "{1}{B}: if Phyrexian, put +1/+1 counter on it.")

**The Ring Tempts You:**
- *Frodo Baggins*: "Whenever Frodo Baggins attacks, if he's your Ring-bearer, he explores." The Ring Tempts You triggers appear on many LotR cards. By temptation 4, your Ring-bearer deals 3 life damage to each opponent on every combat damage hit.
- In Commander with 4 players, each player's "The Ring Tempts You" triggers get their OWN Ring emblem and Ring-bearer — the Ring is tracked per player.

**Suspect:**
- *Detective* creature type cards: many detectives can suspect creatures. *Long Goodbye*: "Target creature becomes suspected."
- *Long Goodbye* (Murders at Karlov Manor): "Target creature becomes suspected." A clean, targeted Suspect spell. (Note: *Gleaming Geardrake* does NOT have a Suspect trigger on entry — it is a {U}{R} 1/1 that creates a Clue on entering and gains +1/+1 counters when you sacrifice artifacts.)

**Forage:**
- *Nocturnal Hunger* (Bloomburrow): "Forage. If you do, each opponent discards a card." To cast it fully, you forage — exile 3 from GY or sacrifice Food — and each opponent discards.

## Commonly Confused With

- **P281** (Food/Treasure/Clue tokens) — Food sacrifice is part of Forage; Food's normal ability (sacrifice {2}: gain 2 life) is separate from being used for Forage
- **P098** (Double-Faced Cards) — Incubator is a double-faced token with its own transform rules; transforming the token doesn't trigger ETB abilities
- **P279** (Monarch/Initiative designations) — Ring-bearer is another player designation similar in structure; designations are tracked separately from abilities
- **P110** (Menace) — Suspected creatures gain menace as a consequence of the Suspect designation, not as a printed ability; Menace from Suspect can't be removed by "remove abilities" effects since it's not a keyword on the card (it's from a designation)... actually wait: CR 701.60c says "A suspected permanent has menace... for as long as it's suspected." This IS an ability grant effect, it just comes from the designation rule, not from the card's text. Removing the suspected designation removes the menace.
