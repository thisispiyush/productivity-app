import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Profile</div>
        <div className="mt-2 text-sm text-muted">Your account details.</div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted">Email</div>
            <div className="text-sm font-medium">{user?.email ?? 'Unknown'}</div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted">User ID</div>
            <div className="text-sm font-medium">{user?.id ?? 'Unknown'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
