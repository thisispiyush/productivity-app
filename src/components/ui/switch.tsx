import { cn } from '@/utils/cn'

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  className,
}: {
  checked: boolean
  onCheckedChange: (next: boolean) => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full border border-border bg-surface transition-colors',
        checked ? 'bg-accentBlue/60' : 'bg-surface',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accentBlue/35',
        disabled && 'opacity-60',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 translate-x-0.5 rounded-full bg-card shadow-sm transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  )
}
