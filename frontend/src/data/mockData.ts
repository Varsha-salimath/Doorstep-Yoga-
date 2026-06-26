import type {
  Address,
  Booking,
  NotificationItem,
  Service,
  Trainer,
  User,
} from '../types'

export const services: Service[] = [
  {
    id: 'yoga',
    name: 'Yoga',
    description: 'Classical guided yoga for flexibility and calm.',
    duration: 60,
    icon: '🧘',
  },
  {
    id: 'meditation',
    name: 'Meditation',
    description: 'Mindfulness and breath-led relaxation practice.',
    duration: 45,
    icon: '🌿',
  },
  {
    id: 'prenatal',
    name: 'Prenatal Yoga',
    description: 'Safe and supportive yoga for expecting mothers.',
    duration: 60,
    icon: '🤍',
  },
  {
    id: 'power',
    name: 'Power Yoga',
    description: 'High-energy session for strength and endurance.',
    duration: 60,
    icon: '🔥',
  },
  {
    id: 'kids',
    name: 'Kids Yoga',
    description: 'Playful yoga routine focused on focus and posture.',
    duration: 45,
    icon: '🌈',
  },
  {
    id: 'weight',
    name: 'Weight Loss Yoga',
    description: 'Goal-driven yoga sessions for active fat burn.',
    duration: 60,
    icon: '⚡',
  },
]

export const trainers: Trainer[] = [
  {
    id: 'maya',
    name: 'Maya Sharma',
    experienceYears: 8,
    languages: ['English', 'Hindi'],
    specializations: ['Vinyasa', 'Mindfulness', 'Breathwork'],
    rating: 4.9,
    sessions: 120,
    pricePerSession: 1200,
    availability: ['07:30 AM', '11:00 AM', '07:30 PM'],
    style: 'Vinyasa',
    gender: 'Female',
    verified: true,
  },
  {
    id: 'vikram',
    name: 'Vikram S.',
    experienceYears: 10,
    languages: ['English', 'Hindi'],
    specializations: ['Ashtanga', 'Pranayama'],
    rating: 4.8,
    sessions: 210,
    pricePerSession: 1200,
    availability: ['07:00 AM', '03:00 PM'],
    style: 'Power',
    gender: 'Male',
    verified: true,
  },
  {
    id: 'meera',
    name: 'Meera K.',
    experienceYears: 4,
    languages: ['English', 'Hindi'],
    specializations: ['Yin', 'Hatha'],
    rating: 4.7,
    sessions: 86,
    pricePerSession: 950,
    availability: ['07:30 PM', '08:00 PM'],
    style: 'Yin',
    gender: 'Female',
    verified: true,
  },
  {
    id: 'rohan',
    name: 'Rohan P.',
    experienceYears: 15,
    languages: ['English', 'Hindi'],
    specializations: ['Therapeutic', 'Iyengar'],
    rating: 5,
    sessions: 300,
    pricePerSession: 1500,
    availability: ['08:00 AM', '06:00 PM'],
    style: 'Hatha',
    gender: 'Male',
    verified: true,
  },
]

export const addresses: Address[] = [
  {
    id: 'home',
    title: 'Home',
    line1: 'B-12, Green Park Main',
    city: 'New Delhi',
    isDefault: true,
  },
  {
    id: 'office',
    title: 'Office',
    line1: 'Cyber City, Phase 2',
    city: 'Gurugram',
  },
]

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Session Confirmed',
    body: 'Your Vinyasa session with Maya is confirmed for tomorrow.',
    read: false,
    time: '2h ago',
  },
  {
    id: 'n2',
    title: 'Trainer Arriving',
    body: 'Trainer is en route. Track live location in your booking details.',
    read: true,
    time: '1d ago',
  },
]

export const currentUser: User = {
  id: 'u1',
  name: 'Aarav Malhotra',
  phone: '9876543210',
  email: 'aarav@example.com',
  level: 'Intermediate',
}

export const bookingHistory: Booking[] = [
  {
    id: 'b1',
    trainerId: 'maya',
    serviceId: 'yoga',
    addressId: 'home',
    date: '2026-06-28',
    time: '07:30 AM',
    duration: 60,
    amount: 1200,
    status: 'upcoming',
  },
  {
    id: 'b2',
    trainerId: 'vikram',
    serviceId: 'power',
    addressId: 'office',
    date: '2026-06-18',
    time: '06:00 PM',
    duration: 60,
    amount: 1200,
    status: 'completed',
  },
]
