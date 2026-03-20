import { NavLink } from 'react-router-dom'
import { BarChart3, CheckSquare, Flame, LayoutDashboard } from 'lucide-react'

import { EKGIcon } from '@/components/icons/EKGIcon'
import { cn } from '@/utils/cn'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habits', label: 'Habits', icon: Flame },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
] as const

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col border-r border-[color:var(--sidebar-border)] bg-[color:var(--bg-sidebar)] px-3 py-4 shadow-[var(--shadow-sidebar)] md:flex">
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
                  'group flex items-center gap-2.5 rounded-lg border-l-2 border-l-transparent px-3 py-2 text-sm font-medium text-[color:var(--text-secondary)] transition-all hover:bg-[color:var(--sidebar-hover)]',
                  isActive &&
                    'bg-[color:var(--accent-subtle)] text-[color:var(--accent)] border-l-2 border-l-[color:var(--accent)]',
                )
              }
            >
              <Icon className="h-[18px] w-[18px] text-[color:var(--text-muted)] group-aria-[current=page]:text-[color:var(--accent)]" />
              <span className="min-w-0 truncate">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto" />
    </aside>
  )
}
