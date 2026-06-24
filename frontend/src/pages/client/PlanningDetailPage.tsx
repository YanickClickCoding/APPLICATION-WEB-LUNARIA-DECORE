import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'
import type { DecorationPlanning, PlanningStatus } from '@/types'
import { AccountSidebar } from './AccountPage'

const STATUS_FLOW: { key: string; label: string; desc: string }[] = [
  { key: 'EN_ATTENTE', label: 'Demande envoyée', desc: 'Détails de votre événement reçus' },
  { key: 'DEVIS_ENVOYE', label: 'Devis proposé', desc: 'À valider de votre côté' },
  { key: 'DEVIS_ACCEPTE', label: 'Devis accepté', desc: 'Réservation de la date' },
  { key: 'CONFIRME', label: 'Confirmé', desc: 'Acompte & planning' },
  { key: 'EN_COURS', label: 'En cours', desc: 'Préparation' },
  { key: 'TERMINE', label: 'Installation', desc: 'Le jour J' },
]
const STATUS_LABEL: Record<PlanningStatus, string> = {
  EN_ATTENTE: 'En attente', DEVIS_ENVOYE: 'Devis reçu', DEVIS_ACCEPTE: 'Accepté', DEVIS_REFUSE: 'Refusé',
  CONFIRME: 'Confirmé', EN_COURS: 'En cours', TERMINE: 'Terminé', ANNULE: 'Annulé',
}

const fmt = (n?: number) => (n ?? 0).toLocaleString('fr-FR') + ' F'
const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

export default function PlanningDetailPage() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const toast = useToastStore()
  const navigate = useNavigate()

  const { data: planning, isLoading } = useQuery<DecorationPlanning>({
    queryKey: ['planning', id],
    queryFn: () => api.get(`/planning/${id}`).then((r) => r.data),
    enabled: !!id,
  })

  const respond = useMutation({
    mutationFn: (accept: boolean) => api.patch(`/planning/${id}/${accept ? 'accept' : 'reject'}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['planning', id] })
      qc.invalidateQueries({ queryKey: ['my-plannings'] })
    },
    onError: () => toast.error('Erreur', 'Action impossible pour le moment.'),
  })

  const currentIdx = planning ? STATUS_FLOW.findIndex((s) => s.key === planning.status) : -1

  return (
    <div className="lun-acc">
      <AccountSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link to="/compte/planification" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: 'var(--muted)', textDecoration: 'none', marginBottom: 16 }}>
          <Icon name="chevr" size={16} color="var(--muted)" /> Retour aux événements
        </Link>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><div style={{ width: 32, height: 32, border: '2px solid var(--line)', borderTopColor: 'var(--coral)', borderRadius: '50%', margin: '0 auto', animation: 'lun-spin .7s linear infinite' }} /></div>
        ) : !planning ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Événement introuvable.</p>
            <button onClick={() => navigate('/compte/planification')} className="btn btn-primary">Mes événements</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{planning.planningNumber}</div>
                <h1 className="display" style={{ fontSize: 40, margin: '4px 0 0' }}>{planning.eventType}</h1>
              </div>
              <span className="tag" style={{ background: 'var(--gold-soft)', color: '#8a5a10', fontWeight: 700 }}>{STATUS_LABEL[planning.status]}</span>
            </div>

            <div className="card" style={{ padding: 22, margin: '24px 0', boxShadow: 'var(--sh-sm)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 18 }}>
                {[
                  ['Date', fmtDate(planning.eventDate)],
                  ['Lieu', [planning.eventLocation?.ville, planning.eventLocation?.address].filter(Boolean).join(' · ') || '—'],
                  ['Invités', planning.guestCount ? String(planning.guestCount) : '—'],
                  ['Budget', planning.budgetMin || planning.budgetMax ? `${fmt(planning.budgetMin)} – ${fmt(planning.budgetMax)}` : '—'],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
              {planning.description && (
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--line-2)' }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 6 }}>Votre demande</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)' }}>{planning.description}</p>
                </div>
              )}
            </div>

            {planning.status === 'DEVIS_ENVOYE' && planning.quote && (
              <div style={{ background: 'var(--coral-soft)', borderRadius: 'var(--r-md)', padding: 20, marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: 'var(--coral-deep)', fontWeight: 700 }}>Devis proposé</div>
                <div className="display" style={{ fontSize: 30, margin: '6px 0' }}>{fmt(planning.quote.amount)}</div>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>{planning.quote.description}</p>
                <div style={{ display: 'flex', gap: 10, maxWidth: 320 }}>
                  <button onClick={() => respond.mutate(true)} disabled={respond.isPending} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Accepter</button>
                  <button onClick={() => respond.mutate(false)} disabled={respond.isPending} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Refuser</button>
                </div>
              </div>
            )}

            <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 18 }}>Suivi</h3>
            <div className="card" style={{ padding: 28, boxShadow: 'var(--sh-sm)' }}>
              {STATUS_FLOW.map((s, i) => {
                const done = i < currentIdx, active = i === currentIdx
                return (
                  <div key={s.key} style={{ display: 'flex', gap: 16, paddingBottom: i < STATUS_FLOW.length - 1 ? 22 : 0, position: 'relative' }}>
                    {i < STATUS_FLOW.length - 1 && <div style={{ position: 'absolute', left: 13, top: 26, bottom: 4, width: 2, background: done ? 'var(--coral)' : 'var(--line)' }} />}
                    <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, zIndex: 1, background: done ? 'var(--coral)' : active ? 'var(--gold)' : 'var(--ivory-2)', border: done || active ? 'none' : '2px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {done ? <Icon name="check" size={15} color="#fff" /> : active ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} /> : null}
                    </div>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: active ? 700 : 600, color: done || active ? 'var(--ink)' : 'var(--muted-2)' }}>{s.label}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{s.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes lun-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
