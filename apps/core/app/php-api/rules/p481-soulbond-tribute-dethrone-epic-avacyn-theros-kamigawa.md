---
id: p481
name: Soulbond, Tribute, Dethrone, and Epic — Creature-Pairing, Opponent-Counter-Choice, Life-Leader Counter, and No-More-Spells
category: triggered
cr_refs: [702.89, 702.98, 702.99, 702.44, 603.2, 603.4, 800.4, 500.1, 300.1]
tags: soulbond, tribute, dethrone, epic, pairing-mechanic, opponent-choice-bonus, life-leader, no-more-spells, avacyn-restored, born-of-gods, conspiracy, saviors-of-kamigawa
created: 2026-03-29
examples_count: 7
---

# P481 — Soulbond, Tribute, Dethrone, and Epic — Creature-Pairing, Opponent-Counter-Choice, Life-Leader Counter, and No-More-Spells

## Abstract

Four formal keywords from different sets with unusual rules properties: **Soulbond** (CR 702.89, Avacyn Restored) pairs two creatures together so both share an ability while paired; **Tribute N** (CR 702.98, Born of the Gods) lets the opponent choose to put N +1/+1 counters on the Tribute creature when it enters, and if they don't, you get a bonus; **Dethrone** (CR 702.99, Conspiracy) places a +1/+1 counter on the Dethrone creature whenever it attacks the player with the most life (or tied for most); and **Epic** (CR 702.44, Saviors of Kamigawa) prevents you from casting any more spells for the rest of the game but copies the Epic spell at each of your upkeeps.

## The Definitive Rules

### Soulbond (CR 702.89)
**CR 702.89a verbatim:** *"Soulbond means 'When this creature enters the battlefield, if it's unpaired, you may pair it with another unpaired creature you control. For as long as they remain paired, they each have [shared ability]' and 'Whenever another unpaired creature you control enters the battlefield, if this creature is unpaired, you may pair this creature with that creature. For as long as they remain paired, they each have [shared ability].'"*

Soulbond pairs TWO creatures. Both have the Soulbond ability. When either enters unpaired, it can pair with another unpaired creature. Both creatures gain the listed ability while paired.

### Tribute N (CR 702.98)
**CR 702.98a verbatim:** *"Tribute N means 'As [this creature] enters the battlefield, an opponent of your choice may have it enter with N +1/+1 counters on it.'"*

Tribute is a replacement effect on ETB. The OPPONENT (not you) chooses: put N counters on the creature (making it bigger) OR don't (you get a secondary bonus from the card's text).

### Dethrone (CR 702.99)
**CR 702.99a verbatim:** *"Dethrone means 'Whenever this creature attacks a player, if that player has the most life among all players or is tied for most, put a +1/+1 counter on this creature.'"*

### Epic (CR 702.44)
**CR 702.44a verbatim:** *"Epic means 'For the rest of the game, you can't cast spells. At the beginning of each of your upkeeps, copy this spell except for its epic ability. If the spell has any targets, you may choose new targets for the copy.'"*

## The Pattern

```
SOULBOND pattern:
Pairing mechanism:
  → When a Soulbond creature enters unpaired: pair with any other unpaired creature you control
  → Alternatively: when ANY unpaired creature enters while a Soulbond creature is unpaired:
    the Soulbond creature may pair with the new entrant
  → Once paired: both creatures share the Soulbond ability
  → Pairing is permanent until a creature leaves the battlefield
    → If one creature dies/is exiled/blinks: the bond breaks, both creatures become unpaired
    → The surviving creature is now unpaired and can pair with the next unpaired creature
  → Two Soulbond creatures entering simultaneously: they can pair with each other
  → A creature can only be in ONE pairing at a time
  → Multiple Soulbond creatures on the battlefield, all different abilities:
    → Each pairs separately; different pairs get different abilities
  → Soulbond with a non-Soulbond creature: the non-Soulbond creature also gains the ability
    (both creatures in the pair share the ability regardless of who has Soulbond)

TRIBUTE N pattern:
ETB replacement: "An opponent of your choice may have [this creature] enter with N +1/+1 counters"
  → The OPPONENT CHOOSES (not you). This is the key non-obvious element.
  → The opponent faces a dilemma: put counters on your creature (making it stronger stats-wise)
    OR decline (and you get the secondary bonus from the card text)
  → "Tribute not paid" conditions: if the opponent declines → you get the bonus
  → The opponent generally chooses whichever is LESS good for you:
    → If the counter is strong AND the secondary ability is weak: opponent puts counters on
    → If the counter is weak AND the secondary ability is strong: opponent DOESN'T put counters
    → Theoretically, tribute always gives opponents the chance to minimize your benefit
  → In multiplayer: you choose WHICH opponent makes the decision

DETHRONE pattern:
Trigger: "Whenever this creature attacks a player, if that player has the most life (or tied for most)"
  → Checks life total of the attacked player AT THE TIME OF ATTACKING
  → In 1v1: opponent usually has more or equal life → dethrone triggers most swings
  → In multiplayer: attack the richest (most life) player → get a counter
    → Once you have counters, dethrone creature is bigger → attacks the life-leader harder
  → Dethrone fires EVERY ATTACK against the life leader (not just once)
  → If you are the life leader: your creatures with dethrone attack anyone who has equal or
    less life → they don't get the dethrone bonus (you're attacking someone with ≤ your life)
  → Attacking a planeswalker: dethrone triggers only when attacking A PLAYER (not a planeswalker)
    unless the card says "planeswalker or player"

EPIC pattern:
PERMANENT EFFECT: "For the rest of the game, you can't cast spells."
  → This is a restriction on YOU, the player who cast the Epic spell
  → ALL spells: you can't cast any more spells for the rest of the game
  → "For the rest of the game" = permanent, irreversible (no effect can undo this)
  → The Epic spell itself is the LAST SPELL you cast
  → Upkeep copy: "At the beginning of each of your upkeeps, copy this spell"
    → The COPY is NOT cast; it's created. This bypasses "can't cast spells" (you're not casting)
    → The copy goes on the stack and resolves
    → Choose new targets if the copy is a targeted spell
    → The copy has the same effects as the original except "epic" (per the rules text)
  → Epic spells are typically powerful enough that one copy + repeated upkeep copies
    is worth never casting spells again
  → You can still activate abilities, use special actions, and use mana abilities
  → You just can't CAST SPELLS (from hand, from exile, from GY — any casting)
```

