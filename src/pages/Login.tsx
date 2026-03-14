import { Link, useNavigate } from 'react-router-dom'
import { Chrome, Mail } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'

export function LoginPage() {
  const navigate = useNavigate()
  const { signInWithEmail, user, initializing } = useAuth()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [oauthLoading, setOauthLoading] = React.useState(false)

  React.useEffect(() => {
    if (!initializing && user) {
      navigate('/', { replace: true })
    }
  }, [initializing, user, navigate])

  const handleAuth = async () => {
    setLoading(true)
    setError(null)
    const result = await signInWithEmail({ email, password })
    setLoading(false)
    if (result.error) {
      const msg = result.error.toLowerCase()
      if (msg.includes('invalid login credentials') || msg.includes('invalid')) {
        setError('Invalid email or password. Please try again.')
      } else {
        setError(result.error)
      }
      return
    }
    navigate('/', { replace: true })
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
        <CardTitle className="text-xl tracking-tight">Welcome back</CardTitle>
        <CardDescription>Sign in to your workspace. (UI only)</CardDescription>
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
          <div className="flex items-center justify-between">
            <div />
            <Link to="/reset-password" className="text-xs text-muted hover:text-foreground hover:underline">
              Forgot Password?
            </Link>
          </div>
          {error ? <div className="text-xs text-red-500">{error}</div> : null}
          <Button variant="blue" ripple className="w-full" onClick={handleAuth} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
          <Button variant="secondary" ripple className="w-full" onClick={handleGoogle} disabled={oauthLoading}>
            <Chrome className="h-4 w-4" />
            {oauthLoading ? 'Connectingâ€¦' : 'Continue with Google'}
          </Button>
        </div>

        <div className="text-center text-sm text-muted">
          New here?{' '}
          <Link to="/signup" className="text-foreground hover:underline">
            Create an account
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
