function getAvatarColor(name: string) {
  const colors: [string, string][] = [
    ['#4F6EF7', '#6B85F8'], // blue
    ['#8B5CF6', '#A78BFA'], // purple
    ['#EC4899', '#F472B6'], // pink
    ['#14B8A6', '#2DD4BF'], // teal
    ['#F97316', '#FB923C'], // orange
    ['#22C55E', '#4ADE80'], // green
  ]
  const base = (name || '?').trim()
  const index = base.charCodeAt(0) % colors.length
  return colors[index] ?? colors[0]
}

export function Avatar({
  name,
  photoUrl,
  size = 32,
  className,
}: {
  name: string
  photoUrl?: string | null
  size?: number
  className?: string
}) {
  const [from, to] = getAvatarColor(name)
  const initial = name?.charAt(0)?.toUpperCase() || '?'

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        style={{ width: size, height: size }}
        className={['rounded-full object-cover', className].filter(Boolean).join(' ')}
      />
    )
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
        color: 'white',
        letterSpacing: '-0.01em',
      }}
    >
      {initial}
    </div>
  )
}
