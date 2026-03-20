import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { StartupErrorBanner } from '@/components/StartupErrorBanner'
import { Sidebar } from '@/layout/Sidebar'
import { MobileBottomNav } from '@/layout/MobileBottomNav'
import { TopNav } from '@/layout/TopNav'

export function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-full bg-background">
      <Sidebar />
      <main className="min-h-full overflow-x-hidden md:pl-[220px]">
        <div className="fixed left-0 right-0 top-0 z-50 h-14 border-b border-[color:var(--sidebar-border)] bg-[color:var(--bg-header)] backdrop-blur-[12px] md:left-[220px]">
          <div className="mx-auto flex h-full max-w-6xl items-center px-4 md:px-8">
            <TopNav />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-24 pt-20 md:px-8 md:pb-8 md:pt-20">
          <div className="relative z-0">
            <StartupErrorBanner />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
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
