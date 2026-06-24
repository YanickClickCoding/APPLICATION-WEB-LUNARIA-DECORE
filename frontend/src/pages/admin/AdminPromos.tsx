import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'

interface Promo {
  _id: string
  code: string
  description?: string
  type: 'POURCENTAGE' | 'MONTANT_FIXE'
  value: number
  minOrderAmount: number
  maxUses?: number
  usedCount: number
  validFrom?: string
  validUntil?: string
  isActive: boolean
}

const lbl = { fontSize: 12.5, fontWeight: 600 as const, color: 'var(--muted)', marginBottom: 6, display: 'block' }

function PromoForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const toast = useToastStore()
  const [form, setForm] = useState({
    code: '', description: '', type: 'POURCENTAGE', value: '', minOrderAmount: '', maxUses: '', validUntil: '',
  })
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const save = useMutation({
    mutationFn: () => api.post('/promos', {
      code: form.code.toUpperCase(),
      description: form.description,
      type: form.type,
      value: Number(form.value),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
      maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      validUntil: form.validUntil || undefined,
      isActive: true,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-promos'] }); toast.success('Code promo créé'); onClose() },
    onError: () => toast.error('Erreur', 'Code déjà existant ou invalide'),
  })

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label="Code promo"
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(43,20,36,.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--sh-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--line-2)' }}>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 600 }}>Nouveau code promo</h2>
          <button onClick={onClose} aria-label="Fermer" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--muted)' }}><Icon name="close" size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate() }} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={lbl}>Code *</label><input required className="field mono" style={{ textTransform: 'uppercase', fontFamily: 'var(--mono)' }} value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())} placeholder="SAINTVALENTIN25" /></div>
          <div><label style={lbl}>Description</label><input className="field" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Saint-Valentin 2026" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={lbl}>Type *</label>
              <select className="field" style={{ cursor: 'pointer' }} value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="POURCENTAGE">Pourcentage (%)</option>
                <option value="MONTANT_FIXE">Montant fixe (F)</option>
              </select>
            </div>
            <div><label style={lbl}>Valeur *</label><input required type="number" className="field" value={form.value} onChange={(e) => set('value', e.target.value)} placeholder={form.type === 'POURCENTAGE' ? '20' : '2000'} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Min. commande</label><input type="number" className="field" value={form.minOrderAmount} onChange={(e) => set('minOrderAmount', e.target.value)} placeholder="0" /></div>
            <div><label style={lbl}>Usages max</label><input type="number" className="field" value={form.maxUses} onChange={(e) => set('maxUses', e.target.value)} placeholder="∞" /></div>
          </div>
          <div><label style={lbl}>Expire le</label><input type="date" className="field" value={form.validUntil} onChange={(e) => set('validUntil', e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Annuler</button>
            <button type="submit" disabled={save.isPending} className="btn btn-primary" style={{ flex: 1, opacity: save.isPending ? .6 : 1 }}>
              {save.isPending ? 'Création…' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminPromos() {
  const qc = useQueryClient()
  const toast = useToastStore()
  const [showForm, setShowForm] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const { data: promos, isLoading } = useQuery<Promo[]>({
    queryKey: ['admin-promos'],
    queryFn: () => api.get<Promo[]>('/promos').then((r) => r.data),
  })

  const toggle = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.patch(`/promos/${id}`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-promos'] }),
  })
  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/promos/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-promos'] }); toast.success('Code supprimé') },
  })

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 1500)
  }

  const rows = promos ?? []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 14 }}>
        <div>
          <div className="eyebrow">Marketing</div>
          <h1 className="display" style={{ fontSize: 36, margin: '6px 0 0' }}>Codes promo</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Icon name="plus" size={17} color="#fff" /> Nouveau code
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>Chargement…</div>
      ) : rows.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          <Icon name="tag" size={40} color="var(--line)" style={{ margin: '0 auto 12px' }} />
          <div>Aucun code promo · <button onClick={() => setShowForm(true)} style={{ color: 'var(--coral)', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}>Créer le premier</button></div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {rows.map((p) => (
            <div key={p._id} className="card" style={{ padding: 22, boxShadow: 'var(--sh-sm)', opacity: p.isActive ? 1 : 0.6, borderColor: p.isActive ? 'rgba(255,45,142,.3)' : 'var(--line-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <button onClick={() => copyCode(p.code)} title="Copier"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <span className="mono" style={{ color: 'var(--coral)', fontWeight: 700, fontSize: 17, letterSpacing: '.06em' }}>{p.code}</span>
                  <Icon name={copied === p.code ? 'check' : 'plus'} size={13} color={copied === p.code ? '#2c9c5e' : 'var(--muted-2)'} />
                </button>
                <span className="tag" style={{ background: p.isActive ? 'rgba(62,196,122,.12)' : 'var(--ivory-2)', color: p.isActive ? '#2c9c5e' : 'var(--muted)', fontWeight: 700 }}>
                  {p.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              {p.description && <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 12 }}>{p.description}</p>}
              <div className="display" style={{ fontSize: 30, marginBottom: 12 }}>
                {p.type === 'POURCENTAGE' ? `−${p.value}%` : `−${p.value.toLocaleString('fr-FR')} F`}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.7 }}>
                {p.minOrderAmount > 0 && <div>Min. {p.minOrderAmount.toLocaleString('fr-FR')} F</div>}
                <div>Utilisé {p.usedCount}{p.maxUses ? ` / ${p.maxUses}` : ''} fois</div>
                {p.validUntil && <div>Expire le {new Date(p.validUntil).toLocaleDateString('fr-FR')}</div>}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => toggle.mutate({ id: p._id, isActive: !p.isActive })} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
                  {p.isActive ? 'Désactiver' : 'Activer'}
                </button>
                <button onClick={() => { if (confirm('Supprimer ce code ?')) remove.mutate(p._id) }}
                  className="btn btn-ghost btn-sm" style={{ width: 42, color: 'var(--muted)' }} title="Supprimer">
                  <Icon name="trash" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <PromoForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
