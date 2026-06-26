import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import Icon from '@/components/ui/Icon'
import Logo from '@/components/ui/Logo'
import { clickable } from '@/hooks/useClickable'

interface NavItem { label: string; to: string; icon: string; badge?: boolean }
interface NavGroup { label: string; icon: string; items: NavItem[] }

// Lien direct hors section (tableau de bord)
const navHome: NavItem = { label: 'Tableau de bord', to: '/admin', icon: 'grid' }

// Sections repliables
const navGroups: NavGroup[] = [
  {
    label: 'Catalogue', icon: 'box', items: [
      { label: 'Produits',     to: '/admin/produits',     icon: 'box' },
      { label: 'Catégories',   to: '/admin/categories',   icon: 'grid' },
      { label: 'Stock',        to: '/admin/stock',        icon: 'box' },
      { label: 'Fournisseurs', to: '/admin/fournisseurs', icon: 'truck' },
      { label: 'Services',     to: '/admin/services',     icon: 'spark' },
    ],
  },
  {
    label: 'Ventes', icon: 'cart', items: [
      { label: 'Commandes',     to: '/admin/commandes',     icon: 'cart' },
      { label: 'Planifications', to: '/admin/planification', icon: 'cal' },
      { label: 'Paiements',     to: '/admin/paiements',     icon: 'card' },
      { label: 'Promotions',    to: '/admin/promotions',    icon: 'tag' },
    ],
  },
  {
    label: 'Relation client', icon: 'chat', items: [
      { label: 'Messages', to: '/admin/messages', icon: 'chat', badge: true },
      { label: 'Clients',  to: '/admin/clients',  icon: 'user' },
      { label: 'Avis',     to: '/admin/avis',     icon: 'star' },
    ],
  },
]

export default function AdminLayout() {
  const { logout } = useAuthStore()
  const { unreadTotal } = useChatStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isItemActive = (to: string) =>
    location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to))
  // Section contenant la page active (pour l'ouvrir par défaut)
  const activeGroup = navGroups.find((g) => g.items.some((it) => isItemActive(it.to)))?.label ?? null
  const [openGroup, setOpenGroup] = useState<string | null>(activeGroup)
  // Garde la bonne section ouverte quand on change de page
  useEffect(() => { if (activeGroup) setOpenGroup(activeGroup) }, [activeGroup])

  // Ferme le tiroir à chaque changement de page (mobile)
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  // Ferme le tiroir avec Échap
  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  return (
    <div className="lun lun-admin">
      {/* Overlay sombre (mobile, derrière le tiroir) */}
      {sidebarOpen && <div className="lun-admin-scrim" aria-hidden="true" onClick={() => setSidebarOpen(false)} />}

      {/* sidebar sombre */}
      <aside className={`lun-admin-side${sidebarOpen ? ' is-open' : ''}`}>
        <div {...clickable(() => navigate('/admin'), 'Accueil administration')} style={{ padding: '0 8px 24px', cursor: 'pointer' }}>
          <Logo size={20} color="#fff" mark="var(--gold)" />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Tableau de bord (lien direct) */}
          <NavLink to={navHome.to} aria-current={isItemActive(navHome.to) ? 'page' : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--r-sm)', marginBottom: 3, cursor: 'pointer',
              background: isItemActive(navHome.to) ? 'rgba(255,255,255,.1)' : 'transparent',
              color: isItemActive(navHome.to) ? '#fff' : 'rgba(255,255,255,.62)', fontSize: 14, fontWeight: isItemActive(navHome.to) ? 700 : 500, textDecoration: 'none',
            }}>
            <Icon name={navHome.icon} size={18} color={isItemActive(navHome.to) ? 'var(--gold)' : 'rgba(255,255,255,.62)'} />
            <span style={{ flex: 1 }}>{navHome.label}</span>
          </NavLink>

          {/* Sections repliables */}
          {navGroups.map((group) => {
            const open = openGroup === group.label
            const groupHasActive = group.items.some((it) => isItemActive(it.to))
            const groupBadge = group.items.some((it) => it.badge) && unreadTotal > 0
            return (
              <div key={group.label} style={{ marginTop: 4 }}>
                <button type="button" onClick={() => setOpenGroup(open ? null : group.label)}
                  aria-expanded={open}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 14px', borderRadius: 'var(--r-sm)', cursor: 'pointer',
                    background: 'transparent', border: 'none', textAlign: 'left',
                    color: groupHasActive ? '#fff' : 'rgba(255,255,255,.62)', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                  }}>
                  <Icon name={group.icon} size={18} color={groupHasActive ? 'var(--gold)' : 'rgba(255,255,255,.62)'} />
                  <span style={{ flex: 1 }}>{group.label}</span>
                  {groupBadge && !open && (
                    <span style={{ background: 'var(--coral)', color: '#fff', fontSize: 11, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9, padding: '0 5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{unreadTotal}</span>
                  )}
                  <Icon name="chevd" size={14} color="rgba(255,255,255,.5)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>

                {open && (
                  <div style={{ marginLeft: 8, paddingLeft: 14, borderLeft: '1px solid rgba(255,255,255,.12)' }}>
                    {group.items.map(({ label, to, icon, badge }) => {
                      const isActive = isItemActive(to)
                      return (
                        <NavLink key={to} to={to} aria-current={isActive ? 'page' : undefined}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 'var(--r-sm)', marginBottom: 2, cursor: 'pointer',
                            background: isActive ? 'rgba(255,255,255,.1)' : 'transparent',
                            color: isActive ? '#fff' : 'rgba(255,255,255,.55)', fontSize: 13.5, fontWeight: isActive ? 700 : 500, textDecoration: 'none',
                          }}>
                          <Icon name={icon} size={16} color={isActive ? 'var(--gold)' : 'rgba(255,255,255,.5)'} />
                          <span style={{ flex: 1 }}>{label}</span>
                          {badge && unreadTotal > 0 && (
                            <span style={{ background: 'var(--coral)', color: '#fff', fontSize: 10.5, fontWeight: 700, minWidth: 17, height: 17, borderRadius: 9, padding: '0 5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{unreadTotal}</span>
                          )}
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
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
      </aside>

      {/* contenu */}
      <div className="lun-admin-content">
        {/* topbar */}
        <div className="lun-admin-topbar">
          {/* Bouton menu (mobile uniquement) */}
          <button type="button" className="lun-admin-burger" aria-label="Ouvrir le menu" onClick={() => setSidebarOpen(true)}>
            <Icon name="menu" size={22} color="var(--ink)" />
          </button>

          <div className="lun-admin-search">
            <Icon name="search" size={17} color="var(--muted)" />
            <input type="search" placeholder="Rechercher…" aria-label="Rechercher dans l'administration"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13.5, color: 'var(--ink)', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button onClick={() => navigate('/admin/messages')} aria-label={unreadTotal > 0 ? `Notifications, ${unreadTotal} non lues` : 'Notifications'} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <Icon name="bell" size={20} color="var(--muted)" />
              {unreadTotal > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -6, background: 'var(--coral)', color: '#fff', fontSize: 9, fontWeight: 700, minWidth: 15, height: 15, borderRadius: 8, padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadTotal}
                </span>
              )}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--coral-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--coral)', fontWeight: 700, fontSize: 14 }}>A</div>
              <span className="lun-admin-username" style={{ fontSize: 13.5, fontWeight: 600 }}>Admin</span>
            </div>
          </div>
        </div>

        <div className="lun-admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
