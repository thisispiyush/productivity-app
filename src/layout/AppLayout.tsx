import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'

import { StartupErrorBanner } from '@/components/StartupErrorBanner'
import { Sidebar } from '@/layout/Sidebar'
import { MobileBottomNav } from '@/layout/MobileBottomNav'
import { TopNav } from '@/layout/TopNav'

export function AppLayout() {
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const sidebarWidth = sidebarCollapsed ? '60px' : '220px'

  return (
    <div className="h-screen bg-background" style={{ ['--sidebar-w' as never]: sidebarWidth }}>
      <header className="sticky top-0 z-40 h-[52px] border-b border-[color:var(--header-border)] bg-[color:var(--bg-header)] shadow-[var(--shadow-header)]">
        <div className="mx-auto flex h-full max-w-6xl items-center px-6 md:pl-[calc(var(--sidebar-w)+1.5rem)]">
          <TopNav />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapsed={() => setSidebarCollapsed((c) => !c)} />
        <main className="min-h-0 flex-1 overflow-x-hidden md:pl-[var(--sidebar-w)]">
          <div className="mx-auto max-w-6xl px-4 pb-24 pt-0 md:px-8 md:pb-8 md:pt-0">
            <div className="relative z-0">
              <StartupErrorBanner />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
