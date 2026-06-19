'use client';

import { useCallback, useMemo } from 'react';
import { PlayerCard, type PlayerCardProps } from './PlayerCard';
import type { PlayerState, CommanderDamageMap } from '../types';

interface ReadOnlyPlayerPanelProps {
  player: PlayerState;
  playerIdx: number;
  allPlayers: PlayerState[];
  commanderDamage: CommanderDamageMap;
  startingLife?: number;
  turnTimerSeconds?: number;
  activePlayerIdx?: number;
}

const noop = () => {};

/**
 * View-only wrapper used when the host opens another player's panel as an
 * overlay. Renders `<PlayerCard />` directly with synthetic prop bundles,
 * skipping the PlayerPanel orchestrator hook tree entirely (no poison sound,
 * monarch transition, citys-blessing exit, long-press, damage flash, XP flash,
 * viewer banner, or art preload). Forces `position: 'bottom'` so the rotated
 * layout renders upright. Interaction is blocked by an absolutely-positioned
 * click-blocker in the parent overlay (see GameBoard.tsx); this component is
 * purely presentational.
 */
export function ReadOnlyPlayerPanel({
  player,
  playerIdx,
  allPlayers,
  commanderDamage,
  startingLife = 40,
  turnTimerSeconds = 300,
  activePlayerIdx: _activePlayerIdx,
}: ReadOnlyPlayerPanelProps) {
  // Force upright orientation for the overlay.
  const forcedPlayer = useMemo<PlayerState>(
    () => ({ ...player, position: 'bottom' }),
    [player],
  );

  // remoteMode is false in the read-only overlay, matching PlayerPanel's
  // default when this wrapper used to render it.
  const remoteMode = false;

  // ─── sizes (purely a function of remoteMode; copied verbatim from PlayerPanel)
  const sizes = useMemo<PlayerCardProps['sizes']>(() => ({
    fsPlayerName:   remoteMode ? 'clamp(13px, 2.0dvmax, 26px)'  : 'clamp(9px,  1.8dvh, 15px)',
    fsDeckName:     remoteMode ? 'clamp(10px, 1.5dvmax, 20px)'  : 'clamp(7px,  1.3dvh, 11px)',
    fsPassBtn:      remoteMode ? 'clamp(13px, 1.8dvmax, 22px)'  : 'clamp(9px,  1.6dvh, 13px)',
    fsHeaderIcon:   remoteMode ? 'clamp(24px, 3.8dvmax, 48px)'  : 'clamp(16px, 3.0dvh, 26px)',
    fsSmallIcon:    remoteMode ? 'clamp(16px, 2.4dvmax, 30px)'  : 'clamp(11px, 2.0dvh, 16px)',
    fsMenuTrigger:  remoteMode ? 'clamp(20px, 2.8dvmax, 36px)'  : 'clamp(14px, 2.2dvh, 20px)',
    fsSectionLabel: remoteMode ? 'clamp(12px, 1.8dvmax, 24px)'  : 'clamp(8px,  1.4dvh, 13px)',
    fsSourceName:   remoteMode ? 'clamp(13px, 2.0dvmax, 28px)'  : 'clamp(10px, 1.9dvh, 18px)',
    fsStatBadge:    remoteMode ? 'clamp(10px, 1.4dvmax, 18px)'  : 'clamp(8px,  1.4dvh, 12px)',
    fsCounterLabel: remoteMode ? 'clamp(14px, 2.4dvmax, 32px)'  : 'clamp(10px, 1.9dvh, 18px)',
    fsCounterValue: remoteMode ? 'clamp(20px, 3.5dvmax, 44px)'  : 'clamp(14px, 2.8dvh, 24px)',
    fsCounterBtn:   remoteMode ? 'clamp(26px, 4.2dvmax, 52px)'  : 'clamp(17px, 3.2dvh, 26px)',
    fsLifeBtn:      remoteMode ? 'clamp(40px, 8.5dvmax, 90px)'  : 'clamp(28px, 7.0dvh, 56px)',
    fsKillPrompt:   remoteMode ? 'clamp(15px, 2.4dvmax, 28px)'  : 'clamp(11px, 2.0dvh, 15px)',
    artHeight:      remoteMode ? 'clamp(40px, 7.5dvmax, 80px)'  : 'clamp(24px, 4.5dvh, 42px)',
    cmdBtnWidth:    remoteMode ? 'clamp(44px, 6.0dvmax, 70px)'  : 'clamp(28px, 5.0dvh, 38px)',
    cmdBtnHeight:   remoteMode ? 'clamp(40px, 5.5dvmax, 64px)'  : 'clamp(26px, 4.5dvh, 36px)',
    valColWidth:    remoteMode ? 'clamp(32px, 6.0dvmax, 58px)'  : 'clamp(24px, 4.5dvh, 36px)',
  }), []);

  // ─── position (forced to 'bottom'; constant bundle)
  const position = useMemo<PlayerCardProps['position']>(() => ({
    ttRotate: '0deg',
    ttHeaderPlacement: 'bottom',
    snapshotPlacement: 'top',
    ttSlotProps: { tooltip: { sx: { rotate: '0deg' } } },
    ttHeaderSlotProps: {
      tooltip: { sx: { rotate: '0deg' } },
      popper: { modifiers: [{ name: 'flip', enabled: false }] },
    },
  }), []);

  // ─── timer (no animations / state in read-only; suppressed)
  const timer = useMemo<PlayerCardProps['timer']>(() => ({
    timerOff: true,
    timerProgress: 0,
    isTimerExpired: false,
    timerColor: 'rgba(0,0,0,0)',
    timerColorRgba: (_alpha: number) => 'rgba(0,0,0,0)',
    currentPlayerBorder: undefined,
    currentPlayerShadow: undefined,
  }), []);

  // ─── animations (all suppressed; blessing decoration still renders if owned)
  const animations = useMemo<PlayerCardProps['animations']>(() => ({
    damageFlash: 0,
    monarchAnim: 'hidden',
    monarchEnterIsTransfer: false,
    cityBlessingVisible: player.hasCitysBlessing,
    cityBlessingExiting: false,
    xpFlashing: false,
    xpRippleKey: 0,
  }), [player.hasCitysBlessing]);

  // ─── viewer (the viewed player isn't "being viewed by viewers" here)
  const viewer = useMemo<PlayerCardProps['viewer']>(() => ({
    isBeingViewedByAnyone: false,
    viewerTooltipText: '',
    viewerBannerVisible: false,
    onEyeIconClick: noop,
  }), []);

  // ─── longPress (noop; the overlay click-blocker swallows everything anyway)
  const longPress = useMemo<PlayerCardProps['longPress']>(() => ({
    lpKey: null,
    startLongPress: noop,
    cancelLongPress: noop,
    guardClick: (cb: () => void) => cb,
  }), []);

  // ─── Derived life / warning values (computed live; copied from PlayerPanel) ─
  function lifeColor(life: number): string {
    if (life <= 0) return '#6B0000';
    if (life > startingLife) {
      const gain = Math.min((life - startingLife) / startingLife, 1);
      const r = Math.round(180 - 140 * gain);
      const g = Math.round(120 + 102 * gain);
      const b = Math.round(60 - 36 * gain);
      return `rgb(${r},${g},${b})`;
    }
    const ratio = Math.max(0, Math.min((startingLife - life) / startingLife, 1));
    if (ratio <= 0) return '';
    const r = Math.round(180 + 71 * ratio);
    const g = Math.round(120 - 120 * ratio);
    const b = Math.round(60 - 60 * ratio);
    return `rgb(${r},${g},${b})`;
  }
  const computedLifeColor = lifeColor(player.life);
  const lostRatio = player.life <= 0 ? 1 : Math.max(0, Math.min((startingLife - player.life) / startingLife, 1));

  const isLifeLow = player.life <= 0;
  const isPoisoned = player.poison >= 10;
  const isCmdDmgHigh = Object.values(commanderDamage[playerIdx] ?? {}).some(
    (dmg) => dmg[0] >= 21 || dmg[1] >= 21
  );
  const isWarning = isLifeLow || isPoisoned || isCmdDmgHigh;

  const crackAlpha = useCallback(
    (from: number) => Math.min(Math.max((lostRatio - from) / 0.15, 0), 1),
    [lostRatio],
  );

  // ─── Source-snapshot renderer: read-only overlay has no CMD damage editing,
  // so no snapshot path is reachable. Return null defensively.
  const renderSourceSnapshot = useCallback(() => null, []);

  // Reference unused props so TS doesn't complain (kept on the public surface
  // for parity with the prior wrapper; the read-only path doesn't use them).
  void _activePlayerIdx;
  void turnTimerSeconds;

  return (
    <PlayerCard
      player={forcedPlayer}
      playerIdx={playerIdx}
      allPlayers={allPlayers}
      commanderDamage={commanderDamage}
      startingLife={startingLife}
      activePlayerIdx={undefined}
      remoteMode={false}
      remoteConnected={false}
      soundEnabled={false}
      highlightMode={false}
      isHighlighted={false}
      isCurrentPlayer={false}
      onLifeChange={noop}
      onPoisonChange={noop}
      onCommanderTaxChange={noop}
      onEnergyChange={noop}
      onExperienceChange={noop}
      onToggleMonarch={noop}
      onToggleInitiative={noop}
      onToggleCitysBlessing={noop}
      onCommanderDamageChange={noop}
      onEliminate={noop}
      onUndoEliminate={noop}
      sizes={sizes}
      position={position}
      timer={timer}
      animations={animations}
      viewer={viewer}
      longPress={longPress}
      threatSource={null}
      computedLifeColor={computedLifeColor}
      lostRatio={lostRatio}
      crackAlpha={crackAlpha}
      isWarning={isWarning}
      renderSourceSnapshot={renderSourceSnapshot}
      handleCmdDmgChange={noop}
    />
  );
}
