'use client';

/**
 * TeamPanel — the 2HG team view (one panel per team).
 *
 * In Two-Headed Giant the two teammates share one life total and one poison
 * total, so a team is presented as a SINGLE panel. The board renders one panel
 * per team in the left and right columns and rotates each 90deg / -90deg so it
 * faces its own long side of the table (the tablet lies flat between the two
 * teams). The panel is therefore laid out in LANDSCAPE (a horizontal row) with
 * the shared life centered, so it reads correctly after either rotation:
 *
 *   [ pilots + commander tax ] [ shared LIFE + poison ] [ commander damage ]
 *
 * It reads the real 4-seat GameManagerState (life/poison are already mirrored
 * across teammates by reconcileTeams) and routes every mutation through the
 * normal handlers, targeting the team's primary seat so reconcileTeams keeps
 * both heads in sync. Standard games never use this component.
 */
import { useState, useEffect, useRef } from 'react';
import { Box, Stack, Typography, IconButton, SvgIcon, CircularProgress, TextField, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import InitiativeIcon from '@mui/icons-material/Castle';
import CityIcon from '@mui/icons-material/LocationCity';
import ElimIcon from '@mui/icons-material/PersonOff';
import ReplayIcon from '@mui/icons-material/Replay';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import { QRCodeSVG } from 'qrcode.react';
import { ASSET_BASE } from '@/lib/api';
import { getCardImageByName } from '@commander/shared/lib/cardImageCache';
import { LifeTotal } from './LifeTotal';
import { useTimerTokens, TIMER_EXPIRED_BORDER_BLINK, TIMER_EXPIRED_HEADER_BLINK } from '@/game-manager/hooks/useTimerTokens';
import { useLongPress } from '@/game-manager/hooks/useLongPress';
import { lifeColor } from '@/game-manager/lifeColor';
import { teamColor, otherTeam } from '@/lib/teams';
import type { PlayerState, CommanderDamageMap } from '@/lib/types';

// Small crown glyph mirrored from PlayerCard so the Monarch toggle reads the
// same in both surfaces without forking the whole card component.
const CrownIcon = (props: React.ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M5 16l-3-10 5.5 4L12 2l4.5 8L22 6l-3 10H5zm0 2h14v2H5v-2z" />
  </SvgIcon>
);

export interface TeamMember {
  player: PlayerState;
  idx: number;
}

// Highest energy across a team's seats (the shared readout reacts to whichever
// teammate is highest). One rule for both this team and the opposing team.
function maxEnergy(list: TeamMember[]): number {
  return list.reduce((max, m) => Math.max(max, m.player.energy), 0);
}

// A member's commanders in tuple order: commander → dmg[0], partner → dmg[1].
// Single source of the partner/damage-index convention shared by the editable
// cmd-damage rows and the read-only opponent summary.
function commanderEntries(member: TeamMember): { name: string; isPartner: boolean }[] {
  const out = [{ name: member.player.commander.name, isPartner: false }];
  if (member.player.partner) out.push({ name: member.player.partner.name, isPartner: true });
  return out;
}

interface TeamPanelProps {
  teamNumber: number;
  teamName: string;
  opponentTeamName?: string;
  onTeamNameChange: (name: string) => void;
  members: TeamMember[];
  opponents: TeamMember[];
  commanderDamage: CommanderDamageMap;
  startingLife: number;
  isActiveTeam: boolean;
  // Turn-timer + Highlight parity with standard games: the active team's panel
  // reflects the countdown color (border/shadow with Highlight off, app-bar
  // gradient with Highlight on) via the shared useTimerTokens hook.
  elapsedSeconds: number;
  turnTimerSeconds: number;
  highlightMode: boolean;
  // Remote phone (per team): the primary seat's code drives one QR / connection
  // indicator for the whole team; a phone scanning it renders this same panel.
  seatCode?: string;
  remoteConnected?: boolean;
  // On the phone the panel fills the viewport, so it scales up (dvmax clamps)
  // and reflows its three sections into a vertical stack. Table stays as-is.
  remoteMode?: boolean;
  onLifeChange: (idx: number, delta: number) => void;
  onPoisonChange: (idx: number, delta: number) => void;
  onCommanderTaxChange: (idx: number, delta: number) => void;
  // Per-player (NOT shared): each teammate keeps their own energy, experience,
  // and monarch / initiative / city's-blessing toggles. These route to the
  // member's real seat idx, never the primary seat.
  onEnergyChange: (idx: number, delta: number) => void;
  onExperienceChange: (idx: number, delta: number) => void;
  onToggleMonarch: (idx: number) => void;
  onToggleInitiative: (idx: number) => void;
  onToggleCitysBlessing: (idx: number) => void;
  onCommanderDamageChange: (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => void;
  // Concede is a team action: eliminating either head concedes the whole team
  // (reconcileTeams marks both eliminated together). Routed through the primary seat.
  onEliminate: (idx: number) => void;
  onUndoEliminate: (idx: number) => void;
}

// Responsive size tokens. Table (!remoteMode) keeps the original fixed px so the
// on-table strip is pixel-identical; phone (remoteMode) uses viewport-relative
// clamp(dvmax) so the panel scales with the device, mirroring PlayerCard.
interface Sz {
  art: number | string;
  briefName: number | string;
  briefSub: number | string;
  miniGlyph: number | string;
  xsLabel: number | string;
  val: number | string;
  btnSm: number | string;
  btnCmd: number | string;
  btnPoison: number | string;
  btnLife: number | string;
  ability: number | string;
  sectionLabel: number | string;
  poisonVal: number | string;
  cmdLabel: number | string;
  cmdVal: number | string;
  life: string;
  oppLife: string;
  big: boolean;
}

// Table: dvh-based clamps whose mins equal the original fixed px, so the strip
// never shrinks below its shipped look but grows on taller displays.
const SZ_TABLE: Sz = {
  art: 'clamp(36px, 4dvh, 46px)',
  briefName: 'clamp(12px, 1.4dvh, 15px)',
  briefSub: 'clamp(10px, 1.2dvh, 13px)',
  miniGlyph: 'clamp(11px, 1.3dvh, 14px)',
  xsLabel: 'clamp(9px, 1.1dvh, 12px)',
  val: 'clamp(12px, 1.4dvh, 15px)',
  btnSm: 'clamp(12px, 1.4dvh, 15px)',
  btnCmd: 'clamp(14px, 1.6dvh, 17px)',
  btnPoison: 'clamp(16px, 1.8dvh, 20px)',
  btnLife: 'clamp(30px, 3.6dvh, 40px)',
  ability: 'clamp(14px, 1.6dvh, 17px)',
  sectionLabel: 'clamp(10px, 1.2dvh, 13px)',
  poisonVal: 'clamp(20px, 2.3dvh, 26px)',
  cmdLabel: 'clamp(12px, 1.4dvh, 15px)',
  cmdVal: 'clamp(14px, 1.6dvh, 17px)',
  life: 'clamp(52px, 9dvh, 96px)',
  oppLife: 'clamp(30px, 4.5dvh, 48px)', big: false,
};

// Phone: scale to dvmin (the panel's SHORT/constraining dimension), not dvmax —
// this strip is wide and short, so dvmax tracked the large side and ballooned on
// wide screens. dvmin sizes to what's actually tight, so the caps don't overshoot.
const SZ_PHONE: Sz = {
  art: 'clamp(36px, 11dvmin, 54px)',
  briefName: 'clamp(13px, 3.6dvmin, 18px)',
  briefSub: 'clamp(10px, 3dvmin, 14px)',
  miniGlyph: 'clamp(12px, 3.4dvmin, 16px)',
  xsLabel: 'clamp(10px, 3dvmin, 14px)',
  val: 'clamp(14px, 4dvmin, 19px)',
  btnSm: 'clamp(14px, 4dvmin, 19px)',
  btnCmd: 'clamp(15px, 4.2dvmin, 20px)',
  btnPoison: 'clamp(16px, 4.5dvmin, 22px)',
  btnLife: 'clamp(28px, 9dvmin, 42px)',
  ability: 'clamp(15px, 4.2dvmin, 20px)',
  sectionLabel: 'clamp(10px, 3dvmin, 14px)',
  poisonVal: 'clamp(20px, 6dvmin, 28px)',
  cmdLabel: 'clamp(13px, 3.7dvmin, 18px)',
  cmdVal: 'clamp(15px, 4.2dvmin, 20px)',
  life: 'clamp(52px, 20dvmin, 100px)',
  oppLife: 'clamp(32px, 11dvmin, 54px)',
  big: true,
};

type LongPress = ReturnType<typeof useLongPress>;

// Reuses the standard panel's long-press: tap = ±1 (onClick), hold ~500ms = ±5
// (onLongPress). guardClick stops the release from also firing the ±1.
function StatButton({ onClick, onLongPress, lpKey, lp, big = false, children }: {
  onClick: () => void;
  onLongPress?: () => void;
  lpKey?: string;
  lp?: LongPress;
  big?: boolean;
  children: React.ReactNode;
}) {
  const wired = !!(onLongPress && lp && lpKey);
  return (
    <IconButton
      onClick={wired ? lp!.guardClick(onClick) : onClick}
      {...(wired && {
        onPointerDown: (e: React.PointerEvent) => { e.stopPropagation(); lp!.startLongPress(lpKey!, onLongPress!); },
        onPointerUp: lp!.cancelLongPress,
        onPointerLeave: lp!.cancelLongPress,
        onPointerCancel: lp!.cancelLongPress,
      })}
      sx={{
        color: 'primary.main',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        p: big ? 0.5 : 0.25,
      }}
    >
      {children}
    </IconButton>
  );
}

/** Compact per-player counter (energy / experience) used inside a teammate block. */
function MiniCounter({
  glyph,
  glyphColor,
  label,
  value,
  active,
  onDec,
  onInc,
  onDec5,
  onInc5,
  lp,
  lpKey,
  sz,
}: {
  glyph: React.ReactNode;
  glyphColor: string;
  label: string;
  value: number;
  active: boolean;
  onDec: () => void;
  onInc: () => void;
  onDec5: () => void;
  onInc5: () => void;
  lp: LongPress;
  lpKey: string;
  sz: Sz;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.25}>
      <Box component="span" sx={{ fontSize: sz.miniGlyph, lineHeight: 1, color: glyphColor }}>{glyph}</Box>
      <Typography sx={{ fontSize: sz.xsLabel, color: 'text.secondary' }}>{label}</Typography>
      <StatButton onClick={onDec} onLongPress={onDec5} lpKey={`${lpKey}-dec`} lp={lp} big={sz.big}><RemoveIcon sx={{ fontSize: sz.btnSm }} /></StatButton>
      <Typography sx={{ fontSize: sz.val, fontWeight: 700, minWidth: 14, textAlign: 'center', color: active ? glyphColor : 'text.primary' }}>
        {value}
      </Typography>
      <StatButton onClick={onInc} onLongPress={onInc5} lpKey={`${lpKey}-inc`} lp={lp} big={sz.big}><AddIcon sx={{ fontSize: sz.btnSm }} /></StatButton>
    </Stack>
  );
}

/** Compact per-player ability toggle (monarch / initiative / city's blessing). */
function AbilityToggle({
  active,
  color,
  title,
  onToggle,
  big = false,
  children,
}: {
  active: boolean;
  color: string;
  title: string;
  onToggle: () => void;
  big?: boolean;
  children: React.ReactNode;
}) {
  return (
    <IconButton
      onClick={onToggle}
      title={title}
      sx={{
        p: big ? 0.5 : 0.25,
        borderRadius: 1,
        border: (theme) => `1px solid ${active ? color : theme.palette.divider}`,
        bgcolor: active ? `${color}22` : 'transparent',
        color: active ? color : 'text.disabled',
      }}
    >
      {children}
    </IconButton>
  );
}

/** Compact commander identity shown in the team app bar, one per pilot. */
function CommanderBrief({ member, align, onView, sz }: { member?: TeamMember; align: 'left' | 'right'; onView: (name: string) => void; sz: Sz }) {
  if (!member) return <Box sx={{ flex: 1, minWidth: 0 }} />;
  const { player } = member;
  return (
    <Box sx={{ flex: 1, minWidth: 0, textAlign: align }}>
      <Typography
        noWrap
        onClick={() => onView(player.commander.name)}
        title={player.commander.name}
        sx={{ fontSize: sz.briefName, fontWeight: 700, lineHeight: 1.15, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
      >
        {player.playerName}
      </Typography>
      <Typography noWrap sx={{ fontSize: sz.briefSub, color: 'text.secondary', lineHeight: 1.15 }}>
        {player.commander.name}{player.partner ? ` / ${player.partner.name}` : ''}
      </Typography>
    </Box>
  );
}

export function TeamPanel({
  teamNumber,
  teamName,
  opponentTeamName,
  onTeamNameChange,
  members,
  opponents,
  commanderDamage,
  startingLife,
  isActiveTeam,
  elapsedSeconds,
  turnTimerSeconds,
  highlightMode,
  seatCode,
  remoteConnected = false,
  remoteMode = false,
  onLifeChange,
  onPoisonChange,
  onCommanderTaxChange,
  onEnergyChange,
  onExperienceChange,
  onToggleMonarch,
  onToggleInitiative,
  onToggleCitysBlessing,
  onCommanderDamageChange,
  onEliminate,
  onUndoEliminate,
}: TeamPanelProps) {
  // Commander card preview — card-local view state, copied verbatim from
  // PlayerCard so any commander (own team or opposing) can be tapped to enlarge.
  // Nothing here is shared or routed through a handler; it is pure local view.
  const [cmdPreviewName, setCmdPreviewName] = useState<string | null>(null);
  const [cmdPreviewUrl, setCmdPreviewUrl] = useState<string | null>(null);
  const [cmdPreviewZoom, setCmdPreviewZoom] = useState(1);
  const [cmdPreviewBase, setCmdPreviewBase] = useState<{ w: number; h: number } | null>(null);
  const cmdScrollRef = useRef<HTMLDivElement>(null);

  // Inline team-name editing in the app bar. Commit on Enter/blur, cancel on Esc.
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(teamName);
  const startEditName = () => { setNameDraft(teamName); setEditingName(true); };
  const commitName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== teamName) onTeamNameChange(trimmed);
    setEditingName(false);
  };

  // Resolve preview URL when name changes; reset zoom/base.
  useEffect(() => {
    if (!cmdPreviewName) { setCmdPreviewUrl(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); return; }
    setCmdPreviewUrl(null);
    setCmdPreviewZoom(1);
    setCmdPreviewBase(null);
    getCardImageByName(cmdPreviewName).then(url => setCmdPreviewUrl(url));
  }, [cmdPreviewName]);

  // Scroll to bottom when zoom changes so the card bottom stays in view.
  useEffect(() => {
    if (cmdPreviewZoom > 1 && cmdScrollRef.current) {
      cmdScrollRef.current.scrollTop = cmdScrollRef.current.scrollHeight;
    }
  }, [cmdPreviewZoom]);

  // Life and poison are mirrored across teammates, so either head is the team
  // total. All shared mutations target the primary seat; reconcileTeams mirrors.
  const primary = members[0];
  const life = primary?.player.life ?? startingLife;
  const poison = primary?.player.poison ?? 0;
  const eliminated = primary?.player.isEliminated ?? false;
  // A team is "conceded" if either head was manually conceded (vs eliminated by
  // damage). reconcileTeams only stamps isConceded on the head that received the
  // eliminate event, so check both.
  const conceded = members.some((m) => m.player.isConceded);
  const [showConcedeConfirm, setShowConcedeConfirm] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const closeMenu = () => { setMenuAnchor(null); setShowConcedeConfirm(false); };

  const sz = remoteMode ? SZ_PHONE : SZ_TABLE;

  // Long-press ±5 on every +/- control, reused from the standard panel's hook.
  const longPress = useLongPress();

  // Shared smooth ramp (greens above starting life, reds out below) — same fn
  // the standard PlayerPanel uses. lifeColor returns '' at exactly starting life;
  // LifeTotal's `color ?? primary.main` does NOT treat '' as default, so fall back
  // explicitly (matches the opponent readout below).
  const teamLifeColor = lifeColor(life, startingLife) || 'primary.main';

  // Opposing team's shared stats (mirrored across their heads, so either head
  // is the team total). Shown in the cmd-damage column so you can track them.
  const oppPrimary = opponents[0];
  const oppLife = oppPrimary?.player.life ?? startingLife;
  const oppPoison = oppPrimary?.player.poison ?? 0;
  const oppEnergy = maxEnergy(opponents);
  const oppEliminated = oppPrimary?.player.isEliminated ?? false;
  const oppTeamNumber = oppPrimary?.player.teamNumber ?? otherTeam(teamNumber);
  const oppColor = teamColor(oppTeamNumber);
  const oppLifeColor = lifeColor(oppLife, startingLife) || 'text.primary';

  // Commander damage THIS team's commanders have dealt to the opposing team,
  // read off the opponent primary seat as target (mirror of their own panel).
  const oppReceived = oppPrimary
    ? members.flatMap((m) => {
        const dmg = commanderDamage[oppPrimary.idx]?.[m.idx] ?? [0, 0];
        return commanderEntries(m).map((e) => ({ name: e.name, value: e.isPartner ? dmg[1] : dmg[0] }));
      })
    : [];

  // Turn timer, shared with standard games. The active team plays the role of
  // the current player: its panel carries the countdown color.
  const timer = useTimerTokens(elapsedSeconds, turnTimerSeconds, isActiveTeam);

  // The shared life number's reactions (damage flash, energy pulse, poison boil)
  // are rendered by the shared <LifeTotal>. Per-player counters react to the
  // team's HIGHEST value, so a teammate raising energy lights up the shared
  // readout the moment they do. Poison/life are mirrored across heads, so their
  // single value is already the team value.
  const teamEnergy = maxEnergy(members);

  // Drive the damage flash transiently off shared-life decreases, then clear it
  // so it plays once per hit and unmounts when done.
  const prevLifeRef = useRef(life);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [damageFlash, setDamageFlash] = useState(0);
  useEffect(() => {
    if (life < prevLifeRef.current) {
      setDamageFlash(prevLifeRef.current - life);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setDamageFlash(0), 650);
    }
    prevLifeRef.current = life;
  }, [life]);
  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current); }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        // Highlight OFF: the active team's border/shadow carry the timer color.
        // Highlight ON: the border stays neutral and the color rides the app bar
        // gradient instead (see the header Stack below). Matches PlayerCard.
        border: !highlightMode && timer.currentPlayerBorder
          ? timer.currentPlayerBorder
          : (theme) => `2px solid ${isActiveTeam ? theme.palette.primary.main : theme.palette.divider}`,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#221913' : '#FFFDFA'),
        boxShadow: !highlightMode && timer.currentPlayerShadow
          ? timer.currentPlayerShadow
          : isActiveTeam ? (theme) => `0 0 14px 2px ${theme.palette.primary.main}55` : 'none',
        ...(!highlightMode && timer.isTimerExpired && TIMER_EXPIRED_BORDER_BLINK),
        opacity: eliminated ? 0.5 : 1,
        overflow: 'hidden',
      }}
    >
      {/* Custom 2HG app bar: each commander's current details flank a centered,
          editable team name (click to rename — persists with the live game
          state). Mirrors the 4-player card's header, doubled for the two pilots. */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          flexShrink: 0, px: 1.25, py: 0.5,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          transition: 'background 0.3s ease',
          // Highlight ON: the active team's app bar carries the timer gradient.
          background: isActiveTeam && highlightMode
            ? `linear-gradient(90deg, ${timer.timerColorRgba(0.3)} 0%, ${timer.timerColorRgba(0.7)} 50%, ${timer.timerColorRgba(0.3)} 100%)`
            : undefined,
          ...(isActiveTeam && highlightMode && timer.isTimerExpired && TIMER_EXPIRED_HEADER_BLINK),
        }}
      >
        <CommanderBrief member={members[0]} align="left" onView={setCmdPreviewName} sz={sz} />

        {/* Center: color badge + editable team name + active flag. */}
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexShrink: 0 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 0.5, flexShrink: 0, bgcolor: teamColor(teamNumber) }} />
          {editingName ? (
            <TextField
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => { if (e.key === 'Enter') commitName(); else if (e.key === 'Escape') setEditingName(false); }}
              autoFocus
              variant="standard"
              inputProps={{ maxLength: 32, style: { textAlign: 'center' } }}
              sx={{ '& .MuiInput-input': { fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, py: 0 } }}
            />
          ) : (
            <Typography
              noWrap
              onClick={startEditName}
              title="Click to rename team"
              sx={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, cursor: 'pointer', textAlign: 'center', '&:hover': { color: 'primary.main' } }}
            >
              {teamName}
            </Typography>
          )}
          {isActiveTeam && !eliminated && (
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
              Active
            </Typography>
          )}
          {/* Green dot when a teammate's phone is connected (glanceable). The QR
              to pair one lives in the gear menu below. */}
          {remoteConnected && (
            <SmartphoneIcon sx={{ fontSize: 16, color: 'success.main', animation: 'remotePulse 2s ease-in-out infinite', '@keyframes remotePulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } }, flexShrink: 0 }} />
          )}
          {/* Team options gear — QR pairing + concede live here to stay unobtrusive. */}
          <IconButton size="small" title="Team options" onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ p: 0.25, color: 'text.disabled' }}>
            <SettingsIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
            slotProps={{ paper: { sx: { maxHeight: 'min(80dvh, 480px)', overflowY: 'auto' } } }}
          >
            {seatCode && !remoteConnected && (
              <Box
                key="qr"
                onClick={() => { navigator.clipboard?.writeText(seatCode).catch(() => {}); }}
                sx={{ px: 2, py: 0.75, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
              >
                <Typography sx={{ fontSize: 10, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>Pair a phone</Typography>
                <Box sx={{ p: 0.75, bgcolor: '#fff', borderRadius: 1 }}>
                  <QRCodeSVG value={`${typeof window !== 'undefined' ? window.location.origin : ''}${ASSET_BASE}/game-manager/remote/?code=${seatCode}`} size={92} />
                </Box>
                <Typography sx={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: 2, fontWeight: 700 }}>{seatCode}</Typography>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>tap to copy code</Typography>
              </Box>
            )}
            {remoteConnected && (
              <MenuItem key="connected" disabled sx={{ fontSize: 13, opacity: '1 !important' }}>
                <SmartphoneIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} /> Phone connected
              </MenuItem>
            )}
            {eliminated
              ? [
                  <MenuItem key="undo" onClick={() => { onUndoEliminate(primary.idx); closeMenu(); }} sx={{ fontSize: 13, fontWeight: 700, color: 'error.main' }}>
                    <ReplayIcon sx={{ fontSize: 16, mr: 1 }} /> Undo concede
                  </MenuItem>,
                ]
              : showConcedeConfirm
              ? [
                  <MenuItem key="confirm" onClick={() => { onEliminate(primary.idx); closeMenu(); }} sx={{ fontSize: 13, fontWeight: 700, color: '#DAA520' }}>
                    <ElimIcon sx={{ fontSize: 16, mr: 1 }} /> Confirm concede
                  </MenuItem>,
                  <MenuItem key="cancel" onClick={() => setShowConcedeConfirm(false)} sx={{ fontSize: 13, color: 'text.secondary' }}>
                    Cancel
                  </MenuItem>,
                ]
              : [
                  <MenuItem key="concede" onClick={() => setShowConcedeConfirm(true)} sx={{ fontSize: 13, color: 'text.secondary' }}>
                    <ElimIcon sx={{ fontSize: 16, mr: 1 }} /> Concede
                  </MenuItem>,
                ]}
          </Menu>
        </Stack>

        <CommanderBrief member={members[1]} align="right" onView={setCmdPreviewName} sz={sz} />
      </Stack>

      {/* Concede confirm + conceded/eliminated overlays (mirrors PlayerCard). */}
      {showConcedeConfirm && !eliminated && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none', bgcolor: 'rgba(218,165,32,0.12)' }}>
          <Typography sx={{ fontWeight: 900, color: '#DAA520', fontSize: 22, letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.5)', transform: 'rotate(-10deg)' }}>
            CONCEDE?
          </Typography>
        </Box>
      )}
      {eliminated && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11, pointerEvents: 'none', bgcolor: conceded ? 'rgba(218,165,32,0.12)' : 'transparent' }}>
          <Typography
            sx={{ fontWeight: 900, letterSpacing: 4, fontSize: 40, transform: 'rotate(-12deg)', color: conceded ? '#DAA520' : 'error.main' }}
            style={conceded ? { WebkitTextStroke: '2px black' } : undefined}
          >
            {conceded ? 'CONCEDED' : 'ELIMINATED'}
          </Typography>
        </Box>
      )}

      {/* Body: landscape stat row (pilots | shared life | commander damage).
          Row on the table and on a phone held landscape; a phone in PORTRAIT
          stacks the three sections into a column (scrollable). */}
      <Box sx={{
        flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 1.5, p: 1.5,
        ...(remoteMode && { '@media (orientation: portrait)': { flexDirection: 'column', overflowY: 'auto', gap: 2 } }),
      }}>
      {/* Section A: pilots + per-commander tax. Ordered to the RIGHT (order 3). */}
      <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0, justifyContent: 'center', order: 3 }}>
        {members.map((m) => (
          <Box key={m.idx}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {m.player.commander.artCropUrl && (
                <Box
                  component="img"
                  src={m.player.commander.artCropUrl}
                  alt=""
                  onClick={(e) => { e.stopPropagation(); setCmdPreviewName(m.player.commander.name); }}
                  title={m.player.commander.name}
                  sx={{ height: sz.art, width: 'auto', borderRadius: 0.5, flexShrink: 0, cursor: 'pointer', '&:hover': { opacity: 0.85 } }}
                />
              )}
              {/* Per-player controls, labeled with the pilot they apply to so the
                  two teammates' counters aren't ambiguous. */}
              <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                {/* Name + commander tax share the top row: tax is the most-used
                    control, so it sits by the pilot name and reads slightly larger
                    (cmd-tier tokens) than the energy/XP counters below. */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    onClick={() => setCmdPreviewName(m.player.commander.name)}
                    title={`View ${m.player.commander.name}`}
                    sx={{ fontSize: sz.briefName, fontWeight: 700, lineHeight: 1.1, color: teamColor(teamNumber), minWidth: 0, flexShrink: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                  >
                    {m.player.playerName}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
                    <Typography sx={{ fontSize: sz.cmdLabel, color: 'text.secondary' }}>Tax</Typography>
                    <StatButton onClick={() => onCommanderTaxChange(m.idx, -1)} onLongPress={() => onCommanderTaxChange(m.idx, -5)} lpKey={`tax-${m.idx}-dec`} lp={longPress} big={sz.big}><RemoveIcon sx={{ fontSize: sz.btnCmd }} /></StatButton>
                    <Typography sx={{ fontSize: sz.cmdVal, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{m.player.commanderTax}</Typography>
                    <StatButton onClick={() => onCommanderTaxChange(m.idx, 1)} onLongPress={() => onCommanderTaxChange(m.idx, 5)} lpKey={`tax-${m.idx}-inc`} lp={longPress} big={sz.big}><AddIcon sx={{ fontSize: sz.btnCmd }} /></StatButton>
                  </Stack>
                </Stack>
                {/* Individual per-player counters (energy + XP). */}
                <Stack direction="row" alignItems="center" useFlexGap flexWrap="wrap" spacing={1}>
                  <MiniCounter
                    glyph="⚡"
                    glyphColor="#4FC8FF"
                    label="Energy"
                    value={m.player.energy}
                    active={m.player.energy > 0}
                    onDec={() => onEnergyChange(m.idx, -1)}
                    onInc={() => onEnergyChange(m.idx, 1)}
                    onDec5={() => onEnergyChange(m.idx, -5)}
                    onInc5={() => onEnergyChange(m.idx, 5)}
                    lp={longPress}
                    lpKey={`energy-${m.idx}`}
                    sz={sz}
                  />
                  <MiniCounter
                    glyph="✦"
                    glyphColor="#DAA520"
                    label="XP"
                    value={m.player.experience}
                    active={m.player.experience > 0}
                    onDec={() => onExperienceChange(m.idx, -1)}
                    onInc={() => onExperienceChange(m.idx, 1)}
                    onDec5={() => onExperienceChange(m.idx, -5)}
                    onInc5={() => onExperienceChange(m.idx, 5)}
                    lp={longPress}
                    lpKey={`xp-${m.idx}`}
                    sz={sz}
                  />
                </Stack>
                {/* Per-player ability toggles (individual, not shared). */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AbilityToggle active={m.player.isMonarch} color="#DAA520" title="Monarch" onToggle={() => onToggleMonarch(m.idx)} big={sz.big}>
                    <CrownIcon sx={{ fontSize: sz.ability }} />
                  </AbilityToggle>
                  <AbilityToggle active={m.player.hasInitiative} color="#4FC3F7" title="Initiative" onToggle={() => onToggleInitiative(m.idx)} big={sz.big}>
                    <InitiativeIcon sx={{ fontSize: sz.ability }} />
                  </AbilityToggle>
                  <AbilityToggle active={m.player.hasCitysBlessing} color="#7851A9" title="City's Blessing" onToggle={() => onToggleCitysBlessing(m.idx)} big={sz.big}>
                    <CityIcon sx={{ fontSize: sz.ability }} />
                  </AbilityToggle>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Section B: shared life (centered + prominent) and poison. Order 2 (center). */}
      <Stack sx={{ flex: 1.2, minWidth: 0, alignItems: 'center', justifyContent: 'center', order: 2 }} spacing={0.5}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
          <StatButton onClick={() => onLifeChange(primary.idx, -1)} onLongPress={() => onLifeChange(primary.idx, -5)} lpKey="life-dec" lp={longPress} big={sz.big}><RemoveIcon sx={{ fontSize: sz.btnLife }} /></StatButton>
          <LifeTotal
            value={life}
            fontSize={sz.life}
            color={teamLifeColor}
            damageFlash={damageFlash}
            energy={teamEnergy}
            poison={poison}
            reactions={{ swipes: false }}
            sx={{ minWidth: 96, textAlign: 'center' }}
          />
          <StatButton onClick={() => onLifeChange(primary.idx, 1)} onLongPress={() => onLifeChange(primary.idx, 5)} lpKey="life-inc" lp={longPress} big={sz.big}><AddIcon sx={{ fontSize: sz.btnLife }} /></StatButton>
        </Stack>
        <Typography sx={{ fontSize: sz.sectionLabel, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
          Shared Life
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 0.5 }}>
          <Typography sx={{ fontSize: sz.sectionLabel, color: 'text.secondary' }}>Poison</Typography>
          <StatButton onClick={() => onPoisonChange(primary.idx, -1)} onLongPress={() => onPoisonChange(primary.idx, -5)} lpKey="poison-dec" lp={longPress} big={sz.big}><RemoveIcon sx={{ fontSize: sz.btnPoison }} /></StatButton>
          <Typography sx={{ fontWeight: 800, fontSize: sz.poisonVal, minWidth: 26, textAlign: 'center', color: poison >= 15 ? '#2E7D32' : 'text.primary' }}>
            {poison}
          </Typography>
          <StatButton onClick={() => onPoisonChange(primary.idx, 1)} onLongPress={() => onPoisonChange(primary.idx, 5)} lpKey="poison-inc" lp={longPress} big={sz.big}><AddIcon sx={{ fontSize: sz.btnPoison }} /></StatButton>
          <Typography sx={{ fontSize: sz.sectionLabel, color: 'text.secondary' }}>/ 15</Typography>
        </Stack>
      </Stack>

      {/* Section C: opposing-team stats + commander damage taken from each of
          their commanders. Ordered to the LEFT (order 1). All damage is tracked
          against this team's primary seat so reconcileTeams sums it for the
          21-damage check. */}
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0, justifyContent: 'center', order: 1 }}>
        {/* Opposing team's shared life/poison, so you can see how they're doing. */}
        <Box sx={{ opacity: oppEliminated ? 0.5 : 1 }}>
          <Typography noWrap sx={{ fontSize: sz.briefName, fontWeight: 700, color: oppColor, lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {opponentTeamName ?? `Team ${oppTeamNumber}`}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            {/* Reuse the shared LifeTotal so the opponent number carries the same
                color ramp + poison boil / energy pulse (read-only, no buttons). */}
            <LifeTotal
              value={oppLife}
              fontSize={sz.oppLife}
              color={oppLifeColor}
              energy={oppEnergy}
              poison={oppPoison}
              reactions={{ swipes: false }}
              sx={{ minWidth: 0, lineHeight: 1 }}
            />
            {/* Commander damage this team has dealt to them, stacked beside the
                life (read-only; edited from their own panel). Only shows once > 0. */}
            {oppReceived.some((r) => r.value > 0) && (
              <Stack spacing={0} sx={{ minWidth: 0, maxWidth: '16ch' }}>
                {oppReceived.filter((r) => r.value > 0).map((r) => (
                  <Stack
                    key={r.name}
                    direction="row"
                    alignItems="baseline"
                    spacing={0.5}
                    onClick={() => setCmdPreviewName(r.name)}
                    title={`View ${r.name}`}
                    sx={{ minWidth: 0, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                  >
                    <Typography noWrap sx={{ fontSize: sz.xsLabel, color: 'text.secondary', lineHeight: 1.3, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</Typography>
                    <Typography sx={{ fontSize: sz.xsLabel, color: 'text.secondary', lineHeight: 1.3, flexShrink: 0, whiteSpace: 'nowrap' }}>
                      <Box component="span" sx={{ fontWeight: 800, color: r.value >= 21 ? '#B71C1C' : 'text.primary' }}>{r.value}</Box>/21
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
            {oppPoison > 0 && (
              <Typography sx={{ fontSize: sz.cmdLabel, color: 'text.secondary', ml: 0.5 }}>
                Poison <Box component="span" sx={{ fontWeight: 800, color: oppPoison >= 15 ? '#2E7D32' : 'text.primary' }}>{oppPoison}</Box><Box component="span" sx={{ color: 'text.disabled' }}> / 15</Box>
              </Typography>
            )}
          </Stack>
        </Box>
        <Typography sx={{ fontSize: sz.sectionLabel, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
          Cmd Damage
        </Typography>
        {opponents.flatMap((opp) => {
          const dmg = commanderDamage[primary.idx]?.[opp.idx] ?? [0, 0];
          // Same commander → dmg[0] / partner → dmg[1] convention as oppReceived.
          return commanderEntries(opp).map((e) => (
            <CmdDamageRow
              key={`${opp.idx}-${e.isPartner ? 'partner' : 'own'}`}
              label={e.name}
              value={e.isPartner ? dmg[1] : dmg[0]}
              onChange={(delta) => onCommanderDamageChange(primary.idx, opp.idx, e.isPartner, delta)}
              onView={() => setCmdPreviewName(e.name)}
              lp={longPress}
              lpKey={`cmd-${opp.idx}-${e.isPartner ? 'partner' : 'own'}`}
              sz={sz}
            />
          ));
        })}
      </Stack>
      </Box>

      {/* Commander card preview overlay — scoped to this panel via the root
          Box's position:relative + inset:0, copied from PlayerCard. */}
      {cmdPreviewName && (
        <Box
          onClick={() => { setCmdPreviewName(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); }}
          sx={{ position: 'absolute', inset: 0, zIndex: 35, bgcolor: 'rgba(0,0,0,0.88)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}
        >
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); setCmdPreviewName(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); }}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: 'rgba(255,255,255,0.85)', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' } }}
          >
            <CloseIcon sx={{ fontSize: 28 }} />
          </IconButton>
          {cmdPreviewUrl ? (
            cmdPreviewZoom > 1 ? (
              <Box
                ref={cmdScrollRef}
                onClick={() => { setCmdPreviewName(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); }}
                sx={{ position: 'absolute', inset: 8, overflow: 'auto', cursor: 'zoom-out', background: 'transparent !important' }}
              >
                <Box sx={{ minWidth: '100%', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent !important' }}>
                  <Box
                    component="img"
                    src={cmdPreviewUrl}
                    alt={cmdPreviewName ?? ''}
                    draggable={false}
                    onClick={(e) => { e.stopPropagation(); setCmdPreviewZoom(1); }}
                    sx={{ display: 'block', width: cmdPreviewBase ? cmdPreviewBase.w * cmdPreviewZoom : 'auto', height: 'auto', borderRadius: '4.7%', userSelect: 'none', flexShrink: 0 }}
                  />
                </Box>
              </Box>
            ) : (
              <Box
                component="img"
                src={cmdPreviewUrl}
                alt={cmdPreviewName ?? ''}
                draggable={false}
                onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => setCmdPreviewBase({ w: e.currentTarget.clientWidth, h: e.currentTarget.clientHeight })}
                onClick={(e) => { e.stopPropagation(); setCmdPreviewZoom(2.5); }}
                sx={{ maxHeight: '88%', maxWidth: '88%', borderRadius: '4.7%', display: 'block', cursor: 'zoom-in', userSelect: 'none' }}
              />
            )
          ) : (
            <CircularProgress size={36} thickness={4} sx={{ color: 'rgba(255,255,255,0.45)' }} />
          )}
        </Box>
      )}
    </Box>
  );
}

function CmdDamageRow({ label, value, onChange, onView, lp, lpKey, sz }: { label: string; value: number; onChange: (delta: number) => void; onView: () => void; lp: LongPress; lpKey: string; sz: Sz }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <Typography
        noWrap
        onClick={(e) => { e.stopPropagation(); onView(); }}
        sx={{ flex: 1, minWidth: 0, fontSize: sz.cmdLabel, color: value >= 21 ? '#B71C1C' : 'text.primary', fontWeight: value >= 21 ? 700 : 400, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
      >
        {label}
      </Typography>
      <StatButton onClick={() => onChange(-1)} onLongPress={() => onChange(-5)} lpKey={`${lpKey}-dec`} lp={lp} big={sz.big}><RemoveIcon sx={{ fontSize: sz.btnCmd }} /></StatButton>
      <Typography onClick={(e) => { e.stopPropagation(); onView(); }} title="View commander" sx={{ fontSize: sz.cmdVal, fontWeight: 700, minWidth: 22, textAlign: 'center', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{value}</Typography>
      <StatButton onClick={() => onChange(1)} onLongPress={() => onChange(5)} lpKey={`${lpKey}-inc`} lp={lp} big={sz.big}><AddIcon sx={{ fontSize: sz.btnCmd }} /></StatButton>
      <Typography sx={{ fontSize: sz.xsLabel, color: 'text.secondary' }}>/21</Typography>
    </Stack>
  );
}
