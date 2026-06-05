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
    <div className="card lun-prodcard" onClick={() => navigate(`/produit/${product.slug}`)}
      style={{ overflow: 'hidden', boxShadow: 'var(--sh-sm)', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s' }}>
      <div style={{ height: 220, position: 'relative', background: 'var(--ivory-2)', overflow: 'hidden' }}>
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name}
            className="lun-prodimg" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }} />
        )}
        <span style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="heart" size={16} color={product.comparePrice ? 'var(--coral)' : 'var(--muted)'} fill={product.comparePrice ? 'var(--coral)' : 'none'} />
        </span>
        {product.comparePrice && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--coral)', color: '#fff', padding: '5px 10px', borderRadius: 'var(--r-pill)', fontSize: 11, fontWeight: 700 }}>
            Promo
          </span>
        )}
      </div>
      <div style={{ padding: '16px 18px 20px' }}>
        <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{cat}</div>
        <div className="serif" style={{ fontSize: 21, fontWeight: 600, marginTop: 3, lineHeight: 1.15 }}>{product.name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>{fmt(product.price)}</span>
          <button onClick={(e) => { e.stopPropagation(); addProduct(product) }}
            style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'var(--night)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={17} color="#fff" />
          </button>
        </div>
      </div>
      <style>{`
        .lun-prodcard:hover { transform: translateY(-3px); box-shadow: var(--sh-md); }
        .lun-prodcard:hover .lun-prodimg { transform: scale(1.05); }
      `}</style>
    </div>
  )
}
