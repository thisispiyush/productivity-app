import * as React from 'react'
import { Pencil, Upload } from 'lucide-react'

import { Avatar } from '@/components/Avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useLocalStorageState } from '@/hooks/useLocalStorage'
import { useUser } from '@/hooks/useUser'
import { useProductivityStore } from '@/hooks/useProductivityStore'
import { useStreak } from '@/hooks/useStreak'
import { formatISODate, startOfDay } from '@/utils/dates'

function monthYear(iso?: string) {
  if (!iso) return 'Unknown'
  const dt = new Date(iso)
  if (Number.isNaN(dt.getTime())) return 'Unknown'
  return dt.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export function ProfilePage() {
  const { user } = useAuth()
  const { habits, tasks } = useProductivityStore()
  const { streak } = useStreak()
  const { displayName, updateName } = useUser()

  const defaultName = React.useMemo(() => {
    const email = user?.email ?? ''
    const base = email.includes('@') ? email.split('@')[0] : email
    return base ? base.replace(/[._-]+/g, ' ') : 'Pulse User'
  }, [user?.email])

  const [avatarDataUrl, setAvatarDataUrl] = useLocalStorageState<string | null>('pulse-profile.avatar', null)
  const [editing, setEditing] = React.useState(false)
  const [draftName, setDraftName] = React.useState(displayName || defaultName)

  React.useEffect(() => {
    if (!editing) setDraftName(displayName || defaultName)
  }, [displayName, defaultName, editing])

  const uploadRef = React.useRef<HTMLInputElement | null>(null)

  const onPickAvatar = () => uploadRef.current?.click()

  const onAvatarFile = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null
      if (result) setAvatarDataUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const saveName = () => {
    const next = draftName.trim()
    void updateName(next || defaultName)
    setEditing(false)
  }

  const tasksCompleted = tasks.filter((t) => t.completed).length
  const daysActive = React.useMemo(() => {
    const set = new Set<string>()
    for (const h of habits) {
      for (const [iso, done] of Object.entries(h.completions)) {
        if (done) set.add(iso)
      }
    }
    for (const t of tasks) {
      if (!t.completedAtISO) continue
      set.add(formatISODate(startOfDay(new Date(t.completedAtISO))))
    }
    return set.size
  }, [habits, tasks])

  const joined = monthYear((user as unknown as { created_at?: string } | null)?.created_at)

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight md:text-3xl">Profile</div>
        <div className="mt-2 text-sm text-muted">Your account details.</div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onPickAvatar}
              className="group relative grid h-14 w-14 place-items-center overflow-hidden rounded-xl border border-border bg-surface text-sm font-semibold text-foreground transition-colors hover:bg-[var(--surface-hover)]"
              aria-label="Upload profile photo"
            >
              <Avatar name={displayName || defaultName} photoUrl={avatarDataUrl} size={56} className="rounded-xl" />
              <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/35 group-hover:opacity-100">
                <Upload className="h-4 w-4" />
              </span>
            </button>

            <div className="min-w-0">
              <div className="truncate text-base font-semibold">{displayName || defaultName}</div>
              <div className="mt-0.5 truncate text-sm text-muted">{user?.email ?? 'Unknown email'}</div>
              <div className="mt-0.5 text-xs text-muted">Joined {joined}</div>
            </div>
          </div>

          <input
            ref={uploadRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onAvatarFile(e.target.files?.[0] ?? null)}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium">Display name</div>
                <div className="mt-0.5 text-xs text-muted">Shown across Pulse.</div>
              </div>
              <div className="min-w-[180px]">
                {editing ? (
                  <input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveName()
                      if (e.key === 'Escape') setEditing(false)
                    }}
                    onBlur={saveName}
                    autoFocus
                    className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none transition-colors focus-visible:border-accentBlue/35 focus-visible:ring-2 focus-visible:ring-accentBlue/25"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 text-sm text-foreground transition-colors hover:bg-[var(--surface-hover)]"
                    aria-label="Edit display name"
                  >
                    <span className="truncate">{displayName || defaultName}</span>
                    <Pencil className="h-4 w-4 text-muted" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="mt-0.5 text-xs text-muted">Used for login.</div>
              </div>
              <div className="truncate text-sm font-medium">{user?.email ?? 'Unknown'}</div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium">Member since</div>
                <div className="mt-0.5 text-xs text-muted">Account creation month.</div>
              </div>
              <div className="text-sm font-medium">{joined}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Stats Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="text-xs text-muted">Habits</div>
                <div className="mt-1 text-xl font-semibold tabular-nums">{habits.length}</div>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="text-xs text-muted">Tasks done</div>
                <div className="mt-1 text-xl font-semibold tabular-nums">{tasksCompleted}</div>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="text-xs text-muted">Current streak</div>
                <div className="mt-1 text-xl font-semibold tabular-nums">{streak} days</div>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="text-xs text-muted">Days active</div>
                <div className="mt-1 text-xl font-semibold tabular-nums">{daysActive}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
