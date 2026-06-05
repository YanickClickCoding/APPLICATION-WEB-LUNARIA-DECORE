import Icon from './Icon'

interface StarsProps { n?: number; value?: number; size?: number }

export default function Stars({ n = 5, value = 5, size = 14 }: StarsProps) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: n }).map((_, i) => (
        <Icon key={i} name="star" size={size} sw={0}
          fill={i < Math.round(value) ? 'var(--gold)' : 'var(--line)'}
          color="transparent" />
      ))}
    </div>
  )
}
