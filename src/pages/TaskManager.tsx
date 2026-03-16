import * as React from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus } from 'lucide-react'

import { TaskCard } from '@/components/TaskCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProductivityStore } from '@/hooks/useProductivityStore'
import type { Priority, Task } from '@/utils/types'
import { cn } from '@/utils/cn'

function SortableTaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task
  onToggle: (status: boolean) => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && 'opacity-70')}>
      <TaskCard
        task={task}
        draggable
        dragHandleProps={{ ...attributes, ...listeners }}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}

export function TaskManagerPage() {
  const { tasks, toggleTask, reorderTasks, addTask, updateTask, deleteTask } = useProductivityStore()
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Task | null>(null)

  const [title, setTitle] = React.useState('')
  const [priority, setPriority] = React.useState<Priority>('Medium')
  const [dueDateISO, setDueDateISO] = React.useState<string>('')

  const pending = React.useMemo(
    () => tasks.filter((t) => !t.completed).sort((a, b) => a.order - b.order),
    [tasks],
  )
  const done = React.useMemo(() => tasks.filter((t) => t.completed), [tasks])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const onDragEnd = (e: DragEndEvent) => {
    const activeId = String(e.active.id)
    const overId = e.over?.id ? String(e.over.id) : null
    if (!overId) return
    reorderTasks(activeId, overId)
  }

  const startCreate = () => {
    setEditing(null)
    setTitle('')
    setPriority('Medium')
    setDueDateISO('')
    setOpen(true)
  }

  const startEdit = (task: Task) => {
    setEditing(task)
    setTitle(task.title)
    setPriority(task.priority)
    setDueDateISO(task.dueDateISO ?? '')
    setOpen(true)
  }

  const submit = () => {
    if (editing) {
      updateTask(editing.id, {
        title,
        priority,
        dueDateISO: dueDateISO || undefined,
      })
    } else {
      addTask({
        title,
        priority,
        dueDateISO: dueDateISO || undefined,
      })
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight md:text-3xl">Task Manager</div>
        <div className="mt-2 text-sm text-muted">Drag to reorder. Keep the list small and sharp.</div>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold tracking-tight">
                {tasks.length === 0 ? 'Add your first task' : 'Add New Task'}
              </div>
              <div className="mt-1 text-sm text-muted">
                {tasks.length === 0 ? 'Start small. Capture one clear next step.' : 'Add one task. Finish it. Repeat.'}
              </div>
            </div>
            <Button variant="blue" ripple onClick={startCreate} className="rounded-2xl min-h-[44px]">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] md:p-6">
          <div className="rounded-2xl border border-border bg-surface p-4 md:p-6">
            <div className="text-sm font-medium">No tasks yet.</div>
            <div className="mt-1 text-sm text-muted">Start small and add your first task.</div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] md:p-6">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted">In Progress</div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={pending.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {pending.map((t) => (
                    <SortableTaskRow
                      key={t.id}
                      task={t}
                      onToggle={(status) => toggleTask(t.id, status)}
                      onEdit={() => startEdit(t)}
                      onDelete={() => deleteTask(t.id)}
                    />
                  ))}
                  {pending.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
                      No tasks in progress. Drag from “Done” or add a new one.
                    </div>
                  ) : null}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-medium text-muted">Done</div>
            <div className="space-y-3">
              {done.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggle={(status) => toggleTask(t.id, status)}
                  onEdit={() => startEdit(t)}
                  onDelete={() => deleteTask(t.id)}
                />
              ))}
              {done.length === 0 ? (
                <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
                  Nothing completed yet — your future self will love this section.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit task' : 'Create a task'}</DialogTitle>
            <DialogDescription>Small, specific tasks are easier to finish.</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={title}
                placeholder="e.g. Write project outline"
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        'h-10 flex-1 rounded-xl border border-border bg-surface px-3 text-sm font-medium transition-colors hover:bg-[var(--surface-hover)]',
                        priority === p && 'border-accentBlue/30 bg-[var(--surface-hover)]',
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-due">Due date</Label>
                <Input id="task-due" type="date" value={dueDateISO} onChange={(e) => setDueDateISO(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="blue" ripple onClick={submit} disabled={!title.trim()}>
              {editing ? 'Save' : 'Add task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

