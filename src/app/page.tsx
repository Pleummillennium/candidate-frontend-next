'use client';

import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  AssignmentTurnedIn,
  Comment,
  Timeline,
} from '@mui/icons-material';

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        position: 'relative',
        py: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(129, 140, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(192, 132, 252, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            fontWeight={700}
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Candidate Management
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Track and manage your interview candidates efficiently
          </Typography>

          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              onClick={() => router.push('/candidates')}
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                fontWeight: 600,
              }}
            >
              View Candidates
            </Button>
          </Box>
        </Box>

        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <AssignmentTurnedIn sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Track Candidates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage candidates through interview stages
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Comment sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Interview Notes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add comments and feedback for each candidate
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Timeline sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Status Tracking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To Do → In Progress → Done
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box textAlign="center" mt={6}>
          <Typography variant="body2" color="text.secondary">
            Next.js 16 + TypeScript + Material-UI + Go Backend
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
