import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import { useToastStore } from '@/stores/useToastStore'
import api from '@/services/api'

/**
 * Monté au niveau racine : connecte le socket de chat quand l'utilisateur
 * est authentifié, charge le total de non-lus et affiche un toast à chaque
 * nouveau message reçu (pastille globale dans navbar/sidebar).
 */
export default function ChatListener() {
  const { isAuthenticated, accessToken } = useAuthStore()
  const { connect, disconnect, setUnreadTotal, setOnNotif } = useChatStore()
  const toast = useToastStore()

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnect()
      return
    }

    connect(accessToken)

    // Charger le compteur initial de non-lus
    api.get<{ total: number }>('/conversations/unread')
      .then((r) => setUnreadTotal(r.data.total))
      .catch(() => {})

    // Toast à chaque notif entrante
    setOnNotif((notif) => {
      toast.info(
        notif.from === 'agent' ? 'Nouveau message de LUNARIA' : 'Nouveau message client',
        notif.preview,
      )
    })

    return () => setOnNotif(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, accessToken])

  return null
}
