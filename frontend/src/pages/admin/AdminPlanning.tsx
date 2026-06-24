import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'
import type { DecorationPlanning, PlanningStatus } from '@/types'
import { clickable } from '@/hooks/useClickable'

const fmt = (n?: number) => (n != null ? n.toLocaleString('fr-FR') + ' F' : '—')
const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—')

const STATUS_LABEL: Record<string, string> = {
  EN_ATTENTE: 'À chiffrer', DEVIS_ENVOYE: 'Devis envoyé', DEVIS_ACCEPTE: 'Accepté', DEVIS_REFUSE: 'Refusé',
  CONFIRME: 'Confirmé', EN_COURS: 'En cours', TERMINE: 'Terminé', ANNULE: 'Annulé',
}
const STATUS_COLOR: Record<string, string> = {
  EN_ATTENTE: 'var(--coral)', DEVIS_ENVOYE: 'var(--gold)', DEVIS_ACCEPTE: '#3ec47a', DEVIS_REFUSE: 'var(--muted)',
  CONFIRME: '#3ec47a', EN_COURS: 'var(--night)', TERMINE: '#3ec47a', ANNULE: 'var(--muted)',
}
const FILTERS: [string, string][] = [['', 'Toutes'], ['EN_ATTENTE', 'À chiffrer'], ['DEVIS_ENVOYE', 'En attente client'], ['DEVIS_ACCEPTE', 'Acceptées']]
// Statuts que l'admin peut appliquer après acceptation du devis.
const ADVANCE: Record<string, { next: string; label: string }> = {
  DEVIS_ACCEPTE: { next: 'CONFIRME', label: 'Confirmer le projet' },
  CONFIRME: { next: 'EN_COURS', label: 'Démarrer la préparation' },
  EN_COURS: { next: 'TERMINE', label: 'Marquer comme terminé' },
}

