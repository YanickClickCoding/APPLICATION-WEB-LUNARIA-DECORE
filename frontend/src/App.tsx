import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import PublicLayout from '@/components/layout/PublicLayout'
import ClientLayout from '@/components/layout/ClientLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ToastContainer from '@/components/ui/ToastContainer'
import ChatListener from '@/components/chat/ChatListener'
import RoleSwitcher from '@/components/layout/RoleSwitcher'

// ─── Public pages ───────────────────────────────────────────────
const HomePage       = lazy(() => import('@/pages/public/HomePage'))
const CataloguePage  = lazy(() => import('@/pages/public/CataloguePage'))
const ProductPage    = lazy(() => import('@/pages/public/ProductPage'))
const ServicesPage   = lazy(() => import('@/pages/public/ServicesPage'))
const ServicePage    = lazy(() => import('@/pages/public/ServicePage'))
const GaleriePage    = lazy(() => import('@/pages/public/GaleriePage'))
const AboutPage      = lazy(() => import('@/pages/public/AboutPage'))
const AuthPage       = lazy(() => import('@/pages/public/AuthPage'))

// ─── Client pages ───────────────────────────────────────────────
const CartPage       = lazy(() => import('@/pages/client/CartPage'))
const CheckoutPage   = lazy(() => import('@/pages/client/CheckoutPage'))
const PaymentPage    = lazy(() => import('@/pages/client/PaymentPage'))
const AccountPage    = lazy(() => import('@/pages/client/AccountPage'))
const OrdersPage     = lazy(() => import('@/pages/client/OrdersPage'))
const OrderDetailPage = lazy(() => import('@/pages/client/OrderDetailPage'))
const PlanningPage   = lazy(() => import('@/pages/client/PlanningPage'))
const PlanningDetailPage = lazy(() => import('@/pages/client/PlanningDetailPage'))
const MessagesPage   = lazy(() => import('@/pages/client/MessagesPage'))
const FavoritesPage  = lazy(() => import('@/pages/client/FavoritesPage'))

// ─── Admin pages ────────────────────────────────────────────────
const AdminDashboard  = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminProducts   = lazy(() => import('@/pages/admin/AdminProducts'))
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'))
const AdminStock      = lazy(() => import('@/pages/admin/AdminStock'))
const AdminSuppliers  = lazy(() => import('@/pages/admin/AdminSuppliers'))
const AdminProfile    = lazy(() => import('@/pages/admin/AdminProfile'))
const AdminServices   = lazy(() => import('@/pages/admin/AdminServices'))
const AdminOrders     = lazy(() => import('@/pages/admin/AdminOrders'))
const AdminPlanning   = lazy(() => import('@/pages/admin/AdminPlanning'))
const AdminDelivery   = lazy(() => import('@/pages/admin/AdminDelivery'))
const AdminPayments   = lazy(() => import('@/pages/admin/AdminPayments'))
const AdminMessages   = lazy(() => import('@/pages/admin/AdminMessages'))
const AdminUsers      = lazy(() => import('@/pages/admin/AdminUsers'))
const AdminReviews    = lazy(() => import('@/pages/admin/AdminReviews'))
const AdminPromos     = lazy(() => import('@/pages/admin/AdminPromos'))

// ─── Profil & 404 ───────────────────────────────────────────────
const ProfilePage     = lazy(() => import('@/pages/client/ProfilePage'))
const NotFoundPage    = lazy(() => import('@/pages/public/NotFoundPage'))

export default function App() {
  return (
    <>
    <ToastContainer />
    <ChatListener />
    <RoleSwitcher />
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* ── Public ───────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/"               element={<HomePage />} />
          <Route path="/catalogue"      element={<CataloguePage />} />
          <Route path="/produit/:slug"  element={<ProductPage />} />
          <Route path="/services"       element={<ServicesPage />} />
          <Route path="/service/:slug"  element={<ServicePage />} />
          <Route path="/galerie"        element={<GaleriePage />} />
          <Route path="/a-propos"       element={<AboutPage />} />
          <Route path="/connexion"      element={<AuthPage initialMode="login" />} />
          <Route path="/inscription"    element={<AuthPage initialMode="signup" />} />
        </Route>

        {/* ── Achat : strictement client (l'admin est redirigé vers /admin) ── */}
        <Route element={<ProtectedRoute role="CLIENT" clientOnly />}>
          <Route element={<ClientLayout />}>
            <Route path="/panier"                     element={<CartPage />} />
            <Route path="/commande"                   element={<CheckoutPage />} />
            <Route path="/paiement/:paymentId"        element={<PaymentPage />} />
            <Route path="/compte/favoris"             element={<FavoritesPage />} />
          </Route>
        </Route>

        {/* ── Compte (client, accessible aussi à l'admin pour le suivi) ── */}
        <Route element={<ProtectedRoute role="CLIENT" />}>
          <Route element={<ClientLayout />}>
            <Route path="/compte"                     element={<AccountPage />} />
            <Route path="/compte/commandes"           element={<OrdersPage />} />
            <Route path="/compte/commandes/:id"       element={<OrderDetailPage />} />
            <Route path="/compte/planification"       element={<PlanningPage />} />
            <Route path="/compte/planification/:id"   element={<PlanningDetailPage />} />
            <Route path="/compte/messages"            element={<MessagesPage />} />
            <Route path="/compte/parametres"          element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ── Admin (protégé) ──────────────────────────── */}
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin"                element={<AdminDashboard />} />
            <Route path="/admin/produits"       element={<AdminProducts />} />
            <Route path="/admin/categories"     element={<AdminCategories />} />
            <Route path="/admin/stock"          element={<AdminStock />} />
            <Route path="/admin/fournisseurs"   element={<AdminSuppliers />} />
            <Route path="/admin/profil"         element={<AdminProfile />} />
            <Route path="/admin/services"       element={<AdminServices />} />
            <Route path="/admin/commandes"      element={<AdminOrders />} />
            <Route path="/admin/planification"  element={<AdminPlanning />} />
            <Route path="/admin/livraisons"     element={<AdminDelivery />} />
            <Route path="/admin/paiements"      element={<AdminPayments />} />
            <Route path="/admin/messages"       element={<AdminMessages />} />
            <Route path="/admin/clients"        element={<AdminUsers />} />
            <Route path="/admin/avis"           element={<AdminReviews />} />
            <Route path="/admin/promotions"     element={<AdminPromos />} />
          </Route>
        </Route>

        {/* ── 404 ──────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
    </>
  )
}
