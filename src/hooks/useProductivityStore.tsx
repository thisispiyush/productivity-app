/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'

import { useAuth } from '@/hooks/useAuth'
import { useStartupErrors } from '@/hooks/useStartupErrors'
import { supabase } from '@/lib/supabaseClient'
import { formatISODate, startOfDay } from '@/utils/dates'
import { habitColorFromId } from '@/utils/habitColors'
import type { Habit, Priority, Task } from '@/utils/types'

type StoreState = {
  habits: Habit[]
  tasks: Task[]
  loading: boolean
}

type StoreActions = {
  toggleHabitCompletion: (habitId: string, status: boolean, dateISO?: string) => Promise<void>
  addHabit: (input: { name: string; icon: Habit['icon'] }) => Promise<void>
  updateHabit: (habitId: string, input: { name: string; icon: Habit['icon'] }) => Promise<void>
  deleteHabit: (habitId: string) => Promise<void>
  addTask: (input: { title: string; priority: Priority; dueDateISO?: string }) => Promise<void>
  updateTask: (taskId: string, input: { title: string; priority: Priority; dueDateISO?: string }) => Promise<void>
  toggleTask: (taskId: string, status: boolean) => Promise<void>
  reorderTasks: (activeId: string, overId: string) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
}

type Store = StoreState & StoreActions

const StoreContext = React.createContext<Store | null>(null)

const todayISO = () => formatISODate(startOfDay(new Date()))

type HabitRow = {
  id: string
  user_id: string
  name: string
  icon: Habit['icon']
  completions: Record<string, boolean> | null
}

type TaskRow = {
  id: string
  user_id: string
  title: string
  priority: Priority
  due_date: string | null
  completed: boolean
  order: number
  created_at: string
  completed_at: string | null
}

function mapHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    completions: row.completions ?? {},
    color: habitColorFromId(row.id),
  }
}

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    priority: row.priority,
    dueDateISO: row.due_date ?? undefined,
    completed: row.completed,
    order: row.order,
    createdAtISO: row.created_at,
    completedAtISO: row.completed_at ?? undefined,
  }
}

