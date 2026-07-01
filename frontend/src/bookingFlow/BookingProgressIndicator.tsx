import type { BookingStep } from './types'

export function BookingProgressIndicator({ step }: { step: BookingStep }) {
  const steps = [
    { id: 'schedule', label: 'Date & Time' },
    { id: 'summary', label: 'Summary' },
    { id: 'payment', label: 'Payment' },
  ] as const
  const currentIndex = steps.findIndex((item) => item.id === step)
  const progressPercent = ((currentIndex + 1) / steps.length) * 100

  return (
    <div className="booking-progress" aria-label="Booking progress">
      <div className="booking-progress-head">
        <span>Booking Progress</span>
        <strong>
          Step {currentIndex + 1} of {steps.length}
        </strong>
      </div>
      <div className="booking-progress-bar" aria-hidden="true">
        <span style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="booking-progress-steps">
        {steps.map((item, index) => (
          <span
            key={item.id}
            className={`booking-progress-step${index < currentIndex ? ' is-complete' : ''}${index === currentIndex ? ' is-current' : ''}`}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
