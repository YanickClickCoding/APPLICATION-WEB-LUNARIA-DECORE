/* global React, Icon, Moon, Logo, Stars */
// LUNARIA — Variations de hero (couleurs, layout, type) — US-001/049

// A — Ivoire éditorial : clair, photo plein cadre à droite, type serif géant
function HeroLight() {
  return (
    <div className="lun" style={{ width: 1280, height: 720, background: 'var(--ivory)', display: 'flex' }}>
      <div style={{ flex: 1.05, padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Logo size={22} />
        <div className="eyebrow" style={{ marginTop: 48 }}>Décoration · Cotonou</div>
        <h1 className="display" style={{ fontSize: 88, lineHeight: .96, margin: '16px 0 0', fontWeight: 500 }}>
          L'art de<br />sublimer<br /><em className="it" style={{ color: 'var(--coral)' }}>vos moments</em>.
        </h1>
        <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 380, marginTop: 24, lineHeight: 1.7 }}>
          Décorations romantiques et festives, imaginées, livrées et installées par notre équipe.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button className="btn btn-primary btn-lg">Explorer la boutique <Icon name="arrow" size={18} color="#fff" /></button>
          <button className="btn btn-ghost btn-lg">Demander un devis</button>
        </div>
      </div>
      <div className="ph warm" data-ph="[ photo plein cadre · décor signature ]" style={{ flex: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: 28, left: 28, background: '#fff', borderRadius: 'var(--r-md)', padding: '14px 18px', boxShadow: 'var(--sh-lg)' }}>
          <Stars value={5} size={13} />
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>4.9 · 1 200+ événements</div>
        </div>
      </div>
    </div>
  );
}

// B — Nuit centrée : type centré, halos, image en grille dessous (déjà la principale, variante centrée)
function HeroDark() {
  return (
    <div className="lun" style={{ width: 1280, height: 720, background: 'var(--night)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,168,56,.16), transparent 60%)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 56px' }}>
        <Logo size={22} color="#fff" mark="var(--gold)" />
        <div className="eyebrow" style={{ color: 'var(--gold)', marginTop: 40 }}>Mariage · Anniversaire · Saint-Valentin</div>
        <h1 className="display" style={{ fontSize: 92, lineHeight: .98, margin: '18px 0 0', fontWeight: 500, maxWidth: 900 }}>
          Chaque moment mérite<br />sa <em className="it" style={{ color: 'var(--gold)' }}>mise en scène</em>.
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.7)', maxWidth: 460, marginTop: 22, lineHeight: 1.7 }}>
          Nous imaginons, livrons et installons des décorations qui laissent un souvenir.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button className="btn btn-primary btn-lg">Explorer la boutique <Icon name="arrow" size={18} color="#fff" /></button>
          <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>Demander un devis</button>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 50 }}>
          {['warm', '', 'gold', ''].map((t, i) => (
            <div key={i} className={`ph on-dark ${t}`} style={{ width: 150, height: 96, borderRadius: 'var(--r-md)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// C — Corail bloc : split asymétrique, bloc de couleur plein, type sans-serif fort
function HeroCoral() {
  return (
    <div className="lun" style={{ width: 1280, height: 720, display: 'flex' }}>
      <div style={{ flex: 1, background: 'var(--coral)', color: '#fff', padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -100, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
        <Logo size={22} color="#fff" mark="#fff" />
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', marginTop: 44 }}>Décoration festive</div>
        <h1 style={{ fontFamily: 'var(--sans)', fontSize: 72, lineHeight: 1.02, margin: '16px 0 0', fontWeight: 700, letterSpacing: '-.02em' }}>
          Faites briller<br />vos célébrations.
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.85)', maxWidth: 380, marginTop: 22, lineHeight: 1.7 }}>
          De la chambre romantique au grand mariage — un décor sur mesure, clé en main.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button className="btn btn-lg" style={{ background: '#fff', color: 'var(--coral)' }}>Explorer la boutique</button>
          <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }}>Devis gratuit</button>
        </div>
      </div>
      <div className="ph gold" data-ph="[ photo · table de fête ]" style={{ flex: .85 }} />
    </div>
  );
}

window.HeroLight = HeroLight;
window.HeroDark = HeroDark;
window.HeroCoral = HeroCoral;
