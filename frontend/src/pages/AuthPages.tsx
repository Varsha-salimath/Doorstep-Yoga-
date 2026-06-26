import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'
import { InputField, PageCard, PrimaryButton, SecondaryButton } from '../components/ui'
import { figmaAssets } from '../data/figmaAssets'

export function SplashPage() {
  const navigate = useNavigate()
  return (
    <div
      className="center-page auth-bg"
      style={{ backgroundImage: `url(${figmaAssets.loginBackground})` }}
    >
      <PageCard className="hero-card login-card">
        <p className="eyebrow">Premium wellness at home</p>
        <h1>YogFit</h1>
        <p>Book verified yoga trainers, personalize sessions, and stay consistent.</p>
        <PrimaryButton onClick={() => navigate('/login')}>Get Started</PrimaryButton>
      </PageCard>
    </div>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const { dispatch } = useAppState()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const isPhoneValid = /^\d{10}$/.test(phone)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isPhoneValid) {
      setError('Enter a valid 10-digit phone number')
      return
    }
    dispatch({ type: 'LOGIN_PHONE', payload: phone })
    navigate('/otp')
  }

  return (
    <div
      className="center-page auth-bg"
      style={{ backgroundImage: `url(${figmaAssets.loginBackground})` }}
    >
      <PageCard className="login-card">
        <h2>Welcome Back</h2>
        <p>Login with your phone number to continue.</p>
        <form onSubmit={onSubmit} className="stack">
          <InputField
            label="Phone Number"
            placeholder="9876543210"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
              setError('')
            }}
            error={error}
          />
          <small className="muted-text">Use any 10-digit number for demo login.</small>
          <PrimaryButton type="submit" disabled={!isPhoneValid}>
            {isPhoneValid ? 'Send OTP' : 'Enter 10-digit number'}
          </PrimaryButton>
        </form>
      </PageCard>
    </div>
  )
}

export function OtpPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppState()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  function verifyOtp(event: FormEvent) {
    event.preventDefault()
    if (otp !== '1234') {
      setError('Invalid OTP. Use 1234 for demo.')
      return
    }
    dispatch({ type: 'VERIFY_OTP' })
    navigate('/home')
  }

  return (
    <div
      className="center-page auth-bg"
      style={{ backgroundImage: `url(${figmaAssets.loginBackground})` }}
    >
      <PageCard className="login-card">
        <h2>OTP Verification</h2>
        <p>We sent a code to +91 {state.phone || '**********'}.</p>
        <form onSubmit={verifyOtp} className="stack">
          <InputField
            label="OTP Code"
            placeholder="1234"
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\D/g, '').slice(0, 4))
              setError('')
            }}
            error={error}
          />
          <PrimaryButton type="submit">Verify & Continue</PrimaryButton>
          <SecondaryButton type="button" onClick={() => navigate('/login')}>
            Change Number
          </SecondaryButton>
        </form>
      </PageCard>
    </div>
  )
}
