import { NavLink } from 'react-router-dom'
import { BarChart3, CheckSquare, Flame, LayoutDashboard } from 'lucide-react'

import { cn } from '@/utils/cn'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habits', label: 'Habit Tracker', icon: Flame },
  { to: '/tasks', label: 'Task Manager', icon: CheckSquare },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
] as const

export function Sidebar() {
  return (
    <aside className="glass fixed inset-y-0 left-0 z-40 w-72 px-4 py-5">
      <div className="flex items-center gap-3 px-2">
        <div className="relative grid h-10 w-10 place-items-center rounded-2xl border border-border bg-surface">
          <div className="h-2.5 w-2.5 rounded-full bg-accentBlue shadow-[0_0_18px_rgba(79,124,255,0.55)]" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">Pulse</div>
          <div className="text-xs text-muted">Productivity OS</div>
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground',
                  isActive &&
                    'bg-surface text-foreground ring-1 ring-border shadow-[var(--shadow-card)]',
                )
              }
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface transition-colors group-hover:bg-[var(--surface-hover)]">
                <Icon className="h-4 w-4" />
              </div>
              <span className="font-medium">{item.label}</span>
              <span className="ml-auto h-2 w-2 rounded-full bg-accentBlue opacity-0 transition-opacity group-aria-[current=page]:opacity-100" />
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto" />

      <div className="absolute bottom-5 left-4 right-4 rounded-2xl border border-border bg-surface p-3">
        <div className="text-xs text-muted">
          Tip: tap habits daily — streaks are addictive in a good way.
        </div>
      </div>
    </aside>
  )
}

