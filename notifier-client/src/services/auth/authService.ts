import axios from 'axios'

import { API_ENDPOINT_URL_DEBUG } from '../../utils/constants/constants'

const API_URL = API_ENDPOINT_URL_DEBUG

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

class AuthService {
  private token: string | null = localStorage.getItem('token')

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials)
      const { token, user } = response.data
      console.log('TOKEN: ', token)
      this.setToken(token)
      return { token, user }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`)
      }
      throw new Error('Login failed')
    }
  }

  logout(): void {
    localStorage.removeItem('token')
    this.token = null
  }

  setToken(token: string): void {
    localStorage.setItem('token', token)
    this.token = token
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  async getUserInfo(): Promise<AuthResponse['user']> {
    if (!this.token) {
      throw new Error('No authentication token found')
    }

    try {
      const response = await axios.get<AuthResponse['user']>(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch user info: ${error.message}`)
      }
      throw new Error('Failed to fetch user info')
    }
  }
}

export const authService = new AuthService()
