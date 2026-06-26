import { Link } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import Icon from '@/components/ui/Icon'
import { CONTACT } from '@/utils/contact'

const COLS: [string, { label: string; to: string }[]][] = [
  ['Boutique', [
    { label: 'Romantique', to: '/catalogue?category=romantique' },
    { label: 'Évènement', to: '/catalogue?category=evenement' },
    { label: 'Anniversaire', to: '/catalogue?category=anniversaire' },
    { label: 'Déco chambre', to: '/catalogue?category=deco-chambre' },
  ]],
  ['Services', [
    { label: 'Décoration sur mesure', to: '/services' },
    { label: 'Installation sur site', to: '/services' },
    { label: 'Devis gratuit', to: '/compte/planification' },
    { label: 'Galerie', to: '/galerie' },
  ]],
  ['Aide', [
    { label: 'Suivi de commande', to: '/compte/commandes' },
    { label: 'Livraison & retrait', to: '/faq' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Nous contacter', to: '/contact' },
  ]],
]

export default function Footer() {
  return (
    <footer className="lun-footer">
      <div className="lun-footer-top">
        <div className="lun-footer-about">
          <Logo color="#fff" mark="var(--gold-bright)" />
          <p className="lun-footer-desc">
            L'art de sublimer vos moments. Décorations romantiques et festives, livrées et installées à Cotonou.
          </p>
          <div className="lun-footer-pays">
            <span className="tag lun-footer-pay">MTN MoMo</span>
            <span className="tag lun-footer-pay">Moov Money</span>
          </div>
          <div className="lun-footer-socials">
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="lun-footer-soc" aria-label="WhatsApp"><Icon name="whatsapp" size={18} color="#fff" /></a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="lun-footer-soc" aria-label="Facebook"><Icon name="facebook" size={18} color="#fff" /></a>
            <a href={CONTACT.tiktok} target="_blank" rel="noopener noreferrer" className="lun-footer-soc" aria-label="TikTok"><Icon name="tiktok" size={18} color="#fff" /></a>
          </div>
          <div className="lun-footer-contact">
            <a href={`tel:${CONTACT.phones[0].replace(/\s/g, '')}`} className="lun-footer-link">{CONTACT.phones[0]}</a>
            <a href={`mailto:${CONTACT.email}`} className="lun-footer-link">{CONTACT.email}</a>
          </div>
        </div>
        <div className="lun-footer-cols">
          {COLS.map(([h, items]) => (
            <div key={h}>
              <div className="eyebrow lun-footer-h">{h}</div>
              {items.map((it) => (
                <Link key={it.label} to={it.to} className="lun-footer-link">{it.label}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="lun-footer-rule" />
      <div className="lun-footer-bottom">
        <span>© {new Date().getFullYear()} LUNARIA Décoration · Cotonou, Bénin</span>
        <span>Confidentialité · CGV</span>
      </div>
    </footer>
  )
}
