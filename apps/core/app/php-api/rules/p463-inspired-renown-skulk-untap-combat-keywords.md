---
id: p463
name: Inspired, Renown, and Skulk — Untap-Trigger, First-Combat-Damage Designation, and Low-Power Evasion
category: combat
cr_refs: [207.2c, 702.113, 702.114, 603.2, 603.4, 502.4, 702.9b, 700.4, 508.1]
tags: inspired, renown, skulk, ability-word, untap-trigger, combat-damage-designation, evasion, born-of-gods, magic-origins, shadows-over-innistrad
created: 2026-03-29
examples_count: 7
---

# P463 — Inspired, Renown, and Skulk — Untap-Trigger, First-Combat-Damage Designation, and Low-Power Evasion

## Abstract

Three mechanics from different sets interact non-trivially with combat and untapping: **Inspired** (Born of the Gods, 2014) is an ability word triggering whenever the creature becomes untapped — most powerful when the creature is tapped outside the normal untap step (via attacking, activated abilities, or opponents' effects); **Renown N** (CR 702.113, Magic Origins, 2015) is a keyword ability that designates a creature as renowned after it first deals combat damage to a player, placing N +1/+1 counters on it and granting effects "if this creature is renowned"; and **Skulk** (CR 702.114, Shadows over Innistrad, 2016) is an evasion keyword preventing blocking by creatures with power greater than the skulking creature's power. All three have non-obvious interactions with blink/flicker, power changes, and combat-step timing.

## The Definitive Rules

### Inspired (CR 207.2c)
Inspired text pattern: *"Inspired — Whenever [this creature] becomes untapped, [effect]."*

Inspired is a triggered ability (CR 603.2) using the "whenever" trigger word. It triggers any time the creature goes from tapped to untapped. This happens during the untap step (CR 502.1–502.4), but also when effects untap the creature (Springleaf Drum, Kiora's Follower, effects that say "untap target creature").

### Renown N (CR 702.113)
**CR 702.113a verbatim:** *"Renown N means 'Whenever this creature deals combat damage to a player, if it isn't renowned, put N +1/+1 counters on it and it becomes renowned.'"*

**CR 702.113b verbatim:** *"Renowned is a designation a permanent can have. If a permanent has multiple instances of renown, each triggers separately. However, a renowned permanent can only become renowned if it isn't already renowned."*

Renowned is a designation (not an ability, not a copiable value). Once a creature becomes renowned, it stays renowned as long as it's on the battlefield. Leaving the battlefield and returning makes it a new object — no longer renowned.

### Skulk (CR 702.114)
**CR 702.114a verbatim:** *"Skulk means 'This creature can't be blocked by creatures with greater power.'"*

Skulk is an evasion ability. A skulking creature can only be blocked by creatures with power ≤ the skulking creature's current power. If the skulking creature has power 2, only creatures with power 0, 1, or 2 can block it. Creatures with power 3+ cannot block it.

## The Pattern

```
INSPIRED pattern:
Trigger: "Whenever [this creature] becomes untapped"
  → Fires during EVERY untap step (once per untap step the creature is tapped)
  → Fires when effects OUTSIDE the untap step untap the creature:
    → Opponent uses "untap target creature" effect on your creature → triggers
    → "Tap: do X" activated ability → creature taps as cost → later untaps → triggers
    → Springleaf Drum taps inspired creature for mana → creature untaps next turn → triggers
    → Blink/flicker returns tapped: creature re-enters UNTAPPED
      (Ephemerate: creature blinks OUT tapped, comes back UNTAPPED → becomes untapped → triggers)
    → Creatures with vigilance attack → remain untapped → NO untap trigger at next step
      (already untapped, never became untapped from tapped state)
  → Summoning sickness doesn't affect the trigger — any untap fires it
  → Ophiomancer token attacking + tapping: token dies, no return, no trigger
    (but inspired on other creatures still fires when THEY untap)

RENOWN N pattern:
Trigger: "Whenever this creature deals combat damage to a player, if it isn't renowned"
  → Intervening-if clause (CR 603.4): checked at trigger time AND resolution
  → Triggers when it deals combat damage to a player (not combat damage to a creature)
  → If renowned already → doesn't trigger (CR 702.113a: "if it isn't renowned")
  → Places N +1/+1 counters on it → creature is permanently bigger after renown
  → Renowned designation:
    → Persists on the battlefield
    → Lost when creature leaves the battlefield (zone change = new object = not renowned)
    → Blink: creature returns and is no longer renowned — can become renowned again
    → Clone: a copy of a renowned creature is not renowned (designation ≠ copiable value)
    → "If this creature is renowned" conditions check current designation
  → Renown doesn't trigger from noncombat damage (e.g., Electrostatic Field, Fireball)
  → Renown triggers from combat damage to players ONLY — not to other creatures

SKULK pattern:
Combat blocking restriction: "Can't be blocked by creatures with greater power"
  → Power check is at the time of BLOCKING DECLARATION (declare blockers step)
  → Pump spells after blocking is declared don't retroactively make a block illegal
    → If a 2-power creature blocks a 2-power skulking creature legally,
      then the skulking creature gets +2/+2 → the block remains legal (CR 509.1b:
      blocking legality is checked when blockers are declared)
  → Power reduction CAN make the skulking creature unblockable mid-assignment:
    wait — if the skulking creature's power INCREASES, it doesn't affect legality
    if the skulking creature's power DECREASES after blocking, the block is still legal
  → Power check is CURRENT power — pump effects, counters, etc. matter
  → Skulk vs. 0/X creatures: a 0-power skulking creature can only be blocked by
    creatures with power 0 or less (so effectively unblockable by most creatures)
  → Skulk + menace: must be blocked by 2+ creatures, each with power ≤ skulk creature's power
```

## Definitive Conclusions

**Inspired:**
- The classic Inspired setup is tap-for-mana effects combined with inspired payoffs: tap the creature for mana (using a Springleaf Drum or similar), then untap it at the start of your turn → inspired triggers. Or attack, tap the creature, and untap it to get a bonus.
- Blink/flicker with Inspired: the creature blinks out as a tapped attacker, returns to the battlefield untapped → it has gone from (previously tapped state implicitly) to untapped → technically it entered untapped, not "became untapped" from tapped. Actually the trigger is "becomes untapped" — does entering the battlefield untapped count? CR says "becomes" refers to a state transition. A permanent entering untapped hasn't transitioned from tapped to untapped — it arrived untapped. So blinking doesn't trigger Inspired on its own. Only if the creature had previously been tapped and then untaps does the trigger fire.
- Kiora's Follower and Inspired: Kiora's Follower untaps any permanent. Tapping your inspired creature and then using Follower to untap it → the creature becomes untapped outside the untap step → Inspired triggers.
- Key cards: *Arbiter of the Ideal* (BNG): "Inspired — Whenever Arbiter of the Ideal becomes untapped, reveal the top card of your library. If it's an artifact, creature, or land card, you may put it onto the battlefield with a manifestation counter on it."

**Renown:**
- Renown is a one-time payoff: after the first hit on a player, the creature gets permanently bigger. If the creature dies and returns, it can become renowned again.
- The "if it isn't renowned" intervening-if clause means that if the creature was made renowned between the trigger firing and the trigger resolving (e.g., via an ability or another instance of renown triggering), the trigger fizzles at resolution.
- Renown only matters for combat damage to players — not creatures, not planeswalkers (unless a card specifically says "players and planeswalkers").
- **Creature leaves before renown resolves → does NOT become renowned.** If the creature is destroyed or bounced after its renown trigger fires but before the trigger resolves, the trigger fizzles. The creature is not on the battlefield to become renowned, and "any ability that triggers 'whenever a creature becomes renowned' won't trigger." (Scryfall ruling 2015-06-22)
- **Redirected damage edge case:** If a renown creature deals combat damage to its controller due to damage redirection (e.g., an opponent redirects the damage), renown still triggers. The trigger condition is "deals combat damage to a player" — it doesn't require the player to be an opponent. (Scryfall ruling 2015-06-22)
- Key cards: *Kytheon, Hero of Akros*: "Whenever Kytheon, Hero of Akros and at least two other creatures attack, exile Kytheon, then return him to the battlefield transformed." Not renown itself, but Kytheon has a related destiny effect.
- *Consul's Lieutenant* (Magic Origins): "Renown 1. Whenever Consul's Lieutenant attacks, if it's renowned, other attacking creatures you control get +1/+0 until end of turn." The attack bonus only triggers if already renowned — need the first combat damage hit to unlock it.

**Skulk:**
- Skulk rewards combat with small creatures and evasion-granting effects. A 1-power skulking creature can only be blocked by 0/X or 1/X creatures — most threats are power 2+ and can't block it.
- Skulk's power check is at declare blockers. A 3/3 skulking creature is blockable by anything, since most creatures are power ≤ 3. Skulk is most effective on low-power creatures.
- After blockers are declared legally, the block is committed. Pumping the skulking creature's power above the blocker's power doesn't make the block illegal retroactively. This is the same rule as protection — blocking legality is a snapshot at declare blockers.
- Skulk does NOT prevent blocking by 0-power creatures — a 0/4 wall CAN block a 1-power skulker (the wall has power 0, which is not greater than 1).
- Key cards: *Slither Blade* (AKH): "Slither Blade can't be blocked." Not skulk — fully unblockable. Skulk instead: *Mausoleum Wanderer* (SoI) doesn't have skulk, but *Stitchwing Skaab* and others do.
- *Aberrant Researcher* (SoI): Has skulk while transformed as *Perfected Form*.

## Canonical Examples

**Inspired:**
- *Kiora's Follower* + any Inspired creature: untap your inspired creature at instant speed to get the trigger whenever you want (during opponent's turn, during combat, etc.).
- *Endbringer* (OGW): Tap for multiple effects; untaps during each player's untap step (unusual). Does not have inspired, but illustrates the value of freely-tapping/untapping.

**Renown:**
- *Consul's Lieutenant* (ORI): 2/1 first strike for {W}{W}. Gets +1/+1 on first player hit, then buffs other attackers. Aggressive white card that rewards getting through.
- *Kytheon's Irregulars* (ORI): 4/3 for {2}{W}{W}. "Renown 1. {W}{W}, {T}: Tap target creature. That creature doesn't untap during its controller's next untap step." After renown (getting to 5/4 with the +1/+1 counter), this tap lock is very powerful.

**Skulk:**
- *Slitherhead* (RTR): 1/1 for {B/G}. Not skulk, but a low-power 1/1 illustrates why skulk is relevant on low-power creatures.
- Any creature with power 0–1 in Shadows over Innistrad that has Skulk effectively becomes a tiny but reliable damage dealer in the late game when your opponent has powerful but high-power blockers.

## Commonly Confused With

- **P006** (Intervening If Clause) — Renown uses an intervening-if: "if it isn't renowned" — checked at trigger AND resolution; same pattern as Felidar Sovereign
- **P107** (Evasion — Flying/Unblockable/Intimidate) — Skulk is an evasion keyword like these; intimidate can't be blocked by creatures without the color; skulk can't be blocked by creatures with greater power; both checked at declare blockers
- **P452** (Enrage) — Enrage triggers on damage TO the creature; Renown triggers on combat damage DEALT BY the creature to a player — opposite directions
- **P440** (Mentor/Afflict) — Mentor triggers on attack if target has lesser power; Renown triggers on combat damage to a player; both are combat-triggered but check different things
