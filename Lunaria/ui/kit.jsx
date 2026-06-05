/* global React */
// LUNARIA — kit partagé : icônes, logo, étoiles, header, footer
// Exporté vers window pour les autres fichiers d'écrans.

const I = {
  search:  'M11 4a7 7 0 105.2 11.7l4 4M11 4a7 7 0 010 14',
  cart:    'M3 4h2l2.2 11.2a1 1 0 001 .8h8.6a1 1 0 001-.8L20 8H6.5M9 20a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z',
  user:    'M5 20a7 7 0 0114 0M12 11a4 4 0 100-8 4 4 0 000 8z',
  heart:   'M12 20s-7-4.6-9.2-9C1.3 7.6 3 4.5 6.2 4.5c2 0 3.2 1.2 3.8 2.3.6-1.1 1.8-2.3 3.8-2.3 3.2 0 4.9 3.1 3.4 6.5C19 15.4 12 20 12 20z',
  menu:    'M3 6h18M3 12h18M3 18h18',
  arrow:   'M5 12h14M13 6l6 6-6 6',
  arrowsm: 'M4 10h12M11 5l5 5-5 5',
  check:   'M5 12l4.5 4.5L19 7',
  chevd:   'M5 8l5 5 5-5',
  chevr:   'M8 5l5 5-5 5',
  chevl:   'M12 5l-5 5 5 5',
  plus:    'M10 4v12M4 10h12',
  minus:   'M4 10h12',
  filter:  'M3 5h18M6 12h12M10 19h4',
  pin:     'M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11zM12 12a2.4 2.4 0 100-4.8A2.4 2.4 0 0012 12z',
  cal:     'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
  chat:    'M4 5h16v11H9l-4 4V5z',
  bell:    'M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 004 0',
  star:    'M12 3l2.6 5.6L20.5 9.4l-4.3 4 1 6L12 16.8 6.8 19.4l1-6L3.5 9.4l5.9-.8z',
  truck:   'M3 6h11v9H3zM14 9h4l3 3v3h-7M7 18a1.6 1.6 0 100-3.2A1.6 1.6 0 007 18zm10 0a1.6 1.6 0 100-3.2A1.6 1.6 0 0017 18z',
  shield:  'M12 3l7 3v5c0 5-3.2 8.2-7 10-3.8-1.8-7-5-7-10V6z',
  spark:   'M12 3v6m0 6v6m-9-9h6m6 0h6M6 6l3.5 3.5M14.5 14.5L18 18M18 6l-3.5 3.5M9.5 14.5L6 18',
  close:   'M5 5l10 10M15 5L5 15',
  edit:    'M4 16l9.5-9.5 4 4L8 20H4v-4zM12.5 5.5l2-2 4 4-2 2',
  trash:   'M4 6h16M9 6V4h6v2M6 6l1 14h10l1-14',
  grid:    'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  box:     'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9',
  card:    'M3 6h18v12H3zM3 10h18',
  phone:   'M7 3h10v18H7zM10 18h4',
  upload:  'M12 16V5m0 0L8 9m4-4l4 4M5 19h14',
  send:    'M4 12l16-7-7 16-2.5-6.5L4 12z',
  flame:   'M12 21c4 0 6-2.6 6-6 0-3-2-5-3-7-.5 1.5-1.5 2-2.5 2 .5-2-1-4-3-5 .3 3-2 4-2 7 0 4 2 9 4.5 9z',
  ring:    'M12 8a4 4 0 100 8 4 4 0 000-8zM12 8V4m-2 0h4',
};

function Icon({ name, size = 20, sw = 1.6, color = 'currentColor', fill = 'none', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      <path d={I[name]} />
    </svg>
  );
}

// Croissant de lune — marque (cercles uniquement)
function Moon({ size = 22, color = 'currentColor' }) {
  const id = 'm' + Math.random().toString(36).slice(2, 7);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <defs><mask id={id}>
        <rect width="24" height="24" fill="#fff" />
        <circle cx="16" cy="9" r="9" fill="#000" />
      </mask></defs>
      <circle cx="11" cy="12" r="9" fill={color} mask={`url(#${id})`} />
    </svg>
  );
}

