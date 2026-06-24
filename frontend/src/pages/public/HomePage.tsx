import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import Moon from '@/components/ui/Moon'
import Stars from '@/components/ui/Stars'
import WhatsAppFab from '@/components/ui/WhatsAppFab'
import { productsService } from '@/services/products.service'
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useFavorites } from '@/hooks/useFavorites'
import { clickable } from '@/hooks/useClickable'
import { CATEGORIES, SERVICES, AVATARS } from '@/utils/images'
import type { Product } from '@/types'

gsap.registerPlugin(ScrollTrigger)

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F'

const CATS: [string, string, string][] = [
  ['Chambre romantique', 'Romantique', CATEGORIES.romantique],
  ['Mariage', 'Mariage', CATEGORIES.mariage],
  ['Anniversaire', 'Anniversaire', CATEGORIES.anniversaire],
  ['Saint-Valentin', 'Saint-Valentin', CATEGORIES.valentine],
  ['Baptême', 'Baptême', CATEGORIES.bapteme],
  ['Cérémonies', 'Mariage', CATEGORIES.ceremonie],
]

const STEPS: [string, string, string][] = [
  ['send', 'Décrivez votre projet', 'Date, lieu, budget, inspirations — en 2 minutes via notre formulaire de planification.'],
  ['edit', 'Recevez votre offre', 'Notre équipe revient sous 48h avec une proposition sur mesure et un devis clair.'],
  ['spark', 'On installe, vous profitez', 'Livraison et mise en scène complète par nos soins le jour J. Vous n’avez rien à porter.'],
]

