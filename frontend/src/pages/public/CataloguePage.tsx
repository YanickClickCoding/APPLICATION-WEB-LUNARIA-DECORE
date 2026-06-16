import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import { productsService } from '@/services/products.service'
import api from '@/services/api'
import type { Category } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  const page = Number(searchParams.get('page') ?? 1)
  const categoryId = searchParams.get('category') ?? undefined

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories').then((r) => r.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, category: categoryId, search }],
    queryFn: () => productsService.getAll({ page, limit: 12, category: categoryId, search: search || undefined }).then((r) => r.data),
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
        <span className="lun-cat-sort">
          <Icon name="filter" size={16} /> Trier : Populaires <Icon name="chevd" size={14} />
        </span>
      </div>

      {/* Grille produits */}
      {isLoading ? <LoadingSpinner /> : products.length === 0 ? (
        <div className="lun-cat-empty">
          <p>Aucun produit trouvé</p>
          <button onClick={() => { setSearch(''); setCategory(undefined) }} className="btn btn-ghost btn-sm" style={{ marginTop: 16 }}>Réinitialiser</button>
        </div>
      ) : (
        <div className="grid grid-4" style={{ gap: 22, paddingBottom: 40 }}>
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
