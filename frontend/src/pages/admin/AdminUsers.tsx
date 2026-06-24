import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'
import type { User } from '@/types'

const lbl = { fontSize: 12.5, fontWeight: 600 as const, color: 'var(--muted)', marginBottom: 6, display: 'block' }

function AddClientForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const toast = useToastStore()
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', password: '' })
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const save = useMutation({
    mutationFn: () => api.post('/auth/register', {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email || undefined,
      password: form.password,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Client ajouté'); onClose() },
    onError: (e: { response?: { data?: { message?: string | string[] } } }) => {
      const m = e?.response?.data?.message
      toast.error('Erreur', Array.isArray(m) ? m[0] : (m ?? 'Création impossible (téléphone/email déjà utilisé ?)'))
    },
  })

  const valid = form.firstName && form.lastName && form.phone && form.password.length >= 6

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label="Ajouter un client"
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(43,20,36,.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--sh-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--line-2)' }}>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 600 }}>Ajouter un client</h2>
          <button onClick={onClose} aria-label="Fermer" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--muted)' }}><Icon name="close" size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (valid) save.mutate() }} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Prénom *</label><input required className="field" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="Aïcha" /></div>
            <div><label style={lbl}>Nom *</label><input required className="field" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} placeholder="Hounkpati" /></div>
          </div>
          <div><label style={lbl}>Téléphone *</label><input required className="field" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+229 97 00 00 00" /></div>
          <div><label style={lbl}>Email</label><input type="email" className="field" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="client@email.com" /></div>
          <div><label style={lbl}>Mot de passe * (min. 6)</label><input type="password" required className="field" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="••••••" /></div>
          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Annuler</button>
            <button type="submit" disabled={!valid || save.isPending} className="btn btn-primary" style={{ flex: 1, opacity: (!valid || save.isPending) ? .55 : 1 }}>
              {save.isPending ? 'Ajout…' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const qc = useQueryClient()
  const toast = useToastStore()
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: () => api.get<User[]>('/users?limit=100').then((r) => r.data),
  })

  const toggle = useMutation({
    mutationFn: (id: string) => api.patch(`/users/${id}/toggle`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }) },
  })

  const users = (data ?? []).filter((u) =>
    !search || `${u.firstName} ${u.lastName} ${u.phone} ${u.email ?? ''}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, gap: 14 }}>
        <div>
          <div className="eyebrow">Gestion</div>
          <h1 className="display" style={{ fontSize: 36, margin: '6px 0 0' }}>Clients</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 4 }}>{data?.length ?? 0} client{(data?.length ?? 0) > 1 ? 's' : ''}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Icon name="plus" size={17} color="#fff" /> Ajouter un client
        </button>
      </div>

      <div style={{ position: 'relative', maxWidth: 360, marginBottom: 18 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><Icon name="search" size={16} color="var(--muted-2)" /></span>
        <input className="field" style={{ paddingLeft: 40 }} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un client…" />
      </div>

      <div style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 110px 120px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Client</span><span>Contact</span><span>Inscription</span><span>Statut</span><span></span>
        </div>

        {isLoading ? (
          <div style={{ padding: 28, textAlign: 'center', color: 'var(--muted)' }}>Chargement…</div>
        ) : users.length === 0 ? (
          <div style={{ padding: 28, textAlign: 'center', color: 'var(--muted)' }}>Aucun client</div>
        ) : (
          users.map((u, i) => (
            <div key={u._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 110px 120px', alignItems: 'center', padding: '14px 24px', borderBottom: i < users.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--coral-soft)', color: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  {u.firstName?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                  {u.isVerified && <div style={{ fontSize: 11.5, color: '#2c9c5e' }}>✓ Vérifié</div>}
                </div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>{u.phone}</div>
                {u.email && <div style={{ color: 'var(--muted-2)', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>}
              </div>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className="tag" style={{ background: u.isActive === false ? 'var(--coral-soft)' : 'rgba(62,196,122,.12)', color: u.isActive === false ? 'var(--coral-deep)' : '#2c9c5e', fontWeight: 700, justifySelf: 'start' }}>
                ● {u.isActive === false ? 'Désactivé' : 'Actif'}
              </span>
              <button onClick={() => toggle.mutate(u._id)} className="btn btn-ghost btn-sm" style={{ justifySelf: 'start', fontSize: 12.5, padding: '7px 12px' }}>
                {u.isActive === false ? 'Réactiver' : 'Désactiver'}
              </button>
            </div>
          ))
        )}
      </div>

      {showForm && <AddClientForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
