import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import Icon from '@/components/ui/Icon'
import { paymentsService } from '@/services/payments.service'
import type { PaymentMethod } from '@/types'

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F'
type UI = 'pending' | 'processing' | 'success' | 'failed'

export default function PaymentPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const orderId = params.get('orderId') ?? undefined
  const method = (params.get('method') ?? 'MTN_MOMO') as PaymentMethod
  const phone = params.get('phone') ?? ''
  const amount = Number(params.get('amount') ?? 0)

  const [status, setStatus] = useState<UI>('processing')
  const [error, setError] = useState('')

  useEffect(() => { initiate() }, [])

  const initiate = async () => {
    setStatus('processing'); setError('')
    try {
      const svc = method === 'MTN_MOMO' ? paymentsService.initiateMtnMomo : paymentsService.initiateMovMoney
      const { data } = await svc({ orderId, phone, amount, type: 'COMMANDE' })
      setStatus('pending')
      poll(data.paymentId)
    } catch { setStatus('failed'); setError('Impossible d\'initier le paiement.') }
  }

  const poll = (pid: string) => {
    let n = 0
    const iv = setInterval(async () => {
      n++
      try {
        const { data } = await paymentsService.getStatus(pid)
        if (data.status === 'CONFIRME') { clearInterval(iv); setStatus('success') }
        else if (data.status === 'ECHOUE') { clearInterval(iv); setStatus('failed'); setError('Paiement refusé ou annulé.') }
        else if (n >= 24) { clearInterval(iv); setStatus('failed'); setError('Délai dépassé.') }
      } catch { if (n >= 24) clearInterval(iv) }
    }, 5000)
  }

  const opLabel = method === 'MTN_MOMO' ? 'MTN MoMo' : 'Moov Money'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--night)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, left: -60, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,168,56,.18), transparent 62%)' }} />

      <div style={{ width: 480, maxWidth: '100%', background: 'var(--paper)', borderRadius: 'var(--r-lg)', padding: 38, boxShadow: 'var(--sh-lg)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Logo size={20} />
          <button onClick={() => navigate('/compte/commandes')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="close" size={18} color="var(--muted)" /></button>
        </div>

        <div className="eyebrow" style={{ marginTop: 26 }}>Paiement sécurisé</div>
        <div className="display" style={{ fontSize: 52, margin: '8px 0 4px' }}>{fmt(amount)}</div>
        <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{opLabel} · {phone}</div>

        <div style={{ marginTop: 30, minHeight: 160 }}>
          {status === 'processing' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--line)', borderTopColor: 'var(--coral)', borderRadius: '50%', margin: '0 auto', animation: 'lun-spin .7s linear infinite' }} />
              <p style={{ color: 'var(--muted)', marginTop: 16 }}>Connexion à {opLabel}…</p>
            </div>
          )}
          {status === 'pending' && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--coral-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <Icon name="phone" size={26} color="var(--coral)" />
              </div>
              <p style={{ fontWeight: 700, marginTop: 16 }}>Confirmez sur votre téléphone</p>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 4 }}>Entrez votre code PIN {opLabel} pour valider le paiement.</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, fontSize: 12, color: 'var(--muted-2)' }}>
                <div style={{ width: 14, height: 14, border: '2px solid var(--line)', borderTopColor: 'var(--coral)', borderRadius: '50%', animation: 'lun-spin .7s linear infinite' }} /> En attente de confirmation…
              </div>
            </div>
          )}
          {status === 'success' && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(62,196,122,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <Icon name="check" size={30} color="#3ec47a" />
              </div>
              <p style={{ fontWeight: 700, fontSize: 18, marginTop: 16, color: '#2ea862' }}>Paiement confirmé !</p>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 4 }}>Votre commande est en cours de traitement.</p>
              <Link to="/compte/commandes" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>Voir mes commandes</Link>
            </div>
          )}
          {status === 'failed' && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--coral-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <Icon name="close" size={28} color="var(--coral)" />
              </div>
              <p style={{ fontWeight: 700, marginTop: 16, color: 'var(--coral-deep)' }}>Paiement échoué</p>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 4 }}>{error}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={initiate} className="btn btn-primary" style={{ flex: 1 }}>Réessayer</button>
                <Link to="/commande" className="btn btn-ghost" style={{ flex: 1 }}>Changer</Link>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, fontSize: 12, color: 'var(--muted)' }}>
          <Icon name="shield" size={15} color="var(--gold)" /> Transaction sécurisée via {opLabel}
        </div>
      </div>
      <style>{`@keyframes lun-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
