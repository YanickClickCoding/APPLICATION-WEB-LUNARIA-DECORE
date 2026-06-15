import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import Icon from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/useAuthStore'
import { authService } from '@/services/auth.service'
import { HERO } from '@/utils/images'

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas'); return }
    if (form.password.length < 6) { setError('Mot de passe trop court (6 caractères min.)'); return }
    setLoading(true); setError('')
    try {
      const { data } = await authService.register({
        firstName: form.firstName, lastName: form.lastName,
        email: form.email || undefined, phone: form.phone, password: form.password,
      })
      setAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken)
      navigate('/')
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erreur lors de l\'inscription')
    } finally { setLoading(false) }
  }

  const lbl = { fontSize: 12.5, fontWeight: 600 as const, color: 'var(--muted)', display: 'block', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }} className="lun-auth">
      <div className="lun-auth-visual" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--night)' }}>
        <img src={HERO.wedding} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .55 }} />
        <div style={{ position: 'absolute', inset: 0, padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(to top, rgba(43,20,36,.7), transparent)' }}>
          <Logo color="#fff" mark="var(--gold)" />
          <div>
            <h2 className="display" style={{ fontSize: 44, color: '#fff', lineHeight: 1.05 }}>Créons ensemble<br />vos plus beaux moments.</h2>
            <p style={{ color: 'rgba(255,255,255,.7)', marginTop: 14, maxWidth: 360 }}>Rejoignez LUNARIA et bénéficiez de -10% sur votre première commande.</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'var(--ivory)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="lun-auth-logo" style={{ display: 'none', justifyContent: 'center', marginBottom: 24 }}><Logo /></div>
          <div className="eyebrow">Inscription</div>
          <h1 className="display" style={{ fontSize: 38, margin: '10px 0 24px' }}>Créer mon compte</h1>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={lbl}>Prénom</label><input required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className="field" placeholder="Rosine" /></div>
              <div><label style={lbl}>Nom</label><input required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className="field" placeholder="Akpovi" /></div>
            </div>
            <div><label style={lbl}>Téléphone (MTN/Moov)</label><input type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} className="field" placeholder="+229 XX XX XX XX" /></div>
            <div><label style={lbl}>Email (optionnel)</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="field" placeholder="votre@email.com" /></div>
            <div>
              <label style={lbl}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} required minLength={6} value={form.password} onChange={(e) => set('password', e.target.value)} className="field" placeholder="••••••••" style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <Icon name="eye" size={17} color="var(--muted-2)" />
                </button>
              </div>
            </div>
            <div><label style={lbl}>Confirmer le mot de passe</label><input type={showPwd ? 'text' : 'password'} required value={form.confirm} onChange={(e) => set('confirm', e.target.value)} className="field" placeholder="••••••••" /></div>
            {error && <p style={{ color: 'var(--coral)', fontSize: 13.5 }}>{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }}>
              {loading ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 22 }}>
            Déjà un compte ? <Link to="/connexion" style={{ color: 'var(--coral)', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
          </p>
        </div>
      </div>

      <style>{`@media (max-width: 860px) { .lun-auth-visual { display: none !important; } .lun-auth-logo { display: flex !important; } }`}</style>
    </div>
  )
}
