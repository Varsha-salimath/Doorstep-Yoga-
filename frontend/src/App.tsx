import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import {
  clearPendingPhone,
  clearAuth,
  getPendingPhone,
  isAuthenticated,
  resendOtp,
  sendOtp,
  verifyOtp,
} from './api'
import {
  BookingFlowShell,
  BookingStickyCta,
  BookingSuccessScreen,
  ScheduleScreen,
} from './bookingFlow'
import {
  defaultLocationLabel,
  defaultTrainerImage,
  getBookingDetails,
  type BookingDetails,
} from './booking'
import { FavoriteHeart } from './FavoriteHeart'
import { getFavorites, toggleFavorite, type FavoriteTrainer } from './favorites'
import {
  getBookingSessionDraft,
  saveGroupBookingSession,
  savePrivateSessionDraft,
  SESSION_TRAINER_CATEGORY,
} from './sessionBooking'
import {
  featuredTrainer,
  formatBookingDateFromParts,
  formatInr,
  getSelectedTrainer,
  GROUP_PRICING,
  saveSelectedTrainer,
  TRAINER_CATEGORIES,
  trainers,
  type Trainer,
} from './trainers'
import { ToastHost } from './ToastHost'
import { showToast } from './toast'
import './App.css'

type Hotspot = {
  to?: string
  label: string
  style: CSSProperties
  action?: 'share'
  variant?: 'preferences-fab'
}

const stitchScreenUrl = (folder: string) => `/stitch/${folder}/code.html`

function Screen({
  htmlSrc,
  alt,
  hotspots,
  showBottomNav = true,
  allowEmbedInteraction = true,
  lockViewport = false,
  cohesiveBottomNav = false,
  bookingFlow = false,
  bookingCta,
}: {
  htmlSrc: string
  alt: string
  hotspots?: Hotspot[]
  showBottomNav?: boolean
  allowEmbedInteraction?: boolean
  lockViewport?: boolean
  cohesiveBottomNav?: boolean
  bookingFlow?: boolean
  bookingCta?: { label: string; disabled?: boolean; onClick: () => void }
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [embedLoaded, setEmbedLoaded] = useState(false)

  useEffect(() => {
    setEmbedLoaded(false)
  }, [htmlSrc, location.pathname])

  useEffect(() => {
    async function onEmbedMessage(event: MessageEvent) {
      if (!event.data || typeof event.data !== 'object') return

      if (event.data.type === 'doorstep-navigate' && typeof event.data.path === 'string') {
        navigate(event.data.path)
        return
      }

      if (event.data.type === 'doorstep-share') {
        const shareData = {
          title: 'Doorstep Yoga Trainer',
          text: 'Check out this trainer profile on Doorstep Yoga.',
          url: window.location.href,
        }
        if (navigator.share) {
          await navigator.share(shareData)
        } else {
          await navigator.clipboard.writeText(window.location.href)
        }
        return
      }

      if (event.data.type === 'doorstep-logout') {
        clearAuth()
        navigate('/login')
        return
      }

      if (event.data.type === 'doorstep-toast' && typeof event.data.message === 'string') {
        showToast(event.data.message)
        return
      }

      if (event.data.type === 'doorstep-favorite-toggle') {
        const result = toggleFavorite({
          name: featuredTrainer.name,
          specialty: featuredTrainer.specialty,
          image: featuredTrainer.image,
        })
        showToast(result === 'added' ? 'Added to Favorites ❤️' : 'Removed from Favorites')
      }
    }

    window.addEventListener('message', onEmbedMessage)
    return () => window.removeEventListener('message', onEmbedMessage)
  }, [navigate])

  useEffect(() => {
    if (!bookingFlow || !embedLoaded) return
    iframeRef.current?.contentWindow?.postMessage({ type: 'doorstep-booking-mode' }, '*')
  }, [bookingFlow, embedLoaded, htmlSrc])

  return (
    <div className={`app-bg ${lockViewport || bookingFlow ? 'app-bg-viewport-lock' : ''}`}>
      <main
        className={`phone-shell page-shell page-shell-embedded${cohesiveBottomNav ? ' page-shell-cohesive-nav' : ''}${bookingFlow ? ' page-shell-booking-flow' : ''}`}
      >
        <div
          className={`screen-wrap ${showBottomNav ? 'screen-wrap-with-nav' : ''}${bookingFlow ? ' screen-wrap-booking-flow' : ''}`}
        >
          <iframe
            ref={iframeRef}
            key={`${htmlSrc}-${location.pathname}`}
            src={htmlSrc}
            title={alt}
            className={`screen-embed ${allowEmbedInteraction ? '' : 'screen-embed-no-interaction'}`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={() => setEmbedLoaded(true)}
          />
          {!embedLoaded ? <div className="embed-loading" aria-hidden="true" /> : null}
          {hotspots?.map((spot, index) => (
            <button
              type="button"
              key={`${spot.label}-${index}`}
              onClick={async () => {
                if (spot.action === 'share') {
                  const shareData = {
                    title: 'Doorstep Yoga Trainer',
                    text: 'Check out this trainer profile on Doorstep Yoga.',
                    url: window.location.href,
                  }
                  if (navigator.share) {
                    await navigator.share(shareData)
                  } else {
                    await navigator.clipboard.writeText(window.location.href)
                  }
                  return
                }

                if (spot.to) navigate(spot.to)
              }}
              aria-label={spot.label}
              className={`hotspot ${spot.variant === 'preferences-fab' ? 'hotspot-preferences-fab' : ''}`}
              style={spot.style}
            >
              {spot.variant === 'preferences-fab' ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h8M16 7h4M10 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10 10h-8M8 17H4m14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                </svg>
              ) : null}
            </button>
          ))}
        </div>
        {bookingFlow && bookingCta ? (
          <BookingStickyCta
            label={bookingCta.label}
            disabled={bookingCta.disabled}
            onClick={bookingCta.onClick}
          />
        ) : null}
        {showBottomNav && !bookingFlow ? <PersistentBottomNav /> : null}
      </main>
    </div>
  )
}

function PersistentBottomNav() {
  const tabs = [
    { to: '/home', label: 'Home', icon: 'home' },
    { to: '/trainers', label: 'Search', icon: 'search' },
    { to: '/favorites', label: 'Favorites', icon: 'heart' },
    { to: '/account', label: 'Account', icon: 'user' },
  ]

  return (
    <nav className="persistent-nav" aria-label="Primary">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `persistent-tab ${isActive ? 'active' : ''}`}
        >
          <span className="persistent-tab-chip">
            <TabIcon name={tab.icon} />
            <small>{tab.label}</small>
          </span>
        </NavLink>
      ))}
    </nav>
  )
}

