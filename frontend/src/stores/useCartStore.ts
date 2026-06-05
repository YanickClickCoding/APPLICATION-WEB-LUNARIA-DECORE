import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, DecorationService } from '@/types'

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
  openCart: () => void
  closeCart: () => void
}

const calcTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

const calcCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0)

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,
      itemCount: 0,

      addProduct: (product, quantity = 1) => {
        const items = get().items

        // Clé stable (frontend: Product a _id)
        const incomingId = product?._id ?? (product as any)?.id
        const existing = incomingId ? items.find((i) => i.product?._id === incomingId) : undefined

        let updated: CartItem[]
        if (existing) {
          updated = items.map((i) => (i.product?._id === incomingId ? { ...i, quantity: i.quantity + quantity } : i))
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

        // MàJ état
        set({
          items: updated,
          total: calcTotal(updated),
          itemCount: calcCount(updated),
          isOpen: true,
        })
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
        set({ items: updated, total: calcTotal(updated), itemCount: calcCount(updated), isOpen: true })
      },

      removeItem: (itemId) => {
        const updated = get().items.filter((i) => i._id !== itemId)
        set({ items: updated, total: calcTotal(updated), itemCount: calcCount(updated) })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        const updated = get().items.map((i) => (i._id === itemId ? { ...i, quantity } : i))
        set({ items: updated, total: calcTotal(updated), itemCount: calcCount(updated) })
      },

      clear: () => set({ items: [], total: 0, itemCount: 0 }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'lunaria-cart',
      partialize: (state) => ({ items: state.items, total: state.total, itemCount: state.itemCount }),
    }
  )
)
