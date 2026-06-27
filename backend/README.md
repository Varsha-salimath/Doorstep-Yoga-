# Doorstep Yoga Backend

Simple Express + TypeScript backend for Doorstep Yoga.

## Run locally

1. Copy `.env.example` to `.env`
2. Install deps:
   - `npm install`
3. Start dev server:
   - `npm run dev`

Backend runs on `http://localhost:4000` by default.

## API endpoints

- `GET /health`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `GET /api/catalog/services`
- `GET /api/catalog/trainers`
- `GET /api/catalog/trainers/:id`
- `GET /api/bookings`
- `POST /api/bookings`

## Notes

- OTP is currently **dummy/in-memory**.
- In non-production (or when `OTP_EXPOSE_IN_RESPONSE=true`), `send-otp` returns OTP for QA.
- `bookings` endpoints require `Authorization: Bearer <token>` from `verify-otp`.
- Data is in-memory; restart clears OTPs, sessions, and bookings.
