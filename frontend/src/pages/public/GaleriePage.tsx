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
      <div style={{ background: 'var(--night)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -120, left: -80, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,69,96,.18), transparent 62%)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 56px', position: 'relative', textAlign: 'center' }} className="lun-pad">
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>Nos réalisations</div>
          <h1 className="display" style={{ fontSize: 60, margin: '14px 0 0' }}>Galerie</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,.7)', maxWidth: 520, margin: '14px auto 0', lineHeight: 1.7 }}>
            Chaque photo raconte une histoire. Découvrez nos décorations pour vous inspirer.
          </p>
        </div>
      </div>

      {/* Filtres + grille */}
      <div style={{ background: 'var(--ivory)', padding: '40px 56px 72px' }} className="lun-pad">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {FILTERS.map((f) => (
              <span key={f} className={`chip ${filter === f ? 'chip-active' : ''}`} onClick={() => setFilter(f)}>{f}</span>
            ))}
          </div>

          <div className="lun-masonry" style={{ columnCount: 4, columnGap: 16 }}>
            {filtered.map((item, i) => (
              <div key={`${filter}-${i}`} onClick={() => setLightbox(i)}
                style={{ breakInside: 'avoid', marginBottom: 16, borderRadius: 'var(--r-md)', overflow: 'hidden', cursor: 'zoom-in', position: 'relative' }}
                className="lun-gal-item">
                <img src={item.src} alt={item.cat} style={{ width: '100%', display: 'block' }} />
                <div className="lun-gal-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,46,.78), transparent 55%)', opacity: 0, transition: 'opacity .3s', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 16 }}>
                  <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>{item.occasion}</span>
                  <span className="serif" style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>{item.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'var(--coral)', color: '#fff', padding: '56px 24px', textAlign: 'center' }}>
        <h2 className="display" style={{ fontSize: 40, margin: 0 }}>Votre prochain souvenir ici&nbsp;?</h2>
        <button onClick={() => navigate('/compte/planification')} className="btn btn-lg" style={{ background: '#fff', color: 'var(--coral)', marginTop: 24 }}>
          Planifier ma décoration <Icon name="arrow" size={18} color="var(--coral)" />
        </button>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,46,.92)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="close" size={18} color="#fff" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + filtered.length) % filtered.length) }}
            style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="chevl" size={20} color="#fff" />
          </button>
          <img src={filtered[lightbox].src} alt="" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90%', maxHeight: '85vh', objectFit: 'contain', borderRadius: 'var(--r-md)' }} />
          <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % filtered.length) }}
            style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="chevr" size={20} color="#fff" />
          </button>
        </div>
      )}

      <style>{`
        .lun-gal-item:hover .lun-gal-overlay { opacity: 1 !important; }
        @media (max-width: 980px) { .lun-pad { padding-left: 24px !important; padding-right: 24px !important; } .lun-masonry { column-count: 2 !important; } }
        @media (max-width: 560px) { .lun-masonry { column-count: 1 !important; } }
      `}</style>
    </div>
  )
}
