// Custom hook for managing tasks

import { useState, useEffect, useCallback } from 'react';
import { taskService } from '@/services/task.service';
import type { Task, PaginationParams } from '@/types';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTasks(params?: PaginationParams, archived: boolean = false): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = archived
        ? await taskService.getArchived(params)
        : await taskService.getAll(params);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [params, archived]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  };
}
