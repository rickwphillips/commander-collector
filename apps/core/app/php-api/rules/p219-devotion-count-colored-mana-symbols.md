---
id: p219
name: Devotion — Count Colored Mana Symbols in Permanents You Control
category: continuous
cr_refs: [700.5]
tags: [devotion, colored-mana-symbols, Theros, nyxborn, god-creature, Gray-Merchant, Erebos, Purphoros]
created: 2026-03-28
examples_count: 2
---

# P219 — Devotion — Count Colored Mana Symbols in Permanents You Control

## Abstract
Devotion counts the number of times a specific color's mana symbol ({G}, {R}, {W}, {B}, {U}) appears in the mana costs of permanents you control. Gods in Theros block are indestructible enchantment creatures but ONLY become creatures when your devotion to their color reaches 5+. If devotion drops below 5, the God stops being a creature (though it's still on the battlefield as an indestructible enchantment). Gray Merchant of Asphodel uses devotion to drain life — its value scales exponentially as black mana symbols accumulate.

## The Definitive Rules

**CR 700.5** (verbatim): *"A player's 'devotion to [color]' is equal to the number of mana symbols of that color among the mana costs of permanents that player controls."*

## The Pattern

```
DEVOTION COUNTING:
  Count ALL mana symbols of the specified color in mana costs of YOUR permanents
  Includes: mana cost (not the spell cost, the printed mana cost)
  Phyrexian mana: {B/P} counts as one black mana symbol for black devotion
  Hybrid mana: {B/G} counts as one black AND one green symbol (for respective devotions)
  Colorless mana ({1}, {0}, {C}): do NOT count toward any color's devotion
  Generic mana ({1}, {2}, etc.): does NOT count

  DEVOTION + HYBRID MANA:
    A permanent costing {B/G}{B/G}: contributes 2 to black devotion AND 2 to green devotion
    Both devotions simultaneously
    Cards like Lotleth Troll ({B/G}{B/G}): 2 black, 2 green devotion from one card

  DEVOTION + MULTICOLOR PERMANENTS:
    Niv-Mizzet Reborn ({W}{U}{B}{R}{G}): 1 each to 5 different devotions
    A permanent with {U}{U}{B}: 2 to blue devotion, 1 to black devotion

GODS (Theros Block):
  Gods are legendary enchantments with base P/T
  They are creatures only while devotion to their color >= 5
  Conditional creature: if devotion < 5, the God is not a creature (enchantment only)
  While not a creature: can't attack, block, be subject to "target creature" spells
  BUT: still on the battlefield, still indestructible (enchantment with indestructible)
  Example: Erebos, God of the Dead ({3}{B}{B}): "As long as your devotion to black is less than 5, Erebos isn't a creature."

  GOD + DEVOTION FLUCTUATION:
    Turn a permanent face-down: its mana cost is hidden/removed → devotion decreases
    Opponent destroys a black permanent: devotion may drop below 5 → God stops being a creature
    Instant removal of permanents: can cause God to stop being creature at instant speed!
    Opponents actively target your permanents to reduce devotion (anti-God strategy)

  GOD + "NOT A CREATURE":
    When a God stops being a creature (devotion drops below 5):
    It loses all creature-specific characteristics (except P/T since it's a "card characteristic")
    Creature spells can't target it
    Summoning sickness: if it just became a creature this turn, it has summoning sickness
    Once it becomes a creature (devotion reaches 5): may have summoning sickness

GRAY MERCHANT OF ASPHODEL:
  ETB: "Each opponent loses X life, where X is your devotion to black. You gain that much life."
  With {B}{B} itself: contributes 2 devotion
  A full black midrange board: might have 8-10 devotion → drain 8-10 per opponent
  In Commander with 3 opponents: 10 devotion → 10 damage each = 30 damage total + 30 life gained
  The most powerful Gray Merchant plays in Commander can be game-winning

PURPHOROS, GOD OF THE FORGE:
  {2}{R}{R}: legendary enchantment creature (God)
  "As long as your devotion to red is less than 5, Purphoros isn't a creature."
  "Whenever another creature enters under your control, Purphoros deals 2 damage to each opponent."
  The ETB trigger doesn't require Purphoros to be a creature (it's still on the battlefield)
  Put 5 creatures onto the battlefield → 10 damage per opponent → win condition
  Token generation + Purphoros = Commander combo

THASSA, GOD OF THE SEA:
  Indestructible enchantment
  "As long as devotion to blue is less than 5, Thassa isn't a creature."
  "{U}: target creature you control can't be blocked this turn."
  Key: the activated ability works regardless of whether Thassa is a creature or enchantment
  The devotion condition only affects Thassa being a creature

DEVOTION + REMOVAL:
  Opponent uses Detention Sphere (enchantment removal) to exile your enchantments:
  Devotion drops → God may stop being a creature
  This is the primary counter to devotion-heavy decks
```

## Definitive Conclusions

- **Devotion counts colored mana symbols** in mana costs of your permanents.
- **Hybrid and Phyrexian mana symbols count** for the relevant color's devotion.
- **Gods are creatures only** when devotion to their color reaches or exceeds 5.
- **Devotion fluctuates** — removing opponent's permanents can "knock out" their God's creature status.
- **Gray Merchant** scales damage/gain with devotion — a payoff for dense single-color builds.

## Canonical Example
**Erebos deck — black devotion:**
Battlefield: Thoughtseize (sorcery, doesn't count), Bile Blight {B}{B} (wait, it's not a permanent).
Permanents: Pack Rat ({B}{B}) → 2 devotion. Desecration Demon ({2}{B}{B}) → 2 devotion.
Erebos, God of the Dead ({3}{B}{B}) → 2 devotion from itself.
Total devotion to black: 2 + 2 + 2 = 6 (≥ 5!). Erebos IS a creature.
Attack with Erebos (5/7 indestructible creature). Opponent must deal with a 5/7 or take 5 damage.
Opponent destroys Pack Rat (2 devotion lost): devotion = 4 (< 5). Erebos stops being a creature.
Can't attack next turn with Erebos. Must rebuild devotion to 5.

**Example 2 — Purphoros in Commander:**
Purphoros is always active (doesn't need to be a creature to trigger).
Cast Hornet Queen ({5}{G}{G}): enters + 4/4 flying deathtouch + creates four 1/1 Hornet tokens.
Five creatures entered: Purphoros triggers 5 times.
In a 4-player game (3 opponents): 5 triggers × 2 damage each × 3 opponents = 30 damage total.
Opponents each took 10 damage from one Hornet Queen cast.
Purphoros's devotion: {2}{R}{R} = 2 red devotion from itself. Add more red permanents → becomes a creature.

## Commonly Confused With
- **P219 vs Threshold** — Threshold counts cards in your GRAVEYARD (not permanents). Devotion counts mana symbols in permanents.
- **P219 vs Metalcraft** — Metalcraft counts ARTIFACTS you control (just the count, not mana symbols). Devotion counts specific mana symbols in mana costs.
- **P219 vs Converge** — Converge counts the number of colors of mana spent to cast a spell. Devotion counts color symbols among all permanents you control.
