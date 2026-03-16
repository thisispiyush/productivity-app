import * as React from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { daysBack, formatISODate, startOfDay } from '@/utils/dates'
import type { Habit } from '@/utils/types'
import { cn } from '@/utils/cn'
import { habitIcons } from '@/utils/habitIcons'

function getStreak(habit: Habit, from = new Date()) {
  const base = startOfDay(from)
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() - i)
    const iso = formatISODate(d)
    if (!habit.completions[iso]) break
    streak++
  }
  return streak
}

function getLastNDaysCompletion(habit: Habit, n: number) {
  const days = daysBack(n)
  const done = days.filter((d) => habit.completions[formatISODate(d)]).length
  return done / Math.max(1, n)
}

function MiniRing({ value }: { value: number }) {
  const size = 44
  const stroke = 5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, value))
  const offset = c * (1 - pct)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--chart-ring-bg)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#22C55E"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 500ms ease' }}
      />
    </svg>
  )
}

function formatMonthDay(iso: string) {
  const [y, m, d] = iso.split('-').map((x) => Number(x))
  if (!y || !m || !d) return iso
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function HabitCard({
  habit,
  onToggleDate,
  onToggleToday,
  onEdit,
  onDelete,
}: {
  habit: Habit
  onToggleDate: (dateISO: string, status: boolean) => void
  onToggleToday: (status: boolean) => void
  onEdit: () => void
  onDelete: () => void
}) {
  const Icon = habitIcons[habit.icon]
  const streak = getStreak(habit)
  const progress7 = getLastNDaysCompletion(habit, 7)
  const days = daysBack(30)
  const today = formatISODate(startOfDay(new Date()))
  const doneToday = Boolean(habit.completions[today])

  const [localCompletions, setLocalCompletions] = React.useState<Record<string, boolean>>(() => habit.completions)

  React.useEffect(() => {
    setLocalCompletions(habit.completions)
  }, [habit.id, habit.completions])

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: habit.color }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-surface">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">{habit.name}</CardTitle>
              <div className="mt-1 text-xs text-muted">
                <span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: habit.color }} />{' '}
                {streak} day streak
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MiniRing value={progress7} />
            <Button variant="ghost" size="icon" className="text-muted hover:text-foreground" onClick={onEdit} aria-label="Edit habit">
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted hover:text-foreground"
              onClick={onDelete}
              aria-label="Delete habit"
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="flex items-end justify-between gap-4">
          <div className="rounded-2xl border border-border bg-surface p-3">
            <TooltipProvider delayDuration={80}>
              <div className="grid max-w-full grid-cols-7 gap-2 overflow-hidden">
                {days.map((d) => {
                  const iso = formatISODate(d)
                  const done = Boolean(localCompletions[iso])
                  const isToday = iso === today

                  const base = 'h-4 w-4 rounded-sm border border-transparent transition-all duration-200'
                  const hover = 'hover:shadow-[0_0_0_3px_rgba(79,124,255,0.16)]'
                  const defaultBg = 'bg-gray-200 dark:bg-neutral-800'
                  const todayBg = 'bg-gray-300 dark:bg-neutral-700'
                  const completedBg = ''
                  const todayBorder = 'border-blue-500 dark:border-blue-400'

                  const cls = cn(
                    base,
                    hover,
                    done ? completedBg : isToday ? todayBg : defaultBg,
                    isToday && todayBorder,
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentBlue/35',
                  )

                  return (
                    <Tooltip key={iso}>
                      <TooltipTrigger asChild>
                        <motion.button
                          type="button"
                          aria-label={`${habit.name} on ${iso}`}
                          className={cls}
                          style={done ? { backgroundColor: habit.color } : undefined}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 1.1 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          onClick={() => {
                            const next = !done
                            setLocalCompletions((prev) => ({ ...prev, [iso]: next }))
                            onToggleDate(iso, next)
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <div className="font-medium">{formatMonthDay(iso)}</div>
                        <div className="mt-0.5 text-muted">{done ? 'Completed' : 'Missed'}</div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </TooltipProvider>
            <div className="mt-2 text-[11px] text-muted">Tap squares to log days</div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button
              variant="secondary"
              ripple
              className={cn(doneToday ? 'border border-border' : 'text-white hover:opacity-90')}
              style={doneToday ? undefined : { backgroundColor: habit.color, borderColor: 'transparent' }}
              onClick={() => onToggleToday(!doneToday)}
            >
              {doneToday ? 'Completed' : 'Mark today'}
            </Button>
            <div className="text-xs text-muted">{Math.round(progress7 * 100)}% last 7 days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

