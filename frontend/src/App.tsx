import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import './App.css'

type Hotspot = {
  to?: string
  label: string
  style: CSSProperties
  action?: 'share'
  variant?: 'preferences-fab'
}

type PendingOtp = {
  phone: string
  otp: string
  expiresAt: number
}

const PENDING_OTP_KEY = 'doorstep-yoga-pending-otp'
const OTP_TTL_MS = 5 * 60 * 1000

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function savePendingOtp(data: PendingOtp) {
  sessionStorage.setItem(PENDING_OTP_KEY, JSON.stringify(data))
}

function readPendingOtp() {
  const raw = sessionStorage.getItem(PENDING_OTP_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as PendingOtp
    if (!parsed.phone || !parsed.otp || !parsed.expiresAt) return null
    return parsed
  } catch {
    return null
  }
}

function clearPendingOtp() {
  sessionStorage.removeItem(PENDING_OTP_KEY)
}

const stitchScreenUrl = (folder: string) =>
  `/@fs/C:/Users/IL/Downloads/stitch_yogfit_yoga_booking_platform/stitch_yogfit_yoga_booking_platform/${folder}/code.html`

function Screen({
  htmlSrc,
  alt,
  hotspots,
  showBottomNav = true,
  allowEmbedInteraction = true,
}: {
  htmlSrc: string
  alt: string
  hotspots?: Hotspot[]
  showBottomNav?: boolean
  allowEmbedInteraction?: boolean
}) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="app-bg">
      <main className="phone-shell page-shell page-shell-embedded">
        <div className={`screen-wrap ${showBottomNav ? 'screen-wrap-with-nav' : ''}`}>
          <iframe
            key={`${htmlSrc}-${location.pathname}`}
            src={htmlSrc}
            title={alt}
            className={`screen-embed ${allowEmbedInteraction ? '' : 'screen-embed-no-interaction'}`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
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
        {showBottomNav ? <PersistentBottomNav /> : null}
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
  const isValid = /^[6-9]\d{9}$/.test(phone)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isValid) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }

    const otp = generateOtp()
    savePendingOtp({
      phone,
      otp,
      expiresAt: Date.now() + OTP_TTL_MS,
    })
    setError('')
    window.alert(`Demo OTP for ${phone}: ${otp}`)
    navigate('/otp')
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
            Send OTP
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
  const canContinue = useMemo(() => /^\d{6}$/.test(otp), [otp])

  useEffect(() => {
    const pending = readPendingOtp()
    if (!pending || pending.expiresAt <= Date.now()) {
      clearPendingOtp()
      navigate('/login', { replace: true })
      return
    }
    setPhone(pending.phone)
  }, [navigate])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canContinue) return

    const pending = readPendingOtp()
    if (!pending || pending.expiresAt <= Date.now()) {
      clearPendingOtp()
      setError('OTP expired. Please request a new OTP.')
      navigate('/login', { replace: true })
      return
    }

    if (pending.otp !== otp) {
      setError('Incorrect OTP. Please try again.')
      return
    }

    clearPendingOtp()
    setError('')
    navigate('/address')
  }

  function resendOtp() {
    const pending = readPendingOtp()
    if (!pending) {
      navigate('/login', { replace: true })
      return
    }
    const nextOtp = generateOtp()
    savePendingOtp({
      phone: pending.phone,
      otp: nextOtp,
      expiresAt: Date.now() + OTP_TTL_MS,
    })
    setError('')
    window.alert(`New demo OTP for ${pending.phone}: ${nextOtp}`)
  }

  return (
    <div className="app-bg login-page-bg">
      <main className="auth-shell">
        <h1>OTP Verification</h1>
        <p>{phone ? `Enter the OTP sent to ${phone}` : 'Enter the OTP to continue.'}</p>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
            }
          />
          <button type="submit" disabled={!canContinue}>
            Verify & Continue
          </button>
          <button type="button" onClick={resendOtp}>
            Resend OTP
          </button>
          {error ? <p>{error}</p> : null}
        </form>
      </main>
    </div>
  )
}

function TrainerListingScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categories = [
    'All Trainers',
    '1-on-1 Yoga',
    'Prenatal Yoga',
    'Couples Yoga',
    'Therapy Yoga',
    'Meditation',
  ]
  const [selectedCategory, setSelectedCategory] = useState('All Trainers')
  const categoryFromRoute = searchParams.get('category')
  const trainers = [
    {
      name: 'Ishita Kapur',
      specialty: 'Vinyasa & Hatha Expert',
      experience: '8 years experience',
      category: '1-on-1 Yoga',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDxOvBeCOKeWkQTX2rCUclEBML5LAxRI5BNNW4L4GyK5a-HiSRg01dVukkQyBwzqwCdKcRda9ArpjlEmuJ1LwcB_hkTSyc8yeReVCs5Z4in1AsNgPq0iNvjKWrtnIr273zrdAAXxWr170QSaMo5Siw_bl9xUd6ojuJ4JIrvDUqQXkHbcAsr2K1km8HHGCsy3HGAHIogHR-5lK45Neq1HMU3EkQtXs0jBGOrKvpkI8LXlybxxZvMhHuKVpo6ySIfVYBJC2DLm69j6Kw',
    },
    {
      name: 'Arjun Mehta',
      specialty: 'Therapy & Healing',
      experience: '11 years experience',
      category: 'Therapy Yoga',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBYTNXDhEq74jfJFFMQ5GKdMK2J5HyT13wNgJFEZiS0boSR8x5n4e0OwFj0KL2FeQa1cfNt_xg61NKMP-6CwHpCdRiFxALsBy5f24zPx5T5Mfl9YgkMcWk56sIrTLJBzCgkvxKMNG6DBXHK6tk4Z7MwjfyoHKQZXhMDsR6_BAG4_YBA6IzI3SLLryesu6MGiMjiTAAQcBh0IxrkW7ZnZyp4LutIrZlKnpO1CMCBPW5iEPG8TLoOqtl_TVsa5bXzanmhgHkVODMbmgs',
    },
    {
      name: 'Sanya Verma',
      specialty: 'Mindfulness & Breathwork',
      experience: '6 years experience',
      category: 'Meditation',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCf6_CqHuTdgvEg9XXpxrVmiYKaDC7031MrFSP0Nob8YvCtSSnUj8eEkxwny5J9Z5KIUr4uqO6dOstNbaq1Jc0Rn6uR96qpcJJGUPM9vVTjMf-pbOXLQoaxJNRu2THChdqTW3P_VpBgi4lfJ64eve3AvrqRtq_0PtVJW8C6k5OL7VsyflJ5dw5AXvLcUwqk6fe13W6mAE1UR4KgrAsfmmS5yuN8fgBWcIoGq0QWTHZ9GHbryacrgzleM1tcUYJUyaQ5_xfqgAc4xLE',
    },
    {
      name: 'Maya Nair',
      specialty: 'Prenatal Yoga Specialist',
      experience: '9 years experience',
      category: 'Prenatal Yoga',
      image:
        'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Rohan Iyer',
      specialty: 'Couples Flow Coach',
      experience: '7 years experience',
      category: 'Couples Yoga',
      image:
        'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Neha Rao',
      specialty: 'Private Alignment Coach',
      experience: '10 years experience',
      category: '1-on-1 Yoga',
      image:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Kavya Menon',
      specialty: 'Prenatal Breath Coach',
      experience: '5 years experience',
      category: 'Prenatal Yoga',
      image:
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Aman Bedi',
      specialty: 'Partner Flow Specialist',
      experience: '8 years experience',
      category: 'Couples Yoga',
      image:
        'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Priya Dutta',
      specialty: 'Therapeutic Mobility Coach',
      experience: '12 years experience',
      category: 'Therapy Yoga',
      image:
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    },
  ]

  useEffect(() => {
    if (!categoryFromRoute) {
      setSelectedCategory('All Trainers')
      return
    }

    if (categories.includes(categoryFromRoute)) {
      setSelectedCategory(categoryFromRoute)
    }
  }, [categoryFromRoute])
  const filteredTrainers =
    selectedCategory === 'All Trainers'
      ? trainers
      : trainers.filter((trainer) => trainer.category === selectedCategory)

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
              onClick={() => setSelectedCategory(category)}
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
            className="trainer-cta trainer-cta-primary"
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
              onClick={() => navigate('/trainer-profile')}
            >
              <img src={trainer.image} alt={trainer.name} />
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
  const favoriteTrainers = [
    {
      name: 'Ishita Kapur',
      specialty: 'Vinyasa & Hatha Expert',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDxOvBeCOKeWkQTX2rCUclEBML5LAxRI5BNNW4L4GyK5a-HiSRg01dVukkQyBwzqwCdKcRda9ArpjlEmuJ1LwcB_hkTSyc8yeReVCs5Z4in1AsNgPq0iNvjKWrtnIr273zrdAAXxWr170QSaMo5Siw_bl9xUd6ojuJ4JIrvDUqQXkHbcAsr2K1km8HHGCsy3HGAHIogHR-5lK45Neq1HMU3EkQtXs0jBGOrKvpkI8LXlybxxZvMhHuKVpo6ySIfVYBJC2DLm69j6Kw',
    },
    {
      name: 'Sanya Verma',
      specialty: 'Mindfulness & Breathwork',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCf6_CqHuTdgvEg9XXpxrVmiYKaDC7031MrFSP0Nob8YvCtSSnUj8eEkxwny5J9Z5KIUr4uqO6dOstNbaq1Jc0Rn6uR96qpcJJGUPM9vVTjMf-pbOXLQoaxJNRu2THChdqTW3P_VpBgi4lfJ64eve3AvrqRtq_0PtVJW8C6k5OL7VsyflJ5dw5AXvLcUwqk6fe13W6mAE1UR4KgrAsfmmS5yuN8fgBWcIoGq0QWTHZ9GHbryacrgzleM1tcUYJUyaQ5_xfqgAc4xLE',
    },
  ]

  return (
    <div className="app-bg">
      <main className="phone-shell page-shell">
        <section className="favorites-shell">
          <header className="favorites-header">
            <h1>Your Favorites</h1>
            <p>Trainers you saved for quick booking.</p>
          </header>

          <div className="favorites-list">
            {favoriteTrainers.map((trainer) => (
              <article key={trainer.name} className="favorite-card">
                <button
                  type="button"
                  className="favorite-open"
                  onClick={() => navigate('/trainer-profile')}
                >
                  <img src={trainer.image} alt={trainer.name} />
                  <div>
                    <h2>{trainer.name}</h2>
                    <p>{trainer.specialty}</p>
                  </div>
                  <span>♥</span>
                </button>
                <button
                  type="button"
                  className="favorite-book"
                  onClick={() => navigate('/schedule')}
                >
                  Book Session
                </button>
              </article>
            ))}
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
          to: '/trainers?category=Vinyasa',
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

  const groupPricing: Record<number, number> = {
    2: 700,
    4: 1100,
    6: 1500,
    8: 1850,
    10: 2200,
  }

  const availableCounts = Object.keys(groupPricing).map((value) => Number(value))
  const totalPrice = groupPricing[members]
  const perPerson = Math.round(totalPrice / members)

  return (
    <div className="app-bg">
      <main className="group-shell">
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
                className={members === count ? 'active' : ''}
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
              <strong>₹{groupPricing[count]}</strong>
            </p>
          ))}
        </section>

        <button type="button" className="show-trainers-btn" onClick={() => navigate('/schedule')}>
          Continue to Schedule
        </button>
      </main>
    </div>
  )
}

