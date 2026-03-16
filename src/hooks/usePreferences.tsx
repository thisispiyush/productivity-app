/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'

import { useLocalStorageState } from '@/hooks/useLocalStorage'
import type { Priority } from '@/utils/types'

export type FocusDuration = 25 | 45 | 60

type PreferencesCtx = {
  defaultTaskPriority: Priority
  setDefaultTaskPriority: (p: Priority) => void
  showCompletedTasks: boolean
  setShowCompletedTasks: (v: boolean) => void
  focusDuration: FocusDuration
  setFocusDuration: (v: FocusDuration) => void
}

const PreferencesContext = React.createContext<PreferencesCtx | null>(null)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [defaultTaskPriority, setDefaultTaskPriority] = useLocalStorageState<Priority>(
    'pulse.pref.defaultTaskPriority',
    'Medium',
  )
  const [showCompletedTasks, setShowCompletedTasks] = useLocalStorageState<boolean>('pulse.pref.showCompletedTasks', true)
  const [focusDuration, setFocusDuration] = useLocalStorageState<FocusDuration>('pulse.pref.focusDuration', 25)

  const value = React.useMemo(
    () => ({
      defaultTaskPriority,
      setDefaultTaskPriority,
      showCompletedTasks,
      setShowCompletedTasks,
      focusDuration,
      setFocusDuration,
    }),
    [defaultTaskPriority, setDefaultTaskPriority, showCompletedTasks, setShowCompletedTasks, focusDuration, setFocusDuration],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const ctx = React.useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider')
  return ctx
}

