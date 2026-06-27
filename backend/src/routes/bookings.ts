import { randomUUID } from 'crypto'
import { Router } from 'express'
import { z } from 'zod'
import { trainers } from '../data'
import { validateSession } from '../store/sessionStore'
import type { Booking } from '../types'

export const bookingsRouter = Router()

const bookings: Booking[] = []

const createBookingSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number.'),
  trainerId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  durationMinutes: z.union([z.literal(60), z.literal(90)]),
  location: z.string().min(3),
})

bookingsRouter.use((req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required.' })
  }
  const token = header.replace('Bearer ', '').trim()
  if (!validateSession(token)) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
  return next()
})

bookingsRouter.get('/', (_req, res) => {
  res.json({ bookings })
})

bookingsRouter.post('/', (req, res) => {
  const parsed = createBookingSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message ?? 'Invalid booking payload.',
    })
  }

  const trainer = trainers.find((item) => item.id === parsed.data.trainerId)
  if (!trainer) {
    return res.status(404).json({ message: 'Trainer not found.' })
  }

  const booking: Booking = {
    id: `bk_${randomUUID()}`,
    ...parsed.data,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
  bookings.push(booking)

  return res.status(201).json({
    message: 'Booking confirmed.',
    booking,
  })
})
