import api from './api'
import type { CartItem, Product, DecorationService } from '@/types'

/** Forme d'une ligne envoyée au backend (références légères). */
export interface CartItemPayload {
  product?: string
  service?: string
  quantity: number
  selectedOptions?: string[]
}

/** Cart renvoyé par le backend (items peuplés). */
interface ServerCart {
  _id: string
  items: {
    _id?: string
    product?: Product | null
    service?: DecorationService | null
    quantity: number
    selectedOptions?: string[]
  }[]
}

/** Transforme un CartItem du store en payload backend. */
export const toPayload = (items: CartItem[]): CartItemPayload[] =>
  items
    .map((i) => ({
      product: i.product?._id,
      service: i.service?._id,
      quantity: i.quantity,
      selectedOptions: i.selectedOptions,
    }))
    .filter((i) => i.product || i.service)

/** Transforme un Cart serveur en CartItem[] du store. */
export const fromServer = (cart: ServerCart): CartItem[] =>
  (cart?.items ?? [])
    .filter((it) => it.product || it.service)
    .map((it) => ({
      _id: it._id ?? `cart-${it.product?._id ?? it.service?._id}`,
      product: it.product ?? undefined,
      service: it.service ?? undefined,
      quantity: it.quantity,
      price: it.product?.price ?? it.service?.basePrice ?? 0,
      selectedOptions: it.selectedOptions,
    }))

export const cartService = {
  get: () => api.get<ServerCart>('/cart').then((r) => fromServer(r.data)),

  set: (items: CartItem[]) =>
    api
      .put<ServerCart>('/cart', { items: toPayload(items) })
      .then((r) => fromServer(r.data)),

  merge: (items: CartItem[]) =>
    api
      .post<ServerCart>('/cart/merge', { items: toPayload(items) })
      .then((r) => fromServer(r.data)),

  clear: () => api.delete<ServerCart>('/cart').then((r) => fromServer(r.data)),
}
