import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

import { StartupErrorBanner } from '@/components/StartupErrorBanner'

export function AuthLayout() {
  return (
    <div className="relative min-h-full overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-accentBlue/18 blur-3xl dark:bg-accentBlue/18" />
        <div className="absolute -bottom-40 -right-28 h-96 w-96 rounded-full bg-accentBlue/10 blur-3xl dark:bg-accentBlue/10" />
        <div className="absolute left-1/2 top-20 h-60 w-[38rem] -translate-x-1/2 rounded-full bg-foreground/5 blur-3xl dark:bg-foreground/5" />
      </div>
      <div className="relative mx-auto flex min-h-full max-w-6xl flex-col items-center justify-center gap-4 px-6 py-12">
        <div className="w-full max-w-md">
          <StartupErrorBanner />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
