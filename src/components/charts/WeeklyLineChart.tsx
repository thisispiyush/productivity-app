import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Point = { label: string; score: number }

export function WeeklyLineChart({ data }: { data: Point[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Weekly Productivity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 6, right: 18, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--chart-tick)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: 'var(--chart-tick)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ stroke: 'var(--chart-cursor)' }}
                contentStyle={{
                  background: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: 14,
                  color: 'var(--foreground)',
                }}
                labelStyle={{ color: 'var(--tooltip-label)' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4F7CFF"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

