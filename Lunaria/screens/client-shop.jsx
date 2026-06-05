/* global React, Icon, Logo, Stars, SiteHeader */
// LUNARIA — Catalogue (US-002, US-005) & Fiche produit (US-003, US-004)

function Catalogue() {
  const cats = ['Tout', 'Chambre romantique', 'Mariage', 'Anniversaire', 'Saint-Valentin', 'Baptême', 'Cérémonies'];
  const prods = [
    ['Nuit Étoilée', 'Chambre romantique', '45 000 F', 'warm', true],
    ['Jardin Blanc', 'Mariage', 'Sur devis', '', false],
    ['Éclat Doré', 'Anniversaire', '28 000 F', 'gold', false],
    ['Tendresse', 'Saint-Valentin', '32 000 F', 'warm', true],
    ['Première Lumière', 'Baptême', '38 000 F', '', false],
    ['Boléro', 'Cérémonies', '52 000 F', 'gold', false],
    ['Pétales', 'Chambre romantique', '36 000 F', 'warm', false],
    ['Aurore', 'Mariage', 'Sur devis', '', false],
  ];
  return (
    <div className="lun" style={{ width: 1280, background: 'var(--ivory)' }}>
      <SiteHeader active="Boutique" />
      {/* Bandeau titre */}
      <div style={{ padding: '46px 56px 30px' }}>
        <div className="eyebrow">Catalogue</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 }}>
          <h1 className="display" style={{ fontSize: 52, margin: 0 }}>La boutique</h1>
          {/* recherche */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--paper)', border: '1px solid var(--line)',
            borderRadius: 'var(--r-pill)', padding: '11px 18px', width: 340, boxShadow: 'var(--sh-sm)' }}>
            <Icon name="search" size={18} color="var(--muted)" />
            <span style={{ fontSize: 14, color: 'var(--muted-2)' }}>Rechercher une ambiance, un produit…</span>
          </div>
        </div>
      </div>
      {/* Filtres catégories */}
      <div style={{ display: 'flex', gap: 10, padding: '0 56px 8px', flexWrap: 'wrap' }}>
        {cats.map((c, i) => (
          <span key={c} className={`chip ${i === 0 ? 'chip-active' : ''}`}>{c}</span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 56px' }}>
        <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>128 résultats</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600 }}>
          <Icon name="filter" size={16} /> Trier : Populaires <Icon name="chevd" size={14} />
        </span>
      </div>
      {/* Grille produits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22, padding: '0 56px 64px' }}>
        {prods.map(([name, sub, price, t, fav]) => (
          <div key={name} onClick={() => go('fiche')} className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh-sm)', cursor: 'pointer' }}>
            <div className={`ph ${t}`} data-ph={`[ ${name.toLowerCase()} ]`} style={{ height: 220, position: 'relative' }}>
              <span style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="heart" size={16} color={fav ? 'var(--coral)' : 'var(--muted)'} fill={fav ? 'var(--coral)' : 'none'} />
              </span>
              {price === 'Sur devis' && <span style={{ position: 'absolute', top: 12, left: 12 }} className="tag" >
                <span style={{ background: 'var(--night)', color: '#fff', padding: '5px 10px', borderRadius: 'var(--r-pill)', fontSize: 11 }}>Service</span></span>}
            </div>
            <div style={{ padding: '16px 18px 20px' }}>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{sub}</div>
              <div className="serif" style={{ fontSize: 21, fontWeight: 600, marginTop: 3 }}>{name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span style={{ fontSize: 17, fontWeight: 700 }}>{price}</span>
                <button onClick={(e) => { e.stopPropagation(); go('panier'); }} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'var(--night)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="plus" size={17} color="#fff" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Fiche() {
  return (
    <div className="lun" style={{ width: 1280, background: 'var(--ivory)' }}>
      <SiteHeader active="Boutique" />
      {/* fil d'ariane */}
      <div style={{ padding: '24px 56px 0', fontSize: 13, color: 'var(--muted)' }}>
        Boutique <span style={{ margin: '0 8px' }}>/</span> <span onClick={() => go('catalogue')} style={{ cursor: 'pointer' }}>Chambre romantique</span> <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}> Nuit Étoilée</span>
      </div>
      <div style={{ display: 'flex', gap: 48, padding: '28px 56px 56px' }}>
        {/* galerie */}
        <div style={{ flex: 1.1 }}>
          <div className="ph warm" data-ph="[ photo principale · Nuit Étoilée ]" style={{ height: 460, borderRadius: 'var(--r-lg)' }} />
          <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
            {['détail', 'ambiance', 'installation', 'nuit'].map((x, i) => (
              <div key={x} className={`ph ${i === 0 ? 'warm' : ''}`} data-ph={`[ ${x} ]`}
                style={{ flex: 1, height: 96, borderRadius: 'var(--r-md)', border: i === 0 ? '2px solid var(--coral)' : 'none' }} />
            ))}
          </div>
        </div>
        {/* infos */}
        <div style={{ flex: 1 }}>
          <div className="eyebrow">Chambre romantique</div>
          <h1 className="display" style={{ fontSize: 52, margin: '12px 0 0', lineHeight: 1 }}>Nuit Étoilée</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
            <Stars value={5} size={16} />
            <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>4.9 · 86 avis</span>
            <span className="tag" style={{ background: 'var(--coral-soft)', color: 'var(--coral-deep)' }}>Best-seller</span>
          </div>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginTop: 22 }}>
            Une mise en scène féérique : voile de lumière, pétales, bougies LED et lettrage personnalisé.
            Idéale pour une demande, un anniversaire de couple ou une nuit de noces.
          </p>
          <div className="display" style={{ fontSize: 40, margin: '24px 0 4px' }}>45 000 F <span style={{ fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--sans)' }}>CFA</span></div>
          <div style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>● En stock · installation sous 48h</div>

          {/* personnalisation */}
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Palette de couleurs</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {['#e94560', '#efa838', '#1a1a2e', '#c98bb0', '#9caf88'].map((c, i) => (
                <div key={c} style={{ width: 38, height: 38, borderRadius: '50%', background: c, cursor: 'pointer',
                  boxShadow: i === 0 ? '0 0 0 2px #fff, 0 0 0 4px var(--ink)' : 'var(--sh-sm)' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 30, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, border: '1.5px solid var(--line)', borderRadius: 'var(--r-pill)', padding: '11px 18px' }}>
              <Icon name="minus" size={16} /> <span style={{ fontWeight: 700 }}>1</span> <Icon name="plus" size={16} />
            </div>
            <button onClick={() => go('panier')} className="btn btn-primary btn-lg" style={{ flex: 1 }}>Ajouter au panier <Icon name="cart" size={18} color="#fff" /></button>
          </div>
          <button onClick={() => go('planif')} className="btn btn-ghost btn-lg" style={{ width: '100%', marginTop: 12 }}>Demander une décoration sur mesure</button>
          {/* réassurance */}
          <div style={{ display: 'flex', gap: 24, marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
            {[['truck', 'Livraison & pose'], ['shield', 'Paiement sécurisé'], ['chat', 'Conseil dédié']].map(([ic, t]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: 'var(--muted)' }}>
                <Icon name={ic} size={18} color="var(--coral)" /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Avis (US-003) */}
      <div style={{ background: 'var(--paper)', padding: '52px 56px', borderTop: '1px solid var(--line-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h2 className="display" style={{ fontSize: 34, margin: 0 }}>Avis clients</h2>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--coral)' }}>Voir les 86 avis</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 26 }}>
          {[
            ['Magique ! Au-delà de mes attentes.', 'Sandra K.', 5],
            ['Installation soignée, équipe ponctuelle.', 'Yannick T.', 5],
            ['Très joli rendu, un vrai coup de cœur.', 'Linda O.', 4],
          ].map(([q, who, r]) => (
            <div key={who} style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: '22px 22px' }}>
              <Stars value={r} size={14} />
              <p style={{ fontSize: 15, lineHeight: 1.6, margin: '12px 0 14px' }}>{q}</p>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{who}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.Catalogue = Catalogue;
window.Fiche = Fiche;
