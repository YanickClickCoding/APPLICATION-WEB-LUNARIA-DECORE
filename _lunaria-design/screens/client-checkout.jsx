/* global React, Icon, Logo, Stars, SiteHeader */
// LUNARIA — Panier (US-012/013), Checkout (US-014), Paiement Mobile Money (US-020/021/022)

function Panier() {
  const items = [
    ['Nuit Étoilée', 'Chambre romantique · Corail', '45 000 F', 'warm'],
    ['Éclat Doré', 'Anniversaire · Or', '28 000 F', 'gold'],
    ['Bouquet Lumière', 'Add-on · Bougies LED', '6 500 F', ''],
  ];
  return (
    <div className="lun" style={{ width: 1280, background: 'var(--ivory)' }}>
      <SiteHeader active="Boutique" />
      <div style={{ padding: '44px 56px 64px' }}>
        <h1 className="display" style={{ fontSize: 48, margin: 0 }}>Votre panier <span style={{ fontSize: 22, color: 'var(--muted)', fontFamily: 'var(--sans)' }}>· 3 articles</span></h1>
        <div style={{ display: 'flex', gap: 40, marginTop: 32, alignItems: 'flex-start' }}>
          {/* liste */}
          <div style={{ flex: 1.5 }}>
            {items.map(([name, sub, price, t]) => (
              <div key={name} style={{ display: 'flex', gap: 20, alignItems: 'center', background: 'var(--paper)',
                border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', padding: 16, marginBottom: 14 }}>
                <div className={`ph ${t}`} data-ph="" style={{ width: 96, height: 96, borderRadius: 'var(--r-sm)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="serif" style={{ fontSize: 22, fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1.5px solid var(--line)', borderRadius: 'var(--r-pill)', padding: '7px 13px' }}>
                      <Icon name="minus" size={14} /> <span style={{ fontWeight: 700, fontSize: 14 }}>1</span> <Icon name="plus" size={14} />
                    </div>
                    <span style={{ fontSize: 12.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="trash" size={15} /> Retirer</span>
                  </div>
                </div>
                <div className="display" style={{ fontSize: 24 }}>{price}</div>
              </div>
            ))}
            <div onClick={() => go('catalogue')} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, color: 'var(--coral)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              <Icon name="chevl" size={16} color="var(--coral)" /> Continuer mes achats
            </div>
          </div>
          {/* récap */}
          <div style={{ flex: 1, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 28, boxShadow: 'var(--sh-sm)' }}>
            <h3 className="serif" style={{ fontSize: 26, margin: '0 0 20px', fontWeight: 600 }}>Récapitulatif</h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <input placeholder="Code promo" style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--r-pill)', border: '1.5px solid var(--line)', fontFamily: 'var(--sans)', fontSize: 14 }} />
              <button className="btn btn-dark btn-sm">Appliquer</button>
            </div>
            {[['Sous-total', '79 500 F'], ['Livraison & installation', '5 000 F'], ['Réduction bienvenue', '−7 950 F']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, marginBottom: 12, color: k.includes('Réduction') ? 'var(--coral)' : 'var(--ink)' }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <hr className="divider" style={{ margin: '8px 0 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span className="display" style={{ fontSize: 36 }}>76 550 F</span>
            </div>
            <button onClick={() => go('checkout')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>Passer la commande <Icon name="arrow" size={18} color="#fff" /></button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 18 }}>
              <span className="tag" style={{ background: 'var(--ivory-2)', color: 'var(--muted)' }}>MTN MoMo</span>
              <span className="tag" style={{ background: 'var(--ivory-2)', color: 'var(--muted)' }}>Moov Money</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Checkout() {
  const steps = ['Livraison', 'Créneau', 'Paiement'];
  const fld = (label, val, ph) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ padding: '13px 16px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--line)', background: 'var(--paper)',
        fontSize: 14.5, color: val ? 'var(--ink)' : 'var(--muted-2)' }}>{val || ph}</div>
    </div>
  );
  return (
    <div className="lun" style={{ width: 1280, background: 'var(--ivory)' }}>
      <SiteHeader active="Boutique" />
      <div style={{ padding: '40px 56px 64px' }}>
        {/* progression */}
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
            {/* Mode de livraison (US-025) */}
            <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, margin: '0 0 18px' }}>Mode de livraison</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 32 }}>
              {[['truck', 'Livraison à domicile', '5 000 F', true], ['box', 'Retrait en boutique', 'Gratuit', false], ['spark', 'Livraison + installation', '12 000 F', false]].map(([ic, t, p, on]) => (
                <div key={t} style={{ border: `1.5px solid ${on ? 'var(--coral)' : 'var(--line)'}`, borderRadius: 'var(--r-md)', padding: '18px 16px',
                  background: on ? 'var(--coral-soft)' : 'var(--paper)' }}>
                  <Icon name={ic} size={22} color={on ? 'var(--coral)' : 'var(--ink)'} />
                  <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 10 }}>{t}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{p}</div>
                </div>
              ))}
            </div>
            <h2 className="serif" style={{ fontSize: 28, fontWeight: 600, margin: '0 0 18px' }}>Adresse de livraison</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {fld('Nom complet', 'Aïcha Hounkpati')}
              {fld('Téléphone', '+229 97 00 00 00')}
            </div>
            {fld('Quartier / Ville', 'Fidjrossè, Cotonou')}
            {fld('Repère / instructions', '', 'Ex : portail bleu, en face de la pharmacie…')}
          </div>
          {/* récap fixe */}
          <div style={{ flex: 1, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 26, boxShadow: 'var(--sh-sm)' }}>
            <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, margin: '0 0 16px' }}>Votre commande</h3>
            {[['Nuit Étoilée', '45 000 F'], ['Éclat Doré', '28 000 F'], ['Bougies LED', '6 500 F']].map(([n, p]) => (
              <div key={n} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
                <span style={{ color: 'var(--muted)' }}>{n}</span><span style={{ fontWeight: 600 }}>{p}</span>
              </div>
            ))}
            <hr className="divider" style={{ margin: '14px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700 }}>Total</span><span className="display" style={{ fontSize: 30 }}>76 550 F</span>
            </div>
            <button onClick={() => go('creneau')} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>Continuer vers le créneau</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaiementMoMo() {
  return (
    <div className="lun" style={{ width: 1280, height: 860, background: 'var(--night)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* halo */}
      <div style={{ position: 'absolute', top: -100, left: -60, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,168,56,.18), transparent 62%)' }} />
      {/* carte paiement */}
      <div style={{ width: 480, background: 'var(--paper)', borderRadius: 'var(--r-lg)', padding: 38, boxShadow: 'var(--sh-lg)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Logo size={20} />
          <span onClick={() => go('panier')} style={{ cursor: 'pointer', display: 'flex' }}><Icon name="close" size={18} color="var(--muted)" /></span>
        </div>
        <div className="eyebrow" style={{ marginTop: 26 }}>Paiement sécurisé · Acompte</div>
        <div className="display" style={{ fontSize: 56, margin: '8px 0 4px' }}>38 275 F</div>
        <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>Acompte 50% · Commande CMD-2041</div>

        {/* choix opérateur */}
        <div style={{ display: 'flex', gap: 14, margin: '26px 0' }}>
          <div style={{ flex: 1, border: '2px solid #ffcc00', borderRadius: 'var(--r-md)', padding: '16px', background: '#fffdf2', position: 'relative' }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: '#ffcc00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1a1a2e', fontSize: 12 }}>MTN</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 10 }}>MTN MoMo</div>
            <span style={{ position: 'absolute', top: 12, right: 12 }}><Icon name="check" size={16} color="#caa400" /></span>
          </div>
          <div style={{ flex: 1, border: '2px solid var(--line)', borderRadius: 'var(--r-md)', padding: '16px', background: 'var(--paper)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: '#0a4ea3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 11 }}>moov</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 10 }}>Moov Money</div>
          </div>
        </div>

        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>Numéro MTN MoMo</div>
        <div style={{ padding: '14px 16px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--line)', fontSize: 16, fontWeight: 600, letterSpacing: '.04em' }}>+229 97 00 00 00</div>

        <button onClick={() => go('confirmation')} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 22 }}>Confirmer & payer 38 275 F</button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, fontSize: 12, color: 'var(--muted)' }}>
          <Icon name="shield" size={15} color="var(--gold)" /> Vous recevrez une demande de confirmation sur votre téléphone
        </div>
      </div>
    </div>
  );
}

window.Panier = Panier;
window.Checkout = Checkout;
window.PaiementMoMo = PaiementMoMo;
