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
        'fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-visible border-r border-[color:var(--sidebar-border)] bg-[color:var(--bg-sidebar)] pb-4 md:flex',
        'transition-[width] duration-200 ease-out',
        collapsed ? 'w-[72px] px-2' : 'w-[220px] px-3',
      )}
    >
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="absolute -right-3 top-1/2 z-50 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--sidebar-border)] bg-surface shadow-sm transition-all duration-150 ease-out hover:scale-110 hover:bg-muted md:flex"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          size={14}
          className={cn('text-muted-foreground transition-transform duration-200', collapsed && 'rotate-180')}
        />
      </button>

      <div className="shrink-0 pt-4">
        <Link to="/" className={cn('flex items-center gap-3 py-4 no-underline transition hover:opacity-80', collapsed ? 'justify-center' : 'px-4')}>
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
        <div className={cn("mt-2 h-px bg-gradient-to-r from-transparent via-[color:var(--sidebar-border)] to-transparent", collapsed ? "-mx-2" : "-mx-3")} />
      </div>

      <TooltipProvider delayDuration={80}>
        <nav className={cn('mt-4 flex-1 flex flex-col', collapsed ? 'items-center gap-2 px-0' : 'space-y-1 px-1')}>
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
                    'group relative flex items-center font-medium transition-all',
                    collapsed
                      ? 'justify-center w-11 h-11 rounded-xl hover:bg-muted text-sm'
                      : 'gap-2.5 px-3 py-2 rounded-lg border-l-2 border-l-transparent text-[color:var(--text-secondary)] hover:bg-[color:var(--sidebar-hover)] text-sm',
                    isActive && !collapsed && 'bg-[color:var(--accent-subtle)] text-accentBlue border-l-2 border-l-accentBlue',
                    isActive && collapsed && 'bg-accentBlue/10 text-accentBlue',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {collapsed && isActive && (
                      <div className="absolute left-[-8px] top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-md bg-accentBlue" />
                    )}
                    <span className="relative flex items-center justify-center">
                      <Icon className={cn(
                        collapsed ? 'h-6 w-6' : 'h-[18px] w-[18px]',
                        isActive ? 'text-accentBlue' : (collapsed ? 'text-muted-foreground group-hover:text-foreground' : 'text-[color:var(--text-muted)] group-hover:text-[color:var(--text-secondary)]')
                      )} />
                      {showDot ? (
                        <span className={cn("absolute bg-accentBlue rounded-full", collapsed ? "-right-1 -top-1 h-2.5 w-2.5 border-[2px] border-[color:var(--bg-sidebar)]" : "-right-0.5 -top-0.5 h-2 w-2")} aria-hidden="true" />
                      ) : null}
                    </span>
                    {!collapsed ? <span className="min-w-0 truncate">{item.label}</span> : null}
                  </>
                )}
              </NavLink>
            )

            if (!collapsed) return link

            return (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={14}
                  className="rounded-full border-none bg-zinc-900 px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-md dark:bg-zinc-800 dark:text-zinc-100 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </TooltipProvider>
    </aside>
  )
}
