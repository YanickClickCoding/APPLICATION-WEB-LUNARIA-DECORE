import { useEffect, useMemo, useState } from 'react'
import Icon from '@/components/ui/Icon'
import { productsService } from '@/services/products.service'
import type { Category, Product } from '@/types'

type ProductStatus = 'ACTIF' | 'RUPTURE' | 'BROUILLON'

function getStatus(p: Product): ProductStatus {
  if (!p.isAvailable || p.stock <= 0) return 'RUPTURE'
  // Produit "disponible" mais pas forcément publié/featured; on simplifie avec isFeatured.
  if (p.isFeatured) return 'ACTIF'
  return 'BROUILLON'
}

function statusColor(st: ProductStatus) {
  if (st === 'ACTIF') return '#3ec47a'
  if (st === 'RUPTURE') return 'var(--coral)'
  return 'var(--muted)'
}

function fmtMoneyF(n: number) {
  // backend stocke price en number, on affiche FCFA
  const s = n.toLocaleString('fr-FR')
  return `${s} F`
}

export default function AdminProducts() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])

  const [categoryFilter, setCategoryFilter] = useState<string>('Tous')
  const categoriesPreset = useMemo(
    () => ['Tous', 'Chambre romantique', 'Mariage', 'Anniversaire', 'Saint-Valentin'],
    [],
  )

  // Pagination simple (MVP UI)
  const [page, setPage] = useState(1)
  const limit = 12

  // Modal CRUD (création / édition)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const [form, setForm] = useState<{
    name: string
    description: string
    price: string
    stock: string
    category: string
    isAvailable: boolean
    isFeatured: boolean
    tags: string
    images: string
  }>({
    name: '',
    description: '',
    price: '45000',
    stock: '10',
    category: '',
    isAvailable: true,
    isFeatured: true,
    tags: '',
    images: '',
  })

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '45000',
      stock: '10',
      category: '',
      isAvailable: true,
      isFeatured: true,
      tags: '',
      images: '',
    })
  }

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const categoryParam = categoryFilter === 'Tous' ? undefined : categoryFilter
      const res = await productsService.getAll({ category: categoryParam, page, limit })
      // productsService renvoie { data, total, page, limit, totalPages }
      // Axios: res.data est déjà le payload
      setProducts((res.data as any)?.data ?? [])
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur chargement produits')
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryFilter])

  const openCreate = () => {
    setEditing(null)
    resetForm()
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: String(p.price ?? 0),
      stock: String(p.stock ?? 0),
      category: (p.category as Category | undefined)?._id ?? (p.category as any)?.id ?? '',
      isAvailable: p.isAvailable,
      isFeatured: p.isFeatured,
      tags: p.tags?.join(', ') ?? '',
      images: (p.images ?? []).join('\n'),
    })
    setModalOpen(true)
  }

  const onSave = async () => {
    const images = form.images
      .split(/[\n,]/)
      .map((x) => x.trim())
      .filter(Boolean)
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      isAvailable: form.isAvailable,
      isFeatured: form.isFeatured,
      tags: form.tags
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      category: form.category,
      images,
    }

    setLoading(true)
    setError(null)
    try {
      if (editing) {
        await productsService.updateJson(editing._id, payload)
      } else {
        await productsService.createJson(payload)
      }
      setModalOpen(false)
      resetForm()
      setEditing(null)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur sauvegarde produit')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (p: Product) => {
    if (!confirm(`Supprimer (archiver) le produit "${p.name}" ?`)) return
    setLoading(true)
    setError(null)
    try {
      await productsService.delete(p._id)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur suppression produit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, gap: 14 }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>
            Produits
          </h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>
            {products.length} · gestion CRUD
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              // switch admin → client (prototype lunaria-prototype.html)
              window.location.href = '/catalogue'
            }}
            style={{ whiteSpace: 'nowrap' }}
          >
            Voir côté client
          </button>

          <button className="btn btn-primary" onClick={openCreate} style={{ whiteSpace: 'nowrap' }}>
            <Icon name="plus" size={17} color="#fff" /> Ajouter un produit
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {categoriesPreset.map((c, i) => (
          <button
            key={c}
            type="button"
            className={`chip ${i === 0 ? 'chip-active' : ''}`}
            style={{
              fontSize: 12.5,
              padding: '7px 14px',
              cursor: 'pointer',
              background: categoryFilter === c ? 'var(--night)' : undefined,
              color: categoryFilter === c ? '#fff' : undefined,
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-pill)',
            }}
            onClick={() => setCategoryFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(233,69,96,.08)',
            color: 'var(--coral-deep)',
            border: '1px solid rgba(233,69,96,.25)',
            padding: '10px 14px',
            borderRadius: 'var(--r-md)',
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.2fr 1fr 90px 110px 140px',
            padding: '14px 24px',
            fontSize: 11.5,
            fontWeight: 700,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '.06em',
            borderBottom: '1px solid var(--line-2)',
          }}
        >
          <span>Produit</span>
          <span>Catégorie</span>
          <span>Prix</span>
          <span>Stock</span>
          <span>Statut</span>
          <span></span>
        </div>

        {loading && products.length === 0 && (
          <div style={{ padding: 24, color: 'var(--muted)' }}>Chargement…</div>
        )}

        {!loading && products.length === 0 && <div style={{ padding: 24, color: 'var(--muted)' }}>Aucun produit</div>}

        {products.map((p, i) => {
          const st = getStatus(p)
          return (
            <div
              key={p._id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.2fr 1fr 90px 110px 140px',
                alignItems: 'center',
                padding: '14px 24px',
                borderBottom: i < products.length - 1 ? '1px solid var(--line-2)' : 'none',
                fontSize: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className={`ph ${p.isFeatured ? 'gold' : 'warm'}`} style={{ width: 46, height: 46, borderRadius: 'var(--r-sm)' }} />
                <span className="serif" style={{ fontSize: 18, fontWeight: 600 }}>
                  {p.name}
                </span>
              </div>

              <span style={{ color: 'var(--muted)' }}>{p.category?.name ?? '—'}</span>
              <span style={{ fontWeight: 700 }}>{fmtMoneyF(p.price ?? 0)}</span>
              <span style={{ color: (p.stock ?? 0) <= 0 ? 'var(--coral)' : 'var(--ink)', fontWeight: 600 }}>{p.stock ?? 0}</span>
              <span className="tag" style={{ background: 'var(--ivory-2)', color: statusColor(st), fontWeight: 700, justifySelf: 'start' }}>
                ● {st}
              </span>

              <div style={{ display: 'flex', gap: 12, color: 'var(--muted)' }}>
                <button type="button" onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <Icon name="edit" size={17} />
                </button>
                <button type="button" onClick={() => onDelete(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <Icon name="trash" size={17} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* MVP pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
        <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          ← Précédent
        </button>
        <span style={{ color: 'var(--muted)' }}>Page {page}</span>
        <button className="btn btn-ghost" onClick={() => setPage((p) => p + 1)}>
          Suivant →
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(26,26,46,.55)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 760,
              background: 'var(--paper)',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--line-2)',
              boxShadow: 'var(--sh-lg)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className="display" style={{ fontSize: 26, margin: 0 }}>
                  {editing ? 'Modifier le produit' : 'Ajouter un produit'}
                </h2>
                <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 4 }}>CRUD produit (JSON → multipart dans ce projet)</div>
              </div>
              <button onClick={() => setModalOpen(false)} className="btn btn-ghost btn-sm">
                Fermer
              </button>
            </div>

            <div style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                Nom
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="field" />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                Prix (FCFA)
                <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="field" />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                Stock
                <input value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="field" />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                Catégorie (ID)
                <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="field" placeholder="Ex: 664..." />
              </label>

              <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="field"
                  rows={4}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))} />
                Disponible
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                />
                Featured
              </label>


              <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                Tags (séparés par des virgules)
                <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className="field" placeholder="romantique, nuit" />
              </label>

              <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                Photos du produit <span style={{ fontSize: 12, color: 'var(--muted-2)', fontWeight: 400 }}>(une URL d'image par ligne — la 1ʳᵉ est la photo principale)</span>
                <textarea
                  value={form.images}
                  onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                  className="field"
                  rows={4}
                  placeholder={'https://exemple.com/photo1.jpg\nhttps://exemple.com/photo2.jpg'}
                  style={{ resize: 'vertical', fontFamily: 'var(--mono)', fontSize: 12.5 }}
                />
                {/* Aperçu des images saisies */}
                {form.images.split(/[\n,]/).map((s) => s.trim()).filter(Boolean).length > 0 && (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                    {form.images.split(/[\n,]/).map((s) => s.trim()).filter(Boolean).map((url, i) => (
                      <div key={i} style={{ position: 'relative', width: 64, height: 64, borderRadius: 'var(--r-sm)', overflow: 'hidden', border: '1px solid var(--line-2)', background: 'var(--ivory-2)' }}>
                        <img src={url} alt={`photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }} />
                        {i === 0 && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--coral)', color: '#fff', fontSize: 8.5, fontWeight: 700, textAlign: 'center', padding: '1px 0' }}>PRINCIPALE</span>}
                      </div>
                    ))}
                  </div>
                )}
              </label>
            </div>

            <div style={{ padding: 22, borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={onSave} disabled={loading || !form.name || !form.category}>
                {loading ? 'En cours…' : editing ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

