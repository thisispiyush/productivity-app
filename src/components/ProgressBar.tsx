import { motion } from 'framer-motion'

import { cn } from '@/utils/cn'

export function ProgressBar({
  value,
  color = 'blue',
}: {
  value: number // 0..1
  color?: 'blue' | 'purple' | 'green'
}) {
  const pct = Math.max(0, Math.min(1, value))
  void color
  const fill = 'bg-accentBlue'
  return (
    <div className="h-1.5 w-full rounded-full bg-[color:var(--bg-input)]">
      <motion.div
        className={cn('h-full rounded-full', fill)}
        initial={false}
        animate={{ width: `${pct * 100}%` }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
    </div>
  )
}

