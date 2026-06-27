const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'
const PENDING_PHONE_KEY = 'doorstep-yoga-pending-phone'
const AUTH_TOKEN_KEY = 'doorstep-yoga-auth-token'

type SendOtpResponse = {
  message: string
  otp?: string
}

type VerifyOtpResponse = {
  message: string
  token: string
  user: {
    id: string
    phone: string
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { message?: string }
  if (!response.ok) {
    throw new Error(payload.message ?? 'Request failed.')
  }
  return payload as T
}

export function getPendingPhone() {
  return sessionStorage.getItem(PENDING_PHONE_KEY)
}

export function clearPendingPhone() {
  sessionStorage.removeItem(PENDING_PHONE_KEY)
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export async function sendOtp(phone: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  })
  const payload = await parseResponse<SendOtpResponse>(response)
  sessionStorage.setItem(PENDING_PHONE_KEY, phone)
  return payload
}

export async function verifyOtp(phone: string, otp: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  })
  const payload = await parseResponse<VerifyOtpResponse>(response)
  localStorage.setItem(AUTH_TOKEN_KEY, payload.token)
  clearPendingPhone()
  return payload
}

export async function resendOtp() {
  const phone = getPendingPhone()
  if (!phone) throw new Error('Session expired. Please enter phone number again.')
  return sendOtp(phone)
}
