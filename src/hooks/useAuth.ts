import { useEffect, useState } from 'react'
import type { AuthUser } from '../types/auth'

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLoginSuccess = (newToken: string, user: AuthUser) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(newToken)
    setCurrentUser(user)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setCurrentUser(null)
  }

  return {
    token,
    currentUser,
    handleLoginSuccess,
    handleLogout,
  }
}