import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { PlayerState, CommanderDamageMap } from '@/game-manager/types';

// ─── Spies on the orchestrator-only hooks ─────────────────────────────────────
// Phase 5 wires ReadOnlyPlayerPanel straight to PlayerCard, skipping the
// PlayerPanel orchestrator entirely. The whole perf claim is that none of
// these hooks mount on the read-only path. If a future refactor accidentally
// re-introduces PlayerPanel into this code path, these spies will fire.

const poisonSoundSpy = vi.fn();
const soundsSpy = vi.fn();
const damageFlashSpy = vi.fn();
const monarchTransitionSpy = vi.fn();
const citysBlessingExitSpy = vi.fn();
const longPressSpy = vi.fn();

vi.mock('@/game-manager/hooks/usePoisonSound', () => ({
  usePoisonSound: (...args: unknown[]) => poisonSoundSpy(...args),
}));
vi.mock('@/game-manager/hooks/useSounds', () => ({
  useSounds: (...args: unknown[]) => {
    soundsSpy(...args);
    return { playCitysBlessing: () => {} };
  },
}));
vi.mock('@/game-manager/hooks/useDamageFlash', () => ({
  useDamageFlash: (...args: unknown[]) => {
    damageFlashSpy(...args);
    return 0;
  },
}));
vi.mock('@/game-manager/hooks/useMonarchTransition', () => ({
  useMonarchTransition: (...args: unknown[]) => {
    monarchTransitionSpy(...args);
    return { monarchAnim: 'hidden' as const, monarchEnterIsTransfer: false };
  },
}));
vi.mock('@/game-manager/hooks/useCitysBlessingExit', () => ({
  useCitysBlessingExit: (...args: unknown[]) => {
    citysBlessingExitSpy(...args);
    return { cityBlessingVisible: false, cityBlessingExiting: false };
  },
}));
vi.mock('@/game-manager/hooks/useLongPress', () => ({
  useLongPress: () => {
    longPressSpy();
    return {
      lpKey: null,
      startLongPress: () => {},
      cancelLongPress: () => {},
      guardClick: (cb: () => void) => cb,
    };
  },
}));

// ─── Stub PlayerCard so we can assert what props the wrapper feeds it ────────
// PlayerCard is 2,500+ LOC and pulls in a big MUI tree; stubbing keeps the
// test focused on ReadOnlyPlayerPanel's responsibilities (synthetic bundles +
// no orchestrator hooks).
const playerCardSpy = vi.fn();
vi.mock('@/game-manager/components/PlayerCard', () => ({
  PlayerCard: (props: Record<string, unknown>) => {
    playerCardSpy(props);
    return <div data-testid="player-card-stub" />;
  },
}));

// Imported after mocks so the wrapper picks up the stubbed PlayerCard.
import { ReadOnlyPlayerPanel } from '@/game-manager/components/ReadOnlyPlayerPanel';

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    playerId: 'p1',
    deckId: 'd1',
    playerName: 'Rick',
    deckName: 'Atraxa',
    commander: { name: 'Atraxa, Praetors\' Voice' },
    position: 'top', // Force non-bottom so we can verify the wrapper overrides it.
    life: 28,
    poison: 0,
    commanderTax: 0,
    isMonarch: false,
    hasInitiative: false,
    hasCitysBlessing: false,
    energy: 0,
    experience: 0,
    isEliminated: false,
    isConceded: false,
    eliminatedTurn: null,
    ...overrides,
  };
}

