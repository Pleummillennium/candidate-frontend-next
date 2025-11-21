// Comment service for API interactions

import { apiClient } from '@/lib/api-client';
import type { Comment, CreateCommentInput, UpdateCommentInput } from '@/types';

export const commentService = {
  // Get all comments for a task
  async getByTaskId(taskId: number): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/api/tasks/${taskId}/comments`);
  },

  // Create new comment
  async create(taskId: number, data: CreateCommentInput): Promise<Comment> {
    return apiClient.post<Comment>(`/api/tasks/${taskId}/comments`, data);
  },

  // Update comment
  async update(id: number, data: UpdateCommentInput): Promise<Comment> {
    return apiClient.put<Comment>(`/api/comments/${id}`, data);
  },

  // Delete comment
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/comments/${id}`);
  },
};
