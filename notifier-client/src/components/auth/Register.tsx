import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { createUser } from '../../services/api/createUser'
import { User } from '../../utils/models/User'

import styles from './Login.module.css'

const Register = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    const user: User = {
      email: email,
      username: username,
      password: password,
      userId: null,
      createdAt: null,
      updatedAt: null,
    }

    const response = await createUser(user)

    if (response.success && response.data) {
      await navigate('/login')
    } else {
      alert(response.error)
      console.error('User creation failed:', response.error)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Register for Notifier</h1>
        <p className={styles.subtitle}>Sign up to simplify your life</p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit(e)
          }}
          className={styles.form}
        >
          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              placeholder="Email"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              placeholder="Username"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              placeholder="Password"
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
