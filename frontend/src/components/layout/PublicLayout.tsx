import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '@/components/cart/CartDrawer'

export default function PublicLayout() {
  const { pathname } = useLocation()
  // La home a un hero sombre → navbar transparente/blanche au départ
  const dark = pathname === '/'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--ivory)' }}>
      <Navbar dark={dark} />
      <main style={{ flex: 1, paddingTop: dark ? 0 : 76 }}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
