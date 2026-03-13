import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  const fill = color === 'green' ? '#22C55E' : color === 'purple' ? '#8B5CF6' : '#4F7CFF'
  const bg = 'var(--chart-ring-bg)'

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-semibold tabular-nums">{pct}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-44">
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
        {subtitle ? <div className="mt-2 text-xs text-muted">{subtitle}</div> : null}
      </CardContent>
    </Card>
  )
}

