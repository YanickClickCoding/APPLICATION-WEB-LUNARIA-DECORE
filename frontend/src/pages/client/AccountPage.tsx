import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/useAuthStore'
import { ordersService } from '@/services/orders.service'
import type { Order } from '@/types'

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F'

const STATUS_COLORS: Record<string, string> = {
  EN_ATTENTE: 'var(--gold)', CONFIRME: 'var(--gold)', EN_PREPARATION: 'var(--gold)',
  EN_LIVRAISON: 'var(--coral)', LIVRE: '#3ec47a', ANNULE: 'var(--muted)',
}
const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente', CONFIRME: 'Confirmé', EN_PREPARATION: 'En préparation',
  PRET: 'Prêt', EN_LIVRAISON: 'En route', LIVRE: 'Livré', ANNULE: 'Annulé',
}

const MENU: [string, string, string][] = [
  ['box', 'Mes commandes', '/compte/commandes'],
  ['cal', 'Mes événements', '/compte/planification'],
  ['heart', 'Favoris', '/compte/favoris'],
  ['chat', 'Messages', '/compte/messages'],
  ['user', 'Profil', '/compte/parametres'],
]

export function AccountSidebar() {
  const { user } = useAuthStore()
  const { pathname } = useLocation()
  return (
    <div style={{ width: 250, flexShrink: 0 }} className="lun-acc-side">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
        <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--coral-soft)', color: 'var(--coral-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 600 }}>
          {user?.firstName?.[0]?.toUpperCase() ?? 'C'}
        </div>
        <div>
          <div className="serif" style={{ fontSize: 20, fontWeight: 600 }}>{user?.firstName} {user?.lastName?.[0]}.</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{user?.phone}</div>
        </div>
      </div>
      {MENU.map(([ic, t, to]) => {
        const on = pathname === to
        return (
          <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--r-sm)', textDecoration: 'none',
            background: on ? 'var(--paper)' : 'transparent', border: on ? '1px solid var(--line-2)' : '1px solid transparent',
            fontSize: 14.5, fontWeight: on ? 700 : 500, color: on ? 'var(--ink)' : 'var(--muted)', marginBottom: 4, boxShadow: on ? 'var(--sh-sm)' : 'none' }}>
            <Icon name={ic} size={18} color={on ? 'var(--coral)' : 'var(--muted)'} /> {t}
          </Link>
        )
      })}
    </div>
  )
}

export default function AccountPage() {
  const navigate = useNavigate()
  const { data } = useQuery({ queryKey: ['my-orders-summary'], queryFn: () => ordersService.getMyOrders({ page: 1 }).then((r) => r.data) })
  const orders: Order[] = data?.data ?? []
  const inProgress = orders.filter((o) => !['LIVRE', 'ANNULE'].includes(o.status)).length

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 56px 64px', display: 'flex', gap: 36 }} className="lun-acc">
      <AccountSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 className="display" style={{ fontSize: 40, margin: '0 0 6px' }}>Mes commandes</h1>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>Suivez vos commandes et événements en cours.</div>

        <div className="lun-acc-stats" style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {[[String(orders.length), 'commandes'], [String(inProgress), 'en cours'], [String(orders.length), 'événements'], ['4.9', 'note moy.']].map(([n, l]) => (
            <div key={l} style={{ flex: 1, minWidth: 120, background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', padding: '18px 20px' }}>
              <div className="display" style={{ fontSize: 32 }}>{n}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{l}</div>
            </div>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Aucune commande pour le moment.</p>
            <button onClick={() => navigate('/catalogue')} className="btn btn-primary">Découvrir la boutique</button>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh-sm)' }}>
            {orders.map((o, i) => (
              <div key={o._id} onClick={() => navigate(`/compte/commandes/${o._id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px', borderBottom: i < orders.length - 1 ? '1px solid var(--line-2)' : 'none', cursor: 'pointer' }}>
                <div style={{ width: 60, height: 60, borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--ivory-2)' }}>
                  {o.items?.[0]?.image && <img src={o.items[0].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{o.orderNumber}</div>
                  <div className="serif" style={{ fontSize: 19, fontWeight: 600 }}>{o.items?.[0]?.name}{o.items?.length > 1 ? ` +${o.items.length - 1}` : ''}</div>
                </div>
                <span className="tag" style={{ background: 'var(--ivory-2)', color: STATUS_COLORS[o.status] ?? 'var(--muted)', fontWeight: 700 }}>● {STATUS_LABELS[o.status] ?? o.status}</span>
                <div className="display" style={{ fontSize: 22, width: 110, textAlign: 'right' }}>{fmt(o.total)}</div>
                <Icon name="chevr" size={18} color="var(--muted)" />
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@media (max-width: 860px) { .lun-acc { flex-direction: column !important; padding: 28px 20px !important; } .lun-acc-side { width: 100% !important; } }`}</style>
    </div>
  )
}
