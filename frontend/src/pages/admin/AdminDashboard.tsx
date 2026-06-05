import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const kpis = [
    ['Chiffre d\'affaires', '2,4 M F', '+18%', 'var(--coral)'],
    ['Commandes', '142', '+12%', 'var(--gold)'],
    ['Devis en attente', '23', '5 urgents', 'var(--night)'],
    ['Note moyenne', '4.9', '86 avis', '#3ec47a'],
  ]
  const orders = [
    ['CMD-2041', 'Aïcha H.', 'Nuit Étoilée +2', '76 550 F', 'En route', 'var(--gold)'],
    ['CMD-2040', 'Kévin D.', 'Tendresse', '32 000 F', 'Payé', '#3ec47a'],
    ['CMD-2039', 'Florine A.', 'Éclat Doré', '28 000 F', 'En préparation', 'var(--coral)'],
    ['CMD-2038', 'Romaric T.', 'Jardin Blanc', '210 000 F', 'Devis', 'var(--muted)'],
  ]

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Tableau de bord</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>Vue d'ensemble · mai 2026</div>
        </div>
        <button onClick={() => navigate('/admin/produits')} className="btn btn-primary">
          <Icon name="plus" size={17} color="#fff" /> Nouveau produit
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 24 }}>
        {kpis.map(([l, v, d, c]) => (
          <div key={l} style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', padding: '20px 22px' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{l}</div>
            <div className="display" style={{ fontSize: 38, margin: '6px 0 2px' }}>{v}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: c }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* graphe ventes */}
        <div style={{ flex: 1.5, background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Ventes · 12 derniers mois</h3>
            <span className="tag" style={{ background: 'var(--coral-soft)', color: 'var(--coral-deep)' }}>+18% YoY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 180 }}>
            {[42, 55, 48, 67, 60, 78, 72, 88, 80, 95, 84, 100].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', height: `${h}%`, borderRadius: '6px 6px 0 0', background: i === 11 ? 'var(--coral)' : 'var(--gold-soft)' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'var(--muted-2)', fontFamily: 'var(--mono)' }}>
            <span>Juin</span><span>Sep</span><span>Déc</span><span>Mar</span><span>Mai</span>
          </div>
        </div>

        {/* top catégories */}
        <div style={{ flex: 1, background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 24 }}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 600, margin: '0 0 18px' }}>Top catégories</h3>
          {[['Mariage', 38, 'var(--coral)'], ['Chambre romantique', 27, 'var(--gold)'], ['Anniversaire', 21, 'var(--night)'], ['Saint-Valentin', 14, '#c98bb0']].map(([n, p, c]) => (
            <div key={n as string} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{n}</span><span style={{ color: 'var(--muted)' }}>{p}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--ivory-2)' }}>
                <div style={{ width: `${(p as number) * 2.4}%`, height: '100%', borderRadius: 4, background: c as string }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* commandes récentes */}
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', marginTop: 20, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--line-2)' }}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Commandes récentes</h3>
          <span onClick={() => navigate('/admin/commandes')} style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--coral)', cursor: 'pointer' }}>Tout voir</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 120px 130px', padding: '12px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Réf.</span><span>Client</span><span>Produit</span><span>Total</span><span>Statut</span>
        </div>
        {orders.map(([id, who, prod, tot, st, c], i) => (
          <div key={id} onClick={() => navigate('/admin/commandes')} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 120px 130px', alignItems: 'center', padding: '14px 24px', borderBottom: i < orders.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14, cursor: 'pointer' }}>
            <span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{id}</span>
            <span style={{ fontWeight: 600 }}>{who}</span>
            <span style={{ color: 'var(--muted)' }}>{prod}</span>
            <span style={{ fontWeight: 700 }}>{tot}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: c as string, fontWeight: 700, justifySelf: 'start' }}>● {st}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
