import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToastStore } from '@/stores/useToastStore'
import api from '@/services/api'

/**
 * Gestion des favoris : ajoute/retire un produit et synchronise le store auth.
 * Les endpoints backend renvoient { favorites: string[] }.
 */
export function useFavorites() {
  const { user, setUser, isAuthenticated } = useAuthStore()
  const toast = useToastStore()
  const navigate = useNavigate()
  const [pending, setPending] = useState<string | null>(null)

  const favorites = user?.favorites ?? []
  const isFavorite = (productId: string) => favorites.includes(productId)

  const toggle = async (productId: string) => {
    if (!isAuthenticated || !user) {
      toast.info?.('Connexion requise', 'Connectez-vous pour ajouter aux favoris.')
      navigate('/connexion')
      return
    }
    // Un admin n'est pas un client : pas de favoris sur son compte
    if (user.role === 'ADMIN') {
      toast.info?.('Compte administrateur', 'Les favoris sont réservés aux comptes clients.')
      return
    }
    if (pending) return
    const currentlyFav = isFavorite(productId)
    setPending(productId)
    try {
      const res = currentlyFav
        ? await api.delete<{ favorites: string[] }>(`/users/me/favorites/${productId}`)
        : await api.patch<{ favorites: string[] }>(`/users/me/favorites/${productId}`)
      const newFavorites = res.data?.favorites ?? []
      setUser({ ...user, favorites: newFavorites })
      toast.success(currentlyFav ? 'Retiré des favoris' : 'Ajouté aux favoris')
    } catch {
      toast.error('Erreur', 'Action impossible pour le moment.')
    } finally {
      setPending(null)
    }
  }

  return { favorites, isFavorite, toggle, pending }
}
