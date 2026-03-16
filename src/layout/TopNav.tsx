import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, LogIn, Moon, Sun, User } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

function titleFromPath(pathname: string) {
  if (pathname === '/') return 'Dashboard'
  if (pathname.startsWith('/habits')) return 'Habit Tracker'
  if (pathname.startsWith('/tasks')) return 'Task Manager'
  if (pathname.startsWith('/analytics')) return 'Analytics'
  if (pathname.startsWith('/profile')) return 'Profile'
  if (pathname.startsWith('/settings')) return 'Settings'
  return 'Pulse'
}

export function TopNav() {
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const title = titleFromPath(pathname)
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <div className="sticky top-0 z-30 -mx-4 mb-4 px-4 pt-2 md:-mx-6 md:mb-6 md:px-6 md:pt-3 lg:-mx-8 lg:px-8">
      <div className="glass flex items-center justify-between gap-3 rounded-2xl px-3 py-2 md:px-4 md:py-3">
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold tracking-tight md:text-sm">{title}</div>
          <div className="mt-0.5 hidden truncate text-xs text-muted sm:block">Minimal. Calm. Addictive.</div>
        </div>

        <div className="relative flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            ripple
            onClick={toggle}
            aria-label="Toggle theme"
            className={cn('rounded-2xl')}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-[var(--surface-hover)]"
              >
                <div className="grid h-7 w-7 place-items-center rounded-full bg-accentBlue/10 text-xs font-semibold text-accentBlue">
                  {(user.email ?? '?').charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="h-3 w-3 text-muted" />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 top-11 w-44 rounded-2xl border border-border bg-card p-1 text-sm shadow-[var(--shadow-popover)]">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-muted transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
                  >
                    <User className="h-3.5 w-3.5" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-muted transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
                  >
                    Settings
                  </Link>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild variant="blue" ripple className="hidden sm:inline-flex rounded-2xl">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
