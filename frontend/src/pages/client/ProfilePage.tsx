import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToastStore } from '@/stores/useToastStore'
import { AccountSidebar } from './AccountPage'
import api from '@/services/api'

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const toast = useToastStore()
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', email: user?.email ?? '',
    quartier: user?.address?.quartier ?? '', ville: user?.address?.ville ?? '', commune: user?.address?.commune ?? '', indications: user?.address?.indications ?? '',
  })
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const save = useMutation({
    mutationFn: () => api.patch('/users/me', {
      firstName: form.firstName, lastName: form.lastName, email: form.email || undefined,
      address: { quartier: form.quartier, ville: form.ville, commune: form.commune, indications: form.indications },
    }),
    onSuccess: (r) => { setUser(r.data as never); toast.success('Profil mis à jour') },
    onError: () => toast.error('Erreur', 'Enregistrement impossible.'),
  })

  const lbl = { fontSize: 12.5, fontWeight: 600 as const, color: 'var(--muted)', marginBottom: 6, display: 'block' }

  return (
    <div className="lun-acc">
      <AccountSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 className="display" style={{ fontSize: 40, margin: '0 0 24px' }}>Mon profil</h1>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate() }}>
          <div className="lun-profile-cards">
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}><Icon name="user" size={16} color="var(--coral)" /><h2 className="serif" style={{ fontSize: 20, fontWeight: 600 }}>Informations personnelles</h2></div>
              <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div><label style={lbl}>Prénom</label><input className="field" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} /></div>
                <div><label style={lbl}>Nom</label><input className="field" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} /></div>
              </div>
              <div style={{ marginBottom: 14 }}><label style={lbl}>Email</label><input type="email" className="field" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="votre@email.com" /></div>
              <div><label style={lbl}>Téléphone</label><input className="field" value={user?.phone ?? ''} disabled style={{ opacity: .5 }} /><p style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 6 }}>Le numéro ne peut pas être modifié.</p></div>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}><Icon name="pin" size={16} color="var(--coral)" /><h2 className="serif" style={{ fontSize: 20, fontWeight: 600 }}>Adresse de livraison</h2></div>
              <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div><label style={lbl}>Quartier</label><input className="field" value={form.quartier} onChange={(e) => set('quartier', e.target.value)} placeholder="Fidjrossè" /></div>
                <div><label style={lbl}>Ville</label><input className="field" value={form.ville} onChange={(e) => set('ville', e.target.value)} /></div>
              </div>
              <div style={{ marginBottom: 14 }}><label style={lbl}>Commune</label><input className="field" value={form.commune} onChange={(e) => set('commune', e.target.value)} /></div>
              <div><label style={lbl}>Repère / instructions</label><input className="field" value={form.indications} onChange={(e) => set('indications', e.target.value)} placeholder="Près du carrefour…" /></div>
            </div>
          </div>
          <button type="submit" disabled={save.isPending} className="btn btn-primary btn-lg" style={{ marginTop: 20 }}>
            {save.isPending ? 'Enregistrement…' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  )
}
