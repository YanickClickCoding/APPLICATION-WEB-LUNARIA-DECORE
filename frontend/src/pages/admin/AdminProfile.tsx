import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToastStore } from '@/stores/useToastStore'
import api from '@/services/api'

export default function AdminProfile() {
  const { user, setUser, logout } = useAuthStore()
  const toast = useToastStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
  })
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const save = useMutation({
    mutationFn: () =>
      api.patch('/users/me', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email || undefined,
      }),
    onSuccess: (r) => { setUser(r.data as never); toast.success('Profil mis à jour') },
    onError: () => toast.error('Erreur', 'Enregistrement impossible.'),
  })

  return (
    <div className="lun-admin-page" style={{ maxWidth: 620 }}>
      <h1 className="display" style={{ fontSize: 36, margin: '0 0 6px' }}>Mon profil</h1>
      <div style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 24 }}>Compte administrateur</div>

      <form onSubmit={(e) => { e.preventDefault(); save.mutate() }}>
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--coral-soft)', color: 'var(--coral-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700 }}>
              {form.firstName?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div>
              <div className="serif" style={{ fontSize: 20, fontWeight: 600 }}>{form.firstName} {form.lastName}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{user?.phone ?? user?.email}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }} className="lun-form-grid">
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
              Prénom
              <input className="field" autoComplete="given-name" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
              Nom
              <input className="field" autoComplete="family-name" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
            </label>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
            Email
            <input type="email" autoComplete="email" className="field" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="admin@lunaria.com" />
          </label>
          {user?.phone && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
              Téléphone
              <input className="field" value={user.phone} disabled style={{ opacity: .55 }} />
              <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>Le numéro ne peut pas être modifié.</span>
            </label>
          )}
        </div>

        <button type="submit" disabled={save.isPending} className="btn btn-primary btn-lg">
          {save.isPending ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
      </form>

      {/* Déconnexion */}
      <div className="card" style={{ padding: 24, marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Se déconnecter</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Fermer votre session administrateur.</div>
        </div>
        <button
          onClick={() => { logout(); navigate('/') }}
          className="btn"
          style={{ background: 'rgba(255,45,142,.1)', color: 'var(--coral-deep)', whiteSpace: 'nowrap' }}
        >
          <Icon name="logout" size={17} color="var(--coral-deep)" /> Déconnexion
        </button>
      </div>
    </div>
  )
}
