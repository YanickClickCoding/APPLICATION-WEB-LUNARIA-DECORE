import Icon from '@/components/ui/Icon'

export default function AdminPlanning() {
  const rows = [
    ['DEM-0192', 'Aïcha H.', 'Mariage', '14 fév', '150–250k F', 'À chiffrer', 'var(--coral)'],
    ['DEM-0191', 'Parfait O.', 'Anniversaire', '02 juin', '40–60k F', 'Devis envoyé', 'var(--gold)'],
    ['DEM-0190', 'Linda K.', 'Baptême', '20 juin', '80–120k F', 'Accepté', '#3ec47a'],
    ['DEM-0189', 'Marc T.', 'Cérémonie', '05 juil', '200k+ F', 'En discussion', 'var(--night)'],
    ['DEM-0188', 'Sonia A.', 'Saint-Valentin', '14 fév', '30–50k F', 'Refusé', 'var(--muted)'],
  ]

  return (
    <div className="lun-admin-page">
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
          <div key={id as string} style={{ display: 'grid', gridTemplateColumns: '110px 1.2fr 1fr 90px 120px 130px 40px', alignItems: 'center', padding: '15px 24px', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14, cursor: 'pointer' }}>
            <span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{id}</span>
            <span style={{ fontWeight: 600 }}>{who}</span>
            <span style={{ color: 'var(--muted)' }}>{ev}</span>
            <span style={{ fontSize: 13 }}>{date}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{bud}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: c as string, fontWeight: 700, justifySelf: 'start' }}>● {st}</span>
            <Icon name="chevr" size={16} color="var(--muted)" />
          </div>
        ))}
      </div>
    </div>
  )
}
