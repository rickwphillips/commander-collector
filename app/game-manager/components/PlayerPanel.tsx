'use client';

import { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Chip,
  TextField,
  Divider,
} from '@mui/material';
import CrownIcon from '@mui/icons-material/EmojiEvents';
import InitiativeIcon from '@mui/icons-material/Shield';
import type { PlayerState, CommanderDamageMap } from '../types';

interface PlayerPanelProps {
  player: PlayerState;
  playerIdx: number;
  allPlayers: PlayerState[];
  commanderDamage: CommanderDamageMap;
  onLifeChange: (idx: number, delta: number) => void;
  onPoisonChange: (idx: number, delta: number) => void;
  onCommanderTaxChange: (idx: number, delta: number) => void;
  onToggleMonarch: (idx: number) => void;
  onToggleInitiative: (idx: number) => void;
  onCommanderDamageChange: (
    targetIdx: number,
    sourceIdx: number,
    isPartner: boolean,
    delta: number
  ) => void;
  onEliminate: (idx: number) => void;
  onUndoEliminate: (idx: number) => void;
}

export function PlayerPanel({
  player,
  playerIdx,
  allPlayers,
  commanderDamage,
  onLifeChange,
  onPoisonChange,
  onCommanderTaxChange,
  onToggleMonarch,
  onToggleInitiative,
  onCommanderDamageChange,
  onEliminate,
  onUndoEliminate,
}: PlayerPanelProps) {
  const [eliminateTurnInput, setEliminateTurnInput] = useState('');
  const [showEliminateConfirm, setShowEliminateConfirm] = useState(false);

  const totalCmdDmgReceived = Object.entries(commanderDamage[playerIdx] ?? {}).reduce(
    (sum, [, dmg]) => sum + dmg[0] + dmg[1],
    0
  );

  const isLifeLow = player.life <= 0;
  const isPoisoned = player.poison >= 10;
  const isCmdDmgHigh = Object.values(commanderDamage[playerIdx] ?? {}).some(
    (dmg) => dmg[0] + dmg[1] >= 21
  );
  const isWarning = isLifeLow || isPoisoned || isCmdDmgHigh;

  const handleEliminateConfirm = () => {
    onEliminate(playerIdx);
    setShowEliminateConfirm(false);
    setEliminateTurnInput('');
  };

  const counterBtn = (
    label: string,
    value: number,
    onDec: () => void,
    onInc: () => void
  ) => (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>
        {label}:
      </Typography>
      <IconButton size="small" onClick={onDec} sx={{ p: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>−</Typography>
      </IconButton>
      <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>
        {value}
      </Typography>
      <IconButton size="small" onClick={onInc} sx={{ p: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>+</Typography>
      </IconButton>
    </Stack>
  );

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: (theme) => {
          if (isWarning) {
            return theme.palette.mode === 'dark'
              ? 'rgba(180, 40, 40, 0.18)'
              : 'rgba(220, 80, 80, 0.08)';
          }
          return theme.palette.mode === 'dark' ? '#2A1F14' : '#FFF8F0';
        },
        border: (theme) =>
          isWarning
            ? '2px solid #e53935'
            : `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        opacity: player.isEliminated ? 0.5 : 1,
      }}
    >
      {/* Eliminated overlay */}
      {player.isEliminated && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              color: 'error.main',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              letterSpacing: 2,
              transform: 'rotate(-15deg)',
            }}
          >
            ELIMINATED
          </Typography>
        </Box>
      )}

      {/* Header */}
      <Box sx={{ px: 1.5, py: 1, bgcolor: 'rgba(0,0,0,0.08)' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {player.commander.artCropUrl && (
            <Box
              component="img"
              src={player.commander.artCropUrl}
              alt={player.commander.name}
              sx={{ height: 50, width: 'auto', borderRadius: 1, flexShrink: 0 }}
            />
          )}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
              {player.playerName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {player.deckName} · {player.commander.name}
              {player.partner ? ` / ${player.partner.name}` : ''}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => onToggleMonarch(playerIdx)}
              sx={{
                color: player.isMonarch ? '#DAA520' : 'text.disabled',
                p: 0.5,
              }}
              title="Monarch"
            >
              <CrownIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onToggleInitiative(playerIdx)}
              sx={{
                color: player.hasInitiative ? '#4FC3F7' : 'text.disabled',
                p: 0.5,
              }}
              title="Initiative"
            >
              <InitiativeIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        {(player.isMonarch || player.hasInitiative) && (
          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
            {player.isMonarch && (
              <Chip label="Monarch" size="small" sx={{ bgcolor: '#DAA520', color: '#000', fontSize: 10 }} />
            )}
            {player.hasInitiative && (
              <Chip label="Initiative" size="small" sx={{ bgcolor: '#4FC3F7', color: '#000', fontSize: 10 }} />
            )}
          </Stack>
        )}
      </Box>

      <Divider />

      {/* Life + counters */}
      <Box sx={{ px: 1.5, py: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Life total */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                color: isLifeLow ? 'error.main' : 'primary.main',
                lineHeight: 1,
              }}
            >
              {player.life}
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={0.25} sx={{ mt: 0.5 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => onLifeChange(playerIdx, -5)}
                sx={{ minWidth: 36, px: 0.5, py: 0.25, fontSize: 11 }}
              >
                −5
              </Button>
              <IconButton
                onClick={() => onLifeChange(playerIdx, -1)}
                sx={{ p: 0.5, minWidth: 40, minHeight: 40 }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>−</Typography>
              </IconButton>
              <IconButton
                onClick={() => onLifeChange(playerIdx, 1)}
                sx={{ p: 0.5, minWidth: 40, minHeight: 40 }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>+</Typography>
              </IconButton>
              <Button
                variant="outlined"
                size="small"
                onClick={() => onLifeChange(playerIdx, 5)}
                sx={{ minWidth: 36, px: 0.5, py: 0.25, fontSize: 11 }}
              >
                +5
              </Button>
            </Stack>
          </Box>

          {/* Counters */}
          <Box>
            {counterBtn(
              '☠ Poison',
              player.poison,
              () => onPoisonChange(playerIdx, -1),
              () => onPoisonChange(playerIdx, 1)
            )}
            {counterBtn(
              'Cmd Tax',
              player.commanderTax * 2,
              () => onCommanderTaxChange(playerIdx, -1),
              () => onCommanderTaxChange(playerIdx, 1)
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Tax: {player.commanderTax}× (+{player.commanderTax * 2})
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Commander damage */}
      <Box sx={{ px: 1.5, py: 0.75, flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
          Commander Damage Received
          {totalCmdDmgReceived > 0 && (
            <Typography
              component="span"
              variant="caption"
              sx={{ ml: 1, color: isCmdDmgHigh ? 'error.main' : 'text.secondary' }}
            >
              (total: {totalCmdDmgReceived})
            </Typography>
          )}
        </Typography>

        {allPlayers.map((source, sourceIdx) => {
          if (sourceIdx === playerIdx) return null;
          const dmg = commanderDamage[playerIdx]?.[sourceIdx] ?? [0, 0];
          return (
            <Box key={sourceIdx} sx={{ mb: 0.5 }}>
              <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
                <Typography variant="caption" sx={{ minWidth: 60, fontWeight: 600 }} noWrap>
                  {source.playerName}
                </Typography>
                {/* Main commander */}
                <Stack direction="row" alignItems="center" spacing={0.25}>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 70 }}>
                    {source.commander.name.split(' ')[0]}:
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onCommanderDamageChange(playerIdx, sourceIdx, false, -1)}
                    sx={{ p: 0.25 }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>−</Typography>
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      minWidth: 20,
                      textAlign: 'center',
                      fontWeight: 700,
                      color: dmg[0] >= 21 ? 'error.main' : 'text.primary',
                    }}
                  >
                    {dmg[0]}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onCommanderDamageChange(playerIdx, sourceIdx, false, 1)}
                    sx={{ p: 0.25 }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>+</Typography>
                  </IconButton>
                </Stack>
                {/* Partner commander */}
                {source.partner && (
                  <Stack direction="row" alignItems="center" spacing={0.25}>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 70 }}>
                      {source.partner.name.split(' ')[0]}:
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => onCommanderDamageChange(playerIdx, sourceIdx, true, -1)}
                      sx={{ p: 0.25 }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>−</Typography>
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{
                        minWidth: 20,
                        textAlign: 'center',
                        fontWeight: 700,
                        color: dmg[1] >= 21 ? 'error.main' : 'text.primary',
                      }}
                    >
                      {dmg[1]}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => onCommanderDamageChange(playerIdx, sourceIdx, true, 1)}
                      sx={{ p: 0.25 }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>+</Typography>
                    </IconButton>
                  </Stack>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>

      <Divider />

      {/* Eliminate */}
      <Box sx={{ px: 1.5, py: 0.75 }}>
        {player.isEliminated ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
              Eliminated{player.eliminatedTurn ? ` (Turn ${player.eliminatedTurn})` : ''}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onUndoEliminate(playerIdx)}
              sx={{ fontSize: 10, py: 0, px: 1 }}
            >
              Undo
            </Button>
          </Stack>
        ) : showEliminateConfirm ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <TextField
              size="small"
              label="Turn"
              type="number"
              value={eliminateTurnInput}
              onChange={(e) => setEliminateTurnInput(e.target.value)}
              inputProps={{ min: 1 }}
              sx={{ width: 80 }}
            />
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={handleEliminateConfirm}
              sx={{ fontSize: 10 }}
            >
              Confirm
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setShowEliminateConfirm(false)}
              sx={{ fontSize: 10 }}
            >
              Cancel
            </Button>
          </Stack>
        ) : (
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => setShowEliminateConfirm(true)}
            sx={{ fontSize: 11 }}
          >
            Eliminate
          </Button>
        )}
      </Box>
    </Box>
  );
}
