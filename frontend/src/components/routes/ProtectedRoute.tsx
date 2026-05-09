import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export const ProtectedRoute = () => {
  const { isInitialized, isAuthenticated } = useAuth()

  if (!isInitialized) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center text-sm font-semibold text-slate-500 dark:text-slate-400'>
        Loading your workspace...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}
