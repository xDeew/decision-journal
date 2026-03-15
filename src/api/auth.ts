import { apiRequest } from './api'

type SignupPayload = {
  username: string
  email: string
  password: string
}

type LoginPayload = {
  email: string
  password: string
}

type LoginResponse = {
  message: string
  token: string
  user: {
    id: number
    username: string
    email: string
  }
}

export function signup(payload: SignupPayload) {
  return apiRequest<{ message: string; user: { Id: number; Username: string; Email: string } }>(
    '/auth/signup',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
}

export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}