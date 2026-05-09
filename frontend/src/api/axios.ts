import axios from 'axios'
import {
  clearSession,
  getAccessToken,
  setAccessToken,
  setCurrentUser,
} from '../layout/tokenStore'

const baseURL = import.meta.env.VITE_APT_BASE_URL || 'http://localhost:5001/api'
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
export const setApiAuthFailureHandler = (handler: () => void) => {
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
                throw new Error('No access token form refresh endpoint')
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