export function ProductivityStoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { pushError } = useStartupErrors()
  const [habits, setHabits] = React.useState<Habit[]>([])
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!user) {
      setHabits([])
      setTasks([])
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const [habitsRes, tasksRes] = await Promise.all([
          supabase.from('habits').select('*').eq('user_id', user!.id).order('created_at', { ascending: true }),
          supabase.from('tasks').select('*').eq('user_id', user!.id).order('order', { ascending: true }),
        ])

        if (cancelled) return

        if (habitsRes.error) {
          pushError({
            message: `Failed to load habits: ${habitsRes.error.message}`,
            hint: 'Verify the "habits" table exists and Row Level Security allows this user to read it.',
          })
        } else if (habitsRes.data) {
          setHabits(habitsRes.data.map(mapHabit))
        }

        if (tasksRes.error) {
          pushError({
            message: `Failed to load tasks: ${tasksRes.error.message}`,
            hint: 'Verify the "tasks" table exists and Row Level Security allows this user to read it.',
          })
        } else if (tasksRes.data) {
          setTasks(tasksRes.data.map(mapTask))
        }
      } catch {
        pushError({
          message: 'Unexpected error while loading data from Supabase.',
          hint: 'Check your network connection and Supabase project status.',
        })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load().catch(() => {
      // errors already pushed to banner
    })

    return () => {
      cancelled = true
    }
  }, [user, pushError])

  const addHabit = React.useCallback(
    async (input: { name: string; icon: Habit['icon'] }) => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser()
      if (!sessionUser) return

      const payload = {
        name: input.name.trim() || 'New habit',
        icon: input.icon,
        user_id: sessionUser.id
      }

      const { data, error } = await supabase.from('habits').insert([payload]).select().single()

      if (error) {
        console.error("Habit insert error:", error)
      } else if (data) {
        setHabits((prev) => [...prev, mapHabit(data)])
      }
    },
    [],
  )

  const updateHabit = React.useCallback(
    async (habitId: string, input: { name: string; icon: Habit['icon'] }) => {
      if (!user) return
      const { error } = await supabase
        .from('habits')
        .update({ name: input.name.trim(), icon: input.icon })
        .eq('id', habitId)
        .eq('user_id', user.id)

      if (error) {
        console.error("Habit update error:", error)
      } else {
        setHabits((prev) =>
          prev.map((h) => (h.id === habitId ? { ...h, name: input.name.trim() || h.name, icon: input.icon } : h)),
        )
      }
    },
    [user],
  )

  const deleteHabit = React.useCallback(
    async (habitId: string) => {
      if (!user) return
      const { error } = await supabase.from('habits').delete().eq('id', habitId).eq('user_id', user.id)

      if (error) {
        console.error("Habit delete error:", error)
      } else {
        setHabits((prev) => prev.filter((h) => h.id !== habitId))
      }
    },
    [user],
  )

  const toggleHabitCompletion = React.useCallback(
    async (habitId: string, status: boolean, dateISO = todayISO()) => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser()
      if (!sessionUser) return

      let prevCompletions: Record<string, boolean> | null = null
      let nextCompletions: Record<string, boolean> | null = null

      // Optimistic update so the day-grid responds instantly.
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== habitId) return h
          prevCompletions = h.completions
          const updated = { ...h.completions, [dateISO]: status }
          nextCompletions = updated
          return { ...h, completions: updated }
        }),
      )

      if (!nextCompletions) return

      const { error } = await supabase
        .from('habits')
        .update({ completions: nextCompletions })
        .eq('id', habitId)
        .eq('user_id', sessionUser.id)

      if (error) {
        console.error("Habit toggle error:", error)
        if (prevCompletions) {
          const revert = prevCompletions
          setHabits((prev) => prev.map((h) => (h.id === habitId ? { ...h, completions: revert } : h)))
        }
      } else {
        const now = todayISO()
        const todayAnyHabitDone = Object.values(nextCompletions).some(Boolean)
        if (todayAnyHabitDone) {
          await supabase.from('streaks').upsert(
            {
              user_id: sessionUser.id,
              current: 1,
              updated_for: now,
            },
            { onConflict: 'user_id' },
          )
        }
      }
    },
    [],
  )

  const addTask = React.useCallback(
    async (input: { title: string; priority: Priority; dueDateISO?: string }) => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser()
      if (!sessionUser) return

      // Ensure new task appears at the bottom of the list
      const newOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.order)) + 1 : 0

      const payload = {
        title: input.title.trim() || 'Untitled task',
        priority: input.priority,
        due_date: input.dueDateISO ?? null,
        order: newOrder,
        completed: false,
        user_id: sessionUser.id
      }

      const { data, error } = await supabase.from('tasks').insert([payload]).select().single()

      if (error) {
        console.error("Task insert error:", error)
      } else if (data) {
        setTasks((prev) => [...prev, mapTask(data)])
      }
    },
    [tasks],
  )

  const updateTask = React.useCallback(
    async (taskId: string, input: { title: string; priority: Priority; dueDateISO?: string }) => {
      if (!user) return
      const { error } = await supabase
        .from('tasks')
        .update({
          title: input.title.trim(),
          priority: input.priority,
          due_date: input.dueDateISO ?? null,
        })
        .eq('id', taskId)
        .eq('user_id', user.id)

      if (error) {
        console.error("Task update error:", error)
      } else {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                ...t,
                title: input.title.trim() || t.title,
                priority: input.priority,
                dueDateISO: input.dueDateISO,
              }
              : t,
          ),
        )
      }
    },
    [user],
  )

  const toggleTask = React.useCallback(
    async (taskId: string, status: boolean) => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser()
      if (!sessionUser) return

      const timestamp = status ? new Date().toISOString() : null

      const { error } = await supabase
        .from('tasks')
        .update({
          completed: status,
          completed_at: timestamp,
        })
        .eq('id', taskId)
        .eq('user_id', sessionUser.id)

      if (error) {
        console.error("Task update error:", error)
      } else {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                ...t,
                completed: status,
                completedAtISO: timestamp ?? undefined,
              }
              : t,
          ),
        )
      }
    },
    [],
  )

  const deleteTask = React.useCallback(
    async (taskId: string) => {
      if (!user) return
      const { error } = await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', user.id)

      if (error) {
        console.error("Task delete error:", error)
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== taskId))
      }
    },
    [user],
  )

  const reorderTasks = React.useCallback(
    async (activeId: string, overId: string) => {
      if (activeId === overId) return
      const pending = tasks.filter((t) => !t.completed).sort((a, b) => a.order - b.order)
      const done = tasks.filter((t) => t.completed)

      const activeIdx = pending.findIndex((t) => t.id === activeId)
      const overIdx = pending.findIndex((t) => t.id === overId)
      if (activeIdx === -1 || overIdx === -1) return

      const next = pending.slice()
      const [moved] = next.splice(activeIdx, 1)
      next.splice(overIdx, 0, moved)

      const reOrdered = next.map((t, i) => ({ ...t, order: i }))

      // Optimistic update for UI smoothness during drag & drop
      setTasks([...reOrdered, ...done])

      if (user) {
        const { error } = await supabase.from('tasks').upsert(
          reOrdered.map((t) => ({
            id: t.id,
            user_id: user.id,
            order: t.order,
          })),
        )
        if (error) {
          console.error("Task reorder error:", error)
        }
      }
    },
    [tasks, user],
  )

  const value: Store = React.useMemo(
    () => ({
      habits,
      tasks,
      loading,
      toggleHabitCompletion,
      addHabit,
      updateHabit,
      deleteHabit,
      addTask,
      updateTask,
      toggleTask,
      reorderTasks,
      deleteTask,
    }),
    [
      habits,
      tasks,
      loading,
      toggleHabitCompletion,
      addHabit,
      updateHabit,
      deleteHabit,
      addTask,
      updateTask,
      toggleTask,
      reorderTasks,
      deleteTask,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useProductivityStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error('useProductivityStore must be used within ProductivityStoreProvider')
  return ctx
}