function ScheduleScreen() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(12)
  const [selectedTime, setSelectedTime] = useState('09:30 AM')
  const [selectedDuration, setSelectedDuration] = useState(60)
  const [isRecurring, setIsRecurring] = useState(true)

  const dateRows = [
    [1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20],
  ]

  const morningSlots = ['08:00 AM', '09:30 AM', '11:00 AM']
  const afternoonSlots = ['01:30 PM', '03:00 PM', '04:30 PM']
  const eveningSlots = ['06:00 PM', '07:30 PM']

  return (
    <div className="app-bg">
      <main className="phone-shell page-shell">
        <section className="schedule-shell">
        <header className="schedule-header">
          <button type="button" aria-label="Back" onClick={() => navigate('/trainer-profile')}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 5.5 8 12l6.5 6.5" />
            </svg>
          </button>
          <h1>Schedule Session</h1>
          <button type="button" aria-label="Session info">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 10.5v5m0-8.5h.01M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Z" />
            </svg>
          </button>
        </header>

        <section className="calendar-card">
          <div className="calendar-top">
            <strong>October 2023</strong>
            <div>
              <button type="button" aria-label="Previous month">
                ‹
              </button>
              <button type="button" aria-label="Next month">
                ›
              </button>
            </div>
          </div>

          <div className="calendar-weekdays">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar-grid">
            <span className="muted">26</span>
            <span className="muted">27</span>
            <span className="muted">28</span>
            <span className="muted">29</span>
            <span className="muted">30</span>
            {dateRows.flat().map((date) => (
              <button
                key={date}
                type="button"
                className={selectedDate === date ? 'selected' : ''}
                onClick={() => setSelectedDate(date)}
              >
                {date}
              </button>
            ))}
          </div>
        </section>

        <section className="time-slots">
          <h2>Select Time Slot</h2>

          <p>Morning</p>
          <div className="slot-row">
            {morningSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={selectedTime === slot ? 'active' : ''}
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </button>
            ))}
          </div>

          <p>Afternoon</p>
          <div className="slot-row">
            {afternoonSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={selectedTime === slot ? 'active' : ''}
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </button>
            ))}
          </div>

          <p>Evening</p>
          <div className="slot-row">
            {eveningSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={selectedTime === slot ? 'active' : ''}
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </section>

        <section className="duration-section">
          <h3>Session Duration</h3>
          <div className="duration-grid">
            <button
              type="button"
              className={selectedDuration === 60 ? 'duration-active' : ''}
              onClick={() => setSelectedDuration(60)}
            >
              <strong>60</strong>
              <span>Minutes</span>
            </button>
            <button
              type="button"
              className={selectedDuration === 90 ? 'duration-active' : ''}
              onClick={() => setSelectedDuration(90)}
            >
              <strong>90</strong>
              <span>Minutes</span>
            </button>
          </div>
        </section>

        <section className="recurring-card">
          <div>
            <h4>Recurring Session</h4>
            <p>Auto-book 3x per week</p>
          </div>
          <button
            type="button"
            className={`toggle-btn ${isRecurring ? 'on' : ''}`}
            aria-label="Toggle recurring session"
            onClick={() => setIsRecurring((value) => !value)}
          >
            <span />
          </button>
        </section>

        <section className="pricing-block">
          <h3>Pricing Breakdown</h3>
          <div>
            <p>
              <span>Session ({selectedDuration} min)</span>
              <strong>{selectedDuration === 60 ? '₹1,200' : '₹1,700'}</strong>
            </p>
            <p>
              <span>Multi-session Discount</span>
              <strong className="green">- ₹150</strong>
            </p>
            <p>
              <span>Service Fee</span>
              <strong>₹50</strong>
            </p>
            <p className="total">
              <span>Total Amount</span>
              <strong>{selectedDuration === 60 ? '₹1,100' : '₹1,600'}</strong>
            </p>
          </div>
        </section>

        <button type="button" className="proceed-btn" onClick={() => navigate('/confirmation')}>
          Proceed to Checkout
        </button>
        </section>
        <PersistentBottomNav />
      </main>
    </div>
  )
}

