const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'
const PENDING_PHONE_KEY = 'doorstep-yoga-pending-phone'
const AUTH_TOKEN_KEY = 'doorstep-yoga-auth-token'
const LOCAL_PENDING_OTP_KEY = 'doorstep-yoga-local-otp'

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

type LocalPendingOtp = {
  phone: string
  otp: string
  expiresAt: number
}

const LOCAL_OTP_TTL_MS = 5 * 60 * 1000

function isNetworkError(error: unknown) {
  return error instanceof TypeError
}

function generateLocalOtp() {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
}

function saveLocalPendingOtp(phone: string, otp: string) {
  const payload: LocalPendingOtp = {
    phone,
    otp,
    expiresAt: Date.now() + LOCAL_OTP_TTL_MS,
  }
  sessionStorage.setItem(LOCAL_PENDING_OTP_KEY, JSON.stringify(payload))
}

function readLocalPendingOtp() {
  const raw = sessionStorage.getItem(LOCAL_PENDING_OTP_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as LocalPendingOtp
    if (!parsed.phone || !parsed.otp || !parsed.expiresAt) return null
    return parsed
  } catch {
    return null
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
  sessionStorage.removeItem(LOCAL_PENDING_OTP_KEY)
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function isAuthenticated() {
  const token = getAuthToken()
  return typeof token === 'string' && token.trim().length > 0
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  clearPendingPhone()
}

export async function sendOtp(phone: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    const payload = await parseResponse<SendOtpResponse>(response)
    sessionStorage.setItem(PENDING_PHONE_KEY, phone)
    return payload
  } catch (error) {
    if (!isNetworkError(error)) throw error

    // Fallback: local dummy OTP if backend is unavailable.
    const otp = generateLocalOtp()
    saveLocalPendingOtp(phone, otp)
    sessionStorage.setItem(PENDING_PHONE_KEY, phone)
    return {
      message: 'Backend unreachable. Using local dummy OTP mode.',
      otp,
    }
  }
}

export async function verifyOtp(phone: string, otp: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    })
    const payload = await parseResponse<VerifyOtpResponse>(response)
    localStorage.setItem(AUTH_TOKEN_KEY, payload.token)
    clearPendingPhone()
    return payload
  } catch (error) {
    if (!isNetworkError(error)) throw error

    const pending = readLocalPendingOtp()
    if (!pending || pending.phone !== phone) {
      throw new Error('No OTP found. Please request OTP again.')
    }
    if (pending.expiresAt <= Date.now()) {
      clearPendingPhone()
      throw new Error('OTP expired. Please request a new OTP.')
    }
    if (pending.otp !== otp) {
      throw new Error('Incorrect OTP. Please try again.')
    }

    const payload: VerifyOtpResponse = {
      message: 'OTP verified in local dummy mode.',
      token: `local-demo-token-${phone}-${Date.now()}`,
      user: {
        id: `local-user-${phone}`,
        phone,
      },
    }
    localStorage.setItem(AUTH_TOKEN_KEY, payload.token)
    clearPendingPhone()
    return payload
  }
}

export async function resendOtp() {
  const phone = getPendingPhone()
  if (!phone) throw new Error('Session expired. Please enter phone number again.')
  return sendOtp(phone)
}
