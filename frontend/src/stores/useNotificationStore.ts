import { create } from 'zustand'
import type { Notification } from '@/types'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  add: (notification: Notification) => void
  markAllRead: () => void
  markRead: (id: string) => void
  setNotifications: (notifications: Notification[]) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter((n) => !n.isRead).length }),

  add: (notification) => {
    const notifications = [notification, ...get().notifications]
    set({ notifications, unreadCount: notifications.filter((n) => !n.isRead).length })
  },

  markRead: (id) => {
    const notifications = get().notifications.map((n) =>
      n._id === id ? { ...n, isRead: true } : n
    )
    set({ notifications, unreadCount: notifications.filter((n) => !n.isRead).length })
  },

  markAllRead: () => {
    const notifications = get().notifications.map((n) => ({ ...n, isRead: true }))
    set({ notifications, unreadCount: 0 })
  },
}))
