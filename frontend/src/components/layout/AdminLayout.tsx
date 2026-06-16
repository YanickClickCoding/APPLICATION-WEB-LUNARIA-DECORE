import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import Icon from '@/components/ui/Icon'
import Logo from '@/components/ui/Logo'

const navItems = [
  { label: 'Tableau de bord', to: '/admin',               icon: 'grid' },
  { label: 'Produits',       to: '/admin/produits',       icon: 'box' },
  { label: 'Catégories',     to: '/admin/categories',     icon: 'grid' },
  { label: 'Stock',          to: '/admin/stock',          icon: 'box' },
  { label: 'Fournisseurs',   to: '/admin/fournisseurs',   icon: 'truck' },
  { label: 'Commandes',      to: '/admin/commandes',      icon: 'cart' },
  { label: 'Planifications', to: '/admin/planification',  icon: 'cal' },
  { label: 'Messages',       to: '/admin/messages',       icon: 'chat', badge: true },
  { label: 'Clients',        to: '/admin/clients',        icon: 'user' },
  { label: 'Paiements',      to: '/admin/paiements',      icon: 'card' },
  { label: 'Services',       to: '/admin/services',       icon: 'spark' },
  { label: 'Avis',           to: '/admin/avis',           icon: 'star' },
  { label: 'Promotions',     to: '/admin/promotions',     icon: 'tag' },
]

export default function AdminLayout() {
  const { logout } = useAuthStore()
  const { unreadTotal } = useChatStore()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="lun" style={{ width: '100%', minHeight: '100vh', background: 'var(--ivory)', display: 'flex' }}>
      {/* sidebar sombre */}
      <div style={{ width: 248, background: 'var(--night)', color: '#fff', padding: '26px 18px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div onClick={() => navigate('/admin')} style={{ padding: '0 8px 24px', cursor: 'pointer' }}>
          <Logo size={20} color="#fff" mark="var(--gold)" />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {navItems.map(({ label, to, icon, badge }) => {
            const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to))
            return (
              <NavLink
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--r-sm)', marginBottom: 3, cursor: 'pointer',
                  background: isActive ? 'rgba(255,255,255,.1)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,.62)', fontSize: 14, fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                }}
              >
                <Icon name={icon} size={18} color={isActive ? 'var(--gold)' : 'rgba(255,255,255,.62)'} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && unreadTotal > 0 && (
                  <span style={{
                    background: 'var(--coral)', color: '#fff', fontSize: 11, fontWeight: 700,
                    minWidth: 18, height: 18, borderRadius: 9, padding: '0 5px',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {unreadTotal}
                  </span>
                )}
              </NavLink>
            )
          })}

          {/* Voir le site comme un client (nouvel onglet) */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--r-sm)', marginTop: 8,
              background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.8)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}
          >
            <Icon name="eye" size={18} color="var(--gold)" />
            <span style={{ flex: 1 }}>Voir la boutique</span>
            <Icon name="arrowsm" size={15} color="rgba(255,255,255,.5)" />
          </a>
        </div>

        <div style={{ paddingTop: 20, marginTop: 'auto' }}>
          <button
            onClick={() => { logout(); navigate('/') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--r-sm)', cursor: 'pointer',
              background: 'transparent', color: 'rgba(255,100,100,.85)', fontSize: 14, fontWeight: 500, width: '100%', border: 'none', textAlign: 'left',
            }}
          >
            <Icon name="logout" size={18} color="rgba(255,100,100,.85)" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* contenu */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid var(--line-2)', background: 'var(--paper)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--ivory)', borderRadius: 'var(--r-pill)', padding: '9px 16px', width: 300 }}>
            <Icon name="search" size={17} color="var(--muted)" />
            <input type="text" placeholder="Rechercher…"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13.5, color: 'var(--ink)', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button onClick={() => navigate('/admin/messages')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <Icon name="bell" size={20} color="var(--muted)" />
              {unreadTotal > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -6, background: 'var(--coral)', color: '#fff', fontSize: 9, fontWeight: 700, minWidth: 15, height: 15, borderRadius: 8, padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadTotal}
                </span>
              )}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--coral-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--coral)', fontWeight: 700, fontSize: 14 }}>A</div>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>Admin</span>
            </div>
          </div>
        </div>

        <div style={{ padding: 32, flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
