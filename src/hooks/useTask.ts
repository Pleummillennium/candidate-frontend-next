// Custom hook for managing a single task

import { useState, useEffect, useCallback } from 'react';
import { taskService } from '@/services/task.service';
import type { Task } from '@/types';

interface UseTaskResult {
  task: Task | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTask(id: number): UseTaskResult {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getById(id);
      setTask(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  return {
    task,
    loading,
    error,
    refetch: fetchTask,
  };
}
