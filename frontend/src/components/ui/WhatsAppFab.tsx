import Icon from './Icon'
import { CONTACT } from '@/utils/contact'

/** Bouton WhatsApp flottant (bas-droite), ouvre la conversation de la boutique. */
export default function WhatsAppFab() {
  return (
    <a
      href={CONTACT.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="lun-wa-fab"
      aria-label="Nous contacter sur WhatsApp"
    >
      <Icon name="whatsapp" size={30} color="#fff" />
      <span className="lun-wa-fab-txt">Discuter sur WhatsApp</span>
    </a>
  )
}
