import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import { ordersService } from '@/services/orders.service'
import { AccountSidebar } from './AccountPage'
import type { Order } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F'
const STATUS_COLORS: Record<string, string> = {
  EN_ATTENTE: 'var(--muted)', CONFIRME: '#3b82f6', EN_PREPARATION: 'var(--gold)',
  PRET: '#8b5cf6', EN_LIVRAISON: 'var(--coral)', LIVRE: '#3ec47a', ANNULE: '#ef4444',
}
const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente', CONFIRME: 'Confirmé', EN_PREPARATION: 'En préparation',
  PRET: 'Prêt', EN_LIVRAISON: 'En route', LIVRE: 'Livré', ANNULE: 'Annulé',
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', page],
    queryFn: () => ordersService.getMyOrders({ page }).then((r) => r.data),
  })
  const orders: Order[] = data?.data ?? []

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 56px 64px', display: 'flex', gap: 36 }} className="lun-acc">
      <AccountSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 className="display" style={{ fontSize: 40, margin: '0 0 24px' }}>Mes commandes</h1>
        {isLoading ? <LoadingSpinner /> : orders.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Aucune commande.</p>
            <button onClick={() => navigate('/catalogue')} className="btn btn-primary">Découvrir la boutique</button>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh-sm)' }}>
            {orders.map((o, i) => (
              <div key={o._id} onClick={() => navigate(`/compte/commandes/${o._id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px', borderBottom: i < orders.length - 1 ? '1px solid var(--line-2)' : 'none', cursor: 'pointer' }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--ivory-2)' }}>
                  {o.items?.[0]?.image && <img src={o.items[0].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{o.orderNumber}</div>
                  <div className="serif" style={{ fontSize: 18, fontWeight: 600 }}>{o.items?.[0]?.name}{o.items?.length > 1 ? ` +${o.items.length - 1}` : ''}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{new Date(o.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <span className="tag" style={{ background: 'var(--ivory-2)', color: STATUS_COLORS[o.status] ?? 'var(--muted)', fontWeight: 700 }}>● {STATUS_LABELS[o.status] ?? o.status}</span>
                <div className="display" style={{ fontSize: 22, width: 110, textAlign: 'right' }}>{fmt(o.total)}</div>
                <Icon name="chevr" size={18} color="var(--muted)" />
              </div>
            ))}
          </div>
        )}
        {(data?.totalPages ?? 1) > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            {Array.from({ length: data!.totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`chip ${n === page ? 'chip-active' : ''}`} style={{ minWidth: 40, justifyContent: 'center' }}>{n}</button>
            ))}
          </div>
        )}
      </div>
      <style>{`@media (max-width: 860px) { .lun-acc { flex-direction: column !important; padding: 28px 20px !important; } .lun-acc-side { width: 100% !important; } }`}</style>
    </div>
  )
}