describe('ReadOnlyPlayerPanel', () => {
  const commanderDamage: CommanderDamageMap = {};

  it('renders without throwing', () => {
    const { getByTestId } = render(
      <ReadOnlyPlayerPanel
        player={makePlayer()}
        playerIdx={0}
        allPlayers={[makePlayer()]}
        commanderDamage={commanderDamage}
        startingLife={40}
      />,
    );
    expect(getByTestId('player-card-stub')).toBeInTheDocument();
    expect(playerCardSpy).toHaveBeenCalledTimes(1);
  });

  it('does not mount any PlayerPanel orchestrator hooks', () => {
    poisonSoundSpy.mockClear();
    soundsSpy.mockClear();
    damageFlashSpy.mockClear();
    monarchTransitionSpy.mockClear();
    citysBlessingExitSpy.mockClear();
    longPressSpy.mockClear();

    render(
      <ReadOnlyPlayerPanel
        player={makePlayer({ poison: 8, isMonarch: true, hasCitysBlessing: true })}
        playerIdx={0}
        allPlayers={[makePlayer()]}
        commanderDamage={commanderDamage}
        startingLife={40}
      />,
    );

    expect(poisonSoundSpy).not.toHaveBeenCalled();
    expect(soundsSpy).not.toHaveBeenCalled();
    expect(damageFlashSpy).not.toHaveBeenCalled();
    expect(monarchTransitionSpy).not.toHaveBeenCalled();
    expect(citysBlessingExitSpy).not.toHaveBeenCalled();
    expect(longPressSpy).not.toHaveBeenCalled();
  });

  it('forces position to bottom regardless of the source player position', () => {
    playerCardSpy.mockClear();
    render(
      <ReadOnlyPlayerPanel
        player={makePlayer({ position: 'left' })}
        playerIdx={0}
        allPlayers={[makePlayer()]}
        commanderDamage={commanderDamage}
        startingLife={40}
      />,
    );
    const props = playerCardSpy.mock.calls[0][0] as { player: PlayerState };
    expect(props.player.position).toBe('bottom');
  });

  it('passes the synthetic suppressed bundles to PlayerCard', () => {
    playerCardSpy.mockClear();
    render(
      <ReadOnlyPlayerPanel
        player={makePlayer({ hasCitysBlessing: true })}
        playerIdx={0}
        allPlayers={[makePlayer()]}
        commanderDamage={commanderDamage}
        startingLife={40}
      />,
    );
    const props = playerCardSpy.mock.calls[0][0] as Record<string, any>;

    // Mode flags are hard off in the read-only overlay.
    expect(props.remoteMode).toBe(false);
    expect(props.soundEnabled).toBe(false);
    expect(props.highlightMode).toBe(false);
    expect(props.isHighlighted).toBe(false);
    expect(props.isCurrentPlayer).toBe(false);

    // Timer suppressed (transparent color, off).
    expect(props.timer.timerOff).toBe(true);
    expect(props.timer.timerProgress).toBe(0);
    expect(props.timer.isTimerExpired).toBe(false);
    expect(props.timer.currentPlayerBorder).toBeUndefined();
    expect(props.timer.currentPlayerShadow).toBeUndefined();

    // Animations suppressed; blessing decoration still renders if owned.
    expect(props.animations.damageFlash).toBe(0);
    expect(props.animations.monarchAnim).toBe('hidden');
    expect(props.animations.monarchEnterIsTransfer).toBe(false);
    expect(props.animations.cityBlessingVisible).toBe(true); // player has blessing
    expect(props.animations.cityBlessingExiting).toBe(false);
    expect(props.animations.xpFlashing).toBe(false);
    expect(props.animations.xpRippleKey).toBe(0);

    // Viewer banner suppressed (the viewed player isn't being viewed by viewers).
    expect(props.viewer.isBeingViewedByAnyone).toBe(false);
    expect(props.viewer.viewerTooltipText).toBe('');
    expect(props.viewer.viewerBannerVisible).toBe(false);

    // Long-press is noop with passthrough guard.
    expect(props.longPress.lpKey).toBeNull();
    const sentinel = vi.fn();
    props.longPress.guardClick(sentinel)();
    expect(sentinel).toHaveBeenCalledTimes(1);

    // Threat highlighting off.
    expect(props.threatSource).toBeNull();

    // Position forced upright.
    expect(props.position.ttRotate).toBe('0deg');
    expect(props.position.ttHeaderPlacement).toBe('bottom');
  });

  it('computes lostRatio and isWarning from player state', () => {
    playerCardSpy.mockClear();
    render(
      <ReadOnlyPlayerPanel
        player={makePlayer({ life: 10, poison: 10 })}
        playerIdx={0}
        allPlayers={[makePlayer()]}
        commanderDamage={commanderDamage}
        startingLife={40}
      />,
    );
    const props = playerCardSpy.mock.calls[0][0] as {
      lostRatio: number;
      isWarning: boolean;
      crackAlpha: (from: number) => number;
    };
    // 30/40 life lost.
    expect(props.lostRatio).toBeCloseTo(0.75, 5);
    // Poison >= 10 triggers warning.
    expect(props.isWarning).toBe(true);
    // crackAlpha is clamped 0..1 with denominator 0.15.
    expect(props.crackAlpha(0.75)).toBe(0);
    expect(props.crackAlpha(0)).toBe(1);
  });

  it('feeds noop handlers for every mutation prop', () => {
    playerCardSpy.mockClear();
    render(
      <ReadOnlyPlayerPanel
        player={makePlayer()}
        playerIdx={0}
        allPlayers={[makePlayer()]}
        commanderDamage={commanderDamage}
        startingLife={40}
      />,
    );
    const props = playerCardSpy.mock.calls[0][0] as Record<string, unknown>;
    const handlerKeys = [
      'onLifeChange',
      'onPoisonChange',
      'onCommanderTaxChange',
      'onEnergyChange',
      'onExperienceChange',
      'onToggleMonarch',
      'onToggleInitiative',
      'onToggleCitysBlessing',
      'onCommanderDamageChange',
      'onEliminate',
      'onUndoEliminate',
      'handleCmdDmgChange',
    ];
    for (const key of handlerKeys) {
      expect(typeof props[key]).toBe('function');
      // Calling should not throw.
      expect(() => (props[key] as (...a: unknown[]) => unknown)(0, 0, false, 1)).not.toThrow();
    }
  });
});
