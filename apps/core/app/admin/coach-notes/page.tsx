'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, IconButton, Chip, Stack, Alert, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, Button, Tooltip,
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { PageContainer } from '@/components/PageContainer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/components/AuthGuard';
import { api } from '@/lib/api';
import type { CoachNote } from '@/lib/types';

type AdminNote = CoachNote & { player_id: number; player_name: string };

export default function CoachNotesAdminPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerFilter, setPlayerFilter] = useState<string>('all');
  const [editNote, setEditNote] = useState<AdminNote | null>(null);
  const [editDraft, setEditDraft] = useState({ topic: '', observation: '', reasoning: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') window.location.href = '/';
  }, [user]);

  const load = useCallback(async () => {
    try {
      const data = await api.getAllCoachNotes();
      setNotes(data);
    } catch {
      setError('Failed to load coach notes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this note?')) return;
    await api.deleteCoachNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const openEdit = (note: AdminNote) => {
    setEditNote(note);
    setEditDraft({ topic: note.topic, observation: note.observation, reasoning: note.reasoning ?? '' });
  };

  const handleSave = async () => {
    if (!editNote) return;
    setSaving(true);
    try {
      await api.updateCoachNote(editNote.id, editDraft);
      setNotes((prev) => prev.map((n) =>
        n.id === editNote.id ? { ...n, ...editDraft, updated_at: new Date().toISOString() } : n
      ));
      setEditNote(null);
    } catch {
      setError('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  const players = Array.from(new Set(notes.map((n) => n.player_name))).sort();
  const filtered = playerFilter === 'all' ? notes : notes.filter((n) => n.player_name === playerFilter);

  return (
    <PageContainer title="Coach Notes" subtitle="AI-saved observations for all players" backHref="/admin" backLabel="Admin">
      {loading ? (
        <LoadingSpinner message="Loading notes..." />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {filtered.length} note{filtered.length !== 1 ? 's' : ''}
              {playerFilter !== 'all' ? ` for ${playerFilter}` : ' across all players'}
            </Typography>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Player</InputLabel>
              <Select value={playerFilter} label="Player" onChange={(e) => setPlayerFilter(e.target.value)}>
                <MenuItem value="all">All players</MenuItem>
                {players.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Player</TableCell>
                  <TableCell>Topic</TableCell>
                  <TableCell>Observation</TableCell>
                  <TableCell>Reasoning</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell align="right" sx={{ width: 80 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((note) => (
                  <TableRow key={note.id} hover>
                    <TableCell>
                      <Chip label={note.player_name} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{note.topic}</TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{note.observation}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                        {note.reasoning ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(note.updated_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(note)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(note.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        No notes found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editNote} onClose={() => setEditNote(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Note — {editNote?.player_name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Topic"
              value={editDraft.topic}
              onChange={(e) => setEditDraft((d) => ({ ...d, topic: e.target.value }))}
              fullWidth size="small"
            />
            <TextField
              label="Observation"
              value={editDraft.observation}
              onChange={(e) => setEditDraft((d) => ({ ...d, observation: e.target.value }))}
              fullWidth multiline minRows={3} size="small"
            />
            <TextField
              label="Reasoning"
              value={editDraft.reasoning}
              onChange={(e) => setEditDraft((d) => ({ ...d, reasoning: e.target.value }))}
              fullWidth multiline minRows={2} size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditNote(null)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
