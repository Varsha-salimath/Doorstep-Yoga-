import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookingCelebration } from '../BookingCelebration'
import { getBookingDetails } from '../booking'
import { consumeCelebrationPending } from '../sessionBooking'
import { BookingFlowShell } from './BookingFlowShell'

export function BookingSuccessScreen() {
  const navigate = useNavigate()
  const booking = getBookingDetails()
  const [phase, setPhase] = useState<'celebrating' | 'details'>(() =>
    consumeCelebrationPending() ? 'celebrating' : 'details',
  )
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!booking) {
      navigate('/schedule', { replace: true })
      return
    }

    if (phase === 'celebrating') {
      const celebrationTimer = window.setTimeout(() => setPhase('details'), 2800)
      return () => window.clearTimeout(celebrationTimer)
    }

    const revealTimer = window.setTimeout(() => setRevealed(true), 160)
    return () => window.clearTimeout(revealTimer)
  }, [booking, navigate, phase])

  function goToConfirmation() {
    navigate('/confirmation', { replace: true })
  }

  function goHome() {
    navigate('/home', { replace: true })
  }

  if (!booking) return null

  const isCelebrating = phase === 'celebrating'

  return (
    <BookingFlowShell
      ctaLabel="View Booking"
      onCtaClick={goToConfirmation}
      hideCta={isCelebrating}
    >
      <section
        className={`booking-success-shell booking-flow-content booking-success-overlay${isCelebrating ? ' is-celebrating' : ''}${revealed ? ' is-revealed' : ''}`}
      >
        {isCelebrating ? <BookingCelebration durationMs={2800} /> : null}

        <div
          className={`booking-success-badge-wrap${isCelebrating ? ' is-celebrating' : ''}`}
        >
          {isCelebrating ? (
            <div className="booking-sparkles booking-sparkles-badge" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, index) => (
                <span
                  key={index}
                  className="booking-sparkle"
                  style={{ animationDelay: `${index * 90}ms` }}
                />
              ))}
            </div>
          ) : null}
          <div className="booking-success-badge" aria-hidden="true">
            <span className="booking-success-badge-ring" />
            <span className="booking-success-badge-core">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.5 12.2 10.2 16l7.3-8" />
              </svg>
            </span>
          </div>
        </div>

        {!isCelebrating ? (
          <>
            <div className="booking-success-trainer">
              <img src={booking.trainerImage} alt={booking.trainerName} />
              <div>
                <h2>{booking.trainerName}</h2>
                <p>{booking.sessionType}</p>
              </div>
            </div>

            <div className="booking-success-copy">
              <h1>Booking Confirmed!</h1>
              <p>
                We&apos;re excited to be part of your wellness journey. See you at your session!
              </p>
            </div>

            <dl className="booking-success-details">
              <div>
                <dt>Session</dt>
                <dd>{booking.sessionType}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{booking.dateLabel}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{booking.time}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{booking.duration} min</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{booking.locationLabel}</dd>
              </div>
              <div>
                <dt>Booking ID</dt>
                <dd>{booking.bookingId}</dd>
              </div>
            </dl>

            <div className="booking-success-actions">
              <button type="button" className="booking-success-primary" onClick={goToConfirmation}>
                View Booking
              </button>
              <button type="button" className="booking-success-secondary" onClick={goHome}>
                Back to Home
              </button>
            </div>
          </>
        ) : (
          <div className="booking-success-celebration-copy">
            <h1>Booking Confirmed!</h1>
          </div>
        )}
      </section>
    </BookingFlowShell>
  )
}
