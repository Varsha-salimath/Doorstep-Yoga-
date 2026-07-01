import { GROUP_PRICING, formatInr } from './trainers'

const SESSION_DRAFT_KEY = 'doorstep-yoga-session-draft'
const CELEBRATION_PENDING_KEY = 'doorstep-yoga-celebration-pending'

export type BookingSessionDraft = {
  sessionLabel: string
  kind: 'private' | 'group'
  memberCount?: number
  groupTotalPrice?: number
}

export type SessionPricing = {
  base60: number
  base90: number
  serviceFee: number
  recurringDiscount: number
  durations: number[]
}

export const ALL_SESSION_LABELS = [
  '1-on-1 Yoga',
  'Group Yoga',
  'Prenatal Yoga',
  'Couples Yoga',
  'Therapy Yoga',
  'Meditation',
  'Weight Loss Yoga',
  'Power Yoga',
  'Kids Yoga',
] as const

export type SessionLabel = (typeof ALL_SESSION_LABELS)[number]

const DEFAULT_PRICING: SessionPricing = {
  base60: 1200,
  base90: 1700,
  serviceFee: 50,
  recurringDiscount: 150,
  durations: [60, 90],
}

export const SESSION_PRICING: Record<string, SessionPricing> = {
  '1-on-1 Yoga': DEFAULT_PRICING,
  'Prenatal Yoga': {
    base60: 1300,
    base90: 1750,
    serviceFee: 50,
    recurringDiscount: 150,
    durations: [60, 90],
  },
  'Couples Yoga': {
    base60: 1500,
    base90: 2000,
    serviceFee: 50,
    recurringDiscount: 150,
    durations: [60, 90],
  },
  'Therapy Yoga': {
    base60: 1400,
    base90: 1850,
    serviceFee: 50,
    recurringDiscount: 150,
    durations: [60, 90],
  },
  Meditation: {
    base60: 900,
    base90: 1200,
    serviceFee: 50,
    recurringDiscount: 100,
    durations: [60, 90],
  },
  'Weight Loss Yoga': {
    base60: 1350,
    base90: 1800,
    serviceFee: 50,
    recurringDiscount: 150,
    durations: [60, 90],
  },
  'Power Yoga': {
    base60: 1250,
    base90: 1750,
    serviceFee: 50,
    recurringDiscount: 150,
    durations: [60, 90],
  },
  'Kids Yoga': {
    base60: 1000,
    base90: 1200,
    serviceFee: 50,
    recurringDiscount: 100,
    durations: [45, 60],
  },
  'Group Yoga': {
    base60: 0,
    base90: 0,
    serviceFee: 0,
    recurringDiscount: 0,
    durations: [60],
  },
}

/** Maps specialty sessions to trainer listing categories when browsing. */
export const SESSION_TRAINER_CATEGORY: Record<string, string> = {
  'Weight Loss Yoga': '1-on-1 Yoga',
  'Power Yoga': '1-on-1 Yoga',
  'Kids Yoga': '1-on-1 Yoga',
  'Group Yoga': '1-on-1 Yoga',
}

export function getSessionPricing(sessionLabel: string): SessionPricing {
  return SESSION_PRICING[sessionLabel] ?? DEFAULT_PRICING
}

export function savePrivateSessionDraft(sessionLabel: string) {
  const draft: BookingSessionDraft = { sessionLabel, kind: 'private' }
  sessionStorage.setItem(SESSION_DRAFT_KEY, JSON.stringify(draft))
}

export function saveGroupBookingSession(memberCount: number, totalPrice: number) {
  const draft: BookingSessionDraft = {
    sessionLabel: 'Group Yoga',
    kind: 'group',
    memberCount,
    groupTotalPrice: totalPrice,
  }
  sessionStorage.setItem(SESSION_DRAFT_KEY, JSON.stringify(draft))
}

export function getBookingSessionDraft(): BookingSessionDraft | null {
  const raw = sessionStorage.getItem(SESSION_DRAFT_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as BookingSessionDraft
  } catch {
    return null
  }
}

export function clearBookingSessionDraft() {
  sessionStorage.removeItem(SESSION_DRAFT_KEY)
}

export function calculateSessionPrice(
  sessionLabel: string,
  duration: number,
  isRecurring: boolean,
  groupDraft?: Pick<BookingSessionDraft, 'memberCount' | 'groupTotalPrice'> | null,
) {
  if (groupDraft?.groupTotalPrice) {
    return {
      base: groupDraft.groupTotalPrice,
      discount: 0,
      serviceFee: 0,
      total: groupDraft.groupTotalPrice,
    }
  }

  const config = getSessionPricing(sessionLabel)
  const base =
    duration <= 45 && config.durations.includes(45)
      ? Math.round(config.base60 * 0.85)
      : duration === 90
        ? config.base90
        : config.base60
  const discount = isRecurring ? config.recurringDiscount : 0
  const serviceFee = config.serviceFee
  const total = base - discount + serviceFee

  return { base, discount, serviceFee, total }
}

export function getDateAvailabilityForSession(
  year: number,
  month: number,
  day: number,
  sessionLabel: string,
) {
  const date = new Date(year, month, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (date < today) return 'past' as const
  if (date.getDay() === 0) return 'unavailable' as const

  const sessionSeed = sessionLabel.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const blocked = [2, 9, 16, 23, 30].map((value) => (value + sessionSeed) % 28 || 1)

  if (blocked.includes(day)) return 'unavailable' as const

  return 'available' as const
}

export function markCelebrationPending() {
  sessionStorage.setItem(CELEBRATION_PENDING_KEY, '1')
}

export function consumeCelebrationPending() {
  const pending = sessionStorage.getItem(CELEBRATION_PENDING_KEY) === '1'
  sessionStorage.removeItem(CELEBRATION_PENDING_KEY)
  return pending
}

export function getGroupPricingTable() {
  return GROUP_PRICING
}

export { formatInr }
