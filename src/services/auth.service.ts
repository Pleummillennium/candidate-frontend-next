// Authentication service for API interactions

import { apiClient } from '@/lib/api-client';
import type { LoginInput, LoginResponse, RegisterInput, User } from '@/types';

export const authService = {
  // Register new user
  async register(data: RegisterInput): Promise<void> {
    return apiClient.post<void>('/auth/register', data, { requireAuth: false });
  },

  // Login user
  async login(data: LoginInput): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data, { requireAuth: false });

    // Store token and user in localStorage
    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  },

  // Logout user
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },
};
