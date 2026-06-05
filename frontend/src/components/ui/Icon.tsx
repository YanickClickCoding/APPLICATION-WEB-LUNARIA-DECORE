import type { CSSProperties } from 'react'

// Banque d'icônes SVG (paths) — design LUNARIA
const PATHS: Record<string, string> = {
  search:  'M11 4a7 7 0 105.2 11.7l4 4M11 4a7 7 0 010 14',
  cart:    'M3 4h2l2.2 11.2a1 1 0 001 .8h8.6a1 1 0 001-.8L20 8H6.5M9 20a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z',
  user:    'M5 20a7 7 0 0114 0M12 11a4 4 0 100-8 4 4 0 000 8z',
  heart:   'M12 20s-7-4.6-9.2-9C1.3 7.6 3 4.5 6.2 4.5c2 0 3.2 1.2 3.8 2.3.6-1.1 1.8-2.3 3.8-2.3 3.2 0 4.9 3.1 3.4 6.5C19 15.4 12 20 12 20z',
  menu:    'M3 6h18M3 12h18M3 18h18',
  arrow:   'M5 12h14M13 6l6 6-6 6',
  arrowsm: 'M4 10h12M11 5l5 5-5 5',
  check:   'M5 12l4.5 4.5L19 7',
  chevd:   'M5 8l5 5 5-5',
  chevr:   'M8 5l5 5-5 5',
  chevl:   'M12 5l-5 5 5 5',
  plus:    'M10 4v12M4 10h12',
  minus:   'M4 10h12',
  filter:  'M3 5h18M6 12h12M10 19h4',
  pin:     'M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11zM12 12a2.4 2.4 0 100-4.8A2.4 2.4 0 0012 12z',
  cal:     'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
  chat:    'M4 5h16v11H9l-4 4V5z',
  bell:    'M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 004 0',
  star:    'M12 3l2.6 5.6L20.5 9.4l-4.3 4 1 6L12 16.8 6.8 19.4l1-6L3.5 9.4l5.9-.8z',
  truck:   'M3 6h11v9H3zM14 9h4l3 3v3h-7M7 18a1.6 1.6 0 100-3.2A1.6 1.6 0 007 18zm10 0a1.6 1.6 0 100-3.2A1.6 1.6 0 0017 18z',
  shield:  'M12 3l7 3v5c0 5-3.2 8.2-7 10-3.8-1.8-7-5-7-10V6z',
  spark:   'M12 3v6m0 6v6m-9-9h6m6 0h6M6 6l3.5 3.5M14.5 14.5L18 18M18 6l-3.5 3.5M9.5 14.5L6 18',
  close:   'M5 5l10 10M15 5L5 15',
  edit:    'M4 16l9.5-9.5 4 4L8 20H4v-4zM12.5 5.5l2-2 4 4-2 2',
  trash:   'M4 6h16M9 6V4h6v2M6 6l1 14h10l1-14',
  grid:    'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  box:     'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9',
  card:    'M3 6h18v12H3zM3 10h18',
  phone:   'M7 3h10v18H7zM10 18h4',
  upload:  'M12 16V5m0 0L8 9m4-4l4 4M5 19h14',
  send:    'M4 12l16-7-7 16-2.5-6.5L4 12z',
  flame:   'M12 21c4 0 6-2.6 6-6 0-3-2-5-3-7-.5 1.5-1.5 2-2.5 2 .5-2-1-4-3-5 .3 3-2 4-2 7 0 4 2 9 4.5 9z',
  ring:    'M12 8a4 4 0 100 8 4 4 0 000-8zM12 8V4m-2 0h4',
  logout:  'M9 21H5a1 1 0 01-1-1V4a1 1 0 011-1h4M16 17l5-5-5-5M21 12H9',
  eye:     'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 15a3 3 0 100-6 3 3 0 000 6z',
  tag:     'M3 11V5a2 2 0 012-2h6l9 9-8 8-9-9zM7.5 7.5h.01',
  moon:    'M20 14.5A8 8 0 119.5 4a6.5 6.5 0 1010.5 10.5z',
}

interface IconProps {
  name: keyof typeof PATHS | string
  size?: number
  sw?: number
  color?: string
  fill?: string
  style?: CSSProperties
  className?: string
}

export default function Icon({ name, size = 20, sw = 1.6, color = 'currentColor', fill = 'none', style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={{ flexShrink: 0, ...style }}>
      <path d={PATHS[name] ?? PATHS.spark} />
    </svg>
  )
}
