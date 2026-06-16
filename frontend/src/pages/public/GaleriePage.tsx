import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { GALLERY } from '@/utils/images'

const FILTERS = ['Toutes', 'Saint-Valentin', 'Mariage', 'Anniversaire', 'Fête des mères', 'Baptême', 'Lune de miel']

export default function GaleriePage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('Toutes')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered = filter === 'Toutes' ? GALLERY : GALLERY.filter((g) => g.occasion === filter)

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
            {FILTERS.map((f) => (
              <span key={f} className={`chip ${filter === f ? 'chip-active' : ''}`} onClick={() => setFilter(f)}>{f}</span>
            ))}
          </div>

          <div className="lun-masonry">
            {filtered.map((item, i) => (
              <div key={`${filter}-${i}`} onClick={() => setLightbox(i)} className="lun-gal-item">
                <img src={item.src} alt={item.cat} />
                <div className="lun-gal-overlay">
                  <span className="lun-gal-occ">{item.occasion}</span>
                  <span className="serif lun-gal-cat">{item.cat}</span>
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
        <div onClick={() => setLightbox(null)} className="lun-lightbox">
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
