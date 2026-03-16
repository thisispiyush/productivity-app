import * as React from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Focus Mode</span>
          <span className="text-xs font-medium text-muted">
            {mode === 'focus' ? `${focusDuration} min focus` : '5 min break'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative grid h-20 w-20 place-items-center rounded-2xl border border-border bg-surface">
              <motion.div
                className={cn(
                  'text-xl font-semibold tabular-nums tracking-tight',
                  mode === 'break' && 'text-accentGreen',
                )}
                animate={running ? { opacity: [1, 0.85, 1] } : { opacity: 1 }}
                transition={{ duration: 1.6, repeat: running ? Infinity : 0, ease: 'easeInOut' }}
              >
                {formatTime(remaining)}
              </motion.div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl">
                <motion.div
                  className="absolute inset-x-2 bottom-2 h-1.5 rounded-full bg-[var(--timer-track)]"
                  initial={false}
                >
                  <motion.div
                    className={cn('h-full rounded-full', mode === 'focus' ? 'bg-accentBlue' : 'bg-accentGreen')}
                    initial={false}
                    animate={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </motion.div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium">
                {mode === 'focus' ? 'Deep work' : 'Recovery'}
              </div>
              <div className="mt-1 text-xs text-muted">
                {mode === 'focus'
                  ? 'No multitasking. One task. One timer.'
                  : 'Stand up, breathe, and come back sharp.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={running ? 'secondary' : 'blue'}
              ripple
              onClick={() => setRunning((r) => !r)}
              className="rounded-2xl"
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? 'Pause' : 'Start'}
            </Button>
            <Button variant="secondary" onClick={reset} className="rounded-2xl">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

