import { api, setApiAuthFailureHandler, unwrapResponse } from './axios'
import {
  clearSession,
  setAccessToken,
  setAuthInitialized,
  setCurrentUser,
  setSession,
} from '../hooks/tokenStore'

type AuthPayload = {
  name: string
  email: string
  password: string
}

type LoginPayload = Omit<AuthPayload, 'name'>

type AuthResponse = {
  accessToken: string | null
  user: {
    id: string
    name: string
    email: string
    created_at: string
  } | null
}

let bootstrapPromise: Promise<void> | null = null

export const userRegister = async (payload: AuthPayload) => {
  const response = await api.post('/auth/register', payload)
  return unwrapResponse<AuthResponse['user']>(response)
}

export const userLogin = async (payload: LoginPayload) => {
  const response = await api.post('/auth/login', payload)
  const data = unwrapResponse<AuthResponse>(response)
  setSession({
    accessToken: data?.accessToken,
    user: data?.user,
  })
  return data
}

export const refreshAccessToken = async () => {
  const response = await api.post('/auth/refresh')
  const data = unwrapResponse<AuthResponse>(response)
  if (data?.accessToken) setAccessToken(data.accessToken)
  if (data?.user) setCurrentUser(data.user)
  return data
}

export const fetchCurrentUser = async () => {
  const response = await api.get('/auth/me')
  const data = unwrapResponse<AuthResponse['user']>(response)
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

const runBootstrapSession = async () => {
  try {
    const refreshed = await refreshAccessToken()
    if (!refreshed?.accessToken) {
      clearSession()
    } else if (!refreshed?.user) {
      await fetchCurrentUser()
    }
  } catch {
    clearSession()
  } finally {
    setAuthInitialized(true)
  }
}

export const bootstrapSession = async () => {
  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrapSession().finally(() => {
      bootstrapPromise = null
    })
  }

  return bootstrapPromise
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

export const refereshAccessesToken = refreshAccessToken
export const feachcurrentUser = fetchCurrentUser
