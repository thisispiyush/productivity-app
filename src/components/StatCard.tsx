import type { LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent: _accent = 'blue',
}: {
  title: string
  value: React.ReactNode
  subtitle?: string
  icon: LucideIcon
  accent?: 'blue' | 'purple' | 'green' | 'orange'
}) {
  return (
    <Card className="stat-card relative hover:translate-y-0 hover:shadow-none">
      <div className="pr-8">
        <div className="stat-label font-medium uppercase">{title}</div>
        <div className="mt-2 text-[28px] font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">
          {value}
        </div>
        {subtitle ? <div className="mt-1 text-xs text-[color:var(--text-muted)]">{subtitle}</div> : null}
      </div>
      <Icon className="absolute right-5 top-5 h-[18px] w-[18px] opacity-40 text-[color:var(--text-muted)]" />
    </Card>
  )
}

