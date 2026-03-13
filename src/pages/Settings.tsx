import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'

export function SettingsPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { theme, setTheme, toggle } = useTheme()
  const [signingOut, setSigningOut] = React.useState(false)

  const logout = async () => {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/login', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Settings</div>
        <div className="mt-2 text-sm text-muted">Account and preferences.</div>
      </div>

      <div className="space-y-6">
        <div className="text-xs font-medium text-muted">Account Settings</div>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-muted">Email</div>
              <div className="text-sm font-medium">{user?.email ?? 'Unknown'}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Theme Preferences</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted">
              Current theme: <span className="font-medium text-foreground">{theme}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setTheme('light')} className="rounded-2xl">
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button variant="secondary" onClick={() => setTheme('dark')} className="rounded-2xl">
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button variant="secondary" onClick={toggle} className="rounded-2xl">
                Toggle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="text-xs font-medium text-muted">Danger Zone</div>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Logout</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted">Sign out of your account on this device.</div>
            <Button
              variant="secondary"
              onClick={logout}
              disabled={signingOut}
              className="rounded-2xl border border-red-500/30 text-red-600 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? 'Logging outâ€¦' : 'Logout'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

