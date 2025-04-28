import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const token = localStorage.getItem('token') // or get it from cookies/auth context

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/sign-in" replace />
  }

  // If token exists, allow to access protected pages
  return <Outlet />
}

export default ProtectedRoute
