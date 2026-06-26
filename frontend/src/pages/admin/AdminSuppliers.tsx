import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'

interface Supplier {
  _id: string
  name: string
  contactName?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  isActive?: boolean
}

const empty = { name: '', contactName: '', phone: '', email: '', address: '', notes: '', isActive: true }

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [form, setForm] = useState({ ...empty })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<Supplier[]>('/suppliers')
      setSuppliers(res.data ?? [])
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur chargement fournisseurs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm({ ...empty }); setModalOpen(true) }
  const openEdit = (s: Supplier) => {
    setEditing(s)
    setForm({ name: s.name, contactName: s.contactName ?? '', phone: s.phone ?? '', email: s.email ?? '', address: s.address ?? '', notes: s.notes ?? '', isActive: s.isActive ?? true })
    setModalOpen(true)
  }

  const onSave = async () => {
    setLoading(true)
    setError(null)
    try {
      if (editing) await api.patch(`/suppliers/${editing._id}`, form)
      else await api.post('/suppliers', form)
      setModalOpen(false)
      setEditing(null)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur sauvegarde fournisseur')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (s: Supplier) => {
    if (!confirm(`Supprimer le fournisseur "${s.name}" ?`)) return
    setLoading(true)
    try {
      await api.delete(`/suppliers/${s._id}`)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur suppression')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Fournisseurs</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{suppliers.length} fournisseur{suppliers.length > 1 ? 's' : ''}</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ whiteSpace: 'nowrap' }}>
          <Icon name="plus" size={17} color="#fff" /> Nouveau fournisseur
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(255,45,142,.08)', color: 'var(--coral-deep)', border: '1px solid rgba(255,45,142,.25)', padding: '10px 14px', borderRadius: 'var(--r-md)', marginBottom: 16 }}>{error}</div>
      )}

      <div className="lun-table" style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.4fr 1.8fr 100px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Nom</span><span>Contact</span><span>Téléphone</span><span>Email</span><span></span>
        </div>

        {loading && suppliers.length === 0 && <div style={{ padding: 24, color: 'var(--muted)' }}>Chargement…</div>}
        {!loading && suppliers.length === 0 && <div style={{ padding: 24, color: 'var(--muted)' }}>Aucun fournisseur</div>}

        {suppliers.map((s, i) => (
          <div key={s._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.4fr 1.8fr 100px', alignItems: 'center', padding: '14px 24px', borderBottom: i < suppliers.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14 }}>
            <span className="serif" style={{ fontSize: 17, fontWeight: 600 }}>{s.name}</span>
            <span style={{ color: 'var(--muted)' }}>{s.contactName || '—'}</span>
            <span style={{ color: 'var(--muted)' }}>{s.phone || '—'}</span>
            <span style={{ color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.email || '—'}</span>
            <div style={{ display: 'flex', gap: 12, color: 'var(--muted)' }}>
              <button type="button" onClick={() => openEdit(s)} aria-label={`Modifier le fournisseur ${s.name}`} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="edit" size={17} /></button>
              <button type="button" onClick={() => onDelete(s)} aria-label={`Supprimer le fournisseur ${s.name}`} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="trash" size={17} /></button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div onClick={() => setModalOpen(false)} role="dialog" aria-modal="true" aria-label="Fournisseur" style={{ position: 'fixed', inset: 0, background: 'rgba(43,20,36,.55)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 560, maxHeight: '92vh', background: 'var(--paper)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)', boxShadow: 'var(--sh-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <h2 className="display" style={{ fontSize: 24, margin: 0 }}>{editing ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}</h2>
              <button onClick={() => setModalOpen(false)} className="btn btn-ghost btn-sm">Fermer</button>
            </div>

            <div style={{ padding: 24, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="lun-form-grid">
              <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                Nom du fournisseur
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="field" placeholder="Ex: Ballons Express Cotonou" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                Contact
                <input value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} className="field" placeholder="Nom du contact" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                Téléphone
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="field" placeholder="+229 ..." />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                Email
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="field" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                Adresse
                <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="field" />
              </label>
              <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                Notes
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="field" rows={3} style={{ resize: 'vertical' }} />
              </label>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end', gap: 12, flexShrink: 0 }}>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={onSave} disabled={loading || !form.name.trim()}>{loading ? 'En cours…' : editing ? 'Enregistrer' : 'Créer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
