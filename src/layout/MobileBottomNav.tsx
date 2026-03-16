import { NavLink } from 'react-router-dom'
import { BarChart3, CheckSquare, Flame, LayoutDashboard } from 'lucide-react'

import { cn } from '@/utils/cn'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habits', label: 'Habits', icon: Flame },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
] as const

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur md:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative grid min-h-[44px] min-w-[64px] place-items-center rounded-2xl px-3 py-2 text-muted transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-accentBlue/35',
                  isActive ? 'text-accentBlue' : 'hover:text-foreground',
                )
              }
              aria-label={item.label}
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-5 w-5" />
                  <span
                    className={cn(
                      'pointer-events-none absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-accentBlue transition-opacity',
                      isActive ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

