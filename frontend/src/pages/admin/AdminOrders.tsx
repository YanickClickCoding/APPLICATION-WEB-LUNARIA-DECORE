import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'
import type { Order, OrderStatus } from '@/types'
import { clickable } from '@/hooks/useClickable'

const fmt = (n: number) => (n ?? 0).toLocaleString('fr-FR') + ' F'

const STATUS_FLOW: OrderStatus[] = ['EN_ATTENTE', 'CONFIRME', 'EN_PREPARATION', 'PRET', 'EN_LIVRAISON', 'LIVRE']
const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente', CONFIRME: 'Confirmé', EN_PREPARATION: 'En préparation',
  PRET: 'Prêt', EN_LIVRAISON: 'En route', LIVRE: 'Livré', ANNULE: 'Annulé',
}
const STATUS_COLORS: Record<string, string> = {
  EN_ATTENTE: 'var(--muted)', CONFIRME: '#3b82f6', EN_PREPARATION: 'var(--gold)',
  PRET: '#8b5cf6', EN_LIVRAISON: 'var(--coral)', LIVRE: '#3ec47a', ANNULE: '#ef4444',
}
const FILTERS: [string, string][] = [['', 'Toutes'], ['EN_ATTENTE', 'En attente'], ['EN_PREPARATION', 'En préparation'], ['EN_LIVRAISON', 'En route'], ['LIVRE', 'Livrées']]

function fmtDate(d?: string) {
  return d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'
}

