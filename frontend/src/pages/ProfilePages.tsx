import { Link, useNavigate } from 'react-router-dom'
import { addresses, services, trainers } from '../data/mockData'
import { useAppState } from '../context/AppStateContext'
import { EmptyState, InputField, PageCard, PrimaryButton, SecondaryButton } from '../components/ui'
import { formatCurrency } from '../utils/format'

export function HistoryPage() {
  const { state, dispatch } = useAppState()
  const upcoming = state.bookings.filter((item) => item.status === 'upcoming')
  const completed = state.bookings.filter((item) => item.status === 'completed')
  const cancelled = state.bookings.filter((item) => item.status === 'cancelled')

  function renderBooking(id: string) {
    const booking = state.bookings.find((item) => item.id === id)
    if (!booking) return null
    const trainer = trainers.find((item) => item.id === booking.trainerId)
    const service = services.find((item) => item.id === booking.serviceId)
    const address = addresses.find((item) => item.id === booking.addressId)
    return (
      <article key={booking.id} className="booking-card">
        <div>
          <h3>{trainer?.name ?? 'Trainer'}</h3>
          <p>{service?.name ?? 'Session'} · {booking.duration} min</p>
          <small>{booking.date} · {booking.time} · {address?.title}</small>
        </div>
        <div className="stack-sm">
          <strong>{formatCurrency(booking.amount)}</strong>
          {booking.status === 'upcoming' ? (
            <SecondaryButton
              type="button"
              onClick={() => dispatch({ type: 'CANCEL_BOOKING', payload: booking.id })}
            >
              Cancel
            </SecondaryButton>
          ) : null}
        </div>
      </article>
    )
  }

  return (
    <div className="page-grid">
      <PageCard>
        <h2>Booking History</h2>
        <h3>Upcoming Sessions</h3>
        {upcoming.length ? upcoming.map((item) => renderBooking(item.id)) : <EmptyState title="No upcoming sessions" body="Book a trainer and your session will appear here." />}
        <h3>Completed Sessions</h3>
        {completed.length ? completed.map((item) => renderBooking(item.id)) : <EmptyState title="No completed sessions" body="Completed sessions will show once your class is finished." />}
        {cancelled.length ? (
          <>
            <h3>Cancelled Sessions</h3>
            {cancelled.map((item) => renderBooking(item.id))}
          </>
        ) : null}
      </PageCard>
    </div>
  )
}

export function ProfilePage() {
  const { state } = useAppState()
  return (
    <div className="page-grid">
      <PageCard>
        <h2>Profile</h2>
        <p>{state.userName}</p>
        <small>+91 {state.phone || '9876543210'}</small>
        <div className="stack">
          <Link to="/edit-profile">Edit Profile</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/help">Help & Support</Link>
          <Link to="/about">About</Link>
        </div>
      </PageCard>
    </div>
  )
}

export function EditProfilePage() {
  return (
    <div className="page-grid">
      <PageCard>
        <h2>Edit Profile</h2>
        <div className="stack">
          <InputField label="Full Name" defaultValue="Aarav Malhotra" />
          <InputField label="Email" defaultValue="aarav@example.com" />
          <InputField label="Phone" defaultValue="9876543210" />
          <PrimaryButton type="button">Save Changes</PrimaryButton>
        </div>
      </PageCard>
    </div>
  )
}

export function SettingsPage() {
  const { dispatch } = useAppState()
  const navigate = useNavigate()
  return (
    <div className="page-grid">
      <PageCard>
        <h2>Settings</h2>
        <div className="stack">
          <Link to="/notifications">Notifications</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <SecondaryButton
            type="button"
            onClick={() => {
              dispatch({ type: 'LOGOUT' })
              navigate('/login')
            }}
          >
            Logout
          </SecondaryButton>
        </div>
      </PageCard>
    </div>
  )
}

export function HelpPage() {
  return (
    <div className="page-grid">
      <PageCard>
        <h2>Help & Support</h2>
        <p>Need help with rescheduling, cancellation, or payments?</p>
        <div className="stack">
          <a href="mailto:support@yogfit.app">support@yogfit.app</a>
          <a href="tel:+911800000111">+91 1800 000 111</a>
        </div>
      </PageCard>
    </div>
  )
}

export function AboutPage() {
  return (
    <div className="page-grid">
      <PageCard>
        <h2>About YogFit</h2>
        <p>
          YogFit helps users discover verified trainers and book personalized sessions
          at home or office with confidence.
        </p>
      </PageCard>
    </div>
  )
}

export function TermsPage() {
  return (
    <div className="page-grid">
      <PageCard>
        <h2>Terms</h2>
        <p>
          Sessions can be rescheduled up to 6 hours before start time. Refunds are
          processed for eligible cancellations only.
        </p>
      </PageCard>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <div className="page-grid">
      <PageCard>
        <h2>Privacy Policy</h2>
        <p>
          We collect only booking-required data. Sensitive payment details are not
          stored on our platform.
        </p>
      </PageCard>
    </div>
  )
}

export function NotificationsPage() {
  const { state, dispatch } = useAppState()
  return (
    <div className="page-grid">
      <PageCard>
        <h2>Notifications</h2>
        {state.notifications.length === 0 ? (
          <EmptyState title="No notifications" body="We'll keep you posted with booking updates." />
        ) : (
          <div className="stack">
            {state.notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                className={notification.read ? 'notice-card' : 'notice-card unread'}
                onClick={() =>
                  dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id })
                }
              >
                <strong>{notification.title}</strong>
                <p>{notification.body}</p>
                <small>{notification.time}</small>
              </button>
            ))}
          </div>
        )}
      </PageCard>
    </div>
  )
}
