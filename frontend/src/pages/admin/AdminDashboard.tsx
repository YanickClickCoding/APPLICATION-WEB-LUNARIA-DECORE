import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import type { Order } from '@/types'

const fmt = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + ' M F'
  if (n >= 1_000) return Math.round(n / 1_000) + 'k F'
  return n.toLocaleString('fr-FR') + ' F'
}

interface AdminStats {
  orders: { total: number; today: number; pending: number }
  revenue: { today: number; total: number }
  clients: { total: number; new: number }
  planning: { pending: number; confirmed: number }
  messages: { unread: number }
  deliveries: { inProgress: number }
}

const STATUS_COLORS: Record<string, string> = {
  EN_ATTENTE: 'var(--muted)', CONFIRME: '#3b82f6', EN_PREPARATION: 'var(--gold)',
  PRET: '#8b5cf6', EN_LIVRAISON: 'var(--coral)', LIVRE: '#3ec47a', ANNULE: '#ef4444',
}
const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente', CONFIRME: 'Confirmé', EN_PREPARATION: 'En préparation',
  PRET: 'Prêt', EN_LIVRAISON: 'En route', LIVRE: 'Livré', ANNULE: 'Annulé',
}

export default function AdminDashboard() {
  const navigate = useNavigate()

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: () => api.get<AdminStats>('/admin/stats').then((r) => r.data),
  })
  const { data: ordersResp } = useQuery({
    queryKey: ['admin-orders', 'recent'],
    queryFn: () => api.get('/orders/admin/all', { params: { page: 1, limit: 5 } }).then((r) => r.data),
  })

  const recentOrders: Order[] = ordersResp?.data ?? []

  const kpis: [string, string, string, string][] = [
    ["Chiffre d'affaires", fmt(stats?.revenue.total ?? 0), `${fmt(stats?.revenue.today ?? 0)} aujourd'hui`, 'var(--coral)'],
    ['Commandes', String(stats?.orders.total ?? 0), `${stats?.orders.today ?? 0} aujourd'hui`, 'var(--gold)'],
    ['Devis en attente', String(stats?.planning.pending ?? 0), `${stats?.planning.confirmed ?? 0} confirmés`, 'var(--night)'],
    ['Clients', String(stats?.clients.total ?? 0), `+${stats?.clients.new ?? 0} cette semaine`, '#3ec47a'],
  ]

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Tableau de bord</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>Vue d'ensemble en temps réel</div>
        </div>
        <button onClick={() => navigate('/admin/produits')} className="btn btn-primary">
          <Icon name="plus" size={17} color="#fff" /> Nouveau produit
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 24 }}>
        {kpis.map(([l, v, d, c]) => (
          <div key={l} style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', padding: '20px 22px' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{l}</div>
            <div className="display" style={{ fontSize: 38, margin: '6px 0 2px' }}>{v}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: c }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* en cours */}
        <div style={{ flex: 1.5, background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 24 }}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 600, margin: '0 0 20px' }}>Activité en cours</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              ['Commandes à traiter', stats?.orders.pending ?? 0, 'var(--coral)', '/admin/commandes'],
              ['Livraisons en route', stats?.deliveries.inProgress ?? 0, 'var(--gold)', '/admin/livraisons'],
              ['Messages non lus', stats?.messages.unread ?? 0, 'var(--night)', '/admin/messages'],
            ].map(([l, v, c, to]) => (
              <div key={l as string} onClick={() => navigate(to as string)}
                style={{ background: 'var(--ivory)', borderRadius: 'var(--r-md)', padding: '18px 20px', cursor: 'pointer' }}>
                <div className="display" style={{ fontSize: 34, color: c as string }}>{v as number}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{l as string}</div>
              </div>
            ))}
          </div>
        </div>

        {/* répartition */}
        <div style={{ flex: 1, background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 24 }}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 600, margin: '0 0 18px' }}>Synthèse</h3>
          {[
            ['Total commandes', stats?.orders.total ?? 0],
            ['Clients inscrits', stats?.clients.total ?? 0],
            ['Devis confirmés', stats?.planning.confirmed ?? 0],
          ].map(([n, v]) => (
            <div key={n as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--line-2)' }}>
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>{n as string}</span>
              <span className="display" style={{ fontSize: 24 }}>{v as number}</span>
            </div>
          ))}
        </div>
      </div>

      {/* commandes récentes */}
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', marginTop: 20, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--line-2)' }}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Commandes récentes</h3>
          <span onClick={() => navigate('/admin/commandes')} style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--coral)', cursor: 'pointer' }}>Tout voir</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr 120px 130px', padding: '12px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Réf.</span><span>Client</span><span>Articles</span><span>Total</span><span>Statut</span>
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>Aucune commande pour le moment.</div>
        ) : recentOrders.map((o, i) => (
          <div key={o._id} onClick={() => navigate(`/admin/commandes/${o._id}`)} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr 120px 130px', alignItems: 'center', padding: '14px 24px', borderBottom: i < recentOrders.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14, cursor: 'pointer' }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{o.orderNumber}</span>
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