// ─── Vue Détail ──────────────────────────────────────────────────────────
function OrderDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const qc = useQueryClient()
  const toast = useToastStore()

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['admin-order', id],
    queryFn: () => api.get<Order>(`/orders/${id}`).then((r) => r.data),
  })

  const updateStatus = useMutation({
    mutationFn: (status: string) => api.patch(`/orders/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-order', id] })
      qc.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Statut mis à jour')
    },
    onError: () => toast.error('Erreur', 'Mise à jour impossible'),
  })

  if (isLoading || !order) return <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>Chargement…</div>

  const idx = STATUS_FLOW.indexOf(order.status as OrderStatus)
  const nextStatus = idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
        <span onClick={onBack} style={{ cursor: 'pointer' }}>Commandes</span>
        <Icon name="chevr" size={14} color="var(--muted)" />
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{order.orderNumber}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <h1 className="display" style={{ fontSize: 38, margin: 0 }}>{order.orderNumber}</h1>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: STATUS_COLORS[order.status], fontWeight: 700 }}>● {STATUS_LABELS[order.status]}</span>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 4 }}>
            Passée le {fmtDate(order.createdAt)} · {order.client?.firstName} {order.client?.lastName}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {order.status !== 'ANNULE' && order.status !== 'LIVRE' && (
            <button onClick={() => { if (confirm('Annuler cette commande ?')) updateStatus.mutate('ANNULE') }} className="btn btn-ghost btn-sm" style={{ color: 'var(--coral)' }}>Annuler</button>
          )}
          {nextStatus && (
            <button onClick={() => updateStatus.mutate(nextStatus)} disabled={updateStatus.isPending} className="btn btn-dark btn-sm">
              Passer à « {STATUS_LABELS[nextStatus]} »
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: 1.6 }}>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line-2)', fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)' }}>Articles</div>
            {order.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderBottom: i < order.items.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--r-sm)', overflow: 'hidden', background: 'var(--ivory-2)', flexShrink: 0 }}>
                  {it.image && <img src={it.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="serif" style={{ fontSize: 18, fontWeight: 600 }}>{it.name}</div>
                  {it.selectedOptions?.length ? <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{it.selectedOptions.join(' · ')}</div> : null}
                </div>
                <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>×{it.quantity}</span>
                <span style={{ fontWeight: 700, width: 100, textAlign: 'right' }}>{fmt(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)', marginBottom: 18 }}>Livraison</div>
            <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7 }}>
              <div><strong style={{ color: 'var(--ink)' }}>Type :</strong> {order.deliveryType === 'DOMICILE' ? 'Livraison à domicile' : order.deliveryType === 'RETRAIT_BOUTIQUE' ? 'Retrait en boutique' : 'Installation sur site'}</div>
              {order.deliveryAddress && (
                <div><strong style={{ color: 'var(--ink)' }}>Adresse :</strong> {order.deliveryAddress.quartier}, {order.deliveryAddress.ville} {order.deliveryAddress.indications ? `(${order.deliveryAddress.indications})` : ''}</div>
              )}
              {order.notes && <div><strong style={{ color: 'var(--ink)' }}>Notes :</strong> {order.notes}</div>}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 22, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)', marginBottom: 14 }}>Client</div>
            <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>{order.client?.firstName} {order.client?.lastName}</div>
            {order.client?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--muted)', marginBottom: 8 }}>
                <Icon name="phone" size={16} color="var(--coral)" /> {order.client.phone}
              </div>
            )}
            {order.deliveryAddress?.phone && order.deliveryAddress.phone !== order.client?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--muted)' }}>
                <Icon name="pin" size={16} color="var(--coral)" /> {order.deliveryAddress.phone}
              </div>
            )}
          </div>

          <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)', marginBottom: 14 }}>Paiement</div>
            {[['Sous-total', fmt(order.subtotal)], ['Livraison', fmt(order.deliveryFee)], ...(order.discount ? [['Réduction', '−' + fmt(order.discount)]] : [])].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 9, color: k === 'Réduction' ? 'var(--coral)' : 'var(--ink)' }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <hr className="divider" style={{ margin: '8px 0 12px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: order.payment ? 14 : 0 }}>
              <span style={{ fontWeight: 700 }}>Total</span><span className="display" style={{ fontSize: 26 }}>{fmt(order.total)}</span>
            </div>
            {order.payment && (
              <div style={{ background: 'var(--ivory)', borderRadius: 'var(--r-sm)', padding: '12px 14px', fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>{order.payment.method === 'MTN_MOMO' ? 'MTN MoMo' : 'Moov Money'}</span>
                <span style={{ fontWeight: 700, color: order.payment.status === 'CONFIRME' ? '#3ec47a' : 'var(--gold)' }}>
                  {order.payment.status === 'CONFIRME' ? 'Payé' : 'En attente'} · {fmt(order.payment.amount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Vue Liste ───────────────────────────────────────────────────────────
export default function AdminOrders() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: () => api.get('/orders/admin/all', { params: { page: 1, limit: 50, status: statusFilter || undefined } }).then((r) => r.data),
  })

  if (selectedId) return <OrderDetail id={selectedId} onBack={() => setSelectedId(null)} />

  const orders: Order[] = data?.data ?? []

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Commandes</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{data?.total ?? 0} commande{(data?.total ?? 0) > 1 ? 's' : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FILTERS.map(([v, l]) => (
            <span key={v} onClick={() => setStatusFilter(v)} className={`chip ${statusFilter === v ? 'chip-active' : ''}`} style={{ fontSize: 12.5, padding: '7px 14px' }}>{l}</span>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr 120px 130px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Réf.</span><span>Client</span><span>Articles</span><span>Total</span><span>Statut</span>
        </div>
        {isLoading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>Chargement…</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>Aucune commande {statusFilter ? 'pour ce filtre' : ''}.</div>
        ) : orders.map((o, i) => (
          <div key={o._id} {...clickable(() => setSelectedId(o._id), `Commande ${o.orderNumber}`)} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr 120px 130px', alignItems: 'center', padding: '14px 24px', borderBottom: i < orders.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14, cursor: 'pointer' }}>
            <span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{o.orderNumber}</span>
            <span style={{ fontWeight: 600 }}>{o.client?.firstName} {o.client?.lastName?.[0]}.</span>
            <span style={{ color: 'var(--muted)' }}>{o.items?.[0]?.name}{o.items?.length > 1 ? ` +${o.items.length - 1}` : ''}</span>
            <span style={{ fontWeight: 700 }}>{fmt(o.total)}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: STATUS_COLORS[o.status] ?? 'var(--muted)', fontWeight: 700, justifySelf: 'start' }}>● {STATUS_LABELS[o.status] ?? o.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
