import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'
import type { DecorationPlanning, PlanningStatus } from '@/types'
import { AccountSidebar } from './AccountPage'

const EVENT_TYPES = ['Mariage', 'Anniversaire', 'Saint-Valentin', 'Baptême', 'Cérémonie', 'Autre']

const STATUS_LABEL: Record<PlanningStatus, string> = {
  EN_ATTENTE: 'En attente', DEVIS_ENVOYE: 'Devis reçu', DEVIS_ACCEPTE: 'Accepté', DEVIS_REFUSE: 'Refusé',
  CONFIRME: 'Confirmé', EN_COURS: 'En cours', TERMINE: 'Terminé', ANNULE: 'Annulé',
}
const STATUS_COLOR: Record<PlanningStatus, string> = {
  EN_ATTENTE: 'var(--muted)', DEVIS_ENVOYE: 'var(--gold)', DEVIS_ACCEPTE: '#3b82f6', DEVIS_REFUSE: '#ef4444',
  CONFIRME: '#8b5cf6', EN_COURS: 'var(--coral)', TERMINE: '#3ec47a', ANNULE: '#ef4444',
}

const fmt = (n?: number) => (n ?? 0).toLocaleString('fr-FR') + ' F'
const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

export default function PlanningPage() {
  const qc = useQueryClient()
  const toast = useToastStore()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ eventType: 'Mariage', eventDate: '', locationType: 'Domicile', ville: 'Cotonou', address: '', guestCount: '', budgetMin: '', budgetMax: '', description: '' })
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const { data, isLoading } = useQuery<{ data: DecorationPlanning[] }>({
    queryKey: ['my-plannings'],
    queryFn: () => api.get('/planning').then((r) => r.data),
  })
  const events = data?.data ?? []

  const submit = useMutation({
    mutationFn: () => api.post('/planning', {
      eventType: form.eventType, eventDate: form.eventDate,
      eventLocation: { type: form.locationType, address: form.address, ville: form.ville },
      guestCount: form.guestCount ? Number(form.guestCount) : undefined,
      budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
      budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
      description: form.description,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-plannings'] })
      toast.success('Demande envoyée', 'Notre équipe revient vers vous sous 48h.')
      setShowForm(false)
      setForm({ eventType: 'Mariage', eventDate: '', locationType: 'Domicile', ville: 'Cotonou', address: '', guestCount: '', budgetMin: '', budgetMax: '', description: '' })
    },
    onError: () => toast.error('Erreur', 'Envoi impossible.'),
  })

  const lbl = { fontSize: 12.5, fontWeight: 600 as const, color: 'var(--muted)', marginBottom: 6, display: 'block' }

  return (
    <div className="lun-acc">
      <AccountSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <h1 className="display" style={{ fontSize: 40, margin: '0 0 6px' }}>Mes événements</h1>
            <div style={{ fontSize: 14, color: 'var(--muted)' }}>Vos demandes de décoration sur mesure et leur suivi.</div>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              <Icon name="plus" size={16} color="#fff" /> Nouvel événement
            </button>
          )}
        </div>

        {showForm && (
          <div className="card" style={{ padding: 28, marginBottom: 28, boxShadow: 'var(--sh-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 600 }}>Planifions votre événement</h3>
              <button onClick={() => setShowForm(false)} className="lun-icon-btn" aria-label="Fermer"><Icon name="close" size={18} color="var(--muted)" /></button>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Type d'événement</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
              {EVENT_TYPES.map((c) => (
                <span key={c} className={`chip ${form.eventType === c ? 'chip-active' : ''}`} onClick={() => set('eventType', c)}>{c}</span>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div><label style={lbl}>Date de l'événement</label><input type="date" className="field" style={{ colorScheme: 'light' }} value={form.eventDate} onChange={(e) => set('eventDate', e.target.value)} min={new Date().toISOString().split('T')[0]} /></div>
              <div><label style={lbl}>Nombre d'invités</label><input type="number" className="field" value={form.guestCount} onChange={(e) => set('guestCount', e.target.value)} placeholder="80" /></div>
              <div><label style={lbl}>Lieu / quartier</label><input className="field" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Cocotomey, Calavi" /></div>
              <div><label style={lbl}>Ville</label><input className="field" value={form.ville} onChange={(e) => set('ville', e.target.value)} /></div>
              <div><label style={lbl}>Budget min (F)</label><input type="number" className="field" value={form.budgetMin} onChange={(e) => set('budgetMin', e.target.value)} placeholder="150 000" /></div>
              <div><label style={lbl}>Budget max (F)</label><input type="number" className="field" value={form.budgetMax} onChange={(e) => set('budgetMax', e.target.value)} placeholder="250 000" /></div>
            </div>
            <div style={{ margin: '20px 0 6px', ...lbl }}>Décrivez votre rêve</div>
            <textarea className="field" rows={4} style={{ resize: 'vertical' }} value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Une ambiance romantique en rouge et or, avec une arche florale pour la demande en mariage…" />
            <button onClick={() => submit.mutate()} disabled={!form.eventDate || submit.isPending} className="btn btn-primary btn-lg" style={{ marginTop: 22 }}>
              {submit.isPending ? 'Envoi…' : <>Envoyer ma demande <Icon name="send" size={17} color="#fff" /></>}
            </button>
          </div>
        )}

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><div style={{ width: 32, height: 32, border: '2px solid var(--line)', borderTopColor: 'var(--coral)', borderRadius: '50%', margin: '0 auto', animation: 'lun-spin .7s linear infinite' }} /></div>
        ) : events.length === 0 ? (
          !showForm && (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <Icon name="cal" size={40} color="var(--line)" />
              <p style={{ color: 'var(--muted)', margin: '14px 0 16px' }}>Aucun événement pour le moment.</p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary">Planifier un événement</button>
            </div>
          )
        ) : (
          <div className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh-sm)' }}>
            {events.map((e) => (
              <button key={e._id} type="button" className="lun-row" onClick={() => navigate(`/compte/planification/${e._id}`)}
                aria-label={`Événement ${e.eventType}, ${e.planningNumber}, ${STATUS_LABEL[e.status]}`}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--r-sm)', flexShrink: 0, background: 'var(--coral-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="cal" size={22} color="var(--coral-deep)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{e.planningNumber}</div>
                  <div className="serif" style={{ fontSize: 19, fontWeight: 600 }}>{e.eventType}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                    {fmtDate(e.eventDate)}{e.eventLocation?.ville ? ` · ${e.eventLocation.ville}` : ''}{e.guestCount ? ` · ${e.guestCount} invités` : ''}
                  </div>
                </div>
                <span className="tag" style={{ background: 'var(--ivory-2)', color: STATUS_COLOR[e.status] ?? 'var(--muted)', fontWeight: 700 }}>● {STATUS_LABEL[e.status]}</span>
                {e.quote && <div className="display" style={{ fontSize: 20, width: 110, textAlign: 'right' }}>{fmt(e.quote.amount)}</div>}
                <Icon name="chevr" size={18} color="var(--muted)" />
              </button>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes lun-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
