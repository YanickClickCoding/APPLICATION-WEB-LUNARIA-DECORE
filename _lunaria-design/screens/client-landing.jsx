/* global React, Icon, Moon, Logo, Stars, SiteHeader, SiteFooter */
// LUNARIA — Parcours client : Landing immersive (US-001, US-049, US-050)

function Landing() {
  const cats = [
    ['Chambre romantique', 'warm'], ['Mariage', ''], ['Anniversaire', 'gold'],
    ['Saint-Valentin', 'warm'], ['Baptême', ''], ['Cérémonies', 'gold'],
  ];
  const feats = [
    ['Nuit Étoilée', 'Chambre romantique', '45 000 F', 'warm'],
    ['Jardin Blanc', 'Décor de mariage', 'Sur devis', ''],
    ['Éclat Doré', 'Table d\'anniversaire', '28 000 F', 'gold'],
  ];
  return (
    <div className="lun" style={{ width: 1280, background: 'var(--night)' }}>
      {/* ——— HERO (sombre, immersif) ——— */}
      <div style={{ position: 'relative', background: 'var(--night)', color: '#fff', overflow: 'hidden' }}>
        <SiteHeader dark active="Boutique" />

        {/* halo doux */}
        <div style={{ position: 'absolute', top: -120, right: -80, width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,168,56,.20), transparent 62%)' }} />
        <div style={{ position: 'absolute', bottom: -160, left: -120, width: 540, height: 540, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(233,69,96,.18), transparent 62%)' }} />

        <div style={{ position: 'relative', padding: '70px 56px 90px', display: 'flex', gap: 40, alignItems: 'center' }}>
          <div style={{ flex: 1.05 }}>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>Décoration · Cotonou, Bénin</div>
            <h1 className="display" style={{ fontSize: 96, lineHeight: 0.98, margin: '20px 0 0', fontWeight: 500 }}>
              Chaque moment<br />mérite sa<br /><em className="it" style={{ color: 'var(--gold)' }}>mise en scène</em>.
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.72)', maxWidth: 440, marginTop: 28, lineHeight: 1.7 }}>
              Mariages, anniversaires, chambres romantiques. Nous imaginons, livrons et installons des
              décorations qui laissent un souvenir.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
              <button onClick={() => go('catalogue')} className="btn btn-primary btn-lg">Explorer la boutique <Icon name="arrow" size={18} color="#fff" /></button>
              <button onClick={() => go('planif')} className="btn btn-lg" style={{ background: 'rgba(255,255,255,.1)', color: '#fff' }}>Demander un devis</button>
            </div>
            <div style={{ display: 'flex', gap: 36, marginTop: 48 }}>
              {[['1 200+', 'événements décorés'], ['4.9/5', 'satisfaction client'], ['48h', 'devis & installation']].map(([a, b]) => (
                <div key={b}>
                  <div className="display" style={{ fontSize: 34, color: '#fff' }}>{a}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>{b}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Composition d'images en couches — suggère l'animation parallaxe */}
          <div style={{ flex: 1, position: 'relative', height: 540 }}>
            <div className="ph on-dark" data-ph="[ photo · décor signature ]" style={{ position: 'absolute', top: 20, right: 0, width: 360, height: 460, borderRadius: 'var(--r-lg)' }} />
            <div className="ph on-dark" data-ph="[ photo · détail floral ]" style={{ position: 'absolute', top: 0, left: 0, width: 210, height: 250, borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-lg)' }} />
            <div className="ph on-dark" data-ph="[ photo · bougies ]" style={{ position: 'absolute', bottom: 0, left: 30, width: 230, height: 200, borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-lg)' }} />
            <div style={{ position: 'absolute', bottom: 40, right: 24, background: '#fff', color: 'var(--ink)', borderRadius: 'var(--r-md)', padding: '14px 18px', boxShadow: 'var(--sh-lg)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Moon size={26} color="var(--coral)" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Installation incluse</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>par notre équipe</div>
              </div>
            </div>
          </div>
        </div>

        {/* Note d'animation */}
        <div style={{ position: 'absolute', left: 56, bottom: 22, display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,.5)' }}>
          <Icon name="chevd" size={18} color="rgba(255,255,255,.5)" />
          <span className="mono" style={{ fontSize: 11.5 }}>au scroll : les visuels se détachent en parallaxe puis se rassemblent</span>
        </div>
      </div>

      {/* ——— CATÉGORIES ——— */}
      <div style={{ background: 'var(--ivory)', padding: '64px 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div className="eyebrow">Par occasion</div>
            <h2 className="display" style={{ fontSize: 44, margin: '12px 0 0' }}>Trouvez votre ambiance</h2>
          </div>
          <span onClick={() => go('catalogue')} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--coral)', cursor: 'pointer' }}>Tout voir <Icon name="arrowsm" size={16} color="var(--coral)" /></span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {cats.map(([c, t]) => (
            <div key={c} onClick={() => go('catalogue')} className="ph" style={{ height: 180, borderRadius: 'var(--r-lg)', cursor: 'pointer' }}
              data-ph={`[ photo · ${c.toLowerCase()} ]`}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 22,
                background: 'linear-gradient(to top, rgba(26,26,46,.62), transparent 60%)' }}>
                <span className="serif" style={{ color: '#fff', fontSize: 26, fontWeight: 600 }}>{c}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ——— RÉALISATIONS / PRODUITS PHARES ——— */}
      <div style={{ background: 'var(--ivory)', padding: '20px 56px 72px' }}>
        <div className="eyebrow" style={{ marginBottom: 28 }}>Nos créations phares</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {feats.map(([name, sub, price, t]) => (
            <div key={name} onClick={() => go('fiche')} className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh-sm)', cursor: 'pointer' }}>
              <div className={`ph ${t}`} data-ph={`[ photo · ${name.toLowerCase()} ]`} style={{ height: 300, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 14, left: 14 }} className="tag"><Icon name="heart" size={13} color="var(--coral)" /></span>
              </div>
              <div style={{ padding: '20px 22px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="serif" style={{ fontSize: 24, fontWeight: 600 }}>{name}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
                  </div>
                  <Stars value={5} size={13} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                  <span className="display" style={{ fontSize: 26 }}>{price}</span>
                  <button onClick={(e) => { e.stopPropagation(); go('panier'); }} className="btn btn-primary btn-sm">Ajouter <Icon name="plus" size={15} color="#fff" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ——— BANDE SERVICE SUR MESURE ——— */}
      <div style={{ background: 'var(--night-2)', color: '#fff', padding: '68px 56px', display: 'flex', gap: 56, alignItems: 'center' }}>
        <div className="ph on-dark" data-ph="[ photo · réalisation grand format ]" style={{ flex: 1, height: 320, borderRadius: 'var(--r-lg)' }} />
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>Décoration clé-en-main</div>
          <h2 className="display" style={{ fontSize: 46, margin: '14px 0 0', lineHeight: 1.05 }}>Un projet sur mesure&nbsp;? <em className="it" style={{ color: 'var(--gold)' }}>Parlons-en.</em></h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.7)', marginTop: 18, lineHeight: 1.7, maxWidth: 440 }}>
            Décrivez votre événement — date, lieu, budget, inspirations. Notre équipe revient vers vous avec
            une offre personnalisée sous 48h.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 30 }}>
            <button onClick={() => go('planif')} className="btn btn-gold btn-lg">Lancer ma planification <Icon name="arrow" size={18} color="var(--night)" /></button>
          </div>
        </div>
      </div>

      {/* ——— TÉMOIGNAGES (US-050) ——— */}
      <div style={{ background: 'var(--ivory)', padding: '72px 56px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="eyebrow">Elles & ils nous ont fait confiance</div>
          <h2 className="display" style={{ fontSize: 44, margin: '12px 0 0' }}>Des souvenirs, pas seulement des décors</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            ['« Notre chambre de lune de miel était à couper le souffle. Installation impeccable. »', 'Aïcha & Romaric', 'Mariage · Calavi'],
            ['« Devis en 24h, paiement Moov ultra simple, équipe adorable. Je recommande. »', 'Florine A.', 'Anniversaire · Cotonou'],
            ['« La Saint-Valentin de mes rêves. Tout était parfait jusqu\'aux bougies. »', 'Kévin D.', 'Saint-Valentin · Akpakpa'],
          ].map(([q, who, ev]) => (
            <div key={who} className="card" style={{ padding: '28px 26px', boxShadow: 'var(--sh-sm)' }}>
              <Stars value={5} size={15} />
              <p className="serif" style={{ fontSize: 21, lineHeight: 1.4, margin: '16px 0 22px', fontWeight: 500 }}>{q}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="ph-center ph" style={{ width: 42, height: 42, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{who}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{ev}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ——— CTA bandeau ——— */}
      <div style={{ background: 'var(--coral)', color: '#fff', padding: '60px 56px', textAlign: 'center' }}>
        <h2 className="display" style={{ fontSize: 50, margin: 0 }}>Prête à faire briller votre événement&nbsp;?</h2>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 28 }}>
          <button onClick={() => go('auth')} className="btn btn-lg" style={{ background: '#fff', color: 'var(--coral)' }}>Créer mon compte</button>
          <button onClick={() => go('catalogue')} className="btn btn-lg" style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }}>Parcourir la boutique</button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

window.Landing = Landing;
