import { Link } from 'react-router-dom'
import Logo from '@/components/ui/Logo'

const COLS: [string, { label: string; to: string }[]][] = [
  ['Boutique', [
    { label: 'Chambre romantique', to: '/catalogue?occasion=Romantique' },
    { label: 'Mariage', to: '/catalogue?occasion=Mariage' },
    { label: 'Anniversaire', to: '/catalogue?occasion=Anniversaire' },
    { label: 'Saint-Valentin', to: '/catalogue?occasion=Saint-Valentin' },
  ]],
  ['Services', [
    { label: 'Décoration sur mesure', to: '/services' },
    { label: 'Installation sur site', to: '/services' },
    { label: 'Devis gratuit', to: '/compte/planification' },
    { label: 'Galerie', to: '/galerie' },
  ]],
  ['Aide', [
    { label: 'Suivi de commande', to: '/compte/commandes' },
    { label: 'Livraison & retrait', to: '/a-propos' },
    { label: 'FAQ', to: '/a-propos' },
    { label: 'Nous contacter', to: '/compte/messages' },
  ]],
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--night)', color: '#fff', padding: '64px 56px 36px' }} className="lun-footer">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 60, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 300 }}>
          <Logo color="#fff" mark="var(--gold)" />
          <p style={{ marginTop: 18, fontSize: 14, color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}>
            L'art de sublimer vos moments. Décorations romantiques et festives, livrées et installées à Cotonou.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <span className="tag" style={{ background: 'rgba(255,255,255,.08)', color: '#fff' }}>MTN MoMo</span>
            <span className="tag" style={{ background: 'rgba(255,255,255,.08)', color: '#fff' }}>Moov Money</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
          {COLS.map(([h, items]) => (
            <div key={h}>
              <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 16 }}>{h}</div>
              {items.map((it) => (
                <Link key={it.label} to={it.to} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,.7)', marginBottom: 11, textDecoration: 'none' }}>
                  {it.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--line-dark)', margin: '40px 0 22px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'rgba(255,255,255,.45)', flexWrap: 'wrap', gap: 12 }}>
        <span>© {new Date().getFullYear()} LUNARIA Décoration · Cotonou, Bénin</span>
        <span>Confidentialité · CGV</span>
      </div>
      <style>{`@media (max-width: 900px) { .lun-footer { padding: 48px 20px 28px !important; } }`}</style>
    </footer>
  )
}
