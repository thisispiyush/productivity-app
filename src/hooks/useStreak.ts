import * as React from 'react'

import { useProductivityStore } from '@/hooks/useProductivityStore'
import { daysBack, formatISODate, startOfDay } from '@/utils/dates'

const milestones = [3, 7, 14, 30] as const

function computeGlobalStreak(habits: { completions: Record<string, boolean> }[]) {
  const today = startOfDay(new Date())
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const iso = formatISODate(d)
    const anyDone = habits.some((h) => Boolean(h.completions[iso]))
    if (!anyDone) break
    streak++
  }
  return streak
}

export function useStreak() {
  const { habits } = useProductivityStore()
  const streak = React.useMemo(() => computeGlobalStreak(habits), [habits])

  const milestone = React.useMemo(() => milestones.find((m) => streak === m) ?? null, [streak])

  const [bumped, setBumped] = React.useState(false)

  React.useEffect(() => {
    const key = 'pulse.streak.last.v1'
    const last = Number(localStorage.getItem(key) || '0')
    if (streak > last) {
      setBumped(true)
      window.setTimeout(() => setBumped(false), 900)
    }
    localStorage.setItem(key, String(streak))
  }, [streak])

  const weekDoneDays = React.useMemo(() => {
    // Number of days in the last 7 where at least one habit was completed
    const days = daysBack(7)
    return days.filter((d) => {
      const iso = formatISODate(d)
      return habits.some((h) => Boolean(h.completions[iso]))
    }).length
  }, [habits])

  return { streak, milestone, bumped, weekDoneDays }
}

