import { BookOpen, Brain, Dumbbell, Droplets, Flame, Leaf, type LucideIcon } from 'lucide-react'

import type { Habit } from '@/utils/types'

export const habitIcons: Record<Habit['icon'], LucideIcon> = {
  Flame,
  Dumbbell,
  BookOpen,
  Droplets,
  Brain,
  Leaf,
}

export const habitIconOptions = Object.keys(habitIcons) as Habit['icon'][]

