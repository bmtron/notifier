import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './components/auth/Login'
import Register from './components/auth/Register'
import { Navbar } from './components/common/Navbar'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import Dashboard from './components/dashboard/Dashboard'
import { TodosMainView } from './components/todos/TodosMainView'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="pt-16">
                    <Dashboard />
                  </div>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="pt-16">
                    <TodosMainView />
                  </div>
                </>
              </ProtectedRoute>
            }
          />
          {/* Add other protected routes as needed */}
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
