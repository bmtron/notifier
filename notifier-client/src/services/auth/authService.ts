import axios from 'axios';

import { API_ENDPOINT_URL_DEBUG, API_KEY } from '../../utils/constants/constants';

const API_URL = API_ENDPOINT_URL_DEBUG;

// Create base axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

// Add interceptor to automatically add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

class AuthService {
  private token: string | null = localStorage.getItem('token');

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { token, user } = response.data;
      this.setToken(token);
      return { token, user };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error('Login failed');
    }
  }

  async getUserInfo(): Promise<AuthResponse['user']> {
    try {
      const response = await api.get<AuthResponse['user']>('/auth/me');
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch user info: ${error.message}`);
      }
      throw new Error('Failed to fetch user info');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.token = null;
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();