## Definitive Conclusions

**Soulbond:**
- Soulbond is a "pseudo-aura" for creatures: instead of attaching to one creature, it creates a mutual bond. Both creatures benefit. The bond breaks when either dies, creating vulnerability.
- Strategic pairing: pair your strongest Soulbond creature (e.g., one that grants flying to the pair) with your biggest threat. The pair gets the benefit; the other creatures don't.
- A Soulbond creature entering when all your creatures are already paired: it remains unpaired (no one is available). Only unpaired creatures can form bonds.
- Key card: *Silverblade Paladin* (AVR): "Soulbond. As long as Silverblade Paladin is paired with another creature, both have double strike." A 2/2 that grants double strike to its partner. Pairing with a 10/10 → 10/10 with double strike.
- Key card: *Bruna, Light of Alabaster* (AVR): Not Soulbond but Avacyn Restored. Actual Soulbond: *Deadeye Navigator* (AVR): "Soulbond. As long as Deadeye Navigator is paired with another creature, both have '{1}{U}: Exile this permanent, then return it to the battlefield under your control.'"  Deadeye Navigator's Soulbond + blinkable creature = infinite ETB abuse.

**Tribute:**
- Tribute is a "lose-lose" for opponents: they must choose which bad outcome to give you. The design intent is that both paths are viable, so opponents are always giving you something.
- In Commander (multiplayer), you choose which opponent makes the tribute choice. Choose the player least likely to put counters on (if you prefer the secondary bonus) or most likely (if you prefer the bigger creature).
- Key card: *Nessian Demolok* (BNG): "Tribute 3. When Nessian Demolok enters the battlefield, if tribute wasn't paid, destroy target noncreature permanent." A 3/3 with Tribute 3 — opponent choice: give you a 6/6 (3/3 base + three +1/+1 counters) OR let you destroy their key artifact/enchantment. Note: Nessian Demolok does NOT have trample.

**Dethrone:**
- Dethrone naturally grows your creature when attacking the player ahead of you in life. In Commander, it incentivizes attacking the life-leader, which creates a political tool.
- Dethrone stops working once you're in the lead: if you're at the highest life, your attacks against weaker players don't trigger dethrone. Attack the life-leader specifically to grow your creature.
- Key card: *Marchesa, the Black Rose* (CNS): "Dethrone. Whenever a creature you control with a +1/+1 counter on it dies, return that creature to the battlefield under your control at the beginning of the next end step." Marchesa turns all +1/+1 counters (including from dethrone) into recursion insurance.

**Epic:**
- Epic is one of the most dramatic self-restriction mechanics ever printed. Casting an Epic spell is a GAME-CHANGING commitment: you will never cast another spell. All future actions must come from activated abilities, special actions, and triggered abilities.
- Epic decks in 60-card formats barely exist in competitive play. In casual, they're built around finding the Epic spell and using lands/artifacts that activate abilities instead of casting spells.
- Key cards: *Eternal Dominion* (SOK): "Epic. Search target opponent's library for an artifact, creature, enchantment, or land card, put it onto the battlefield under your control, then that player shuffles." Copies each upkeep → steal a permanent from an opponent every upkeep forever. (Target is an opponent, not any player.)
- *Enduring Ideal* (SOK): "Epic. Search your library for an enchantment card, put it directly onto the battlefield, then shuffle." Copies each upkeep → a free enchantment per upkeep forever.

## Canonical Examples

**Soulbond:**
- *Deadeye Navigator* + any ETB creature: pair them, blink the ETB creature every {1}{U} for infinite ETB triggers. Broken combo that defines EDH play.

**Tribute:**
- *Nessian Demolok*: Opponent puts 3 counters → you have a 6/6. Opponent doesn't → destroy their Sol Ring or Doubling Season. No good option for the opponent.

**Dethrone:**
- *Marchesa, the Black Rose*: Lead at 40 life but attack the 50-life opponent with dethrone creatures → get counters → when those creatures die, Marchesa returns them.

**Epic:**
- *Enduring Ideal*: Cast on turn 5. You never cast another spell, but every upkeep you put a free enchantment into play. Moat, Omniscience, Privileged Position, etc.

## Commonly Confused With

- **P040** (Aura) — Soulbond grants abilities "while paired" to both creatures; Auras attach to one permanent; both create ability-granting bonds but Soulbond is mutual
- **P441** (Mutate) — Mutate permanently merges cards; Soulbond creates a temporary bond that breaks on zone change; different bonding mechanisms
- **P002** (Replacement Effects) — Tribute is an ETB replacement effect; the opponent chooses whether to modify the ETB; similar to "enters with counters" replacements
- **P445** (Companion) — Both Companion and Epic have specific game-state commitments; Epic prevents further casting; Companion restricts deck building
