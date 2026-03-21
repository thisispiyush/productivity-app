import * as React from 'react'
import { Flame, Plus, Sparkles } from 'lucide-react'

import { HabitCard } from '@/components/HabitCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProductivityStore } from '@/hooks/useProductivityStore'
import { useStreak } from '@/hooks/useStreak'
import { habitIconOptions, habitIcons } from '@/utils/habitIcons'
import type { Habit } from '@/utils/types'

export function HabitTrackerPage() {
  const { habits, toggleHabitCompletion, addHabit, updateHabit, deleteHabit } = useProductivityStore()
  const { streak, milestone, bumped } = useStreak()
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Habit | null>(null)

  const [name, setName] = React.useState('')
  const [icon, setIcon] = React.useState<Habit['icon']>('Flame')

  const startCreate = () => {
    setEditing(null)
    setName('')
    setIcon('Flame')
    setOpen(true)
  }

  const startEdit = (habit: Habit) => {
    setEditing(habit)
    setName(habit.name)
    setIcon(habit.icon)
    setOpen(true)
  }

  const submit = () => {
    if (editing) {
      updateHabit(editing.id, { name, icon })
    } else {
      addHabit({ name, icon })
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6 pt-6 md:pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Card className="hidden sm:block">
            <CardContent className="flex items-center gap-2 p-4 text-sm text-muted">
              <Sparkles className="h-4 w-4 text-accentBlue" />
              Consistency &gt; intensity
            </CardContent>
          </Card>
          <Button variant="blue" ripple onClick={startCreate}>
            <Plus className="h-4 w-4" />
            New habit
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-medium">
            Current streak{' '}
            <span className="text-muted">
              (at least one habit/day)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={[
                'rounded-full border border-border bg-surface px-3 py-1 text-sm font-semibold tabular-nums transition-transform',
                bumped ? 'scale-[1.03]' : '',
              ].join(' ')}
            >
              {streak} 🔥
            </div>
            {milestone ? (
              <div className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
                Milestone: <span className="font-medium text-foreground">{milestone}d</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {habits.length === 0 ? (
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center md:p-10">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-surface text-muted">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="text-base font-semibold">No habits yet</div>
              <div className="mt-1 text-sm text-muted">Consistency beats perfection.</div>
            </div>
            <Button variant="blue" ripple onClick={startCreate} className="min-h-[44px] rounded-2xl">
              <Plus className="h-4 w-4" />
              Create your first habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {habits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              onToggleDate={(dateISO, status) => toggleHabitCompletion(h.id, status, dateISO)}
              onToggleToday={(status) => toggleHabitCompletion(h.id, status)}
              onEdit={() => startEdit(h)}
              onDelete={() => deleteHabit(h.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit habit' : 'Create a habit'}</DialogTitle>
            <DialogDescription>Simple habits are easier to keep.</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="habit-name">Name</Label>
              <Input
                id="habit-name"
                value={name}
                placeholder="e.g. Morning walk"
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-6 gap-2">
                {habitIconOptions.map((k) => {
                  const Icon = habitIcons[k]
                  const active = icon === k
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setIcon(k)}
                      className={[
                        'grid h-11 place-items-center rounded-2xl border border-border bg-surface transition-colors hover:bg-[var(--surface-hover)]',
                        active ? 'border-accentBlue/30 bg-[var(--surface-hover)]' : '',
                      ].join(' ')}
                      aria-label={`Icon ${k}`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="blue" ripple onClick={submit} disabled={!name.trim()}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
