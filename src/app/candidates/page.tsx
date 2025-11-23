'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/hooks';
import { taskService } from '@/services/task.service';
import { authService } from '@/services/auth.service';
import type { TaskStatus } from '@/types';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Fab,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Archive,
  CalendarToday,
  Person,
} from '@mui/icons-material';

export default function CandidatesPage() {
  const router = useRouter();
  const { tasks: candidates, loading, error, refetch } = useTasks();
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get current user
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.replace('/auth/login');
    }
  }, [router]);

  const filteredCandidates = candidates
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;
    try {
      await taskService.delete(id);
      refetch();
    } catch (err) {
      alert('Failed to delete candidate');
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await taskService.archive(id);
      refetch();
    } catch (err) {
      alert('Failed to archive candidate');
    }
  };

  const getStatusColor = (status: TaskStatus): 'warning' | 'info' | 'success' => {
    return status === 'To Do' ? 'warning' : status === 'In Progress' ? 'info' : 'success';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Candidates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your interview candidates - {candidates.length} total
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box mb={4}>
        <TextField
          fullWidth
          placeholder="Search candidates by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3, maxWidth: 600 }}
        />

        <Box display="flex" gap={2} flexWrap="wrap">
          {[
            { label: 'All', value: 'all', count: candidates.length },
            { label: 'To Do', value: 'To Do', count: candidates.filter(c => c.status === 'To Do').length },
            { label: 'In Progress', value: 'In Progress', count: candidates.filter(c => c.status === 'In Progress').length },
            { label: 'Done', value: 'Done', count: candidates.filter(c => c.status === 'Done').length },
          ].map(({ label, value, count }) => (
            <Chip
              key={value}
              label={`${label} (${count})`}
              onClick={() => setFilter(value as any)}
              color={filter === value ? 'primary' : 'default'}
              variant={filter === value ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 600,
                fontSize: '0.9rem',
                py: 2.5,
                px: 1,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Candidates Grid */}
      {filteredCandidates.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              👔
            </Typography>
            <Typography variant="h6" gutterBottom>
              No candidates found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {searchTerm ? "Try adjusting your search" : "Start by adding your first candidate!"}
            </Typography>
            {!searchTerm && (
              <Button
                component={Link}
                href="/candidates/new"
                variant="contained"
                startIcon={<Add />}
                sx={{ mt: 2 }}
              >
                Add First Candidate
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={3}>
          {filteredCandidates.map((candidate) => (
            <Box key={candidate.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
                      {candidate.title}
                    </Typography>
                    <Chip
                      label={candidate.status}
                      color={getStatusColor(candidate.status)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {candidate.description || 'No description'}
                  </Typography>

                  {candidate.due_date && (
                    <Box display="flex" alignItems="center" gap={0.5} color="primary.main">
                      <CalendarToday fontSize="small" />
                      <Typography variant="caption">
                        {new Date(candidate.due_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    component={Link}
                    href={`/candidates/${candidate.id}`}
                    variant="contained"
                    size="small"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    }}
                  >
                    View Details
                  </Button>
                  {currentUser && candidate.creator_id === currentUser.id && (
                    <>
                      <IconButton size="small" onClick={() => handleArchive(candidate.id)} color="default">
                        <Archive fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(candidate.id)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        component={Link}
        href="/candidates/new"
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        }}
      >
        <Add />
      </Fab>
    </Container>
  );
}
