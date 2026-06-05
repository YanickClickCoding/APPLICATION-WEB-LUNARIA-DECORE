/* global React, Icon, Moon, Logo, Stars, SiteHeader, SiteFooter */
// LUNARIA — Écrans client complémentaires : Auth, Créneau, Confirmation, Galerie

// ——— Connexion / Inscription (US-009/010) ———
function Auth() {
  const fld = (label, val, ph) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ padding: '13px 16px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--line)', background: 'var(--paper)',
        fontSize: 14.5, color: val ? 'var(--ink)' : 'var(--muted-2)' }}>{val || ph}</div>
    </div>
  );
  return (
    <div className="lun" style={{ width: 1280, height: 820, display: 'flex' }}>
      {/* visuel gauche */}
      <div className="ph warm" data-ph="[ photo · décor romantique ]" style={{ flex: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,26,46,.45), rgba(233,69,96,.25))', padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Logo size={22} color="#fff" mark="#fff" />
          <div>
            <h2 className="display" style={{ fontSize: 52, color: '#fff', margin: 0, lineHeight: 1.04 }}>Vos plus beaux<br />moments commencent ici.</h2>
            <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,.85)', marginTop: 16, maxWidth: 380, lineHeight: 1.7 }}>Suivez vos commandes, sauvegardez vos inspirations et planifiez vos événements.</p>
          </div>
        </div>
      </div>
      {/* formulaire droite */}
      <div style={{ width: 520, flexShrink: 0, background: 'var(--ivory)', padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 0, background: 'var(--ivory-2)', borderRadius: 'var(--r-pill)', padding: 4, marginBottom: 30, width: 280 }}>
          <span style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 'var(--r-pill)', background: 'var(--paper)', fontSize: 14, fontWeight: 700, boxShadow: 'var(--sh-sm)' }}>Connexion</span>
          <span style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>Inscription</span>
        </div>
        <h1 className="display" style={{ fontSize: 40, margin: '0 0 6px' }}>Bon retour</h1>
        <p style={{ fontSize: 14.5, color: 'var(--muted)', marginBottom: 28 }}>Connectez-vous pour continuer.</p>
        {fld('Téléphone ou e-mail', 'aicha.h@email.com')}
        {fld('Mot de passe', '••••••••••')}
        <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 13, color: 'var(--coral)', fontWeight: 600, marginBottom: 18 }}>Mot de passe oublié ?</div>
        <button onClick={() => go('compte')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>Se connecter</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '22px 0', color: 'var(--muted-2)', fontSize: 12.5 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} /> ou <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>
        <button onClick={() => go('compte')} className="btn btn-ghost btn-lg" style={{ width: '100%' }}><Icon name="phone" size={17} /> Continuer avec mon numéro</button>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', textAlign: 'center', marginTop: 24 }}>Pas encore de compte ? <span style={{ color: 'var(--coral)', fontWeight: 700 }}>Créer un compte</span></p>
      </div>
    </div>
  );
}

