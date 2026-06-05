import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import Stars from '@/components/ui/Stars'
import api from '@/services/api'
import type { DecorationService } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const fmt = (n: number) => n.toLocaleString('fr-FR')

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const { data: service, isLoading } = useQuery<DecorationService>({
    queryKey: ['service', slug],
    queryFn: () => api.get<DecorationService>(`/services/slug/${slug}`).then((r) => r.data),
    enabled: !!slug,
  })

  if (isLoading) return <LoadingSpinner fullScreen />
  if (!service) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Service introuvable · <Link to="/services" style={{ color: 'var(--coral)' }}>Retour</Link></p>
    </div>
  )

  const cat = typeof service.category === 'object' ? service.category?.name : ''

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }} className="lun-svc">
      <div style={{ padding: '24px 56px 0', fontSize: 13, color: 'var(--muted)' }}>
        <Link to="/services" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Décorations</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{service.name}</span>
      </div>

      <div className="lun-svc-grid" style={{ display: 'flex', gap: 48, padding: '28px 56px 56px' }}>
        {/* Galerie */}
        <div style={{ flex: 1.1 }}>
          <div style={{ height: 460, borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--ivory-2)' }}>
            {service.images?.[0] && <img src={service.images[0]} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          {service.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
              {service.images.slice(1, 4).map((img, i) => (
                <div key={i} style={{ flex: 1, height: 110, borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--ivory-2)' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div style={{ flex: 1 }}>
          <div className="eyebrow">{cat}</div>
          <h1 className="display" style={{ fontSize: 48, margin: '12px 0 0', lineHeight: 1.02 }}>{service.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
            <Stars value={service.ratings?.average ?? 5} size={15} />
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{service.ratings?.count ?? 0} avis</span>
          </div>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginTop: 20 }}>{service.description}</p>

          {service.includes?.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 12 }}>Inclus dans la prestation</div>
              {service.includes.map((inc) => (
                <div key={inc} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, marginBottom: 8 }}>
                  <Icon name="check" size={16} color="var(--coral)" /> {inc}
                </div>
              ))}
            </div>
          )}

          {service.options?.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 12 }}>Options en supplément</div>
              {service.options.map((opt) => (
                <div key={opt.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, color: 'var(--muted)' }}>
                  <span>+ {opt.name}</span><span style={{ fontWeight: 600, color: 'var(--ink)' }}>{fmt(opt.price)} F</span>
                </div>
              ))}
            </div>
          )}

          <div className="display" style={{ fontSize: 38, margin: '28px 0 4px' }}>
            {service.priceNote ?? 'À partir de'} <span style={{ color: 'var(--coral)' }}>{fmt(service.basePrice)} F</span>
          </div>
          {service.duration && <div style={{ fontSize: 13, color: 'var(--muted)' }}><Icon name="cal" size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{service.duration}</div>}

          <button onClick={() => navigate('/compte/planification')} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 24 }}>
            Réserver cette prestation <Icon name="arrow" size={18} color="#fff" />
          </button>
          <Link to="/services" style={{ display: 'block', textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 14, textDecoration: 'none' }}>
            Voir toutes les prestations
          </Link>
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .lun-svc-grid { flex-direction: column !important; padding: 24px !important; } .lun-svc > div:first-child { padding: 20px 24px 0 !important; } }`}</style>
    </div>
  )
}
