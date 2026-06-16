interface LogoMarkProps {
  size?: number
  className?: string
}

/**
 * Ballons + étoiles du logo LUNARIA, recréés en SVG (éléments séparés,
 * animables individuellement au survol — voir .lun-logo dans pages.css).
 */
export default function LogoMark({ size = 42, className }: LogoMarkProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="balPink" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#ffc1dd" />
          <stop offset="60%" stopColor="#f48bc0" />
          <stop offset="100%" stopColor="#e96bac" />
        </radialGradient>
        <radialGradient id="balGreen" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#b6f5b0" />
          <stop offset="60%" stopColor="#74d96a" />
          <stop offset="100%" stopColor="#56c44d" />
        </radialGradient>
        <radialGradient id="balBlue" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#b9c6f7" />
          <stop offset="60%" stopColor="#6f86e6" />
          <stop offset="100%" stopColor="#5870d8" />
        </radialGradient>
      </defs>

      {/* Ficelles */}
      <g className="lm-strings" stroke="#8aa0d8" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M40 70 Q44 88 56 104" />
        <path d="M66 60 Q64 84 58 104" />
        <path d="M86 74 Q80 90 60 104" />
      </g>

      {/* Ballon vert (arrière) */}
      <g className="lm-balloon lm-balloon-green">
        <ellipse cx="66" cy="38" rx="23" ry="27" fill="url(#balGreen)" />
        <path d="M62 64 l4 7 4-7 z" fill="#56c44d" />
        <ellipse cx="58" cy="28" rx="6" ry="9" fill="#ffffff" opacity=".35" />
      </g>

      {/* Ballon bleu (droite) */}
      <g className="lm-balloon lm-balloon-blue">
        <ellipse cx="87" cy="52" rx="21" ry="25" fill="url(#balBlue)" />
        <path d="M83 76 l4 7 4-7 z" fill="#5870d8" />
        <ellipse cx="80" cy="43" rx="5.5" ry="8" fill="#ffffff" opacity=".35" />
      </g>

      {/* Ballon rose (avant) */}
      <g className="lm-balloon lm-balloon-pink">
        <ellipse cx="40" cy="46" rx="24" ry="28" fill="url(#balPink)" />
        <path d="M36 73 l4 7 4-7 z" fill="#e96bac" />
        <ellipse cx="31" cy="35" rx="6.5" ry="9.5" fill="#ffffff" opacity=".4" />
      </g>

      {/* Étoiles */}
      <path className="lm-star lm-star-left"
        d="M16 70 l3 6 6.5 1 -4.7 4.6 1.1 6.5 -5.9-3 -5.9 3 1.1-6.5 -4.7-4.6 6.5-1 z"
        fill="#ffce4a" stroke="#f4b400" strokeWidth="1" strokeLinejoin="round" />
      <path className="lm-star lm-star-right"
        d="M104 64 l3 6 6.5 1 -4.7 4.6 1.1 6.5 -5.9-3 -5.9 3 1.1-6.5 -4.7-4.6 6.5-1 z"
        fill="#ffce4a" stroke="#f4b400" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  )
}
