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
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-4 md:px-6 md:pb-8 md:pt-6 lg:px-8 lg:py-8">
          <TopNav />
          <StartupErrorBanner />
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
