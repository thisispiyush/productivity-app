import { Link, NavLink } from 'react-router-dom'
import { BarChart3, CheckSquare, Flame, LayoutDashboard, Moon, Settings, Sun } from 'lucide-react'

import { EKGIcon } from '@/components/icons/EKGIcon'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, hint: ['G', 'D'] },
  { to: '/habits', label: 'Habits', icon: Flame, hint: ['G', 'H'] },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare, hint: ['G', 'T'] },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, hint: ['G', 'A'] },
] as const

export function Sidebar() {
  const { user } = useAuth()
  const { theme, toggle } = useTheme()

  const displayName =
    (user?.user_metadata as { name?: string } | undefined)?.name ??
    user?.email?.split('@')[0] ??
    'Guest'
  const initial = (user?.email ?? displayName ?? '?').charAt(0).toUpperCase()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-border bg-card px-3 py-4 shadow-[var(--shadow-sidebar)] md:flex">
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-accentBlue/20 bg-accentBlue/10 text-accentBlue">
          <EKGIcon className="h-5 w-5 drop-shadow-[0_0_6px_rgba(79,110,247,0.55)]" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-[-0.02em] text-foreground">Pulse</div>
          <div className="text-xs text-muted">Productivity OS</div>
        </div>
      </div>

      <div className="mt-3 h-px bg-[color:var(--border)]" />

      <nav className="mt-3 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-all hover:bg-[var(--bg-subtle)] hover:text-foreground',
                  isActive && 'bg-[color:var(--accent-subtle)] text-[color:var(--accent)]',
                )
              }
            >
              <div className="grid h-9 w-9 place-items-center rounded-[10px] border border-border bg-surface transition-colors group-hover:bg-[var(--bg-card-hover)] group-aria-[current=page]:border-accentBlue/25 group-aria-[current=page]:bg-accentBlue/10">
                <Icon className="h-4 w-4 group-aria-[current=page]:text-accentBlue" />
              </div>
              <span className="min-w-0 truncate">{item.label}</span>
              <span className="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <kbd className="kbd-hint">{item.hint[0]}</kbd>
                <span className="text-[11px] text-muted">then</span>
                <kbd className="kbd-hint">{item.hint[1]}</kbd>
              </span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto" />

      <div className="mt-4 rounded-[14px] border border-border bg-surface p-3">
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-[10px] px-2 py-1.5 transition-colors hover:bg-[var(--bg-card-hover)]"
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-accentBlue/10 text-xs font-semibold text-accentBlue">
              {initial}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground">{displayName}</div>
              <div className="truncate text-xs text-muted">{user?.email ?? 'Not signed in'}</div>
            </div>
          </Link>

          <Link
            to="/settings"
            className="grid h-9 w-9 place-items-center rounded-[10px] border border-border bg-card text-muted transition-colors hover:bg-[var(--bg-card-hover)] hover:text-foreground"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>

          <Button
            variant="secondary"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            className="h-9 w-9 rounded-[10px]"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </aside>
  )
}
