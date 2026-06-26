import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppLayout } from './components/AppLayout'
import { AuthGuard, PublicOnlyGuard } from './components/RouteGuards'
import { AddressPage, ConfirmationPage, PaymentFailedPage, PaymentPage, SchedulePage, SummaryPage } from './pages/BookingPages'
import { LoginPage, OtpPage, SplashPage } from './pages/AuthPages'
import { HomePage, PreferencesPage, ServicesPage, TrainerDetailsPage, TrainersPage } from './pages/HomePages'
import { AboutPage, EditProfilePage, HelpPage, HistoryPage, NotificationsPage, PrivacyPage, ProfilePage, SettingsPage, TermsPage } from './pages/ProfilePages'
import { ErrorPage, LoadingPage, NotFoundPage } from './pages/UtilityPages'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyGuard />}>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />
      </Route>

      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/trainer/:id" element={<TrainerDetailsPage />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-failed" element={<PaymentFailedPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/app" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
