// Custom hook for managing task change logs

import { useState, useEffect, useCallback } from 'react';
import { taskService } from '@/services/task.service';
import type { TaskLog } from '@/types';

interface UseTaskLogsResult {
  logs: TaskLog[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTaskLogs(taskId: number): UseTaskLogsResult {
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getLogs(taskId);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
  };
}
