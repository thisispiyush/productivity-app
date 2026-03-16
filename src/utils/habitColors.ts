export const habitColorPalette = [
  '#4F6EF7', // blue
  '#22C55E', // green
  '#A855F7', // purple
  '#F97316', // orange
  '#EC4899', // pink
  '#14B8A6', // teal
] as const

export function habitColorFromId(id: string) {
  // Stable deterministic color without requiring a DB schema change.
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return habitColorPalette[hash % habitColorPalette.length]
}

