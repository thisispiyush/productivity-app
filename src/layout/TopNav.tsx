import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, LogIn, Moon, Settings, Sun, User, LogOut } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useLocalStorageState } from '@/hooks/useLocalStorage'
import { useTheme } from '@/hooks/useTheme'
import { useUser } from '@/hooks/useUser'
import { Avatar } from '@/components/Avatar'

function titleFromPath(pathname: string) {
  if (pathname === '/') return 'Dashboard'
  if (pathname.startsWith('/habits')) return 'Habit Tracker'
  if (pathname.startsWith('/tasks')) return 'Task Manager'
  if (pathname.startsWith('/analytics')) return 'Analytics'
  if (pathname.startsWith('/profile')) return 'Profile'
  if (pathname.startsWith('/settings')) return 'Settings'
  return 'Pulse'
}

function subtitleFromPath(pathname: string) {
  if (pathname === '/') return 'Minimal. Calm. Addictive.'
  if (pathname.startsWith('/habits')) return 'Consistency beats perfection.'
  if (pathname.startsWith('/tasks')) return 'One task at a time.'
  if (pathname.startsWith('/analytics')) return 'Honest trends over time.'
  if (pathname.startsWith('/settings')) return 'Appearance, preferences, and account.'
  if (pathname.startsWith('/profile')) return 'Your account details.'
  return 'Minimal. Calm. Addictive.'
}

export function TopNav() {
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const title = titleFromPath(pathname)
  const subtitle = subtitleFromPath(pathname)
  const { user, signOut } = useAuth()
  const { displayName } = useUser()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const [avatarDataUrl] = useLocalStorageState<string | null>('pulse-profile.avatar', null)

  const [time, setTime] = React.useState('')
  React.useEffect(() => {
    const update = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      setTime(`${dateStr} • ${timeStr}`)
    }
    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full w-full items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium tracking-tight text-muted">{title}</div>
        <div className="mt-0.5 hidden truncate text-xs text-[color:var(--chart-tick)] sm:block">{subtitle}</div>
      </div>

      <div className="relative flex items-center gap-2">
        {user ? (
          <div className="relative">
            <span className="mr-4 hidden text-xs text-muted sm:inline">
              {time}
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-foreground transition-all hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-card-hover)]"
            >
              <Avatar name={displayName || user.email || 'Pulse User'} photoUrl={avatarDataUrl} size={32} />
              <ChevronDown className="h-3 w-3 text-muted" />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-10 min-w-40 rounded-[10px] border border-[color:var(--border-strong)] bg-[color:var(--bg-card-hover)] p-1.5 text-sm shadow-[var(--shadow-popover)]">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--sidebar-hover)] hover:text-[color:var(--text-primary)]"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--sidebar-hover)] hover:text-[color:var(--text-primary)]"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <div className="my-1 h-px bg-[color:var(--sidebar-border)]" />
                <button
                  type="button"
                  onClick={() => {
                    toggle()
                    setMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--sidebar-hover)] hover:text-[color:var(--text-primary)]"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false)
                    await signOut()
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-[color:var(--text-secondary)] transition-colors hover:bg-[rgba(239,68,68,0.06)] hover:text-[#ef4444]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
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
  )
}
