export function formatISODate(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function startOfWeek(d: Date, weekStartsOn: 0 | 1 = 1) {
  // weekStartsOn: 0 = Sunday, 1 = Monday
  const x = startOfDay(d)
  const day = x.getDay()
  const diff = (day - weekStartsOn + 7) % 7
  x.setDate(x.getDate() - diff)
  return x
}

export function daysBack(count: number, from = new Date()) {
  const base = startOfDay(from)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base)
    d.setDate(base.getDate() - (count - 1 - i))
    return d
  })
}

export function isSameISODate(aISO: string, bISO: string) {
  return aISO === bISO
}

