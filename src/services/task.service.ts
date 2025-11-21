// Task service for API interactions

import { apiClient } from '@/lib/api-client';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  PaginationParams,
} from '@/types';

export const taskService = {
  // Get all tasks with pagination
  async getAll(params?: PaginationParams): Promise<Task[]> {
    return apiClient.get<Task[]>('/api/tasks', { params });
  },

  // Get archived tasks
  async getArchived(params?: PaginationParams): Promise<Task[]> {
    return apiClient.get<Task[]>('/api/tasks/archived', { params });
  },

  // Get task by ID
  async getById(id: number): Promise<Task> {
    return apiClient.get<Task>(`/api/tasks/${id}`);
  },

  // Create new task
  async create(data: CreateTaskInput): Promise<Task> {
    return apiClient.post<Task>('/api/tasks', data);
  },

  // Update task
  async update(id: number, data: UpdateTaskInput): Promise<Task> {
    return apiClient.put<Task>(`/api/tasks/${id}`, data);
  },

  // Delete task
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/tasks/${id}`);
  },

  // Archive task
  async archive(id: number): Promise<void> {
    return apiClient.post<void>(`/api/tasks/${id}/archive`);
  },

  // Unarchive task
  async unarchive(id: number): Promise<void> {
    return apiClient.post<void>(`/api/tasks/${id}/unarchive`);
  },

  // Get task change logs
  async getLogs(id: number): Promise<any[]> {
    return apiClient.get<any[]>(`/api/tasks/${id}/logs`);
  },
};
