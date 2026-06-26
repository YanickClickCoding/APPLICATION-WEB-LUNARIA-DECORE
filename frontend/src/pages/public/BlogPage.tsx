import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'

// TODO: brancher de vrais articles (titre, image, extrait, contenu) quand le
// contenu sera fourni. Page volontairement en "bientôt disponible" pour l'instant.

export default function BlogPage() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <div className="lun-gal-hero">
        <div className="glow" style={{ bottom: -120, left: -80, width: 460, height: 460, background: 'radial-gradient(circle, rgba(255,45,142,.20), transparent 62%)' }} />
        <div className="container lun-gal-hero-inner">
          <div className="eyebrow" style={{ color: 'var(--gold-bright)' }}>Inspirations &amp; conseils</div>
          <h1 className="display lun-gal-h1">Le Blog</h1>
          <p className="lun-gal-sub">
            Idées déco, tendances et coulisses de nos plus belles réalisations.
          </p>
        </div>
      </div>

      {/* Bientôt */}
      <div className="bg-ivory section">
        <div className="container-tight">
          <div className="card" style={{ padding: 56, textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
            <span style={{ display: 'inline-flex', width: 64, height: 64, borderRadius: '50%', background: 'var(--coral-soft)', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <Icon name="edit" size={26} color="var(--coral)" />
            </span>
            <h2 className="serif" style={{ fontSize: 26, fontWeight: 600, marginBottom: 10 }}>Bientôt disponible</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
              Nous préparons des articles pleins d’idées pour sublimer vos événements :
              palettes de couleurs, thèmes de saison, et nos conseils d’experts.
              En attendant, explorez nos réalisations et notre boutique.
            </p>
            <div className="lun-cta-actions" style={{ marginTop: 0 }}>
              <button onClick={() => navigate('/galerie')} className="btn btn-primary">Voir nos réalisations <Icon name="arrow" size={16} color="#fff" /></button>
              <button onClick={() => navigate('/catalogue')} className="btn btn-ghost">Parcourir la boutique</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
