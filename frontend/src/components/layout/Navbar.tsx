import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import Icon from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCartStore } from '@/stores/useCartStore'
import { useChatStore } from '@/stores/useChatStore'

interface NavChild { label: string; to: string }
interface NavItem { label: string; to?: string; children?: NavChild[] }

const LINKS: NavItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'Boutique', to: '/catalogue' },
  {
    label: 'Services',
    children: [
      { label: 'Nos décorations', to: '/services' },
      { label: 'Devis / Planifier', to: '/compte/planification' },
    ],
  },
  { label: 'Réalisations', to: '/galerie' },
  {
    label: 'À propos',
    children: [
      { label: 'Notre histoire', to: '/a-propos' },
      { label: 'FAQ / Aide', to: '/faq' },
      { label: 'Blog / Inspirations', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

interface NavbarProps { dark?: boolean }

export default function Navbar({ dark = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const { isAuthenticated, user } = useAuthStore()
  const { itemCount, openCart } = useCartStore()
  const { unreadTotal } = useChatStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const childActive = (item: NavItem) => !!item.children?.some((c) => pathname === c.to)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onDark = dark && !scrolled
  const fg = onDark ? '#fff' : 'var(--ink)'
  const sub = onDark ? 'rgba(255,255,255,.7)' : 'var(--muted)'

  return (
    <header
      className={`lun-nav${scrolled ? ' is-scrolled' : ''}`}
      style={{
        color: fg,
        borderBottom: `1px solid ${onDark ? 'var(--line-dark)' : 'var(--line-2)'}`,
        background: onDark ? 'transparent' : 'rgba(255,255,255,.82)',
        backdropFilter: onDark ? 'none' : 'blur(10px)',
      }}
    >
      <Logo color={fg} mark={onDark ? 'var(--gold-bright)' : 'var(--coral)'} />

      <nav className="lun-nav-links">
        {LINKS.map((l) =>
          l.children ? (
            <div key={l.label} className={`lun-nav-item${openMenu === l.label ? ' is-open' : ''}`}
              onMouseEnter={() => setOpenMenu(l.label)}
              onMouseLeave={() => setOpenMenu(null)}>
              <button type="button" className="lun-nav-link lun-nav-trigger"
                aria-haspopup="true" aria-expanded={openMenu === l.label}
                onClick={() => setOpenMenu(openMenu === l.label ? null : l.label)}
                style={{ color: childActive(l) ? fg : sub, fontWeight: childActive(l) ? 600 : 500 }}>
                {l.label}
                <Icon name="chevd" size={14} color={childActive(l) ? fg : sub} />
                {childActive(l) && <span className="lun-nav-underline" />}
              </button>
              <div className="lun-nav-dropdown">
                {l.children.map((c) => (
                  <NavLink key={c.to} to={c.to} className="lun-nav-dropitem"
                    onClick={(e) => { setOpenMenu(null); (e.currentTarget as HTMLElement).blur() }}
                    style={({ isActive }) => ({ color: isActive ? 'var(--coral-deep)' : 'var(--ink)', fontWeight: isActive ? 700 : 500 })}>
                    {c.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink key={l.to} to={l.to!} end={l.to === '/'} className="lun-nav-link"
              style={({ isActive }) => ({ color: isActive ? fg : sub, fontWeight: isActive ? 600 : 500 })}>
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && <span className="lun-nav-underline" />}
                </>
              )}
            </NavLink>
          ),
        )}
      </nav>

      <div className="lun-nav-actions" style={{ color: fg }}>
        <button onClick={() => navigate('/catalogue')} className="lun-icon-btn" aria-label="Rechercher">
          <Icon name="search" size={20} color={fg} />
        </button>
        {isAuthenticated && user?.role !== 'ADMIN' && (
          <button onClick={() => navigate('/compte/favoris')} className="lun-icon-btn lun-nav-hide" aria-label="Favoris">
            <Icon name="heart" size={20} color={fg} />
            {(user?.favorites?.length ?? 0) > 0 && <span className="lun-badge">{user!.favorites!.length}</span>}
          </button>
        )}
        {isAuthenticated && user?.role !== 'ADMIN' && (
          <button onClick={() => navigate('/compte/messages')} className="lun-icon-btn lun-nav-hide" aria-label="Messages">
            <Icon name="chat" size={20} color={fg} />
            {unreadTotal > 0 && <span className="lun-badge">{unreadTotal}</span>}
          </button>
        )}
        {user?.role !== 'ADMIN' && (
          <button onClick={openCart} className="lun-icon-btn" aria-label="Panier">
            <Icon name="cart" size={20} color={fg} />
            {itemCount > 0 && <span className="lun-badge">{itemCount}</span>}
          </button>
        )}

        <div className="lun-nav-div lun-nav-hide" style={{ background: onDark ? 'var(--line-dark)' : 'var(--line)' }} />

        {isAuthenticated ? (
          <div className="lun-nav-hide" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user?.role === 'ADMIN' && (
              <button onClick={() => navigate('/admin')} className="btn btn-sm btn-ghost" style={{ borderColor: onDark ? 'var(--line-dark)' : 'var(--line)', color: fg }}>
                Admin
              </button>
            )}
            <button onClick={() => navigate('/compte')} className="btn btn-sm"
              style={{ background: onDark ? '#fff' : 'var(--night)', color: onDark ? 'var(--night)' : '#fff' }}>
              <Icon name="user" size={15} color={onDark ? 'var(--night)' : '#fff'} /> Mon compte
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/connexion')} className="btn btn-sm lun-nav-hide"
            style={{ 
              background: onDark ? 'transparent' : 'var(--night)', 
              color: onDark ? '#fff' : '#fff',
              border: onDark ? '1.5px solid rgba(255,255,255,0.4)' : '1.5px solid var(--night)'
            }}>
            Se connecter
          </button>
        )}

        <button onClick={() => setMenuOpen(!menuOpen)} className="lun-burger">
          <Icon name={menuOpen ? 'close' : 'menu'} size={24} color={fg} />
        </button>
      </div>

      {menuOpen && (
        <div className="lun-mobile-menu">
          {LINKS.map((l) =>
            l.children ? (
              <div key={l.label} className="lun-mobile-group">
                <span className="lun-mobile-grouplabel">{l.label}</span>
                {l.children.map((c) => (
                  <NavLink key={c.to} to={c.to} onClick={() => setMenuOpen(false)} className="lun-mobile-link lun-mobile-sublink">
                    {c.label}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink key={l.to} to={l.to!} end={l.to === '/'} onClick={() => setMenuOpen(false)} className="lun-mobile-link">
                {l.label}
              </NavLink>
            ),
          )}
          {!isAuthenticated ? (
            <button onClick={() => { setMenuOpen(false); navigate('/connexion') }} className="btn btn-dark" style={{ marginTop: 10 }}>Se connecter</button>
          ) : (
            <>
              <button onClick={() => { setMenuOpen(false); navigate('/compte') }} className="btn btn-dark" style={{ marginTop: 10 }}>Mon compte</button>
              {user?.role === 'ADMIN' && (
                <button onClick={() => { setMenuOpen(false); navigate('/admin') }} className="btn btn-ghost" style={{ marginTop: 6 }}>Admin</button>
              )}
            </>
          )}
        </div>
      )}
    </header>
  )
}
