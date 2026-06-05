import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { useCartStore } from '@/stores/useCartStore'

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F'
const DELIVERY = 5000

export default function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCartStore()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><Icon name="cart" size={56} color="var(--line)" /></div>
        <h1 className="display" style={{ fontSize: 36 }}>Votre panier est vide</h1>
        <p style={{ color: 'var(--muted)', margin: '12px 0 28px' }}>Découvrez nos décorations pour vos plus beaux moments.</p>
        <button onClick={() => navigate('/catalogue')} className="btn btn-primary btn-lg">Explorer la boutique</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '44px 56px 64px' }} className="lun-cart">
      <h1 className="display" style={{ fontSize: 48, margin: 0 }}>
        Votre panier <span style={{ fontSize: 22, color: 'var(--muted)', fontFamily: 'var(--sans)' }}>· {items.length} article{items.length > 1 ? 's' : ''}</span>
      </h1>

      <div className="lun-cart-grid" style={{ display: 'flex', gap: 40, marginTop: 32, alignItems: 'flex-start' }}>
        {/* Liste */}
        <div style={{ flex: 1.5 }}>
          {items.map((item) => {
            const name = item.product?.name ?? item.service?.name ?? ''
            const image = item.product?.images?.[0] ?? item.service?.images?.[0] ?? ''
            const cat = typeof item.product?.category === 'object' ? item.product.category?.name : ''
            return (
              <div key={item._id} style={{ display: 'flex', gap: 20, alignItems: 'center', background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', padding: 16, marginBottom: 14 }}>
                <div style={{ width: 96, height: 96, borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--ivory-2)' }}>
                  {image && <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="serif" style={{ fontSize: 22, fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{cat}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1.5px solid var(--line)', borderRadius: 'var(--r-pill)', padding: '7px 13px' }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="minus" size={14} /></button>
                      <span style={{ fontWeight: 700, fontSize: 14, minWidth: 14, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="plus" size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item._id)} style={{ fontSize: 12.5, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name="trash" size={15} /> Retirer
                    </button>
                  </div>
                </div>
                <div className="display" style={{ fontSize: 24 }}>{fmt(item.price * item.quantity)}</div>
              </div>
            )
          })}
          <button onClick={() => navigate('/catalogue')} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, color: 'var(--coral)', fontSize: 14, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            <Icon name="chevl" size={16} color="var(--coral)" /> Continuer mes achats
          </button>
        </div>

        {/* Récap */}
        <div style={{ flex: 1, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 28, boxShadow: 'var(--sh-sm)', position: 'sticky', top: 96 }} className="lun-cart-recap">
          <h3 className="serif" style={{ fontSize: 26, margin: '0 0 20px', fontWeight: 600 }}>Récapitulatif</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, marginBottom: 12 }}>
            <span style={{ color: 'var(--muted)' }}>Sous-total</span><span style={{ fontWeight: 600 }}>{fmt(total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, marginBottom: 12 }}>
            <span style={{ color: 'var(--muted)' }}>Livraison & installation</span><span style={{ fontWeight: 600 }}>{fmt(DELIVERY)}</span>
          </div>
          <hr className="divider" style={{ margin: '8px 0 16px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
            <span style={{ fontWeight: 700 }}>Total</span>
            <span className="display" style={{ fontSize: 36 }}>{fmt(total + DELIVERY)}</span>
          </div>
          <button onClick={() => navigate('/commande')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Passer la commande <Icon name="arrow" size={18} color="#fff" />
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 18 }}>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: 'var(--muted)' }}>MTN MoMo</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: 'var(--muted)' }}>Moov Money</span>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .lun-cart { padding: 32px 20px !important; } .lun-cart-grid { flex-direction: column !important; } .lun-cart-recap { position: static !important; width: 100%; } }`}</style>
    </div>
  )
}
