import * as React from 'react'

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = React.useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return initialValue
      return JSON.parse(raw) as T
    } catch {
      return initialValue
    }
  })

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore write errors (private mode, quota, etc.)
    }
  }, [key, state])

  return [state, setState] as const
}

