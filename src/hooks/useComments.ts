// Custom hook for managing comments

import { useState, useEffect, useCallback } from 'react';
import { commentService } from '@/services/comment.service';
import type { Comment } from '@/types';

interface UseCommentsResult {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useComments(taskId: number): UseCommentsResult {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await commentService.getByTaskId(taskId);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    refetch: fetchComments,
  };
}
