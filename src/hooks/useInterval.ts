import * as React from 'react'

export function useInterval(callback: () => void, delay: number | null) {
  const cbRef = React.useRef(callback)
  React.useEffect(() => {
    cbRef.current = callback
  }, [callback])

  React.useEffect(() => {
    if (delay === null) return
    const id = window.setInterval(() => cbRef.current(), delay)
    return () => window.clearInterval(id)
  }, [delay])
}

