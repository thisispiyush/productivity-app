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
    <div className="min-h-full bg-background" style={{ ['--sidebar-w' as never]: sidebarWidth }}>
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapsed={() => setSidebarCollapsed((c) => !c)} />
      <main className="min-h-full overflow-x-hidden md:pl-[var(--sidebar-w)]">
        <div className="sticky left-0 right-0 top-0 z-40 h-[52px] border-b border-[color:var(--header-border)] bg-[color:var(--bg-header)] shadow-[var(--shadow-header)] md:left-[var(--sidebar-w)]">
          <div className="mx-auto flex h-full max-w-6xl items-center px-6">
            <TopNav />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:px-8 md:pb-8 md:pt-6">
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
      <MobileBottomNav />
    </div>
  )
}
