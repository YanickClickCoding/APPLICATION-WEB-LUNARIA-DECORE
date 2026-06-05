import { useId } from 'react'

interface MoonProps { size?: number; color?: string }

// Croissant de lune — marque LUNARIA (masque de cercles)
export default function Moon({ size = 22, color = 'currentColor' }: MoonProps) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <defs>
        <mask id={`moon-${id}`}>
          <rect width="24" height="24" fill="#fff" />
          <circle cx="16" cy="9" r="9" fill="#000" />
        </mask>
      </defs>
      <circle cx="11" cy="12" r="9" fill={color} mask={`url(#moon-${id})`} />
    </svg>
  )
}