const TESTIMONIALS: [string, string, string, string][] = [
  ['« Notre chambre de lune de miel était à couper le souffle. Installation impeccable. »', 'Aïcha & Romaric', 'Mariage · Calavi', AVATARS[2]],
  ['« Devis en 24h, paiement Moov ultra simple, équipe adorable. Je recommande. »', 'Florine A.', 'Anniversaire · Cotonou', AVATARS[4]],
  ['« La Saint-Valentin de mes rêves. Tout était parfait jusqu\'aux bougies. »', 'Kévin D.', 'Saint-Valentin · Akpakpa', AVATARS[1]],
]

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const isAdmin = user?.role === 'ADMIN'
  const { addProduct } = useCartStore()
  const { isFavorite, toggle } = useFavorites()

  const { data: featured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsService.getFeatured().then((r) => r.data),
  })

  // Animations d'entrée + reveal au scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-anim', { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.2 })

      gsap.utils.toArray<HTMLElement>('.reveal-sec').forEach((el) => {
        gsap.from(el, {
          y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
    })
    return () => ctx.revert()
  }, [featured])

  const feats: Product[] = (featured ?? []).slice(0, 3)

  return (
    <div className="lun-home">
      {/* ═══ HERO dégradé framboise → rose clair ═══ */}
      <div className="lun-hero">
        <div className="glow" style={{ top: -120, right: -80, width: 520, height: 520, background: 'radial-gradient(circle, rgba(239,168,56,.20), transparent 62%)' }} />
        <div className="glow" style={{ bottom: -160, left: -120, width: 540, height: 540, background: 'radial-gradient(circle, rgba(255,45,142,.20), transparent 62%)' }} />

        <div className="container lun-hero-grid">
          <div className="lun-hero-copy">
            <div className="eyebrow hero-anim" style={{ color: 'var(--gold-bright)' }}>Décoration · Cotonou, Bénin</div>
            <h1 className="display hero-anim lun-hero-title">
              Chaque moment<br />mérite sa<br /><em className="it" style={{ color: 'var(--gold-bright)' }}>mise en scène</em>.
            </h1>
            <p className="hero-anim lead lead-light" style={{ marginTop: 28 }}>
              Mariages, anniversaires, chambres romantiques. Nous imaginons, livrons et installons des décorations qui laissent un souvenir.
            </p>
            <div className="hero-anim lun-hero-cta">
              <button onClick={() => navigate('/catalogue')} className="btn btn-primary btn-lg">Explorer la boutique <Icon name="arrow" size={18} color="#fff" /></button>
              <button onClick={() => navigate('/compte/planification')} className="btn btn-lg btn-glass">Demander un devis</button>
            </div>
            <div className="hero-anim lun-hero-badge">
              <Moon size={26} color="var(--gold-bright)" />
              <div>
                <div className="lun-hero-badge-t">Installation incluse</div>
                <div className="lun-hero-badge-s">par notre équipe</div>
              </div>
            </div>
            <div className="hero-anim lun-hero-stats">
              {[['1 200+', 'événements décorés'], ['4.9/5', 'satisfaction client'], ['48h', 'devis & installation']].map(([a, b]) => (
                <div key={b}>
                  <div className="display lun-stat-num">{a}</div>
                  <div className="lun-stat-lbl">{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BANDEAU RÉASSURANCE ═══ */}
      <div className="lun-trust-wrap reveal-sec">
        <div className="bg-paper lun-trust">
          <div className="lun-trust-row">
            {[['truck', 'Livraison & pose incluses'], ['cal', 'Devis sous 48h'], ['shield', 'Paiement Mobile Money sécurisé'], ['heart', '1 200+ clients comblés']].map(([ic, t]) => (
              <div key={t} className="lun-trust-item">
                <Icon name={ic} size={22} color="var(--gold)" /> <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CATÉGORIES ═══ */}
      <div className="bg-ivory section reveal-sec">
        <div className="container">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Par occasion</div>
              <h2 className="display sec-title">Trouvez votre ambiance</h2>
            </div>
            <Link to="/catalogue" className="link-inline">Tout voir <Icon name="arrowsm" size={16} color="var(--coral)" /></Link>
          </div>
          <div className="grid grid-3 lun-cat-grid">
            {CATS.map(([label, occ, img]) => (
              <Link key={label} to={`/catalogue?occasion=${occ}`} className="tile lun-cat-tile">
                <img src={img} alt={label} />
                <div className="tile-overlay"><span className="tile-label">{label}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CRÉATIONS PHARES ═══ */}
      {feats.length > 0 && (
        <div className="bg-ivory section-sm reveal-sec" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 28 }}>Nos créations phares</div>
            <div className="grid grid-3 lun-feat-grid">
              {feats.map((p) => (
                <div key={p._id} {...clickable(() => navigate(`/produit/${p.slug}`), p.name)} className="card lun-feat-card">
                  <div className="lun-feat-media">
                    {p.images?.[0] && <img src={p.images[0]} alt={p.name} />}
                    {!isAdmin && (
                      <button type="button" className="lun-feat-fav" aria-label={isFavorite(p._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        onClick={(e) => { e.stopPropagation(); toggle(p._id) }}>
                        <Icon name="heart" size={14} color="var(--coral)" fill={isFavorite(p._id) ? 'var(--coral)' : 'none'} />
                      </button>
                    )}
                  </div>
                  <div className="lun-feat-body">
                    <div className="lun-feat-head">
                      <div>
                        <div className="serif lun-feat-name">{p.name}</div>
                        <div className="lun-feat-cat">{typeof p.category === 'object' ? p.category?.name : ''}</div>
                      </div>
                      <Stars value={p.ratings?.average ?? 5} size={13} />
                    </div>
                    <div className="lun-feat-foot">
                      <span className="display lun-feat-price">{fmt(p.price)}</span>
                      {!isAdmin && (
                        <button onClick={(e) => { e.stopPropagation(); addProduct(p) }} className="btn btn-primary btn-sm">Ajouter <Icon name="plus" size={15} color="#fff" /></button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ COMMENT ÇA MARCHE ═══ */}
      <div className="bg-ivory-2 section reveal-sec">
        <div className="container">
          <div className="sec-head-center">
            <div className="eyebrow">Simple, du devis au jour J</div>
            <h2 className="display sec-title">Comment ça marche</h2>
          </div>
          <div className="grid grid-3 lun-steps">
            {STEPS.map(([ic, t, d], i) => (
              <div key={t} className="lun-step">
                <span className="lun-step-num">{i + 1}</span>
                <span className="lun-step-ico"><Icon name={ic} size={24} color="var(--coral)" /></span>
                <div className="serif lun-step-title">{t}</div>
                <p className="lun-step-desc">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ BANDE SERVICE SUR MESURE ═══ */}
      <div className="bg-night-2 section reveal-sec">
        <div className="container lun-band-inner">
          <div className="lun-band-img"><img src={SERVICES.mariageJardin} alt="Réalisation grand format" /></div>
          <div className="lun-band-copy">
            <div className="eyebrow" style={{ color: 'var(--gold-bright)' }}>Décoration clé-en-main</div>
            <h2 className="display lun-band-title">Un projet sur mesure&nbsp;? <em className="it" style={{ color: 'var(--gold-bright)' }}>Parlons-en.</em></h2>
            <p className="lead lead-light" style={{ marginTop: 18 }}>
              Décrivez votre événement — date, lieu, budget, inspirations. Notre équipe revient vers vous avec une offre personnalisée sous 48h.
            </p>
            <button onClick={() => navigate('/compte/planification')} className="btn btn-gold btn-lg" style={{ marginTop: 30 }}>
              Lancer ma planification <Icon name="arrow" size={18} color="var(--night)" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ TÉMOIGNAGES ═══ */}
      <div className="bg-ivory section reveal-sec">
        <div className="container">
          <div className="sec-head-center">
            <div className="eyebrow">Elles & ils nous ont fait confiance</div>
            <h2 className="display sec-title">Des souvenirs, pas seulement des décors</h2>
          </div>
          <div className="grid grid-3 lun-testi-grid">
            {TESTIMONIALS.map(([q, who, ev, avatar]) => (
              <div key={who} className="card lun-testi">
                <Stars value={5} size={15} />
                <p className="serif lun-testi-q">{q}</p>
                <div className="lun-testi-who">
                  <img src={avatar} alt={who} className="lun-testi-av" />
                  <div>
                    <div className="lun-testi-name">{who}</div>
                    <div className="lun-testi-ev">{ev}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CTA bandeau ═══ */}
      <div className="bg-coral lun-cta reveal-sec">
        <h2 className="display lun-cta-title">Prête à faire briller votre événement&nbsp;?</h2>
        <div className="lun-cta-actions">
          {isAuthenticated ? (
            <button onClick={() => navigate('/compte/planification')} className="btn btn-lg" style={{ background: '#fff', color: 'var(--coral)' }}>Planifier un événement</button>
          ) : (
            <button onClick={() => navigate('/inscription')} className="btn btn-lg" style={{ background: '#fff', color: 'var(--coral)' }}>Créer mon compte</button>
          )}
          <button onClick={() => navigate('/catalogue')} className="btn btn-lg btn-glass">Parcourir la boutique</button>
        </div>
      </div>

      {/* Bouton WhatsApp flottant */}
      <WhatsAppFab />
    </div>
  )
}
