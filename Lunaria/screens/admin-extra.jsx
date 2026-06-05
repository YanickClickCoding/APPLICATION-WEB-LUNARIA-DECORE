/* global React, Icon, Logo, Stars, AdminShell */
// LUNARIA — Admin complémentaire : Détail commande, Devis, Clients, Messages, Paiements

// ——— Détail commande (US-043) ———
function AdminCommande() {
  const items = [['Nuit Étoilée', 'Chambre romantique · Corail', 1, '45 000 F', 'warm'], ['Éclat Doré', 'Anniversaire · Or', 1, '28 000 F', 'gold'], ['Bougies LED', 'Add-on', 1, '6 500 F', '']];
  const timeline = [['Commande confirmée', '28 mai · 14:02', true], ['Acompte reçu (MTN)', '28 mai · 14:05', true], ['En préparation', '29 mai · 09:30', true], ['En route', "Aujourd'hui · 16:10", true], ['Installation', 'Estimée 18:30', false]];
  return (
    <AdminShell active="Commandes">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
        Commandes <Icon name="chevr" size={14} color="var(--muted)" /> <span style={{ color: 'var(--ink)', fontWeight: 600 }}>CMD-2041</span>
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
          <button onClick={() => go('adminMessages')} className="btn btn-ghost btn-sm"><Icon name="chat" size={16} /> Contacter</button>
          <button className="btn btn-dark btn-sm">Mettre à jour le statut</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* gauche : articles + timeline */}
        <div style={{ flex: 1.6 }}>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line-2)', fontSize: 15, fontWeight: 700, fontFamily: 'var(--serif)' }}>Articles</div>
            {items.map(([n, sub, q, p, t], i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderBottom: i < items.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
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
              <div key={t} style={{ display: 'flex', gap: 14, paddingBottom: i < timeline.length - 1 ? 18 : 0, position: 'relative' }}>
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
    </AdminShell>
  );
}

// ——— Devis & planifications (US-044) ———
function AdminDevis() {
  const rows = [
    ['DEM-0192', 'Aïcha H.', 'Mariage', '14 fév', '150–250k F', 'À chiffrer', 'var(--coral)'],
    ['DEM-0191', 'Parfait O.', 'Anniversaire', '02 juin', '40–60k F', 'Devis envoyé', 'var(--gold)'],
    ['DEM-0190', 'Linda K.', 'Baptême', '20 juin', '80–120k F', 'Accepté', '#3ec47a'],
    ['DEM-0189', 'Marc T.', 'Cérémonie', '05 juil', '200k+ F', 'En discussion', 'var(--night)'],
    ['DEM-0188', 'Sonia A.', 'Saint-Valentin', '14 fév', '30–50k F', 'Refusé', 'var(--muted)'],
  ];
  return (
    <AdminShell active="Planifications">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Devis & planifications</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>23 demandes · 5 à chiffrer</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Toutes', 'À chiffrer', 'En attente client', 'Acceptées'].map((c, i) => (
            <span key={c} className={`chip ${i === 0 ? 'chip-active' : ''}`} style={{ fontSize: 12.5, padding: '7px 14px' }}>{c}</span>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '110px 1.2fr 1fr 90px 120px 130px 40px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Réf.</span><span>Client</span><span>Événement</span><span>Date</span><span>Budget</span><span>Statut</span><span></span>
        </div>
        {rows.map(([id, who, ev, date, bud, st, c], i) => (
          <div key={id} onClick={() => go('adminCommande')} style={{ display: 'grid', gridTemplateColumns: '110px 1.2fr 1fr 90px 120px 130px 40px', alignItems: 'center', padding: '15px 24px', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14, cursor: 'pointer' }}>
            <span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{id}</span>
            <span style={{ fontWeight: 600 }}>{who}</span>
            <span style={{ color: 'var(--muted)' }}>{ev}</span>
            <span style={{ fontSize: 13 }}>{date}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{bud}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: c, fontWeight: 700, justifySelf: 'start' }}>● {st}</span>
            <Icon name="chevr" size={16} color="var(--muted)" />
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

// ——— Clients (US-045) ———
function AdminClients() {
  const rows = [
    ['Aïcha Hounkpati', 'Fidjrossè', 3, '314 550 F', 'warm'],
    ['Kévin Dossou', 'Akpakpa', 2, '64 000 F', ''],
    ['Florine Aholou', 'Cotonou', 5, '189 000 F', 'gold'],
    ['Romaric Tossou', 'Calavi', 1, '210 000 F', 'warm'],
    ['Linda Koffi', 'Godomey', 4, '142 500 F', ''],
  ];
  return (
    <AdminShell active="Clients">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Clients</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>2 480 clients · 312 actifs ce mois</div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={17} color="#fff" /> Ajouter un client</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
        {[['Nouveaux ce mois', '312', 'var(--coral)'], ['Panier moyen', '52 400 F', 'var(--gold)'], ['Taux de fidélité', '38%', '#3ec47a']].map(([l, v, c]) => (
          <div key={l} style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', padding: '18px 22px' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{l}</div>
            <div className="display" style={{ fontSize: 32, marginTop: 4, color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 110px 1fr 40px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Client</span><span>Quartier</span><span>Commandes</span><span>Total dépensé</span><span></span>
        </div>
        {rows.map(([n, q, o, tot, t], i) => (
          <div key={n} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 110px 1fr 40px', alignItems: 'center', padding: '14px 24px', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className={`ph-center ph ${t}`} style={{ width: 38, height: 38, borderRadius: '50%' }} />
              <span style={{ fontWeight: 600 }}>{n}</span>
            </div>
            <span style={{ color: 'var(--muted)' }}>{q}</span>
            <span style={{ fontWeight: 600 }}>{o}</span>
            <span style={{ fontWeight: 700 }}>{tot}</span>
            <Icon name="chevr" size={16} color="var(--muted)" />
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

// ——— Messages (US-046) ———
function AdminMessages() {
  const convs = [
    ['Aïcha H.', 'Un mélange rouge et or, ce serait…', '2 min', true, 'warm'],
    ['Parfait O.', 'Merci pour le devis, je valide !', '18 min', false, ''],
    ['Linda K.', 'Possible pour le 20 juin ?', '1 h', false, 'gold'],
    ['Marc T.', 'Vous faites les grandes salles ?', '3 h', false, 'warm'],
    ['Sonia A.', 'Bonjour, je voudrais un devis…', 'Hier', false, ''],
  ];
  const thread = [
    ['them', 'Bonjour Aïcha ! Pour votre arche, roses rouges ou mélange rouge & or ?'],
    ['me', 'Un mélange rouge et or, ce serait parfait ✨'],
    ['them', 'Excellent. Je vous prépare un visuel ce soir.'],
  ];
  return (
    <AdminShell active="Messages">
      <h1 className="display" style={{ fontSize: 36, margin: '0 0 20px' }}>Messages</h1>
      <div style={{ display: 'flex', gap: 0, background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 540 }}>
        {/* liste convs */}
        <div style={{ width: 320, borderRight: '1px solid var(--line-2)', flexShrink: 0 }}>
          {convs.map(([who, prev, time, active, t], i) => (
            <div key={who} style={{ display: 'flex', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--line-2)', background: active ? 'var(--ivory)' : 'transparent', borderLeft: active ? '3px solid var(--coral)' : '3px solid transparent' }}>
              <div className={`ph-center ph ${t}`} style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{who}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--muted-2)' }}>{time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{prev}</div>
              </div>
              {i === 0 && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--coral)', flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
        </div>
        {/* thread */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 22px', borderBottom: '1px solid var(--line-2)' }}>
            <div className="ph-center ph warm" style={{ width: 38, height: 38, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 700 }}>Aïcha Hounkpati</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>Demande DEM-0192 · Mariage</div></div>
            <span className="tag" style={{ background: 'var(--gold-soft)', color: '#8a5a10' }}>Devis en cours</span>
          </div>
          <div style={{ flex: 1, padding: '22px', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--ivory)' }}>
            {thread.map(([who, t], i) => {
              const me = who === 'me';
              return (
                <div key={i} style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '70%', background: me ? 'var(--coral)' : 'var(--paper)', color: me ? '#fff' : 'var(--ink)', border: me ? 'none' : '1px solid var(--line-2)', borderRadius: 14, padding: '11px 15px', fontSize: 14, lineHeight: 1.5, boxShadow: 'var(--sh-sm)' }}>{t}</div>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderTop: '1px solid var(--line-2)' }}>
            <div style={{ flex: 1, padding: '11px 16px', borderRadius: 'var(--r-pill)', background: 'var(--ivory)', fontSize: 13.5, color: 'var(--muted-2)' }}>Répondre à Aïcha…</div>
            <button style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="send" size={17} color="#fff" /></button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ——— Paiements (US-047) ———
function AdminPaiements() {
  const rows = [
    ['28 mai', 'CMD-2041', 'Aïcha H.', 'MTN MoMo', 'Acompte', '38 275 F', 'Réussi', '#3ec47a'],
    ['27 mai', 'CMD-2040', 'Kévin D.', 'Moov Money', 'Total', '32 000 F', 'Réussi', '#3ec47a'],
    ['27 mai', 'CMD-2039', 'Florine A.', 'MTN MoMo', 'Total', '28 000 F', 'En attente', 'var(--gold)'],
    ['26 mai', 'CMD-2037', 'Yann T.', 'Moov Money', 'Acompte', '15 000 F', 'Échoué', 'var(--coral)'],
    ['26 mai', 'CMD-2036', 'Sandra K.', 'MTN MoMo', 'Total', '45 000 F', 'Réussi', '#3ec47a'],
  ];
  return (
    <AdminShell active="Paiements">
      <h1 className="display" style={{ fontSize: 36, margin: '0 0 6px' }}>Paiements</h1>
      <div style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 22 }}>Mobile Money · mai 2026</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 22 }}>
        {[['Encaissé', '2,4 M F', 'var(--coral)'], ['MTN MoMo', '62%', '#ffcc00'], ['Moov Money', '38%', '#0a4ea3'], ['En attente', '3 paiements', 'var(--gold)']].map(([l, v, c]) => (
          <div key={l} style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', padding: '18px 22px' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{l}</div>
            <div className="display" style={{ fontSize: 30, marginTop: 4, color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '90px 110px 1fr 130px 100px 120px 120px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Date</span><span>Commande</span><span>Client</span><span>Moyen</span><span>Type</span><span>Montant</span><span>Statut</span>
        </div>
        {rows.map(([d, cmd, who, moy, ty, amt, st, c], i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 110px 1fr 130px 100px 120px 120px', alignItems: 'center', padding: '14px 24px', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 13.5 }}>
            <span style={{ color: 'var(--muted)' }}>{d}</span>
            <span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{cmd}</span>
            <span style={{ fontWeight: 600 }}>{who}</span>
            <span>{moy}</span>
            <span style={{ color: 'var(--muted)' }}>{ty}</span>
            <span style={{ fontWeight: 700 }}>{amt}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: c, fontWeight: 700, justifySelf: 'start' }}>● {st}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

Object.assign(window, { AdminCommande, AdminDevis, AdminClients, AdminMessages, AdminPaiements });
