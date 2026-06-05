import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'
import type { Review } from '@/types'

function Stars({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Icon key={s} name="star" size={13} sw={0}
          color="transparent" fill={s <= value ? 'var(--gold)' : 'var(--line)'} />
      ))}
    </div>
  )
}

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  EN_ATTENTE: { label: 'En attente', bg: 'var(--gold-soft)', color: '#8a5a10' },
  APPROUVE:   { label: 'Approuvé', bg: 'rgba(62,196,122,.12)', color: '#2c9c5e' },
  REFUSE:     { label: 'Refusé', bg: 'var(--coral-soft)', color: 'var(--coral-deep)' },
}

export default function AdminReviews() {
  const qc = useQueryClient()
  const toast = useToastStore()

  const { data, isLoading } = useQuery<Review[]>({
    queryKey: ['admin-reviews'],
    queryFn: () => api.get<Review[]>('/reviews?limit=50').then((r) => r.data),
  })

  const moderate = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) =>
      action === 'approve' ? api.patch(`/reviews/${id}/approve`) : api.delete(`/reviews/${id}`),
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success(v.action === 'approve' ? 'Avis approuvé' : 'Avis refusé') },
  })

  const reviews = data ?? []
  const pending = reviews.filter((r) => r.status === 'EN_ATTENTE')
  const approved = reviews.filter((r) => r.status === 'APPROUVE')
  const ordered = [...pending, ...reviews.filter((r) => r.status !== 'EN_ATTENTE')]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <div className="eyebrow">Modération</div>
          <h1 className="display" style={{ fontSize: 36, margin: '6px 0 0' }}>Avis clients</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {pending.length > 0 && (
            <span className="tag" style={{ background: 'var(--gold-soft)', color: '#8a5a10' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)' }} /> {pending.length} en attente
            </span>
          )}
          <span className="tag" style={{ background: 'var(--ivory-2)', color: 'var(--muted)' }}>{approved.length} approuvés</span>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>Chargement…</div>
      ) : reviews.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          <Icon name="star" size={40} color="var(--line)" style={{ margin: '0 auto 12px' }} />
          <div>Aucun avis pour l'instant</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {ordered.map((review) => {
            const st = STATUS[review.status] ?? STATUS.EN_ATTENTE
            const client = review.client as { firstName?: string; lastName?: string } | undefined
            return (
              <div key={review._id} className="card"
                style={{ padding: 22, boxShadow: 'var(--sh-sm)', borderColor: review.status === 'EN_ATTENTE' ? 'rgba(239,168,56,.4)' : 'var(--line-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 14, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--coral-soft)', color: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                      {client?.firstName?.[0]?.toUpperCase() ?? 'C'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                        <span style={{ fontSize: 14.5, fontWeight: 700 }}>{client?.firstName} {client?.lastName}</span>
                        <Stars value={review.rating} />
                        <span className="tag" style={{ background: st.bg, color: st.color, fontWeight: 700 }}>{st.label}</span>
                      </div>
                      {review.title && <div className="serif" style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{review.title}</div>}
                      <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.6 }}>{review.comment}</p>
                      <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted-2)', marginTop: 8 }}>
                        {review.product ? `Produit · ${(review.product as { name?: string })?.name ?? ''}` : review.service ? `Service · ${(review.service as { name?: string })?.name ?? ''}` : 'Avis général'}
                        {' · '}{new Date(review.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  {review.status === 'EN_ATTENTE' && (
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => moderate.mutate({ id: review._id, action: 'approve' })} disabled={moderate.isPending}
                        title="Approuver"
                        style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(62,196,122,.3)', background: 'rgba(62,196,122,.08)', color: '#2c9c5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="check" size={16} />
                      </button>
                      <button onClick={() => moderate.mutate({ id: review._id, action: 'reject' })} disabled={moderate.isPending}
                        title="Refuser"
                        style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--coral-soft)', background: 'var(--coral-soft)', color: 'var(--coral-deep)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
