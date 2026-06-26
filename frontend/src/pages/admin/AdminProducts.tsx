import { useEffect, useRef, useState } from 'react'
import Icon from '@/components/ui/Icon'
import { productsService } from '@/services/products.service'
import api from '@/services/api'
import type { Category, Product } from '@/types'

type ProductStatus = 'ACTIF' | 'RUPTURE' | 'BROUILLON'

type SortKey = 'recent' | 'price-asc' | 'price-desc' | 'popular'
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Plus récents' },
  { key: 'popular', label: 'Populaires' },
  { key: 'price-asc', label: 'Prix croissant' },
  { key: 'price-desc', label: 'Prix décroissant' },
]

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
  const [totalPages, setTotalPages] = useState(1)

  const [categories, setCategories] = useState<Category[]>([])
  // Filtre par id de catégorie ('' = Tous), pour correspondre à ce qu'attend le backend
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  // Tri (aligné sur le catalogue public)
  const [sort, setSort] = useState<SortKey>('recent')
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  // Pagination simple (MVP UI)
  const [page, setPage] = useState(1)
  const limit = 12

  // Modal CRUD (création / édition)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  // Aperçus locaux des fichiers en cours de téléversement (avant retour des URLs Cloudinary)
  const [pendingPreviews, setPendingPreviews] = useState<{ id: string; url: string; status: 'uploading' | 'error' }[]>([])

  const [form, setForm] = useState<{
    name: string
    description: string
    price: string
    comparePrice: string
    stock: string
    category: string
    categories: string[]
    isAvailable: boolean
    isFeatured: boolean
    tags: string
    images: string
  }>({
    name: '',
    description: '',
    price: '45000',
    comparePrice: '',
    stock: '10',
    category: '',
    categories: [],
    isAvailable: true,
    isFeatured: true,
    tags: '',
    images: '',
  })

  const resetForm = () => {
    setPendingPreviews((prev) => { prev.forEach((p) => URL.revokeObjectURL(p.url)); return [] })
    setUploadError(null)
    setForm({
      name: '',
      description: '',
      price: '45000',
      comparePrice: '',
      stock: '10',
      category: '',
      categories: [],
      isAvailable: true,
      isFeatured: true,
      tags: '',
      images: '',
    })
  }

  // Coche/décoche une famille additionnelle
  const toggleCategory = (id: string) =>
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((x) => x !== id)
        : [...f.categories, id],
    }))

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const categoryParam = categoryFilter || undefined
      const res = await productsService.getAll({ category: categoryParam, page, limit, sort })
      // productsService renvoie { data, total, page, limit, totalPages }
      // Axios: res.data est déjà le payload
      const payload = res.data as any
      setProducts(payload?.data ?? [])
      setTotalPages(Math.max(1, payload?.totalPages ?? 1))
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur chargement produits')
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryFilter, sort])

  // Ferme le menu de tri au clic extérieur ou à Échap
  useEffect(() => {
    if (!sortOpen) return
    const onClick = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSortOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [sortOpen])

  const changeCategory = (id: string) => { setCategoryFilter(id); setPage(1) }
  const changeSort = (key: SortKey) => { setSort(key); setPage(1); setSortOpen(false) }

  // Charge la liste des catégories (pour le menu déroulant du formulaire)
  useEffect(() => {
    api.get<Category[]>('/categories')
      .then((r) => setCategories(r.data ?? []))
      .catch(() => setCategories([]))
  }, [])

  const openCreate = () => {
    setEditing(null)
    resetForm()
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setPendingPreviews((prev) => { prev.forEach((pv) => URL.revokeObjectURL(pv.url)); return [] })
    setUploadError(null)
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: String(p.price ?? 0),
      comparePrice: p.comparePrice ? String(p.comparePrice) : '',
      stock: String(p.stock ?? 0),
      category: (p.category as Category | undefined)?._id ?? (p.category as any)?.id ?? '',
      categories: (p.categories ?? []).map((c) => (typeof c === 'object' ? c._id : c)).filter(Boolean) as string[],
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
      // Prix barré (promo) : null si vide → retire la promo
      comparePrice: form.comparePrice.trim() ? Number(form.comparePrice) : null,
      stock: Number(form.stock),
      isAvailable: form.isAvailable,
      isFeatured: form.isFeatured,
      tags: form.tags
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      category: form.category,
      // Familles : la principale + les familles cochées (dédupliquées)
      categories: Array.from(new Set([form.category, ...form.categories].filter(Boolean))),
      images,
    }

    setLoading(true)
    setError(null)
    try {
      const isCreate = !editing
      if (editing) {
        await productsService.updateJson(editing._id, payload)
      } else {
        await productsService.createJson(payload)
      }
      setModalOpen(false)
      resetForm()
      setEditing(null)
      if (isCreate) {
        // Revient en tête de liste pour que le nouveau produit soit visible.
        // Si page/filtre/tri changent, le useEffect recharge ; sinon on recharge ici.
        const needsReset = page !== 1 || categoryFilter !== '' || sort !== 'recent'
        setPage(1)
        setCategoryFilter('')
        setSort('recent')
        if (!needsReset) await load()
      } else {
        await load()
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur sauvegarde produit')
    } finally {
      setLoading(false)
    }
  }

  // — Gestion des photos (liste dérivée de form.images, séparé par retours ligne) —
  const imageList = form.images.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
  const setImageList = (urls: string[]) => setForm((f) => ({ ...f, images: urls.join('\n') }))

  const uploading = pendingPreviews.some((p) => p.status === 'uploading')

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploadError(null)
    const arr = Array.from(files)
    // 1) Aperçu local immédiat (avant même l'envoi)
    const previews = arr.map((f) => ({ id: `${Date.now()}-${f.name}-${Math.random().toString(36).slice(2)}`, url: URL.createObjectURL(f), status: 'uploading' as const }))
    setPendingPreviews((prev) => [...prev, ...previews])
    // 2) Upload en tâche de fond → on remplace l'aperçu local par l'URL distante
    try {
      const { data } = await productsService.uploadImages(arr)
      setImageList([...imageList, ...(data.urls ?? [])])
      setPendingPreviews((prev) => prev.filter((p) => !previews.some((pv) => pv.id === p.id)))
      previews.forEach((pv) => URL.revokeObjectURL(pv.url))
    } catch (e: any) {
      setUploadError(e?.response?.data?.message ?? e?.message ?? 'Échec du téléversement. Vérifiez la configuration Cloudinary du serveur.')
      const failed = new Set(previews.map((p) => p.id))
      setPendingPreviews((prev) => prev.map((p) => (failed.has(p.id) ? { ...p, status: 'error' as const } : p)))
    }
  }

  const removePending = (id: string) => {
    setPendingPreviews((prev) => {
      const hit = prev.find((p) => p.id === id)
      if (hit) URL.revokeObjectURL(hit.url)
      return prev.filter((p) => p.id !== id)
    })
  }

  const removeImage = (idx: number) => setImageList(imageList.filter((_, i) => i !== idx))
  const makePrimary = (idx: number) => {
    if (idx === 0) return
    const next = [...imageList]
    const [pic] = next.splice(idx, 1)
    setImageList([pic, ...next])
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
      {/* Onglets catégories — en tête de page, juste sous la barre de recherche */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <button type="button" aria-pressed={categoryFilter === ''}
          className={`chip ${categoryFilter === '' ? 'chip-active' : ''}`}
          style={{ fontSize: 12.5, padding: '7px 14px', cursor: 'pointer', font: 'inherit', background: categoryFilter === '' ? 'var(--night)' : undefined, color: categoryFilter === '' ? '#fff' : undefined, border: '1px solid var(--line)', borderRadius: 'var(--r-pill)' }}
          onClick={() => changeCategory('')}>
          Tous
        </button>
        {categories.map((c) => (
          <button key={c._id} type="button" aria-pressed={categoryFilter === c._id}
            className={`chip ${categoryFilter === c._id ? 'chip-active' : ''}`}
            style={{ fontSize: 12.5, padding: '7px 14px', cursor: 'pointer', font: 'inherit', background: categoryFilter === c._id ? 'var(--night)' : undefined, color: categoryFilter === c._id ? '#fff' : undefined, border: '1px solid var(--line)', borderRadius: 'var(--r-pill)' }}
            onClick={() => changeCategory(c._id)}>
            {c.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, gap: 14, flexWrap: 'wrap' }}>
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

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
        {/* Tri */}
        <div ref={sortRef} style={{ position: 'relative' }}>
          <button type="button" onClick={() => setSortOpen((v) => !v)}
            aria-haspopup="listbox" aria-expanded={sortOpen}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 'var(--r-pill)', border: '1px solid var(--line)', background: 'var(--paper)', cursor: 'pointer', font: 'inherit', fontSize: 13, color: 'var(--ink)' }}>
            <Icon name="filter" size={15} /> Trier : {SORT_OPTIONS.find((o) => o.key === sort)?.label} <Icon name="chevd" size={13} />
          </button>
          {sortOpen && (
            <ul role="listbox" aria-label="Trier les produits"
              style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 30, minWidth: 200, listStyle: 'none', margin: 0, padding: 6, background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', boxShadow: 'var(--sh-lg)' }}>
              {SORT_OPTIONS.map((o) => (
                <li key={o.key} role="option" aria-selected={sort === o.key}>
                  <button type="button" onClick={() => changeSort(o.key)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 'var(--r-sm)', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, background: sort === o.key ? 'var(--coral-soft)' : 'transparent', color: sort === o.key ? 'var(--coral-deep)' : 'var(--ink)', fontWeight: sort === o.key ? 700 : 500 }}>
                    {o.label}
                    {sort === o.key && <Icon name="check" size={15} color="var(--coral-deep)" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(255,45,142,.08)',
            color: 'var(--coral-deep)',
            border: '1px solid rgba(255,45,142,.25)',
            padding: '10px 14px',
            borderRadius: 'var(--r-md)',
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <div className="lun-table" style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name}
                    style={{ width: 46, height: 46, borderRadius: 'var(--r-sm)', objectFit: 'cover', flexShrink: 0, background: 'var(--ivory-2)' }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }} />
                ) : (
                  <div className={`ph ${p.isFeatured ? 'gold' : 'warm'}`} style={{ width: 46, height: 46, borderRadius: 'var(--r-sm)', flexShrink: 0 }} />
                )}
                <span className="serif" style={{ fontSize: 18, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                <button type="button" onClick={() => openEdit(p)} aria-label={`Modifier le produit ${p.name}`} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <Icon name="edit" size={17} />
                </button>
                <button type="button" onClick={() => onDelete(p)} aria-label={`Supprimer le produit ${p.name}`} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <Icon name="trash" size={17} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination — toujours affichée */}
      <div className="lun-pager-spacer" />
      <div className="lun-pager-sticky">
        <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          ← Précédent
        </button>
        <span style={{ color: 'var(--muted)' }}>Page {page} / {totalPages}</span>
        <button className="btn btn-ghost" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
          Suivant →
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          role="dialog" aria-modal="true" aria-label="Produit"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(43,20,36,.55)',
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
              maxWidth: 720,
              maxHeight: '92vh',
              background: 'var(--paper)',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--line-2)',
              boxShadow: 'var(--sh-lg)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* En-tête fixe */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <h2 className="display" style={{ fontSize: 24, margin: 0 }}>
                {editing ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="btn btn-ghost btn-sm">Fermer</button>
            </div>

            {/* Corps scrollable */}
            <div style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 26 }}>
              {/* — Section : Informations — */}
              <section>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Informations</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }} className="lun-form-grid">
                  <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                    Nom du produit
                    <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="field" placeholder="Ex: Arche fleurie blanche" />
                  </label>

                  <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                    Catégorie principale
                    <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="field">
                      <option value="">— Choisir une famille —</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </label>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Autres familles <span style={{ fontWeight: 400, color: 'var(--muted-2)', fontSize: 12 }}>(le produit apparaîtra dans chacune)</span></span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {categories.filter((c) => c._id !== form.category).map((c) => {
                        const on = form.categories.includes(c._id)
                        return (
                          <button key={c._id} type="button" onClick={() => toggleCategory(c._id)} aria-pressed={on}
                            style={{ fontSize: 12.5, padding: '7px 14px', borderRadius: 'var(--r-pill)', cursor: 'pointer', font: 'inherit',
                              border: `1px solid ${on ? 'var(--coral)' : 'var(--line)'}`,
                              background: on ? 'var(--coral-soft)' : 'var(--paper)',
                              color: on ? 'var(--coral-deep)' : 'var(--ink)', fontWeight: on ? 700 : 500 }}>
                            {on ? '✓ ' : ''}{c.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                    Prix (FCFA)
                    <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="field" />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                    Stock disponible
                    <input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="field" />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                    Prix avant promo (FCFA) <span style={{ fontWeight: 400, color: 'var(--muted-2)', fontSize: 12 }}>(optionnel)</span>
                    <input type="number" value={form.comparePrice} onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))} className="field" placeholder="Laisser vide si pas de promo" />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                    Tags <span style={{ fontWeight: 400, color: 'var(--muted-2)', fontSize: 12 }}>(séparés par des virgules)</span>
                    <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className="field" placeholder="romantique, nuit" />
                  </label>

                  <div style={{ gridColumn: '1 / -1', marginTop: -6, fontSize: 11.5, color: 'var(--muted-2)' }}>
                    Le « prix avant promo » affiche l'ancien prix barré et l'étiquette « Promo » en boutique.
                  </div>

                  <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                    Description
                    <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="field" rows={4} style={{ resize: 'vertical' }} placeholder="Décrivez le produit, ses dimensions, ce qui est inclus…" />
                  </label>
                </div>
              </section>

              {/* — Section : Options de publication — */}
              <section>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Publication</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <label style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', cursor: 'pointer', background: form.isAvailable ? 'var(--coral-soft)' : 'var(--paper)' }}>
                    <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Disponible</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Visible et achetable en boutique</div>
                    </div>
                  </label>
                  <label style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', cursor: 'pointer', background: form.isFeatured ? 'var(--coral-soft)' : 'var(--paper)' }}>
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Mis en avant</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Affiché en page d'accueil</div>
                    </div>
                  </label>
                </div>
              </section>

              {/* — Section : Photos — */}
              <section>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Photos du produit</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 10 }}>
                  Importez une ou plusieurs photos depuis votre appareil. La 1ʳᵉ sert de photo principale.
                </div>

                {/* Zone d'import */}
                <label
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '22px 16px', border: '1.5px dashed var(--line)', borderRadius: 'var(--r-md)', background: 'var(--ivory-2)', cursor: uploading ? 'wait' : 'pointer', textAlign: 'center' }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
                >
                  <Icon name={uploading ? 'spark' : 'plus'} size={22} color="var(--coral)" />
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                    {uploading ? 'Téléversement en cours…' : 'Cliquez ou glissez vos photos ici'}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted-2)' }}>JPG, PNG, WebP — jusqu'à 10 images</div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={(e) => { handleUpload(e.target.files); e.target.value = '' }}
                    style={{ display: 'none' }}
                  />
                </label>

                {uploadError && (
                  <p role="alert" style={{ color: 'var(--coral)', fontSize: 13, marginTop: 8 }}>{uploadError}</p>
                )}

                {/* Miniatures */}
                {(imageList.length > 0 || pendingPreviews.length > 0) && (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                    {imageList.map((url, i) => (
                      <div key={`${url}-${i}`} style={{ position: 'relative', width: 80, height: 80, borderRadius: 'var(--r-sm)', overflow: 'hidden', border: i === 0 ? '2px solid var(--coral)' : '1px solid var(--line-2)', background: 'var(--ivory-2)' }}>
                        <img src={url} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }} />
                        {i === 0 ? (
                          <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--coral)', color: '#fff', fontSize: 8.5, fontWeight: 700, textAlign: 'center', padding: '2px 0' }}>PRINCIPALE</span>
                        ) : (
                          <button type="button" onClick={() => makePrimary(i)} aria-label={`Définir la photo ${i + 1} comme principale`}
                            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(43,20,36,.72)', color: '#fff', fontSize: 8.5, fontWeight: 700, textAlign: 'center', padding: '2px 0', border: 'none', cursor: 'pointer' }}>
                            DÉFINIR
                          </button>
                        )}
                        <button type="button" onClick={() => removeImage(i)} aria-label={`Retirer la photo ${i + 1}`}
                          style={{ position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: '50%', border: 'none', background: 'rgba(43,20,36,.72)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                          <Icon name="close" size={12} color="#fff" />
                        </button>
                      </div>
                    ))}

                    {/* Aperçus locaux en cours / en échec */}
                    {pendingPreviews.map((p) => (
                      <div key={p.id} style={{ position: 'relative', width: 80, height: 80, borderRadius: 'var(--r-sm)', overflow: 'hidden', border: '1px solid var(--line-2)', background: 'var(--ivory-2)' }}>
                        <img src={p.url} alt="Aperçu en cours d'envoi" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: p.status === 'error' ? 0.35 : 0.7 }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(43,20,36,.32)' }}>
                          {p.status === 'uploading'
                            ? <Icon name="spark" size={18} color="#fff" />
                            : <Icon name="close" size={18} color="#fff" />}
                        </div>
                        <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: p.status === 'error' ? 'var(--coral)' : 'rgba(43,20,36,.72)', color: '#fff', fontSize: 8.5, fontWeight: 700, textAlign: 'center', padding: '2px 0' }}>
                          {p.status === 'error' ? 'ÉCHEC' : 'ENVOI…'}
                        </span>
                        <button type="button" onClick={() => removePending(p.id)} aria-label="Retirer cet aperçu"
                          style={{ position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: '50%', border: 'none', background: 'rgba(43,20,36,.72)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                          <Icon name="close" size={12} color="#fff" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Saisie d'URLs (repli, pour coller des liens externes) */}
                <details style={{ marginTop: 14 }}>
                  <summary style={{ fontSize: 12.5, color: 'var(--muted)', cursor: 'pointer' }}>Ou coller des URLs d'images</summary>
                  <textarea
                    value={form.images}
                    onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                    className="field"
                    rows={3}
                    placeholder={'https://exemple.com/photo1.jpg\nhttps://exemple.com/photo2.jpg'}
                    style={{ resize: 'vertical', fontFamily: 'var(--mono)', fontSize: 12.5, width: '100%', marginTop: 8 }}
                  />
                </details>
              </section>
            </div>

            {/* Pied fixe */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              {imageList.length === 0 && !uploading && (
                <span style={{ marginRight: 'auto', fontSize: 12.5, color: 'var(--muted)' }}>Ajoutez au moins une photo pour {editing ? 'enregistrer' : 'créer'}.</span>
              )}
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={onSave} disabled={loading || uploading || !form.name || !form.category || imageList.length === 0}>
                {loading ? 'En cours…' : uploading ? 'Téléversement…' : editing ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

