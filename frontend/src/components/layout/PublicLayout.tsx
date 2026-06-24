import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '@/components/cart/CartDrawer'

const NAV_H = 76

export default function PublicLayout() {
  const { pathname } = useLocation()
  // La home a un hero au côté gauche sombre → navbar transparente/blanche au départ
  const dark = pathname === '/'
  // Page d'auth : pleine hauteur sous la navbar, sans footer (formulaire visible sans scroll)
  const auth = pathname === '/connexion' || pathname === '/inscription'

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--ivory)' }}>
      <Navbar dark={dark} />
      <main style={{
        flex: 1,
        paddingTop: dark ? 0 : NAV_H,
        ...(auth ? { height: '100dvh', boxSizing: 'border-box', overflow: 'hidden' } : null),
      }}>
        <Outlet />
      </main>
      {!auth && <Footer />}
      <CartDrawer />
    </div>
  )
}
