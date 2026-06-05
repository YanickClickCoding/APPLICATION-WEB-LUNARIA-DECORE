import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import Moon from '@/components/ui/Moon'

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--night)', color: '#fff', textAlign: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, right: -60, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,168,56,.16), transparent 62%)' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Moon size={48} color="var(--gold)" /></div>
        <div className="display" style={{ fontSize: 120, lineHeight: 1, color: 'var(--gold)' }}>404</div>
        <h1 className="display" style={{ fontSize: 36, margin: '8px 0 0' }}>Cette page s'est <em className="it" style={{ color: 'var(--gold)' }}>envolée</em></h1>
        <p style={{ color: 'rgba(255,255,255,.6)', marginTop: 12, maxWidth: 400, marginInline: 'auto' }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary"><Icon name="arrowsm" size={16} color="#fff" /> Accueil</Link>
          <Link to="/catalogue" className="btn" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>Catalogue</Link>
        </div>
      </div>
    </div>
  )
}
