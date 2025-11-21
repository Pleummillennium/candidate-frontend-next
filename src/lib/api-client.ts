// API Client configuration and utilities with JWT authentication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  requireAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(endpoint, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private getHeaders(options?: RequestOptions): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    // Add Authorization header if token exists (except for public routes)
    if (options?.requireAuth !== false) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;

      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } else {
        errorMessage = await response.text();
      }

      // Handle 401 Unauthorized - clear token
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }

      throw new Error(errorMessage);
    }

    if (contentType?.includes('application/json')) {
      return response.json();
    }

    return response.text() as any;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(options),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(options),
      body: JSON.stringify(data),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(options),
      body: JSON.stringify(data),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(options),
      ...options,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(API_URL);
