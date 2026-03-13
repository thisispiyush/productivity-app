import * as React from 'react'

import { cn } from '@/utils/cn'

export function Glow({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card hover-glow transition-shadow',
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-black/5 blur-2xl dark:bg-white/5" />
      {children}
    </div>
  )
}

