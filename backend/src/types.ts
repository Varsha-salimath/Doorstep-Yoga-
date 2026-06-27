export type ServiceCategory =
  | '1-on-1 Yoga'
  | 'Prenatal Yoga'
  | 'Couples Yoga'
  | 'Therapy Yoga'
  | 'Meditation'

export type Trainer = {
  id: string
  name: string
  specialty: string
  experience: string
  category: ServiceCategory
  image: string
  rating: number
}

export type Booking = {
  id: string
  phone: string
  trainerId: string
  date: string
  time: string
  durationMinutes: 60 | 90
  location: string
  status: 'confirmed'
  createdAt: string
}
