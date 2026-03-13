import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surface text-foreground',
        blue: 'bg-accentBlue/15 text-accentBlue border-accentBlue/25',
        purple: 'bg-accentPurple/15 text-accentPurple border-accentPurple/25',
        green: 'bg-accentGreen/15 text-accentGreen border-accentGreen/25',
        high: 'bg-accentPurple/15 text-accentPurple border-accentPurple/25',
        medium: 'bg-accentBlue/15 text-accentBlue border-accentBlue/25',
        low: 'bg-surface text-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }

