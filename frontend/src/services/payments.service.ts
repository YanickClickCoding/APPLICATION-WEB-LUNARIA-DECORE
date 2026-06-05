import api from './api'
import type { Payment } from '@/types'

export const paymentsService = {
  initiateMtnMomo: (data: { orderId?: string; planningId?: string; phone: string; amount: number; type: string }) =>
    api.post<{ paymentId: string; message: string }>('/payments/mtn-momo/initiate', data),

  initiateMovMoney: (data: { orderId?: string; planningId?: string; phone: string; amount: number; type: string }) =>
    api.post<{ paymentId: string; message: string }>('/payments/moov/initiate', data),

  getStatus: (paymentId: string) =>
    api.get<Payment>(`/payments/${paymentId}`),

  getHistory: () => api.get<Payment[]>('/payments'),
}
