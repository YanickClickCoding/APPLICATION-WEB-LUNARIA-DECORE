import api from './api'
import type { Order, PaginatedResponse } from '@/types'

export const ordersService = {
  create: (data: {
    deliveryAddress: object
    deliveryType: string
    promoCode?: string
    notes?: string
  }) => api.post<Order>('/orders', data),

  getMyOrders: (params?: { page?: number; status?: string }) =>
    api.get<PaginatedResponse<Order>>('/orders', { params }),

  getById: (id: string) => api.get<Order>(`/orders/${id}`),

  cancel: (id: string) => api.post(`/orders/${id}/cancel`),

  // Admin
  getAllOrders: (params?: object) =>
    api.get<PaginatedResponse<Order>>('/orders/admin/all', { params }),

  updateStatus: (id: string, status: string, note?: string) =>
    api.patch(`/orders/${id}/status`, { status, note }),
}
