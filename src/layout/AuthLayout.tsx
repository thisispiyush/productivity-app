import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

import { StartupErrorBanner } from '@/components/StartupErrorBanner'

export function AuthLayout() {
  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-12">
        <div className="mb-4">
          <StartupErrorBanner />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="w-full max-w-md self-center"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}

