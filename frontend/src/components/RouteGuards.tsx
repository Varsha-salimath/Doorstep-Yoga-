import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'

export function AuthGuard() {
  const { state } = useAppState()
  const location = useLocation()
  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return <Outlet />
}

export function PublicOnlyGuard() {
  const { state } = useAppState()
  if (state.isAuthenticated) {
    return <Navigate to="/home" replace />
  }
  return <Outlet />
}
