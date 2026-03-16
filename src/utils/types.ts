export type Priority = 'Low' | 'Medium' | 'High'

export type Habit = {
  id: string
  name: string
  icon: 'Flame' | 'Dumbbell' | 'BookOpen' | 'Droplets' | 'Brain' | 'Leaf'
  completions: Record<string, boolean>
  color: string
}

export type Task = {
  id: string
  title: string
  priority: Priority
  dueDateISO?: string
  completed: boolean
  completedAtISO?: string
  order: number
  createdAtISO: string
}

