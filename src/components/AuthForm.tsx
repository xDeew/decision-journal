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

  const validateForm = () => {
    const normalizedEmail = email.trim()
    const normalizedUsername = username.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (mode === 'signup' && !normalizedUsername) {
      return 'Please enter a username.'
    }

    if (mode === 'signup' && normalizedUsername.length < 3) {
      return 'Username must be at least 3 characters long.'
    }

    if (!normalizedEmail) {
      return 'Please enter your email address.'
    }

    if (!emailRegex.test(normalizedEmail)) {
      return 'Please enter a valid email address.'
    }

    if (!password.trim()) {
      return 'Please enter your password.'
    }

    if (mode === 'signup' && password.trim().length < 6) {
      return 'Password must be at least 6 characters long.'
    }

    return ''
  }

  const resetForm = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setErrorMessage('')
  }

  const handleModeChange = (nextMode: 'login' | 'signup') => {
    if (isSubmitting || mode === nextMode) {
      return
    }

    setMode(nextMode)
    setErrorMessage('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      if (mode === 'signup') {
        await signup({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        })
      }

      const response = await login({
        email: email.trim(),
        password: password.trim(),
      })

      onLoginSuccess(response.token, response.user)
      resetForm()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Authentication failed'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="panel form-panel auth-panel">
      <div className="panel-heading">
        <p className="section-label">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </p>
        <h2>{mode === 'login' ? 'Login' : 'Sign up'}</h2>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Access your decision journal and continue where you left off.'
            : 'Start tracking your decisions with more clarity and reflection.'}
        </p>
      </div>

      <div className="auth-mode-toggle" role="tablist" aria-label="Authentication mode">
        <button
          type="button"
          className={`auth-mode-button ${mode === 'login' ? 'active' : ''}`}
          onClick={() => handleModeChange('login')}
          disabled={isSubmitting}
        >
          Login
        </button>

        <button
          type="button"
          className={`auth-mode-button ${mode === 'signup' ? 'active' : ''}`}
          onClick={() => handleModeChange('signup')}
          disabled={isSubmitting}
        >
          Sign up
        </button>
      </div>

      <form className="decision-form" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Choose a username"
              disabled={isSubmitting}
              autoComplete="username"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={isSubmitting}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={
              mode === 'login' ? 'Enter your password' : 'Create a password'
            }
            disabled={isSubmitting}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        {errorMessage && <p className="form-error">{errorMessage}</p>}

        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? mode === 'login'
              ? 'Logging in...'
              : 'Creating account...'
            : mode === 'login'
              ? 'Login'
              : 'Create account'}
        </button>
      </form>
    </div>
  )
}

export default AuthForm