---
id: p475
name: Exert, Enlist, and Saddle/Mount — Tap-and-Skip-Untap, Tap-Another-for-Power, and Creature-Mount-Riding
category: combat
cr_refs: [702.118, 702.179, 702.189, 508.1, 502.4, 603.2, 301.5, 208.3]
tags: exert, enlist, saddle, mount, tap-combat-cost, skip-untap, power-boost, riding-token, amonkhet, battle-for-zendikar-adjacent, outlaws-of-thunder-junction
created: 2026-03-29
examples_count: 7
---

# P475 — Exert, Enlist, and Saddle/Mount — Tap-and-Skip-Untap, Tap-Another-for-Power, and Creature-Mount-Riding

## Abstract

Three combat-keyword mechanics that involve tapping creatures as costs or supplements to attacking: **Exert** (CR 702.118, Amonkhet) lets you tap and "exert" an attacking creature to get a bonus, with the cost being that the creature doesn't untap during your next untap step; **Enlist** (CR 702.179, The Brothers' War) lets you tap another creature you control when declaring an attacker, adding the tapped creature's power to the enlisting creature until end of turn; and **Saddle N** (CR 702.189, Outlaws of Thunder Junction) is an activated ability on Mount creatures — pay by tapping untapped creatures with total power N to mount the creature and give it an "as long as it's saddled" bonus. All three create non-obvious interactions with haste, untap effects, and the summoning sickness rule.

## The Definitive Rules

### Exert (CR 702.118)
**CR 702.118a verbatim:** *"If a creature is exerted, it doesn't untap during its controller's next untap step."*

Exert is a choice made when declaring an attacker: you "choose to exert" a creature, gaining its exert bonus but accepting that it won't untap next untap step. The choice is made at declare attackers.

### Enlist (CR 702.179)
**CR 702.179a verbatim:** *"Whenever this creature attacks, you may tap another untapped creature you control. If you do, this creature gets +X/+0 until end of turn, where X is the enlisted creature's power."*

