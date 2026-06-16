import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/useCartStore'

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F'

export default function ProductCard({ product }: { product: Product }) {
  const { addProduct } = useCartStore()
  const navigate = useNavigate()
  const cat = typeof product.category === 'object' ? product.category?.name : ''

  return (
    <div className="card lun-prodcard" onClick={() => navigate(`/produit/${product.slug}`)}>
      <div className="lun-prodcard-media">
        {product.images?.[0] && <img src={product.images[0]} alt={product.name} />}
        <span className="lun-prodcard-fav">
          <Icon name="heart" size={16} color={product.comparePrice ? 'var(--coral)' : 'var(--muted)'} fill={product.comparePrice ? 'var(--coral)' : 'none'} />
        </span>
        {product.comparePrice && <span className="lun-prodcard-promo">Promo</span>}
      </div>
      <div className="lun-prodcard-body">
        <div className="lun-prodcard-cat">{cat}</div>
        <div className="serif lun-prodcard-name">{product.name}</div>
        <div className="lun-prodcard-foot">
          <span className="lun-prodcard-price">{fmt(product.price)}</span>
          <button onClick={(e) => { e.stopPropagation(); addProduct(product) }} className="lun-prodcard-add" aria-label="Ajouter au panier">
            <Icon name="plus" size={17} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  )
}
