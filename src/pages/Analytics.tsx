import * as React from 'react'
import { CheckCircle2, Flame, Target, Trophy } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { StatCard } from '@/components/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductivityStore } from '@/hooks/useProductivityStore'
import { daysBack, formatISODate, startOfDay, startOfWeek } from '@/utils/dates'

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

const weekdayLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

function longestStreak(completions: Record<string, boolean>) {
  const dates = Object.keys(completions)
    .filter((k) => completions[k])
    .sort()
  if (dates.length === 0) return 0

  let best = 1
  let cur = 1

  for (let i = 1; i < dates.length; i++) {
    const prev = startOfDay(new Date(dates[i - 1]))
    const next = startOfDay(new Date(dates[i]))
    const diffDays = Math.round((next.getTime() - prev.getTime()) / 86400000)
    if (diffDays === 1) {
      cur += 1
      best = Math.max(best, cur)
    } else if (diffDays > 1) {
      cur = 1
    }
  }

  return best
}

export function AnalyticsPage() {
  const { habits, tasks } = useProductivityStore()

  const blurRechartsFocus = React.useCallback(() => {
    window.requestAnimationFrame(() => {
      const el = document.activeElement as HTMLElement | null
      if (!el) return
      if (el.classList?.contains('recharts-wrapper') || el.closest?.('.recharts-wrapper')) el.blur?.()
    })
  }, [])

  const taskDoneByDate = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const t of tasks) {
      if (!t.completed || !t.completedAtISO) continue
      const dateISO = formatISODate(startOfDay(new Date(t.completedAtISO)))
      map.set(dateISO, (map.get(dateISO) ?? 0) + 1)
    }
    return map
  }, [tasks])

  const totalHabitsCompleted = React.useMemo(() => {
    return habits.reduce((sum, h) => sum + Object.values(h.completions).filter(Boolean).length, 0)
  }, [habits])

  const bestStreak = React.useMemo(() => {
    return habits.reduce((best, h) => Math.max(best, longestStreak(h.completions)), 0)
  }, [habits])

  const mostProductiveDay = React.useMemo(() => {
    const counts = new Map<number, number>() // 0..6
    for (const h of habits) {
      for (const iso of Object.keys(h.completions)) {
        if (!h.completions[iso]) continue
        const dow = new Date(iso).getDay()
        counts.set(dow, (counts.get(dow) ?? 0) + 1)
      }
    }
    for (const t of tasks) {
      if (!t.completed || !t.completedAtISO) continue
      const dow = new Date(t.completedAtISO).getDay()
      counts.set(dow, (counts.get(dow) ?? 0) + 1)
    }
    if (counts.size === 0) return 'None yet'

    let bestDow = 0
    let best = -1
    for (const [dow, n] of counts.entries()) {
      if (n > best) {
        best = n
        bestDow = dow
      }
    }
    return weekdayLong[bestDow] ?? 'Unknown'
  }, [habits, tasks])

  const tasksThisWeek = React.useMemo(() => {
    const weekStart = startOfWeek(new Date(), 1)
    const weekStartISO = formatISODate(startOfDay(weekStart))
    return tasks.filter((t) => t.completed && t.completedAtISO && formatISODate(startOfDay(new Date(t.completedAtISO))) >= weekStartISO)
      .length
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



  return (
    <div className="space-y-6 pt-[32px]">
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold tracking-tight text-foreground">Analytics</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Honest trends over time.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <StatCard title="Total Habits Completed" value={totalHabitsCompleted} icon={Target} accent="blue" />
        <StatCard title="Best Streak" value={bestStreak === 1 ? '1 day' : `${bestStreak} days`} icon={Flame} accent="orange" />
        <StatCard title="Most Productive Day" value={mostProductiveDay} icon={Trophy} accent="purple" />
        <StatCard title="Tasks Done This Week" value={tasksThisWeek} icon={CheckCircle2} accent="green" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Habit streak trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 md:h-64" onPointerDownCapture={blurRechartsFocus}>
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
            <div className="h-56 md:h-64" onPointerDownCapture={blurRechartsFocus}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={taskTrend} margin={{ left: 6, right: 18, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle()} />
                  <Area type="monotone" dataKey="done" stroke="#4F6EF7" fill="rgba(79,110,247,0.20)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

