/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import type { User } from '@supabase/supabase-js'

import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'

type UserCtx = {
  displayName: string
  updateName: (newName: string) => Promise<void>
  avatarDataUrl: string | null
  setAvatarDataUrl: (arg: string | null | ((prev: string | null) => string | null)) => void
}

const UserContext = React.createContext<UserCtx | null>(null)

const storageKey = 'pulse-display-name'
const legacyKey = 'pulse-profile.name'

function capitalize(s: string) {
  const t = s.trim()
  if (!t) return ''
  return t.charAt(0).toUpperCase() + t.slice(1)
}

function nameFromUser(u: User | null) {
  if (!u) return ''
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>
  const full =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    ''
  if (full) return full

  const email = u.email ?? ''
  if (email.includes('@')) return email.split('@')[0] ?? ''
  return email
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  const [displayName, setDisplayName] = React.useState<string>(() => {
    try {
      return localStorage.getItem(storageKey) || localStorage.getItem(legacyKey) || ''
    } catch {
      return ''
    }
  })

  const [avatarDataUrl, setAvatarDataUrl] = React.useState<string | null>(() => {
    try {
      const raw = localStorage.getItem('pulse-profile.avatar')
      if (!raw) return null
      return JSON.parse(raw) as string | null
    } catch {
      return null
    }
  })

  React.useEffect(() => {
    try {
      localStorage.setItem('pulse-profile.avatar', JSON.stringify(avatarDataUrl))
    } catch {
      // ignore
    }
  }, [avatarDataUrl])

  React.useEffect(() => {
    // Fallback order:
    // 1. localStorage saved name
    // 2. Supabase auth user metadata
    // 3. email prefix (before @)
    // 4. "there"
    if (displayName && displayName !== 'there') return

    const fromAuth = capitalize(nameFromUser(user))
    if (fromAuth) {
      setDisplayName(fromAuth)
      return
    }
    setDisplayName('there')
  }, [user, displayName])

  const updateName = React.useCallback(
    async (newName: string) => {
      const next = capitalize(newName)
      const safe = next || 'there'

      setDisplayName(safe)
      try {
        localStorage.setItem(storageKey, safe)
        localStorage.setItem(legacyKey, safe)
      } catch {
        // ignore storage errors
      }

      // Best-effort: persist to Supabase user metadata so it can follow the user across devices.
      try {
        await supabase.auth.updateUser({ data: { full_name: safe } })
      } catch {
        // ignore metadata update failures
      }
    },
    [],
  )

  const value = React.useMemo(() => ({ displayName, updateName, avatarDataUrl, setAvatarDataUrl }), [displayName, updateName, avatarDataUrl])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = React.useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

