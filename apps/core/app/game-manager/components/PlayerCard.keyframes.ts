'use client';

/**
 * PlayerCard.keyframes
 *
 * Shared emotion `keyframes` definitions for the player-card surface (currently
 * rendered by `PlayerPanel.tsx`, in the process of being migrated to
 * `PlayerCard.tsx`). Extracted in Phase 3 of the PlayerCard split so that
 * deferred Phase 2 render blocks can land cleanly on PlayerCard without
 * forcing duplicate `useMemo` definitions.
 *
 * Shape choice: (B) — multiple hooks grouped by input dependency.
 *   - `useXpKeyframes`     → depends on `experience` and derived xp values
 *   - `useEnergyKeyframes` → depends on `energy` and its derived values
 *   - `useDamageFlashKeyframes` → no inputs (static)
 *   - `usePoisonBoilKeyframe`  → depends on `poison` and derived boil values
 *
 * Why (B) over (A): energy / poison / damage are independent of XP, and a
 * future React.memo comparator (or a downstream consumer that only renders
 * one tracker) wants the smallest possible invalidation surface. Grouping by
 * input dependency matches how memos already invalidate today and avoids
 * recomputing unrelated keyframes when only one counter changes.
 *
 * Behavior contract (preserved verbatim from PlayerPanel pre-Phase-3):
 *   - Conditional keyframes return `null` when their gating predicate is
 *     false (e.g. `experience > 0`, `energy > 5`, `poison >= 8`). Callers
 *     fall back to `'none'` in their `animation` style prop exactly as
 *     before; this module does not change that.
 *   - Keyframe bodies are ported verbatim — no whitespace or punctuation
 *     edits.
 */

import { useMemo } from 'react';
import { keyframes } from '@emotion/react';
import type { Keyframes } from '@emotion/react';

// ---------------------------------------------------------------------------
// XP
// ---------------------------------------------------------------------------

export interface XpKeyframes {
  xpShimmerAnim: Keyframes | null;
  xpFlashAnim: Keyframes;
  xpRippleAnim: Keyframes;
  xpLevelUpAnim: Keyframes;
  xpShimmerSweepAnim: Keyframes | null;
  xpEmberAnim: Keyframes | null;
  xpRuneGlowAnim: Keyframes | null;
}

/**
 * XP-tracker keyframes. `xpGlow` and `xpGlowIntensity` are derived inline by
 * the caller and threaded through here so the shimmer body stays identical.
 *
 * Note: the four conditional XP anims invalidate only on `experience`
 * changes (matching the original deps array). `xpGlow` / `xpGlowIntensity`
 * are functions of `experience` so this is safe and matches prior behavior.
 */
export function useXpKeyframes(
  experience: number,
  xpGlow: string | undefined,
  xpGlowIntensity: number,
): XpKeyframes {
  const xpShimmerAnim = useMemo(() => experience > 0 ? keyframes`
    0%,100% { text-shadow: ${xpGlow}; filter: brightness(1); }
    45%, 55% { text-shadow: 0 0 ${6 + xpGlowIntensity * 16}px rgba(255,223,0,0.95), 0 0 ${18 + xpGlowIntensity * 28}px rgba(218,165,32,0.7); filter: brightness(1.5); }
  ` : null, [experience]); // eslint-disable-line react-hooks/exhaustive-deps

  const xpFlashAnim = useMemo(() => keyframes`
    0%   { box-shadow: 0 2px 8px rgba(218,165,32,0.5); transform: rotate(45deg) scale(1); }
    25%  { box-shadow: 0 2px 28px rgba(255,215,0,1), 0 0 48px rgba(255,215,0,0.5); transform: rotate(45deg) scale(1.3); }
    100% { box-shadow: 0 2px 8px rgba(218,165,32,0.5); transform: rotate(45deg) scale(1); }
  `, []);

  const xpRippleAnim = useMemo(() => keyframes`
    0%   { transform: translate(-50%,-50%) rotate(45deg) scale(0.4); opacity: 0.9; }
    100% { transform: translate(-50%,-50%) rotate(45deg) scale(4);   opacity: 0; }
  `, []);

  const xpLevelUpAnim = useMemo(() => keyframes`
    0%   { transform: scale(1); }
    25%  { transform: scale(1.3); }
    60%  { transform: scale(0.93); }
    100% { transform: scale(1); }
  `, []);

  const xpShimmerSweepAnim = useMemo(() => experience > 0 ? keyframes`
    0%   { transform: translateX(-120%); opacity: 0; }
    6%   { transform: translateX(-120%); opacity: 0; }
    7%   { opacity: 0.8; }
    17%  { transform: translateX(180%); opacity: 0.8; }
    21%  { transform: translateX(300%); opacity: 0; }
    22%  { transform: translateX(-120%); opacity: 0; }
    57%  { transform: translateX(-120%); opacity: 0; }
    58%  { opacity: 0.5; }
    65%  { transform: translateX(160%); opacity: 0.5; }
    69%  { transform: translateX(300%); opacity: 0; }
    70%  { transform: translateX(-120%); opacity: 0; }
    100% { transform: translateX(-120%); opacity: 0; }
  ` : null, [experience]);

  const xpEmberAnim = useMemo(() => experience > 0 ? keyframes`
    0%   { transform: translateY(0) scale(1); opacity: 0.9; }
    100% { transform: translateY(-26px) scale(0.2); opacity: 0; }
  ` : null, [experience]);

  const xpRuneGlowAnim = useMemo(() => experience > 0 ? keyframes`
    0%, 100% { filter: drop-shadow(0 0 2px rgba(218,165,32,0.35)); }
    50%       { filter: drop-shadow(0 0 9px rgba(255,215,0,0.85)); }
  ` : null, [experience]);

  return {
    xpShimmerAnim,
    xpFlashAnim,
    xpRippleAnim,
    xpLevelUpAnim,
    xpShimmerSweepAnim,
    xpEmberAnim,
    xpRuneGlowAnim,
  };
}

