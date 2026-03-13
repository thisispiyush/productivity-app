import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/utils/cn'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer h-5 w-5 shrink-0 rounded-md border border-border bg-surface shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accentBlue/60 data-[state=checked]:border-accentBlue/40 data-[state=checked]:bg-accentBlue',
        className,
      )}
      {...props}
    >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white transition-all duration-200 data-[state=checked]:scale-100 data-[state=checked]:opacity-100 scale-75 opacity-0">
      <Check className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

