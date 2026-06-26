import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { productsService } from '@/services/products.service'
import type { Category, Product } from '@/types'
import { clickable } from '@/hooks/useClickable'

interface GalleryItem {
  src: string
  cat: string
  occasion: string
  categoryId: string
}

export default function GaleriePage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('Toutes')
  const [lightbox, setLightbox] = useState<number | null>(null)

  // Catégories réelles → filtres de la galerie
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories').then((r) => r.data),
  })

  // Produits (avec images) → vignettes de la galerie
  const { data: productsData } = useQuery({
    queryKey: ['gallery-products'],
    queryFn: () => productsService.getAll({ limit: 200 }).then((r) => r.data),
  })

  // Construit les vignettes à partir des produits qui ont une image
  const gallery: GalleryItem[] = useMemo(() => {
    const products: Product[] = productsData?.data ?? []
    return products
      .filter((p) => p.images?.[0])
      .map((p) => {
        const cat = typeof p.category === 'object' ? p.category : undefined
        return {
          src: p.images[0],
          cat: p.name,
          occasion: cat?.name ?? '',
          categoryId: cat?._id ?? '',
        }
      })
  }, [productsData])

  // Fermeture de la lightbox au clavier (Échap) — règle a11y "escape-routes"
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const filtered = filter === 'Toutes' ? gallery : gallery.filter((g) => g.occasion === filter)

  return (
    <div>
      {/* Hero */}
      <div className="lun-gal-hero">
        <div className="glow" style={{ bottom: -120, left: -80, width: 460, height: 460, background: 'radial-gradient(circle, rgba(255,45,142,.20), transparent 62%)' }} />
        <div className="container lun-gal-hero-inner">
          <div className="eyebrow" style={{ color: 'var(--gold-bright)' }}>Nos réalisations</div>
          <h1 className="display lun-gal-h1">Galerie</h1>
          <p className="lun-gal-sub">
            Chaque photo raconte une histoire. Découvrez nos décorations pour vous inspirer.
          </p>
        </div>
      </div>

      {/* Filtres + grille */}
      <div className="bg-ivory section-sm">
        <div className="container">
          <div className="lun-gal-filters">
            <span className={`chip ${filter === 'Toutes' ? 'chip-active' : ''}`} onClick={() => { setFilter('Toutes'); setLightbox(null) }}>Toutes</span>
            {categories?.map((c) => (
              <span key={c._id} className={`chip ${filter === c.name ? 'chip-active' : ''}`} onClick={() => { setFilter(c.name); setLightbox(null) }}>{c.name}</span>
            ))}
          </div>

          <div className="lun-masonry">
            {filtered.map((item, i) => (
              <div key={`${filter}-${i}`} {...clickable(() => setLightbox(i), `Agrandir : ${item.occasion} ${item.cat}`)} className="lun-gal-item">
                <img src={item.src} alt={item.cat} />
                <div className="lun-gal-overlay">
                  <span className="lun-gal-zoom"><Icon name="search" size={16} color="#fff" /></span>
                  <div className="lun-gal-text">
                    {item.occasion && <span className="lun-gal-occ">{item.occasion}</span>}
                    <div className="serif lun-gal-cat">{item.cat}</div>
                    <span className="lun-gal-view">Cliquer pour agrandir</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-coral lun-gal-cta">
        <h2 className="display lun-gal-cta-title">Votre prochain souvenir ici&nbsp;?</h2>
        <button onClick={() => navigate('/compte/planification')} className="btn btn-lg" style={{ background: '#fff', color: 'var(--coral)', marginTop: 24 }}>
          Planifier ma décoration <Icon name="arrow" size={18} color="var(--coral)" />
        </button>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} className="lun-lightbox" role="dialog" aria-modal="true" aria-label="Aperçu de la réalisation">
          <button onClick={() => setLightbox(null)} className="lun-lb-btn lun-lb-close">
            <Icon name="close" size={18} color="#fff" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + filtered.length) % filtered.length) }} className="lun-lb-btn lun-lb-prev">
            <Icon name="chevl" size={20} color="#fff" />
          </button>
          <img src={filtered[lightbox].src} alt="" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % filtered.length) }} className="lun-lb-btn lun-lb-next">
            <Icon name="chevr" size={20} color="#fff" />
          </button>
        </div>
      )}
    </div>
  )
}
