import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'

const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  ASSIGNE: 'Assigné',
  RECUPERE: 'Récupéré',
  EN_ROUTE: 'En route',
  LIVRE: 'Livré',
  ECHEC: 'Échoué',
}
const STATUS_COLOR: Record<string, string> = {
  EN_ATTENTE: 'var(--gold)',
  ASSIGNE: '#3b82f6',
  RECUPERE: '#8b5cf6',
  EN_ROUTE: 'var(--coral)',
  LIVRE: '#3ec47a',
  ECHEC: 'var(--coral-deep)',
}

interface Delivery {
  _id: string
  order: { orderNumber: string; total: number }
  livreur?: { firstName: string; lastName: string }
  status: string
  estimatedDate: string
  address: { quartier?: string; ville?: string }
}

const COLS = '1.2fr 1.8fr 1.4fr 1.2fr 130px 120px'

export default function AdminDelivery() {
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery<{ data: Delivery[] }>({
    queryKey: ['admin-deliveries', statusFilter],
    queryFn: () => api.get('/delivery', { params: { limit: 30, status: statusFilter || undefined } }).then((r) => r.data),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/delivery/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-deliveries'] }),
  })

  const deliveries = data?.data ?? []
  const filters: [string, string][] = [['', 'Toutes'], ...Object.entries(STATUS_LABELS)]

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <div className="eyebrow">Gestion</div>
          <h1 className="display" style={{ fontSize: 36, margin: '6px 0 0' }}>Livraisons</h1>
        </div>
        <span className="tag" style={{ background: 'var(--ivory-2)', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="truck" size={15} color="var(--coral)" /> {deliveries.length} livraison{deliveries.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Filtres statut */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {filters.map(([v, l]) => (
          <button key={v} type="button" onClick={() => setStatusFilter(v)} aria-pressed={statusFilter === v}
            className={`chip ${statusFilter === v ? 'chip-active' : ''}`}
            style={{ fontSize: 12.5, padding: '7px 14px', cursor: 'pointer', font: 'inherit' }}>
            {l}
          </button>
        ))}
      </div>

      <div className="lun-table" style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: COLS, padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Commande</span><span>Adresse</span><span>Livreur</span><span>Date prévue</span><span>Statut</span><span>Action</span>
        </div>

        {isLoading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>Chargement…</div>
        ) : deliveries.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>Aucune livraison {statusFilter ? 'pour ce filtre' : ''}.</div>
        ) : deliveries.map((d, i) => (
          <div key={d._id} style={{ display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', padding: '14px 24px', borderBottom: i < deliveries.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 13.5 }}>
            <span className="mono" style={{ fontSize: 12.5, color: 'var(--coral-deep)', fontWeight: 600 }}>{d.order?.orderNumber ?? '—'}</span>
            <span style={{ color: 'var(--muted)' }}>{[d.address?.quartier, d.address?.ville].filter(Boolean).join(', ') || '—'}</span>
            <span>
              {d.livreur ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="user" size={13} color="#3ec47a" /> {d.livreur.firstName}
                </span>
              ) : <span style={{ color: 'var(--muted-2)', fontStyle: 'italic' }}>Non assigné</span>}
            </span>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>{d.estimatedDate ? new Date(d.estimatedDate).toLocaleDateString('fr-FR') : '—'}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: STATUS_COLOR[d.status] ?? 'var(--muted)', fontWeight: 700, justifySelf: 'start' }}>
              ● {STATUS_LABELS[d.status] ?? d.status}
            </span>
            <span>
              {d.status === 'EN_ATTENTE' && (
                <button onClick={() => updateStatus.mutate({ id: d._id, status: 'ASSIGNE' })} disabled={updateStatus.isPending}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: '#3b82f6' }}>Assigner</button>
              )}
              {d.status === 'ASSIGNE' && (
                <button onClick={() => updateStatus.mutate({ id: d._id, status: 'EN_ROUTE' })} disabled={updateStatus.isPending}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: 'var(--coral)' }}>→ En route</button>
              )}
              {d.status === 'EN_ROUTE' && (
                <button onClick={() => updateStatus.mutate({ id: d._id, status: 'LIVRE' })} disabled={updateStatus.isPending}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: '#3ec47a' }}>✓ Livré</button>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
