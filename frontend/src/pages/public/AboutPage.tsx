import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { SERVICES } from '@/utils/images'
import { CONTACT } from '@/utils/contact'

const VALUES: [string, string, string][] = [
  ['spark', 'Le souci du détail', 'Chaque bougie, chaque fleur, chaque lumière est placée avec soin. Le diable — et la magie — sont dans les détails.'],
  ['heart', 'L’émotion d’abord', 'Nous ne vendons pas des objets, nous créons des souvenirs. Votre émotion le jour J est notre vraie réussite.'],
  ['truck', 'Clé en main', 'Conception, livraison, installation et démontage. Vous profitez de votre événement, nous gérons le reste.'],
  ['shield', 'La confiance', 'Devis transparent, paiement Mobile Money sécurisé, équipe à votre écoute du premier message au jour J.'],
]

const STATS: [string, string][] = [
  ['2019', 'année de création'],
  ['1 200+', 'événements décorés'],
  ['4.9/5', 'satisfaction client'],
  ['100%', 'à Cotonou & alentours'],
]

const FAQ: [string, string][] = [
  ['Dans quelles zones intervenez-vous ?', 'Nous livrons et installons à Cotonou et ses environs : Calavi, Akpakpa, Fidjrossè, et au-delà sur demande. Précisez votre lieu dans le formulaire de planification pour un devis exact.'],
  ['Comment se passe la livraison et le retrait ?', 'Notre équipe livre, installe entièrement le décor avant votre événement, puis revient assurer le démontage et le retrait du matériel. La pose et le retrait sont inclus dans nos prestations.'],
  ['Quels moyens de paiement acceptez-vous ?', 'Nous acceptons MTN MoMo et Moov Money. Le paiement est sécurisé et confirmé en temps réel. Un acompte peut être demandé pour valider la réservation.'],
  ['Combien de temps à l’avance faut-il réserver ?', 'Idéalement 1 à 2 semaines avant l’événement pour les grandes prestations. Pour les demandes urgentes, contactez-nous : nous faisons notre maximum, devis sous 48h.'],
  ['Proposez-vous des décorations sur mesure ?', 'Oui, c’est notre cœur de métier. Décrivez votre thème, vos couleurs et votre budget via la planification : nous concevons une proposition personnalisée.'],
]

