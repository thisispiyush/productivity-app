import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card } from '@/components/ui/card'

type Point = { label: string; score: number }

export function WeeklyLineChart({ data }: { data: Point[] }) {
  const blurRechartsFocus = () => {
    // Recharts may focus its internal wrapper/SVG on click; immediately blur to avoid click outlines.
    window.requestAnimationFrame(() => {
      const el = document.activeElement as HTMLElement | null
      if (!el) return
      if (el.classList?.contains('recharts-wrapper') || el.closest?.('.recharts-wrapper')) el.blur?.()
    })
  }

  return (
    <Card className="stat-card hover:translate-y-0 hover:shadow-none">
      <div className="text-sm font-medium text-[color:var(--text-secondary)]">Weekly Productivity</div>
      <div className="mt-4 h-56 md:h-64" onPointerDownCapture={blurRechartsFocus}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 6, right: 18, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--chart-tick)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: 'var(--chart-tick)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ stroke: 'var(--chart-cursor)' }}
                contentStyle={{
                  background: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: 10,
                  color: 'var(--foreground)',
                }}
                labelStyle={{ color: 'var(--tooltip-label)' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4F6EF7"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
      </div>
    </Card>
  )
}

