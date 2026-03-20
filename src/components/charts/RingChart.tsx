import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts'

import { Card } from '@/components/ui/card'

export function RingChart({
  title,
  value,
  color,
  subtitle,
}: {
  title: string
  value: number // 0..1
  color: 'blue' | 'purple' | 'green'
  subtitle?: string
}) {
  const pct = Math.round(value * 100)
  const data = [
    { name: 'done', value: Math.max(0, Math.min(100, pct)) },
    { name: 'rest', value: Math.max(0, 100 - pct) },
  ]

  const fill = color === 'green' ? '#22C55E' : color === 'purple' ? '#8B5CF6' : '#4F6EF7'
  const bg = 'var(--chart-ring-bg)'

  const blurRechartsFocus = () => {
    window.requestAnimationFrame(() => {
      const el = document.activeElement as HTMLElement | null
      if (!el) return
      if (el.classList?.contains('recharts-wrapper') || el.closest?.('.recharts-wrapper')) el.blur?.()
    })
  }

  return (
    <Card className="stat-card hover:translate-y-0 hover:shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-medium text-[color:var(--text-secondary)]">{title}</div>
        <div className="text-right text-sm font-medium tabular-nums text-[color:var(--text-muted)]">{pct}%</div>
      </div>

      <div className="mt-4 h-40 md:h-44" onPointerDownCapture={blurRechartsFocus}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={52}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                stroke="transparent"
                isAnimationActive
              >
                <Cell fill={fill} />
                <Cell fill={bg} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
      </div>
      {subtitle ? <div className="mt-3 text-xs text-[color:var(--chart-tick)]">{subtitle}</div> : null}
    </Card>
  )
}

