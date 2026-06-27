import { Router } from 'express'
import { z } from 'zod'
import { config } from '../config'
import { createOtp, verifyOtp } from '../store/otpStore'
import { createSession } from '../store/sessionStore'

export const authRouter = Router()

const sendOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Phone must be a valid 10-digit mobile number.'),
})

const verifyOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Phone must be a valid 10-digit mobile number.'),
  otp: z.string().regex(/^\d{4}$/, 'OTP must be a 4-digit number.'),
})

authRouter.post('/send-otp', (req, res) => {
  const parsed = sendOtpSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message ?? 'Invalid phone number.',
    })
  }

  const otp = createOtp(parsed.data.phone)
  const response: Record<string, unknown> = {
    message: 'OTP generated successfully.',
  }

  // Development helper for dummy OTP flow.
  if (config.OTP_EXPOSE_IN_RESPONSE || config.NODE_ENV !== 'production') {
    response.otp = otp
  }

  return res.json(response)
})

authRouter.post('/verify-otp', (req, res) => {
  const parsed = verifyOtpSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message ?? 'Invalid request body.',
    })
  }

  const result = verifyOtp(parsed.data.phone, parsed.data.otp)
  if (!result.ok) {
    return res.status(401).json({ message: result.reason })
  }

  return res.json({
    message: 'OTP verified successfully.',
    token: createSession(parsed.data.phone),
    user: {
      id: `user-${parsed.data.phone}`,
      phone: parsed.data.phone,
    },
  })
})
