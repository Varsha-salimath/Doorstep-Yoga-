import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addresses, services, trainers } from '../data/mockData'
import { useAppState } from '../context/AppStateContext'
import { EmptyState, FigmaScreen, InputField, PageCard, PrimaryButton, SecondaryButton } from '../components/ui'
import { formatCurrency, todayIsoDate } from '../utils/format'
import { figmaAssets } from '../data/figmaAssets'

const defaultSlots = ['08:00 AM', '09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM', '07:30 PM']

export function AddressPage() {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()
  const [newAddress, setNewAddress] = useState('')
  return (
    <div className="page-grid">
      <PageCard className="address-sheet">
        <FigmaScreen file="Address Selection.png" label="Address selection reference" />
        <h2>Select Address</h2>
        <div
          className="map-preview"
          style={{ backgroundImage: `url(${figmaAssets.addressMap})` }}
        />
        <p>Choose where your session should happen.</p>
        <div className="stack">
          {state.addresses.map((address) => (
            <button
              key={address.id}
              type="button"
              className={state.draft.addressId === address.id ? 'select-card active' : 'select-card'}
              onClick={() => dispatch({ type: 'SELECT_ADDRESS', payload: address.id })}
            >
              <strong>{address.title}</strong>
              <p>
                {address.line1}, {address.city}
              </p>
            </button>
          ))}
        </div>
        <InputField
          label="Add New Address (demo)"
          placeholder="House no, street, city"
          value={newAddress}
          onChange={(event) => setNewAddress(event.target.value)}
        />
        <div className="actions-row">
          <PrimaryButton onClick={() => navigate('/schedule')}>Continue</PrimaryButton>
          <SecondaryButton onClick={() => navigate(-1)}>Back</SecondaryButton>
        </div>
      </PageCard>
    </div>
  )
}

export function SchedulePage() {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()
  return (
    <div className="page-grid">
      <PageCard>
        <FigmaScreen file="Booking & Scheduling.png" label="Schedule reference" />
        <h2>Schedule Session</h2>
        <div className="stack">
          <InputField
            label="Select Date"
            type="date"
            min={todayIsoDate()}
            value={state.draft.date ?? todayIsoDate()}
            onChange={(event) => dispatch({ type: 'SELECT_DATE', payload: event.target.value })}
          />
          <div className="chip-wrap">
            {defaultSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={state.draft.time === slot ? 'chip active' : 'chip'}
                onClick={() => dispatch({ type: 'SELECT_TIME', payload: slot })}
              >
                {slot}
              </button>
            ))}
          </div>
          <div className="chip-wrap">
            {[60, 90].map((duration) => (
              <button
                key={duration}
                type="button"
                className={state.draft.duration === duration ? 'chip active' : 'chip'}
                onClick={() => dispatch({ type: 'SET_DURATION', payload: duration as 60 | 90 })}
              >
                {duration} mins
              </button>
            ))}
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={state.draft.recurring}
              onChange={(event) =>
                dispatch({ type: 'SET_RECURRING', payload: event.target.checked })
              }
            />
            <span>Recurring session (2x/week)</span>
          </label>
        </div>
        <div className="actions-row">
          <PrimaryButton
            onClick={() => navigate('/summary')}
            disabled={!state.draft.date || !state.draft.time}
          >
            Continue
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate(-1)}>Back</SecondaryButton>
        </div>
      </PageCard>
    </div>
  )
}

