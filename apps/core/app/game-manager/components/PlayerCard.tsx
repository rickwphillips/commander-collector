'use client';

import { memo, useEffect, useState } from 'react';
import { Box, Button, IconButton, Stack, SvgIcon, TextField, Tooltip, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { remoteDrawerOuterSx, remoteDrawerContentSx, remoteDrawerRailSx, remoteDrawerChevronSx } from './remoteDrawerSx';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChatIcon from '@mui/icons-material/Chat';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InitiativeIcon from '@mui/icons-material/Castle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ElimIcon from '@mui/icons-material/PersonOff';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { QRCodeSVG } from 'qrcode.react';
import { useCommanderPreview } from './useCommanderPreview';
import { ASSET_BASE, remoteQrOrigin } from '@/lib/api';
import { CommanderArt, CommanderArtBg, CommanderBackdrop, BACKDROP_FADE_MS } from './CommanderArt';
import { ControlFocusModal } from './ControlFocusModal';
import { StepperControl, StepperOverlayHost } from './StepperControl';
import { isControlGlassActive } from './controlGlass';
import { GlassBacking } from './GlassBacking';
import { CounterGlyph, XP_ICON_SRC } from './CounterGlyph';
import { XpBadge } from './XpBadge';
import { LifeTotal } from './LifeTotal';
import { useXpKeyframes } from './PlayerCard.keyframes';
import { xpGlowFor, energyGlowFor, counterValueSx, poisonBlur } from './counterEffects';
import { PoisonOverlay } from './PoisonOverlay';
import { LifeCracks } from './LifeCracks';
import { CityBlessing } from './CityBlessing';
import { InitiativeTorch } from './InitiativeTorch';
import { CrownIcon, MonarchCrown, monarchCrownAnim } from './MonarchCrown';
import { EliminatedOverlay } from './EliminatedOverlay';
import { TurnNavControl } from './TurnNavControl';
import type { ThreatSource } from '@/game-manager/threatSource';
import { ThreatNames } from './ThreatNames';

// Singles poison is lethal at 10; the danger pulse fires one below.
const POISON_DANGER_SINGLES = 9;
import { useLocalStorageBool } from '@/game-manager/hooks/useLocalStorageBool';
import { remoteLifeFontSize } from '@/game-manager/lifeFontSize';
import { TIMER_EXPIRED_BORDER_BLINK, TIMER_EXPIRED_HEADER_BLINK } from '@/game-manager/hooks/useTimerTokens';
import type { TimerTokens } from '@/game-manager/hooks/useTimerTokens';

// Local glyphs duplicated from PlayerPanel. Phase 3 will fold both into a
// shared icons module along with the keyframes.
const CityIcon = ({ active, ...props }: React.ComponentProps<typeof SvgIcon> & { active?: boolean }) => (
  <SvgIcon {...props} viewBox="0 0 1024 1024">
    {active && (
      <defs>
        <linearGradient id="cityGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E040FB" />
          <stop offset="50%" stopColor="#7851A9" />
          <stop offset="100%" stopColor="#311B92" />
        </linearGradient>
      </defs>
    )}
    <path fill={active ? 'url(#cityGradCard)' : 'currentColor'} d="M503.612.522c5.954-.16 11.908-.32 17.862-.522 11.304 64.93 18.666 130.504 28.924 195.596 51.816 6.276 101.46 25.586 144.826 54.55 37.576-10.66 75.028-21.764 112.604-32.504-10.42 36.206-21.362 72.332-31.702 108.578-2.052 5.03 2.656 9.334 4.626 13.558 26.754 40.51 42.524 87.498 48.84 135.492 64.688 9.374 129.336 18.908 194.026 28.402.04 5.994.12 12.03.242 18.104-64.77 10.822-130.062 18.344-194.912 28.684-6.156 51.896-26.35 101.256-55.316 144.544 10.982 37.896 22.488 75.632 33.068 113.648-38.58-10.742-76.758-22.93-115.378-33.592-42.402 28.724-91.642 45.782-142.17 52.742-9.454 65.252-18.828 130.544-28.402 195.796-6.074.12-12.15.242-18.184.402-9.936-62.316-18.022-124.952-27.154-187.428-1.086-3.862-.846-10.862-6.598-10.622-48.638-6.436-94.66-25.666-135.694-52.178-39.144 11.426-78.206 23.174-117.43 34.276 10.58-38.096 22.528-75.792 33.23-113.848 2.252-5.432-2.736-10.098-4.868-14.604-24.702-38.982-40.27-83.638-45.7-129.458-65.736-11.104-131.994-19.27-197.89-29.368-.12-6.074-.2-12.19-.322-18.224 65.896-10.822 132.356-18.144 198.17-29.328 5.352-50.206 24.622-97.958 51.656-140.28-10.984-38.902-22.488-77.642-33.632-116.464 38.7 11.144 77.2 23.052 116.022 33.712 42.482-29.448 91.964-47.148 142.854-54.912 9.212-64.97 18.908-129.82 28.402-194.752zm-47.914 270.302c-33.47 8.006-65.13 23.294-92.526 44.132-5.432 3.742-10.54 10.018-8.852 17.058 1.852 7.844 9.696 11.706 15.448 16.494 23.494 16.776 46.064 34.878 69.798 51.332 8.69 5.994 21.644-.724 22.128-11.184 5.51-33.712 10.136-67.584 15.004-101.378 2.576-11.546-10.458-21.12-21-16.454zm104.074-1.488c-8.448 1.81-13.678 10.782-11.424 19.068 4.344 32.224 9.05 64.408 13.718 96.552.442 7.442 4.546 16.01 12.832 16.896 7.806 1.528 13.718-4.708 19.672-8.57 23.576-18.022 47.994-34.878 71.328-53.222 8.81-5.794 7.282-19.714-1.61-24.662-30.412-23.132-66.458-41.034-104.516-46.062zM326.28 354.22c-7.602 2.736-11.586 10.298-16.172 16.374-17.862 26.43-31.66 56.04-37.936 87.418-2.976 9.696 6.478 20.074 16.374 17.982 33.39-4.506 66.82-9.01 100.09-14.322 12.23-.32 17.782-16.332 9.656-24.86-17.38-24.138-35.362-47.834-52.862-71.85-4.304-6.156-10.822-12.954-19.15-10.742zm362.468.08c-19.472 21.242-34.718 46.184-52.74 68.712-5.714 8.972-16.816 17.58-13.156 29.448 3.54 9.334 14.442 9.616 22.77 11.104 31.178 4.224 62.276 9.414 93.494 13.436 10.138 1.892 19.31-9.132 15.97-18.868-7.644-35.722-23.694-69.838-46.344-98.48-4.264-6.598-12.994-8.892-19.994-5.352zM282.672 547.604c-7.604 2.574-12.834 10.66-10.218 18.666 7.482 34.798 23.212 67.988 45.178 95.986 5.108 8.088 17.982 9.214 23.654 1.168 17.782-22.57 34.236-46.144 51.736-68.914 4.706-6.678 11.948-14.28 8.126-23.092-3.34-10.902-17.018-9.412-25.988-11.626-30.856-3.46-61.512-10.378-92.488-12.188zm422.168 5.028c-24.178 3.902-48.598 6.154-72.614 10.902-10.5 2.052-13.84 16.414-6.84 23.936 18.586 25.626 37.534 51.012 56.564 76.356 5.47 10.138 20.758 10.098 26.35.08 23.252-30.454 42.24-66.458 46.786-104.758-8.368-20.556-34.074-6.476-50.246-6.516zm-265.434 71.086c-23.936 16.372-46.546 34.556-70.16 51.372-6.316 5.07-15.488 10.098-15.046 19.43.724 8.168 8.448 12.834 14.282 17.42 26.752 18.948 57.044 33.43 89.148 40.35 9.976 3.38 20.638-6.638 18.424-16.736-4.626-33.55-9.132-67.142-14.442-100.572-.28-10.54-13.596-17.46-22.206-11.264zm129.016.562c-6.356 3.258-5.994 11.788-7.604 17.822-4.384 31.016-9.052 62.034-13.396 93.09-2.976 10.622 7.926 21.806 18.626 18.024 35.322-7.524 68.994-23.092 97.556-45.138 8.288-4.948 9.938-17.66 1.892-23.614-24.782-19.512-50.568-37.776-75.712-56.844-5.794-5.07-14.402-8.046-21.362-3.34z" />
  </SvgIcon>
);
import type { PlayerState, CommanderDamageMap } from '../types';
import type { MonarchAnim } from '@/game-manager/hooks/useMonarchTransition';

// ─── Local keyframes / constants used by migrated render blocks ────────────
// Phase 3 will sweep cross-component keyframes into a shared module. For now
// each block owns whatever it needs.

/**
 * Presentational counterpart of PlayerPanel. All behavior hooks live in the
 * orchestrator (PlayerPanel.tsx); this component receives fully-computed props
 * and renders JSX. Wrapped in React.memo with a custom comparator so a life
 * change in one seat re-renders only that seat's card, not all four.
 *
 * Phase 2 migration in progress: render JSX is moving here from PlayerPanel one
 * logical block at a time. PlayerCard is not yet imported anywhere — PlayerPanel
 * still owns the real render. The card is being built in parallel; the wire-up
 * happens in Phase 4.
 *
 * Card-local UI state (qrOpen, countersOpen, eliminateTurnInput, etc.) lives
 * inside the card via useState — the orchestrator never reads it. Refs to
 * card-rendered DOM (cmdScrollRef) live here too. Derived values that follow a
 * pure function of props (showCrown, monarchAnimStr) are computed in render.
 */

// ─── Discriminated unions used by callbacks ────────────────────────────────
// The hero life readout is the only control that still routes through the
// card-level focus modal; compact counters own their modal via StepperControl.
export type FocusedControl = { type: 'life' } | null;

export interface KillOpponent {
  name: string;
  idx: number;
}

// ─── Fluid size tokens (computed in orchestrator from remoteMode) ──────────
export interface SizeTokens {
  fsPlayerName: string;
  fsDeckName: string;
  fsPassBtn: string;
  fsHeaderIcon: string;
  fsSmallIcon: string;
  fsMenuTrigger: string;
  fsSectionLabel: string;
  fsSourceName: string;
  fsStatBadge: string;
  fsCounterLabel: string;
  fsCounterValue: string;
  fsCounterBtn: string;
  fsLifeBtn: string;
  fsKillPrompt: string;
  artHeight: string;
  cmdBtnWidth: string;
  cmdBtnHeight: string;
  valColWidth: string;
}

// ─── Position-derived rotation/placement values ────────────────────────────
export interface PositionTokens {
  ttRotate: string;
  ttHeaderPlacement: 'top' | 'bottom' | 'left' | 'right';
  snapshotPlacement: 'top' | 'bottom' | 'left' | 'right';
  ttSlotProps: { tooltip: { sx: { rotate: string } } };
  ttHeaderSlotProps: {
    tooltip: { sx: { rotate: string } };
    popper: { modifiers: { name: string; enabled: boolean }[] };
  };
}

// ─── Timer presentation (derived via useTimerTokens; re-exported for callers) ─
export type { TimerTokens };

// ─── Animation flags surfaced from extracted hooks ─────────────────────────
export interface AnimationFlags {
  /** Damage-flash counter (changes trigger flash). 0 = no flash. */
  damageFlash: number;
  /**
   * Monarch crown lifecycle from `useMonarchTransition`. The card derives
   * `showCrown` and the crown animation CSS from this value.
   */
  monarchAnim: MonarchAnim;
  monarchEnterIsTransfer: boolean;
  /** Citys-blessing render gate (visible includes exit animation tail). */
  cityBlessingVisible: boolean;
  cityBlessingExiting: boolean;
  /** XP +1 transient flash + ripple key. */
  xpFlashing: boolean;
  xpRippleKey: number;
}

// ─── Viewer/eye-icon presentation ──────────────────────────────────────────
export interface ViewerProps {
  isBeingViewedByAnyone: boolean;
  viewerTooltipText: string;
  viewerBannerVisible: boolean;
  /** Click handler for the eye icon — triggers banner ping in orchestrator. */
  onEyeIconClick: () => void;
}

// ─── Long-press hook surfaces (handlers + render key) ──────────────────────
// Signatures mirror `useLongPress` exactly so consumers can pass the bundle
// straight through without adapter shims.
export interface LongPressHandlers {
  lpKey: string | null;
  startLongPress: (key: string, onTrigger: () => void) => void;
  cancelLongPress: () => void;
  guardClick: (cb: () => void) => () => void;
}

// ─── Threat-source derivation (computed in orchestrator from cmd damage) ───
// Threat type lives in the shared threatSource module; re-export for prop consumers.
export type { ThreatSource };

// ─── Full prop surface ─────────────────────────────────────────────────────
export interface PlayerCardProps {
  // Identity / core state
  player: PlayerState;
  playerIdx: number;
  allPlayers: PlayerState[];
  commanderDamage: CommanderDamageMap;
  startingLife: number;
  activePlayerIdx?: number;
  /**
   * Staggered backdrop reveal: ms to wait before this seat's background art (or
   * name fallback) pops in. `null` keeps it hidden (no first player yet); a
   * number reveals it in turn order once the game starts.
   */
  bgRevealDelayMs?: number | null;
  /** Flash at the end of the backdrop reveal (initial intro sequence only). */
  bgRevealFlash?: boolean;

  // Mode flags
  remoteMode: boolean;
  seatCode?: string;
  remoteConnected: boolean;
  soundEnabled: boolean;
  highlightMode: boolean;
  isHighlighted: boolean;
  isCurrentPlayer: boolean;
  /** Gates the active-turn highlight (border / shadow / header gradient). Held
   *  off during the initial backdrop intro, then enabled once it completes. */
  turnIndicatorEnabled?: boolean;
  themeMode?: 'light' | 'dark';

  // Kill prompts (passed through from orchestrator)
  lifeKillOpponents?: KillOpponent[];
  poisonKillOpponents?: KillOpponent[];

  // Counter / state mutation handlers
  onLifeChange: (idx: number, delta: number) => void;
  onPoisonChange: (idx: number, delta: number) => void;
  onCommanderTaxChange: (idx: number, delta: number, isPartner?: boolean) => void;
  onEnergyChange: (idx: number, delta: number) => void;
  onExperienceChange: (idx: number, delta: number) => void;
  onToggleMonarch: (idx: number) => void;
  onToggleInitiative: (idx: number) => void;
  onToggleCitysBlessing: (idx: number) => void;
  onCommanderDamageChange: (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => void;
  onEliminate: (idx: number) => void;
  onUndoEliminate: (idx: number) => void;
  onPassTurn?: () => void;
  /** Step the turn backwards (remote turn control). */
  onPrevTurn?: () => void;
  onLifeKillSelect?: (sourceIdx: number | null) => void;
  onPoisonKillSelect?: (sourceIdx: number | null) => void;
  onSwitchToPlayer?: (targetIdx: number) => void;
  onToggleTheme?: () => void;
  onToggleSound?: () => void;
  onOpenChat?: (playerName: string) => void;
  /** Remote only: open the game-log viewer (far-right of the turn footer). */
  onOpenLog?: () => void;

  // Derived value bundles
  sizes: SizeTokens;
  position: PositionTokens;
  timer: TimerTokens;
  animations: AnimationFlags;
  viewer: ViewerProps;
  longPress: LongPressHandlers;

  // Other orchestrator-derived values
  threatSource: ThreatSource | null;
  computedLifeColor: string;
  lostRatio: number;
  crackAlpha: (from: number) => number;
  isWarning: boolean;

  // CMD damage source-snapshot renderer (orchestrator closure over allPlayers / cmd damage)
  renderSourceSnapshot: (src: PlayerState, srcIdx: number) => React.ReactNode;

  // Commander damage change wrapper (orchestrator memoizes; includes setLastCmdDmgSourceIdx)
  handleCmdDmgChange: (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => void;
}

// ─── Custom memo comparator ────────────────────────────────────────────────
// Strategy: rely on the orchestrator to pass stable references for arrays,
// objects, and handlers. Compare scalars by value, references by identity.
// Bundles (sizes/position/timer/animations/viewer/longPress) are expected to
// be stable references unless their contents actually change — the orchestrator
// will memoize each bundle so this comparator can rely on reference equality.
function arePlayerCardPropsEqual(prev: PlayerCardProps, next: PlayerCardProps): boolean {
  return (
    prev.player === next.player &&
    prev.allPlayers === next.allPlayers &&
    prev.commanderDamage === next.commanderDamage &&
    prev.playerIdx === next.playerIdx &&
    prev.startingLife === next.startingLife &&
    prev.activePlayerIdx === next.activePlayerIdx &&
    prev.bgRevealDelayMs === next.bgRevealDelayMs &&
    prev.bgRevealFlash === next.bgRevealFlash &&
    prev.remoteMode === next.remoteMode &&
    prev.seatCode === next.seatCode &&
    prev.remoteConnected === next.remoteConnected &&
    prev.soundEnabled === next.soundEnabled &&
    prev.highlightMode === next.highlightMode &&
    prev.isHighlighted === next.isHighlighted &&
    prev.isCurrentPlayer === next.isCurrentPlayer &&
    prev.turnIndicatorEnabled === next.turnIndicatorEnabled &&
    prev.themeMode === next.themeMode &&
    prev.lifeKillOpponents === next.lifeKillOpponents &&
    prev.poisonKillOpponents === next.poisonKillOpponents &&
    prev.sizes === next.sizes &&
    prev.position === next.position &&
    prev.timer === next.timer &&
    prev.animations === next.animations &&
    prev.viewer === next.viewer &&
    prev.longPress === next.longPress &&
    prev.threatSource === next.threatSource &&
    prev.computedLifeColor === next.computedLifeColor &&
    prev.lostRatio === next.lostRatio &&
    prev.crackAlpha === next.crackAlpha &&
    prev.isWarning === next.isWarning &&
    prev.renderSourceSnapshot === next.renderSourceSnapshot &&
    prev.handleCmdDmgChange === next.handleCmdDmgChange &&
    // handlers — identity check (orchestrator must memoize)
    prev.onLifeChange === next.onLifeChange &&
    prev.onPoisonChange === next.onPoisonChange &&
    prev.onCommanderTaxChange === next.onCommanderTaxChange &&
    prev.onEnergyChange === next.onEnergyChange &&
    prev.onExperienceChange === next.onExperienceChange &&
    prev.onToggleMonarch === next.onToggleMonarch &&
    prev.onToggleInitiative === next.onToggleInitiative &&
    prev.onToggleCitysBlessing === next.onToggleCitysBlessing &&
    prev.onCommanderDamageChange === next.onCommanderDamageChange &&
    prev.onEliminate === next.onEliminate &&
    prev.onUndoEliminate === next.onUndoEliminate &&
    prev.onPassTurn === next.onPassTurn &&
    prev.onPrevTurn === next.onPrevTurn &&
    prev.onLifeKillSelect === next.onLifeKillSelect &&
    prev.onPoisonKillSelect === next.onPoisonKillSelect &&
    prev.onSwitchToPlayer === next.onSwitchToPlayer &&
    prev.onToggleTheme === next.onToggleTheme &&
    prev.onToggleSound === next.onToggleSound &&
    prev.onOpenChat === next.onOpenChat &&
    prev.onOpenLog === next.onOpenLog
  );
}

function PlayerCardImpl(props: PlayerCardProps) {
  const {
    viewer, sizes, position, timer, animations, longPress,
    player, playerIdx, allPlayers, commanderDamage, computedLifeColor,
    isCurrentPlayer, highlightMode, isHighlighted, isWarning,
    seatCode, remoteConnected, remoteMode, soundEnabled, themeMode,
    lifeKillOpponents, onLifeKillSelect, poisonKillOpponents, onPoisonKillSelect,
    onLifeChange, onPoisonChange, onEnergyChange, onExperienceChange, onCommanderTaxChange,
    handleCmdDmgChange,
    onToggleMonarch, onToggleInitiative, onToggleCitysBlessing,
    onEliminate, onUndoEliminate, onPassTurn, onPrevTurn,
    onSwitchToPlayer,
    onToggleSound, onToggleTheme, onOpenChat, onOpenLog,
    threatSource, crackAlpha,
  } = props;
  const { lpKey, startLongPress, cancelLongPress, guardClick } = longPress;
  const isPoisoned = player.poison >= 10;

  // ─── Card-local UI state ────────────────────────────────────────────────
  // None of this state is read by the orchestrator or any sibling. Lifting it
  // would just add prop noise and break memoization. It stays here.
  const [eliminateTurnInput, setEliminateTurnInput] = useState('');
  const [showEliminateConfirm, setShowEliminateConfirm] = useState(false);
  const [stateMenuOpen, setStateMenuOpen] = useState(false);
  const [rulesOpenLabel, setRulesOpenLabel] = useState<string | null>(null);
  const toggleRules = (label: string) => setRulesOpenLabel(l => l === label ? null : label);

  // Auto-close the rules tooltip on next outside mousedown.
  useEffect(() => {
    if (!rulesOpenLabel) return;
    const close = () => setRulesOpenLabel(null);
    const id = setTimeout(() => document.addEventListener('mousedown', close), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', close); };
  }, [rulesOpenLabel]);

  const [openSnapshotKey, setOpenSnapshotKey] = useState<string | null>(null);
  const [focusedControl, setFocusedControl] = useState<FocusedControl>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [countersOpen, setCountersOpen] = useState(true);
  // Commander Damage column is a collapsible drawer too (host board only), mirror
  // of the Counters drawer on the opposite (inner) edge.
  const [cmdDmgOpen, setCmdDmgOpen] = useState(true);
  const [cmdDmgShowPlayer, setCmdDmgShowPlayer] = useLocalStorageBool(
    `cmdDmgShowPlayer:${player.playerId}`,
  );
  const toggleCmdDmgShowPlayer = () => setCmdDmgShowPlayer();
  // Commander card preview — shared with TeamPanel via the useCommanderPreview hook.
  const { openPreview: setCmdPreviewName, overlay: cmdPreviewOverlay } = useCommanderPreview();

  // Auto-close QR when remote player connects.
  useEffect(() => { if (remoteConnected && qrOpen) setQrOpen(false); }, [remoteConnected, qrOpen]);

  // ─── Derived from animations bundle (cheap, recompute every render) ─────
  // showCrown / monarchAnimStr were lifted as props in Phase 1; the card owns
  // them now because they're pure functions of `monarchAnim`.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { monarchAnim } = animations;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showCrown = player.isMonarch || monarchAnim === 'exiting';

  // ─── XP keyframes (pure functions of player.experience) ─────────────────
  // These are derived from player.experience only — calling the shared hook
  // locally keeps invalidation tight and avoids threading 7 keyframe objects
  // through props.
  const { intensity: xpGlowIntensity, glow: xpGlow } = xpGlowFor(player.experience);
  // Only the steady counter shimmer is used here now; the transient badge anims
  // (flash / ripple / ember / rune / levelup) live inside the shared <XpBadge>.
  const { xpShimmerAnim } = useXpKeyframes(player.experience, xpGlow, xpGlowIntensity);

  // ─── Energy / damage / poison keyframes ─────────────────────────────────
  const energyGlow = energyGlowFor(player.energy);
  // energyGlow is used in the outer container; reserved here for Phase 4 wiring.
  void energyGlow;
  // The life-number reaction stack (damage flash + swipes, energy pulse/sizzle,
  // poison boil) now lives in the shared <LifeTotal>; it derives those from the
  // raw energy / poison / damageFlash values passed below.
  const poisonProgress = Math.min(player.poison / 10, 1);
  // Glass backing for the control clusters when a busy board animation is active
  // (City's Blessing, Initiative, or late-stage poison). Same shared trigger the
  // 2HG panel uses; flows into each StepperControl via its `glass` prop.
  const glassActive = isControlGlassActive({
    cityBlessingVisible: animations.cityBlessingVisible,
    hasInitiative: player.hasInitiative,
    poisonProgress,
  });

  // ─── Monarch crown anim string ──────────────────────────────────────────
  const { monarchEnterIsTransfer } = animations;
  const monarchAnimStr = monarchCrownAnim(monarchAnim, monarchEnterIsTransfer);

  // ─── Derived helpers used in Block B ────────────────────────────────────
  const { startingLife, activePlayerIdx, bgRevealDelayMs, bgRevealFlash } = props;
  // Active-turn highlight is suppressed until the intro backdrop reveal finishes.
  const turnIndicatorEnabled = props.turnIndicatorEnabled ?? true;
  const showTurnHighlight = isCurrentPlayer && turnIndicatorEnabled;
  // Header thumbnail stays hidden until this seat's backdrop has revealed, then
  // fades in (backdrop delay + its fade). undefined/null pass straight through.
  const thumbRevealMs =
    bgRevealDelayMs === undefined
      ? undefined
      : bgRevealDelayMs === null
      ? null
      : bgRevealDelayMs + BACKDROP_FADE_MS;
  const isCmdDmgHigh = Object.values(commanderDamage[playerIdx] ?? {}).some(
    (dmg) => dmg[0] >= 21 || dmg[1] >= 21
  );
  const opponents = allPlayers
    .map((p, i) => ({ player: p, idx: i }))
    .filter(({ idx }) => idx !== playerIdx);
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

  // Crack layers now live in the shared <LifeCracks> component.
  // monarchAnimStr is intentionally not derived here yet — it depends on the
  // crown keyframes which are migrated in Phase 3. The render block that needs
  // it will compute it locally when it lands.

  // ─── Render: outer container + per-block sections ──────────────────────
  // Outer shell mirrors PlayerPanel's full styled wrapper: warning bg/border,
  // highlight + current-player border/shadow, timer-expired blink, energyGlow
  // text-shadow inheritance, poison saturate filter, eliminated opacity.
  return (
    <StepperOverlayHost
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: (theme) =>
          isWarning
            ? theme.palette.mode === 'dark' ? 'rgba(180,40,40,0.18)' : 'rgba(220,80,80,0.08)'
            : theme.palette.mode === 'dark' ? '#2A1F14' : '#FFF8F0',
        border: showEliminateConfirm
          ? '3px solid #DAA520'
          : isHighlighted
          ? '3px solid #DAA520'
          : (!highlightMode && turnIndicatorEnabled ? timer.currentPlayerBorder : undefined)
          ?? (isWarning ? '2px solid #e53935' : undefined)
          ?? ((theme: import('@mui/material').Theme) => `1px solid ${theme.palette.divider}`),
        boxShadow: showEliminateConfirm
          ? '0 0 24px 6px rgba(218,165,32,0.6)'
          : isHighlighted
          ? '0 0 24px 6px rgba(218,165,32,0.6)'
          : (!highlightMode && turnIndicatorEnabled ? timer.currentPlayerShadow : null) ?? 'none',
        ...(!highlightMode && timer.isTimerExpired && TIMER_EXPIRED_BORDER_BLINK),
        transition: 'box-shadow 0.1s ease, border 0.1s ease, filter 1s ease',
        '& .MuiTypography-root': { textShadow: energyGlow, transition: 'font-size 0.2s ease, margin 0.2s ease, text-shadow 0.4s ease' },
        filter: poisonProgress > 0 ? `saturate(${1 + poisonProgress * 0.5})` : 'none',
        borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 },
        overflow: 'hidden',
        position: 'relative',
        opacity: player.isEliminated ? 0.5 : 1,
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
        px: 1, py: 0.5, flexShrink: 0, filter: 'none', position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center',
        background: showTurnHighlight && highlightMode
          ? `linear-gradient(90deg, ${timer.timerColorRgba(0.3)} 0%, ${timer.timerColorRgba(0.7)} 50%, ${timer.timerColorRgba(0.3)} 100%)`
          : 'rgba(0,0,0,0.08)',
        transition: 'background-color 0.3s ease',
        ...(timer.isTimerExpired && highlightMode && TIMER_EXPIRED_HEADER_BLINK),
      }}>
        {/* Left: commander art + tax */}
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexShrink: 0, zIndex: 1 }}>
          {/* Fixed slot so the header reserves the thumbnail's space and doesn't
              grow/jump when the art finishes loading (CommanderArt is null until then). */}
          <Box sx={{ height: sizes.artHeight, aspectRatio: '626 / 457', flexShrink: 0, borderRadius: 0.5, overflow: 'hidden', cursor: 'zoom-in', ...(remoteMode && { '@media (orientation: portrait)': { display: 'none' } }) }}>
            <CommanderArt
              name={player.commander.name}
              alt={player.commander.name}
              title={player.commander.name}
              revealDelayMs={thumbRevealMs}
              onClick={(e) => { e.stopPropagation(); setCmdPreviewName(player.commander.name); }}
              sx={{ display: 'block', height: '100%', width: '100%', objectFit: 'cover' }}
            />
          </Box>
          {/* One tax medallion per commander with tax > 0 (partner decks show two). */}
          {[
            { name: player.commander.name, tax: player.commanderTax },
            ...(player.partner ? [{ name: player.partner.name, tax: player.partnerCommanderTax }] : []),
          ].filter((c) => c.tax > 0).map((c, i) => (
            <Tooltip key={i} title={`${c.name} tax: cast ${c.tax}× (+${c.tax * 2} generic mana)`} placement="bottom" arrow>
              <Stack direction="row" alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', lineHeight: 1, userSelect: 'none' }}>+</Typography>
                <Box sx={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: 'radial-gradient(circle at 38% 35%, #d0d0d0, #7a7a7a)',
                  border: '1.5px solid #3a3a3a',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#111', lineHeight: 1, userSelect: 'none' }}>
                    {c.tax * 2}
                  </Typography>
                </Box>
              </Stack>
            </Tooltip>
          ))}
          <XpBadge experience={player.experience} flashing={animations.xpFlashing} rippleKey={animations.xpRippleKey} />
          {/* Pass Turn (host board only; the remote uses the TurnNavControl below). */}
          {!remoteMode && isCurrentPlayer && onPassTurn && (
            <Box
              onClick={onPassTurn}
              sx={{
                px: 1.5, py: 0.5,
                borderRadius: 1.5,
                border: '2px solid',
                borderColor: 'primary.main',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <Typography sx={{ fontSize: sizes.fsPassBtn, fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
                PASS
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Center: absolutely positioned so it's always centered relative to the full header */}
        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 'max-content', maxWidth: 'calc(100% - 96px)', textAlign: 'center', pointerEvents: 'none' }}>
          <Typography
            noWrap
            onClick={seatCode ? () => setQrOpen(true) : undefined}
            sx={{ fontWeight: 700, fontSize: sizes.fsPlayerName, lineHeight: 1.2, pointerEvents: seatCode ? 'auto' : 'none', cursor: seatCode ? 'pointer' : 'default' }}
          >
            {player.playerName}
          </Typography>
          <Typography noWrap sx={{ fontSize: sizes.fsDeckName, lineHeight: 1.2, color: 'text.secondary', pointerEvents: 'none' }}>
            {player.deckName} · {player.commander.name}{player.partner ? ` / ${player.partner.name}` : ''}
          </Typography>
        </Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto', zIndex: 1 }}>
            {/* Being viewed indicator */}
            {viewer.isBeingViewedByAnyone && (
              <VisibilityIcon onClick={(e) => { e.stopPropagation(); viewer.onEyeIconClick(); }} sx={{ fontSize: sizes.fsHeaderIcon, color: 'primary.main', cursor: 'pointer', animation: 'eyePulse 1.5s ease-in-out infinite', '@keyframes eyePulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
            )}
            {/* Active game state indicators */}
            <>
              {player.isMonarch && (
                <Tooltip open={rulesOpenLabel === 'h:Monarch'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <CrownIcon
                    onClick={guardClick(() => toggleRules('h:Monarch'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('off-monarch', () => onToggleMonarch(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: '#DAA520', cursor: 'pointer', animation: 'crownShimmer 2s ease-in-out infinite', '@keyframes crownShimmer': { '0%, 100%': { filter: 'drop-shadow(0 0 2px #DAA520) brightness(1)' }, '50%': { filter: 'drop-shadow(0 0 7px #FFD700) brightness(1.5)' } } }}
                  />
                </Tooltip>
              )}
              {!player.isMonarch && allPlayers.some(p => p.isMonarch) && (
                <Tooltip open={rulesOpenLabel === 'h:Monarch'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <CrownIcon
                    onClick={guardClick(() => toggleRules('h:Monarch'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('take-monarch', () => onToggleMonarch(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: 'text.disabled', cursor: 'pointer', opacity: 0.4 }}
                  />
                </Tooltip>
              )}
              {player.hasInitiative && (
                <Tooltip open={rulesOpenLabel === 'h:Initiative'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <InitiativeIcon
                    onClick={guardClick(() => toggleRules('h:Initiative'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('off-initiative', () => onToggleInitiative(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: '#4FC3F7', cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
              {!player.hasInitiative && allPlayers.some(p => p.hasInitiative) && (
                <Tooltip open={rulesOpenLabel === 'h:Initiative'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <InitiativeIcon
                    onClick={guardClick(() => toggleRules('h:Initiative'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('take-initiative', () => onToggleInitiative(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: 'text.disabled', cursor: 'pointer', opacity: 0.4 }}
                  />
                </Tooltip>
              )}
              {player.hasCitysBlessing && (
                <Tooltip open={rulesOpenLabel === "h:City's Blessing"} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>You have the city&apos;s blessing for the rest of the game. Gained when you control ten or more permanents — it persists even if that number later drops below ten.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <CityIcon
                    active
                    onClick={guardClick(() => toggleRules("h:City's Blessing"))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress("off-citys-blessing", () => onToggleCitysBlessing(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
              {/* Remote connected indicator */}
              {remoteConnected && (
                <SmartphoneIcon sx={{ fontSize: sizes.fsSmallIcon, color: 'success.main', animation: 'remotePulse 2s ease-in-out infinite', '@keyframes remotePulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } }, flexShrink: 0 }} />
              )}
              {/* Submenu trigger */}
              <IconButton size="small" onClick={() => setStateMenuOpen(o => !o)} onPointerDown={(e) => e.stopPropagation()} sx={{ p: 0.5, color: stateMenuOpen ? 'primary.main' : 'text.secondary' }}>
                <AddIcon sx={{ fontSize: sizes.fsMenuTrigger, transition: 'transform 0.2s ease', transform: stateMenuOpen ? 'rotate(45deg)' : 'none' }} />
              </IconButton>
            </>
          </Stack>
      </Box>

      {/* ── Main: Commander Damage (left) + Life (right) ── */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, borderTop: (theme) => `1px solid ${theme.palette.divider}`, filter: 'none', position: 'relative', zIndex: 3,
        // Phone held portrait: the three columns (cmd damage | life | counters)
        // are sized in dvw but the fonts scale to dvmax (the tall dimension), so
        // they overflow the narrow columns. Stack them full-width and scroll,
        // mirroring TeamPanel. Landscape and the on-table board are unaffected.
        ...(remoteMode ? { '@media (orientation: portrait)': { flexDirection: 'column', overflowY: 'auto' } } : {}) }}>

        {/* Commander Damage box — collapsible drawer (host board); the rail sits on
            the inner (life) edge, mirroring the Counters drawer. The collapse is a
            flex-width change in panel space, so the whole rotated card maps it to
            the correct screen direction (left/right on top-bottom seats, up/down on
            the side seats). */}
        <Box sx={[
          { borderRight: (theme) => `1px solid ${theme.palette.divider}` },
          remoteMode
            ? remoteDrawerOuterSx(cmdDmgOpen)
            : { display: 'flex', flexDirection: 'row', minWidth: 0, overflow: 'hidden', ...(cmdDmgOpen ? { flex: 1 } : { flex: 'none', width: 24 }) },
        ] as SxProps<Theme>}>
          <Box sx={[
          remoteMode
            ? remoteDrawerContentSx(cmdDmgOpen)
            // Host: collapse content fully when closed so its padding doesn't shove
            // the rail off-center; open takes normal padding.
            : ((!cmdDmgOpen)
                ? { flex: 'none', width: 0, minWidth: 0, px: 0, opacity: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto', overflowX: 'hidden' }
                : { flex: 1, minWidth: 0, px: 0.5, opacity: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto', overflowX: 'hidden' }),
          {
            py: remoteMode ? 1 : 0.25,
            position: 'relative',
            transition: 'padding 0.2s ease, row-gap 0.2s ease, opacity 0.15s ease',
            // px must collapse to 0 when closed: with border-box the padding
            // otherwise keeps the content ~16px wide, shoving the 24px rail past
            // the 24px outer wrapper so the chevron gets clipped by overflow:hidden.
            ...(remoteMode ? { px: cmdDmgOpen ? 1 : 0, justifyContent: 'flex-start', gap: 0.5, overflowY: 'auto', overflowX: 'hidden' } : { gap: 0.1 }),
          },
        ] as SxProps<Theme>}>
          {/* Threat vignette — commander art fades in as damage approaches 21 */}
          {threatSource?.artUrl && threatSource.intensity > 0 && (
            <Box sx={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url(${threatSource.artUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              opacity: threatSource.intensity * 0.28,
              transition: 'opacity 0.6s ease',
              pointerEvents: 'none',
            }} />
          )}
          {(threatSource?.intensity ?? 0) > 0 && (
            <Box sx={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              boxShadow: `inset 0 0 24px rgba(160,0,0,${((threatSource?.intensity ?? 0) * 0.65).toFixed(2)})`,
              transition: 'box-shadow 0.6s ease',
              pointerEvents: 'none',
            }} />
          )}
          {/* Title row */}
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ gridColumn: '1 / -1', mb: 0.25 }}>
            <Typography sx={{ fontSize: sizes.fsSectionLabel, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 }}>
              CMD Damage{isCmdDmgHigh && <Typography component="span" sx={{ fontSize: sizes.fsSectionLabel, color: 'error.main', ml: 0.5 }}>⚠</Typography>}
            </Typography>
            <Button size="small" variant={cmdDmgShowPlayer ? 'contained' : 'outlined'} onClick={toggleCmdDmgShowPlayer} sx={{ minWidth: 0, px: remoteMode ? 1.25 : 0.75, py: remoteMode ? 0.5 : 0, fontSize: remoteMode ? sizes.fsSectionLabel : 'clamp(7px, 1.2dvh, 11px)', lineHeight: 1.4, flexShrink: 0 }}>
              {cmdDmgShowPlayer ? 'Player' : 'CMD'}
            </Button>
          </Stack>
          {opponents.flatMap(({ player: source, idx: sourceIdx }) => {
            const dmg = commanderDamage[playerIdx]?.[sourceIdx] ?? [0, 0];
            const dealt = commanderDamage[sourceIdx]?.[playerIdx] ?? [0, 0];
            const dealtTotal = dealt[0] + dealt[1];
            const sourceEliminated = source.isEliminated;
            // Same abstraction as the counters / 2HG: one row-layout StepperControl
            // per source. The component owns the label (name + stat-badge row moved
            // into labelNode, flex:1 so − value + line up across rows) and the glass
            // backing. Snapshot onClick + all stepper interaction are unchanged.
            const rows = [
              <StepperControl
                key={`${sourceIdx}-step`}
                label={`CMD Dmg — ${cmdDmgShowPlayer ? source.playerName : source.commander.name}`}
                labelNode={
                  <Box sx={{ flex: 1, minWidth: 0, pt: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ cursor: 'pointer', minWidth: 0 }} onClick={(e) => { e.stopPropagation(); setOpenSnapshotKey(k => k === `${sourceIdx}-snap` ? null : `${sourceIdx}-snap`); }}>
                      {activePlayerIdx === sourceIdx && (
                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, boxShadow: '0 0 4px 1px rgba(var(--mui-palette-primary-mainChannel) / 0.7)' }} />
                      )}
                      {remoteMode ? (
                        <>
                          {/* Landscape: the cmd-damage column is narrow, so swap the
                              name text for a compact commander thumbnail (CMD view)
                              or the player's first initial (Player view). */}
                          <Box sx={{ display: 'none', flexShrink: 0, '@media (orientation: landscape)': { display: 'inline-flex', alignItems: 'center' } }}>
                            {cmdDmgShowPlayer ? (
                              <Typography sx={{ fontSize: 'clamp(22px, 3.8dvmax, 40px)', lineHeight: 1, fontWeight: 800, color: sourceEliminated ? 'text.disabled' : activePlayerIdx === sourceIdx ? 'primary.main' : 'text.secondary', textDecoration: sourceEliminated ? 'line-through' : 'none' }}>
                                {source.playerName.charAt(0).toUpperCase()}
                              </Typography>
                            ) : (
                              <CommanderArt name={source.commander.name} title={source.commander.name} sx={{ height: 'clamp(18px, 3dvmax, 34px)', width: 'auto', borderRadius: 0.5, flexShrink: 0, opacity: sourceEliminated ? 0.5 : 1 }} />
                            )}
                          </Box>
                          {/* Portrait: full name text. */}
                          <Typography sx={{ fontSize: sizes.fsSourceName, color: sourceEliminated ? 'text.disabled' : activePlayerIdx === sourceIdx ? 'primary.main' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: sourceEliminated ? 'line-through' : 'none', fontWeight: activePlayerIdx === sourceIdx ? 700 : 400, flex: '0 1 auto', minWidth: 0, '@media (orientation: landscape)': { display: 'none' } }}>
                            {cmdDmgShowPlayer ? source.playerName : source.commander.name}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ fontSize: sizes.fsSourceName, color: sourceEliminated ? 'text.disabled' : activePlayerIdx === sourceIdx ? 'primary.main' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: sourceEliminated ? 'line-through' : 'none', fontWeight: activePlayerIdx === sourceIdx ? 700 : 400, flex: '0 1 auto', minWidth: 0 }}>
                          {cmdDmgShowPlayer ? source.playerName : source.commander.name}
                        </Typography>
                      )}
                      <Tooltip title={`Dealt ${source.partner ? `${dealt[0]}/${dealt[1]}` : dealtTotal} commander damage to ${source.playerName}`} placement="top" slotProps={position.ttSlotProps} arrow><Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 900, color: dealtTotal >= 21 ? 'error.main' : dealtTotal > 0 ? '#e67e22' : 'text.disabled', lineHeight: 1, flexShrink: 0 }}>⚔{source.partner ? `${dealt[0]}/${dealt[1]}` : dealtTotal}</Typography></Tooltip>
                      {/* Spacer keeps name + sword left-aligned instead of the name growing to push the sword to the counter. */}
                      <Box sx={{ flex: 1, minWidth: 0 }} />
                    </Stack>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.15, flexWrap: 'wrap', alignItems: 'center' }}>
                      {source.isMonarch && <Tooltip title="Monarch" placement="top" slotProps={position.ttSlotProps} arrow><CrownIcon sx={{
                        fontSize: sizes.fsStatBadge,
                        color: '#DAA520',
                        animation: 'crownShimmer 2s ease-in-out infinite',
                        '@keyframes crownShimmer': {
                          '0%, 100%': { filter: 'drop-shadow(0 0 2px #DAA520) brightness(1)' },
                          '50%': { filter: 'drop-shadow(0 0 7px #FFD700) brightness(1.5)' },
                        },
                      }} /></Tooltip>}
                      {source.hasCitysBlessing && <Tooltip title="City's Blessing" placement="top" slotProps={position.ttSlotProps} arrow><span><CityIcon active sx={{ fontSize: sizes.fsStatBadge }} /></span></Tooltip>}
                      {source.hasInitiative && <Tooltip title="Initiative" placement="top" slotProps={position.ttSlotProps} arrow><InitiativeIcon sx={{ fontSize: sizes.fsStatBadge, color: '#4FC3F7' }} /></Tooltip>}
                      <Tooltip title={`Life: ${source.life}`} placement="top" slotProps={position.ttSlotProps} arrow><Typography sx={{ fontSize: sizes.fsStatBadge, fontWeight: 800, color: lifeColor(source.life) || 'primary.main', lineHeight: 1 }}>♥{source.life}</Typography></Tooltip>
                      {source.poison > 0 && <Tooltip title={`Poison: ${source.poison}`} placement="top" slotProps={position.ttSlotProps} arrow><Typography sx={{ fontSize: sizes.fsStatBadge, fontWeight: 800, color: source.poison >= 10 ? '#e53935' : '#66BB6A', lineHeight: 1 }}>☠{source.poison}</Typography></Tooltip>}
                      {source.energy > 0 && <Tooltip title={`Energy: ${source.energy}`} placement="top" slotProps={position.ttSlotProps} arrow><Typography sx={{ fontSize: sizes.fsStatBadge, fontWeight: 800, color: '#4FC8FF', lineHeight: 1 }}>⚡{source.energy}</Typography></Tooltip>}
                      {source.experience > 0 && <Tooltip title={`XP: ${source.experience}`} placement="top" slotProps={position.ttSlotProps} arrow><Stack direction="row" alignItems="center" spacing={0.25}><Box sx={{ bgcolor: 'background.paper', display: 'inline-flex' }}><Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: sizes.fsStatBadge, height: sizes.fsStatBadge, objectFit: 'contain', mixBlendMode: 'multiply', transition: 'width 0.2s ease, height 0.2s ease' }} /></Box><Typography sx={{ fontSize: sizes.fsStatBadge, fontWeight: 800, color: '#DAA520', lineHeight: 1 }}>{source.experience}</Typography></Stack></Tooltip>}
                    </Stack>
                  </Box>
                }
                glass={glassActive}
                value={dmg[0]}
                max={21}
                maxFont={sizes.fsSourceName}
                color={dmg[0] >= 21 ? 'error.main' : sourceEliminated ? 'text.disabled' : 'text.primary'}
                disableDec={sourceEliminated}
                onDec={() => handleCmdDmgChange(playerIdx, sourceIdx, false, -1)}
                onInc={() => handleCmdDmgChange(playerIdx, sourceIdx, false, 1)}
                onDec5={() => handleCmdDmgChange(playerIdx, sourceIdx, false, -5)}
                onInc5={() => handleCmdDmgChange(playerIdx, sourceIdx, false, 5)}
                rowSpacing={remoteMode ? 0 : 0.5}
                size={{ btnFont: sizes.fsCounterBtn, valueFont: sizes.fsCounterValue, btnMinWidth: sizes.cmdBtnWidth, btnMinHeight: sizes.cmdBtnHeight, valueMinWidth: sizes.valColWidth }}
                tooltipSlotProps={position.ttSlotProps}
                lpKeyPrefix={`${sourceIdx}`}
              />,
            ];
            if (source.partner) {
              rows.push(
                <StepperControl
                  key={`${sourceIdx}-pstep`}
                  label={`CMD Dmg — ${source.partner.name}`}
                  labelNode={
                    <Typography onClick={(e) => { e.stopPropagation(); setOpenSnapshotKey(k => k === `${sourceIdx}-psnap` ? null : `${sourceIdx}-psnap`); }} sx={{ flex: 1, minWidth: 0, fontSize: sizes.fsSourceName, color: sourceEliminated ? 'text.disabled' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: sourceEliminated ? 'line-through' : 'none', cursor: 'pointer' }}>
                      {source.partner.name}
                    </Typography>
                  }
                  glass={glassActive}
                  value={dmg[1]}
                  max={21}
                  maxFont={sizes.fsSourceName}
                  color={dmg[1] >= 21 ? 'error.main' : sourceEliminated ? 'text.disabled' : 'text.primary'}
                  disableDec={sourceEliminated}
                  onDec={() => handleCmdDmgChange(playerIdx, sourceIdx, true, -1)}
                  onInc={() => handleCmdDmgChange(playerIdx, sourceIdx, true, 1)}
                  onDec5={() => handleCmdDmgChange(playerIdx, sourceIdx, true, -5)}
                  onInc5={() => handleCmdDmgChange(playerIdx, sourceIdx, true, 5)}
                  rowSpacing={remoteMode ? 0 : 0.5}
                  size={{ btnFont: sizes.fsCounterBtn, valueFont: sizes.fsCounterValue, btnMinWidth: sizes.cmdBtnWidth, btnMinHeight: sizes.cmdBtnHeight, valueMinWidth: sizes.valColWidth }}
                  tooltipSlotProps={position.ttSlotProps}
                  lpKeyPrefix={`${sourceIdx}-p`}
                />,
              );
            }
            return rows;
          })}

          {/* Commander snapshot overlay */}
          {openSnapshotKey !== null && (() => {
            const match = openSnapshotKey.match(/^(\d+)-(p?snap)$/);
            if (!match) return null;
            const srcIdx = parseInt(match[1]);
            const src = opponents.find(o => o.idx === srcIdx)?.player;
            if (!src) return null;
            const dealtRows = allPlayers
              .flatMap((tgt, tgtIdx) => {
                if (tgtIdx === srcIdx) return [];
                const d = commanderDamage[tgtIdx]?.[srcIdx] ?? [0, 0];
                return [{ tgt, d, tgtIdx }];
              })
              .sort((a, b) => {
                if (a.tgtIdx === playerIdx) return -1;
                if (b.tgtIdx === playerIdx) return 1;
                return 0;
              });
            const srcLifeColor = lifeColor(src.life);
            return (
              <Box
                key="snapshot-overlay"
                onClick={() => setOpenSnapshotKey(null)}
                sx={{
                  position: 'absolute', inset: 0, zIndex: 20,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(20,12,4,0.96)' : 'rgba(255,248,240,0.97)',
                  overflow: 'auto',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <CommanderArtBg
                  name={src.commander.name}
                  sx={{ position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center top', opacity: 0.15, pointerEvents: 'none' }}
                />
                <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', p: 1, gap: 0.5, overflowY: 'auto' }}>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 800, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{src.playerName}</Typography>
                        {src.isMonarch && <CrownIcon sx={{ fontSize: sizes.fsStatBadge, color: '#DAA520', flexShrink: 0 }} />}
                        {src.hasInitiative && <InitiativeIcon sx={{ fontSize: sizes.fsStatBadge, color: '#4FC3F7', flexShrink: 0 }} />}
                      </Stack>
                      <Typography onClick={(e) => { e.stopPropagation(); setCmdPreviewName(src.commander.name); }} sx={{ fontSize: sizes.fsSectionLabel, color: 'text.secondary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{src.commander.name}</Typography>
                      {src.partner && <Typography onClick={(e) => { e.stopPropagation(); setCmdPreviewName(src.partner!.name); }} sx={{ fontSize: sizes.fsSectionLabel, color: 'text.secondary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{src.partner.name}</Typography>}
                    </Box>
                    <Typography sx={{ fontSize: 'clamp(28px, 8dvmax, 56px)', fontWeight: 900, lineHeight: 1, color: srcLifeColor || 'primary.main', textDecoration: src.isEliminated ? 'line-through' : 'none', flexShrink: 0 }}>{src.life}</Typography>
                    <Stack direction="column" alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
                      <IconButton size="small" onClick={() => setOpenSnapshotKey(null)} sx={{ p: 0.25 }}>
                        <CloseIcon sx={{ fontSize: sizes.fsSourceName }} />
                      </IconButton>
                      {onSwitchToPlayer && !src.isEliminated && srcIdx !== playerIdx && (
                        <Tooltip title="View panel" placement="left" slotProps={position.ttSlotProps} arrow>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setOpenSnapshotKey(null); onSwitchToPlayer(srcIdx); }} sx={{ p: 0.25 }}>
                            <OpenInFullIcon sx={{ fontSize: sizes.fsSectionLabel }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Stack>

                  <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />

                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="space-between" sx={{
                    px: 1, py: 0.5, borderRadius: 1,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)'
                      : 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)',
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  }}>
                    <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 700, color: src.poison >= 10 ? 'error.main' : src.poison > 0 ? '#66BB6A' : 'text.disabled' }}>☠ {src.poison}</Typography>
                    <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 700, color: src.energy > 0 ? '#4FC8FF' : 'text.disabled' }}>⚡ {src.energy}</Typography>
                    <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 700, color: src.experience > 0 ? '#DAA520' : 'text.disabled' }}>XP {src.experience}</Typography>
                    <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 700, color: (src.commanderTax > 0 || src.partnerCommanderTax > 0) ? 'text.secondary' : 'text.disabled' }}>Tax +{Math.max(src.commanderTax, src.partnerCommanderTax) * 2}</Typography>
                  </Stack>

                  <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.25}>
                    <Typography sx={{ fontSize: sizes.fsSectionLabel, fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 0.5 }}>CMD Dealt</Typography>
                    {dealtRows.map(({ tgt, d, tgtIdx }) => {
                      const isMe = tgtIdx === playerIdx;
                      return (
                        <Stack key={tgt.playerName} direction="row" alignItems="center" justifyContent="space-between" spacing={0.5}
                          onClick={!isMe ? (e) => { e.stopPropagation(); setOpenSnapshotKey(`${tgtIdx}-snap`); } : undefined}
                          sx={{ cursor: isMe ? 'default' : 'pointer', borderRadius: 0.5, '&:hover': !isMe ? { bgcolor: 'action.hover' } : undefined, px: 0.25 }}
                        >
                          {tgt.commander?.name
                            ? <CommanderArt name={tgt.commander.name} onClick={(e) => { e.stopPropagation(); setCmdPreviewName(tgt.commander!.name); }} sx={{ height: 'clamp(16px, 2.5dvmax, 28px)', width: 'auto', borderRadius: 0.25, flexShrink: 0, opacity: isMe ? 1 : 0.75, cursor: 'pointer', '&:hover': { opacity: 1 } }} />
                            : <Box sx={{ height: 'clamp(16px, 2.5dvmax, 28px)', width: 'clamp(11px, 1.8dvmax, 20px)', borderRadius: 0.25, flexShrink: 0, bgcolor: 'action.hover' }} />
                          }
                          <Typography sx={{ fontSize: sizes.fsSectionLabel, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: isMe ? 'primary.main' : 'text.secondary', fontWeight: isMe ? 700 : 400 }}>{tgt.playerName}</Typography>
                          <Typography sx={{ fontSize: sizes.fsSourceName, fontWeight: 700, color: (d[0] >= 21 || d[1] >= 21) ? 'error.main' : isMe ? 'primary.main' : 'text.primary', flexShrink: 0 }}>
                            {src.partner ? `${d[0]}/${d[1]}` : d[0]}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Box>
              </Box>
            );
          })()}
          </Box>
          {/* Collapse rail on the inner edge, toward the life total. Host centers a
              mirrored chevron; remote uses the orientation-aware chevron. */}
          <Box
            onClick={() => setCmdDmgOpen((o) => !o)}
            sx={remoteMode
              ? remoteDrawerRailSx
              : { width: 24, flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {remoteMode ? (
              <ChevronRightIcon sx={remoteDrawerChevronSx(cmdDmgOpen, 'left')} />
            ) : (
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                <ChevronRightIcon sx={{ fontSize: 22, color: 'text.secondary', transform: cmdDmgOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s ease', display: 'block' }} />
              </Box>
            )}
          </Box>
        </Box>

        {/* Life total + controls. On remote this is a size container so the life
            number can be capped to the row's REAL height (cqh) — the viewport-based
            dvmin ramp doesn't know the body height (viewport minus header + footer),
            so a big number would otherwise push the glass past the row. */}
        <Box sx={{ ...(remoteMode ? { flex: 1, minWidth: 0, containerType: 'size', '@media (orientation: portrait)': { width: '100%' } } : { flex: 1, minWidth: 0 }), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 0.5, alignSelf: 'stretch', pt: remoteMode ? { '@media (orientation: landscape)': 2, '@media (orientation: portrait)': 0 } : 0 }}>
          <Box sx={{ position: 'relative', lineHeight: 1, overflow: 'visible', width: '100%', flex: remoteMode ? undefined : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <MonarchCrown show={showCrown} animStr={monarchAnimStr} />

            <Box sx={{ position: 'relative', overflow: 'hidden', lineHeight: 1, width: '100%', flex: remoteMode ? undefined : 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <LifeCracks fingerprint={playerIdx} crackAlpha={crackAlpha} />
              <ThreatNames threatSource={threatSource} fingerprint={playerIdx} />
              {/* Life number + buttons share the glass backing (same abstraction as
                  every counter, via GlassBacking since the hero life is not a
                  StepperControl), so the whole life control reads over a busy board. */}
              <GlassBacking active={glassActive} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...(remoteMode ? { '@media (orientation: portrait)': { width: '100%', mx: -0.5, py: 3 }, '@media (orientation: landscape)': { height: '100cqh', justifyContent: 'center', pt: 2 } } : {}) }}>
              <LifeTotal
                value={player.life}
                // Grows as each side drawer collapses: both open (small) →
                // one closed (medium) → both closed (largest). Applies to both the
                // remote (dvmax) and host (dvh) size ramps.
                fontSize={(() => {
                  const closed = (countersOpen ? 0 : 1) + (cmdDmgOpen ? 0 : 1);
                  if (!remoteMode) {
                    return closed === 0 ? 'clamp(34px, 10dvh, 112px)' : closed === 1 ? 'clamp(46px, 15dvh, 176px)' : 'clamp(60px, 20dvh, 240px)';
                  }
                  // Remote (every drawer state): fill the life box along the
                  // dimension the orientation frees (cqh in landscape, cqw in
                  // portrait), shrinking for extra digits. See remoteLifeFontSize.
                  return remoteLifeFontSize(player.life);
                })()}
                color={computedLifeColor || undefined}
                onClick={() => setFocusedControl({ type: 'life' })}
                damageFlash={animations.damageFlash}
                energy={player.energy}
                poison={player.poison}
                // Crop the digit line box (lineHeight < 1; digits have no descender)
                // so the buttons snug up under the number instead of sitting below a
                // block of empty line-box space.
                sx={remoteMode ? { lineHeight: 0.72 } : undefined}
              />
              <Stack direction="row" alignItems="center" spacing={remoteMode ? 0 : 0.5} sx={{ mt: remoteMode ? { '@media (orientation: landscape)': 'clamp(-52px, -6dvmin, -12px)', '@media (orientation: portrait)': 1 } : 'clamp(0px, 0.6dvh, 4px)', flexShrink: 0, zIndex: 1, ...(remoteMode && { width: '100%', justifyContent: 'center', columnGap: { '@media (orientation: landscape)': 'clamp(8px, 4dvmin, 32px)', '@media (orientation: portrait)': 'clamp(32px, 22dvmin, 180px)' } }) }}>
                <Tooltip open={lpKey === 'life-dec'} title="-5" placement="top" slotProps={position.ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <IconButton
                    onClick={guardClick(() => onLifeChange(playerIdx, -1))}
                    onPointerDown={() => startLongPress('life-dec', () => onLifeChange(playerIdx, -5))}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ px: remoteMode ? 4 : 0.5, py: 0.5, minWidth: remoteMode ? 100 : 52, minHeight: 52, borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 } }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: sizes.fsLifeBtn, lineHeight: 1 }}>−</Typography>
                  </IconButton>
                </Tooltip>
                <Tooltip open={lpKey === 'life-inc'} title="+5" placement="top" slotProps={position.ttSlotProps} disableFocusListener disableHoverListener disableTouchListener>
                  <IconButton
                    onClick={guardClick(() => onLifeChange(playerIdx, 1))}
                    onPointerDown={() => startLongPress('life-inc', () => onLifeChange(playerIdx, 5))}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ px: remoteMode ? 4 : 0.5, py: 0.5, minWidth: remoteMode ? 100 : 52, minHeight: 52, borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 } }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: sizes.fsLifeBtn, lineHeight: 1 }}>+</Typography>
                  </IconButton>
                </Tooltip>
              </Stack>
              </GlassBacking>
            </Box>
          </Box>
        </Box>

        {/* Counters — collapsible drawer. Host: panel-space width collapse (the seat
            rotation orients it). Remote: orientation-aware via shared helpers (width
            in landscape, height in portrait). */}
        <Box sx={[
          { borderLeft: (theme) => `1px solid ${theme.palette.divider}` },
          remoteMode
            ? remoteDrawerOuterSx(countersOpen)
            : { display: 'flex', flexDirection: 'row', minWidth: 0, overflow: 'hidden', ...(countersOpen ? { flex: 1 } : { flex: 'none', width: 24 }) },
        ] as SxProps<Theme>}>
          <Box
            onClick={() => setCountersOpen(o => !o)}
            sx={remoteMode
              ? remoteDrawerRailSx
              : { width: 24, flexShrink: 0, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', pt: 0.5, gap: 0.5, cursor: 'pointer' }}
          >
            {/* Host shows a collapsed mini-summary on the rail; remote is chevron-only. */}
            {!remoteMode && !countersOpen && <>
              {[player.commanderTax, ...(player.partner ? [player.partnerCommanderTax] : [])].filter((t) => t > 0).map((t, i) => (
                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, background: 'radial-gradient(circle at 38% 35%, #d0d0d0, #7a7a7a)', border: '1.5px solid #3a3a3a', boxShadow: '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: 7, fontWeight: 800, color: '#111', lineHeight: 1, userSelect: 'none' }}>+{t * 2}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 700, lineHeight: 1 }}>{t}</Typography>
                </Box>
              ))}
              {player.energy > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 14, color: '#4FC8FF', lineHeight: 1 }}>⚡</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: '#4FC8FF', fontWeight: 700, lineHeight: 1 }}>{player.energy}</Typography>
                </Box>
              )}
              {player.experience > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: 14, height: 14, objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: '#DAA520', fontWeight: 700, lineHeight: 1 }}>{player.experience}</Typography>
                </Box>
              )}
              {player.poison > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 14, color: player.poison >= 10 ? '#e53935' : '#66BB6A', lineHeight: 1 }}>☠</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: player.poison >= 10 ? '#e53935' : '#66BB6A', fontWeight: 700, lineHeight: 1 }}>{player.poison}</Typography>
                </Box>
              )}
            </>}
            {remoteMode ? (
              <ChevronRightIcon sx={remoteDrawerChevronSx(countersOpen, 'right')} />
            ) : (
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                <ChevronRightIcon sx={{ fontSize: 22, color: 'text.secondary', transform: countersOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease', display: 'block' }} />
              </Box>
            )}
          </Box>
          <Box sx={[
            remoteMode
              ? remoteDrawerContentSx(countersOpen)
              : { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', opacity: countersOpen ? 1 : 0, transition: 'opacity 0.15s ease' },
          ] as SxProps<Theme>}>
            <Typography sx={{ fontSize: sizes.fsSectionLabel, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, px: 0.75, pt: 0.5, pb: 0.25, flexShrink: 0 }}>Counters</Typography>
            <Box sx={{
              flex: 1,
              minWidth: 0,
              px: remoteMode ? 0.75 : 0.25,
              pb: remoteMode ? 1 : 0.25,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: remoteMode ? 'flex-start' : 'safe center',
              gap: remoteMode ? 0.5 : 0.1,
            }}>
            {([
              // Fixed order: Tax (one row per commander), Energy, Experience, Poison.
              // The medallion value (8th slot) lets a partner deck render a second
              // Tax row keyed by the partner commander's name.
              ['Commander Tax', player.commanderTax, () => onCommanderTaxChange(playerIdx, -1), () => onCommanderTaxChange(playerIdx, 1), () => onCommanderTaxChange(playerIdx, -5), () => onCommanderTaxChange(playerIdx, 5), player.commanderTax > 0 ? 'warning.main' : 'text.disabled', player.commanderTax],
              ...(player.partner ? [[player.partner.name, player.partnerCommanderTax, () => onCommanderTaxChange(playerIdx, -1, true), () => onCommanderTaxChange(playerIdx, 1, true), () => onCommanderTaxChange(playerIdx, -5, true), () => onCommanderTaxChange(playerIdx, 5, true), player.partnerCommanderTax > 0 ? 'warning.main' : 'text.disabled', player.partnerCommanderTax]] as [string, number, () => void, () => void, () => void, () => void, string, number | null][] : []),
              ['Energy', player.energy, () => onEnergyChange(playerIdx, -1), () => onEnergyChange(playerIdx, 1), () => onEnergyChange(playerIdx, -5), () => onEnergyChange(playerIdx, 5), player.energy > 0 ? 'primary.main' : 'text.disabled', null],
              ['Experience', player.experience, () => onExperienceChange(playerIdx, -1), () => onExperienceChange(playerIdx, 1), () => onExperienceChange(playerIdx, -5), () => onExperienceChange(playerIdx, 5), player.experience > 0 ? 'primary.main' : 'text.disabled', null],
              ['Poison', player.poison, () => onPoisonChange(playerIdx, -1), () => onPoisonChange(playerIdx, 1), () => onPoisonChange(playerIdx, -5), () => onPoisonChange(playerIdx, 5), player.poison >= 10 ? 'error.main' : player.poison > 0 ? 'warning.main' : 'text.disabled', null],
            ] as [string, number, () => void, () => void, () => void, () => void, string, number | null][]).map(([label, value, onDec, onInc, onDec5, onInc5, color, medallionTax]) => {
              const blurSx = poisonBlur(poisonProgress);
              // Per-value effects are shared with TeamPanel via counterValueSx:
              // poison blur, the poison danger pulse (9 for singles), XP glow/shimmer.
              const kind = label === 'Poison' ? 'poison' : label === 'Energy' ? 'energy' : label === 'Experience' ? 'xp' : 'other';
              const valueSx = counterValueSx(kind, value, poisonProgress, { xpGlow, xpShimmerAnim }, POISON_DANGER_SINGLES);
              // Structured label: the component composes the icon + text itself, so
              // the caller only supplies the icon node (glyph) and the text (label).
              // labelSx flexes the label so the − value + line up across rows and
              // carries the poison blur. Same abstraction as the 2HG panel.
              const glyphNode =
                label === 'Poison' ? <CounterGlyph kind="poison" size={sizes.fsSourceName} poison={player.poison} />
                : label === 'Energy' ? <CounterGlyph kind="energy" size={sizes.fsSourceName} />
                : label === 'Experience' ? <CounterGlyph kind="xp" size={sizes.fsSourceName} />
                : medallionTax !== null ? <CounterGlyph kind="tax" size={sizes.fsSourceName} taxValue={medallionTax} />
                : undefined;
              return (
              <StepperControl
                key={label}
                label={label}
                glyph={glyphNode}
                labelFont={sizes.fsSourceName}
                // Remote landscape: hide the counter's text label (keep the glyph)
                // to free horizontal space; the direct-child Typography is the label.
                labelSx={{ flex: 1, ...blurSx, ...(remoteMode && { '@media (orientation: landscape)': { '& > .MuiTypography-root': { display: 'none' } } }) }}
                glass={glassActive}
                value={value}
                max={label === 'Poison' ? 10 : undefined}
                maxFont={sizes.fsSourceName}
                // Poison carries a "/10"; the other counters reserve the same
                // trailing width so every row's − value + column stays aligned.
                reserveMax
                color={color}
                valueSx={valueSx}
                onDec={onDec}
                onInc={onInc}
                onDec5={onDec5}
                onInc5={onInc5}
                rowSpacing={remoteMode ? 0 : 0.5}
                size={{ btnFont: sizes.fsCounterBtn, valueFont: sizes.fsCounterValue, btnMinWidth: sizes.cmdBtnWidth, btnMinHeight: sizes.cmdBtnHeight, valueMinWidth: sizes.valColWidth }}
                tooltipSlotProps={position.ttSlotProps}
                lpKeyPrefix={label}
              />
              );
            })}
          </Box>
        </Box>
      </Box>
      </Box>

      {/* ── Remote turn control (footer bar) ── */}
      {/* Remote only: an in-flow footer at the bottom of the panel (never overlaps
          content), always usable — tap = next turn, long-press = previous. Reads
          "Your Turn" when it is this seat's turn. */}
      {remoteMode && onPassTurn && onPrevTurn && (
        <Box sx={{
          flexShrink: 0, position: 'relative', zIndex: 3,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          px: 1, pt: 1.75, pb: 'calc(env(safe-area-inset-bottom) + 8px)',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}>
          <TurnNavControl
            isYourTurn={isCurrentPlayer}
            onNext={onPassTurn}
            onPrev={onPrevTurn}
            sx={{ px: 4, py: 0.75, fontSize: sizes.fsPassBtn, minWidth: 160 }}
          />
          {/* Game log link, pinned to the far right so the turn control stays
              centered. Opens the shared log viewer owned by the remote page. */}
          {onOpenLog && (
            <IconButton
              onClick={onOpenLog}
              title="Game log"
              sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'text.secondary' }}
            >
              <FormatListBulletedIcon sx={{ fontSize: sizes.fsPassBtn }} />
            </IconButton>
          )}
        </Box>
      )}

      {/* ── Faded background art (or diagonal name fallback), staggered reveal ── */}
      <CommanderBackdrop
        name={player.commander.name}
        revealDelayMs={bgRevealDelayMs}
        flashOnReveal={bgRevealFlash}
        sx={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          zIndex: 0, pointerEvents: 'none',
        }}
      />

      {/* ── City's Blessing decorations (shared with TeamPanel) ── */}
      <CityBlessing visible={animations.cityBlessingVisible} exiting={animations.cityBlessingExiting} threatSource={threatSource} commander={player.commander} />

      {/* ── Concede confirm overlay ── */}
      {showEliminateConfirm && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none', bgcolor: 'rgba(218,165,32,0.12)' }}>
          <Typography sx={{ fontWeight: 900, color: '#DAA520', fontSize: 22, letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.5)', transform: 'rotate(-10deg)' }}>
            CONCEDE?
          </Typography>
        </Box>
      )}

      {/* ── Eliminated overlay (shared with TeamPanel) ── */}
      <EliminatedOverlay eliminated={player.isEliminated} conceded={player.isConceded} poisoned={isPoisoned} />

      {/* ── Life kill attribution overlay ── */}
      {lifeKillOpponents && onLifeKillSelect && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: 'rgba(0,0,0,0.72)', px: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: sizes.fsKillPrompt, color: '#fff', mb: 0.5, textAlign: 'center' }}>
            Who brought {player.playerName} to 0?
          </Typography>
          {lifeKillOpponents.map((opp) => (
            <Button key={opp.idx} variant="outlined" fullWidth onClick={() => onLifeKillSelect(opp.idx)}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              {opp.name}
            </Button>
          ))}
          <Button onClick={() => onLifeKillSelect(null)} sx={{ color: 'rgba(255,255,255,0.5)', fontSize: sizes.fsKillPrompt, mt: 0.5 }}>
            Skip
          </Button>
        </Box>
      )}

      {/* ── Poison kill attribution overlay ── */}
      {poisonKillOpponents && onPoisonKillSelect && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: 'rgba(0,40,0,0.78)', px: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: sizes.fsKillPrompt, color: '#7fff7f', mb: 0.5, textAlign: 'center' }}>
            Who poisoned {player.playerName}?
          </Typography>
          {poisonKillOpponents.map((opp) => (
            <Button key={opp.idx} variant="outlined" fullWidth onClick={() => onPoisonKillSelect(opp.idx)}
              sx={{ color: '#7fff7f', borderColor: 'rgba(100,255,100,0.4)', '&:hover': { borderColor: '#7fff7f', bgcolor: 'rgba(100,255,100,0.1)' } }}>
              {opp.name}
            </Button>
          ))}
          <Button onClick={() => onPoisonKillSelect(null)} sx={{ color: 'rgba(100,255,100,0.4)', fontSize: sizes.fsKillPrompt, mt: 0.5 }}>
            Skip
          </Button>
        </Box>
      )}

      {/* ── Game state submenu ── */}
      {stateMenuOpen && (
        <Box
          sx={{
            position: 'absolute', inset: 0, zIndex: 20,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(20,12,6,0.93)' : 'rgba(255,248,240,0.95)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
            overflowY: 'auto', py: 2, gap: 0,
            animation: 'stateMenuFadeIn 0.15s ease-out both',
            '@keyframes stateMenuFadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
          }}
          onClick={() => { setStateMenuOpen(false); setShowEliminateConfirm(false); }}
        >
          <Box
            sx={{
              width: '90%', maxWidth: 220, maxHeight: '80%',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1E1510' : '#FFFAF5',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 },
              overflowY: 'auto', overflowX: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {([
              { label: 'Monarch', icon: <CrownIcon sx={{ fontSize: 18, color: player.isMonarch ? '#DAA520' : 'inherit' }} />, active: player.isMonarch, color: '#DAA520', toggle: () => { onToggleMonarch(playerIdx); setStateMenuOpen(false); }, rulesText: 'Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.' },
              { label: 'Initiative', icon: <InitiativeIcon sx={{ fontSize: 18 }} />, active: player.hasInitiative, color: '#4FC3F7', toggle: () => { onToggleInitiative(playerIdx); setStateMenuOpen(false); }, rulesText: "When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative." },
              { label: "City's Blessing", icon: <CityIcon active={player.hasCitysBlessing} sx={{ fontSize: 18 }} />, active: player.hasCitysBlessing, color: '#7851A9', toggle: () => { onToggleCitysBlessing(playerIdx); setStateMenuOpen(false); }, rulesText: "You have the city&apos;s blessing for the rest of the game. Gained when you control ten or more permanents — it persists even if that number later drops below ten." },
            ] as { label: string; icon: React.ReactNode; active: boolean; color: string; toggle: () => void; rulesText: string }[]).map(({ label, icon, active, color, toggle, rulesText }) => (
              <Box key={label} onClick={toggle} sx={{
                display: 'flex', alignItems: 'center', gap: 1.25,
                px: 1.5, py: 1,
                cursor: 'pointer',
                color: active ? color : 'text.disabled',
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                '&:hover': { bgcolor: 'action.hover' },
                transition: 'background-color 0.15s ease',
              }}>
                {icon}
                <Typography sx={{ fontSize: 13, fontWeight: active ? 700 : 400, lineHeight: 1 }}>{label}</Typography>
                <Tooltip
                  open={rulesOpenLabel === `m:${label}`}
                  onClose={() => setRulesOpenLabel(null)}
                  title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>{rulesText}</Typography>}
                  placement="left"
                  arrow
                  disableHoverListener
                  disableFocusListener
                  disableTouchListener
                  slotProps={{ tooltip: { sx: { rotate: position.ttRotate } } }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); toggleRules(`m:${label}`); }}
                    sx={{ p: 0.25, ml: 'auto', color: rulesOpenLabel === `m:${label}` ? 'primary.main' : 'text.disabled' }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
                {active && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />}
              </Box>
            ))}
            {/* Eliminate row */}
            {player.isEliminated ? (
              <Box onClick={() => { onUndoEliminate(playerIdx); setStateMenuOpen(false); }} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', color: 'error.main', borderTop: (theme) => `1px solid ${theme.palette.divider}`, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                <ElimIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>Undo Concede</Typography>
              </Box>
            ) : showEliminateConfirm ? (
              <Stack spacing={0.75} sx={{ px: 1.5, py: 1, bgcolor: 'rgba(218,165,32,0.12)', borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#DAA520', lineHeight: 1.3 }}>Are you sure you want to quit?</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TextField size="small" label="Turn #" type="number" value={eliminateTurnInput}
                    onChange={(e) => setEliminateTurnInput(e.target.value)}
                    slotProps={{ htmlInput: { min: 1 } }} sx={{ width: 72 }} />
                  <Button size="small" variant="contained"
                    onClick={() => { onEliminate(playerIdx); setShowEliminateConfirm(false); setEliminateTurnInput(''); setStateMenuOpen(false); }}
                    sx={{ fontSize: 9, py: 0, px: 0.5, minWidth: 0, bgcolor: '#DAA520', '&:hover': { bgcolor: '#c49a18' } }}>✓</Button>
                  <Button size="small" variant="outlined"
                    onClick={() => setShowEliminateConfirm(false)}
                    sx={{ fontSize: 9, py: 0, px: 0.5, minWidth: 0, borderColor: '#DAA520', color: '#DAA520' }}>✕</Button>
                </Stack>
              </Stack>
            ) : (
              <Box onClick={() => setShowEliminateConfirm(true)} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', color: 'text.disabled', borderTop: (theme) => `1px solid ${theme.palette.divider}`, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                <ElimIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, lineHeight: 1 }}>Concede</Typography>
              </Box>
            )}
            {/* Seat code row */}
            {seatCode && (
              <Box
                onClick={(e) => { e.stopPropagation(); setQrOpen(true); setStateMenuOpen(false); }}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', borderTop: (theme) => `1px solid ${theme.palette.divider}`, color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}
              >
                <Typography sx={{ fontSize: 12, fontFamily: 'monospace', letterSpacing: 1.5, fontWeight: 700, flex: 1 }}>
                  {seatCode}
                </Typography>
                <QrCodeIcon sx={{ fontSize: 16 }} />
              </Box>
            )}
            {/* Rules Guru chat — remote only */}
            {remoteMode && onOpenChat && (
              <Box
                onClick={(e) => { e.stopPropagation(); onOpenChat(player.playerName); setStateMenuOpen(false); }}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', borderTop: (theme) => `1px solid ${theme.palette.divider}`, color: 'primary.main', '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}
              >
                <ChatIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, lineHeight: 1 }}>Ask Rules</Typography>
              </Box>
            )}
            {/* Remote-only: sound + theme toggles */}
            {remoteMode && (
              <Box sx={{ display: 'flex', borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Box onClick={(e) => { e.stopPropagation(); onToggleSound?.(); setStateMenuOpen(false); }} sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, py: 1, cursor: 'pointer', color: soundEnabled ? 'primary.main' : 'text.disabled', '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                  {soundEnabled ? <VolumeUpIcon sx={{ fontSize: 18 }} /> : <VolumeOffIcon sx={{ fontSize: 18 }} />}
                  <Typography sx={{ fontSize: 13, lineHeight: 1 }}>Sound</Typography>
                </Box>
                {onToggleTheme && (
                  <Box onClick={(e) => { e.stopPropagation(); onToggleTheme(); setStateMenuOpen(false); }} sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, py: 1, cursor: 'pointer', color: 'text.secondary', borderLeft: (theme) => `1px solid ${theme.palette.divider}`, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                    {themeMode === 'light' ? <Brightness4Icon sx={{ fontSize: 18 }} /> : <Brightness7Icon sx={{ fontSize: 18 }} />}
                    <Typography sx={{ fontSize: 13, lineHeight: 1 }}>{themeMode === 'light' ? 'Dark' : 'Light'}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1.5 }}>tap outside to close</Typography>
        </Box>
      )}

      {/* ── Initiative torch (shared with TeamPanel) ── */}
      <InitiativeTorch visible={player.hasInitiative} />

      {/* ── Phyrexian poison overlay ── */}
      <PoisonOverlay poison={player.poison} poisonProgress={poisonProgress} />

      {/* ── Viewer notification banner ── */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 12,
        background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}00 0%, ${theme.palette.primary.main}aa 44%, ${theme.palette.primary.main}ff 50%, ${theme.palette.primary.main}aa 56%, ${theme.palette.primary.main}00 100%)`,
        color: '#fff',
        px: 1, py: 0.4,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, textAlign: 'center',
        pointerEvents: 'none',
        opacity: viewer.viewerBannerVisible ? 1 : 0,
        transition: viewer.viewerBannerVisible ? 'opacity 0.2s ease' : 'opacity 0.6s ease',
      }}>
        <VisibilityIcon sx={{ fontSize: 13 }} />
        <Typography sx={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>{viewer.viewerTooltipText}</Typography>
      </Box>

      {/* ── Life focus modal — the hero life readout keeps its distinct layout
             (big number, buttons beneath), so it uses ControlFocusModal directly.
             Every compact counter (poison/energy/XP/tax/cmd-damage) now owns its
             own modal via StepperControl. ── */}
      {focusedControl?.type === 'life' && (
        <ControlFocusModal
          open
          onClose={() => setFocusedControl(null)}
          label="Life Total"
          value={player.life}
          color={computedLifeColor || 'primary.main'}
          onDec={() => onLifeChange(playerIdx, -1)}
          onInc={() => onLifeChange(playerIdx, 1)}
          onDec5={() => onLifeChange(playerIdx, -5)}
          onInc5={() => onLifeChange(playerIdx, 5)}
        />
      )}

      {/* ── Commander card preview overlay — shared with TeamPanel ── */}
      {cmdPreviewOverlay}

      {/* ── QR overlay — in-panel, does not take over the board ── */}
      {seatCode && qrOpen && (
        <Box
          onClick={() => { navigator.clipboard?.writeText(seatCode).catch(() => {}); setQrOpen(false); }}
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(20,12,6,0.93)' : 'rgba(255,248,240,0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            cursor: 'pointer',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: 1 }}>
                <QRCodeSVG
                  value={`${remoteQrOrigin()}${ASSET_BASE}/game-manager/remote/?code=${seatCode}`}
                  size={120}
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Scan to join</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: 1 }}>
                <QRCodeSVG value={seatCode} size={120} />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Scan for code</Typography>
            </Box>
          </Box>
          <Typography sx={{ fontFamily: 'monospace', fontSize: 15, letterSpacing: 3, fontWeight: 700 }}>
            {seatCode}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            tap to copy &amp; close
          </Typography>
        </Box>
      )}
    </StepperOverlayHost>
  );
}

export const PlayerCard = memo(PlayerCardImpl, arePlayerCardPropsEqual);
