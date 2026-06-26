import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { CONTACT } from '@/utils/contact'

const FAQ: [string, string][] = [
  ['Dans quelles zones intervenez-vous ?', 'Nous livrons et installons à Cotonou et ses environs : Calavi, Akpakpa, Fidjrossè, et au-delà sur demande (Parakou). Précisez votre lieu dans le formulaire de planification pour un devis exact.'],
  ['Comment se passe la livraison et le retrait ?', 'Notre équipe livre, installe entièrement le décor avant votre événement, puis revient assurer le démontage et le retrait du matériel. La pose et le retrait sont inclus dans nos prestations.'],
  ['Quels moyens de paiement acceptez-vous ?', 'Nous acceptons MTN MoMo et Moov Money. Le paiement est sécurisé et confirmé en temps réel. Un acompte peut être demandé pour valider la réservation.'],
  ['Combien de temps à l’avance faut-il réserver ?', 'Idéalement 1 à 2 semaines avant l’événement pour les grandes prestations. Pour les demandes urgentes, contactez-nous : nous faisons notre maximum, devis sous 48h.'],
  ['Proposez-vous des décorations sur mesure ?', 'Oui, c’est notre cœur de métier. Décrivez votre thème, vos couleurs et votre budget via la planification : nous concevons une proposition personnalisée.'],
  ['Puis-je récupérer ma commande en boutique ?', 'Oui, le retrait en boutique est possible pour les articles de la boutique. Choisissez « retrait » au moment de la commande. Pour les prestations installées, nous nous déplaçons sur votre lieu.'],
  ['Comment annuler ou modifier une commande ?', 'Contactez-nous au plus tôt via WhatsApp ou la messagerie de votre compte. Les modifications sont possibles selon l’avancement de la préparation ; les conditions d’acompte vous seront précisées au devis.'],
]

export default function FaqPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div>
      {/* Hero */}
      <div className="lun-gal-hero">
        <div className="glow" style={{ bottom: -120, left: -80, width: 460, height: 460, background: 'radial-gradient(circle, rgba(255,45,142,.20), transparent 62%)' }} />
        <div className="container lun-gal-hero-inner">
          <div className="eyebrow" style={{ color: 'var(--gold-bright)' }}>Livraison · Paiement · Pratique</div>
          <h1 className="display lun-gal-h1">FAQ &amp; Aide</h1>
          <p className="lun-gal-sub">
            Les réponses aux questions les plus fréquentes. Vous ne trouvez pas ? Écrivez-nous, on adore aider.
          </p>
        </div>
      </div>

      {/* Accordéons */}
      <div className="bg-ivory section">
        <div className="container-tight">
          <div className="lun-faq">
            {FAQ.map(([q, a], i) => (
              <div key={q} className={`lun-faq-item ${open === i ? 'is-open' : ''}`}>
                <button className="lun-faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                  <span>{q}</span>
                  <Icon name="chevd" size={18} color="var(--coral)" />
                </button>
                {open === i && <p className="lun-faq-a">{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-coral lun-cta">
        <h2 className="display lun-cta-title">Une autre question&nbsp;?</h2>
        <div className="lun-cta-actions">
          <button onClick={() => navigate('/contact')} className="btn btn-lg" style={{ background: '#fff', color: 'var(--coral)' }}>Nous contacter</button>
          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-glass">Écrire sur WhatsApp</a>
        </div>
      </div>
    </div>
  )
}
