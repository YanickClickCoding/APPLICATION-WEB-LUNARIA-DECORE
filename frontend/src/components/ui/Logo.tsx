import { Link } from 'react-router-dom'
import LogoMark from './LogoMark'

interface LogoProps {
  color?: string
  /** Conservé pour compatibilité d'appel — non utilisé avec le logo SVG */
  mark?: string
  size?: number
  to?: string
}

export default function Logo({ size = 22, to = '/' }: LogoProps) {
  return (
    <Link to={to} className="lun-logo" aria-label="LUNARIA — Accueil"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, textDecoration: 'none' }}>
      <LogoMark className="lun-logo-mark" size={size * 1.5} />
      <img src="/logo-text.png" alt="LUNARIA" className="lun-logo-text"
        style={{ width: size * 4.6, height: 'auto', display: 'block', marginTop: -3 }} />
    </Link>
  )
}
