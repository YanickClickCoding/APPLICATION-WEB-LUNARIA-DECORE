export default function AdminPayments() {
  const rows = [
    ['28 mai', 'CMD-2041', 'Aïcha H.', 'MTN MoMo', 'Acompte', '38 275 F', 'Réussi', '#3ec47a'],
    ['27 mai', 'CMD-2040', 'Kévin D.', 'Moov Money', 'Total', '32 000 F', 'Réussi', '#3ec47a'],
    ['27 mai', 'CMD-2039', 'Florine A.', 'MTN MoMo', 'Total', '28 000 F', 'En attente', 'var(--gold)'],
    ['26 mai', 'CMD-2037', 'Yann T.', 'Moov Money', 'Acompte', '15 000 F', 'Échoué', 'var(--coral)'],
    ['26 mai', 'CMD-2036', 'Sandra K.', 'MTN MoMo', 'Total', '45 000 F', 'Réussi', '#3ec47a'],
  ]

  return (
    <div className="lun-admin-page">
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
            <span className="tag" style={{ background: 'var(--ivory-2)', color: c as string, fontWeight: 700, justifySelf: 'start' }}>● {st}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
