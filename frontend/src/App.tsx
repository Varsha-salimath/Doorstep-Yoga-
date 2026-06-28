import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import {
  clearAuthToken,
  clearPendingPhone,
  getPendingPhone,
  isAuthenticated,
  resendOtp,
  sendOtp,
  verifyOtp,
} from './api'
import './App.css'

const HOME_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDNmKij8fX8ptmRD8FoMEJcRtCbPy9TMfsZHOLZWwQ-3x0JrmGZkQuVzcSFNZ3bwQWJsjMZY6XE6Frh3ZU0t-x0ZdX1rvPVvv42r4X_3sV9uzdY4RSpE_8VtxwusayDfGUiR83QH83-eMWRBjs8T26MIyCbQv_GVs2D0Q4gvUnYb_Zs-XE_6rLRko0R23zVqfnVxboMPEJdBtwLKeccxKcf_RWdcJijaLo41te8UBa6_HgeM3fZG7LQtnQCKOB1cMMp_byNrzP3uyE'

const SERVICE_CATALOG = {
  '1-on-1-yoga': {
    title: '1-on-1 Yoga',
    subtitle: 'Personalized flows',
    icon: '🧘',
    tone: '#d4e8d2',
    category: '1-on-1 Yoga',
    description:
      'Private sessions tailored to your body, goals, and schedule. Your trainer designs each flow around your mobility, experience level, and wellness objectives.',
    includes: ['Customized session plan', 'At-home mat setup guidance', 'Breath and alignment coaching'],
    price: '₹1,200',
  },
  'prenatal-yoga': {
    title: 'Prenatal Yoga',
    subtitle: 'Gentle & safe',
    icon: '🤰',
    tone: '#ffdbce',
    category: 'Prenatal Yoga',
    description:
      'Gentle, trimester-aware yoga designed for expecting mothers. Focus on safe movement, pelvic support, and calming breathwork.',
    includes: ['Certified prenatal instructor', 'Modified pose library', 'Relaxation and recovery focus'],
    price: '₹1,400',
  },
  'couples-yoga': {
    title: 'Couples Yoga',
    subtitle: 'Bond & breath',
    icon: '💞',
    tone: '#ffe088',
    category: 'Couples Yoga',
    description:
      'Shared movement sessions that build connection, trust, and balance for partners practicing together at home.',
    includes: ['Partner-assisted flows', 'Synchronized breathing', 'Guided relaxation finish'],
    price: '₹1,600',
  },
  'therapy-yoga': {
    title: 'Therapy Yoga',
    subtitle: 'Healing focus',
    icon: '🩹',
    tone: '#d4e8d2',
    category: 'Therapy Yoga',
    description:
      'Therapeutic yoga for recovery, stiffness, and stress-related tension with slow, intentional sequencing.',
    includes: ['Mobility assessment', 'Pain-aware modifications', 'Progress tracking across sessions'],
    price: '₹1,500',
  },
} as const

type ServiceSlug = keyof typeof SERVICE_CATALOG

function FilterFabIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h8M16 7h4M10 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10 10h-8M8 17H4m14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
    </svg>
  )
}

function AppShell({
  children,
  showNav = true,
  fabTo,
  fabLabel = 'Open preferences',
  scrollContent = true,
}: {
  children: ReactNode
  showNav?: boolean
  fabTo?: string
  fabLabel?: string
  scrollContent?: boolean
}) {
  const navigate = useNavigate()

  return (
    <div className="app-bg">
      <div className="phone-shell">
        <div className="page-shell">
          <div className={`page-content ${scrollContent ? '' : 'page-content-no-scroll'}`}>
            {children}
          </div>
          {fabTo ? (
            <button
              type="button"
              className="app-fab"
              aria-label={fabLabel}
              onClick={() => navigate(fabTo)}
            >
              <FilterFabIcon />
            </button>
          ) : null}
          {showNav ? <PersistentBottomNav /> : null}
        </div>
      </div>
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
          <button type="submit" disabled={!isValid || isSending}>
            {isSending ? 'Sending...' : 'Send OTP'}
          </button>
          <button
            type="button"
            className="auth-alt-btn"
            onClick={() => window.alert('Google sign-in is disabled in demo mode. Use phone OTP.')}
          >
            Continue with Google
          </button>
          <button
            type="button"
            className="auth-alt-btn"
            onClick={() => window.alert('Email sign-in is disabled in demo mode. Use phone OTP.')}
          >
            Continue with Email
          </button>
          {error ? <p className="auth-error">{error}</p> : null}
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
          {error ? <p className="auth-error">{error}</p> : null}
        </form>
      </main>
    </div>
  )
}

