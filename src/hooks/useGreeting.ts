import * as React from 'react'

export function useGreeting(name: string) {
  return React.useMemo(() => {
    const h = new Date().getHours()
    const part =
      h < 5 ? 'Good Night' : h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'
    return `${part}, ${name} 👋`
  }, [name])
}

