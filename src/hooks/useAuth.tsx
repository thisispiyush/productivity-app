/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import type { Session, User } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabaseClient'
import { useStartupErrors } from '@/hooks/useStartupErrors'

type AuthCtx = {
  user: User | null
  session: Session | null
  initializing: boolean
  signInWithEmail: (opts: { email: string; password: string }) => Promise<{ error?: string }>
  signUpWithEmail: (opts: { email: string; password: string; name?: string }) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = React.createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { pushError } = useStartupErrors()
  const [user, setUser] = React.useState<User | null>(null)
  const [session, setSession] = React.useState<Session | null>(null)
  const [initializing, setInitializing] = React.useState(true)

  React.useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          pushError({
            message: `Failed to initialize authentication: ${error.message}`,
            hint: 'Check your Supabase URL and anon key in .env, then restart the dev server.',
          })
        }
        if (!mounted) return
        setSession(data.session ?? null)
        setUser(data.session?.user ?? null)
      } catch (e) {
        pushError({
          message: 'Unexpected error while initializing authentication.',
          hint: 'Ensure Supabase is reachable and your environment variables are set correctly.',
        })
      } finally {
        if (mounted) setInitializing(false)
      }
    }

    load().catch(() => {
      // error already surfaced via pushError
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signInWithEmail = React.useCallback(async ({ email, password }: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { error: error.message }
    }
    return {}
  }, [])

  const signUpWithEmail = React.useCallback(async ({ email, password, name }: { email: string; password: string; name?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: name ? { data: { name } } : undefined,
    })
    if (error) {
      return { error: error.message }
    }
    return {}
  }, [])

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      session,
      initializing,
      signInWithEmail,
      signUpWithEmail,
      signOut,
    }),
    [user, session, initializing, signInWithEmail, signUpWithEmail, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
