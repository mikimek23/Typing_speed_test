import {
  createElement,
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  THEME_MEDIA_QUERY,
  applyResolvedTheme,
  getSystemTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
} from './theme'
import type { ResolvedTheme, Theme } from './types'

export type ThemeContextType = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme(defaultTheme))
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  const resolvedTheme = useMemo(
    () => (theme === 'system' ? systemTheme : resolveTheme(theme)),
    [systemTheme, theme],
  )

  useEffect(() => {
    storeTheme(theme)
  }, [theme])

  useEffect(() => {
    applyResolvedTheme(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY)

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, theme],
  )

  return createElement(ThemeContext.Provider, { value }, children)
}
