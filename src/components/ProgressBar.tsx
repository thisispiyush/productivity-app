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
  const fill = color === 'green' ? 'bg-accentGreen' : color === 'purple' ? 'bg-accentPurple' : 'bg-accentBlue'
  return (
    <div className="h-2.5 w-full rounded-full bg-[var(--timer-track)]">
      <motion.div
        className={cn('h-full rounded-full', fill)}
        initial={false}
        animate={{ width: `${pct * 100}%` }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
    </div>
  )
}

