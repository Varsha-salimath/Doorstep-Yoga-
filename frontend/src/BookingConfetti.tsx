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

const COLORS = ['#4e604f', '#b8ccb7', '#d4e8d2', '#e9c349', '#8d4d35', '#fbf9f4']

export function BookingConfetti({ durationMs = 1600 }: { durationMs?: number }) {
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

    for (let index = 0; index < 42; index += 1) {
      particles.push({
        x: width * (0.25 + Math.random() * 0.5),
        y: height * (0.18 + Math.random() * 0.12),
        size: 4 + Math.random() * 5,
        speedX: (Math.random() - 0.5) * 2.4,
        speedY: 1.2 + Math.random() * 2.8,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0],
        opacity: 0.55 + Math.random() * 0.45,
      })
    }

    const startedAt = performance.now()

    const draw = (now: number) => {
      if (!running) return

      context.clearRect(0, 0, width, height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.rotation += particle.spin
        particle.speedY += 0.02

        context.save()
        context.translate(particle.x, particle.y)
        context.rotate(particle.rotation)
        context.globalAlpha = particle.opacity * Math.max(0, 1 - (now - startedAt) / durationMs)
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

  return <canvas ref={canvasRef} className="booking-confetti-canvas" aria-hidden="true" />
}
