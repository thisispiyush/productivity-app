import * as React from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { useInterval } from '@/hooks/useInterval'
import { usePreferences } from '@/hooks/usePreferences'
import { cn } from '@/utils/cn'

type Mode = 'focus' | 'break'

const DEFAULT_FOCUS_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${pad(m)}:${pad(ss)}`
}

export function FocusTimer() {
  const { focusDuration } = usePreferences()
  const [mode, setMode] = React.useState<Mode>('focus')
  const [running, setRunning] = React.useState(false)
  const focusSeconds = focusDuration * 60
  const [remaining, setRemaining] = React.useState(DEFAULT_FOCUS_SECONDS)

  React.useEffect(() => {
    // If user changes focus duration, reset the focus timer (break stays 5 min).
    setRunning(false)
    setMode('focus')
    setRemaining(focusSeconds)
  }, [focusSeconds])

  const total = mode === 'focus' ? focusSeconds : BREAK_SECONDS
  const progress = 1 - remaining / total

  useInterval(
    () => {
      setRemaining((r) => {
        if (r <= 1) {
          const nextMode: Mode = mode === 'focus' ? 'break' : 'focus'
          setMode(nextMode)
          return nextMode === 'focus' ? focusSeconds : BREAK_SECONDS
        }
        return r - 1
      })
    },
    running ? 1000 : null,
  )

  React.useEffect(() => {
    document.title = running ? `(${formatTime(remaining)}) Pulse` : 'Pulse — Productivity OS'
  }, [running, remaining])

  const reset = () => {
    setRunning(false)
    setMode('focus')
    setRemaining(focusSeconds)
  }

  return (
    <Card className="stat-card hover:translate-y-0 hover:shadow-none">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-[color:var(--text-secondary)]">Focus Mode</div>
        <div className="text-xs font-medium text-[color:var(--text-muted)]">
            {mode === 'focus' ? `${focusDuration} min focus` : '5 min break'}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative grid h-20 w-28 place-items-center rounded-[12px] border border-border bg-[color:var(--bg-input)]">
            <motion.div
              className={cn(
                'font-mono text-[40px] font-semibold tabular-nums leading-none tracking-[-0.02em] text-[color:var(--text-primary)]',
                mode === 'break' && 'text-accentGreen',
              )}
              animate={running ? { opacity: [1, 0.9, 1] } : { opacity: 1 }}
              transition={{ duration: 1.6, repeat: running ? Infinity : 0, ease: 'easeInOut' }}
            >
              {formatTime(remaining)}
            </motion.div>
            <div className="pointer-events-none absolute inset-x-3 bottom-3 h-1.5 rounded-full bg-[color:var(--border)]">
              <motion.div
                className={cn('h-full rounded-full', mode === 'focus' ? 'bg-accentBlue' : 'bg-accentGreen')}
                initial={false}
                animate={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div>
            <div className="text-[13px] font-medium text-[color:var(--text-secondary)]">
              {mode === 'focus' ? 'Deep work' : 'Recovery'}
            </div>
            <div className="mt-1 text-xs text-[color:var(--text-muted)]">
              {mode === 'focus'
                ? 'No multitasking. One task. One timer.'
                : 'Stand up, breathe, and come back sharp.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="btn-primary inline-flex items-center gap-2" onClick={() => setRunning((r) => !r)}>
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? 'Pause' : 'Start'}
          </button>
          <button type="button" className="btn-secondary inline-flex items-center gap-2" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </Card>
  )
}

