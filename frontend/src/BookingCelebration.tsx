import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  rotation: number
  spin: number
  color: string
  opacity: number
}

const COLORS = ['#4e604f', '#b8ccb7', '#d4e8d2', '#e9c349', '#8d4d35', '#fbf9f4', '#667a66']

const BALLOON_COLORS = ['#4e604f', '#b8ccb7', '#dbead9', '#e9c349']

export function BookingCelebration({ durationMs = 2600 }: { durationMs?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frameId = 0
    let running = true
    const particles: Particle[] = []
    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    canvas.width = width
    canvas.height = height

    for (let index = 0; index < 64; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: -12 - Math.random() * 80,
        size: 4 + Math.random() * 6,
        speedX: (Math.random() - 0.5) * 2.8,
        speedY: 2.4 + Math.random() * 3.6,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.14,
        color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0],
        opacity: 0.6 + Math.random() * 0.4,
      })
    }

    const startedAt = performance.now()

    const draw = (now: number) => {
      if (!running) return

      context.clearRect(0, 0, width, height)
      const fade = Math.max(0, 1 - (now - startedAt) / durationMs)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.rotation += particle.spin
        particle.speedY += 0.03

        context.save()
        context.translate(particle.x, particle.y)
        context.rotate(particle.rotation)
        context.globalAlpha = particle.opacity * fade
        context.fillStyle = particle.color
        context.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2)
        context.restore()
      })

      if (now - startedAt < durationMs) {
        frameId = requestAnimationFrame(draw)
      }
    }

    frameId = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(frameId)
    }
  }, [durationMs])

  return (
    <div className="booking-celebration-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="booking-confetti-canvas" />
      <div className="booking-balloons">
        {BALLOON_COLORS.map((color, index) => (
          <span
            key={color}
            className="booking-balloon"
            style={{
              left: `${18 + index * 22}%`,
              background: color,
              animationDelay: `${index * 120}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
