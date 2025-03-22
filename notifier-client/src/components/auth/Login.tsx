import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import styles from './Login.module.css'

interface LocationState {
  from: {
    pathname: string
  }
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      console.log('isAuthenticated', isAuthenticated)
      void navigate('/dashboard', { replace: true })
    }
  })

  const from =
    location.state != null ? (location.state as LocationState).from.pathname || '/dashboard' : ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const handleLogin = async () => {
      try {
        await login({ email, password })
        await navigate(from, { replace: true })
      } catch (err) {
        console.error(err)
        setError('Invalid email or password')
      }
    }

    void handleLogin()
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to your Notifier account</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.input}
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={styles.input}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button}>
            Sign in
          </button>
        </form>

        <button className={styles.button} onClick={() => void navigate('/register')}>
          Create an account
        </button>
      </div>
    </div>
  )
}
