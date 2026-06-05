/* global React, Icon, Moon, Logo, Stars */
// LUNARIA — Board 0 : Direction visuelle (style tile)

function DirectionBoard() {
  const swatch = (name, val, hex, dark) => (
    <div key={name} style={{ flex: 1 }}>
      <div style={{ height: 92, borderRadius: 'var(--r-md)', background: val,
        border: dark ? '1px solid var(--line)' : 'none', boxShadow: 'var(--sh-sm)' }} />
      <div style={{ marginTop: 12, fontSize: 13.5, fontWeight: 600 }}>{name}</div>
      <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{hex}</div>
    </div>
  );

  const Block = ({ title, children, style }) => (
    <div style={{ ...style }}>
      <div className="eyebrow" style={{ marginBottom: 22 }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div className="lun" style={{ width: 1280, padding: '64px 72px', background: 'var(--ivory)' }}>
      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
        <Logo size={26} />
        <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>Direction visuelle · v1</span>
      </div>
      <h1 className="display" style={{ fontSize: 72, margin: '18px 0 0', maxWidth: 820 }}>
        L'art de sublimer<br /><em className="it" style={{ color: 'var(--coral)' }}>vos moments</em>.
      </h1>
      <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 560, marginTop: 20, lineHeight: 1.7 }}>
        Un univers moderne et épuré, photo-centré, qui laisse respirer chaque réalisation.
        La typographie serif apporte le romantisme&nbsp;; le corail et l'or, l'énergie festive.
      </p>

      <hr className="divider" style={{ margin: '52px 0' }} />

      {/* Couleurs */}
      <Block title="Palette">
        <div style={{ display: 'flex', gap: 22 }}>
          {swatch('Nuit', 'var(--night)', '#1A1A2E')}
          {swatch('Corail', 'var(--coral)', '#E94560')}
          {swatch('Or', 'var(--gold)', '#EFA838')}
          {swatch('Ivoire', 'var(--ivory)', '#FAF7F3', true)}
          {swatch('Papier', 'var(--paper)', '#FFFFFF', true)}
          {swatch('Encre douce', 'var(--muted)', '#6C6C7E')}
        </div>
      </Block>

      <hr className="divider" style={{ margin: '52px 0' }} />

      {/* Type */}
      <div style={{ display: 'flex', gap: 64 }}>
        <Block title="Titres — Cormorant Garamond" style={{ flex: 1.3 }}>
          <div className="display" style={{ fontSize: 64, lineHeight: 1 }}>Mariage</div>
          <div className="display it" style={{ fontSize: 40, fontStyle: 'italic', color: 'var(--coral)', marginTop: 8 }}>Saint-Valentin</div>
          <div className="display" style={{ fontSize: 26, fontWeight: 600, marginTop: 16 }}>Chambre romantique · Baptême · Anniversaire</div>
        </Block>
        <Block title="Texte & labels" style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 16, lineHeight: 1.7, color: 'var(--ink)' }}>
            DM Sans — corps de texte lisible pour les descriptions, fiches produit et formulaires.
            Pensé pour le confort de lecture sur desktop comme sur mobile.
          </div>
          <div className="mono" style={{ fontSize: 13, marginTop: 22, color: 'var(--muted)' }}>DM Mono — 12,00&nbsp;€ · CMD-2041 · 22:30</div>
          <div className="eyebrow" style={{ marginTop: 18 }}>Étiquette éditoriale</div>
        </Block>
      </div>

      <hr className="divider" style={{ margin: '52px 0' }} />

      {/* Composants */}
      <Block title="Composants">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button className="btn btn-primary">Réserver <Icon name="arrow" size={17} color="#fff" /></button>
          <button className="btn btn-dark">Passer commande</button>
          <button className="btn btn-gold">Demander un devis</button>
          <button className="btn btn-ghost">Voir la galerie</button>
          <span className="chip chip-active">Mariage</span>
          <span className="chip">Anniversaire</span>
          <span className="tag" style={{ background: 'var(--coral-soft)', color: 'var(--coral-deep)' }}>Saint-Valentin</span>
          <span className="tag" style={{ background: 'var(--gold-soft)', color: '#8a5a10' }}>−15% bienvenue</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Stars value={5} /><span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>4.9</span></div>
        </div>
        <div style={{ display: 'flex', gap: 22, marginTop: 28 }}>
          <div className="ph" data-ph="[ photo · décor de salle ]" style={{ width: 280, height: 150, borderRadius: 'var(--r-md)' }} />
          <div className="ph warm" data-ph="[ photo · chambre romantique ]" style={{ width: 280, height: 150, borderRadius: 'var(--r-md)' }} />
          <div className="ph gold" data-ph="[ photo · table de fête ]" style={{ width: 280, height: 150, borderRadius: 'var(--r-md)' }} />
        </div>
      </Block>
    </div>
  );
}

window.DirectionBoard = DirectionBoard;
