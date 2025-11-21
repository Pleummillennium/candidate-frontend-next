// Custom hook for managing a single candidate

import { useState, useEffect, useCallback } from 'react';
import { candidateService } from '@/services/candidate.service';
import type { Candidate } from '@/types';

interface UseCandidateResult {
  candidate: Candidate | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCandidate(id: number): UseCandidateResult {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidate = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await candidateService.getById(id);
      setCandidate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  return {
    candidate,
    loading,
    error,
    refetch: fetchCandidate,
  };
}
