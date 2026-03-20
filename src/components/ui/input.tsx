import * as React from 'react'

import { cn } from '@/utils/cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-[10px] border border-border bg-[color:var(--bg-input)] px-3.5 py-2 text-sm text-foreground placeholder:text-[color:var(--text-muted)] shadow-sm outline-none transition-all focus-visible:border-accentBlue focus-visible:bg-card focus-visible:ring-[3px] focus-visible:ring-[color:var(--accent-subtle)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }

