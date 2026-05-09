import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export const ProtectedRoute = () => {
  const { isInitialized, isAuthenticated } = useAuth()
  if (!isInitialized) {
    return (
      <div className='min-h-screen flex items-center justify-center ui-text-muted'>
        loading...
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to='/login' />
  }
  return <Outlet />
}
