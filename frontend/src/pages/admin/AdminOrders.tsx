import { useState } from 'react'
import Icon from '@/components/ui/Icon'

export default function AdminOrders() {
  const [viewDetail, setViewDetail] = useState(false)

  // --- Vue Détail ---
  if (viewDetail) {
    const items = [['Nuit Étoilée', 'Chambre romantique · Corail', 1, '45 000 F', 'warm'], ['Éclat Doré', 'Anniversaire · Or', 1, '28 000 F', 'gold'], ['Bougies LED', 'Add-on', 1, '6 500 F', '']]
    const timeline = [['Commande confirmée', '28 mai · 14:02', true], ['Acompte reçu (MTN)', '28 mai · 14:05', true], ['En préparation', '29 mai · 09:30', true], ['En route', "Aujourd'hui · 16:10", true], ['Installation', 'Estimée 18:30', false]]
    
    return (
      <div className="lun-admin-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
          <span onClick={() => setViewDetail(false)} style={{ cursor: 'pointer' }}>Commandes</span> 
          <Icon name="chevr" size={14} color="var(--muted)" /> 
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>CMD-2041</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <h1 className="display" style={{ fontSize: 38, margin: 0 }}>CMD-2041</h1>
              <span className="tag" style={{ background: 'var(--gold-soft)', color: '#8a5a10', fontWeight: 700 }}>● En route</span>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 4 }}>Passée le 28 mai 2026 · Aïcha Hounkpati</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm"><Icon name="chat" size={16} /> Contacter</button>
            <button className="btn btn-dark btn-sm">Mettre à jour le statut</button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* gauche : articles + timeline */}
          <div style={{ flex: 1.6 }}>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line-2)', fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)' }}>Articles</div>
              {items.map(([n, sub, q, p, t], i) => (
                <div key={n as string} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderBottom: i < items.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
                  <div className={`ph ${t}`} style={{ width: 48, height: 48, borderRadius: 'var(--r-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="serif" style={{ fontSize: 18, fontWeight: 600 }}>{n}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{sub}</div>
                  </div>
                  <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>×{q}</span>
                  <span style={{ fontWeight: 700, width: 90, textAlign: 'right' }}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 22 }}>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)', marginBottom: 18 }}>Historique</div>
              {timeline.map(([t, d, done], i) => (
                <div key={t as string} style={{ display: 'flex', gap: 14, paddingBottom: i < timeline.length - 1 ? 18 : 0, position: 'relative' }}>
                  {i < timeline.length - 1 && <div style={{ position: 'absolute', left: 11, top: 24, bottom: -2, width: 2, background: done ? 'var(--coral)' : 'var(--line)' }} />}
                  <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, zIndex: 1, background: done ? 'var(--coral)' : 'var(--ivory-2)', border: done ? 'none' : '2px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {done && <Icon name="check" size={13} color="#fff" />}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: done ? 700 : 600, color: done ? 'var(--ink)' : 'var(--muted-2)' }}>{t}</span>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* droite : client + paiement */}
          <div style={{ flex: 1 }}>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 22, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)', marginBottom: 14 }}>Client</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div className="ph-center ph warm" style={{ width: 42, height: 42, borderRadius: '50%' }} />
                <div><div style={{ fontSize: 14.5, fontWeight: 700 }}>Aïcha Hounkpati</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Cliente · 3 commandes</div></div>
              </div>
              {[['phone', '+229 97 00 00 00'], ['pin', 'Fidjrossè, Cotonou']].map(([ic, v]) => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--muted)', marginBottom: 8 }}>
                  <Icon name={ic} size={16} color="var(--coral)" /> {v}
                </div>
              ))}
            </div>
            
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 22 }}>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)', marginBottom: 14 }}>Paiement</div>
              {[['Sous-total', '79 500 F'], ['Livraison & pose', '5 000 F'], ['Réduction', '−7 950 F']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 9, color: k === 'Réduction' ? 'var(--coral)' : 'var(--ink)' }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <hr className="divider" style={{ margin: '8px 0 12px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <span style={{ fontWeight: 700 }}>Total</span><span className="display" style={{ fontSize: 26 }}>76 550 F</span>
              </div>
              <div style={{ background: 'var(--ivory)', borderRadius: 'var(--r-sm)', padding: '12px 14px', fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ color: 'var(--muted)' }}>Acompte MTN MoMo</span><span style={{ fontWeight: 700, color: '#3ec47a' }}>Payé · 38 275 F</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Solde à l'installation</span><span style={{ fontWeight: 700 }}>38 275 F</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Vue Liste ---
  const orders = [
    ['CMD-2041', 'Aïcha H.', 'Nuit Étoilée +2', '76 550 F', 'En route', 'var(--gold)'],
    ['CMD-2040', 'Kévin D.', 'Tendresse', '32 000 F', 'Payé', '#3ec47a'],
    ['CMD-2039', 'Florine A.', 'Éclat Doré', '28 000 F', 'En préparation', 'var(--coral)'],
    ['CMD-2038', 'Romaric T.', 'Jardin Blanc', '210 000 F', 'Devis', 'var(--muted)'],
  ]

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Commandes</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>142 commandes · 12 en cours</div>
        </div>
      </div>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 120px 130px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Réf.</span><span>Client</span><span>Produit</span><span>Total</span><span>Statut</span>
        </div>
        {orders.map(([id, who, prod, tot, st, c], i) => (
          <div key={id} onClick={() => setViewDetail(true)} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 120px 130px', alignItems: 'center', padding: '14px 24px', borderBottom: i < orders.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14, cursor: 'pointer' }}>
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
