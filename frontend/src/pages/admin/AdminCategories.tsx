import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import type { Category } from '@/types'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', description: '', order: '0', isActive: true })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<Category[]>('/categories/admin')
      setCategories(res.data ?? [])
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur chargement catégories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '', order: String(categories.length), isActive: true })
    setModalOpen(true)
  }

  const openEdit = (c: Category) => {
    setEditing(c)
    setForm({ name: c.name, description: c.description ?? '', order: String(c.order ?? 0), isActive: c.isActive ?? true })
    setModalOpen(true)
  }

  const onSave = async () => {
    const payload = { name: form.name.trim(), description: form.description.trim(), order: Number(form.order) || 0, isActive: form.isActive }
    setLoading(true)
    setError(null)
    try {
      if (editing) await api.patch(`/categories/${editing._id}`, payload)
      else await api.post('/categories', payload)
      setModalOpen(false)
      setEditing(null)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur sauvegarde catégorie')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (c: Category) => {
    if (!confirm(`Supprimer la catégorie "${c.name}" ?`)) return
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/categories/${c._id}`)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur suppression catégorie')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Catégories</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{categories.length} catégorie{categories.length > 1 ? 's' : ''}</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ whiteSpace: 'nowrap' }}>
          <Icon name="plus" size={17} color="#fff" /> Nouvelle catégorie
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(255,45,142,.08)', color: 'var(--coral-deep)', border: '1px solid rgba(255,45,142,.25)', padding: '10px 14px', borderRadius: 'var(--r-md)', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 100px 110px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Nom</span>
          <span>Slug</span>
          <span>Ordre</span>
          <span>Statut</span>
          <span></span>
        </div>

        {loading && categories.length === 0 && <div style={{ padding: 24, color: 'var(--muted)' }}>Chargement…</div>}
        {!loading && categories.length === 0 && <div style={{ padding: 24, color: 'var(--muted)' }}>Aucune catégorie</div>}

        {categories.map((c, i) => (
          <div key={c._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 100px 110px', alignItems: 'center', padding: '14px 24px', borderBottom: i < categories.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14 }}>
            <span className="serif" style={{ fontSize: 17, fontWeight: 600 }}>{c.name}</span>
            <span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{c.slug}</span>
            <span style={{ color: 'var(--muted)' }}>{c.order ?? 0}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: c.isActive ? '#3ec47a' : 'var(--muted)', fontWeight: 700, justifySelf: 'start' }}>
              ● {c.isActive ? 'Active' : 'Masquée'}
            </span>
            <div style={{ display: 'flex', gap: 12, color: 'var(--muted)' }}>
              <button type="button" onClick={() => openEdit(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="edit" size={17} /></button>
              <button type="button" onClick={() => onDelete(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="trash" size={17} /></button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(43,20,36,.55)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, maxHeight: '92vh', background: 'var(--paper)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)', boxShadow: 'var(--sh-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <h2 className="display" style={{ fontSize: 24, margin: 0 }}>{editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
              <button onClick={() => setModalOpen(false)} className="btn btn-ghost btn-sm">Fermer</button>
            </div>

            <div style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                Nom de la catégorie
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="field" placeholder="Ex: Baby shower" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                Description <span style={{ fontWeight: 400, color: 'var(--muted-2)', fontSize: 12 }}>(facultatif)</span>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="field" rows={3} style={{ resize: 'vertical' }} />
              </label>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600, width: 120 }}>
                  Ordre
                  <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} className="field" />
                </label>
                <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', cursor: 'pointer', background: form.isActive ? 'var(--coral-soft)' : 'var(--paper)' }}>
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Active (visible en boutique)</span>
                </label>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end', gap: 12, flexShrink: 0 }}>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={onSave} disabled={loading || !form.name.trim()}>
                {loading ? 'En cours…' : editing ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
