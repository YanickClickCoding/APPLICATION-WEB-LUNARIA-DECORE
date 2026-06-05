interface Props {
  fullScreen?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ fullScreen, size = 'md' }: Props) {
  const px = { sm: 20, md: 32, lg: 48 }[size]

  const spinner = (
    <div style={{
      width: px, height: px,
      border: '2px solid var(--line)',
      borderTopColor: 'var(--coral)',
      borderRadius: '50%',
      animation: 'lun-spin .7s linear infinite',
    }} />
  )

  if (fullScreen) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory)', zIndex: 60 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {spinner}
          <span className="serif" style={{ color: 'var(--coral)', fontSize: 22, letterSpacing: '.16em' }}>LUNARIA</span>
        </div>
        <style>{`@keyframes lun-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      {spinner}
      <style>{`@keyframes lun-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
