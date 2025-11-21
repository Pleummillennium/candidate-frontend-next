// Custom hook for authentication

import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import type { User, LoginInput, RegisterInput } from '@/types';

interface UseAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (data: LoginInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(data);
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      setLoading(true);
      setError(null);
      await authService.register(data);
      // After registration, user needs to login
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user && authService.isAuthenticated(),
    loading,
    error,
    login,
    register,
    logout,
  };
}
