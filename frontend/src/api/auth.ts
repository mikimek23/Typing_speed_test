import type { AxiosResponse } from 'axios'
import { api, setApiAuthFailureHandler } from './axios'
import {
  clearSession,
  setAccessToken,
  setAuthInitialized,
  setCurrentUser,
  setSession,
} from '../layout/tokenStore'

const unwrap = (response: AxiosResponse) => response?.data?.data ?? null
type authPayload = {
  name: string
  email: string
  password: string
}
export const userRegister = async (payload: authPayload) => {
  const response = await api.post('/api/register', payload)
  return unwrap(response)
}
export const userLogin = async (payload: Omit<authPayload, 'name'>) => {
  const response = await api.post('/api/login', payload)
  const data = unwrap(response)
  setSession({
    accessToken: data?.accessToken,
    user: data?.user,
  })
  return data
}
export const refereshAccessesToken = async () => {
  const response = await api.post('/auth/refresh')
  const data = unwrap(response)
  if (data?.accessToken) setAccessToken(data.accessToken)
  if (data?.user) setCurrentUser(data.user)
  return data
}
export const feachcurrentUser = async () => {
  const response = await api.get('/auth/me')
  const data = unwrap(response)
  setCurrentUser(data)
  return data
}
export const userLogOut = async () => {
  try {
    await api.post('/auth/logout')
  } finally {
    clearSession()
  }
}
export const bootstrapSession = async () => {
  try {
    const refreshed = await refereshAccessesToken()
    if (!refreshed?.accessToken) {
      clearSession()
    } else if (!refreshed?.user) {
      await feachcurrentUser()
    }
  } catch {
    clearSession()
  } finally {
    setAuthInitialized(true)
  }
}
export const initializeApiAuthHandlers = (
  onAuthFailure: (() => void) | null,
) => {
  setApiAuthFailureHandler(() => {
    clearSession()
    setAuthInitialized(true)
    if (onAuthFailure) onAuthFailure()
  })
}
