'use client';

import { useState } from 'react';
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import type { PlayerState, CommanderDamageMap, GameManagerPrefill } from '../types';
import { GAME_MANAGER_PREFILL_KEY } from '../types';
import { BracketChip } from '@/components/BracketChip';

interface GameEndSummaryProps {
  players: PlayerState[];
  turnNumber: number;
  startingLife: number;
  commanderDamage: CommanderDamageMap;
  onLogGame: () => void;
  onNewGame: () => void;
  onDiscard: () => void;
}

export function GameEndSummary({
  players,
  turnNumber,
  startingLife,
  commanderDamage,
  onLogGame,
  onNewGame,
  onDiscard,
}: GameEndSummaryProps) {
  const [finishPositions, setFinishPositions] = useState<(number | '')[]>(
    players.map(() => '')
  );
  const [eliminatedTurns, setEliminatedTurns] = useState<(number | '')[]>(
    players.map((p) => (p.eliminatedTurn ?? turnNumber))
  );

  const handleLogGame = () => {
    const prefill: GameManagerPrefill = {
      playedAt: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })(),
      results: players.map((p, i) => ({
        playerId: p.playerId,
        deckId: p.deckId,
        finishPosition: finishPositions[i],
        eliminatedTurn: eliminatedTurns[i],
      })),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(GAME_MANAGER_PREFILL_KEY, JSON.stringify(prefill));
    }
    onLogGame();
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A1410' : '#FFF8F0',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 700 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
          Game Over
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          {turnNumber} turns · Starting life: {startingLife}
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {players.map((player, idx) => {
            const cmdDmgReceived = Object.values(commanderDamage[idx] ?? {}).reduce(
              (sum, dmg) => sum + dmg[0] + dmg[1],
              0
            );
            const isFirst = finishPositions[idx] === 1;

            return (
              <Card
                key={idx}
                variant="outlined"
                sx={{
                  borderColor: isFirst ? '#DAA520' : 'divider',
                  borderWidth: isFirst ? 2 : 1,
                }}
              >
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {player.playerName}
                          </Typography>
                          <BracketChip
                            deckId={player.deckId}
                            commander={player.commander.name}
                            size="small"
                          />
                          {player.teamNumber != null && (
                            <Box
                              sx={{
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 1,
                                bgcolor: player.teamNumber === 1 ? 'primary.main' : 'secondary.main',
                                color: '#fff',
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              Team {player.teamNumber}
                            </Box>
                          )}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {player.deckName} · {player.commander.name}
                          {player.partner ? ` / ${player.partner.name}` : ''}
                        </Typography>
                      </Box>
                      {player.commander.artCropUrl && (
                        <Box
                          component="img"
                          src={player.commander.artCropUrl}
                          alt={player.commander.name}
                          sx={{ height: 50, width: 'auto', borderRadius: 1 }}
                        />
                      )}
                    </Stack>

                    {/* Stats row */}
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Box>
                        <Typography variant="caption" color="text.secondary">Final Life</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {player.life}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Poison</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {player.poison}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Cmd Dmg Taken</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {cmdDmgReceived}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Place + eliminated turn */}
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <TextField
                        select
                        label="Place"
                        value={finishPositions[idx]}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : Number(e.target.value);
                          setFinishPositions((prev) => prev.map((v, i) => (i === idx ? val : v)));
                        }}
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="">—</MenuItem>
                        {players.map((_, pos) => (
                          <MenuItem key={pos + 1} value={pos + 1}>
                            {pos + 1 === 1
                              ? '1st (Winner)'
                              : `${pos + 1}${getOrdinalSuffix(pos + 1)}`}
                          </MenuItem>
                        ))}
                      </TextField>

                      {finishPositions[idx] !== 1 && (
                        <TextField
                          label="Eliminated Turn"
                          type="number"
                          value={eliminatedTurns[idx]}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            setEliminatedTurns((prev) => prev.map((v, i) => (i === idx ? val : v)));
                          }}
                          size="small"
                          inputProps={{ min: 1 }}
                          sx={{ minWidth: 140 }}
                        />
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            size="large"
            onClick={handleLogGame}
            fullWidth
          >
            Log Game
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={onNewGame}
            fullWidth
          >
            New Game
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="error"
            onClick={onDiscard}
            fullWidth
          >
            Discard Results
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