function TabIcon({ name }: { name: string }) {
  if (name === 'home') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10.2 12 4l8 6.2V20h-5v-6h-6v6H4v-9.8Z" />
      </svg>
    )
  }
  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m20 20-4-4m1.7-5.2a6.8 6.8 0 1 1-13.6 0 6.8 6.8 0 0 1 13.6 0Z" />
      </svg>
    )
  }
  if (name === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 20-1.2-1.1C6.2 14.8 3.5 12.3 3.5 9.3A4.3 4.3 0 0 1 7.8 5a4.7 4.7 0 0 1 4.2 2.4A4.7 4.7 0 0 1 16.2 5a4.3 4.3 0 0 1 4.3 4.3c0 3-2.7 5.5-7.3 9.6L12 20Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12.5a3.7 3.7 0 1 0 0-7.4 3.7 3.7 0 0 0 0 7.4Zm0 2.4c-3.6 0-6.5 2-6.5 4.5V20h13v-.6c0-2.5-2.9-4.5-6.5-4.5Z" />
    </svg>
  )
}

function LoginScreen() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const isValid = /^\d{10}$/.test(phone)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isValid) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    try {
      setIsSending(true)
      setError('')
      const response = await sendOtp(phone)
      // In dummy mode backend can expose OTP for QA.
      if (response.otp) {
        window.alert(`Your OTP is ${response.otp}`)
      }
      navigate('/otp')
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : 'Unable to send OTP.'
      setError(message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="app-bg login-page-bg">
      <main className="auth-shell">
        <h1>Welcome to Doorstep Yoga</h1>
        <p>Your mat. Your space. Our trainer.</p>
        <form onSubmit={onSubmit}>
          <input
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
            }
          />
          <button type="submit" disabled={!isValid}>
            {isSending ? 'Sending...' : 'Send OTP'}
          </button>
          {error ? <p>{error}</p> : null}
        </form>
      </main>
    </div>
  )
}

