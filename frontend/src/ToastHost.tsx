import { useEffect, useState } from 'react'
import { subscribeToast } from './toast'

export function ToastHost() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    return subscribeToast((nextMessage) => {
      setMessage(nextMessage)
      window.setTimeout(() => setMessage(null), 2400)
    })
  }, [])

  if (!message) return null

  return (
    <div className="app-toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}
