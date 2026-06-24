import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import Icon from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCartStore } from '@/stores/useCartStore'
import { useChatStore } from '@/stores/useChatStore'

const LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'Boutique', to: '/catalogue' },
  { label: 'Décorations', to: '/services' },
  { label: 'Réalisations', to: '/galerie' },
  { label: 'À propos', to: '/a-propos' },
]

interface NavbarProps { dark?: boolean }

export default function Navbar({ dark = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuthStore()
  const { itemCount, openCart } = useCartStore()
  const { unreadTotal } = useChatStore()
  const navigate = useNavigate()

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
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} className="lun-nav-link"
            style={({ isActive }) => ({ color: isActive ? fg : sub, fontWeight: isActive ? 600 : 500 })}>
            {({ isActive }) => (
              <>
                {l.label}
                {isActive && <span className="lun-nav-underline" />}
              </>
            )}
          </NavLink>
        ))}
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
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setMenuOpen(false)} className="lun-mobile-link">
              {l.label}
            </NavLink>
          ))}
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
