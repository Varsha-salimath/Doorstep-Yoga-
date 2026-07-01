import { HOME_LOCATION_LABEL } from './trainers'

const BOOKING_KEY = 'doorstep-yoga-booking'
const GROUP_SESSION_KEY = 'doorstep-yoga-group-session'

export type BookingDetails = {
  trainerName: string
  trainerImage: string
  dateLabel: string
  time: string
  sessionType: string
  duration: number
  bookingId: string
  totalPaid: string
  paymentMethod: string
  locationLabel: string
  memberCount?: number
}

export type GroupSessionDraft = {
  memberCount: number
  totalPrice: number
}

export function createBookingId() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `DY-${suffix}`
}

export function saveBookingDetails(details: BookingDetails) {
  sessionStorage.setItem(BOOKING_KEY, JSON.stringify(details))
}

export function getBookingDetails(): BookingDetails | null {
  const raw = sessionStorage.getItem(BOOKING_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as BookingDetails
  } catch {
    return null
  }
}

export function saveGroupSessionDraft(draft: GroupSessionDraft) {
  sessionStorage.setItem(GROUP_SESSION_KEY, JSON.stringify(draft))
}

export function getGroupSessionDraft(): GroupSessionDraft | null {
  const raw = sessionStorage.getItem(GROUP_SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as GroupSessionDraft
  } catch {
    return null
  }
}

export function clearGroupSessionDraft() {
  sessionStorage.removeItem(GROUP_SESSION_KEY)
}

export const defaultTrainerImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBTYLSJ2ZW2JUogq7mFoDbF4wXEK9TX5GhC_1ZJAGOx99UsJXm4MM5zHusdyyg6MLlnQp6QH1s4cSyLm6B_8nhOOfLUGwRxKVO8Bp1u24dPC8MDXlTkgI5QdBzRRhOi5qABgoJlzLHbGw2p3rBm5hjWAOmXvAZ-Ej2xKcdBzhG4WgbA6pNV23TTxcmMa-6X_IcybpQsllv2GgizzYI9FgmztnqvGLx-8DDsfgZ3ZATpbcgPvwmNPXYUghIBpswYFv2qKw617lNhcMo'

export const defaultLocationLabel = `Home Visit · ${HOME_LOCATION_LABEL}`