function OtpScreen() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const canContinue = useMemo(() => /^\d{4}$/.test(otp), [otp])

  useEffect(() => {
    const pendingPhone = getPendingPhone()
    if (!pendingPhone) {
      navigate('/login', { replace: true })
      return
    }
    setPhone(pendingPhone)
  }, [navigate])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canContinue) return
    if (!phone) {
      setError('Session expired. Please request OTP again.')
      navigate('/login', { replace: true })
      return
    }
    try {
      setIsVerifying(true)
      setError('')
      await verifyOtp(phone, otp)
      navigate('/address')
    } catch (verifyError) {
      const message =
        verifyError instanceof Error ? verifyError.message : 'OTP verification failed.'
      setError(message)
    } finally {
      setIsVerifying(false)
    }
  }

  async function onResendOtp() {
    try {
      setIsResending(true)
      setError('')
      const response = await resendOtp()
      if (response.otp && phone) {
        window.alert(`Your OTP is ${response.otp}`)
      }
    } catch (resendError) {
      const message = resendError instanceof Error ? resendError.message : 'Unable to resend OTP.'
      setError(message)
      clearPendingPhone()
      navigate('/login', { replace: true })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="app-bg login-page-bg">
      <main className="auth-shell">
        <h1>OTP Verification</h1>
        <p>{phone ? `Enter the OTP sent to ${phone}` : 'Enter the OTP to continue.'}</p>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Enter 4-digit OTP"
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, '').slice(0, 4))
            }
          />
          <button type="submit" disabled={!canContinue || isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </button>
          <button type="button" onClick={onResendOtp} disabled={isResending}>
            {isResending ? 'Resending...' : 'Resend OTP'}
          </button>
          {error ? <p>{error}</p> : null}
        </form>
      </main>
    </div>
  )
}

const ADDRESS_MAP_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ecwtmRbo4rfbj2C4jUajip2TJOQ2jklCqadsju3mHmu_ecG6FT0FnoQdvb5D_YRc9n7Cc6vXio684ZHGnvgf3tXn6xqAJDHw67kncKGmD36hfww8Q8W7OQUYSSHj5SAvUuxlw4SkGXTNH_GlCuJNYBymw4G7xO5mvSbKiZXRdFl2G23V2fMuQnNpKKSse48TO0I8_a3NRExBq6n-O95p_iczDs6Ui-FMBLTCIp6OAnynuvymPIXUxjsWe333SYB7uQbhHWq8NIo'

