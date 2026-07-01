export type Trainer = {
  name: string
  specialty: string
  experience: string
  category: string
  image: string
}

export const HOME_LOCATION_LABEL = 'B-12, Green Park Main, New Delhi'

export const featuredTrainer: Trainer = {
  name: 'Maya Thompson',
  specialty: 'Senior Yoga & Mindfulness Facilitator',
  experience: '9 years experience',
  category: '1-on-1 Yoga',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBTYLSJ2ZW2JUogq7mFoDbF4wXEK9TX5GhC_1ZJAGOx99UsJXm4MM5zHusdyyg6MLlnQp6QH1s4cSyLm6B_8nhOOfLUGwRxKVO8Bp1u24dPC8MDXlTkgI5QdBzRRhOi5qABgoJlzLHbGw2p3rBm5hjWAOmXvAZ-Ej2xKcdBzhG4WgbA6pNV23TTxcmMa-6X_IcybpQsllv2GgizzYI9FgmztnqvGLx-8DDsfgZ3ZATpbcgPvwmNPXYUghIBpswYFv2qKw617lNhcMo',
}

export const TRAINER_CATEGORIES = [
  'All Trainers',
  '1-on-1 Yoga',
  'Prenatal Yoga',
  'Couples Yoga',
  'Therapy Yoga',
  'Meditation',
] as const

export const trainers: Trainer[] = [
  {
    name: 'Ishita Kapur',
    specialty: 'Vinyasa & Hatha Expert',
    experience: '8 years experience',
    category: '1-on-1 Yoga',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxOvBeCOKeWkQTX2rCUclEBML5LAxRI5BNNW4L4GyK5a-HiSRg01dVukkQyBwzqwCdKcRda9ArpjlEmuJ1LwcB_hkTSyc8yeReVCs5Z4in1AsNgPq0iNvjKWrtnIr273zrdAAXxWr170QSaMo5Siw_bl9xUd6ojuJ4JIrvDUqQXkHbcAsr2K1km8HHGCsy3HGAHIogHR-5lK45Neq1HMU3EkQtXs0jBGOrKvpkI8LXlybxxZvMhHuKVpo6ySIfVYBJC2DLm69j6Kw',
  },
  {
    name: 'Arjun Mehta',
    specialty: 'Therapy & Healing',
    experience: '11 years experience',
    category: 'Therapy Yoga',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYTNXDhEq74jfJFFMQ5GKdMK2J5HyT13wNgJFEZiS0boSR8x5n4e0OwFj0KL2FeQa1cfNt_xg61NKMP-6CwHpCdRiFxALsBy5f24zPx5T5Mfl9YgkMcWk56sIrTLJBzCgkvxKMNG6DBXHK6tk4Z7MwjfyoHKQZXhMDsR6_BAG4_YBA6IzI3SLLryesu6MGiMjiTAAQcBh0IxrkW7ZnZyp4LutIrZlKnpO1CMCBPW5iEPG8TLoOqtl_TVsa5bXzanmhgHkVODMbmgs',
  },
  {
    name: 'Sanya Verma',
    specialty: 'Mindfulness & Breathwork',
    experience: '6 years experience',
    category: 'Meditation',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Lakshmi Nair',
    specialty: 'Prenatal Yoga Specialist',
    experience: '9 years experience',
    category: 'Prenatal Yoga',
    image:
      'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rohan Iyer',
    specialty: 'Couples Flow Coach',
    experience: '7 years experience',
    category: 'Couples Yoga',
    image:
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Neha Rao',
    specialty: 'Private Alignment Coach',
    experience: '10 years experience',
    category: '1-on-1 Yoga',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kavya Menon',
    specialty: 'Prenatal Breath Coach',
    experience: '5 years experience',
    category: 'Prenatal Yoga',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Aman Bedi',
    specialty: 'Partner Flow Specialist',
    experience: '8 years experience',
    category: 'Couples Yoga',
    image:
      'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Priya Dutta',
    specialty: 'Therapeutic Mobility Coach',
    experience: '12 years experience',
    category: 'Therapy Yoga',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Devika Shah',
    specialty: 'Guided Meditation Expert',
    experience: '7 years experience',
    category: 'Meditation',
    image:
      'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Karan Malhotra',
    specialty: 'Breathwork & Pranayama',
    experience: '9 years experience',
    category: 'Meditation',
    image:
      'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ananya Desai',
    specialty: 'Ashtanga & Power Yoga',
    experience: '6 years experience',
    category: '1-on-1 Yoga',
    image:
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vikram Singh',
    specialty: 'Hatha Foundation Coach',
    experience: '14 years experience',
    category: '1-on-1 Yoga',
    image:
      'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Meera Joshi',
    specialty: 'Flexibility & Strength',
    experience: '5 years experience',
    category: '1-on-1 Yoga',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Divya Krishnan',
    specialty: 'Gentle Prenatal Guide',
    experience: '8 years experience',
    category: 'Prenatal Yoga',
    image:
      'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Aditya Kapoor',
    specialty: 'Partner Balance Expert',
    experience: '6 years experience',
    category: 'Couples Yoga',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYTNXDhEq74jfJFFMQ5GKdMK2J5HyT13wNgJFEZiS0boSR8x5n4e0OwFj0KL2FeQa1cfNt_xg61NKMP-6CwHpCdRiFxALsBy5f24zPx5T5Mfl9YgkMcWk56sIrTLJBzCgkvxKMNG6DBXHK6tk4Z7MwjfyoHKQZXhMDsR6_BAG4_YBA6IzI3SLLryesu6MGiMjiTAAQcBh0IxrkW7ZnZyp4LutIrZlKnpO1CMCBPW5iEPG8TLoOqtl_TVsa5bXzanmhgHkVODMbmgs',
  },
  {
    name: 'Dr. Nisha Pillai',
    specialty: 'Injury Recovery Yoga',
    experience: '15 years experience',
    category: 'Therapy Yoga',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rahul Khanna',
    specialty: 'Pain Relief Specialist',
    experience: '10 years experience',
    category: 'Therapy Yoga',
    image:
      'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tara Mehta',
    specialty: 'Stress Relief & Yoga Nidra',
    experience: '8 years experience',
    category: 'Meditation',
    image:
      'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kabir Anand',
    specialty: 'Morning Flow Specialist',
    experience: '11 years experience',
    category: '1-on-1 Yoga',
    image:
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&auto=format&fit=crop&q=80',
  },
]

