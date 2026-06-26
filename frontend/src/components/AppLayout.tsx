import { Link, NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/home', label: 'Home' },
  { to: '/trainers', label: 'Search' },
  { to: '/history', label: 'Bookings' },
  { to: '/profile', label: 'Profile' },
]

export function AppLayout() {
  return (
    <div className="layout">
      <header className="top-nav">
        <Link to="/home" className="location-wrap">
          <span className="location-pin">◉</span>
          <span>
            <small>CURRENT LOCATION</small>
            <strong>New Delhi, India</strong>
          </span>
        </Link>
        <div className="top-nav-actions">
          <Link to="/notifications" className="icon-btn">🔔</Link>
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
