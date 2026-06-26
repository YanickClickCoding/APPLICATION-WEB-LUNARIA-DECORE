import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'
import type { Payment, User } from '@/types'

const fmt = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + ' M F'
  return (n ?? 0).toLocaleString('fr-FR') + ' F'
}

const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente', EN_COURS: 'En cours', CONFIRME: 'Réussi', ECHOUE: 'Échoué', REMBOURSE: 'Remboursé',
}
const STATUS_COLORS: Record<string, string> = {
  EN_ATTENTE: 'var(--gold)', EN_COURS: 'var(--gold)', CONFIRME: '#3ec47a', ECHOUE: 'var(--coral)', REMBOURSE: 'var(--muted)',
}
const TYPE_LABELS: Record<string, string> = { COMMANDE: 'Total', ACOMPTE: 'Acompte', SOLDE: 'Solde' }
const FILTERS: [string, string][] = [['', 'Tous'], ['CONFIRME', 'Réussis'], ['EN_COURS', 'En attente'], ['ECHOUE', 'Échoués']]

interface AdminPayment extends Payment {
  client?: Pick<User, 'firstName' | 'lastName' | 'phone'>
  order?: { orderNumber: string }
  createdAt: string
}
interface PayStats { collected: number; mtnShare: number; moovShare: number; pending: number }

function fmtDate(d?: string) {
  return d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—'
}

export default function AdminPayments() {
  const qc = useQueryClient()
  const toast = useToastStore()
  const [statusFilter, setStatusFilter] = useState('')

  const { data: stats } = useQuery<PayStats>({
    queryKey: ['admin-pay-stats'],
    queryFn: () => api.get<PayStats>('/payments/admin/stats').then((r) => r.data),
  })
  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', statusFilter],
    queryFn: () => api.get('/payments/admin/all', { params: { page: 1, limit: 50, status: statusFilter || undefined } }).then((r) => r.data),
  })

  const confirm = useMutation({
    mutationFn: (id: string) => api.patch(`/payments/${id}/confirm`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-payments'] }); qc.invalidateQueries({ queryKey: ['admin-pay-stats'] }); toast.success('Paiement confirmé') },
    onError: () => toast.error('Erreur', 'Confirmation impossible'),
  })
  const refund = useMutation({
    mutationFn: (id: string) => api.patch(`/payments/${id}/refund`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-payments'] }); qc.invalidateQueries({ queryKey: ['admin-pay-stats'] }); toast.success('Paiement remboursé') },
    onError: () => toast.error('Erreur', 'Remboursement impossible'),
  })

  const rows: AdminPayment[] = data?.data ?? []

  const kpis: [string, string, string][] = [
    ['Encaissé', fmt(stats?.collected ?? 0), 'var(--coral)'],
    ['MTN MoMo', `${stats?.mtnShare ?? 0}%`, '#ffcc00'],
    ['Moov Money', `${stats?.moovShare ?? 0}%`, '#0a4ea3'],
    ['En attente', `${stats?.pending ?? 0} paiement${(stats?.pending ?? 0) > 1 ? 's' : ''}`, 'var(--gold)'],
  ]

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: '0 0 6px' }}>Paiements</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>Mobile Money · MTN MoMo & Moov Money</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FILTERS.map(([v, l]) => (
            <button key={v} type="button" onClick={() => setStatusFilter(v)} aria-pressed={statusFilter === v} className={`chip ${statusFilter === v ? 'chip-active' : ''}`} style={{ fontSize: 12.5, padding: '7px 14px', cursor: 'pointer', font: 'inherit' }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 22 }}>
        {kpis.map(([l, v, c]) => (
          <div key={l} style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', padding: '18px 22px' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{l}</div>
            <div className="display" style={{ fontSize: 30, marginTop: 4, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="lun-table" style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '90px 120px 1fr 130px 90px 120px 120px 110px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Date</span><span>Commande</span><span>Client</span><span>Moyen</span><span>Type</span><span>Montant</span><span>Statut</span><span>Action</span>
        </div>
        {isLoading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>Chargement…</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>Aucun paiement {statusFilter ? 'pour ce filtre' : ''}.</div>
        ) : rows.map((p, i) => (
          <div key={p._id} style={{ display: 'grid', gridTemplateColumns: '90px 120px 1fr 130px 90px 120px 120px 110px', alignItems: 'center', padding: '14px 24px', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 13.5 }}>
            <span style={{ color: 'var(--muted)' }}>{fmtDate(p.createdAt)}</span>
            <span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{p.order?.orderNumber ?? '—'}</span>
            <span style={{ fontWeight: 600 }}>{p.client ? `${p.client.firstName} ${p.client.lastName?.[0] ?? ''}.` : '—'}</span>
            <span>{p.method === 'MTN_MOMO' ? 'MTN MoMo' : 'Moov Money'}</span>
            <span style={{ color: 'var(--muted)' }}>{TYPE_LABELS[p.type] ?? p.type}</span>
            <span style={{ fontWeight: 700 }}>{fmt(p.amount)}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: STATUS_COLORS[p.status] ?? 'var(--muted)', fontWeight: 700, justifySelf: 'start' }}>● {STATUS_LABELS[p.status] ?? p.status}</span>
            <span>
              {['EN_ATTENTE', 'EN_COURS'].includes(p.status) && (
                <button onClick={() => confirm.mutate(p._id)} disabled={confirm.isPending} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: '#3ec47a' }}>Confirmer</button>
              )}
              {p.status === 'CONFIRME' && (
                <button onClick={() => { if (window.confirm('Rembourser ce paiement ?')) refund.mutate(p._id) }} disabled={refund.isPending} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>Rembourser</button>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
