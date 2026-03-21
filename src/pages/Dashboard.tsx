import { CheckCircle2, Flame, ListTodo, Target } from 'lucide-react'
import { motion } from 'framer-motion'


import { WeeklyLineChart } from '@/components/charts/WeeklyLineChart'
import { FocusTimer } from '@/components/FocusTimer'
import { ProgressBar } from '@/components/ProgressBar'
import { StatCard } from '@/components/StatCard'
import { Card, CardContent } from '@/components/ui/card'
import { useProductivityStore } from '@/hooks/useProductivityStore'
import { useStreak } from '@/hooks/useStreak'
import { useUser } from '@/hooks/useUser'
import { daysBack, formatISODate, startOfDay, startOfWeek } from '@/utils/dates'
import { getMotivationMessage } from '@/utils/motivation'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  if (hour < 21) return 'Good Evening'
  return 'Good Night'
}

export function DashboardPage() {
  const { displayName } = useUser()
  const greeting = `${getGreeting()}, ${displayName} \u{1F44B}`
  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const { habits, tasks } = useProductivityStore()
  const { streak, milestone, bumped } = useStreak()

  const today = formatISODate(startOfDay(new Date()))
  const habitsDoneToday = habits.filter((h) => h.completions[today]).length

  const tasksDone = tasks.filter((t) => t.completed).length
  const tasksPending = tasks.filter((t) => !t.completed).length

  const weekStart = startOfWeek(new Date(), 1)
  const weekStartISO = formatISODate(weekStart)
  const weekDates = daysBack(7, startOfDay(new Date()))
    .map((d) => formatISODate(d))
    .filter((iso) => iso >= weekStartISO)

  const habitsCompletedThisWeek = habits.reduce((sum, h) => {
    const c = weekDates.reduce((s, iso) => s + (h.completions[iso] ? 1 : 0), 0)
    return sum + c
  }, 0)

  const tasksCompletedThisWeek = tasks.filter((t) => t.completedAtISO && t.completedAtISO >= weekStartISO).length

  const weekly = daysBack(7).map((d) => {
    const iso = formatISODate(d)
    const dayHabits = habits.filter((h) => h.completions[iso]).length
    const dayTasks = tasks.filter((t) => t.completedAtISO === iso).length
    const habitScore = (dayHabits / Math.max(1, habits.length)) * 60
    const taskScore = (Math.min(dayTasks, 5) / 5) * 40
    const score = Math.round(habitScore + taskScore)
    const label = d.toLocaleDateString(undefined, { weekday: 'short' })
    return { label, score }
  })

  const message = getMotivationMessage(new Date().getDate())

  const weeklyHabitGoal = 20
  const weeklyTaskGoal = 10
  const habitGoalRatio = habitsCompletedThisWeek / Math.max(1, weeklyHabitGoal)
  const taskGoalRatio = tasksCompletedThisWeek / Math.max(1, weeklyTaskGoal)

  return (
    <div className="space-y-6 pt-[32px]">
      <div className="mb-0 pb-4 md:mb-2 md:pb-7 space-y-2">
        <div className="text-[26px] md:text-[30px] font-bold tracking-[-0.03em] text-[color:var(--text-primary)]">{greeting}</div>
        <div className="-mt-0.5 text-xs text-[color:var(--chart-tick)]">{dateLabel}</div>
        <div className="mt-1 max-w-md text-[12px] md:text-sm font-normal text-[color:var(--text-muted)]">{message}</div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        <StatCard
          title={<><span className="hidden md:inline">Habits Completed</span><span className="md:hidden">Habits</span></>}
          value={`${habitsDoneToday}/${habits.length}`}
          subtitle="Logged today"
          icon={Target}
          accent="green"
        />
        <div className="relative">
          <div className="absolute -top-2 right-2 z-10">
            {milestone ? (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted"
              >
                Milestone: <span className="text-foreground font-medium">{milestone} days</span>
              </motion.div>
            ) : null}
          </div>
          <motion.div
            animate={bumped ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <StatCard
              title={<><span className="hidden md:inline">Current Streak</span><span className="md:hidden">Streak</span></>}
              value={
                <span className="inline-flex items-center gap-2">
                  <Flame className="h-5 w-5 text-accentPurple" />
                  <span className="tabular-nums">{streak === 1 ? '1 day' : `${streak} days`}</span>
                </span>
              }
              subtitle="At least one habit per day"
              icon={Flame}
              accent="purple"
            />
          </motion.div>
        </div>
        <StatCard title={<><span className="hidden md:inline">Tasks Completed</span><span className="md:hidden">Tasks</span></>} value={tasksDone} subtitle="All time (local)" icon={CheckCircle2} accent="blue" />
        <StatCard title={<><span className="hidden md:inline">Pending Tasks</span><span className="md:hidden">Pending</span></>} value={tasksPending} subtitle="Queue remaining" icon={ListTodo} accent="blue" />
      </div>

      <div className="w-full">
        <WeeklyLineChart data={weekly} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FocusTimer />
        <Card className="stat-card overflow-hidden hover:translate-y-0 hover:shadow-none">
          <CardContent className="p-0">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-[color:var(--text-secondary)]">Weekly progress</div>
              <div className="text-xs text-[color:var(--chart-tick)]">
                Since {weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="text-[color:var(--text-secondary)]">Habit goal</div>
                  <div className="tabular-nums text-[color:var(--text-primary)] text-right">
                    {habitsCompletedThisWeek}/{weeklyHabitGoal}
                  </div>
                </div>
                <ProgressBar value={habitGoalRatio} color="green" />
                <div className="text-xs text-[color:var(--text-muted)]">Every check-in counts.</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="text-[color:var(--text-secondary)]">Task goal</div>
                  <div className="tabular-nums text-[color:var(--text-primary)] text-right">
                    {tasksCompletedThisWeek}/{weeklyTaskGoal}
                  </div>
                </div>
                <ProgressBar value={taskGoalRatio} color="blue" />
                <div className="text-xs text-[color:var(--text-muted)]">Finish fewer things, better.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
