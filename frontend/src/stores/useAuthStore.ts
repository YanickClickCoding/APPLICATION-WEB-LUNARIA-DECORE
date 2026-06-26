import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { useCartStore } from './useCartStore'
import { cartService } from '@/services/cart.service'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        // Capture le panier invité avant de basculer en mode connecté
        const guestItems = useCartStore.getState().items
        set({ user, accessToken, refreshToken, isAuthenticated: true })
        // Fusionne le panier invité dans celui du compte, puis réhydrate depuis le serveur.
        // (le token est déjà en localStorage : l'intercepteur API l'enverra)
        cartService
          .merge(guestItems)
          .then((serverItems) => useCartStore.getState().setItems(serverItems))
          .catch(() => useCartStore.getState().hydrateFromServer())
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        // On bascule en non-connecté AVANT de vider, pour ne pas envoyer
        // de requête DELETE /cart au serveur (le panier reste en base).
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
        useCartStore.getState().setItems([])
      },
    }),
    {
      name: 'lunaria-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
