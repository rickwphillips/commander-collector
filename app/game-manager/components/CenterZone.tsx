'use client';

import { useState } from 'react';
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import type { PlayerState } from '../types';

interface CenterZoneProps {
  turnNumber: number;
  currentPlayerIdx: number;
  players: PlayerState[];
  onNextTurn: () => void;
  onEndGame: () => void;
}

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function CenterZone({
  turnNumber,
  currentPlayerIdx,
  players,
  onNextTurn,
  onEndGame,
}: CenterZoneProps) {
  const [d6Result, setD6Result] = useState<number | null>(null);
  const [d20Result, setD20Result] = useState<number | null>(null);
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const currentPlayer = players[currentPlayerIdx];

  return (
    <>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A1410' : '#FFF8F0',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'auto',
        }}
      >
        <CardContent sx={{ flex: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack spacing={1.5}>
            {/* Turn tracker */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1 }}>
                Turn {turnNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Active:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: 13,
                }}
              >
                {currentPlayer?.playerName ?? '—'}
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={onNextTurn}
                fullWidth
                sx={{ mt: 0.5, fontSize: 11 }}
              >
                Next Turn
              </Button>
            </Box>

            {/* Dice roller */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                Dice
              </Typography>
              <Stack direction="row" spacing={0.5} justifyContent="center">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setD6Result(rollDie(6))}
                  sx={{ fontSize: 11, px: 1 }}
                >
                  d6
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setD20Result(rollDie(20))}
                  sx={{ fontSize: 11, px: 1 }}
                >
                  d20
                </Button>
              </Stack>
              {(d6Result !== null || d20Result !== null) && (
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 0.5 }}>
                  {d6Result !== null && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">d6</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', lineHeight: 1 }}>
                        {d6Result}
                      </Typography>
                    </Box>
                  )}
                  {d20Result !== null && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">d20</Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 900,
                          lineHeight: 1,
                          color:
                            d20Result === 20
                              ? '#DAA520'
                              : d20Result === 1
                              ? 'error.main'
                              : 'primary.main',
                        }}
                      >
                        {d20Result}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>

            {/* Coin flip */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => setCoinResult(Math.random() < 0.5 ? 'Heads' : 'Tails')}
                sx={{ fontSize: 11 }}
              >
                Flip Coin
              </Button>
              {coinResult && (
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, mt: 0.5, color: 'primary.main' }}
                >
                  {coinResult}
                </Typography>
              )}
            </Box>

            {/* End game */}
            <Button
              variant="outlined"
              color="error"
              size="small"
              fullWidth
              onClick={() => setConfirmEnd(true)}
              sx={{ fontSize: 11 }}
            >
              End Game
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={confirmEnd} onClose={() => setConfirmEnd(false)} maxWidth="xs" fullWidth>
        <DialogTitle>End Game?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to end the current game?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmEnd(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setConfirmEnd(false);
              onEndGame();
            }}
            color="error"
            variant="contained"
          >
            End Game
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
