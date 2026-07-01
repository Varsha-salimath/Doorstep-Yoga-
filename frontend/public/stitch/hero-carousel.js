(function initHeroCarousel() {
  const carousel = document.getElementById('hero-carousel')
  if (!carousel) return

  const slides = Array.from(carousel.querySelectorAll('.hero-slide'))
  const dots = Array.from(carousel.querySelectorAll('.hero-carousel-dot'))
  const cta = document.getElementById('hero-carousel-cta')
  if (!slides.length || !cta) return

  const AUTO_MS = 4500
  const PAUSE_MS = 5000
  let current = 0
  let autoTimer = null
  let resumeTimer = null
  let touchStartX = 0

  function updateCta(slide) {
    cta.textContent = slide.dataset.cta || 'Book Now'
    cta.setAttribute('data-doorstep-nav', slide.dataset.nav || '/trainers')
    cta.classList.remove('hero-cta-animate')
    void cta.offsetWidth
    cta.classList.add('hero-cta-animate')
  }

  function goTo(index, userInitiated = false) {
    const nextIndex = (index + slides.length) % slides.length
    if (nextIndex === current) return

    slides[current].classList.remove('is-active')
    dots[current]?.classList.remove('is-active')
    dots[current]?.setAttribute('aria-current', 'false')

    current = nextIndex

    slides[current].classList.add('is-active')
    dots[current]?.classList.add('is-active')
    dots[current]?.setAttribute('aria-current', 'true')
    updateCta(slides[current])

    if (userInitiated) pauseAuto()
  }

  function next(userInitiated = false) {
    goTo(current + 1, userInitiated)
  }

  function prev(userInitiated = false) {
    goTo(current - 1, userInitiated)
  }

  function startAuto() {
    stopAuto()
    autoTimer = window.setInterval(() => next(false), AUTO_MS)
  }

  function stopAuto() {
    if (autoTimer) {
      window.clearInterval(autoTimer)
      autoTimer = null
    }
  }

  function pauseAuto() {
    stopAuto()
    if (resumeTimer) window.clearTimeout(resumeTimer)
    resumeTimer = window.setTimeout(startAuto, PAUSE_MS)
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goTo(index, true))
  })

  carousel.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.changedTouches[0]?.screenX ?? 0
      pauseAuto()
    },
    { passive: true },
  )

  carousel.addEventListener(
    'touchend',
    (event) => {
      const touchEndX = event.changedTouches[0]?.screenX ?? 0
      const delta = touchStartX - touchEndX
      if (Math.abs(delta) > 42) {
        if (delta > 0) next(true)
        else prev(true)
        return
      }
      pauseAuto()
    },
    { passive: true },
  )

  carousel.addEventListener('mouseenter', pauseAuto)
  carousel.addEventListener('mouseleave', () => {
    if (resumeTimer) window.clearTimeout(resumeTimer)
    resumeTimer = window.setTimeout(startAuto, 1200)
  })

  carousel.addEventListener('pointerdown', pauseAuto)

  slides.forEach((slide, index) => {
    const background = slide.querySelector('.hero-slide-bg')
    if (!background || index === 0) return
    const imageUrl = background.dataset.bg
    if (!imageUrl) return

    const loadImage = () => {
      background.style.backgroundImage = `url('${imageUrl}')`
      background.removeAttribute('data-bg')
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            loadImage()
            observer.disconnect()
          }
        },
        { root: null, threshold: 0.2 },
      )
      observer.observe(slide)
      return
    }

    loadImage()
  })

  updateCta(slides[0])
  startAuto()
})()
