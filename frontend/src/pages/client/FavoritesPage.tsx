import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/useAuthStore'
import api from '@/services/api'
import type { Product } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import { AccountSidebar } from './AccountPage'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['favorites', user?.favorites],
    queryFn: async () => {
      if (!user?.favorites?.length) return []
      const r = await Promise.all(user.favorites.map((id) => api.get<Product>(`/products/${id}`).then((x) => x.data).catch(() => null)))
      return r.filter(Boolean) as Product[]
    },
    enabled: !!user,
  })

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 56px 64px', display: 'flex', gap: 36 }} className="lun-acc">
      <AccountSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 className="display" style={{ fontSize: 40, margin: '0 0 24px' }}>Mes favoris</h1>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><div style={{ width: 32, height: 32, border: '2px solid var(--line)', borderTopColor: 'var(--coral)', borderRadius: '50%', margin: '0 auto', animation: 'lun-spin .7s linear infinite' }} /></div>
        ) : !products?.length ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <Icon name="heart" size={40} color="var(--line)" />
            <p style={{ color: 'var(--muted)', margin: '14px 0 16px' }}>Aucun favori pour le moment.</p>
            <button onClick={() => navigate('/catalogue')} className="btn btn-primary">Découvrir la boutique</button>
          </div>
        ) : (
          <div className="lun-fav-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
      <style>{`
        @keyframes lun-spin { to { transform: rotate(360deg); } }
        @media (max-width: 860px) { .lun-acc { flex-direction: column !important; padding: 28px 20px !important; } .lun-acc-side { width: 100% !important; } .lun-fav-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  )
}
