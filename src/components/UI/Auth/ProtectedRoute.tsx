import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../../context/authContext'
import { useEffect } from 'react'

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()

  const location = useLocation()

  useEffect(() => {
    console.log(`Auth check at ${location.pathname}:`, isAuthenticated)
  }, [location, isAuthenticated])

  if (!isAuthenticated) {
    return <Navigate
      to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
      replace />
  }

  return (
    <div className="protected-layout">
      {/* Add any common layout for protected routes here (e.g., header, sidebar) */}
      <Outlet />
    </div>
  )

}

export default ProtectedRoute