function HomeScreen() {
  const navigate = useNavigate()

  const mentors = [
    {
      name: 'Ishita Kapur',
      specialty: 'Vinyasa & Hatha Expert',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDxOvBeCOKeWkQTX2rCUclEBML5LAxRI5BNNW4L4GyK5a-HiSRg01dVukkQyBwzqwCdKcRda9ArpjlEmuJ1LwcB_hkTSyc8yeReVCs5Z4in1AsNgPq0iNvjKWrtnIr273zrdAAXxWr170QSaMo5Siw_bl9xUd6ojuJ4JIrvDUqQXkHbcAsr2K1km8HHGCsy3HGAHIogHR-5lK45Neq1HMU3EkQtXs0jBGOrKvpkI8LXlybxxZvMhHuKVpo6ySIfVYBJC2DLm69j6Kw',
    },
    {
      name: 'Arjun Mehta',
      specialty: 'Therapy & Healing',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBYTNXDhEq74jfJFFMQ5GKdMK2J5HyT13wNgJFEZiS0boSR8x5n4e0OwFj0KL2FeQa1cfNt_xg61NKMP-6CwHpCdRiFxALsBy5f24zPx5T5Mfl9YgkMcWk56sIrTLJBzCgkvxKMNG6DBXHK6tk4Z7MwjfyoHKQZXhMDsR6_BAG4_YBA6IzI3SLLryesu6MGiMjiTAAQcBh0IxrkW7ZnZyp4LutIrZlKnpO1CMCBPW5iEPG8TLoOqtl_TVsa5bXzanmhgHkVODMbmgs',
    },
    {
      name: 'Sanya Verma',
      specialty: 'Prenatal Specialist',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCf6_CqHuTdgvEg9XXpxrVmiYKaDC7031MrFSP0Nob8YvCtSSnUj8eEkxwny5J9Z5KIUr4uqO6dOstNbaq1Jc0Rn6uR96qpcJJGUPM9vVTjMf-pbOXLQoaxJNRu2THChdqTW3P_VpBgi4lfJ64eve3AvrqRtq_0PtVJW8C6k5OL7VsyflJ5dw5AXvLcUwqk6fe13W6mAE1UR4KgrAsfmmS5yuN8fgBWcIoGq0QWTHZ9GHbryacrgzleM1tcUYJUyaQ5_xfqgAc4xLE',
    },
  ]

  return (
    <AppShell showNav fabTo="/preferences" fabLabel="Refine preferences">
      <div className="home-shell">
        <header className="home-topbar">
          <div className="home-location">
            <span aria-hidden="true">📍</span>
            <div>
              <p>Current Location</p>
              <h2>New Delhi, India</h2>
            </div>
          </div>
          <button
            type="button"
            className="home-icon-btn"
            aria-label="Notifications"
            onClick={() => navigate('/notifications')}
          >
            🔔
          </button>
        </header>

        <section className="home-hero">
          <div
            className="home-hero-bg"
            style={{ backgroundImage: `url('${HOME_HERO_IMAGE}')` }}
          />
          <div className="home-hero-overlay">
            <span className="home-hero-badge">Limited Time Offer</span>
            <h2>50% off your first 1-on-1 session</h2>
            <p>
              Experience personalized wellness with our expert practitioners from the comfort of
              home.
            </p>
            <button
              type="button"
              className="home-hero-cta"
              onClick={() => navigate('/service/1-on-1-yoga')}
            >
              Book Now
            </button>
          </div>
        </section>

        <div className="home-section-head">
          <h3>Our Services</h3>
          <button type="button" onClick={() => navigate('/trainers')}>
            View All
          </button>
        </div>

        <div className="home-services">
          <button
            type="button"
            className="home-service-card"
            onClick={() => navigate('/service/1-on-1-yoga')}
          >
            <span className="home-service-icon" style={{ background: '#d4e8d2' }}>
              🧘
            </span>
            <h4>1-on-1 Yoga</h4>
            <p>Personalized flows</p>
          </button>
          <button
            type="button"
            className="home-service-card"
            onClick={() => navigate('/service/prenatal-yoga')}
          >
            <span className="home-service-icon" style={{ background: '#ffdbce' }}>
              🤰
            </span>
            <h4>Prenatal Yoga</h4>
            <p>Gentle &amp; Safe</p>
          </button>
          <button
            type="button"
            className="home-service-card"
            onClick={() => navigate('/service/couples-yoga')}
          >
            <span className="home-service-icon" style={{ background: '#ffe088' }}>
              💞
            </span>
            <h4>Couples Yoga</h4>
            <p>Bond &amp; Breath</p>
          </button>
          <button
            type="button"
            className="home-service-card"
            onClick={() => navigate('/service/therapy-yoga')}
          >
            <span className="home-service-icon" style={{ background: '#d4e8d2' }}>
              🩹
            </span>
            <h4>Therapy Yoga</h4>
            <p>Healing focus</p>
          </button>
          <button
            type="button"
            className="home-service-card wide"
            onClick={() => navigate('/group-session')}
          >
            <span className="home-service-icon" style={{ background: '#d4e8d2' }}>
              👥
            </span>
            <h4>Group Sessions</h4>
            <p>Community wellness</p>
          </button>
        </div>

        <div className="home-section-head">
          <h3>Top Mentors</h3>
          <button type="button" onClick={() => navigate('/trainers')}>
            View All
          </button>
        </div>

        <div className="home-mentors">
          {mentors.map((mentor) => (
            <button
              key={mentor.name}
              type="button"
              className="home-mentor-card"
              onClick={() => navigate('/trainer-profile')}
            >
              <img src={mentor.image} alt={mentor.name} />
              <h5>{mentor.name}</h5>
              <p>{mentor.specialty}</p>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

function ServiceDetailScreen() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: ServiceSlug }>()
  const service = slug ? SERVICE_CATALOG[slug] : undefined

  if (!service) {
    return <Navigate to="/home" replace />
  }

  return (
    <AppShell showNav={false}>
      <div className="service-shell">
        <header className="service-header">
          <button type="button" aria-label="Back to home" onClick={() => navigate('/home')}>
            ←
          </button>
          <h1>Service Details</h1>
          <span />
        </header>

        <div className="service-hero-card">
          <div className="service-hero-icon" style={{ background: service.tone }}>
            {service.icon}
          </div>
          <h2>{service.title}</h2>
          <p>{service.subtitle}</p>
        </div>

        <section className="service-section">
          <h3>About this service</h3>
          <p>{service.description}</p>
        </section>

        <section className="service-section">
          <h3>What&apos;s included</h3>
          <ul>
            {service.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <div className="service-price">
          <span>Starting from</span>
          <strong>{service.price}</strong>
        </div>

        <button
          type="button"
          className="service-primary-btn"
          onClick={() =>
            navigate(`/trainers?category=${encodeURIComponent(service.category)}`)
          }
        >
          Browse Trainers
        </button>
      </div>
    </AppShell>
  )
}

function AccountScreen() {
  const navigate = useNavigate()

  function onLogout() {
    clearAuthToken()
    navigate('/login', { replace: true })
  }

  return (
    <AppShell>
      <div className="account-shell">
        <header className="account-topbar">
          <h1>New Delhi, India</h1>
          <button
            type="button"
            className="home-icon-btn"
            aria-label="Notifications"
            onClick={() => navigate('/notifications')}
          >
            🔔
          </button>
        </header>

        <div className="account-profile">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaqb9_-SrJa9SoEJ-V0jAAOolFz6Baczol_qo5FdJjuN-Lp80joZWS38MXC2RGnlxSIZo0pL939eOdkFZPSeJHgFhE4X1lKRudje0_qTwvBKoDPvQAwHBVb9ACmCn47bkrkbgNGoxjYCQAq01hwGHb1tsXAwFL9HbNn0gUrnjMNPsw384F8sBo4tgKQYllY5XT7IQxwgZRXEf2RZemyTVsLH6TXisPkZI9M0at5eiDSa3vuI8qFpU-AH-8f5aOszF63hqDrG0_Kis"
            alt="Alex profile"
          />
          <h2>Namaste, Alex</h2>
          <p>Premium Member · Joined June 2023</p>
        </div>

        <div className="account-menu">
          <button type="button" onClick={() => navigate('/address')}>
            Manage Addresses
          </button>
          <button type="button" onClick={() => navigate('/schedule')}>
            My Bookings
          </button>
          <button type="button" onClick={() => navigate('/favorites')}>
            Saved Trainers
          </button>
          <button type="button" onClick={() => navigate('/preferences')}>
            Session Preferences
          </button>
          <button type="button" className="danger" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </div>
    </AppShell>
  )
}

function TrainerProfileScreen() {
  const navigate = useNavigate()

  async function onShare() {
    const shareData = {
      title: 'Doorstep Yoga Trainer',
      text: 'Check out Maya Thompson on Doorstep Yoga.',
      url: window.location.href,
    }
    if (navigator.share) {
      await navigator.share(shareData)
      return
    }
    await navigator.clipboard.writeText(window.location.href)
    window.alert('Profile link copied.')
  }

  return (
    <AppShell showNav={false}>
      <div className="profile-shell">
        <header className="profile-header">
          <div className="profile-header-left">
            <button type="button" aria-label="Back" onClick={() => navigate('/trainers')}>
              ←
            </button>
            <h1>Trainer Profile</h1>
          </div>
          <div className="profile-header-actions">
            <button type="button" aria-label="Share profile" onClick={onShare}>
              ↗
            </button>
            <button type="button" aria-label="Add to favorites" onClick={() => navigate('/favorites')}>
              ♥
            </button>
          </div>
        </header>

        <div className="profile-hero">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTYLSJ2ZW2JUogq7mFoDbF4wXEK9TX5GhC_1ZJAGOx99UsJXm4MM5zHusdyyg6MLlnQp6QH1s4cSyLm6B_8nhOOfLUGwRxKVO8Bp1u24dPC8MDXlTkgI5QdBzRRhOi5qABgoJlzLHbGw2p3rBm5hjWAOmXvAZ-Ej2xKcdBzhG4WgbA6pNV23TTxcmMa-6X_IcybpQsllv2GgizzYI9FgmztnqvGLx-8DDsfgZ3ZATpbcgPvwmNPXYUghIBpswYFv2qKw617lNhcMo"
            alt="Maya Thompson"
          />
          <div className="profile-hero-copy">
            <div className="profile-tags">
              <span>Verified Trainer</span>
              <span>★ 4.9 (124 reviews)</span>
            </div>
            <h2>Maya Thompson</h2>
            <p>Senior Yoga &amp; Mindfulness Facilitator</p>
          </div>
        </div>

        <div className="profile-body">
          <section>
            <h3>About Me</h3>
            <p>
              With over a decade of practice and eight years of teaching, I blend traditional Hatha
              with creative Vinyasa flow, always grounded in intentional breath work.
            </p>
          </section>
          <section>
            <h3>Specialties</h3>
            <p>Hatha Yoga · Ashtanga · Yoga Nidra · Pranayama</p>
          </section>
        </div>

        <div className="profile-sticky-cta">
          <button type="button" className="service-primary-btn" onClick={() => navigate('/schedule')}>
            Check Availability
          </button>
        </div>
      </div>
    </AppShell>
  )
}

const ADDRESS_MAP_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ecwtmRbo4rfbj2C4jUajip2TJOQ2jklCqadsju3mHmu_ecG6FT0FnoQdvb5D_YRc9n7Cc6vXio684ZHGnvgf3tXn6xqAJDHw67kncKGmD36hfww8Q8W7OQUYSSHj5SAvUuxlw4SkGXTNH_GlCuJNYBymw4G7xO5mvSbKiZXRdFl2G23V2fMuQnNpKKSse48TO0I8_a3NRExBq6n-O95p_iczDs6Ui-FMBLTCIp6OAnynuvymPIXUxjsWe333SYB7uQbhHWq8NIo'

function AddressSelectionScreen() {
  const navigate = useNavigate()

  return (
    <AppShell showNav={false} scrollContent={false}>
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

              <button
                type="button"
                className="address-item address-item-add"
                onClick={() => navigate('/home')}
              >
                <span className="address-icon address-icon-add">+</span>
                <span className="address-item-copy">
                  <strong>Add New Address</strong>
                </span>
              </button>
            </div>

            <button
              type="button"
              className="address-manual-link"
              onClick={() => navigate('/home')}
            >
              Enter Address Manually
            </button>
          </div>
        </div>
      </section>
    </AppShell>
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
    <AppShell>
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
              onClick={() => {
                setSelectedCategory(category)
                if (category === 'All Trainers') {
                  navigate('/trainers')
                  return
                }
                navigate(`/trainers?category=${encodeURIComponent(category)}`)
              }}
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
    </AppShell>
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
    <AppShell>
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
    </AppShell>
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
    <AppShell>
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
    </AppShell>
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
    <AppShell showNav={false}>
      <section className="preferences-shell">
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
      </section>
    </AppShell>
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
    <AppShell showNav={false}>
      <section className="group-shell">
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
      </section>
    </AppShell>
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
    <AppShell showNav={false}>
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
    </AppShell>
  )
}

function ConfirmationScreen() {
  const navigate = useNavigate()

  return (
    <AppShell showNav={false}>
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
    </AppShell>
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
            <HomeScreen />
          </RequireAuth>
        }
      />
      <Route
        path="/service/:slug"
        element={
          <RequireAuth>
            <ServiceDetailScreen />
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
            <AccountScreen />
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
        path="/confirmation"
        element={
          <RequireAuth>
            <ConfirmationScreen />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  )
}
