import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'
import type { DecorationService, Category } from '@/types'

const lbl = { fontSize: 12.5, fontWeight: 600 as const, color: 'var(--muted)', marginBottom: 6, display: 'block' }

function ServiceForm({ service, categories, onClose }: { service?: DecorationService; categories: Category[]; onClose: () => void }) {
  const qc = useQueryClient()
  const toast = useToastStore()
  const isEdit = !!service

  const [form, setForm] = useState({
    name: service?.name ?? '',
    shortDescription: service?.shortDescription ?? '',
    description: service?.description ?? '',
    basePrice: service?.basePrice ?? '',
    priceNote: service?.priceNote ?? '',
    category: typeof service?.category === 'object' ? service.category._id : (service?.category ?? ''),
    duration: service?.duration ?? '',
    includes: service?.includes?.join('\n') ?? '',
    isFeatured: service?.isFeatured ?? false,
  })
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const save = useMutation({
    mutationFn: () => {
      const body = {
        ...form,
        basePrice: Number(form.basePrice),
        includes: form.includes.split('\n').map((s) => s.trim()).filter(Boolean),
      }
      return isEdit ? api.patch(`/services/${service!._id}`, body) : api.post('/services', body)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); toast.success(isEdit ? 'Service modifié' : 'Service créé'); onClose() },
    onError: () => toast.error('Erreur', 'Enregistrement impossible'),
  })

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(26,26,46,.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--sh-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--line-2)', position: 'sticky', top: 0, background: 'var(--paper)', borderRadius: 'var(--r-md) var(--r-md) 0 0' }}>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 600 }}>{isEdit ? 'Modifier le service' : 'Nouveau service'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--muted)' }}><Icon name="close" size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate() }} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={lbl}>Nom *</label><input required className="field" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Chambre Romantique Prestige" /></div>
          <div><label style={lbl}>Accroche</label><input className="field" value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} placeholder="L'expérience romantique ultime" /></div>
          <div><label style={lbl}>Description *</label><textarea required rows={3} className="field" style={{ resize: 'none' }} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Prix de base (FCFA) *</label><input required type="number" className="field" value={form.basePrice} onChange={(e) => set('basePrice', e.target.value)} placeholder="25000" /></div>
            <div><label style={lbl}>Note prix</label><input className="field" value={form.priceNote} onChange={(e) => set('priceNote', e.target.value)} placeholder="À partir de…" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={lbl}>Catégorie *</label>
              <select required className="field" style={{ cursor: 'pointer' }} value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">Sélectionner…</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Durée</label><input className="field" value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="2h d'installation" /></div>
          </div>
          <div><label style={lbl}>Inclus (un par ligne)</label><textarea rows={4} className="field" style={{ resize: 'none' }} value={form.includes} onChange={(e) => set('includes', e.target.value)} placeholder={'20 bougies LED\nPétales de roses\nGuirlande 5m'} /></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <div onClick={() => set('isFeatured', !form.isFeatured)}
              style={{ width: 42, height: 24, borderRadius: 'var(--r-pill)', position: 'relative', transition: 'background .15s', background: form.isFeatured ? 'var(--coral)' : 'var(--line)' }}>
              <div style={{ position: 'absolute', top: 3, left: form.isFeatured ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s', boxShadow: 'var(--sh-sm)' }} />
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--ink)' }}><Icon name="star" size={14} color="var(--gold)" fill="var(--gold)" /> Service vedette</span>
          </label>
          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Annuler</button>
            <button type="submit" disabled={save.isPending} className="btn btn-primary" style={{ flex: 1, opacity: save.isPending ? .6 : 1 }}>
              {save.isPending ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminServices() {
  const qc = useQueryClient()
  const toast = useToastStore()
  const [editing, setEditing] = useState<DecorationService | null | 'new'>(null)

  const { data: services, isLoading } = useQuery<DecorationService[]>({
    queryKey: ['admin-services'],
    queryFn: () => api.get<DecorationService[]>('/services').then((r) => r.data),
  })
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories').then((r) => r.data),
  })

  const archive = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); toast.success('Service archivé') },
  })

  const rows = services ?? []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 14 }}>
        <div>
          <div className="eyebrow">Catalogue</div>
          <h1 className="display" style={{ fontSize: 36, margin: '6px 0 0' }}>Services</h1>
        </div>
        <button onClick={() => setEditing('new')} className="btn btn-primary">
          <Icon name="plus" size={17} color="#fff" /> Nouveau service
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>Chargement…</div>
      ) : rows.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          <Icon name="spark" size={40} color="var(--line)" style={{ margin: '0 auto 12px' }} />
          <div>Aucun service · <button onClick={() => setEditing('new')} style={{ color: 'var(--coral)', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}>Créer le premier</button></div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {rows.map((s) => (
            <div key={s._id} className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh-sm)' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--ivory-2)' }}>
                {s.images?.[0]
                  ? <img src={s.images[0]} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div className="ph ph-center" data-ph="Service" style={{ height: '100%' }} />}
                {s.isFeatured && (
                  <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--gold)', color: 'var(--night)', fontSize: 11.5, fontWeight: 800, padding: '5px 10px', borderRadius: 'var(--r-pill)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="star" size={10} color="var(--night)" fill="var(--night)" /> Vedette
                  </span>
                )}
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{typeof s.category === 'object' ? s.category.name : ''}</div>
                <div className="serif" style={{ fontSize: 19, fontWeight: 600, marginBottom: 6 }}>{s.name}</div>
                <div className="display" style={{ fontSize: 20, color: 'var(--coral)', marginBottom: 14 }}>{s.basePrice.toLocaleString('fr-FR')} F</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setEditing(s)} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
                    <Icon name="edit" size={13} /> Modifier
                  </button>
                  <button onClick={() => { if (confirm('Archiver ce service ?')) archive.mutate(s._id) }}
                    className="btn btn-ghost btn-sm" style={{ width: 42, color: 'var(--muted)' }} title="Archiver">
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ServiceForm service={editing === 'new' ? undefined : editing} categories={categories ?? []} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}
