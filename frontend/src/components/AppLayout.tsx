import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'

const navItems = [
  { to: '/home', label: 'Home' },
  { to: '/trainers', label: 'Search' },
  { to: '/history', label: 'Bookings' },
  { to: '/profile', label: 'Profile' },
]

export function AppLayout() {
  const { state } = useAppState()
  return (
    <div className="layout">
      <header className="top-nav">
        <Link to="/home" className="brand-link">
          New Delhi, India
        </Link>
        <div className="top-nav-actions">
          <Link to="/notifications">⏺</Link>
          <Link to="/settings">{state.userName.split(' ')[0]}</Link>
        </div>
      </header>
      <main className="route-shell animate-page">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
