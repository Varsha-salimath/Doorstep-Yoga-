import { useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

type Hotspot = {
  to: string
  label: string
  style: CSSProperties
}

function Screen({
  file,
  alt,
  hotspots,
}: {
  file: string
  alt: string
  hotspots?: Hotspot[]
}) {
  return (
    <div className="app-bg">
      <main className="phone-shell">
        <div className="screen-wrap">
          <img
            src={`/stitch-screens/${encodeURIComponent(file)}`}
            alt={alt}
            className="screen-image"
          />
          {hotspots?.map((spot, index) => (
            <a
              key={`${spot.label}-${index}`}
              href={spot.to}
              aria-label={spot.label}
              className="hotspot"
              style={spot.style}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

function LoginScreen() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const isValid = /^\d{10}$/.test(phone)
  const loginBackground =
    'https://www.figma.com/api/mcp/asset/7a8c4fad-c1eb-4683-b5a0-004cbd0e10e7'

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isValid) return
    navigate('/otp')
  }

  return (
    <div className="app-bg login-page" style={{ backgroundImage: `url(${loginBackground})` }}>
      <main className="phone-shell login-shell">
        <section className="login-header">
          <h1>Welcome to YogFit</h1>
          <p>Personal Yoga Trainers at Home.</p>
        </section>

        <form className="login-card" onSubmit={onSubmit}>
          <label className="field-label">Your Mobile Number</label>
          <div className="phone-input-wrap">
            <span>+91</span>
            <input
              type="tel"
              placeholder="00000 00000"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
              }
            />
          </div>

          <button className="send-otp-btn" type="submit" disabled={!isValid}>
            Send OTP
          </button>

          <div className="divider-row">
            <span />
            <p>Or continue with</p>
            <span />
          </div>

          <div className="social-row">
            <button type="button" className="social-btn">
              <span className="social-icon">G</span>
              Google
            </button>
            <button type="button" className="social-btn">
              <span className="social-icon">@</span>
              Email
            </button>
          </div>

          <p className="terms-text">
            By continuing, you agree to our <strong>Terms of Service</strong> and{' '}
            <strong>Privacy Policy</strong>.
          </p>
        </form>

        <div className="trust-pill">100+ Verified Instructors</div>
      </main>
    </div>
  )
}

function OtpScreen() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')

  const canContinue = useMemo(() => otp === '1234', [otp])

  function onVerify(event: FormEvent) {
    event.preventDefault()
    if (!canContinue) return
    navigate('/address')
  }

  return (
    <div className="app-bg">
      <main className="phone-shell">
        <div className="otp-card">
          <h1>OTP Verification</h1>
          <p>Enter code sent to your mobile number.</p>
          <form onSubmit={onVerify}>
            <input
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, '').slice(0, 4))
              }
              placeholder="1234"
            />
            <button type="submit" disabled={!canContinue}>
              Verify & Continue
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

