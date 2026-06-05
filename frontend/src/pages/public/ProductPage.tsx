import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import Stars from '@/components/ui/Stars'
import { productsService } from '@/services/products.service'
import { useCartStore } from '@/stores/useCartStore'
import { useToastStore } from '@/stores/useToastStore'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const fmt = (n: number) => n.toLocaleString('fr-FR')

const REASSURANCE: [string, string][] = [
  ['truck', 'Livraison & pose'],
  ['shield', 'Paiement sécurisé'],
  ['chat', 'Conseil dédié'],
]

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const { addProduct } = useCartStore()
  const toast = useToastStore()
  const navigate = useNavigate()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsService.getBySlug(slug!).then((r) => r.data),
    enabled: !!slug,
  })

  if (isLoading) return <LoadingSpinner fullScreen />
  if (!product) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Produit introuvable · <Link to="/catalogue" style={{ color: 'var(--coral)' }}>Retour</Link></p>
    </div>
  )

  const cat = typeof product.category === 'object' ? product.category?.name : ''
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : null

  const handleAdd = () => {
    addProduct(product, qty)
    toast.success('Ajouté au panier', `${product.name} × ${qty}`)
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }} className="lun-fiche">
      {/* Fil d'ariane */}
      <div style={{ padding: '24px 56px 0', fontSize: 13, color: 'var(--muted)' }}>
        <Link to="/catalogue" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Boutique</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--muted)' }}>{cat}</span>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{product.name}</span>
      </div>

      <div className="lun-fiche-grid" style={{ display: 'flex', gap: 48, padding: '28px 56px 56px' }}>
        {/* Galerie */}
        <div style={{ flex: 1.1 }}>
          <div style={{ height: 460, borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--ivory-2)' }}>
            {product.images?.[activeImg] && <img src={product.images[activeImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
              {product.images.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  style={{ flex: 1, height: 96, borderRadius: 'var(--r-md)', overflow: 'hidden', border: i === activeImg ? '2px solid var(--coral)' : '2px solid transparent', cursor: 'pointer', padding: 0, background: 'var(--ivory-2)' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div style={{ flex: 1 }}>
          <div className="eyebrow">{cat}</div>
          <h1 className="display" style={{ fontSize: 52, margin: '12px 0 0', lineHeight: 1 }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
            <Stars value={product.ratings?.average ?? 5} size={16} />
            <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>
              {(product.ratings?.average ?? 5).toFixed(1)} · {product.ratings?.count ?? 0} avis
            </span>
            {product.isFeatured && <span className="tag" style={{ background: 'var(--coral-soft)', color: 'var(--coral-deep)' }}>Best-seller</span>}
          </div>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginTop: 22 }}>{product.description}</p>

          <div className="display" style={{ fontSize: 40, margin: '24px 0 4px', display: 'flex', alignItems: 'baseline', gap: 12 }}>
            {fmt(product.price)} <span style={{ fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--sans)' }}>CFA</span>
            {product.comparePrice && (
              <>
                <span style={{ fontSize: 20, color: 'var(--muted-2)', textDecoration: 'line-through', fontFamily: 'var(--sans)' }}>{fmt(product.comparePrice)}</span>
                <span className="tag" style={{ background: 'var(--coral-soft)', color: 'var(--coral-deep)', fontSize: 13 }}>-{discount}%</span>
              </>
            )}
          </div>
          <div style={{ fontSize: 13, color: product.stock > 0 ? 'var(--gold)' : 'var(--coral)', fontWeight: 600 }}>
            ● {product.stock > 0 ? `En stock · installation sous 48h` : 'Rupture de stock'}
          </div>

          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: 14, marginTop: 30, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, border: '1.5px solid var(--line)', borderRadius: 'var(--r-pill)', padding: '11px 18px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="minus" size={16} /></button>
                <span style={{ fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="plus" size={16} /></button>
              </div>
              <button onClick={handleAdd} className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: 200 }}>Ajouter au panier <Icon name="cart" size={18} color="#fff" /></button>
            </div>
          )}
          <button onClick={() => navigate('/compte/planification')} className="btn btn-ghost btn-lg" style={{ width: '100%', marginTop: 12 }}>
            Demander une décoration sur mesure
          </button>

          <div style={{ display: 'flex', gap: 24, marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
            {REASSURANCE.map(([ic, t]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: 'var(--muted)' }}>
                <Icon name={ic} size={18} color="var(--coral)" /> {t}
              </div>
            ))}
          </div>

          {product.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
              {product.tags.map((tag) => (
                <span key={tag} style={{ fontSize: 12, color: 'var(--muted)', border: '1px solid var(--line)', padding: '4px 10px', borderRadius: 'var(--r-pill)' }}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .lun-fiche-grid { flex-direction: column !important; padding: 24px !important; }
          .lun-fiche > div:first-child { padding: 20px 24px 0 !important; }
        }
      `}</style>
    </div>
  )
}
