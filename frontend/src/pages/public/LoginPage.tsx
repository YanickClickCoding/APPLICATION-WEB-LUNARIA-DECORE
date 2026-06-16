import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import Icon from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/useAuthStore'
import { authService } from '@/services/auth.service'
import { HERO } from '@/utils/images'

export default function LoginPage() {
  const [tab, setTab] = useState<'password' | 'otp'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { data } = await authService.login({ email, password })
      setAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken)
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/')
    } catch { setError('Email ou mot de passe incorrect.') } finally { setLoading(false) }
  }
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try { await authService.sendOtp(phone); setOtpSent(true) }
    catch { setError('Numéro invalide ou service indisponible.') } finally { setLoading(false) }
  }
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { data } = await authService.verifyOtp(phone, otp)
      setAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken)
      navigate('/')
    } catch { setError('Code incorrect ou expiré.') } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }} className="lun-auth">
      {/* Visuel gauche */}
      <div className="lun-auth-visual" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--surface-dark)' }}>
        <img src={HERO.valentine} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .55 }} />
        <div style={{ position: 'absolute', inset: 0, padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(to top, rgba(43,20,36,.7), transparent)' }}>
          <Logo color="#fff" mark="var(--gold)" />
          <div>
            <h2 className="display" style={{ fontSize: 44, color: '#fff', lineHeight: 1.05 }}>Bon retour parmi<br />nous.</h2>
            <p style={{ color: 'rgba(255,255,255,.7)', marginTop: 14, maxWidth: 360 }}>Retrouvez vos commandes, vos événements et discutez avec notre équipe.</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'var(--ivory)' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div className="lun-auth-logo" style={{ display: 'none', justifyContent: 'center', marginBottom: 24 }}><Logo /></div>
          <div className="eyebrow">Connexion</div>
          <h1 className="display" style={{ fontSize: 40, margin: '10px 0 26px' }}>Se connecter</h1>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--ivory-2)', borderRadius: 'var(--r-pill)', padding: 4, marginBottom: 24 }}>
            {(['password', 'otp'] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
                  background: tab === t ? 'var(--paper)' : 'transparent', color: tab === t ? 'var(--ink)' : 'var(--muted)', boxShadow: tab === t ? 'var(--sh-sm)' : 'none' }}>
                {t === 'password' ? 'Email / Mot de passe' : 'Code SMS'}
              </button>
            ))}
          </div>

          {tab === 'password' ? (
            <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="votre@email.com" />
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="field" placeholder="••••••••" style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                    <Icon name="eye" size={17} color="var(--muted-2)" />
                  </button>
                </div>
              </div>
              {error && <p style={{ color: 'var(--coral)', fontSize: 13.5 }}>{error}</p>}
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Téléphone</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} className="field" placeholder="+229 XX XX XX XX" />
              </div>
              {otpSent && (
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Code reçu par SMS</label>
                  <input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="field" placeholder="123456" />
                  <button type="button" onClick={() => setOtpSent(false)} style={{ fontSize: 12, color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}>Changer le numéro</button>
                </div>
              )}
              {error && <p style={{ color: 'var(--coral)', fontSize: 13.5 }}>{error}</p>}
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                {loading ? '…' : otpSent ? 'Vérifier le code' : 'Recevoir le code'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 24 }}>
            Pas encore de compte ? <Link to="/inscription" style={{ color: 'var(--coral)', fontWeight: 600, textDecoration: 'none' }}>S'inscrire</Link>
          </p>
        </div>
      </div>

      <style>{`@media (max-width: 860px) { .lun-auth-visual { display: none !important; } .lun-auth-logo { display: flex !important; } }`}</style>
    </div>
  )
}
