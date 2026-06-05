import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToastStore } from '@/stores/useToastStore'
import { ordersService } from '@/services/orders.service'

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F'

const DELIVERY_TYPES: [string, string, string, number][] = [
  ['truck', 'Livraison à domicile', 'DOMICILE', 5000],
  ['box', 'Retrait en boutique', 'RETRAIT_BOUTIQUE', 0],
  ['spark', 'Livraison + installation', 'INSTALLATION_SITE', 12000],
]
const STEPS = ['Livraison', 'Paiement', 'Confirmation']

export default function CheckoutPage() {
  const { items, total, clear } = useCartStore()
  const { user } = useAuthStore()
  const toast = useToastStore()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [deliveryType, setDeliveryType] = useState('DOMICILE')
  const [method, setMethod] = useState<'MTN_MOMO' | 'MOOV_MONEY'>('MTN_MOMO')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [addr, setAddr] = useState({ fullName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(), quartier: '', ville: 'Cotonou', indications: '' })
  const [loading, setLoading] = useState(false)
  const set = (k: string, v: string) => setAddr((a) => ({ ...a, [k]: v }))

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <Icon name="cart" size={48} color="var(--line)" />
        <p style={{ color: 'var(--muted)', margin: '16px 0' }}>Votre panier est vide</p>
        <button onClick={() => navigate('/catalogue')} className="btn btn-primary">Aller au catalogue</button>
      </div>
    )
  }

  const fee = DELIVERY_TYPES.find((d) => d[2] === deliveryType)![3]
  const grand = total + fee

  const placeOrder = async () => {
    setLoading(true)
    try {
      const { data: order } = await ordersService.create({
        deliveryAddress: { ...addr, phone },
        deliveryType,
        items: items.map((i) => ({
          product: i.product?._id, service: i.service?._id,
          name: i.product?.name ?? i.service?.name ?? '', price: i.price, quantity: i.quantity,
          image: i.product?.images?.[0] ?? i.service?.images?.[0],
        })),
        subtotal: total, deliveryFee: fee, total: grand,
      } as never)
      clear()
      navigate(`/paiement/new?orderId=${order._id}&method=${method}&phone=${encodeURIComponent(phone)}&amount=${grand}`)
    } catch {
      toast.error('Erreur', 'Impossible de créer la commande.')
    } finally { setLoading(false) }
  }

  const lbl = { fontSize: 12.5, fontWeight: 600 as const, color: 'var(--muted)', marginBottom: 6, display: 'block' }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 56px 64px' }} className="lun-co">
      {/* Progression */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36, flexWrap: 'wrap' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 30, height: 30, borderRadius: '50%', background: i <= step ? 'var(--coral)' : 'var(--line)', color: i <= step ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                {i < step ? <Icon name="check" size={15} color="#fff" /> : i + 1}
              </span>
              <span style={{ fontSize: 14, fontWeight: i === step ? 700 : 500, color: i <= step ? 'var(--ink)' : 'var(--muted)' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 50, height: 2, background: i < step ? 'var(--coral)' : 'var(--line)' }} />}
          </div>
        ))}
      </div>

      <div className="lun-co-grid" style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        <div style={{ flex: 1.5 }}>
          {step === 0 && (
            <>
              <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, margin: '0 0 18px' }}>Mode de livraison</h2>
              <div className="lun-co-modes" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 32 }}>
                {DELIVERY_TYPES.map(([ic, t, val, p]) => {
                  const on = deliveryType === val
                  return (
                    <button key={val} onClick={() => setDeliveryType(val)} style={{ textAlign: 'left', border: `1.5px solid ${on ? 'var(--coral)' : 'var(--line)'}`, borderRadius: 'var(--r-md)', padding: '18px 16px', background: on ? 'var(--coral-soft)' : 'var(--paper)', cursor: 'pointer' }}>
                      <Icon name={ic} size={22} color={on ? 'var(--coral)' : 'var(--ink)'} />
                      <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 10 }}>{t}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{p === 0 ? 'Gratuit' : fmt(p)}</div>
                    </button>
                  )
                })}
              </div>
              {deliveryType !== 'RETRAIT_BOUTIQUE' && (
                <>
                  <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, margin: '0 0 18px' }}>Adresse de livraison</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div><label style={lbl}>Nom complet</label><input className="field" value={addr.fullName} onChange={(e) => set('fullName', e.target.value)} /></div>
                    <div><label style={lbl}>Téléphone</label><input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+229 XX XX XX XX" /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div><label style={lbl}>Quartier</label><input className="field" value={addr.quartier} onChange={(e) => set('quartier', e.target.value)} placeholder="Fidjrossè" /></div>
                    <div><label style={lbl}>Ville</label><input className="field" value={addr.ville} onChange={(e) => set('ville', e.target.value)} /></div>
                  </div>
                  <div><label style={lbl}>Repère / instructions</label><input className="field" value={addr.indications} onChange={(e) => set('indications', e.target.value)} placeholder="Ex : portail bleu, en face de la pharmacie…" /></div>
                </>
              )}
              <button onClick={() => setStep(1)} className="btn btn-primary btn-lg" style={{ marginTop: 24 }}>Continuer vers le paiement</button>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, margin: '0 0 18px' }}>Moyen de paiement</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {([['MTN_MOMO', 'MTN MoMo', '#ffcc00', '#1a1a2e'], ['MOOV_MONEY', 'Moov Money', '#0a4ea3', '#fff']] as const).map(([val, label, bg, fg]) => {
                  const on = method === val
                  return (
                    <button key={val} onClick={() => setMethod(val)} style={{ textAlign: 'left', border: `2px solid ${on ? 'var(--coral)' : 'var(--line)'}`, borderRadius: 'var(--r-md)', padding: 18, background: on ? 'var(--coral-soft)' : 'var(--paper)', cursor: 'pointer', position: 'relative' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: fg, fontSize: 11 }}>{val === 'MTN_MOMO' ? 'MTN' : 'moov'}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 12 }}>{label}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>Mobile Money</div>
                      {on && <span style={{ position: 'absolute', top: 14, right: 14 }}><Icon name="check" size={18} color="var(--coral)" /></span>}
                    </button>
                  )
                })}
              </div>
              <div style={{ marginTop: 20 }}>
                <label style={lbl}>Numéro {method === 'MTN_MOMO' ? 'MTN MoMo' : 'Moov Money'}</label>
                <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+229 XX XX XX XX" style={{ fontWeight: 600, letterSpacing: '.04em' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button onClick={() => setStep(0)} className="btn btn-ghost btn-lg">Retour</button>
                <button onClick={() => setStep(2)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>Vérifier ma commande</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, margin: '0 0 18px' }}>Confirmation</h2>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12 }}>
                  <span style={{ color: 'var(--muted)' }}>Livraison</span>
                  <span style={{ fontWeight: 600 }}>{DELIVERY_TYPES.find((d) => d[2] === deliveryType)![1]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12 }}>
                  <span style={{ color: 'var(--muted)' }}>Paiement</span>
                  <span style={{ fontWeight: 600 }}>{method === 'MTN_MOMO' ? 'MTN MoMo' : 'Moov Money'} · {phone}</span>
                </div>
                {deliveryType !== 'RETRAIT_BOUTIQUE' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--muted)' }}>Adresse</span>
                    <span style={{ fontWeight: 600, textAlign: 'right' }}>{addr.quartier}, {addr.ville}</span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={() => setStep(1)} className="btn btn-ghost btn-lg">Retour</button>
                <button onClick={placeOrder} disabled={loading} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                  {loading ? 'Création…' : `Payer ${fmt(grand)}`}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Récap */}
        <div style={{ flex: 1, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 26, boxShadow: 'var(--sh-sm)' }} className="lun-co-recap">
          <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, margin: '0 0 16px' }}>Votre commande</h3>
          {items.map((i) => (
            <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
              <span style={{ color: 'var(--muted)' }}>{(i.product?.name ?? i.service?.name)} ×{i.quantity}</span>
              <span style={{ fontWeight: 600 }}>{fmt(i.price * i.quantity)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10, color: 'var(--muted)' }}>
            <span>Livraison</span><span>{fee === 0 ? 'Gratuit' : fmt(fee)}</span>
          </div>
          <hr className="divider" style={{ margin: '14px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 700 }}>Total</span><span className="display" style={{ fontSize: 30 }}>{fmt(grand)}</span>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .lun-co { padding: 32px 20px !important; } .lun-co-grid { flex-direction: column !important; } .lun-co-modes { grid-template-columns: 1fr !important; } .lun-co-recap { width: 100%; } }`}</style>
    </div>
  )
}
