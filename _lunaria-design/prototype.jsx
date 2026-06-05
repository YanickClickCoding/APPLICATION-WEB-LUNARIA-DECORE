/* global React, ReactDOM, Icon, Moon, Logo,
   Landing, Catalogue, Fiche, Panier, Checkout, Creneau, PaiementMoMo, Confirmation,
   Planification, Suivi, Chat, Compte, Auth, Galerie,
   AdminDashboard, AdminProduits, AdminCommande, AdminDevis, AdminClients, AdminMessages, AdminPaiements */
const { useState, useRef, useLayoutEffect, useEffect } = React;

// Chat centré sur fond ivoire pour occuper l'écran proprement
function ChatScene() {
  return (
    <div className="lun" style={{ width: 1280, minHeight: 860, background: 'var(--ivory)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <Chat />
    </div>
  );
}

const ROUTES = {
  landing:        { c: Landing,        label: 'Landing',              group: 'client' },
  catalogue:      { c: Catalogue,      label: 'Catalogue',            group: 'client' },
  fiche:          { c: Fiche,          label: 'Fiche produit',        group: 'client' },
  galerie:        { c: Galerie,        label: 'Galerie',              group: 'client' },
  planif:         { c: Planification,  label: 'Planification',        group: 'client' },
  panier:         { c: Panier,         label: 'Panier',               group: 'client' },
  checkout:       { c: Checkout,       label: 'Checkout · livraison', group: 'client' },
  creneau:        { c: Creneau,        label: 'Checkout · créneau',   group: 'client' },
  momo:           { c: PaiementMoMo,   label: 'Paiement Mobile Money',group: 'client' },
  confirmation:   { c: Confirmation,   label: 'Confirmation',         group: 'client' },
  suivi:          { c: Suivi,          label: 'Suivi livraison',      group: 'client' },
  chat:           { c: ChatScene,      label: 'Chat conseiller',      group: 'client' },
  auth:           { c: Auth,           label: 'Connexion',            group: 'client' },
  compte:         { c: Compte,         label: 'Espace client',        group: 'client' },
  adminDash:      { c: AdminDashboard, label: 'Dashboard',            group: 'admin' },
  adminProduits:  { c: AdminProduits,  label: 'Produits',             group: 'admin' },
  adminCommande:  { c: AdminCommande,  label: 'Détail commande',      group: 'admin' },
  adminDevis:     { c: AdminDevis,     label: 'Devis & planif.',      group: 'admin' },
  adminClients:   { c: AdminClients,   label: 'Clients',              group: 'admin' },
  adminMessages:  { c: AdminMessages,  label: 'Messages',             group: 'admin' },
  adminPaiements: { c: AdminPaiements, label: 'Paiements',            group: 'admin' },
};

// — Cadre qui met l'écran à l'échelle de la largeur dispo + scroll vertical —
function ScreenFrame({ routeKey }) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const [t, setT] = useState({ scale: 1, w: 1280, h: 720 });

  useLayoutEffect(() => {
    const update = () => {
      if (!wrapRef.current || !innerRef.current) return;
      const pad = 0;
      const avail = wrapRef.current.clientWidth - pad;
      const natW = innerRef.current.offsetWidth || 1280;
      const natH = innerRef.current.offsetHeight || 720;
      const scale = Math.min(1, avail / natW);
      setT({ scale, w: natW * scale, h: natH * scale });
    };
    update();
    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [routeKey]);

  useEffect(() => { if (wrapRef.current) wrapRef.current.scrollTop = 0; }, [routeKey]);

  const C = ROUTES[routeKey].c;
  return (
    <div ref={wrapRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: '#0c0c16' }}>
      <div style={{ width: t.w, height: t.h, margin: '0 auto' }}>
        <div ref={innerRef} style={{ display: 'inline-block', transform: `scale(${t.scale})`, transformOrigin: 'top left', verticalAlign: 'top' }}>
          <C />
        </div>
      </div>
    </div>
  );
}

function Proto() {
  const [route, setRoute] = useState('landing');
  const [hist, setHist] = useState([]);
  const [menu, setMenu] = useState(false);

  // expose la navigation aux composants d'écran
  useEffect(() => {
    window.lunaNav = (r) => {
      if (!ROUTES[r] || r === route) return;
      setHist((h) => [...h, route]);
      setRoute(r);
      setMenu(false);
    };
    return () => { window.lunaNav = null; };
  }, [route]);

  const back = () => {
    setHist((h) => {
      if (!h.length) return h;
      setRoute(h[h.length - 1]);
      return h.slice(0, -1);
    });
  };
  const jump = (r) => { setHist((h) => [...h, route]); setRoute(r); setMenu(false); };

  const isAdmin = ROUTES[route].group === 'admin';
  const clientKeys = Object.keys(ROUTES).filter((k) => ROUTES[k].group === 'client');
  const adminKeys = Object.keys(ROUTES).filter((k) => ROUTES[k].group === 'admin');

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#0c0c16', fontFamily: 'var(--sans)' }}>
      {/* — Barre de navigation du prototype — */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 56, padding: '0 18px', background: '#14141f', borderBottom: '1px solid rgba(255,255,255,.08)', flexShrink: 0, color: '#fff', position: 'relative', zIndex: 50 }}>
        <button onClick={back} disabled={!hist.length} style={{ display: 'flex', alignItems: 'center', gap: 7, background: hist.length ? 'rgba(255,255,255,.1)' : 'transparent',
          color: hist.length ? '#fff' : 'rgba(255,255,255,.3)', border: 'none', borderRadius: 999, padding: '8px 14px', fontSize: 13.5, fontWeight: 600, cursor: hist.length ? 'pointer' : 'default', fontFamily: 'var(--sans)' }}>
          <Icon name="chevl" size={16} color={hist.length ? '#fff' : 'rgba(255,255,255,.3)'} /> Retour
        </button>
        <button onClick={() => jump(isAdmin ? 'adminDash' : 'landing')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', color: 'rgba(255,255,255,.7)', border: 'none', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
          <Icon name="grid" size={16} color="rgba(255,255,255,.7)" /> Accueil
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginLeft: 6 }}>
          <Moon size={17} color="var(--gold)" />
          <span style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600, letterSpacing: '.12em' }}>LUNARIA</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontFamily: 'var(--mono)', marginTop: 1 }}>prototype</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* segmenté client / admin */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,.08)', borderRadius: 999, padding: 3 }}>
          {[['client', 'Client', 'landing'], ['admin', 'Admin', 'adminDash']].map(([g, lbl, home]) => (
            <button key={g} onClick={() => jump(home)} style={{ padding: '7px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--sans)',
              background: (isAdmin ? 'admin' : 'client') === g ? 'var(--coral)' : 'transparent', color: (isAdmin ? 'admin' : 'client') === g ? '#fff' : 'rgba(255,255,255,.65)' }}>{lbl}</button>
          ))}
        </div>

        {/* menu écrans */}
        <button onClick={() => setMenu((m) => !m)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', minWidth: 190, justifyContent: 'space-between' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ROUTES[route].label}</span>
          <Icon name="chevd" size={15} color="#fff" />
        </button>

        {menu && (
          <div style={{ position: 'absolute', top: 52, right: 18, width: 260, background: '#1b1b28', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: 8, boxShadow: '0 20px 50px rgba(0,0,0,.5)', maxHeight: '78vh', overflowY: 'auto' }}>
            {[['Parcours client', clientKeys], ['Administration', adminKeys]].map(([title, keys]) => (
              <div key={title}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', padding: '12px 12px 6px', fontFamily: 'var(--mono)' }}>{title}</div>
                {keys.map((k) => (
                  <div key={k} onClick={() => jump(k)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13.5,
                    background: k === route ? 'rgba(233,69,96,.18)' : 'transparent', color: k === route ? '#fff' : 'rgba(255,255,255,.8)', fontWeight: k === route ? 700 : 500 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 3, background: k === route ? 'var(--coral)' : 'rgba(255,255,255,.25)' }} />
                    {ROUTES[k].label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {menu && <div onClick={() => setMenu(false)} style={{ position: 'fixed', inset: 0, top: 56, zIndex: 40 }} />}

      <ScreenFrame routeKey={route} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Proto />);
