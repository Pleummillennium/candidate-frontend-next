'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Cancel,
  TipsAndUpdates,
} from '@mui/icons-material';

export default function NewCandidatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check authentication
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.replace('/auth/login');
    }
  }, [router]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do' as TaskStatus,
    due_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert datetime-local format to ISO string for API
      const dueDateISO = formData.due_date ? new Date(formData.due_date).toISOString() : null;

      await taskService.create({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        due_date: dueDateISO,
      });

      router.push('/candidates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box mb={4}>
          <Button
            onClick={() => router.push('/candidates')}
            startIcon={<ArrowBack />}
            sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}
          >
            Back to Candidates
          </Button>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Add New Candidate
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill in the candidate information below to add them to your interview pipeline
          </Typography>
        </Box>

        {/* Form Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box display="flex" flexDirection="column" gap={3}>
                {/* Candidate Name */}
                <TextField
                  fullWidth
                  label="Candidate Name"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., John Doe"
                  helperText="Full name of the candidate"
                />

                {/* Description */}
                <TextField
                  fullWidth
                  label="Description / Resume Summary"
                  multiline
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add candidate details, resume highlights, experience, skills, or initial notes..."
                  helperText="Background information, skills, experience, or any relevant notes"
                />

                {/* Status */}
                <FormControl fullWidth>
                  <InputLabel>Initial Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Initial Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  >
                    <MenuItem value="To Do">⏳ To Do - Awaiting Interview</MenuItem>
                    <MenuItem value="In Progress">🔄 In Progress - Currently Interviewing</MenuItem>
                    <MenuItem value="Done">✅ Done - Interview Completed</MenuItem>
                  </Select>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, ml: 2 }}>
                    Current stage in the interview process
                  </Typography>
                </FormControl>

                {/* Interview Date */}
                <Box>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Interview Date (Optional)"
                    value={formData.due_date}
                    onChange={(e) => {
                      setFormData({ ...formData, due_date: e.target.value });
                      // Auto-close picker after selection
                      setTimeout(() => {
                        e.target.blur();
                      }, 100);
                    }}
                    InputLabelProps={{ shrink: true }}
                    helperText="Schedule the interview date and time"
                    sx={{
                      '& input[type="datetime-local"]::-webkit-calendar-picker-indicator': {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                      },
                    }}
                  />
                </Box>

                {/* Action Buttons */}
                <Box display="flex" gap={2} pt={3} borderTop="1px solid" borderColor="divider">
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? null : <Add />}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                      fontWeight: 600,
                    }}
                  >
                    {loading ? 'Creating...' : 'Create Candidate'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Cancel />}
                    onClick={() => router.push('/candidates')}
                    sx={{ fontWeight: 600, py: 1.5 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            border: '1px solid',
            borderColor: 'primary.main',
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <TipsAndUpdates color="primary" />
            <Typography variant="h6" fontWeight={600} color="primary">
              Quick Tips
            </Typography>
          </Box>
          <Box component="ul" sx={{ pl: 3, m: 0 }}>
            <Typography component="li" variant="body2" color="text.secondary" mb={1}>
              Add detailed notes in the description to remember key points about the candidate
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" mb={1}>
              Set the interview date to get reminders and keep track of your schedule
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              You can add interview notes and feedback after creating the candidate
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
