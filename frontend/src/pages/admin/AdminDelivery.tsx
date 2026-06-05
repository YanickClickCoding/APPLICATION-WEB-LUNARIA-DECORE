import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Truck, UserCheck } from 'lucide-react'
import api from '@/services/api'

const STATUS_COLOR: Record<string, string> = {
  EN_ATTENTE: 'text-yellow-400 bg-yellow-400/10',
  ASSIGNE:    'text-blue-400 bg-blue-400/10',
  RECUPERE:   'text-purple-400 bg-purple-400/10',
  EN_ROUTE:   'text-orange-400 bg-orange-400/10',
  LIVRE:      'text-emerald-400 bg-emerald-400/10',
  ECHEC:      'text-red-400 bg-red-400/10',
}
const STATUS_LABELS: Record<string, string> = { EN_ATTENTE: 'En attente', ASSIGNE: 'Assigné', RECUPERE: 'Récupéré', EN_ROUTE: 'En route', LIVRE: 'Livré', ECHEC: 'Échoué' }

interface Delivery { _id: string; order: { orderNumber: string; total: number }; livreur?: { firstName: string; lastName: string }; status: string; estimatedDate: string; address: { quartier: string; ville: string } }

export default function AdminDelivery() {
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery<{ data: Delivery[] }>({
    queryKey: ['admin-deliveries', statusFilter],
    queryFn: () => api.get('/delivery', { params: { limit: 30, status: statusFilter || undefined } }).then((r) => r.data),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/delivery/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-deliveries'] }),
  })

  const deliveries = data?.data ?? []

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div><p className="text-[#C9A96E] text-xs tracking-widest uppercase mb-1">Gestion</p>
          <h1 className="font-heading text-3xl text-white font-light">Livraisons</h1></div>
        <div className="flex items-center gap-2 bg-[#160D2B] border border-white/10 rounded-xl px-3 py-2">
          <Truck size={14} className="text-[#C9A96E]" />
          <span className="text-white/60 text-sm">{deliveries.length} livraison{deliveries.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[{ v: '', l: 'Toutes' }, ...Object.entries(STATUS_LABELS).map(([v, l]) => ({ v, l }))].map(({ v, l }) => (
          <button key={v} onClick={() => setStatusFilter(v)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === v ? 'bg-[#C9A96E] text-[#0D0618] font-semibold' : 'border border-white/15 text-white/40 hover:border-[#C9A96E]/40'}`}>{l}</button>
        ))}
      </div>

      <div className="bg-[#160D2B] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/5">
            {['Commande', 'Adresse', 'Livreur', 'Date prévue', 'Statut', 'Action'].map((h) => (
              <th key={h} className="text-left text-white/25 text-xs font-medium tracking-wider px-5 py-3 uppercase">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {isLoading ? <tr><td colSpan={6} className="py-12 text-center"><Loader2 size={20} className="animate-spin text-[#C9A96E] mx-auto" /></td></tr>
            : deliveries.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-white/25 text-sm">Aucune livraison</td></tr>
            : deliveries.map((d) => (
              <tr key={d._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="px-5 py-4 text-[#C9A96E] text-sm font-mono">{d.order?.orderNumber}</td>
                <td className="px-5 py-4 text-white/60 text-sm">
                  {(d.address as { quartier?: string; ville?: string })?.quartier}, {(d.address as { quartier?: string; ville?: string })?.ville}
                </td>
                <td className="px-5 py-4">
                  {d.livreur ? (
                    <span className="flex items-center gap-1.5 text-white/70 text-sm"><UserCheck size={13} className="text-emerald-400" />{d.livreur.firstName}</span>
                  ) : <span className="text-white/25 text-sm italic">Non assigné</span>}
                </td>
                <td className="px-5 py-4 text-white/40 text-xs">
                  {d.estimatedDate ? new Date(d.estimatedDate).toLocaleDateString('fr-FR') : '—'}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[d.status] ?? 'text-white/40 bg-white/5'}`}>
                    {STATUS_LABELS[d.status] ?? d.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {d.status === 'EN_ATTENTE' && (
                    <button onClick={() => updateStatus.mutate({ id: d._id, status: 'ASSIGNE' })}
                      className="text-xs text-[#C9A96E] hover:underline">Assigner</button>
                  )}
                  {d.status === 'ASSIGNE' && (
                    <button onClick={() => updateStatus.mutate({ id: d._id, status: 'EN_ROUTE' })}
                      className="text-xs text-orange-400 hover:underline">→ En route</button>
                  )}
                  {d.status === 'EN_ROUTE' && (
                    <button onClick={() => updateStatus.mutate({ id: d._id, status: 'LIVRE' })}
                      className="text-xs text-emerald-400 hover:underline">✓ Livré</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
