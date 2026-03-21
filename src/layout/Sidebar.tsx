import * as React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BarChart3, CheckSquare, ChevronLeft, Flame, LayoutDashboard } from 'lucide-react'

import { EKGIcon } from '@/components/icons/EKGIcon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useProductivityStore } from '@/hooks/useProductivityStore'
import { cn } from '@/utils/cn'
import { formatISODate, startOfDay } from '@/utils/dates'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habits', label: 'Habits', icon: Flame },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
] as const

export function Sidebar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean
  onToggleCollapsed: () => void
}) {
  const { habits, tasks } = useProductivityStore()
  const today = React.useMemo(() => formatISODate(startOfDay(new Date())), [])
  const hasHabitLoggedToday = habits.some((h) => h.completions[today])
  const hasPendingTasks = tasks.some((t) => !t.completed)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-hidden border-r border-[color:var(--sidebar-border)] bg-[color:var(--bg-sidebar)] pb-4 md:flex',
        'relative',
        'transition-[width] duration-200 ease-out',
        collapsed ? 'w-[60px] px-2' : 'w-[220px] px-3',
      )}
    >
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="absolute right-0 top-1/2 z-50 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--sidebar-toggle-border)] bg-[color:var(--sidebar-toggle-bg)] shadow-[var(--sidebar-toggle-shadow)] transition-all duration-150 ease-out hover:border-[color:var(--sidebar-toggle-border-hover)] hover:bg-[color:var(--sidebar-toggle-bg-hover)] md:flex"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          size={12}
          className={cn('text-[color:var(--sidebar-toggle-icon)] transition-transform', collapsed && 'rotate-180')}
        />
      </button>

      <div className="shrink-0 pt-4">
        <Link to="/" className={cn('flex items-center gap-3 px-4 py-4 no-underline transition hover:opacity-80', collapsed && 'px-2')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-accentBlue/20 bg-accentBlue/10 text-accentBlue">
            <EKGIcon className="h-5 w-5 drop-shadow-[0_0_6px_rgba(79,110,247,0.55)]" />
          </div>
          {!collapsed ? (
            <div className="leading-tight">
              <p className="font-semibold text-sm text-foreground">Pulse</p>
              <p className="text-xs text-muted">Productivity OS</p>
            </div>
          ) : null}
        </Link>
        <div className="mt-3 h-px bg-[color:var(--border)]" />
      </div>

      <TooltipProvider delayDuration={80}>
        <nav className={cn('mt-3 flex-1 space-y-1 overflow-hidden', collapsed && 'px-1')}>
          {nav.map((item) => {
            const Icon = item.icon
            const showDot =
              (item.to === '/habits' && habits.length > 0 && !hasHabitLoggedToday) ||
              (item.to === '/tasks' && hasPendingTasks)

            const link = (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center rounded-lg border-l-2 border-l-transparent text-sm font-medium text-[color:var(--text-secondary)] transition-all hover:bg-[color:var(--sidebar-hover)]',
                    collapsed ? 'justify-center px-0 py-2' : 'gap-2.5 px-3 py-2',
                    isActive &&
                      'bg-[color:var(--accent-subtle)] text-[color:var(--accent)] border-l-2 border-l-[color:var(--accent)]',
                  )
                }
              >
                <span className="relative">
                  <Icon className="h-[18px] w-[18px] text-[color:var(--text-muted)] group-aria-[current=page]:text-[color:var(--accent)]" />
                  {showDot ? (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accentBlue" aria-hidden="true" />
                  ) : null}
                </span>
                {!collapsed ? <span className="min-w-0 truncate">{item.label}</span> : null}
              </NavLink>
            )

            if (!collapsed) return link

            return (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </TooltipProvider>
    </aside>
  )
}
