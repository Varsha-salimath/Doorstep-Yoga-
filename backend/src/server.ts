import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { config } from './config'
import { authRouter } from './routes/auth'
import { bookingsRouter } from './routes/bookings'
import { catalogRouter } from './routes/catalog'

const app = express()
const port = config.PORT
const clientOrigin = config.CLIENT_ORIGIN

app.use(
  cors({
    origin: clientOrigin,
  }),
)
app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'doorstep-yoga-backend',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRouter)
app.use('/api/catalog', catalogRouter)
app.use('/api/bookings', bookingsRouter)

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(error)
  res.status(500).json({ message: 'Internal server error.' })
})

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Doorstep Yoga backend running on http://localhost:${port}`)
})
