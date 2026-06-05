import api from './api'
import type { Product, PaginatedResponse } from '@/types'

export const productsService = {
  getAll: (params?: { category?: string; page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<Product>>('/products', { params }),

  getById: (id: string) => api.get<Product>(`/products/${id}`),

  getBySlug: (slug: string) => api.get<Product>(`/products/slug/${slug}`),

  getFeatured: () => api.get<Product[]>('/products/featured'),

  create: (data: FormData) =>
    api.post<Product>('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  update: (id: string, data: FormData) =>
    api.patch<Product>(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // Création / mise à jour en JSON (incluant le tableau d'images en URLs)
  createJson: (data: Record<string, unknown>) => api.post<Product>('/products', data),
  updateJson: (id: string, data: Record<string, unknown>) => api.patch<Product>(`/products/${id}`, data),

  delete: (id: string) => api.delete(`/products/${id}`),
}
