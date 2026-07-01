import {
  buildCalendarCells,
  formatBookingDateFromParts,
  getMonthLabel,
} from '../trainers'
import { getDateAvailabilityForSession } from '../sessionBooking'

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function BookingCalendar({
  viewYear,
  viewMonth,
  sessionLabel,
  selectedDate,
  sectionClassName,
  onShiftMonth,
  onSelectDate,
}: {
  viewYear: number
  viewMonth: number
  sessionLabel: string
  selectedDate: number | null
  sectionClassName: string
  onShiftMonth: (delta: number) => void
  onSelectDate: (day: number) => void
}) {
  const calendarCells = buildCalendarCells(viewYear, viewMonth)

  return (
    <section className={`calendar-card calendar-card-compact booking-section ${sectionClassName}`}>
      <div className="calendar-top">
        <strong>{getMonthLabel(viewYear, viewMonth)}</strong>
        <div>
          <button type="button" aria-label="Previous month" onClick={() => onShiftMonth(-1)}>
            ‹
          </button>
          <button type="button" aria-label="Next month" onClick={() => onShiftMonth(1)}>
            ›
          </button>
        </div>
      </div>

      <div className="calendar-legend" aria-hidden="true">
        <span>
          <i className="legend-dot legend-available" /> Available
        </span>
        <span>
          <i className="legend-dot legend-unavailable" /> Unavailable
        </span>
      </div>

      <div className="calendar-weekdays">
        {weekdayLabels.map((day) => (
          <span key={day}>{day.slice(0, 1)}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarCells.map((cell) => {
          if (cell.day === null) {
            return <span key={cell.key} className="muted" />
          }

          const status = getDateAvailabilityForSession(viewYear, viewMonth, cell.day, sessionLabel)
          const isSelected = selectedDate === cell.day

          return (
            <button
              key={cell.key}
              type="button"
              disabled={status === 'past' || status === 'unavailable'}
              className={`calendar-day calendar-day-${status}${isSelected ? ' selected' : ''}`}
              onClick={() => onSelectDate(cell.day!)}
              aria-label={`${formatBookingDateFromParts(cell.day, viewYear, viewMonth)} ${status}${isSelected ? ' selected' : ''}`}
            >
              {cell.day}
            </button>
          )
        })}
      </div>
    </section>
  )
}
