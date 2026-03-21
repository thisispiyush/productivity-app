import { ArrowLeft } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

import { cn } from '@/utils/cn'

function titleFromPath(pathname: string) {
  if (pathname.startsWith('/profile')) return 'Profile'
  return 'Settings'
}

function subtitleFromPath(pathname: string) {
  if (pathname.startsWith('/profile')) return 'Your account details.'
  return 'Appearance, preferences, and account.'
}

export function SettingsLayout() {
  const { pathname } = useLocation()
  const title = titleFromPath(pathname)
  const subtitle = subtitleFromPath(pathname)
  const isSettings = pathname.startsWith('/settings')

  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b border-border bg-card flex items-center px-6 gap-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition">
          <ArrowLeft size={16} />
          Back to app
        </Link>
        <span className="text-border">|</span>
        <span className="text-sm font-medium">{title}</span>
        <span className="hidden text-xs text-muted sm:inline">{subtitle}</span>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
        <div className="flex items-start gap-6 md:gap-8">
          <div className="w-44 shrink-0">
            {isSettings ? (
              <nav className="flex flex-col gap-1">
                {[
                  { label: 'Appearance', href: '/settings#appearance' },
                  { label: 'Preferences', href: '/settings#preferences' },
                  { label: 'Data & Privacy', href: '/settings#data' },
                  { label: 'Account Control', href: '/settings#account' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : (
              <nav className="flex flex-col gap-1">
                {[
                  { label: 'Profile', to: '/profile' },
                  { label: 'Settings', to: '/settings' },
                ].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface transition-all',
                        isActive && 'bg-surface text-foreground',
                      )
                    }
                    end
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
