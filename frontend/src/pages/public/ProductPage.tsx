import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import Stars from '@/components/ui/Stars'
import { productsService } from '@/services/products.service'
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToastStore } from '@/stores/useToastStore'
import { useFavorites } from '@/hooks/useFavorites'
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
  const { isFavorite, toggle } = useFavorites()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'ADMIN'
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
    <div className="lun-fiche">
      {/* Fil d'ariane */}
      <div className="lun-fiche-bread">
        <Link to="/catalogue">Boutique</Link>
        <span className="lun-fiche-sep">/</span>
        <span>{cat}</span>
        <span className="lun-fiche-sep">/</span>
        <span className="lun-fiche-current">{product.name}</span>
      </div>

      <div className="lun-fiche-grid">
        {/* Galerie */}
        <div className="lun-fiche-gallery">
          <div className="lun-fiche-main">
            {product.images?.[activeImg] && <img src={product.images[activeImg]} alt={product.name} />}
          </div>
          {product.images?.length > 1 && (
            <div className="lun-fiche-thumbs">
              {product.images.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`lun-fiche-thumb ${i === activeImg ? 'is-active' : ''}`}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="lun-fiche-info">
          <div className="eyebrow">{cat}</div>
          <h1 className="display lun-fiche-title">{product.name}</h1>
          <div className="lun-fiche-rate">
            <Stars value={product.ratings?.average ?? 5} size={16} />
            <span className="lun-fiche-rate-txt">
              {(product.ratings?.average ?? 5).toFixed(1)} · {product.ratings?.count ?? 0} avis
            </span>
            {product.isFeatured && <span className="tag" style={{ background: 'var(--coral-soft)', color: 'var(--coral-deep)' }}>Best-seller</span>}
          </div>
          <p className="lun-fiche-desc">{product.description}</p>

          <div className="display lun-fiche-price">
            {fmt(product.price)} <span className="cur">CFA</span>
            {product.comparePrice && (
              <>
                <span className="old">{fmt(product.comparePrice)}</span>
                <span className="tag" style={{ background: 'var(--coral-soft)', color: 'var(--coral-deep)', fontSize: 13 }}>-{discount}%</span>
              </>
            )}
          </div>
          <div className="lun-fiche-stock" style={{ color: product.stock > 0 ? 'var(--gold)' : 'var(--coral)' }}>
            ● {product.stock > 0 ? `En stock · installation sous 48h` : 'Rupture de stock'}
          </div>

          {product.stock > 0 && !isAdmin && (
            <div className="lun-fiche-buy">
              <div className="lun-fiche-qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))}><Icon name="minus" size={16} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}><Icon name="plus" size={16} /></button>
              </div>
              <button onClick={handleAdd} className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: 200 }}>Ajouter au panier <Icon name="cart" size={18} color="#fff" /></button>
              <button onClick={() => toggle(product._id)} className="btn btn-ghost btn-lg" aria-label={isFavorite(product._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'} style={{ padding: '0 18px' }}>
                <Icon name="heart" size={20} color={isFavorite(product._id) ? 'var(--coral)' : 'var(--ink)'} fill={isFavorite(product._id) ? 'var(--coral)' : 'none'} />
              </button>
            </div>
          )}
          {isAdmin && (
            <div style={{ marginTop: 8, padding: '12px 16px', background: 'var(--ivory-2)', borderRadius: 'var(--r-md)', fontSize: 13.5, color: 'var(--muted)' }}>
              Vue administrateur — l'achat est réservé aux comptes clients.
            </div>
          )}
          <button onClick={() => navigate('/compte/planification')} className="btn btn-ghost btn-lg" style={{ width: '100%', marginTop: 12 }}>
            Demander une décoration sur mesure
          </button>

          <div className="lun-fiche-reassure">
            {REASSURANCE.map(([ic, t]) => (
              <div key={t} className="lun-fiche-reassure-item">
                <Icon name={ic} size={18} color="var(--coral)" /> {t}
              </div>
            ))}
          </div>

          {product.tags?.length > 0 && (
            <div className="lun-fiche-tags">
              {product.tags.map((tag) => (
                <span key={tag} className="lun-fiche-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
