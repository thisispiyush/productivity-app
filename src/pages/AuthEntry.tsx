import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthEntryPage() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">Welcome Back</CardTitle>
        <CardDescription>Choose how you want to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild variant="blue" ripple className="w-full rounded-xl">
          <Link to="/login">Sign In</Link>
        </Button>
        <Button asChild variant="secondary" ripple className="w-full rounded-xl">
          <Link to="/signup">Create Account</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
