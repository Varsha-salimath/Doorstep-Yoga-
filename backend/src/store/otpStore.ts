import { config } from '../config'

type PendingOtp = {
  otp: string
  expiresAt: number
}

const otpByPhone = new Map<string, PendingOtp>()

function generateOtp() {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
}

export function createOtp(phone: string) {
  const otp = generateOtp()
  otpByPhone.set(phone, {
    otp,
    expiresAt: Date.now() + config.OTP_TTL_MS,
  })
  return otp
}

export function verifyOtp(phone: string, otp: string) {
  const pending = otpByPhone.get(phone)
  if (!pending) {
    return { ok: false, reason: 'No OTP requested for this phone number.' }
  }
  if (pending.expiresAt <= Date.now()) {
    otpByPhone.delete(phone)
    return { ok: false, reason: 'OTP expired. Please request a new one.' }
  }
  if (pending.otp !== otp) {
    return { ok: false, reason: 'Incorrect OTP.' }
  }
  otpByPhone.delete(phone)
  return { ok: true }
}
