type ToastListener = (message: string) => void

let listener: ToastListener | null = null

export function showToast(message: string) {
  listener?.(message)
}

export function subscribeToast(nextListener: ToastListener) {
  listener = nextListener
  return () => {
    if (listener === nextListener) listener = null
  }
}