// ─── Modale devis ────────────────────────────────────────────────────────
function QuoteModal({ planning, onClose }: { planning: DecorationPlanning; onClose: () => void }) {
  const qc = useQueryClient()
  const toast = useToastStore()
  const [amount, setAmount] = useState(planning.quote?.amount?.toString() ?? '')
  const [description, setDescription] = useState(planning.quote?.description ?? '')
  const [validDays, setValidDays] = useState('5')

  const send = useMutation({
    mutationFn: () => api.post(`/planning/${planning._id}/quote`, { amount: Number(amount), description, validDays: Number(validDays) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-plannings'] })
      qc.invalidateQueries({ queryKey: ['admin-planning', planning._id] })
      toast.success('Devis envoyé', 'Le client a été notifié.')
      onClose()
    },
    onError: () => toast.error('Erreur', 'Envoi du devis impossible'),
  })

  const lbl = { fontSize: 12.5, fontWeight: 600 as const, color: 'var(--muted)', marginBottom: 6, display: 'block' }

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label="Détail de la planification"
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(43,20,36,.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 480, boxShadow: 'var(--sh-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--line-2)' }}>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 600 }}>Envoyer un devis</h2>
          <button onClick={onClose} aria-label="Fermer" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--muted)' }}><Icon name="close" size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send.mutate() }} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--ivory)', borderRadius: 'var(--r-sm)', padding: '12px 14px', fontSize: 13.5 }}>
            <strong>{planning.eventType}</strong> · {fmtDate(planning.eventDate)} · {planning.client?.firstName} {planning.client?.lastName}
            {(planning.budgetMin || planning.budgetMax) ? <div style={{ color: 'var(--muted)', marginTop: 4 }}>Budget annoncé : {fmt(planning.budgetMin)} – {fmt(planning.budgetMax)}</div> : null}
          </div>
          <div><label style={lbl}>Montant du devis (FCFA) *</label><input required type="number" className="field" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="150000" /></div>
          <div><label style={lbl}>Détail de la prestation *</label><textarea required rows={4} className="field" style={{ resize: 'none' }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décoration complète de la salle : arche florale, 80 bougies, drapés, mise en lumière…" /></div>
          <div><label style={lbl}>Validité (jours)</label><input type="number" className="field" value={validDays} onChange={(e) => setValidDays(e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Annuler</button>
            <button type="submit" disabled={send.isPending} className="btn btn-primary" style={{ flex: 1, opacity: send.isPending ? .6 : 1 }}>{send.isPending ? 'Envoi…' : 'Envoyer le devis'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Vue détail ──────────────────────────────────────────────────────────
function PlanningDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const qc = useQueryClient()
  const toast = useToastStore()
  const [quoteOpen, setQuoteOpen] = useState(false)

  const { data: p, isLoading } = useQuery<DecorationPlanning>({
    queryKey: ['admin-planning', id],
    queryFn: () => api.get<DecorationPlanning>(`/planning/${id}`).then((r) => r.data),
  })
  const advance = useMutation({
    mutationFn: (status: string) => api.patch(`/planning/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-planning', id] }); qc.invalidateQueries({ queryKey: ['admin-plannings'] }); toast.success('Statut mis à jour') },
    onError: () => toast.error('Erreur', 'Mise à jour impossible'),
  })

  if (isLoading || !p) return <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>Chargement…</div>

  const adv = ADVANCE[p.status]

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
        <span onClick={onBack} style={{ cursor: 'pointer' }}>Devis & planifications</span>
        <Icon name="chevr" size={14} color="var(--muted)" />
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{p.planningNumber}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <h1 className="display" style={{ fontSize: 36, margin: 0 }}>{p.eventType}</h1>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: STATUS_COLOR[p.status], fontWeight: 700 }}>● {STATUS_LABEL[p.status]}</span>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 4 }}>{p.planningNumber} · {p.client?.firstName} {p.client?.lastName}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['EN_ATTENTE', 'DEVIS_ENVOYE', 'DEVIS_REFUSE'].includes(p.status) && (
            <button onClick={() => setQuoteOpen(true)} className="btn btn-primary btn-sm">
              <Icon name="edit" size={15} color="#fff" /> {p.status === 'EN_ATTENTE' ? 'Envoyer un devis' : 'Modifier le devis'}
            </button>
          )}
          {adv && <button onClick={() => advance.mutate(adv.next)} disabled={advance.isPending} className="btn btn-dark btn-sm">{adv.label}</button>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 360px' }}>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 22, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)', marginBottom: 16 }}>Détails de l'événement</div>
            {[
              ['Date', fmtDate(p.eventDate)],
              ['Lieu', p.eventLocation ? `${p.eventLocation.type} · ${p.eventLocation.address ?? ''} ${p.eventLocation.ville ?? ''}` : '—'],
              ['Invités', p.guestCount ? String(p.guestCount) : '—'],
              ['Budget annoncé', (p.budgetMin || p.budgetMax) ? `${fmt(p.budgetMin)} – ${fmt(p.budgetMax)}` : '—'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-2)', fontSize: 14 }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span><span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
              </div>
            ))}
            {p.description && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>Description du client</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{p.description}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: '1 1 320px' }}>
          {p.quote ? (
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 22, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)' }}>Devis</div>
                <span className="tag" style={{ background: 'var(--ivory-2)', color: STATUS_COLOR[p.status], fontWeight: 700 }}>{STATUS_LABEL[p.status]}</span>
              </div>
              <div className="display" style={{ fontSize: 34, color: 'var(--coral)', marginBottom: 10 }}>{fmt(p.quote.amount)}</div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink)', marginBottom: 12 }}>{p.quote.description}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Envoyé le {fmtDate(p.quote.sentAt)} · valable jusqu'au {fmtDate(p.quote.validUntil)}</div>
            </div>
          ) : (
            <div style={{ background: 'var(--paper)', border: '1px dashed var(--line)', borderRadius: 'var(--r-lg)', padding: 28, textAlign: 'center', color: 'var(--muted)' }}>
              <Icon name="edit" size={28} color="var(--line)" style={{ margin: '0 auto 10px' }} />
              <div style={{ marginBottom: 14, fontSize: 14 }}>Aucun devis envoyé</div>
              <button onClick={() => setQuoteOpen(true)} className="btn btn-primary btn-sm">Chiffrer ce projet</button>
            </div>
          )}

          <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)', marginBottom: 14 }}>Client</div>
            <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 8 }}>{p.client?.firstName} {p.client?.lastName}</div>
            {p.client?.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--muted)' }}><Icon name="phone" size={16} color="var(--coral)" /> {p.client.phone}</div>}
          </div>
        </div>
      </div>

      {quoteOpen && <QuoteModal planning={p} onClose={() => setQuoteOpen(false)} />}
    </div>
  )
}

// ─── Vue liste ───────────────────────────────────────────────────────────
export default function AdminPlanning() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-plannings', statusFilter],
    queryFn: () => api.get('/planning/admin/all', { params: { page: 1, limit: 50, status: statusFilter || undefined } }).then((r) => r.data),
  })

  if (selectedId) return <PlanningDetail id={selectedId} onBack={() => setSelectedId(null)} />

  const rows: DecorationPlanning[] = data?.data ?? []

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Devis & planifications</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{data?.total ?? 0} demande{(data?.total ?? 0) > 1 ? 's' : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FILTERS.map(([v, l]) => (
            <span key={v} onClick={() => setStatusFilter(v)} className={`chip ${statusFilter === v ? 'chip-active' : ''}`} style={{ fontSize: 12.5, padding: '7px 14px' }}>{l}</span>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1.2fr 1fr 110px 130px 140px 40px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Réf.</span><span>Client</span><span>Événement</span><span>Date</span><span>Budget</span><span>Statut</span><span></span>
        </div>
        {isLoading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>Chargement…</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>Aucune demande {statusFilter ? 'pour ce filtre' : ''}.</div>
        ) : rows.map((p, i) => (
          <div key={p._id} {...clickable(() => setSelectedId(p._id), `Planning ${p.planningNumber}`)} style={{ display: 'grid', gridTemplateColumns: '140px 1.2fr 1fr 110px 130px 140px 40px', alignItems: 'center', padding: '15px 24px', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14, cursor: 'pointer' }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{p.planningNumber}</span>
            <span style={{ fontWeight: 600 }}>{p.client?.firstName} {p.client?.lastName?.[0]}.</span>
            <span style={{ color: 'var(--muted)' }}>{p.eventType}</span>
            <span style={{ fontSize: 13 }}>{fmtDate(p.eventDate)}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{(p.budgetMin || p.budgetMax) ? `${fmt(p.budgetMin)}–${fmt(p.budgetMax)}` : '—'}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: STATUS_COLOR[p.status] ?? 'var(--muted)', fontWeight: 700, justifySelf: 'start' }}>● {STATUS_LABEL[p.status] ?? p.status}</span>
            <Icon name="chevr" size={16} color="var(--muted)" />
          </div>
        ))}
      </div>
    </div>
  )
}
