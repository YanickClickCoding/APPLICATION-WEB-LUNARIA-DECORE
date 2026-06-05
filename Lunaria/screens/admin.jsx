/* global React, Icon, Moon, Logo, Stars */
// LUNARIA — Administration : Dashboard (US-040/041), Produits (US-042), Commandes (US-043)

function AdminShell({ active, children }) {
  const nav = [
    ['grid', 'Tableau de bord', 'adminDash'], ['box', 'Produits', 'adminProduits'], ['cart', 'Commandes', 'adminCommande'],
    ['cal', 'Planifications', 'adminDevis'], ['user', 'Clients', 'adminClients'], ['chat', 'Messages', 'adminMessages'], ['card', 'Paiements', 'adminPaiements'],
  ];
  return (
    <div className="lun" style={{ width: 1280, background: 'var(--ivory)', display: 'flex', minHeight: 820 }}>
      {/* sidebar sombre */}
      <div style={{ width: 248, background: 'var(--night)', color: '#fff', padding: '26px 18px', flexShrink: 0 }}>
        <div onClick={() => go('adminDash')} style={{ padding: '0 8px 24px', cursor: 'pointer' }}><Logo size={20} color="#fff" mark="var(--gold)" /></div>
        {nav.map(([ic, t, r]) => (
          <div key={t} onClick={() => go(r)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--r-sm)', marginBottom: 3, cursor: 'pointer',
            background: t === active ? 'rgba(255,255,255,.1)' : 'transparent',
            color: t === active ? '#fff' : 'rgba(255,255,255,.62)', fontSize: 14, fontWeight: t === active ? 700 : 500 }}>
            <Icon name={ic} size={18} color={t === active ? 'var(--gold)' : 'rgba(255,255,255,.62)'} /> {t}
          </div>
        ))}
        <div style={{ position: 'absolute' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid var(--line-2)', background: 'var(--paper)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--ivory)', borderRadius: 'var(--r-pill)', padding: '9px 16px', width: 300 }}>
            <Icon name="search" size={17} color="var(--muted)" /><span style={{ fontSize: 13.5, color: 'var(--muted-2)' }}>Rechercher…</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Icon name="bell" size={20} color="var(--muted)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="ph-center ph warm" style={{ width: 34, height: 34, borderRadius: '50%' }} />
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>Admin</span>
            </div>
          </div>
        </div>
        <div style={{ padding: 32, flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const kpis = [
    ['Chiffre d\'affaires', '2,4 M F', '+18%', 'var(--coral)'],
    ['Commandes', '142', '+12%', 'var(--gold)'],
    ['Devis en attente', '23', '5 urgents', 'var(--night)'],
    ['Note moyenne', '4.9', '86 avis', '#3ec47a'],
  ];
  const orders = [
    ['CMD-2041', 'Aïcha H.', 'Nuit Étoilée +2', '76 550 F', 'En route', 'var(--gold)'],
    ['CMD-2040', 'Kévin D.', 'Tendresse', '32 000 F', 'Payé', '#3ec47a'],
    ['CMD-2039', 'Florine A.', 'Éclat Doré', '28 000 F', 'En préparation', 'var(--coral)'],
    ['CMD-2038', 'Romaric T.', 'Jardin Blanc', '210 000 F', 'Devis', 'var(--muted)'],
  ];
  return (
    <AdminShell active="Tableau de bord">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Tableau de bord</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>Vue d'ensemble · mai 2026</div>
        </div>
        <button onClick={() => go('adminProduits')} className="btn btn-primary"><Icon name="plus" size={17} color="#fff" /> Nouveau produit</button>
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
                <div style={{ width: '100%', height: `${h}%`, borderRadius: '6px 6px 0 0',
                  background: i === 11 ? 'var(--coral)' : 'var(--gold-soft)' }} />
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
            <div key={n} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{n}</span><span style={{ color: 'var(--muted)' }}>{p}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--ivory-2)' }}>
                <div style={{ width: `${p * 2.4}%`, height: '100%', borderRadius: 4, background: c }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* commandes récentes */}
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', marginTop: 20, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--line-2)' }}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Commandes récentes</h3>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--coral)' }}>Tout voir</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 120px 130px', padding: '12px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Réf.</span><span>Client</span><span>Produit</span><span>Total</span><span>Statut</span>
        </div>
        {orders.map(([id, who, prod, tot, st, c], i) => (
          <div key={id} onClick={() => go('adminCommande')} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 120px 130px', alignItems: 'center', padding: '14px 24px', borderBottom: i < orders.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14, cursor: 'pointer' }}>
            <span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{id}</span>
            <span style={{ fontWeight: 600 }}>{who}</span>
            <span style={{ color: 'var(--muted)' }}>{prod}</span>
            <span style={{ fontWeight: 700 }}>{tot}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: c, fontWeight: 700, justifySelf: 'start' }}>● {st}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

function AdminProduits() {
  const rows = [
    ['Nuit Étoilée', 'Chambre romantique', '45 000 F', 24, 'Actif', 'warm'],
    ['Jardin Blanc', 'Mariage', 'Sur devis', 8, 'Actif', ''],
    ['Éclat Doré', 'Anniversaire', '28 000 F', 41, 'Actif', 'gold'],
    ['Tendresse', 'Saint-Valentin', '32 000 F', 0, 'Rupture', 'warm'],
    ['Boléro', 'Cérémonies', '52 000 F', 12, 'Brouillon', 'gold'],
  ];
  const stCol = { Actif: '#3ec47a', Rupture: 'var(--coral)', Brouillon: 'var(--muted)' };
  return (
    <AdminShell active="Produits">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Produits</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>128 produits · 6 catégories</div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={17} color="#fff" /> Ajouter un produit</button>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        {['Tous', 'Chambre romantique', 'Mariage', 'Anniversaire', 'Saint-Valentin'].map((c, i) => (
          <span key={c} className={`chip ${i === 0 ? 'chip-active' : ''}`} style={{ fontSize: 12.5, padding: '7px 14px' }}>{c}</span>
        ))}
      </div>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 90px 110px 80px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Produit</span><span>Catégorie</span><span>Prix</span><span>Stock</span><span>Statut</span><span></span>
        </div>
        {rows.map(([n, cat, price, stock, st, t], i) => (
          <div key={n} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 90px 110px 80px', alignItems: 'center', padding: '14px 24px', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className={`ph ${t}`} style={{ width: 46, height: 46, borderRadius: 'var(--r-sm)' }} />
              <span className="serif" style={{ fontSize: 18, fontWeight: 600 }}>{n}</span>
            </div>
            <span style={{ color: 'var(--muted)' }}>{cat}</span>
            <span style={{ fontWeight: 700 }}>{price}</span>
            <span style={{ color: stock === 0 ? 'var(--coral)' : 'var(--ink)', fontWeight: 600 }}>{stock}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: stCol[st], fontWeight: 700, justifySelf: 'start' }}>● {st}</span>
            <div style={{ display: 'flex', gap: 12, color: 'var(--muted)' }}><Icon name="edit" size={17} /><Icon name="trash" size={17} /></div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

window.AdminShell = AdminShell;
window.AdminDashboard = AdminDashboard;
window.AdminProduits = AdminProduits;
