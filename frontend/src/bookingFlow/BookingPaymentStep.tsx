import { formatInr } from '../trainers'
import type { Trainer } from '../trainers'

function PaymentMethodIcon({ method }: { method: 'upi' | 'card' | 'wallet' }) {
  if (method === 'upi') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 5h10v14H7z" />
        <path d="M9 17h6" />
      </svg>
    )
  }
  if (method === 'card') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 8h18v10H3z" />
        <path d="M3 11h18" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14a2 2 0 0 1 2 2v8H3V9a2 2 0 0 1 2-2Z" />
      <path d="M16 13h3" />
    </svg>
  )
}

export function BookingPaymentStep({
  activeTrainer,
  selectedDateLabel,
  selectedTime,
  total,
  paymentMethod,
  sectionClassName,
  onSelectPaymentMethod,
}: {
  activeTrainer: Trainer
  selectedDateLabel: string | null
  selectedTime: string | null
  total: number
  paymentMethod: 'upi' | 'card' | 'wallet' | null
  sectionClassName: string
  onSelectPaymentMethod: (method: 'upi' | 'card' | 'wallet') => void
}) {
  return (
    <div className="booking-step-panel">
      <section className="booking-summary-card booking-summary-card-compact">
        <div className="booking-summary-trainer">
          <img src={activeTrainer.image} alt={activeTrainer.name} />
          <div>
            <h2>{activeTrainer.name}</h2>
            <p>
              {selectedDateLabel} · {selectedTime}
            </p>
          </div>
        </div>
        <p className="payment-total-line">
          <span>Total</span>
          <strong>{formatInr(total)}</strong>
        </p>
      </section>

      <section className={`payment-card payment-card-full booking-section ${sectionClassName}`}>
        <h2>Payment Method</h2>
        <div className="payment-options payment-options-stack">
          {(
            [
              { id: 'upi', label: 'UPI' },
              { id: 'card', label: 'Credit / Debit Card' },
              { id: 'wallet', label: 'Wallet' },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              className={`payment-option-row booking-payment-option${paymentMethod === option.id ? ' active' : ''}`}
              onClick={() => onSelectPaymentMethod(option.id)}
            >
              <span className="payment-option-icon">
                <PaymentMethodIcon method={option.id} />
              </span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        <div className="payment-secure">
          <span className="payment-secure-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 11V8a5 5 0 0 1 10 0v3" />
              <path d="M6 11h12v9H6z" />
            </svg>
          </span>
          <div>
            <strong>Secure Payment</strong>
            <p>Your payment is encrypted and secure.</p>
            <small>Estimated confirmation in under 30 seconds</small>
          </div>
        </div>
      </section>
    </div>
  )
}
