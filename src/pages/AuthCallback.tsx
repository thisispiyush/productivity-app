import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabaseClient'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function complete() {
      const url = new URL(window.location.href)
      const oauthError = url.searchParams.get('error_description') ?? url.searchParams.get('error')
      if (oauthError) {
        if (!cancelled) setError(oauthError)
        return
      }

      const code = url.searchParams.get('code')

      try {
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href)
          if (exchangeError) {
            if (!cancelled) setError(exchangeError.message)
            return
          }
        }

        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          if (!cancelled) setError(sessionError.message)
          return
        }

        if (!data.session) {
          if (!cancelled) setError('Sign-in was not completed. Please try again.')
          return
        }

        if (!cancelled) navigate('/', { replace: true })
      } catch {
        if (!cancelled) setError('Failed to complete sign-in. Please try again.')
      }
    }

    complete().catch(() => {
      if (!cancelled) setError('Failed to complete sign-in. Please try again.')
    })

    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">Signing you in</CardTitle>
        <CardDescription>Completing Google authentication…</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? <div className="text-xs text-red-500">{error}</div> : null}
        {!error ? (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting…
          </div>
        ) : (
          <Button asChild variant="secondary" ripple className="w-full rounded-xl">
            <Link to="/auth">Back to sign in</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

