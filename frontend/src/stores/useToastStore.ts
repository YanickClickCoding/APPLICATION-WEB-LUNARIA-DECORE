import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastState {
  toasts: Toast[]
  show: (toast: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  show: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const duration = toast.duration ?? 4000
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    if (duration > 0) {
      setTimeout(() => get().remove(id), duration)
    }
  },

  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  success: (title, message) => get().show({ type: 'success', title, message }),
  error:   (title, message) => get().show({ type: 'error', title, message }),
  info:    (title, message) => get().show({ type: 'info', title, message }),
  warning: (title, message) => get().show({ type: 'warning', title, message }),
}))