function AddressScreen() {
  const navigate = useNavigate()

  return (
    <div className="app-bg address-page">
      <main className="address-shell">
        <header className="address-topbar">
          <div className="address-topbar-left">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
            </svg>
            <p>Set Your Practice Location</p>
          </div>
          <button type="button" aria-label="Close" onClick={() => navigate('/home')}>
            ×
          </button>
        </header>

        <section className="address-map-area">
          <div className="address-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m20 20-3.9-3.9m1.7-5.1a6.8 6.8 0 1 1-13.6 0 6.8 6.8 0 0 1 13.6 0Z" />
            </svg>
            <input type="text" placeholder="Search for area, street name..." />
          </div>
          <img
            className="address-map-preview"
            src="/stitch-screens/Address%20Selection.png"
            alt="Map preview"
          />
        </section>

        <section className="address-sheet">
          <div className="address-handle" />
          <button
            type="button"
            className="detect-btn"
            onClick={() => navigate('/schedule')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v2m0 16v2m10-10h-2M4 12H2m17.1-7.1-1.4 1.4M6.3 17.7l-1.4 1.4m0-14.2 1.4 1.4m12.8 12.8 1.4 1.4" />
            </svg>
            Detect my location
          </button>

          <p className="saved-title">Saved Addresses</p>

          <button type="button" className="address-row" onClick={() => navigate('/schedule')}>
            <span className="address-icon home-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.8 12 4l8 6.8V20h-5.2v-5.3H9.2V20H4v-9.2Z" />
              </svg>
            </span>
            <span className="address-copy">
              <strong>Home</strong>
              <small>B-12, Green Park Main, New Delhi</small>
            </span>
            <span className="address-chevron">{'>'}</span>
          </button>

          <button type="button" className="address-row" onClick={() => navigate('/schedule')}>
            <span className="address-icon office-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7.8h16V20H4V7.8Zm4-3.8h8v3H8v-3Z" />
              </svg>
            </span>
            <span className="address-copy">
              <strong>Office</strong>
              <small>Cyber City, Phase 2, Gurugram</small>
            </span>
            <span className="address-chevron">{'>'}</span>
          </button>

          <button type="button" className="add-address-btn">
            <span className="plus-ring">+</span>
            Add New Address
          </button>

          <button type="button" className="manual-address-btn">
            Enter Address Manually
          </button>
        </section>
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
        path="/home"
        element={
          <Screen
            file="Service Selection.png"
            alt="Home Service Selection"
            hotspots={[
              {
                to: '/trainers',
                label: 'Start booking',
                style: { left: '7%', right: '7%', top: '87%', height: '5.8%' },
              },
              {
                to: '/trainers',
                label: 'View trainers',
                style: { left: '7%', right: '7%', top: '93%', height: '5.8%' },
              },
              {
                to: '/home',
                label: 'Bottom Home',
                style: { left: '9%', width: '14%', top: '95.5%', height: '3%' },
              },
              {
                to: '/trainers',
                label: 'Bottom Search',
                style: { left: '31%', width: '16%', top: '95.5%', height: '3%' },
              },
              {
                to: '/trainers',
                label: 'Bottom Favorites',
                style: { left: '55%', width: '16%', top: '95.5%', height: '3%' },
              },
            ]}
          />
        }
      />
      <Route
        path="/trainers"
        element={
          <Screen
            file="Trainer Listing.png"
            alt="Trainer Listing"
            hotspots={[
              {
                to: '/preferences',
                label: 'Open filters',
                style: { left: '9%', width: '23%', top: '13%', height: '3.2%' },
              },
              {
                to: '/trainer-profile',
                label: 'Open trainer profile',
                style: { left: '8%', right: '8%', top: '23%', height: '8%' },
              },
            ]}
          />
        }
      />
      <Route
        path="/preferences"
        element={
          <Screen
            file="Trainer Preference Filter.png"
            alt="Trainer Preference Filter"
            hotspots={[
              {
                to: '/trainers',
                label: 'Back',
                style: { left: '8%', width: '10%', top: '3%', height: '4%' },
              },
              {
                to: '/trainers',
                label: 'Show trainers',
                style: { left: '7%', right: '7%', top: '90%', height: '6%' },
              },
            ]}
          />
        }
      />
      <Route
        path="/trainer-profile"
        element={
          <Screen
            file="Trainer Profile Page.png"
            alt="Trainer Profile"
            hotspots={[
              {
                to: '/address',
                label: 'Check availability',
                style: { left: '8%', right: '8%', top: '92%', height: '5.5%' },
              },
            ]}
          />
        }
      />
      <Route
        path="/address"
        element={<AddressScreen />}
      />
      <Route
        path="/schedule"
        element={
          <Screen
            file="Booking & Scheduling.png"
            alt="Booking and Scheduling"
            hotspots={[
              {
                to: '/confirmation',
                label: 'Proceed to checkout',
                style: { left: '6%', right: '6%', top: '93%', height: '5.5%' },
              },
            ]}
          />
        }
      />
      <Route
        path="/confirmation"
        element={
          <Screen
            file="Booking Confirmation.png"
            alt="Booking Confirmation"
            hotspots={[
              {
                to: '/home',
                label: 'Return home',
                style: { left: '8%', right: '8%', top: '88%', height: '6%' },
              },
            ]}
          />
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
