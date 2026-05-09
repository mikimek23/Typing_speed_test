import type { ResolvedTheme, Theme } from './types'

export const THEME_STORAGE_KEY = 'typing_theme'
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export const isTheme = (value: string | null): value is Theme => {
  return value === 'light' || value === 'dark' || value === 'system'
}

export const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia(THEME_MEDIA_QUERY).matches ? 'dark' : 'light'
}

export const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme === 'light' || theme === 'dark') return theme
  return getSystemTheme()
}

export const readStoredTheme = (fallbackTheme: Theme = 'system'): Theme => {
  if (typeof window === 'undefined') return fallbackTheme
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(value) ? value : fallbackTheme
  } catch {
    return fallbackTheme
  }
}

export const storeTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore storage write failures and keep the in-memory theme state.
  }
}

export const applyResolvedTheme = (theme: ResolvedTheme) => {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  root.dataset.theme = theme
  root.style.colorScheme = theme
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('light', theme === 'light')
}