function ConfirmationScreen() {
  const navigate = useNavigate()

  return (
    <div className="app-bg">
      <main className="phone-shell page-shell">
        <section className="confirm-shell">
        <div className="confirm-badge">✓</div>
        <h1>Booking Confirmed</h1>
        <p>
          Maya will see you on <strong>Oct 24 at 7:30 AM.</strong>
        </p>

        <section className="confirm-card">
          <div className="confirm-trainer">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyFDy8cQteV262jwOYw9XYyns04WgN8rtbIELJySg4AZVLnpweFKPX5lgmkVybupXlHHmDksZ8LQEsOQKK3o_pEvBHHWlt8bQH2wRHuwUGtlwp7PGKMMUIUK0D4OlqZDdLafZ9XK5lJqlfj6vBO37I5CuX2PKxvamC4kT5P0yq7bs_6aJqDT3LXyIPg66Ouo0mNey_2slfugXGh9MrFYem7gmKZNcnN_YGqSn_ckVMrgcW7a7YsBlVMvFJW3b1NMChQFhB3gqOGCY"
              alt="Maya Sharma"
            />
            <div>
              <h2>Maya Sharma</h2>
              <p>★ 4.9 (120+ Sessions)</p>
            </div>
            <span className="trainer-tags">Yoga Therapy</span>
          </div>

          <div className="confirm-item">
            <strong>Location</strong>
            <span>Serenity Studio, Hauz Khas, New Delhi</span>
          </div>
          <div className="confirm-item">
            <strong>Date & Time</strong>
            <span>Thursday, October 24 • 07:30 AM (60 min)</span>
          </div>
          <div className="confirm-item">
            <strong>Payment Status</strong>
            <span>₹1,200 Paid via UPI</span>
          </div>

          <div className="confirm-map">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClQwm14seM4iYp2PfP6iEERTvH5cQMMoG0VJfAlOZsqYJ9vi_rHxSZm0inyF-96z7yh4keI3Uq8-cD7lIXCyDy4xWGVgI9arBIKztDSZ-tw4Qea0YSJnSjTcoN_8h078aWoa6iVKwgAy_1ZvqTTb-ZTjwUhIRF_WlMCpifarRZTW8Ux5xBX-iNxs8FO2F3tdu3TzjHxjE3DTmAs2xvdlx-WKs57ph60wbp9R6bFV0ep7QKS8z5Qwpq_s4915YsB4RcsQBPN0pU3CM"
              alt="Map preview"
            />
          </div>
        </section>

        <button type="button" className="proceed-btn" onClick={() => navigate('/home')}>
          Done
        </button>
        </section>
        <PersistentBottomNav />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/otp" element={<OtpScreen />} />
      <Route
        path="/address"
        element={
          <Screen
            htmlSrc={stitchScreenUrl('address_selection')}
            alt="Address Selection"
            hotspots={[
              {
                to: '/home',
                label: 'Detect location',
                style: { left: '10%', right: '10%', top: '49%', height: '8%' },
              },
              {
                to: '/home',
                label: 'Home address',
                style: { left: '10%', right: '10%', top: '62%', height: '10%' },
              },
              {
                to: '/home',
                label: 'Office address',
                style: { left: '10%', right: '10%', top: '72%', height: '10%' },
              },
            ]}
          />
        }
      />
      <Route
        path="/home"
        element={
          <Screen
            htmlSrc={stitchScreenUrl('home_service_selection')}
            alt="Home Service Selection"
            showBottomNav={false}
            allowEmbedInteraction={true}
            hotspots={[
              {
                to: '/trainers?category=1-on-1%20Yoga',
                label: 'Service one on one',
                style: { left: '20px', width: '166px', top: '332px', height: '180px' },
              },
              {
                to: '/trainers?category=Prenatal%20Yoga',
                label: 'Service prenatal',
                style: { left: '204px', width: '166px', top: '332px', height: '180px' },
              },
              {
                to: '/trainers?category=Couples%20Yoga',
                label: 'Service couples',
                style: { left: '20px', width: '166px', top: '516px', height: '180px' },
              },
              {
                to: '/trainers?category=Therapy%20Yoga',
                label: 'Service therapy',
                style: { left: '204px', width: '166px', top: '516px', height: '180px' },
              },
              {
                to: '/trainers',
                label: 'View mentors',
                style: { left: '5%', right: '36%', top: '83.5%', height: '12%' },
              },
              {
                to: '/group-session',
                label: 'Group sessions service',
                style: { left: '12px', width: '366px', top: '688px', height: '150px' },
              },
              {
                to: '/preferences',
                label: 'Refine preferences CTA',
                variant: 'preferences-fab',
                style: { right: '14px', bottom: '92px', width: '56px', height: '56px', zIndex: 120 },
              },
              {
                to: '/notifications',
                label: 'Home notifications',
                style: { left: '86%', width: '10%', top: '1%', height: '5%' },
              },
            ]}
          />
        }
      />
      <Route
        path="/trainers"
        element={<TrainerListingScreen />}
      />
      <Route
        path="/preferences"
        element={<PreferencesScreen />}
      />
      <Route
        path="/group-session"
        element={<GroupSessionScreen />}
      />
      <Route
        path="/favorites"
        element={<FavoritesScreen />}
      />
      <Route
        path="/notifications"
        element={<NotificationsScreen />}
      />
      <Route
        path="/account"
        element={
          <Screen
            htmlSrc={stitchScreenUrl('user_profile_account')}
            alt="User Profile Account"
            showBottomNav={false}
            hotspots={[
              {
                to: '/notifications',
                label: 'Account notifications',
                style: { left: '86%', width: '10%', top: '1.2%', height: '5%' },
              },
              {
                to: '/home',
                label: 'Account page bottom home',
                style: { left: '2%', width: '24%', top: '92.5%', height: '7.2%' },
              },
              {
                to: '/trainers',
                label: 'Account page bottom search',
                style: { left: '26%', width: '24%', top: '92.5%', height: '7.2%' },
              },
              {
                to: '/favorites',
                label: 'Account page bottom favorites',
                style: { left: '50%', width: '24%', top: '92.5%', height: '7.2%' },
              },
              {
                to: '/account',
                label: 'Account page bottom account',
                style: { left: '74%', width: '24%', top: '92.5%', height: '7.2%' },
              },
            ]}
          />
        }
      />
      <Route
        path="/trainer-profile"
        element={
          <Screen
            htmlSrc={stitchScreenUrl('trainer_profile_page')}
            alt="Trainer Profile"
            hotspots={[
              {
                to: '/trainers',
                label: 'Trainer profile back',
                style: { left: '3%', width: '12%', top: '1.3%', height: '5%' },
              },
              {
                action: 'share',
                label: 'Trainer profile share',
                style: { left: '64%', width: '12%', top: '1.3%', height: '5%' },
              },
              {
                to: '/favorites',
                label: 'Trainer profile favorite',
                style: { left: '78%', width: '12%', top: '1.3%', height: '5%' },
              },
              {
                to: '/schedule',
                label: 'Check availability',
                style: { left: '7%', right: '7%', top: '92%', height: '6%' },
              },
            ]}
          />
        }
      />
      <Route
        path="/schedule"
        element={<ScheduleScreen />}
      />
      <Route
        path="/confirmation"
        element={<ConfirmationScreen />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
