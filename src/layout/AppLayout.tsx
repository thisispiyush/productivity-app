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
      <main className="min-h-full overflow-x-hidden md:pl-72">
        <div className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-card/95 shadow-[0_1px_4px_rgba(0,0,0,0.06)] backdrop-blur dark:bg-background/70 dark:shadow-none md:left-72">
          <div className="mx-auto max-w-6xl px-4 py-3 md:px-6 lg:px-8">
            <TopNav />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-24 pt-24 md:px-6 md:pb-8 md:pt-24 lg:px-8 lg:pb-8">
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
