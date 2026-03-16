import type { SVGProps } from 'react'

export function EKGIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path
        d="M2 16 H8 L11 8 L14 24 L17 12 L20 18 H30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

