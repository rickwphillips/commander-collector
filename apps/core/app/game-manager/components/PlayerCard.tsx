'use client';

import { memo } from 'react';
import { Box } from '@mui/material';
import type { PlayerState, CommanderDamageMap } from '../types';

/**
 * Presentational counterpart of PlayerPanel. All hooks live in the orchestrator
 * (PlayerPanel.tsx); this component receives fully-computed props and renders
 * JSX. Wrapped in React.memo with a custom comparator so a life change in one
 * seat re-renders only that seat's card, not all four.
 *
 * This file is currently a STUB. The prop surface below reflects every value
 * the eventual presentational render will consume. Render JSX will be migrated
 * out of PlayerPanel in subsequent commits, one logical block at a time.
 */

// ─── Discriminated unions used by callbacks ────────────────────────────────
export type FocusedControl = {
  type: 'life' | 'poison' | 'energy' | 'experience' | 'commanderTax' | 'commanderDamage';
  sourceIdx?: number;
  isPartner?: boolean;
} | null;

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

// ─── Timer presentation (derived in orchestrator from elapsed/total) ───────
export interface TimerTokens {
  timerOff: boolean;
  timerProgress: number;
  isTimerExpired: boolean;
  timerColor: string;
  timerColorRgba: (alpha: number) => string;
  currentPlayerBorder?: string;
  currentPlayerShadow?: string;
}

// ─── Animation flags surfaced from extracted hooks ─────────────────────────
export interface AnimationFlags {
  /** Damage-flash counter (changes trigger flash). 0 = no flash. */
  damageFlash: number;
  /** Monarch crown enter/exit/stable state. */
  monarchAnim: 'entering' | 'exiting' | null;
  monarchEnterIsTransfer: boolean;
  /** Whether crown should currently render (true while exiting too). */
  showCrown: boolean;
  /** Combined animation CSS string for crown. */
  monarchAnimStr: string;
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
export interface LongPressHandlers {
  lpKey: number;
  startLongPress: (key: string, onTrigger: () => void) => void;
  cancelLongPress: () => void;
  guardClick: (key: string, fn: () => void) => () => void;
}

// ─── Local UI state owned by the orchestrator and lifted as props ──────────
// (These remain in the orchestrator so the card stays purely presentational.
// If a piece of state turns out to be card-local only, it can move into the
// card during the migration.)
export interface LocalUIState {
  eliminateTurnInput: string;
  setEliminateTurnInput: (v: string) => void;
  showEliminateConfirm: boolean;
  setShowEliminateConfirm: (v: boolean) => void;
  stateMenuOpen: boolean;
  setStateMenuOpen: (v: boolean) => void;
  rulesOpenLabel: string | null;
  toggleRules: (label: string) => void;
  cmdDmgShowPlayer: boolean;
  toggleCmdDmgShowPlayer: () => void;
  openSnapshotKey: string | null;
  setOpenSnapshotKey: (k: string | null) => void;
  focusedControl: FocusedControl;
  setFocusedControl: (f: FocusedControl) => void;
  qrOpen: boolean;
  setQrOpen: (v: boolean) => void;
  countersOpen: boolean;
  setCountersOpen: (v: boolean) => void;
  cmdPreviewName: string | null;
  setCmdPreviewName: (n: string | null) => void;
  cmdPreviewUrl: string | null;
  cmdPreviewZoom: number;
  setCmdPreviewZoom: (z: number) => void;
  cmdPreviewBase: { w: number; h: number } | null;
  setCmdPreviewBase: (b: { w: number; h: number } | null) => void;
  /** Ref forwarded so the orchestrator's auto-scroll effect can target the card's scroll container. */
  cmdScrollRef: React.RefObject<HTMLDivElement | null>;
}

// ─── Threat-source derivation (computed in orchestrator from cmd damage) ───
export interface ThreatSource {
  artUrl: string | undefined;
  cmdName: string;
  intensity: number;
  dmg: number;
}

// ─── Full prop surface ─────────────────────────────────────────────────────
export interface PlayerCardProps {
  // Identity / core state
  player: PlayerState;
  playerIdx: number;
  allPlayers: PlayerState[];
  commanderDamage: CommanderDamageMap;
  startingLife: number;
  activePlayerIdx?: number;

