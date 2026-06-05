import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

interface Props {
  role?: 'CLIENT' | 'ADMIN' | 'LIVREUR'
}

export default function ProtectedRoute({ role }: Props) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/connexion" replace />
  if (role && user?.role !== role && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
