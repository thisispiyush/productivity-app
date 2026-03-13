import * as React from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabaseClient'

export function ResetPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [sent, setSent] = React.useState(false)

  const send = async () => {
    setLoading(true)
    setError(null)
    setSent(false)
    try {
      const redirectTo = `${window.location.origin}/update-password`
      const { error: supaError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (supaError) {
        setError(supaError.message)
        return
      }
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">Reset password</CardTitle>
        <CardDescription>We will email you a password reset link.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                id="reset-email"
                type="email"
                placeholder="you@company.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {sent ? (
            <div className="rounded-2xl border border-border bg-surface p-3 text-xs text-muted">
              Password reset link has been sent to your email.
            </div>
          ) : null}
          {error ? <div className="text-xs text-red-500">{error}</div> : null}

          <Button variant="blue" ripple className="w-full" onClick={send} disabled={loading || !email.trim()}>
            {loading ? 'Sendingâ€¦' : 'Send reset link'}
          </Button>
        </div>

        <div className="text-center text-sm text-muted">
          Remembered your password?{' '}
          <Link to="/login" className="text-foreground hover:underline">
            Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

