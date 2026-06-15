import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import Moon from '@/components/ui/Moon'
import Stars from '@/components/ui/Stars'
import { productsService } from '@/services/products.service'
import { useCartStore } from '@/stores/useCartStore'
import { HERO, CATEGORIES, SERVICES, GALLERY, AVATARS } from '@/utils/images'
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

const TESTIMONIALS: [string, string, string, string][] = [
  ['« Notre chambre de lune de miel était à couper le souffle. Installation impeccable. »', 'Aïcha & Romaric', 'Mariage · Calavi', AVATARS[2]],
  ['« Devis en 24h, paiement Moov ultra simple, équipe adorable. Je recommande. »', 'Florine A.', 'Anniversaire · Cotonou', AVATARS[4]],
  ['« La Saint-Valentin de mes rêves. Tout était parfait jusqu\'aux bougies. »', 'Kévin D.', 'Saint-Valentin · Akpakpa', AVATARS[1]],
]

export default function HomePage() {
  const navigate = useNavigate()
  const { addProduct } = useCartStore()
  const heroRef = useRef<HTMLDivElement>(null)
  const layersRef = useRef<HTMLDivElement>(null)

  const { data: featured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsService.getFeatured().then((r) => r.data),
  })

  // Animations d'entrée + parallaxe au scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-anim', { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.2 })

      // Parallaxe sur les couches d'images du hero
      const layers = gsap.utils.toArray<HTMLElement>('.hero-layer')
      layers.forEach((layer, i) => {
        gsap.to(layer, {
          y: (i + 1) * -40, ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })

      // Reveal des sections
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
      {/* ═══ HERO sombre immersif ═══ */}
      <div ref={heroRef} style={{ position: 'relative', background: 'var(--night)', color: '#fff', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -120, right: -80, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,168,56,.20), transparent 62%)' }} />
        <div style={{ position: 'absolute', bottom: -160, left: -120, width: 540, height: 540, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,.18), transparent 62%)' }} />

        <div className="lun-hero-grid" style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '140px 56px 90px', display: 'flex', gap: 40, alignItems: 'center' }}>
          <div style={{ flex: 1.05 }}>
            <div className="eyebrow hero-anim" style={{ color: 'var(--gold)' }}>Décoration · Cotonou, Bénin</div>
            <h1 className="display hero-anim lun-hero-title" style={{ fontSize: 88, lineHeight: 0.98, margin: '20px 0 0', fontWeight: 500 }}>
              Chaque moment<br />mérite sa<br /><em className="it" style={{ color: 'var(--gold)' }}>mise en scène</em>.
            </h1>
            <p className="hero-anim" style={{ fontSize: 18, color: 'rgba(255,255,255,.72)', maxWidth: 440, marginTop: 28, lineHeight: 1.7 }}>
              Mariages, anniversaires, chambres romantiques. Nous imaginons, livrons et installons des décorations qui laissent un souvenir.
            </p>
            <div className="hero-anim" style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/catalogue')} className="btn btn-primary btn-lg">Explorer la boutique <Icon name="arrow" size={18} color="#fff" /></button>
              <button onClick={() => navigate('/compte/planification')} className="btn btn-lg" style={{ background: 'rgba(255,255,255,.1)', color: '#fff' }}>Demander un devis</button>
            </div>
            <div className="hero-anim" style={{ display: 'flex', gap: 36, marginTop: 48, flexWrap: 'wrap' }}>
              {[['1 200+', 'événements décorés'], ['4.9/5', 'satisfaction client'], ['48h', 'devis & installation']].map(([a, b]) => (
                <div key={b}>
                  <div className="display" style={{ fontSize: 34, color: '#fff' }}>{a}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>{b}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Composition d'images en couches (parallaxe) */}
          <div ref={layersRef} className="lun-hero-imgs" style={{ flex: 1, position: 'relative', height: 540 }}>
            <div className="hero-layer" style={{ position: 'absolute', top: 20, right: 0, width: 360, height: 460, borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--sh-lg)' }}>
              <img src={HERO.main} alt="Décor signature" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="hero-layer" style={{ position: 'absolute', top: 0, left: 0, width: 210, height: 250, borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--sh-lg)' }}>
              <img src={CATEGORIES.meres} alt="Détail floral" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="hero-layer" style={{ position: 'absolute', bottom: 0, left: 30, width: 230, height: 200, borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--sh-lg)' }}>
              <img src={HERO.sparkle} alt="Bougies" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: 40, right: 24, background: '#fff', color: 'var(--ink)', borderRadius: 'var(--r-md)', padding: '14px 18px', boxShadow: 'var(--sh-lg)', display: 'flex', alignItems: 'center', gap: 12, zIndex: 2 }}>
              <Moon size={26} color="var(--coral)" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Installation incluse</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>par notre équipe</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CATÉGORIES ═══ */}
      <div style={{ background: 'var(--ivory)', padding: '64px 56px' }} className="lun-sec reveal-sec">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, gap: 16 }}>
            <div>
              <div className="eyebrow">Par occasion</div>
              <h2 className="display" style={{ fontSize: 44, margin: '12px 0 0' }}>Trouvez votre ambiance</h2>
            </div>
            <Link to="/catalogue" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--coral)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Tout voir <Icon name="arrowsm" size={16} color="var(--coral)" /></Link>
          </div>
          <div className="lun-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {CATS.map(([label, occ, img]) => (
              <Link key={label} to={`/catalogue?occasion=${occ}`}
                style={{ height: 180, borderRadius: 'var(--r-lg)', cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'block' }}>
                <img src={img} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 22, background: 'linear-gradient(to top, rgba(43,20,36,.72), transparent 60%)' }}>
                  <span className="serif" style={{ color: '#fff', fontSize: 26, fontWeight: 600 }}>{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CRÉATIONS PHARES ═══ */}
      {feats.length > 0 && (
        <div style={{ background: 'var(--ivory)', padding: '20px 56px 72px' }} className="lun-sec reveal-sec">
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 28 }}>Nos créations phares</div>
            <div className="lun-feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {feats.map((p) => (
                <div key={p._id} onClick={() => navigate(`/produit/${p.slug}`)} className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh-sm)', cursor: 'pointer' }}>
                  <div style={{ height: 300, position: 'relative', background: 'var(--ivory-2)' }}>
                    {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    <span style={{ position: 'absolute', top: 14, left: 14, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="heart" size={14} color="var(--coral)" />
                    </span>
                  </div>
                  <div style={{ padding: '20px 22px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="serif" style={{ fontSize: 24, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{typeof p.category === 'object' ? p.category?.name : ''}</div>
                      </div>
                      <Stars value={p.ratings?.average ?? 5} size={13} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                      <span className="display" style={{ fontSize: 26 }}>{fmt(p.price)}</span>
                      <button onClick={(e) => { e.stopPropagation(); addProduct(p) }} className="btn btn-primary btn-sm">Ajouter <Icon name="plus" size={15} color="#fff" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ BANDE SERVICE SUR MESURE ═══ */}
      <div className="lun-band reveal-sec" style={{ background: 'var(--night-2)', color: '#fff', padding: '68px 56px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 56, alignItems: 'center' }} className="lun-band-inner">
          <div style={{ flex: 1, height: 320, borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            <img src={SERVICES.mariageJardin} alt="Réalisation grand format" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>Décoration clé-en-main</div>
            <h2 className="display" style={{ fontSize: 46, margin: '14px 0 0', lineHeight: 1.05 }}>Un projet sur mesure&nbsp;? <em className="it" style={{ color: 'var(--gold)' }}>Parlons-en.</em></h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.7)', marginTop: 18, lineHeight: 1.7, maxWidth: 440 }}>
              Décrivez votre événement — date, lieu, budget, inspirations. Notre équipe revient vers vous avec une offre personnalisée sous 48h.
            </p>
            <button onClick={() => navigate('/compte/planification')} className="btn btn-gold btn-lg" style={{ marginTop: 30 }}>
              Lancer ma planification <Icon name="arrow" size={18} color="var(--night)" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ TÉMOIGNAGES ═══ */}
      <div style={{ background: 'var(--ivory)', padding: '72px 56px' }} className="lun-sec reveal-sec">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div className="eyebrow">Elles & ils nous ont fait confiance</div>
            <h2 className="display" style={{ fontSize: 44, margin: '12px 0 0' }}>Des souvenirs, pas seulement des décors</h2>
          </div>
          <div className="lun-testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {TESTIMONIALS.map(([q, who, ev, avatar]) => (
              <div key={who} className="card" style={{ padding: '28px 26px', boxShadow: 'var(--sh-sm)' }}>
                <Stars value={5} size={15} />
                <p className="serif" style={{ fontSize: 21, lineHeight: 1.4, margin: '16px 0 22px', fontWeight: 500 }}>{q}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={avatar} alt={who} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{who}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{ev}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CTA bandeau ═══ */}
      <div style={{ background: 'var(--coral)', color: '#fff', padding: '60px 56px', textAlign: 'center' }} className="reveal-sec">
        <h2 className="display lun-cta-title" style={{ fontSize: 50, margin: 0 }}>Prête à faire briller votre événement&nbsp;?</h2>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/inscription')} className="btn btn-lg" style={{ background: '#fff', color: 'var(--coral)' }}>Créer mon compte</button>
          <button onClick={() => navigate('/catalogue')} className="btn btn-lg" style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }}>Parcourir la boutique</button>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .lun-hero-grid { flex-direction: column !important; padding: 120px 24px 60px !important; gap: 48px !important; }
          .lun-hero-title { font-size: 56px !important; }
          .lun-hero-imgs { width: 100%; height: 420px !important; }
          .lun-cat-grid, .lun-feat-grid, .lun-testi-grid { grid-template-columns: 1fr 1fr !important; }
          .lun-band-inner { flex-direction: column !important; }
          .lun-sec, .lun-band { padding-left: 24px !important; padding-right: 24px !important; }
          .lun-cta-title { font-size: 34px !important; }
        }
        @media (max-width: 600px) {
          .lun-cat-grid, .lun-feat-grid, .lun-testi-grid { grid-template-columns: 1fr !important; }
          .lun-hero-title { font-size: 44px !important; }
        }
      `}</style>
    </div>
  )
}
