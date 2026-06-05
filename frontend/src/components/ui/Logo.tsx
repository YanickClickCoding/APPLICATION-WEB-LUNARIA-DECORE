import { Link } from 'react-router-dom'
import Moon from './Moon'

interface LogoProps {
  color?: string
  mark?: string
  size?: number
  to?: string
}

export default function Logo({ color = 'var(--ink)', mark = 'var(--coral)', size = 22, to = '/' }: LogoProps) {
  return (
    <Link to={to} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <Moon size={size} color={mark} />
      <span className="serif" style={{ fontSize: size * 1.05, fontWeight: 600, letterSpacing: '.16em', color, lineHeight: 1 }}>
        LUNARIA
      </span>
    </Link>
  )
}
