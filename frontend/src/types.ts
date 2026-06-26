export type Service = {
  id: string
  name: string
  description: string
  duration: number
  icon: string
}

export type Trainer = {
  id: string
  name: string
  experienceYears: number
  languages: string[]
  specializations: string[]
  rating: number
  sessions: number
  pricePerSession: number
  availability: string[]
  style: 'Hatha' | 'Vinyasa' | 'Power' | 'Yin'
  gender: 'Female' | 'Male'
  verified: boolean
}

export type Address = {
  id: string
  title: string
  line1: string
  city: string
  isDefault?: boolean
}

export type NotificationItem = {
  id: string
  title: string
  body: string
  read: boolean
  time: string
}

export type Booking = {
  id: string
  trainerId: string
  serviceId: string
  addressId: string
  date: string
  time: string
  duration: number
  amount: number
  status: 'upcoming' | 'completed' | 'cancelled'
}

export type User = {
  id: string
  name: string
  phone: string
  email: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
}

export type TrainerFilters = {
  gender: 'Any' | 'Female' | 'Male'
  style: 'All' | 'Hatha' | 'Vinyasa' | 'Power' | 'Yin'
  availableToday: boolean
  minExperience: number
}

export type BookingDraft = {
  serviceId: string | null
  trainerId: string | null
  addressId: string | null
  date: string | null
  time: string | null
  duration: 60 | 90
  recurring: boolean
  paymentStatus: 'idle' | 'paid' | 'failed'
}
