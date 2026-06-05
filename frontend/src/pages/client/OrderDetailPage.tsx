import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import { ordersService } from '@/services/orders.service'
import { useToastStore } from '@/stores/useToastStore'
import type { Order, OrderStatus } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F'

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'EN_ATTENTE', label: 'Commande reçue' },
  { key: 'CONFIRME', label: 'Confirmée' },
  { key: 'EN_PREPARATION', label: 'En préparation' },
  { key: 'EN_LIVRAISON', label: 'En route' },
  { key: 'LIVRE', label: 'Livrée' },
]

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const toast = useToastStore()

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => ordersService.getById(id!).then((r) => r.data),
    enabled: !!id,
  })

  const cancel = useMutation({
    mutationFn: () => ordersService.cancel(id!),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['order', id] }); toast.success('Commande annulée') },
    onError: () => toast.error('Erreur', 'Annulation impossible.'),
  })

  if (isLoading) return <LoadingSpinner fullScreen />
  if (!order) return <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--muted)' }}>Commande introuvable · <Link to="/compte/commandes" style={{ color: 'var(--coral)' }}>Retour</Link></p></div>

  const cancelled = order.status === 'ANNULE'
  const currentStep = STEPS.findIndex((s) => s.key === order.status)
  const canCancel = ['EN_ATTENTE', 'CONFIRME'].includes(order.status)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 64px' }}>
      <Link to="/compte/commandes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14, textDecoration: 'none', marginBottom: 20 }}>
        <Icon name="chevl" size={15} /> Mes commandes
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="eyebrow">Suivi de commande</div>
          <h1 className="display" style={{ fontSize: 40, margin: '8px 0 0' }}>{order.orderNumber}</h1>
        </div>
        <div className="display" style={{ fontSize: 32, color: 'var(--coral)' }}>{fmt(order.total)}</div>
      </div>

      {/* Progression */}
      {!cancelled ? (
        <div className="card" style={{ padding: 28, marginTop: 24, boxShadow: 'var(--sh-sm)' }}>
          {STEPS.map((s, i) => {
            const done = i <= currentStep
            return (
              <div key={s.key} style={{ display: 'flex', gap: 16, paddingBottom: i < STEPS.length - 1 ? 24 : 0, position: 'relative' }}>
                {i < STEPS.length - 1 && <div style={{ position: 'absolute', left: 13, top: 28, bottom: 0, width: 2, background: done ? 'var(--coral)' : 'var(--line)' }} />}
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, zIndex: 1, background: done ? 'var(--coral)' : 'var(--ivory-2)', border: done ? 'none' : '2px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {done ? <Icon name="check" size={15} color="#fff" /> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--muted-2)' }} />}
                </div>
                <div style={{ fontSize: 15, fontWeight: done ? 700 : 600, color: done ? 'var(--ink)' : 'var(--muted-2)', paddingTop: 3 }}>{s.label}</div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ background: 'var(--coral-soft)', borderRadius: 'var(--r-md)', padding: 18, marginTop: 24, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--coral-deep)' }}>
          <Icon name="close" size={20} color="var(--coral-deep)" /> Cette commande a été annulée.
        </div>
      )}

      {/* Articles */}
      <div className="card" style={{ overflow: 'hidden', marginTop: 24 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="box" size={16} color="var(--coral)" />
          <h2 className="serif" style={{ fontSize: 20, fontWeight: 600 }}>Articles ({order.items.length})</h2>
        </div>
        {order.items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px', borderBottom: i < order.items.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--ivory-2)' }}>
              {it.image && <img src={it.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div className="serif" style={{ fontSize: 17, fontWeight: 600 }}>{it.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Quantité : {it.quantity}</div>
            </div>
            <div style={{ fontWeight: 700 }}>{fmt(it.price * it.quantity)}</div>
          </div>
        ))}
        <div style={{ padding: '16px 22px', background: 'var(--ivory)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}><span>Sous-total</span><span>{fmt(order.subtotal)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}><span>Livraison</span><span>{order.deliveryFee === 0 ? 'Gratuit' : fmt(order.deliveryFee)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: 8, borderTop: '1px solid var(--line)' }}><span>Total</span><span className="display" style={{ fontSize: 22 }}>{fmt(order.total)}</span></div>
        </div>
      </div>

      {canCancel && (
        <button onClick={() => { if (confirm('Annuler cette commande ?')) cancel.mutate() }} disabled={cancel.isPending}
          className="btn btn-ghost" style={{ width: '100%', marginTop: 20, borderColor: 'var(--coral)', color: 'var(--coral)' }}>
          Annuler la commande
        </button>
      )}
    </div>
  )
}
