import * as React from 'react'

import { cn } from '@/utils/cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted shadow-sm outline-none transition-colors focus-visible:border-accentBlue/35 focus-visible:ring-2 focus-visible:ring-accentBlue/25 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }

