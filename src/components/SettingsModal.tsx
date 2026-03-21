import * as React from 'react'
import { Camera, Download, Moon, Pencil, Sun, Trash2 } from 'lucide-react'

import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/useAuth'
import { useLocalStorageState } from '@/hooks/useLocalStorage'
import { usePreferences } from '@/hooks/usePreferences'
import { useProductivityStore } from '@/hooks/useProductivityStore'
import { useTheme } from '@/hooks/useTheme'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabaseClient'
import { cn } from '@/utils/cn'
import type { Priority } from '@/utils/types'

function monthYear(iso?: string) {
  if (!iso) return 'Unknown'
  const dt = new Date(iso)
  if (Number.isNaN(dt.getTime())) return 'Unknown'
  return dt.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2">{children}</p>
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
    <div className={cn('flex items-center justify-between gap-4 py-4', !last && 'border-b border-border/60')}>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-foreground">{title}</p>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
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
      className="h-9 rounded-lg border border-border bg-surface px-3 text-xs text-foreground shadow-sm outline-none transition-colors focus-visible:border-accentBlue/35 focus-visible:ring-2 focus-visible:ring-accentBlue/25"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

type TabId = 'profile' | 'appearance' | 'preferences' | 'data'

export function SettingsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = React.useState<TabId>('profile')

  const { user, signOut } = useAuth()
  const { displayName, updateName } = useUser()
  const { clearAllData, habits, tasks } = useProductivityStore()
  const { theme, setTheme } = useTheme()
  const { defaultTaskPriority, setDefaultTaskPriority, showCompletedTasks, setShowCompletedTasks, focusDuration, setFocusDuration } = usePreferences()

  const defaultName = React.useMemo(() => {
    const email = user?.email ?? ''
    const base = email.includes('@') ? email.split('@')[0] : email
    return base ? base.replace(/[._-]+/g, ' ') : 'Pulse User'
  }, [user?.email])

  const [avatarDataUrl, setAvatarDataUrl] = useLocalStorageState<string | null>('pulse-profile.avatar', null)
  const [editingName, setEditingName] = React.useState(false)
  const [draftName, setDraftName] = React.useState(displayName || defaultName)
  const [signingOut, setSigningOut] = React.useState(false)
  const [clearing, setClearing] = React.useState(false)
  
  const [avatarMenuOpen, setAvatarMenuOpen] = React.useState(false)
  const avatarMenuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false)
      }
    }
    if (avatarMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [avatarMenuOpen])

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
    setEditingName(false)
  }

  const doLogout = async () => {
    setSigningOut(true)
    try {
      await signOut()
      onOpenChange(false)
    } finally {
      setSigningOut(false)
    }
  }

  const doDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure you want to delete your account and all data? This cannot be undone.')) return
    setClearing(true)
    try {
      await clearAllData()
      await supabase.auth.signOut({ scope: 'global' })
      onOpenChange(false)
    } finally {
      setClearing(false)
    }
  }

  const doClearAll = async () => {
    if (!confirm('Are you sure you want to clear all your habits and tasks?')) return
    setClearing(true)
    try {
      await clearAllData()
      const keys = [
        'pulse.pref.defaultTaskPriority',
        'pulse.pref.showCompletedTasks',
        'pulse.pref.focusDuration',
        'pulse-display-name',
        'pulse-profile.name',
        'pulse-profile.avatar',
      ]
      for (const k of keys) localStorage.removeItem(k)
    } finally {
      setClearing(false)
    }
  }

  const exportData = () => {
    const payload = { habits, tasks, exportedAt: new Date().toISOString() }
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

  const joined = monthYear((user as unknown as { created_at?: string } | null)?.created_at)

  React.useEffect(() => {
    if (open) setActiveTab('profile')
  }, [open])

  const TabButton = ({ id, label, onClick }: { id: TabId; label: string; onClick?: () => void }) => {
    const isActive = activeTab === id
    return (
      <button
        onClick={() => {
          if (onClick) onClick()
          else setActiveTab(id)
        }}
        className={cn(
          "w-full flex items-center px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors text-left",
          isActive ? "bg-accentBlue/10 text-accentBlue" : "text-[color:var(--text-secondary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
        )}
      >
        {label}
      </button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] h-[85vh] max-h-[560px] p-0 gap-0 overflow-hidden flex flex-row rounded-xl border border-border shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-[12px]">
        {/* LEFT COLUMN - Sidebar */}
        <div className="w-[220px] shrink-0 border-r border-border/50 bg-[color:var(--bg-sidebar)] flex flex-col h-full overflow-y-auto py-3 px-2">
          
          <SectionLabel>Account</SectionLabel>
          <div className="space-y-0.5">
            <TabButton id="profile" label="Profile" />
            <TabButton id="appearance" label="Appearance" />
          </div>

          <SectionLabel>Preferences</SectionLabel>
          <div className="space-y-0.5">
            <TabButton id="preferences" label="Preferences" />
            <TabButton id="data" label="Data & Privacy" />
          </div>

          <SectionLabel>Account Control</SectionLabel>
          <div className="space-y-0.5 mt-1">
            <button
              onClick={doLogout}
              disabled={signingOut}
              className="w-full flex items-center px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors text-left text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
            >
              Sign out
            </button>
            <button
              onClick={doDeleteAccount}
              disabled={clearing}
              className="w-full flex items-center px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors text-left text-red-500 hover:bg-red-500/10"
            >
              Delete account
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - Content */}
        <div className="flex-1 bg-card h-full overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-8">
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-semibold mb-6">My Profile</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative" ref={avatarMenuRef}>
                    <button
                      type="button"
                      onClick={() => setAvatarMenuOpen((o) => !o)}
                      className="group relative grid h-16 w-16 place-items-center overflow-hidden rounded-full border border-border bg-surface text-sm font-semibold text-foreground transition-colors hover:bg-[var(--surface-hover)] cursor-pointer"
                      aria-label="Profile photo menu"
                    >
                      <Avatar name={displayName || defaultName} photoUrl={avatarDataUrl} size={64} />
                      <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/35 group-hover:opacity-100">
                        <Camera className="h-5 w-5" />
                      </span>
                    </button>

                    {avatarMenuOpen && (
                      <div className="absolute left-0 top-full z-50 mt-2 min-w-[160px] animate-in fade-in zoom-in-95 rounded-xl border border-border bg-card p-1.5 shadow-md">
                        {avatarDataUrl ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setAvatarMenuOpen(false)
                                onPickAvatar()
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Camera className="h-4 w-4" />
                              Change photo
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAvatarMenuOpen(false)
                                setAvatarDataUrl(null)
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-[rgba(239,68,68,0.06)] hover:text-[#ef4444]"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove photo
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setAvatarMenuOpen(false)
                              onPickAvatar()
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <Camera className="h-4 w-4" />
                            Upload photo
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <input
                    ref={uploadRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      onAvatarFile(e.target.files?.[0] ?? null)
                      if (e.target) e.target.value = ''
                    }}
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">Avatar</div>
                    <div className="text-xs text-muted-foreground">Click the image to change or remove your profile photo.</div>
                  </div>
                </div>

                <Row
                  title="Display Name"
                  description="Shown across Pulse."
                  right={
                    editingName ? (
                      <input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveName()
                          if (e.key === 'Escape') setEditingName(false)
                        }}
                        onBlur={saveName}
                        autoFocus
                        className="h-9 w-[200px] rounded-lg border border-border bg-surface px-3 text-xs outline-none transition-colors focus-visible:border-accentBlue/35 focus-visible:ring-2 focus-visible:ring-accentBlue/25"
                      />
                    ) : (
                      <button
                        onClick={() => setEditingName(true)}
                        className="inline-flex h-9 min-w-[120px] items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 text-xs text-foreground transition-colors hover:bg-[var(--surface-hover)]"
                      >
                        <span className="truncate">{displayName || defaultName}</span>
                        <Pencil className="h-3 w-3 text-muted-foreground" />
                      </button>
                    )
                  }
                />
                <Row
                  title="Email"
                  description="Used for login."
                  right={<div className="text-[13px] text-muted-foreground">{user?.email ?? 'Unknown'}</div>}
                />
                <Row
                  title="Member since"
                  description="Account creation month."
                  right={<div className="text-[13px] text-muted-foreground">{joined}</div>}
                  last
                />
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-semibold mb-6">Appearance</h2>
                <Row
                  title="Theme"
                  description="Switch between light and dark mode."
                  right={
                    <div className="flex items-center gap-3">
                      <Sun className="h-4 w-4 text-muted-foreground" />
                      <Switch checked={theme === 'dark'} onCheckedChange={(next) => setTheme(next ? 'dark' : 'light')} />
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  }
                />
                <Row
                  title="Current theme"
                  description="Saved automatically to this device."
                  right={<div className="text-[13px] font-medium">{theme === 'dark' ? 'Dark' : 'Light'}</div>}
                  last
                />
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-semibold mb-6">Preferences</h2>
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
              </div>
            )}

            {activeTab === 'data' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-semibold mb-6">Data & Privacy</h2>
                <Row
                  title="Export my data"
                  description="Download your habits and tasks as JSON."
                  right={
                    <Button variant="secondary" onClick={exportData} className="rounded-lg h-9 text-xs">
                      <Download className="h-3 w-3 mr-2" />
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
                      onClick={doClearAll}
                      disabled={clearing}
                      className="rounded-lg h-9 text-xs border border-red-500/30 text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      {clearing ? 'Clearing...' : 'Clear All'}
                    </Button>
                  }
                  last
                />
              </div>
            )}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