export function SummaryPage() {
  const { state } = useAppState()
  const navigate = useNavigate()
  const trainer = trainers.find((item) => item.id === state.draft.trainerId)
  const service = services.find((item) => item.id === state.draft.serviceId)
  const address = addresses.find((item) => item.id === state.draft.addressId)
  const base = trainer?.pricePerSession ?? 1100
  const discount = state.draft.recurring ? 150 : 0
  const durationExtra = state.draft.duration === 90 ? 500 : 0
  const fee = 50
  const total = base + durationExtra + fee - discount
  if (!trainer || !service || !address || !state.draft.time || !state.draft.date) {
    return (
      <div className="page-grid">
        <PageCard>
          <EmptyState title="Incomplete booking" body="Please fill booking details first." />
          <PrimaryButton onClick={() => navigate('/services')}>Go Back</PrimaryButton>
        </PageCard>
      </div>
    )
  }
  return (
    <div className="page-grid">
      <PageCard>
        <h2>Booking Summary</h2>
        <div className="stack">
          <div className="list-row">
            <span>Service</span>
            <strong>{service.name}</strong>
          </div>
          <div className="list-row">
            <span>Trainer</span>
            <strong>{trainer.name}</strong>
          </div>
          <div className="list-row">
            <span>Date & Time</span>
            <strong>{state.draft.date} · {state.draft.time}</strong>
          </div>
          <div className="list-row">
            <span>Location</span>
            <strong>{address.title}</strong>
          </div>
          <hr />
          <div className="list-row">
            <span>Session Fee</span>
            <strong>{formatCurrency(base)}</strong>
          </div>
          <div className="list-row">
            <span>Duration Upgrade</span>
            <strong>{formatCurrency(durationExtra)}</strong>
          </div>
          <div className="list-row">
            <span>Service Fee</span>
            <strong>{formatCurrency(fee)}</strong>
          </div>
          <div className="list-row">
            <span>Discount</span>
            <strong>-{formatCurrency(discount)}</strong>
          </div>
          <div className="list-row total-row">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>
        <div className="actions-row">
          <PrimaryButton onClick={() => navigate('/payment')}>Proceed to Payment</PrimaryButton>
          <SecondaryButton onClick={() => navigate(-1)}>Back</SecondaryButton>
        </div>
      </PageCard>
    </div>
  )
}

export function PaymentPage() {
  const navigate = useNavigate()
  const { dispatch } = useAppState()
  const [method, setMethod] = useState('UPI')
  const [isLoading, setIsLoading] = useState(false)

  function pay(success: boolean) {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (success) {
        dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'paid' })
        dispatch({ type: 'CONFIRM_BOOKING' })
        navigate('/confirmation')
      } else {
        dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'failed' })
        navigate('/payment-failed')
      }
    }, 700)
  }

  return (
    <div className="page-grid">
      <PageCard>
        <h2>Payment</h2>
        <p>Select a payment method to complete your booking.</p>
        <div className="chip-wrap">
          {['UPI', 'Card', 'Net Banking'].map((item) => (
            <button
              key={item}
              type="button"
              className={method === item ? 'chip active' : 'chip'}
              onClick={() => setMethod(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="actions-row">
          <PrimaryButton onClick={() => pay(true)} disabled={isLoading}>
            {isLoading ? 'Processing...' : `Pay with ${method}`}
          </PrimaryButton>
          <SecondaryButton onClick={() => pay(false)} disabled={isLoading}>
            Simulate Failure
          </SecondaryButton>
        </div>
      </PageCard>
    </div>
  )
}

export function PaymentFailedPage() {
  const navigate = useNavigate()
  return (
    <div className="center-page">
      <PageCard>
        <h2>Payment Failed</h2>
        <p>Your transaction was not completed. Please retry or change method.</p>
        <div className="actions-row">
          <PrimaryButton onClick={() => navigate('/payment')}>Retry Payment</PrimaryButton>
          <SecondaryButton onClick={() => navigate('/summary')}>Back to Summary</SecondaryButton>
        </div>
      </PageCard>
    </div>
  )
}

export function ConfirmationPage() {
  const navigate = useNavigate()
  return (
    <div className="center-page">
      <PageCard className="hero-card success-card">
        <FigmaScreen file="Booking Confirmation.png" label="Booking confirmation reference" />
        <h2>Booking Confirmed</h2>
        <p>Your trainer is assigned and session details are now available in history.</p>
        <div
          className="confirmation-map"
          style={{ backgroundImage: `url(${figmaAssets.confirmationMap})` }}
        />
        <div className="actions-row">
          <PrimaryButton onClick={() => navigate('/history')}>View Booking</PrimaryButton>
          <SecondaryButton onClick={() => navigate('/home')}>Back Home</SecondaryButton>
        </div>
      </PageCard>
    </div>
  )
}
