import { Routes, Route } from 'react-router-dom'

import { ProtectedRoute } from './components/ProtectedRoute'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import { TodosMainView } from './components/todos/TodosMainView'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodosMainView />
            </ProtectedRoute>
          }
        />
        {/* Add other protected routes as needed */}
      </Routes>
    </AuthProvider>
  )
}

export default App
