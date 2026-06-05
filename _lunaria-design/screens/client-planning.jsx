/* global React, Icon, Logo, Stars, SiteHeader */
// LUNARIA — Planification décoration sur mesure (US-006/007/008) + suivi statuts

function Planification() {
  const steps = [
    ['Demande envoyée', 'Détails de votre événement reçus', true, true],
    ['Devis en préparation', 'Notre équipe chiffre votre projet · 48h', true, false],
    ['Devis proposé', 'À valider de votre côté', false, false],
    ['Acompte & planning', 'Réservation de la date', false, false],
    ['Installation', 'Le jour J', false, false],
  ];
  return (
    <div className="lun" style={{ width: 1280, background: 'var(--ivory)' }}>
      <SiteHeader active="Décorations" />
      <div style={{ padding: '44px 56px 64px' }}>
        <div className="eyebrow">Décoration sur mesure</div>
        <h1 className="display" style={{ fontSize: 50, margin: '12px 0 0' }}>Planifions votre événement</h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 540, marginTop: 12, lineHeight: 1.7 }}>
          Quelques détails suffisent. Notre équipe revient avec une proposition personnalisée et un devis sous 48h.
        </p>

        <div style={{ display: 'flex', gap: 44, marginTop: 36, alignItems: 'flex-start' }}>
          {/* formulaire */}
          <div style={{ flex: 1.4 }}>
            {/* type d'évènement */}
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Type d'événement</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
              {['Mariage', 'Anniversaire', 'Saint-Valentin', 'Baptême', 'Cérémonie', 'Autre'].map((c, i) => (
                <span key={c} className={`chip ${i === 0 ? 'chip-active' : ''}`}>{c}</span>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {[['Date de l\'événement', '14 février 2026', 'cal'], ['Nombre d\'invités', '80 personnes', 'user'], ['Lieu / quartier', 'Cocotomey, Calavi', 'pin'], ['Budget estimé', '150 000 – 250 000 F', 'card']].map(([l, v, ic]) => (
                <div key={l}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>{l}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--line)', background: 'var(--paper)' }}>
                    <Icon name={ic} size={17} color="var(--coral)" />
                    <span style={{ fontSize: 14.5 }}>{v}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* inspirations */}
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', margin: '20px 0 6px' }}>Vos inspirations (photos)</div>
            <div style={{ border: '1.5px dashed var(--line)', borderRadius: 'var(--r-md)', padding: '26px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'var(--paper)' }}>
              <Icon name="upload" size={24} color="var(--muted)" />
              <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>Glissez vos images ou parcourez</span>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', margin: '18px 0 6px' }}>Décrivez votre rêve</div>
            <div style={{ padding: '14px 16px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--line)', background: 'var(--paper)', fontSize: 14, color: 'var(--muted)', minHeight: 70 }}>
              Une ambiance romantique en rouge et or, avec une arche florale pour la demande en mariage…
            </div>
            <button onClick={() => go('suivi')} className="btn btn-primary btn-lg" style={{ marginTop: 22 }}>Envoyer ma demande <Icon name="send" size={17} color="#fff" /></button>
          </div>

          {/* suivi statut */}
          <div style={{ flex: 1, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 28, boxShadow: 'var(--sh-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Suivi de la demande</h3>
              <span className="tag" style={{ background: 'var(--gold-soft)', color: '#8a5a10' }}>En cours</span>
            </div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>DEM-0192 · ouverte le 28 mai</div>
            <div style={{ marginTop: 24, position: 'relative' }}>
              {steps.map(([t, d, done, active], i) => (
                <div key={t} style={{ display: 'flex', gap: 16, paddingBottom: i < steps.length - 1 ? 22 : 0, position: 'relative' }}>
                  {i < steps.length - 1 && <div style={{ position: 'absolute', left: 13, top: 26, bottom: 4, width: 2, background: done ? 'var(--coral)' : 'var(--line)' }} />}
                  <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                    background: done ? 'var(--coral)' : active ? 'var(--gold)' : 'var(--ivory-2)',
                    border: active ? 'none' : done ? 'none' : '2px solid var(--line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {done ? <Icon name="check" size={15} color="#fff" /> : active ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} /> : null}
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: active ? 700 : 600, color: done || active ? 'var(--ink)' : 'var(--muted-2)' }}>{t}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 1 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => go('chat')} className="btn btn-ghost" style={{ width: '100%', marginTop: 22 }}><Icon name="chat" size={17} /> Discuter avec un conseiller</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Planification = Planification;