function AddressSelectionScreen() {
  const navigate = useNavigate()

  return (
    <div className="app-bg">
      <main className="phone-shell page-shell">
        <section className="address-shell">
          <header className="address-header">
            <div className="address-header-title">
              <span aria-hidden="true">📍</span>
              <h1>Set Your Doorstep Yoga Location</h1>
            </div>
            <button type="button" aria-label="Close" onClick={() => navigate('/home')}>
              ✕
            </button>
          </header>

          <div className="address-map-wrap">
            <img className="address-map" src={ADDRESS_MAP_IMAGE} alt="Map preview" />
            <div className="address-map-gradient" />
          </div>

          <div className="address-content">
            <label className="address-search">
              <span aria-hidden="true">🔍</span>
              <input type="text" placeholder="Search for area, street name..." />
            </label>

            <div className="address-sheet">
              <div className="address-sheet-handle" />

              <button
                type="button"
                className="address-detect-btn"
                onClick={() => navigate('/home')}
              >
                <span aria-hidden="true">◎</span>
                Detect my location
              </button>

              <p className="address-section-label">Saved Addresses</p>

              <div className="address-list">
                <button
                  type="button"
                  className="address-item"
                  onClick={() => navigate('/home')}
                >
                  <span className="address-icon address-icon-home">🏠</span>
                  <span className="address-item-copy">
                    <strong>Home</strong>
                    <small>B-12, Green Park Main, New Delhi</small>
                  </span>
                  <span aria-hidden="true">›</span>
                </button>

                <button
                  type="button"
                  className="address-item"
                  onClick={() => navigate('/home')}
                >
                  <span className="address-icon address-icon-office">💼</span>
                  <span className="address-item-copy">
                    <strong>Office</strong>
                    <small>Cyber City, Phase 2, Gurugram</small>
                  </span>
                  <span aria-hidden="true">›</span>
                </button>

                <button type="button" className="address-item address-item-add">
                  <span className="address-icon address-icon-add">+</span>
                  <span className="address-item-copy">
                    <strong>Add New Address</strong>
                  </span>
                </button>
              </div>

              <button type="button" className="address-manual-link">
                Enter Address Manually
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function TrainerAvatar({ src, name }: { src: string; name: string }) {
  const [imageSrc, setImageSrc] = useState(src)

  return (
    <img
      src={imageSrc}
      alt={name}
      onError={() => setImageSrc(defaultTrainerImage)}
    />
  )
}

function TrainerListingScreen() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const categories = [...TRAINER_CATEGORIES]
  const [selectedCategory, setSelectedCategory] = useState('All Trainers')
  const categoryFromRoute = searchParams.get('category')
  const sessionFromRoute = searchParams.get('session')

  useEffect(() => {
    if (sessionFromRoute) {
      savePrivateSessionDraft(sessionFromRoute)
      const mappedCategory = SESSION_TRAINER_CATEGORY[sessionFromRoute] ?? sessionFromRoute
      if (TRAINER_CATEGORIES.includes(mappedCategory as (typeof TRAINER_CATEGORIES)[number])) {
        setSelectedCategory(mappedCategory)
      } else {
        setSelectedCategory('All Trainers')
      }
      return
    }

    if (!categoryFromRoute) {
      setSelectedCategory('All Trainers')
      return
    }

    if (TRAINER_CATEGORIES.includes(categoryFromRoute as (typeof TRAINER_CATEGORIES)[number])) {
      savePrivateSessionDraft(categoryFromRoute)
      setSelectedCategory(categoryFromRoute)
    }
  }, [categoryFromRoute, sessionFromRoute])

  const filteredTrainers =
    selectedCategory === 'All Trainers'
      ? trainers
      : trainers.filter((trainer) => trainer.category === selectedCategory)

  function openTrainer(trainer: Trainer) {
    const sessionDraft = getBookingSessionDraft()
    if (!sessionDraft || sessionDraft.kind !== 'group') {
      savePrivateSessionDraft(sessionDraft?.sessionLabel ?? trainer.category)
    }
    saveSelectedTrainer(trainer)
    navigate('/trainer-profile')
  }

  function selectCategory(category: string) {
    setSelectedCategory(category)
    if (category === 'All Trainers') {
      setSearchParams({})
      return
    }
    savePrivateSessionDraft(category)
    setSearchParams({ category })
  }

  return (
    <div className="app-bg">
      <main className="phone-shell page-shell">
        <section className="trainer-shell">
        <header className="trainer-topbar">
          <div className="trainer-topbar-left">
            <button type="button" aria-label="Back to home" onClick={() => navigate('/home')}>
              ←
            </button>
        <div>
              <p>Current Location</p>
              <h2>New Delhi, India</h2>
            </div>
          </div>
          <button type="button" aria-label="Notifications" onClick={() => navigate('/notifications')}>
            🔔
          </button>
        </header>

        <section className="trainer-hero">
          <h1>Available Trainers</h1>
          <p>Expert yoga instructors ready to visit your home.</p>
        </section>

        <div className="trainer-chips">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => selectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="trainer-cta-row">
          <button
            type="button"
            className="trainer-cta trainer-cta-secondary"
            onClick={() => navigate('/preferences')}
          >
            Refine with Preferences
          </button>
        <button
          type="button"
            className="trainer-cta trainer-cta-secondary"
            onClick={() => navigate('/group-session')}
        >
            Book a Group Session
        </button>
        </div>

        <div className="trainer-list">
          {filteredTrainers.map((trainer) => (
            <button
              key={trainer.name}
              type="button"
              className="trainer-card"
              onClick={() => openTrainer(trainer)}
            >
              <TrainerAvatar src={trainer.image} name={trainer.name} />
              <div>
                <h3>{trainer.name}</h3>
                <p>{trainer.specialty}</p>
                <p className="trainer-exp">{trainer.experience}</p>
                <span>Tap to view profile</span>
              </div>
            </button>
          ))}
          {filteredTrainers.length === 0 ? (
            <p className="empty-trainers">No trainers available in this category right now.</p>
          ) : null}
        </div>
        </section>
        <PersistentBottomNav />
      </main>
    </div>
  )
}

function FavoritesScreen() {
  const navigate = useNavigate()
  const [favoriteTrainers, setFavoriteTrainers] = useState(() => getFavorites())

  function handleToggleFavorite(trainer: FavoriteTrainer) {
    const result = toggleFavorite(trainer)
    setFavoriteTrainers(getFavorites())
    showToast(result === 'added' ? 'Added to Favorites ❤️' : 'Removed from Favorites')
  }

  return (
    <div className="app-bg app-bg-viewport-lock">
      <main className="phone-shell page-shell page-shell-favorites">
        <section className="favorites-shell">
          <header className="favorites-header">
            <h1>Your Favorites</h1>
            <p>Trainers you saved for quick booking.</p>
          </header>

          <div className="favorites-list">
            {favoriteTrainers.length === 0 ? (
              <div className="favorites-empty">
                <p>No favorites yet</p>
                <span>Save trainers you love for faster booking.</span>
                <button type="button" onClick={() => navigate('/trainers')}>
                  Browse Trainers
                </button>
              </div>
            ) : (
              favoriteTrainers.map((trainer) => (
              <article key={trainer.name} className="favorite-card">
                <div className="favorite-open">
                  <button
                    type="button"
                    className="favorite-open-main"
                    onClick={() => {
                      const match = trainers.find((item) => item.name === trainer.name)
                      const selected = match ?? featuredTrainer
                      saveSelectedTrainer(selected)
                      navigate('/trainer-profile')
                    }}
                  >
                    <TrainerAvatar src={trainer.image} name={trainer.name} />
                    <div>
                      <h2>{trainer.name}</h2>
                      <p>{trainer.specialty}</p>
                    </div>
                  </button>
                  <FavoriteHeart filled onToggle={() => handleToggleFavorite(trainer)} />
                </div>
                <button
                  type="button"
                  className="favorite-book"
                  onClick={() => {
                    const match = trainers.find((item) => item.name === trainer.name)
                    const selected = match ?? featuredTrainer
                    savePrivateSessionDraft(selected.category)
                    saveSelectedTrainer(selected)
                    navigate('/schedule')
                  }}
                >
                  Book Session
                </button>
              </article>
              ))
            )}
          </div>
        </section>
        <PersistentBottomNav />
      </main>
    </div>
  )
}

function NotificationsScreen() {
  const navigate = useNavigate()

  const groups = [
    {
      title: 'Today',
      items: [
        {
          title: 'Booking Reminder',
          body: 'Your session with Maya Thompson starts in 1 hour.',
          time: '1h ago',
          tone: 'green',
          icon: 'calendar',
          to: '/schedule',
        },
        {
          title: 'Trainer Update',
          body: 'Maya is on her way to your location.',
          time: '2h ago',
          tone: 'yellow',
          icon: 'trainer',
          to: '/trainer-profile',
        },
      ],
    },
    {
      title: 'Yesterday',
      items: [
        {
          title: 'Exclusive Offer',
          body: '50% off your next Group Session! Valid for 48 hours.',
          time: '1d ago',
          tone: 'pink',
          icon: 'offer',
          to: '/group-session',
        },
        {
          title: 'New Workshop',
          body: 'New Vinyasa workshop added for this weekend.',
          time: '1d ago',
          tone: 'gray',
          icon: 'workshop',
          to: '/trainers?category=1-on-1%20Yoga',
        },
      ],
    },
  ] as const

  return (
    <div className="app-bg">
      <main className="phone-shell page-shell">
        <section className="notifications-shell">
          <header className="notifications-header">
            <button type="button" aria-label="Back" onClick={() => navigate('/account')}>
              ←
            </button>
            <h1>Notifications</h1>
            <button type="button">Mark all as read</button>
          </header>

          {groups.map((group) => (
            <section key={group.title} className="notifications-group">
              <h2>{group.title}</h2>
              <div className="notifications-list">
                {group.items.map((item) => (
                  <button
                    key={`${group.title}-${item.title}`}
                    type="button"
                    className="notification-card"
                    onClick={() => navigate(item.to)}
                  >
                    <div className={`notification-dot ${item.tone}`}>
                      <NotificationIcon name={item.icon} />
                    </div>
                    <div className="notification-content">
                      <div className="notification-row">
                        <strong>{item.title}</strong>
                        <span>{item.time}</span>
                      </div>
                      <p>{item.body}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </section>
        <PersistentBottomNav />
      </main>
    </div>
  )
}

function NotificationIcon({
  name,
}: {
  name: 'calendar' | 'trainer' | 'offer' | 'workshop'
}) {
  if (name === 'calendar') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3.5v3M17 3.5v3M4 8h16M6 6.5h12a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2Z" />
      </svg>
    )
  }
  if (name === 'trainer') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 20.5c.8-3.2 2.6-5.8 6-7.2M12 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm2.5 12v-5l3.5-3.4m-4.5.9-2 2.3m1 2.1-3 5.1" />
      </svg>
    )
  }
  if (name === 'offer') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m20 12.5-6.8 6.8a1.8 1.8 0 0 1-2.6 0l-6-6a1.8 1.8 0 0 1 0-2.6L11.4 4H20v8.5Z" />
        <circle cx="16.4" cy="7.7" r="1.1" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 19.5h17M7 16v-5.5l5-3 5 3V16M10 11.5h4M10 14h4" />
                </svg>
  )
}

function PreferencesScreen() {
  const navigate = useNavigate()
  const [gender, setGender] = useState<'female' | 'male' | 'none'>('none')
  const [style, setStyle] = useState<'Hatha' | 'Vinyasa' | 'Power' | 'Yin'>('Vinyasa')
  const [availableToday, setAvailableToday] = useState(true)
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    'Intermediate',
  )

  const styleOptions: Array<'Hatha' | 'Vinyasa' | 'Power' | 'Yin'> = [
    'Hatha',
    'Vinyasa',
    'Power',
    'Yin',
  ]

  return (
    <div className="app-bg">
      <main className="preferences-shell">
        <header className="preferences-header">
          <button type="button" aria-label="Back" onClick={() => navigate('/trainers')}>
            ←
          </button>
          <h1>Your Preferences</h1>
          <span />
        </header>

        <p className="preferences-subtitle">
          Refine your practice by choosing your ideal session environment.
        </p>

        <section className="preferences-section">
          <h2>Preferred Trainer Gender?</h2>
          <div className="gender-list">
            <button
              type="button"
              className={gender === 'female' ? 'selected' : ''}
              onClick={() => setGender('female')}
            >
              <span>♀</span>
              Female
            </button>
            <button
              type="button"
              className={gender === 'male' ? 'selected' : ''}
              onClick={() => setGender('male')}
            >
              <span>♂</span>
              Male
            </button>
            <button
              type="button"
              className={gender === 'none' ? 'selected' : ''}
              onClick={() => setGender('none')}
            >
              <span>☰</span>
              No preference
            </button>
          </div>
        </section>

        <section className="preferences-section">
          <h2>Yoga Style</h2>
          <div className="style-chips">
            {styleOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={style === option ? 'active' : ''}
                onClick={() => setStyle(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <section className="preferences-toggle">
          <p>Available Today</p>
          <button
            type="button"
            className={availableToday ? 'toggle on' : 'toggle'}
            onClick={() => setAvailableToday((value) => !value)}
            aria-label="Toggle availability"
          >
            <span />
          </button>
        </section>

        <section className="preferences-section">
          <div className="experience-head">
            <h2>Experience Level</h2>
            <strong>{experience}</strong>
          </div>
          <div className="experience-options">
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
              <button
                key={level}
                type="button"
                className={experience === level ? 'active' : ''}
                onClick={() => setExperience(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        <button type="button" className="show-trainers-btn" onClick={() => navigate('/trainers')}>
          Show 12 Trainers
        </button>
      </main>
    </div>
  )
}

function GroupSessionScreen() {
  const navigate = useNavigate()
  const [members, setMembers] = useState(4)

  const availableCounts = Object.keys(GROUP_PRICING).map((value) => Number(value))
  const totalPrice = GROUP_PRICING[members]
  const perPerson = Math.round(totalPrice / members)

  function continueToSchedule() {
    saveGroupBookingSession(members, totalPrice)
    saveSelectedTrainer(featuredTrainer)
    navigate('/schedule')
  }

  return (
    <BookingFlowShell ctaLabel="Continue to Schedule" onCtaClick={continueToSchedule}>
      <main className="group-shell booking-flow-content">
        <header className="group-header">
          <button type="button" aria-label="Back" onClick={() => navigate('/home')}>
            ←
          </button>
          <h1>Group Session</h1>
          <span />
        </header>

        <p className="group-subtitle">
          Choose number of members for your group booking. Pricing updates instantly.
        </p>

        <section className="group-card">
          <h2>How many members?</h2>
          <div className="member-grid">
            {availableCounts.map((count) => (
              <button
                key={count}
                type="button"
                className={`booking-member-btn${members === count ? ' active' : ''}`}
                onClick={() => setMembers(count)}
              >
                {count}
              </button>
            ))}
          </div>

          <div className="group-price-box">
            <p>
              <span>Total for {members} members</span>
              <strong>₹{totalPrice}</strong>
            </p>
            <p>
              <span>Per person</span>
              <strong>₹{perPerson}</strong>
            </p>
          </div>
        </section>

        <section className="group-breakup">
          <h3>Group Pricing</h3>
          {availableCounts.map((count) => (
            <p key={count} className={count === members ? 'active' : ''}>
              <span>{count} people</span>
              <strong>₹{GROUP_PRICING[count]}</strong>
            </p>
          ))}
        </section>
      </main>
    </BookingFlowShell>
  )
}

function TrainerProfileScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    saveSelectedTrainer(featuredTrainer)
  }, [])

  return (
    <Screen
      htmlSrc={stitchScreenUrl('trainer_profile_page')}
      alt="Trainer Profile"
      showBottomNav={false}
      allowEmbedInteraction={true}
      lockViewport={true}
      bookingFlow={true}
      bookingCta={{
        label: 'Check Availability',
        onClick: () => {
          const sessionDraft = getBookingSessionDraft()
          if (!sessionDraft || sessionDraft.kind !== 'group') {
            savePrivateSessionDraft(sessionDraft?.sessionLabel ?? featuredTrainer.category)
          }
          navigate('/schedule')
        },
      }}
    />
  )
}

function ConfirmationScreen() {
  const navigate = useNavigate()
  const booking = getBookingDetails()
  const confirmCardRef = useRef<HTMLElement>(null)

  const today = new Date()
  const details: BookingDetails = booking ?? {
    trainerName: getSelectedTrainer().name,
    trainerImage: getSelectedTrainer().image,
    dateLabel: formatBookingDateFromParts(12, today.getFullYear(), today.getMonth()),
    time: '09:30 AM',
    sessionType: featuredTrainer.category,
    duration: 60,
    bookingId: 'DY-DEMO01',
    totalPaid: formatInr(1100),
    paymentMethod: 'UPI',
    locationLabel: defaultLocationLabel,
  }

  const paymentLabel = details.paymentMethod ?? 'UPI'

  function viewBooking() {
    confirmCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <BookingFlowShell ctaLabel="View Booking" onCtaClick={viewBooking}>
      <section className="confirm-shell booking-flow-content">
        <div className="confirm-badge">✓</div>
        <h1>Booking Confirmed</h1>
        <p>
          {details.trainerName.split(' ')[0]} will see you on{' '}
          <strong>
            {details.dateLabel} at {details.time}.
          </strong>
        </p>

        <section ref={confirmCardRef} className="confirm-card">
          <div className="confirm-trainer">
            <img src={details.trainerImage} alt={details.trainerName} />
            <div>
              <h2>{details.trainerName}</h2>
              <p>★ 4.9 (120+ Sessions)</p>
            </div>
            <span className="trainer-tags">{details.sessionType}</span>
          </div>

          <div className="confirm-item">
            <strong>Location</strong>
            <span>{details.locationLabel}</span>
          </div>
          <div className="confirm-item">
            <strong>Date & Time</strong>
            <span>
              {details.dateLabel} • {details.time} ({details.duration} min)
            </span>
          </div>
          <div className="confirm-item">
            <strong>Booking ID</strong>
            <span>{details.bookingId}</span>
          </div>
          <div className="confirm-item">
            <strong>Payment Status</strong>
            <span>
              {details.totalPaid} Paid via {paymentLabel}
            </span>
          </div>

          <div className="confirm-map">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClQwm14seM4iYp2PfP6iEERTvH5cQMMoG0VJfAlOZsqYJ9vi_rHxSZm0inyF-96z7yh4keI3Uq8-cD7lIXCyDy4xWGVgI9arBIKztDSZ-tw4Qea0YSJnSjTcoN_8h078aWoa6iVKwgAy_1ZvqTTb-ZTjwUhIRF_WlMCpifarRZTW8Ux5xBX-iNxs8FO2F3tdu3TzjHxjE3DTmAs2xvdlx-WKs57ph60wbp9R6bFV0ep7QKS8z5Qwpq_s4915YsB4RcsQBPN0pU3CM"
              alt="Map preview"
            />
          </div>
        </section>

        <div className="confirm-actions">
          <button type="button" className="confirm-home-btn booking-pressable" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </div>
      </section>
    </BookingFlowShell>
  )
}

function RequireAuth({ children }: { children: ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  return isAuthenticated() ? <Navigate to="/home" replace /> : <>{children}</>
}

function RootRedirect() {
  return <Navigate to={isAuthenticated() ? '/home' : '/login'} replace />
}

function NotFoundRedirect() {
  return <Navigate to={isAuthenticated() ? '/home' : '/login'} replace />
}

export default function App() {
  return (
    <>
      <ToastHost />
      <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <LoginScreen />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/otp"
        element={
          <RedirectIfAuthenticated>
            <OtpScreen />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/address"
        element={
          <RequireAuth>
            <AddressSelectionScreen />
          </RequireAuth>
        }
      />
      <Route
        path="/home"
        element={
          <RequireAuth>
            <Screen
              htmlSrc={stitchScreenUrl('home_service_selection')}
              alt="Home Service Selection"
              showBottomNav={true}
              allowEmbedInteraction={true}
              lockViewport={true}
              cohesiveBottomNav={true}
              hotspots={[
                {
                  to: '/preferences',
                  label: 'Refine preferences CTA',
                  variant: 'preferences-fab',
                  style: { right: '14px', bottom: '82px', width: '56px', height: '56px', zIndex: 120 },
                },
              ]}
            />
          </RequireAuth>
        }
      />
      <Route
        path="/trainers"
        element={
          <RequireAuth>
            <TrainerListingScreen />
          </RequireAuth>
        }
      />
      <Route
        path="/preferences"
        element={
          <RequireAuth>
            <PreferencesScreen />
          </RequireAuth>
        }
      />
      <Route
        path="/group-session"
        element={
          <RequireAuth>
            <GroupSessionScreen />
          </RequireAuth>
        }
      />
      <Route
        path="/favorites"
        element={
          <RequireAuth>
            <FavoritesScreen />
          </RequireAuth>
        }
      />
      <Route
        path="/notifications"
        element={
          <RequireAuth>
            <NotificationsScreen />
          </RequireAuth>
        }
      />
      <Route
        path="/account"
        element={
          <RequireAuth>
            <Screen
              htmlSrc={stitchScreenUrl('user_profile_account')}
              alt="User Profile Account"
              showBottomNav={true}
              lockViewport={true}
            />
          </RequireAuth>
        }
      />
      <Route
        path="/trainer-profile"
        element={
          <RequireAuth>
            <TrainerProfileScreen />
          </RequireAuth>
        }
      />
      <Route
        path="/schedule"
        element={
          <RequireAuth>
            <ScheduleScreen />
          </RequireAuth>
        }
      />
      <Route
        path="/booking-success"
        element={
          <RequireAuth>
            <BookingSuccessScreen />
          </RequireAuth>
        }
      />
      <Route
        path="/confirmation"
        element={
          <RequireAuth>
            <ConfirmationScreen />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
    </>
  )
}