  // Mode flags
  remoteMode: boolean;
  seatCode?: string;
  remoteConnected: boolean;
  soundEnabled: boolean;
  highlightMode: boolean;
  isHighlighted: boolean;
  isCurrentPlayer: boolean;
  themeMode?: 'light' | 'dark';

  // Kill prompts (passed through from orchestrator)
  lifeKillOpponents?: KillOpponent[];
  poisonKillOpponents?: KillOpponent[];

  // Counter / state mutation handlers
  onLifeChange: (idx: number, delta: number) => void;
  onPoisonChange: (idx: number, delta: number) => void;
  onCommanderTaxChange: (idx: number, delta: number) => void;
  onEnergyChange: (idx: number, delta: number) => void;
  onExperienceChange: (idx: number, delta: number) => void;
  onToggleMonarch: (idx: number) => void;
  onToggleInitiative: (idx: number) => void;
  onToggleCitysBlessing: (idx: number) => void;
  onCommanderDamageChange: (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => void;
  onEliminate: (idx: number) => void;
  onUndoEliminate: (idx: number) => void;
  onPassTurn?: () => void;
  onLifeKillSelect?: (sourceIdx: number | null) => void;
  onPoisonKillSelect?: (sourceIdx: number | null) => void;
  onSwitchToPlayer?: (targetIdx: number) => void;
  onToggleTheme?: () => void;
  onToggleSound?: () => void;
  onOpenChat?: (playerName: string) => void;

  // Derived value bundles
  sizes: SizeTokens;
  position: PositionTokens;
  timer: TimerTokens;
  animations: AnimationFlags;
  viewer: ViewerProps;
  longPress: LongPressHandlers;
  uiState: LocalUIState;

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
// Bundles (sizes/position/timer/animations/viewer/longPress/uiState) are
// expected to be stable references unless their contents actually change —
// the orchestrator will memoize each bundle so this comparator can rely on
// reference equality. Once render is migrated and bundles are wired, this
// comparator may be refined (e.g. shallow-compare bundles for safety).
function arePlayerCardPropsEqual(prev: PlayerCardProps, next: PlayerCardProps): boolean {
  return (
    prev.player === next.player &&
    prev.allPlayers === next.allPlayers &&
    prev.commanderDamage === next.commanderDamage &&
    prev.playerIdx === next.playerIdx &&
    prev.startingLife === next.startingLife &&
    prev.activePlayerIdx === next.activePlayerIdx &&
    prev.remoteMode === next.remoteMode &&
    prev.seatCode === next.seatCode &&
    prev.remoteConnected === next.remoteConnected &&
    prev.soundEnabled === next.soundEnabled &&
    prev.highlightMode === next.highlightMode &&
    prev.isHighlighted === next.isHighlighted &&
    prev.isCurrentPlayer === next.isCurrentPlayer &&
    prev.themeMode === next.themeMode &&
    prev.lifeKillOpponents === next.lifeKillOpponents &&
    prev.poisonKillOpponents === next.poisonKillOpponents &&
    prev.sizes === next.sizes &&
    prev.position === next.position &&
    prev.timer === next.timer &&
    prev.animations === next.animations &&
    prev.viewer === next.viewer &&
    prev.longPress === next.longPress &&
    prev.uiState === next.uiState &&
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
    prev.onLifeKillSelect === next.onLifeKillSelect &&
    prev.onPoisonKillSelect === next.onPoisonKillSelect &&
    prev.onSwitchToPlayer === next.onSwitchToPlayer &&
    prev.onToggleTheme === next.onToggleTheme &&
    prev.onToggleSound === next.onToggleSound &&
    prev.onOpenChat === next.onOpenChat
  );
}

function PlayerCardImpl(_props: PlayerCardProps) {
  // STUB: render is migrated out of PlayerPanel in subsequent commits.
  return <Box>TODO: PlayerCard render</Box>;
}

export const PlayerCard = memo(PlayerCardImpl, arePlayerCardPropsEqual);
