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
      data-checked={checked ? 'true' : 'false'}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full border transition-colors',
        // Light mode track
        'bg-gray-200 border-gray-300',
        checked && 'bg-[#4F6EF7] border-[#4F6EF7]',
        // Dark mode track (fix invisible toggle bug)
        'dark:bg-[#374151] dark:border-[#4b5563]',
        checked && 'dark:bg-[#4F6EF7] dark:border-[#4F6EF7]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accentBlue/35',
        disabled && 'opacity-60',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.30)] transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  )
}
