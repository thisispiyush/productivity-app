import * as React from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { useInterval } from '@/hooks/useInterval'
import { usePreferences } from '@/hooks/usePreferences'

type Mode = 'focus' | 'break' | 'longBreak'

const DEFAULT_FOCUS_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60
const LONG_BREAK_SECONDS = 15 * 60

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${pad(m)}:${pad(ss)}`
}

function playSound() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.frequency.value = 440
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 1.5)
    window.setTimeout(() => ctx.close().catch(() => {}), 1700)
  } catch {
    // ignore audio errors (autoplay policies, unsupported devices, etc.)
  }
}

export function FocusTimer() {
  const { focusDuration } = usePreferences()
  const [mode, setMode] = React.useState<Mode>('focus')
  const [running, setRunning] = React.useState(false)
  const [session, setSession] = React.useState(1)
  const [banner, setBanner] = React.useState<null | 'break' | 'longBreak'>(null)

  const focusSeconds = focusDuration * 60
  const [remaining, setRemaining] = React.useState(DEFAULT_FOCUS_SECONDS)

  React.useEffect(() => {
    setRunning(false)
    setMode('focus')
    setSession(1)
    setBanner(null)
    setRemaining(focusSeconds)
  }, [focusSeconds])

  const total = mode === 'focus' ? focusSeconds : mode === 'break' ? BREAK_SECONDS : LONG_BREAK_SECONDS
  const circumference = 2 * Math.PI * 56
  const ringProgress = Math.max(0, Math.min(1, remaining / Math.max(1, total))) * circumference

  useInterval(
    () => {
      setRemaining((r) => (r <= 0 ? 0 : r - 1))
    },
    running ? 1000 : null,
  )

  React.useEffect(() => {
    document.title = running ? `(${formatTime(remaining)}) Pulse` : 'Pulse — Productivity OS'
  }, [running, remaining])

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName ?? ''
      const isTypingTarget =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (target && (target as unknown as { isContentEditable?: boolean }).isContentEditable)
      if (isTypingTarget) return
      e.preventDefault()
      setRunning((r) => !r)
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  React.useEffect(() => {
    if (!running) return
    if (remaining !== 0) return

    setRunning(false)

    if (mode === 'focus') {
      playSound()

      if (session >= 4) {
        setBanner('longBreak')
        setMode('longBreak')
        setRemaining(LONG_BREAK_SECONDS)
        return
      }

      setSession((s) => Math.min(4, s + 1))
      setBanner('break')
      return
    }

    setMode('focus')
    setBanner(null)
    setRemaining(focusSeconds)
  }, [running, remaining, mode, session, focusSeconds])

  const reset = () => {
    setRunning(false)
    setMode('focus')
    setSession(1)
    setBanner(null)
    setRemaining(focusSeconds)
  }

  return (
    <Card className="stat-card overflow-hidden hover:translate-y-0 hover:shadow-none p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-[color:var(--text-secondary)]">Focus Mode</div>
        <div className="text-xs font-medium text-[color:var(--text-muted)]">
          {mode === 'focus'
            ? `Session ${session} of 4 • ${focusDuration} min focus`
            : mode === 'break'
              ? '5 min break'
              : 'Great work! Take a long break'}
        </div>
      </div>

      {banner ? (
        <div className="mt-4 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="text-sm font-medium text-foreground">
            {banner === 'break' ? 'Session complete! Take a 5 min break 🎉' : 'Great work! Take a long break'}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn-primary inline-flex items-center gap-2"
              onClick={() => {
                const nextMode = banner === 'break' ? 'break' : 'longBreak'
                setBanner(null)
                setMode(nextMode)
                setRemaining(nextMode === 'break' ? BREAK_SECONDS : LONG_BREAK_SECONDS)
                setRunning(true)
              }}
            >
              <Play className="h-4 w-4" />
              Start Break
            </button>
            <button
              type="button"
              className="btn-secondary inline-flex items-center gap-2"
              onClick={() => {
                setBanner(null)
                setMode('focus')
                setRemaining(focusSeconds)
              }}
            >
              Skip
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col items-center justify-center gap-6 pb-2">
        <div className="relative h-[120px] w-[120px] shrink-0">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <circle cx="60" cy="60" r="56" fill="none" stroke="var(--bg-subtle)" strokeWidth="4" />
            <circle
              cx="60"
              cy="60"
              r="56"
              fill="none"
              stroke={mode === 'focus' ? '#4F6EF7' : 'var(--accent-green)'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - ringProgress}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div 
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[36px] font-semibold leading-none tracking-tight tabular-nums"
            style={{ color: 'var(--timer-num, var(--text-primary))' }}
          >
            {formatTime(remaining)}
          </div>
        </div>

        <div className="text-center">
          <div className="text-[14px] font-semibold" style={{ color: 'var(--timer-text, var(--text-primary))' }}>
            {mode === 'focus' ? 'Deep work' : 'Recovery'}
          </div>
          <div className="mt-1 text-[12px]" style={{ color: 'var(--timer-sub, var(--text-muted))' }}>
            {mode === 'focus'
              ? 'No multitasking. One task.'
              : 'Stand up, breathe, and come back sharp.'}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#4F6EF7] px-4 text-sm font-medium text-white transition-colors hover:bg-[#3b5bdb]"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? 'Pause' : 'Start'}
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-[color:var(--surface-hover)]"
            onClick={reset}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </Card>
  )
}
