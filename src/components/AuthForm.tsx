import { useState, type FormEvent } from 'react'
import { login, signup } from '../api/auth'
import type { AuthUser } from '../types/auth'

type AuthFormProps = {
  onLoginSuccess: (token: string, user: AuthUser) => void
}

function AuthForm({ onLoginSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      if (mode === 'signup') {
        await signup({ username, email, password })
      }

      const response = await login({ email, password })

      onLoginSuccess(response.token, response.user)

      setUsername('')
      setEmail('')
      setPassword('')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Authentication failed'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="panel form-panel">
      <div className="panel-heading">
        <p className="section-label">{mode === 'login' ? 'Welcome back' : 'Create account'}</p>
        <h2>{mode === 'login' ? 'Login' : 'Sign up'}</h2>
      </div>

      <form className="decision-form" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Choose a username"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {errorMessage && <p className="form-error">{errorMessage}</p>}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting
            ? 'Please wait...'
            : mode === 'login'
              ? 'Login'
              : 'Create account'}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setMode((currentMode) => currentMode === 'login' ? 'signup' : 'login')
            setErrorMessage('')
          }}
        >
          {mode === 'login'
            ? 'Need an account? Sign up'
            : 'Already have an account? Login'}
        </button>
      </form>
    </div>
  )
}

export default AuthForm