const morningSlots = ['08:00 AM', '09:30 AM', '11:00 AM']
const afternoonSlots = ['01:30 PM', '03:00 PM', '04:30 PM']
const eveningSlots = ['06:00 PM', '07:30 PM']

function SlotGroup({
  label,
  slots,
  selectedTime,
  onSelectTime,
}: {
  label: string
  slots: string[]
  selectedTime: string | null
  onSelectTime: (slot: string) => void
}) {
  return (
    <>
      <p>{label}</p>
      <div className="slot-row">
        {slots.map((slot) => (
          <button
            key={slot}
            type="button"
            className={`booking-slot-btn${selectedTime === slot ? ' active' : ''}`}
            onClick={() => onSelectTime(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    </>
  )
}

export function BookingTimeSlots({
  selectedTime,
  sectionClassName,
  onSelectTime,
}: {
  selectedTime: string | null
  sectionClassName: string
  onSelectTime: (slot: string) => void
}) {
  return (
    <section className={`time-slots time-slots-compact booking-section ${sectionClassName}`}>
      <h2>Select Time</h2>
      <SlotGroup label="Morning" slots={morningSlots} selectedTime={selectedTime} onSelectTime={onSelectTime} />
      <SlotGroup
        label="Afternoon"
        slots={afternoonSlots}
        selectedTime={selectedTime}
        onSelectTime={onSelectTime}
      />
      <SlotGroup label="Evening" slots={eveningSlots} selectedTime={selectedTime} onSelectTime={onSelectTime} />
    </section>
  )
}
