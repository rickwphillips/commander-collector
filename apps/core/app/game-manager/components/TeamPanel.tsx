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
import { Box, Stack, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { PlayerState, CommanderDamageMap } from '@/lib/types';

export interface TeamMember {
  player: PlayerState;
  idx: number;
}

interface TeamPanelProps {
  teamNumber: number;
  members: TeamMember[];
  opponents: TeamMember[];
  commanderDamage: CommanderDamageMap;
  startingLife: number;
  isActiveTeam: boolean;
  onLifeChange: (idx: number, delta: number) => void;
  onPoisonChange: (idx: number, delta: number) => void;
  onCommanderTaxChange: (idx: number, delta: number) => void;
  onCommanderDamageChange: (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => void;
}

function StatButton({ onClick, size = 18, children }: { onClick: () => void; size?: number; children: React.ReactNode }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        color: 'primary.main',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        p: 0.25,
      }}
    >
      {children}
    </IconButton>
  );
}

export function TeamPanel({
  teamNumber,
  members,
  opponents,
  commanderDamage,
  startingLife,
  isActiveTeam,
  onLifeChange,
  onPoisonChange,
  onCommanderTaxChange,
  onCommanderDamageChange,
}: TeamPanelProps) {
  // Life and poison are mirrored across teammates, so either head is the team
  // total. All shared mutations target the primary seat; reconcileTeams mirrors.
  const primary = members[0];
  const life = primary?.player.life ?? startingLife;
  const poison = primary?.player.poison ?? 0;
  const eliminated = primary?.player.isEliminated ?? false;

  const lifeColor =
    life <= 0 ? '#B71C1C' : life <= 10 ? '#E65100' : life <= 20 ? '#F9A825' : 'primary.main';

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        border: (theme) => `2px solid ${isActiveTeam ? theme.palette.primary.main : theme.palette.divider}`,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#221913' : '#FFFDFA'),
        boxShadow: isActiveTeam ? (theme) => `0 0 14px 2px ${theme.palette.primary.main}55` : 'none',
        opacity: eliminated ? 0.5 : 1,
        overflow: 'hidden',
      }}
    >
      {/* Section A: team header + pilots + per-commander tax */}
      <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              bgcolor: teamNumber === 1 ? 'primary.main' : 'secondary.main',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            Team {teamNumber}
          </Box>
          {isActiveTeam && (
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Active
            </Typography>
          )}
        </Stack>
        {members.map((m) => (
          <Box key={m.idx}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {m.player.commander.artCropUrl && (
                <Box component="img" src={m.player.commander.artCropUrl} alt="" sx={{ height: 28, width: 'auto', borderRadius: 0.5, flexShrink: 0 }} />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{m.player.playerName}</Typography>
                <Typography noWrap sx={{ fontSize: 11, color: 'text.secondary', lineHeight: 1.2 }}>
                  {m.player.commander.name}{m.player.partner ? ` / ${m.player.partner.name}` : ''}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
              <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Tax</Typography>
              <StatButton onClick={() => onCommanderTaxChange(m.idx, -1)}><RemoveIcon sx={{ fontSize: 14 }} /></StatButton>
              <Typography sx={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{m.player.commanderTax}</Typography>
              <StatButton onClick={() => onCommanderTaxChange(m.idx, 1)}><AddIcon sx={{ fontSize: 14 }} /></StatButton>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Section B: shared life (centered + prominent) and poison */}
      <Stack sx={{ flex: 1.2, minWidth: 0, alignItems: 'center', justifyContent: 'center' }} spacing={0.5}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
          <StatButton onClick={() => onLifeChange(primary.idx, -1)}><RemoveIcon sx={{ fontSize: 30 }} /></StatButton>
          <Typography sx={{ fontWeight: 900, fontSize: 'clamp(52px, 11dvh, 120px)', lineHeight: 1, color: lifeColor, minWidth: 96, textAlign: 'center' }}>
            {life}
          </Typography>
          <StatButton onClick={() => onLifeChange(primary.idx, 1)}><AddIcon sx={{ fontSize: 30 }} /></StatButton>
        </Stack>
        <Typography sx={{ fontSize: 10, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
          Shared Life
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 0.5 }}>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Poison</Typography>
          <StatButton onClick={() => onPoisonChange(primary.idx, -1)}><RemoveIcon sx={{ fontSize: 16 }} /></StatButton>
          <Typography sx={{ fontWeight: 800, fontSize: 20, minWidth: 26, textAlign: 'center', color: poison >= 15 ? '#2E7D32' : 'text.primary' }}>
            {poison}
          </Typography>
          <StatButton onClick={() => onPoisonChange(primary.idx, 1)}><AddIcon sx={{ fontSize: 16 }} /></StatButton>
          <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>/ 15</Typography>
        </Stack>
      </Stack>

      {/* Section C: commander damage taken from each opposing commander.
          All damage is tracked against the team's primary seat so reconcileTeams
          sums it for the 21-damage elimination check. */}
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Cmd Damage
        </Typography>
        {opponents.flatMap((opp) => {
          const dmg = commanderDamage[primary.idx]?.[opp.idx] ?? [0, 0];
          const rows: React.ReactNode[] = [
            <CmdDamageRow
              key={`${opp.idx}-own`}
              label={opp.player.commander.name}
              value={dmg[0]}
              onChange={(delta) => onCommanderDamageChange(primary.idx, opp.idx, false, delta)}
            />,
          ];
          if (opp.player.partner) {
            rows.push(
              <CmdDamageRow
                key={`${opp.idx}-partner`}
                label={opp.player.partner.name}
                value={dmg[1]}
                onChange={(delta) => onCommanderDamageChange(primary.idx, opp.idx, true, delta)}
              />,
            );
          }
          return rows;
        })}
      </Stack>
    </Box>
  );
}

function CmdDamageRow({ label, value, onChange }: { label: string; value: number; onChange: (delta: number) => void }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <Typography noWrap sx={{ flex: 1, minWidth: 0, fontSize: 12, color: value >= 21 ? '#B71C1C' : 'text.primary', fontWeight: value >= 21 ? 700 : 400 }}>
        {label}
      </Typography>
      <StatButton onClick={() => onChange(-1)}><RemoveIcon sx={{ fontSize: 14 }} /></StatButton>
      <Typography sx={{ fontSize: 14, fontWeight: 700, minWidth: 22, textAlign: 'center' }}>{value}</Typography>
      <StatButton onClick={() => onChange(1)}><AddIcon sx={{ fontSize: 14 }} /></StatButton>
      <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>/21</Typography>
    </Stack>
  );
}
