import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Logo from '@/components/ui/Logo'
import Icon from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/useAuthStore'
import { authService } from '@/services/auth.service'
import { HERO } from '@/utils/images'

type Mode = 'login' | 'signup'

const lbl = { fontSize: 12.5, fontWeight: 600 as const, color: 'var(--muted)', display: 'block', marginBottom: 6 }

export default function AuthPage({ initialMode = 'login' }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const reduce = useReducedMotion()

  // Login — onglet email/mot de passe ou code SMS
  const [tab, setTab] = useState<'password' | 'otp'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  // Signup
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' })
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const switchMode = (m: Mode) => {
    setMode(m)
    setError('')
    setShowPwd(false)
    // garde l'URL cohérente avec le mode affiché, sans recharger la page
    navigate(m === 'login' ? '/connexion' : '/inscription', { replace: true })
  }

  // ── Handlers login ─────────────────────────────────────────────
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

  // ── Handler signup ─────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
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

  const isLogin = mode === 'login'
  const panel = isLogin
    ? { img: HERO.valentine, title: <>Bon retour parmi<br />nous.</>, desc: 'Retrouvez vos commandes, vos événements et discutez avec notre équipe.' }
    : { img: HERO.wedding, title: <>Créons ensemble<br />vos plus beaux moments.</>, desc: 'Rejoignez LUNARIA et bénéficiez de -10% sur votre première commande.' }

  const anim = reduce
    ? {}
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.22, ease: 'easeOut' as const } }

  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden' }} className="lun-auth">
      {/* Visuel gauche — crossfade selon le mode */}
      <div className="lun-auth-visual" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--surface-dark)' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={panel.img}
            src={panel.img} alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .55 }}
            initial={reduce ? undefined : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: .55 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <div style={{ position: 'absolute', inset: 0, padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(to top, rgba(43,20,36,.7), transparent)' }}>
          <Link to="/" aria-label="Retour à l'accueil LUNARIA" style={{ alignSelf: 'flex-start' }}><Logo color="#fff" mark="var(--gold)" /></Link>
          <AnimatePresence mode="wait">
            <motion.div key={mode} {...anim}>
              <h2 className="display" style={{ fontSize: 44, color: '#fff', lineHeight: 1.05 }}>{panel.title}</h2>
              <p style={{ color: 'rgba(255,255,255,.7)', marginTop: 14, maxWidth: 360 }}>{panel.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Formulaire */}
      <div style={{ flex: 1, height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '24px 32px', background: 'var(--ivory)' }}>
        <div style={{ width: '100%', maxWidth: isLogin ? 400 : 420, margin: 'auto 0' }}>
          <div className="lun-auth-logo" style={{ display: 'none', justifyContent: 'center', marginBottom: 24 }}><Link to="/" aria-label="Retour à l'accueil LUNARIA"><Logo /></Link></div>

          {/* Bascule Connexion / Inscription */}
          <div role="tablist" aria-label="Connexion ou inscription"
            style={{ display: 'flex', background: 'var(--ivory-2)', borderRadius: 'var(--r-pill)', padding: 4, marginBottom: 18 }}>
            {(['login', 'signup'] as const).map((m) => (
              <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => switchMode(m)}
                style={{ flex: 1, padding: '11px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  background: mode === m ? 'var(--paper)' : 'transparent', color: mode === m ? 'var(--ink)' : 'var(--muted)', boxShadow: mode === m ? 'var(--sh-sm)' : 'none', transition: 'background .18s, color .18s' }}>
                {m === 'login' ? 'Se connecter' : "S'inscrire"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={mode} {...anim}>
              {isLogin ? (
                <>
                  <div className="eyebrow">Connexion</div>
                  <h1 className="display" style={{ fontSize: 34, margin: '6px 0 18px' }}>Bon retour</h1>

                  {/* Onglets email / SMS */}
                  <div style={{ display: 'flex', background: 'var(--ivory-2)', borderRadius: 'var(--r-pill)', padding: 4, marginBottom: 22 }}>
                    {(['password', 'otp'] as const).map((t) => (
                      <button key={t} type="button" onClick={() => { setTab(t); setError('') }}
                        style={{ flex: 1, padding: '9px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                          background: tab === t ? 'var(--paper)' : 'transparent', color: tab === t ? 'var(--ink)' : 'var(--muted)', boxShadow: tab === t ? 'var(--sh-sm)' : 'none' }}>
                        {t === 'password' ? 'Email / Mot de passe' : 'Code SMS'}
                      </button>
                    ))}
                  </div>

                  {tab === 'password' ? (
                    <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={lbl}>Email</label>
                        <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="votre@email.com" />
                      </div>
                      <div>
                        <label style={lbl}>Mot de passe</label>
                        <div style={{ position: 'relative' }}>
                          <input type={showPwd ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field" placeholder="••••••••" style={{ paddingRight: 44 }} />
                          <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                            <Icon name="eye" size={17} color="var(--muted-2)" />
                          </button>
                        </div>
                      </div>
                      {error && <p role="alert" style={{ color: 'var(--coral)', fontSize: 13.5 }}>{error}</p>}
                      <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        {loading ? 'Connexion…' : 'Se connecter'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={lbl}>Téléphone</label>
                        <input type="tel" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} className="field" placeholder="+229 XX XX XX XX" />
                      </div>
                      {otpSent && (
                        <div>
                          <label style={lbl}>Code reçu par SMS</label>
                          <input type="text" inputMode="numeric" autoComplete="one-time-code" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="field" placeholder="123456" />
                          <button type="button" onClick={() => setOtpSent(false)} style={{ fontSize: 12, color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}>Changer le numéro</button>
                        </div>
                      )}
                      {error && <p role="alert" style={{ color: 'var(--coral)', fontSize: 13.5 }}>{error}</p>}
                      <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        {loading ? '…' : otpSent ? 'Vérifier le code' : 'Recevoir le code'}
                      </button>
                    </form>
                  )}

                  <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 24 }}>
                    Pas encore de compte ?{' '}
                    <button type="button" onClick={() => switchMode('signup')} style={{ color: 'var(--coral)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}>S'inscrire</button>
                  </p>
                </>
              ) : (
                <>
                  <div className="eyebrow">Inscription</div>
                  <h1 className="display" style={{ fontSize: 34, margin: '6px 0 16px' }}>Créer mon compte</h1>

                  <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div><label style={lbl}>Prénom</label><input autoComplete="given-name" required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className="field" placeholder="Rosine" /></div>
                      <div><label style={lbl}>Nom</label><input autoComplete="family-name" required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className="field" placeholder="Akpovi" /></div>
                    </div>
                    <div><label style={lbl}>Téléphone (MTN/Moov)</label><input type="tel" autoComplete="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} className="field" placeholder="+229 XX XX XX XX" /></div>
                    <div><label style={lbl}>Email (optionnel)</label><input type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="field" placeholder="votre@email.com" /></div>
                    <div>
                      <label style={lbl}>Mot de passe</label>
                      <div style={{ position: 'relative' }}>
                        <input type={showPwd ? 'text' : 'password'} autoComplete="new-password" required minLength={6} value={form.password} onChange={(e) => set('password', e.target.value)} className="field" placeholder="••••••••" style={{ paddingRight: 44 }} />
                        <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                          <Icon name="eye" size={17} color="var(--muted-2)" />
                        </button>
                      </div>
                    </div>
                    <div><label style={lbl}>Confirmer le mot de passe</label><input type={showPwd ? 'text' : 'password'} autoComplete="new-password" required value={form.confirm} onChange={(e) => set('confirm', e.target.value)} className="field" placeholder="••••••••" /></div>
                    {error && <p role="alert" style={{ color: 'var(--coral)', fontSize: 13.5 }}>{error}</p>}
                    <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }}>
                      {loading ? 'Création…' : 'Créer mon compte'}
                    </button>
                  </form>

                  <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 16 }}>
                    Déjà un compte ?{' '}
                    <button type="button" onClick={() => switchMode('login')} style={{ color: 'var(--coral)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}>Se connecter</button>
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`@media (max-width: 860px) { .lun-auth-visual { display: none !important; } .lun-auth-logo { display: flex !important; } }`}</style>
    </div>
  )
}
