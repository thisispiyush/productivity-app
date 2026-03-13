import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabaseClient'

export function UpdatePasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  React.useEffect(() => {
    // If the user arrives here from a recovery email, Supabase typically
    // establishes a session automatically (handled by AuthProvider).
    // This page stays usable even if session is missing (shows error on submit).
  }, [])

  const update = async () => {
    setError(null)
    setSuccess(false)
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setError('Reset session expired. Please request a new password reset link.')
        return
      }

      const { error: supaError } = await supabase.auth.updateUser({ password })
      if (supaError) {
        setError(supaError.message)
        return
      }

      setSuccess(true)
      window.setTimeout(() => navigate('/login', { replace: true }), 900)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">Set a new password</CardTitle>
        <CardDescription>Choose a strong password you will remember.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                id="new-password"
                type="password"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {success ? (
            <div className="rounded-2xl border border-border bg-surface p-3 text-xs text-muted">
              Password updated successfully. Redirecting to loginâ€¦
            </div>
          ) : null}
          {error ? <div className="text-xs text-red-500">{error}</div> : null}

          <Button variant="blue" ripple className="w-full" onClick={update} disabled={loading}>
            {loading ? 'Updatingâ€¦' : 'Update password'}
          </Button>
        </div>

        <div className="text-center text-sm text-muted">
          <Link to="/login" className="text-foreground hover:underline">
            Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

