import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import { productsService } from '@/services/products.service'
import api from '@/services/api'
import type { Category } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton'

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'recent'
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: 'Populaires' },
  { key: 'recent', label: 'Nouveautés' },
  { key: 'price-asc', label: 'Prix croissant' },
  { key: 'price-desc', label: 'Prix décroissant' },
]

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  const page = Number(searchParams.get('page') ?? 1)
  const categoryId = searchParams.get('category') ?? undefined
  const sort = (searchParams.get('sort') as SortKey) ?? 'popular'
  const sortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? 'Populaires'

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories').then((r) => r.data),
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', { page, category: categoryId, search, sort }],
    queryFn: () => productsService.getAll({ page, limit: 12, category: categoryId, search: search || undefined, sort }).then((r) => r.data),
    placeholderData: keepPreviousData,
  })

  const setCategory = (id?: string) => {
    const p = new URLSearchParams(searchParams)
    if (id) p.set('category', id); else p.delete('category')
    p.set('page', '1')
    setSearchParams(p)
  }
  const setPage = (n: number) => {
    const p = new URLSearchParams(searchParams)
    p.set('page', String(n))
    setSearchParams(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const setSort = (key: SortKey) => {
    const p = new URLSearchParams(searchParams)
    if (key === 'popular') p.delete('sort'); else p.set('sort', key)
    p.set('page', '1')
    setSearchParams(p)
    setSortOpen(false)
  }

  // Ferme le menu de tri au clic extérieur ou à Échap
  useEffect(() => {
    if (!sortOpen) return
    const onClick = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSortOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [sortOpen])

  const products = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="lun-cat-page">
      {/* Bandeau titre */}
      <div className="lun-cat-header">
        <div className="eyebrow">Catalogue</div>
        <div className="lun-cat-titlerow">
          <h1 className="display lun-cat-h1">La boutique</h1>
          <div className="lun-search">
            <Icon name="search" size={18} color="var(--muted)" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une ambiance, un produit…" />
          </div>
        </div>
      </div>

      {/* Filtres catégories */}
      <div className="lun-chips">
        <span className={`chip ${!categoryId ? 'chip-active' : ''}`} onClick={() => setCategory(undefined)}>Tout</span>
        {categories?.map((c) => (
          <span key={c._id} className={`chip ${categoryId === c._id ? 'chip-active' : ''}`} onClick={() => setCategory(c._id)}>{c.name}</span>
        ))}
      </div>

      <div className="lun-cat-bar">
        <span className="lun-cat-count">{total} résultat{total > 1 ? 's' : ''}</span>
        <div className="lun-sort" ref={sortRef} style={{ position: 'relative' }}>
          <button type="button" className="lun-cat-sort" onClick={() => setSortOpen((v) => !v)}
            aria-haspopup="listbox" aria-expanded={sortOpen}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
            <Icon name="filter" size={16} /> Trier : {sortLabel} <Icon name="chevd" size={14} />
          </button>
          {sortOpen && (
            <ul role="listbox" aria-label="Trier les produits"
              style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 30, minWidth: 200, listStyle: 'none', margin: 0, padding: 6, background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', boxShadow: 'var(--sh-lg)' }}>
              {SORT_OPTIONS.map((o) => (
                <li key={o.key} role="option" aria-selected={sort === o.key}>
                  <button type="button" onClick={() => setSort(o.key)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 'var(--r-sm)', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14,
                      background: sort === o.key ? 'var(--coral-soft)' : 'transparent', color: sort === o.key ? 'var(--coral-deep)' : 'var(--ink)', fontWeight: sort === o.key ? 700 : 500 }}>
                    {o.label}
                    {sort === o.key && <Icon name="check" size={15} color="var(--coral-deep)" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Grille produits */}
      {isLoading ? (
        <div className="grid grid-4" style={{ gap: 22, paddingBottom: 40 }}>
          {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="lun-cat-empty">
          <p>Aucun produit trouvé</p>
          <button onClick={() => { setSearch(''); setCategory(undefined) }} className="btn btn-ghost btn-sm" style={{ marginTop: 16 }}>Réinitialiser</button>
        </div>
      ) : (
        <div className="grid grid-4" style={{ gap: 22, paddingBottom: 40, opacity: isFetching ? 0.6 : 1, transition: 'opacity .2s' }}>
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="lun-pager">
          <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="chip" style={{ padding: 10 }}><Icon name="chevl" size={16} /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)} className={`chip ${n === page ? 'chip-active' : ''}`}>{n}</button>
          ))}
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="chip" style={{ padding: 10 }}><Icon name="chevr" size={16} /></button>
        </div>
      )}
    </div>
  )
}
