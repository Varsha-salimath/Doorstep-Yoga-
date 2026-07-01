import { useEffect, type ReactNode } from 'react'
import { BookingStickyCta } from './BookingStickyCta'

function useBookingFlowBodyClass(active: boolean) {
  useEffect(() => {
    if (!active) return
    document.body.classList.add('doorstep-booking-flow-active')
    return () => document.body.classList.remove('doorstep-booking-flow-active')
  }, [active])
}

export function BookingFlowShell({
  children,
  ctaLabel,
  ctaDisabled = false,
  onCtaClick,
  hideCta = false,
}: {
  children: ReactNode
  ctaLabel: string
  ctaDisabled?: boolean
  onCtaClick: () => void
  hideCta?: boolean
}) {
  useBookingFlowBodyClass(true)

  return (
    <div className="app-bg app-bg-viewport-lock">
      <main className="phone-shell page-shell page-shell-booking-flow">
        <div className="booking-flow-scroll">{children}</div>
        {hideCta ? null : (
          <BookingStickyCta label={ctaLabel} disabled={ctaDisabled} onClick={onCtaClick} />
        )}
      </main>
    </div>
  )
}
