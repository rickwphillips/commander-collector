'use client';

import { usePoisonSound } from './usePoisonSound';
import { useSounds } from './useSounds';
import { useCitysBlessingExit } from './useCitysBlessingExit';

/**
 * Bundles the poison ambience, the City's Blessing sting + firework loop, and
 * the City's Blessing show/hide lifecycle (including the 3.8s fade-out tail and
 * the intro sting on gain) into one call. Used identically by PlayerPanel (per
 * player) and TeamPanel (per team) so the wiring lives in one place.
 *
 * Returns the blessing overlay's `visible` / `exiting` flags to feed <CityBlessing>.
 */
export function useBlessingAndSound(
  hasCitysBlessing: boolean,
  poison: number,
  isEliminated: boolean,
  soundEnabled: boolean,
): { cityBlessingVisible: boolean; cityBlessingExiting: boolean } {
  usePoisonSound(poison, isEliminated, soundEnabled);
  const { playCitysBlessing } = useSounds(soundEnabled, hasCitysBlessing);
  const { cityBlessingVisible, cityBlessingExiting } = useCitysBlessingExit(hasCitysBlessing, playCitysBlessing);
  return { cityBlessingVisible, cityBlessingExiting };
}
