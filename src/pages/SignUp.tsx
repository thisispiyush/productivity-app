import { Link, useNavigate } from 'react-router-dom'
import { Chrome, Mail, Shield } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'

export function SignUpPage() {
  const navigate = useNavigate()
  const { signUpWithEmail, user, initializing } = useAuth()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [oauthLoading, setOauthLoading] = React.useState(false)

  React.useEffect(() => {
    if (!initializing && user && !success) {
      navigate('/', { replace: true })
    }
  }, [initializing, user, success, navigate])

  const handleAuth = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    const result = await signUpWithEmail({ email, password })
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setSuccess(true)
  }

  const handleGoogle = async () => {
    setOauthLoading(true)
    setError(null)
    try {
      const { error: supaError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` },
      })
      if (supaError) setError(supaError.message)
    } finally {
      setOauthLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">Create your account</CardTitle>
        <CardDescription>Start tracking habits and shipping tasks. (UI only)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <div className="text-xs text-red-400">{error}</div> : null}
          {success ? (
            <div className="rounded-2xl border border-border bg-surface p-3 text-xs text-muted">
              Account created successfully. Please check your email to confirm your account before logging in.
            </div>
          ) : null}
          <Button variant="purple" ripple className="w-full" onClick={handleAuth} disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
          <Button variant="secondary" ripple className="w-full" onClick={handleGoogle} disabled={oauthLoading}>
            <Chrome className="h-4 w-4" />
            {oauthLoading ? 'Connectingâ€¦' : 'Continue with Google'}
          </Button>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-border bg-surface p-3 text-xs text-muted">
          <Shield className="mt-0.5 h-4 w-4 text-accentBlue" />
          This is UI-only for now. Add real auth later without changing the design system.
        </div>

        <div className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-foreground hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
