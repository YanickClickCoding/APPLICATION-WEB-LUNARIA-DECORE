import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

interface Props {
  role?: 'CLIENT' | 'ADMIN' | 'LIVREUR'
  // Si true, l'admin n'a PAS accès (pages strictement client : panier, favoris, commande…)
  clientOnly?: boolean
}

export default function ProtectedRoute({ role, clientOnly }: Props) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/connexion" replace />

  // Pages réservées aux clients : l'admin est renvoyé vers son espace
  if (clientOnly && user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  if (role && user?.role !== role && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
