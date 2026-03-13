/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'

type StartupError = {
  id: string
  message: string
  hint?: string
}

type StartupErrorsCtx = {
  errors: StartupError[]
  pushError: (err: Omit<StartupError, 'id'>) => void
  dismissError: (id: string) => void
}

const StartupErrorsContext = React.createContext<StartupErrorsCtx | null>(null)

export function StartupErrorsProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = React.useState<StartupError[]>([])

  const pushError = React.useCallback((err: Omit<StartupError, 'id'>) => {
    setErrors((prev) => [
      ...prev,
      {
        id: `${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`,
        ...err,
      },
    ])
  }, [])

  const dismissError = React.useCallback((id: string) => {
    setErrors((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const value = React.useMemo(
    () => ({
      errors,
      pushError,
      dismissError,
    }),
    [errors, pushError, dismissError],
  )

  return <StartupErrorsContext.Provider value={value}>{children}</StartupErrorsContext.Provider>
}

export function useStartupErrors() {
  const ctx = React.useContext(StartupErrorsContext)
  if (!ctx) throw new Error('useStartupErrors must be used within StartupErrorsProvider')
  return ctx
}

