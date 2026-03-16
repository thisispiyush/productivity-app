import * as React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { GoogleIcon } from '@/components/icons/GoogleIcon'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'

type Mode = 'signin' | 'signup'

function modeFromPath(pathname: string): Mode {
  if (pathname.startsWith('/signup')) return 'signup'
  return 'signin'
}

function routeForMode(mode: Mode) {
  return mode === 'signup' ? '/signup' : '/login'
}

function fieldBase() {
  return [
    'h-12 w-full rounded-xl px-3 text-sm',
    'bg-surface text-foreground placeholder:text-muted',
    'border border-border',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 focus:border-[#4F6EF7]',
  ].join(' ')
}

function buttonBase() {
  return [
    'min-h-[48px] w-full rounded-xl text-sm font-medium',
    'transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6EF7]/35 focus-visible:ring-offset-0',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'active:scale-[0.99]',
  ].join(' ')
}

export function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, initializing, signInWithEmail, signUpWithEmail } = useAuth()

  const [mode, setMode] = React.useState<Mode>(() => modeFromPath(location.pathname))

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [oauthLoading, setOauthLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)

  React.useEffect(() => {
    // Keep the tab in sync when users land directly on /login or /signup.
    const next = modeFromPath(location.pathname)
    setMode(next)
    setError(null)
    setSuccess(null)
  }, [location.pathname])

  React.useEffect(() => {
    if (!initializing && user) {
      navigate('/', { replace: true })
    }
  }, [initializing, user, navigate])

  const onTab = (next: Mode) => {
    setMode(next)
    setError(null)
    setSuccess(null)
    navigate(routeForMode(next), { replace: true })
  }

  const handleGoogle = async () => {
    setOauthLoading(true)
    setError(null)
    setSuccess(null)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      if (mode === 'signin') {
        const result = await signInWithEmail({ email, password })
        if (result.error) {
          const msg = result.error.toLowerCase()
          if (msg.includes('invalid login credentials') || msg.includes('invalid')) {
            setError('Invalid email or password')
          } else {
            setError(result.error)
          }
          return
        }
        navigate('/', { replace: true })
        return
      }

      if (password && confirmPassword && password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }

      const result = await signUpWithEmail({ email, password, name: name.trim() || undefined })
      if (result.error) {
        setError(result.error)
        return
      }
      setSuccess('Verification email sent. Please check your inbox to confirm your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full">
      <div className="mx-auto w-full max-w-md px-4 sm:px-0">
        <div className="rounded-2xl border border-border bg-card p-1 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          <div className="relative grid grid-cols-2 gap-1 rounded-xl border border-border bg-background p-1">
            <div
              aria-hidden="true"
              className={[
                'absolute inset-y-1 left-1 z-0 w-[calc(50%-0.25rem)] rounded-lg',
                'bg-[var(--surface-hover)] dark:bg-[#2a2a2a]',
                'transition-transform duration-200 ease-out',
              ].join(' ')}
              style={{ transform: mode === 'signup' ? 'translateX(100%)' : 'translateX(0%)' }}
            />
            <button
              type="button"
              onClick={() => onTab('signin')}
              className={[
                'relative z-10 h-11 w-full rounded-lg text-sm transition-colors',
                mode === 'signin'
                  ? 'font-semibold text-foreground dark:text-white'
                  : 'text-muted dark:text-gray-400 hover:text-foreground dark:hover:text-white',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6EF7]/35',
              ].join(' ')}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onTab('signup')}
              className={[
                'relative z-10 h-11 w-full rounded-lg text-sm transition-colors',
                mode === 'signup'
                  ? 'font-semibold text-foreground dark:text-white'
                  : 'text-muted dark:text-gray-400 hover:text-foreground dark:hover:text-white',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6EF7]/35',
              ].join(' ')}
            >
              Create Account
            </button>
          </div>

          <div className="px-6 pb-6 pt-5">
            <div className="space-y-1">
              <div className="text-xl font-semibold tracking-tight">
                {mode === 'signin' ? 'Welcome back' : "Let's get started"}
              </div>
              <div className="text-sm text-muted">
                {mode === 'signin' ? 'Sign in to Pulse to continue.' : 'Create your productivity account.'}
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleGoogle}
                disabled={oauthLoading}
                className={[
                  buttonBase(),
                  'border border-gray-200 bg-white text-slate-900 hover:bg-gray-50',
                  'dark:border-[#333] dark:bg-[#1e1e1e] dark:text-white dark:hover:bg-[#2a2a2a]',
                ].join(' ')}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <GoogleIcon className="h-4 w-4" />
                  {oauthLoading ? 'Connecting...' : 'Continue with Google'}
                </span>
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <div className="text-xs font-medium text-muted">or</div>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' ? (
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-muted">
                      Name
                    </label>
                    <input
                      id="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={fieldBase()}
                    />
                  </div>
                ) : null}

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-muted">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={fieldBase()}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-medium text-muted">
                      Password
                    </label>
                    {mode === 'signin' ? (
                      <Link
                        to="/reset-password"
                        className="text-xs text-muted underline-offset-4 hover:text-foreground hover:underline"
                      >
                        Forgot password?
                      </Link>
                    ) : null}
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      className={[fieldBase(), 'pr-11'].join(' ')}
                      required
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6EF7]/30"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' ? (
                  <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="text-xs font-medium text-muted">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="********"
                        className={[fieldBase(), 'pr-11'].join(' ')}
                        required
                      />
                      <button
                        type="button"
                        aria-label={showConfirm ? 'Hide password confirmation' : 'Show password confirmation'}
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6EF7]/30"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ) : null}

                {error ? <div className="text-xs text-red-600 dark:text-red-300">{error}</div> : null}
                {success ? (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-100">
                    {success}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className={[
                    buttonBase(),
                    'bg-[#4F6EF7] text-white shadow-[0_12px_28px_rgba(79,110,247,0.35)]',
                    'hover:bg-[#4F6EF7]/95 hover:-translate-y-0.5',
                  ].join(' ')}
                >
                  {loading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                    </span>
                  ) : mode === 'signin' ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-5 text-center text-sm text-muted">
                {mode === 'signin' ? (
                  <>
                    New here?{' '}
                    <button
                      type="button"
                      onClick={() => onTab('signup')}
                      className="font-medium text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6EF7]/35"
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have one?{' '}
                    <button
                      type="button"
                      onClick={() => onTab('signin')}
                      className="font-medium text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6EF7]/35"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-muted">
          By continuing, you agree to Pulse&apos;s terms and privacy policy.
        </div>
      </div>
    </div>
  )
}
