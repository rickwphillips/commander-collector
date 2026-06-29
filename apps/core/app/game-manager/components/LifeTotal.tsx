'use client';

/**
 * LifeTotal — the shared big life number plus its full reaction stack, used by
 * both the standard 4-player PlayerCard and the 2HG TeamPanel so the two render
 * the exact same effects from one source.
 *
 * Every reaction is param-driven and individually toggleable:
 *   - flash:  red damage flash when `damageFlash > 0` (a fresh hit)
 *   - swipes: red "claw" slashes during a flash (5-claw rake when damageFlash >= 5)
 *   - energy: blue pulse + sizzle when `energy > 5`
 *   - poison: green boil when `poison >= 8`
 * Precedence matches PlayerCard: an active flash overrides the idle energy/poison
 * animations; energy outranks poison.
 *
 * The team panel feeds the HIGHEST value across its players (e.g. the larger of
 * the two teammates' energy) so the shared readout reacts the instant any player
 * raises their counter. Poison/life are already mirrored across heads, so their
 * single shared value is the team value.
 *
 * STRUCTURE: this renders the number and the swipe slashes as SIBLINGS (no
 * wrapper element). The swipe boxes are sized as a percentage of the nearest
 * positioned ancestor, so the CALLER must provide a `position: relative` parent
 * when swipes are enabled (PlayerCard's card body already is). This keeps the
 * 4-player swipe scale byte-identical to the pre-extraction inline version.
 */
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useDamageFlashKeyframe, useEnergyKeyframes, usePoisonBoilKeyframe } from './PlayerCard.keyframes';

type LifeColor = string | ((theme: Theme) => string);

export interface LifeTotalReactions {
  flash?: boolean;
  swipes?: boolean;
  energy?: boolean;
  poison?: boolean;
}

export interface LifeTotalProps {
  value: number;
  fontSize: string;
  color?: LifeColor;
  onClick?: () => void;
  /** Hit magnitude. 0 = no flash; >= 5 escalates to the five-claw swipe. */
  damageFlash?: number;
  /** Highest team energy; drives the blue pulse/sizzle when > 5. */
  energy?: number;
  /** Shared poison; drives the green boil when >= 8. */
  poison?: number;
  /** Per-reaction enable flags. All default to true. */
  reactions?: LifeTotalReactions;
  /** Extra sx merged onto the number (font weight/size handled internally). */
  sx?: SxProps<Theme>;
}

const SWIPE_BASE = {
  position: 'absolute' as const,
  top: '44%',
  left: 0,
  width: '70%',
  height: '10%',
  pointerEvents: 'none' as const,
};

const SWIPES = [
  { name: 'lifeSwipe1', big: false, fade: false, bg: 'linear-gradient(to right, transparent, rgba(200,0,0,0.5) 35%, rgba(235,0,0,0.88) 50%, rgba(200,0,0,0.5) 65%, transparent)', anim: 'lifeSwipe1 0.6s ease-in forwards', from: 'translate(-170%, -300%) rotate(22deg)', to: 'translate(370%, 300%) rotate(22deg)' },
  { name: 'lifeSwipe2', big: false, fade: true, bg: 'linear-gradient(to left, transparent, rgba(180,0,0,0.45) 35%, rgba(215,0,0,0.78) 50%, rgba(180,0,0,0.45) 65%, transparent)', anim: 'lifeSwipe2 0.6s ease-in 0.12s forwards', from: 'translate(-170%, 300%) rotate(-16deg)', to: 'translate(370%, -300%) rotate(-16deg)' },
  { name: 'lifeSwipe3', big: true, fade: true, bg: 'linear-gradient(to left, transparent, rgba(220,0,0,0.4) 35%, rgba(255,20,20,0.68) 50%, rgba(220,0,0,0.4) 65%, transparent)', anim: 'lifeSwipe3 0.58s ease-in 0.28s forwards', from: 'translate(370%, -300%) rotate(30deg)', to: 'translate(-170%, 300%) rotate(30deg)' },
  { name: 'lifeSwipe4', big: true, fade: true, bg: 'linear-gradient(to left, transparent, rgba(200,0,0,0.38) 35%, rgba(235,10,10,0.62) 50%, rgba(200,0,0,0.38) 65%, transparent)', anim: 'lifeSwipe4 0.6s ease-in 0.4s forwards', from: 'translate(370%, 300%) rotate(-22deg)', to: 'translate(-170%, -300%) rotate(-22deg)' },
  { name: 'lifeSwipe5', big: true, fade: true, bg: 'linear-gradient(to right, transparent, rgba(180,0,0,0.35) 35%, rgba(220,10,10,0.58) 50%, rgba(180,0,0,0.35) 65%, transparent)', anim: 'lifeSwipe5 0.58s ease-in 0.54s forwards', from: 'translate(-170%, -350%) rotate(38deg)', to: 'translate(370%, 350%) rotate(38deg)' },
];

