import axios, { type AxiosResponse } from 'axios'
import {
  clearSession,
  getAccessToken,
  setAccessToken,
  setCurrentUser,
} from '../hooks/tokenStore'

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_APT_BASE_URL ||
  'http://localhost:5001/api'

type ApiEnvelope<T> = {
  success?: boolean
  message?: string
  data?: T
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
})

let refreshPromise: Promise<string> | null = null
let onAuthFailure: (() => void) | null = null

export const unwrapResponse = <T>(
  response: AxiosResponse<T | ApiEnvelope<T>>,
) => {
  const payload = response.data

  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    ('message' in payload || 'success' in payload)
  ) {
    return (payload as ApiEnvelope<T>).data as T
  }

  return payload as T
}

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
    if (error.message) return error.message
  }

  if (error instanceof Error && error.message) return error.message

  return fallback
}

export const setApiAuthFailureHandler = (handler: (() => void) | null) => {
  onAuthFailure = handler
}

const isAuthEndpoint = (url: string = '') => {
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh')
  )
}
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {}
    const status = error.response?.status
    if (
      status == 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true
      try {
        if (!refreshPromise) {
          refreshPromise = refreshClient
            .post('/auth/refresh')
            .then((res) => {
              const token = res.data?.data?.accessToken
              const user = res.data?.data?.user
              if (!token)
                throw new Error('No access token from refresh endpoint')
              setAccessToken(token)
              if (user) setCurrentUser(user)
              return token
            })
            .finally(() => {
              refreshPromise = null
            })
        }
        const freshToken = await refreshPromise
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${freshToken}`
        return api(originalRequest)
      } catch (refreshError) {
        clearSession()
        if (onAuthFailure) onAuthFailure()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)
