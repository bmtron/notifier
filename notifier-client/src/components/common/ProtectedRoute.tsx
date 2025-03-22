import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div> // You can replace this with a proper loading component
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
