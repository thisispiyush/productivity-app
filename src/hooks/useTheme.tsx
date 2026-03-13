/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'

export type Theme = 'dark' | 'light'

type ThemeCtx = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = React.createContext<ThemeCtx | null>(null)

const storageKey = 'pulse.theme.v1'

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  if (!reduceMotion) {
    root.classList.add('theme-transition')
    window.setTimeout(() => root.classList.remove('theme-transition'), 320)
  }
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('light', theme === 'light')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    const raw = localStorage.getItem(storageKey)
    return raw === 'light' ? 'light' : 'dark'
  })

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem(storageKey, t)
  }, [])

  const toggle = React.useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  React.useEffect(() => {
    applyThemeToDOM(theme)
  }, [theme])

  const value = React.useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

