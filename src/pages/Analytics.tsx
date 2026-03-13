import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import * as React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductivityStore } from '@/hooks/useProductivityStore'
import { daysBack, formatISODate, startOfDay } from '@/utils/dates'

function tooltipStyle() {
  return {
    contentStyle: {
      background: 'var(--tooltip-bg)',
      border: '1px solid var(--tooltip-border)',
      borderRadius: 14,
      color: 'var(--foreground)',
    },
    labelStyle: { color: 'var(--tooltip-label)' },
    cursor: { stroke: 'var(--chart-cursor)' },
  } as const
}

export function AnalyticsPage() {
  const { habits, tasks } = useProductivityStore()

  const taskDoneByDate = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const t of tasks) {
      if (!t.completed || !t.completedAtISO) continue
      const dateISO = formatISODate(startOfDay(new Date(t.completedAtISO)))
      map.set(dateISO, (map.get(dateISO) ?? 0) + 1)
    }
    return map
  }, [tasks])

  const habitTrend = daysBack(14).map((d) => {
    const iso = formatISODate(d)
    const done = habits.filter((h) => h.completions[iso]).length
    return {
      label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      done,
    }
  })

  const taskTrend = daysBack(14).map((d) => {
    const iso = formatISODate(d)
    const done = taskDoneByDate.get(iso) ?? 0
    return {
      label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      done,
    }
  })

  const productivity = daysBack(7).map((d) => {
    const iso = formatISODate(d)
    const dayHabits = habits.filter((h) => h.completions[iso]).length
    const dayTasks = tasks.filter((t) => t.completedAtISO === iso).length
    const habitScore = (dayHabits / Math.max(1, habits.length)) * 60
    const taskScore = (Math.min(dayTasks, 5) / 5) * 40
    const score = Math.round(habitScore + taskScore)
    return { label: d.toLocaleDateString(undefined, { weekday: 'short' }), score }
  })

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Analytics</div>
        <div className="mt-2 text-sm text-muted">Minimal, dark, and honest — trends over time.</div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Habit streak trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={habitTrend} margin={{ left: 6, right: 18, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle()} />
                  <Line type="monotone" dataKey="done" stroke="#22C55E" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Task completion trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={taskTrend} margin={{ left: 6, right: 18, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle()} />
                  <Area
                    type="monotone"
                    dataKey="done"
                    stroke="#4F7CFF"
                    fill="rgba(79,124,255,0.20)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Weekly productivity score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivity} margin={{ left: 6, right: 18, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle()} />
                <Bar dataKey="score" radius={[12, 12, 12, 12]} fill="rgba(139,92,246,0.85)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