export default function AboutPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div>
      {/* Hero */}
      <div className="lun-gal-hero">
        <div className="glow" style={{ bottom: -120, left: -80, width: 460, height: 460, background: 'radial-gradient(circle, rgba(255,45,142,.20), transparent 62%)' }} />
        <div className="container lun-gal-hero-inner">
          <div className="eyebrow" style={{ color: 'var(--gold-bright)' }}>Qui sommes-nous</div>
          <h1 className="display lun-gal-h1">L’art de sublimer vos moments</h1>
          <p className="lun-gal-sub">
            LUNARIA Décoration imagine, livre et installe des décorations romantiques et festives à Cotonou. Notre mission&nbsp;: transformer vos événements en souvenirs inoubliables.
          </p>
        </div>
      </div>

      {/* Notre histoire */}
      <div className="bg-ivory section">
        <div className="container lun-about-story">
          <div className="lun-about-story-img"><img src={SERVICES.chambreRomantique} alt="Une réalisation LUNARIA" /></div>
          <div className="lun-about-story-copy">
            <div className="eyebrow">Notre histoire</div>
            <h2 className="display sec-title">Née d’une passion pour la beauté des instants</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              Tout a commencé par une conviction simple&nbsp;: un moment bien décoré reste gravé pour toujours. Depuis 2019, nous accompagnons les familles et les couples du Bénin pour donner vie à leurs plus belles célébrations.
            </p>
            <p className="lead" style={{ marginTop: 14 }}>
              Mariages, anniversaires, baptêmes, chambres romantiques&nbsp;: chaque projet est unique, et nous le traitons comme tel — avec créativité, rigueur et une vraie écoute.
            </p>
            <button onClick={() => navigate('/galerie')} className="btn btn-ghost btn-lg" style={{ marginTop: 26 }}>
              Voir nos réalisations <Icon name="arrowsm" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Chiffres */}
      <div className="bg-ivory-2 section-sm">
        <div className="container lun-about-stats">
          {STATS.map(([n, l]) => (
            <div key={l} className="lun-about-stat">
              <div className="display lun-about-stat-num">{n}</div>
              <div className="lun-about-stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Valeurs */}
      <div className="bg-ivory section">
        <div className="container">
          <div className="sec-head-center">
            <div className="eyebrow">Ce qui nous guide</div>
            <h2 className="display sec-title">Nos valeurs</h2>
          </div>
          <div className="grid grid-4 lun-about-values">
            {VALUES.map(([ic, t, d]) => (
              <div key={t} className="lun-about-value">
                <span className="lun-step-ico"><Icon name={ic} size={24} color="var(--coral)" /></span>
                <div className="serif lun-step-title">{t}</div>
                <p className="lun-step-desc">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ — livraison, retrait, paiement */}
      <div className="bg-ivory-2 section">
        <div className="container-tight">
          <div className="sec-head-center">
            <div className="eyebrow">Livraison · Paiement · Pratique</div>
            <h2 className="display sec-title">Questions fréquentes</h2>
          </div>
          <div className="lun-faq">
            {FAQ.map(([q, a], i) => (
              <div key={q} className={`lun-faq-item ${openFaq === i ? 'is-open' : ''}`}>
                <button className="lun-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{q}</span>
                  <Icon name="chevd" size={18} color="var(--coral)" />
                </button>
                {openFaq === i && <p className="lun-faq-a">{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact + carte */}
      <div className="bg-ivory section">
        <div className="container">
          <div className="sec-head-center">
            <div className="eyebrow">Où nous trouver</div>
            <h2 className="display sec-title">Contact &amp; localisation</h2>
          </div>
          <div className="lun-contact">
            {/* Infos */}
            <div className="lun-contact-info">
              <div className="lun-contact-row">
                <span className="lun-contact-ico"><Icon name="pin" size={20} color="var(--coral)" /></span>
                <div>
                  <div className="lun-contact-label">Adresse</div>
                  <div>{CONTACT.address}</div>
                  <div className="lun-contact-sub">Zone de service : {CONTACT.serviceArea}</div>
                </div>
              </div>
              <div className="lun-contact-row">
                <span className="lun-contact-ico"><Icon name="phone" size={20} color="var(--coral)" /></span>
                <div>
                  <div className="lun-contact-label">Téléphone</div>
                  {CONTACT.phones.map((p) => (
                    <div key={p}><a href={`tel:${p.replace(/\s/g, '')}`} className="lun-contact-link">{p}</a></div>
                  ))}
                </div>
              </div>
              <div className="lun-contact-row">
                <span className="lun-contact-ico"><Icon name="mail" size={20} color="var(--coral)" /></span>
                <div>
                  <div className="lun-contact-label">Email</div>
                  <a href={`mailto:${CONTACT.email}`} className="lun-contact-link">{CONTACT.email}</a>
                </div>
              </div>
              <div className="lun-contact-socials">
                <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="lun-social lun-social-wa" aria-label="WhatsApp">
                  <Icon name="whatsapp" size={20} color="#fff" /> WhatsApp
                </a>
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="lun-social lun-social-fb" aria-label="Facebook">
                  <Icon name="facebook" size={20} color="#fff" /> Facebook
                </a>
                <a href={CONTACT.tiktok} target="_blank" rel="noopener noreferrer" className="lun-social lun-social-tt" aria-label="TikTok">
                  <Icon name="tiktok" size={20} color="#fff" /> TikTok
                </a>
              </div>
            </div>

            {/* Carte */}
            <div className="lun-contact-map">
              <iframe
                src={CONTACT.mapsEmbed}
                title="Localisation LUNARIA Décoration"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-coral lun-cta">
        <h2 className="display lun-cta-title">Parlons de votre prochain événement</h2>
        <div className="lun-cta-actions">
          <button onClick={() => navigate('/compte/planification')} className="btn btn-lg" style={{ background: '#fff', color: 'var(--coral)' }}>Demander un devis</button>
          <button onClick={() => navigate('/catalogue')} className="btn btn-lg btn-glass">Parcourir la boutique</button>
        </div>
      </div>
    </div>
  )
}
