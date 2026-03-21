import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'

import { StartupErrorBanner } from '@/components/StartupErrorBanner'
import { Sidebar } from '@/layout/Sidebar'
import { MobileBottomNav } from '@/layout/MobileBottomNav'

export function AppLayout() {
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const sidebarWidth = sidebarCollapsed ? '60px' : '220px'

  return (
    <div className="h-screen bg-background" style={{ ['--sidebar-w' as never]: sidebarWidth }}>


      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapsed={() => setSidebarCollapsed((c) => !c)} />
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto md:pl-[var(--sidebar-w)]">
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
