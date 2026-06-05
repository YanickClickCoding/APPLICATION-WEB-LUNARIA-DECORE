/* global React, Icon, Logo, Stars, SiteHeader */
// LUNARIA — Suivi livraison (US-026), Chat (US-033/034), Espace client (US-009/010)

function Suivi() {
  const steps = [
    ['Commande confirmée', '28 mai · 14:02', true],
    ['En préparation', '29 mai · 09:30', true],
    ['En route', "Aujourd'hui · 16:10", true],
    ['Installation sur site', 'Estimée 18:30', false],
  ];
  return (
    <div className="lun" style={{ width: 1280, height: 820, background: 'var(--ivory)' }}>
      <SiteHeader active="Boutique" />
      <div style={{ padding: '40px 56px', display: 'flex', gap: 40 }}>
        <div style={{ flex: 1 }}>
          <div className="eyebrow">Suivi de commande</div>
          <h1 className="display" style={{ fontSize: 44, margin: '12px 0 4px' }}>CMD-2041</h1>
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>Livraison & installation · Fidjrossè, Cotonou</div>

          <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 28, marginTop: 26, boxShadow: 'var(--sh-sm)' }}>
            {steps.map(([t, d, done], i) => (
              <div key={t} style={{ display: 'flex', gap: 16, paddingBottom: i < steps.length - 1 ? 24 : 0, position: 'relative' }}>
                {i < steps.length - 1 && <div style={{ position: 'absolute', left: 13, top: 28, bottom: 0, width: 2, background: done ? 'var(--coral)' : 'var(--line)' }} />}
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                  background: done ? 'var(--coral)' : 'var(--ivory-2)', border: done ? 'none' : '2px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {done ? <Icon name="check" size={15} color="#fff" /> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--muted-2)' }} />}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: done ? 700 : 600, color: done ? 'var(--ink)' : 'var(--muted-2)' }}>{t}</div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, background: 'var(--night)', color: '#fff', borderRadius: 'var(--r-md)', padding: '16px 20px' }}>
            <div className="ph-center ph on-dark" style={{ width: 44, height: 44, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Parfait, votre livreur</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)' }}>Arrive dans ~20 min</div>
            </div>
            <button className="btn btn-sm" style={{ background: 'var(--gold)', color: 'var(--night)' }}><Icon name="phone" size={15} color="var(--night)" /> Appeler</button>
          </div>
        </div>
        {/* carte */}
        <div className="ph" data-ph="[ carte · trajet du livreur ]" style={{ flex: 1.2, borderRadius: 'var(--r-lg)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '40%', left: '30%' }}><Icon name="pin" size={34} color="var(--coral)" fill="var(--coral-soft)" /></div>
          <div style={{ position: 'absolute', top: '64%', left: '62%' }}><Icon name="pin" size={28} color="var(--night)" /></div>
        </div>
      </div>
    </div>
  );
}

function Chat() {
  const msgs = [
    ['them', 'Bonjour Aïcha ! Pour votre arche de mariage, préférez-vous des roses rouges ou un mélange rouge & or ?'],
    ['me', 'Un mélange rouge et or, ce serait parfait ✨'],
    ['them', 'Excellent choix. Je vous prépare un visuel d\'ici ce soir. Voici une réalisation similaire :'],
    ['img', ''],
    ['me', 'Magnifique ! Hâte de voir la proposition.'],
  ];
  return (
    <div className="lun" style={{ width: 760, height: 820, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--sh-md)' }}>
      {/* en-tête chat */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', borderBottom: '1px solid var(--line-2)' }}>
        <div className="ph-center ph warm" style={{ width: 44, height: 44, borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Conseillère LUNARIA</div>
          <div style={{ fontSize: 12.5, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3ec47a' }} /> En ligne · répond en ~5 min
          </div>
        </div>
        <Icon name="phone" size={20} color="var(--muted)" />
      </div>
      {/* fil */}
      <div style={{ flex: 1, padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--ivory)' }}>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted-2)', fontFamily: 'var(--mono)' }}>Demande DEM-0192 · Mariage</div>
        {msgs.map(([who, t], i) => {
          if (who === 'img') return (
            <div key={i} className="ph warm" data-ph="[ réalisation · arche florale ]" style={{ alignSelf: 'flex-start', width: 240, height: 160, borderRadius: 'var(--r-md)' }} />
          );
          const me = who === 'me';
          return (
            <div key={i} style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '74%',
              background: me ? 'var(--coral)' : 'var(--paper)', color: me ? '#fff' : 'var(--ink)',
              border: me ? 'none' : '1px solid var(--line-2)', borderRadius: 16, borderBottomRightRadius: me ? 4 : 16, borderBottomLeftRadius: me ? 16 : 4,
              padding: '12px 16px', fontSize: 14.5, lineHeight: 1.5, boxShadow: 'var(--sh-sm)' }}>
              {t}
            </div>
          );
        })}
      </div>
      {/* saisie */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 22px', borderTop: '1px solid var(--line-2)' }}>
        <Icon name="plus" size={22} color="var(--muted)" />
        <div style={{ flex: 1, padding: '12px 18px', borderRadius: 'var(--r-pill)', background: 'var(--ivory)', fontSize: 14, color: 'var(--muted-2)' }}>Écrivez un message…</div>
        <button style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="send" size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
}

function Compte() {
  const orders = [
    ['CMD-2041', 'Nuit Étoilée +2', 'En route', '76 550 F', 'var(--gold)'],
    ['CMD-1987', 'Jardin Blanc', 'Installé', '210 000 F', '#3ec47a'],
    ['CMD-1820', 'Éclat Doré', 'Terminé', '28 000 F', 'var(--muted)'],
  ];
  return (
    <div className="lun" style={{ width: 1280, height: 820, background: 'var(--ivory)' }}>
      <SiteHeader active="Boutique" />
      <div style={{ padding: '40px 56px', display: 'flex', gap: 36 }}>
        {/* sidebar */}
        <div style={{ width: 250, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
            <div className="ph-center ph warm" style={{ width: 54, height: 54, borderRadius: '50%' }} />
            <div>
              <div className="serif" style={{ fontSize: 20, fontWeight: 600 }}>Aïcha H.</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Membre depuis 2024</div>
            </div>
          </div>
          {[['box', 'Mes commandes', true], ['cal', 'Mes événements', false], ['heart', 'Favoris', false], ['pin', 'Adresses', false], ['card', 'Paiements', false], ['user', 'Profil', false]].map(([ic, t, on]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--r-sm)',
              background: on ? 'var(--paper)' : 'transparent', border: on ? '1px solid var(--line-2)' : '1px solid transparent',
              fontSize: 14.5, fontWeight: on ? 700 : 500, color: on ? 'var(--ink)' : 'var(--muted)', marginBottom: 4, boxShadow: on ? 'var(--sh-sm)' : 'none' }}>
              <Icon name={ic} size={18} color={on ? 'var(--coral)' : 'var(--muted)'} /> {t}
            </div>
          ))}
        </div>
        {/* contenu */}
        <div style={{ flex: 1 }}>
          <h1 className="display" style={{ fontSize: 40, margin: '0 0 6px' }}>Mes commandes</h1>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>Suivez vos commandes et événements en cours.</div>
          {/* mini stats */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            {[['3', 'commandes'], ['1', 'en cours'], ['2', 'événements'], ['4.9', 'votre note moy.']].map(([n, l]) => (
              <div key={l} style={{ flex: 1, background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', padding: '18px 20px' }}>
                <div className="display" style={{ fontSize: 32 }}>{n}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--sh-sm)' }}>
            {orders.map(([id, name, status, total, col], i) => (
              <div key={id} onClick={() => go('suivi')} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px', borderBottom: i < orders.length - 1 ? '1px solid var(--line-2)' : 'none', cursor: 'pointer' }}>
                <div className={`ph ${i === 0 ? 'warm' : i === 1 ? '' : 'gold'}`} style={{ width: 60, height: 60, borderRadius: 'var(--r-sm)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{id}</div>
                  <div className="serif" style={{ fontSize: 19, fontWeight: 600 }}>{name}</div>
                </div>
                <span className="tag" style={{ background: 'var(--ivory-2)', color: col, fontWeight: 700 }}>● {status}</span>
                <div className="display" style={{ fontSize: 22, width: 110, textAlign: 'right' }}>{total}</div>
                <Icon name="chevr" size={18} color="var(--muted)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.Suivi = Suivi;
window.Chat = Chat;
window.Compte = Compte;
