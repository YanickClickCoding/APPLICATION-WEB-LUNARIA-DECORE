import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, DecorationService } from '@/types'
import { cartService } from '@/services/cart.service'
import { useAuthStore } from './useAuthStore'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  total: number
  itemCount: number
  addProduct: (product: Product, quantity?: number) => void
  addService: (service: DecorationService, options?: string[]) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clear: () => void
  setItems: (items: CartItem[]) => void
  hydrateFromServer: () => Promise<void>
  openCart: () => void
  closeCart: () => void
}

const calcTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

const calcCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0)

const isAuthed = () => useAuthStore.getState().isAuthenticated

/**
 * Pousse l'état courant vers le backend si l'utilisateur est connecté.
 * Le serveur est la source de vérité : on réhydrate avec sa réponse.
 * En cas d'échec réseau, on conserve l'état optimiste local.
 */
const syncToServer = (items: CartItem[], set: (p: Partial<CartState>) => void) => {
  if (!isAuthed()) return
  cartService
    .set(items)
    .then((serverItems) =>
      set({
        items: serverItems,
        total: calcTotal(serverItems),
        itemCount: calcCount(serverItems),
      }),
    )
    .catch(() => {
      /* hors-ligne : on garde l'état optimiste local */
    })
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,
      itemCount: 0,

      addProduct: (product, quantity = 1) => {
        const items = get().items
        const incomingId = product?._id ?? (product as any)?.id
        const existing = incomingId
          ? items.find((i) => i.product?._id === incomingId)
          : undefined

        let updated: CartItem[]
        if (existing) {
          updated = items.map((i) =>
            i.product?._id === incomingId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        } else {
          updated = [
            ...items,
            {
              _id: `cart-${Date.now()}`,
              product,
              quantity,
              price: product.price,
            },
          ]
        }

        set({
          items: updated,
          total: calcTotal(updated),
          itemCount: calcCount(updated),
          isOpen: true,
        })
        syncToServer(updated, set)
      },

      addService: (service, options = []) => {
        const items = get().items
        const updated = [
          ...items,
          {
            _id: `cart-${Date.now()}`,
            service,
            quantity: 1,
            price: service.basePrice,
            selectedOptions: options,
          },
        ]
        set({
          items: updated,
          total: calcTotal(updated),
          itemCount: calcCount(updated),
          isOpen: true,
        })
        syncToServer(updated, set)
      },

      removeItem: (itemId) => {
        const updated = get().items.filter((i) => i._id !== itemId)
        set({
          items: updated,
          total: calcTotal(updated),
          itemCount: calcCount(updated),
        })
        syncToServer(updated, set)
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        const updated = get().items.map((i) =>
          i._id === itemId ? { ...i, quantity } : i,
        )
        set({
          items: updated,
          total: calcTotal(updated),
          itemCount: calcCount(updated),
        })
        syncToServer(updated, set)
      },

      clear: () => {
        set({ items: [], total: 0, itemCount: 0 })
        if (isAuthed()) cartService.clear().catch(() => {})
      },

      /** Applique des lignes (issues du serveur) sans re-synchroniser. */
      setItems: (items) =>
        set({
          items,
          total: calcTotal(items),
          itemCount: calcCount(items),
        }),

      /** Recharge le panier depuis le backend (appelé après connexion/au montage). */
      hydrateFromServer: async () => {
        if (!isAuthed()) return
        try {
          const serverItems = await cartService.get()
          set({
            items: serverItems,
            total: calcTotal(serverItems),
            itemCount: calcCount(serverItems),
          })
        } catch {
          /* on garde l'état local si le serveur est injoignable */
        }
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'lunaria-cart',
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      }),
    },
  ),
)
