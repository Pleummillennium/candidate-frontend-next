// Candidate service for API interactions

import { apiClient } from '@/lib/api-client';
import type {
  Candidate,
  CreateCandidateInput,
  UpdateCandidateInput,
  CandidateListResponse,
  PaginationParams,
} from '@/types';

export const candidateService = {
  // Get all candidates with pagination
  async getAll(params?: PaginationParams): Promise<CandidateListResponse> {
    return apiClient.get<CandidateListResponse>('/candidates', { params });
  },

  // Get candidate by ID
  async getById(id: number): Promise<Candidate> {
    return apiClient.get<Candidate>(`/candidates/${id}`);
  },

  // Create new candidate
  async create(data: CreateCandidateInput): Promise<Candidate> {
    return apiClient.post<Candidate>('/candidates', data);
  },

  // Update candidate
  async update(id: number, data: UpdateCandidateInput): Promise<Candidate> {
    return apiClient.put<Candidate>(`/candidates/${id}`, data);
  },

  // Delete candidate (soft delete)
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/candidates/${id}`);
  },

  // Archive candidate
  async archive(id: number): Promise<void> {
    return apiClient.post<void>(`/candidates/${id}/archive`);
  },

  // Unarchive candidate
  async unarchive(id: number): Promise<void> {
    return apiClient.post<void>(`/candidates/${id}/unarchive`);
  },
};
