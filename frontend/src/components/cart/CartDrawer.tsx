import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { useCartStore } from '@/stores/useCartStore'

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F'

export default function CartDrawer() {
  const { items, total, isOpen, closeCart, removeItem, updateQuantity } = useCartStore()
  if (!isOpen) return null

  return (
    <>
      <div onClick={closeCart}
        style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,46,.5)', backdropFilter: 'blur(3px)', zIndex: 60 }} />

      <aside style={{
        position: 'fixed', right: 0, top: 0, height: '100%', width: '100%', maxWidth: 440,
        background: 'var(--paper)', zIndex: 70, display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--sh-lg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', borderBottom: '1px solid var(--line-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="cart" size={20} color="var(--coral)" />
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 600 }}>Votre panier</h2>
            <span className="tag" style={{ background: 'var(--coral-soft)', color: 'var(--coral-deep)' }}>{items.length}</span>
          </div>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <Icon name="close" size={20} color="var(--muted)" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {items.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center' }}>
              <Icon name="cart" size={48} color="var(--line)" />
              <p style={{ color: 'var(--muted)' }}>Votre panier est vide</p>
              <button onClick={closeCart} className="btn btn-ghost btn-sm">Continuer mes achats</button>
            </div>
          ) : items.map((item) => {
            const name = item.product?.name ?? item.service?.name ?? ''
            const image = item.product?.images?.[0] ?? item.service?.images?.[0] ?? ''
            return (
              <div key={item._id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 12, borderRadius: 'var(--r-md)', border: '1px solid var(--line-2)', marginBottom: 12 }}>
                <div style={{ width: 72, height: 72, borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--ivory-2)' }}>
                  {image && <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="serif" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.2 }}>{name}</div>
                  <div style={{ color: 'var(--coral)', fontWeight: 700, fontSize: 14, marginTop: 4 }}>{fmt(item.price)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1.5px solid var(--line)', borderRadius: 'var(--r-pill)', padding: '5px 12px' }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="minus" size={13} /></button>
                      <span style={{ fontWeight: 700, fontSize: 13, minWidth: 14, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="plus" size={13} /></button>
                    </div>
                    <button onClick={() => removeItem(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                      <Icon name="trash" size={15} color="var(--muted-2)" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {items.length > 0 && (
          <div style={{ padding: 24, borderTop: '1px solid var(--line-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <span style={{ color: 'var(--muted)' }}>Sous-total</span>
              <span className="display" style={{ fontSize: 28 }}>{fmt(total)}</span>
            </div>
            <Link to="/commande" onClick={closeCart} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Passer la commande <Icon name="arrow" size={18} color="#fff" />
            </Link>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 14 }}>
              <span className="tag" style={{ background: 'var(--ivory-2)', color: 'var(--muted)' }}>MTN MoMo</span>
              <span className="tag" style={{ background: 'var(--ivory-2)', color: 'var(--muted)' }}>Moov Money</span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