export function LifeTotal({
  value,
  fontSize,
  color,
  onClick,
  damageFlash = 0,
  energy = 0,
  poison = 0,
  reactions,
  sx,
}: LifeTotalProps) {
  const enabled = { flash: true, swipes: true, energy: true, poison: true, ...reactions };

  // Same derivations PlayerCard used inline, now computed once here.
  const damageFlashAnim = useDamageFlashKeyframe();

  const energyStaticShadow = energy > 5 ? `0 0 18px rgba(30,100,210,0.55), 0 0 36px rgba(20,70,180,0.3)` : undefined;
  const sizzleAmp = Math.min(energy - 5, 10) * 0.2;
  const { energyPulseAnim, energySizzleAnim } = useEnergyKeyframes(energy, energyStaticShadow, sizzleAmp);
  const energyPulseDuration = energy > 5 ? Math.max(0.8, 2.5 - (energy - 5) * 0.09) : 2.5;

  const poisonBoilAmp = poison >= 10 ? 5 : poison === 9 ? 3.8 : poison === 8 ? 1.5 : 0;
  const poisonBoilSkew = Math.min(poisonBoilAmp * 0.6, 2.5);
  const poisonBoilAnim = usePoisonBoilKeyframe(poison, poisonBoilAmp, poisonBoilSkew);
  const poisonBoilDuration = poison >= 10 ? 2.0 : poison >= 9 ? 2.5 : 5.0;

  const flashing = enabled.flash && damageFlash > 0;
  const energetic = enabled.energy && energyPulseAnim;
  const boiling = enabled.poison && poisonBoilAnim;

  const slashes = damageFlash >= 5 ? SWIPES : SWIPES.filter((s) => !s.big);

  return (
    <>
      <Typography
        onClick={onClick}
        sx={{
          position: 'relative',
          zIndex: 1,
          fontWeight: 900,
          fontSize,
          lineHeight: 1,
          ...(onClick && { cursor: 'pointer' }),
          color: color ?? ((theme: Theme) => theme.palette.primary.main),
          transition: 'color 0.4s ease, font-size 0.2s ease',
          ...(flashing && { animation: `${damageFlashAnim} 0.6s ease-out forwards` }),
          ...(!flashing && energetic && { animation: `${energyPulseAnim} ${energyPulseDuration.toFixed(2)}s ease-out infinite, ${energySizzleAnim} 0.12s linear infinite` }),
          ...(!flashing && !energetic && boiling && { animation: `${poisonBoilAnim} ${poisonBoilDuration}s ease-in-out infinite` }),
          ...sx,
        }}
      >
        {value}
      </Typography>
      {flashing && enabled.swipes && slashes.map((s) => (
        <Box
          key={s.name}
          sx={{
            ...SWIPE_BASE,
            background: s.bg,
            ...(s.fade && { opacity: 0 }),
            animation: s.anim,
            [`@keyframes ${s.name}`]: {
              '0%': { transform: s.from, ...(s.fade && { opacity: 1 }) },
              '100%': { transform: s.to, ...(s.fade && { opacity: 1 }) },
            },
          }}
        />
      ))}
    </>
  );
}