function Logo({ color = 'var(--ink)', mark = 'var(--coral)', size = 22 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Moon size={size} color={mark} />
      <span className="serif" style={{ fontSize: size * 1.05, fontWeight: 600, letterSpacing: '.16em', color, lineHeight: 1 }}>LUNARIA</span>
    </div>
  );
}

function Stars({ n = 5, value = 5, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: n }).map((_, i) => (
        <Icon key={i} name="star" size={size} sw={0}
          fill={i < Math.round(value) ? 'var(--gold)' : 'var(--line)'}
          color="transparent" />
      ))}
    </div>
  );
}

// En-tête site client
function SiteHeader({ dark = false, active = 'Boutique' }) {
  const links = [['Boutique', 'catalogue'], ['Décorations', 'planif'], ['Réalisations', 'galerie'], ['À propos', 'landing']];
  const fg = dark ? '#fff' : 'var(--ink)';
  const sub = dark ? 'rgba(255,255,255,.7)' : 'var(--muted)';
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 56px', borderBottom: `1px solid ${dark ? 'var(--line-dark)' : 'var(--line-2)'}`,
      background: dark ? 'transparent' : 'rgba(255,255,255,.7)', backdropFilter: 'blur(8px)' }}>
      <div onClick={() => go('landing')} style={{ cursor: 'pointer' }}><Logo color={fg} mark={dark ? 'var(--gold)' : 'var(--coral)'} /></div>
      <nav style={{ display: 'flex', gap: 34 }}>
        {links.map(([l, r]) => (
          <span key={l} onClick={() => go(r)} style={{ fontSize: 14.5, fontWeight: l === active ? 600 : 500,
            color: l === active ? fg : sub, position: 'relative', cursor: 'pointer' }}>
            {l}
            {l === active && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -7, height: 2, background: 'var(--coral)', borderRadius: 2 }} />}
          </span>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: fg }}>
        <span onClick={() => go('catalogue')} style={{ cursor: 'pointer', display: 'flex' }}><Icon name="search" size={20} /></span>
        <span onClick={() => go('compte')} style={{ cursor: 'pointer', display: 'flex' }}><Icon name="heart" size={20} /></span>
        <div onClick={() => go('panier')} style={{ position: 'relative', cursor: 'pointer', display: 'flex' }}>
          <Icon name="cart" size={20} />
          <span style={{ position: 'absolute', top: -6, right: -8, background: 'var(--coral)', color: '#fff',
            fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: 8, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--sans)' }}>3</span>
        </div>
        <div style={{ width: 1, height: 20, background: dark ? 'var(--line-dark)' : 'var(--line)' }} />
        <button onClick={() => go('auth')} className="btn btn-sm" style={{ background: dark ? '#fff' : 'var(--night)', color: dark ? 'var(--night)' : '#fff' }}>Se connecter</button>
      </div>
    </header>
  );
}

function SiteFooter() {
  const cols = [
    ['Boutique', ['Chambre romantique', 'Mariage', 'Anniversaire', 'Saint-Valentin']],
    ['Services', ['Décoration sur mesure', 'Installation sur site', 'Devis gratuit', 'Galerie']],
    ['Aide', ['Suivi de commande', 'Livraison & retrait', 'FAQ', 'Nous contacter']],
  ];
  return (
    <footer style={{ background: 'var(--night)', color: '#fff', padding: '64px 56px 36px' }}>
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
        <div style={{ display: 'flex', gap: 64 }}>
          {cols.map(([h, items]) => (
            <div key={h}>
              <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 16 }}>{h}</div>
              {items.map((it) => (
                <div key={it} style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', marginBottom: 11 }}>{it}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--line-dark)', margin: '40px 0 22px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'rgba(255,255,255,.45)' }}>
        <span>© 2026 LUNARIA Décoration · Cotonou, Bénin</span>
        <span>Confidentialité · CGV</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Icon, Moon, Logo, Stars, SiteHeader, SiteFooter, go });

// Helper de navigation (no-op dans le canevas statique, actif dans le prototype)
function go(r) { if (window.lunaNav) window.lunaNav(r); }
