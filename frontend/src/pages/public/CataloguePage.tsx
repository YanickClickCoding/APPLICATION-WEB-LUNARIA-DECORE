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
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 56px' }} className="lun-cat-page">
      {/* Bandeau titre */}
      <div style={{ padding: '46px 0 30px' }}>
        <div className="eyebrow">Catalogue</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12, gap: 20, flexWrap: 'wrap' }}>
          <h1 className="display" style={{ fontSize: 52, margin: 0 }}>La boutique</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-pill)', padding: '11px 18px', width: 340, maxWidth: '100%', boxShadow: 'var(--sh-sm)' }}>
            <Icon name="search" size={18} color="var(--muted)" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une ambiance, un produit…"
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 14, flex: 1, fontFamily: 'var(--sans)', color: 'var(--ink)' }} />
          </div>
        </div>
      </div>

      {/* Filtres catégories */}
      <div style={{ display: 'flex', gap: 10, paddingBottom: 8, flexWrap: 'wrap' }}>
        <span className={`chip ${!categoryId ? 'chip-active' : ''}`} onClick={() => setCategory(undefined)}>Tout</span>
        {categories?.map((c) => (
          <span key={c._id} className={`chip ${categoryId === c._id ? 'chip-active' : ''}`} onClick={() => setCategory(c._id)}>{c.name}</span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0' }}>
        <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>{total} résultat{total > 1 ? 's' : ''}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600 }}>
          <Icon name="filter" size={16} /> Trier : Populaires <Icon name="chevd" size={14} />
        </span>
      </div>

      {/* Grille produits */}
      {isLoading ? <LoadingSpinner /> : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
          <p>Aucun produit trouvé</p>
          <button onClick={() => { setSearch(''); setCategory(undefined) }} className="btn btn-ghost btn-sm" style={{ marginTop: 16 }}>Réinitialiser</button>
        </div>
      ) : (
        <div className="lun-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22, paddingBottom: 40 }}>
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingBottom: 64 }}>
          <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="chip" style={{ padding: 10 }}><Icon name="chevl" size={16} /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)} className={`chip ${n === page ? 'chip-active' : ''}`} style={{ minWidth: 40, justifyContent: 'center' }}>{n}</button>
          ))}
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="chip" style={{ padding: 10 }}><Icon name="chevr" size={16} /></button>
        </div>
      )}

      <style>{`
        @media (max-width: 980px) { .lun-cat-page { padding: 0 24px !important; } .lun-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .lun-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
