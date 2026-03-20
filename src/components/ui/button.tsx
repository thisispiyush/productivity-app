import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-accentBlue/60 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-white text-black hover:bg-white/90 active:bg-white/85 shadow-sm',
        secondary:
          'bg-surface text-foreground border border-border hover:bg-[var(--surface-hover)]',
        ghost: 'text-foreground hover:bg-[var(--surface-hover)]',
        blue: 'bg-accentBlue text-white hover:bg-[color:var(--accent-hover)] hover:-translate-y-[1px]',
        purple: 'bg-accentPurple text-white hover:bg-accentPurple/90',
        green: 'bg-accentGreen text-black hover:bg-accentGreen/90',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-5',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ripple?: boolean
}

function createRipple(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.style.position = 'absolute'
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.borderRadius = '9999px'
  ripple.style.background = 'rgba(255,255,255,0.22)'
  ripple.style.transform = 'scale(0)'
  ripple.style.opacity = '1'
  ripple.style.pointerEvents = 'none'
  ripple.style.transition = 'transform 420ms ease, opacity 700ms ease'

  el.style.overflow = 'hidden'
  el.appendChild(ripple)

  requestAnimationFrame(() => {
    ripple.style.transform = 'scale(1)'
    ripple.style.opacity = '0'
  })

  setTimeout(() => ripple.remove(), 800)
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ripple, onPointerDown, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        onPointerDown={(e) => {
          onPointerDown?.(e)
          if (ripple) createRipple(e as unknown as React.PointerEvent<HTMLElement>)
        }}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }

