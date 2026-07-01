import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createBookingId,
  defaultLocationLabel,
  saveBookingDetails,
} from '../booking'
import {
  calculateSessionPrice,
  getBookingSessionDraft,
  getSessionPricing,
  markCelebrationPending,
  savePrivateSessionDraft,
} from '../sessionBooking'
import {
  formatBookingDateFromParts,
  formatInr,
  getSelectedTrainer,
} from '../trainers'
import { showToast } from '../toast'
import { BookingCalendar } from './BookingCalendar'
import { BookingDuration } from './BookingDuration'
import { BookingFlowShell } from './BookingFlowShell'
import { BookingPaymentStep } from './BookingPaymentStep'
import { BookingProgressIndicator } from './BookingProgressIndicator'
import { BookingSummaryStep } from './BookingSummaryStep'
import { BookingTimeSlots } from './BookingTimeSlots'
import { bookingStepCtaLabels, stepTitle, type BookingAttentionSection, type BookingStep } from './types'

export function ScheduleScreen() {
  const navigate = useNavigate()
  const today = new Date()
  const [step, setStep] = useState<BookingStep>('schedule')
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [isRecurring, setIsRecurring] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet' | null>(null)
  const [attentionSection, setAttentionSection] = useState<BookingAttentionSection>(null)

  const activeTrainer = getSelectedTrainer()
  const sessionDraft = getBookingSessionDraft()
  const isGroupSession = sessionDraft?.kind === 'group'
  const sessionLabel = sessionDraft?.sessionLabel ?? activeTrainer.category
  const sessionType = isGroupSession
    ? `Group Yoga (${sessionDraft?.memberCount ?? 4} members)`
    : sessionLabel
  const pricingConfig = getSessionPricing(sessionLabel)
  const durationOptions = isGroupSession ? [60] : pricingConfig.durations
  const effectiveDuration = isGroupSession ? 60 : (selectedDuration ?? durationOptions[0] ?? 60)
  const pricing = calculateSessionPrice(
    sessionLabel,
    effectiveDuration,
    isRecurring,
    isGroupSession ? sessionDraft : null,
  )

  const selectedDateLabel =
    selectedDate !== null ? formatBookingDateFromParts(selectedDate, viewYear, viewMonth) : null

  useEffect(() => {
    if (!sessionDraft && !isGroupSession) {
      savePrivateSessionDraft(activeTrainer.category)
    }
  }, [activeTrainer.category, isGroupSession, sessionDraft])

  useEffect(() => {
    if (!attentionSection) return
    const timer = window.setTimeout(() => setAttentionSection(null), 1400)
    return () => window.clearTimeout(timer)
  }, [attentionSection])

  function sectionClass(section: Exclude<BookingAttentionSection, null>) {
    return attentionSection === section ? 'booking-section-attention' : ''
  }

  function validateSchedule() {
    if (selectedDate === null) {
      showToast('Please select a date.')
      setAttentionSection('date')
      return false
    }
    if (selectedTime === null) {
      showToast('Please select a time slot.')
      setAttentionSection('time')
      return false
    }
    if (!isGroupSession && selectedDuration === null) {
      showToast('Please choose a session duration.')
      setAttentionSection('duration')
      return false
    }
    return true
  }

  function shiftMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewMonth(next.getMonth())
    setViewYear(next.getFullYear())
    setSelectedDate(null)
    setSelectedTime(null)
    setSelectedDuration(null)
  }

  function selectDate(day: number) {
    setSelectedDate(day)
    if (isGroupSession) setSelectedDuration(60)
  }

  function selectTime(slot: string) {
    setSelectedTime(slot)
    if (isGroupSession) setSelectedDuration(60)
  }

  function goBack() {
    if (step === 'schedule') {
      navigate(isGroupSession ? '/group-session' : '/trainer-profile')
      return
    }
    if (step === 'summary') setStep('schedule')
    else if (step === 'payment') setStep('summary')
  }

  function advanceStep() {
    if (step === 'schedule') {
      if (!validateSchedule()) return
      setStep('summary')
      return
    }
    if (step === 'summary') {
      setStep('payment')
      return
    }
    if (step === 'payment') {
      if (!paymentMethod) {
        showToast('Please choose a payment method.')
        setAttentionSection('payment')
        return
      }
      const paymentLabel =
        paymentMethod === 'card' ? 'Card' : paymentMethod === 'wallet' ? 'Wallet' : 'UPI'
      saveBookingDetails({
        trainerName: activeTrainer.name,
        trainerImage: activeTrainer.image,
        dateLabel: selectedDateLabel ?? formatBookingDateFromParts(12, viewYear, viewMonth),
        time: selectedTime ?? '09:30 AM',
        sessionType,
        duration: effectiveDuration,
        bookingId: createBookingId(),
        totalPaid: formatInr(pricing.total),
        paymentMethod: paymentLabel,
        locationLabel: defaultLocationLabel,
        memberCount: sessionDraft?.memberCount,
      })
      markCelebrationPending()
      navigate('/booking-success')
    }
  }

  return (
    <BookingFlowShell ctaLabel={bookingStepCtaLabels[step]} onCtaClick={advanceStep}>
      <section className="schedule-shell booking-flow-content booking-flow-compact">
        <header className="schedule-header">
          <button type="button" className="booking-icon-btn" aria-label="Back" onClick={goBack}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 5.5 8 12l6.5 6.5" />
            </svg>
          </button>
          <h1>{stepTitle[step]}</h1>
          <button
            type="button"
            className="booking-icon-btn"
            aria-label="Session info"
            onClick={() => showToast('Sessions include mat setup and cooldown time.')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 10.5v5m0-8.5h.01M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Z" />
            </svg>
          </button>
        </header>

        <BookingProgressIndicator step={step} />

        {step === 'schedule' ? (
          <div className="booking-progressive-flow">
            <div className="booking-selection-status" aria-live="polite">
              <span className={selectedDate ? 'is-set' : 'is-pending'}>
                {selectedDateLabel ?? 'Select a date'}
              </span>
              <span className={selectedTime ? 'is-set' : 'is-pending'}>
                {selectedTime ?? 'Select a time'}
              </span>
              <span className={isGroupSession || selectedDuration ? 'is-set' : 'is-pending'}>
                {isGroupSession
                  ? '60 min session'
                  : selectedDuration
                    ? `${selectedDuration} min`
                    : 'Choose duration'}
              </span>
            </div>

            <section className="booking-trainer-strip">
              <img src={activeTrainer.image} alt={activeTrainer.name} />
              <div>
                <h2>{activeTrainer.name}</h2>
                <p>{sessionType}</p>
                <p className="booking-trainer-meta">{activeTrainer.experience}</p>
                <p className="booking-trainer-meta">{defaultLocationLabel}</p>
              </div>
            </section>

            <BookingCalendar
              viewYear={viewYear}
              viewMonth={viewMonth}
              sessionLabel={sessionLabel}
              selectedDate={selectedDate}
              sectionClassName={sectionClass('date')}
              onShiftMonth={shiftMonth}
              onSelectDate={selectDate}
            />

            <BookingTimeSlots
              selectedTime={selectedTime}
              sectionClassName={sectionClass('time')}
              onSelectTime={selectTime}
            />

            <BookingDuration
              isGroupSession={isGroupSession}
              durationOptions={durationOptions}
              selectedDuration={selectedDuration}
              sectionClassName={sectionClass('duration')}
              onSelectDuration={setSelectedDuration}
            />
          </div>
        ) : null}

        {step === 'summary' ? (
          <BookingSummaryStep
            activeTrainer={activeTrainer}
            sessionType={sessionType}
            sessionLabel={sessionLabel}
            selectedDateLabel={selectedDateLabel}
            selectedTime={selectedTime}
            effectiveDuration={effectiveDuration}
            locationLabel={defaultLocationLabel}
            isGroupSession={isGroupSession}
            memberCount={sessionDraft?.memberCount ?? 4}
            isRecurring={isRecurring}
            pricing={pricing}
            onToggleRecurring={() => setIsRecurring((value) => !value)}
          />
        ) : null}

        {step === 'payment' ? (
          <BookingPaymentStep
            activeTrainer={activeTrainer}
            selectedDateLabel={selectedDateLabel}
            selectedTime={selectedTime}
            total={pricing.total}
            paymentMethod={paymentMethod}
            sectionClassName={sectionClass('payment')}
            onSelectPaymentMethod={setPaymentMethod}
          />
        ) : null}
      </section>
    </BookingFlowShell>
  )
}