// ——— Créneau de livraison — étape 2 du checkout (US-014) ———
function Creneau() {
  const days = [['Sam', '31'], ['Dim', '01'], ['Lun', '02'], ['Mar', '03'], ['Mer', '04'], ['Jeu', '05'], ['Ven', '06']];
  const slots = ['08:00 – 10:00', '10:00 – 12:00', '14:00 – 16:00', '16:00 – 18:00', '18:00 – 20:00'];
  const steps = ['Livraison', 'Créneau', 'Paiement'];
  return (
    <div className="lun" style={{ width: 1280, height: 820, background: 'var(--ivory)' }}>
      <SiteHeader active="Boutique" />
      <div style={{ padding: '40px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', background: i <= 1 ? 'var(--coral)' : 'var(--line)',
                  color: i <= 1 ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                  {i < 1 ? <Icon name="check" size={15} color="#fff" /> : i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: i === 1 ? 700 : 500, color: i <= 1 ? 'var(--ink)' : 'var(--muted)' }}>{s}</span>
              </div>
              {i < 2 && <div style={{ flex: '0 0 60px', height: 2, background: i < 1 ? 'var(--coral)' : 'var(--line)' }} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
          <div style={{ flex: 1.5 }}>
            <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, margin: '0 0 6px' }}>Choisissez votre date</h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>Février 2026 · installation incluse</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
              {days.map(([d, n], i) => (
                <div key={n} style={{ flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 'var(--r-md)',
                  border: `1.5px solid ${i === 0 ? 'var(--coral)' : 'var(--line)'}`, background: i === 0 ? 'var(--coral)' : 'var(--paper)', color: i === 0 ? '#fff' : 'var(--ink)' }}>
                  <div style={{ fontSize: 12, opacity: .7 }}>{d}</div>
                  <div className="serif" style={{ fontSize: 26, fontWeight: 600, marginTop: 2 }}>{n}</div>
                </div>
              ))}
            </div>
            <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, margin: '0 0 16px' }}>Créneau horaire</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {slots.map((s, i) => (
                <div key={s} style={{ padding: '14px 16px', borderRadius: 'var(--r-md)', textAlign: 'center', fontSize: 14.5, fontWeight: 600,
                  border: `1.5px solid ${i === 2 ? 'var(--coral)' : 'var(--line)'}`, background: i === 2 ? 'var(--coral-soft)' : 'var(--paper)',
                  color: i === 2 ? 'var(--coral-deep)' : 'var(--ink)' }}>{s}</div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24, padding: '14px 18px', background: 'var(--gold-soft)', borderRadius: 'var(--r-md)' }}>
              <Icon name="spark" size={18} color="#8a5a10" />
              <span style={{ fontSize: 13.5, color: '#8a5a10' }}>Notre équipe installe sur place le jour J, dans le créneau choisi.</span>
            </div>
          </div>
          <div style={{ flex: 1, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 26, boxShadow: 'var(--sh-sm)' }}>
            <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, margin: '0 0 16px' }}>Récapitulatif</h3>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--line-2)' }}>
              <Icon name="cal" size={18} color="var(--coral)" />
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>Sam 31 fév · 14:00 – 16:00</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Fidjrossè, Cotonou</div>
              </div>
            </div>
            {[['Sous-total', '79 500 F'], ['Livraison & pose', '5 000 F'], ['Réduction', '−7 950 F']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10, color: k === 'Réduction' ? 'var(--coral)' : 'var(--ink)' }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <hr className="divider" style={{ margin: '8px 0 14px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700 }}>Total</span><span className="display" style={{ fontSize: 30 }}>76 550 F</span>
            </div>
            <button onClick={() => go('momo')} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>Continuer vers le paiement</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ——— Confirmation de commande (US-024) ———
function Confirmation() {
  return (
    <div className="lun" style={{ width: 1280, height: 820, background: 'var(--night)', color: '#fff', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(62,196,122,.18), transparent 62%)' }} />
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 560 }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#3ec47a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 10px 40px rgba(62,196,122,.4)' }}>
          <Icon name="check" size={42} color="#fff" sw={2.4} />
        </div>
        <div className="eyebrow" style={{ color: 'var(--gold)' }}>Commande confirmée</div>
        <h1 className="display" style={{ fontSize: 56, margin: '14px 0 0', lineHeight: 1.05 }}>Merci, Aïcha !<br />Tout est prêt.</h1>
        <p style={{ fontSize: 16.5, color: 'rgba(255,255,255,.72)', marginTop: 18, lineHeight: 1.7 }}>
          Votre commande <strong style={{ color: '#fff' }}>CMD-2041</strong> est confirmée. Notre équipe vous retrouve le
          <strong style={{ color: '#fff' }}> samedi 31 février, entre 14h et 16h</strong>.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 32 }}>
          {[['Acompte payé', '38 275 F'], ['Reste à régler', '38 275 F'], ['Installation', 'Incluse']].map(([k, v]) => (
            <div key={k} style={{ background: 'rgba(255,255,255,.07)', borderRadius: 'var(--r-md)', padding: '16px 24px' }}>
              <div className="display" style={{ fontSize: 24 }}>{v}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>{k}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 34 }}>
          <button onClick={() => go('suivi')} className="btn btn-primary btn-lg">Suivre ma commande <Icon name="arrow" size={18} color="#fff" /></button>
          <button onClick={() => go('catalogue')} className="btn btn-lg" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>Retour à la boutique</button>
        </div>
      </div>
    </div>
  );
}

// ——— Galerie réalisations (US-050) ———
function Galerie() {
  const tiles = [
    ['warm', 200], ['', 280], ['gold', 200], ['', 240],
    ['gold', 260], ['warm', 200], ['', 220], ['warm', 280],
    ['', 200], ['gold', 240], ['warm', 220], ['', 200],
  ];
  return (
    <div className="lun" style={{ width: 1280, background: 'var(--ivory)' }}>
      <SiteHeader active="Réalisations" />
      <div style={{ padding: '46px 56px 24px', textAlign: 'center' }}>
        <div className="eyebrow">Portfolio</div>
        <h1 className="display" style={{ fontSize: 56, margin: '12px 0 0' }}>Nos réalisations</h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 520, margin: '14px auto 0', lineHeight: 1.7 }}>
          Plus de 1 200 événements sublimés. Filtrez par occasion et trouvez l'inspiration.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 26, flexWrap: 'wrap' }}>
          {['Tout', 'Mariage', 'Chambre romantique', 'Anniversaire', 'Saint-Valentin', 'Baptême'].map((c, i) => (
            <span key={c} className={`chip ${i === 0 ? 'chip-active' : ''}`}>{c}</span>
          ))}
        </div>
      </div>
      {/* masonry via colonnes */}
      <div style={{ columns: 4, columnGap: 18, padding: '24px 56px 64px' }}>
        {tiles.map(([t, h], i) => (
          <div key={i} className={`ph ${t}`} data-ph="" style={{ height: h, borderRadius: 'var(--r-md)', marginBottom: 18, breakInside: 'avoid', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 16, opacity: i % 3 === 0 ? 1 : 0,
              background: 'linear-gradient(to top, rgba(26,26,46,.55), transparent 55%)' }}>
              <span className="serif" style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>{['Nuit Étoilée', '', '', 'Jardin Blanc', '', '', '', '', '', 'Éclat Doré', '', ''][i]}</span>
            </div>
          </div>
        ))}
      </div>
      <SiteFooter />
    </div>
  );
}

window.Auth = Auth;
window.Creneau = Creneau;
window.Confirmation = Confirmation;
window.Galerie = Galerie;