Enlist is a triggered ability. When the enlisting creature attacks, you may tap another untapped creature (as a cost of the trigger's effect), and the attacking creature gains that tapped creature's power until end of turn.

### Saddle N (CR 702.189)
**CR 702.189a verbatim:** *"Saddle N means '{Tap any number of other untapped creatures you control with total power N or more}: This permanent becomes saddled until end of turn. Activate only as a sorcery.'"*

Mount is a creature subtype. Saddling is an activated ability on Mount creatures. Once saddled, the Mount gains its "as long as saddled" bonus. The saddling is done by tapping untapped creatures you control (other than the Mount) with total power N or more.

## The Pattern

```
EXERT pattern:
Choose at declare attackers: "Do I exert this creature?"
  → If yes: creature gets its exert bonus, but won't untap next untap step
  → The "doesn't untap" is a replacement effect that applies to the next untap step
  → Untap effects can override this: "Untap target creature" or similar CAN untap
    an exerted creature before its natural untap (overriding the "doesn't untap")
  → Haste and exert: a creature with haste can attack (exert) the turn it ETBs
    → It won't untap next turn (from exert) but haste still allowed the initial attack
  → Exert more than once: exerting twice doesn't make it skip TWO untap steps;
    the "doesn't untap" effect just extends to the next untap step
    → Multiple exert activations per turn: not normally possible (can only exert
      when declaring as an attacker, once per combat)
  → Creatures put onto the battlefield attacking CANNOT be exerted. Exert requires
    declaring the creature as an attacker — creatures that enter already attacking
    (via effects like Sneak Attack or Ilharg) skip that declaration and thus
    cannot be exerted.
    Scryfall ruling (2017-04-18): "creatures put onto the battlefield attacking can't be exerted"
  → If the exerted creature doesn't survive the combat phase, the triggered exert bonus
    still fires as long as the trigger was put on the stack. The exert choice is made
    and locked in at declare attackers; the creature's survival is not a condition.
    Scryfall ruling (2017-04-18): "If you exert Combat Celebrant, you get an additional
    combat phase even if Combat Celebrant doesn't survive the first combat phase."
  → Vigilance + exert: vigilance means the creature doesn't tap when attacking
    → If you choose to exert a vigilance creature: it doesn't tap (vigilance), gets the bonus,
      and... doesn't untap next untap step (even though it's already untapped)
    → The "doesn't untap" is somewhat irrelevant for vigilance creatures since
      they never tapped in the first place
    → An exerted vigilance creature still attacks normally untapped AND gets the bonus
    → But it "won't untap" next upkeep — which has no visible effect since it's untapped
      (can't untap what's already untapped) → the exert on vigilance effectively costs nothing!
  → Key: vigilance + exert is extremely powerful (free exert bonus with no downside)

ENLIST pattern:
Trigger: "Whenever this creature attacks, you may tap another untapped creature you control."
  → Optional: you "may" do this
  → The tapped creature's power is added to the enlisting creature's power until EOT
    → This is a layer 7c power modification
  → The tapped creature cannot attack this turn (it just tapped; attack requires untapped
    declarations — wait, actually: the trigger fires when the enlisting creature IS declared
    as an attacker. At that point, you tap another creature. That other creature may have
    ALREADY been declared as an attacker (it's already attacking tapped or not based on
    whether it has vigilance).
    → Can you enlist a creature that's already attacking?
    → An attacking creature is tapped (unless it has vigilance). An already-tapped
      attacking creature can't be enlisted (must be "untapped").
    → So: Enlist only works with creatures that are NOT already attacking
  → Enlist doesn't exhaust the tapped creature's power for other purposes
    (the power calculation is based on the creature's power AT THE TIME of enlisting)
  → If the enlisted creature's power later changes (e.g., dies, gets debuffed), the
    bonus already applied remains until EOT (it's a fixed "+X/+0 until end of turn")

SADDLE N pattern:
Activated ability: {Tap creatures with total power N or more}: This permanent becomes saddled
  → Sorcery speed only (can't activate during opponent's turn or in response)
  → "Other untapped creatures you control with total power N or more"
    → Other: NOT the Mount itself
    → Untapped: summoning sick creatures can't tap → summoning sick creatures can't saddle
    → Total power N: can use multiple smaller creatures to reach N
    → The creatures tap as the cost (already tapped before "saddled" bonus applies)
  → "Saddled" status: lasts until end of turn (resets each turn)
    → Must re-saddle each turn the Mount is used
  → The Mount's bonus: "As long as this creature is saddled, [bonus]"
    → Usually: "this creature gets +2/+2" or "when this creature attacks while saddled,
      create a token"
  → Saddle ONLY applies to Mounts (creature subtype)
  → A Mount without a saddling cost can still exist but doesn't benefit from saddling
  → Saddle N where N = 0: trivially saddled by tapping any creature?
    → No: "tap any number of other untapped creatures with total power 0 or more"
    → Any combination of creatures (including just 1 0-power creature) satisfies N=0
    → Even tapping a 0-power creature satisfies this
```

## Definitive Conclusions

**Exert:**
- Vigilance + Exert is the most powerful exert combination: the creature never taps when attacking, the exert bonus is applied, and the "doesn't untap next turn" has no visible effect. This combo effectively eliminates exert's downside.
- Exert becomes dangerous in attrition games: if you keep exerting, your creatures can't block. Opponents attack your exhausted board while you have no blockers. Managing exert carefully — knowing when to hold back — is the skill expression.
- Key card: *Glory-Bound Initiate* (AKH): "You may exert this creature as it attacks. When you do, it gets +1/+3 and gains lifelink until end of turn." A 3/1 that becomes a 4/4 lifelinker when exerted — excellent in aggressive decks.
- Key card: *Combat Celebrant* (AKH): "Exert — Whenever Combat Celebrant is exerted, untap all other creatures you control and after this phase, there is an additional combat phase." Untap everything and get another combat — insane exert payoff.

**Enlist:**
- Enlist lets you use a creature that can't attack profitably (too small, doesn't have the right abilities) as "power fuel" for a bigger attacker. A mana dork with 2 power taps to give the enlisting creature +2/+0.
- The enlisting creature's trigger fires when it attacks — so the creature being enlisted was already committed to NOT attacking (since it has to be untapped at the time of the enlist trigger). You're trading one creature's ability to attack/block this turn for the enlisting creature's power boost.
- Key card: *Hurloon Battle Hymn* (BRO): "Enlist." The first creature to get the enlist keyword in the game. Tapping another creature for its power to boost your attacker's strength.

**Saddle:**
- Saddle is designed for "mount" and "rider" synergies. A Mount becomes stronger once saddled, reflecting the flavor of an adventurer riding a creature.
- Unlike Equipment (which attaches permanently), saddling is temporary (until end of turn) and must be paid each turn.
- The key rules trap: saddle uses summoning-sickness-affected creatures as saddle targets. A creature that just entered the battlefield CAN'T tap to saddle the Mount (it has summoning sickness).
- Key card: *Mounts* from Outlaws of Thunder Junction: Various Mounts with different power requirements and "while saddled" bonuses. Running a deck with multiple small creatures that tap together to power up the Mount is the core strategy.

## Canonical Examples

**Exert:**
- *Glory-Bound Initiate* exerted = 4/4 lifelink attacker for {1}{W}. Two turns of exert = 2 combats without the creature available to block. Plan ahead.

**Enlist:**
- Enlist attacker + 5/5 that can't attack (no haste, just ETB'd): tap the 5/5 for enlist → attacker becomes +5/+0 → potentially game-winning alpha strike.

**Saddle:**
- Saddle 3 Mount: tap three 1/1 tokens (total 3 power) to saddle it for the turn. The Mount now has its bonus effect for the combat step.

## Commonly Confused With

- **P463** (Inspired) — Inspired triggers when a creature UNTAPS; Exert prevents untapping; Exert + Inspired means the Inspired trigger can't fire on the exerted creature next untap step
- **P440** (Mentor/Afflict) — Mentor requires attacking with higher-power creature; Enlist taps a creature to GIVE power to the attacking creature; both involve power comparison but very differently
- **P099** (Equipment — Equip) — Saddle is conceptually similar to equip (attach to creature) but it's the creature being "ridden" not the item being equipped; saddle is temporary; equip is permanent
- **P429** (Exalted) — Exalted gives bonus when a creature attacks ALONE; Enlist adds another creature's power when attacking; both are attack-triggered but with opposite companion requirements
