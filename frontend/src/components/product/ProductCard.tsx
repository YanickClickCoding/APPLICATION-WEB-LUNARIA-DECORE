import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useFavorites } from '@/hooks/useFavorites'
import { clickable } from '@/hooks/useClickable'

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F'

export default function ProductCard({ product }: { product: Product }) {
  const { addProduct } = useCartStore()
  const { isFavorite, toggle } = useFavorites()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'
  const cat = typeof product.category === 'object' ? product.category?.name : ''
  const fav = isFavorite(product._id)

  return (
    <div className="card lun-prodcard" {...clickable(() => navigate(`/produit/${product.slug}`), product.name)}>
      <div className="lun-prodcard-media">
        {product.images?.[0] && <img src={product.images[0]} alt={product.name} />}
        {!isAdmin && (
          <button type="button" className="lun-prodcard-fav" aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            onClick={(e) => { e.stopPropagation(); toggle(product._id) }}>
            <Icon name="heart" size={16} color={fav ? 'var(--coral)' : 'var(--muted)'} fill={fav ? 'var(--coral)' : 'none'} />
          </button>
        )}
        {product.comparePrice && <span className="lun-prodcard-promo">Promo</span>}
      </div>
      <div className="lun-prodcard-body">
        <div className="lun-prodcard-cat">{cat}</div>
        <div className="serif lun-prodcard-name">{product.name}</div>
        <div className="lun-prodcard-foot">
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
            <span className="lun-prodcard-price">{fmt(product.price)}</span>
            {product.comparePrice != null && product.comparePrice > product.price && (
              <span style={{ fontSize: 13, color: 'var(--muted-2)', textDecoration: 'line-through' }}>{fmt(product.comparePrice)}</span>
            )}
          </span>
          {!isAdmin && (
            <button onClick={(e) => { e.stopPropagation(); addProduct(product) }} className="lun-prodcard-add" aria-label="Ajouter au panier">
              <Icon name="plus" size={17} color="#fff" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
