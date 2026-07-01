export type BookingStep = 'schedule' | 'summary' | 'payment'

export type BookingAttentionSection = 'date' | 'time' | 'duration' | 'payment' | null

export const bookingStepCtaLabels: Record<BookingStep, string> = {
  schedule: 'Continue',
  summary: 'Proceed to Checkout',
  payment: 'Pay Now',
}

export const stepTitle: Record<BookingStep, string> = {
  schedule: 'Book Session',
  summary: 'Booking Summary',
  payment: 'Payment',
}
