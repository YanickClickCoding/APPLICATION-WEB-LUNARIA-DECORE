import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '@/components/cart/CartDrawer'

export default function ClientLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--ivory)' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 76 }}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