// ---------------------------------------------------------------------------
// Energy
// ---------------------------------------------------------------------------

export interface EnergyKeyframes {
  energyPulseAnim: Keyframes | null;
  energySizzleAnim: Keyframes | null;
}

/**
 * Energy-tracker keyframes. `energyStaticShadow` and `sizzleAmp` are derived
 * by the caller and threaded through; original deps were `[player.energy]`
 * on both memos, so we keep that invalidation surface.
 */
export function useEnergyKeyframes(
  energy: number,
  energyStaticShadow: string | undefined,
  sizzleAmp: number,
): EnergyKeyframes {
  const energyPulseAnim = useMemo(() => energy > 5 ? keyframes`
    0%   { text-shadow: ${energyStaticShadow}, 0 0 4px rgba(80,200,255,0.95), 0 0 8px rgba(80,200,255,0.8); }
    100% { text-shadow: ${energyStaticShadow}, 0 0 ${30 + energy * 5}px rgba(80,200,255,0), 0 0 ${60 + energy * 10}px rgba(80,200,255,0); }
  ` : null, [energy]); // eslint-disable-line react-hooks/exhaustive-deps

  const energySizzleAnim = useMemo(() => energy > 5 ? keyframes`
    0%   { transform: translate(0, 0); }
    10%  { transform: translate(${-sizzleAmp}px, ${sizzleAmp * 0.5}px); }
    20%  { transform: translate(${sizzleAmp}px, ${-sizzleAmp}px); }
    30%  { transform: translate(${-sizzleAmp * 0.5}px, ${sizzleAmp}px); }
    40%  { transform: translate(${sizzleAmp}px, ${sizzleAmp * 0.5}px); }
    50%  { transform: translate(${-sizzleAmp}px, ${-sizzleAmp * 0.5}px); }
    60%  { transform: translate(${sizzleAmp * 0.5}px, ${sizzleAmp}px); }
    70%  { transform: translate(${-sizzleAmp}px, ${sizzleAmp * 0.5}px); }
    80%  { transform: translate(${sizzleAmp}px, ${-sizzleAmp * 0.5}px); }
    90%  { transform: translate(${-sizzleAmp * 0.5}px, ${-sizzleAmp}px); }
    100% { transform: translate(0, 0); }
  ` : null, [energy]); // eslint-disable-line react-hooks/exhaustive-deps

  return { energyPulseAnim, energySizzleAnim };
}

// ---------------------------------------------------------------------------
// Damage flash
// ---------------------------------------------------------------------------

/**
 * Static damage-flash keyframe. No inputs, so this is a const at module load
 * — calling sites still consume it through a hook to keep the surface
 * symmetric and to leave room for future variants.
 */
const DAMAGE_FLASH_ANIM = keyframes`
  0%   { text-shadow: 0 0 0px rgba(180,0,0,0); filter: brightness(1); }
  20%  { text-shadow: 0 0 32px rgba(220,0,0,1), 0 0 64px rgba(180,0,0,0.7); filter: brightness(1.8); }
  100% { text-shadow: 0 0 0px rgba(180,0,0,0); filter: brightness(1); }
`;

export function useDamageFlashKeyframe(): Keyframes {
  return DAMAGE_FLASH_ANIM;
}

// ---------------------------------------------------------------------------
// Poison boil
// ---------------------------------------------------------------------------

/**
 * Poison-boil keyframe. Original deps were
 * `[player.poison, poisonBoilAmp, poisonBoilSkew]` — `Amp` and `Skew` are
 * derived from `poison`, so the wider deps array is redundant but harmless.
 * Preserved here verbatim to keep behavior identical.
 */
export function usePoisonBoilKeyframe(
  poison: number,
  poisonBoilAmp: number,
  poisonBoilSkew: number,
): Keyframes | null {
  return useMemo(() => poison >= 8 ? keyframes`
    0%   { transform: translate(0, 0) skew(0deg, 0deg); }
    20%  { transform: translate(${poisonBoilAmp * 0.5}px, ${-poisonBoilAmp}px) skew(${poisonBoilSkew}deg, ${-poisonBoilSkew * 0.4}deg); }
    45%  { transform: translate(${-poisonBoilAmp}px, ${poisonBoilAmp * 0.6}px) skew(${-poisonBoilSkew * 0.7}deg, ${poisonBoilSkew * 0.5}deg); }
    70%  { transform: translate(${poisonBoilAmp * 0.7}px, ${poisonBoilAmp * 0.4}px) skew(${poisonBoilSkew * 0.5}deg, ${-poisonBoilSkew * 0.3}deg); }
    100% { transform: translate(0, 0) skew(0deg, 0deg); }
  ` : null, [poison, poisonBoilAmp, poisonBoilSkew]);
}
