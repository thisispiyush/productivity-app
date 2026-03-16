import { motion } from 'framer-motion'
import { Calendar, GripVertical, Pencil, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import type { Task } from '@/utils/types'

function formatDue(dueISO?: string) {
  if (!dueISO) return null
  const [y, m, d] = dueISO.split('-').map((x) => Number(x))
  if (!y || !m || !d) return dueISO
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function priorityVariant(p: Task['priority']) {
  if (p === 'High') return 'high'
  if (p === 'Medium') return 'medium'
  return 'low'
}

export function TaskCard({
  task,
  draggable,
  dragHandleProps,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task
  draggable?: boolean
  dragHandleProps?: Record<string, unknown>
  onToggle: (status: boolean) => void
  onEdit?: () => void
  onDelete: () => void
}) {
  const due = formatDue(task.dueDateISO)

  return (
    <Card className={cn('px-4 py-3', task.completed && 'opacity-85')}>
      <div className="flex items-center gap-3">
        {draggable ? (
          <button
            type="button"
            aria-label="Drag task"
            className="grid h-10 w-7 place-items-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
            {...dragHandleProps}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : null}

        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggle(e.target.checked)}
          className="h-5 w-5 rounded border-border bg-surface text-blue-500 focus:ring-blue-500 focus:ring-offset-background"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <motion.div
              className="min-w-0 truncate text-sm font-medium"
              animate={{ opacity: task.completed ? 0.72 : 1 }}
              transition={{ duration: 0.18 }}
            >
              <span className={cn(task.completed && 'line-through decoration-black/20 dark:decoration-white/20')}>{task.title}</span>
            </motion.div>
            <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted">
            {due ? (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {due}
              </span>
            ) : (
              <span>Someday</span>
            )}
          </div>
        </div>

        {onEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted hover:text-foreground"
            onClick={onEdit}
            aria-label="Edit task"
          >
            <Pencil />
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted hover:text-foreground"
          onClick={onDelete}
          aria-label="Delete task"
        >
          <Trash2 />
        </Button>
      </div>
    </Card>
  )
}

