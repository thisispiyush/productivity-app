import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, LogOut, Moon, Shield, Sun, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/useAuth'
import { usePreferences } from '@/hooks/usePreferences'
import { useProductivityStore } from '@/hooks/useProductivityStore'
import { useTheme } from '@/hooks/useTheme'
import type { Priority } from '@/utils/types'
import { supabase } from '@/lib/supabaseClient'

function SectionLabel({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mb-3 mt-6 scroll-mt-20 text-xs font-semibold uppercase tracking-wider text-muted">
      {children}
    </p>
  )
}

function Row({
  title,
  description,
  right,
  last,
}: {
  title: string
  description?: string
  right: React.ReactNode
  last?: boolean
}) {
  return (
    <div className={['flex items-center justify-between gap-4 py-4', last ? '' : 'border-b border-border/60'].join(' ')}>
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  )
}

function Select({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
  ariaLabel: string
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:border-accentBlue/35 focus-visible:ring-2 focus-visible:ring-accentBlue/25"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { clearAllData, habits, tasks } = useProductivityStore()
  const { theme, setTheme } = useTheme()
  const { defaultTaskPriority, setDefaultTaskPriority, showCompletedTasks, setShowCompletedTasks, focusDuration, setFocusDuration } =
    usePreferences()

  const [signingOut, setSigningOut] = React.useState(false)
  const [clearing, setClearing] = React.useState(false)
  const [openClear, setOpenClear] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)

  const logout = async () => {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/login', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

  const signOutAllDevices = async () => {
    setSigningOut(true)
    try {
      await supabase.auth.signOut({ scope: 'global' })
      navigate('/login', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

  const exportData = () => {
    const payload = {
      habits,
      tasks,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pulse-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const doClearAll = async () => {
    setClearing(true)
    try {
      await clearAllData()
      // Only clear Pulse UI prefs (do not clear Supabase session storage).
      const keys = [
        'pulse.pref.defaultTaskPriority',
        'pulse.pref.showCompletedTasks',
        'pulse.pref.focusDuration',
        'pulse-display-name',
        'pulse-profile.name',
        'pulse-profile.avatar',
      ]
      for (const k of keys) localStorage.removeItem(k)
      setOpenClear(false)
    } finally {
      setClearing(false)
    }
  }

  const doDeleteAccount = async () => {
    // Client-side apps cannot truly delete Supabase users without a server-side function/service key.
    // We perform a "data wipe + global sign-out" to match user expectations without breaking auth.
    setClearing(true)
    try {
      await clearAllData()
      await supabase.auth.signOut({ scope: 'global' })
      setOpenDelete(false)
      navigate('/login', { replace: true })
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="space-y-6">

      <SectionLabel id="appearance">Appearance</SectionLabel>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Row
            title="Theme"
            description="Switch between light and dark mode."
            right={
              <div className="flex items-center gap-3">
                <Sun className="h-4 w-4 text-muted" />
                <Switch checked={theme === 'dark'} onCheckedChange={(next) => setTheme(next ? 'dark' : 'light')} />
                <Moon className="h-4 w-4 text-muted" />
              </div>
            }
          />
          <Row
            title="Current theme"
            description="Saved automatically to this device."
            right={<div className="text-sm font-medium">{theme === 'dark' ? 'Dark' : 'Light'}</div>}
            last
          />
        </CardContent>
      </Card>

      <SectionLabel id="preferences">Preferences</SectionLabel>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Row
            title="Default task priority"
            description="Used when creating a new task."
            right={
              <Select
                ariaLabel="Default task priority"
                value={defaultTaskPriority}
                onChange={(v) => setDefaultTaskPriority(v as Priority)}
                options={[
                  { label: 'Low', value: 'Low' },
                  { label: 'Medium', value: 'Medium' },
                  { label: 'High', value: 'High' },
                ]}
              />
            }
          />
          <Row
            title="Show completed tasks"
            description="Hide completed items to keep the list calm."
            right={<Switch checked={showCompletedTasks} onCheckedChange={setShowCompletedTasks} />}
          />
          <Row
            title="Focus timer duration"
            description="Sets your default focus session length."
            right={
              <Select
                ariaLabel="Focus timer duration"
                value={String(focusDuration)}
                onChange={(v) => setFocusDuration(Number(v) as 25 | 45 | 60)}
                options={[
                  { label: '25 min', value: '25' },
                  { label: '45 min', value: '45' },
                  { label: '60 min', value: '60' },
                ]}
              />
            }
            last
          />
        </CardContent>
      </Card>

      <SectionLabel id="data">Data & Privacy</SectionLabel>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Data & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Row
            title="Export my data"
            description="Download your habits and tasks as JSON."
            right={
              <Button variant="secondary" onClick={exportData} className="rounded-2xl">
                <Download className="h-4 w-4" />
                Export
              </Button>
            }
          />
          <Row
            title="Clear all data"
            description="Deletes your habits and tasks from your account."
            right={
              <Button
                variant="secondary"
                onClick={() => setOpenClear(true)}
                className="rounded-2xl border border-red-500/30 text-red-600 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            }
            last
          />
        </CardContent>
      </Card>

      <SectionLabel id="account">Account Control</SectionLabel>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Account Control</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Row
            title="Sign out (this device)"
            description="Ends your session on this browser."
            right={
              <Button
                variant="secondary"
                onClick={logout}
                disabled={signingOut}
                className="rounded-2xl border border-red-500/30 text-red-600 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                {signingOut ? 'Signing out...' : 'Sign out'}
              </Button>
            }
          />
          <Row
            title="Sign out of all devices"
            description="Logs you out everywhere (global)."
            right={
              <Button variant="secondary" onClick={signOutAllDevices} disabled={signingOut} className="rounded-2xl">
                <Shield className="h-4 w-4" />
                {signingOut ? 'Signing out...' : 'Sign out all'}
              </Button>
            }
          />
          <Row
            title="Delete account"
            description="Wipes your data and signs you out. Account deletion requires a server-side function."
            right={
              <Button
                variant="secondary"
                onClick={() => setOpenDelete(true)}
                className="rounded-2xl border border-red-500/30 text-red-600 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            }
            last
          />
        </CardContent>
      </Card>

      <Dialog open={openClear} onOpenChange={setOpenClear}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all data?</DialogTitle>
            <DialogDescription>This deletes all habits and tasks for {user?.email ?? 'your account'}.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="secondary" onClick={() => setOpenClear(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={doClearAll}
              disabled={clearing}
              className="border border-red-500/30 text-red-600 hover:bg-red-500/10"
            >
              {clearing ? 'Clearing...' : 'Clear all'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>This cannot be undone. Your data will be deleted and you will be signed out.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="secondary" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={doDeleteAccount}
              disabled={clearing}
              className="border border-red-500/30 text-red-600 hover:bg-red-500/10"
            >
              {clearing ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
