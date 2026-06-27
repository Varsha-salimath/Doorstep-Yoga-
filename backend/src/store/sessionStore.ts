import { randomBytes } from 'crypto'

type Session = {
  phone: string
  createdAt: number
}

const sessions = new Map<string, Session>()

export function createSession(phone: string) {
  const token = randomBytes(24).toString('hex')
  sessions.set(token, {
    phone,
    createdAt: Date.now(),
  })
  return token
}

export function validateSession(token: string) {
  return sessions.has(token)
}
