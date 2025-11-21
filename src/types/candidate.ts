// Candidate types matching backend API

export interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateCandidateInput {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateCandidateInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CandidateListResponse {
  data: Candidate[];
  total: number;
  page: number;
  limit: number;
}
