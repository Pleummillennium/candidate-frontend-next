// Custom hook for managing candidates

import { useState, useEffect, useCallback } from 'react';
import { candidateService } from '@/services/candidate.service';
import type { Candidate, PaginationParams } from '@/types';

interface UseCandidatesResult {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  refetch: () => Promise<void>;
}

export function useCandidates(params?: PaginationParams): UseCandidatesResult {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params?.page || 1);
  const [limit, setLimit] = useState(params?.limit || 10);

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await candidateService.getAll(params);
      setCandidates(response.data);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return {
    candidates,
    loading,
    error,
    total,
    page,
    limit,
    refetch: fetchCandidates,
  };
}
