'use client';

import { useState, useEffect } from 'react';
import { useTask, useComments, useTaskLogs } from '@/hooks';
import { useRouter, useParams } from 'next/navigation';
import { taskService } from '@/services/task.service';
import { commentService } from '@/services/comment.service';
import { authService } from '@/services/auth.service';
import type { TaskStatus } from '@/types';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Save,
  Cancel,
  Delete,
  CalendarToday,
  Person,
  Comment as CommentIcon,
  History,
} from '@mui/icons-material';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = Number(params.id);

  const { task: candidate, loading: candidateLoading, error: candidateError, refetch: refetchCandidate } = useTask(candidateId);
  const { comments, loading: commentsLoading, refetch: refetchComments } = useComments(candidateId);
  const { logs, loading: logsLoading, refetch: refetchLogs } = useTaskLogs(candidateId);

  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    status: 'To Do' as TaskStatus,
  });

  // Check if current user is the creator
  const currentUser = authService.getCurrentUser();
  const isOwner = candidate && currentUser && candidate.creator_id === currentUser.id;

  // Check authentication
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.replace('/auth/login');
    }
  }, [router]);

  // Initialize edit data when candidate loads
  useEffect(() => {
    if (candidate && editData.title === '') {
      setEditData({
        title: candidate.title,
        description: candidate.description,
        status: candidate.status,
      });
    }
  }, [candidate]);

  const handleUpdate = async () => {
    try {
      await taskService.update(candidateId, editData);
      setIsEditing(false);
      refetchCandidate();
      refetchLogs();
    } catch (err) {
      alert('Failed to update candidate');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentService.create(candidateId, { content: newComment });
      setNewComment('');
      refetchComments();
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Delete this comment?')) return;

    try {
      await commentService.delete(commentId);
      refetchComments();
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  const getStatusColor = (status: TaskStatus): 'warning' | 'info' | 'success' => {
    return status === 'To Do' ? 'warning' : status === 'In Progress' ? 'info' : 'success';
  };

  const getActionIcon = (action: string) => {
    const actionLower = action?.toLowerCase();
    if (actionLower === 'created') return '➕';
    if (actionLower === 'updated') return '✏️';
    if (actionLower === 'commented') return '💬';
    if (actionLower === 'archived') return '📦';
    if (actionLower === 'deleted') return '🗑️';
    return '📝';
  };

  const getActionColor = (action: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
    const actionLower = action?.toLowerCase();
    if (actionLower === 'created') return 'success';
    if (actionLower === 'updated') return 'primary';
    if (actionLower === 'commented') return 'info';
    if (actionLower === 'archived') return 'warning';
    if (actionLower === 'deleted') return 'error';
    return 'secondary';
  };

  if (candidateLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="body1" color="text.secondary" mt={2}>
            Loading candidate details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (candidateError || !candidate) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        }}
      >
        <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
          <CardContent sx={{ p: 6 }}>
            <Typography variant="h1" mb={2}>❌</Typography>
            <Typography variant="h5" color="error" fontWeight={600} gutterBottom>
              Error
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {candidateError || 'Candidate not found'}
            </Typography>
            <Button
              onClick={() => router.push('/candidates')}
              variant="contained"
              sx={{
                mt: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              }}
            >
              Back to Candidates
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={4}>
          <Button
            onClick={() => router.push('/candidates')}
            startIcon={<ArrowBack />}
            sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}
          >
            Back to Candidates
          </Button>
        </Box>

        {/* Candidate Info Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            {!isEditing ? (
              <>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={3} flexWrap="wrap" gap={2}>
                  <Box flex={1}>
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                      {candidate.title}
                    </Typography>
                    <Chip
                      label={candidate.status}
                      color={getStatusColor(candidate.status)}
                      sx={{ fontWeight: 600, fontSize: '0.9rem' }}
                    />
                  </Box>
                  {isOwner && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="contained"
                      startIcon={<Edit />}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        fontWeight: 600,
                      }}
                    >
                      Edit Candidate
                    </Button>
                  )}
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
                    <Typography variant="overline" fontWeight={600} color="text.secondary" display="block" mb={1}>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {candidate.description || 'No description provided'}
                    </Typography>
                  </Paper>

                  <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={2} mb={3}>
                    {candidate.due_date && (
                      <Paper sx={{ p: 3, bgcolor: 'rgba(99, 102, 241, 0.1)' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <CalendarToday color="primary" fontSize="small" />
                          <Typography variant="overline" fontWeight={600} color="primary">
                            Interview Date
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight={500}>
                          {new Date(candidate.due_date).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Paper>
                    )}

                    <Paper sx={{ p: 3, bgcolor: 'rgba(168, 85, 247, 0.1)' }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Person color="secondary" fontSize="small" />
                        <Typography variant="overline" fontWeight={600} color="secondary">
                          Created By
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        {candidate.creator_name || `User #${candidate.creator_id}`}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box display="flex" gap={4} color="text.secondary">
                    <Typography variant="body2">
                      <strong>Created:</strong> {new Date(candidate.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Last Updated:</strong> {new Date(candidate.updated_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </>
            ) : (
              <Box>
                <Typography variant="h5" fontWeight={700} mb={3}>
                  Edit Candidate
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    fullWidth
                    label="Candidate Name"
                    required
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  />

                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={5}
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  />

                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editData.status}
                      label="Status"
                      onChange={(e) => setEditData({ ...editData, status: e.target.value as TaskStatus })}
                    >
                      <MenuItem value="To Do">To Do - Awaiting Interview</MenuItem>
                      <MenuItem value="In Progress">In Progress - Interviewing</MenuItem>
                      <MenuItem value="Done">Done - Completed</MenuItem>
                    </Select>
                  </FormControl>

                  <Box display="flex" gap={2} pt={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleUpdate}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        fontWeight: 600,
                        py: 1.5,
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => setIsEditing(false)}
                      sx={{ fontWeight: 600, py: 1.5 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Comments & History Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ px: 2 }}
            >
              <Tab
                icon={<CommentIcon />}
                iconPosition="start"
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" fontWeight={600}>
                      Interview Notes & Feedback
                    </Typography>
                    <Chip label={comments.length} size="small" color="primary" />
                  </Box>
                }
                sx={{ textTransform: 'none', py: 2 }}
              />
              <Tab
                icon={<History />}
                iconPosition="start"
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" fontWeight={600}>
                      Change History
                    </Typography>
                    <Chip label={logs.length} size="small" color="secondary" />
                  </Box>
                }
                sx={{ textTransform: 'none', py: 2 }}
              />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Tab Panel 0: Comments */}
            {activeTab === 0 && (
              <Box>

            {/* Add Comment Form */}
            <Box component="form" onSubmit={handleAddComment} mb={4}>
              <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your interview notes, feedback, or observations..."
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    fontWeight: 600,
                  }}
                >
                  Add Comment
                </Button>
              </Paper>
            </Box>

            {/* Comments List */}
            {commentsLoading ? (
              <Box textAlign="center" py={4}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" mt={2}>
                  Loading comments...
                </Typography>
              </Box>
            ) : comments.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'background.default' }}>
                <Typography variant="h3" mb={2}>📝</Typography>
                <Typography variant="h6" color="text.secondary">
                  No comments yet. Be the first to add interview feedback!
                </Typography>
              </Paper>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                {comments.map((comment) => (
                  <Card key={comment.id} variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {comment.user_name || `User #${comment.user_id}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
              </Box>
            )}

            {/* Tab Panel 1: History */}
            {activeTab === 1 && (
              <Box>
            {/* Change Logs List */}
            {logsLoading ? (
              <Box textAlign="center" py={4}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" mt={2}>
                  Loading change history...
                </Typography>
              </Box>
            ) : logs.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'background.default' }}>
                <Typography variant="h3" mb={2}>📋</Typography>
                <Typography variant="h6" color="text.secondary">
                  No changes recorded yet
                </Typography>
              </Paper>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                {logs.map((log) => (
                  <Paper
                    key={log.id}
                    sx={{
                      p: 3,
                      bgcolor: 'background.default',
                      border: '2px solid',
                      borderColor: `${getActionColor(log.action)}.main`,
                      borderLeft: '6px solid',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateX(4px)',
                      }
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="start" gap={2} mb={2}>
                      <Box display="flex" alignItems="start" gap={2} flex={1}>
                        <Typography variant="h5" sx={{ mt: 0.5 }}>
                          {getActionIcon(log.action)}
                        </Typography>
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Chip
                              label={log.action.toUpperCase()}
                              size="small"
                              color={getActionColor(log.action)}
                              sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(log.created_at).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                            <Person fontSize="small" sx={{ color: 'text.secondary', fontSize: 18 }} />
                            <Typography variant="body2" fontWeight={600} color="text.primary">
                              {log.user_name || `User #${log.user_id}`}
                            </Typography>
                          </Box>
                          {log.details && (
                            <Paper
                              sx={{
                                p: 2,
                                bgcolor: 'rgba(129, 140, 248, 0.05)',
                                border: '1px solid rgba(129, 140, 248, 0.2)',
                              }}
                            >
                              <Typography variant="body2" sx={{ lineHeight: 1.7, fontStyle: 'italic' }}>
                                {log.details}
                              </Typography>
                            </Paper>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
