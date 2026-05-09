export type AuthUser = {
  id: string
  name: string
  email: string
  created_at: string
}

type Listener = () => void
type AuthState = {
  accessToken: string | null
  user: AuthUser | null
  initialized: boolean
}
type StateUpdater = (state: AuthState) => AuthState
type SessionInput = {
  accessToken?: string | null
  user?: AuthUser | null
}
const listeners = new Set<Listener>()

let authState: AuthState = {
  accessToken: null,
  user: null,
  initialized: false,
}
const notify = () => {
  listeners.forEach((listener) => listener())
}
const setState = (updater: StateUpdater) => {
  const nextState = updater(authState)
  authState = nextState
  notify()
}
export const subscribeAuth = (listener: Listener) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
export const getAuthState = (): AuthState => authState
export const setAccessToken = (token: string) => {
  setState((prev) => ({
    ...prev,
    accessToken: token || null,
  }))
}
export const setCurrentUser = (user: AuthUser | null) => {
  setState((prev) => ({
    ...prev,
    user: user || null,
  }))
}
export const setSession = ({ accessToken, user }: SessionInput) => {
  setState((prev) => ({
    ...prev,
    accessToken: accessToken || null,
    user: user || null,
  }))
}
export const clearSession = () => {
  setState((prev) => ({
    ...prev,
    accessToken: null,
    user: null,
  }))
}
export const setAuthInitialized = (initialized: boolean) => {
  setState((prev) => ({
    ...prev,
    initialized: Boolean(initialized),
  }))
}
export const getAccessToken = (): string | null => authState.accessToken
export const getCurrentUser = (): AuthUser | null => authState.user
export const isInitialized = (): boolean => authState.initialized
export const isAuthenticated = (): boolean => Boolean(authState.accessToken)

// Backward-compatible aliases used by existing components.
export const subscribeToken = subscribeAuth
export const clearAccessToken = clearSession
