import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'blue',
}: {
  title: string
  value: React.ReactNode
  subtitle?: string
  icon: LucideIcon
  accent?: 'blue' | 'purple' | 'green' | 'orange'
}) {
  const ring =
    accent === 'green'
      ? 'ring-accentGreen/20 hover:shadow-glowGreen'
      : accent === 'orange'
        ? 'ring-orange-500/20 hover:shadow-glow'
      : accent === 'purple'
        ? 'ring-accentPurple/20 hover:shadow-glow'
        : 'ring-accentBlue/20 hover:shadow-glow'

  const dot =
    accent === 'green'
      ? 'bg-accentGreen'
      : accent === 'orange'
        ? 'bg-orange-500'
      : accent === 'purple'
        ? 'bg-accentPurple'
        : 'bg-accentBlue'

  return (
    <Card className={cn('group relative overflow-hidden ring-1 transition-all', ring)}>
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-black/5 blur-2xl transition-opacity group-hover:opacity-90 dark:bg-white/5" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-muted">{title}</div>
            <div className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">{value}</div>
            {subtitle ? <div className="mt-1 text-xs text-muted">{subtitle}</div> : null}
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-surface">
            <Icon className="h-4 w-4 text-foreground" />
            <span className={cn('absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full', dot)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

