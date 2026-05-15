import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  role: 'admin' | 'technical_user' | 'viewer';
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('auth_token', data.token);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>('/auth/me');
    return data;
  },

  async refresh(): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/refresh');
    localStorage.setItem('auth_token', data.token);
    return data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
};
