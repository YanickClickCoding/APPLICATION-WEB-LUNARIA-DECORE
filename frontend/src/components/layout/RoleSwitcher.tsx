import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/useAuthStore'

/**
 * Bascule flottante Client ↔ Admin.
 * Visible uniquement pour les utilisateurs ADMIN : leur permet de voir le site
 * comme un client puis de revenir au back-office.
 */
export default function RoleSwitcher() {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const onAdmin = location.pathname.startsWith('/admin')

  // Réservé aux admins ; masqué sur les pages admin (la bascule est dans la sidebar)
  if (!isAuthenticated || user?.role !== 'ADMIN' || onAdmin) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
      display: 'flex', alignItems: 'center', gap: 4, padding: 5,
      background: 'var(--night)', borderRadius: 'var(--r-pill)',
      boxShadow: '0 10px 30px rgba(26,26,46,.35)', border: '1px solid rgba(255,255,255,.1)',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px 0 12px', color: 'rgba(255,255,255,.5)', fontSize: 12 }}>
        <Icon name="moon" size={14} color="var(--gold)" /> Vue
      </span>
      <button onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 700, fontFamily: 'var(--sans)',
          background: !onAdmin ? 'var(--coral)' : 'transparent', color: !onAdmin ? '#fff' : 'rgba(255,255,255,.7)' }}>
        <Icon name="user" size={15} color={!onAdmin ? '#fff' : 'rgba(255,255,255,.7)'} /> Client
      </button>
      <button onClick={() => navigate('/admin')}
        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 700, fontFamily: 'var(--sans)',
          background: onAdmin ? 'var(--coral)' : 'transparent', color: onAdmin ? '#fff' : 'rgba(255,255,255,.7)' }}>
        <Icon name="grid" size={15} color={onAdmin ? '#fff' : 'rgba(255,255,255,.7)'} /> Admin
      </button>
    </div>
  )
}
