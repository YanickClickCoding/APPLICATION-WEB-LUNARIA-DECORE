import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { CONTACT } from '@/utils/contact'

export default function ContactPage() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <div className="lun-gal-hero">
        <div className="glow" style={{ bottom: -120, left: -80, width: 460, height: 460, background: 'radial-gradient(circle, rgba(255,45,142,.20), transparent 62%)' }} />
        <div className="container lun-gal-hero-inner">
          <div className="eyebrow" style={{ color: 'var(--gold-bright)' }}>Parlons de votre événement</div>
          <h1 className="display lun-gal-h1">Contact</h1>
          <p className="lun-gal-sub">
            Une question, un projet ? Notre équipe vous répond rapidement, du premier message au jour&nbsp;J.
          </p>
        </div>
      </div>

      {/* Coordonnées + carte */}
      <div className="bg-ivory section">
        <div className="container">
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
              <div className="lun-contact-row">
                <span className="lun-contact-ico"><Icon name="cart" size={20} color="var(--coral)" /></span>
                <div>
                  <div className="lun-contact-label">Paiement</div>
                  <div>MTN MoMo · Moov Money — sécurisé et confirmé en temps réel.</div>
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

              <div className="lun-contact-cta-row">
                <button onClick={() => navigate('/compte/planification')} className="btn btn-primary">
                  Demander un devis <Icon name="arrow" size={16} color="#fff" />
                </button>
                <button onClick={() => navigate('/compte/messages')} className="btn btn-ghost btn-sm">
                  Nous envoyer un message
                </button>
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
        <h2 className="display lun-cta-title">Votre prochain souvenir commence ici</h2>
        <div className="lun-cta-actions">
          <button onClick={() => navigate('/catalogue')} className="btn btn-lg" style={{ background: '#fff', color: 'var(--coral)' }}>Parcourir la boutique</button>
          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-glass">Écrire sur WhatsApp</a>
        </div>
      </div>
    </div>
  )
}
