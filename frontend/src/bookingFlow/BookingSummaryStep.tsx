import { formatInr } from '../trainers'
import type { Trainer } from '../trainers'

export function BookingSummaryStep({
  activeTrainer,
  sessionType,
  sessionLabel,
  selectedDateLabel,
  selectedTime,
  effectiveDuration,
  locationLabel,
  isGroupSession,
  memberCount,
  isRecurring,
  pricing,
  onToggleRecurring,
}: {
  activeTrainer: Trainer
  sessionType: string
  sessionLabel: string
  selectedDateLabel: string | null
  selectedTime: string | null
  effectiveDuration: number
  locationLabel: string
  isGroupSession: boolean
  memberCount: number
  isRecurring: boolean
  pricing: { base: number; discount: number; serviceFee: number; total: number }
  onToggleRecurring: () => void
}) {
  return (
    <div className="booking-step-panel">
      <section className="booking-summary-card">
        <div className="booking-summary-trainer">
          <img src={activeTrainer.image} alt={activeTrainer.name} />
          <div>
            <h2>{activeTrainer.name}</h2>
            <p>{sessionType}</p>
            <p>{activeTrainer.experience}</p>
          </div>
        </div>

        <dl className="booking-summary-details">
          <div>
            <dt>Date</dt>
            <dd>{selectedDateLabel}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{selectedTime}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{effectiveDuration} min</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{locationLabel}</dd>
          </div>
        </dl>

        {!isGroupSession ? (
          <section className="recurring-card recurring-card-compact">
            <div>
              <h4>Recurring Session</h4>
              <p>Auto-book 3x per week</p>
            </div>
            <button
              type="button"
              className={`toggle-btn booking-toggle-btn ${isRecurring ? 'on' : ''}`}
              aria-label="Toggle recurring session"
              onClick={onToggleRecurring}
            >
              <span />
            </button>
          </section>
        ) : null}

        <section className="pricing-block pricing-block-compact">
          <h3>Price Breakdown</h3>
          <div>
            <p>
              <span>
                {isGroupSession
                  ? `Group Yoga (${memberCount} members)`
                  : `${sessionLabel} (${effectiveDuration} min)`}
              </span>
              <strong>{formatInr(pricing.base)}</strong>
            </p>
            {!isGroupSession && isRecurring ? (
              <p>
                <span>Multi-session Discount</span>
                <strong className="green">- {formatInr(pricing.discount)}</strong>
              </p>
            ) : null}
            {!isGroupSession ? (
              <p>
                <span>Service Fee</span>
                <strong>{formatInr(pricing.serviceFee)}</strong>
              </p>
            ) : null}
            <p className="total">
              <span>Total Amount</span>
              <strong>{formatInr(pricing.total)}</strong>
            </p>
          </div>
        </section>
      </section>
    </div>
  )
}
