export function BookingDuration({
  isGroupSession,
  durationOptions,
  selectedDuration,
  sectionClassName,
  onSelectDuration,
}: {
  isGroupSession: boolean
  durationOptions: number[]
  selectedDuration: number | null
  sectionClassName: string
  onSelectDuration: (duration: number) => void
}) {
  return (
    <section className={`duration-section duration-section-compact booking-section ${sectionClassName}`}>
      <h3>Duration</h3>
      {isGroupSession ? (
        <p className="booking-duration-fixed">60 min · included with your group session</p>
      ) : (
        <div className="duration-grid duration-grid-compact">
          {durationOptions.map((duration) => (
            <button
              key={duration}
              type="button"
              className={`booking-duration-btn${selectedDuration === duration ? ' duration-active' : ''}`}
              onClick={() => onSelectDuration(duration)}
            >
              <strong>{duration}</strong>
              <span>min</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
