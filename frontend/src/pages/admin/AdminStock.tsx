import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { productsService } from '@/services/products.service'
import type { Product } from '@/types'

interface Movement {
  _id: string
  type: 'IN' | 'OUT' | 'ADJUST'
  quantity: number
  resultingStock: number
  reason?: string
  createdAt: string
  product?: { _id: string; name: string } | string
}

const TYPE_LABEL: Record<string, string> = { IN: 'Entrée', OUT: 'Sortie', ADJUST: 'Ajustement' }
const TYPE_COLOR: Record<string, string> = { IN: '#3ec47a', OUT: 'var(--coral)', ADJUST: 'var(--gold)' }

export default function AdminStock() {
  const [products, setProducts] = useState<Product[]>([])
  const [lowStock, setLowStock] = useState<Product[]>([])
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ product: '', type: 'IN' as 'IN' | 'OUT' | 'ADJUST', quantity: '1', reason: '' })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [pRes, lowRes, movRes] = await Promise.all([
        productsService.getAll({ page: 1, limit: 100 }),
        api.get<Product[]>('/stock/low'),
        api.get<Movement[]>('/stock/movements'),
      ])
      setProducts((pRes.data as any)?.data ?? [])
      setLowStock(lowRes.data ?? [])
      setMovements(movRes.data ?? [])
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur chargement stock')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openMovement = (productId?: string) => {
    setForm({ product: productId ?? '', type: 'IN', quantity: '1', reason: '' })
    setModalOpen(true)
  }

  const onSave = async () => {
    setLoading(true)
    setError(null)
    try {
      await api.post('/stock/movements', {
        product: form.product,
        type: form.type,
        quantity: Number(form.quantity),
        reason: form.reason,
      })
      setModalOpen(false)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Erreur enregistrement mouvement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lun-admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0 }}>Gestion du stock</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{products.length} produit{products.length > 1 ? 's' : ''} · {lowStock.length} en alerte</div>
        </div>
        <button className="btn btn-primary" onClick={() => openMovement()} style={{ whiteSpace: 'nowrap' }}>
          <Icon name="plus" size={17} color="#fff" /> Mouvement de stock
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(255,45,142,.08)', color: 'var(--coral-deep)', border: '1px solid rgba(255,45,142,.25)', padding: '10px 14px', borderRadius: 'var(--r-md)', marginBottom: 16 }}>{error}</div>
      )}

      {/* Alertes stock bas */}
      {lowStock.length > 0 && (
        <div style={{ background: 'rgba(255,45,142,.06)', border: '1px solid rgba(255,45,142,.22)', borderRadius: 'var(--r-lg)', padding: '16px 20px', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontWeight: 700, color: 'var(--coral-deep)' }}>
            <Icon name="bell" size={18} color="var(--coral-deep)" /> Stock bas — {lowStock.length} produit(s) à réapprovisionner
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {lowStock.map((p) => (
              <span key={p._id} className="tag" style={{ background: 'var(--paper)', color: 'var(--coral-deep)', fontWeight: 600 }}>
                {p.name} · {p.stock ?? 0} restant{(p.stock ?? 0) > 1 ? 's' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Inventaire produits */}
      <div className="lun-table" style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr 1fr 130px', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Produit</span><span>Stock</span><span>Seuil</span><span></span>
        </div>
        {products.map((p, i) => {
          const low = (p.stock ?? 0) <= ((p as any).lowStockThreshold ?? 5)
          return (
            <div key={p._id} style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr 1fr 130px', alignItems: 'center', padding: '12px 24px', borderBottom: i < products.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14 }}>
              <span className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</span>
              <span style={{ fontWeight: 700, color: low ? 'var(--coral)' : 'var(--ink)' }}>{p.stock ?? 0}{low && ' ⚠'}</span>
              <span style={{ color: 'var(--muted)' }}>{(p as any).lowStockThreshold ?? 5}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => openMovement(p._id)} style={{ justifySelf: 'start' }}>Ajuster</button>
            </div>
          )
        })}
        {!loading && products.length === 0 && <div style={{ padding: 24, color: 'var(--muted)' }}>Aucun produit</div>}
      </div>

      {/* Historique des mouvements */}
      <h2 className="display" style={{ fontSize: 22, margin: '0 0 14px' }}>Historique des mouvements</h2>
      <div className="lun-table" style={{ background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', padding: '14px 24px', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
          <span>Produit</span><span>Type</span><span>Qté</span><span>Stock après</span><span>Date</span>
        </div>
        {movements.map((m, i) => (
          <div key={m._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', alignItems: 'center', padding: '12px 24px', borderBottom: i < movements.length - 1 ? '1px solid var(--line-2)' : 'none', fontSize: 14 }}>
            <span>{typeof m.product === 'object' ? m.product?.name : '—'}</span>
            <span className="tag" style={{ background: 'var(--ivory-2)', color: TYPE_COLOR[m.type], fontWeight: 700, justifySelf: 'start' }}>{TYPE_LABEL[m.type]}</span>
            <span style={{ fontWeight: 600 }}>{m.type === 'OUT' ? '−' : m.type === 'IN' ? '+' : '='}{m.quantity}</span>
            <span style={{ fontWeight: 700 }}>{m.resultingStock}</span>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>{new Date(m.createdAt).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
        {!loading && movements.length === 0 && <div style={{ padding: 24, color: 'var(--muted)' }}>Aucun mouvement enregistré</div>}
      </div>

      {/* Modal mouvement */}
      {modalOpen && (
        <div onClick={() => setModalOpen(false)} role="dialog" aria-modal="true" aria-label="Ajuster le stock" style={{ position: 'fixed', inset: 0, background: 'rgba(43,20,36,.55)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, background: 'var(--paper)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)', boxShadow: 'var(--sh-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="display" style={{ fontSize: 24, margin: 0 }}>Mouvement de stock</h2>
              <button onClick={() => setModalOpen(false)} className="btn btn-ghost btn-sm">Fermer</button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                Produit
                <select value={form.product} onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))} className="field">
                  <option value="">— Choisir un produit —</option>
                  {products.map((p) => <option key={p._id} value={p._id}>{p.name} (stock: {p.stock ?? 0})</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                Type de mouvement
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))} className="field">
                  <option value="IN">Entrée (réassort)</option>
                  <option value="OUT">Sortie (perte, casse)</option>
                  <option value="ADJUST">Ajustement (valeur d'inventaire exacte)</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                {form.type === 'ADJUST' ? 'Nouvelle quantité en stock' : 'Quantité'}
                <input type="number" min={1} value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} className="field" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
                Motif <span style={{ fontWeight: 400, color: 'var(--muted-2)', fontSize: 12 }}>(facultatif)</span>
                <input value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} className="field" placeholder="Ex: livraison fournisseur" />
              </label>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={onSave} disabled={loading || !form.product || !form.quantity}>{loading ? 'En cours…' : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
