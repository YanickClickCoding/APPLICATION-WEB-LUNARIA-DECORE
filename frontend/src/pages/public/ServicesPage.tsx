import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import Stars from '@/components/ui/Stars'
import api from '@/services/api'
import type { DecorationService } from '@/types'
import { SERVICES as SERVICE_IMG } from '@/utils/images'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F'

const STEPS: [string, string][] = [
  ['Décrivez votre vision', 'Type d\'événement, date, lieu, budget et inspirations.'],
  ['Recevez votre devis', 'Une proposition personnalisée sous 48h.'],
  ['Validez & réglez l\'acompte', 'Paiement sécurisé via MTN MoMo ou Moov Money.'],
  ['On s\'occupe de tout', 'Notre équipe installe le jour J. Vous profitez.'],
]

export default function ServicesPage() {
  const navigate = useNavigate()
  const { data: services, isLoading } = useQuery<DecorationService[]>({
    queryKey: ['services'],
    queryFn: () => api.get<DecorationService[]>('/services').then((r) => r.data),
  })

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'var(--surface-dark)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -60, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,168,56,.18), transparent 62%)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 56px', position: 'relative' }} className="lun-pad">
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>Décoration clé-en-main</div>
          <h1 className="display lun-h1" style={{ fontSize: 64, margin: '14px 0 0', lineHeight: 1.02, maxWidth: 720 }}>
            Nous imaginons,<br /><em className="it" style={{ color: 'var(--gold)' }}>vous célébrez.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,.72)', maxWidth: 520, marginTop: 22, lineHeight: 1.7 }}>
            De la chambre romantique au mariage grandiose, nos prestations sur mesure transforment vos espaces en souvenirs inoubliables.
          </p>
          <button onClick={() => navigate('/compte/planification')} className="btn btn-gold btn-lg" style={{ marginTop: 32 }}>
            Lancer ma planification <Icon name="arrow" size={18} color="var(--night)" />
          </button>
        </div>
      </div>

      {/* Prestations */}
      <div style={{ background: 'var(--ivory)', padding: '64px 56px' }} className="lun-pad">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="eyebrow">Nos offres</div>
          <h2 className="display" style={{ fontSize: 44, margin: '12px 0 32px' }}>Prestations de décoration</h2>

          {isLoading ? <LoadingSpinner /> : !services?.length ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>Les services arrivent bientôt.</p>
          ) : (
            <div className="lun-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {services.map((s, i) => (
                <div key={s._id} onClick={() => navigate(`/service/${s.slug}`)} className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh-sm)', cursor: 'pointer' }}>
                  <div style={{ height: 240, background: 'var(--ivory-2)', position: 'relative' }}>
                    {(s.images?.[0] ?? Object.values(SERVICE_IMG)[i]) &&
                      <img src={s.images?.[0] ?? Object.values(SERVICE_IMG)[i % 10]} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    {s.isFeatured && <span style={{ position: 'absolute', top: 14, left: 14, background: 'var(--gold)', color: 'var(--night)', padding: '5px 12px', borderRadius: 'var(--r-pill)', fontSize: 11, fontWeight: 700 }}>Populaire</span>}
                  </div>
                  <div style={{ padding: '20px 22px 24px' }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{typeof s.category === 'object' ? s.category?.name : ''}</div>
                    <div className="serif" style={{ fontSize: 24, fontWeight: 600, marginTop: 3 }}>{s.name}</div>
                    <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8, lineHeight: 1.6, minHeight: 44 }}>{s.shortDescription}</p>
                    {s.includes?.slice(0, 3).map((inc) => (
                      <div key={inc} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>
                        <Icon name="check" size={13} color="var(--coral)" /> {inc}
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line-2)' }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.priceNote ?? 'À partir de'}</div>
                        <div className="display" style={{ fontSize: 24 }}>{fmt(s.basePrice)}</div>
                      </div>
                      <Stars value={s.ratings?.average ?? 5} size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment ça marche */}
      <div style={{ background: 'var(--paper)', padding: '72px 56px', borderTop: '1px solid var(--line-2)' }} className="lun-pad">
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <div className="eyebrow">Simple & rapide</div>
          <h2 className="display" style={{ fontSize: 44, margin: '12px 0 44px' }}>Comment ça marche&nbsp;?</h2>
          <div className="lun-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, textAlign: 'left' }}>
            {STEPS.map(([t, d], i) => (
              <div key={t}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--coral-soft)', color: 'var(--coral-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="serif" style={{ fontSize: 20, fontWeight: 600 }}>{t}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6, lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/compte/planification')} className="btn btn-primary btn-lg" style={{ marginTop: 44 }}>
            Commencer maintenant <Icon name="arrow" size={18} color="#fff" />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .lun-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .lun-h1 { font-size: 44px !important; }
          .lun-grid3 { grid-template-columns: 1fr 1fr !important; }
          .lun-grid4 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .lun-grid3, .lun-grid4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
