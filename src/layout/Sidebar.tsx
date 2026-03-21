import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart3, CheckSquare, Flame, LayoutDashboard } from 'lucide-react'

import { Avatar } from '@/components/Avatar'
import { EKGIcon } from '@/components/icons/EKGIcon'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/hooks/useUser'
import { cn } from '@/utils/cn'
import { SettingsModal } from '@/components/SettingsModal'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, colorHex: '#4F6EF7' },
  { to: '/habits', label: 'Habits', icon: Flame, colorHex: '#f97316' },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare, colorHex: '#22c55e' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, colorHex: '#a855f7' },
] as const

export function Sidebar(_props: {
  collapsed?: boolean
  onToggleCollapsed?: () => void
}) {
  const { user } = useAuth()
  const { displayName, avatarDataUrl } = useUser()
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  
  const defaultName = React.useMemo(() => {
    const email = user?.email ?? ''
    const base = email.includes('@') ? email.split('@')[0] : email
    return base ? base.replace(/[._-]+/g, ' ') : 'Pulse User'
  }, [user?.email])

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[220px] flex-col overflow-y-auto border-r border-[color:var(--sidebar-border)] bg-[color:var(--bg-sidebar)] md:flex">
        {/* Top section: Logo */}
        <div className="shrink-0 pt-4 px-4">
          <NavLink
            to="/"
            className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.04] cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[color:var(--sidebar-border)] bg-surface text-foreground shrink-0 shadow-sm">
              <EKGIcon className="h-5 w-5 drop-shadow-sm" />
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-[15px] text-foreground tracking-tight">Pulse</p>
            </div>
          </NavLink>
        </div>

        <div className="h-px bg-[color:var(--sidebar-border)] opacity-60 mx-4 mt-4 mb-4" />

        {/* User section */}
        <div className="relative px-4 pb-4">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-left"
          >
            <Avatar name={displayName || defaultName} photoUrl={avatarDataUrl} size={28} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-foreground">
                {(displayName || defaultName).split(' ')[0]}
              </div>
            </div>
          </button>
        </div>

        {/* Nav section */}
        <nav className="flex-1 flex flex-col gap-1 px-3 mt-2 pb-6">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-all duration-150 ease-out rounded-lg',
                    !isActive && 'hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-[color:var(--text-secondary)]',
                  )
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? `${item.colorHex}1A` : undefined,
                  color: isActive ? 'var(--foreground)' : 'var(--text-secondary)',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className="h-[18px] w-[18px] transition-colors duration-150 ease-out shrink-0" 
                      style={{ 
                        color: item.colorHex,
                        opacity: isActive ? 1 : 0.65
                      }} 
                    />
                    <span className="min-w-0 truncate" style={{ fontWeight: isActive ? 600 : 500 }}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
