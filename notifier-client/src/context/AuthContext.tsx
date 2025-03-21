import React, { createContext, useContext, useState, useEffect } from 'react'

import { authService, LoginCredentials, AuthResponse } from '../services/auth/authService'

interface AuthContextType {
  user: AuthResponse['user'] | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken()

        if (token) {
          const userInfo = await authService.getUserInfo()
          setUser(userInfo)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        // If token is invalid or expired, clear it
        authService.logout()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    void initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    setUser(response.user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