const SELECTED_TRAINER_KEY = 'doorstep-yoga-selected-trainer'

export function getTrainerByName(name: string) {
  return trainers.find((trainer) => trainer.name === name)
}

export function saveSelectedTrainer(trainer: Trainer) {
  sessionStorage.setItem(SELECTED_TRAINER_KEY, JSON.stringify(trainer))
}

export function getSelectedTrainer(): Trainer {
  const raw = sessionStorage.getItem(SELECTED_TRAINER_KEY)
  if (!raw) return featuredTrainer

  try {
    const parsed = JSON.parse(raw) as Trainer
    return parsed?.name ? parsed : featuredTrainer
  } catch {
    return featuredTrainer
  }
}

export function getCalendarMonthLabel(date = new Date()) {
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export function formatBookingDate(day: number, date = new Date()) {
  const month = date.toLocaleDateString('en-IN', { month: 'long' })
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

export const GROUP_PRICING: Record<number, number> = {
  2: 700,
  4: 1100,
  6: 1500,
  8: 1850,
  10: 2200,
}

export function calculatePrivateSessionPrice(duration: number, isRecurring: boolean) {
  const base = duration === 60 ? 1200 : 1700
  const discount = isRecurring ? 150 : 0
  const serviceFee = 50
  const total = base - discount + serviceFee
  return { base, discount, serviceFee, total }
}

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export type CalendarDayStatus = 'past' | 'unavailable' | 'available'

export function buildCalendarCells(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<{ key: string; day: number | null }> = []

  for (let index = 0; index < firstDay; index += 1) {
    cells.push({ key: `pad-${index}`, day: null })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ key: `day-${day}`, day })
  }

  return cells
}

export function getDateAvailabilityStatus(year: number, month: number, day: number): CalendarDayStatus {
  const date = new Date(year, month, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (date < today) return 'past'
  if (date.getDay() === 0) return 'unavailable'
  if ([2, 9, 16, 23, 30].includes(day)) return 'unavailable'

  return 'available'
}

export function getMonthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
}

export function formatBookingDateFromParts(day: number, year: number, month: number) {
  const monthName = new Date(year, month, day).toLocaleDateString('en-IN', { month: 'long' })
  return `${monthName} ${day}, ${year}`
}
