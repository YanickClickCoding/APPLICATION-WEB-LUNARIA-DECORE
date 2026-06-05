import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import Icon from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCartStore } from '@/stores/useCartStore'
import { useChatStore } from '@/stores/useChatStore'

const LINKS = [
  { label: 'Boutique', to: '/catalogue' },
  { label: 'Décorations', to: '/services' },
  { label: 'Réalisations', to: '/galerie' },
  { label: 'À propos', to: '/a-propos' },
]

interface NavbarProps { dark?: boolean }

export default function Navbar({ dark = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
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
      className="lun-nav"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: scrolled ? '14px 56px' : '22px 56px',
        borderBottom: `1px solid ${onDark ? 'var(--line-dark)' : 'var(--line-2)'}`,
        background: onDark ? 'transparent' : 'rgba(255,255,255,.82)',
        backdropFilter: onDark ? 'none' : 'blur(10px)',
        transition: 'padding .3s, background .3s',
      }}
    >
      <Logo color={fg} mark={onDark ? 'var(--gold)' : 'var(--coral)'} />

      <nav className="lun-nav-links" style={{ display: 'flex', gap: 34 }}>
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to}
            style={({ isActive }) => ({
              fontSize: 14.5, fontWeight: isActive ? 600 : 500,
              color: isActive ? fg : sub, position: 'relative', textDecoration: 'none', paddingBottom: 4,
            })}>
            {({ isActive }) => (
              <>
                {l.label}
                {isActive && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -2, height: 2, background: 'var(--coral)', borderRadius: 2 }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: fg }}>
        <button onClick={() => navigate('/catalogue')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <Icon name="search" size={20} color={fg} />
        </button>
        {isAuthenticated && (
          <button onClick={() => navigate('/compte/favoris')} className="lun-nav-links" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <Icon name="heart" size={20} color={fg} />
          </button>
        )}
        {isAuthenticated && user?.role !== 'ADMIN' && (
          <button onClick={() => navigate('/compte/messages')} className="lun-nav-links" style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <Icon name="chat" size={20} color={fg} />
            {unreadTotal > 0 && (
              <span style={{ position: 'absolute', top: -6, right: -8, background: 'var(--coral)', color: '#fff', fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unreadTotal}
              </span>
            )}
          </button>
        )}
        <button onClick={openCart} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <Icon name="cart" size={20} color={fg} />
          {itemCount > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -8, background: 'var(--coral)', color: '#fff', fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {itemCount}
            </span>
          )}
        </button>

        <div className="lun-nav-links" style={{ width: 1, height: 20, background: onDark ? 'var(--line-dark)' : 'var(--line)' }} />

        {isAuthenticated ? (
          <div className="lun-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user?.role === 'ADMIN' && (
              <button onClick={() => navigate('/admin')} className="btn btn-sm btn-ghost" style={{ borderColor: onDark ? 'var(--line-dark)' : 'var(--line)', color: fg }}>
                Admin
              </button>
            )}
            <button onClick={() => navigate('/compte')} className="btn btn-sm"
              style={{ background: onDark ? '#fff' : 'var(--night)', color: onDark ? 'var(--night)' : '#fff' }}>
              <Icon name="user" size={15} color={onDark ? 'var(--night)' : '#fff'} /> Mon compte
            </button>
            <button onClick={() => { logout(); navigate('/') }} title="Déconnexion"
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <Icon name="logout" size={18} color={sub} />
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/connexion')} className="btn btn-sm lun-nav-links"
            style={{ background: onDark ? '#fff' : 'var(--night)', color: onDark ? 'var(--night)' : '#fff' }}>
            Se connecter
          </button>
        )}

        <button onClick={() => setMenuOpen(!menuOpen)} className="lun-burger"
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name={menuOpen ? 'close' : 'menu'} size={24} color={fg} />
        </button>
      </div>

      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--paper)', borderBottom: '1px solid var(--line)',
          padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: 'var(--sh-md)',
        }}>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              style={{ padding: '12px 8px', fontSize: 16, color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--line-2)' }}>
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

      <style>{`
        @media (max-width: 900px) {
          .lun-nav { padding: 16px 20px !important; }
          .lun-nav-links { display: none !important; }
          .lun-burger { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
