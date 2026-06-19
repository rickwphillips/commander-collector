'use client';

import { memo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import type { PlayerState, CommanderDamageMap } from '../types';
import type { MonarchAnim } from '@/game-manager/hooks/useMonarchTransition';

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
export interface LongPressHandlers {
  lpKey: number;
  startLongPress: (key: string, onTrigger: () => void) => void;
  cancelLongPress: () => void;
  guardClick: (key: string, fn: () => void) => () => void;
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

function PlayerCardImpl(props: PlayerCardProps) {
  const { viewer, sizes } = props;

  // ─── Card-local UI state ────────────────────────────────────────────────
  // None of this state is read by the orchestrator or any sibling. Lifting it
  // would just add prop noise and break memoization. It stays here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eliminateTurnInput, setEliminateTurnInput] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showEliminateConfirm, setShowEliminateConfirm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stateMenuOpen, setStateMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rulesOpenLabel, setRulesOpenLabel] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openSnapshotKey, setOpenSnapshotKey] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [focusedControl, setFocusedControl] = useState<FocusedControl>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [qrOpen, setQrOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [countersOpen, setCountersOpen] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cmdPreviewName, setCmdPreviewName] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cmdPreviewZoom, setCmdPreviewZoom] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cmdPreviewBase, setCmdPreviewBase] = useState<{ w: number; h: number } | null>(null);
  // Ref into the CMD damage scroll container — used by the zoom autoscroll effect
  // when that effect is migrated as part of the commander-preview block.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cmdScrollRef = useRef<HTMLDivElement>(null);

  // ─── Derived from animations bundle (cheap, recompute every render) ─────
  // showCrown / monarchAnimStr were lifted as props in Phase 1; the card owns
  // them now because they're pure functions of `monarchAnim`.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { monarchAnim } = props.animations;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showCrown = props.player.isMonarch || monarchAnim === 'exiting';
  // monarchAnimStr is intentionally not derived here yet — it depends on the
  // crown keyframes which are migrated in Phase 3. The render block that needs
  // it will compute it locally when it lands.

  // ─── Viewer notification banner ────────────────────────────────────────
  // First migrated render block. Self-contained: only consumes the viewer
  // bundle + one size token. Rendered in isolation here so the orchestrator's
  // copy in PlayerPanel.tsx continues to ship the real UI during Phase 2.
  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 12,
          background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}00 0%, ${theme.palette.primary.main}aa 44%, ${theme.palette.primary.main}ff 50%, ${theme.palette.primary.main}aa 56%, ${theme.palette.primary.main}00 100%)`,
          color: '#fff',
          px: 1, py: 0.4,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, textAlign: 'center',
          pointerEvents: 'none',
          opacity: viewer.viewerBannerVisible ? 1 : 0,
          transition: viewer.viewerBannerVisible ? 'opacity 0.2s ease' : 'opacity 0.6s ease',
          fontSize: sizes.fsSectionLabel,
        }}
      >
        {/* Banner contents are migrated with the eye-icon block (header). */}
      </Box>
    </Box>
  );
}

export const PlayerCard = memo(PlayerCardImpl, arePlayerCardPropsEqual);
