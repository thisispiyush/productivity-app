import { AlertCircle, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useStartupErrors } from '@/hooks/useStartupErrors'

export function StartupErrorBanner() {
  const { errors, dismissError } = useStartupErrors()
  if (!errors.length) return null

  const err = errors[0]

  return (
    <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-100">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4" />
        <div className="flex-1 space-y-1">
          <div className="font-medium">Something went wrong during startup.</div>
          <div>{err.message}</div>
          {err.hint ? <div className="text-[11px] opacity-80">{err.hint}</div> : null}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full text-red-100 hover:bg-red-500/20"
          onClick={() => dismissError(err.id)}
          aria-label="Dismiss startup error"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

