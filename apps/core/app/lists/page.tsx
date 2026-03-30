'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Grow,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import StyleIcon from '@mui/icons-material/Style';
import { PageContainer } from '@/components/PageContainer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { api } from '@/lib/api';
import type { CardList } from '@/lib/types';

export default function ListsPage() {
  const router = useRouter();
  const [lists, setLists] = useState<CardList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // New list dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<CardList | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchLists(); }, []);

  const fetchLists = async () => {
    try {
      const data = await api.getLists();
      setLists(data);
    } catch {
      setError('Failed to load lists');
    } finally {
      setLoading(false);
    }
  };

  const filteredLists = useMemo(() => {
    if (!searchQuery.trim()) return lists;
    const q = searchQuery.toLowerCase();
    return lists.filter((l) => l.name.toLowerCase().includes(q));
  }, [lists, searchQuery]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await api.createList(newName.trim(), newDesc.trim() || undefined);
      setCreateOpen(false);
      setNewName('');
      setNewDesc('');
      router.push(`/lists/detail?id=${res.list_id}`);
    } catch {
      setError('Failed to create list');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteList(deleteTarget.id);
      setLists((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setError('Failed to delete list');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Card Lists" subtitle="Standalone card collections">
        <LoadingSpinner message="Loading lists..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Card Lists"
      subtitle="Standalone card collections"
      actions={
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          New List
        </Button>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {lists.length > 1 && (
        <Grow in timeout={400}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ pb: '12px !important' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grow>
      )}

      {lists.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <StyleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="h6" sx={{ mb: 0.5 }}>No lists yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create a standalone card list or detach one from a deck
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            New List
          </Button>
        </Card>
      ) : filteredLists.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No lists match your search
          </Typography>
          <Button variant="outlined" startIcon={<ClearIcon />} onClick={() => setSearchQuery('')}>
            Clear Search
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredLists.map((list, index) => (
            <Grid key={list.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Grow in timeout={600 + index * 100}>
                <Card>
                  <CardActionArea component="div" onClick={() => router.push(`/lists/detail?id=${list.id}`)}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }} noWrap>
                            {list.name}
                          </Typography>
                          {list.description && (
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {list.description}
                            </Typography>
                          )}
                        </Box>
                        <Tooltip title="Delete list">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(list); }}
                            sx={{ flexShrink: 0, ml: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>

                      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <Chip
                          icon={<StyleIcon />}
                          label={`${list.card_count} cards`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create List Dialog */}
      <Dialog open={createOpen} onClose={() => { setCreateOpen(false); setNewName(''); setNewDesc(''); }} maxWidth="xs" fullWidth>
        <DialogTitle>New List</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              size="small"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
              autoFocus
            />
            <TextField
              label="Description (optional)"
              fullWidth
              size="small"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateOpen(false); setNewName(''); setNewDesc(''); }}>Cancel</Button>
          <Button variant="contained" disabled={!newName.trim() || creating} onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete List</DialogTitle>
        <DialogContent>
          <Typography>
            Delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" disabled={deleting} onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
