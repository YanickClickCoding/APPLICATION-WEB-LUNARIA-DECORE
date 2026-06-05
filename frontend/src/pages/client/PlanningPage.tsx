import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'
import type { DecorationPlanning, PlanningStatus } from '@/types'

const EVENT_TYPES = ['Mariage', 'Anniversaire', 'Saint-Valentin', 'Baptême', 'Cérémonie', 'Autre']

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

export default function PlanningPage() {
  const qc = useQueryClient()
  const toast = useToastStore()
  const [form, setForm] = useState({ eventType: 'Mariage', eventDate: '', locationType: 'Domicile', ville: 'Cotonou', address: '', guestCount: '', budgetMin: '', budgetMax: '', description: '' })
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const { data } = useQuery<{ data: DecorationPlanning[] }>({
    queryKey: ['my-plannings'],
    queryFn: () => api.get('/planning').then((r) => r.data),
  })
  const latest = data?.data?.[0]

  const submit = useMutation({
    mutationFn: () => api.post('/planning', {
      eventType: form.eventType, eventDate: form.eventDate,
      eventLocation: { type: form.locationType, address: form.address, ville: form.ville },
      guestCount: form.guestCount ? Number(form.guestCount) : undefined,
      budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
      budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
      description: form.description,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-plannings'] }); toast.success('Demande envoyée', 'Notre équipe revient vers vous sous 48h.') },
    onError: () => toast.error('Erreur', 'Envoi impossible.'),
  })

  const respond = useMutation({
    mutationFn: (accept: boolean) => api.patch(`/planning/${latest!._id}/${accept ? 'accept' : 'reject'}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-plannings'] }),
  })

  const lbl = { fontSize: 12.5, fontWeight: 600 as const, color: 'var(--muted)', marginBottom: 6, display: 'block' }
  const currentIdx = latest ? STATUS_FLOW.findIndex((s) => s.key === latest.status) : -1

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '44px 56px 64px' }} className="lun-plan">
      <div className="eyebrow">Décoration sur mesure</div>
      <h1 className="display" style={{ fontSize: 50, margin: '12px 0 0' }}>Planifions votre événement</h1>
      <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 540, marginTop: 12, lineHeight: 1.7 }}>
        Quelques détails suffisent. Notre équipe revient avec une proposition personnalisée et un devis sous 48h.
      </p>

      <div className="lun-plan-grid" style={{ display: 'flex', gap: 44, marginTop: 36, alignItems: 'flex-start' }}>
        {/* Formulaire */}
        <div style={{ flex: 1.4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Type d'événement</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
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

        {/* Suivi */}
        <div style={{ flex: 1, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 28, boxShadow: 'var(--sh-sm)' }} className="lun-plan-track">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="serif" style={{ fontSize: 22, fontWeight: 600 }}>Suivi de la demande</h3>
            {latest && <span className="tag" style={{ background: 'var(--gold-soft)', color: '#8a5a10' }}>{STATUS_LABEL[latest.status]}</span>}
          </div>
          {!latest ? (
            <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 16 }}>Aucune demande en cours. Remplissez le formulaire pour démarrer un projet.</p>
          ) : (
            <>
              <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{latest.planningNumber} · {latest.eventType}</div>

              {latest.status === 'DEVIS_ENVOYE' && latest.quote && (
                <div style={{ background: 'var(--coral-soft)', borderRadius: 'var(--r-md)', padding: 16, margin: '16px 0' }}>
                  <div style={{ fontSize: 12, color: 'var(--coral-deep)', fontWeight: 700 }}>Devis proposé</div>
                  <div className="display" style={{ fontSize: 26, margin: '4px 0' }}>{latest.quote.amount?.toLocaleString('fr-FR')} F</div>
                  <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 12 }}>{latest.quote.description}</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => respond.mutate(true)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Accepter</button>
                    <button onClick={() => respond.mutate(false)} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Refuser</button>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 24 }}>
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
      </div>
      <style>{`@media (max-width: 900px) { .lun-plan { padding: 32px 20px !important; } .lun-plan-grid { flex-direction: column !important; } .lun-plan-track { width: 100%; } }`}</style>
    </div>
  )
}
