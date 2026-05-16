"""Fixtures shared across tests."""

# A small but representative slice of the Comprehensive Rules format.
# Exercises: BOM, effective date, chapter/section headers, the duplicate
# chapter line between Contents and Body, top-level rules, subrules with
# letter suffixes (including a skipped 'l'/'o' to test multi-letter), examples,
# multi-paragraph bodies, glossary, and Credits terminator.
SAMPLE_CR_TEXT = """\ufeffMagic: The Gathering Comprehensive Rules

These rules are effective as of January 1, 2099.

Introduction

This document is the ultimate authority for Magic: The Gathering competitive game play.

Contents

1. Game Concepts
100. General
101. Players

6. Spells, Abilities, and Effects
613. Interaction of Continuous Effects

Glossary

Credits

1. Game Concepts

100. General

100.1. Test rule body line one.
This is a continuation line of 100.1.

100.1a Subrule body for letter a.

100.1b Subrule body for letter b.
Example: A flavor example sentence.
Example: A second example.

101. Players

101.1. A player is one of the people in the game.

6. Spells, Abilities, and Effects

613. Interaction of Continuous Effects

613.1. The values of a continuous effect are calculated in a series of layers.

613.1a Layer 1: Copy effects are applied.

613.1b Layer 2: Control-changing effects are applied.

613.1c Layer 3: Text-changing effects are applied.

613.1d Layer 4: Type-changing effects are applied.

613.1e Layer 5: Color-changing effects are applied.

613.1f Layer 6: Ability-adding and ability-removing effects are applied.

613.1g Layer 7: Power and toughness changing effects are applied.

Glossary

Active Player
The player whose turn it is.

Commander Damage
Combat damage dealt to a player by a commander. See rule 903.10.

Toxic
A keyword ability that gives poison counters to a player damaged by combat.

Credits

Magic: The Gathering was designed by Richard Garfield.
"""
