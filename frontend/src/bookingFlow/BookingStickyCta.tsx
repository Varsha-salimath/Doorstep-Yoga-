export function BookingStickyCta({
  label,
  disabled = false,
  onClick,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <div className="booking-sticky-cta" role="region" aria-label="Booking action">
      <button
        type="button"
        className="booking-sticky-cta-btn"
        disabled={disabled}
        onClick={onClick}
      >
        <span key={label} className="booking-sticky-cta-label">
          {label}
        </span>
      </button>
    </div>
  )
}
