import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

function normalizeOrigin(value: string) {
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/+|\/+$/g, '')}`
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z
    .string()
    .default('http://localhost:5175')
    .transform(normalizeOrigin)
    .pipe(z.string().url()),
  OTP_TTL_MS: z.coerce.number().int().positive().default(5 * 60 * 1000),
  OTP_EXPOSE_IN_RESPONSE: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`)
}

export const config = parsed.data
